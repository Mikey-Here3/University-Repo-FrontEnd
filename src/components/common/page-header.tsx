"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function PageHeader({ title, description, children }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <motion.div
          initial={{ opacity: 0, x: -14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-3xl font-bold tracking-tight text-white">{title}</h1>

          {/* Animated gradient underline */}
          <motion.div
            className="mt-1.5 h-px bg-gradient-to-r from-zinc-500/60 via-zinc-600/30 to-transparent"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.18, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>

        {description && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14, duration: 0.38, ease: "easeOut" }}
            className="mt-2 text-[13px] leading-relaxed text-zinc-500"
          >
            {description}
          </motion.p>
        )}
      </div>

      {children && (
        <motion.div
          initial={{ opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-3"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}