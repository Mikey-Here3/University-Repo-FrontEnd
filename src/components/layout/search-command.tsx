"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { paperService } from "@/services/paper.service";
import { Badge } from "@/components/ui/badge";
import { CONTENT_TYPE_LABELS } from "@/types";
import { getContentTypeColor, cn } from "@/lib/utils";
import { Search, FileText, Loader2, ArrowRight, Hash } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchCommand({ open, onOpenChange }: Props) {
  const router   = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query,    setQuery]    = useState("");
  const [debounced, setDebounced] = useState("");

  /* Debounce */
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  /* Body scroll lock */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  /* Auto-focus */
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 60);
    else setQuery("");
  }, [open]);

  /* ⌘K shortcut */
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [open, onOpenChange]);

  const { data, isLoading } = useQuery({
    queryKey: ["search-preview", debounced],
    queryFn:  () => paperService.getAll({ search: debounced, limit: 6 }),
    enabled:  debounced.length >= 2,
  });

  const handleSelect = (paperId: string) => {
    onOpenChange(false);
    setQuery("");
    router.push(`/papers/${paperId}`);
  };

  const handleFullSearch = () => {
    onOpenChange(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setQuery("");
  };

  const hasResults = (data?.data?.length ?? 0) > 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="sc-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 bg-foreground/25 backdrop-blur-[6px]"
            onClick={() => onOpenChange(false)}
          />

          {/* Panel wrapper */}
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[13vh] px-4 pointer-events-none">
            <motion.div
              key="sc-panel"
              initial={{ opacity: 0, scale: 0.9, y: -20, filter: "blur(8px)" }}
              animate={{ opacity: 1, scale: 1, y: 0,   filter: "blur(0px)" }}
              exit={{   opacity: 0, scale: 0.93, y: -10, filter: "blur(4px)" }}
              transition={{ type: "spring", damping: 28, stiffness: 320, mass: 0.7 }}
              className="w-full max-w-xl pointer-events-auto"
            >
              <div className="relative overflow-hidden rounded-2xl border border-border bg-background shadow-2xl shadow-foreground/10">

                {/* Top accent */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

                {/* Input row */}
                <div className="flex items-center gap-3 border-b border-border px-4 h-14">
                  <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                  <input
                    ref={inputRef}
                    className="flex-1 bg-transparent text-foreground text-[15px] placeholder:text-muted-foreground/50 outline-none"
                    placeholder="Search papers, courses, departments..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && query) handleFullSearch();
                      if (e.key === "Escape") onOpenChange(false);
                    }}
                  />
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground shrink-0" />
                  ) : (
                    <kbd className="text-[11px] bg-muted border border-border px-1.5 py-0.5 rounded text-muted-foreground">
                      ESC
                    </kbd>
                  )}
                </div>

                {/* Results area */}
                <div className="max-h-[380px] overflow-y-auto overscroll-contain">

                  {/* Idle */}
                  {debounced.length < 2 ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-muted">
                        <Hash className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="text-center">
                        <p className="text-[13px] text-foreground">Type to search</p>
                        <p className="text-[12px] text-muted-foreground mt-1">
                          Papers, courses, departments and more
                        </p>
                      </div>
                    </div>

                  /* No results */
                  ) : !hasResults && !isLoading ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-2">
                      <p className="text-[13px] text-muted-foreground">
                        No results for{" "}
                        <span className="text-foreground font-medium">
                          &ldquo;{debounced}&rdquo;
                        </span>
                      </p>
                      <p className="text-[12px] text-muted-foreground/60">
                        Try a different search term
                      </p>
                    </div>

                  /* Results */
                  ) : (
                    <div className="p-2">
                      <p className="px-3 pt-1 pb-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground/60">
                        Papers
                      </p>
                      {data?.data.map((paper, i) => (
                        <motion.button
                          key={paper.id}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.035, duration: 0.2 }}
                          onClick={() => handleSelect(paper.id)}
                          className="group w-full flex items-start gap-3 p-3 rounded-xl hover:bg-muted transition-colors text-left"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card group-hover:border-primary/30 transition-colors mt-0.5">
                            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[13px] font-medium text-foreground truncate">
                              {paper.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <Badge
                                variant="secondary"
                                className={cn(
                                  "text-[10px] h-4 px-1.5 rounded",
                                  getContentTypeColor(paper.contentType),
                                )}
                              >
                                {CONTENT_TYPE_LABELS[paper.contentType]}
                              </Badge>
                              <span className="text-[11px] text-muted-foreground">
                                {paper.course.name}
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all shrink-0 mt-0.5" />
                        </motion.button>
                      ))}

                      {/* View all */}
                      <button
                        onClick={handleFullSearch}
                        className="group w-full flex items-center justify-center gap-2 mt-1 p-3 rounded-xl text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        View all results for &ldquo;{debounced}&rdquo;
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Footer hints */}
                <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
                  <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                    {[
                      { key: "↑↓", label: "Navigate" },
                      { key: "↵",  label: "Open"     },
                      { key: "ESC", label: "Close"   },
                    ].map(({ key, label }) => (
                      <span key={key} className="flex items-center gap-1.5">
                        <kbd className="bg-muted border border-border px-1.5 py-0.5 rounded text-[10px] font-mono">
                          {key}
                        </kbd>
                        {label}
                      </span>
                    ))}
                  </div>
                  <span className="text-[11px] text-muted-foreground/50">StudyHouse</span>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
