"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";

import { getRecaptchaToken } from "@/lib/recaptcha-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
  const [twoFactorIdentifier, setTwoFactorIdentifier] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        const captchaToken = await getRecaptchaToken("login");
        const payload = {
          identifier: String(formData.get("identifier") || ""),
          password: String(formData.get("password") || ""),
          twoFactorCode: String(formData.get("twoFactorCode") || ""),
          twoFactorIdentifier: twoFactorIdentifier || undefined,
          captchaToken,
        };

        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = (await response.json()) as {
          message?: string;
          requiresTwoFactor?: boolean;
          debug?: { code?: string };
          twoFactorIdentifier?: string;
        };

        if (response.status === 202 && data.requiresTwoFactor) {
          setRequiresTwoFactor(true);
          setTwoFactorIdentifier(data.twoFactorIdentifier || payload.identifier);
          setMessage(
            data.debug?.code
              ? `2FA code generated. Development code: ${data.debug.code}`
              : data.message || "Enter the 2FA code we just sent.",
          );
          return;
        }

        if (!response.ok) {
          setError(data.message || "Unable to sign you in.");
          return;
        }

        router.replace("/dashboard");
        router.refresh();
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
        <Input
          id="identifier"
          name="identifier"
          placeholder="you@example.com or +2348012345678"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" placeholder="Enter your password" required />
      </div>
      {requiresTwoFactor ? (
        <div className="space-y-2">
          <Label htmlFor="twoFactorCode">Two-factor code</Label>
          <Input
            id="twoFactorCode"
            name="twoFactorCode"
            placeholder="123456"
            inputMode="numeric"
            required
          />
        </div>
      ) : null}

      {error ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-200">
          {message}
        </p>
      ) : null}

      <Button type="submit" className="h-11 w-full rounded-2xl" disabled={isPending}>
        {isPending ? "Signing in..." : requiresTwoFactor ? "Verify and continue" : "Sign in"}
      </Button>

      <Button
        type="button"
        variant="outline"
        className="h-11 w-full rounded-2xl"
        onClick={() => {
          window.location.href = "/api/auth/google";
        }}
      >
        Continue with Google
      </Button>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <Link href="/forgot-password" className="font-medium text-primary">
          Forgot password?
        </Link>
        <Link href="/register" className="font-medium text-primary">
          Create an account
        </Link>
      </div>
    </form>
  );
}
