"use client";

import { use, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { courseService } from "@/services/academic.service";
import { usePapers } from "@/hooks/use-papers";
import { PaperCard } from "@/components/papers/paper-card";
import { Pagination } from "@/components/common/pagination";
import { CONTENT_TYPE_LABELS, type ContentType } from "@/types";
import { cn } from "@/lib/utils";
import {
  ArrowLeft, BookOpenCheck, FileText, GraduationCap,
  Building2, Layers, SlidersHorizontal, X, ChevronRight,
  Hash, CalendarDays,
} from "lucide-react";

/* ─── constants ──────────────────────────────────────────────── */
const E        = [0.22, 1, 0.36, 1] as const;
const CUR_YEAR = new Date().getFullYear();
const YEARS    = Array.from({ length: 10 }, (_, i) => CUR_YEAR - i);

/* ─── type-pill accent map (light) ──────────────────────────── */
const TYPE_ACCENTS: Record<string, string> = {
  PAST_PAPER: [
    "border-violet-200 bg-violet-50 text-violet-700",
    "data-[active=true]:bg-violet-100 data-[active=true]:border-violet-400 data-[active=true]:text-violet-800",
  ].join(" "),
  MID_PAPER: [
    "border-blue-200 bg-blue-50 text-blue-700",
    "data-[active=true]:bg-blue-100 data-[active=true]:border-blue-400 data-[active=true]:text-blue-800",
  ].join(" "),
  NOTES: [
    "border-emerald-200 bg-emerald-50 text-emerald-700",
    "data-[active=true]:bg-emerald-100 data-[active=true]:border-emerald-400 data-[active=true]:text-emerald-800",
  ].join(" "),
  ASSIGNMENT: [
    "border-orange-200 bg-orange-50 text-orange-700",
    "data-[active=true]:bg-orange-100 data-[active=true]:border-orange-400 data-[active=true]:text-orange-800",
  ].join(" "),
  QUIZ: [
    "border-rose-200 bg-rose-50 text-rose-700",
    "data-[active=true]:bg-rose-100 data-[active=true]:border-rose-400 data-[active=true]:text-rose-800",
  ].join(" "),
  OTHER: [
    "border-border bg-muted text-muted-foreground",
    "data-[active=true]:bg-secondary data-[active=true]:border-secondary-foreground/30",
  ].join(" "),
};

const defaultAccent = [
  "border-border bg-muted text-muted-foreground",
  "data-[active=true]:bg-secondary data-[active=true]:border-primary/30 data-[active=true]:text-foreground",
].join(" ");

/* ─── animation variants ─────────────────────────────────────── */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};
const vScale = {
  hidden: { opacity: 0, scale: 0.92 },
  show:   { opacity: 1, scale: 1, transition: { duration: 0.45, ease: E } },
};

/* ─── helpers ────────────────────────────────────────────────── */
function CardSkeleton() {
  return <div className="rounded-2xl border border-border bg-card h-56 animate-pulse" />;
}

function Pill({
  active, onClick, className, children,
}: {
  active: boolean; onClick: () => void;
  className?: string; children: React.ReactNode;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      data-active={active}
      onClick={onClick}
      className={cn(
        "h-8 px-3.5 rounded-full border text-[12px] font-semibold transition-all duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
        className,
      )}
    >
      {children}
    </motion.button>
  );
}

