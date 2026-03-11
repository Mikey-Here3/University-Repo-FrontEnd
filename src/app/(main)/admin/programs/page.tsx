"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useDepartments } from "@/hooks/use-academic";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { programService } from "@/services/academic.service";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { SelectField } from "@/components/common/select-field";
import { EmptyState } from "@/components/common/empty-state";
import { cn, getApiError } from "@/lib/utils";
import { Plus, Trash2, Loader2, GraduationCap } from "lucide-react";
import { toast } from "sonner";

const E = [0.22, 1, 0.36, 1] as const;

export default function AdminProgramsPage() {
  const { data: departments } = useDepartments();
  const qc = useQueryClient();

  const [filterDept, setFilterDept] = useState("all");
  const { data: programs, isLoading } = useQuery({
    queryKey: ["programs", filterDept],
    queryFn:  () => programService.getAll(filterDept === "all" ? undefined : filterDept),
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [name,       setName]       = useState("");
  const [deptId,     setDeptId]     = useState("");

  const deptOptions   = departments?.map((d) => ({ value: d.id, label: d.name })) ?? [];
  const filterOptions = [{ value: "all", label: "All Departments" }, ...deptOptions];

  const openDialog = () => { setName(""); setDeptId(""); setDialogOpen(true); };

  const createMutation = useMutation({
    mutationFn: () => programService.create(name, deptId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["programs"] });
      setDialogOpen(false);
      toast.success("Program created");
    },
    onError: (e) => toast.error(getApiError(e)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => programService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["programs"] });
      toast.success("Program deleted");
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
            <GraduationCap className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground tracking-tight">Programs</h1>
            <p className="text-[12px] text-muted-foreground">{programs?.length ?? 0} total</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={openDialog}
          className="flex items-center gap-2 h-9 px-4 rounded-xl bg-primary text-primary-foreground text-[13px] font-semibold shadow-sm shadow-primary/20 hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" /> Add Program
        </motion.button>
      </motion.div>

      {/* Create dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="rounded-2xl border-border">
          <DialogHeader>
            <DialogTitle className="font-black text-foreground">New Program</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold text-foreground/70">Department</label>
              <SelectField
                value={deptId}
                onValueChange={setDeptId}
                placeholder="Select department"
                options={deptOptions}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold text-foreground/70">Program Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter program name"
                className={cn(
                  "w-full h-10 rounded-xl border border-border bg-background px-3.5 text-sm text-foreground",
                  "placeholder:text-muted-foreground/50 outline-none",
                  "focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all",
                )}
              />
            </div>
            <button
              onClick={() => createMutation.mutate()}
              disabled={!name.trim() || !deptId || createMutation.isPending}
              className="w-full h-10 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Create Program
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Filter */}
      <SelectField
        value={filterDept}
        onValueChange={setFilterDept}
        placeholder="Filter by department"
        options={filterOptions}
        className="w-60"
      />

      {/* Table */}
      {isLoading ? (
        <Skeleton className="h-64 rounded-2xl" />
      ) : !programs?.length ? (
        <EmptyState
          icon={GraduationCap}
          title="No programs found"
          description="Add a program to get started."
          actionLabel="Add Program"
          onAction={openDialog}
        />
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
                {["Program", "Department", "Courses", "Papers", "Actions"].map((h, i) => (
                  <TableHead
                    key={h}
                    className={cn(
                      "text-[11px] font-bold uppercase tracking-wider text-muted-foreground",
                      i === 4 && "text-right",
                    )}
                  >
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {programs.map((prog) => (
                <TableRow key={prog.id} className="border-border hover:bg-muted/40 transition-colors">
                  <TableCell className="font-semibold text-sm text-foreground">{prog.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{prog.department?.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{prog._count?.courses ?? 0}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{prog._count?.papers ?? 0}</TableCell>
                  <TableCell className="text-right">
                    <button
                      onClick={() => deleteMutation.mutate(prog.id)}
                      disabled={deleteMutation.isPending}
                      className="h-8 w-8 rounded-lg inline-flex items-center justify-center text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      )}
    </div>
  );
}