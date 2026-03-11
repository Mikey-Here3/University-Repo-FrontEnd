"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  show: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  } as const,
};

export function EmptyState({
  icon: Icon, title, description, actionLabel, actionHref, onAction,
}: Props) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="relative flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      {/* Ambient bg glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="h-72 w-72 rounded-full bg-zinc-800/20 blur-3xl" />
      </div>

      {/* Icon */}
      <motion.div variants={fadeUp} className="mb-7">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          className="relative"
        >
          {/* Ping ring */}
          <motion.span
            className="absolute inset-0 rounded-2xl border border-zinc-700/40"
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: 1.2 }}
          />
          {/* Card */}
          <div className="relative flex h-[72px] w-[72px] items-center justify-center rounded-2xl border border-white/[0.06] bg-zinc-900 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent" />
            <Icon className="relative h-8 w-8 text-zinc-400" />
          </div>
        </motion.div>
      </motion.div>

      <motion.h3
        variants={fadeUp}
        className="text-[17px] font-semibold tracking-tight text-white"
      >
        {title}
      </motion.h3>

      <motion.p
        variants={fadeUp}
        className="mt-2.5 max-w-xs text-[13px] leading-[1.7] text-zinc-500"
      >
        {description}
      </motion.p>

      {actionLabel && (
        <motion.div variants={fadeUp} className="mt-8">
          {actionHref ? (
            <Link href={actionHref}><PremiumButton label={actionLabel} /></Link>
          ) : (
            <PremiumButton label={actionLabel} onClick={onAction} />
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

function PremiumButton({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="relative h-9 overflow-hidden rounded-xl bg-white px-5 text-[13px] font-semibold text-zinc-950 shadow-[0_4px_20px_rgba(255,255,255,0.07)]"
    >
      {/* shimmer */}
      <motion.span
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-zinc-300/40 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: "220%" }}
        transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 2.8, ease: "easeInOut" }}
      />
      {label}
    </motion.button>
  );
}