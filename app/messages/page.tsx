import { MessageCircle } from "lucide-react";

import { ChatInbox } from "@/components/chat/chat-inbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { chatRepository } from "@/lib/db/chat-repository";

export default async function MessagesPage() {
  const user = await requireUser();
  const conversations = await chatRepository.listConversations(user.id);
  const unreadCount = await chatRepository.getUnreadCount(user.id);

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[380px_1fr] lg:px-8">
      <section className="space-y-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="rounded-full bg-primary/10 text-primary hover:bg-primary/10">
              Inbox
            </Badge>
            {unreadCount ? <Badge className="rounded-full">{unreadCount} unread</Badge> : null}
          </div>
          <h1 className="mt-3 font-[var(--font-jakarta)] text-3xl font-semibold">
            Messages
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Listing conversations, receipts, reports, and safety controls.
          </p>
        </div>
        <ChatInbox conversations={conversations} />
      </section>

      <Card className="hidden min-h-[720px] rounded-[16px] lg:block">
        <CardContent className="flex h-full flex-col items-center justify-center p-10 text-center">
          <MessageCircle className="mb-4 h-12 w-12 text-primary" />
          <p className="text-xl font-semibold">Choose a conversation</p>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Open a thread to send messages, attach media links, mark messages as seen,
            and use block or report tools.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
