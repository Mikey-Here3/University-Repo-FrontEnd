"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useDashboardStats, useModerationLogs } from "@/hooks/use-admin";
import { StatsCard } from "@/components/common/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRelativeDate, cn } from "@/lib/utils";
import {
  Users, FileText, Clock, Flag, FolderTree,
  ArrowRight, Activity, Shield, AlertTriangle, CheckCircle2,
} from "lucide-react";

/* ─── constants ──────────────────────────────────────────────── */
const E = [0.22, 1, 0.36, 1] as const;

const ACTION_LABELS: Record<string, string> = {
  APPROVED_PAPER:  "Approved Paper",
  REJECTED_PAPER:  "Rejected Paper",
  DELETED_PAPER:   "Deleted Paper",
  BLOCKED_USER:    "Blocked User",
  UNBLOCKED_USER:  "Unblocked User",
  RESOLVED_REPORT: "Resolved Report",
};

const ACTION_COLORS: Record<string, string> = {
  APPROVED_PAPER:  "bg-emerald-100 text-emerald-700 border border-emerald-200",
  REJECTED_PAPER:  "bg-amber-100 text-amber-700 border border-amber-200",
  DELETED_PAPER:   "bg-red-100 text-red-700 border border-red-200",
  BLOCKED_USER:    "bg-red-100 text-red-700 border border-red-200",
  UNBLOCKED_USER:  "bg-emerald-100 text-emerald-700 border border-emerald-200",
  RESOLVED_REPORT: "bg-blue-100 text-blue-700 border border-blue-200",
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};
const vUp = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: E } },
};

/* ─── page ───────────────────────────────────────────────────── */
export default function AdminDashboardPage() {
  const { data: stats, isLoading: statsLoading, isError: statsError } = useDashboardStats();
  const { data: logsData, isLoading: logsLoading } = useModerationLogs({ limit: 8 });

  const statCards = [
    { label: "Total Users",      value: stats?.totalUsers      ?? 0, icon: Users,      href: "/admin/users",       color: "text-blue-600"   },
    { label: "Approved Papers",  value: stats?.totalPapers     ?? 0, icon: FileText,    href: "/admin/papers",      color: "text-emerald-600" },
    { label: "Pending Papers",   value: stats?.pendingPapers   ?? 0, icon: Clock,       href: "/admin/papers",      color: "text-amber-600"   },
    { label: "Pending Reports",  value: stats?.pendingReports  ?? 0, icon: Flag,        href: "/admin/reports",     color: "text-red-600"     },
    { label: "Departments",      value: stats?.totalDepartments ?? 0, icon: FolderTree, href: "/admin/departments", color: "text-violet-600"  },
  ];

  const quickActions = [
    { label: "Review Pending Papers", href: "/admin/papers",      icon: FileText, badge: stats?.pendingPapers  },
    { label: "Manage Reports",        href: "/admin/reports",     icon: Flag,     badge: stats?.pendingReports },
    { label: "Manage Users",          href: "/admin/users",       icon: Users                                  },
    { label: "Add Department",        href: "/admin/departments", icon: FolderTree                             },
  ];

  return (
    <div className="space-y-8">

      {/* ── Hero ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: E }}
        className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/8 via-background to-violet-50/60 p-6 md:p-8"
      >
        {/* Top accent */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary via-violet-400 to-indigo-400 opacity-80" />
        {/* Ambient orb */}
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-primary/8 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-black text-primary uppercase tracking-widest">
                  <span className="w-1 h-1 rounded-full bg-primary animate-ping" /> Admin Panel
                </div>
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight mb-1">
              Admin Dashboard
            </h1>
            <p className="text-[14px] text-muted-foreground">
              Manage papers, users, reports, and academic structure.
            </p>
          </div>

          {/* CTA pills */}
          <div className="flex flex-wrap gap-2 shrink-0">
            <Link href="/admin/papers">
              <motion.div
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 h-9 px-4 rounded-xl bg-primary text-primary-foreground text-[13px] font-semibold shadow-md shadow-primary/20 hover:bg-primary/90 transition-colors cursor-pointer"
              >
                <Clock className="h-3.5 w-3.5" />
                {stats?.pendingPapers ?? 0} Pending Papers
              </motion.div>
            </Link>
            <Link href="/admin/reports">
              <motion.div
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 h-9 px-4 rounded-xl border border-border bg-card text-[13px] font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all cursor-pointer"
              >
                <Flag className="h-3.5 w-3.5" />
                {stats?.pendingReports ?? 0} Reports
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ── Error banner ── */}
      {statsError && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-800">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="font-semibold text-sm">Could not load dashboard stats</p>
            <p className="text-xs text-amber-700/80 mt-0.5">
              Make sure the backend is running and the /admin/dashboard endpoint exists.
            </p>
          </div>
        </div>
      )}

      {/* ── Stats ── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
      >
        {statCards.map((c) => (
          <motion.div key={c.label} variants={vUp} whileHover={{ y: -3, transition: { duration: 0.2 } }}>
            <Link href={c.href}>
              <StatsCard {...c} loading={statsLoading} />
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Quick actions + Recent activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15, ease: E }}
        >
          <Card className="border-border shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="text-[15px] font-black text-foreground tracking-tight">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-1">
              {quickActions.map((action) => (
                <Link key={action.label} href={action.href}>
                  <div className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-muted/60 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                        <action.icon className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{action.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {action.badge !== undefined && action.badge > 0 && (
                        <span className="flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-red-100 border border-red-200 text-[10px] font-bold text-red-700">
                          {action.badge}
                        </span>
                      )}
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.22, ease: E }}
        >
          <Card className="border-border shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-border pb-4 flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-[15px] font-black text-foreground tracking-tight">
                <Activity className="h-4 w-4 text-primary" />
                Recent Activity
              </CardTitle>
              <Link href="/admin/logs">
                <span className="text-[12px] font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                  View all <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            </CardHeader>
            <CardContent className="p-3">
              {logsLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-11 rounded-xl" />
                  ))}
                </div>
              ) : !logsData?.data?.length ? (
                <div className="flex flex-col items-center gap-2 py-10 text-center">
                  <CheckCircle2 className="h-8 w-8 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {logsData.data.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0",
                          ACTION_COLORS[log.action] ?? "bg-muted text-muted-foreground border border-border",
                        )}>
                          {ACTION_LABELS[log.action] ?? log.action}
                        </span>
                        <span className="text-[11px] text-muted-foreground truncate">
                          by {log.admin.name}
                        </span>
                      </div>
                      <span className="text-[11px] text-muted-foreground/60 shrink-0 ml-2">
                        {formatRelativeDate(log.timestamp)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}