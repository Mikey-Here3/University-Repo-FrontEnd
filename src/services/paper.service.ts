import apiClient from "@/lib/api-client";
import type { ApiResponse, PaginatedResponse, Paper, PaperFilters } from "@/types";

export const paperService = {
  async getAll(filters: PaperFilters = {}) {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== undefined && v !== "")
    );
    const { data } = await apiClient.get<PaginatedResponse<Paper>>("/papers", { params });
    return data;
  },

  async getById(id: string) {
    const { data } = await apiClient.get<ApiResponse<Paper>>(`/papers/${id}`);
    return data.data;
  },

  async create(formData: FormData, onUploadProgress?: (progress: number) => void) {
    const { data } = await apiClient.post<ApiResponse<Paper>>("/papers", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (event) => {
        if (event.total && onUploadProgress) {
          onUploadProgress(Math.round((event.loaded * 100) / event.total));
        }
      },
    });
    return data.data;
  },

  async update(id: string, formData: FormData) {
    const { data } = await apiClient.put<ApiResponse<Paper>>(`/papers/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data;
  },

  async delete(id: string) {
    await apiClient.delete(`/papers/${id}`);
  },

  async getMyUploads(params: { page?: number; limit?: number } = {}) {
    const { data } = await apiClient.get<PaginatedResponse<Paper>>("/papers/my-uploads", { params });
    return data;
  },

  async download(id: string) {
    const { data } = await apiClient.get<ApiResponse<{ fileUrl: string; title: string }>>(`/papers/${id}/download`);
    return data.data;
  },
};