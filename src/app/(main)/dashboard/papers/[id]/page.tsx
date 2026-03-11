"use client";

import { use } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { paperService } from "@/services/paper.service";
import { useAuthStore } from "@/store/auth-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/common/empty-state";
import { BookmarkButton } from "@/components/papers/bookmark-button";
import { RatingStars } from "@/components/papers/rating-stars";
import { CommentSection } from "@/components/papers/comment-section";
import { ReportModal } from "@/components/papers/report-modal";
import { CONTENT_TYPE_LABELS } from "@/types";
import { getContentTypeColor, getStatusColor, formatDate, cn } from "@/lib/utils";
import {
  ArrowLeft, Download, FileText, Calendar, User,
  BookOpen, GraduationCap, Eye, Building2, Tag,
  Clock, Star, MessageSquare, Bookmark, Hash,
} from "lucide-react";

const E = [0.22, 1, 0.36, 1] as const;

/* ─── Skeleton ───────────────────────────────────────────────── */
function PaperDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
      <Skeleton className="h-9 w-36 rounded-xl" />
      <Card className="overflow-hidden">
        <div className="h-[2px] bg-muted" />
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-2">
                {[24, 20, 16].map((w) => (
                  <Skeleton key={w} className={`h-6 w-${w} rounded-full`} />
                ))}
              </div>
              <div className="space-y-2">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-8 w-1/2" />
              </div>
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Skeleton className="h-10 w-32 rounded-xl" />
              <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-muted/40">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-xl shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-3 w-14" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-3.5 w-3.5 rounded" />
                <Skeleton className="h-4 w-28" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-[480px] w-full rounded-xl" />
        </CardContent>
      </Card>
    </div>
  );
}

/* ─── MetaItem ───────────────────────────────────────────────── */
function MetaItem({ icon: Icon, label, value }: {
  icon: React.ElementType; label: string; value?: string | number | null;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
        <p className="text-sm font-semibold text-foreground truncate">{value ?? "N/A"}</p>
      </div>
    </div>
  );
}

/* ─── DetailItem ─────────────────────────────────────────────── */
function DetailItem({ icon: Icon, label, value }: {
  icon: React.ElementType; label: string; value?: string | number | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
      <span>
        <span className="font-medium text-foreground">{label}:</span> {value}
      </span>
    </div>
  );
}

