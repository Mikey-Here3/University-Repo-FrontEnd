"use client";
import { useState } from "react";
import { Star } from "lucide-react";
import { useRatePaper } from "@/hooks/use-papers";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";

interface Props {
  paperId: string;
  currentRating?: number | null;
  average?: number | null;
  count?: number;
  readonly?: boolean;
}

export function RatingStars({ paperId, currentRating = null, average = 0, count = 0, readonly = false }: Props) {
  const [hover, setHover] = useState(0);
  const { isAuthenticated } = useAuthStore();
  const { mutate: rate, isPending } = useRatePaper();

  const displayRating = hover || currentRating || 0;

  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readonly || !isAuthenticated || isPending}
            onClick={() => rate({ paperId, rating: star })}
            onMouseEnter={() => !readonly && setHover(star)}
            onMouseLeave={() => setHover(0)}
            className={cn(
              "p-0.5 transition-colors disabled:cursor-default",
              !readonly && isAuthenticated && "cursor-pointer hover:scale-110"
            )}
          >
            <Star
              className={cn(
                "h-5 w-5",
                star <= displayRating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              )}
            />
          </button>
        ))}
      </div>
      <span className="text-sm text-muted-foreground">
        {average?.toFixed(1)} ({count} {count === 1 ? "rating" : "ratings"})
      </span>
    </div>
  );
}