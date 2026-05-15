import { NextRequest } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { marketplaceRepository } from "@/lib/db/marketplace-repository";
import { jsonResponse, optionsResponse, rejectDisallowedOrigin } from "@/lib/server/api";

type ListingInteractionContext = {
  params: Promise<{
    listingId: string;
  }>;
};

export function OPTIONS(request: NextRequest) {
  return optionsResponse(request);
}

export async function POST(request: NextRequest, context: ListingInteractionContext) {
  const blocked = rejectDisallowedOrigin(request);
  if (blocked) return blocked;

  const { listingId } = await context.params;
  const user = await getCurrentUser();

  if (!user) {
    return jsonResponse(request, { message: "Sign in to favorite listings." }, { status: 401 });
  }
  const result = await marketplaceRepository.toggleListingInteraction({
    listingId,
    userId: user.id,
    type: "favorite",
  });

  return jsonResponse(request, result);
}
