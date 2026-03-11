"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import type { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color?: string;
  loading?: boolean;
}

/* Count-up hook */
function useCountUp(end: number, duration = 1.4, enabled = true) {
  const [count, setCount] = useState(0);
const raf = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (!enabled) return;
    setCount(0);
    let start: number | null = null;

    const tick = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);     // ease-out cubic
      setCount(Math.round(eased * end));
      if (progress < 1) raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [end, duration, enabled]);

  return count;
}

export function StatsCard({
  label, value, icon: Icon, color = "text-primary", loading,
}: Props) {
  const isNum = typeof value === "number";
  const counted = useCountUp(isNum ? (value as number) : 0, 1.4, isNum && !loading);
  const display = isNum ? counted.toLocaleString() : value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.2, ease: "easeOut" } }}
      className="group relative cursor-default overflow-hidden rounded-2xl border border-white/[0.06] bg-zinc-950 p-5 shadow-[0_4px_24px_rgba(0,0,0,0.45)]"
    >
      {/* Top edge accent */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-700/60 to-transparent" />

      {/* Hover shimmer */}
      <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-b from-white/[0.025] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex items-center gap-4">
        {/* Icon */}
        <motion.div
          whileHover={{ rotate: [0, -12, 12, -4, 0] }}
          transition={{ duration: 0.5 }}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.05] bg-zinc-900 ${color}`}
        >
          <Icon className="h-[18px] w-[18px]" />
        </motion.div>

        {/* Text */}
        <div className="min-w-0">
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-7 w-20 rounded-lg bg-zinc-800" />
              <Skeleton className="h-2.5 w-14 rounded-full bg-zinc-800/70" />
            </div>
          ) : (
            <>
              <p className="text-2xl font-bold tabular-nums tracking-tight text-white">
                {display}
              </p>
              <p className="mt-0.5 text-[11px] font-medium uppercase tracking-widest text-zinc-600">
                {label}
              </p>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}