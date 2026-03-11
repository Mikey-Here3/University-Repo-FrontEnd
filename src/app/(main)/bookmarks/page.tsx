"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useBookmarks } from "@/hooks/use-papers";
import { PaperCard } from "@/components/papers/paper-card";
import { Pagination } from "@/components/common/pagination";
import { EmptyState } from "@/components/common/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Bookmark } from "lucide-react";

const E = [0.22, 1, 0.36, 1] as const;

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};
const vScale = {
  hidden: { opacity: 0, scale: 0.94, y: 10 },
  show:   { opacity: 1, scale: 1,    y: 0,
            transition: { duration: 0.45, ease: E } },
};

export default function BookmarksPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useBookmarks(page);

  return (
    <div className="space-y-8">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: E }}
        className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-amber-50/60 via-background to-orange-50/40 p-6"
      >
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-amber-400/60 via-orange-400/60 to-amber-400/60" />
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-amber-400/8 blur-3xl pointer-events-none" />
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Bookmark className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground tracking-tight">Bookmarks</h1>
            <p className="text-[13px] text-muted-foreground mt-0.5">
              Papers you&apos;ve saved for later
              {data?.pagination && (
                <span className="ml-1.5 text-muted-foreground/60">
                  · {data.pagination.total} saved
                </span>
              )}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      ) : !data?.data.length ? (
        <EmptyState
          icon={Bookmark}
          title="No bookmarks yet"
          description="Browse papers and click the bookmark icon to save them here for quick access."
          actionLabel="Browse Papers"
          actionHref="/papers"
        />
      ) : (
        <>
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {data.data.map((bm) => (
              <motion.div
                key={bm.id}
                variants={vScale}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <PaperCard paper={bm.paper} />
              </motion.div>
            ))}
          </motion.div>
          {data.pagination && (
            <Pagination pagination={data.pagination} onPageChange={setPage} />
          )}
        </>
      )}
    </div>
  );
}