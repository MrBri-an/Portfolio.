"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarClock,
  Check,
  FileUp,
  ImagePlus,
  MapPin,
  QrCode,
} from "lucide-react";

import { CategoryGrid } from "@/components/marketplace/category-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { mediaQualityOptions } from "@/lib/marketplace";
import { mediaUploadLimits } from "@/lib/services/media-storage";
import { cn, formatCurrency, formatPricePeriod } from "@/lib/utils";
import type {
  CategoryRecord,
  ListingMediaInput,
  ListingStatus,
  PricePeriod,
} from "@/types/marketplace";

type NewListingFormProps = {
  categories: CategoryRecord[];
  mediaQuality: "high" | "medium" | "low";
};

type MediaIntentResponse = {
  intents: Array<{
    id: string;
    publicUrl: string;
    kind: ListingMediaInput["kind"];
    mimeType: string;
    originalName: string;
    sizeBytes: number;
  }>;
  message?: string;
};

const steps = ["Category", "Details", "Pricing", "Location", "Media", "Review"];

const pricePeriods: { value: PricePeriod; label: string }[] = [
  { value: "PER_YEAR", label: "Per year" },
  { value: "PER_MONTH", label: "Per month" },
  { value: "FOR_SALE", label: "For sale" },
  { value: "NEGOTIABLE", label: "Negotiable" },
];

const statuses: { value: ListingStatus; label: string }[] = [
  { value: "AVAILABLE", label: "Available" },
  { value: "RENTED", label: "Rented" },
  { value: "SOLD", label: "Sold" },
];

