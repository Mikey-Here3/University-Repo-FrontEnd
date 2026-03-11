import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  return format(new Date(date), "MMM d, yyyy");
}

export function formatRelativeDate(date: string) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatFileSize(bytes: number | null | undefined) {
  if (!bytes) return "Unknown";
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

export function getContentTypeColor(type: string) {
  const colors: Record<string, string> = {
    MID_TERM: "bg-blue-100 text-blue-800",
    END_TERM: "bg-purple-100 text-purple-800",
    QUIZ: "bg-yellow-100 text-yellow-800",
    ASSIGNMENT: "bg-green-100 text-green-800",
    NOTES: "bg-orange-100 text-orange-800",
    IMPORTANT: "bg-red-100 text-red-800",
  };
  return colors[type] || "bg-gray-100 text-gray-800";
}

export function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    APPROVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    ACTIVE: "bg-green-100 text-green-800",
    BLOCKED: "bg-red-100 text-red-800",
    RESOLVED: "bg-blue-100 text-blue-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

export function getApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || "An error occurred";
  }
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred";
}

import axios from "axios";