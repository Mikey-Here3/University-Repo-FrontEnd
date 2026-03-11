"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Info, Loader2, X } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  variant?: "default" | "destructive";
  onConfirm: () => void;
  loading?: boolean;
}

/* ─── Animation Variants ──────────────────────────────────────── */

const backdropVariants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.22, ease: "easeOut" } } as const,
  exit:   { opacity: 0, transition: { duration: 0.18, ease: "easeIn", delay: 0.04 } } as const,
};

const panelVariants = {
  hidden: { opacity: 0, scale: 0.88, y: 20, filter: "blur(8px)" },
  show: {
    opacity: 1, scale: 1, y: 0, filter: "blur(0px)",
    transition: { type: "spring", damping: 26, stiffness: 310, mass: 0.85 },
  } as const,
  exit: {
    opacity: 0, scale: 0.92, y: 10, filter: "blur(4px)",
    transition: { duration: 0.18, ease: "easeIn" },
  } as const, 
};

const iconVariants = {
  hidden: { scale: 0, rotate: -30, opacity: 0 },
  show: {
    scale: 1, rotate: 0, opacity: 1,
    transition: { type: "spring", damping: 13, stiffness: 220, delay: 0.18 },
  } as const,
};

/* staggered children factory */
const child = (i: number) => ({
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1, y: 0,
    transition: { delay: 0.12 + i * 0.055, duration: 0.26, ease: "easeOut" } as const,
  },
});

/* ─── Component ───────────────────────────────────────────────── */

export function ConfirmDialog({
  open, onOpenChange, title, description,
  confirmLabel = "Confirm", variant = "destructive", onConfirm, loading,
}: Props) {
  const isDestructive = variant === "destructive";

  /* lock body scroll */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  /* escape key */
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open && !loading) onOpenChange(false);
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [open, loading, onOpenChange]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* ── Backdrop ──────────────────────────────────────── */}
          <motion.div
            key="cd-backdrop"
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-[6px]"
            variants={backdropVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            onClick={() => !loading && onOpenChange(false)}
          />

          {/* ── Dialog Wrapper ────────────────────────────────── */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cd-title"
            aria-describedby="cd-desc"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <motion.div
              key="cd-panel"
              className="relative w-full max-w-[420px] pointer-events-auto"
              variants={panelVariants}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              {/* ── Card ──────────────────────────────────────── */}
              <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-zinc-950 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.04)]">

                {/* top-edge color line */}
                <div
                  className={`absolute inset-x-0 top-0 h-px ${
                    isDestructive
                      ? "bg-gradient-to-r from-transparent via-red-500/70 to-transparent"
                      : "bg-gradient-to-r from-transparent via-blue-500/70 to-transparent"
                  }`}
                />

                {/* ambient radial glow */}
                <div
                  className={`pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full blur-3xl ${
                    isDestructive ? "bg-red-600/[0.14]" : "bg-blue-600/[0.14]"
                  }`}
                />

                {/* subtle dot-grid texture */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.018]"
                  style={{
                    backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                    backgroundSize: "18px 18px",
                  }}
                />

                <div className="relative px-6 pt-5 pb-6">

                  {/* ── Close Button ──────────────────────────── */}
                  <motion.button
                    whileHover={{ scale: 1.12, backgroundColor: "rgba(255,255,255,0.06)" }}
                    whileTap={{ scale: 0.88 }}
                    onClick={() => !loading && onOpenChange(false)}
                    disabled={loading}
                    className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-lg text-zinc-600 transition-colors disabled:pointer-events-none disabled:opacity-40"
                    aria-label="Close"
                  >
                    <X size={14} strokeWidth={2.5} />
                  </motion.button>

                  {/* ── Icon + Title + Description ────────────── */}
                  <div className="flex gap-4 mb-5">

                    {/* icon badge */}
                    <motion.div
                      variants={iconVariants}
                      initial="hidden"
                      animate="show"
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ${
                        isDestructive
                          ? "bg-red-500/[0.08] text-red-400 ring-red-500/20"
                          : "bg-blue-500/[0.08] text-blue-400 ring-blue-500/20"
                      }`}
                    >
                      {isDestructive
                        ? <AlertTriangle size={18} strokeWidth={1.75} />
                        : <Info          size={18} strokeWidth={1.75} />
                      }
                    </motion.div>

                    <div className="flex-1 pt-0.5">
                      <motion.h2
                        id="cd-title"
                        variants={child(0)}
                        initial="hidden"
                        animate="show"
                        className="text-[15px] font-semibold leading-snug text-white mb-1.5"
                      >
                        {title}
                      </motion.h2>
                      <motion.p
                        id="cd-desc"
                        variants={child(1)}
                        initial="hidden"
                        animate="show"
                        className="text-[13px] leading-[1.65] text-zinc-400"
                      >
                        {description}
                      </motion.p>
                    </div>
                  </div>

                  {/* ── Divider ───────────────────────────────── */}
                  <motion.div
                    variants={child(2)}
                    initial="hidden"
                    animate="show"
                    className="mb-5 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent"
                  />

                  {/* ── Actions ───────────────────────────────── */}
                  <motion.div
                    variants={child(3)}
                    initial="hidden"
                    animate="show"
                    className="flex items-center justify-end gap-2.5"
                  >
                    {/* Cancel */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => onOpenChange(false)}
                      disabled={loading}
                      className="h-9 px-4 rounded-xl text-[13px] font-medium text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:bg-white/[0.04] hover:text-zinc-200 transition-all duration-150 disabled:pointer-events-none disabled:opacity-50"
                    >
                      Cancel
                    </motion.button>

                    {/* Confirm */}
                    <motion.button
                      whileHover={!loading ? { scale: 1.025 } : undefined}
                      whileTap={!loading   ? { scale: 0.975 } : undefined}
                      onClick={onConfirm}
                      disabled={loading}
                      className={`relative h-9 min-w-[104px] overflow-hidden rounded-xl text-[13px] font-semibold text-white shadow-lg transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-75 ${
                        isDestructive
                          ? "bg-red-600 hover:bg-red-500 shadow-red-950/60"
                          : "bg-blue-600 hover:bg-blue-500 shadow-blue-950/60"
                      }`}
                    >
                      {/* shimmer sweep on idle */}
                      {!loading && (
                        <motion.span
                          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.13] to-transparent"
                          initial={{ x: "-100%" }}
                          animate={{ x: "220%" }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 3,
                            ease: "easeInOut",
                          }}
                        />
                      )}

                      {/* loading ↔ label crossfade */}
                      <AnimatePresence mode="wait">
                        {loading ? (
                          <motion.span
                            key="loading"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{   opacity: 0, y: -5 }}
                            transition={{ duration: 0.14 }}
                            className="flex items-center justify-center gap-1.5 px-4"
                          >
                            <Loader2 size={13} className="animate-spin" />
                            Processing…
                          </motion.span>
                        ) : (
                          <motion.span
                            key="label"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{   opacity: 0, y: -5 }}
                            transition={{ duration: 0.14 }}
                            className="flex items-center justify-center px-4"
                          >
                            {confirmLabel}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>

                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}