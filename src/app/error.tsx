"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <AlertTriangle className="h-16 w-16 text-red-500 mb-6" />
      <h1 className="text-3xl font-bold text-gray-900">Something went wrong</h1>
      <p className="mt-2 text-muted-foreground max-w-md text-center">
        An unexpected error occurred. Please try again.
      </p>
      <div className="mt-8 flex gap-3">
        <Button onClick={reset}>Try Again</Button>
        <Button variant="outline" onClick={() => (window.location.href = "/dashboard")}>
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}