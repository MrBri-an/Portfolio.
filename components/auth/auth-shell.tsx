import type { ReactNode } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  asideTitle: string;
  asideText: string;
};

export function AuthShell({
  title,
  description,
  children,
  asideTitle,
  asideText,
}: AuthShellProps) {
  return (
    <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
      <Card className="overflow-hidden rounded-[32px] border-white/70 bg-slate-950 text-white shadow-2xl dark:border-slate-800">
        <CardContent className="flex h-full flex-col justify-between gap-8 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.35),_transparent_32%),linear-gradient(180deg,#0f172a,#020617)] p-8">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-200">
              NestFind security layer
            </p>
            <h2 className="font-[var(--font-jakarta)] text-4xl font-semibold leading-tight">
              {asideTitle}
            </h2>
            <p className="max-w-md text-base leading-7 text-slate-300">{asideText}</p>
          </div>
          <div className="grid gap-3 text-sm text-slate-200">
            {[
              "Argon2id password hashing",
              "HTTP-only JWT sessions",
              "OTP verification with Termii-ready SMS",
              "reCAPTCHA v3 on auth flows",
              "2FA toggle and session-aware security settings",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                {item}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[32px] border-white/70 bg-white/90 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <CardHeader className="space-y-3 p-8">
          <CardTitle className="font-[var(--font-jakarta)] text-3xl">{title}</CardTitle>
          <CardDescription className="text-base leading-7">{description}</CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-0">{children}</CardContent>
      </Card>
    </div>
  );
}
