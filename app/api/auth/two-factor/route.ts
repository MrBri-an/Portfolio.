import { NextRequest } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { authRepository } from "@/lib/db/auth-repository";
import { applyRateLimit } from "@/lib/security/rate-limit";
import { jsonResponse, optionsResponse, rejectDisallowedOrigin } from "@/lib/server/api";
import { toggleTwoFactorSchema } from "@/lib/validations/auth";

export function OPTIONS(request: NextRequest) {
  return optionsResponse(request);
}

export async function POST(request: NextRequest) {
  const blocked = rejectDisallowedOrigin(request);
  if (blocked) return blocked;

  const limit = await applyRateLimit(request, {
    bucket: "auth-two-factor",
    limit: 20,
    windowMs: 10 * 60_000,
  });

  if (!limit.success) {
    return jsonResponse(
      request,
      { message: "Too many security updates. Please wait and try again." },
      { status: 429, headers: limit.headers },
    );
  }

  const user = await getCurrentUser();

  if (!user) {
    return jsonResponse(
      request,
      { message: "You must be signed in to update security settings." },
      { status: 401, headers: limit.headers },
    );
  }

  const body = await request.json();
  const parsed = toggleTwoFactorSchema.safeParse(body);

  if (!parsed.success) {
    return jsonResponse(
      request,
      { message: parsed.error.issues[0]?.message || "Invalid 2FA settings." },
      { status: 400, headers: limit.headers },
    );
  }

  if (
    parsed.data.enabled &&
    ((parsed.data.channel === "EMAIL" && !user.emailVerifiedAt) ||
      (parsed.data.channel === "PHONE" && !user.phoneVerifiedAt))
  ) {
    return jsonResponse(
      request,
      { message: `Verify your ${parsed.data.channel.toLowerCase()} before using it for 2FA.` },
      { status: 400, headers: limit.headers },
    );
  }

  const updatedUser = await authRepository.setTwoFactor(
    user.id,
    parsed.data.enabled,
    parsed.data.channel,
  );

  if (!updatedUser) {
    return jsonResponse(
      request,
      { message: "Unable to update your 2FA preferences." },
      { status: 500, headers: limit.headers },
    );
  }

  return jsonResponse(
    request,
    {
      message: parsed.data.enabled
        ? "Two-factor authentication has been enabled."
        : "Two-factor authentication has been disabled.",
      user: updatedUser,
    },
    { headers: limit.headers },
  );
}
