"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="rounded-full"
      onClick={() => {
        startTransition(async () => {
          await fetch("/api/auth/logout", {
            method: "POST",
          });
          router.replace("/login");
          router.refresh();
        });
      }}
      disabled={isPending}
    >
      {isPending ? "Signing out..." : "Logout"}
    </Button>
  );
}
