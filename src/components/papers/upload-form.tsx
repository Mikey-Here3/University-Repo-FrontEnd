"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreatePaper } from "@/hooks/use-papers";
import { useDepartments, usePrograms, useCourses } from "@/hooks/use-academic";
import { SelectField } from "@/components/common/select-field";
import { CONTENT_TYPE_LABELS } from "@/types";
import { cn } from "@/lib/utils";
import {
  Upload, Loader2, FileUp, CheckCircle,
  FileText, X, ChevronRight,
} from "lucide-react";

const E = [0.22, 1, 0.36, 1] as const;
const currentYear = new Date().getFullYear();

const YEAR_OPTIONS     = Array.from({ length: 10 }, (_, i) => ({ value: String(currentYear - i), label: String(currentYear - i) }));
const SEMESTER_OPTIONS = Array.from({ length: 8 },  (_, i) => ({ value: String(i + 1),           label: `Semester ${i + 1}` }));
const CONTENT_OPTIONS  = Object.entries(CONTENT_TYPE_LABELS).map(([k, v]) => ({ value: k, label: v }));

const schema = z.object({
  title:        z.string().min(3, "At least 3 characters").max(200),
  description:  z.string().max(1000).optional(),
  departmentId: z.string().min(1, "Required"),
  programId:    z.string().min(1, "Required"),
  courseId:     z.string().min(1, "Required"),
  semester:     z.string().min(1, "Required"),
  contentType:  z.string().min(1, "Required"),
  year:         z.string().min(1, "Required"),
  teacherName:  z.string().max(100).optional(),
  tags:         z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

/* ─── Section header ─────────────────────────────────────────── */
function SectionHeader({
  step, title, desc, done,
}: {
  step: number; title: string; desc: string; done?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[13px] font-black transition-all duration-300",
        done
          ? "bg-emerald-100 border border-emerald-200 text-emerald-600"
          : "bg-primary/10 border border-primary/20 text-primary",
      )}>
        {done ? <CheckCircle className="h-4 w-4" /> : step}
      </div>
      <div>
        <p className="text-[14px] font-black text-gray-900 leading-none">{title}</p>
        <p className="text-[11px] text-gray-500 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

/* ─── Field wrapper ──────────────────────────────────────────── */
function PInput({
  label, error, required, children, hint,
}: {
  label: string; error?: string; required?: boolean;
  children: React.ReactNode; hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[12px] font-semibold text-gray-600">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="text-[11px] text-gray-400">{hint}</p>
      )}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="text-[11px] text-red-500 flex items-center gap-1"
          >
            <span className="h-1 w-1 rounded-full bg-red-500 shrink-0 inline-block" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Shared input class ─────────────────────────────────────── */
/*
 * Explicit bg-white — avoids the bg-background / bg-card variable
 * resolving to a dark or undefined colour in certain theme setups.
 */
const inputCls = cn(
  "w-full h-10 rounded-xl border border-gray-200 bg-white px-3.5 text-sm text-gray-900",
  "placeholder:text-gray-400 outline-none",
  "hover:border-primary/40 focus:border-primary/60 focus:ring-2 focus:ring-primary/10",
  "transition-all duration-150",
);
const errCls = "border-red-400 focus:border-red-400 focus:ring-red-400/10";

/* ─── Form ───────────────────────────────────────────────────── */
export function UploadForm() {
  const router = useRouter();
  const [file,     setFile]     = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);

  const { mutate: createPaper, isPending } = useCreatePaper();

  const {
    register, handleSubmit, watch, setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "", description: "", departmentId: "", programId: "",
      courseId: "", semester: "", contentType: "", year: "",
      teacherName: "", tags: "",
    },
  });

  const deptId   = watch("departmentId");
  const progId   = watch("programId");
  const courseId = watch("courseId");
  const ct       = watch("contentType");
  const yr       = watch("year");
  const sem      = watch("semester");
  const title    = watch("title");

  const { data: depts   } = useDepartments();
  const { data: progs   } = usePrograms(deptId   || undefined);
  const { data: courses } = useCourses(progId    || undefined);

  const deptOptions   = depts?.map((d)   => ({ value: d.id, label: d.name }))                           ?? [];
  const progOptions   = progs?.map((p)   => ({ value: p.id, label: p.name }))                           ?? [];
  const courseOptions = courses?.map((c) => ({ value: c.id, label: `${c.name} (Sem ${c.semester})` })) ?? [];

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  }, []);

  const onSubmit = (data: FormValues) => {
    if (!file) return;
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => { if (v) fd.append(k, v as string); });
    if (data.tags) {
      fd.set(
        "tags",
        JSON.stringify(data.tags.split(",").map((t) => t.trim()).filter(Boolean)),
      );
    }
    fd.append("file", file);
    createPaper(
      { formData: fd, onProgress: setProgress },
      { onSuccess: () => router.push("/my-uploads") },
    );
  };

  const sections = [
    !!title,
    !!(deptId && progId && courseId),
    !!(ct && yr && sem),
    !!file,
  ];
  const done = sections.filter(Boolean).length;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-0">

      {/* ── Header banner ── */}
      <div className="relative overflow-hidden rounded-t-2xl border border-b-0 border-gray-200 bg-gradient-to-br from-violet-50 via-white to-indigo-50/60 p-6">
        {/* top colour strip */}
        <div className="absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r from-primary via-violet-400 to-indigo-400" />
        {/* faint dot grid */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, #00000010 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        <div className="relative flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white border border-primary/20 shadow-sm flex items-center justify-center">
              <Upload className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-[17px] font-black text-gray-900 tracking-tight leading-none mb-0.5">
                Upload Paper
              </h2>
              <p className="text-[12px] text-gray-500">
                Share academic resources with your peers
              </p>
            </div>
          </div>

          {/* Step progress dots */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="flex gap-1.5">
              {sections.map((complete, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1.5 w-7 rounded-full transition-all duration-500",
                    complete ? "bg-primary" : "bg-gray-200",
                  )}
                />
              ))}
            </div>
            <span className="text-[11px] text-gray-400 font-semibold tabular-nums">
              {done}/4
            </span>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="border border-t-0 border-gray-200 bg-white rounded-b-2xl shadow-sm overflow-hidden divide-y divide-gray-100">

        {/* ── Section 1: Basic Info ── */}
        <div className="p-6">
          <SectionHeader
            step={1} done={!!title}
            title="Basic Information"
            desc="Title and description of the paper"
          />
          <div className="space-y-4">
            <PInput label="Title" required error={errors.title?.message}>
              <input
                placeholder="e.g. Data Structures Midterm 2024"
                className={cn(inputCls, errors.title && errCls)}
                {...register("title")}
              />
            </PInput>
            <PInput
              label="Description"
              hint="Optional — briefly describe what's in this resource"
            >
              <textarea
                placeholder="Brief description of the resource..."
                rows={3}
                className={cn(
                  "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5",
                  "text-sm text-gray-900 placeholder:text-gray-400 outline-none resize-none",
                  "hover:border-primary/40 focus:border-primary/60 focus:ring-2 focus:ring-primary/10",
                  "transition-all duration-150",
                )}
                {...register("description")}
              />
            </PInput>
          </div>
        </div>

        {/* ── Section 2: Academic Structure ── */}
        <div className="p-6">
          <SectionHeader
            step={2} done={!!(deptId && progId && courseId)}
            title="Academic Structure"
            desc="Select department → program → course"
          />

          {/* Breadcrumb chain */}
          <div className="flex items-center gap-1.5 mb-4 p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-[11px] w-fit">
            {[
              { val: deptId,   name: depts?.find((d) => d.id === deptId)?.name   ?? "Department" },
              { val: progId,   name: progs?.find((p) => p.id === progId)?.name   ?? "Program"    },
              { val: courseId, name: courses?.find((c) => c.id === courseId)?.name ?? "Course"   },
            ].map(({ val, name }, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="w-3 h-3 text-gray-300 shrink-0" />}
                <span className={cn(
                  "font-semibold transition-colors",
                  val ? "text-primary" : "text-gray-400",
                )}>
                  {name}
                </span>
              </span>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PInput label="Department" required error={errors.departmentId?.message}>
              <SelectField
                value={deptId}
                onValueChange={(v) => {
                  setValue("departmentId", v, { shouldValidate: true });
                  setValue("programId", "");
                  setValue("courseId", "");
                }}
                placeholder="Select department"
                options={deptOptions}
              />
            </PInput>
            <PInput label="Program" required error={errors.programId?.message}>
              <SelectField
                value={progId}
                onValueChange={(v) => {
                  setValue("programId", v, { shouldValidate: true });
                  setValue("courseId", "");
                }}
                placeholder="Select program"
                options={progOptions}
                disabled={!deptId}
              />
            </PInput>
            <PInput label="Course" required error={errors.courseId?.message}>
              <SelectField
                value={courseId}
                onValueChange={(v) => setValue("courseId", v, { shouldValidate: true })}
                placeholder="Select course"
                options={courseOptions}
                disabled={!progId}
              />
            </PInput>
          </div>
        </div>

        {/* ── Section 3: Paper Details ── */}
        <div className="p-6">
          <SectionHeader
            step={3} done={!!(ct && yr && sem)}
            title="Paper Details"
            desc="Type, year, semester and teacher information"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <PInput label="Content Type" required error={errors.contentType?.message}>
              <SelectField
                value={ct}
                onValueChange={(v) => setValue("contentType", v, { shouldValidate: true })}
                placeholder="Type"
                options={CONTENT_OPTIONS}
              />
            </PInput>
            <PInput label="Year" required error={errors.year?.message}>
              <SelectField
                value={yr}
                onValueChange={(v) => setValue("year", v, { shouldValidate: true })}
                placeholder="Year"
                options={YEAR_OPTIONS}
              />
            </PInput>
            <PInput label="Semester" required error={errors.semester?.message}>
              <SelectField
                value={sem}
                onValueChange={(v) => setValue("semester", v, { shouldValidate: true })}
                placeholder="Sem"
                options={SEMESTER_OPTIONS}
              />
            </PInput>
            <PInput label="Teacher Name" hint="Optional">
              <input
                placeholder="Prof. Name"
                className={inputCls}
                {...register("teacherName")}
              />
            </PInput>
          </div>

          <div className="mt-4">
            <PInput
              label="Tags"
              hint="Comma separated — e.g. midterm, programming, OOP"
            >
              <input
                placeholder="midterm, programming, OOP"
                className={inputCls}
                {...register("tags")}
              />
            </PInput>
          </div>
        </div>

        {/* ── Section 4: File Upload ── */}
        <div className="p-6">
          <SectionHeader
            step={4} done={!!file}
            title="Upload File"
            desc="PDF, DOC, DOCX, PNG, JPG — max 10 MB"
          />

          <motion.div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => !file && document.getElementById("file-input")?.click()}
            className={cn(
              "relative overflow-hidden rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200",
              dragging
                ? "border-primary bg-primary/5 cursor-copy"
                : file
                  ? "border-emerald-300 bg-emerald-50 cursor-default"
                  : "border-gray-200 bg-gray-50/80 hover:border-primary/40 hover:bg-violet-50/50 cursor-pointer",
            )}
          >
            <AnimatePresence mode="wait">
              {file ? (
                <motion.div
                  key="file"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.22, ease: E }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center shadow-sm">
                    <FileText className="h-7 w-7 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-gray-900 break-all">
                      {file.name}
                    </p>
                    <p className="text-[12px] text-gray-500 mt-0.5">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className={cn(
                      "flex items-center gap-1.5 h-8 px-3 rounded-lg border text-[12px] font-medium",
                      "border-gray-200 bg-white text-gray-500",
                      "hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all",
                    )}
                  >
                    <X className="h-3.5 w-3.5" /> Remove file
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="flex flex-col items-center gap-3"
                >
                  <motion.div
                    animate={
                      dragging
                        ? { y: [-4, 4, -4], transition: { repeat: Infinity, duration: 0.8 } }
                        : {}
                    }
                    className="w-14 h-14 rounded-2xl bg-white border border-primary/20 shadow-sm flex items-center justify-center"
                  >
                    <FileUp className="h-7 w-7 text-primary" />
                  </motion.div>
                  <div>
                    <p className="text-[14px] font-semibold text-gray-800">
                      {dragging ? "Drop it here!" : "Drag & drop or click to select"}
                    </p>
                    <p className="text-[12px] text-gray-400 mt-0.5">
                      PDF, DOC, DOCX, PNG, JPG up to 10 MB
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <input
              id="file-input"
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </motion.div>
        </div>

        {/* ── Submit ── */}
        <div className="p-6 bg-gray-50/70 border-t border-gray-100">

          {/* Upload progress bar */}
          <AnimatePresence>
            {isPending && progress > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 space-y-2 overflow-hidden"
              >
                <div className="flex items-center justify-between text-[12px] font-semibold">
                  <span className="text-gray-700">Uploading…</span>
                  <span className="text-primary tabular-nums">{progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-primary relative overflow-hidden"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    {/* shimmer */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit button */}
          <motion.button
            type="submit"
            disabled={isPending || !file}
            whileHover={{ scale: isPending || !file ? 1 : 1.015 }}
            whileTap={{ scale:  isPending || !file ? 1 : 0.975 }}
            className={cn(
              "relative w-full h-12 rounded-xl text-[15px] font-semibold overflow-hidden",
              "flex items-center justify-center gap-2 transition-all duration-200",
              "bg-primary text-white shadow-lg shadow-primary/20",
              "hover:bg-primary/90",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
            )}
          >
            {/* Shimmer on idle */}
            {!isPending && (
              <motion.span
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.12] to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "220%" }}
                transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 3.5, ease: "easeInOut" }}
              />
            )}
            {isPending
              ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading…</>
              : <><Upload className="h-4 w-4" /> Upload Paper</>
            }
          </motion.button>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-5 flex-wrap mt-3.5">
            {[
              "Pending admin review",
              "Free to upload",
              "Secure storage",
            ].map((t) => (
              <span
                key={t}
                className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium"
              >
                <CheckCircle className="h-3 w-3 text-emerald-500 shrink-0" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}