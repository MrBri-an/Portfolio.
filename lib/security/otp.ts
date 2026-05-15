import { createHash, randomBytes } from "crypto";

export function generateOtpCode() {
  return `${Math.floor(100000 + Math.random() * 900000)}`;
}

export function generateOpaqueToken(size = 32) {
  return randomBytes(size).toString("hex");
}

export function hashValue(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function generateProfileId() {
  const suffix = randomBytes(4).toString("hex").toUpperCase();
  return `NF-${suffix}`;
}
