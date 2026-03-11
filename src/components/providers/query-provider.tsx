"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 min default — prevents rapid refetching
            gcTime: 5 * 60 * 1000,
            retry: 1, // Only retry once
            refetchOnWindowFocus: false, // Don't refetch when tab gains focus
            refetchOnReconnect: false,
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}