export function sanitizeText(value: string) {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/[<>]/g, "")
    .trim();
}

export function normalizeEmail(value?: string | null) {
  if (!value) {
    return null;
  }

  return sanitizeText(value).toLowerCase();
}

export function normalizePhone(value?: string | null) {
  if (!value) {
    return null;
  }

  const normalized = value.replace(/[^\d+]/g, "");
  return normalized.startsWith("+") ? normalized : `+${normalized}`;
}

export function normalizeIdentifier(value: string) {
  return value.includes("@")
    ? normalizeEmail(value) || value.toLowerCase()
    : normalizePhone(value) || value;
}
