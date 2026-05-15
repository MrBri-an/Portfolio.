import { redirect } from "next/navigation";

import { authRepository } from "@/lib/db/auth-repository";
import { getSessionCookie } from "@/lib/security/session";
import { verifySessionToken } from "@/lib/security/jwt";

export async function getCurrentUser() {
  const cookie = await getSessionCookie();

  if (!cookie) {
    return null;
  }

  try {
    const payload = await verifySessionToken(cookie);
    const session = await authRepository.findSession(payload.jti);

    if (!session) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}
