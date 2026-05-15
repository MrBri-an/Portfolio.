import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { Mail, MessageCircleMore, Phone, Plus } from "lucide-react";

import { getCurrentUser } from "@/lib/auth";
import { ListingCard } from "@/components/marketplace/listing-card";
import { ProfileInsightsPanel } from "@/components/marketplace/profile-insights-panel";
import { RatingStars } from "@/components/marketplace/rating-stars";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { marketplaceRepository } from "@/lib/db/marketplace-repository";

type ProfilePageProps = {
  params: Promise<{
    profileId: string;
  }>;
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { profileId } = await params;
  const user = await getCurrentUser();
  const headerStore = await headers();
  const viewerIp =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerStore.get("x-real-ip") ||
    "local";
  const profile = await marketplaceRepository.getProfilePageData(
    profileId,
    user,
    viewerIp,
  );

  if (!profile) {
    notFound();
  }

  const isOwner = user?.id === profile.user.id;
  const contactItems = [
    profile.user.phoneVisibility === "PUBLIC" && profile.user.phone
      ? {
          label: profile.user.phone,
          href: `tel:${profile.user.phone}`,
          icon: Phone,
        }
      : null,
    profile.user.emailVisibility === "PUBLIC" && profile.user.email
      ? {
          label: profile.user.email,
          href: `mailto:${profile.user.email}`,
          icon: Mail,
        }
      : null,
    profile.user.whatsappUrl
      ? {
          label: "WhatsApp",
          href: profile.user.whatsappUrl,
          icon: MessageCircleMore,
        }
      : null,
  ].filter(Boolean) as Array<{
    label: string;
    href: string;
    icon: typeof Phone;
  }>;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[32px] border border-border bg-card">
        <div
          className="h-52 w-full bg-gradient-to-br from-primary/40 via-slate-900 to-slate-700"
          style={
            profile.user.bannerImageUrl
              ? {
                  backgroundImage: `url(${profile.user.bannerImageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
        />
        <div className="px-6 pb-6">
          <div className="-mt-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
              <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-background bg-primary/10">
                {profile.user.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.user.imageUrl}
                    alt={profile.user.fullName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-primary">
                    {profile.user.fullName.charAt(0)}
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <h1 className="font-[var(--font-jakarta)] text-3xl font-semibold">
                    {profile.user.fullName}
                  </h1>
                  <p className="text-muted-foreground">
                    @{profile.user.username || profile.user.profileId.toLowerCase()}
                  </p>
                </div>
                <RatingStars
                  ratedProfileId={profile.user.profileId}
                  canRate={profile.canRate}
                  initialAverage={profile.rating.average}
                  initialCount={profile.rating.count}
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {isOwner ? (
                <>
                  <ProfileInsightsPanel data={profile.insights} />
                  <Button asChild className="rounded-full">
                    <Link href="/listings/new">
                      <Plus className="mr-2 h-4 w-4" />
                      New Listing
                    </Link>
                  </Button>
                </>
              ) : null}
            </div>
          </div>

          <div className="mt-6 space-y-5">
            {profile.user.bio ? (
              <p className="max-w-3xl whitespace-pre-line text-sm leading-7 text-muted-foreground">
                {profile.user.bio}
              </p>
            ) : null}

            {contactItems.length ? (
              <div className="flex flex-wrap gap-3">
                {contactItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm"
                  >
                    <item.icon className="h-4 w-4 text-primary" />
                    {item.label}
                  </a>
                ))}
              </div>
            ) : null}

            <div className="grid gap-4 rounded-[24px] border border-border bg-muted/40 p-4 sm:grid-cols-4">
              <div>
                <p className="text-sm text-muted-foreground">Listings</p>
                <p className="mt-2 text-2xl font-semibold">{profile.stats.listings}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Likes Received</p>
                <p className="mt-2 text-2xl font-semibold">{profile.stats.likesReceived}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Saves Received</p>
                <p className="mt-2 text-2xl font-semibold">{profile.stats.savesReceived}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Profile Views</p>
                <p className="mt-2 text-2xl font-semibold">{profile.stats.profileViews}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {profile.user.instagramUrl ? (
                <a href={profile.user.instagramUrl} className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageCircleMore className="h-4 w-4 text-primary" />
                  Instagram
                </a>
              ) : null}
              {profile.user.linkedinUrl ? (
                <a href={profile.user.linkedinUrl} className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 text-primary" />
                  LinkedIn
                </a>
              ) : null}
              {profile.user.whatsappUrl ? (
                <a href={profile.user.whatsappUrl} className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageCircleMore className="h-4 w-4 text-primary" />
                  WhatsApp
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Listings</h2>
            <p className="text-sm text-muted-foreground">
              A clean grid of the user’s active property posts.
            </p>
          </div>
          <Badge variant="outline" className="rounded-full">
            {profile.listings.length} total
          </Badge>
        </div>
        {profile.listings.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {profile.listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <Card className="rounded-[28px]">
            <CardContent className="py-12 text-center">
              <p className="text-lg font-medium">No listings yet.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Post your first property to start building your profile grid.
              </p>
              {isOwner ? (
                <Button asChild className="mt-5 rounded-full">
                  <Link href="/listings/new">Post your first property</Link>
                </Button>
              ) : null}
            </CardContent>
          </Card>
        )}
      </section>
    </main>
  );
}
