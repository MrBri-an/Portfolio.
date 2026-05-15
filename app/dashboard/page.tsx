import Link from "next/link";
import { ArrowRight, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";

import { requireUser } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const user = await requireUser();

  const summaryCards = [
    { label: "Total listings", value: "0" },
    { label: "Saved homes", value: "0" },
    { label: "Unread chats", value: "0" },
    { label: "Security score", value: user.isTwoFactorEnabled ? "96%" : "78%" },
  ];

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <section className="flex flex-col gap-4 rounded-[32px] border border-white/70 bg-white/85 p-8 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="flex flex-wrap items-center gap-3">
          <Badge className="rounded-full bg-primary/10 text-primary hover:bg-primary/10">
            Auth phase complete
          </Badge>
          <Badge variant="outline" className="rounded-full">
            {user.profileId}
          </Badge>
        </div>
        <div className="space-y-2">
          <h1 className="font-[var(--font-jakarta)] text-3xl font-semibold">
            Welcome, {user.fullName.split(" ")[0]}
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Your NestFind workspace is live. The discovery feed, listings, chat, and admin tools
            will build on top of this verified identity and session layer.
          </p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.label} className="rounded-[28px]">
            <CardContent className="space-y-2 p-6">
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <p className="font-[var(--font-jakarta)] text-3xl font-semibold">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-[28px]">
          <CardHeader>
            <CardTitle>What is working right now</CardTitle>
            <CardDescription>The first platform phase is focused on trust and access control.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm text-muted-foreground">
            {[
              {
                icon: ShieldCheck,
                title: "OTP verification",
                text: "Registration is verified through one-time codes, with Termii-ready SMS delivery for phone-first users.",
              },
              {
                icon: LockKeyhole,
                title: "Account recovery",
                text: "Password reset requests create 15-minute expiring links and stay protected behind reCAPTCHA checks.",
              },
              {
                icon: Sparkles,
                title: "Secure session layer",
                text: "JWT cookies are HTTP-only, and every sign-in can be hardened further with 2FA from security settings.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-border bg-muted/40 p-4">
                <div className="mb-3 flex items-center gap-3">
                  <item.icon className="h-5 w-5 text-primary" />
                  <p className="font-medium text-foreground">{item.title}</p>
                </div>
                <p>{item.text}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[28px]">
          <CardHeader>
            <CardTitle>Next milestone</CardTitle>
            <CardDescription>We’re now ready for profile and listing creation work.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-sm leading-7 text-muted-foreground">
              The next build phase will layer in editable profiles, privacy controls, and media-aware listing creation on top of this identity system.
            </p>
            <Button asChild className="w-full rounded-2xl">
              <Link href="/settings/security">
                Review security settings
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
