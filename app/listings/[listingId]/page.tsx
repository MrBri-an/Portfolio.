import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { Eye, Heart, MapPin, MessageSquareMore, Star } from "lucide-react";

import { getCurrentUser } from "@/lib/auth";
import { marketplaceRepository } from "@/lib/db/marketplace-repository";
import { CommentsSection } from "@/components/marketplace/comments-section";
import { MediaCarousel } from "@/components/marketplace/media-carousel";
import { StartChatButton } from "@/components/chat/start-chat-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate, formatPricePeriod } from "@/lib/utils";

type ListingDetailPageProps = {
  params: Promise<{
    listingId: string;
  }>;
};

export default async function ListingDetailPage({ params }: ListingDetailPageProps) {
  const { listingId } = await params;
  const user = await getCurrentUser();
  const listing = await marketplaceRepository.getListingById(listingId, user?.id);
  const commentThreads = await marketplaceRepository.listComments(listingId);
  const headerStore = await headers();

  if (!listing) {
    notFound();
  }

  await marketplaceRepository.recordListingView({
    listingId,
    viewerIp:
      headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headerStore.get("x-real-ip") ||
      "page-view",
    userId: user?.id,
  });

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <MediaCarousel items={listing.mediaItems} className="h-full" />

        <Card className="rounded-[28px]">
          <CardContent className="space-y-5 p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="rounded-full">{listing.category.name}</Badge>
              <Badge variant="outline" className="rounded-full">
                {listing.status}
              </Badge>
            </div>
            <div>
              <h1 className="font-[var(--font-jakarta)] text-3xl font-semibold">
                {listing.title}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Posted on {formatDate(listing.createdAt)}
              </p>
            </div>
            <p className="text-3xl font-semibold text-primary">
              {formatCurrency(listing.price)}
              <span className="ml-2 text-sm font-medium text-muted-foreground">
                {formatPricePeriod(listing.pricePeriod)}
              </span>
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{listing.locationText}</span>
            </div>
            <p className="leading-7 text-muted-foreground">{listing.description}</p>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-2xl border border-border p-3">
                <Heart className="mb-2 h-4 w-4 text-primary" />
                <p className="font-semibold">{listing.likeCount}</p>
                <p className="text-xs text-muted-foreground">Likes</p>
              </div>
              <div className="rounded-2xl border border-border p-3">
                <Star className="mb-2 h-4 w-4 text-primary" />
                <p className="font-semibold">{listing.favoriteCount}</p>
                <p className="text-xs text-muted-foreground">Favorites</p>
              </div>
              <div className="rounded-2xl border border-border p-3">
                <Eye className="mb-2 h-4 w-4 text-primary" />
                <p className="font-semibold">{listing.viewsCount}</p>
                <p className="text-xs text-muted-foreground">Views</p>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-muted/40 p-4">
              <p className="text-sm text-muted-foreground">Owner</p>
              <Link href={`/profile/${listing.owner.profileId}`} className="mt-2 block font-medium">
                {listing.owner.fullName}
              </Link>
              <p className="mt-1 text-sm text-muted-foreground">
                @{listing.owner.username || listing.owner.profileId}
              </p>
            </div>
            {user ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <StartChatButton
                  otherUserId={listing.owner.id}
                  listingId={listing.id}
                  label="Chat about listing"
                />
                <Button type="button" className="w-full rounded-full" asChild>
                  <Link href={`/profile/${listing.owner.profileId}`}>
                    <MessageSquareMore className="mr-2 h-4 w-4" />
                    View owner profile
                  </Link>
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </section>

      <CommentsSection
        listingId={listing.id}
        comments={commentThreads}
        canComment={Boolean(user)}
      />
    </main>
  );
}
