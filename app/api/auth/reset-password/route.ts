import { NextRequest } from "next/server";

import { authRepository } from "@/lib/db/auth-repository";
import { hashPassword } from "@/lib/security/password";
import { applyRateLimit } from "@/lib/security/rate-limit";
import { jsonResponse, optionsResponse, rejectDisallowedOrigin } from "@/lib/server/api";
import { resetPasswordSchema } from "@/lib/validations/auth";

export function OPTIONS(request: NextRequest) {
  return optionsResponse(request);
}

export async function POST(request: NextRequest) {
  const blocked = rejectDisallowedOrigin(request);
  if (blocked) return blocked;

  const limit = await applyRateLimit(request, {
    bucket: "auth-reset-password",
    limit: 8,
    windowMs: 15 * 60_000,
  });

  if (!limit.success) {
    return jsonResponse(
      request,
      { message: "Too many reset attempts. Please wait and try again." },
      { status: 429, headers: limit.headers },
    );
  }

  const body = await request.json();
  const parsed = resetPasswordSchema.safeParse(body);

  if (!parsed.success) {
    return jsonResponse(
      request,
      { message: parsed.error.issues[0]?.message || "Invalid password reset payload." },
      { status: 400, headers: limit.headers },
    );
  }

  const resetToken = await authRepository.consumeResetToken(parsed.data.token);

  if (!resetToken) {
    return jsonResponse(
      request,
      { message: "This password reset link is invalid or has expired." },
      { status: 400, headers: limit.headers },
    );
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const user = await authRepository.updatePassword(resetToken.userId, passwordHash);

  if (!user) {
    return jsonResponse(
      request,
      { message: "Unable to update your password." },
      { status: 500, headers: limit.headers },
    );
  }

  return jsonResponse(
    request,
    { message: "Password reset successful. You can sign in with your new password now." },
    { headers: limit.headers },
  );
}
