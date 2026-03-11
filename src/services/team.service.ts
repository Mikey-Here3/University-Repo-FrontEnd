import apiClient from "@/lib/api-client";
import type { ApiResponse, TeamMember } from "@/types";

export const teamService = {
  async getAll() {
    const { data } = await apiClient.get<ApiResponse<TeamMember[]>>("/team");
    return data.data;
  },
};