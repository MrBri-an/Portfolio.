"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ViewWorkButton() {
  return (
    <Button asChild size="lg" className="rounded-full">
      <Link href="/gallery">
        View My Work
        <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    </Button>
  );
}
