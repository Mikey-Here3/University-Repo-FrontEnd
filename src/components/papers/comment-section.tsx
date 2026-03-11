"use client";
import { useState } from "react";
import { useComments, useCreateComment, useDeleteComment } from "@/hooks/use-comments";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Pagination } from "@/components/common/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRelativeDate } from "@/lib/utils";
import { Loader2, Trash2, MessageSquare } from "lucide-react";

interface Props {
  paperId: string;
}

export function CommentSection({ paperId }: Props) {
  const [page, setPage] = useState(1);
  const [newComment, setNewComment] = useState("");
  const { user, isAuthenticated } = useAuthStore();
  const { data, isLoading } = useComments(paperId, page);
  const { mutate: create, isPending: creating } = useCreateComment();
  const { mutate: remove } = useDeleteComment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    create({ paperId, comment: newComment.trim() }, { onSuccess: () => setNewComment("") });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        Comments {data?.pagination && `(${data.pagination.total})`}
      </h3>

      {isAuthenticated && (
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
          />
          <Button type="submit" disabled={creating || !newComment.trim()} size="sm">
            {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Post Comment
          </Button>
        </form>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {data?.data.map((comment) => (
            <div key={comment.id} className="flex gap-3 p-3 rounded-lg bg-muted/50">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {comment.user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{comment.user.name}</span>
                    <span className="text-xs text-muted-foreground">{formatRelativeDate(comment.createdAt)}</span>
                  </div>
                  {(user?.id === comment.userId || user?.role === "ADMIN") && (
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => remove(comment.id)}>
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-red-500" />
                    </Button>
                  )}
                </div>
                <p className="mt-1 text-sm whitespace-pre-wrap">{comment.comment}</p>
              </div>
            </div>
          ))}

          {data?.data.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No comments yet. Be the first!</p>
          )}

          {data?.pagination && (
            <Pagination pagination={data.pagination} onPageChange={setPage} />
          )}
        </div>
      )}
    </div>
  );
}