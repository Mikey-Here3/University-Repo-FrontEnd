"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { cn } from "@/lib/utils";
import {
  FileText, SlidersHorizontal, LayoutGrid,
  LayoutList, BookOpen, TrendingUp,
} from "lucide-react";
import type { PaperFilters } from "@/types";

const E = [0.22, 1, 0.36, 1] as const;

const SORT_OPTIONS = [
  { value: "createdAt:desc",     label: "Newest First"    },
  { value: "createdAt:asc",      label: "Oldest First"    },
  { value: "title:asc",          label: "Title A–Z"       },
  { value: "title:desc",         label: "Title Z–A"       },
  { value: "downloads:desc",     label: "Most Downloaded" },
  { value: "ratingAverage:desc", label: "Highest Rated"   },
  { value: "year:desc",          label: "Year (Newest)"   },
  { value: "year:asc",           label: "Year (Oldest)"   },
];

/*
 * ─── Animation variants ───────────────────────────────────────────
 * NOTE: Do NOT use useInView here.
 * With useInView + animate={inView ? "show" : "hidden"}, if the
 * intersection threshold is never crossed (e.g. -40px margin on small
 * viewports or when content is near the top), every card stays at
 * opacity:0 even though data is present. Always drive to "show".
 */
const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};
const vCard = {
  hidden: { opacity: 0, y: 16, scale: 0.95 },
  show:   { opacity: 1, y: 0,  scale: 1,
            transition: { duration: 0.42, ease: E } },
};

export default function PapersPage() {
  const [filters, setFilters] = useState<PaperFilters>({
    page: 1, limit: 12, sortBy: "createdAt", sortOrder: "desc",
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data, isLoading } = usePapers(filters);

  const currentSort =
    `${filters.sortBy ?? "createdAt"}:${filters.sortOrder ?? "desc"}`;

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split(":");
    setFilters((f) => ({
      ...f, sortBy, sortOrder: sortOrder as "asc" | "desc", page: 1,
    }));
  };

  const total   = data?.pagination?.total ?? 0;
  const page    = filters.page    ?? 1;
  const limit   = filters.limit   ?? 12;
  const from    = (page - 1) * limit + 1;
  const to      = Math.min(page * limit, total);

  return (
    <div className="space-y-6">

      {/* ── Hero ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: E }}
        className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-blue-50/50 p-6 md:p-8"
      >
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary via-violet-400 to-indigo-400 opacity-80" />
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.25] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, hsl(var(--foreground)/0.06) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ rotate: 6, scale: 1.06 }}
              transition={{ duration: 0.22 }}
              className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-sm shrink-0"
            >
              <FileText className="w-6 h-6 text-primary" />
            </motion.div>

            <div>
              <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                  Browse Papers
                </h1>
                <AnimatePresence>
                  {data?.pagination && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="hidden sm:flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 border border-primary/20 text-primary"
                    >
                      {data.pagination.total.toLocaleString()} results
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <p className="text-[13px] text-muted-foreground">
                Find past papers, notes, and academic resources
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {[
              { icon: BookOpen,   val: data?.pagination?.total ?? "—", label: "papers"  },
              { icon: TrendingUp, val: "Live",                          label: "updates" },
            ].map(({ icon: Icon, val, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card shadow-sm"
              >
                <Icon className="w-3 h-3 text-muted-foreground" />
                <span className="text-[12px] font-bold text-foreground">{val}</span>
                <span className="text-[11px] text-muted-foreground/60">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Filters ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: E }}
        className="space-y-3"
      >
        <PaperFiltersBar filters={filters} onChange={setFilters} />

        {/* Toolbar row */}
        <div className="flex items-center justify-between gap-3">
          {/* Result count */}
          <p className="text-[12px] text-muted-foreground">
            {isLoading
              ? "Loading…"
              : total === 0
                ? "No results"
                : `Showing ${from}–${to} of ${total}`}
          </p>

          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex items-center rounded-xl border border-border bg-card shadow-sm p-0.5 gap-0.5">
              {([
                { mode: "grid" as const, icon: LayoutGrid },
                { mode: "list" as const, icon: LayoutList },
              ]).map(({ mode, icon: Icon }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={cn(
                    "h-7 w-7 rounded-lg flex items-center justify-center transition-all duration-150",
                    viewMode === mode
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  aria-label={`${mode} view`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <Select
                value={currentSort}
                onValueChange={onSelectChange(handleSortChange)}
              >
                <SelectTrigger className="w-44 h-9 rounded-xl border-border bg-card shadow-sm text-sm">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Results ── */}
      {isLoading ? (
        /* Skeleton grid */
        <div className={cn(
          "grid gap-5",
          viewMode === "grid"
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1",
        )}>
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
          {/*
           * ─── FIX ───────────────────────────────────────────────────
           * animate="show" is ALWAYS set here (not tied to useInView).
           *
           * The old code used:
           *   const inView = useInView(ref, { once: true, margin: "-40px" })
           *   animate={inView ? "show" : "hidden"}
           *
           * When the intersection observer never fires (small viewport,
           * content near top of page, or observer timing), inView stays
           * false and every child keeps opacity:0 — the data exists but
           * cards are invisible. Dropping useInView entirely fixes it.
           * ───────────────────────────────────────────────────────────
           */}
          <motion.div
            key={`${filters.page}-${filters.sortBy}-${filters.sortOrder}`}
            variants={stagger}
            initial="hidden"
            animate="show"
            className={cn(
              "grid gap-5",
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1",
            )}
          >
            <AnimatePresence mode="popLayout">
              {data.data.map((paper) => (
                <motion.div
                  key={paper.id}
                  variants={vCard}
                  layout
                  whileHover={{ y: -4, transition: { duration: 0.18 } }}
                >
                  <PaperCard paper={paper} />
                </motion.div>
              ))}
            </AnimatePresence>
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