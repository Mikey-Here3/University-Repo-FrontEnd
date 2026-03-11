"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLogin } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import {
  Mail, Lock, Loader2, ArrowRight,
  Eye, EyeOff, CheckCircle,
} from "lucide-react";

/* ─── schema ─────────────────────────────────────────────────── */
const schema = z.object({
  email:    z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type FormData = z.infer<typeof schema>;

/* ─── Field ──────────────────────────────────────────────────── */
const Field = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    label:     string;
    icon:      React.ElementType;
    error?:    string;
    onToggle?: () => void;
    visible?:  boolean;
    extra?:    React.ReactNode;
  }
>(({ label, icon: Icon, error, onToggle, visible, extra, id, ...rest }, ref) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-[12px] font-semibold text-foreground/70">
      {label}
    </label>
    <div className="relative group">
      <Icon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 transition-colors group-focus-within:text-primary" />
      <input
        id={id}
        ref={ref}
        className={cn(
          "w-full h-11 rounded-xl border text-[14px] text-foreground bg-background",
          "placeholder:text-muted-foreground/40 outline-none pl-10",
          onToggle ? "pr-10" : "pr-3.5",
          "transition-all duration-150",
          error
            ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/10"
            : "border-border hover:border-primary/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/10",
        )}
        {...rest}
      />
      {onToggle && (
        <button
          type="button" tabIndex={-1} onClick={onToggle}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      )}
    </div>
    {extra}
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }}
          className="text-[12px] text-red-500 flex items-center gap-1.5"
        >
          <span className="inline-block h-1 w-1 rounded-full bg-red-500 shrink-0" />
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
));
Field.displayName = "Field";

/* ─── page ───────────────────────────────────────────────────── */
export default function LoginPage() {
  const { mutate: login, isPending } = useLogin();
  const [showPass, setShowPass] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-foreground tracking-tight">
          Welcome back
        </h1>
        <p className="mt-2 text-[14px] text-muted-foreground">
          Sign in to access your academic resources
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit((d) => login(d))} className="flex flex-col gap-4">

        <Field
          id="email"
          label="Email Address"
          type="email"
          placeholder="you@university.edu"
          autoComplete="email"
          icon={Mail}
          error={errors.email?.message}
          {...register("email")}
        />

        {/* Password with forgot link */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-[12px] font-semibold text-foreground/70">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[12px] text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative group">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 transition-colors group-focus-within:text-primary" />
            <input
              id="password"
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              className={cn(
                "w-full h-11 rounded-xl border text-[14px] text-foreground bg-background",
                "placeholder:text-muted-foreground/40 outline-none pl-10 pr-10",
                "transition-all duration-150",
                errors.password
                  ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/10"
                  : "border-border hover:border-primary/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/10",
              )}
              {...register("password")}
            />
            <button
              type="button" tabIndex={-1}
              onClick={() => setShowPass((p) => !p)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
            >
              {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <AnimatePresence>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }}
                className="text-[12px] text-red-500 flex items-center gap-1.5"
              >
                <span className="inline-block h-1 w-1 rounded-full bg-red-500 shrink-0" />
                {errors.password.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={isPending}
          whileHover={{ scale: isPending ? 1 : 1.02 }}
          whileTap={{ scale: isPending ? 1 : 0.97 }}
          className="relative mt-2 h-12 w-full overflow-hidden rounded-xl bg-primary text-[15px] font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {!isPending && (
            <motion.span
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.15] to-transparent"
              initial={{ x: "-100%" }}
              animate={{ x: "220%" }}
              transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 3.5, ease: "easeInOut" }}
            />
          )}
          <span className="relative flex items-center justify-center gap-2">
            {isPending
              ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</>
              : <>Sign In <ArrowRight className="h-4 w-4" /></>
            }
          </span>
        </motion.button>

        {/* Trust row */}
        <div className="flex items-center justify-center gap-4 flex-wrap pt-1">
          {["Free forever", "Verified content", "Instant access"].map((item) => (
            <span key={item} className="flex items-center gap-1.5 text-[11px] text-muted-foreground/60">
              <CheckCircle className="h-3 w-3 text-emerald-500/70 shrink-0" />
              {item}
            </span>
          ))}
        </div>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-[12px] text-muted-foreground shrink-0">
          don&apos;t have an account?
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Register link */}
      <Link href="/register">
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="w-full h-11 rounded-xl border border-border bg-muted/40 text-[14px] font-medium text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all duration-200"
        >
          Create a free account
        </motion.button>
      </Link>
    </motion.div>
  );
}