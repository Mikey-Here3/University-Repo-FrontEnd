import apiClient from "@/lib/api-client";
import type { ApiResponse, PaginatedResponse, Bookmark } from "@/types";

export const bookmarkService = {
  async toggle(paperId: string) {
    const { data } = await apiClient.post<ApiResponse<{ bookmarked: boolean }>>(`/bookmarks/${paperId}`);
    return data;
  },

  async getMyBookmarks(params: { page?: number; limit?: number } = {}) {
    const { data } = await apiClient.get<PaginatedResponse<Bookmark>>("/bookmarks", { params });
    return data;
  },
};