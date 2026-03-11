"use client";

import { use, useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { programService, courseService } from "@/services/academic.service";
import {
  ArrowLeft, BookOpenCheck, GraduationCap, FileText,
  Building2, ChevronRight, ArrowUpRight, Search,
  X, Layers, Hash,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── accent palette (light) ─────────────────────────────────── */
const ACCENTS = [
  {
    cardBorder: "border-border hover:border-violet-300",
    cardBg:     "from-violet-50 to-white",
    iconBg:     "bg-violet-100 border-violet-200 text-violet-600",
    bar:        "from-violet-500 to-indigo-500",
    topBar:     "from-violet-400 to-indigo-400",
    pill:       "border-violet-200 bg-violet-50 text-violet-700",
    num:        "text-violet-600",
    dot:        "bg-violet-500",
  },
  {
    cardBorder: "border-border hover:border-cyan-300",
    cardBg:     "from-cyan-50 to-white",
    iconBg:     "bg-cyan-100 border-cyan-200 text-cyan-600",
    bar:        "from-cyan-500 to-blue-500",
    topBar:     "from-cyan-400 to-blue-400",
    pill:       "border-cyan-200 bg-cyan-50 text-cyan-700",
    num:        "text-cyan-600",
    dot:        "bg-cyan-500",
  },
  {
    cardBorder: "border-border hover:border-emerald-300",
    cardBg:     "from-emerald-50 to-white",
    iconBg:     "bg-emerald-100 border-emerald-200 text-emerald-600",
    bar:        "from-emerald-500 to-teal-500",
    topBar:     "from-emerald-400 to-teal-400",
    pill:       "border-emerald-200 bg-emerald-50 text-emerald-700",
    num:        "text-emerald-600",
    dot:        "bg-emerald-500",
  },
  {
    cardBorder: "border-border hover:border-orange-300",
    cardBg:     "from-orange-50 to-white",
    iconBg:     "bg-orange-100 border-orange-200 text-orange-600",
    bar:        "from-orange-500 to-amber-500",
    topBar:     "from-orange-400 to-amber-400",
    pill:       "border-orange-200 bg-orange-50 text-orange-700",
    num:        "text-orange-600",
    dot:        "bg-orange-500",
  },
  {
    cardBorder: "border-border hover:border-rose-300",
    cardBg:     "from-rose-50 to-white",
    iconBg:     "bg-rose-100 border-rose-200 text-rose-600",
    bar:        "from-rose-500 to-pink-500",
    topBar:     "from-rose-400 to-pink-400",
    pill:       "border-rose-200 bg-rose-50 text-rose-700",
    num:        "text-rose-600",
    dot:        "bg-rose-500",
  },
  {
    cardBorder: "border-border hover:border-blue-300",
    cardBg:     "from-blue-50 to-white",
    iconBg:     "bg-blue-100 border-blue-200 text-blue-600",
    bar:        "from-blue-500 to-indigo-500",
    topBar:     "from-blue-400 to-indigo-400",
    pill:       "border-blue-200 bg-blue-50 text-blue-700",
    num:        "text-blue-600",
    dot:        "bg-blue-500",
  },
] as const;

/* ─── animation variants ─────────────────────────────────────── */
const E = [0.22, 1, 0.36, 1] as const;

const stagger = (d = 0.07) => ({
  hidden: {},
  show: { transition: { staggerChildren: d, delayChildren: 0.04 } },
});
const vCard = {
  hidden: { opacity: 0, y: 20, scale: 0.95, filter: "blur(4px)" },
  show: {
    opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
    transition: { duration: 0.5, ease: E },
  },
};
const vUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.48, ease: E } },
};

