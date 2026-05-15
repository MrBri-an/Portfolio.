"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

type StartChatButtonProps = {
  otherUserId: string;
  listingId?: string | null;
  label?: string;
  className?: string;
};

export function StartChatButton({
  otherUserId,
  listingId,
  label = "Chat",
  className,
}: StartChatButtonProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className={className}>
      <Button
        type="button"
        variant="outline"
        className="w-full rounded-full"
        disabled={isPending}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const response = await fetch("/api/chat/conversations", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ otherUserId, listingId }),
            });

            if (response.status === 401) {
              router.push("/login");
              return;
            }

            const data = (await response.json()) as { id?: string; message?: string };

            if (!response.ok || !data.id) {
              setError(data.message || "Unable to start chat.");
              return;
            }

            router.push(`/messages/${data.id}`);
          });
        }}
      >
        <MessageCircle className="mr-2 h-4 w-4" />
        {isPending ? "Opening..." : label}
      </Button>
      {error ? <p className="mt-2 text-xs text-rose-500">{error}</p> : null}
    </div>
  );
}
