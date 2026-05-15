"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function BackHomeButton() {
  return (
    <Link
      href="/#home"
      onClick={(event) => {
        event.preventDefault();
        window.location.assign("/#home");
      }}
      className="relative z-20 mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:-translate-y-0.5 hover:border-primary/40 hover:text-foreground hover:shadow-lg hover:shadow-primary/10"
    >
      <ArrowLeft className="h-4 w-4" />
      Back home
    </Link>
  );
}
