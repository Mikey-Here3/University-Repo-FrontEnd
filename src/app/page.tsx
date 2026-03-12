"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  motion, useScroll, useTransform, useInView,
  useMotionValue, useSpring, AnimatePresence,
} from "framer-motion";
import { paperService } from "@/services/paper.service";
import { departmentService } from "@/services/academic.service";
import { PaperCard } from "@/components/papers/paper-card";
import { ScrollToTop } from "@/components/common/scroll-to-top";
import { cn } from "@/lib/utils";
import {
  Search, Building2, GraduationCap, FileText, Sparkles,
  Shield, Zap, Star, Users, Download, Upload, BarChart3,
  ArrowUpRight, CheckCircle2, FlameKindling, BookOpen,
  Trophy, Cpu, ChevronRight, Quote, Lightbulb, Target,
  Globe2, Microscope, Clock, TrendingUp, ArrowRight, BookMarked,
} from "lucide-react";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { Footer } from "@/components/layout/footer";

/* ═══════════════════════════════════════════════════════════════
   ANIMATION VARIANTS
═══════════════════════════════════════════════════════════════ */
const E = [0.16, 1, 0.3, 1] as const;
const vUp = {
  hidden: { opacity: 0, y: 32, filter: "blur(5px)" },
  show:   { opacity: 1, y: 0,  filter: "blur(0px)", transition: { duration: 0.7, ease: E } },
};
const vIn = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.5 } },
};
const vScale = {
  hidden: { opacity: 0, scale: 0.88, y: 16 },
  show:   { opacity: 1, scale: 1,    y: 0,  transition: { duration: 0.6, ease: E } },
};
const stagger = (d = 0.08) => ({
  hidden: {},
  show: { transition: { staggerChildren: d, delayChildren: 0.04 } },
});

/* ═══════════════════════════════════════════════════════════════
   ACCENT MAP — light-safe (600-level text for contrast on white)
═══════════════════════════════════════════════════════════════ */
const AC: Record<string, { bg: string; bd: string; tx: string; sh: string; hover: string }> = {
  violet:  { bg:"bg-violet-50",  bd:"border-violet-200", tx:"text-violet-600",  sh:"hover:shadow-violet-200", hover:"group-hover:text-violet-600"  },
  amber:   { bg:"bg-amber-50",   bd:"border-amber-200",  tx:"text-amber-600",   sh:"hover:shadow-amber-200",  hover:"group-hover:text-amber-600"   },
  blue:    { bg:"bg-blue-50",    bd:"border-blue-200",   tx:"text-blue-600",    sh:"hover:shadow-blue-200",   hover:"group-hover:text-blue-600"    },
  emerald: { bg:"bg-emerald-50", bd:"border-emerald-200",tx:"text-emerald-600", sh:"hover:shadow-emerald-200",hover:"group-hover:text-emerald-600" },
  rose:    { bg:"bg-rose-50",    bd:"border-rose-200",   tx:"text-rose-600",    sh:"hover:shadow-rose-200",   hover:"group-hover:text-rose-600"    },
  cyan:    { bg:"bg-cyan-50",    bd:"border-cyan-200",   tx:"text-cyan-600",    sh:"hover:shadow-cyan-200",   hover:"group-hover:text-cyan-600"    },
  orange:  { bg:"bg-orange-50",  bd:"border-orange-200", tx:"text-orange-600",  sh:"hover:shadow-orange-200", hover:"group-hover:text-orange-600"  },
};

/* Orbit card colors */
const OC: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  blue:    { bg:"bg-blue-50",    text:"text-blue-600",    border:"border-blue-200",    dot:"bg-blue-500"    },
  violet:  { bg:"bg-violet-50",  text:"text-violet-600",  border:"border-violet-200",  dot:"bg-violet-500"  },
  emerald: { bg:"bg-emerald-50", text:"text-emerald-600", border:"border-emerald-200", dot:"bg-emerald-500" },
  orange:  { bg:"bg-orange-50",  text:"text-orange-600",  border:"border-orange-200",  dot:"bg-orange-500"  },
  rose:    { bg:"bg-rose-50",    text:"text-rose-600",    border:"border-rose-200",    dot:"bg-rose-500"    },
  cyan:    { bg:"bg-cyan-50",    text:"text-cyan-600",    border:"border-cyan-200",    dot:"bg-cyan-500"    },
};

