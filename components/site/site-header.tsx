import Link from "next/link";
import { Home, LayoutDashboard, MessageCircle, Shield } from "lucide-react";

import { getCurrentUser } from "@/lib/auth";
import { chatRepository } from "@/lib/db/chat-repository";
import { LogoutButton } from "@/components/site/logout-button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export async function SiteHeader() {
  const user = await getCurrentUser();
  const unreadCount = user ? await chatRepository.getUnreadCount(user.id) : 0;

  return (
    <header className="sticky top-0 z-30 border-b border-white/40 bg-white/75 backdrop-blur dark:border-slate-800 dark:bg-slate-950/75">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 font-[var(--font-jakarta)] text-lg font-semibold tracking-tight"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white shadow-glow">
            N
          </span>
          <span>NestFind</span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <>
              <Button asChild variant="ghost" size="sm" className="rounded-full">
                <Link href="/messages">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Messages
                  {unreadCount ? (
                    <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-[10px] text-white">
                      {unreadCount}
                    </span>
                  ) : null}
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm" className="rounded-full">
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm" className="rounded-full">
                <Link href="/settings/security">
                  <Shield className="mr-2 h-4 w-4" />
                  Security
                </Link>
              </Button>
              <div className="hidden items-center gap-3 rounded-full border border-border bg-background/80 px-3 py-1.5 sm:flex">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {user.fullName
                      .split(" ")
                      .map((part) => part.charAt(0))
                      .slice(0, 2)
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium leading-none">{user.fullName}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{user.profileId}</p>
                </div>
              </div>
              <LogoutButton />
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="rounded-full">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="rounded-full">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm" className="rounded-full">
                <Link href="/register">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
