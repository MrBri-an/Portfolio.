import { NextRequest } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { chatRepository } from "@/lib/db/chat-repository";
import { jsonResponse, optionsResponse, rejectDisallowedOrigin } from "@/lib/server/api";
import { endCallSchema } from "@/lib/validations/chat";

type CallContext = {
  params: Promise<{
    callId: string;
  }>;
};

export function OPTIONS(request: NextRequest) {
  return optionsResponse(request);
}

export async function PATCH(request: NextRequest, context: CallContext) {
  const blocked = rejectDisallowedOrigin(request);
  if (blocked) return blocked;

  const user = await getCurrentUser();

  if (!user) {
    return jsonResponse(request, { message: "Sign in to update calls." }, { status: 401 });
  }

  const parsed = endCallSchema.safeParse(await request.json());

  if (!parsed.success) {
    return jsonResponse(request, { message: "Invalid call status." }, { status: 400 });
  }

  const { callId } = await context.params;

  try {
    const call = await chatRepository.endCall({
      callId,
      userId: user.id,
      status: parsed.data.status,
    });

    return jsonResponse(request, { call });
  } catch (error) {
    return jsonResponse(
      request,
      { message: error instanceof Error ? error.message : "Unable to update call." },
      { status: 400 },
    );
  }
}
