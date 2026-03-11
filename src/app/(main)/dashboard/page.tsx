"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useAuthStore } from "@/store/auth-store";
import { useProfile } from "@/hooks/use-auth";
import { usePapers, useMyUploads } from "@/hooks/use-papers";
import { PaperCard } from "@/components/papers/paper-card";
import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import { getStatusColor, formatDate, cn } from "@/lib/utils";
import {
  FileText, Upload, Bookmark, Star, ArrowRight,
  Clock, Search, FolderOpen, BarChart2,
  Plus, Flame, Zap,
} from "lucide-react";

/* ─── helpers ─────────────────────────────────────────────────── */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: "Good morning",   emoji: "☀️" };
  if (h < 17) return { text: "Good afternoon", emoji: "👋" };
  return       { text: "Good evening",         emoji: "🌙" };
}

const E = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  show: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.5, ease: E },
  } as const,
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.02 } },
};

const ACTIVITY = [20, 55, 30, 85, 40, 70, 95, 25, 65, 45, 80, 50, 75, 100];

/* ─── StatCard ───────────────────────────────────────────────── */
function StatCard({
  label, value, icon: Icon, color, bg, border, loading,
}: {
  label: string; value: number; icon: React.ElementType;
  color: string; bg: string; border: string; loading: boolean;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm p-5 group hover:-translate-y-0.5 transition-transform duration-200"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
      <div className={cn(
        "mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl border",
        bg, border, color,
      )}>
        <Icon className="h-4 w-4" />
      </div>
      {loading ? (
        <div className="h-8 w-14 rounded-lg bg-muted animate-pulse mb-1" />
      ) : (
        <p className="text-2xl font-black text-foreground tabular-nums leading-none">{value}</p>
      )}
      <p className="text-[12px] font-medium text-muted-foreground mt-1.5 leading-none">{label}</p>
    </motion.div>
  );
}

/* ─── SectionHeader ──────────────────────────────────────────── */
function SectionHeader({
  icon: Icon, title, href,
}: {
  icon: React.ElementType; title: string; href: string;
}) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
          <Icon className="h-3.5 w-3.5 text-primary" />
        </div>
        <h2 className="text-[15px] font-semibold text-foreground">{title}</h2>
      </div>
      <Link href={href}>
        <motion.button
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          className="flex items-center gap-1.5 h-8 px-3.5 rounded-xl border border-border bg-card shadow-sm text-[12px] text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all"
        >
          View All <ArrowRight className="h-3 w-3" />
        </motion.button>
      </Link>
    </div>
  );
}

