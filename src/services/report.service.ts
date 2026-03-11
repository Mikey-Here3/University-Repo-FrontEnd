import apiClient from "@/lib/api-client";
import type { ApiResponse, PaginatedResponse, Report, ReportReason } from "@/types";

export const reportService = {
  async create(paperId: string, reason: ReportReason, description?: string) {
    const { data } = await apiClient.post<ApiResponse<Report>>(`/reports/paper/${paperId}`, { reason, description });
    return data.data;
  },

  async getAll(params: { page?: number; limit?: number; status?: string } = {}) {
    const { data } = await apiClient.get<PaginatedResponse<Report>>("/reports", { params });
    return data;
  },

  async resolve(id: string) {
    const { data } = await apiClient.put<ApiResponse<Report>>(`/reports/${id}/resolve`);
    return data.data;
  },
};