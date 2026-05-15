import { randomUUID } from "crypto";

import type { ListingMediaInput, MediaKind } from "@/types/marketplace";

const allowedTypes = new Map<string, MediaKind>([
  ["image/jpeg", "IMAGE"],
  ["image/png", "IMAGE"],
  ["image/webp", "IMAGE"],
  ["image/gif", "IMAGE"],
  ["video/mp4", "VIDEO"],
  ["video/quicktime", "VIDEO"],
  ["application/pdf", "DOCUMENT"],
]);

export const mediaUploadLimits = {
  maxFiles: 20,
  maxFileSizeBytes: 50 * 1024 * 1024,
  allowedMimeTypes: [...allowedTypes.keys()],
};

export type MediaIntentFile = {
  name: string;
  type: string;
  size: number;
};

export type MediaUploadIntent = {
  id: string;
  uploadUrl: string;
  publicUrl: string;
  kind: MediaKind;
  mimeType: string;
  originalName: string;
  sizeBytes: number;
  scanStatus: "stubbed-clean";
};

export function inferMediaKind(mimeType: string): MediaKind | null {
  return allowedTypes.get(mimeType.toLowerCase()) ?? null;
}

export function createMediaUploadIntents(files: MediaIntentFile[]) {
  if (files.length > mediaUploadLimits.maxFiles) {
    throw new Error("You can upload up to 20 files per listing.");
  }

  return files.map((file) => {
    const kind = inferMediaKind(file.type);

    if (!kind) {
      throw new Error(`${file.name} is not an allowed media type.`);
    }

    if (file.size > mediaUploadLimits.maxFileSizeBytes) {
      throw new Error(`${file.name} exceeds the 50MB upload limit.`);
    }

    const id = randomUUID();
    const extension = file.name.includes(".") ? file.name.split(".").pop() : "bin";

    return {
      id,
      uploadUrl: `/api/listings/media-intent/${id}`,
      publicUrl: `https://res.cloudinary.com/nestfind-stub/${id}.${extension}`,
      kind,
      mimeType: file.type,
      originalName: file.name,
      sizeBytes: file.size,
      scanStatus: "stubbed-clean",
    } satisfies MediaUploadIntent;
  });
}

export function toListingMediaInput(intent: MediaUploadIntent): ListingMediaInput {
  return {
    url: intent.publicUrl,
    kind: intent.kind,
    mimeType: intent.mimeType,
    sizeBytes: intent.sizeBytes,
    originalName: intent.originalName,
    publicId: intent.id,
  };
}
