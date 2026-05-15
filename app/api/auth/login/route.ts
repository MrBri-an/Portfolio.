import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

import { authRepository } from "@/lib/db/auth-repository";
import { env } from "@/lib/env";
import { signSessionToken } from "@/lib/security/jwt";
import { verifyPassword } from "@/lib/security/password";
import { applyRateLimit } from "@/lib/security/rate-limit";
import { attachSessionCookie } from "@/lib/security/session";
import { verifyRecaptchaToken } from "@/lib/security/recaptcha";
import { deliverAuthChallenge } from "@/lib/services/auth-notifier";
import { getRequestMeta, jsonResponse, optionsResponse, rejectDisallowedOrigin } from "@/lib/server/api";
import { loginSchema } from "@/lib/validations/auth";

export function OPTIONS(request: NextRequest) {
  return optionsResponse(request);
}

export async function POST(request: NextRequest) {
  const blocked = rejectDisallowedOrigin(request);
  if (blocked) return blocked;

  const limit = await applyRateLimit(request, {
    bucket: "auth-login",
    limit: 12,
    windowMs: 10 * 60_000,
  });

  if (!limit.success) {
    return jsonResponse(
      request,
      { message: "Too many login attempts. Please wait and try again." },
      { status: 429, headers: limit.headers },
    );
  }

  const body = await request.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return jsonResponse(
      request,
      { message: parsed.error.issues[0]?.message || "Invalid login request." },
      { status: 400, headers: limit.headers },
    );
  }

  const recaptcha = await verifyRecaptchaToken(parsed.data.captchaToken, "login");
  if (!recaptcha.success) {
    return jsonResponse(
      request,
      { message: recaptcha.message },
      { status: 400, headers: limit.headers },
    );
  }

  const user = await authRepository.findUserRecordByIdentifier(parsed.data.identifier);

  if (!user || !user.passwordHash) {
    return jsonResponse(
      request,
      { message: "Invalid email, phone number, or password." },
      { status: 401, headers: limit.headers },
    );
  }

  const passwordMatches = await verifyPassword(user.passwordHash, parsed.data.password);

  if (!passwordMatches) {
    return jsonResponse(
      request,
      { message: "Invalid email, phone number, or password." },
      { status: 401, headers: limit.headers },
    );
  }

  if (!user.emailVerifiedAt && !user.phoneVerifiedAt) {
    return jsonResponse(
      request,
      { message: "Verify your email or phone number before signing in." },
      { status: 403, headers: limit.headers },
    );
  }

  if (user.isTwoFactorEnabled) {
    const destination =
      parsed.data.twoFactorIdentifier ||
      (user.twoFactorChannel === "PHONE" ? user.phone : user.email);

    if (!destination) {
      return jsonResponse(
        request,
        { message: "No verified channel is available for 2FA." },
        { status: 400, headers: limit.headers },
      );
    }

    if (!parsed.data.twoFactorCode) {
      const challenge = await authRepository.createVerificationChallenge({
        userId: user.id,
        identifier: destination,
        channel: user.twoFactorChannel,
        purpose: "LOGIN_2FA",
      });

      await deliverAuthChallenge({
        identifier: destination,
        channel: user.twoFactorChannel,
        purpose: "LOGIN_2FA",
        code: challenge.code,
      });

      return jsonResponse(
        request,
        {
          message: "Enter the 2FA code we just sent.",
          requiresTwoFactor: true,
          twoFactorIdentifier: destination,
          debug:
            env.allowDevAuthBypass && !env.isProduction
              ? { code: challenge.code }
              : undefined,
        },
        { status: 202, headers: limit.headers },
      );
    }

    const verified = await authRepository.consumeVerificationCode({
      identifier: destination,
      purpose: "LOGIN_2FA",
      code: parsed.data.twoFactorCode,
    });

    if (!verified) {
      return jsonResponse(
        request,
        { message: "The 2FA code is invalid or expired." },
        { status: 400, headers: limit.headers },
      );
    }
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
      { message: "Unable to start your session." },
      { status: 500, headers: limit.headers },
    );
  }

  const token = await signSessionToken({
    sub: user.id,
    profileId: user.profileId,
    jti: sessionId,
    twoFactorPassed: true,
  });

  const response = NextResponse.json(
    { message: "Login successful.", user: session },
    { headers: limit.headers },
  );

  attachSessionCookie(response, token);
  return response;
}
