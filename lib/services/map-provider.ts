import type { ListingMapPin } from "@/types/marketplace";

export type MapProviderConfig = {
  provider: "stub" | "google" | "mapbox";
  hasLiveKey: boolean;
};

export function getMapProviderConfig(): MapProviderConfig {
  if (process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY) {
    return { provider: "google", hasLiveKey: true };
  }

  if (process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
    return { provider: "mapbox", hasLiveKey: true };
  }

  return { provider: "stub", hasLiveKey: false };
}

export function getMapBounds(pins: ListingMapPin[]) {
  const plotted = pins.filter(
    (pin) => typeof pin.latitude === "number" && typeof pin.longitude === "number",
  );

  if (!plotted.length) {
    return null;
  }

  return plotted.reduce(
    (bounds, pin) => ({
      north: Math.max(bounds.north, pin.latitude ?? bounds.north),
      south: Math.min(bounds.south, pin.latitude ?? bounds.south),
      east: Math.max(bounds.east, pin.longitude ?? bounds.east),
      west: Math.min(bounds.west, pin.longitude ?? bounds.west),
    }),
    {
      north: plotted[0].latitude ?? 0,
      south: plotted[0].latitude ?? 0,
      east: plotted[0].longitude ?? 0,
      west: plotted[0].longitude ?? 0,
    },
  );
}
