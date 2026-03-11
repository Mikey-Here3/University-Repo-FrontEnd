"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useMyUploads, useDeletePaper } from "@/hooks/use-papers";
import { PaperCard } from "@/components/papers/paper-card";
import { Pagination } from "@/components/common/pagination";
import { EmptyState } from "@/components/common/empty-state";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Upload, FileText, Trash2 } from "lucide-react";

const E = [0.22, 1, 0.36, 1] as const;

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};
const vScale = {
  hidden: { opacity: 0, scale: 0.94, y: 10 },
  show:   { opacity: 1, scale: 1,    y: 0,
            transition: { duration: 0.42, ease: E } },
};

export default function MyUploadsPage() {
  const [page,     setPage]     = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data, isLoading }                   = useMyUploads(page);
  const { mutate: deletePaper, isPending: deleting } = useDeletePaper();

  return (
    <div className="space-y-8">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: E }}
        className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-violet-50/40 p-6"
      >
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary via-violet-400 to-indigo-400 opacity-70" />
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-primary/6 blur-3xl pointer-events-none" />

        <div className="relative flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-foreground tracking-tight">My Uploads</h1>
              <p className="text-[13px] text-muted-foreground mt-0.5">
                Papers you&apos;ve uploaded
                {data?.pagination && (
                  <span className="ml-1.5 text-muted-foreground/60">
                    · {data.pagination.total} total
                  </span>
                )}
              </p>
            </div>
          </div>

          <Link href="/upload">
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 h-9 px-4 rounded-xl bg-primary text-primary-foreground text-[13px] font-semibold shadow-sm shadow-primary/20 hover:bg-primary/90 transition-colors shrink-0"
            >
              <Upload className="h-3.5 w-3.5" /> Upload New
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      ) : !data?.data.length ? (
        <EmptyState
          icon={FileText}
          title="No uploads yet"
          description="You haven't uploaded any papers yet. Share your academic resources with fellow students!"
          actionLabel="Upload Your First Paper"
          actionHref="/upload"
        />
      ) : (
        <>
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            <AnimatePresence>
              {data.data.map((paper) => (
                <motion.div
                  key={paper.id}
                  variants={vScale}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="relative group"
                >
                  <PaperCard paper={paper} showStatus />

                  {/* Delete overlay button */}
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.92 }}
                    className="absolute top-3 right-3 h-8 w-8 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-500 hover:bg-red-100 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm"
                    onClick={(e) => { e.preventDefault(); setDeleteId(paper.id); }}
                    title="Delete paper"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {data.pagination && (
            <Pagination pagination={data.pagination} onPageChange={setPage} />
          )}
        </>
      )}

      {/* Confirm delete */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => { if (!open) setDeleteId(null); }}
        title="Delete this paper?"
        description="This will permanently remove the paper and its file. This action cannot be undone."
        confirmLabel="Delete Paper"
        loading={deleting}
        onConfirm={() => {
          if (deleteId) deletePaper(deleteId, { onSuccess: () => setDeleteId(null) });
        }}
      />
    </div>
  );
}