/* Department palette */
const DP = [
  { g:"from-blue-50",    b:"border-blue-200 hover:border-blue-400",     ic:"bg-blue-50 text-blue-600",     dot:"bg-blue-500"    },
  { g:"from-violet-50",  b:"border-violet-200 hover:border-violet-400",  ic:"bg-violet-50 text-violet-600", dot:"bg-violet-500"  },
  { g:"from-emerald-50", b:"border-emerald-200 hover:border-emerald-400",ic:"bg-emerald-50 text-emerald-600",dot:"bg-emerald-500"},
  { g:"from-orange-50",  b:"border-orange-200 hover:border-orange-400",  ic:"bg-orange-50 text-orange-600", dot:"bg-orange-500"  },
  { g:"from-rose-50",    b:"border-rose-200 hover:border-rose-400",     ic:"bg-rose-50 text-rose-600",     dot:"bg-rose-500"    },
  { g:"from-cyan-50",    b:"border-cyan-200 hover:border-cyan-400",     ic:"bg-cyan-50 text-cyan-600",     dot:"bg-cyan-500"    },
];

/* ═══════════════════════════════════════════════════════════════
   STATIC DATA
═══════════════════════════════════════════════════════════════ */
const STATS = [
  { label:"Papers Shared",   value:"2,400+", icon:FileText,      bg:"bg-blue-50",    text:"text-blue-600",    border:"border-blue-200"    },
  { label:"Active Students", value:"8,000+", icon:Users,         bg:"bg-violet-50",  text:"text-violet-600",  border:"border-violet-200"  },
  { label:"Total Downloads", value:"50K+",   icon:BarChart3,     bg:"bg-emerald-50", text:"text-emerald-600", border:"border-emerald-200" },
  { label:"Departments",     value:"40+",    icon:GraduationCap, bg:"bg-orange-50",  text:"text-orange-600",  border:"border-orange-200"  },
];

const STEPS = [
  { n:"01", icon:Search,   title:"Search",     desc:"Enter a department, course, or keyword. Our smart search surfaces the right papers instantly." },
  { n:"02", icon:FileText, title:"Preview",    desc:"See the year, semester, program and course details before you commit to a download."          },
  { n:"03", icon:Download, title:"Download",   desc:"One-click PDF download. No paywall, no signup needed just to browse and download."             },
  { n:"04", icon:Upload,   title:"Contribute", desc:"Upload your own past papers and help your peers. Every upload grows the archive."              },
];

const FEATS = [
  { icon:Shield,   title:"Verified Content", desc:"Every paper reviewed before publishing. No junk, no duplicates — only trusted academic content.", accent:"violet",  wide:true  },
  { icon:Zap,      title:"Instant Access",   desc:"Powerful search gets you to the paper you need in under 30 seconds.",                              accent:"amber",   wide:false },
  { icon:Cpu,      title:"Smart Filtering",  desc:"Filter by department, course, year, and content type — find exactly what you need.",               accent:"blue",    wide:false },
  { icon:Users,    title:"Community Driven", desc:"Built by students, for students. Every upload strengthens the archive for everyone.",               accent:"emerald", wide:false },
  { icon:BookOpen, title:"Fully Organised",  desc:"Structured by department, program, semester, year, and course code for maximum clarity.",           accent:"rose",    wide:false },
  { icon:Trophy,   title:"Top Contributors", desc:"Leaderboard rewards students who give back. Earn recognition for your contributions.",              accent:"cyan",    wide:true  },
];

const CATS = [
  { icon:Microscope, label:"Sciences",    count:"320+", color:"blue"    },
  { icon:BarChart3,  label:"Business",    count:"280+", color:"emerald" },
  { icon:Globe2,     label:"Languages",   count:"190+", color:"violet"  },
  { icon:Cpu,        label:"Engineering", count:"410+", color:"orange"  },
  { icon:Lightbulb,  label:"Arts",        count:"150+", color:"rose"    },
  { icon:Target,     label:"Management",  count:"240+", color:"cyan"    },
];

const TESTI = [
  { text:"Found my entire semester's papers in minutes. StudyHouse is absolutely incredible.",      name:"Aisha R.",  role:"CS · Year 3",          stars:5 },
  { text:"Saved me weeks of manual searching. Every student at this university needs this platform.", name:"Usman K.",  role:"Engineering · Year 2", stars:5 },
  { text:"The organization is perfect — year, semester, course code, all in one place.",              name:"Fatima N.", role:"Business · Year 4",    stars:5 },
];

const SUBJECTS = [
  "Computer Science","Electrical Engineering","Business Administration",
  "Medicine & Health","Law & Legal Studies","Architecture & Design",
  "Education Sciences","Social Sciences","Mathematics","Pharmacy",
];

