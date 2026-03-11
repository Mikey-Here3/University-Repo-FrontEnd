"use client";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Search, ArrowRight, Star, Download, CheckCircle2, BookMarked, FileText, Users, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { EASE } from "@/lib/animations";
import { ORBIT_CARDS, ORBIT_COLORS } from "@/config/home-theme";
import { Magnetic }    from "./magnetic";
import { Typewriter }  from "./typewriter";
import { ScrollCue }   from "./scroll-bar";

/* ─── Gradient text ─────────────────────────────────────────── */
const GT = ({ children }: { children: React.ReactNode }) => (
  <span className="gradient-text">{children}</span>
);

/* ─── Orbit visualization ───────────────────────────────────── */
function HeroViz() {
  return (
    <div className="relative w-full h-[500px] select-none">
      {[300, 210, 120].map((r, i) => (
        <motion.div key={r}
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
        transition={{ delay: 0.5, duration: 0.8, ease: EASE }}
      >
        <div className="relative w-20 h-20 rounded-[22px] bg-gradient-to-br from-violet-100 to-violet-50 border border-violet-200 flex items-center justify-center shadow-2xl shadow-violet-200">
          <BookOpen className="w-9 h-9 text-violet-600" />
          <span className="absolute inset-0 rounded-[22px] border border-violet-400/40 animate-ping opacity-30" />
        </div>
      </motion.div>

      {/* Orbiting cards */}
      {ORBIT_CARDS.map((c, i) => {
        const angle = (i / ORBIT_CARDS.length) * 2 * Math.PI - Math.PI / 2;
        const col   = ORBIT_COLORS[c.color];
        const even  = i % 2 === 0;
        return (
          <motion.div key={i} className="absolute"
            style={{
              left: `calc(50% + ${Math.cos(angle) * 148}px)`,
              top:  `calc(50% + ${Math.sin(angle) * 148}px)`,
              translateX: "-50%", translateY: "-50%",
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1, y: [0, even ? -10 : 10, 0] }}
            transition={{
              opacity: { delay: 0.7 + i * 0.1, duration: 0.45 },
              scale:   { delay: 0.7 + i * 0.1, duration: 0.45, ease: EASE },
              y:       { duration: 3.2 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 },
            }}
          >
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
        { label:"2,400+ Papers", icon:FileText, x:"6%",  y:"10%", delay:1.2 },
        { label:"Active Now",    icon:Users,    x:"66%", y:"80%", delay:1.5 },
      ].map((p, i) => (
        <motion.div key={i}
          className="absolute flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-border shadow-md text-[10px] font-bold text-foreground"
          style={{ left: p.x, top: p.y }}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: p.delay, duration: 0.5, ease: EASE }}
        >
          <p.icon className="w-3 h-3 text-violet-500" />{p.label}
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Hero section ──────────────────────────────────────────── */
export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY  = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOp = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={heroRef} className="relative min-h-[100svh] flex items-center overflow-hidden">
      {/* Layered light background — sourced from globals.css hero-gradient */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 bg-fine-grid opacity-[0.4]" />
      <motion.div
        className="absolute top-[18%] left-[2%] w-[38vw] h-[38vw] max-w-[560px] max-h-[560px] rounded-full pointer-events-none"
        style={{ background:"radial-gradient(circle,hsl(263 90% 57%/0.14) 0%,transparent 70%)", filter:"blur(70px)" }}
        animate={{ scale:[1,1.12,1], opacity:[0.6,0.9,0.6] }}
        transition={{ duration:10, repeat:Infinity, ease:"easeInOut" }}
      />

      <motion.div style={{ y: heroY, opacity: heroOp }}
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-12 lg:gap-6 items-center">

          {/* Copy */}
          <div className="flex flex-col items-start">
            {/* Live badge */}
            <motion.div
              initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.6, ease:EASE }}
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
              initial={{ opacity:0, y:44 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:0.1, duration:0.85, ease:EASE }}
              className="font-black tracking-tighter leading-[0.86] mb-6 text-foreground"
              style={{ fontSize:"clamp(3.2rem,9vw,7rem)" }}
            >
              <GT>UniResources</GT>
            </motion.h1>

            {/* Typewriter */}
            <motion.div
              initial={{ opacity:0, y:22 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:0.25, duration:0.7, ease:EASE }}
              className="text-xl md:text-2xl font-black text-muted-foreground mb-5 min-h-[2rem]"
            >
              <Typewriter />
            </motion.div>

            {/* Body copy */}
            <motion.p
              initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:0.36, duration:0.65 }}
              className="text-[15px] text-muted-foreground max-w-[460px] leading-relaxed mb-10"
            >
              The complete archive of past exam papers, notes, and assignments —
              organized by department, program, semester, and course code.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:0.48, duration:0.6 }}
              className="flex flex-wrap gap-3 mb-10"
            >
              <Magnetic>
                <Link href="/papers">
                  <button className="relative flex h-12 items-center gap-2.5 px-7 rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-xl shadow-primary/30 hover:opacity-90 hover:scale-[1.03] transition-all duration-300 overflow-hidden">
                    <motion.span
                      className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                      initial={{ x:"-100%" }} animate={{ x:"220%" }}
                      transition={{ duration:2.4, repeat:Infinity, repeatDelay:3.5, ease:"easeInOut" }}
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
              initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.72 }}
              className="flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-muted-foreground/70"
            >
              {([
                [Star,         "Trusted by students"    ],
                [Download,     "Thousands of downloads" ],
                [CheckCircle2, "Verified content"       ],
                [BookMarked,   "All departments covered"],
              ] as [React.ElementType, string][]).map(([I, label]) => (
                <span key={label} className="flex items-center gap-1.5">
                  <I className="w-3.5 h-3.5 text-violet-500" />{label}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Visualization */}
          <motion.div
            initial={{ opacity:0, x:36, scale:0.94 }} animate={{ opacity:1, x:0, scale:1 }}
            transition={{ delay:0.28, duration:0.9, ease:EASE }}
            className="hidden lg:flex items-center justify-center"
          >
            <HeroViz />
          </motion.div>
        </div>
      </motion.div>

      <ScrollCue />
    </section>
  );
}