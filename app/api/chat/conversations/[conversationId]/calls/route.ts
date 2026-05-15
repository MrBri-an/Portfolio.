import { NextRequest } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { chatRepository } from "@/lib/db/chat-repository";
import { jsonResponse, optionsResponse, rejectDisallowedOrigin } from "@/lib/server/api";
import { startCallSchema } from "@/lib/validations/chat";

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
    return jsonResponse(request, { message: "Sign in to start calls." }, { status: 401 });
  }

  const parsed = startCallSchema.safeParse(await request.json());

  if (!parsed.success) {
    return jsonResponse(request, { message: "Invalid call type." }, { status: 400 });
  }

  const { conversationId } = await context.params;

  try {
    const call = await chatRepository.startCall({
      conversationId,
      callerId: user.id,
      type: parsed.data.type,
    });

    return jsonResponse(request, { call });
  } catch (error) {
    return jsonResponse(
      request,
      { message: error instanceof Error ? error.message : "Unable to start call." },
      { status: 400 },
    );
  }
}
