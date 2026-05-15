import { env } from "@/lib/env";

export async function sendSmsOtp(phone: string, message: string) {
  if (!env.termiiApiKey) {
    console.info(`[NestFind SMS fallback] ${phone}: ${message}`);
    return {
      delivered: false,
      provider: "console",
    };
  }

  const response = await fetch("https://api.ng.termii.com/api/sms/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key: env.termiiApiKey,
      to: phone,
      from: env.termiiSenderId,
      sms: message,
      type: "plain",
      channel: "generic",
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to deliver OTP via Termii.");
  }

  return {
    delivered: true,
    provider: "termii",
  };
}
