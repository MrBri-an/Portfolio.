import { notFound } from "next/navigation";

import { ChatInbox } from "@/components/chat/chat-inbox";
import { ChatThread } from "@/components/chat/chat-thread";
import { Badge } from "@/components/ui/badge";
import { requireUser } from "@/lib/auth";
import { chatRepository } from "@/lib/db/chat-repository";

type ConversationPageProps = {
  params: Promise<{
    conversationId: string;
  }>;
};

export default async function ConversationPage({ params }: ConversationPageProps) {
  const user = await requireUser();
  const { conversationId } = await params;
  const [conversations, conversation] = await Promise.all([
    chatRepository.listConversations(user.id),
    chatRepository.getConversation(conversationId, user.id),
  ]);
  const unreadCount = await chatRepository.getUnreadCount(user.id);

  if (!conversation) {
    notFound();
  }

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
        </div>
        <ChatInbox conversations={conversations} activeConversationId={conversationId} />
      </section>

      <ChatThread conversation={conversation} currentUserId={user.id} />
    </main>
  );
}
