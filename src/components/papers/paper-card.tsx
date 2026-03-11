"use client";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Paper } from "@/types";
import { CONTENT_TYPE_LABELS } from "@/types";
import { getContentTypeColor, getStatusColor, formatDate } from "@/lib/utils";
import { Download, Star, Calendar, User } from "lucide-react";

interface Props {
  paper: Paper;
  showStatus?: boolean;
}

export function PaperCard({ paper, showStatus = false }: Props) {
  return (
    <Link href={`/papers/${paper.id}`}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-2">
            <Badge className={getContentTypeColor(paper.contentType)} variant="secondary">
              {CONTENT_TYPE_LABELS[paper.contentType]}
            </Badge>
            {showStatus && (
              <Badge className={getStatusColor(paper.status)} variant="secondary">
                {paper.status}
              </Badge>
            )}
          </div>

          <h3 className="mt-3 font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {paper.title}
          </h3>

          {paper.description && (
            <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{paper.description}</p>
          )}

          <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />{paper.year} • Sem {paper.semester}
            </span>
            {paper.teacherName && (
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />{paper.teacherName}
              </span>
            )}
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5">
            <Badge variant="outline" className="text-xs">{paper.department.name}</Badge>
            <Badge variant="outline" className="text-xs">{paper.course.name}</Badge>
          </div>
        </CardContent>

        <CardFooter className="px-5 pb-4 pt-0 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              {paper.ratingAverage?.toFixed(1) || "0.0"} ({paper.ratingCount})
            </span>
            <span className="flex items-center gap-1">
              <Download className="h-3.5 w-3.5" />{paper.downloads}
            </span>
          </div>
          <span className="text-xs">{formatDate(paper.createdAt)}</span>
        </CardFooter>
      </Card>
    </Link>
  );
}