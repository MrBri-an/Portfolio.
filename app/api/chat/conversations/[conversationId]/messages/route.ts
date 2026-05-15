import { NextRequest } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { chatRepository } from "@/lib/db/chat-repository";
import { jsonResponse, optionsResponse, rejectDisallowedOrigin } from "@/lib/server/api";
import { sendMessageSchema } from "@/lib/validations/chat";

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
    return jsonResponse(request, { message: "Sign in to send messages." }, { status: 401 });
  }

  const parsed = sendMessageSchema.safeParse(await request.json());

  if (!parsed.success) {
    return jsonResponse(
      request,
      { message: parsed.error.issues[0]?.message ?? "Invalid message." },
      { status: 400 },
    );
  }

  const { conversationId } = await context.params;

  try {
    const message = await chatRepository.sendMessage({
      conversationId,
      senderId: user.id,
      body: parsed.data.body,
      mediaUrl: parsed.data.mediaUrl,
      mediaMimeType: parsed.data.mediaMimeType,
      mediaName: parsed.data.mediaName,
      kind: parsed.data.kind,
    });

    return jsonResponse(request, { message });
  } catch (error) {
    return jsonResponse(
      request,
      { message: error instanceof Error ? error.message : "Unable to send message." },
      { status: 400 },
    );
  }
}