/* ─── StatBadge ──────────────────────────────────────────────── */
function StatBadge({ icon: Icon, value, label }: {
  icon: React.ElementType; value: string | number; label: string;
}) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Icon className="h-3.5 w-3.5" />
      <span className="font-semibold text-foreground">{value}</span>
      <span>{label}</span>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function PaperDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id }              = use(params);
  const { isAuthenticated } = useAuthStore();

  const { data: paper, isLoading, isError } = useQuery({
    queryKey: ["paper", id],
    queryFn:  () => paperService.getById(id),
    enabled:  !!id,
  });

  const handleDownload = async () => {
    if (!paper) return;
    try { await paperService.download(paper.id); } catch { /* handled */ }
  };

  if (isLoading) return <PaperDetailSkeleton />;

  if (isError || !paper) {
    return (
      <div className="max-w-4xl mx-auto">
        <EmptyState
          icon={FileText}
          title="Paper not found"
          description="This paper may have been removed or doesn't exist."
          actionLabel="Browse Papers"
          actionHref="/papers"
        />
      </div>
    );
  }

  const isPdf    = paper.fileUrl?.toLowerCase().includes(".pdf");
  const isImage  = paper.fileUrl?.match(/\.(png|jpg|jpeg|gif|webp)$/i);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: E }}
      className="max-w-4xl mx-auto space-y-5"
    >
      {/* Back */}
      <Link href="/papers">
        <motion.button
          whileHover={{ x: -3 }} whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 h-9 px-3 rounded-xl border border-border bg-card shadow-sm text-[13px] font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Papers
        </motion.button>
      </Link>

      {/* ── Header Card ── */}
      <Card className="overflow-hidden border-border shadow-sm">
        <div className="h-[2px] bg-gradient-to-r from-primary via-violet-400 to-indigo-400 opacity-80" />

        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
            <div className="space-y-3 flex-1 min-w-0">

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className={cn(
                  "px-2.5 py-0.5 rounded-full text-[11px] font-semibold border",
                  getContentTypeColor(paper.contentType),
                )}>
                  {CONTENT_TYPE_LABELS[paper.contentType]}
                </span>
                <span className={cn(
                  "px-2.5 py-0.5 rounded-full text-[11px] font-semibold border",
                  getStatusColor(paper.status),
                )}>
                  {paper.status}
                </span>
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-border bg-muted text-muted-foreground">
                  <Calendar className="h-3 w-3" /> {paper.year}
                </span>
              </div>

              {/* Title */}
              <CardTitle className="text-2xl md:text-3xl leading-tight text-foreground">
                {paper.title}
              </CardTitle>

              {paper.description && (
                <p className="text-muted-foreground leading-relaxed text-[14px]">
                  {paper.description}
                </p>
              )}

              {/* Quick stats */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <StatBadge icon={Download}      value={paper.downloads ?? 0}            label="downloads" />
                {paper.ratingAverage != null && (
                  <StatBadge icon={Star}        value={paper.ratingAverage.toFixed(1)}  label={`(${paper.ratingCount})`} />
                )}
                {paper._count?.comments != null && (
                  <StatBadge icon={MessageSquare} value={paper._count.comments}         label="comments" />
                )}
                {paper._count?.bookmarks != null && (
                  <StatBadge icon={Bookmark}    value={paper._count.bookmarks}          label="saved" />
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 shrink-0">
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={handleDownload}
                className="flex items-center gap-2 h-10 px-5 rounded-xl bg-primary text-primary-foreground text-[13px] font-semibold hover:bg-primary/90 shadow-sm shadow-primary/20 transition-colors"
              >
                <Download className="h-4 w-4" /> Download
              </motion.button>
              {isAuthenticated && (
                <>
                  <BookmarkButton paperId={paper.id} />
                  <ReportModal paperId={paper.id} />
                </>
              )}
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-5 space-y-5">
          {/* Meta grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/40 rounded-2xl border border-border/50">
            <MetaItem icon={BookOpen}     label="Course"      value={paper.course?.name}        />
            <MetaItem icon={GraduationCap} label="Program"   value={paper.program?.name}        />
            <MetaItem icon={Building2}    label="Department"  value={paper.department?.name}     />
            <MetaItem icon={User}         label="Uploaded by" value={paper.uploadedBy?.name}     />
          </div>

          {/* Detail rows */}
          <div className="flex flex-wrap gap-x-6 gap-y-2.5">
            <DetailItem icon={User}     label="Teacher"  value={paper.teacherName}                             />
            <DetailItem icon={Hash}     label="Semester" value={paper.semester}                                />
            <DetailItem icon={FileText} label="Type"     value={paper.fileType?.toUpperCase()}                 />
            <DetailItem icon={Eye}      label="Size"     value={paper.fileSize ? `${(paper.fileSize / 1024 / 1024).toFixed(2)} MB` : null} />
            <DetailItem icon={Clock}    label="Uploaded" value={formatDate(paper.createdAt)}                   />
          </div>

          {/* Tags */}
          {paper.tags?.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <Tag className="h-3.5 w-3.5 text-muted-foreground" />
              {paper.tags.map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-xs font-normal rounded-full">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Preview ── */}
      <Card className="overflow-hidden border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2 text-foreground">
            <Eye className="h-4 w-4 text-muted-foreground" />
            Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isPdf ? (
            <iframe
              src={paper.fileUrl}
              className="w-full h-[600px] rounded-xl border border-border bg-muted/20"
              title={paper.title}
            />
          ) : isImage ? (
            <div className="flex justify-center p-4 bg-muted/20 rounded-xl border border-border">
              <img
                src={paper.fileUrl}
                alt={paper.title}
                className="max-w-full max-h-[600px] rounded-xl object-contain"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
              <div className="w-16 h-16 rounded-2xl bg-muted border border-border flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-muted-foreground/40" />
              </div>
              <p className="text-base font-medium text-foreground mb-1">Preview not available</p>
              <p className="text-sm text-muted-foreground mb-5">
                This file type cannot be previewed in the browser.
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={handleDownload}
                className="flex items-center gap-2 h-9 px-4 rounded-xl border border-border bg-card text-sm font-medium text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all"
              >
                <Download className="h-4 w-4" /> Download to view
              </motion.button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Rating ── */}
      {isAuthenticated && (
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-foreground">
              <Star className="h-4 w-4 text-muted-foreground" />
              Rate this paper
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RatingStars paperId={paper.id} />
          </CardContent>
        </Card>
      )}

      {/* ── Comments ── */}
      <CommentSection paperId={paper.id} />
    </motion.div>
  );
}