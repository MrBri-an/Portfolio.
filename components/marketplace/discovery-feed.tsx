"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Grid2X2, ListFilter, Loader2, Map, MapPin, Search } from "lucide-react";

import { ListingCard } from "@/components/marketplace/listing-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn, formatCurrency, formatPricePeriod } from "@/lib/utils";
import type { MapProviderConfig } from "@/lib/services/map-provider";
import type {
  CategoryRecord,
  ListingCardData,
  ListingMapPin,
  ListingSort,
  PaginatedListings,
} from "@/types/marketplace";

type DiscoveryFeedData = PaginatedListings & {
  pins: ListingMapPin[];
};

type DiscoveryFeedProps = {
  categories: CategoryRecord[];
  initialData: DiscoveryFeedData;
  mapProvider: MapProviderConfig;
};

const sortOptions: { value: ListingSort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "cheapest", label: "Cheapest" },
  { value: "expensive", label: "Most expensive" },
];

function buildListingUrl(input: {
  categorySlug: string;
  query: string;
  location: string;
  minPrice: number;
  maxPrice: number;
  sort: ListingSort;
  cursor?: string | null;
}) {
  const params = new URLSearchParams();

  if (input.categorySlug) params.set("category", input.categorySlug);
  if (input.query) params.set("q", input.query);
  if (input.location) params.set("location", input.location);
  if (input.minPrice > 0) params.set("minPrice", String(input.minPrice));
  if (input.maxPrice > 0) params.set("maxPrice", String(input.maxPrice));
  if (input.sort !== "newest") params.set("sort", input.sort);
  if (input.cursor) params.set("cursor", input.cursor);

  return `/api/listings?${params.toString()}`;
}

