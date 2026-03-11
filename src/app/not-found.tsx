"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, FileSearch, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-950 px-4">

      {/* ── Background ──────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/[0.08] blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 h-72 w-72 rounded-full bg-indigo-600/[0.07] blur-3xl" />
        <div className="absolute inset-0 opacity-[0.018] bg-dot-grid" />
        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950" />
      </div>

      {/* ── Logo ────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="absolute left-1/2 top-8 -translate-x-1/2"
      >
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-zinc-900 transition-all group-hover:border-white/[0.12]">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/[0.05] to-transparent" />
            <GraduationCap className="relative h-5 w-5 text-zinc-300" />
          </div>
          <span className="text-[15px] font-semibold text-white">
            Uni<span className="text-zinc-500">Resources</span>
          </span>
        </Link>
      </motion.div>

      {/* ── Content ─────────────────────────────────────────── */}
      <div className="relative flex flex-col items-center text-center">

        {/* Ghost 404 text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="pointer-events-none select-none"
          aria-hidden
        >
          <span className="text-[160px] md:text-[220px] font-black leading-none bg-gradient-to-b from-zinc-800/80 to-zinc-900 bg-clip-text text-transparent">
            404
          </span>
        </motion.div>

        {/* Floating icon — sits over the ghost text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.4, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", damping: 16, stiffness: 200, delay: 0.1 }}
          className="absolute top-1/2 -translate-y-1/2"
        >
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 shadow-[0_24px_64px_rgba(0,0,0,0.6)]">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent" />
            <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
            <FileSearch className="relative h-9 w-9 text-zinc-400" />
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="mt-5"
        >
          <h1 className="text-2xl font-bold text-white">Page not found</h1>
          <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-zinc-500">
            The page you&apos;re looking for doesn&apos;t exist or may have been moved.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-3"
        >
          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 h-10 px-6 rounded-xl bg-white text-[13px] font-semibold text-zinc-950 hover:bg-zinc-100 transition-colors"
            >
              <Home className="h-4 w-4" />
              Go to Dashboard
            </motion.button>
          </Link>
          <Link href="/papers">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 h-10 px-6 rounded-xl border border-zinc-800 bg-zinc-900 text-[13px] font-medium text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Browse Papers
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}