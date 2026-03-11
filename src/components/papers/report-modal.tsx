"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { reportService } from "@/services/report.service";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Flag, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getApiError } from "@/lib/utils";
import { onSelectChange } from "@/lib/select-handler";
import type { ReportReason } from "@/types";
import { REPORT_REASON_LABELS } from "@/types";

interface Props {
  paperId: string;
}

export function ReportModal({ paperId }: Props) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason | "">("");
  const [description, setDescription] = useState("");

  const { mutate: submit, isPending } = useMutation({
    mutationFn: () => reportService.create(paperId, reason as ReportReason, description || undefined),
    onSuccess: () => {
      toast.success("Report submitted. An admin will review it.");
      setOpen(false);
      setReason("");
      setDescription("");
    },
    onError: (e) => toast.error(getApiError(e)),
  });

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Flag className="h-4 w-4 mr-2" />Report
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report This Paper</DialogTitle>
            <DialogDescription>Let us know why this paper should be reviewed.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Reason</Label>
              <Select
                value={reason || undefined}
                onValueChange={onSelectChange((v) => setReason(v as ReportReason))}
              >
                <SelectTrigger><SelectValue placeholder="Select a reason" /></SelectTrigger>
                <SelectContent>
                  {(Object.entries(REPORT_REASON_LABELS) as [ReportReason, string][]).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Details (optional)</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide additional details..." rows={3} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={() => submit()} disabled={!reason || isPending} variant="destructive">
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Submit Report
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}