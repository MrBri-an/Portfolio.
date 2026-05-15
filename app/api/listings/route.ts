import { NextRequest } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { marketplaceRepository } from "@/lib/db/marketplace-repository";
import { jsonResponse, optionsResponse, rejectDisallowedOrigin } from "@/lib/server/api";
import { listingCreateSchema, listingFiltersSchema } from "@/lib/validations/marketplace";

export function OPTIONS(request: NextRequest) {
  return optionsResponse(request);
}

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  const searchParams = request.nextUrl.searchParams;
  const parsed = listingFiltersSchema.safeParse({
    categorySlug: searchParams.get("category") || undefined,
    query: searchParams.get("q") || undefined,
    location: searchParams.get("location") || undefined,
    minPrice: searchParams.get("minPrice") || undefined,
    maxPrice: searchParams.get("maxPrice") || undefined,
    sort: searchParams.get("sort") || undefined,
    cursor: searchParams.get("cursor") || undefined,
    take: searchParams.get("take") || undefined,
  });

  if (!parsed.success) {
    return jsonResponse(
      request,
      { message: parsed.error.issues[0]?.message ?? "Invalid listing filters." },
      { status: 400 },
    );
  }

  const listings = await marketplaceRepository.listFeedListings(parsed.data, user?.id);
  const pins = await marketplaceRepository.listMapPins(parsed.data);

  return jsonResponse(request, { ...listings, pins });
}

export async function POST(request: NextRequest) {
  const blocked = rejectDisallowedOrigin(request);
  if (blocked) return blocked;

  const user = await getCurrentUser();

  if (!user) {
    return jsonResponse(request, { message: "Sign in to create a listing." }, { status: 401 });
  }
  const body = await request.json();
  const parsed = listingCreateSchema.safeParse(body);

  if (!parsed.success) {
    return jsonResponse(
      request,
      { message: parsed.error.issues[0]?.message ?? "Invalid listing fields." },
      { status: 400 },
    );
  }

  const listing = await marketplaceRepository.createListing({
    ownerId: user.id,
    categoryId: parsed.data.categoryId,
    title: parsed.data.title,
    description: parsed.data.description,
    price: parsed.data.price,
    pricePeriod: parsed.data.pricePeriod,
    locationText: parsed.data.locationText,
    latitude: parsed.data.latitude,
    longitude: parsed.data.longitude,
    status: parsed.data.status,
    expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
    mediaItems: parsed.data.mediaItems,
    mediaQuality: user.mediaQuality,
  });

  return jsonResponse(request, { id: listing.id, listing });
}
