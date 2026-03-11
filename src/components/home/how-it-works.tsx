"use client";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { vUp, stagger, EASE } from "@/lib/animations";
import { STEPS } from "@/config/home-theme";
import { SectionHeading } from "./section-heading";

const GT = ({ children }: { children: React.ReactNode }) => (
  <span className="gradient-text">{children}</span>
);

export function HowItWorks() {
  return (
    <section className="relative py-32 overflow-hidden bg-background">
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage:"repeating-linear-gradient(45deg,hsl(var(--foreground)/0.4) 0,hsl(var(--foreground)/0.4) 1px,transparent 0,transparent 50%)",
        backgroundSize:"20px 20px",
      }} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          icon={Sparkles} label="How It Works"
          title={<>Four steps to <GT>exam readiness</GT></>}
          sub="From search to download in under 30 seconds. No friction, no barriers, no paywalls."
          center className="mb-20"
        />
        <div className="relative">
          {/* Desktop connector line */}
          <div className="hidden lg:block absolute top-[50px] left-[calc(12.5%+40px)] right-[calc(12.5%+40px)] h-px">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-border to-transparent" />
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-violet-500"
              animate={{ left: ["0%","100%","0%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <motion.div
            variants={stagger(0.14)} initial="hidden" whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {STEPS.map((s, i) => (
              <motion.div key={i} variants={vUp} className="flex flex-col items-center text-center group">
                <div className="relative mb-6">
                  <div className="relative w-[72px] h-[72px] rounded-2xl bg-gradient-to-br from-violet-100 to-violet-50 border border-violet-200 flex items-center justify-center shadow-lg shadow-violet-100 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-2">
                    <s.icon className="w-7 h-7 text-violet-600" />
                  </div>
                  <div className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center shadow-sm">
                    <span className="text-[8px] font-black text-violet-600">{s.n}</span>
                  </div>
                </div>
                <h3 className="font-black text-base text-foreground mb-2.5 group-hover:text-violet-600 transition-colors duration-200">
                  {s.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}