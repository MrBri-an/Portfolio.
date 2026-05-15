import { NextRequest } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { marketplaceRepository } from "@/lib/db/marketplace-repository";
import { jsonResponse, optionsResponse, rejectDisallowedOrigin } from "@/lib/server/api";

type RouteProps = {
  params: Promise<{
    listingId: string;
  }>;
};

export function OPTIONS(request: NextRequest) {
  return optionsResponse(request);
}

export async function GET(request: NextRequest, { params }: RouteProps) {
  const blocked = rejectDisallowedOrigin(request);
  if (blocked) return blocked;

  const { listingId } = await params;
  const comments = await marketplaceRepository.listComments(listingId);
  return jsonResponse(request, { comments });
}

export async function POST(request: NextRequest, { params }: RouteProps) {
  const blocked = rejectDisallowedOrigin(request);
  if (blocked) return blocked;

  const user = await getCurrentUser();

  if (!user) {
    return jsonResponse(request, { message: "Sign in to comment." }, { status: 401 });
  }

  const { listingId } = await params;
  const body = (await request.json()) as {
    body?: string;
    parentId?: string | null;
  };

  if (!body.body?.trim()) {
    return jsonResponse(request, { message: "Comment body is required." }, { status: 400 });
  }

  const comments = await marketplaceRepository.createComment({
    listingId,
    authorId: user.id,
    body: body.body,
    parentId: body.parentId,
  });

  return jsonResponse(request, { comments });
}
