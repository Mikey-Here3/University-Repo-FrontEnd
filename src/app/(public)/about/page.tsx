"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  BookOpen, Shield, Search, Users, Target, Award,
  ArrowRight, Sparkles, GraduationCap, Library, Star,
  TrendingUp, Heart, Upload, Code2, Palette, FileText,
} from "lucide-react";

/* ─── Team ───────────────────────────────────────────────────── */
const TEAM = [
  {
    id:      "1",
    name:    "Ashan Mir",
    role:    "Lead Developer",
    bio:     "Architected and built the full platform — front to back. Responsible for the Next.js application, Tailwind UI system, and Node.js API.",
    accent:  { bg:"bg-violet-100", text:"text-violet-600", ring:"ring-violet-200", dot:"bg-violet-500" },
    tags:    ["Next.js", "Tailwind CSS", "Node.js"],
    icon:    Code2,
  },
  {
    id:      "2",
    name:    "Malik M.Umair",
    role:    "UI & Backend Developer",
    bio:     "Designed interface components and built the data layer — PostgreSQL schema design and RESTful API integration.",
    accent:  { bg:"bg-cyan-100", text:"text-cyan-600", ring:"ring-cyan-200", dot:"bg-cyan-500" },
    tags:    ["PostgreSQL", "REST API", "UI Design"],
    icon:    Palette,
  },
  {
    id:      "3",
    name:    "Sohaib Kayani",
    role:    "Content & Documentation",
    bio:     "Led content strategy, academic data collection, and wrote the platform documentation to ensure quality and accuracy across the archive.",
    accent:  { bg:"bg-emerald-100", text:"text-emerald-600", ring:"ring-emerald-200", dot:"bg-emerald-500" },
    tags:    ["Data Collection", "Documentation"],
    icon:    FileText,
  },
];

/* ─── Other data (unchanged) ─────────────────────────────────── */
const FEATURES = [
  {
    icon: Search,
    title: "Advanced Search",
    description: "Find papers across the entire academic hierarchy using multi-filter search with department, program, semester, year, and exam type filters.",
    gradient: "from-violet-500 to-indigo-500",
    shadow:   "shadow-violet-500/20",
    ring:     "ring-violet-500/20",
    bg:       "bg-violet-50",
    border:   "border-violet-200",
  },
  {
    icon: Shield,
    title: "Quality Assured",
    description: "Every paper goes through an admin review process to ensure quality and relevance before being published to the archive.",
    gradient: "from-cyan-500 to-blue-500",
    shadow:   "shadow-cyan-500/20",
    ring:     "ring-cyan-500/20",
    bg:       "bg-cyan-50",
    border:   "border-cyan-200",
  },
  {
    icon: BookOpen,
    title: "Organized Hierarchy",
    description: "Papers are structured following the academic hierarchy: Department → Program → Semester → Year → Course.",
    gradient: "from-emerald-500 to-teal-500",
    shadow:   "shadow-emerald-500/20",
    ring:     "ring-emerald-500/20",
    bg:       "bg-emerald-50",
    border:   "border-emerald-200",
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Students contribute papers from their courses, building a comprehensive resource for future cohorts and academic reference.",
    gradient: "from-orange-500 to-amber-500",
    shadow:   "shadow-orange-500/20",
    ring:     "ring-orange-500/20",
    bg:       "bg-orange-50",
    border:   "border-orange-200",
  },
  {
    icon: Target,
    title: "Fully Accessible",
    description: "Fully responsive and designed with accessibility standards to serve all users equally across devices.",
    gradient: "from-rose-500 to-pink-500",
    shadow:   "shadow-rose-500/20",
    ring:     "ring-rose-500/20",
    bg:       "bg-rose-50",
    border:   "border-rose-200",
  },
  {
    icon: Award,
    title: "Institutional Standard",
    description: "Built to institutional standards with professional design language suitable for academic environments.",
    gradient: "from-fuchsia-500 to-purple-500",
    shadow:   "shadow-fuchsia-500/20",
    ring:     "ring-fuchsia-500/20",
    bg:       "bg-fuchsia-50",
    border:   "border-fuchsia-200",
  },
];

