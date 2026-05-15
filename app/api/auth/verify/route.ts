import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

import { authRepository } from "@/lib/db/auth-repository";
import { signSessionToken } from "@/lib/security/jwt";
import { applyRateLimit } from "@/lib/security/rate-limit";
import { attachSessionCookie } from "@/lib/security/session";
import { getRequestMeta, jsonResponse, optionsResponse, rejectDisallowedOrigin } from "@/lib/server/api";
import { verifyOtpSchema } from "@/lib/validations/auth";

export function OPTIONS(request: NextRequest) {
  return optionsResponse(request);
}

export async function POST(request: NextRequest) {
  const blocked = rejectDisallowedOrigin(request);
  if (blocked) return blocked;

  const limit = await applyRateLimit(request, {
    bucket: "auth-verify",
    limit: 12,
    windowMs: 10 * 60_000,
  });

  if (!limit.success) {
    return jsonResponse(
      request,
      { message: "Too many verification attempts. Please wait and try again." },
      { status: 429, headers: limit.headers },
    );
  }

  const body = await request.json();
  const parsed = verifyOtpSchema.safeParse(body);

  if (!parsed.success) {
    return jsonResponse(
      request,
      { message: parsed.error.issues[0]?.message || "Invalid verification request." },
      { status: 400, headers: limit.headers },
    );
  }

  const token = await authRepository.consumeVerificationCode({
    identifier: parsed.data.identifier,
    purpose: parsed.data.purpose,
    code: parsed.data.code,
  });

  if (!token) {
    return jsonResponse(
      request,
      { message: "The verification code is invalid or expired." },
      { status: 400, headers: limit.headers },
    );
  }

  const user = await authRepository.markUserAsVerified(token.userId, token.channel);

  if (!user) {
    return jsonResponse(
      request,
      { message: "Unable to verify this account." },
      { status: 404, headers: limit.headers },
    );
  }

  const sessionId = randomUUID();
  const session = await authRepository.createSession({
    userId: user.id,
    jti: sessionId,
    ...getRequestMeta(request),
  });

  if (!session) {
    return jsonResponse(
      request,
      { message: "Unable to start a session after verification." },
      { status: 500, headers: limit.headers },
    );
  }

  const tokenValue = await signSessionToken({
    sub: user.id,
    profileId: user.profileId,
    jti: sessionId,
    twoFactorPassed: true,
  });

  const response = NextResponse.json(
    { message: "Verification successful.", user: session },
    { headers: limit.headers },
  );

  attachSessionCookie(response, tokenValue);
  return response;
}
