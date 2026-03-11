"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDepartments, usePrograms, useCourses } from "@/hooks/use-academic";
import { CONTENT_TYPE_LABELS, type ContentType } from "@/types";
import { cn } from "@/lib/utils";
import {
  Select, SelectContent, SelectItem, SelectTrigger,
} from "@/components/ui/select";
import {
  X, SlidersHorizontal, Building2, GraduationCap,
  BookOpen, FileText, Calendar, ChevronRight,
  Filter, Loader2,
} from "lucide-react";
import type { PaperFilters } from "@/types";

const E = [0.22, 1, 0.36, 1] as const;
const YEARS = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

/* ─── Active filter chip ─────────────────────────────────────── */
function Chip({
  categoryLabel, valueLabel, color, onRemove,
}: {
  categoryLabel: string;
  valueLabel:    string;
  color:         string;
  onRemove:      () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.75, y: 6 }}
      animate={{ opacity: 1, scale: 1,    y: 0 }}
      exit={{   opacity: 0, scale: 0.75, y: 6 }}
      transition={{ duration: 0.2, ease: E }}
      className={cn(
        "inline-flex items-center gap-1.5 h-7 pl-2.5 pr-1.5 rounded-full border text-[11px] font-semibold",
        color,
      )}
    >
      <span className="opacity-60 font-medium shrink-0">{categoryLabel}</span>
      <span className="max-w-[110px] truncate">{valueLabel}</span>
      <motion.button
        whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.88 }}
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors ml-0.5 shrink-0"
        aria-label={`Remove ${categoryLabel} filter`}
      >
        <X className="w-2.5 h-2.5" />
      </motion.button>
    </motion.div>
  );
}

