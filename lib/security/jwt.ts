import { SignJWT, jwtVerify } from "jose";

import { env } from "@/lib/env";
import type { SessionPayload } from "@/types/auth";

const encoder = new TextEncoder();

export async function signSessionToken(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encoder.encode(env.jwtSecret));
}

export async function verifySessionToken(token: string) {
  const result = await jwtVerify<SessionPayload>(
    token,
    encoder.encode(env.jwtSecret),
  );

  return result.payload;
}
