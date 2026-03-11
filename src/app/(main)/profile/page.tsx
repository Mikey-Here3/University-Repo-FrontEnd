"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useProfile, useUpdateProfile, useChangePassword } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatDate, cn } from "@/lib/utils";
import {
  Loader2, Eye, EyeOff, User, Mail, Lock,
  Upload, Bookmark, Star, MessageSquare,
  Shield, Calendar, CheckCircle,
} from "lucide-react";
import { AnimatePresence } from "framer-motion";

const E = [0.22, 1, 0.36, 1] as const;

const profileSchema = z.object({
  name:  z.string().min(2).max(100),
  email: z.string().email(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Required"),
  newPassword:     z.string().min(6, "Min 6 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords don't match", path: ["confirmPassword"],
});

/* ─── Styled input ───────────────────────────────────────────── */
function FormField({
  label, error, icon: Icon, children, hint,
}: {
  label: string; error?: string; icon: React.ElementType;
  children: React.ReactNode; hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[12px] font-semibold text-foreground/70">{label}</label>
      <div className="relative group">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
        {children}
      </div>
      {hint && !error && <p className="text-[11px] text-muted-foreground">{hint}</p>}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }}
            className="text-[12px] text-red-500 flex items-center gap-1.5"
          >
            <span className="h-1 w-1 rounded-full bg-red-500 shrink-0 inline-block" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function StyledInput({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full h-11 rounded-xl border border-border bg-background text-[14px] text-foreground pl-10",
        "placeholder:text-muted-foreground/40 outline-none",
        "hover:border-primary/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all",
        className,
      )}
      {...props}
    />
  );
}

