import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { env } from "@/lib/env";

const maxAge = 60 * 60 * 24 * 7;

export function attachSessionCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: env.authCookieName,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: env.isProduction,
    path: "/",
    maxAge,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: env.authCookieName,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: env.isProduction,
    path: "/",
    expires: new Date(0),
  });
}

export async function getSessionCookie() {
  const cookieStore = await cookies();
  return cookieStore.get(env.authCookieName)?.value ?? null;
}
