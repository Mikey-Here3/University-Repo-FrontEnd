"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { usePapers } from "@/hooks/use-papers";
import { PaperCard } from "@/components/papers/paper-card";
import { PaperFiltersBar } from "@/components/papers/paper-filters";
import { Pagination } from "@/components/common/pagination";
import { EmptyState } from "@/components/common/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { onSelectChange } from "@/lib/select-handler";
import { FileText, SlidersHorizontal } from "lucide-react";
import type { PaperFilters } from "@/types";

const E = [0.22, 1, 0.36, 1] as const;

const SORT_OPTIONS = [
  { value: "createdAt:desc",      label: "Newest First"     },
  { value: "createdAt:asc",       label: "Oldest First"     },
  { value: "title:asc",           label: "Title A–Z"        },
  { value: "title:desc",          label: "Title Z–A"        },
  { value: "downloads:desc",      label: "Most Downloaded"  },
  { value: "ratingAverage:desc",  label: "Highest Rated"    },
  { value: "year:desc",           label: "Year (Newest)"    },
  { value: "year:asc",            label: "Year (Oldest)"    },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};
const vScale = {
  hidden: { opacity: 0, scale: 0.94, y: 10 },
  show:   { opacity: 1, scale: 1,    y: 0,
            transition: { duration: 0.42, ease: E } },
};

export default function PapersPage() {
  const [filters, setFilters] = useState<PaperFilters>({
    page: 1, limit: 12, sortBy: "createdAt", sortOrder: "desc",
  });
  const { data, isLoading } = usePapers(filters);

  const currentSort = `${filters.sortBy ?? "createdAt"}:${filters.sortOrder ?? "desc"}`;

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split(":");
    setFilters((f) => ({ ...f, sortBy, sortOrder: sortOrder as "asc" | "desc", page: 1 }));
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: E }}
        className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-blue-50/40 p-6"
      >
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary via-violet-400 to-indigo-400 opacity-70" />
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-primary/6 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-foreground tracking-tight">Browse Papers</h1>
              <p className="text-[13px] text-muted-foreground mt-0.5">
                Find past papers, notes, and academic resources
                {data?.pagination && (
                  <span className="ml-1.5 text-muted-foreground/60">
                    · {data.pagination.total} results
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <Select value={currentSort} onValueChange={onSelectChange(handleSortChange)}>
              <SelectTrigger className="w-44 h-9 rounded-xl border-border bg-card text-sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <PaperFiltersBar filters={filters} onChange={setFilters} />

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      ) : !data?.data.length ? (
        <EmptyState
          icon={FileText}
          title="No papers found"
          description="Try adjusting your filters or search terms."
        />
      ) : (
        <>
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {data.data.map((paper) => (
              <motion.div
                key={paper.id}
                variants={vScale}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <PaperCard paper={paper} />
              </motion.div>
            ))}
          </motion.div>
          {data.pagination && (
            <Pagination
              pagination={data.pagination}
              onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))}
            />
          )}
        </>
      )}
    </div>
  );
}