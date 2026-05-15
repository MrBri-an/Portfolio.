"use server";

import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

import { authRepository } from "@/lib/db/auth-repository";
import { getSessionCookie } from "@/lib/security/session";
import { verifySessionToken } from "@/lib/security/jwt";

export async function logoutAction() {
  const cookie = await getSessionCookie();

  if (cookie) {
    try {
      const payload = await verifySessionToken(cookie);
      await authRepository.revokeSession(payload.jti);
    } catch {
      // Ignore invalid sessions and still redirect.
    }
  }

  redirect("/login");
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ message }, { status });
}
