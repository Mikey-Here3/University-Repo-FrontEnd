"use client";

import { useQuery }          from "@tanstack/react-query";
import { motion }            from "framer-motion";
import Link                  from "next/link";
import {
  Building2, FlameKindling,
  Clock, TrendingUp, ArrowUpRight,
} from "lucide-react";

import { paperService }       from "@/services/paper.service";
import { departmentService }  from "@/services/academic.service";
import { stagger }            from "@/lib/animations";
import { cn }                 from "@/lib/utils";

/* ── section components ─────────────────────────────────────── */
import { ScrollBar }          from "@/components/home/scroll-bar";
import { HeroSection }        from "@/components/home/hero-section";
import { SubjectMarquee }     from "@/components/home/subject-marquee";
import { StatsSection }       from "@/components/home/stats-section";
import { HowItWorks }         from "@/components/home/how-it-works";
import { FeaturesSection }    from "@/components/home/features-section";
import { CategoryStrip }      from "@/components/home/category-strip";
import { DeptCard }           from "@/components/home/dept-card";
import { PapersSection }      from "@/components/home/papers-section";
import { Testimonials }       from "@/components/home/testimonials";
import { CtaSection }         from "@/components/home/cta-section";
import { SectionHeading }     from "@/components/home/section-heading";
import { ScrollToTop }        from "@/components/common/scroll-to-top";

/* ─── gradient text helper ───────────────────────────────────── */
/*
  Add this to globals.css if not already present:

  .gradient-text {
    @apply bg-gradient-to-br from-primary via-purple-500 to-indigo-500
           bg-clip-text text-transparent;
  }
*/
function GT({ children }: { children: React.ReactNode }) {
  return <span className="gradient-text">{children}</span>;
}

/* ─── department card skeleton ───────────────────────────────── */
function DeptSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 animate-pulse space-y-4">
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-xl bg-muted" />
        <div className="w-6 h-6 rounded bg-muted" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-3/4 rounded-lg bg-muted" />
        <div className="h-3 w-1/2 rounded-lg bg-muted" />
      </div>
      <div className="h-px bg-border" />
      <div className="h-1.5 rounded-full bg-muted" />
    </div>
  );
}

/* ─── page ───────────────────────────────────────────────────── */
export default function HomePage() {

  /* ── data ── */
  const { data: trendingData, isLoading: trendingLoading } = useQuery({
    queryKey: ["landing-trending"],
    queryFn:  () => paperService.getAll({ limit: 6, sortBy: "downloads",  sortOrder: "desc" }),
    staleTime: 60_000,
  });

  const { data: recentData, isLoading: recentLoading } = useQuery({
    queryKey: ["landing-recent"],
    queryFn:  () => paperService.getAll({ limit: 6, sortBy: "createdAt", sortOrder: "desc" }),
    staleTime: 60_000,
  });

  const { data: depts, isLoading: deptsLoading } = useQuery({
    queryKey: ["landing-departments"],
    queryFn:  () => departmentService.getAll(),
    staleTime: 60_000,
  });

  const trendingPapers = trendingData?.data ?? [];
  const recentPapers   = recentData?.data   ?? [];
  const departments    = depts               ?? [];

  return (
    <>
      {/* ── Scroll progress indicator ─────────────────────────── */}
      <ScrollBar />

      {/* ── Above-the-fold sections ───────────────────────────── */}
      <HeroSection />
      <SubjectMarquee />
      <StatsSection />
      <HowItWorks />
      <FeaturesSection />
      <CategoryStrip />

      {/* ══ Departments ════════════════════════════════════════ */}
      <section className="relative py-28 overflow-hidden">

        {/* Soft left ambient blob */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 55% 45% at 0% 60%, hsl(var(--primary)/0.06), transparent)",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Section heading row ── */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
            <SectionHeading
              icon={Building2}
              label="Departments"
              title={<>Find your <GT>department</GT></>}
              sub="Papers organised across every academic department."
            />

            <motion.div
              initial={{ opacity: 0, x: 18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="shrink-0"
            >
              <Link href="/departments">
                <button
                  className={cn(
                    "flex items-center gap-2 h-9 px-4 rounded-xl",
                    "border border-border bg-card",
                    "text-[12px] font-bold text-muted-foreground",
                    "hover:border-primary/40 hover:text-primary",
                    "transition-all duration-200",
                  )}
                >
                  All departments
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </motion.div>
          </div>

          {/* ── Loading skeletons ── */}
          {deptsLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <DeptSkeleton key={i} />
              ))}
            </div>
          )}

          {/* ── Empty state ── */}
          {!deptsLoading && departments.length === 0 && (
            <div className="flex flex-col items-center gap-4 py-24 text-center">
              <div className="w-16 h-16 rounded-2xl border border-border bg-card flex items-center justify-center shadow-sm">
                <Building2 className="w-7 h-7 text-muted-foreground" />
              </div>
              <div>
                <p className="font-bold text-sm text-foreground">No departments yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Departments will appear here once they are added.
                </p>
              </div>
            </div>
          )}

          {/* ── Department cards ── */}
          {!deptsLoading && departments.length > 0 && (
            <motion.div
              variants={stagger(0.07)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {departments.slice(0, 6).map((dept, i) => (
                <DeptCard key={dept.id ?? i} dept={dept} idx={i} />
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ══ Trending papers ════════════════════════════════════ */}
      <PapersSection
        icon={FlameKindling}
        label="Trending Now"
        title={<>Most <GT>downloaded</GT> papers</>}
        sub="What students are downloading and studying most right now."
        href="/papers?sort=downloads"
        linkLabel="See all trending"
        papers={trendingPapers}
        loading={trendingLoading}
        emptyIcon={TrendingUp}
        emptyTitle="Nothing trending yet"
        emptyMsg="Check back soon — papers will appear as activity picks up."
        alt
      />

      {/* ── Testimonials ─────────────────────────────────────── */}
      <Testimonials />

      {/* ══ Recent papers ══════════════════════════════════════ */}
      <PapersSection
        icon={Clock}
        label="Recently Added"
        title={<>Fresh <GT>uploads</GT></>}
        sub="Past papers added to the archive recently by the community."
        href="/papers?sort=createdAt"
        linkLabel="See all recent"
        papers={recentPapers}
        loading={recentLoading}
        emptyIcon={Clock}
        emptyTitle="No uploads yet"
        emptyMsg="Be the first to contribute — upload your past papers now."
      />

      {/* ── Call to action ────────────────────────────────────── */}
      <CtaSection />

      {/* ── Scroll-to-top button ──────────────────────────────── */}
      <ScrollToTop />
    </>
  );
}