"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Ban,
  Check,
  CheckCheck,
  FileUp,
  Flag,
  Mic,
  Send,
  Trash2,
} from "lucide-react";

import { CallControls } from "@/components/chat/call-controls";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn, formatDate } from "@/lib/utils";
import type { CallLogData, ChatMessage, ConversationDetail } from "@/types/marketplace";

type ChatThreadProps = {
  conversation: ConversationDetail;
  currentUserId: string;
};

type SendResponse = {
  message?: ChatMessage;
  error?: string;
};

function MessageStatus({ message }: { message: ChatMessage }) {
  if (message.seenAt) {
    return <CheckCheck className="h-3.5 w-3.5 text-primary" />;
  }

  if (message.deliveredAt) {
    return <CheckCheck className="h-3.5 w-3.5 text-muted-foreground" />;
  }

  return <Check className="h-3.5 w-3.5 text-muted-foreground" />;
}

export function ChatThread({ conversation, currentUserId }: ChatThreadProps) {
  const [messages, setMessages] = useState(conversation.messages);
  const [calls, setCalls] = useState(conversation.calls);
  const [body, setBody] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const initials = conversation.otherUser.fullName
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  useEffect(() => {
    void fetch(`/api/chat/conversations/${conversation.id}/read`, { method: "POST" });
  }, [conversation.id]);

  function sendMessage(kind: "TEXT" | "MEDIA" | "VOICE" = "TEXT") {
    setError(null);
    startTransition(async () => {
      const response = await fetch(`/api/chat/conversations/${conversation.id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          body: kind === "VOICE" ? "Voice note" : body,
          mediaUrl: mediaUrl || null,
          mediaMimeType: mediaUrl ? "application/octet-stream" : null,
          mediaName: mediaUrl ? "Attached media" : null,
          kind: mediaUrl ? "MEDIA" : kind,
        }),
      });
      const data = (await response.json()) as SendResponse & { message?: ChatMessage };

      if (!response.ok || !data.message) {
        setError(data.error || "Unable to send message.");
        return;
      }

      setMessages((current) => [...current, data.message as ChatMessage]);
      setBody("");
      setMediaUrl("");
    });
  }

  function deleteMessage(messageId: string, mode: "me" | "everyone") {
    setError(null);
    startTransition(async () => {
      const response = await fetch(`/api/chat/messages/${messageId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mode }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { message?: string };
        setError(data.message || "Unable to delete message.");
        return;
      }

      if (mode === "everyone") {
        setMessages((current) =>
          current.map((message) =>
            message.id === messageId
              ? { ...message, body: "This message was deleted.", deletedForEveryoneAt: new Date() }
              : message,
          ),
        );
      } else {
        setMessages((current) => current.filter((message) => message.id !== messageId));
      }
    });
  }

  function blockOrReport(action: "block" | "report") {
    setError(null);
    startTransition(async () => {
      const response = await fetch(`/api/chat/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: conversation.otherUser.id,
          reason:
            action === "report"
              ? "Reported from chat thread for moderation review."
              : "Blocked from chat thread.",
          listingId: conversation.listing?.id,
        }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { message?: string };
        setError(data.message || `Unable to ${action} user.`);
      }
    });
  }

  function upsertCall(call: CallLogData) {
    setCalls((current) => {
      const existing = current.find((entry) => entry.id === call.id);

      if (existing) {
        return current.map((entry) => (entry.id === call.id ? call : entry));
      }

      return [...current, call];
    });
  }

  return (
    <section className="flex min-h-[720px] flex-col rounded-[16px] border border-border bg-card">
      <header className="flex items-center justify-between gap-3 border-b border-border p-4">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar>
            {conversation.otherUser.imageUrl ? (
              <AvatarImage
                src={conversation.otherUser.imageUrl}
                alt={conversation.otherUser.fullName}
              />
            ) : null}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-semibold">{conversation.otherUser.fullName}</p>
            <p className="truncate text-xs text-muted-foreground">
              {conversation.listing?.title ?? "Direct conversation"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CallControls
            conversationId={conversation.id}
            otherUser={conversation.otherUser}
            isBlocked={conversation.isBlocked}
            onCallLogged={upsertCall}
          />
          <Button type="button" size="icon" variant="ghost" title="Report" onClick={() => blockOrReport("report")}>
            <Flag className="h-4 w-4" />
          </Button>
          <Button type="button" size="icon" variant="ghost" title="Block" onClick={() => blockOrReport("block")}>
            <Ban className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {calls.length ? (
          <div className="rounded-[16px] border border-border bg-muted/30 p-3">
            <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
              Call history
            </p>
            <div className="grid gap-2">
              {calls.slice(-4).map((call) => (
                <div
                  key={call.id}
                  className="flex items-center justify-between gap-3 rounded-xl bg-background px-3 py-2 text-sm"
                >
                  <span>
                    {call.direction === "outgoing" ? "Outgoing" : "Incoming"}{" "}
                    {call.type.toLowerCase()} call
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {call.status.toLowerCase()} · {formatDate(call.startedAt)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
        {messages.map((message) => {
          const isMine = message.senderId === currentUserId;

          return (
            <div
              key={message.id}
              className={cn("flex", isMine ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[78%] rounded-[16px] px-4 py-3 text-sm shadow-sm",
                  isMine ? "bg-primary text-white" : "bg-muted text-foreground",
                )}
              >
                {message.kind === "MEDIA" && message.mediaUrl ? (
                  <a
                    href={message.mediaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mb-2 inline-flex items-center gap-2 underline"
                  >
                    <FileUp className="h-4 w-4" />
                    {message.mediaName ?? "Open attachment"}
                  </a>
                ) : null}
                <p>{message.body}</p>
                <div
                  className={cn(
                    "mt-2 flex items-center justify-end gap-2 text-[11px]",
                    isMine ? "text-white/75" : "text-muted-foreground",
                  )}
                >
                  <span>{formatDate(message.createdAt)}</span>
                  {isMine ? <MessageStatus message={message} /> : null}
                  {isMine ? (
                    <>
                      <button type="button" title="Delete for me" onClick={() => deleteMessage(message.id, "me")}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      {message.canDeleteForEveryone ? (
                        <button
                          type="button"
                          title="Delete for everyone"
                          onClick={() => deleteMessage(message.id, "everyone")}
                        >
                          <Badge variant="secondary" className="rounded-full text-[10px]">
                            all
                          </Badge>
                        </button>
                      ) : null}
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <footer className="space-y-3 border-t border-border p-4">
        {conversation.isBlocked ? (
          <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-200">
            This chat is blocked. Messages cannot be sent.
          </p>
        ) : null}
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <div className="grid gap-2">
            <Textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="Type a message..."
              rows={3}
              disabled={conversation.isBlocked}
            />
            <Input
              value={mediaUrl}
              onChange={(event) => setMediaUrl(event.target.value)}
              placeholder="Optional media URL until private uploads are wired"
              disabled={conversation.isBlocked}
            />
          </div>
          <div className="flex gap-2 sm:flex-col">
            <Button
              type="button"
              size="icon"
              variant="outline"
              title="Voice note stub"
              disabled={conversation.isBlocked || isPending}
              onClick={() => sendMessage("VOICE")}
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              title="Send"
              disabled={conversation.isBlocked || isPending}
              onClick={() => sendMessage()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {error ? <p className="text-sm text-rose-500">{error}</p> : null}
      </footer>
    </section>
  );
}