/* ─── Section scroll wrapper ─────────────────────────────────── */
function Section({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
    >
      {children}
    </motion.div>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function DashboardPage() {
  const { user }    = useAuthStore();
  const { data: profile,        isLoading: profileLoading  } = useProfile();
  const { data: recentPapers,   isLoading: recentLoading   } = usePapers({ limit: 4, sortBy: "createdAt", sortOrder: "desc" });
  const { data: trendingPapers, isLoading: trendingLoading } = usePapers({ limit: 4, sortBy: "downloads",  sortOrder: "desc" });
  const { data: myUploads } = useMyUploads(1);
  const greeting = getGreeting();

  const stats = [
    { label: "Papers Uploaded", value: profile?._count?.papers    ?? 0, icon: Upload,   color: "text-violet-600",  bg: "bg-violet-500/10",  border: "border-violet-500/20"  },
    { label: "Bookmarks",       value: profile?._count?.bookmarks  ?? 0, icon: Bookmark, color: "text-amber-600",   bg: "bg-amber-500/10",   border: "border-amber-500/20"   },
    { label: "Ratings Given",   value: profile?._count?.ratings    ?? 0, icon: Star,     color: "text-emerald-600", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: "Comments",        value: profile?._count?.comments   ?? 0, icon: FileText, color: "text-blue-600",    bg: "bg-blue-500/10",    border: "border-blue-500/20"    },
  ];

  const quickActions = [
    { icon: Plus,       label: "Upload Paper",  sub: "Share with peers", href: "/upload",    color: "text-violet-600",  bg: "bg-violet-500/10",  border: "border-violet-500/20"  },
    { icon: Search,     label: "Browse Papers", sub: "Find resources",   href: "/papers",    color: "text-blue-600",    bg: "bg-blue-500/10",    border: "border-blue-500/20"    },
    { icon: FolderOpen, label: "Explore",       sub: "Discover more",    href: "/explore",   color: "text-emerald-600", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { icon: Bookmark,   label: "Bookmarks",     sub: "Saved papers",     href: "/bookmarks", color: "text-amber-600",   bg: "bg-amber-500/10",   border: "border-amber-500/20"   },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6">

      {/* ══ WELCOME BANNER ══════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: E }}
        className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-violet-50/60"
      >
        {/* Glow orbs */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -left-8 -top-8 h-64 w-64 rounded-full bg-primary/[0.07] blur-3xl" />
          <div className="absolute right-0 bottom-0 h-48 w-72 rounded-full bg-indigo-500/[0.06] blur-3xl" />
        </div>
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        <div className="relative p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            <div className="flex-1">
              {/* Time badge */}
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-[12px] font-semibold text-primary">
                <Zap className="h-3 w-3" />
                {greeting.text}
              </div>

              <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight leading-tight">
                {greeting.emoji} Welcome back,{" "}
                <span className="bg-gradient-to-r from-violet-600 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                  {user?.name?.split(" ")[0]}
                </span>
                !
              </h1>
              <p className="mt-2 text-[14px] text-muted-foreground max-w-sm">
                Here&apos;s your academic resource overview for today.
              </p>

              {/* Micro stats */}
              <div className="flex flex-wrap gap-4 mt-5">
                {[
                  { icon: Upload,   val: profile?._count?.papers    ?? 0, label: "uploads" },
                  { icon: Bookmark, val: profile?._count?.bookmarks  ?? 0, label: "saved"   },
                  { icon: Star,     val: profile?._count?.ratings    ?? 0, label: "rated"   },
                ].map(({ icon: Icon, val, label }) => (
                  <div key={label} className="flex items-center gap-1.5 text-[13px]">
                    <Icon className="h-3.5 w-3.5 text-muted-foreground/50" />
                    <span className="font-bold text-foreground">{val}</span>
                    <span className="text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
              <Link href="/upload">
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  className="relative flex h-10 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-5 text-[13px] font-semibold text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90 transition-colors"
                >
                  <motion.span
                    className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.14] to-transparent"
                    initial={{ x: "-100%" }}
                    animate={{ x: "220%" }}
                    transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 3.5, ease: "easeInOut" }}
                  />
                  <Upload className="h-3.5 w-3.5" />
                  Upload Paper
                </motion.button>
              </Link>
              <Link href="/papers">
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 text-[13px] font-medium text-muted-foreground shadow-sm hover:border-primary/40 hover:text-foreground transition-all"
                >
                  <Search className="h-3.5 w-3.5" />
                  Browse Papers
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ══ STATS ═══════════════════════════════════════════════ */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        {stats.map((s) => <StatCard key={s.label} {...s} loading={profileLoading} />)}
      </motion.div>

      {/* ══ TWO-COL: uploads + quick actions ════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Recent uploads */}
        <div className="lg:col-span-3">
          <SectionHeader icon={Clock} title="My Recent Uploads" href="/my-uploads" />

          <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />

            {myUploads?.data && myUploads.data.length > 0 ? (
              <div className="divide-y divide-border">
                {myUploads.data.slice(0, 5).map((paper, i) => (
                  <motion.div
                    key={paper.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.35, ease: "easeOut" }}
                  >
                    <Link href={`/papers/${paper.id}`}>
                      <div className="group flex items-center justify-between px-4 py-3.5 hover:bg-muted/40 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-muted group-hover:border-primary/30 transition-colors">
                            <FileText className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-medium text-foreground/80 truncate group-hover:text-foreground transition-colors">
                              {paper.title}
                            </p>
                            <p className="text-[11px] text-muted-foreground/60 mt-0.5">
                              {formatDate(paper.createdAt)}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className={cn("ml-3 shrink-0 text-[10px] h-5", getStatusColor(paper.status))}
                        >
                          {paper.status}
                        </Badge>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-center px-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-muted">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[13px] font-medium text-foreground">No uploads yet</p>
                  <p className="text-[12px] text-muted-foreground mt-0.5">Start contributing to the community</p>
                </div>
                <Link href="/upload">
                  <motion.button
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    className="flex items-center gap-1.5 h-8 px-4 rounded-xl border border-border bg-muted text-[12px] font-medium text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all"
                  >
                    <Plus className="h-3.5 w-3.5" /> Upload First Paper
                  </motion.button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Quick Actions */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
                <Zap className="h-3.5 w-3.5 text-primary" />
              </div>
              <h2 className="text-[15px] font-semibold text-foreground">Quick Actions</h2>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {quickActions.map((action, i) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.12 + i * 0.07, duration: 0.35 }}
                >
                  <Link href={action.href}>
                    <motion.div
                      whileHover={{ y: -3, transition: { duration: 0.18 } }}
                      whileTap={{ scale: 0.96 }}
                      className={cn(
                        "relative overflow-hidden rounded-xl border bg-card shadow-sm p-4 cursor-pointer h-full",
                        action.border,
                      )}
                    >
                      <div className={cn(
                        "mb-2.5 inline-flex h-8 w-8 items-center justify-center rounded-lg border",
                        action.bg, action.border, action.color,
                      )}>
                        <action.icon className="h-3.5 w-3.5" />
                      </div>
                      <p className="text-[12px] font-semibold text-foreground leading-none">{action.label}</p>
                      <p className="text-[11px] text-muted-foreground mt-1 leading-none">{action.sub}</p>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Activity chart */}
          <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-sm p-4 flex-1">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BarChart2 className="h-3.5 w-3.5 text-primary" />
                <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-[0.1em]">
                  Activity
                </p>
              </div>
              <span className="text-[11px] text-muted-foreground/60">14 days</span>
            </div>

            <div className="flex items-end gap-1 h-16">
              {ACTIVITY.map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.3 + i * 0.04, duration: 0.5, ease: E }}
                  className={cn(
                    "flex-1 rounded-sm",
                    h > 70 ? "bg-primary/70" :
                    h > 40 ? "bg-primary/30" :
                             "bg-muted",
                  )}
                  style={{ height: `${h}%`, transformOrigin: "bottom" }}
                />
              ))}
            </div>

            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border text-[11px] text-muted-foreground/60">
              {[
                { dot: "bg-primary/70", label: "High" },
                { dot: "bg-primary/30", label: "Med"  },
                { dot: "bg-muted",      label: "Low"  },
              ].map(({ dot, label }) => (
                <span key={label} className="flex items-center gap-1">
                  <span className={cn("h-2 w-2 rounded-full border border-border", dot)} />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══ TRENDING ════════════════════════════════════════════ */}
      <Section>
        <motion.div variants={fadeUp}>
          <SectionHeader icon={Flame} title="Trending Papers" href="/trending" />
        </motion.div>

        {trendingLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-60 rounded-2xl border border-border bg-card animate-pulse" />
            ))}
          </div>
        ) : trendingPapers?.data.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {trendingPapers.data.map((paper) => (
              <motion.div
                key={paper.id}
                variants={fadeUp}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <PaperCard paper={paper} />
              </motion.div>
            ))}
          </div>
        ) : null}
      </Section>

      {/* ══ RECENTLY ADDED ══════════════════════════════════════ */}
      <Section>
        <motion.div variants={fadeUp}>
          <SectionHeader icon={Clock} title="Recently Added" href="/papers" />
        </motion.div>

        {recentLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-60 rounded-2xl border border-border bg-card animate-pulse" />
            ))}
          </div>
        ) : recentPapers?.data.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentPapers.data.map((paper) => (
              <motion.div
                key={paper.id}
                variants={fadeUp}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <PaperCard paper={paper} />
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={FileText}
            title="No papers yet"
            description="Be the first to contribute to the community!"
            actionLabel="Upload a Paper"
            actionHref="/upload"
          />
        )}
      </Section>
    </div>
  );
}