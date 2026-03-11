import apiClient from "@/lib/api-client";
import type { ApiResponse, Rating } from "@/types";

export const ratingService = {
  async rate(paperId: string, rating: number) {
    const { data } = await apiClient.post<ApiResponse<{ rating: number; average: number; count: number }>>(
      `/ratings/${paperId}`, { rating }
    );
    return data.data;
  },

  async getPaperRatings(paperId: string) {
    const { data } = await apiClient.get<ApiResponse<{ ratings: Rating[]; average: number; count: number }>>(
      `/ratings/${paperId}`
    );
    return data.data;
  },
};