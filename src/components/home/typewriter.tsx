"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const WORDS = ["Find Past Papers.", "Ace Your Exams.", "Study Smarter.", "Share Resources.", "Boost Your Grades."];

export function Typewriter() {
  const [wi, sw] = useState(0);
  const [ci, sc] = useState(0);
  const [dl, sd] = useState(false);

  useEffect(() => {
    const w = WORDS[wi];
    if (!dl && ci === w.length) { const t = setTimeout(() => sd(true), 1800); return () => clearTimeout(t); }
    if ( dl && ci === 0)        { sd(false); sw(x => (x + 1) % WORDS.length); return; }
    const t = setTimeout(() => sc(c => c + (dl ? -1 : 1)), dl ? 38 : 72);
    return () => clearTimeout(t);
  }, [ci, dl, wi]);

  return (
    <>
      {WORDS[wi].slice(0, ci)}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.52, repeat: Infinity, repeatType: "reverse" }}
        className="inline-block w-[3px] h-[0.85em] bg-violet-500 rounded-full ml-1 align-middle"
      />
    </>
  );
}