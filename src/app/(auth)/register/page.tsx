"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useRegister } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import {
  Loader2, Mail, Lock, User, ArrowRight,
  Eye, EyeOff, Check, CheckCircle,
} from "lucide-react";

/* ─── schema ─────────────────────────────────────────────────── */
const schema = z
  .object({
    name:            z.string().min(2, "Name must be at least 2 characters"),
    email:           z.string().email("Enter a valid email address"),
    password:        z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path:    ["confirmPassword"],
  });
type FormData = z.infer<typeof schema>;

/* ─── password strength ──────────────────────────────────────── */
const PW_CHECKS = [
  { label: "8+ characters",     test: (p: string) => p.length >= 8           },
  { label: "Uppercase letter",  test: (p: string) => /[A-Z]/.test(p)         },
  { label: "Number",            test: (p: string) => /[0-9]/.test(p)         },
  { label: "Special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

function getStrength(pw: string) {
  if (!pw) return null;
  let s = 0;
  if (pw.length >= 8)          s++;
  if (pw.length >= 12)         s++;
  if (/[A-Z]/.test(pw))        s++;
  if (/[0-9]/.test(pw))        s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const MAP = [
    { label: "Weak",   color: "bg-red-500",     text: "text-red-500",     pct: "20%"  },
    { label: "Weak",   color: "bg-red-500",     text: "text-red-500",     pct: "25%"  },
    { label: "Fair",   color: "bg-amber-500",   text: "text-amber-600",   pct: "50%"  },
    { label: "Good",   color: "bg-blue-500",    text: "text-blue-600",    pct: "75%"  },
    { label: "Strong", color: "bg-emerald-500", text: "text-emerald-600", pct: "100%" },
    { label: "Strong", color: "bg-emerald-500", text: "text-emerald-600", pct: "100%" },
  ];
  return { score: s, ...MAP[Math.min(s, 5)] };
}

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
export default function RegisterPage() {
  const { mutate: signup, isPending } = useRegister();
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [terms,       setTerms]       = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const password = watch("password", "");
  const strength = getStrength(password);

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      {/* Heading */}
      <div className="mb-7">
        <h1 className="text-3xl font-black text-foreground tracking-tight">
          Create account
        </h1>
        <p className="mt-2 text-[14px] text-muted-foreground">
          Join thousands of students sharing resources
        </p>
      </div>

      {/* Progress steps */}
      <div className="flex items-center gap-2 mb-7">
        {[
          { step: "1", label: "Account",  active: true  },
          { step: "2", label: "Verify",   active: false },
          { step: "3", label: "Complete", active: false },
        ].map((s, i) => (
          <React.Fragment key={s.step}>
            <div className="flex items-center gap-1.5">
              <div className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-all",
                s.active
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                  : "bg-muted text-muted-foreground",
              )}>
                {s.step}
              </div>
              <span className={cn(
                "text-[12px] font-medium",
                s.active ? "text-foreground" : "text-muted-foreground",
              )}>
                {s.label}
              </span>
            </div>
            {i < 2 && <div className="flex-1 h-px bg-border" />}
          </React.Fragment>
        ))}
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit((d) =>
          signup({ name: d.name, email: d.email, password: d.password })
        )}
        className="flex flex-col gap-4"
      >
        <Field
          id="name"
          label="Full Name"
          placeholder="John Doe"
          autoComplete="name"
          icon={User}
          error={errors.name?.message}
          {...register("name")}
        />

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

        {/* Password + strength meter */}
        <Field
          id="password"
          label="Password"
          type={showPass ? "text" : "password"}
          placeholder="Min. 6 characters"
          autoComplete="new-password"
          icon={Lock}
          error={errors.password?.message}
          onToggle={() => setShowPass((p) => !p)}
          visible={showPass}
          extra={
            strength ? (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">Password strength</span>
                  <span className={cn("text-[11px] font-semibold", strength.text)}>
                    {strength.label}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className={cn("h-full rounded-full", strength.color)}
                    initial={{ width: 0 }}
                    animate={{ width: strength.pct }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 pt-0.5">
                  {PW_CHECKS.map(({ label, test }) => {
                    const ok = test(password);
                    return (
                      <div
                        key={label}
                        className={cn(
                          "flex items-center gap-1.5 text-[11px] transition-colors duration-200",
                          ok ? "text-emerald-600" : "text-muted-foreground/50",
                        )}
                      >
                        <Check className={cn("h-3 w-3 shrink-0", ok ? "text-emerald-500" : "text-muted-foreground/30")} />
                        {label}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ) : null
          }
          {...register("password")}
        />

        <Field
          id="confirmPassword"
          label="Confirm Password"
          type={showConfirm ? "text" : "password"}
          placeholder="Repeat your password"
          autoComplete="new-password"
          icon={Lock}
          error={errors.confirmPassword?.message}
          onToggle={() => setShowConfirm((p) => !p)}
          visible={showConfirm}
          {...register("confirmPassword")}
        />

        {/* Terms */}
        <div className="flex items-start gap-3 mt-1">
          <motion.button
            type="button"
            whileTap={{ scale: 0.85 }}
            onClick={() => setTerms((t) => !t)}
            className={cn(
              "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border mt-0.5 transition-all duration-150",
              terms
                ? "bg-primary border-primary shadow-sm shadow-primary/20"
                : "border-border bg-background hover:border-primary/40",
            )}
          >
            {terms && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12, stiffness: 300 }}
              >
                <Check className="h-3 w-3 text-primary-foreground" />
              </motion.div>
            )}
          </motion.button>
          <p className="text-[12px] text-muted-foreground leading-relaxed">
            I agree to the{" "}
            <Link href="/terms" className="text-primary hover:text-primary/80 transition-colors font-medium">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:text-primary/80 transition-colors font-medium">
              Privacy Policy
            </Link>
          </p>
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={isPending || !terms}
          whileHover={{ scale: isPending || !terms ? 1 : 1.02 }}
          whileTap={{ scale: isPending || !terms ? 1 : 0.97 }}
          className="relative mt-2 h-12 w-full overflow-hidden rounded-xl bg-primary text-[15px] font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {!isPending && terms && (
            <motion.span
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.15] to-transparent"
              initial={{ x: "-100%" }}
              animate={{ x: "220%" }}
              transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 3.5, ease: "easeInOut" }}
            />
          )}
          <span className="relative flex items-center justify-center gap-2">
            {isPending
              ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating your account…</>
              : <>Create Account <ArrowRight className="h-4 w-4" /></>
            }
          </span>
        </motion.button>

        {/* Trust row */}
        <div className="flex items-center justify-center gap-4 flex-wrap pt-1">
          {["Free forever", "No credit card", "Instant access"].map((item) => (
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
        <span className="text-[12px] text-muted-foreground shrink-0">already have an account?</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Sign in link */}
      <Link href="/login">
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="w-full h-11 rounded-xl border border-border bg-muted/40 text-[14px] font-medium text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all duration-200"
        >
          Sign in to existing account
        </motion.button>
      </Link>
    </motion.div>
  );
}