"use client";

import { Button } from "@/components/ui/button";

export function HeroMobileCtas() {
  return (
    <div className="pointer-events-auto relative z-20 mx-auto mt-7 flex w-full max-w-sm flex-col items-center justify-center gap-2.5 sm:max-w-md sm:flex-row lg:hidden">
      <Button
        type="button"
        className="h-10 min-w-36 cursor-pointer rounded-full px-5 text-sm shadow-lg shadow-primary/15"
        onClick={() => {
          window.location.assign("/gallery");
        }}
      >
        View My Work
      </Button>
      <Button
        type="button"
        variant="outline"
        className="h-10 min-w-40 cursor-pointer rounded-full bg-card/60 px-5 text-sm"
        onClick={() => {
          window.location.assign("/#contact");
        }}
      >
        Let&apos;s Work Together
      </Button>
    </div>
  );
}
