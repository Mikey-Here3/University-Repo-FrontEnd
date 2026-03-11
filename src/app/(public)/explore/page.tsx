"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDepartments, usePrograms, useCourses } from "@/hooks/use-academic";
import { usePapers } from "@/hooks/use-papers";
import { PaperCard } from "@/components/papers/paper-card";
import { onSelectChange } from "@/lib/select-handler";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { CONTENT_TYPE_LABELS, type ContentType } from "@/types";
import { cn } from "@/lib/utils";
import {
  GraduationCap, BookOpenCheck, FileText, ChevronRight,
  ArrowLeft, Building2, Layers, SlidersHorizontal,
  ArrowUpRight, X, Search,
} from "lucide-react";

/* ─── constants ──────────────────────────────────────────────── */
const E     = [0.22, 1, 0.36, 1] as const;
const YEARS = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

/* ─── accent palettes (light) ────────────────────────────────── */
const DEPT_ACCENTS = [
  { g: "from-violet-50",  b: "border-border hover:border-violet-300",  ic: "bg-violet-100 border-violet-200 text-violet-600",   dot: "bg-violet-500"  },
  { g: "from-blue-50",    b: "border-border hover:border-blue-300",    ic: "bg-blue-100 border-blue-200 text-blue-600",         dot: "bg-blue-500"    },
  { g: "from-emerald-50", b: "border-border hover:border-emerald-300", ic: "bg-emerald-100 border-emerald-200 text-emerald-600",dot: "bg-emerald-500" },
  { g: "from-orange-50",  b: "border-border hover:border-orange-300",  ic: "bg-orange-100 border-orange-200 text-orange-600",   dot: "bg-orange-500"  },
  { g: "from-rose-50",    b: "border-border hover:border-rose-300",    ic: "bg-rose-100 border-rose-200 text-rose-600",         dot: "bg-rose-500"    },
  { g: "from-cyan-50",    b: "border-border hover:border-cyan-300",    ic: "bg-cyan-100 border-cyan-200 text-cyan-600",         dot: "bg-cyan-500"    },
] as const;

const PROG_ACCENTS = [
  "bg-violet-100 text-violet-700 border-violet-200",
  "bg-cyan-100 text-cyan-700 border-cyan-200",
  "bg-emerald-100 text-emerald-700 border-emerald-200",
  "bg-orange-100 text-orange-700 border-orange-200",
  "bg-rose-100 text-rose-700 border-rose-200",
  "bg-blue-100 text-blue-700 border-blue-200",
] as const;

/* ─── animation variants ─────────────────────────────────────── */
const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 44, filter: "blur(6px)" }),
  center: {
    opacity: 1, x: 0, filter: "blur(0px)",
    transition: { duration: 0.48, ease: E },
  },
  exit: (dir: number) => ({
    opacity: 0, x: dir * -44, filter: "blur(6px)",
    transition: { duration: 0.28 },
  }),
};

const stagger = (d = 0.07) => ({
  hidden: {},
  show: { transition: { staggerChildren: d, delayChildren: 0.04 } },
});
const vUp = {
  hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
  show:   { opacity: 1, y: 0,  filter: "blur(0px)",
            transition: { duration: 0.48, ease: E } },
};
const vScale = {
  hidden: { opacity: 0, scale: 0.9, y: 12 },
  show:   { opacity: 1, scale: 1,   y: 0,
            transition: { duration: 0.48, ease: E } },
};

/* ─── step config ────────────────────────────────────────────── */
const STEPS = [
  { n: 1, label: "Department", icon: Building2     },
  { n: 2, label: "Program",    icon: GraduationCap },
  { n: 3, label: "Course",     icon: BookOpenCheck  },
  { n: 4, label: "Papers",     icon: FileText       },
];

/* ─── micro-components ───────────────────────────────────────── */
function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border bg-card animate-pulse", className)} />
  );
}