/* ─── Single filter select ────────────────────────────────────── */
function FilterSelect({
  value, onChange, placeholder, icon: Icon,
  options, disabled, isLoading, entityLabel, width = "w-auto",
}: {
  value:       string;
  onChange:    (v: string) => void;
  placeholder: string;
  icon:        React.ElementType;
  options:     { value: string; label: string }[];
  disabled?:   boolean;
  isLoading?:  boolean;
  entityLabel: string;
  width?:      string;
}) {
  const isActive = !!value;

  /*
   * ── THE BUG FIX ──────────────────────────────────────────────
   * Radix SelectValue resolves its display text by scanning
   * SelectItem children in the DOM. When options load async,
   * there is no matching SelectItem yet, so it falls back to
   * rendering the raw `value` prop (the UUID).
   *
   * Fix: compute the human-readable label ourselves and render
   * it directly inside SelectTrigger, bypassing SelectValue.
   */
  const displayLabel = useMemo(
    () => options.find((o) => o.value === value)?.label ?? null,
    [options, value],
  );

  return (
    <Select
      value={value || "__ALL__"}
onValueChange={(v) => {
  if (!v || v === "__ALL__") {
    onChange("");
  } else {
    onChange(v);
  }
}}      disabled={disabled || isLoading}
    >
      <SelectTrigger
        className={cn(
          "h-9 rounded-xl border text-[13px] transition-all duration-200 shadow-sm",
          "focus:ring-0 focus:ring-offset-0",
          /* flex layout — children control content, chevron auto-appended */
          "flex items-center gap-2 px-3",
          width,
          isActive
            ? "border-primary/40 bg-primary/8 text-primary font-semibold"
            : "border-border bg-card text-muted-foreground font-medium hover:border-primary/30 hover:text-foreground",
          (disabled && !isLoading) && "opacity-40 pointer-events-none cursor-not-allowed",
        )}
      >
        {/*
         * We render our OWN content here — no <SelectValue />.
         * SelectTrigger only needs children + optional SelectValue for
         * aria; omitting SelectValue is safe and breaks the UUID display.
         */}
        {isLoading ? (
          <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-muted-foreground/50" />
        ) : (
          <Icon className={cn(
            "h-3.5 w-3.5 shrink-0",
            isActive ? "text-primary" : "text-muted-foreground/50",
          )} />
        )}

        <span className="truncate flex-1 text-left">
          {/* Show resolved human-readable label, never the raw UUID */}
          {isActive && displayLabel ? displayLabel : placeholder}
        </span>
      </SelectTrigger>

      <SelectContent className="rounded-xl border-border shadow-xl">
        {/* "All" reset option */}
        <SelectItem value="__ALL__" className="text-sm font-medium text-muted-foreground">
          All {entityLabel}s
        </SelectItem>

        {/* Separator-style group header */}
        {options.length > 0 && (
          <div className="mx-2 my-1 h-px bg-border" />
        )}

        {/* Dynamic options */}
        {options.length === 0 ? (
          <div className="px-3 py-4 text-center text-xs text-muted-foreground">
            {disabled
              ? `Choose a ${entityLabel.split(" ").at(-1)?.toLowerCase()} first`
              : isLoading
                ? "Loading…"
                : `No ${entityLabel.toLowerCase()}s found`}
          </div>
        ) : (
          options.map((o) => (
            <SelectItem key={o.value} value={o.value} className="text-sm">
              {o.label}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}

/* ─── Divider ─────────────────────────────────────────────────── */
function VDivider() {
  return <div className="h-6 w-px bg-border shrink-0 hidden md:block" />;
}

/* ─── Main export ─────────────────────────────────────────────── */
export function PaperFiltersBar({
  filters,
  onChange,
}: {
  filters:  PaperFilters;
  onChange: (f: PaperFilters) => void;
}) {
  const [expanded, setExpanded] = useState(true);

  /* data */
  const { data: departments, isLoading: deptsLoading } = useDepartments();
  const { data: programs,    isLoading: progsLoading  } = usePrograms(filters.departmentId);
  const { data: courses,     isLoading: coursesLoading } = useCourses(filters.programId);

  /* option arrays */
  const deptOpts   = useMemo(() => departments?.map((d) => ({ value: d.id,    label: d.name })) ?? [], [departments]);
  const progOpts   = useMemo(() => programs   ?.map((p) => ({ value: p.id,    label: p.name })) ?? [], [programs]);
  const courseOpts = useMemo(() => courses    ?.map((c) => ({ value: c.id,    label: c.name })) ?? [], [courses]);
  const typeOpts   = Object.entries(CONTENT_TYPE_LABELS).map(([k, v]) => ({ value: k, label: v }));
  const yearOpts   = YEARS.map((y) => ({ value: String(y), label: String(y) }));

  /* resolve display names for chips (same fix as trigger) */
  const resolvedDept   = deptOpts  .find((o) => o.value === filters.departmentId)?.label;
  const resolvedProg   = progOpts  .find((o) => o.value === filters.programId)?.label;
  const resolvedCourse = courseOpts.find((o) => o.value === filters.courseId)?.label;
  const resolvedType   = filters.contentType
    ? CONTENT_TYPE_LABELS[filters.contentType as ContentType]
    : null;

  /* active count badge */
  const activeCount = [
    filters.departmentId, filters.programId, filters.courseId,
    filters.contentType, filters.year,
  ].filter(Boolean).length;

  /* helpers */
  const patch = (patch: Partial<PaperFilters>) =>
    onChange({ ...filters, ...patch, page: 1 });

  const clearAll = () =>
    onChange({ page: 1, limit: filters.limit, sortBy: filters.sortBy, sortOrder: filters.sortOrder });

  /* chip config */
  const chips: {
    id:    string;
    cat:   string;
    val:   string;
    color: string;
    clear: () => void;
  }[] = [
    ...(resolvedDept   ? [{ id: "dept",   cat: "Dept",    val: resolvedDept,        color: "bg-violet-50 border-violet-200 text-violet-700",  clear: () => patch({ departmentId: undefined, programId: undefined, courseId: undefined }) }] : []),
    ...(resolvedProg   ? [{ id: "prog",   cat: "Program", val: resolvedProg,        color: "bg-blue-50 border-blue-200 text-blue-700",        clear: () => patch({ programId: undefined, courseId: undefined }) }] : []),
    ...(resolvedCourse ? [{ id: "course", cat: "Course",  val: resolvedCourse,      color: "bg-emerald-50 border-emerald-200 text-emerald-700",clear: () => patch({ courseId: undefined }) }] : []),
    ...(resolvedType   ? [{ id: "type",   cat: "Type",    val: resolvedType,        color: "bg-amber-50 border-amber-200 text-amber-700",     clear: () => patch({ contentType: undefined }) }] : []),
    ...(filters.year   ? [{ id: "year",   cat: "Year",    val: String(filters.year),color: "bg-rose-50 border-rose-200 text-rose-700",        clear: () => patch({ year: undefined }) }] : []),
  ];

  return (
    <div className="space-y-2">

      {/* ── Filter card ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: E }}
        className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
      >
        {/* Gradient top accent */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/25 to-transparent" />

        {/* Toolbar row */}
        <div className="flex flex-wrap items-center gap-2 px-4 py-3">

          {/* Label + count + toggle */}
          <button
            onClick={() => setExpanded((p) => !p)}
            className="flex items-center gap-2 shrink-0 group"
          >
            <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
              <Filter className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="text-[11px] font-black text-muted-foreground uppercase tracking-wider hidden sm:block select-none">
              Filters
            </span>
            <AnimatePresence>
              {activeCount > 0 && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{   scale: 0, opacity: 0 }}
                  className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-black flex items-center justify-center shadow-sm"
                >
                  {activeCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <VDivider />

          {/* ── Cascading selects ── */}
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                key="selects"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{   opacity: 0, width: 0 }}
                transition={{ duration: 0.28, ease: E }}
                className="flex flex-wrap items-center gap-2 overflow-hidden"
              >
                {/* Department */}
                <FilterSelect
                  value={filters.departmentId ?? ""}
                  onChange={(v) => patch({
                    departmentId: v || undefined,
                    programId: undefined,
                    courseId: undefined,
                  })}
                  placeholder="Department"
                  icon={Building2}
                  options={deptOpts}
                  isLoading={deptsLoading}
                  entityLabel="Department"
                  width="w-36"
                />

                <ChevronRight className="w-3 h-3 text-muted-foreground/25 shrink-0 hidden lg:block" />

                {/* Program — requires dept */}
                <div className="relative">
                  <FilterSelect
                    value={filters.programId ?? ""}
                    onChange={(v) => patch({
                      programId: v || undefined,
                      courseId:  undefined,
                    })}
                    placeholder="Program"
                    icon={GraduationCap}
                    options={progOpts}
                    disabled={!filters.departmentId}
                    isLoading={!!filters.departmentId && progsLoading}
                    entityLabel="Program"
                    width="w-36"
                  />
                  {/* Disabled hint */}
                  {!filters.departmentId && (
                    <div className="absolute -bottom-5 left-0 text-[10px] text-muted-foreground/50 whitespace-nowrap hidden lg:block">
                      Select dept first
                    </div>
                  )}
                </div>

                <ChevronRight className="w-3 h-3 text-muted-foreground/25 shrink-0 hidden lg:block" />

                {/* Course — requires prog */}
                <div className="relative">
                  <FilterSelect
                    value={filters.courseId ?? ""}
                    onChange={(v) => patch({ courseId: v || undefined })}
                    placeholder="Course"
                    icon={BookOpen}
                    options={courseOpts}
                    disabled={!filters.programId}
                    isLoading={!!filters.programId && coursesLoading}
                    entityLabel="Course"
                    width="w-36"
                  />
                  {!filters.programId && (
                    <div className="absolute -bottom-5 left-0 text-[10px] text-muted-foreground/50 whitespace-nowrap hidden lg:block">
                      Select program first
                    </div>
                  )}
                </div>

                <VDivider />

                {/* Content type */}
                <FilterSelect
                  value={filters.contentType ?? ""}
                  onChange={(v) => patch({ contentType: (v as ContentType) || undefined })}
                  placeholder="Type"
                  icon={FileText}
                  options={typeOpts}
                  entityLabel="Content Type"
                  width="w-32"
                />

                {/* Year */}
                <FilterSelect
                  value={filters.year ? String(filters.year) : ""}
                  onChange={(v) => patch({ year: v ? parseInt(v) : undefined })}
                  placeholder="Year"
                  icon={Calendar}
                  options={yearOpts}
                  entityLabel="Year"
                  width="w-24"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Clear all */}
          <AnimatePresence>
            {activeCount > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{   opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearAll}
                className={cn(
                  "flex items-center gap-1.5 h-9 px-3 rounded-xl shrink-0",
                  "border border-border bg-muted/40 text-[12px] font-semibold",
                  "text-muted-foreground hover:text-foreground hover:border-primary/30",
                  "transition-all ml-auto",
                )}
              >
                <X className="w-3 h-3" />
                <span className="hidden sm:block">Clear all</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Quick-type pills row (content type shortcuts) */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              key="pills"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{   opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: E }}
              className="overflow-hidden border-t border-border/60"
            >
              <div className="px-4 py-2.5 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-wider shrink-0">
                  Quick:
                </span>
                {[
                  { k: "",           label: "All",          active: !filters.contentType },
                  ...Object.entries(CONTENT_TYPE_LABELS).map(([k, v]) => ({
                    k, label: v, active: filters.contentType === k,
                  })),
                ].map(({ k, label, active }) => (
                  <button
                    key={k || "all"}
                    onClick={() => patch({ contentType: k ? (k as ContentType) : undefined })}
                    className={cn(
                      "px-3 py-1 rounded-full text-[11px] font-semibold transition-all duration-150",
                      active
                        ? "bg-primary/10 border border-primary/30 text-primary"
                        : "border border-border text-muted-foreground hover:border-primary/25 hover:text-primary",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Active filter chips ── */}
      <AnimatePresence>
        {chips.length > 0 && (
          <motion.div
            key="chips"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{   opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: E }}
            className="overflow-hidden"
          >
            <motion.div
              layout
              className="flex flex-wrap items-center gap-1.5 pt-0.5 px-0.5"
            >
              {/* Hierarchy connector */}
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/50 font-bold uppercase tracking-wider shrink-0">
                <SlidersHorizontal className="w-3 h-3" />
                <span>Active filters</span>
              </div>

              {/* Chain indicator for cascaded filters */}
              {(resolvedDept || resolvedProg || resolvedCourse) && (
                <div className="hidden md:flex items-center gap-1 text-[11px] text-muted-foreground/50">
                  {resolvedDept && (
                    <>
                      <span className="font-semibold text-violet-600">{resolvedDept}</span>
                    </>
                  )}
                  {resolvedProg && (
                    <>
                      <ChevronRight className="w-3 h-3" />
                      <span className="font-semibold text-blue-600">{resolvedProg}</span>
                    </>
                  )}
                  {resolvedCourse && (
                    <>
                      <ChevronRight className="w-3 h-3" />
                      <span className="font-semibold text-emerald-600">{resolvedCourse}</span>
                    </>
                  )}
                  {/* Individual remove buttons for the chain */}
                  <button
                    onClick={() => patch({ departmentId: undefined, programId: undefined, courseId: undefined })}
                    className="ml-1 w-4 h-4 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <X className="w-2.5 h-2.5 text-muted-foreground" />
                  </button>
                </div>
              )}

              {/* Non-cascade chips */}
              {chips
                .filter((c) => !["dept", "prog", "course"].includes(c.id))
                .map((c) => (
                  <Chip
                    key={c.id}
                    categoryLabel={c.cat}
                    valueLabel={c.val}
                    color={c.color}
                    onRemove={c.clear}
                  />
                ))}

              {/* Mobile: show all chips including cascade */}
              <div className="md:hidden flex flex-wrap gap-1.5">
                {chips
                  .filter((c) => ["dept", "prog", "course"].includes(c.id))
                  .map((c) => (
                    <Chip
                      key={c.id}
                      categoryLabel={c.cat}
                      valueLabel={c.val}
                      color={c.color}
                      onRemove={c.clear}
                    />
                  ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}