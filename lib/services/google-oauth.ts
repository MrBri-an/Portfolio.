import { env } from "@/lib/env";
import { generateOpaqueToken } from "@/lib/security/otp";

export const GOOGLE_STATE_COOKIE = "nestfind_google_state";

export function createGoogleAuthorizationUrl() {
  const state = generateOpaqueToken(16);
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");

  url.searchParams.set("client_id", env.googleClientId);
  url.searchParams.set("redirect_uri", env.googleRedirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", state);
  url.searchParams.set("prompt", "select_account");
  url.searchParams.set("access_type", "online");

  return {
    state,
    url: url.toString(),
  };
}

export async function exchangeGoogleCode(code: string) {
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: env.googleClientId,
      client_secret: env.googleClientSecret,
      redirect_uri: env.googleRedirectUri,
      grant_type: "authorization_code",
    }),
    cache: "no-store",
  });

  if (!tokenResponse.ok) {
    throw new Error("Failed to exchange Google authorization code.");
  }

  const tokens = (await tokenResponse.json()) as {
    access_token: string;
  };

  const profileResponse = await fetch(
    "https://openidconnect.googleapis.com/v1/userinfo",
    {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
      cache: "no-store",
    },
  );

  if (!profileResponse.ok) {
    throw new Error("Failed to fetch Google profile.");
  }

  return (await profileResponse.json()) as {
    sub: string;
    email: string;
    email_verified: boolean;
    name: string;
    picture?: string;
  };
}