function SectionLabel({ icon: Icon, label, sub }: {
  icon: React.ElementType; label: string; sub?: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div>
        <h2 className="font-black text-base text-foreground tracking-tight leading-none">
          {label}
        </h2>
        {sub && <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function EmptyPanel({ icon: Icon, title, desc }: {
  icon: React.ElementType; title: string; desc: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: E }}
      className="flex flex-col items-center gap-4 py-24 text-center"
    >
      <div className="w-16 h-16 rounded-2xl border border-border bg-card flex items-center justify-center shadow-sm">
        <Icon className="w-7 h-7 text-muted-foreground" />
      </div>
      <div>
        <p className="font-bold text-sm text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground mt-1">{desc}</p>
      </div>
    </motion.div>
  );
}

/* ─── contextual search bar ──────────────────────────────────── */
function StepSearch({
  value, onChange, placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative group mb-6">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none group-focus-within:text-primary transition-colors" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full h-10 rounded-xl border border-border bg-card shadow-sm",
          "pl-11 pr-10 text-sm text-foreground placeholder:text-muted-foreground/60",
          "outline-none transition-all duration-200",
          "hover:border-primary/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/10",
        )}
      />
      <AnimatePresence>
        {value && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => onChange("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── page ───────────────────────────────────────────────────── */
export default function ExplorePage() {
  const [selectedDept,   setSelectedDept]   = useState<string | undefined>();
  const [selectedProg,   setSelectedProg]   = useState<string | undefined>();
  const [selectedCourse, setSelectedCourse] = useState<string | undefined>();
  const [selectedType,   setSelectedType]   = useState<ContentType | undefined>();
  const [selectedYear,   setSelectedYear]   = useState<number | undefined>();
  const [dir,            setDir]            = useState(1);
  const [searchQuery,    setSearchQuery]    = useState("");

  /* ── data ── */
  const { data: departments, isLoading: deptLoading } = useDepartments();
  const { data: programs  } = usePrograms(selectedDept);
  const { data: courses   } = useCourses(selectedProg);
  const { data: papers, isLoading: papersLoading } = usePapers(
    selectedCourse
      ? { courseId: selectedCourse, contentType: selectedType, year: selectedYear,
          limit: 20, sortBy: "year", sortOrder: "desc" }
      : { limit: 0 },
  );

  const step = selectedCourse ? 4 : selectedProg ? 3 : selectedDept ? 2 : 1;

  /* ── navigation helpers ── */
  const goForward = (setter: () => void) => {
    setDir(1);
    setSearchQuery("");
    setter();
  };
  const resetTo = (s: number) => {
    setDir(-1);
    setSearchQuery("");
    if (s <= 1) { setSelectedDept(undefined); setSelectedProg(undefined); setSelectedCourse(undefined); }
    if (s <= 2) { setSelectedProg(undefined); setSelectedCourse(undefined); }
    if (s <= 3) { setSelectedCourse(undefined); }
    setSelectedType(undefined);
    setSelectedYear(undefined);
  };

  /* ── search-filtered lists ── */
  const filteredDepts = useMemo(() => {
    if (!searchQuery.trim()) return departments ?? [];
    const q = searchQuery.toLowerCase();
    return (departments ?? []).filter((d) => d.name.toLowerCase().includes(q));
  }, [departments, searchQuery]);

  const filteredProgs = useMemo(() => {
    if (!searchQuery.trim()) return programs ?? [];
    const q = searchQuery.toLowerCase();
    return (programs ?? []).filter((p) => p.name.toLowerCase().includes(q));
  }, [programs, searchQuery]);

  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return courses ?? [];
    const q = searchQuery.toLowerCase();
    return (courses ?? []).filter((c) => c.name.toLowerCase().includes(q));
  }, [courses, searchQuery]);

  const filteredSemesters = useMemo(
    () => Array.from(new Set(filteredCourses.map((c) => c.semester))).sort((a, b) => a - b),
    [filteredCourses],
  );

  /* ── names for breadcrumb ── */
  const selectedDeptName   = departments?.find((d) => d.id === selectedDept)?.name;
  const selectedProgName   = programs?.find((p)   => p.id === selectedProg)?.name;
  const selectedCourseName = courses?.find((c)    => c.id === selectedCourse)?.name;

  return (
    /* ⚠️ No <Sidebar /> here — the layout (MainLayout / public layout)
          already injects the correct sidebar or nav for each context. */
    <div className="relative min-h-screen bg-background">
      <div className="absolute inset-0 hero-gradient opacity-70" aria-hidden />
      <div className="absolute inset-0 bg-dot-grid opacity-30" aria-hidden />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* ══ HEADER ════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: E }}
          className="text-center mb-14 space-y-5"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-[10px] font-black tracking-[0.14em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
            Browse Archive
          </div>

          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">
            Explore Resources
          </h1>

          <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed">
            Navigate through departments, programs, and courses
            to find the exact papers you need.
          </p>

          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-border" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-border" />
          </div>
        </motion.div>

        {/* ══ STEP INDICATOR ════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: E }}
          className="flex items-center justify-center mb-12"
        >
          {STEPS.map((s, i) => {
            const active = step === s.n;
            const done   = step >  s.n;
            return (
              <div key={s.n} className="flex items-center">
                <button
                  disabled={!done}
                  onClick={() => done && resetTo(s.n)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-black transition-all duration-300",
                    active
                      ? "bg-primary/10 border border-primary/30 text-primary"
                      : done
                        ? "text-muted-foreground hover:text-foreground cursor-pointer"
                        : "text-muted-foreground/40 cursor-default",
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black border transition-all",
                    active
                      ? "bg-primary border-primary text-primary-foreground"
                      : done
                        ? "bg-muted border-border text-foreground"
                        : "bg-background border-border text-muted-foreground/40",
                  )}>
                    {s.n}
                  </div>
                  <span className="hidden sm:block">{s.label}</span>
                </button>

                {i < STEPS.length - 1 && (
                  <div className={cn(
                    "w-8 md:w-14 h-px mx-1 transition-colors duration-500",
                    step > s.n ? "bg-primary/30" : "bg-muted",
                  )} />
                )}
              </div>
            );
          })}
        </motion.div>

        {/* ══ BREADCRUMB + BACK ════════════════════════════════ */}
        <AnimatePresence>
          {step > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.35, ease: E }}
              className="flex flex-wrap items-center gap-3 mb-6"
            >
              <div className={cn(
                "flex flex-wrap items-center gap-1.5 px-4 py-2 rounded-xl",
                "border border-border bg-card shadow-sm",
                "text-[12px] font-semibold w-fit max-w-full overflow-hidden",
              )}>
                <button
                  onClick={() => resetTo(1)}
                  className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                >
                  All Departments
                </button>

                {selectedDeptName && (
                  <>
                    <ChevronRight className="w-3 h-3 text-muted-foreground/40 shrink-0" />
                    <button
                      onClick={() => resetTo(2)}
                      className={cn(
                        "transition-colors shrink-0 truncate max-w-[120px]",
                        step === 2 ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {selectedDeptName}
                    </button>
                  </>
                )}

                {selectedProgName && (
                  <>
                    <ChevronRight className="w-3 h-3 text-muted-foreground/40 shrink-0" />
                    <button
                      onClick={() => resetTo(3)}
                      className={cn(
                        "transition-colors shrink-0 truncate max-w-[120px]",
                        step === 3 ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {selectedProgName}
                    </button>
                  </>
                )}

                {selectedCourseName && (
                  <>
                    <ChevronRight className="w-3 h-3 text-muted-foreground/40 shrink-0" />
                    <span className="text-primary font-bold truncate max-w-[140px]">
                      {selectedCourseName}
                    </span>
                  </>
                )}
              </div>

              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => resetTo(step - 1)}
                className={cn(
                  "flex items-center gap-2 h-9 px-4 rounded-xl",
                  "border border-border bg-card shadow-sm",
                  "text-[12px] font-semibold text-muted-foreground",
                  "hover:text-foreground hover:border-primary/40 transition-all",
                )}
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══ STEP CONTENT ══════════════════════════════════════ */}
        <AnimatePresence mode="wait" custom={dir}>

          {/* ── STEP 1: Departments ── */}
          {step === 1 && (
            <motion.div
              key="step-1"
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <SectionLabel
                icon={Building2}
                label="Select a Department"
                sub="Choose your department to see available programs"
              />

              {/* Search */}
              <StepSearch
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search departments…"
              />

              {deptLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <CardSkeleton key={i} className="h-40" />
                  ))}
                </div>
              ) : !filteredDepts.length ? (
                searchQuery ? (
                  <EmptyPanel
                    icon={Search}
                    title={`No results for "${searchQuery}"`}
                    desc="Try a different department name."
                  />
                ) : (
                  <EmptyPanel
                    icon={Building2}
                    title="No departments"
                    desc="No departments are available yet."
                  />
                )
              ) : (
                <motion.div
                  variants={stagger(0.055)}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                >
                  {filteredDepts.map((dept, i) => {
                    const a = DEPT_ACCENTS[i % DEPT_ACCENTS.length];
                    return (
                      <motion.div
                        key={dept.id}
                        variants={vScale}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      >
                        <button
                          onClick={() => goForward(() => setSelectedDept(dept.id))}
                          className="w-full h-full text-left group"
                        >
                          <div className={cn(
                            "relative h-full rounded-2xl border bg-gradient-to-br to-white p-5 overflow-hidden",
                            "transition-all duration-300 hover:shadow-xl cursor-pointer",
                            a.g, a.b,
                          )}>
                            <div className="absolute inset-x-0 top-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="absolute top-3 right-3 text-[10px] font-black text-muted-foreground/30 select-none">
                              {String(i + 1).padStart(2, "0")}
                            </div>

                            <div className={cn(
                              "w-11 h-11 rounded-xl border flex items-center justify-center mb-4",
                              "transition-all duration-300 group-hover:scale-105 group-hover:rotate-3",
                              a.ic,
                            )}>
                              <Building2 className="w-5 h-5" />
                            </div>

                            <h3 className="font-black text-sm text-foreground group-hover:text-primary transition-colors leading-snug mb-2">
                              {dept.name}
                            </h3>

                            <div className="flex flex-wrap gap-2 text-[10px] text-muted-foreground mb-4">
                              {dept._count?.programs != null && (
                                <span className="flex items-center gap-1">
                                  <GraduationCap className="w-2.5 h-2.5" />
                                  {dept._count.programs} programs
                                </span>
                              )}
                              {dept._count?.papers != null && (
                                <span className="flex items-center gap-1">
                                  <FileText className="w-2.5 h-2.5" />
                                  {dept._count.papers} papers
                                </span>
                              )}
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className={cn("w-1.5 h-1.5 rounded-full", a.dot)} />
                                <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-wider">Active</span>
                              </div>
                              <div className="w-7 h-7 rounded-xl border border-border bg-card flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
                              </div>
                            </div>
                          </div>
                        </button>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ── STEP 2: Programs ── */}
          {step === 2 && (
            <motion.div
              key="step-2"
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <SectionLabel
                icon={GraduationCap}
                label="Select a Program"
                sub={`Programs available in ${selectedDeptName}`}
              />

              <StepSearch
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search programs…"
              />

              {!filteredProgs.length ? (
                searchQuery ? (
                  <EmptyPanel
                    icon={Search}
                    title={`No results for "${searchQuery}"`}
                    desc="Try a different program name."
                  />
                ) : (
                  <EmptyPanel
                    icon={GraduationCap}
                    title="No programs"
                    desc="This department has no programs yet."
                  />
                )
              ) : (
                <motion.div
                  variants={stagger(0.07)}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {filteredProgs.map((prog, i) => {
                    const ic = PROG_ACCENTS[i % PROG_ACCENTS.length];
                    return (
                      <motion.div
                        key={prog.id}
                        variants={vUp}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      >
                        <button
                          onClick={() => goForward(() => setSelectedProg(prog.id))}
                          className="w-full text-left group"
                        >
                          <div className={cn(
                            "relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm",
                            "hover:border-primary/40 hover:shadow-lg transition-all duration-300",
                          )}>
                            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative flex items-center gap-4">
                              <div className={cn(
                                "w-12 h-12 rounded-xl border flex items-center justify-center shrink-0",
                                "transition-all duration-300 group-hover:scale-105 group-hover:rotate-3",
                                ic,
                              )}>
                                <GraduationCap className="w-5 h-5" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="font-black text-sm text-foreground group-hover:text-primary transition-colors leading-snug mb-1 truncate">
                                  {prog.name}
                                </h3>
                                <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                                  {prog._count?.courses != null && (
                                    <span className="flex items-center gap-1">
                                      <BookOpenCheck className="w-2.5 h-2.5" />
                                      {prog._count.courses} courses
                                    </span>
                                  )}
                                  {prog._count?.papers != null && (
                                    <span className="flex items-center gap-1">
                                      <FileText className="w-2.5 h-2.5" />
                                      {prog._count.papers} papers
                                    </span>
                                  )}
                                </div>
                              </div>
                              <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all duration-300 shrink-0" />
                            </div>
                          </div>
                        </button>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ── STEP 3: Courses ── */}
          {step === 3 && (
            <motion.div
              key="step-3"
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <SectionLabel
                icon={BookOpenCheck}
                label="Select a Course"
                sub={`Courses in ${selectedProgName}`}
              />

              <StepSearch
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search courses…"
              />

              {!filteredCourses.length ? (
                searchQuery ? (
                  <EmptyPanel
                    icon={Search}
                    title={`No results for "${searchQuery}"`}
                    desc="Try a different course name."
                  />
                ) : (
                  <EmptyPanel
                    icon={BookOpenCheck}
                    title="No courses"
                    desc="This program has no courses yet."
                  />
                )
              ) : (
                <div className="space-y-8">
                  {filteredSemesters.map((sem, si) => {
                    const semCourses = filteredCourses.filter((c) => c.semester === sem);
                    return (
                      <motion.div
                        key={sem}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: si * 0.08, ease: E }}
                      >
                        {/* Semester divider */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border",
                            "border-primary/20 bg-primary/10 text-[10px] font-black text-primary uppercase tracking-wider shrink-0",
                          )}>
                            <Layers className="w-3 h-3" />
                            Semester {sem}
                          </div>
                          <div className="flex-1 h-px bg-border" />
                          <span className="text-[10px] text-muted-foreground font-bold shrink-0">
                            {semCourses.length} {semCourses.length === 1 ? "course" : "courses"}
                          </span>
                        </div>

                        <motion.div
                          variants={stagger(0.05)}
                          initial="hidden"
                          animate="show"
                          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
                        >
                          {semCourses.map((course) => (
                            <motion.div
                              key={course.id}
                              variants={vUp}
                              whileHover={{ y: -2, transition: { duration: 0.18 } }}
                            >
                              <button
                                onClick={() => goForward(() => setSelectedCourse(course.id))}
                                className="w-full text-left group"
                              >
                                <div className={cn(
                                  "relative overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm",
                                  "hover:border-primary/40 hover:shadow-md transition-all duration-200",
                                )}>
                                  <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                      <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 group-hover:rotate-3">
                                        <BookOpenCheck className="w-3.5 h-3.5 text-primary" />
                                      </div>
                                      <span className="font-semibold text-sm text-foreground group-hover:text-primary truncate transition-colors">
                                        {course.name}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                      <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full whitespace-nowrap border border-border">
                                        {course._count?.papers ?? 0} papers
                                      </span>
                                      <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all duration-200 shrink-0" />
                                    </div>
                                  </div>
                                </div>
                              </button>
                            </motion.div>
                          ))}
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* ── STEP 4: Papers ── */}
          {step === 4 && (
            <motion.div
              key="step-4"
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {/* Filter card */}
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 mb-8 shadow-sm">
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary via-purple-400 to-cyan-400 opacity-70" />

                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <div className="flex items-center gap-2 shrink-0">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-[11px] font-black text-muted-foreground uppercase tracking-wider">
                      Filters
                    </span>
                  </div>

                  <Select
                    value={selectedType ?? "all"}
                    onValueChange={onSelectChange((v) =>
                      setSelectedType(v === "all" ? undefined : v as ContentType)
                    )}
                  >
                    <SelectTrigger className="w-44 h-9 rounded-xl border-border bg-card text-foreground text-xs">
                      <SelectValue placeholder="Content Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {Object.entries(CONTENT_TYPE_LABELS).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={selectedYear?.toString() ?? "all"}
                    onValueChange={onSelectChange((v) =>
                      setSelectedYear(v === "all" ? undefined : parseInt(v))
                    )}
                  >
                    <SelectTrigger className="w-32 h-9 rounded-xl border-border bg-card text-foreground text-xs">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      {YEARS.map((y) => (
                        <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <AnimatePresence>
                    {(selectedType || selectedYear) && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => { setSelectedType(undefined); setSelectedYear(undefined); }}
                        className={cn(
                          "flex items-center gap-1.5 h-9 px-3 rounded-xl",
                          "border border-border text-[11px] font-semibold text-muted-foreground",
                          "hover:text-foreground hover:border-primary/40 transition-colors",
                        )}
                      >
                        <X className="w-3 h-3" /> Clear
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>

                {/* Type pills */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { k: "", v: "All" },
                    ...Object.entries(CONTENT_TYPE_LABELS).map(([k, v]) => ({ k, v })),
                  ].map(({ k, v }) => (
                    <button
                      key={k || "all"}
                      onClick={() => setSelectedType(k === "" ? undefined : k as ContentType)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all duration-200",
                        (k === "" ? !selectedType : selectedType === k)
                          ? "bg-primary/10 border border-primary/30 text-primary"
                          : "border border-border text-muted-foreground hover:border-primary/30 hover:text-primary",
                      )}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <SectionLabel icon={FileText} label="Papers" sub={selectedCourseName} />

              {papersLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <CardSkeleton key={i} className="h-56" />
                  ))}
                </div>
              ) : !papers?.data.length ? (
                <EmptyPanel
                  icon={FileText}
                  title="No papers found"
                  desc="No papers match these filters. Try different criteria."
                />
              ) : !selectedYear ? (
                /* Grouped by year */
                <div className="space-y-10">
                  {Array.from(new Set(papers.data.map((p) => p.year)))
                    .sort((a, b) => b - a)
                    .map((year, yi) => {
                      const yearPapers = papers.data.filter((p) => p.year === year);
                      return (
                        <motion.div
                          key={year}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.45, delay: yi * 0.06, ease: E }}
                        >
                          <div className="flex items-center gap-3 mb-5">
                            <div className="inline-flex items-center px-3 py-1 rounded-full border border-border bg-muted text-[11px] font-black text-foreground shrink-0">
                              {year}
                            </div>
                            <div className="flex-1 h-px bg-border" />
                            <span className="text-[10px] text-muted-foreground font-bold shrink-0">
                              {yearPapers.length} papers
                            </span>
                          </div>

                          <motion.div
                            variants={stagger(0.06)}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                          >
                            {yearPapers.map((paper) => (
                              <motion.div
                                key={paper.id}
                                variants={vScale}
                                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                              >
                                <PaperCard paper={paper} />
                              </motion.div>
                            ))}
                          </motion.div>
                        </motion.div>
                      );
                    })}
                </div>
              ) : (
                /* Flat grid when a year is selected */
                <motion.div
                  variants={stagger(0.07)}
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
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}