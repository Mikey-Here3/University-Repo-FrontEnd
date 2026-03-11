"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import type { Pagination as PaginationType } from "@/types";

interface Props {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
}

export function Pagination({ pagination, onPageChange }: Props) {
  const { page, totalPages, hasNext, hasPrev, total } = pagination;
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    const start = Math.max(1, Math.min(page - 2, totalPages - 4));
    return start + i;
  }).filter((p) => p <= totalPages);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5"
    >
      {/* Info */}
      <p className="text-[12px] text-zinc-600">
        Page{" "}
        <span className="font-medium text-zinc-300">{page}</span>
        {" "}of{" "}
        <span className="font-medium text-zinc-300">{totalPages}</span>
        <span className="mx-1.5 text-zinc-700">·</span>
        {total} items
      </p>

      {/* Controls */}
      <div className="flex items-center gap-1.5">
        <NavButton disabled={!hasPrev} onClick={() => onPageChange(page - 1)} aria-label="Previous">
          <ChevronLeft className="h-3.5 w-3.5" />
          <span>Prev</span>
        </NavButton>

        <div className="flex items-center gap-1 px-0.5">
          {pages.map((pageNum) => (
            <PagePill
              key={pageNum}
              pageNum={pageNum}
              isActive={pageNum === page}
              onClick={() => onPageChange(pageNum)}
            />
          ))}
        </div>

        <NavButton disabled={!hasNext} onClick={() => onPageChange(page + 1)} aria-label="Next">
          <span>Next</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </NavButton>
      </div>
    </motion.div>
  );
}

/* Sliding active pill via layoutId */
function PagePill({
  pageNum, isActive, onClick,
}: {
  pageNum: number;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={!isActive ? { scale: 1.1 } : undefined}
      whileTap={{ scale: 0.9 }}
      className="relative flex h-8 w-8 items-center justify-center rounded-lg"
    >
      {isActive && (
        <motion.span
          layoutId="page-pill"
          className="absolute inset-0 rounded-lg bg-white shadow-sm"
          transition={{ type: "spring", damping: 22, stiffness: 300 }}
        />
      )}
      <span
        className={`relative z-10 text-[12px] font-medium transition-colors duration-150 ${
          isActive ? "text-zinc-950 font-semibold" : "text-zinc-500 hover:text-zinc-200"
        }`}
      >
        {pageNum}
      </span>
    </motion.button>
  );
}

function NavButton({
  children, disabled, onClick, "aria-label": ariaLabel,
}: {
  children: ReactNode;
  disabled: boolean;
  onClick: () => void;
  "aria-label": string;
}) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.04 } : undefined}
      whileTap={!disabled ? { scale: 0.95 } : undefined}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="flex h-8 items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-[12px] font-medium text-zinc-500 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-200 disabled:pointer-events-none disabled:opacity-25"
    >
      {children}
    </motion.button>
  );
}