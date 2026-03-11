"use client";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { useToggleBookmark } from "@/hooks/use-papers";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";

interface Props {
  paperId: string;
  isBookmarked?: boolean;
  size?: "sm" | "default" | "lg" | "icon";
}

export function BookmarkButton({ paperId, isBookmarked = false, size = "icon" }: Props) {
  const { isAuthenticated } = useAuthStore();
  const { mutate: toggle, isPending } = useToggleBookmark();

  if (!isAuthenticated) return null;

  return (
    <Button
      variant="outline"
      size={size}
      disabled={isPending}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(paperId);
      }}
      className={cn(isBookmarked && "text-primary border-primary")}
    >
      <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current")} />
      {size !== "icon" && <span className="ml-2">{isBookmarked ? "Bookmarked" : "Bookmark"}</span>}
    </Button>
  );
}