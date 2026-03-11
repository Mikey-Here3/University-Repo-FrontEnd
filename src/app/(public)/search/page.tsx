"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { usePapers } from "@/hooks/use-papers";
import { PaperCard } from "@/components/papers/paper-card";
import { Pagination } from "@/components/common/pagination";
import { cn } from "@/lib/utils";
import { Search, FileText, X } from "lucide-react";

const E = [0.22, 1, 0.36, 1] as const;

function CardSkeleton() {
  return <div className="h-56 rounded-2xl border border-border bg-card animate-pulse" />;
}

export default function SearchPage() {
  const searchParams    = useSearchParams();
  const initialQuery    = searchParams.get("q") ?? "";
  const [query,    setQuery]    = useState(initialQuery);
  const [debounced, setDebounced] = useState(initialQuery);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(query);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [query]);

  const { data, isLoading } = usePapers({
    search: debounced || undefined,
    page,
    limit: 12,
  });

  const total = data?.pagination?.total ?? 0;

  return (
    <div className="relative min-h-screen bg-background">
      {/* Ambient */}
      <div className="absolute inset-0 hero-gradient opacity-70" aria-hidden />
      <div className="absolute inset-0 bg-dot-grid opacity-30" aria-hidden />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: E }}
          className="text-center space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-[10px] font-black tracking-[0.14em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
            Archive Search
          </div>

          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">
            Search Papers
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto text-base leading-relaxed">
            Search across thousands of past papers by title, subject, teacher, or keyword.
          </p>

          {/* Search input */}
          <div className="relative max-w-xl mx-auto group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, description, or teacher…"
              autoFocus
              className={cn(
                "w-full h-13 rounded-2xl border border-border bg-card shadow-md",
                "pl-12 pr-12 text-base text-foreground placeholder:text-muted-foreground/60",
                "outline-none transition-all duration-200",
                "hover:border-primary/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/10",
              )}
              style={{ height: "52px" }}
            />
            <AnimatePresence>
              {query && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Result count */}
          <AnimatePresence>
            {debounced && data?.pagination && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm text-muted-foreground"
              >
                <span className="font-bold text-foreground">{total}</span>{" "}
                {total === 1 ? "result" : "results"} for{" "}
                <span className="font-semibold text-primary">&ldquo;{debounced}&rdquo;</span>
              </motion.p>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-border" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-border" />
          </div>
        </motion.div>

        {/* States */}
        <AnimatePresence mode="wait">

          {/* Prompt to type */}
          {!debounced && (
            <motion.div
              key="prompt"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-5 py-24 text-center"
            >
              <div className="w-20 h-20 rounded-3xl border border-border bg-card flex items-center justify-center shadow-md">
                <Search className="w-9 h-9 text-muted-foreground" />
              </div>
              <div>
                <p className="font-bold text-base text-foreground">Start typing to search</p>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                  Search across all papers, subjects, teachers, and descriptions in the archive.
                </p>
              </div>
            </motion.div>
          )}

          {/* Loading */}
          {debounced && isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
            </motion.div>
          )}

          {/* No results */}
          {debounced && !isLoading && !data?.data.length && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-5 py-24 text-center"
            >
              <div className="w-20 h-20 rounded-3xl border border-border bg-card flex items-center justify-center shadow-md">
                <FileText className="w-9 h-9 text-muted-foreground" />
              </div>
              <div>
                <p className="font-bold text-base text-foreground">No papers found</p>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                  Nothing matched &ldquo;{debounced}&rdquo;. Try different keywords or check your spelling.
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
                onClick={() => setQuery("")}
                className="flex items-center gap-2 h-9 px-5 rounded-xl border border-border bg-card text-[12px] font-semibold text-muted-foreground hover:text-foreground transition-all"
              >
                <X className="w-3.5 h-3.5" /> Clear search
              </motion.button>
            </motion.div>
          )}

          {/* Results grid */}
          {debounced && !isLoading && !!data?.data.length && (
            <motion.div
              key={`results-${debounced}-${page}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <motion.div
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.06, delayChildren: 0.02 } },
                }}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {data.data.map((paper) => (
                  <motion.div
                    key={paper.id}
                    variants={{
                      hidden: { opacity: 0, scale: 0.95 },
                      show: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: E } },
                    }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  >
                    <PaperCard paper={paper} />
                  </motion.div>
                ))}
              </motion.div>

              {data.pagination && data.pagination.totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Pagination
                    pagination={data.pagination}
                    onPageChange={(p) => {
                      setPage(p);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  />
                </motion.div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}