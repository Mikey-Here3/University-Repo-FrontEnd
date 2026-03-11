import apiClient from "@/lib/api-client";
import type { ApiResponse, ContactMessage } from "@/types";

export const contactService = {
  async send(data: { name: string; email: string; message: string }) {
    const res = await apiClient.post<ApiResponse<ContactMessage>>("/contact", data);
    return res.data;
  },
};