import Image from "next/image";

import { profile } from "@/data/portfolio";
import { cn } from "@/lib/utils";

type AvatarMarkProps = {
  size?: "sm" | "md";
  className?: string;
};

export function AvatarMark({ size = "sm", className }: AvatarMarkProps) {
  return (
    <span
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden rounded-2xl border border-white/15 bg-card shadow-lg shadow-black/10",
        size === "sm" ? "h-10 w-10" : "h-14 w-14",
        className,
      )}
    >
      <Image
        src={profile.avatar}
        alt={`${profile.name} portrait`}
        fill
        sizes={size === "sm" ? "40px" : "56px"}
        className="object-cover"
        priority={size === "md"}
      />
    </span>
  );
}
