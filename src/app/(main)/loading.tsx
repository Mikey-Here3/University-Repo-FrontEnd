// app/(dashboard)/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Hero banner skeleton */}
      <Skeleton className="h-36 rounded-2xl" />

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>

      {/* Two-col section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <Skeleton className="lg:col-span-3 h-72 rounded-2xl" />
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
        </div>
      </div>

      {/* Paper cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-56 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}