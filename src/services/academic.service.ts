import apiClient from "@/lib/api-client";
import type { ApiResponse, Department, Program, Course } from "@/types";

export const departmentService = {
  async getAll() {
    const { data } = await apiClient.get<ApiResponse<Department[]>>("/departments");
    return data.data;
  },
  async getById(id: string) {
    const { data } = await apiClient.get<ApiResponse<Department>>(`/departments/${id}`);
    return data.data;
  },
  async create(name: string) {
    const { data } = await apiClient.post<ApiResponse<Department>>("/departments", { name });
    return data.data;
  },
  async update(id: string, name: string) {
    const { data } = await apiClient.put<ApiResponse<Department>>(`/departments/${id}`, { name });
    return data.data;
  },
  async delete(id: string) {
    await apiClient.delete(`/departments/${id}`);
  },
};

export const programService = {
  async getAll(departmentId?: string) {
    const params = departmentId ? { departmentId } : {};
    const { data } = await apiClient.get<ApiResponse<Program[]>>("/programs", { params });
    return data.data;
  },
  async getById(id: string) {
    const { data } = await apiClient.get<ApiResponse<Program>>(`/programs/${id}`);
    return data.data;
  },
  async create(name: string, departmentId: string) {
    const { data } = await apiClient.post<ApiResponse<Program>>("/programs", { name, departmentId });
    return data.data;
  },
  async update(id: string, payload: { name?: string; departmentId?: string }) {
    const { data } = await apiClient.put<ApiResponse<Program>>(`/programs/${id}`, payload);
    return data.data;
  },
  async delete(id: string) {
    await apiClient.delete(`/programs/${id}`);
  },
};

export const courseService = {
  async getAll(params: { programId?: string; semester?: number } = {}) {
    const { data } = await apiClient.get<ApiResponse<Course[]>>("/courses", { params });
    return data.data;
  },
  async getById(id: string) {
    const { data } = await apiClient.get<ApiResponse<Course>>(`/courses/${id}`);
    return data.data;
  },
  async create(name: string, programId: string, semester: number) {
    const { data } = await apiClient.post<ApiResponse<Course>>("/courses", { name, programId, semester });
    return data.data;
  },
  async update(id: string, payload: { name?: string; programId?: string; semester?: number }) {
    const { data } = await apiClient.put<ApiResponse<Course>>(`/courses/${id}`, payload);
    return data.data;
  },
  async delete(id: string) {
    await apiClient.delete(`/courses/${id}`);
  },
};