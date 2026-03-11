"use client";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { vUp, vIn, vScale, stagger } from "@/lib/animations";
import { SectionHeading } from "./section-heading";
import { PaperCard } from "@/components/papers/paper-card";

interface Props {
  icon: React.ElementType; label: string; title: React.ReactNode; sub: string;
  href: string; linkLabel: string; papers: any[]; loading: boolean;
  emptyIcon: React.ElementType; emptyTitle: string; emptyMsg: string; alt?: boolean;
}

export function PapersSection({
  icon, label, title, sub, href, linkLabel,
  papers, loading, emptyIcon: EmptyIcon, emptyTitle, emptyMsg, alt,
}: Props) {
  return (
    <section className={cn("relative py-28 overflow-hidden", alt && "bg-secondary/20")}>
      {alt && <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_100%_50%,hsl(var(--primary)/0.06),transparent)]" />}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
          <SectionHeading icon={icon} label={label} title={title} sub={sub} />
          <motion.div
            initial={{ opacity:0, x:18 }} whileInView={{ opacity:1, x:0 }}
            viewport={{ once: true }} transition={{ duration:0.5, delay:0.15 }}
            className="shrink-0"
          >
            <Link href={href}>
              <button className="flex items-center gap-2 h-9 px-4 rounded-xl border border-border bg-card text-[12px] font-bold text-muted-foreground hover:border-violet-300 hover:text-violet-600 transition-colors">
                {linkLabel} <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="sk" variants={stagger(0.06)} initial="hidden" animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div key={i} variants={vUp}
                  className="h-56 rounded-2xl border border-border bg-secondary/30 animate-pulse" />
              ))}
            </motion.div>
          ) : papers.length === 0 ? (
            <motion.div key="em" variants={vIn} initial="hidden" animate="show"
              className="flex flex-col items-center justify-center gap-4 py-24 text-center">
              <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center">
                <EmptyIcon className="w-7 h-7 text-muted-foreground/40" />
              </div>
              <div>
                <p className="font-bold text-sm text-muted-foreground">{emptyTitle}</p>
                <p className="text-xs text-muted-foreground/70 mt-1">{emptyMsg}</p>
              </div>
            </motion.div>
          ) : (
            <motion.div key="pp" variants={stagger(0.07)} initial="hidden" animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {papers.map((p) => (
                <motion.div key={p.id} variants={vScale} whileHover={{ y:-4, transition:{ duration:0.2 } }}>
                  <PaperCard paper={p} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}