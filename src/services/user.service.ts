import apiClient from "@/lib/api-client";
import type { ApiResponse, PaginatedResponse, User, UserFilters } from "@/types";

export const userService = {
  async getAll(filters: UserFilters = {}) {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== undefined && v !== "")
    );
    const { data } = await apiClient.get<PaginatedResponse<User>>("/users", { params });
    return data;
  },
  async getById(id: string) {
    const { data } = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return data.data;
  },
  async create(payload: { email: string; password: string; name: string; role: string }) {
    const { data } = await apiClient.post<ApiResponse<User>>("/users", payload);
    return data.data;
  },
  async update(id: string, payload: Record<string, unknown>) {
    const { data } = await apiClient.put<ApiResponse<User>>(`/users/${id}`, payload);
    return data.data;
  },
  async delete(id: string) {
    await apiClient.delete(`/users/${id}`);
  },
};