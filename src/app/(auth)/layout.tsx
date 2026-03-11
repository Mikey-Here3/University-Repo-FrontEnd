"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  GraduationCap, ArrowLeft, Shield, Star,
  Users, FileText, CheckCircle2, BookOpen, Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── constants ──────────────────────────────────────────────── */
const E = [0.22, 1, 0.36, 1] as const;

const FEATURES = [
  { icon: FileText, text: "2,400+ past papers archived",        color: "bg-violet-100 border-violet-200 text-violet-600" },
  { icon: Users,    text: "8,000+ students trust us",            color: "bg-blue-100 border-blue-200 text-blue-600"       },
  { icon: Shield,   text: "Verified & quality-checked content",  color: "bg-emerald-100 border-emerald-200 text-emerald-600" },
  { icon: Zap,      text: "Instant search & one-click download", color: "bg-orange-100 border-orange-200 text-orange-600" },
];

const STATS = [
  { value: "2,400+", label: "Papers",  sublabel: "and growing" },
  { value: "40+",    label: "Depts",   sublabel: "covered"     },
  { value: "100%",   label: "Free",    sublabel: "forever"     },
];

const TESTIMONIAL = {
  text: "Found my entire semester's papers in minutes. UniResources is an absolute lifesaver for exam prep.",
  name: "Aisha R.",
  role: "Computer Science · Year 3",
  avatar: "A",
};

/* ─── stagger variants ───────────────────────────────────────── */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.2 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
  show:   { opacity: 1, y: 0,  filter: "blur(0px)",
            transition: { duration: 0.52, ease: E } },
};
const fadeLeft = {
  hidden: { opacity: 0, x: -16 },
  show:   { opacity: 1, x: 0,
            transition: { duration: 0.48, ease: E } },
};