const ORBIT_CARDS = [
  { dept:"CS",  course:"Data Structures",      year:"2024", sem:"Fall",   color:"blue"    },
  { dept:"EE",  course:"Circuit Analysis",     year:"2024", sem:"Spring", color:"violet"  },
  { dept:"BBA", course:"Financial Accounting", year:"2023", sem:"Fall",   color:"emerald" },
  { dept:"CS",  course:"Operating Systems",    year:"2024", sem:"Spring", color:"orange"  },
  { dept:"EE",  course:"Digital Logic",        year:"2023", sem:"Fall",   color:"rose"    },
  { dept:"MBA", course:"Strategic Mgmt.",      year:"2024", sem:"Spring", color:"cyan"    },
];

/* ═══════════════════════════════════════════════════════════════
   UTILITY COMPONENTS
═══════════════════════════════════════════════════════════════ */
const GT = ({ children }: { children: React.ReactNode }) => (
  <span className="gradient-text">{children}</span>
);

function ScrollBar() {
  const { scrollYProgress } = useScroll();
  const sx = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });
  return (
    <motion.div
      style={{ scaleX: sx, transformOrigin: "left" }}
      className="fixed top-0 inset-x-0 h-[2px] z-[9999] bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-500"
    />
  );
}

function Magnetic({ children, s = 0.26 }: { children: React.ReactNode; s?: number }) {
  const el  = useRef<HTMLDivElement>(null);
  const mx  = useMotionValue(0); const smx = useSpring(mx, { stiffness: 240, damping: 22 });
  const my  = useMotionValue(0); const smy = useSpring(my, { stiffness: 240, damping: 22 });
  const mov = useCallback((e: React.MouseEvent) => {
    if (!el.current) return;
    const r = el.current.getBoundingClientRect();
    mx.set((e.clientX - r.left - r.width  / 2) * s);
    my.set((e.clientY - r.top  - r.height / 2) * s);
  }, [mx, my, s]);
  const rst = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);
  return (
    <motion.div ref={el} style={{ x: smx, y: smy }} onMouseMove={mov} onMouseLeave={rst}>
      {children}
    </motion.div>
  );
}

function Counter({ raw }: { raw: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const iv  = useInView(ref, { once: true, margin: "-40px" });
  const num = parseInt(raw.replace(/\D/g, ""), 10) || 0;
  const sfx = raw.replace(/[\d,]/g, "");
  const [n, sn] = useState(0);
  useEffect(() => {
    if (!iv) return;
    let r: number;
    const t0 = performance.now(), dur = 2000;
    const ease = (t: number) => 1 - Math.pow(1 - t, 4);
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      sn(Math.round(ease(p) * num));
      if (p < 1) r = requestAnimationFrame(tick);
    };
    r = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(r);
  }, [iv, num]);
  return <span ref={ref}>{iv ? n.toLocaleString() : 0}{sfx}</span>;
}

const TW_WORDS = ["Find Past Papers.", "Ace Your Exams.", "Study Smarter.", "Share Resources.", "Boost Your Grades."];
function Typewriter() {
  const [wi, sw] = useState(0);
  const [ci, sc] = useState(0);
  const [dl, sd] = useState(false);
  useEffect(() => {
    const w = TW_WORDS[wi];
    if (!dl && ci === w.length) { const t = setTimeout(() => sd(true), 1800); return () => clearTimeout(t); }
    if ( dl && ci === 0)        { sd(false); sw(x => (x + 1) % TW_WORDS.length); return; }
    const t = setTimeout(() => sc(c => c + (dl ? -1 : 1)), dl ? 38 : 72);
    return () => clearTimeout(t);
  }, [ci, dl, wi]);
  return (
    <>
      {TW_WORDS[wi].slice(0, ci)}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.52, repeat: Infinity, repeatType: "reverse" }}
        className="inline-block w-[3px] h-[0.85em] bg-violet-500 rounded-full ml-1 align-middle"
      />
    </>
  );
}

