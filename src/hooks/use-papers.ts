"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paperService } from "@/services/paper.service";
import { bookmarkService } from "@/services/bookmark.service";
import { ratingService } from "@/services/rating.service";
import type { PaperFilters } from "@/types";
import { toast } from "sonner";
import { getApiError } from "@/lib/utils";

export function usePapers(filters: PaperFilters = {}) {
  return useQuery({
    queryKey: ["papers", filters],
    queryFn: () => paperService.getAll(filters),
    staleTime: 30000,
  });
}

export function usePaper(id: string) {
  return useQuery({
    queryKey: ["paper", id],
    queryFn: () => paperService.getById(id),
    enabled: !!id,
  });
}

export function useMyUploads(page = 1) {
  return useQuery({
    queryKey: ["my-uploads", page],
    queryFn: () => paperService.getMyUploads({ page }),
  });
}

export function useCreatePaper() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ formData, onProgress }: { formData: FormData; onProgress?: (p: number) => void }) =>
      paperService.create(formData, onProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["papers"] });
      queryClient.invalidateQueries({ queryKey: ["my-uploads"] });
      toast.success("Paper uploaded! Pending admin approval.");
    },
    onError: (error) => toast.error(getApiError(error)),
  });
}

export function useDeletePaper() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => paperService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["papers"] });
      queryClient.invalidateQueries({ queryKey: ["my-uploads"] });
      toast.success("Paper deleted");
    },
    onError: (error) => toast.error(getApiError(error)),
  });
}

export function useDownloadPaper() {
  return useMutation({
    mutationFn: (id: string) => paperService.download(id),
    onSuccess: (data) => {
      window.open(data.fileUrl, "_blank");
    },
    onError: (error) => toast.error(getApiError(error)),
  });
}

export function useToggleBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paperId: string) => bookmarkService.toggle(paperId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["paper"] });
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      toast.success(data.message);
    },
    onError: (error) => toast.error(getApiError(error)),
  });
}

export function useBookmarks(page = 1) {
  return useQuery({
    queryKey: ["bookmarks", page],
    queryFn: () => bookmarkService.getMyBookmarks({ page }),
  });
}

export function useRatePaper() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ paperId, rating }: { paperId: string; rating: number }) =>
      ratingService.rate(paperId, rating),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["paper", vars.paperId] });
      toast.success("Rating submitted");
    },
    onError: (error) => toast.error(getApiError(error)),
  });
}