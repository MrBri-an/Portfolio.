import { NextRequest } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { chatRepository } from "@/lib/db/chat-repository";
import { jsonResponse, optionsResponse, rejectDisallowedOrigin } from "@/lib/server/api";
import { reportUserSchema } from "@/lib/validations/chat";

export function OPTIONS(request: NextRequest) {
  return optionsResponse(request);
}

export async function POST(request: NextRequest) {
  const blocked = rejectDisallowedOrigin(request);
  if (blocked) return blocked;

  const user = await getCurrentUser();

  if (!user) {
    return jsonResponse(request, { message: "Sign in to report users." }, { status: 401 });
  }

  const parsed = reportUserSchema.safeParse(await request.json());

  if (!parsed.success) {
    return jsonResponse(
      request,
      { message: parsed.error.issues[0]?.message ?? "Invalid report." },
      { status: 400 },
    );
  }

  const report = await chatRepository.reportUser({
    reporterId: user.id,
    reportedId: parsed.data.userId,
    reason: parsed.data.reason,
    listingId: parsed.data.listingId,
    messageId: parsed.data.messageId,
  });

  return jsonResponse(request, { report });
}
