"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/common/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { CONTENT_TYPE_LABELS } from "@/types";
import { formatDate, cn, getApiError } from "@/lib/utils";
import { onSelectChange } from "@/lib/select-handler";
import { toast } from "sonner";
import {
  FileCog, Search, Trash2, EyeOff, PauseCircle,
  FileText, Filter, CheckCircle2, Clock, XCircle,
  Loader2, ExternalLink, Shield, Download, Calendar,
  AlertTriangle, RotateCcw, X,
} from "lucide-react";
import { PaperStatus } from "@/types";
/* ─── constants ──────────────────────────────────────────────── */
const E = [0.22, 1, 0.36, 1] as const;

type ActionKind = "delete" | "restrict" | "hold";

interface PendingAction {
  kind:  ActionKind;
  id:    string;
  title: string;
}

const ACTION_META: Record<ActionKind, {
  label:    string;
  desc:     string;
  confirm:  string;
  icon:     React.ElementType;
  iconColor:string;
  iconBg:   string;
  btnClass: string;
}> = {
  delete: {
    label:    "Delete permanently",
    desc:     "This will remove the paper and its file forever. This action cannot be undone.",
    confirm:  "Delete permanently",
    icon:     Trash2,
    iconColor:"text-red-600",
    iconBg:   "bg-red-50 border-red-200",
    btnClass: "bg-red-600 hover:bg-red-700 text-white",
  },
  restrict: {
    label:    "Restrict access",
    desc:     "The paper will be hidden from public access. It will not be deleted and can be re-approved later.",
    confirm:  "Restrict paper",
    icon:     EyeOff,
    iconColor:"text-orange-600",
    iconBg:   "bg-orange-50 border-orange-200",
    btnClass: "bg-orange-600 hover:bg-orange-700 text-white",
  },
  hold: {
    label:    "Put on hold",
    desc:     "The paper will return to PENDING status for re-review. The uploader will be notified.",
    confirm:  "Put on hold",
    icon:     PauseCircle,
    iconColor:"text-blue-600",
    iconBg:   "bg-blue-50 border-blue-200",
    btnClass: "bg-blue-600 hover:bg-blue-700 text-white",
  },
};

const STATUS_PILL: Record<string, { label: string; cls: string; icon: React.ElementType }> = {
  APPROVED:   { label: "Approved",   cls: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  PENDING:    { label: "Pending",    cls: "bg-amber-100 text-amber-700 border-amber-200",       icon: Clock        },
  REJECTED:   { label: "Rejected",   cls: "bg-red-100 text-red-700 border-red-200",             icon: XCircle      },
  RESTRICTED: { label: "Restricted", cls: "bg-orange-100 text-orange-700 border-orange-200",    icon: EyeOff       },
};

/* ─── row skeleton ───────────────────────────────────────────── */
function RowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-5 py-4 border-b border-border/60">
      <Skeleton className="w-8 h-8 rounded-xl shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-4 w-24 hidden md:block" />
      <Skeleton className="h-4 w-20 hidden lg:block" />
      <Skeleton className="h-6 w-20 rounded-full" />
      <div className="flex gap-1 shrink-0">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
    </div>
  );
}

