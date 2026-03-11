"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useDepartments } from "@/hooks/use-academic";
import {
  BookOpen, ArrowUpRight, FileText, GraduationCap,
  Building2, Search, X, Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── accent palette (light) ─────────────────────────────────── */
const ACCENTS = [
  {
    cardBorder: "border-border hover:border-violet-300",
    cardBg:     "from-violet-50 to-white",
    iconBg:     "bg-violet-100 border-violet-200 text-violet-600",
    bar:        "from-violet-500 to-indigo-500",
    dot:        "bg-violet-500",
    num:        "text-violet-600",
    topBar:     "from-violet-400 to-indigo-400",
    arrowBg:    "bg-card border-border",
  },
  {
    cardBorder: "border-border hover:border-cyan-300",
    cardBg:     "from-cyan-50 to-white",
    iconBg:     "bg-cyan-100 border-cyan-200 text-cyan-600",
    bar:        "from-cyan-500 to-blue-500",
    dot:        "bg-cyan-500",
    num:        "text-cyan-600",
    topBar:     "from-cyan-400 to-blue-400",
    arrowBg:    "bg-card border-border",
  },
  {
    cardBorder: "border-border hover:border-emerald-300",
    cardBg:     "from-emerald-50 to-white",
    iconBg:     "bg-emerald-100 border-emerald-200 text-emerald-600",
    bar:        "from-emerald-500 to-teal-500",
    dot:        "bg-emerald-500",
    num:        "text-emerald-600",
    topBar:     "from-emerald-400 to-teal-400",
    arrowBg:    "bg-card border-border",
  },
  {
    cardBorder: "border-border hover:border-orange-300",
    cardBg:     "from-orange-50 to-white",
    iconBg:     "bg-orange-100 border-orange-200 text-orange-600",
    bar:        "from-orange-500 to-amber-500",
    dot:        "bg-orange-500",
    num:        "text-orange-600",
    topBar:     "from-orange-400 to-amber-400",
    arrowBg:    "bg-card border-border",
  },
  {
    cardBorder: "border-border hover:border-rose-300",
    cardBg:     "from-rose-50 to-white",
    iconBg:     "bg-rose-100 border-rose-200 text-rose-600",
    bar:        "from-rose-500 to-pink-500",
    dot:        "bg-rose-500",
    num:        "text-rose-600",
    topBar:     "from-rose-400 to-pink-400",
    arrowBg:    "bg-card border-border",
  },
  {
    cardBorder: "border-border hover:border-blue-300",
    cardBg:     "from-blue-50 to-white",
    iconBg:     "bg-blue-100 border-blue-200 text-blue-600",
    bar:        "from-blue-500 to-indigo-500",
    dot:        "bg-blue-500",
    num:        "text-blue-600",
    topBar:     "from-blue-400 to-indigo-400",
    arrowBg:    "bg-card border-border",
  },
] as const;

/* ─── animation variants ─────────────────────────────────────── */
const E = [0.22, 1, 0.36, 1] as const;

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};
const vCard = {
  hidden: { opacity: 0, y: 24, scale: 0.96, filter: "blur(4px)" },
  show: {
    opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
    transition: { duration: 0.52, ease: E },
  },
};

/* ─── skeleton ───────────────────────────────────────────────── */
function DeptSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 animate-pulse space-y-4">
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-xl bg-muted" />
        <div className="w-6 h-6 rounded bg-muted" />
      </div>
      <div className="h-4 w-3/4 rounded-lg bg-muted" />
      <div className="h-3 w-1/2 rounded-lg bg-muted" />
      <div className="h-px bg-border" />
      <div className="h-1.5 rounded-full bg-muted" />
    </div>
  );
}

