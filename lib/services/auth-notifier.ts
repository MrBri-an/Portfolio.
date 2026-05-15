import { env } from "@/lib/env";
import { sendSmsOtp } from "@/lib/services/termii";
import type { VerificationChannel, VerificationPurpose } from "@/types/auth";

type ChallengePayload = {
  identifier: string;
  channel: VerificationChannel;
  purpose: VerificationPurpose;
  code: string;
  linkToken?: string;
};

function buildMessage(payload: ChallengePayload) {
  switch (payload.purpose) {
    case "PASSWORD_RESET":
      return `Your NestFind password reset code is ${payload.code}. This code expires in 15 minutes.`;
    case "LOGIN_2FA":
      return `Your NestFind 2FA code is ${payload.code}.`;
    default:
      return `Your NestFind verification code is ${payload.code}.`;
  }
}

export async function deliverAuthChallenge(payload: ChallengePayload) {
  const message = buildMessage(payload);

  if (payload.channel === "PHONE") {
    await sendSmsOtp(payload.identifier, message);
  } else {
    const resetLink = payload.linkToken
      ? `${env.appUrl}/reset-password?token=${payload.linkToken}`
      : "";

    console.info(
      `[NestFind email fallback] ${payload.identifier}: ${message} ${resetLink}`.trim(),
    );
  }
}
