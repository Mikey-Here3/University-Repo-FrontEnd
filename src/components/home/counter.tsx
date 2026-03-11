"use client";
import { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";

export function Counter({ raw }: { raw: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const iv  = useInView(ref, { once: true, margin: "-40px" });
  const num = parseInt(raw.replace(/\D/g, ""), 10) || 0;
  const sfx = raw.replace(/[\d,]/g, "");
  const [n, sn] = useState(0);

  useEffect(() => {
    if (!iv) return;
    let r: number;
    const t0 = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 4);
    const tick = (now: number) => {
      const p = Math.min((now - t0) / 2000, 1);
      sn(Math.round(ease(p) * num));
      if (p < 1) r = requestAnimationFrame(tick);
    };
    r = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(r);
  }, [iv, num]);

  return <span ref={ref}>{iv ? n.toLocaleString() : 0}{sfx}</span>;
}