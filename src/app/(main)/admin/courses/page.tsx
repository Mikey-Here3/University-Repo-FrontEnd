"use client";
import { useState } from "react";
import { useDepartments, usePrograms } from "@/hooks/use-academic";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courseService } from "@/services/academic.service";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/empty-state";
import { SelectField } from "@/components/common/select-field";
import { Plus, Trash2, Loader2, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { getApiError } from "@/lib/utils";

const SEMESTER_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8].map((s) => ({
  value: s.toString(),
  label: `Semester ${s}`,
}));

export default function AdminCoursesPage() {
  const { data: departments } = useDepartments();
  const qc = useQueryClient();

  // Filters
  const [deptFilter, setDeptFilter] = useState("all");
  const [progFilter, setProgFilter] = useState("all");
  const { data: filterPrograms } = usePrograms(deptFilter === "all" ? undefined : deptFilter);
  const { data: courses, isLoading } = useQuery({
    queryKey: ["courses", progFilter],
    queryFn: () => courseService.getAll({
      programId: progFilter === "all" ? undefined : progFilter,
    }),
  });

  // Dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [newDeptId, setNewDeptId] = useState("");
  const [newProgId, setNewProgId] = useState("");
  const [semester, setSemester] = useState("");
  const { data: newPrograms } = usePrograms(newDeptId || undefined);

  const deptOptions = departments?.map((d) => ({ value: d.id, label: d.name })) || [];
  const newProgOptions = newPrograms?.map((p) => ({ value: p.id, label: p.name })) || [];
  const filterProgOptions = [
    { value: "all", label: "All Programs" },
    ...(filterPrograms?.map((p) => ({ value: p.id, label: p.name })) || []),
  ];

  const openDialog = () => {
    setName("");
    setNewDeptId("");
    setNewProgId("");
    setSemester("");
    setDialogOpen(true);
  };

  const createMutation = useMutation({
    mutationFn: () => courseService.create(name, newProgId, parseInt(semester)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["courses"] });
      setDialogOpen(false);
      toast.success("Course created");
    },
    onError: (e) => toast.error(getApiError(e)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => courseService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Deleted");
    },
    onError: (e) => toast.error(getApiError(e)),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Courses</h1>
        <Button onClick={openDialog}>
          <Plus className="h-4 w-4 mr-2" />Add Course
        </Button>
      </div>

      {/* Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Course</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Department</Label>
              <SelectField
                value={newDeptId}
                onValueChange={(v) => { setNewDeptId(v); setNewProgId(""); }}
                placeholder="Select department"
                options={deptOptions}
              />
            </div>

            <div className="space-y-2">
              <Label>Program</Label>
              <SelectField
                value={newProgId}
                onValueChange={setNewProgId}
                placeholder="Select program"
                options={newProgOptions}
                disabled={!newDeptId}
              />
            </div>

            <div className="space-y-2">
              <Label>Course Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter course name"
              />
            </div>

            <div className="space-y-2">
              <Label>Semester</Label>
              <SelectField
                value={semester}
                onValueChange={setSemester}
                placeholder="Select semester"
                options={SEMESTER_OPTIONS}
              />
            </div>

            <Button
              onClick={() => createMutation.mutate()}
              disabled={!name || !newProgId || !semester || createMutation.isPending}
              className="w-full"
            >
              {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Filters */}
      <div className="flex gap-3">
        <SelectField
          value={deptFilter}
          onValueChange={(v) => { setDeptFilter(v); setProgFilter("all"); }}
          placeholder="Department"
          options={[{ value: "all", label: "All Departments" }, ...deptOptions]}
          className="w-48"
        />
        <SelectField
          value={progFilter}
          onValueChange={setProgFilter}
          placeholder="Program"
          options={filterProgOptions}
          disabled={deptFilter === "all"}
          className="w-48"
        />
      </div>

      {isLoading ? (
        <Skeleton className="h-64" />
      ) : !courses?.length ? (
        <EmptyState
          icon={BookOpen}
          title="No courses found"
          description="Add a course or adjust your filters."
          actionLabel="Add Course"
          onAction={openDialog}
        />
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Papers</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.program?.name}</TableCell>
                  <TableCell>{c.program?.department?.name}</TableCell>
                  <TableCell>{c.semester}</TableCell>
                  <TableCell>{c._count?.papers ?? 0}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600"
                      onClick={() => deleteMutation.mutate(c.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}