"use client";

import { categoryIconMap } from "@/components/marketplace/icon-map";
import { cn } from "@/lib/utils";
import type { CategoryRecord } from "@/types/marketplace";

type CategoryGridProps = {
  categories: CategoryRecord[];
  selectedCategoryId: string | null;
  onSelect: (categoryId: string) => void;
};

export function CategoryGrid({
  categories,
  selectedCategoryId,
  onSelect,
}: CategoryGridProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => {
        const Icon =
          categoryIconMap[category.icon as keyof typeof categoryIconMap] ??
          categoryIconMap.Home;
        const isActive = selectedCategoryId === category.id;

        return (
          <button
            key={category.id}
            type="button"
            className={cn(
              "rounded-2xl border p-4 text-left transition hover:border-primary/50 hover:bg-primary/5",
              isActive && "border-primary bg-primary/10 shadow-sm",
            )}
            onClick={() => onSelect(category.id)}
          >
            <Icon className="h-5 w-5 text-primary" />
            <p className="mt-3 font-medium">{category.name}</p>
          </button>
        );
      })}
    </div>
  );
}
