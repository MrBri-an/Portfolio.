import { NextRequest } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { createMediaUploadIntents } from "@/lib/services/media-storage";
import { jsonResponse, optionsResponse, rejectDisallowedOrigin } from "@/lib/server/api";
import { mediaIntentSchema } from "@/lib/validations/marketplace";

export function OPTIONS(request: NextRequest) {
  return optionsResponse(request);
}

export async function POST(request: NextRequest) {
  const blocked = rejectDisallowedOrigin(request);
  if (blocked) return blocked;

  const user = await getCurrentUser();

  if (!user) {
    return jsonResponse(request, { message: "Sign in to upload media." }, { status: 401 });
  }
  const body = await request.json();
  const parsed = mediaIntentSchema.safeParse(body);

  if (!parsed.success) {
    return jsonResponse(
      request,
      { message: parsed.error.issues[0]?.message ?? "Invalid media files." },
      { status: 400 },
    );
  }

  try {
    const intents = createMediaUploadIntents(parsed.data.files);
    return jsonResponse(request, { intents });
  } catch (error) {
    return jsonResponse(
      request,
      { message: error instanceof Error ? error.message : "Unable to prepare uploads." },
      { status: 400 },
    );
  }
}
