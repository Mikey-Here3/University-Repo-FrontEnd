"use client";
import { useQuery } from "@tanstack/react-query";
import { departmentService, programService, courseService } from "@/services/academic.service";

export function useDepartments() {
  return useQuery({
    queryKey: ["departments"],
    queryFn: departmentService.getAll,
    staleTime: 10 * 60 * 1000,
  });
}

export function usePrograms(departmentId?: string) {
  return useQuery({
    queryKey: ["programs", departmentId],
    queryFn: () => programService.getAll(departmentId),
    enabled: !!departmentId,
    staleTime: 10 * 60 * 1000,
  });
}

export function useCourses(programId?: string) {
  return useQuery({
    queryKey: ["courses", programId],
    queryFn: () => courseService.getAll({ programId }),
    enabled: !!programId,
    staleTime: 10 * 60 * 1000,
  });
}