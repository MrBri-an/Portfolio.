import { NextRequest } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { chatRepository } from "@/lib/db/chat-repository";
import { jsonResponse, optionsResponse, rejectDisallowedOrigin } from "@/lib/server/api";
import { deleteMessageSchema } from "@/lib/validations/chat";

type MessageContext = {
  params: Promise<{
    messageId: string;
  }>;
};

export function OPTIONS(request: NextRequest) {
  return optionsResponse(request);
}

export async function DELETE(request: NextRequest, context: MessageContext) {
  const blocked = rejectDisallowedOrigin(request);
  if (blocked) return blocked;

  const user = await getCurrentUser();

  if (!user) {
    return jsonResponse(request, { message: "Sign in to delete messages." }, { status: 401 });
  }

  const parsed = deleteMessageSchema.safeParse(await request.json());

  if (!parsed.success) {
    return jsonResponse(request, { message: "Invalid delete mode." }, { status: 400 });
  }

  const { messageId } = await context.params;

  try {
    await chatRepository.deleteMessage({
      messageId,
      userId: user.id,
      mode: parsed.data.mode,
    });

    return jsonResponse(request, { ok: true });
  } catch (error) {
    return jsonResponse(
      request,
      { message: error instanceof Error ? error.message : "Unable to delete message." },
      { status: 400 },
    );
  }
}
