"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { paperService } from "@/services/paper.service";
import { adminService } from "@/services/admin.service";
import { useAuthStore } from "@/store/auth-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/common/empty-state";
import { BookmarkButton } from "@/components/papers/bookmark-button";
import { RatingStars } from "@/components/papers/rating-stars";
import { CommentSection } from "@/components/papers/comment-section";
import { ReportModal } from "@/components/papers/report-modal";
import { CONTENT_TYPE_LABELS, type ContentType } from "@/types";
import { getContentTypeColor, getStatusColor, formatDate, getApiError, cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  ArrowLeft, Download, FileText, Calendar, User,
  BookOpen, GraduationCap, Eye, Building2, Tag,
  Clock, Star, MessageSquare, Bookmark, Hash,
  Pencil, Trash2, Loader2, Shield, CheckCircle,
} from "lucide-react";

const E = [0.22, 1, 0.36, 1] as const;

/* ─── Types ──────────────────────────────────────────────────── */
type EditForm = {
  title:       string;
  description: string;
  year:        number;
  contentType: ContentType;
};

/* ─── Download helper ────────────────────────────────────────────
   Problem 1: fl_attachment URL manipulation breaks signed Cloudinary URLs.
   Problem 2: Cross-origin <a download> is blocked by browsers silently.
   Fix: fetch() the blob first, create an objectURL, then click it.
   Fallback: window.open if CORS blocks the fetch.
───────────────────────────────────────────────────────────────── */
async function triggerDownload(
  url: string,
  filename: string,
  fileType?: string | null,
): Promise<void> {
  // Build a clean filename with the correct extension
  const ext      = (fileType ?? "").toLowerCase().trim();           // e.g. "pdf"
  const baseName = filename.replace(/[^a-z0-9.\-_\s]/gi, "_").trim() || "download";
  // Only append extension if the baseName doesn't already end with it
  const fullName = ext && !baseName.toLowerCase().endsWith(`.${ext}`)
    ? `${baseName}.${ext}`
    : baseName;

  try {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob      = await res.blob();
    const objectUrl = URL.createObjectURL(blob);

    const a         = document.createElement("a");
    a.href          = objectUrl;
    a.download      = fullName;          // ← correct filename + extension
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => URL.revokeObjectURL(objectUrl), 30_000);
  } catch {
    // CORS fallback — open directly, browser will prompt Save As
    window.open(url, "_blank", "noopener,noreferrer");
    toast.info("If download didn't start, right-click → Save As.");
  }
}

/* ─── File-type detection ────────────────────────────────────── */
// ─── File-type detection ────────────────────────────────────────
function detectFileType(fileUrl?: string | null, fileType?: string | null) {
  const type     = (fileType ?? "").toLowerCase().trim();
  const url      = (fileUrl  ?? "").toLowerCase();
  const cleanUrl = url.split("?")[0]; // strip query params

  // Primary: trust the stored fileType from DB
  if (type === "pdf")  return { isPdf: true,  isImage: false };
  if (["png","jpg","jpeg","gif","webp","svg"].includes(type))
                       return { isPdf: false, isImage: true  };

  // Fallback: check URL extension (works for non-Cloudinary hosts)
  const isPdf   = cleanUrl.endsWith(".pdf");
  const isImage = /\.(png|jpe?g|gif|webp|svg)$/.test(cleanUrl);
  return { isPdf, isImage };
}

/* ─── PDF Viewer ─────────────────────────────────────────────────
   Problem: Google Docs Viewer fires onLoad even when it fails to
   render, so we can't detect failure via onLoad alone.

   Strategy:
   • Stage 1 — try native <iframe> with the raw URL (works if
     Cloudinary does NOT send X-Frame-Options: SAMEORIGIN for this file).
   • Stage 2 — fall back to Google Docs Viewer if native errors.
   • Stage 3 — show a manual fallback UI if GDocs also errors.

   Key fix: add key={stage} so React fully remounts the iframe
   when we switch stages instead of just changing src (which
   doesn't reliably re-trigger onLoad/onError).
───────────────────────────────────────────────────────────────── */
type ViewerStage = "gdocs" | "direct" | "failed";

