"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  GraduationCap, BookOpen, Building2, Mail, LogIn,
  UserPlus, Upload, Github, Twitter, Linkedin, ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── data ───────────────────────────────────────────────────── */
const quickLinks = [
  { label: "Browse Papers", href: "/papers",      icon: BookOpen  },
  { label: "Departments",   href: "/departments",  icon: Building2 },
  { label: "About Us",      href: "/about",        icon: null      },
  { label: "Contact",       href: "/contact",      icon: Mail      },
];

const accountLinks = [
  { label: "Login",         href: "/login",        icon: LogIn     },
  { label: "Register",      href: "/register",     icon: UserPlus  },
  { label: "Upload Paper",  href: "/upload",       icon: Upload    },
];

const socials = [
  { icon: Github,   href: "#", label: "GitHub"   },
  { icon: Twitter,  href: "#", label: "Twitter"  },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

/* ─── animation variants ─────────────────────────────────────── */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
  show: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  } as const,
};

/* ─── component ──────────────────────────────────────────────── */
export function Footer() {
  const ref    = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <footer
      ref={ref}
      className="relative overflow-hidden border-t border-border bg-card"
    >
      {/* ── Top accent line ── */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      {/* ── Subtle ambient fill ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {/* Soft radial under content */}
        <div
          className="absolute -bottom-24 left-1/2 h-80 w-[600px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, hsl(var(--primary)/0.06), transparent 70%)" }}
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: "radial-gradient(circle, hsl(var(--foreground)/0.06) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
      </div>

      <div className="relative container mx-auto px-4 pt-14 pb-8">

        {/* ── Main grid ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid grid-cols-1 gap-10 md:grid-cols-4 lg:gap-14"
        >

          {/* ── Brand column ── */}
          <motion.div variants={fadeUp} className="md:col-span-2">

            {/* Logo */}
            <Link href="/" className="group mb-5 inline-flex items-center gap-3">
              <div className={cn(
                "relative flex h-10 w-10 items-center justify-center rounded-xl",
                "border border-border bg-background shadow-sm",
                "transition-all duration-200",
                "group-hover:border-primary/30 group-hover:shadow-md",
              )}>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-primary/5 to-transparent" />
                <GraduationCap className="relative h-5 w-5 text-primary" />
              </div>
              <span className="text-[15px] font-bold tracking-tight text-foreground">
                Uni<span className="text-muted-foreground">Resources</span>
              </span>
            </Link>

            {/* Tagline */}
            <p className="mb-6 max-w-xs text-[13px] leading-[1.8] text-muted-foreground">
              A university academic resource repository where students share and
              access past papers, notes, assignments, and more.
            </p>

            {/* Open badge */}
            <div className={cn(
              "mb-6 inline-flex items-center gap-2 rounded-full",
              "border border-border bg-background px-3 py-1.5 shadow-sm",
            )}>
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              <span className="text-[11px] font-medium text-muted-foreground">
                Open for contributions
              </span>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-2">
              {socials.map(({ icon: SocialIcon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ scale: 1.12, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg",
                    "border border-border bg-background text-muted-foreground",
                    "transition-all duration-150",
                    "hover:border-primary/40 hover:bg-primary/5 hover:text-primary",
                  )}
                >
                  <SocialIcon className="h-3.5 w-3.5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* ── Quick links ── */}
          <motion.div variants={fadeUp}>
            <h4 className="mb-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="group flex items-center gap-2 text-[13px] text-muted-foreground transition-all duration-150 hover:text-foreground"
                  >
                    <span className="h-px w-3 rounded-full bg-border transition-all duration-200 group-hover:w-5 group-hover:bg-primary" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── Account links ── */}
          <motion.div variants={fadeUp}>
            <h4 className="mb-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
              Account
            </h4>
            <ul className="space-y-3">
              {accountLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="group flex items-center gap-2 text-[13px] text-muted-foreground transition-all duration-150 hover:text-foreground"
                  >
                    <span className="h-px w-3 rounded-full bg-border transition-all duration-200 group-hover:w-5 group-hover:bg-primary" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* ── Divider ── */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={inView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          style={{ originX: 0 }}
          className="my-8 h-px bg-gradient-to-r from-border via-border/50 to-transparent"
        />

        {/* ── Bottom bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.4, ease: "easeOut" }}
          className="flex flex-col items-center justify-between gap-4 sm:flex-row"
        >
          <p className="text-[12px] text-muted-foreground">
            © {new Date().getFullYear()} UniResources. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            {["Privacy Policy", "Terms of Service"].map((item) => (
              <Link
                key={item}
                href="#"
                className="group flex items-center gap-1 text-[12px] text-muted-foreground transition-colors duration-150 hover:text-foreground"
              >
                {item}
                <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </motion.div>

      </div>

      {/* ── Bottom accent line ── */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </footer>
  );
}