"use client";
import { motion } from "framer-motion";
import { SUBJECTS } from "@/config/home-theme";

export function SubjectMarquee() {
  const doubled = [...SUBJECTS, ...SUBJECTS];
  return (
    <div className="relative py-5 overflow-hidden border-y border-border bg-secondary/20">
      <div className="absolute inset-y-0 left-0  w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((s, i) => (
          <span key={i} className="inline-flex items-center gap-2.5 text-[11px] font-black text-muted-foreground/50 uppercase tracking-[0.12em] shrink-0">
            <span className="w-1 h-1 rounded-full bg-violet-400" />{s}
          </span>
        ))}
      </motion.div>
    </div>
  );
}