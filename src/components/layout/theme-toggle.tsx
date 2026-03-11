"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved        = localStorage.getItem("theme");
    const prefersDark  = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (saved === "dark" || (!saved && prefersDark)) {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-xl",
        "border border-border bg-card shadow-sm",
        "text-muted-foreground hover:text-foreground",
        "hover:border-primary/40 transition-all duration-200",
      )}
    >
      <AnimatedIcon dark={dark} />
    </motion.button>
  );
}

function AnimatedIcon({ dark }: { dark: boolean }) {
  return (
    <motion.div
      key={dark ? "moon" : "sun"}
      initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
      animate={{ rotate: 0,   opacity: 1, scale: 1   }}
      exit={{    rotate: 30,  opacity: 0, scale: 0.7 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {dark ? (
        <Moon className="h-4 w-4 text-indigo-400" />
      ) : (
        <Sun className="h-4 w-4 text-amber-500" />
      )}
    </motion.div>
  );
}