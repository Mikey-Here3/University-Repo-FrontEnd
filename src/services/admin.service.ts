import apiClient from "@/lib/api-client";
import type { ApiResponse, Paper, PaginatedResponse, PaperStatus } from "@/types";

export interface DashboardStats {
  totalUsers:       number;
  totalPapers:      number;
  pendingPapers:    number;
  pendingReports:   number;
  totalDepartments: number;
  totalDownloads:   number;
  recentUploads:    number;
}

interface ModerationLog {
  id:         string;
  action:     string;
  targetType: string;
  targetId:   string;
  details:    string | null;
  timestamp:  string;
  admin:      { id: string; name: string };
}

// ── Shared params type — reuse everywhere instead of inline objects ──
export interface AdminPapersParams {
  page?:   number;
  limit?:  number;
  status?: PaperStatus;
  search?: string;       // ← was missing — caused the build error
}

export const adminService = {

  getDashboardStats: async (): Promise<DashboardStats> => {
    const { data } = await apiClient.get<ApiResponse<DashboardStats>>("/admin/dashboard");
    return data.data;
  },
updatePaper: async (id: string, data: Partial<Paper>): Promise<Paper> => {
  const res = await apiClient.patch(`/admin/papers/${id}`, data);
  return res.data;
},
  // ── FIX 1: use AdminPapersParams (includes search)
  // ── FIX 2: endpoint changed from "/papers" → "/admin/papers"
  //           "/papers" only returns APPROVED papers (public endpoint).
  //           "/admin/papers" returns ALL papers across every status.
  getPapers: async (params: AdminPapersParams = {}): Promise<PaginatedResponse<Paper>> => {
    const { data } = await apiClient.get<PaginatedResponse<Paper>>("/admin/papers", { params });
    return data;
  },

  approvePaper: async (id: string): Promise<void> => {
    await apiClient.put(`/admin/papers/${id}/approve`);
  },

  rejectPaper: async (id: string, reason?: string): Promise<void> => {
    await apiClient.put(`/admin/papers/${id}/reject`, { reason });
  },

  restrictPaper: async (id: string): Promise<Paper> => {
    const res = await apiClient.patch(`/admin/papers/${id}/restrict`);
    return res.data;
  },

  holdPaper: async (id: string): Promise<Paper> => {
    const res = await apiClient.patch(`/admin/papers/${id}`, { status: "PENDING" });
    return res.data;
  },

  deletePaper: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/papers/${id}`);
  },

  blockUser: async (id: string): Promise<void> => {
    await apiClient.put(`/admin/users/${id}/block`);
  },

  unblockUser: async (id: string): Promise<void> => {
    await apiClient.put(`/admin/users/${id}/unblock`);
  },

  getModerationLogs: async (
    params: { page?: number; limit?: number; action?: string } = {},
  ): Promise<PaginatedResponse<ModerationLog>> => {
    const { data } = await apiClient.get<PaginatedResponse<ModerationLog>>(
      "/admin/moderation-logs",
      { params },
    );
    return data;
  },
};