export function DiscoveryFeed({
  categories,
  initialData,
  mapProvider,
}: DiscoveryFeedProps) {
  const [items, setItems] = useState<ListingCardData[]>(initialData.items);
  const [pins, setPins] = useState<ListingMapPin[]>(initialData.pins);
  const [nextCursor, setNextCursor] = useState(initialData.nextCursor);
  const [total, setTotal] = useState(initialData.total);
  const [categorySlug, setCategorySlug] = useState("");
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [sort, setSort] = useState<ListingSort>("newest");
  const [view, setView] = useState<"feed" | "map">("feed");
  const [isPending, startTransition] = useTransition();

  const filterState = useMemo(
    () => ({ categorySlug, query, location, minPrice, maxPrice, sort }),
    [categorySlug, query, location, minPrice, maxPrice, sort],
  );

  function fetchListings(cursor?: string | null, mode: "replace" | "append" = "replace") {
    startTransition(async () => {
      const response = await fetch(buildListingUrl({ ...filterState, cursor }));

      if (!response.ok) {
        return;
      }

      const data = (await response.json()) as DiscoveryFeedData;
      setItems((current) => (mode === "append" ? [...current, ...data.items] : data.items));
      setPins(data.pins);
      setNextCursor(data.nextCursor);
      setTotal(data.total);
    });
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => fetchListings(null, "replace"), 250);
    return () => window.clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterState]);

  return (
    <section className="grid gap-5">
      <div className="sticky top-20 z-20 space-y-4 border-b border-border bg-background/95 py-4 backdrop-blur">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Button
            type="button"
            variant={categorySlug ? "outline" : "default"}
            className="shrink-0 rounded-full"
            onClick={() => setCategorySlug("")}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              type="button"
              variant={categorySlug === category.slug ? "default" : "outline"}
              className="shrink-0 rounded-full"
              onClick={() => setCategorySlug(category.slug)}
            >
              {category.name}
            </Button>
          ))}
        </div>

        <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr_auto] lg:items-end">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="feed-search">Search</Label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="feed-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="pl-9"
                  placeholder="Duplex, shortlet, studio..."
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="feed-location">Location</Label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="feed-location"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  className="pl-9"
                  placeholder="Lagos, Abuja, PH..."
                />
              </div>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="min-price">Min price</Label>
              <Input
                id="min-price"
                inputMode="numeric"
                value={minPrice || ""}
                onChange={(event) => setMinPrice(Number(event.target.value) || 0)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-price">Max price</Label>
              <Input
                id="max-price"
                inputMode="numeric"
                value={maxPrice || ""}
                onChange={(event) => setMaxPrice(Number(event.target.value) || 0)}
                placeholder="Any"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sort">Sort</Label>
              <select
                id="sort"
                value={sort}
                onChange={(event) => setSort(event.target.value as ListingSort)}
                className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={view === "feed" ? "default" : "outline"}
              size="icon"
              className="rounded-full"
              title="Feed view"
              onClick={() => setView("feed")}
            >
              <Grid2X2 className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant={view === "map" ? "default" : "outline"}
              size="icon"
              className="rounded-full"
              title="Map view"
              onClick={() => setView("map")}
            >
              <Map className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <ListFilter className="h-4 w-4" />
            {total} matching listings
          </span>
          {minPrice || maxPrice ? (
            <Badge variant="outline" className="rounded-full">
              {minPrice ? formatCurrency(minPrice) : "Any"} -{" "}
              {maxPrice ? formatCurrency(maxPrice) : "Any"}
            </Badge>
          ) : null}
        </div>
      </div>

      {view === "feed" ? (
        <div className="mx-auto grid w-full max-w-2xl gap-5">
          {items.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
          {!items.length && !isPending ? (
            <div className="rounded-[16px] border border-dashed border-border p-10 text-center text-muted-foreground">
              No listings match these filters yet.
            </div>
          ) : null}
          {nextCursor ? (
            <Button
              type="button"
              variant="outline"
              className="mx-auto rounded-full px-8"
              disabled={isPending}
              onClick={() => fetchListings(nextCursor, "append")}
            >
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Load more
            </Button>
          ) : null}
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="min-h-[560px] rounded-[16px] border border-border bg-slate-950 p-4 text-white">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold">Map preview</p>
                <p className="text-xs text-slate-300">
                  {mapProvider.hasLiveKey
                    ? `${mapProvider.provider} provider ready`
                    : "Manual coordinates with stub provider"}
                </p>
              </div>
              <Badge className="rounded-full bg-white/10 text-white hover:bg-white/10">
                {pins.length} pins
              </Badge>
            </div>
            <div className="relative h-[480px] overflow-hidden rounded-[12px] bg-[linear-gradient(135deg,#0f172a_0%,#172554_45%,#064e3b_100%)]">
              {pins.map((pin, index) => (
                <div
                  key={pin.id}
                  className="absolute max-w-44 rounded-xl bg-white p-3 text-xs text-slate-950 shadow-xl"
                  style={{
                    left: `${18 + (index * 23) % 60}%`,
                    top: `${16 + (index * 29) % 62}%`,
                  }}
                >
                  <MapPin className="mb-1 h-4 w-4 text-primary" />
                  <p className="line-clamp-2 font-semibold">{pin.title}</p>
                  <p className="mt-1 text-slate-600">{pin.locationText}</p>
                  <p className="mt-2 font-semibold text-primary">
                    {formatCurrency(pin.price)} {formatPricePeriod(pin.pricePeriod)}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid content-start gap-4">
            {items.slice(0, 5).map((listing) => (
              <Link
                key={listing.id}
                href={`/listings/${listing.id}`}
                className={cn(
                  "rounded-[16px] border border-border p-4 transition hover:border-primary",
                  "bg-card text-card-foreground",
                )}
              >
                <p className="font-semibold">{listing.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{listing.locationText}</p>
                <p className="mt-2 text-sm font-semibold text-primary">
                  {formatCurrency(listing.price)} {formatPricePeriod(listing.pricePeriod)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
