import { NextRequest } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { chatRepository } from "@/lib/db/chat-repository";
import { jsonResponse, optionsResponse, rejectDisallowedOrigin } from "@/lib/server/api";

type ConversationContext = {
  params: Promise<{
    conversationId: string;
  }>;
};

export function OPTIONS(request: NextRequest) {
  return optionsResponse(request);
}

export async function POST(request: NextRequest, context: ConversationContext) {
  const blocked = rejectDisallowedOrigin(request);
  if (blocked) return blocked;

  const user = await getCurrentUser();

  if (!user) {
    return jsonResponse(request, { message: "Sign in to update read state." }, { status: 401 });
  }

  const { conversationId } = await context.params;
  const ok = await chatRepository.markRead(conversationId, user.id);

  return jsonResponse(request, { ok });
}
