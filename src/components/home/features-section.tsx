"use client";
import { motion } from "framer-motion";
import { Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import { vScale, stagger } from "@/lib/animations";
import { FEATURES, ACCENT } from "@/config/home-theme";
import { SectionHeading } from "./section-heading";

const GT = ({ children }: { children: React.ReactNode }) => (
  <span className="gradient-text">{children}</span>
);

function FeatCard({ f, i }: { f: typeof FEATURES[number]; i: number }) {
  const a = ACCENT[f.accent];
  return (
    <motion.div variants={vScale} className={cn("h-full", f.wide ? "lg:col-span-2" : "lg:col-span-1")}>
      <div className={cn(
        "group relative h-full rounded-2xl border border-border bg-card",
        "p-6 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl", a.shadow
      )}>
        <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br to-transparent", a.bg)} />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/[0.04] to-transparent" />
        <span className="absolute top-5 right-5 text-[10px] font-black text-muted-foreground/20 tabular-nums select-none">
          {String(i + 1).padStart(2, "0")}
        </span>
        <div className={cn("relative w-11 h-11 rounded-xl border flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3", a.bg, a.border, a.text)}>
          <f.icon className="w-5 h-5" />
        </div>
        <h3 className={cn("relative font-black text-sm mb-2 text-foreground transition-colors duration-200", a.hover)}>
          {f.title}
        </h3>
        <p className="relative text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
        <div className={cn("absolute bottom-0 inset-x-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-current to-transparent", a.text)} />
      </div>
    </motion.div>
  );
}

export function FeaturesSection() {
  return (
    <section className="relative py-28 bg-secondary/10 overflow-hidden border-t border-border">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_0%,hsl(var(--primary)/0.06),transparent)]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading icon={Cpu} label="Platform Features"
          title={<>Built for <GT>serious students</GT></>}
          sub="Every feature is purpose-built around the real needs of students and faculty."
          center className="mb-16"
        />
        <motion.div
          variants={stagger(0.07)} initial="hidden" whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {FEATURES.map((f, i) => <FeatCard key={f.title} f={f} i={i} />)}
        </motion.div>
      </div>
    </section>
  );
}