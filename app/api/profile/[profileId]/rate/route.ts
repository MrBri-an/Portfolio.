import { NextRequest } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { marketplaceRepository } from "@/lib/db/marketplace-repository";
import { jsonResponse, optionsResponse, rejectDisallowedOrigin } from "@/lib/server/api";

type RouteProps = {
  params: Promise<{
    profileId: string;
  }>;
};

export function OPTIONS(request: NextRequest) {
  return optionsResponse(request);
}

export async function POST(request: NextRequest, { params }: RouteProps) {
  const blocked = rejectDisallowedOrigin(request);
  if (blocked) return blocked;

  const user = await getCurrentUser();

  if (!user) {
    return jsonResponse(request, { message: "Sign in to rate a user." }, { status: 401 });
  }

  const { profileId } = await params;
  const body = (await request.json()) as { score?: number };
  const profile = await marketplaceRepository.getProfilePageData(profileId, user, "local");

  if (!profile) {
    return jsonResponse(request, { message: "Profile not found." }, { status: 404 });
  }

  try {
    const summary = await marketplaceRepository.rateUser({
      raterId: user.id,
      ratedUserId: profile.user.id,
      score: Math.max(1, Math.min(5, body.score ?? 0)),
    });

    return jsonResponse(request, {
      message: "Rating updated.",
      average: summary.average,
      count: summary.count,
    });
  } catch (error) {
    return jsonResponse(
      request,
      { message: error instanceof Error ? error.message : "Unable to rate user." },
      { status: 400 },
    );
  }
}
