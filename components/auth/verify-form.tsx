"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type VerifyFormProps = {
  identifier: string;
  purpose: "REGISTER" | "LOGIN_2FA";
  debugCode?: string;
};

export function VerifyForm({ identifier, purpose, debugCode }: VerifyFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const message = debugCode ? `Development OTP: ${debugCode}` : null;
  const hasIdentifier = Boolean(identifier.trim());

  const title = useMemo(
    () => (purpose === "REGISTER" ? "Verify your account" : "Verify your login"),
    [purpose],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier,
          code: String(formData.get("code") || ""),
          purpose,
        }),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        setError(data.message || "Unable to verify your code.");
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    });
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="identifier">Destination</Label>
        <Input
          id="identifier"
          value={hasIdentifier ? identifier : "Verification destination unavailable"}
          readOnly
        />
        {!hasIdentifier ? (
          <p className="text-sm text-muted-foreground">
            Refresh the flow from registration or sign-in so we can attach the email or phone
            destination correctly.
          </p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="code">{title}</Label>
        <Input id="code" name="code" placeholder="123456" inputMode="numeric" required />
      </div>

      {message ? (
        <p className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-200">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200">
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        className="h-11 w-full rounded-2xl"
        disabled={isPending || !hasIdentifier}
      >
        {isPending ? "Verifying..." : "Verify code"}
      </Button>
    </form>
  );
}
