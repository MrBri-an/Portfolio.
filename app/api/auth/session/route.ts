import { NextRequest } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { jsonResponse, optionsResponse, rejectDisallowedOrigin } from "@/lib/server/api";

export function OPTIONS(request: NextRequest) {
  return optionsResponse(request);
}

export async function GET(request: NextRequest) {
  const blocked = rejectDisallowedOrigin(request);
  if (blocked) return blocked;

  const user = await getCurrentUser();

  return jsonResponse(request, {
    authenticated: Boolean(user),
    user,
  });
}
