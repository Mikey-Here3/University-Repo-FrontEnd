import apiClient from "@/lib/api-client";
import type { ApiResponse, PaginatedResponse, Comment } from "@/types";

export const commentService = {
  async getByPaper(paperId: string, params: { page?: number; limit?: number } = {}) {
    const { data } = await apiClient.get<PaginatedResponse<Comment>>(`/comments/paper/${paperId}`, { params });
    return data;
  },

  async create(paperId: string, comment: string) {
    const { data } = await apiClient.post<ApiResponse<Comment>>(`/comments/paper/${paperId}`, { comment });
    return data.data;
  },

  async update(id: string, comment: string) {
    const { data } = await apiClient.put<ApiResponse<Comment>>(`/comments/${id}`, { comment });
    return data.data;
  },

  async delete(id: string) {
    await apiClient.delete(`/comments/${id}`);
  },
};