import { env } from "@/lib/env";

type VerifyRecaptchaResult = {
  success: boolean;
  message?: string;
};

export async function verifyRecaptchaToken(
  token: string,
  expectedAction: string,
): Promise<VerifyRecaptchaResult> {
  if (!env.recaptchaSecretKey) {
    return env.allowDevAuthBypass && token === "dev-bypass"
      ? { success: true }
      : {
          success: false,
          message:
            "reCAPTCHA is not configured. Add the site and secret keys in .env.local.",
        };
  }

  const body = new URLSearchParams({
    secret: env.recaptchaSecretKey,
    response: token,
  });

  const response = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
      cache: "no-store",
    },
  );

  const data = (await response.json()) as {
    success: boolean;
    score?: number;
    action?: string;
  };

  if (!data.success || (data.score ?? 0) < 0.4) {
    return {
      success: false,
      message: "reCAPTCHA verification failed. Please try again.",
    };
  }

  if (data.action && data.action !== expectedAction) {
    return {
      success: false,
      message: "Invalid reCAPTCHA action.",
    };
  }

  return { success: true };
}
