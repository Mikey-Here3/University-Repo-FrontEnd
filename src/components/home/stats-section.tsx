"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { vUp, stagger } from "@/lib/animations";
import { STATS } from "@/config/home-theme";
import { Counter } from "./counter";

export function StatsSection() {
  return (
    <section className="relative border-b border-border bg-secondary/20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/3 via-transparent to-cyan-500/3" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={stagger(0.09)} initial="hidden" whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4"
        >
          {STATS.map((s) => (
            <motion.div key={s.label} variants={vUp}
              className={cn(
                "group relative flex flex-col items-center justify-center gap-3 py-12 px-4 text-center",
                "border-r border-b border-border/40 hover:bg-secondary/30 transition-colors duration-300",
                "last:border-r-0 [&:nth-child(2)]:border-r-0 md:[&:nth-child(2)]:border-r",
                "md:[&:nth-child(n+3)]:border-b-0"
              )}
            >
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border mb-0.5 transition-transform duration-300 group-hover:scale-105", s.bg, s.border)}>
                <s.icon className={cn("w-4 h-4", s.text)} />
              </div>
              <span className={cn("text-4xl font-black tracking-tighter", s.text)}>
                <Counter raw={s.value} />
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/70">
                {s.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}