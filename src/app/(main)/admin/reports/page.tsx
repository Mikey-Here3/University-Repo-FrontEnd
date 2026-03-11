"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useReports, useResolveReport } from "@/hooks/use-admin";
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
import { REPORT_REASON_LABELS, type ReportReason } from "@/types";
import { getStatusColor, formatDate, cn } from "@/lib/utils";
import { onSelectChange } from "@/lib/select-handler";
import { CheckCircle, Eye, Flag } from "lucide-react";

const E = [0.22, 1, 0.36, 1] as const;

export default function AdminReportsPage() {
  const [page,   setPage]   = useState(1);
  const [status, setStatus] = useState("PENDING");
  const { data, isLoading } = useReports({ page, status });
  const { mutate: resolve } = useResolveReport();

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
            <Flag className="w-4 h-4 text-primary" />
          </div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">Reports</h1>
        </div>

        <Select
          value={status}
          onValueChange={onSelectChange((v) => { setStatus(v); setPage(1); })}
        >
          <SelectTrigger className="w-40 h-9 rounded-xl border-border bg-card text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="RESOLVED">Resolved</SelectItem>
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
                {["Paper", "Reason", "Reporter", "Date", "Status", "Actions"].map((h, i) => (
                  <TableHead
                    key={h}
                    className={cn(
                      "text-[11px] font-bold uppercase tracking-wider text-muted-foreground",
                      i === 5 && "text-right",
                    )}
                  >
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data.map((report) => (
                <TableRow key={report.id} className="border-border hover:bg-muted/40 transition-colors">
                  <TableCell className="font-medium text-sm text-foreground max-w-[180px] truncate">
                    {report.paper.title}
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold border border-border bg-muted text-muted-foreground">
                      {REPORT_REASON_LABELS[report.reason as ReportReason] ?? report.reason}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{report.user.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatDate(report.createdAt)}
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[11px] font-semibold border",
                      getStatusColor(report.status),
                    )}>
                      {report.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Link href={`/papers/${report.paperId}`}>
                        <button className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </Link>
                      {report.status === "PENDING" && (
                        <button
                          onClick={() => resolve(report.id)}
                          className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors"
                        >
                          <CheckCircle className="h-3.5 w-3.5" /> Resolve
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {data?.data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-sm">
                    No reports found.
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