import { z } from "zod";

export const pricePeriodSchema = z.enum([
  "PER_YEAR",
  "PER_MONTH",
  "FOR_SALE",
  "NEGOTIABLE",
]);

export const listingStatusSchema = z.enum(["AVAILABLE", "RENTED", "SOLD"]);

export const mediaKindSchema = z.enum(["IMAGE", "VIDEO", "DOCUMENT"]);

export const listingMediaInputSchema = z.object({
  url: z.url("Enter a valid media URL."),
  kind: mediaKindSchema,
  mimeType: z.string().trim().max(120).optional().nullable(),
  sizeBytes: z.number().int().nonnegative().optional().nullable(),
  originalName: z.string().trim().max(180).optional().nullable(),
  publicId: z.string().trim().max(220).optional().nullable(),
  width: z.number().int().positive().optional().nullable(),
  height: z.number().int().positive().optional().nullable(),
});

export const listingCreateSchema = z.object({
  categoryId: z.string().trim().min(1, "Choose a category."),
  title: z.string().trim().min(8, "Title must be at least 8 characters.").max(120),
  description: z
    .string()
    .trim()
    .min(30, "Description must be at least 30 characters.")
    .max(5000),
  price: z.number().int().positive("Enter a valid price."),
  pricePeriod: pricePeriodSchema,
  locationText: z.string().trim().min(3, "Add a location.").max(180),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  status: listingStatusSchema.default("AVAILABLE"),
  expiresAt: z.iso.datetime().optional().nullable(),
  mediaItems: z.array(listingMediaInputSchema).max(20).default([]),
});

export const listingFiltersSchema = z.object({
  categorySlug: z.string().trim().max(80).optional(),
  query: z.string().trim().max(120).optional(),
  location: z.string().trim().max(120).optional(),
  minPrice: z.coerce.number().int().nonnegative().optional(),
  maxPrice: z.coerce.number().int().nonnegative().optional(),
  sort: z.enum(["newest", "oldest", "cheapest", "expensive"]).default("newest"),
  cursor: z.string().trim().optional(),
  take: z.coerce.number().int().min(1).max(24).default(8),
});

export const listingInteractionSchema = z.object({
  listingId: z.string().trim().min(1),
});

export const mediaIntentSchema = z.object({
  files: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(180),
        type: z.string().trim().min(1).max(120),
        size: z.number().int().nonnegative(),
      }),
    )
    .min(1, "Add at least one file.")
    .max(20, "You can upload up to 20 files per listing."),
});
