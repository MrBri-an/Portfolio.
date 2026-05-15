import { NextRequest } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { chatRepository } from "@/lib/db/chat-repository";
import { jsonResponse, optionsResponse, rejectDisallowedOrigin } from "@/lib/server/api";
import { startConversationSchema } from "@/lib/validations/chat";

export function OPTIONS(request: NextRequest) {
  return optionsResponse(request);
}

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return jsonResponse(request, { message: "Sign in to view chats." }, { status: 401 });
  }

  const conversations = await chatRepository.listConversations(user.id);
  const unreadCount = await chatRepository.getUnreadCount(user.id);

  return jsonResponse(request, { conversations, unreadCount });
}

export async function POST(request: NextRequest) {
  const blocked = rejectDisallowedOrigin(request);
  if (blocked) return blocked;

  const user = await getCurrentUser();

  if (!user) {
    return jsonResponse(request, { message: "Sign in to start a chat." }, { status: 401 });
  }

  const parsed = startConversationSchema.safeParse(await request.json());

  if (!parsed.success) {
    return jsonResponse(
      request,
      { message: parsed.error.issues[0]?.message ?? "Invalid chat request." },
      { status: 400 },
    );
  }

  try {
    const conversation = await chatRepository.getOrCreateConversation({
      currentUserId: user.id,
      otherUserId: parsed.data.otherUserId,
      listingId: parsed.data.listingId,
    });

    return jsonResponse(request, { id: conversation.id, conversation });
  } catch (error) {
    return jsonResponse(
      request,
      { message: error instanceof Error ? error.message : "Unable to start chat." },
      { status: 400 },
    );
  }
}