/* ─── page ───────────────────────────────────────────────────── */
export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [activeType, setActiveType] = useState<ContentType | undefined>();
  const [activeYear, setActiveYear] = useState<number | undefined>();
  const [page, setPage] = useState(1);

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ["course", id],
    queryFn:  () => courseService.getById(id),
    enabled:  !!id,
  });

  const { data: papers, isLoading: papersLoading } = usePapers({
    courseId:    id,
    contentType: activeType,
    year:        activeYear,
    page,
    limit:       12,
    sortBy:      "year",
    sortOrder:   "desc",
  });

  const hasFilters  = !!(activeType || activeYear);
  const totalPapers = papers?.pagination?.total ?? 0;

  const clearFilters = () => {
    setActiveType(undefined);
    setActiveYear(undefined);
    setPage(1);
  };

  return (
    <div className="relative min-h-screen bg-background">
      {/* Ambient */}
      <div className="absolute inset-0 hero-gradient opacity-70" aria-hidden />
      <div className="absolute inset-0 bg-dot-grid opacity-30" aria-hidden />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* ── Breadcrumb + back ── */}
        <AnimatePresence>
          {course?.program && (
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: E }}
              className="mb-8 space-y-4"
            >
              <nav className="flex flex-wrap items-center gap-1.5 text-[12px] font-semibold text-muted-foreground">
                <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                <ChevronRight className="w-3 h-3" />
                <Link
                  href={`/departments/${course.program.department?.id}`}
                  className="hover:text-foreground transition-colors truncate max-w-[120px]"
                >
                  {course.program.department?.name}
                </Link>
                <ChevronRight className="w-3 h-3" />
                <Link
                  href={`/programs/${course.program.id}`}
                  className="hover:text-foreground transition-colors truncate max-w-[140px]"
                >
                  {course.program.name}
                </Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-primary font-bold truncate max-w-[160px]">
                  {course.name}
                </span>
              </nav>

              <Link href={`/programs/${course.program.id}`}>
                <motion.div
                  whileHover={{ x: -3 }}
                  transition={{ duration: 0.18 }}
                  className={cn(
                    "inline-flex items-center gap-2 h-9 px-4 rounded-xl",
                    "border border-border bg-card text-[12px] font-semibold",
                    "text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all",
                  )}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to {course.program.name}
                </motion.div>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Loading skeleton ── */}
        {courseLoading && (
          <div className="space-y-6 mb-12">
            <div className="h-36 rounded-2xl border border-border bg-card animate-pulse" />
            <div className="flex gap-2 flex-wrap">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-8 w-24 rounded-full bg-muted animate-pulse" />
              ))}
            </div>
          </div>
        )}

        {/* ── Not found ── */}
        {!courseLoading && !course && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: E }}
            className="flex flex-col items-center gap-4 py-32 text-center"
          >
            <div className="w-16 h-16 rounded-2xl border border-border bg-card flex items-center justify-center">
              <BookOpenCheck className="w-7 h-7 text-muted-foreground" />
            </div>
            <div>
              <p className="font-bold text-sm text-foreground">Course not found</p>
              <p className="text-xs text-muted-foreground mt-1">This course may have been removed.</p>
            </div>
          </motion.div>
        )}

        {/* ── Main ── */}
        {!courseLoading && course && (
          <>
            {/* Hero */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: E }}
              className={cn(
                "relative overflow-hidden rounded-2xl border border-border bg-card",
                "p-7 md:p-10 mb-8 shadow-xl shadow-primary/5",
              )}
            >
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary via-purple-400 to-cyan-400 opacity-70" />
              <div className="absolute inset-x-0 top-[2px] h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

              <div className="relative flex flex-col sm:flex-row sm:items-start gap-5">
                {/* Icon */}
                <div className="w-14 h-14 rounded-[18px] bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/25 flex items-center justify-center shrink-0 shadow-lg shadow-primary/10">
                  <BookOpenCheck className="w-7 h-7 text-primary" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight leading-tight mb-3">
                    {course.name}
                  </h1>

                  <div className="flex flex-wrap items-center gap-2 text-[12px] text-muted-foreground mb-4">
                    {course.program?.department?.name && (
                      <>
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {course.program.department.name}
                        </span>
                        <ChevronRight className="w-3 h-3" />
                      </>
                    )}
                    {course.program?.name && (
                      <>
                        <span className="flex items-center gap-1">
                          <GraduationCap className="w-3 h-3" />
                          {course.program.name}
                        </span>
                        <ChevronRight className="w-3 h-3" />
                      </>
                    )}
                    <span className="flex items-center gap-1 text-primary font-semibold">
                      <Layers className="w-3 h-3" />
                      Semester {course.semester}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-muted/70 text-[11px] font-semibold text-muted-foreground">
                      <FileText className="w-3 h-3" />
                      {course._count?.papers ?? 0} papers
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-[11px] font-semibold text-primary">
                      <Hash className="w-3 h-3" />
                      Semester {course.semester}
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-muted/70 text-[11px] font-semibold text-muted-foreground">
                      <CalendarDays className="w-3 h-3" />
                      Updated {CUR_YEAR}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.48, delay: 0.1, ease: E }}
              className="rounded-2xl border border-border bg-card p-5 mb-8 space-y-5 shadow-sm"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.1em]">
                    Filters
                  </span>
                  <AnimatePresence>
                    {hasFilters && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="flex items-center justify-center w-4 h-4 rounded-full bg-primary text-[9px] font-black text-primary-foreground"
                      >
                        {(activeType ? 1 : 0) + (activeYear ? 1 : 0)}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                <AnimatePresence>
                  {hasFilters && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      onClick={clearFilters}
                      className={cn(
                        "flex items-center gap-1.5 h-7 px-3 rounded-full",
                        "border border-border text-[11px] font-semibold text-muted-foreground",
                        "hover:border-primary/40 hover:text-primary transition-colors",
                      )}
                    >
                      <X className="w-3 h-3" /> Clear all
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* Content type */}
              <div>
                <p className="text-[10px] font-black text-muted-foreground/70 uppercase tracking-[0.12em] mb-2.5">
                  Content type
                </p>
                <div className="flex flex-wrap gap-2">
                  <Pill
                    active={!activeType}
                    onClick={() => { setActiveType(undefined); setPage(1); }}
                    className={cn(
                      "border-border bg-muted text-muted-foreground",
                      "data-[active=true]:bg-secondary data-[active=true]:border-primary/30 data-[active=true]:text-foreground",
                    )}
                  >
                    All types
                  </Pill>
                  {(Object.entries(CONTENT_TYPE_LABELS) as [ContentType, string][]).map(([key, label]) => (
                    <Pill
                      key={key}
                      active={activeType === key}
                      onClick={() => { setActiveType(key); setPage(1); }}
                      className={TYPE_ACCENTS[key] ?? defaultAccent}
                    >
                      {label}
                    </Pill>
                  ))}
                </div>
              </div>

              {/* Year */}
              <div>
                <p className="text-[10px] font-black text-muted-foreground/70 uppercase tracking-[0.12em] mb-2.5">
                  Academic year
                </p>
                <div className="flex flex-wrap gap-2">
                  <Pill
                    active={!activeYear}
                    onClick={() => { setActiveYear(undefined); setPage(1); }}
                    className={cn(
                      "border-border bg-muted text-muted-foreground",
                      "data-[active=true]:bg-secondary data-[active=true]:border-primary/30 data-[active=true]:text-foreground",
                    )}
                  >
                    All years
                  </Pill>
                  {YEARS.map((y) => (
                    <Pill
                      key={y}
                      active={activeYear === y}
                      onClick={() => { setActiveYear(y); setPage(1); }}
                      className={cn(
                        "border-border bg-muted text-muted-foreground",
                        "data-[active=true]:bg-primary/10 data-[active=true]:border-primary/40 data-[active=true]:text-primary",
                      )}
                    >
                      {y}
                    </Pill>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Results header */}
            <AnimatePresence mode="wait">
              {!papersLoading && papers && (
                <motion.div
                  key="results-header"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between mb-5"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-black text-muted-foreground uppercase tracking-[0.1em]">
                      Results
                    </span>
                    <span className="flex items-center justify-center min-w-[24px] h-5 px-1.5 rounded-full bg-muted border border-border text-[10px] font-black text-muted-foreground">
                      {totalPapers}
                    </span>
                  </div>
                  {hasFilters && (
                    <span className="text-[11px] text-muted-foreground">
                      Filtered by{" "}
                      {activeType && (
                        <span className="text-primary font-semibold">
                          {CONTENT_TYPE_LABELS[activeType]}
                        </span>
                      )}
                      {activeType && activeYear && " · "}
                      {activeYear && (
                        <span className="text-primary font-semibold">{activeYear}</span>
                      )}
                    </span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Papers grid */}
            <AnimatePresence mode="wait">
              {/* Loading */}
              {papersLoading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                  {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
                </motion.div>
              )}

              {/* Empty */}
              {!papersLoading && !papers?.data.length && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: E }}
                  className="flex flex-col items-center gap-5 py-28 text-center"
                >
                  <div className="w-16 h-16 rounded-2xl border border-border bg-card flex items-center justify-center shadow-sm">
                    <FileText className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground">No papers found</p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                      {hasFilters
                        ? "No papers match these filters. Try adjusting your criteria."
                        : "No papers have been uploaded for this course yet."}
                    </p>
                  </div>
                  {hasFilters && (
                    <motion.button
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
                      onClick={clearFilters}
                      className="flex items-center gap-2 h-9 px-5 rounded-xl border border-border bg-card text-[12px] font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
                    >
                      <X className="w-3.5 h-3.5" /> Clear filters
                    </motion.button>
                  )}
                </motion.div>
              )}

              {/* Results */}
              {!papersLoading && !!papers?.data.length && (
                <motion.div
                  key={`results-${activeType}-${activeYear}-${page}`}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
                  className="space-y-8"
                >
                  <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                  >
                    {papers.data.map((paper) => (
                      <motion.div
                        key={paper.id}
                        variants={vScale}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      >
                        <PaperCard paper={paper} />
                      </motion.div>
                    ))}
                  </motion.div>

                  {papers.pagination && papers.pagination.totalPages > 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Pagination
                        pagination={papers.pagination}
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
          </>
        )}
      </div>
    </div>
  );
}