"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { usePapers } from "@/hooks/use-papers";
import { PaperCard } from "@/components/papers/paper-card";
import { Pagination } from "@/components/common/pagination";
import { EmptyState } from "@/components/common/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { TrendingUp, Download, Star, Trophy, Medal, Award } from "lucide-react";

const E = [0.22, 1, 0.36, 1] as const;

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.065, delayChildren: 0.05 } },
};
const vCard = {
  hidden: { opacity: 0, scale: 0.93, y: 14 },
  show:   { opacity: 1, scale: 1,    y: 0,
            transition: { duration: 0.46, ease: E } },
};

const RANK_CONFIG = [
  { icon: Trophy, color: "text-amber-500",   bg: "bg-amber-50",   border: "border-amber-200",   ring: "ring-amber-400/30",   size: "w-9 h-9"  },
  { icon: Medal,  color: "text-slate-500",   bg: "bg-slate-50",   border: "border-slate-200",   ring: "ring-slate-400/30",   size: "w-8 h-8"  },
  { icon: Award,  color: "text-orange-500",  bg: "bg-orange-50",  border: "border-orange-200",  ring: "ring-orange-400/30",  size: "w-7 h-7"  },
];

export default function TrendingPapersPage() {
  const [page,   setPage]   = useState(1);
  const [sortBy, setSortBy] = useState<"downloads" | "ratingAverage">("downloads");

  const { data, isLoading } = usePapers({
    page, limit: 12, sortBy, sortOrder: "desc",
  });

  const gridRef = useRef<HTMLDivElement>(null);
  const inView  = useInView(gridRef, { once: true, margin: "-40px" });

  return (
    <div className="space-y-6">

      {/* ── Hero ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: E }}
        className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-orange-50/60 via-background to-amber-50/40 p-6 md:p-8"
      >
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 opacity-80" />
        <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-amber-400/8 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 border border-amber-200 flex items-center justify-center shadow-sm"
            >
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </motion.div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight mb-1">
                Trending Papers
              </h1>
              <p className="text-[13px] text-muted-foreground">
                The most popular academic resources right now
              </p>
            </div>
          </div>

          {/* Sort toggle */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl border border-border bg-card shadow-sm shrink-0">
            {[
              { key: "downloads" as const,     icon: Download, label: "Most Downloaded" },
              { key: "ratingAverage" as const,  icon: Star,     label: "Highest Rated"  },
            ].map(({ key, icon: Icon, label }) => (
              <motion.button
                key={key}
                whileTap={{ scale: 0.96 }}
                onClick={() => { setSortBy(key); setPage(1); }}
                className={cn(
                  "flex items-center gap-2 h-8 px-4 rounded-lg text-[12px] font-semibold transition-all duration-200",
                  sortBy === key
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:block">{label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Podium preview — top 3 labels */}
        {!isLoading && data?.data && data.data.length >= 3 && (
          <div className="relative flex items-end justify-center gap-3 mt-6 h-14">
            {[1, 0, 2].map((rankIdx) => {
              const cfg = RANK_CONFIG[rankIdx];
              const paper = data.data[rankIdx];
              if (!paper) return null;
              return (
                <motion.div
                  key={rankIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: rankIdx * 0.08, duration: 0.4, ease: E }}
                  className={cn(
                    "flex flex-col items-center gap-1.5 px-4 py-2 rounded-xl border",
                    "bg-card shadow-sm",
                    cfg.border,
                    rankIdx === 0 && "scale-105",
                  )}
                >
                  <div className={cn(
                    "rounded-full border flex items-center justify-center ring-2",
                    cfg.bg, cfg.border, cfg.ring, cfg.size,
                  )}>
                    <cfg.icon className={cn("h-3.5 w-3.5", cfg.color)} />
                  </div>
                  <p className="text-[11px] font-bold text-foreground max-w-[100px] truncate text-center">
                    #{rankIdx + 1} {paper.title}
                  </p>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* ── Grid ── */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      ) : !data?.data.length ? (
        <EmptyState
          icon={TrendingUp}
          title="No trending papers yet"
          description="Papers will appear here as they gain downloads and ratings."
        />
      ) : (
        <>
          <motion.div
            ref={gridRef}
            variants={stagger}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {data.data.map((paper, i) => (
              <motion.div
                key={paper.id}
                variants={vCard}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="relative"
              >
                {/* Rank badge — top 3 */}
                {i < 3 && (
                  <div className={cn(
                    "absolute -top-2.5 -left-2.5 z-10 flex items-center justify-center rounded-full border shadow-md",
                    RANK_CONFIG[i].bg, RANK_CONFIG[i].border,
                    i === 0 ? "w-9 h-9" : "w-8 h-8",
                  )}>
                    {i === 0
                      ? <Trophy className={cn("h-4 w-4", RANK_CONFIG[0].color)} />
                      : i === 1
                        ? <Medal className={cn("h-4 w-4", RANK_CONFIG[1].color)} />
                        : <Award className={cn("h-3.5 w-3.5", RANK_CONFIG[2].color)} />
                    }
                  </div>
                )}
                <PaperCard paper={paper} />
              </motion.div>
            ))}
          </motion.div>
          {data.pagination && (
            <Pagination pagination={data.pagination} onPageChange={setPage} />
          )}
        </>
      )}
    </div>
  );
}