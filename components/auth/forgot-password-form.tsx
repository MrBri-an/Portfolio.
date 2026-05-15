"use client";

import Link from "next/link";
import { FormEvent, useState, useTransition } from "react";

import { getRecaptchaToken } from "@/lib/recaptcha-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resetLink, setResetLink] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setResetLink(null);

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        const captchaToken = await getRecaptchaToken("password_reset_request");
        const response = await fetch("/api/auth/request-reset", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            identifier: String(formData.get("identifier") || ""),
            captchaToken,
          }),
        });

        const data = (await response.json()) as {
          message?: string;
          debug?: { resetLink?: string };
        };

        if (!response.ok) {
          setError(data.message || "Unable to request a password reset.");
          return;
        }

        setMessage(data.message || "If an account exists, a reset link has been sent.");
        setResetLink(data.debug?.resetLink || null);
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "Something went wrong. Please try again.",
        );
      }
    });
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="identifier">Email or phone number</Label>
        <Input id="identifier" name="identifier" placeholder="you@example.com or +2348012345678" required />
      </div>

      {error ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200">
          {error}
        </p>
      ) : null}
      {message ? (
        <div className="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200">
          <p>{message}</p>
          {resetLink ? (
            <Link href={resetLink} className="font-medium underline">
              Open development reset link
            </Link>
          ) : null}
        </div>
      ) : null}

      <Button type="submit" className="h-11 w-full rounded-2xl" disabled={isPending}>
        {isPending ? "Sending..." : "Send reset link"}
      </Button>

      <p className="text-sm text-muted-foreground">
        Remembered your password?{" "}
        <Link href="/login" className="font-medium text-primary">
          Go back to login
        </Link>
      </p>
    </form>
  );
}