const STATS = [
  { icon: Library,       value: "2,400+", label: "Papers Archived",  color: "text-violet-600"  },
  { icon: GraduationCap, value: "40+",    label: "Programs Covered", color: "text-cyan-600"    },
  { icon: Users,         value: "8,000+", label: "Students Served",  color: "text-emerald-600" },
  { icon: Star,          value: "100%",   label: "Free to Access",   color: "text-amber-600"   },
];

const VALUES = [
  {
    icon: TrendingUp,
    title: "Continuous Growth",
    body: "The archive grows every semester as students and faculty contribute new papers, building an ever-richer academic resource.",
  },
  {
    icon: Heart,
    title: "Integrity First",
    body: "Every submission is reviewed for authenticity and quality, ensuring the archive remains a trustworthy academic reference.",
  },
  {
    icon: Sparkles,
    title: "Innovation in Learning",
    body: "We reimagine how students interact with historical exam content — making discovery intuitive, fast, and meaningful.",
  },
];

/* ─── Animation variants ─────────────────────────────────────── */
const E = [0.22, 1, 0.36, 1] as const;

const staggerContainer = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { staggerChildren: 0.09 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 28, filter: "blur(4px)" },
  show:   { opacity: 1, y: 0,  filter: "blur(0px)",
            transition: { duration: 0.58, ease: E } },
};
const fadeScale = {
  hidden: { opacity: 0, scale: 0.88 },
  show:   { opacity: 1, scale: 1, transition: { duration: 0.5, ease: E } },
};

/* ─── Micro components ───────────────────────────────────────── */
function SectionBadge({ label }: { label: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-200 bg-violet-100 text-violet-700 text-[10px] font-black tracking-[0.14em] uppercase mb-5">
      <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
      {label}
    </div>
  );
}

function OrnamDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-6">
      <div className="h-px w-16 bg-gradient-to-r from-transparent to-border" />
      <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
      <div className="h-px w-16 bg-gradient-to-l from-transparent to-border" />
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY       = useTransform(scrollYProgress, [0, 1],   ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="min-h-screen bg-background">

      {/* ── Ambient background ── */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-80 h-80 bg-cyan-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "radial-gradient(circle, hsl(var(--foreground)/0.4) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-28">

        {/* ════════════════════════════════════════════
            HERO
        ════════════════════════════════════════════ */}
        <motion.section
          ref={heroRef}
          style={{ y: heroY, opacity: heroOpacity }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.1 }}
            className="relative inline-flex mb-8"
          >
            <div className="w-20 h-20 rounded-[22px] bg-gradient-to-br from-violet-100 to-violet-50 border border-violet-200 flex items-center justify-center shadow-2xl shadow-violet-200">
              <BookOpen className="w-9 h-9 text-violet-600" />
              <span className="absolute inset-0 rounded-[22px] border border-violet-400/40 animate-ping opacity-20" />
            </div>
            <motion.span
              className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-background shadow-lg"
              animate={{ scale: [1, 1.35, 1] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6, ease: E }}
          >
            <SectionBadge label="Academic Archive" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-6 leading-[0.88]">
              <span className="text-foreground">UniResources</span>
              <br />
              <span className="gradient-text">Academic Hub</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-base md:text-lg">
              A comprehensive digital repository designed to preserve and provide
              seamless access to past examination papers and academic resources —
              built for students, by students.
            </p>
            <OrnamDivider />
          </motion.div>
        </motion.section>

        {/* ════════════════════════════════════════════
            STATS
        ════════════════════════════════════════════ */}
        <motion.section
          variants={staggerContainer} initial="hidden"
          whileInView="show" viewport={{ once: true, margin: "-80px" }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((stat) => (
              <motion.div key={stat.label} variants={fadeScale}>
                <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/60">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/[0.04] to-transparent" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-violet-50 to-violet-50/30 transition-opacity duration-500" />
                  <stat.icon className={cn("w-5 h-5 mx-auto mb-3 relative", stat.color)} />
                  <p className="text-2xl font-black tracking-tight text-foreground mb-0.5 relative">{stat.value}</p>
                  <p className="text-[11px] text-muted-foreground/70 relative">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ════════════════════════════════════════════
            FEATURES
        ════════════════════════════════════════════ */}
        <section>
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.55, ease: E }}
          >
            <SectionBadge label="What We Offer" />
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-3">Key Features</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
              Everything you need to discover, explore, and learn from our
              comprehensive examination paper archive.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer} initial="hidden"
            whileInView="show" viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {FEATURES.map((feature) => (
              <motion.div
                key={feature.title} variants={fadeUp}
                whileHover={{ y: -5, transition: { duration: 0.22 } }}
                className="h-full"
              >
                <div className={cn(
                  "group relative h-full rounded-2xl border p-6 overflow-hidden",
                  "bg-card hover:shadow-xl transition-all duration-300 cursor-default",
                  feature.border
                )}>
                  <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-[0.06] transition-opacity duration-500", feature.gradient)} />
                  <div className={cn("absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r opacity-0 group-hover:opacity-80 transition-opacity duration-300", feature.gradient)} />
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/[0.04] to-transparent" />
                  <div className={cn("absolute inset-0 opacity-40", feature.bg)} />
                  <div className={cn("relative w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center mb-5 shadow-md ring-2 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3", feature.gradient, feature.shadow, feature.ring)}>
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="relative font-black text-sm text-foreground mb-2">{feature.title}</h3>
                  <p className="relative text-[12px] text-muted-foreground leading-relaxed">{feature.description}</p>
                  <ArrowRight className="absolute bottom-5 right-5 w-4 h-4 text-muted-foreground/20 group-hover:text-muted-foreground/60 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ════════════════════════════════════════════
            MISSION
        ════════════════════════════════════════════ */}
        <motion.section
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: E }}
        >
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-10 md:p-14 text-center">
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-violet-200/30 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-cyan-200/20 blur-3xl pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 via-purple-400 to-cyan-500 opacity-70" />

            <SectionBadge label="Our Mission" />
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-6">Why We Built This</h2>
            <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto text-base mb-10">
              To democratize access to academic resources by creating a centralized,
              well-organized archive that helps students prepare effectively for
              examinations. We believe in the power of shared knowledge and
              institutional memory — every paper in our archive contributes to a
              legacy that transcends individual semesters, building a lasting
              resource for generations of learners.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              {VALUES.map((v) => (
                <div key={v.title} className="flex flex-col gap-2 p-5 rounded-xl border border-border bg-background/60 hover:bg-secondary/30 hover:border-violet-200 transition-all duration-200">
                  <div className="w-8 h-8 rounded-lg bg-violet-100 border border-violet-200 flex items-center justify-center mb-1">
                    <v.icon className="w-4 h-4 text-violet-600" />
                  </div>
                  <h4 className="font-black text-sm text-foreground">{v.title}</h4>
                  <p className="text-[12px] text-muted-foreground leading-relaxed">{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ════════════════════════════════════════════
            TEAM
        ════════════════════════════════════════════ */}
        <section>
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.55, ease: E }}
          >
            <SectionBadge label="Our Team" />
            <h2 className="text-3xl font-black tracking-tight text-foreground mb-3">Meet the Builders</h2>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
              Three people who designed, built, and documented UniResources from the ground up.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer} initial="hidden"
            whileInView="show" viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6"
          >
            {TEAM.map((member) => (
              <motion.div
                key={member.id} variants={fadeUp}
                whileHover={{ y: -6, transition: { duration: 0.22 } }}
              >
                <div className={cn(
                  "group relative overflow-hidden rounded-2xl border border-border bg-card p-7 text-center",
                  "hover:shadow-xl transition-all duration-300",
                  `hover:border-${member.accent.dot.replace("bg-","").split("-")[0]}-200`
                )}>
                  {/* Top colour sweep on hover */}
                  <div className={cn(
                    "absolute top-0 inset-x-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl",
                    `bg-gradient-to-r`,
                  )}
                    style={{ background: `linear-gradient(to right, transparent, var(--tw-gradient-stops))` }}
                  />
                  {/* Soft tint wash */}
                  <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500", member.accent.bg, "opacity-20")} />
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/[0.04] to-transparent" />

                  {/* Avatar */}
                  <div className="relative inline-flex mb-5">
                    <Avatar className={cn(
                      "h-20 w-20 ring-[3px] transition-all duration-300",
                      member.accent.ring,
                      member.accent.bg
                    )}>
                      <AvatarFallback className={cn("text-xl font-black", member.accent.bg, member.accent.text)}>
                        {member.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    {/* Role icon badge */}
                    <div className={cn(
                      "absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-2 border-background flex items-center justify-center shadow-md",
                      member.accent.bg
                    )}>
                      <member.icon className={cn("w-3.5 h-3.5", member.accent.text)} />
                    </div>
                  </div>

                  {/* Name + role */}
                  <h3 className="font-black text-base text-foreground leading-snug mb-0.5 relative">
                    {member.name}
                  </h3>
                  <p className={cn("text-[11px] font-bold mb-3 relative", member.accent.text)}>
                    {member.role}
                  </p>

                  {/* Bio */}
                  <p className="text-[12px] text-muted-foreground leading-relaxed mb-5 relative">
                    {member.bio}
                  </p>

                  {/* Tech tags */}
                  <div className="flex flex-wrap justify-center gap-1.5 relative">
                    {member.tags.map((tag) => (
                      <span key={tag} className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border",
                        member.accent.bg, member.accent.text,
                        member.accent.ring.replace("ring-", "border-").replace("/20", "/40")
                      )}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ════════════════════════════════════════════
            CTA
        ════════════════════════════════════════════ */}
        <motion.section
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.55, ease: E }}
          className="pb-8"
        >
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-10 md:p-14 text-center mb-12">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-background to-indigo-50 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,hsl(var(--primary)/0.07),transparent)] pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 via-purple-400 to-indigo-500 opacity-70" />

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1, ease: E }}
              className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-violet-50 border border-violet-200 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-violet-100"
            >
              <Upload className="w-7 h-7 text-violet-600" />
            </motion.div>

            <h2 className="relative text-2xl md:text-3xl font-black text-foreground tracking-tight mb-3">
              Ready to contribute?
            </h2>
            <p className="relative text-muted-foreground text-sm max-w-sm mx-auto mb-8 leading-relaxed">
              Join thousands of students helping grow the archive. Upload your
              past papers and make a lasting difference.
            </p>

            <div className="relative flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  className="relative flex h-11 items-center gap-2 px-7 rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 hover:opacity-90 transition-all overflow-hidden"
                >
                  <motion.span
                    className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                    initial={{ x: "-100%" }} animate={{ x: "220%" }}
                    transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
                  />
                  <Upload className="w-4 h-4 relative" />
                  <span className="relative">Get Started Free</span>
                </motion.button>
              </Link>
              <Link href="/papers">
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  className="flex h-11 items-center gap-2 px-7 rounded-xl border border-border bg-card text-sm font-bold text-muted-foreground hover:border-violet-300 hover:text-violet-600 transition-colors"
                >
                  Browse Papers <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>
          </div>

          {/* Closing ornament */}
          <p className="text-xs text-muted-foreground/40 tracking-widest text-center mb-4">
            Built with care for the community ✦
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-border" />
            <BookOpen className="w-4 h-4 text-muted-foreground/30" />
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-border" />
          </div>
        </motion.section>

      </div>
    </div>
  );
}
