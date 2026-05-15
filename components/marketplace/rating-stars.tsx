"use client";

import { Star } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type RatingStarsProps = {
  ratedProfileId: string;
  canRate: boolean;
  initialAverage: number;
  initialCount: number;
};

export function RatingStars({
  ratedProfileId,
  canRate,
  initialAverage,
  initialCount,
}: RatingStarsProps) {
  const [selectedScore, setSelectedScore] = useState(0);
  const [summary, setSummary] = useState({
    average: initialAverage,
    count: initialCount,
  });
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-3">
      <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
        <Star className="h-4 w-4 fill-current" />
        {summary.count
          ? `${summary.average.toFixed(1)} ★ · ${summary.count} ratings`
          : "No ratings yet"}
      </div>

      <div className="flex items-center gap-2">
        {Array.from({ length: 5 }, (_, index) => {
          const score = index + 1;
          return (
            <button
              key={score}
              type="button"
              disabled={!canRate}
              onClick={() => setSelectedScore(score)}
              className="transition disabled:cursor-not-allowed"
            >
              <Star
                className={cn(
                  "h-5 w-5",
                  score <= selectedScore
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-300",
                )}
              />
            </button>
          );
        })}
        <Button
          type="button"
          size="sm"
          className="rounded-full"
          disabled={!canRate || !selectedScore || isPending}
          onClick={() => {
            setError(null);
            startTransition(async () => {
              const response = await fetch(`/api/profile/${ratedProfileId}/rate`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  score: selectedScore,
                }),
              });

              const data = (await response.json()) as {
                message?: string;
                average?: number;
                count?: number;
              };

              if (!response.ok) {
                setError(data.message || "Unable to submit rating.");
                return;
              }

              setSummary({
                average: data.average ?? summary.average,
                count: data.count ?? summary.count,
              });
            });
          }}
        >
          {isPending ? "Saving..." : "Rate"}
        </Button>
      </div>

      {!canRate ? (
        <p className="text-sm text-muted-foreground">
          You can rate a user after exchanging at least one chat message with them.
        </p>
      ) : null}
      {error ? <p className="text-sm text-rose-500">{error}</p> : null}
    </div>
  );
}
