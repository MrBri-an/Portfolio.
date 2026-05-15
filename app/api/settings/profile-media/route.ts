import { NextRequest } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { authRepository } from "@/lib/db/auth-repository";
import { jsonResponse, optionsResponse, rejectDisallowedOrigin } from "@/lib/server/api";

export function OPTIONS(request: NextRequest) {
  return optionsResponse(request);
}

export async function POST(request: NextRequest) {
  const blocked = rejectDisallowedOrigin(request);
  if (blocked) return blocked;

  const user = await getCurrentUser();

  if (!user) {
    return jsonResponse(request, { message: "Sign in to update profile settings." }, { status: 401 });
  }

  const body = (await request.json()) as {
    mediaQuality?: "high" | "medium" | "low";
    bannerImageUrl?: string;
    bio?: string;
    whatsappUrl?: string;
    instagramUrl?: string;
    linkedinUrl?: string;
  };

  const updated = await authRepository.updateUserProfile(user.id, {
    mediaQuality: body.mediaQuality,
    bannerImageUrl: body.bannerImageUrl?.trim() || null,
    bio: body.bio?.trim() || null,
    whatsappUrl: body.whatsappUrl?.trim() || null,
    instagramUrl: body.instagramUrl?.trim() || null,
    linkedinUrl: body.linkedinUrl?.trim() || null,
  });

  return jsonResponse(request, {
    message: "Profile preferences updated.",
    user: updated,
  });
}
