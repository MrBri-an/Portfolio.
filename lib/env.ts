const appUrl =
  process.env.NEXT_PUBLIC_APP_URL?.trim() || "http://localhost:3000";

export const env = {
  appUrl,
  databaseUrl: process.env.DATABASE_URL?.trim() || "",
  jwtSecret:
    process.env.JWT_SECRET?.trim() || "dev-only-secret-change-this-now",
  authCookieName:
    process.env.AUTH_COOKIE_NAME?.trim() || "nestfind_session",
  recaptchaSiteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim() || "",
  recaptchaSecretKey: process.env.RECAPTCHA_SECRET_KEY?.trim() || "",
  allowDevAuthBypass:
    process.env.NEXT_PUBLIC_ALLOW_DEV_AUTH_BYPASS?.trim() !== "false",
  googleClientId: process.env.GOOGLE_CLIENT_ID?.trim() || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET?.trim() || "",
  googleRedirectUri:
    process.env.GOOGLE_REDIRECT_URI?.trim() ||
    `${appUrl}/api/auth/google/callback`,
  termiiApiKey: process.env.TERMII_API_KEY?.trim() || "",
  termiiSenderId: process.env.TERMII_SENDER_ID?.trim() || "NestFind",
  allowedOrigins: (process.env.ALLOWED_ORIGINS || appUrl)
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean),
  isProduction: process.env.NODE_ENV === "production",
};
