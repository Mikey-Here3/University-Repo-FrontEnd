"use client";

import { use, useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { departmentService, programService } from "@/services/academic.service";
import {
  ArrowLeft, GraduationCap, FileText,
  Building2, Search, X, ArrowUpRight,
  BookOpenCheck, ChevronRight, Layers,
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
    dot:        "bg-violet-500",
    num:        "text-violet-600",
  },
  {
    cardBorder: "border-border hover:border-cyan-300",
    cardBg:     "from-cyan-50 to-white",
    iconBg:     "bg-cyan-100 border-cyan-200 text-cyan-600",
    bar:        "from-cyan-500 to-blue-500",
    topBar:     "from-cyan-400 to-blue-400",
    dot:        "bg-cyan-500",
    num:        "text-cyan-600",
  },
  {
    cardBorder: "border-border hover:border-emerald-300",
    cardBg:     "from-emerald-50 to-white",
    iconBg:     "bg-emerald-100 border-emerald-200 text-emerald-600",
    bar:        "from-emerald-500 to-teal-500",
    topBar:     "from-emerald-400 to-teal-400",
    dot:        "bg-emerald-500",
    num:        "text-emerald-600",
  },
  {
    cardBorder: "border-border hover:border-orange-300",
    cardBg:     "from-orange-50 to-white",
    iconBg:     "bg-orange-100 border-orange-200 text-orange-600",
    bar:        "from-orange-500 to-amber-500",
    topBar:     "from-orange-400 to-amber-400",
    dot:        "bg-orange-500",
    num:        "text-orange-600",
  },
  {
    cardBorder: "border-border hover:border-rose-300",
    cardBg:     "from-rose-50 to-white",
    iconBg:     "bg-rose-100 border-rose-200 text-rose-600",
    bar:        "from-rose-500 to-pink-500",
    topBar:     "from-rose-400 to-pink-400",
    dot:        "bg-rose-500",
    num:        "text-rose-600",
  },
  {
    cardBorder: "border-border hover:border-blue-300",
    cardBg:     "from-blue-50 to-white",
    iconBg:     "bg-blue-100 border-blue-200 text-blue-600",
    bar:        "from-blue-500 to-indigo-500",
    topBar:     "from-blue-400 to-indigo-400",
    dot:        "bg-blue-500",
    num:        "text-blue-600",
  },
] as const;

/* ─── animation variants ─────────────────────────────────────── */
const E = [0.22, 1, 0.36, 1] as const;

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};
const vCard = {
  hidden: { opacity: 0, y: 22, scale: 0.95, filter: "blur(4px)" },
  show: {
    opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
    transition: { duration: 0.52, ease: E },
  },
};

/* ─── skeletons ──────────────────────────────────────────────── */
function HeroSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-8 mb-8 animate-pulse">
      <div className="flex items-start gap-5">
        <div className="w-14 h-14 rounded-[18px] bg-muted shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-6 w-56 rounded-lg bg-muted" />
          <div className="h-4 w-40 rounded-lg bg-muted" />
          <div className="flex gap-3 pt-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 w-24 rounded-full bg-muted" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgramSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 animate-pulse space-y-4">
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl bg-muted shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-40 rounded-lg bg-muted" />
          <div className="h-3 w-28 rounded bg-muted" />
        </div>
        <div className="w-7 h-7 rounded-lg bg-muted" />
      </div>
      <div className="h-px bg-border" />
      <div className="h-1.5 rounded-full bg-muted" />
    </div>
  );
}

