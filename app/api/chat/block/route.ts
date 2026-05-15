import { NextRequest } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { chatRepository } from "@/lib/db/chat-repository";
import { jsonResponse, optionsResponse, rejectDisallowedOrigin } from "@/lib/server/api";
import { blockUserSchema } from "@/lib/validations/chat";

export function OPTIONS(request: NextRequest) {
  return optionsResponse(request);
}

export async function POST(request: NextRequest) {
  const blocked = rejectDisallowedOrigin(request);
  if (blocked) return blocked;

  const user = await getCurrentUser();

  if (!user) {
    return jsonResponse(request, { message: "Sign in to block users." }, { status: 401 });
  }

  const parsed = blockUserSchema.safeParse(await request.json());

  if (!parsed.success) {
    return jsonResponse(request, { message: "Invalid block request." }, { status: 400 });
  }

  try {
    const block = await chatRepository.blockUser({
      blockerId: user.id,
      blockedId: parsed.data.userId,
      reason: parsed.data.reason,
    });

    return jsonResponse(request, { block });
  } catch (error) {
    return jsonResponse(
      request,
      { message: error instanceof Error ? error.message : "Unable to block user." },
      { status: 400 },
    );
  }
}
