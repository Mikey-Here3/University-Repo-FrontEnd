"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Upload, Sparkles, CheckCircle2, Users, Star, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { vUp, vScale, stagger } from "@/lib/animations";
import { Tag } from "./section-heading";
import { Magnetic } from "./magnetic";

const GT = ({ children }: { children: React.ReactNode }) => (
  <span className="gradient-text">{children}</span>
);

const BENEFIT_CHIPS = ["100% Free","Instant publish","Earn recognition","Help thousands","Zero friction"];

export function CtaSection() {
  return (
    <section className="relative py-40 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-background to-indigo-50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_50%,hsl(var(--primary)/0.08),transparent)]" />
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage:"radial-gradient(circle,hsl(var(--foreground)/0.3) 1px,transparent 1px)",
        backgroundSize:"28px 28px",
      }} />
      <motion.div
        className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background:"radial-gradient(circle,hsl(var(--primary)/0.12) 0%,transparent 70%)", filter:"blur(80px)" }}
        animate={{ scale:[1,1.12,1], opacity:[0.5,0.8,0.5] }}
        transition={{ duration:10, repeat:Infinity, ease:"easeInOut" }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={stagger(0.1)} initial="hidden" whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          {/* Icon cluster */}
          <motion.div variants={vScale} className="flex justify-center mb-10">
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-100 to-violet-50 border border-violet-200 flex items-center justify-center shadow-2xl shadow-violet-100">
                <Upload className="w-10 h-10 text-violet-600" />
              </div>
              {[
                { I:CheckCircle2, c:"bg-emerald-50 border-emerald-200 text-emerald-600", p:"-top-3 -right-3"   },
                { I:Users,        c:"bg-blue-50 border-blue-200 text-blue-600",          p:"-bottom-3 -left-3"  },
                { I:Star,         c:"bg-amber-50 border-amber-200 text-amber-600",        p:"-bottom-3 -right-3" },
              ].map(({ I, c, p }) => (
                <div key={p} className={cn("absolute w-9 h-9 rounded-xl border flex items-center justify-center", c, p)}>
                  <I className="w-4 h-4" />
                </div>
              ))}
            </div>
          </motion.div>

          <Tag icon={Sparkles} label="Join the Community" />

          <motion.h2 variants={vUp}
            className="mt-6 font-black tracking-tighter leading-[0.88] text-foreground mb-6"
            style={{ fontSize:"clamp(2.4rem,7vw,5rem)" }}
          >
            Have papers<br /><GT>to share?</GT>
          </motion.h2>

          <motion.p variants={vUp}
            className="text-[15px] text-muted-foreground max-w-md mx-auto mb-10 leading-relaxed"
          >
            Help thousands of students by contributing your past papers.
            Every upload makes a real impact on someone&apos;s exam prep.
          </motion.p>

          {/* Chips */}
          <motion.div variants={stagger(0.06)} className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
            {BENEFIT_CHIPS.map((b) => (
              <motion.span key={b} variants={vScale}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold bg-card text-muted-foreground border border-border"
              >
                <CheckCircle2 className="w-3 h-3 text-violet-500" />{b}
              </motion.span>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div variants={vUp} className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Magnetic>
              <Link href="/register">
                <button className="relative flex h-12 items-center gap-2.5 px-8 rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-xl shadow-primary/30 hover:opacity-90 hover:scale-105 transition-all duration-300 overflow-hidden w-full sm:w-auto">
                  <motion.span
                    className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                    initial={{ x:"-100%" }} animate={{ x:"220%" }}
                    transition={{ duration:2.4, repeat:Infinity, repeatDelay:3.5, ease:"easeInOut" }}
                  />
                  <Upload className="w-4 h-4 relative" />
                  <span className="relative">Create Free Account</span>
                </button>
              </Link>
            </Magnetic>
            <Magnetic>
              <Link href="/login">
                <button className="flex h-12 items-center gap-2 px-8 rounded-xl border border-border bg-card text-sm font-bold text-muted-foreground hover:border-violet-300 hover:text-violet-600 transition-all duration-300 w-full sm:w-auto">
                  Sign In Instead
                </button>
              </Link>
            </Magnetic>
          </motion.div>

          <motion.p variants={vUp}
            className="mt-8 text-xs text-muted-foreground/50 flex items-center justify-center gap-2"
          >
            <Shield className="w-3.5 h-3.5" />
            Free forever · No spam · Verified content only · No credit card required
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}