function PDFViewer({ url, title }: { url: string; title: string }) {
  const [stage,  setStage]  = useState<ViewerStage>("gdocs");
  const [loaded, setLoaded] = useState(false);

  // Force Cloudinary to serve inline instead of as attachment
  const inlineUrl = url.includes("cloudinary.com")
    ? url.replace("/upload/", "/upload/fl_inline/")
    : url;

  const gdocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(inlineUrl)}&embedded=true`;

  const advanceStage = () => {
    setLoaded(false);
    setStage((s) => {
      if (s === "gdocs")  return "direct";
      return "failed";
    });
  };

  if (stage === "failed") {
    return (
      <div className="flex flex-col items-center justify-center py-20 border-t border-border bg-muted/20 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-muted border border-border flex items-center justify-center">
          <FileText className="h-8 w-8 text-muted-foreground/30" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-semibold text-foreground">Preview unavailable</p>
          <p className="text-xs text-muted-foreground">
            The file cannot be previewed in browser.
          </p>
        </div>
        <button
          onClick={() => openPdfInNewTab(url)}
          className="flex items-center gap-1.5 h-8 px-4 rounded-lg border border-border bg-card text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <Eye className="h-3.5 w-3.5" /> Open PDF in new tab
        </button>
      </div>
    );
  }
/* ─── Open PDF in new tab ────────────────────────────────────────
   "Open in new tab" on Cloudinary raw URLs triggers a download
   instead of opening in browser. Fix: use fl_inline transformation
   to force browser inline rendering, then open that URL.
───────────────────────────────────────────────────────────────── */
function openPdfInNewTab(url: string) {
  // For Cloudinary: inject fl_inline so browser renders instead of downloading
  const viewUrl = url.includes("cloudinary.com")
    ? url.replace("/upload/", "/upload/fl_inline/")
    : url;
  window.open(viewUrl, "_blank", "noopener,noreferrer");
}
  const src = stage === "gdocs" ? gdocsUrl : inlineUrl;

  return (
    <div className="relative border-t border-border bg-muted/10">
      {!loaded && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-muted/20" style={{ minHeight: 200 }}>
          <Loader2 className="h-7 w-7 animate-spin text-muted-foreground/50" />
          <p className="text-[13px] text-muted-foreground">
            {stage === "gdocs" ? "Loading preview…" : "Trying direct viewer…"}
          </p>
        </div>
      )}
      <iframe
        key={stage}
        src={src}
        title={title}
        className="w-full h-[680px]"
        onLoad={() => setLoaded(true)}
        onError={advanceStage}
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />
    </div>
  );
}

 

/* ─── Skeleton ───────────────────────────────────────────────── */
function PaperDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <Skeleton className="h-9 w-36 rounded-xl" />
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="h-[2px] bg-muted" />
        <div className="p-6 space-y-4">
          <div className="flex gap-2">
            {[24, 20, 16].map((w) => (
              <Skeleton key={w} className={`h-6 w-${w} rounded-full`} />
            ))}
          </div>
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
        <div className="p-6 pt-0 grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <Skeleton className="h-[500px] rounded-2xl" />
    </div>
  );
}

/* ─── MetaItem ───────────────────────────────────────────────── */
function MetaItem({ icon: Icon, label, value }: {
  icon: React.ElementType; label: string; value?: string | number | null;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-muted-foreground/70 font-semibold uppercase tracking-wider">
          {label}
        </p>
        <p className="text-sm font-semibold text-foreground truncate">{value ?? "N/A"}</p>
      </div>
    </div>
  );
}

/* ─── DetailItem ─────────────────────────────────────────────── */
function DetailItem({ icon: Icon, label, value }: {
  icon: React.ElementType; label: string; value?: string | number | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
      <span>
        <span className="font-semibold text-foreground">{label}: </span>
        {value}
      </span>
    </div>
  );
}

/* ─── StatBadge ──────────────────────────────────────────────── */
function StatBadge({ icon: Icon, value, label }: {
  icon: React.ElementType; value: string | number; label: string;
}) {
  return (
    <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
      <Icon className="h-3.5 w-3.5" />
      <span className="font-bold text-foreground">{value}</span>
      <span>{label}</span>
    </div>
  );
}

/* ─── StyledInput ────────────────────────────────────────────── */
function StyledInput({
  value, onChange, placeholder, type = "text",
}: {
  value: string | number; onChange: (v: string) => void;
  placeholder?: string; type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "w-full h-10 rounded-xl border border-border bg-background px-3.5 text-sm text-foreground",
        "placeholder:text-muted-foreground/50 outline-none",
        "hover:border-primary/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all",
      )}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════ */
export default function PaperDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id }                    = use(params);
  const { user, isAuthenticated } = useAuthStore();
  const isAdmin                   = user?.role === "ADMIN";
  const router                    = useRouter();
  const qc                        = useQueryClient();

  const [editOpen,    setEditOpen]    = useState(false);
  const [editForm,    setEditForm]    = useState<EditForm>({
    title: "", description: "", year: new Date().getFullYear(),
    contentType: "PAST_PAPER" as ContentType,
  });
  const [deleteOpen,  setDeleteOpen]  = useState(false);
  const [downloading, setDownloading] = useState(false);

  /* ── Query ── */
  const { data: paper, isLoading, isError } = useQuery({
    queryKey: ["paper", id],
    queryFn:  () => paperService.getById(id),
    enabled:  !!id,
  });

  /* ── Mutations ── */
  const { mutate: updatePaper, isPending: updating } = useMutation({
    mutationFn: (data: Partial<EditForm>) => adminService.updatePaper(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["paper", id] });
      toast.success("Paper updated successfully");
      setEditOpen(false);
    },
    onError: (e) => toast.error(getApiError(e)),
  });

  const { mutate: deletePaper, isPending: deleting } = useMutation({
    mutationFn: () => adminService.deletePaper(id),
    onSuccess: () => {
      toast.success("Paper deleted");
      router.push("/admin/papers");
    },
    onError: (e) => toast.error(getApiError(e)),
  });

  const { mutate: approvePaper, isPending: approving } = useMutation({
    mutationFn: () => adminService.approvePaper(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["paper", id] });
      toast.success("Paper approved");
    },
    onError: (e) => toast.error(getApiError(e)),
  });

  /* ── Helpers ── */
  const openEdit = () => {
    if (!paper) return;
    setEditForm({
      title:       paper.title,
      description: paper.description ?? "",
      year:        paper.year,
      contentType: paper.contentType,
    });
    setEditOpen(true);
  };

  /* ── Download ── */
 // In handleDownload:
const handleDownload = async () => {
  if (!paper?.fileUrl || downloading) return;
  setDownloading(true);
  paperService.download(paper.id).catch(() => {});
  try {
    await triggerDownload(paper.fileUrl, paper.title, paper.fileType); // ← added paper.fileType
  } finally {
    setDownloading(false);
  }
};

  /* ── Render guards ── */
  if (isLoading) return <PaperDetailSkeleton />;

  if (isError || !paper) {
    return (
      <div className="max-w-4xl mx-auto">
        <EmptyState
          icon={FileText}
          title="Paper not found"
          description="This paper may have been removed or doesn't exist."
          actionLabel="Browse Papers"
          actionHref="/papers"
        />
      </div>
    );
  }

  const { isPdf, isImage } = detectFileType(paper.fileUrl, paper.fileType);

  /* ── JSX ── */
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: E }}
      className="max-w-4xl mx-auto space-y-5"
    >
      {/* Back */}
      <Link href="/papers">
        <motion.button
          whileHover={{ x: -3 }} whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 h-9 px-3 rounded-xl border border-border bg-card shadow-sm text-[13px] font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Papers
        </motion.button>
      </Link>

      {/* ── Admin Control Bar ── */}
      <AnimatePresence>
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: E }}
            className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 to-violet-50/60 p-4"
          >
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary via-violet-400 to-indigo-400 opacity-60" />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Shield className="h-3.5 w-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-foreground">Admin Controls</p>
                  <p className="text-[10px] text-muted-foreground">
                    Status:{" "}
                    <span className={cn(
                      "font-semibold",
                      paper.status === "APPROVED" ? "text-emerald-600" :
                      paper.status === "PENDING"  ? "text-amber-600"   : "text-red-600",
                    )}>
                      {paper.status}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {paper.status !== "APPROVED" && (
                  <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => approvePaper()}
                    disabled={approving}
                    className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-emerald-600 text-white text-[12px] font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-sm"
                  >
                    {approving
                      ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      : <CheckCircle className="h-3.5 w-3.5" />}
                    Approve
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={openEdit}
                  className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border bg-card text-[12px] font-semibold text-muted-foreground hover:text-primary hover:border-primary/40 transition-all shadow-sm"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setDeleteOpen(true)}
                  className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-red-200 bg-red-50 text-[12px] font-semibold text-red-600 hover:bg-red-100 transition-colors shadow-sm"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Header Card ── */}
      <Card className="overflow-hidden border-border shadow-sm">
        <div className="h-[2px] bg-gradient-to-r from-primary via-violet-400 to-indigo-400 opacity-80" />

        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
            <div className="space-y-3 flex-1 min-w-0">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className={cn(
                  "px-2.5 py-0.5 rounded-full text-[11px] font-semibold border",
                  getContentTypeColor(paper.contentType),
                )}>
                  {CONTENT_TYPE_LABELS[paper.contentType]}
                </span>
                <span className={cn(
                  "px-2.5 py-0.5 rounded-full text-[11px] font-semibold border",
                  getStatusColor(paper.status),
                )}>
                  {paper.status}
                </span>
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-border bg-muted text-muted-foreground">
                  <Calendar className="h-3 w-3" /> {paper.year}
                </span>
              </div>

              <CardTitle className="text-2xl md:text-3xl leading-tight text-foreground">
                {paper.title}
              </CardTitle>

              {paper.description && (
                <p className="text-[14px] text-muted-foreground leading-relaxed">
                  {paper.description}
                </p>
              )}

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <StatBadge icon={Download} value={paper.downloads ?? 0} label="downloads" />
                {paper.ratingAverage != null && (
                  <StatBadge
                    icon={Star}
                    value={paper.ratingAverage.toFixed(1)}
                    label={`(${paper.ratingCount ?? 0} ratings)`}
                  />
                )}
                {paper._count?.comments != null && (
                  <StatBadge icon={MessageSquare} value={paper._count.comments} label="comments" />
                )}
                {paper._count?.bookmarks != null && (
                  <StatBadge icon={Bookmark} value={paper._count.bookmarks} label="saved" />
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2 shrink-0">
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={handleDownload}
                disabled={downloading}
                className="relative flex items-center gap-2 h-10 px-5 rounded-xl bg-primary text-primary-foreground text-[13px] font-semibold shadow-md shadow-primary/20 hover:bg-primary/90 overflow-hidden transition-colors disabled:opacity-70"
              >
                <motion.span
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.14] to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{ x: "220%" }}
                  transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 3.5, ease: "easeInOut" }}
                />
                {downloading
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <Download className="h-4 w-4" />}
                {downloading ? "Downloading…" : "Download"}
              </motion.button>

              {isAuthenticated && (
                <>
                  <BookmarkButton paperId={paper.id} />
                  <ReportModal paperId={paper.id} />
                </>
              )}
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-5 space-y-5">
          {/* Meta grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/40 rounded-2xl border border-border/60">
            <MetaItem icon={BookOpen}      label="Course"      value={paper.course?.name}     />
            <MetaItem icon={GraduationCap} label="Program"     value={paper.program?.name}    />
            <MetaItem icon={Building2}     label="Department"  value={paper.department?.name} />
            <MetaItem icon={User}          label="Uploaded by" value={paper.uploadedBy?.name} />
          </div>

          {/* Detail row */}
          <div className="flex flex-wrap gap-x-6 gap-y-2.5">
            <DetailItem icon={User}     label="Teacher"  value={paper.teacherName} />
            <DetailItem icon={Hash}     label="Semester" value={paper.semester} />
            <DetailItem icon={FileText} label="Type"     value={paper.fileType?.toUpperCase()} />
            <DetailItem
              icon={Eye}
              label="Size"
              value={paper.fileSize
                ? `${(paper.fileSize / 1024 / 1024).toFixed(2)} MB`
                : null}
            />
            <DetailItem icon={Clock} label="Uploaded" value={formatDate(paper.createdAt)} />
          </div>

          {/* Tags */}
          {paper.tags?.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Tag className="h-3.5 w-3.5 text-muted-foreground/60" />
              {paper.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-medium border border-border bg-muted text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Preview Card ── */}
      <Card className="border-border shadow-sm overflow-hidden">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2 text-foreground">
            <Eye className="h-4 w-4 text-muted-foreground" /> Preview
          </CardTitle>
         {/* Inside the Preview Card header — replace the <a> tag */}
{isPdf && (
  <button
    onClick={() => window.open(paper.fileUrl, "_blank", "noopener,noreferrer")}
    className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border bg-muted text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors"
  >
    <Eye className="h-3.5 w-3.5" /> Open in new tab
  </button>
)}
        </CardHeader>

        <CardContent className="p-0">
          {isPdf ? (
            <PDFViewer url={paper.fileUrl} title={paper.title} />
          ) : isImage ? (
            <div className="flex justify-center p-6 bg-muted/20 border-t border-border">
              <img
                src={paper.fileUrl}
                alt={paper.title}
                className="max-w-full max-h-[600px] rounded-xl object-contain shadow-sm"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 bg-muted/20 border-t border-dashed border-border">
              <div className="w-16 h-16 rounded-2xl bg-muted border border-border flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-muted-foreground/30" />
              </div>
              <p className="text-base font-semibold text-foreground mb-1">Preview not available</p>
              <p className="text-sm text-muted-foreground mb-5">
                This file type cannot be previewed in the browser.
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={handleDownload}
                disabled={downloading}
                className="flex items-center gap-2 h-9 px-4 rounded-xl border border-border bg-card text-[13px] font-medium text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all shadow-sm disabled:opacity-60"
              >
                {downloading
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <Download className="h-4 w-4" />}
                {downloading ? "Downloading…" : "Download to view"}
              </motion.button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Rating ── */}
      {isAuthenticated && (
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-foreground">
              <Star className="h-4 w-4 text-amber-500" /> Rate this paper
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RatingStars paperId={paper.id} />
          </CardContent>
        </Card>
      )}

      {/* ── Comments ── */}
      <CommentSection paperId={paper.id} />

      {/* ── Admin Edit Dialog ── */}
      <Dialog open={editOpen} onOpenChange={(o) => { if (!o) setEditOpen(false); }}>
        <DialogContent className="rounded-2xl border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-black text-foreground flex items-center gap-2">
              <Pencil className="h-4 w-4 text-primary" /> Edit Paper
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold text-foreground/70">Title</label>
              <StyledInput
                value={editForm.title}
                onChange={(v) => setEditForm((f) => ({ ...f, title: v }))}
                placeholder="Paper title"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold text-foreground/70">
                Description <span className="text-muted-foreground/50">(optional)</span>
              </label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                rows={3}
                placeholder="Brief description…"
                className={cn(
                  "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground",
                  "placeholder:text-muted-foreground/50 outline-none resize-none",
                  "hover:border-primary/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all",
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-foreground/70">Year</label>
                <StyledInput
                  type="number"
                  value={editForm.year}
                  onChange={(v) => setEditForm((f) => ({ ...f, year: parseInt(v) || f.year }))}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-foreground/70">Content Type</label>
                <Select
                  value={editForm.contentType}
                  onValueChange={(v) => setEditForm((f) => ({ ...f, contentType: v as ContentType }))}
                >
                  <SelectTrigger className="h-10 rounded-xl border-border bg-background text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CONTENT_TYPE_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-border">
              <button
                onClick={() => setEditOpen(false)}
                className="flex-1 h-10 rounded-xl border border-border bg-muted/40 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={() => updatePaper(editForm)}
                disabled={!editForm.title.trim() || updating}
                className="flex-1 h-10 rounded-xl border border-border bg-card text-sm font-semibold text-foreground hover:bg-muted transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-sm"
              >
                {updating
                  ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  : <Pencil className="h-3.5 w-3.5" />}
                Save
              </button>

              {paper.status !== "APPROVED" && (
                <button
                  onClick={() => {
                    updatePaper(editForm, {
                      onSuccess: () => {
                        approvePaper();
                        setEditOpen(false);
                      },
                    });
                  }}
                  disabled={!editForm.title.trim() || updating || approving}
                  className="flex-1 h-10 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-600/20"
                >
                  {updating || approving
                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    : <CheckCircle className="h-3.5 w-3.5" />}
                  Save & Approve
                </button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Admin Delete Confirmation ── */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="rounded-2xl border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-black text-foreground">
              Delete this paper?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This will permanently remove{" "}
              <strong>&ldquo;{paper.title}&rdquo;</strong> and its file.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl border-border">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletePaper()}
              disabled={deleting}
              className="rounded-xl bg-red-600 hover:bg-red-700 text-white flex items-center gap-1.5"
            >
              {deleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Delete permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