/* ─── page ───────────────────────────────────────────────────── */
export default function ManagePapersPage() {
  const qc = useQueryClient();

  /* filter state */
  const [page,   setPage]   = useState(1);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [status, setStatus] = useState("all");

  /* action confirmation */
  const [pending, setPending] = useState<PendingAction | null>(null);

  /* search debounce */
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => { setDebounced(val); setPage(1); }, 400);
  }, []);

  /* data */
  const { data, isLoading } = useQuery({
    queryKey: ["admin-manage-papers", page, debounced, status],
    queryFn:  () => adminService.getPapers({
      page, limit: 15,
      search: debounced || undefined,
  ...(status !== "all" && { status: status as PaperStatus }),
    }),
  });

  /* stats — separate quick counts */
  const { data: approvedData } = useQuery({
    queryKey: ["admin-manage-count", "APPROVED"],
    queryFn:  () => adminService.getPapers({ limit: 1, status: "APPROVED" }),
  });
  const { data: pendingData } = useQuery({
    queryKey: ["admin-manage-count", "PENDING"],
    queryFn:  () => adminService.getPapers({ limit: 1, status: "PENDING" }),
  });
  const { data: rejectedData } = useQuery({
    queryKey: ["admin-manage-count", "REJECTED"],
    queryFn:  () => adminService.getPapers({ limit: 1, status: "REJECTED" }),
  });

  /* mutations */
  const mutOpts = (successMsg: string) => ({
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-manage-papers"] });
      qc.invalidateQueries({ queryKey: ["admin-manage-count"] });
      toast.success(successMsg);
      setPending(null);
    },
    onError: (e: unknown) => toast.error(getApiError(e)),
  });

  const { mutate: deletePaper,   isPending: deleting   } = useMutation({
    mutationFn: (id: string) => adminService.deletePaper(id),
    ...mutOpts("Paper permanently deleted"),
  });
  const { mutate: restrictPaper, isPending: restricting } = useMutation({
    mutationFn: (id: string) => adminService.restrictPaper(id),
    ...mutOpts("Paper restricted from public access"),
  });
  const { mutate: holdPaper,     isPending: holding     } = useMutation({
    mutationFn: (id: string) => adminService.holdPaper(id),
    ...mutOpts("Paper placed on hold for re-review"),
  });

  const isBusy = deleting || restricting || holding;

  const trigger = (kind: ActionKind, id: string, title: string) =>
    setPending({ kind, id, title });

  const confirm = () => {
    if (!pending) return;
    if (pending.kind === "delete")   deletePaper(pending.id);
    if (pending.kind === "restrict") restrictPaper(pending.id);
    if (pending.kind === "hold")     holdPaper(pending.id);
  };

  const statCards = [
    { label: "Approved",  val: approvedData?.pagination?.total ?? "—", color: "text-emerald-600", bg: "bg-emerald-50",  border: "border-emerald-200", icon: CheckCircle2 },
    { label: "Pending",   val: pendingData?.pagination?.total  ?? "—", color: "text-amber-600",   bg: "bg-amber-50",    border: "border-amber-200",   icon: Clock        },
    { label: "Rejected",  val: rejectedData?.pagination?.total ?? "—", color: "text-red-600",     bg: "bg-red-50",      border: "border-red-200",     icon: XCircle      },
    { label: "Total",     val: data?.pagination?.total         ?? "—", color: "text-primary",     bg: "bg-primary/10",  border: "border-primary/20",  icon: FileText     },
  ];

  return (
    <div className="space-y-6">

      {/* ── Hero ── */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: E }}
        className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-rose-50/60 via-background to-orange-50/40 p-6"
      >
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400 opacity-80" />
        <div className="absolute -top-14 -right-14 w-48 h-48 rounded-full bg-rose-400/8 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shadow-sm">
              <FileCog className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <h1 className="text-2xl font-black text-foreground tracking-tight">
                  Manage Papers
                </h1>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-rose-200 bg-rose-50 text-[9px] font-black text-rose-600 uppercase tracking-wider">
                  <Shield className="w-2.5 h-2.5" /> Admin Only
                </span>
              </div>
              <p className="text-[13px] text-muted-foreground">
                Full control over all published, pending, and rejected papers
              </p>
            </div>
          </div>

          {/* Action legend */}
          <div className="flex flex-wrap gap-2 shrink-0">
            {(["delete", "restrict", "hold"] as ActionKind[]).map((kind) => {
              const m = ACTION_META[kind];
              return (
                <div
                  key={kind}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold",
                    kind === "delete"   ? "bg-red-50 border-red-200 text-red-600"       :
                    kind === "restrict" ? "bg-orange-50 border-orange-200 text-orange-600" :
                                         "bg-blue-50 border-blue-200 text-blue-600",
                  )}
                >
                  <m.icon className="w-3 h-3" />
                  {kind.charAt(0).toUpperCase() + kind.slice(1)}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ── Stat Cards ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08, ease: E }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        {statCards.map(({ label, val, color, bg, border, icon: Icon }) => (
          <button
            key={label}
            onClick={() => {
              const map: Record<string, string> = {
                Approved: "APPROVED", Pending: "PENDING",
                Rejected: "REJECTED", Total: "all",
              };
              setStatus(map[label] ?? "all");
              setPage(1);
            }}
            className={cn(
              "relative overflow-hidden rounded-2xl border p-4 text-left shadow-sm transition-all duration-200",
              "hover:shadow-md hover:-translate-y-0.5",
              status === (label === "Total" ? "all" : label.toUpperCase())
                ? cn(bg, border, "ring-2 ring-offset-1")
                : "bg-card border-border",
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-lg border flex items-center justify-center mb-3",
              bg, border,
            )}>
              <Icon className={cn("w-3.5 h-3.5", color)} />
            </div>
            <p className={cn("text-2xl font-black tabular-nums leading-none", color)}>{val}</p>
            <p className="text-[11px] font-medium text-muted-foreground mt-1">{label}</p>
          </button>
        ))}
      </motion.div>

      {/* ── Toolbar ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.14, ease: E }}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-3"
      >
        {/* Search */}
        <div className="relative group flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 pointer-events-none group-focus-within:text-primary transition-colors" />
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search title, uploader, course…"
            className={cn(
              "w-full h-9 rounded-xl border border-border bg-card shadow-sm pl-10 text-sm text-foreground",
              "placeholder:text-muted-foreground/50 outline-none",
              search ? "pr-9" : "pr-3.5",
              "hover:border-primary/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all",
            )}
          />
          <AnimatePresence>
            {search && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => handleSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <Select
            value={status}
            onValueChange={onSelectChange((v) => { setStatus(v); setPage(1); })}
          >
            <SelectTrigger className="w-40 h-9 rounded-xl border-border bg-card shadow-sm text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Result count */}
        {!isLoading && data && (
          <p className="text-[12px] text-muted-foreground ml-auto shrink-0">
            {data.data.length} of {data.pagination?.total ?? 0}
          </p>
        )}
      </motion.div>

      {/* ── Table ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.18, ease: E }}
        className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
      >
        {/* Column headers */}
        <div className="hidden md:grid md:grid-cols-[2.5fr_1.2fr_1.2fr_1fr_auto] gap-4 px-5 py-3 border-b border-border bg-muted/30">
          {["Paper", "Uploader", "Course", "Status", "Actions"].map((h, i) => (
            <div
              key={h}
              className={cn(
                "text-[11px] font-bold uppercase tracking-wider text-muted-foreground",
                i === 4 && "text-right",
              )}
            >
              {h}
            </div>
          ))}
        </div>

        {/* Rows */}
        {isLoading ? (
          <>
            {Array.from({ length: 6 }).map((_, i) => <RowSkeleton key={i} />)}
          </>
        ) : !data?.data.length ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <div className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center">
              <FileText className="w-7 h-7 text-muted-foreground/30" />
            </div>
            <p className="font-semibold text-foreground">No papers found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or status filter
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {data.data.map((paper, i) => {
              const sc = STATUS_PILL[paper.status] ?? STATUS_PILL.PENDING;
              const StatusIcon = sc.icon;
              const isApproved = paper.status === "APPROVED";

              return (
                <motion.div
                  key={paper.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10, height: 0 }}
                  transition={{ delay: i * 0.028, duration: 0.3, ease: E }}
                  className="grid grid-cols-1 md:grid-cols-[2.5fr_1.2fr_1.2fr_1fr_auto] gap-3 md:gap-4 px-5 py-4 border-b border-border/50 last:border-0 hover:bg-muted/25 transition-colors items-center group"
                >
                  {/* Title + meta */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {paper.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-muted-foreground/60">
                          {CONTENT_TYPE_LABELS[paper.contentType]}
                        </span>
                        <span className="text-[10px] text-muted-foreground/30">·</span>
                        <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground/60">
                          <Calendar className="w-2.5 h-2.5" /> {paper.year}
                        </span>
                        <span className="text-[10px] text-muted-foreground/30">·</span>
                        <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground/60">
                          <Download className="w-2.5 h-2.5" /> {paper.downloads ?? 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Uploader */}
                  <div className="hidden md:block min-w-0">
                    <p className="text-sm text-muted-foreground truncate">
                      {paper.uploadedBy?.name ?? "—"}
                    </p>
                    <p className="text-[10px] text-muted-foreground/50 mt-0.5">
                      {formatDate(paper.createdAt)}
                    </p>
                  </div>

                  {/* Course / Dept */}
                  <div className="hidden md:block min-w-0">
                    <p className="text-sm text-muted-foreground truncate">
                      {paper.course?.name ?? "—"}
                    </p>
                    <p className="text-[10px] text-muted-foreground/50 mt-0.5 truncate">
                      {paper.department?.name ?? ""}
                    </p>
                  </div>

                  {/* Status badge */}
                  <div className="hidden md:block">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border",
                      sc.cls,
                    )}>
                      <StatusIcon className="w-3 h-3" />
                      {sc.label}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-1 shrink-0">
                    {/* Mobile status chip */}
                    <span className={cn(
                      "md:hidden inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border mr-1",
                      sc.cls,
                    )}>
                      <StatusIcon className="w-2.5 h-2.5" />
                      {sc.label}
                    </span>

                    {/* View */}
                    <Link href={`/papers/${paper.id}`} target="_blank">
                      <button
                        title="View paper"
                        className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </Link>

                    {/* Hold — approved only */}
                    {isApproved && (
                      <motion.button
                        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                        title="Put on hold (return to pending)"
                        onClick={() => trigger("hold", paper.id, paper.title)}
                        className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <PauseCircle className="w-3.5 h-3.5" />
                      </motion.button>
                    )}

                    {/* Restrict — approved only */}
                    {isApproved && (
                      <motion.button
                        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                        title="Restrict (hide from public)"
                        onClick={() => trigger("restrict", paper.id, paper.title)}
                        className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-orange-600 hover:bg-orange-50 transition-colors"
                      >
                        <EyeOff className="w-3.5 h-3.5" />
                      </motion.button>
                    )}

                    {/* Delete — always */}
                    <motion.button
                      whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                      title="Delete permanently"
                      onClick={() => trigger("delete", paper.id, paper.title)}
                      className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </motion.div>

      {data?.pagination && (
        <Pagination pagination={data.pagination} onPageChange={setPage} />
      )}

      {/* ── Confirmation Dialog ── */}
      <AlertDialog
        open={!!pending}
        onOpenChange={(open) => { if (!open && !isBusy) setPending(null); }}
      >
        <AlertDialogContent className="rounded-2xl border-border max-w-md">
          {pending && (() => {
            const meta = ACTION_META[pending.kind];
            const Icon = meta.icon;
            return (
              <>
                <AlertDialogHeader>
                  <div className={cn(
                    "w-12 h-12 rounded-2xl border flex items-center justify-center mb-2",
                    meta.iconBg,
                  )}>
                    <Icon className={cn("w-5 h-5", meta.iconColor)} />
                  </div>
                  <AlertDialogTitle className="font-black text-foreground">
                    {meta.label}
                  </AlertDialogTitle>
                 <AlertDialogDescription>
  <div className="space-y-2 text-muted-foreground">
                      <div className="flex items-start gap-2 p-3 rounded-xl bg-muted border border-border">
                        <FileText className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                        <p className="text-sm font-semibold text-foreground line-clamp-2">
                          {pending.title}
                        </p>
                      </div>
                      <p className="text-sm">{meta.desc}</p>
                      {pending.kind === "delete" && (
                        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-50 border border-red-200">
                          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                          <p className="text-[12px] font-semibold text-red-700">
                            This action is irreversible.
                          </p>
                        </div>
                      )}
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="gap-2">
                  <AlertDialogCancel
                    disabled={isBusy}
                    className="rounded-xl border-border"
                    onClick={() => setPending(null)}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={confirm}
                    disabled={isBusy}
                    className={cn(
                      "rounded-xl flex items-center gap-1.5 min-w-[120px] justify-center",
                      meta.btnClass,
                    )}
                  >
                    {isBusy
                      ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      : <Icon className="w-3.5 h-3.5" />
                    }
                    {isBusy ? "Processing…" : meta.confirm}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </>
            );
          })()}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}