/* ─── layout ─────────────────────────────────────────────────── */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Very subtle global ambient */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute -top-60 right-0 w-[700px] h-[700px] rounded-full bg-primary/[0.04] blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-[500px] h-[500px] rounded-full bg-indigo-500/[0.03] blur-3xl" />
      </div>

      {/* ══ HEADER ══════════════════════════════════════════════ */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: E }}
        className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ rotate: 8, scale: 1.06 }}
              transition={{ duration: 0.22 }}
              className="relative w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-sm"
            >
              <GraduationCap className="w-[18px] h-[18px] text-primary" />
            </motion.div>
            <span className="font-black text-lg tracking-tight text-foreground">
              Uni<span className="gradient-text">Resources</span>
            </span>
          </Link>

          {/* Back */}
          <Link href="/">
            <motion.div
              whileHover={{ x: -3 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:block">Back to Home</span>
              <span className="sm:hidden">Home</span>
            </motion.div>
          </Link>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </motion.header>

      {/* ══ MAIN ════════════════════════════════════════════════ */}
      <main className="flex-1 flex overflow-hidden">

        {/* ── Left decorative panel ── */}
        <motion.aside
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: E }}
          className={cn(
            "hidden lg:flex flex-col justify-between",
            "w-[420px] xl:w-[480px] shrink-0",
            "border-r border-border relative overflow-hidden",
            "bg-gradient-to-br from-violet-50/70 via-background to-indigo-50/50",
          )}
        >
          {/* Background layers */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage: "radial-gradient(circle, hsl(var(--foreground)/0.07) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />

          {/* Ambient orbs */}
          <motion.div
            aria-hidden
            className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary/10 blur-3xl pointer-events-none"
            animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          <div
            aria-hidden
            className="absolute bottom-0 -left-12 w-56 h-56 rounded-full bg-indigo-500/8 blur-3xl pointer-events-none"
          />

          {/* Top accent line */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          {/* Content */}
          <div className="relative p-10 xl:p-14">
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="space-y-8"
            >
              {/* Brand icon + live badge */}
              <motion.div variants={fadeUp} className="flex items-start justify-between">
                <motion.div
                  whileHover={{ rotate: 8, scale: 1.06 }}
                  transition={{ duration: 0.22 }}
                  className="w-14 h-14 rounded-[18px] bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 flex items-center justify-center shadow-xl shadow-primary/10"
                >
                  <BookOpen className="w-7 h-7 text-primary" />
                </motion.div>

                {/* Live indicator */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700">8,400+ students</span>
                </div>
              </motion.div>

              {/* Headline */}
              <motion.div variants={fadeUp}>
                <h2 className="text-[28px] xl:text-3xl font-black tracking-tight text-foreground leading-[1.12] mb-3">
                  Your complete<br />
                  <span className="gradient-text">academic archive</span>
                </h2>
                <p className="text-[13px] text-muted-foreground leading-[1.75]">
                  Thousands of past exam papers organized by department,
                  program, semester, and course — free forever.
                </p>
              </motion.div>

              {/* Stats grid */}
              <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3">
                {STATS.map((s) => (
                  <div
                    key={s.label}
                    className="flex flex-col items-center text-center p-3.5 rounded-2xl border border-border bg-card/90 shadow-sm"
                  >
                    <p className="text-xl font-black text-foreground tracking-tight">{s.value}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
                      {s.label}
                    </p>
                    <p className="text-[9px] text-muted-foreground/50 mt-0.5">{s.sublabel}</p>
                  </div>
                ))}
              </motion.div>

              {/* Feature list */}
              <motion.div variants={stagger} className="space-y-2.5">
                {FEATURES.map((f) => (
                  <motion.div
                    key={f.text}
                    variants={fadeLeft}
                    className="flex items-center gap-3 group cursor-default"
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-xl border flex items-center justify-center shrink-0",
                      "transition-all duration-200 group-hover:scale-105",
                      f.color,
                    )}>
                      <f.icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[13px] text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                      {f.text}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.7, ease: E }}
            className="relative mx-10 xl:mx-14 mb-10 xl:mb-14"
          >
            <div className="relative rounded-2xl border border-border bg-card shadow-md overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary/50 via-purple-400/60 to-indigo-400/50" />

              <div className="p-5">
                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-[13px] text-muted-foreground leading-relaxed mb-4 italic">
                  &ldquo;{TESTIMONIAL.text}&rdquo;
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 flex items-center justify-center text-sm font-black text-primary">
                    {TESTIMONIAL.avatar}
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-foreground leading-none mb-0.5">
                      {TESTIMONIAL.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{TESTIMONIAL.role}</p>
                  </div>
                  <div className="ml-auto">
                    <div className="px-2 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                      <span className="text-[10px] font-bold text-emerald-600">Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.aside>

        {/* ── Right: form slot ── */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 relative">

          {/* Subtle radial glow behind form */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 65% 55% at 50% 50%, hsl(var(--primary)/0.04), transparent)",
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            transition={{ duration: 0.65, ease: E, delay: 0.12 }}
            className="w-full max-w-[440px] relative z-10"
          >
            {/* Form card */}
            <div className="relative bg-card rounded-3xl border border-border shadow-2xl shadow-foreground/[0.06] p-8 sm:p-10 overflow-hidden">
              {/* Subtle inner top accent */}
              <div className="absolute inset-x-0 top-0 h-[2px] rounded-t-3xl bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              <div className="absolute inset-x-0 top-[2px] h-px rounded-t-3xl bg-gradient-to-r from-transparent via-white/60 to-transparent" />

              {children}
            </div>

            {/* Below-card security note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="text-center text-[11px] text-muted-foreground/50 mt-4 flex items-center justify-center gap-1.5"
            >
              <Shield className="w-3 h-3" />
              Secured with 256-bit encryption
            </motion.p>
          </motion.div>
        </div>
      </main>

      {/* ══ FOOTER ══════════════════════════════════════════════ */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="border-t border-border bg-background/90 backdrop-blur-sm py-4"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-[11px] text-muted-foreground/50">
              © {new Date().getFullYear()} UniResources. All rights reserved.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/50">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              Free forever · No credit card · Verified content only
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}