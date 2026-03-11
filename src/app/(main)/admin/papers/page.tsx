"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useAdminPapers, useApprovePaper,
  useRejectPaper, useAdminDeletePaper,
} from "@/hooks/use-admin";
import { adminService } from "@/services/admin.service";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Pagination } from "@/components/common/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { CONTENT_TYPE_LABELS, type ContentType, type PaperStatus } from "@/types";
import { getStatusColor, getContentTypeColor, formatDate, getApiError, cn } from "@/lib/utils";
import { onSelectChange } from "@/lib/select-handler";
import {
  Check, X, Trash2, Eye, Pencil,
  FileText, Loader2, CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

const E = [0.22, 1, 0.36, 1] as const;

/* ─── edit form type ─────────────────────────────────────────── */
type EditForm = {
  title:       string;
  description: string;
  year:        number;
  contentType: ContentType;
};

/* ─── page ───────────────────────────────────────────────────── */
export default function AdminPapersPage() {
  const qc = useQueryClient();

  /* filters */
  const [page,   setPage]   = useState(1);
  const [status, setStatus] = useState<PaperStatus | "all">("PENDING");

  /* action state */
  const [deleteId,     setDeleteId]     = useState<string | null>(null);
  const [rejectId,     setRejectId]     = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [editOpen,     setEditOpen]     = useState(false);
  const [editId,       setEditId]       = useState<string | null>(null);
  const [editForm,     setEditForm]     = useState<EditForm>({
    title:       "",
    description: "",
    year:        new Date().getFullYear(),
    contentType: "PAST_PAPER" as ContentType,
  });

  /* queries */
  const filters = {
    page, limit: 15,
    ...(status !== "all" && { status: status as PaperStatus }),
  };
  const { data, isLoading }                     = useAdminPapers(filters);
  const { mutate: approve, isPending: approving } = useApprovePaper();
  const { mutate: reject,  isPending: rejecting } = useRejectPaper();
  const { mutate: deletePaper }                   = useAdminDeletePaper();

  /* edit + approve mutation */
  const { mutate: updatePaper, isPending: updating } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EditForm> }) =>
      adminService.updatePaper(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-papers"] });
      toast.success("Paper updated");
    },
    onError: (e) => toast.error(getApiError(e)),
  });

  const openEdit = (paper: { id: string; title: string; description?: string; year: number; contentType: ContentType }) => {
    setEditId(paper.id);
    setEditForm({
      title:       paper.title,
      description: paper.description ?? "",
      year:        paper.year,
      contentType: paper.contentType,
    });
    setEditOpen(true);
  };

  const handleSave = () => {
    if (!editId) return;
    updatePaper({ id: editId, data: editForm }, {
      onSuccess: () => setEditOpen(false),
    });
  };

  const handleSaveAndApprove = () => {
    if (!editId) return;
    updatePaper({ id: editId, data: editForm }, {
      onSuccess: () => {
        approve(editId, {
          onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["admin-papers"] });
            setEditOpen(false);
            toast.success("Paper updated and approved");
          },
        });
      },
    });
  };

  const handleReject = () => {
    if (!rejectId) return;
    reject(
      { id: rejectId, reason: rejectReason || undefined },
      { onSuccess: () => { setRejectId(null); setRejectReason(""); } },
    );
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: E }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">Paper Moderation</h1>
        </div>

        <Select
          value={status}
          onValueChange={onSelectChange((v) => { setStatus(v as PaperStatus | "all"); setPage(1); })}
        >
          <SelectTrigger className="w-40 h-9 rounded-xl border-border bg-card text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Table */}
      {isLoading ? (
        <Skeleton className="h-96 rounded-2xl" />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: E }}
          className="rounded-2xl border border-border bg-card shadow-sm overflow-x-auto"
        >
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                {["Title", "Type", "Course", "Uploader", "Year", "Status", "Actions"].map((h, i) => (
                  <TableHead
                    key={h}
                    className={cn(
                      "text-[11px] font-bold uppercase tracking-wider text-muted-foreground",
                      i === 6 && "text-right",
                    )}
                  >
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data.map((paper) => (
                <TableRow
                  key={paper.id}
                  className="border-border hover:bg-muted/40 transition-colors"
                >
                  <TableCell className="font-medium text-sm text-foreground max-w-[180px] truncate">
                    {paper.title}
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[11px] font-semibold border",
                      getContentTypeColor(paper.contentType),
                    )}>
                      {CONTENT_TYPE_LABELS[paper.contentType]}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{paper.course?.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{paper.uploadedBy?.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{paper.year}</TableCell>
                  <TableCell>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[11px] font-semibold border",
                      getStatusColor(paper.status),
                    )}>
                      {paper.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {/* View */}
                      <Link href={`/papers/${paper.id}`}>
                        <button className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </Link>

                      {/* Edit */}
                      <button
onClick={() =>
  openEdit({
    ...paper,
    description: paper.description ?? undefined,
  })
}                        className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-violet-600 hover:bg-violet-50 transition-colors"
                        title="Edit paper"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>

                      {/* Pending-only actions */}
                      {paper.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => approve(paper.id)}
                            disabled={approving}
                            className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-50"
                            title="Approve"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setRejectId(paper.id)}
                            className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-amber-600 hover:bg-amber-50 transition-colors"
                            title="Reject"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => setDeleteId(paper.id)}
                        className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {data?.data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-sm">
                    No papers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </motion.div>
      )}

      {data?.pagination && (
        <Pagination pagination={data.pagination} onPageChange={setPage} />
      )}

      {/* ── Edit Paper Dialog ── */}
      <Dialog open={editOpen} onOpenChange={(open) => { if (!open) { setEditOpen(false); setEditId(null); } }}>
        <DialogContent className="rounded-2xl border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-black text-foreground">Edit Paper</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold text-foreground/70">Title</label>
              <input
                value={editForm.title}
                onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                className={cn(
                  "w-full h-10 rounded-xl border border-border bg-background px-3.5 text-sm text-foreground",
                  "placeholder:text-muted-foreground/50 outline-none",
                  "focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all",
                )}
                placeholder="Paper title"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold text-foreground/70">
                Description <span className="text-muted-foreground/50">(optional)</span>
              </label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                rows={3}
                className={cn(
                  "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground",
                  "placeholder:text-muted-foreground/50 outline-none resize-none",
                  "focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all",
                )}
                placeholder="Brief description..."
              />
            </div>

            {/* Year + Content Type row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-foreground/70">Year</label>
                <input
                  type="number"
                  value={editForm.year}
                  onChange={(e) => setEditForm((f) => ({ ...f, year: parseInt(e.target.value) || f.year }))}
                  min={2000}
                  max={new Date().getFullYear()}
                  className={cn(
                    "w-full h-10 rounded-xl border border-border bg-background px-3.5 text-sm text-foreground",
                    "outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all",
                  )}
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

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-border">
              <button
                onClick={() => setEditOpen(false)}
                className="flex-1 h-10 rounded-xl border border-border bg-muted/40 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!editForm.title.trim() || updating}
                className="flex-1 h-10 rounded-xl border border-border bg-card text-sm font-semibold text-foreground hover:bg-muted transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {updating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Pencil className="h-3.5 w-3.5" />}
                Save
              </button>
              <button
                onClick={handleSaveAndApprove}
                disabled={!editForm.title.trim() || updating || approving}
                className="flex-1 h-10 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-600/20"
              >
                {updating || approving
                  ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  : <CheckCircle className="h-3.5 w-3.5" />}
                Save & Approve
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Reject Dialog ── */}
      <Dialog
        open={!!rejectId}
        onOpenChange={(open) => { if (!open) { setRejectId(null); setRejectReason(""); } }}
      >
        <DialogContent className="rounded-2xl border-border">
          <DialogHeader>
            <DialogTitle className="font-black text-foreground">Reject Paper</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold text-foreground/70">
                Reason <span className="text-muted-foreground/50">(optional)</span>
              </label>
              <textarea
                placeholder="Explain why this paper is being rejected..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                className={cn(
                  "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground",
                  "placeholder:text-muted-foreground/50 outline-none resize-none",
                  "focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all",
                )}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setRejectId(null); setRejectReason(""); }}
                className="flex-1 h-10 rounded-xl border border-border bg-muted/40 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={rejecting}
                className="flex-1 h-10 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {rejecting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Reject Paper
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation ── */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => { if (!open) setDeleteId(null); }}>
        <AlertDialogContent className="rounded-2xl border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-black text-foreground">Delete paper?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This action cannot be undone. The paper and its file will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl border-border">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { if (deleteId) { deletePaper(deleteId); setDeleteId(null); } }}
              className="rounded-xl bg-red-600 hover:bg-red-700 text-white"
            >
              Delete permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}