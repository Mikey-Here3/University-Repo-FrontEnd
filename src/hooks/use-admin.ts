"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { userService } from "@/services/user.service";
import { reportService } from "@/services/report.service";
import { toast } from "sonner";
import { getApiError } from "@/lib/utils";
import type { PaperStatus } from "@/types";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: () => adminService.getDashboardStats(),
    staleTime: 30000,
    retry: 1,
  });
}

export function useAdminPapers(params: { page?: number; limit?: number; status?: PaperStatus } = {}) {
  return useQuery({
    queryKey: ["admin", "papers", params],
    queryFn: () => adminService.getPapers(params),
  });
}

export function useApprovePaper() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.approvePaper(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin"] });
      toast.success("Paper approved");
    },
    onError: (e) => toast.error(getApiError(e)),
  });
}

export function useRejectPaper() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      adminService.rejectPaper(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin"] });
      toast.success("Paper rejected");
    },
    onError: (e) => toast.error(getApiError(e)),
  });
}

export function useAdminDeletePaper() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.deletePaper(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin"] });
      toast.success("Paper deleted");
    },
    onError: (e) => toast.error(getApiError(e)),
  });
}

export function useUsers(params: { page?: number; limit?: number; search?: string } = {}) {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: () => userService.getAll(params),
  });
}

export function useBlockUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.blockUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User blocked");
    },
    onError: (e) => toast.error(getApiError(e)),
  });
}

export function useUnblockUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.unblockUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User unblocked");
    },
    onError: (e) => toast.error(getApiError(e)),
  });
}

export function useReports(params: { page?: number; status?: string } = {}) {
  return useQuery({
    queryKey: ["admin", "reports", params],
    queryFn: () => reportService.getAll(params),
  });
}

export function useResolveReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reportService.resolve(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin"] });
      toast.success("Report resolved");
    },
    onError: (e) => toast.error(getApiError(e)),
  });
}

export function useModerationLogs(params: { page?: number; limit?: number; action?: string } = {}) {
  return useQuery({
    queryKey: ["admin", "logs", params],
    queryFn: () => adminService.getModerationLogs(params),
  });
}