import { NextRequest } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { chatRepository } from "@/lib/db/chat-repository";
import { jsonResponse, optionsResponse } from "@/lib/server/api";

type ConversationContext = {
  params: Promise<{
    conversationId: string;
  }>;
};

export function OPTIONS(request: NextRequest) {
  return optionsResponse(request);
}

export async function GET(request: NextRequest, context: ConversationContext) {
  const user = await getCurrentUser();

  if (!user) {
    return jsonResponse(request, { message: "Sign in to view chats." }, { status: 401 });
  }

  const { conversationId } = await context.params;
  const conversation = await chatRepository.getConversation(conversationId, user.id);

  if (!conversation) {
    return jsonResponse(request, { message: "Conversation not found." }, { status: 404 });
  }

  return jsonResponse(request, { conversation });
}
