import Link from "next/link";
import { CheckCheck, MessageCircle } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatDate } from "@/lib/utils";
import type { ConversationSummary } from "@/types/marketplace";

type ChatInboxProps = {
  conversations: ConversationSummary[];
  activeConversationId?: string;
};

export function ChatInbox({ conversations, activeConversationId }: ChatInboxProps) {
  if (!conversations.length) {
    return (
      <Card className="rounded-[16px]">
        <CardContent className="flex min-h-72 flex-col items-center justify-center p-8 text-center">
          <MessageCircle className="mb-3 h-10 w-10 text-primary" />
          <p className="font-semibold">No chats yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Open a listing and start a conversation with the owner.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-3">
      {conversations.map((conversation) => {
        const initials = conversation.otherUser.fullName
          .split(" ")
          .slice(0, 2)
          .map((part) => part[0])
          .join("")
          .toUpperCase();

        return (
          <Link
            key={conversation.id}
            href={`/messages/${conversation.id}`}
            className={cn(
              "rounded-[16px] border border-border bg-card p-4 transition hover:border-primary",
              activeConversationId === conversation.id && "border-primary bg-primary/5",
            )}
          >
            <div className="flex gap-3">
              <Avatar>
                {conversation.otherUser.imageUrl ? (
                  <AvatarImage
                    src={conversation.otherUser.imageUrl}
                    alt={conversation.otherUser.fullName}
                  />
                ) : null}
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate font-semibold">{conversation.otherUser.fullName}</p>
                  {conversation.unreadCount ? (
                    <Badge className="rounded-full">{conversation.unreadCount}</Badge>
                  ) : (
                    <CheckCheck className="h-4 w-4 text-primary" />
                  )}
                </div>
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {conversation.lastMessage?.body ?? "No messages yet"}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  {conversation.listing ? <span>{conversation.listing.title}</span> : null}
                  <span>{formatDate(conversation.updatedAt)}</span>
                  {conversation.isBlocked ? <Badge variant="outline">Blocked</Badge> : null}
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
