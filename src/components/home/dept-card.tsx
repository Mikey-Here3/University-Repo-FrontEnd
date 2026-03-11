"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Building2, FileText, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { vScale } from "@/lib/animations";
import { DEPT_PALETTE } from "@/config/home-theme";

type Dept = { id: string; name: string; description?: string; _count?: { papers: number } };

export function DeptCard({ dept, idx }: { dept: Dept; idx: number }) {
  const p = DEPT_PALETTE[idx % DEPT_PALETTE.length];
  return (
    <motion.div variants={vScale} className="h-full">
      <Link href={`/departments/${dept.id}`} className="block h-full group">
        <div className={cn(
          "relative h-full rounded-2xl border bg-gradient-to-br to-white p-5 overflow-hidden",
          "transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-black/5",
          p.from, p.border
        )}>
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute top-4 right-4 text-[10px] font-black text-muted-foreground/20 select-none">
            {String(idx + 1).padStart(2, "0")}
          </div>
          <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3", p.icon)}>
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="font-black text-sm text-foreground mb-2 leading-snug">{dept.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-5 leading-relaxed">
            {dept.description ?? "Explore examination papers from this department."}
          </p>
          {dept._count?.papers != null && (
            <div className="flex items-center gap-2 mb-5">
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <FileText className="w-3 h-3" />{dept._count.papers} papers
              </span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={cn("w-1.5 h-1.5 rounded-full", p.dot)} />
              <span className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-wider">Active</span>
            </div>
            <div className={cn("w-7 h-7 rounded-xl border border-border bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300")}>
              <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}