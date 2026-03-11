"use client";
import { useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function Magnetic({ children, s = 0.26 }: { children: React.ReactNode; s?: number }) {
  const el  = useRef<HTMLDivElement>(null);
  const mx  = useMotionValue(0); const smx = useSpring(mx, { stiffness: 240, damping: 22 });
  const my  = useMotionValue(0); const smy = useSpring(my, { stiffness: 240, damping: 22 });
  const mov = useCallback((e: React.MouseEvent) => {
    if (!el.current) return;
    const r = el.current.getBoundingClientRect();
    mx.set((e.clientX - r.left - r.width  / 2) * s);
    my.set((e.clientY - r.top  - r.height / 2) * s);
  }, [mx, my, s]);
  const rst = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);
  return (
    <motion.div ref={el} style={{ x: smx, y: smy }} onMouseMove={mov} onMouseLeave={rst}>
      {children}
    </motion.div>
  );
}