"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Maximize2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

type ZoomableImageProps = {
  src: string;
  alt: string;
  title?: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  fit?: "contain" | "cover";
};

export function ZoomableImage({
  src,
  alt,
  title,
  sizes,
  priority = false,
  className,
  imageClassName,
  fit = "contain",
}: ZoomableImageProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className={cn(
          "group/image relative block h-full w-full touch-manipulation overflow-hidden bg-black/20 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          className,
        )}
        aria-label={`View ${title ?? alt} clearly`}
        onClick={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn(
            "transition duration-500 group-hover/image:scale-[1.02]",
            fit === "cover" ? "object-cover" : "object-contain",
            imageClassName,
          )}
        />
        <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-white/25 bg-black/45 text-white opacity-100 backdrop-blur transition sm:opacity-0 sm:group-hover/image:opacity-100 sm:group-focus-visible/image:opacity-100">
          <Maximize2 className="h-4 w-4" />
        </span>
      </button>

      {open && typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              <motion.div
                className="fixed inset-0 z-[1000] grid place-items-center bg-black/88 p-3 backdrop-blur-sm sm:p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                role="dialog"
                aria-modal="true"
                aria-label={title ?? alt}
                onClick={() => setOpen(false)}
              >
                <button
                  type="button"
                  className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  aria-label="Close image preview"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
                <motion.div
                  className="relative h-[82vh] max-h-[900px] w-full max-w-[1280px] overflow-hidden rounded-2xl border border-white/15 bg-black shadow-2xl"
                  initial={{ scale: 0.96, y: 18 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.96, y: 18 }}
                  transition={{ duration: 0.24 }}
                  onClick={(event) => event.stopPropagation()}
                >
                  <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes="(min-width: 1280px) 1280px, 100vw"
                    className="object-contain"
                    priority
                  />
                </motion.div>
                {title ? (
                  <p className="mt-4 max-w-3xl text-center text-sm font-medium text-white/80">{title}</p>
                ) : null}
              </motion.div>
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
}
