"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useUsers, useBlockUser, useUnblockUser } from "@/hooks/use-admin";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/common/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { getStatusColor, formatDate, cn } from "@/lib/utils";
import { Search, ShieldBan, ShieldCheck, Users } from "lucide-react";
import type { UserFilters } from "@/types";

const E = [0.22, 1, 0.36, 1] as const;

export default function AdminUsersPage() {
  const [filters, setFilters] = useState<UserFilters>({ page: 1, limit: 20 });
  const { data, isLoading } = useUsers(filters);
  const { mutate: block }   = useBlockUser();
  const { mutate: unblock } = useUnblockUser();

  return (
    <div className="space-y-6">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: E }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground tracking-tight">User Management</h1>
            <p className="text-[12px] text-muted-foreground">
              {data?.pagination?.total ?? 0} users total
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative group max-w-sm w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50 pointer-events-none group-focus-within:text-primary transition-colors" />
          <input
            placeholder="Search users…"
            className={cn(
              "w-full h-9 rounded-xl border border-border bg-card shadow-sm pl-10 pr-3.5 text-sm text-foreground",
              "placeholder:text-muted-foreground/50 outline-none",
              "hover:border-primary/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all",
            )}
            onChange={(e) =>
              setFilters((f) => ({ ...f, search: e.target.value || undefined, page: 1 }))
            }
          />
        </div>
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
                {["Name", "Email", "Role", "Status", "Papers", "Joined", "Actions"].map((h, i) => (
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
              {data?.data.map((user) => (
                <TableRow key={user.id} className="border-border hover:bg-muted/40 transition-colors">
                  <TableCell className="font-semibold text-sm text-foreground">{user.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold border border-border bg-muted text-muted-foreground">
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[11px] font-semibold border",
                      getStatusColor(user.status),
                    )}>
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{user._count?.papers ?? 0}</TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatDate(user.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    {user.role !== "ADMIN" && (
                      user.status === "ACTIVE" ? (
                        <button
                          onClick={() => block(user.id)}
                          className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-semibold text-red-600 hover:bg-red-50 transition-colors ml-auto"
                        >
                          <ShieldBan className="h-3.5 w-3.5" /> Block
                        </button>
                      ) : (
                        <button
                          onClick={() => unblock(user.id)}
                          className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors ml-auto"
                        >
                          <ShieldCheck className="h-3.5 w-3.5" /> Unblock
                        </button>
                      )
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {!data?.data.length && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-sm">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </motion.div>
      )}

      {data?.pagination && (
        <Pagination
          pagination={data.pagination}
          onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))}
        />
      )}
    </div>
  );
}