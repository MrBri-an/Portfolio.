import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { authRepository } from "@/lib/db/auth-repository";
import { env } from "@/lib/env";
import { signSessionToken } from "@/lib/security/jwt";
import { attachSessionCookie } from "@/lib/security/session";
import { exchangeGoogleCode, GOOGLE_STATE_COOKIE } from "@/lib/services/google-oauth";
import { getRequestMeta } from "@/lib/server/api";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieStore = await cookies();
  const storedState = cookieStore.get(GOOGLE_STATE_COOKIE)?.value;

  if (!code || !state || !storedState || state !== storedState) {
    return NextResponse.redirect(new URL("/login?error=google-state", request.url));
  }

  try {
    const profile = await exchangeGoogleCode(code);

    if (!profile.email || !profile.email_verified) {
      return NextResponse.redirect(new URL("/login?error=google-email", request.url));
    }

    const user = await authRepository.upsertGoogleUser({
      email: profile.email,
      fullName: profile.name,
      imageUrl: profile.picture || null,
      googleId: profile.sub,
    });

    const sessionId = randomUUID();
    await authRepository.createSession({
      userId: user.id,
      jti: sessionId,
      ...getRequestMeta(request),
    });

    const token = await signSessionToken({
      sub: user.id,
      profileId: user.profileId,
      jti: sessionId,
      twoFactorPassed: true,
    });

    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    attachSessionCookie(response, token);
    response.cookies.set({
      name: GOOGLE_STATE_COOKIE,
      value: "",
      httpOnly: true,
      secure: env.isProduction,
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
    });

    return response;
  } catch {
    return NextResponse.redirect(new URL("/login?error=google-failed", request.url));
  }
}
