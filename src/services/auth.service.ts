import apiClient from "@/lib/api-client";
import type { ApiResponse, User } from "@/types";

interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>("/auth/login", {
      email,
      password,
    });
    return data.data;
  },

  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>("/auth/register", {
      name,
      email,
      password,
    });
    return data.data;
  },

  async getProfile(): Promise<User> {
    const { data } = await apiClient.get<ApiResponse<User>>("/auth/profile");
    return data.data;
  },

  async updateProfile(payload: { name?: string; email?: string }): Promise<User> {
    const { data } = await apiClient.put<ApiResponse<User>>("/auth/profile", payload);
    return data.data;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.put("/auth/change-password", { currentPassword, newPassword });
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // Ignore logout errors
    }
  },
};