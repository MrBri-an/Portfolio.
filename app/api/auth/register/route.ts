import { NextRequest } from "next/server";

import { authRepository } from "@/lib/db/auth-repository";
import { env } from "@/lib/env";
import { hashPassword } from "@/lib/security/password";
import { applyRateLimit } from "@/lib/security/rate-limit";
import {
  normalizeEmail,
  normalizePhone,
  sanitizeText,
} from "@/lib/security/sanitize";
import { verifyRecaptchaToken } from "@/lib/security/recaptcha";
import { deliverAuthChallenge } from "@/lib/services/auth-notifier";
import { jsonResponse, optionsResponse, rejectDisallowedOrigin } from "@/lib/server/api";
import { registerSchema } from "@/lib/validations/auth";

export function OPTIONS(request: NextRequest) {
  return optionsResponse(request);
}

export async function POST(request: NextRequest) {
  const blocked = rejectDisallowedOrigin(request);
  if (blocked) return blocked;

  const limit = await applyRateLimit(request, {
    bucket: "auth-register",
    limit: 8,
    windowMs: 10 * 60_000,
  });

  if (!limit.success) {
    return jsonResponse(
      request,
      { message: "Too many registration attempts. Please wait and try again." },
      { status: 429, headers: limit.headers },
    );
  }

  const body = await request.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return jsonResponse(
      request,
      { message: parsed.error.issues[0]?.message || "Invalid registration payload." },
      { status: 400, headers: limit.headers },
    );
  }

  const recaptcha = await verifyRecaptchaToken(parsed.data.captchaToken, "register");
  if (!recaptcha.success) {
    return jsonResponse(
      request,
      { message: recaptcha.message },
      { status: 400, headers: limit.headers },
    );
  }

  const email = normalizeEmail(parsed.data.email);
  const phone = normalizePhone(parsed.data.phone);
  const isAvailable = await authRepository.verifyContactAvailability({ email, phone });

  if (!isAvailable) {
    return jsonResponse(
      request,
      { message: "An account with that email or phone number already exists." },
      { status: 409, headers: limit.headers },
    );
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const user = await authRepository.createUser({
    fullName: sanitizeText(parsed.data.fullName),
    username: parsed.data.username ? sanitizeText(parsed.data.username) : null,
    email,
    phone,
    passwordHash,
  });

  const identifier = phone ?? email ?? "";
  const channel = phone ? "PHONE" : "EMAIL";
  const challenge = await authRepository.createVerificationChallenge({
    userId: user.id,
    identifier,
    channel,
    purpose: "REGISTER",
  });

  await deliverAuthChallenge({
    identifier,
    channel,
    purpose: "REGISTER",
    code: challenge.code,
    linkToken: challenge.linkToken,
  });

  return jsonResponse(
    request,
    {
      message: "Account created. Enter the OTP to finish verification.",
      identifier,
      channel,
      debug:
        env.allowDevAuthBypass && !env.isProduction
          ? {
              code: challenge.code,
            }
          : undefined,
    },
    { headers: limit.headers },
  );
}
