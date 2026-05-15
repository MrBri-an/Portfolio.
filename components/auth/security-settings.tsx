"use client";

import { useState, useTransition } from "react";

import type { SessionUser } from "@/types/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type SecuritySettingsProps = {
  user: SessionUser;
};

export function SecuritySettings({ user }: SecuritySettingsProps) {
  const [enabled, setEnabled] = useState(user.isTwoFactorEnabled);
  const [channel, setChannel] = useState<"EMAIL" | "PHONE">(user.twoFactorChannel);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <Card className="rounded-[28px]">
      <CardHeader>
        <CardTitle>Security settings</CardTitle>
        <CardDescription>
          Manage 2FA, verified contact methods, and how NestFind protects your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant={enabled ? "default" : "secondary"}>
            {enabled ? "2FA enabled" : "2FA disabled"}
          </Badge>
          {user.emailVerifiedAt ? <Badge variant="outline">Email verified</Badge> : null}
          {user.phoneVerifiedAt ? <Badge variant="outline">Phone verified</Badge> : null}
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-border bg-muted/40 p-4">
          <div className="space-y-1">
            <Label htmlFor="two-factor-toggle">Two-factor authentication</Label>
            <p className="text-sm text-muted-foreground">
              Require a fresh OTP after your password during sign-in.
            </p>
          </div>
          <Switch
            id="two-factor-toggle"
            checked={enabled}
            onCheckedChange={setEnabled}
            disabled={isPending}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {(["EMAIL", "PHONE"] as const).map((value) => (
            <button
              key={value}
              type="button"
              className={`rounded-2xl border px-4 py-4 text-left transition ${
                channel === value
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background"
              }`}
              onClick={() => setChannel(value)}
            >
              <p className="font-medium">{value === "EMAIL" ? "Email" : "Phone"}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {value === "EMAIL"
                  ? "Use your verified email for login confirmations."
                  : "Use your verified phone for SMS 2FA codes."}
              </p>
            </button>
          ))}
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

        <Button
          type="button"
          className="rounded-2xl"
          disabled={isPending}
          onClick={() => {
            setError(null);
            setMessage(null);
            startTransition(async () => {
              const response = await fetch("/api/auth/two-factor", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  enabled,
                  channel,
                }),
              });

              const data = (await response.json()) as { message?: string };

              if (!response.ok) {
                setError(data.message || "Unable to update 2FA settings.");
                return;
              }

              setMessage(data.message || "Security settings updated.");
            });
          }}
        >
          {isPending ? "Saving..." : "Save security preferences"}
        </Button>
      </CardContent>
    </Card>
  );
}
