import { NextRequest } from "next/server";

import { authRepository } from "@/lib/db/auth-repository";
import { env } from "@/lib/env";
import { applyRateLimit } from "@/lib/security/rate-limit";
import { verifyRecaptchaToken } from "@/lib/security/recaptcha";
import { deliverAuthChallenge } from "@/lib/services/auth-notifier";
import { jsonResponse, optionsResponse, rejectDisallowedOrigin } from "@/lib/server/api";
import { forgotPasswordSchema } from "@/lib/validations/auth";

export function OPTIONS(request: NextRequest) {
  return optionsResponse(request);
}

export async function POST(request: NextRequest) {
  const blocked = rejectDisallowedOrigin(request);
  if (blocked) return blocked;

  const limit = await applyRateLimit(request, {
    bucket: "auth-request-reset",
    limit: 6,
    windowMs: 15 * 60_000,
  });

  if (!limit.success) {
    return jsonResponse(
      request,
      { message: "Too many reset requests. Please wait and try again." },
      { status: 429, headers: limit.headers },
    );
  }

  const body = await request.json();
  const parsed = forgotPasswordSchema.safeParse(body);

  if (!parsed.success) {
    return jsonResponse(
      request,
      { message: parsed.error.issues[0]?.message || "Invalid password reset request." },
      { status: 400, headers: limit.headers },
    );
  }

  const recaptcha = await verifyRecaptchaToken(
    parsed.data.captchaToken,
    "password_reset_request",
  );
  if (!recaptcha.success) {
    return jsonResponse(
      request,
      { message: recaptcha.message },
      { status: 400, headers: limit.headers },
    );
  }

  const user = await authRepository.findUserRecordByIdentifier(parsed.data.identifier);

  if (!user) {
    return jsonResponse(
      request,
      { message: "If an account exists, a reset link has been sent." },
      { headers: limit.headers },
    );
  }

  const destination = authRepository.getPrimaryIdentifier(user);
  const channel = user.phone ? "PHONE" : "EMAIL";
  const challenge = await authRepository.createVerificationChallenge({
    userId: user.id,
    identifier: destination,
    channel,
    purpose: "PASSWORD_RESET",
  });

  await deliverAuthChallenge({
    identifier: destination,
    channel,
    purpose: "PASSWORD_RESET",
    code: challenge.code,
    linkToken: challenge.linkToken,
  });

  return jsonResponse(
    request,
    {
      message: "If an account exists, a reset link has been sent.",
      debug:
        env.allowDevAuthBypass && !env.isProduction
          ? {
              code: challenge.code,
              resetLink: `${env.appUrl}/reset-password?token=${challenge.linkToken}`,
            }
          : undefined,
    },
    { headers: limit.headers },
  );
}
