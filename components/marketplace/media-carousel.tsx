"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, FileText, Maximize2, Play, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ListingMediaRecord } from "@/types/marketplace";

type MediaCarouselProps = {
  items: ListingMediaRecord[];
  className?: string;
};

export function MediaCarousel({ items, className }: MediaCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  if (!items.length) {
    return (
      <div
        className={cn(
          "flex h-72 items-center justify-center rounded-[24px] bg-muted text-sm text-muted-foreground",
          className,
        )}
      >
        No media yet
      </div>
    );
  }

  const showNumericCounter = items.length > 5;

  return (
    <div className={cn("relative overflow-hidden rounded-[24px] bg-slate-100 dark:bg-slate-900", className)}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {items.map((item) => (
            <div key={item.id} className="min-w-0 shrink-0 grow-0 basis-full">
              <div className="relative flex h-72 items-center justify-center bg-slate-100 dark:bg-slate-950">
                {item.kind === "VIDEO" ? (
                  <>
                    <video
                      controls
                      className="h-full w-full object-contain"
                      preload="metadata"
                      src={item.url}
                    />
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <span className="rounded-full bg-black/50 p-3 text-white">
                        <Play className="h-5 w-5 fill-current" />
                      </span>
                    </div>
                  </>
                ) : item.kind === "DOCUMENT" ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-full w-full flex-col items-center justify-center gap-3 text-muted-foreground"
                  >
                    <FileText className="h-10 w-10 text-primary" />
                    <span className="text-sm font-medium">
                      {item.originalName ?? "Property document"}
                    </span>
                  </a>
                ) : (
                  <button
                    type="button"
                    className="h-full w-full"
                    onClick={() => setIsLightboxOpen(true)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.url}
                      alt=""
                      className="h-full w-full object-contain"
                    />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {items.length > 1 ? (
        <>
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="absolute left-3 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full bg-white/90 shadow-sm"
            onClick={() => emblaApi?.scrollPrev()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="absolute right-3 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full bg-white/90 shadow-sm"
            onClick={() => emblaApi?.scrollNext()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      ) : null}

      {showNumericCounter ? (
        <div className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
          {selectedIndex + 1} / {items.length}
        </div>
      ) : items.length > 1 ? (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-black/45 px-3 py-1.5">
          {items.map((item, index) => (
            <span
              key={item.id}
              className={cn(
                "h-2.5 w-2.5 rounded-full bg-white/50",
                index === selectedIndex && "bg-primary",
              )}
            />
          ))}
        </div>
      ) : null}

      {items.some((item) => item.kind === "IMAGE") ? (
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="absolute left-3 top-3 h-9 w-9 rounded-full bg-white/90 shadow-sm"
          title="Open gallery"
          onClick={() => setIsLightboxOpen(true)}
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      ) : null}

      {isLightboxOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="absolute right-4 top-4 rounded-full"
            title="Close gallery"
            onClick={() => setIsLightboxOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
          <div className="max-h-[86vh] w-full max-w-6xl">
            {items[selectedIndex]?.kind === "IMAGE" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={items[selectedIndex].url}
                alt=""
                className="mx-auto max-h-[86vh] w-full object-contain"
              />
            ) : (
              <div className="flex min-h-96 items-center justify-center text-white">
                Select an image from the gallery.
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
