"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { vScale, stagger } from "@/lib/animations";
import { CATEGORIES, ACCENT } from "@/config/home-theme";

export function CategoryStrip() {
  return (
    <section className="relative py-20 overflow-hidden bg-secondary/20 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-10"
        >
          <span className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground/70">
            Browse by category
          </span>
          <Link href="/departments">
            <button className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </motion.div>

        <motion.div
          variants={stagger(0.07)} initial="hidden" whileInView="show"
          viewport={{ once: true, margin: "-30px" }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
        >
          {CATEGORIES.map((c, i) => {
            const a = ACCENT[c.accent];
            return (
              <motion.div key={i} variants={vScale}>
                <Link href="/departments">
                  <div className={cn(
                    "group flex flex-col items-center gap-3 p-5 rounded-2xl border cursor-pointer",
                    "transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg",
                    a.bg, a.border, a.shadow
                  )}>
                    <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3", a.bg, a.text)}>
                      <c.icon className="w-5 h-5" />
                    </div>
                    <div className="text-center">
                      <p className={cn("text-xs font-black text-foreground transition-colors", a.hover)}>{c.label}</p>
                      <p className="text-[10px] text-muted-foreground/70 mt-0.5">{c.count} papers</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}