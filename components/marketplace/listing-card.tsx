"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import {
  Bookmark,
  Eye,
  Heart,
  MapPin,
  MessageCircle,
  Share2,
  Star,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MediaCarousel } from "@/components/marketplace/media-carousel";
import { StartChatButton } from "@/components/chat/start-chat-button";
import { cn, formatCurrency, formatDate, formatPricePeriod } from "@/lib/utils";
import type { ListingCardData } from "@/types/marketplace";

type ListingCardProps = {
  listing: ListingCardData;
};

export function ListingCard({ listing }: ListingCardProps) {
  const [counts, setCounts] = useState({
    likes: listing.likeCount,
    saves: listing.saveCount,
    favorites: listing.favoriteCount,
  });
  const [active, setActive] = useState({
    liked: listing.viewerHasLiked,
    saved: listing.viewerHasSaved,
    favorited: listing.viewerHasFavorited,
  });
  const [isPending, startTransition] = useTransition();

  function mutateInteraction(type: "like" | "save" | "favorite") {
    startTransition(async () => {
      const response = await fetch(`/api/listings/${listing.id}/${type}`, {
        method: "POST",
      });

      if (response.status === 401 || response.redirected) {
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        return;
      }

      const data = (await response.json()) as {
        active: boolean;
        likeCount: number;
        saveCount: number;
        favoriteCount: number;
      };

      setCounts({
        likes: data.likeCount,
        saves: data.saveCount,
        favorites: data.favoriteCount,
      });
      setActive((current) => ({
        ...current,
        liked: type === "like" ? data.active : current.liked,
        saved: type === "save" ? data.active : current.saved,
        favorited: type === "favorite" ? data.active : current.favorited,
      }));
    });
  }

  const ownerInitials = listing.owner.fullName
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="overflow-hidden rounded-[16px]">
      <CardContent className="space-y-4 p-4">
        <div className="flex items-center justify-between gap-3">
          <Link
            href={`/profile/${listing.owner.profileId}`}
            className="flex min-w-0 items-center gap-3"
          >
            <Avatar className="h-10 w-10">
              {listing.owner.imageUrl ? (
                <AvatarImage src={listing.owner.imageUrl} alt={listing.owner.fullName} />
              ) : null}
              <AvatarFallback>{ownerInitials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{listing.owner.fullName}</p>
              <p className="truncate text-xs text-muted-foreground">
                @{listing.owner.username || listing.owner.profileId}
              </p>
            </div>
          </Link>
          <Badge variant="outline" className="rounded-full">
            {listing.status}
          </Badge>
        </div>

        <MediaCarousel items={listing.mediaItems} />
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="rounded-full">{listing.category.name}</Badge>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {listing.locationText}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold">{listing.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{listing.description}</p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-lg font-semibold text-primary">
              {formatCurrency(listing.price)}
              <span className="ml-1 text-xs font-medium text-muted-foreground">
                {formatPricePeriod(listing.pricePeriod)}
              </span>
            </p>
            <p className="text-xs text-muted-foreground">{formatDate(listing.createdAt)}</p>
          </div>
          <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
            <div className="flex items-center gap-1">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-9 w-9 rounded-full"
                disabled={isPending}
                title="Like"
                onClick={() => mutateInteraction("like")}
              >
                <Heart
                  className={cn("h-4 w-4", active.liked && "fill-primary text-primary")}
                />
              </Button>
              <span className="text-xs text-muted-foreground">{counts.likes}</span>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-9 w-9 rounded-full"
                disabled={isPending}
                title="Save"
                onClick={() => mutateInteraction("save")}
              >
                <Bookmark
                  className={cn("h-4 w-4", active.saved && "fill-primary text-primary")}
                />
              </Button>
              <span className="text-xs text-muted-foreground">{counts.saves}</span>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-9 w-9 rounded-full"
                disabled={isPending}
                title="Favorite"
                onClick={() => mutateInteraction("favorite")}
              >
                <Star
                  className={cn(
                    "h-4 w-4",
                    active.favorited && "fill-primary text-primary",
                  )}
                />
              </Button>
              <span className="text-xs text-muted-foreground">{counts.favorites}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Eye className="h-4 w-4" />
              {listing.viewsCount}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Button asChild variant="outline" className="rounded-full">
              <Link href={`/listings/${listing.id}`}>
                <MessageCircle className="mr-2 h-4 w-4" />
                View
              </Link>
            </Button>
            <StartChatButton otherUserId={listing.owner.id} listingId={listing.id} />
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => navigator.clipboard?.writeText(window.location.origin + `/listings/${listing.id}`)}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