/* ─── skeletons ──────────────────────────────────────────────── */
function HeroSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-8 mb-8 animate-pulse">
      <div className="flex items-start gap-5">
        <div className="w-14 h-14 rounded-[18px] bg-muted shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-6 w-48 rounded-lg bg-muted" />
          <div className="h-4 w-32 rounded-lg bg-muted" />
          <div className="flex gap-2 pt-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 w-20 rounded-full bg-muted" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SemSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="h-7 w-28 rounded-full bg-muted animate-pulse" />
        <div className="flex-1 h-px bg-border" />
        <div className="h-4 w-16 rounded bg-muted animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-40 rounded-2xl border border-border bg-card animate-pulse" />
        ))}
      </div>
    </div>
  );
}

/* ─── page ───────────────────────────────────────────────────── */
export default function ProgramDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [query, setQuery] = useState("");

  const { data: program, isLoading: progLoading } = useQuery({
    queryKey: ["program", id],
    queryFn:  () => programService.getById(id),
    enabled:  !!id,
  });

  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ["courses", id],
    queryFn:  () => courseService.getAll({ programId: id }),
    enabled:  !!id,
  });

  const isLoading = progLoading || coursesLoading;

  const semesters = useMemo(
    () =>
      courses
        ? Array.from(new Set(courses.map((c) => c.semester))).sort((a, b) => a - b)
        : [],
    [courses],
  );

  const totalCourses = courses?.length ?? 0;
  const totalPapers  = useMemo(
    () => courses?.reduce((s, c) => s + (c._count?.papers ?? 0), 0) ?? 0,
    [courses],
  );
  const maxPapers = useMemo(
    () => Math.max(...(courses?.map((c) => c._count?.papers ?? 0) ?? [1]), 1),
    [courses],
  );

  const filteredCourses = useMemo(() => {
    if (!query.trim()) return courses ?? [];
    const q = query.toLowerCase();
    return (courses ?? []).filter((c) => c.name.toLowerCase().includes(q));
  }, [courses, query]);

  const filteredSemesters = useMemo(
    () =>
      Array.from(new Set(filteredCourses.map((c) => c.semester))).sort((a, b) => a - b),
    [filteredCourses],
  );

  return (
    <div className="relative min-h-screen bg-background">
      {/* Ambient */}
      <div className="absolute inset-0 hero-gradient opacity-70" aria-hidden />
      <div className="absolute inset-0 bg-dot-grid opacity-30" aria-hidden />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">

        {/* ── Breadcrumb + back ── */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: E }}
          className="space-y-3"
        >
          <nav className="flex flex-wrap items-center gap-1.5 text-[12px] font-semibold text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/departments" className="hover:text-foreground transition-colors">Departments</Link>
            {program?.department && (
              <>
                <ChevronRight className="w-3 h-3" />
                <Link
                  href={`/departments/${program.department.id}`}
                  className="hover:text-foreground transition-colors truncate max-w-[140px]"
                >
                  {program.department.name}
                </Link>
              </>
            )}
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary font-bold truncate max-w-[180px]">
              {program?.name ?? "…"}
            </span>
          </nav>

          {program?.department && (
            <Link href={`/departments/${program.department.id}`}>
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
                Back to {program.department.name}
              </motion.div>
            </Link>
          )}
        </motion.div>

        {/* ── Loading ── */}
        {isLoading && (
          <>
            <HeroSkeleton />
            <div className="space-y-8">
              {[1, 2, 3].map((i) => <SemSkeleton key={i} />)}
            </div>
          </>
        )}

        {/* ── Not found ── */}
        {!isLoading && !program && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4 py-32 text-center"
          >
            <div className="w-16 h-16 rounded-2xl border border-border bg-card flex items-center justify-center shadow-sm">
              <GraduationCap className="w-7 h-7 text-muted-foreground" />
            </div>
            <div>
              <p className="font-bold text-sm text-foreground">Program not found</p>
              <p className="text-xs text-muted-foreground mt-1">It may have been removed.</p>
            </div>
          </motion.div>
        )}

        {/* ── Main ── */}
        {!isLoading && program && (
          <>
            {/* Hero */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: E }}
              className={cn(
                "relative overflow-hidden rounded-2xl border border-border bg-card",
                "p-7 md:p-10 shadow-xl shadow-primary/5",
              )}
            >
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary via-purple-400 to-cyan-400 opacity-70" />
              <div className="absolute inset-x-0 top-[2px] h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

              <div className="relative flex flex-col sm:flex-row sm:items-start gap-5">
                {/* Icon */}
                <div className="w-14 h-14 rounded-[18px] bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/25 flex items-center justify-center shrink-0 shadow-lg shadow-primary/10">
                  <GraduationCap className="w-7 h-7 text-primary" />
                </div>

                <div className="flex-1 min-w-0 space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-primary/20 bg-primary/10 text-[9px] font-black text-primary uppercase tracking-widest">
                    <span className="w-1 h-1 rounded-full bg-primary animate-ping" />
                    Program
                  </div>

                  <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight leading-tight">
                    {program.name}
                  </h1>

                  {program.department && (
                    <Link
                      href={`/departments/${program.department.id}`}
                      className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-primary transition-colors group/link"
                    >
                      <Building2 className="w-3 h-3" />
                      {program.department.name}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                    </Link>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {[
                      { icon: Layers,        value: semesters.length, label: semesters.length === 1 ? "Semester"  : "Semesters" },
                      { icon: BookOpenCheck, value: totalCourses,     label: totalCourses    === 1 ? "Course"    : "Courses"   },
                      { icon: FileText,      value: totalPapers,      label: totalPapers     === 1 ? "Paper"     : "Papers"    },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-muted/60 text-[11px] font-semibold text-muted-foreground"
                      >
                        <s.icon className="w-3 h-3" />
                        <span className="text-foreground font-bold">{s.value}</span>
                        {s.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Section header + search */}
            <motion.div
              variants={vUp}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.1 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <BookOpenCheck className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h2 className="font-black text-base text-foreground tracking-tight">
                    Courses by Semester
                  </h2>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {semesters.length} {semesters.length === 1 ? "semester" : "semesters"} ·{" "}
                    {totalCourses} {totalCourses === 1 ? "course" : "courses"} total
                  </p>
                </div>
              </div>

              {totalCourses > 4 && (
                <div className="relative group sm:w-60">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search courses…"
                    className={cn(
                      "w-full h-9 rounded-xl border border-border bg-card shadow-sm",
                      "pl-9 pr-8 text-[13px] text-foreground placeholder:text-muted-foreground/70",
                      "outline-none transition-all duration-200",
                      "hover:border-primary/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/10",
                    )}
                  />
                  <AnimatePresence>
                    {query && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={() => setQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>

            {/* No courses */}
            {semesters.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4 py-28 text-center"
              >
                <div className="w-16 h-16 rounded-2xl border border-border bg-card flex items-center justify-center shadow-sm">
                  <BookOpenCheck className="w-7 h-7 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-bold text-sm text-foreground">No courses yet</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Courses haven&apos;t been added to this program.
                  </p>
                </div>
              </motion.div>
            )}

            {/* No search results */}
            <AnimatePresence>
              {!!courses?.length && !filteredCourses.length && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4 py-20 text-center"
                >
                  <div className="w-14 h-14 rounded-2xl border border-border bg-card flex items-center justify-center shadow-sm">
                    <Search className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground">
                      No results for &ldquo;{query}&rdquo;
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Try a different search term.</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
                    onClick={() => setQuery("")}
                    className="flex items-center gap-2 h-8 px-4 rounded-xl border border-border bg-card text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-all"
                  >
                    <X className="w-3 h-3" /> Clear
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Semester groups */}
            <AnimatePresence mode="wait">
              {!!filteredSemesters.length && (
                <motion.div
                  key={query}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-10"
                >
                  {filteredSemesters.map((sem, si) => {
                    const a          = ACCENTS[si % ACCENTS.length];
                    const semCourses = filteredCourses.filter((c) => c.semester === sem);

                    return (
                      <motion.div
                        key={sem}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.48, delay: si * 0.08, ease: E }}
                      >
                        {/* Semester header */}
                        <div className="flex items-center gap-3 mb-5">
                          <div className={cn(
                            "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border",
                            "text-[11px] font-black uppercase tracking-wider shrink-0",
                            a.pill,
                          )}>
                            <Hash className="w-3 h-3" />
                            Semester {sem}
                          </div>
                          <div className="flex-1 h-px bg-border" />
                          <span className="text-[10px] font-black text-muted-foreground shrink-0 uppercase tracking-wider">
                            {semCourses.length}{" "}
                            {semCourses.length === 1 ? "course" : "courses"}
                          </span>
                        </div>

                        {/* Courses grid */}
                        <motion.div
                          variants={stagger(0.06)}
                          initial="hidden"
                          animate="show"
                          className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                          {semCourses.map((course, ci) => {
                            const paperCount = course._count?.papers ?? 0;
                            const fillPct    = Math.round((paperCount / maxPapers) * 100);

                            return (
                              <motion.div
                                key={course.id}
                                variants={vCard}
                                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                              >
                                <Link href={`/courses/${course.id}`} className="block h-full">
                                  <div className={cn(
                                    "group relative h-full overflow-hidden rounded-2xl border bg-gradient-to-br p-5",
                                    "transition-all duration-300 hover:shadow-xl cursor-pointer",
                                    a.cardBorder, a.cardBg,
                                  )}>
                                    {/* Hover top accent */}
                                    <div className={cn(
                                      "absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                                      a.topBar,
                                    )} />

                                    {/* Index */}
                                    <div className="absolute top-4 right-4 text-[10px] font-black text-muted-foreground/40 tabular-nums select-none">
                                      {String(ci + 1).padStart(2, "0")}
                                    </div>

                                    {/* Header row */}
                                    <div className="flex items-start gap-3.5 mb-4">
                                      <div className={cn(
                                        "w-10 h-10 rounded-xl border flex items-center justify-center shrink-0",
                                        "transition-all duration-300 group-hover:scale-105 group-hover:rotate-3",
                                        a.iconBg,
                                      )}>
                                        <BookOpenCheck className="w-4 h-4" />
                                      </div>

                                      <div className="flex-1 min-w-0 pr-8">
                                        <h3 className="font-black text-[14px] text-foreground group-hover:text-primary transition-colors leading-snug">
                                          {course.name}
                                        </h3>
                                        <span className="text-[11px] text-muted-foreground">
                                          Semester {course.semester}
                                        </span>
                                      </div>

                                      {/* Arrow */}
                                      <div className="w-7 h-7 rounded-lg border border-border bg-card flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-300">
                                        <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
                                      </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="h-px bg-border mb-3.5" />

                                    {/* Progress bar */}
                                    <div className="space-y-1.5">
                                      <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                          <FileText className="w-2.5 h-2.5" />
                                          Papers available
                                        </span>
                                        <span className={cn("font-black", a.num)}>
                                          {paperCount}
                                        </span>
                                      </div>
                                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                                        <motion.div
                                          className={cn("h-full rounded-full bg-gradient-to-r", a.bar)}
                                          initial={{ width: 0 }}
                                          animate={{ width: `${fillPct}%` }}
                                          transition={{
                                            duration: 0.85,
                                            delay: si * 0.08 + ci * 0.05,
                                            ease: E,
                                          }}
                                        />
                                      </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center gap-1.5 mt-3.5">
                                      <span className={cn("w-1.5 h-1.5 rounded-full", a.dot)} />
                                      <span className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-wider">
                                        Active course
                                      </span>
                                    </div>
                                  </div>
                                </Link>
                              </motion.div>
                            );
                          })}
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}