export function NewListingForm({
  categories,
  mediaQuality,
}: NewListingFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [pricePeriod, setPricePeriod] = useState<PricePeriod>("PER_YEAR");
  const [locationText, setLocationText] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [status, setStatus] = useState<ListingStatus>("AVAILABLE");
  const [expiresAt, setExpiresAt] = useState("");
  const [mediaItems, setMediaItems] = useState<ListingMediaInput[]>([]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const selectedCategory = categories.find((category) => category.id === selectedCategoryId);
  const qualityLabel = useMemo(
    () =>
      mediaQualityOptions.find((option) => option.value === mediaQuality)?.label ??
      "High (HD)",
    [mediaQuality],
  );

  function validateCurrentStep() {
    if (step === 0 && !selectedCategoryId) {
      return "Choose a category before continuing.";
    }

    if (step === 1 && (title.trim().length < 8 || description.trim().length < 30)) {
      return "Add a clear title and at least 30 characters of description.";
    }

    if (step === 2 && (!price || Number(price) <= 0)) {
      return "Enter a valid price.";
    }

    if (step === 3 && locationText.trim().length < 3) {
      return "Add the property location.";
    }

    return null;
  }

  function continueToNextStep() {
    const message = validateCurrentStep();

    if (message) {
      setError(message);
      return;
    }

    setError(null);
    setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  function prepareMedia(files: FileList | null) {
    if (!files?.length) {
      return;
    }

    const selectedFiles = Array.from(files);

    if (mediaItems.length + selectedFiles.length > mediaUploadLimits.maxFiles) {
      setError("You can attach up to 20 media files.");
      return;
    }

    setError(null);
    startTransition(async () => {
      const response = await fetch("/api/listings/media-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          files: selectedFiles.map((file) => ({
            name: file.name,
            type: file.type,
            size: file.size,
          })),
        }),
      });
      const data = (await response.json()) as MediaIntentResponse;

      if (!response.ok) {
        setError(data.message || "Unable to prepare media uploads.");
        return;
      }

      setMediaItems((current) => [
        ...current,
        ...data.intents.map((intent) => ({
          url: intent.publicUrl,
          kind: intent.kind,
          mimeType: intent.mimeType,
          originalName: intent.originalName,
          sizeBytes: intent.sizeBytes,
          publicId: intent.id,
        })),
      ]);
    });
  }

  function publishListing() {
    const message = validateCurrentStep();

    if (message || !selectedCategoryId) {
      setError(message ?? "Complete the listing before publishing.");
      return;
    }

    setError(null);
    startTransition(async () => {
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryId: selectedCategoryId,
          title,
          description,
          price: Number(price),
          pricePeriod,
          locationText,
          latitude: latitude ? Number(latitude) : null,
          longitude: longitude ? Number(longitude) : null,
          status,
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
          mediaItems,
        }),
      });

      const data = (await response.json()) as { id?: string; message?: string };

      if (!response.ok || !data.id) {
        setError(data.message || "Unable to publish the listing.");
        return;
      }

      router.push(`/listings/${data.id}`);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {steps.map((label, index) => (
          <button
            key={label}
            type="button"
            className={cn(
              "flex h-12 items-center justify-center rounded-xl border px-3 text-sm font-medium transition",
              step === index
                ? "border-primary bg-primary text-white"
                : index < step
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-border bg-muted/40 text-muted-foreground",
            )}
            onClick={() => setStep(index)}
          >
            {index < step ? <Check className="mr-2 h-4 w-4" /> : null}
            {label}
          </button>
        ))}
      </div>

      {step === 0 ? (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Choose a property category</h2>
            <p className="text-sm text-muted-foreground">
              Categories power feed filters, admin review, and future recommendations.
            </p>
          </div>
          <CategoryGrid
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelect={setSelectedCategoryId}
          />
        </div>
      ) : null}

      {step === 1 ? (
        <div className="grid gap-5">
          <div className="space-y-2">
            <Label htmlFor="title">Listing title</Label>
            <Input
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="4-bedroom duplex with rooftop lounge"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Rich description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={8}
              placeholder="Describe rooms, power, water, access, landmarks, viewing terms, and any inspection requirements."
            />
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-2">
            <Label htmlFor="price">Price (NGN)</Label>
            <Input
              id="price"
              inputMode="numeric"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              placeholder="18500000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price-period">Price period</Label>
            <select
              id="price-period"
              value={pricePeriod}
              onChange={(event) => setPricePeriod(event.target.value as PricePeriod)}
              className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
            >
              {pricePeriods.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Property status</Label>
            <select
              id="status"
              value={status}
              onChange={(event) => setStatus(event.target.value as ListingStatus)}
              className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
            >
              {statuses.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="expires-at">Listing expiry</Label>
            <Input
              id="expires-at"
              type="date"
              value={expiresAt}
              onChange={(event) => setExpiresAt(event.target.value)}
            />
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="grid gap-5">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="location"
                value={locationText}
                onChange={(event) => setLocationText(event.target.value)}
                className="pl-9"
                placeholder="Lekki Phase 1, Lagos"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                value={latitude}
                onChange={(event) => setLatitude(event.target.value)}
                placeholder="6.4474"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                value={longitude}
                onChange={(event) => setLongitude(event.target.value)}
                placeholder="3.4723"
              />
            </div>
          </div>
        </div>
      ) : null}

      {step === 4 ? (
        <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Attach media</h2>
              <p className="text-sm text-muted-foreground">
                Up to 20 JPG, PNG, WEBP, GIF, MP4, MOV, or PDF files. Storage and malware scan
                are stubbed clean locally until service keys are configured.
              </p>
            </div>
            <Label
              htmlFor="media-files"
              className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-[16px] border border-dashed border-border bg-muted/30 p-6 text-center transition hover:border-primary"
            >
              <ImagePlus className="mb-3 h-8 w-8 text-primary" />
              <span className="font-medium">Choose media files</span>
              <span className="mt-1 text-xs text-muted-foreground">
                Saved quality: {qualityLabel}
              </span>
              <Input
                id="media-files"
                type="file"
                multiple
                accept={mediaUploadLimits.allowedMimeTypes.join(",")}
                className="sr-only"
                onChange={(event) => prepareMedia(event.target.files)}
              />
            </Label>
            <div className="grid gap-2">
              {mediaItems.map((item, index) => (
                <div
                  key={`${item.publicId}-${index}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border p-3 text-sm"
                >
                  <span className="inline-flex min-w-0 items-center gap-2">
                    <FileUp className="h-4 w-4 shrink-0 text-primary" />
                    <span className="truncate">
                      {item.originalName ?? `Media ${index + 1}`}
                    </span>
                  </span>
                  <Badge variant="outline" className="rounded-full">
                    {item.kind}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center rounded-[16px] border border-border bg-muted/30 p-5 text-center">
            <QrCode className="mb-3 h-16 w-16 text-primary" />
            <p className="font-medium">Mobile upload QR</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Stubbed for local mode. The adapter will issue a secure mobile upload session
              when storage credentials are live.
            </p>
          </div>
        </div>
      ) : null}

      {step === 5 ? (
        <div className="grid gap-4 rounded-[16px] border border-border p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{selectedCategory?.name ?? "No category"}</Badge>
            <Badge variant="outline">{status}</Badge>
            {expiresAt ? (
              <Badge variant="outline" className="gap-1">
                <CalendarClock className="h-3.5 w-3.5" />
                Expires {expiresAt}
              </Badge>
            ) : null}
          </div>
          <div>
            <h2 className="text-2xl font-semibold">{title || "Untitled listing"}</h2>
            <p className="mt-2 text-muted-foreground">
              {description || "No description added yet."}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-muted/40 p-4">
              <p className="text-xs text-muted-foreground">Price</p>
              <p className="mt-1 font-semibold">
                {price ? formatCurrency(Number(price)) : "Not set"}{" "}
                {formatPricePeriod(pricePeriod)}
              </p>
            </div>
            <div className="rounded-xl bg-muted/40 p-4">
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="mt-1 font-semibold">{locationText || "Not set"}</p>
            </div>
            <div className="rounded-xl bg-muted/40 p-4">
              <p className="text-xs text-muted-foreground">Media</p>
              <p className="mt-1 font-semibold">{mediaItems.length} files</p>
            </div>
          </div>
        </div>
      ) : null}

      {error ? <p className="text-sm text-rose-500">{error}</p> : null}

      <div className="flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          className="rounded-full"
          disabled={step === 0 || isPending}
          onClick={() => setStep((current) => Math.max(current - 1, 0))}
        >
          Back
        </Button>
        {step < steps.length - 1 ? (
          <Button type="button" className="rounded-full" onClick={continueToNextStep}>
            Continue
          </Button>
        ) : (
          <Button
            type="button"
            className="rounded-full"
            disabled={isPending}
            onClick={publishListing}
          >
            {isPending ? "Publishing..." : "Publish listing"}
          </Button>
        )}
      </div>
    </div>
  );
}