export default function ProfilePage() {
  const { data: user, isLoading } = useProfile();
  const { mutate: updateProfile, isPending: updating }    = useUpdateProfile();
  const { mutate: changePassword, isPending: changingPw } = useChangePassword();

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew,     setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    values:   { name: user?.name ?? "", email: user?.email ?? "" },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
  });

  const stats = [
    { icon: Upload,        val: user?._count?.papers    ?? 0, label: "Uploads",   color: "text-violet-600",  bg: "bg-violet-50", border: "border-violet-100" },
    { icon: Bookmark,      val: user?._count?.bookmarks  ?? 0, label: "Bookmarks", color: "text-amber-600",   bg: "bg-amber-50",  border: "border-amber-100"  },
    { icon: Star,          val: user?._count?.ratings    ?? 0, label: "Ratings",   color: "text-emerald-600", bg: "bg-emerald-50",border: "border-emerald-100"},
    { icon: MessageSquare, val: user?._count?.comments   ?? 0, label: "Comments",  color: "text-blue-600",    bg: "bg-blue-50",   border: "border-blue-100"   },
  ];

  if (isLoading) {
    return (
      <div className="max-w-2xl space-y-6">
        <Skeleton className="h-48 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">

      {/* ── Avatar + Stats ── */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: E }}
        className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-violet-50/50 p-6"
      >
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary via-violet-400 to-indigo-400 opacity-70" />
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-primary/6 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary via-violet-500 to-indigo-500 flex items-center justify-center shadow-xl shadow-primary/20">
              <span className="text-3xl font-black text-white">
                {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center">
              <CheckCircle className="h-3 w-3 text-white" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h1 className="text-xl font-black text-foreground tracking-tight truncate">
                {user?.name}
              </h1>
              <Badge className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
                {user?.role}
              </Badge>
            </div>
            <p className="text-[13px] text-muted-foreground truncate mb-2">{user?.email}</p>
            {user?.createdAt && (
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/60">
                <Calendar className="h-3 w-3" />
                Member since {formatDate(user.createdAt)}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="relative grid grid-cols-4 gap-3 mt-5">
          {stats.map(({ icon: Icon, val, label, color, bg, border }) => (
            <div
              key={label}
              className={cn(
                "flex flex-col items-center gap-1 p-3 rounded-xl border",
                bg, border,
              )}
            >
              <Icon className={cn("h-4 w-4", color)} />
              <span className="text-lg font-black text-foreground leading-none">{val}</span>
              <span className="text-[10px] text-muted-foreground font-medium">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Account Info ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1, ease: E }}
      >
        <Card className="border-border shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="flex items-center gap-2 text-[15px] font-black text-foreground">
              <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <User className="h-3.5 w-3.5 text-primary" />
              </div>
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <form
              onSubmit={profileForm.handleSubmit((d) => updateProfile(d))}
              className="space-y-4"
            >
              <FormField
                label="Full Name"
                icon={User}
                error={profileForm.formState.errors.name?.message}
              >
                <StyledInput
                  placeholder="Your full name"
                  {...profileForm.register("name")}
                />
              </FormField>

              <FormField
                label="Email Address"
                icon={Mail}
                error={profileForm.formState.errors.email?.message}
                hint="Changes to email may require re-verification"
              >
                <StyledInput
                  type="email"
                  placeholder="you@university.edu"
                  {...profileForm.register("email")}
                />
              </FormField>

              <motion.button
                type="submit"
                disabled={updating}
                whileHover={{ scale: updating ? 1 : 1.02 }}
                whileTap={{ scale: updating ? 1 : 0.97 }}
                className="relative h-11 w-full overflow-hidden rounded-xl bg-primary text-primary-foreground text-[14px] font-semibold shadow-md shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {!updating && (
                  <motion.span
                    className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.14] to-transparent"
                    initial={{ x: "-100%" }}
                    animate={{ x: "220%" }}
                    transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
                  />
                )}
                {updating
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
                  : "Save Changes"
                }
              </motion.button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Change Password ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.18, ease: E }}
      >
        <Card className="border-border shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="flex items-center gap-2 text-[15px] font-black text-foreground">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Lock className="h-3.5 w-3.5 text-amber-600" />
              </div>
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <form
              onSubmit={passwordForm.handleSubmit((d) =>
                changePassword(d, { onSuccess: () => passwordForm.reset() })
              )}
              className="space-y-4"
            >
              {/* Current password */}
              <FormField
                label="Current Password"
                icon={Lock}
                error={passwordForm.formState.errors.currentPassword?.message}
              >
                <StyledInput
                  type={showCurrent ? "text" : "password"}
                  placeholder="••••••••"
                  className="pr-10"
                  {...passwordForm.register("currentPassword")}
                />
                <button
                  type="button" tabIndex={-1}
                  onClick={() => setShowCurrent((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
                >
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </FormField>

              <Separator />

              {/* New password */}
              <FormField
                label="New Password"
                icon={Lock}
                error={passwordForm.formState.errors.newPassword?.message}
                hint="Must be at least 6 characters"
              >
                <StyledInput
                  type={showNew ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  className="pr-10"
                  {...passwordForm.register("newPassword")}
                />
                <button
                  type="button" tabIndex={-1}
                  onClick={() => setShowNew((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </FormField>

              {/* Confirm password */}
              <FormField
                label="Confirm New Password"
                icon={Lock}
                error={passwordForm.formState.errors.confirmPassword?.message}
              >
                <StyledInput
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat new password"
                  className="pr-10"
                  {...passwordForm.register("confirmPassword")}
                />
                <button
                  type="button" tabIndex={-1}
                  onClick={() => setShowConfirm((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </FormField>

              <motion.button
                type="submit"
                disabled={changingPw}
                whileHover={{ scale: changingPw ? 1 : 1.02 }}
                whileTap={{ scale: changingPw ? 1 : 0.97 }}
                className="h-11 w-full rounded-xl border border-border bg-card text-[14px] font-semibold text-foreground hover:bg-muted shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {changingPw
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Updating…</>
                  : <><Shield className="h-4 w-4" /> Update Password</>
                }
              </motion.button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}