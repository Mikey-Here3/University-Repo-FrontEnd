"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDepartments } from "@/hooks/use-academic";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { departmentService } from "@/services/academic.service";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, getApiError } from "@/lib/utils";
import { Plus, Trash2, Pencil, Loader2, FolderTree, Check, X } from "lucide-react";
import { toast } from "sonner";

const E = [0.22, 1, 0.36, 1] as const;

export default function AdminDepartmentsPage() {
  const { data: departments, isLoading } = useDepartments();
  const qc = useQueryClient();

  const [name,       setName]       = useState("");
  const [editId,     setEditId]     = useState<string | null>(null);
  const [editName,   setEditName]   = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const createMutation = useMutation({
    mutationFn: () => departmentService.create(name),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["departments"] });
      setName(""); setDialogOpen(false);
      toast.success("Department created");
    },
    onError: (e) => toast.error(getApiError(e)),
  });

  const updateMutation = useMutation({
    mutationFn: () => departmentService.update(editId!, editName),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["departments"] });
      setEditId(null);
      toast.success("Department updated");
    },
    onError: (e) => toast.error(getApiError(e)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => departmentService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Department deleted");
    },
    onError: (e) => toast.error(getApiError(e)),
  });

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
            <FolderTree className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground tracking-tight">Departments</h1>
            <p className="text-[12px] text-muted-foreground">
              {departments?.length ?? 0} total
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={() => setDialogOpen(true)}
          className="flex items-center gap-2 h-9 px-4 rounded-xl bg-primary text-primary-foreground text-[13px] font-semibold shadow-sm shadow-primary/20 hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" /> Add Department
        </motion.button>
      </motion.div>

      {/* Create dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="rounded-2xl border-border">
          <DialogHeader>
            <DialogTitle className="font-black text-foreground">New Department</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <input
              className={cn(
                "w-full h-10 rounded-xl border border-border bg-background px-3.5 text-sm text-foreground",
                "placeholder:text-muted-foreground/50 outline-none",
                "focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all",
              )}
              placeholder="Department name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && name.trim() && createMutation.mutate()}
            />
            <button
              onClick={() => createMutation.mutate()}
              disabled={!name.trim() || createMutation.isPending}
              className="w-full h-10 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Create Department
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Table */}
      {isLoading ? (
        <Skeleton className="h-64 rounded-2xl" />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: E }}
          className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
        >
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">#</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Name</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Programs</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Papers</TableHead>
                <TableHead className="text-right text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {departments?.map((dept, i) => (
                  <motion.tr
                    key={dept.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-border hover:bg-muted/40 transition-colors"
                  >
                    <TableCell className="text-[12px] text-muted-foreground/60 font-mono">
                      {String(i + 1).padStart(2, "0")}
                    </TableCell>
                    <TableCell>
                      {editId === dept.id ? (
                        <div className="flex gap-2">
                          <input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="h-8 rounded-lg border border-border bg-background px-2.5 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all flex-1"
                            onKeyDown={(e) => e.key === "Enter" && updateMutation.mutate()}
                            autoFocus
                          />
                          <button
                            onClick={() => updateMutation.mutate()}
                            disabled={updateMutation.isPending}
                            className="h-8 px-3 rounded-lg bg-primary text-primary-foreground text-[12px] font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center gap-1"
                          >
                            {updateMutation.isPending
                              ? <Loader2 className="h-3 w-3 animate-spin" />
                              : <Check className="h-3 w-3" />}
                          </button>
                          <button
                            onClick={() => setEditId(null)}
                            className="h-8 px-2 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <span className="font-semibold text-sm text-foreground">{dept.name}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{dept._count?.programs ?? 0}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{dept._count?.papers ?? 0}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => { setEditId(dept.id); setEditName(dept.name); }}
                          className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => deleteMutation.mutate(dept.id)}
                          disabled={deleteMutation.isPending}
                          className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {!departments?.length && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground text-sm">
                    No departments yet. Add your first one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </motion.div>
      )}
    </div>
  );
}