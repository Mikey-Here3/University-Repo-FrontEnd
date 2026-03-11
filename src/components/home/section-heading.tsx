"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { vUp, stagger } from "@/lib/animations";

interface TagProps {
  icon: React.ElementType;
  label: string;
  className?: string;
}
export function Tag({ icon: I, label, className }: TagProps) {
  return (
    <motion.div variants={vUp} className={cn(
      "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full",
      "text-[10px] font-black tracking-[0.14em] uppercase",
      "bg-violet-100 text-violet-700 border border-violet-200",
      className
    )}>
      <I className="w-3 h-3" />{label}
    </motion.div>
  );
}

interface SectionHeadingProps {
  icon: React.ElementType;
  label: string;
  title: React.ReactNode;
  sub: string;
  center?: boolean;
  className?: string;
}
export function SectionHeading({ icon, label, title, sub, center, className }: SectionHeadingProps) {
  return (
    <motion.div
      variants={stagger()} initial="hidden" whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      className={cn(center && "flex flex-col items-center text-center", className)}
    >
      <Tag icon={icon} label={label} />
      <motion.h2 variants={vUp} className={cn(
        "mt-5 font-black tracking-tighter leading-[0.9] text-foreground",
        "text-3xl md:text-4xl lg:text-[2.8rem]",
        center && "max-w-2xl"
      )}>
        {title}
      </motion.h2>
      <motion.p variants={vUp} className={cn(
        "mt-4 text-[15px] text-muted-foreground leading-relaxed",
        center ? "max-w-lg" : "max-w-md"
      )}>
        {sub}
      </motion.p>
    </motion.div>
  );
}