import { NextRequest, NextResponse } from "next/server";

import { getSessionCookie } from "@/lib/security/session";
import { clearSessionCookie } from "@/lib/security/session";
import { verifySessionToken } from "@/lib/security/jwt";
import { authRepository } from "@/lib/db/auth-repository";
import { optionsResponse, rejectDisallowedOrigin } from "@/lib/server/api";

export function OPTIONS(request: NextRequest) {
  return optionsResponse(request);
}

export async function POST(request: NextRequest) {
  const blocked = rejectDisallowedOrigin(request);
  if (blocked) return blocked;

  const cookie = await getSessionCookie();

  if (cookie) {
    try {
      const payload = await verifySessionToken(cookie);
      await authRepository.revokeSession(payload.jti);
    } catch {
      // Ignore invalid cookies and still clear the browser session.
    }
  }

  const response = NextResponse.json({ message: "Logged out." });
  clearSessionCookie(response);
  return response;
}
