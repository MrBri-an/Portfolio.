declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

let scriptPromise: Promise<void> | null = null;

function loadRecaptchaScript(siteKey: string) {
  if (scriptPromise) {
    return scriptPromise;
  }

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      "script[data-recaptcha-script='true']",
    );

    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    script.dataset.recaptchaScript = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load reCAPTCHA."));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export async function getRecaptchaToken(action: string) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const allowBypass =
    process.env.NEXT_PUBLIC_ALLOW_DEV_AUTH_BYPASS?.trim() !== "false";

  if (!siteKey) {
    if (allowBypass) {
      return "dev-bypass";
    }

    throw new Error("reCAPTCHA site key is missing.");
  }

  await loadRecaptchaScript(siteKey);

  return new Promise<string>((resolve, reject) => {
    if (!window.grecaptcha) {
      reject(new Error("reCAPTCHA is not available yet."));
      return;
    }

    window.grecaptcha.ready(async () => {
      try {
        const token = await window.grecaptcha?.execute(siteKey, { action });

        if (!token) {
          reject(new Error("Unable to get a reCAPTCHA token."));
          return;
        }

        resolve(token);
      } catch (error) {
        reject(error);
      }
    });
  });
}
