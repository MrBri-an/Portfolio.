import { NextRequest } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { marketplaceRepository } from "@/lib/db/marketplace-repository";
import { getRequestMeta, jsonResponse, optionsResponse } from "@/lib/server/api";

type ListingRouteContext = {
  params: Promise<{
    listingId: string;
  }>;
};

export function OPTIONS(request: NextRequest) {
  return optionsResponse(request);
}

export async function GET(request: NextRequest, context: ListingRouteContext) {
  const { listingId } = await context.params;
  const user = await getCurrentUser();
  const meta = getRequestMeta(request);
  const listing = await marketplaceRepository.getListingById(listingId, user?.id);

  if (!listing) {
    return jsonResponse(request, { message: "Listing not found." }, { status: 404 });
  }

  await marketplaceRepository.recordListingView({
    listingId,
    viewerIp: meta.ipAddress ?? "unknown",
    userId: user?.id,
  });

  return jsonResponse(request, { listing });
}
