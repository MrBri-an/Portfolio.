import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { env } from "@/lib/env";
import { createGoogleAuthorizationUrl, GOOGLE_STATE_COOKIE } from "@/lib/services/google-oauth";
import { optionsResponse } from "@/lib/server/api";

export function OPTIONS(request: NextRequest) {
  return optionsResponse(request);
}

export async function GET(request: NextRequest) {
  if (!env.googleClientId || !env.googleClientSecret) {
    return NextResponse.redirect(new URL("/login?error=google-unavailable", request.url));
  }

  const { state, url } = createGoogleAuthorizationUrl();
  const cookieStore = await cookies();

  cookieStore.set({
    name: GOOGLE_STATE_COOKIE,
    value: state,
    httpOnly: true,
    secure: env.isProduction,
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });

  return NextResponse.redirect(url);
}