/* ─── page ───────────────────────────────────────────────────── */
export default function DepartmentsPage() {
  const { data: departments, isLoading } = useDepartments();
  const [query, setQuery] = useState("");

  const totalPrograms = useMemo(
    () => departments?.reduce((s, d) => s + (d._count?.programs ?? 0), 0) ?? 0,
    [departments],
  );
  const totalPapers = useMemo(
    () => departments?.reduce((s, d) => s + (d._count?.papers ?? 0), 0) ?? 0,
    [departments],
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return departments ?? [];
    const q = query.toLowerCase();
    return (departments ?? []).filter((d) => d.name.toLowerCase().includes(q));
  }, [departments, query]);

  return (
    <div className="relative min-h-screen bg-background">
      {/* Ambient */}
      <div className="absolute inset-0 hero-gradient opacity-70" aria-hidden />
      <div className="absolute inset-0 bg-dot-grid opacity-30" aria-hidden />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: E }}
          className="text-center space-y-5"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-[10px] font-black tracking-[0.14em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
            Academic Structure
          </div>

          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">
            Departments
          </h1>
          <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed">
            Explore past papers and academic resources organized by faculty department.
          </p>

          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-border" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-border" />
          </div>
        </motion.div>

        {/* ── Stats strip ── */}
        {!isLoading && !!departments?.length && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: E }}
            className="grid grid-cols-3 gap-4 max-w-lg mx-auto"
          >
            {[
              { icon: Building2,     value: departments.length, label: "Departments"  },
              { icon: GraduationCap, value: totalPrograms,      label: "Programs"     },
              { icon: FileText,      value: `${totalPapers}+`,  label: "Total Papers" },
            ].map((s) => (
              <div
                key={s.label}
                className="relative overflow-hidden rounded-2xl border border-border bg-card p-4 text-center shadow-sm"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
                <s.icon className="w-4 h-4 mx-auto mb-2 text-muted-foreground" />
                <p className="text-xl font-black text-foreground tracking-tight">{s.value}</p>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5">
                  {s.label}
                </p>
              </div>
            ))}
          </motion.div>
        )}

        {/* ── Search ── */}
        {!isLoading && !!departments?.length && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: E }}
            className="max-w-md mx-auto"
          >
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search departments…"
                className={cn(
                  "w-full h-11 rounded-xl border border-border bg-card shadow-sm",
                  "pl-11 pr-10 text-sm text-foreground placeholder:text-muted-foreground/70",
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
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ── Loading ── */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <DeptSkeleton key={i} />)}
          </div>
        )}

        {/* ── Empty (no data) ── */}
        {!isLoading && !departments?.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4 py-32 text-center"
          >
            <div className="w-16 h-16 rounded-2xl border border-border bg-card flex items-center justify-center shadow-sm">
              <BookOpen className="w-7 h-7 text-muted-foreground" />
            </div>
            <div>
              <p className="font-bold text-sm text-foreground">No departments yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Departments will appear once an admin adds them.
              </p>
            </div>
          </motion.div>
        )}

        {/* ── No search results ── */}
        <AnimatePresence>
          {!isLoading && !!departments?.length && !filtered.length && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 py-24 text-center"
            >
              <div className="w-16 h-16 rounded-2xl border border-border bg-card flex items-center justify-center shadow-sm">
                <Search className="w-7 h-7 text-muted-foreground" />
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
                className="flex items-center gap-2 h-9 px-5 rounded-xl border border-border bg-card text-[12px] font-semibold text-muted-foreground hover:text-foreground transition-all"
              >
                <X className="w-3.5 h-3.5" /> Clear search
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Grid ── */}
        <AnimatePresence mode="wait">
          {!isLoading && !!filtered.length && (
            <motion.div
              key={query}
              variants={stagger}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filtered.map((dept, i) => {
                const a          = ACCENTS[i % ACCENTS.length];
                const progCount  = dept._count?.programs ?? 0;
                const paperCount = dept._count?.papers   ?? 0;
                const fillPct    = Math.min(100, Math.round((paperCount / Math.max(totalPapers, 1)) * 100));

                return (
                  <motion.div
                    key={dept.id}
                    variants={vCard}
                    whileHover={{ y: -6, transition: { duration: 0.22 } }}
                  >
                    <Link href={`/departments/${dept.id}`} className="block h-full">
                      <div className={cn(
                        "group relative h-full overflow-hidden rounded-2xl border bg-gradient-to-br p-6",
                        "transition-all duration-300 hover:shadow-xl cursor-pointer",
                        a.cardBorder, a.cardBg,
                      )}>
                        {/* Hover top accent */}
                        <div className={cn(
                          "absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                          a.topBar,
                        )} />

                        {/* Index */}
                        <div className="absolute top-4 right-5 text-[11px] font-black text-muted-foreground/40 select-none tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </div>

                        {/* Icon + arrow */}
                        <div className="flex items-start justify-between mb-5">
                          <div className={cn(
                            "w-12 h-12 rounded-xl border flex items-center justify-center",
                            "transition-all duration-300 group-hover:scale-105 group-hover:rotate-3",
                            a.iconBg,
                          )}>
                            <Building2 className="w-5 h-5" />
                          </div>
                          <div className={cn(
                            "w-8 h-8 rounded-xl border flex items-center justify-center",
                            "opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300",
                            a.arrowBg,
                          )}>
                            <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </div>

                        {/* Name */}
                        <h3 className="font-black text-[15px] text-foreground leading-snug mb-1.5 group-hover:text-primary transition-colors duration-200">
                          {dept.name}
                        </h3>

                        {/* Counts */}
                        <div className="flex items-center gap-4 text-[12px] text-muted-foreground mb-5">
                          <span className="flex items-center gap-1.5">
                            <GraduationCap className="w-3.5 h-3.5" />
                            <span className={cn("font-bold", a.num)}>{progCount}</span>
                            {progCount === 1 ? "program" : "programs"}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5" />
                            <span className={cn("font-bold", a.num)}>{paperCount}</span>
                            {paperCount === 1 ? "paper" : "papers"}
                          </span>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-border mb-4" />

                        {/* Progress bar */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Layers className="w-2.5 h-2.5" />
                              Share of archive
                            </span>
                            <span className={cn("font-black", a.num)}>{fillPct}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                            <motion.div
                              className={cn("h-full rounded-full bg-gradient-to-r", a.bar)}
                              initial={{ width: 0 }}
                              animate={{ width: `${fillPct}%` }}
                              transition={{ duration: 0.9, delay: i * 0.05, ease: E }}
                            />
                          </div>
                        </div>

                        {/* Active dot */}
                        <div className="flex items-center gap-1.5 mt-4">
                          <span className={cn("w-1.5 h-1.5 rounded-full", a.dot)} />
                          <span className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-wider">
                            Active
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
      </div>
    </div>
  );
}