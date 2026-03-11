"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="scroll-top"
          initial={{ opacity: 0, scale: 0.4, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.4, y: 20 }}
          transition={{ type: "spring", damping: 18, stiffness: 300 }}
          whileHover={{ scale: 1.14, y: -3 }}
          whileTap={{ scale: 0.88 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-zinc-900 text-zinc-300 shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
        >
          {/* Pulse ring */}
          <motion.span
            className="pointer-events-none absolute inset-0 rounded-xl border border-zinc-700/50"
            animate={{ scale: [1, 1.55], opacity: [0.5, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
          />
          {/* Top edge accent */}
          <span className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-xl bg-gradient-to-r from-transparent via-zinc-600/60 to-transparent" />
          <ArrowUp className="relative h-4 w-4" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}