function ScrollCue() {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 select-none pointer-events-none"
    >
      <span className="text-[8px] font-black tracking-[0.4em] uppercase text-muted-foreground/50">
        scroll
      </span>
      <div className="w-[18px] h-[30px] rounded-full border border-border flex items-start justify-center pt-[5px]">
        <motion.div
          className="w-[3px] h-[6px] rounded-full bg-violet-400"
          animate={{ y: [0, 11, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}

function Tag({ icon: I, label, className }: { icon: React.ElementType; label: string; className?: string }) {
  return (
    <motion.div variants={vUp} className={cn(
      "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full",
      "text-[10px] font-black tracking-[0.14em] uppercase",
      "bg-violet-100 text-violet-700 border border-violet-200",
      className
    )}>
      <I className="w-3 h-3" />{label}
    </motion.div>
  );
}

function SH({ icon, label, title, sub, center, className }: {
  icon: React.ElementType; label: string; title: React.ReactNode;
  sub: string; center?: boolean; className?: string;
}) {
  return (
    <motion.div
      variants={stagger()} initial="hidden" whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      className={cn(center && "flex flex-col items-center text-center", className)}
    >
      <Tag icon={icon} label={label} />
      <motion.h2 variants={vUp} className={cn(
        "mt-5 font-black tracking-tighter leading-[0.9] text-foreground",
        "text-3xl md:text-4xl lg:text-[2.8rem]",
        center && "max-w-2xl"
      )}>
        {title}
      </motion.h2>
      <motion.p variants={vUp} className={cn(
        "mt-4 text-[15px] text-muted-foreground leading-relaxed",
        center ? "max-w-lg" : "max-w-md"
      )}>
        {sub}
      </motion.p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HERO VISUALIZATION
═══════════════════════════════════════════════════════════════ */
function HeroViz() {
  return (
    <div className="relative w-full h-[500px] select-none">
      {[300, 210, 120].map((r, i) => (
        <motion.div
          key={r}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-violet-300/40"
          style={{ width: r, height: r }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 30 + i * 12, repeat: Infinity, ease: "linear" }}
        />
      ))}

      {/* Centre orb */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
        initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8, ease: E }}
      >
        <div className="relative w-20 h-20 rounded-[22px] bg-gradient-to-br from-violet-100 to-violet-50 border border-violet-200 flex items-center justify-center shadow-2xl shadow-violet-200">
          <BookOpen className="w-9 h-9 text-violet-600" />
          <span className="absolute inset-0 rounded-[22px] border border-violet-400/40 animate-ping opacity-30" />
        </div>
      </motion.div>

      {/* Orbiting cards */}
      {ORBIT_CARDS.map((c, i) => {
        const angle = (i / ORBIT_CARDS.length) * 2 * Math.PI - Math.PI / 2;
        const R = 148;
        const col = OC[c.color];
        const even = i % 2 === 0;
        return (
          <motion.div
            key={i} className="absolute"
            style={{
              left: `calc(50% + ${Math.cos(angle) * R}px)`,
              top:  `calc(50% + ${Math.sin(angle) * R}px)`,
              translateX: "-50%", translateY: "-50%",
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1, y: [0, even ? -10 : 10, 0] }}
            transition={{
              opacity: { delay: 0.7 + i * 0.1, duration: 0.45 },
              scale:   { delay: 0.7 + i * 0.1, duration: 0.45, ease: E },
              y:       { duration: 3.2 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 },
            }}
          >
            {/* Light card */}
            <div className={cn("w-[118px] rounded-2xl border p-3 backdrop-blur-md shadow-lg bg-white/90", col.border)}>
              <div className="flex items-center gap-1.5 mb-2">
                <div className={cn("w-2 h-2 rounded-full", col.dot)} />
                <span className={cn("text-[9px] font-black", col.text)}>{c.dept}</span>
                <span className="text-[8px] text-muted-foreground/60 ml-auto">{c.year}</span>
              </div>
              <p className="text-[9px] font-bold text-foreground/80 leading-tight line-clamp-2 mb-2">{c.course}</p>
              <div className="flex items-center gap-1">
                <FileText className="w-2.5 h-2.5 text-muted-foreground/50" />
                <span className="text-[8px] text-muted-foreground/60">{c.sem}</span>
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Floating badges */}
      {[
        { label: "2,400+ Papers", icon: FileText, x: "6%",  y: "10%", delay: 1.2 },
        { label: "Active Now",    icon: Users,    x: "66%", y: "80%", delay: 1.5 },
      ].map((p, i) => (
        <motion.div
          key={i}
          className="absolute flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-border backdrop-blur-md shadow-md text-[10px] font-bold text-foreground"
          style={{ left: p.x, top: p.y }}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: p.delay, duration: 0.5, ease: E }}
        >
          <p.icon className="w-3 h-3 text-violet-500" />{p.label}
        </motion.div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HOW IT WORKS
═══════════════════════════════════════════════════════════════ */
function HowItWorks() {
  return (
    <section className="relative py-32 overflow-hidden bg-background">
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "repeating-linear-gradient(45deg,hsl(var(--foreground)/0.4) 0,hsl(var(--foreground)/0.4) 1px,transparent 0,transparent 50%)",
        backgroundSize:  "20px 20px",
      }} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SH
          icon={Sparkles} label="How It Works"
          title={<>Four steps to <GT>exam readiness</GT></>}
          sub="From search to download in under 30 seconds. No friction, no barriers, no paywalls."
          center className="mb-20"
        />
        <div className="relative">
          {/* Desktop connector */}
          <div className="hidden lg:block absolute top-[50px] left-[calc(12.5%+40px)] right-[calc(12.5%+40px)] h-px">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-border to-transparent" />
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-violet-500"
              animate={{ left: ["0%", "100%", "0%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <motion.div
            variants={stagger(0.14)} initial="hidden" whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {STEPS.map((s, i) => (
              <motion.div key={i} variants={vUp} className="flex flex-col items-center text-center group">
                <div className="relative mb-6">
                  <div className="relative w-[72px] h-[72px] rounded-2xl bg-gradient-to-br from-violet-100 to-violet-50 border border-violet-200 flex items-center justify-center shadow-lg shadow-violet-100 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-2">
                    <s.icon className="w-7 h-7 text-violet-600" />
                  </div>
                  {/* Step bubble */}
                  <div className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center shadow-sm">
                    <span className="text-[8px] font-black text-violet-600">{s.n}</span>
                  </div>
                </div>
                <h3 className="font-black text-base text-foreground mb-2.5 group-hover:text-violet-600 transition-colors duration-200">
                  {s.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FEATURE CARD (BENTO)
═══════════════════════════════════════════════════════════════ */
function FeatCard({ f, i }: { f: typeof FEATS[0]; i: number }) {
  const a = AC[f.accent];
  return (
    <motion.div variants={vScale} className={cn("h-full", f.wide ? "lg:col-span-2" : "lg:col-span-1")}>
      <div className={cn(
        "group relative h-full rounded-2xl border border-border bg-card",
        "p-6 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl", a.sh
      )}>
        <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br to-transparent", a.bg)} />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/[0.04] to-transparent" />
        <span className="absolute top-5 right-5 text-[10px] font-black text-muted-foreground/20 tabular-nums select-none">
          {String(i + 1).padStart(2, "0")}
        </span>
        <div className={cn(
          "relative w-11 h-11 rounded-xl border flex items-center justify-center mb-5",
          "transition-all duration-300 group-hover:scale-105 group-hover:rotate-3",
          a.bg, a.bd, a.tx
        )}>
          <f.icon className="w-5 h-5" />
        </div>
        <h3 className={cn("relative font-black text-sm mb-2 text-foreground transition-colors duration-200", a.hover)}>
          {f.title}
        </h3>
        <p className="relative text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
        <div className={cn(
          "absolute bottom-0 inset-x-0 h-[2px] opacity-0 group-hover:opacity-100",
          "transition-opacity duration-500 bg-gradient-to-r from-transparent via-current to-transparent", a.tx
        )} />
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CATEGORY STRIP
═══════════════════════════════════════════════════════════════ */
function CategoryStrip() {
  return (
    <section className="relative py-20 overflow-hidden bg-secondary/20 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-10"
        >
          <span className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground/70">
            Browse by category
          </span>
          <Link href="/departments">
            <button className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </motion.div>
        <motion.div
          variants={stagger(0.07)} initial="hidden" whileInView="show"
          viewport={{ once: true, margin: "-30px" }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
        >
          {CATS.map((c, i) => {
            const a = AC[c.color];
            return (
              <motion.div key={i} variants={vScale}>
                <Link href="/departments">
                  <div className={cn(
                    "group flex flex-col items-center gap-3 p-5 rounded-2xl border",
                    "transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg cursor-pointer",
                    a.bg, a.bd, a.sh
                  )}>
                    <div className={cn(
                      "w-11 h-11 rounded-xl flex items-center justify-center",
                      "transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
                      a.bg, a.tx
                    )}>
                      <c.icon className="w-5 h-5" />
                    </div>
                    <div className="text-center">
                      <p className={cn("text-xs font-black text-foreground transition-colors", a.hover)}>{c.label}</p>
                      <p className="text-[10px] text-muted-foreground/70 mt-0.5">{c.count} papers</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DEPARTMENT CARD
═══════════════════════════════════════════════════════════════ */
function DeptCard({ dept, idx }: {
  dept: { id: string; name: string; description?: string; _count?: { papers: number } };
  idx: number;
}) {
  const p = DP[idx % DP.length];
  return (
    <motion.div variants={vScale} className="h-full">
      <Link href={`/departments/${dept.id}`} className="block h-full group">
        <div className={cn(
          "relative h-full rounded-2xl border bg-gradient-to-br to-white p-5 overflow-hidden",
          "transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-black/5",
          p.g, p.b
        )}>
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute top-4 right-4 text-[10px] font-black text-muted-foreground/20 select-none">
            {String(idx + 1).padStart(2, "0")}
          </div>
          <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3", p.ic)}>
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="font-black text-sm text-foreground mb-2 leading-snug">
            {dept.name}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-5 leading-relaxed">
            {dept.description ?? "Explore examination papers from this department."}
          </p>
          <div className="flex items-center gap-2 mb-5">
            {dept._count?.papers != null && (
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <FileText className="w-3 h-3" />{dept._count.papers} papers
              </span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={cn("w-1.5 h-1.5 rounded-full", p.dot)} />
              <span className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-wider">Active</span>
            </div>
            <div className={cn(
              "w-7 h-7 rounded-xl border border-border bg-background/80 flex items-center justify-center",
              "opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300"
            )}>
              <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAPERS SECTION
═══════════════════════════════════════════════════════════════ */
function PapersSection({
  icon, label, title, sub, href, linkLabel,
  papers, loading, emptyIcon: EmptyIcon, emptyTitle, emptyMsg, alt,
}: {
  icon: React.ElementType; label: string; title: React.ReactNode; sub: string;
  href: string; linkLabel: string; papers: any[]; loading: boolean;
  emptyIcon: React.ElementType; emptyTitle: string; emptyMsg: string; alt?: boolean;
}) {
  return (
    <section className={cn("relative py-28 overflow-hidden", alt && "bg-secondary/20")}>
      {alt && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_100%_50%,hsl(var(--primary)/0.06),transparent)]" />
      )}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
          <SH icon={icon} label={label} title={title} sub={sub} />
          <motion.div
            initial={{ opacity: 0, x: 18 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.15 }}
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
                <motion.div key={p.id} variants={vScale} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
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

/* ═══════════════════════════════════════════════════════════════
   TESTIMONIALS
═══════════════════════════════════════════════════════════════ */
function Testimonials() {
  return (
    <section className="relative py-24 overflow-hidden border-y border-border">
      <div className="absolute inset-0 bg-secondary/20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,hsl(var(--primary)/0.05),transparent)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-10 justify-center"
        >
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-border" />
          <span className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground/70">
            What students say
          </span>
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-border" />
        </motion.div>

        <motion.div
          variants={stagger(0.1)} initial="hidden" whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {TESTI.map((t, i) => (
            <motion.div key={i} variants={vScale}>
              <div className="group relative h-full rounded-2xl bg-card border border-border p-6 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden">
                <Quote className="absolute -top-1 -left-1 w-16 h-16 text-violet-100 -scale-x-100" />
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.stars)].map((_, s) => (
                    <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-[13px] text-muted-foreground leading-relaxed mb-5 font-medium">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-100 to-violet-50 border border-violet-200 flex items-center justify-center text-xs font-black text-violet-600">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-black text-foreground">{t.name}</p>
                    <p className="text-[10px] text-muted-foreground/70">{t.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SUBJECT MARQUEE
═══════════════════════════════════════════════════════════════ */
function SubjectMarquee() {
  const doubled = [...SUBJECTS, ...SUBJECTS];
  return (
    <div className="relative py-5 overflow-hidden border-y border-border bg-secondary/20">
      {/* Fade masks — use bg-background not bg-zinc-950 */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
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

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY  = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOp = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const { data: trendingData, isLoading: trendingLoading } = useQuery({
    queryKey: ["landing-trending"],
    queryFn:  () => paperService.getAll({ limit: 6, sortBy: "downloads", sortOrder: "desc" }),
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
      <PublicNavbar />
      <ScrollBar />

      {/* ╔══════════════════════════════════════════════╗
          ║  HERO — light background                    ║
          ╚══════════════════════════════════════════════╝ */}
      <section ref={heroRef} className="relative min-h-[100svh] flex items-center overflow-hidden">
        {/* Light background system — NO bg-zinc-950 */}
        <div className="absolute inset-0 bg-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_15%_40%,hsl(255_85%_60%/0.1),transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_90%_15%,hsl(325_80%_55%/0.07),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_80%_85%,hsl(190_90%_45%/0.05),transparent)]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage:`linear-gradient(hsl(var(--foreground)/0.12) 1px,transparent 1px),linear-gradient(90deg,hsl(var(--foreground)/0.12) 1px,transparent 1px)`,
          backgroundSize:"80px 80px",
        }} />
        {/* Animated blob */}
        <motion.div
          className="absolute top-[18%] left-[2%] w-[38vw] h-[38vw] max-w-[560px] max-h-[560px] rounded-full pointer-events-none"
          style={{ background:"radial-gradient(circle,hsl(255 85% 60% / 0.12) 0%,transparent 70%)", filter:"blur(70px)" }}
          animate={{ scale:[1, 1.12, 1], opacity:[0.6, 0.9, 0.6] }}
          transition={{ duration:10, repeat:Infinity, ease:"easeInOut" }}
        />

        <motion.div
          style={{ y: heroY, opacity: heroOp }}
          className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-12 lg:gap-6 items-center">

            {/* Copy */}
            <div className="flex flex-col items-start">
              {/* Live badge */}
              <motion.div
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: E }}
                className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-violet-100 border border-violet-200 mb-8"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inset-0 rounded-full bg-violet-500 opacity-65" />
                  <span className="relative w-2 h-2 rounded-full bg-violet-600" />
                </span>
                <span className="text-[10px] font-black tracking-[0.16em] uppercase text-violet-700">
                  Open Academic Resource Platform
                </span>
              </motion.div>

              {/* H1 */}
              <motion.h1
                initial={{ opacity: 0, y: 44 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.85, ease: E }}
                className="font-black tracking-tighter leading-[0.86] mb-6 text-foreground"
                style={{ fontSize: "clamp(3.2rem, 9vw, 7rem)" }}
              >
                <GT>StudyHouse</GT>
              </motion.h1>

              {/* Typewriter */}
              <motion.div
                initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.7, ease: E }}
                className="text-xl md:text-2xl font-black text-muted-foreground mb-5 min-h-[2rem]"
              >
                <Typewriter />
              </motion.div>

              {/* Body */}
              <motion.p
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.36, duration: 0.65 }}
                className="text-[15px] text-muted-foreground max-w-[460px] leading-relaxed mb-10"
              >
                The complete archive of past exam papers, notes, and assignments —
                organized by department, program, semester, and course code.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.48, duration: 0.6 }}
                className="flex flex-wrap gap-3 mb-10"
              >
                <Magnetic>
                  <Link href="/papers">
                    <button className="relative flex h-12 items-center gap-2.5 px-7 rounded-xl bg-[hsl(var(--primary))] text-sm font-bold text-white shadow-xl shadow-[hsl(var(--primary)/0.3)] hover:opacity-90 hover:scale-[1.03] transition-all duration-300 overflow-hidden">
                      <motion.span
                        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                        initial={{ x: "-100%" }} animate={{ x: "220%" }}
                        transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 3.5, ease: "easeInOut" }}
                      />
                      <Search className="w-4 h-4 relative" />
                      <span className="relative">Browse Papers</span>
                    </button>
                  </Link>
                </Magnetic>
                <Magnetic>
                  <Link href="/departments">
                    <button className="flex h-12 items-center gap-2 px-7 rounded-xl border border-border bg-card text-sm font-bold text-foreground hover:border-violet-300 hover:text-violet-600 transition-all duration-300">
                      Departments <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </Magnetic>
              </motion.div>

              {/* Trust chips */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.72 }}
                className="flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-muted-foreground/70"
              >
                {([
                  [Star,         "Trusted by students"     ],
                  [Download,     "Thousands of downloads"  ],
                  [CheckCircle2, "Verified content"        ],
                  [BookMarked,   "All departments covered" ],
                ] as [React.ElementType, string][]).map(([I, label]) => (
                  <span key={label} className="flex items-center gap-1.5">
                    <I className="w-3.5 h-3.5 text-violet-500" />{label}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Visualization */}
            <motion.div
              initial={{ opacity: 0, x: 36, scale: 0.94 }}
              animate={{ opacity: 1, x: 0,  scale: 1 }}
              transition={{ delay: 0.28, duration: 0.9, ease: E }}
              className="hidden lg:flex items-center justify-center"
            >
              <HeroViz />
            </motion.div>
          </div>
        </motion.div>

        <ScrollCue />
      </section>

      {/* Subject Marquee */}
      <SubjectMarquee />

      {/* ╔══════════════════════════════════════════════╗
          ║  STATS                                      ║
          ╚══════════════════════════════════════════════╝ */}
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
                  "border-r border-b border-border/40",
                  "last:border-r-0 [&:nth-child(2)]:border-r-0 md:[&:nth-child(2)]:border-r",
                  "md:[&:nth-child(n+3)]:border-b-0 hover:bg-secondary/30 transition-colors duration-300"
                )}
              >
                <div className={cn("relative w-10 h-10 rounded-xl flex items-center justify-center border mb-0.5 transition-transform duration-300 group-hover:scale-105", s.bg, s.border)}>
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

      <HowItWorks />

      {/* ╔══════════════════════════════════════════════╗
          ║  FEATURES BENTO                             ║
          ╚══════════════════════════════════════════════╝ */}
      <section className="relative py-28 bg-secondary/10 overflow-hidden border-t border-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_0%,hsl(var(--primary)/0.06),transparent)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SH icon={Cpu} label="Platform Features"
            title={<>Built for <GT>serious students</GT></>}
            sub="Every feature is purpose-built around the real needs of students and faculty."
            center className="mb-16"
          />
          <motion.div
            variants={stagger(0.07)} initial="hidden" whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {FEATS.map((f, i) => <FeatCard key={f.title} f={f} i={i} />)}
          </motion.div>
        </div>
      </section>

      <CategoryStrip />

      {/* ╔══════════════════════════════════════════════╗
          ║  DEPARTMENTS                                ║
          ╚══════════════════════════════════════════════╝ */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_0%_60%,hsl(var(--primary)/0.06),transparent)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
            <SH icon={Building2} label="Departments"
              title={<>Find your <GT>department</GT></>}
              sub="Papers organized across every academic department."
            />
            <motion.div
              initial={{ opacity: 0, x: 18 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.12 }}
              className="shrink-0"
            >
              <Link href="/departments">
                <button className="flex items-center gap-2 h-9 px-4 rounded-xl border border-border bg-card text-[12px] font-bold text-muted-foreground hover:border-violet-300 hover:text-violet-600 transition-colors">
                  All Departments <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </motion.div>
          </div>

          {deptsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-48 rounded-2xl border border-border bg-secondary/30 animate-pulse" />
              ))}
            </div>
          ) : departments.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center">
                <Building2 className="w-7 h-7 text-muted-foreground/40" />
              </div>
              <p className="font-bold text-sm text-muted-foreground">No departments found</p>
            </div>
          ) : (
            <motion.div
              variants={stagger(0.07)} initial="hidden" whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {departments.slice(0, 6).map((d, i) => (
                <DeptCard key={d.id ?? i} dept={d} idx={i} />
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <PapersSection
        icon={FlameKindling} label="Trending Now"
        title={<>Most <GT>downloaded</GT> papers</>}
        sub="What students are downloading and studying most right now."
        href="/papers?sort=downloads" linkLabel="See all trending"
        papers={trendingPapers} loading={trendingLoading}
        emptyIcon={TrendingUp} emptyTitle="Nothing trending yet"
        emptyMsg="Check back soon — papers will appear as activity picks up." alt
      />

      <Testimonials />

      <PapersSection
        icon={Clock} label="Recently Added"
        title={<>Fresh <GT>uploads</GT></>}
        sub="Past papers added to the archive recently by the community."
        href="/papers?sort=createdAt" linkLabel="See all recent"
        papers={recentPapers} loading={recentLoading}
        emptyIcon={Clock} emptyTitle="No uploads yet"
        emptyMsg="Be the first to contribute — upload your past papers now."
      />

      {/* ╔══════════════════════════════════════════════╗
          ║  CTA — FULL BLEED                           ║
          ╚══════════════════════════════════════════════╝ */}
      <section className="relative py-40 overflow-hidden">
        {/* Light gradient — NOT via-zinc-950 */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-background to-indigo-50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_50%,hsl(var(--primary)/0.08),transparent)]" />
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage:"radial-gradient(circle,hsl(var(--foreground)/0.3) 1px,transparent 1px)",
          backgroundSize:"28px 28px",
        }} />
        <motion.div
          className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background:"radial-gradient(circle,hsl(var(--primary)/0.12) 0%,transparent 70%)", filter:"blur(80px)" }}
          animate={{ scale:[1, 1.12, 1], opacity:[0.5, 0.8, 0.5] }}
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
                  { I:CheckCircle2, c:"bg-emerald-50 border-emerald-200 text-emerald-600", p:"-top-3 -right-3" },
                  { I:Users,        c:"bg-blue-50 border-blue-200 text-blue-600",          p:"-bottom-3 -left-3" },
                  { I:Star,         c:"bg-amber-50 border-amber-200 text-amber-600",        p:"-bottom-3 -right-3" },
                ].map(({ I, c, p }) => (
                  <div key={p} className={cn("absolute w-9 h-9 rounded-xl border flex items-center justify-center", c, p)}>
                    <I className="w-4 h-4" />
                  </div>
                ))}
              </div>
            </motion.div>

            <Tag icon={Sparkles} label="Join the Community" />

            <motion.h2
              variants={vUp}
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

            {/* Benefit chips */}
            <motion.div variants={stagger(0.06)} className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
              {["100% Free","Instant publish","Earn recognition","Help thousands","Zero friction"].map((b) => (
                <motion.span key={b} variants={vScale}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold bg-card text-muted-foreground border border-border"
                >
                  <CheckCircle2 className="w-3 h-3 text-violet-500" />{b}
                </motion.span>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div variants={vUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <Magnetic>
                <Link href="/register">
                  <button className                  ="relative flex h-12 items-center gap-2.5 px-8 rounded-xl bg-[hsl(var(--primary))] text-sm font-bold text-white shadow-xl shadow-[hsl(var(--primary)/0.3)] hover:opacity-90 hover:scale-105 transition-all duration-300 overflow-hidden w-full sm:w-auto">
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

      <ScrollToTop />
      <Footer />
    </>
  );
}
