// ============ ENUMS ============
export type UserRole = "ADMIN" | "STUDENT";
export type UserStatus = "ACTIVE" | "BLOCKED";
export type PaperStatus = "PENDING" | "APPROVED" | "REJECTED";
export type ContentType = "MID_TERM" | "END_TERM" | "QUIZ" | "ASSIGNMENT" | "NOTES" | "IMPORTANT";
export type ReportReason = "WRONG_SUBJECT" | "INCORRECT_FILE" | "SPAM_UPLOAD" | "INAPPROPRIATE_CONTENT" | "OTHER";
export type ReportStatus = "PENDING" | "REVIEWED" | "RESOLVED";
export type ModerationAction =
  | "APPROVED_PAPER" | "REJECTED_PAPER" | "DELETED_PAPER"
  | "BLOCKED_USER" | "UNBLOCKED_USER" | "DELETED_COMMENT" | "RESOLVED_REPORT";

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  MID_TERM: "Mid Term",
  END_TERM: "End Term",
  QUIZ: "Quiz",
  ASSIGNMENT: "Assignment",
  NOTES: "Notes",
  IMPORTANT: "Important",
};

export const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  WRONG_SUBJECT: "Wrong Subject/Course",
  INCORRECT_FILE: "Incorrect File",
  SPAM_UPLOAD: "Spam Upload",
  INAPPROPRIATE_CONTENT: "Inappropriate Content",
  OTHER: "Other",
};

// ============ MODELS ============
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt?: string;
  lastLogin?: string | null;
  _count?: {
    papers: number;
    bookmarks: number;
    ratings: number;
    reports: number;
    comments: number;
  };
}

export interface Department {
  id: string;
  name: string;
  createdById?: string;
  createdBy?: { id: string; name: string };
  createdAt: string;
  _count?: { programs: number; papers: number };
  programs?: Program[];
}

export interface Program {
  id: string;
  name: string;
  departmentId: string;
  department?: { id: string; name: string };
  createdAt: string;
  courses?: Course[];
  _count?: { courses: number; papers: number };
}

export interface Course {
  id: string;
  name: string;
  programId: string;
  program?: { id: string; name: string; department?: { id: string; name: string } };
  semester: number;
  createdAt: string;
  _count?: { papers: number };
}

export interface Paper {
  id: string;
  title: string;
  description?: string | null;
  departmentId: string;
  department: { id: string; name: string };
  programId: string;
  program: { id: string; name: string };
  courseId: string;
  course: { id: string; name: string };
  semester: number;
  contentType: ContentType;
  year: number;
  teacherName?: string | null;
  tags: string[];
  fileUrl: string;
  cloudinaryId: string;
  fileSize?: number | null;
  fileType?: string | null;
  uploadedById: string;
  uploadedBy: { id: string; name: string; email?: string };
  status: PaperStatus;
  downloads: number;
  ratingAverage: number | null;
  ratingCount: number;
  version: number;
  createdAt: string;
  updatedAt: string;
  // From getPaperById
  isBookmarked?: boolean;
  userRating?: number | null;
  _count?: { bookmarks: number; comments: number; ratings: number };
}

export interface Bookmark {
  id: string;
  userId: string;
  paperId: string;
  paper: Paper;
  createdAt: string;
}

export interface Rating {
  id: string;
  userId: string;
  user: { id: string; name: string };
  paperId: string;
  rating: number;
  createdAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  user: { id: string; name: string };
  paperId: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface Report {
  id: string;
  userId: string;
  user: { id: string; name: string; email?: string };
  paperId: string;
  paper: { id: string; title: string; status?: PaperStatus };
  reason: ReportReason;
  description?: string | null;
  status: ReportStatus;
  createdAt: string;
}

export interface ModerationLog {
  id: string;
  adminId: string;
  admin: { id: string; name: string; email: string };
  action: ModerationAction;
  targetType: string;
  targetId: string;
  details?: string | null;
  timestamp: string;
}

// ============ API RESPONSES ============
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T[];
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ============ REQUEST TYPES ============
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface PaperFilters {
  page?: number;
  limit?: number;
  departmentId?: string;
  programId?: string;
  courseId?: string;
  semester?: number;
  contentType?: ContentType;
  year?: number;
  search?: string;
  status?: PaperStatus;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreatePaperData {
  title: string;
  description?: string;
  departmentId: string;
  programId: string;
  courseId: string;
  semester: number;
  contentType: ContentType;
  year: number;
  teacherName?: string;
  tags?: string[];
  file: File;
}

export interface DashboardStats {
  totalUsers: number;
  totalPapers: number;
  pendingPapers: number;
  pendingReports: number;
  totalDepartments: number;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  role?: UserRole;
  status?: UserStatus;
  search?: string;
}
// ============ CONTACT & TEAM ============
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  imageUrl?: string | null;
  bio?: string | null;
  order: number;
  createdAt: string;
}