/* ─── page ───────────────────────────────────────────────────── */
export default function DepartmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [query, setQuery] = useState("");

  const { data: department, isLoading: deptLoading } = useQuery({
    queryKey: ["department", id],
    queryFn:  () => departmentService.getById(id),
    enabled:  !!id,
  });

  const { data: programs, isLoading: progsLoading } = useQuery({
    queryKey: ["programs", id],
    queryFn:  () => programService.getAll(id),
    enabled:  !!id,
  });

  const isLoading = deptLoading || progsLoading;

  const totalPapers   = department?._count?.papers ?? 0;
  const totalPrograms = programs?.length ?? 0;
  const totalCourses  = useMemo(
    () => programs?.reduce((s, p) => s + (p._count?.courses ?? 0), 0) ?? 0,
    [programs],
  );
  const maxPapers = useMemo(
    () => Math.max(...(programs?.map((p) => p._count?.papers ?? 0) ?? [1]), 1),
    [programs],
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return programs ?? [];
    const q = query.toLowerCase();
    return (programs ?? []).filter((p) => p.name.toLowerCase().includes(q));
  }, [programs, query]);

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
            <Link href="/departments" className="hover:text-foreground transition-colors">
              Departments
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary font-bold truncate max-w-[200px]">
              {department?.name ?? "…"}
            </span>
          </nav>

          <Link href="/departments">
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
              Back to Departments
            </motion.div>
          </Link>
        </motion.div>

        {/* ── Loading ── */}
        {isLoading && (
          <>
            <HeroSkeleton />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {Array.from({ length: 4 }).map((_, i) => <ProgramSkeleton key={i} />)}
            </div>
          </>
        )}

        {/* ── Not found ── */}
        {!isLoading && !department && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4 py-32 text-center"
          >
            <div className="w-16 h-16 rounded-2xl border border-border bg-card flex items-center justify-center shadow-sm">
              <Building2 className="w-7 h-7 text-muted-foreground" />
            </div>
            <div>
              <p className="font-bold text-sm text-foreground">Department not found</p>
              <p className="text-xs text-muted-foreground mt-1">It may have been removed.</p>
            </div>
          </motion.div>
        )}

        {/* ── Main ── */}
        {!isLoading && department && (
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
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary via-purple-400 to-indigo-400 opacity-70" />
              <div className="absolute inset-x-0 top-[2px] h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

              <div className="relative flex flex-col sm:flex-row sm:items-start gap-5">
                {/* Icon */}
                <div className="w-14 h-14 rounded-[18px] bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/25 flex items-center justify-center shrink-0 shadow-lg shadow-primary/10">
                  <Building2 className="w-7 h-7 text-primary" />
                </div>

                <div className="flex-1 min-w-0 space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-primary/20 bg-primary/10 text-[9px] font-black text-primary uppercase tracking-widest">
                    <span className="w-1 h-1 rounded-full bg-primary animate-ping" />
                    Department
                  </div>

                  <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight leading-tight">
                    {department.name}
                  </h1>

                  {/* Stat chips */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      { icon: GraduationCap, value: totalPrograms, label: totalPrograms === 1 ? "Program"  : "Programs"  },
                      { icon: BookOpenCheck,  value: totalCourses,  label: totalCourses  === 1 ? "Course"   : "Courses"   },
                      { icon: FileText,       value: totalPapers,   label: totalPapers   === 1 ? "Paper"    : "Papers"    },
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
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: E }}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h2 className="font-black text-base text-foreground tracking-tight">Programs</h2>
                  <p className="text-[11px] text-muted-foreground">
                    {totalPrograms} {totalPrograms === 1 ? "program" : "programs"} in this department
                  </p>
                </div>
              </div>

              {totalPrograms > 3 && (
                <div className="relative group sm:w-60">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search programs…"
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

            {/* No programs */}
            {!programs?.length && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4 py-24 text-center"
              >
                <div className="w-16 h-16 rounded-2xl border border-border bg-card flex items-center justify-center shadow-sm">
                  <GraduationCap className="w-7 h-7 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-bold text-sm text-foreground">No programs yet</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Programs haven&apos;t been added to this department yet.
                  </p>
                </div>
              </motion.div>
            )}

            {/* No search results */}
            <AnimatePresence>
              {!!programs?.length && !filtered.length && (
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

            {/* Programs grid */}
            <AnimatePresence mode="wait">
              {!!filtered.length && (
                <motion.div
                  key={query}
                  variants={stagger}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-2 gap-5"
                >
                  {filtered.map((prog, i) => {
                    const a           = ACCENTS[i % ACCENTS.length];
                    const paperCount  = prog._count?.papers  ?? 0;
                    const courseCount = prog._count?.courses ?? 0;
                    const fillPct     = Math.round((paperCount / maxPapers) * 100);

                    return (
                      <motion.div
                        key={prog.id}
                        variants={vCard}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      >
                        <Link
                          href={`/papers?departmentId=${department.id}&programId=${prog.id}`}
                          className="block h-full"
                        >
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
                            <div className="absolute top-4 right-4 text-[10px] font-black text-muted-foreground/40 select-none tabular-nums">
                              {String(i + 1).padStart(2, "0")}
                            </div>

                            {/* Header row */}
                            <div className="flex items-start gap-4 mb-4">
                              <div className={cn(
                                "w-11 h-11 rounded-xl border flex items-center justify-center shrink-0",
                                "transition-all duration-300 group-hover:scale-105 group-hover:rotate-3",
                                a.iconBg,
                              )}>
                                <GraduationCap className="w-5 h-5" />
                              </div>

                              <div className="flex-1 min-w-0 pr-8">
                                <h3 className="font-black text-[14px] text-foreground group-hover:text-primary transition-colors leading-snug">
                                  {prog.name}
                                </h3>
                                <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <BookOpenCheck className="w-3 h-3" />
                                    <span className={cn("font-bold", a.num)}>{courseCount}</span>
                                    {courseCount === 1 ? "course" : "courses"}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <FileText className="w-3 h-3" />
                                    <span className={cn("font-bold", a.num)}>{paperCount}</span>
                                    {paperCount === 1 ? "paper" : "papers"}
                                  </span>
                                </div>
                              </div>

                              {/* Arrow */}
                              <div className="w-7 h-7 rounded-lg border border-border bg-card flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-300">
                                <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
                              </div>
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-border mb-4" />

                            {/* Progress bar */}
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Layers className="w-2.5 h-2.5" />
                                  Papers relative to dept
                                </span>
                                <span className={cn("font-black", a.num)}>{fillPct}%</span>
                              </div>
                              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                                <motion.div
                                  className={cn("h-full rounded-full bg-gradient-to-r", a.bar)}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${fillPct}%` }}
                                  transition={{ duration: 0.85, delay: i * 0.06, ease: E }}
                                />
                              </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center gap-1.5 mt-4">
                              <span className={cn("w-1.5 h-1.5 rounded-full", a.dot)} />
                              <span className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-wider">
                                Active program
                              </span>
                            </div>
                          </div>
                        </Link>
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