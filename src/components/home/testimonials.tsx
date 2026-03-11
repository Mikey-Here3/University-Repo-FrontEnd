"use client";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { vScale, stagger } from "@/lib/animations";
import { TESTIMONIALS } from "@/config/home-theme";

export function Testimonials() {
  return (
    <section className="relative py-24 overflow-hidden border-y border-border">
      <div className="absolute inset-0 bg-secondary/20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,hsl(var(--primary)/0.05),transparent)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once: true }} transition={{ duration:0.5 }}
          className="flex items-center gap-3 mb-10 justify-center"
        >
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-border" />
          <span className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground/70">What students say</span>
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-border" />
        </motion.div>

        <motion.div
          variants={stagger(0.1)} initial="hidden" whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={i} variants={vScale}>
              <div className="group relative h-full rounded-2xl bg-card border border-border p-6 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden">
                <Quote className="absolute -top-1 -left-1 w-16 h-16 text-violet-100 -scale-x-100" />
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-[13px] text-muted-foreground leading-relaxed mb-5 font-medium">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-100 to-violet-50 border border-violet-200 flex items-center justify-center text-xs font-black text-violet-600">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-black text-foreground">{t.name}</p>
                    <p className="text-[10px] text-muted-foreground/70">{t.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}