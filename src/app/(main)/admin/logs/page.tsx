"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useModerationLogs } from "@/hooks/use-admin";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/common/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, cn } from "@/lib/utils";
import { onSelectChange } from "@/lib/select-handler";
import { ClipboardList } from "lucide-react";

const E = [0.22, 1, 0.36, 1] as const;

const ACTION_LABELS: Record<string, string> = {
  APPROVED_PAPER:  "Approved Paper",
  REJECTED_PAPER:  "Rejected Paper",
  DELETED_PAPER:   "Deleted Paper",
  BLOCKED_USER:    "Blocked User",
  UNBLOCKED_USER:  "Unblocked User",
  DELETED_COMMENT: "Deleted Comment",
  RESOLVED_REPORT: "Resolved Report",
};

const ACTION_COLORS: Record<string, string> = {
  APPROVED_PAPER:  "bg-emerald-100 text-emerald-700 border border-emerald-200",
  REJECTED_PAPER:  "bg-amber-100 text-amber-700 border border-amber-200",
  DELETED_PAPER:   "bg-red-100 text-red-700 border border-red-200",
  BLOCKED_USER:    "bg-red-100 text-red-700 border border-red-200",
  UNBLOCKED_USER:  "bg-emerald-100 text-emerald-700 border border-emerald-200",
  DELETED_COMMENT: "bg-orange-100 text-orange-700 border border-orange-200",
  RESOLVED_REPORT: "bg-blue-100 text-blue-700 border border-blue-200",
};

export default function AdminLogsPage() {
  const [page,   setPage]   = useState(1);
  const [action, setAction] = useState<string | undefined>();
  const { data, isLoading } = useModerationLogs({ page, action });

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
            <ClipboardList className="w-4 h-4 text-primary" />
          </div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">Moderation Logs</h1>
        </div>

        <Select
          value={action ?? "all"}
          onValueChange={onSelectChange((v) => {
            setAction(v === "all" ? undefined : v);
            setPage(1);
          })}
        >
          <SelectTrigger className="w-48 h-9 rounded-xl border-border bg-card text-sm">
            <SelectValue placeholder="Filter by action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            {Object.entries(ACTION_LABELS).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
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
                {["Action", "Admin", "Target Type", "Target ID", "Details", "Date"].map((h) => (
                  <TableHead key={h} className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data.map((log) => (
                <TableRow key={log.id} className="border-border hover:bg-muted/40 transition-colors">
                  <TableCell>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[11px] font-semibold",
                      ACTION_COLORS[log.action] ?? "bg-muted text-muted-foreground border border-border",
                    )}>
                      {ACTION_LABELS[log.action] ?? log.action}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium text-sm text-foreground">{log.admin.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{log.targetType}</TableCell>
                  <TableCell className="font-mono text-[11px] text-muted-foreground max-w-[110px] truncate">
                    {log.targetId}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[180px] truncate">
                    {log.details ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatDate(log.timestamp)}
                  </TableCell>
                </TableRow>
              ))}
              {data?.data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-sm">
                    No logs found.
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
    </div>
  );
}