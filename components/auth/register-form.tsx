"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";

import { getRecaptchaToken } from "@/lib/recaptcha-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        const captchaToken = await getRecaptchaToken("register");
        const payload = {
          fullName: String(formData.get("fullName") || ""),
          username: String(formData.get("username") || ""),
          email: String(formData.get("email") || ""),
          phone: String(formData.get("phone") || ""),
          password: String(formData.get("password") || ""),
          captchaToken,
        };

        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = (await response.json()) as {
          message?: string;
          identifier?: string;
          channel?: string;
          debug?: { code?: string };
        };

        if (!response.ok) {
          setError(data.message || "Unable to create your account.");
          return;
        }

        const params = new URLSearchParams({
          identifier: data.identifier || payload.email || payload.phone,
          purpose: "REGISTER",
        });

        if (data.debug?.code) {
          params.set("debugCode", data.debug.code);
        }

        setMessage(data.message || "Account created. Please verify the OTP.");
        router.push(`/verify?${params.toString()}`);
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
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" name="fullName" placeholder="Adaeze Okafor" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" name="username" placeholder="adaezespace" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone number</Label>
          <Input id="phone" name="phone" placeholder="+2348012345678" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input id="email" name="email" type="email" placeholder="you@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" placeholder="Create a strong password" required />
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
        In local development, OTP debug codes appear on the next screen when reCAPTCHA or delivery providers are not configured yet.
      </div>

      {error ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200">
          {message}
        </p>
      ) : null}

      <Button type="submit" className="h-11 w-full rounded-2xl" disabled={isPending}>
        {isPending ? "Creating account..." : "Create account"}
      </Button>

      <p className="text-sm text-muted-foreground">
        Already registered?{" "}
        <Link href="/login" className="font-medium text-primary">
          Sign in
        </Link>
      </p>
    </form>
  );
}
