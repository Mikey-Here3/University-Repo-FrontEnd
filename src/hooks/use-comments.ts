"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { commentService } from "@/services/comment.service";
import { toast } from "sonner";
import { getApiError } from "@/lib/utils";

export function useComments(paperId: string, page = 1) {
  return useQuery({
    queryKey: ["comments", paperId, page],
    queryFn: () => commentService.getByPaper(paperId, { page, limit: 20 }),
    enabled: !!paperId,
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ paperId, comment }: { paperId: string; comment: string }) =>
      commentService.create(paperId, comment),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["comments", vars.paperId] });
      toast.success("Comment added");
    },
    onError: (error) => toast.error(getApiError(error)),
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => commentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      toast.success("Comment deleted");
    },
    onError: (error) => toast.error(getApiError(error)),
  });
}