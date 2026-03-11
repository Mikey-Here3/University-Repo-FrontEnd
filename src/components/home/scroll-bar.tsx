"use client";
import { motion, useScroll, useSpring } from "framer-motion";

/** Thin rainbow progress bar pinned to top of viewport */
export function ScrollBar() {
  const { scrollYProgress } = useScroll();
  const sx = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });
  return (
    <motion.div
      style={{ scaleX: sx, transformOrigin: "left" }}
      className="fixed top-0 inset-x-0 h-[2px] z-[9999] bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-500"
    />
  );
}

/** Mouse-scroll hint shown at bottom of hero */
export function ScrollCue() {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 select-none pointer-events-none"
    >
      <span className="text-[8px] font-black tracking-[0.4em] uppercase text-muted-foreground/50">scroll</span>
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