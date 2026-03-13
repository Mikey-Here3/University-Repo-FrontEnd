"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { contactService } from "@/services/contact.service";
import { toast } from "sonner";
import { getApiError, cn } from "@/lib/utils";
import {
  Mail, MapPin, Send, CheckCircle2, Loader2,
  MessageSquare, User, AtSign, FileText,
  AlertCircle, Phone,
} from "lucide-react";

/* ─── Schema ─────────────────────────────────────────────────── */
const schema = z.object({
  name:    z.string().min(2,  "Name must be at least 2 characters"),
  email:   z.string().email(  "Enter a valid email address"),
  subject: z.string().min(3,  "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});
type FormData = z.infer<typeof schema>;

/* ─── Static data ────────────────────────────────────────────── */
const CONTACT_INFO = [
  {
    icon: Mail,
    label: "Email",
    value: "contact@studyhouse.online",
    href: "mailto:contact@studyhouse.online",
    gradient: "from-violet-500 to-indigo-500",
    shadow:   "shadow-violet-500/20",
    ring:     "ring-violet-500/20",
    bg:       "bg-violet-50",
    border:   "border-violet-200",
    description: "Drop us a line anytime",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+92 (319) 079-9711",
    href: "tel:+923190799711",
    gradient: "from-cyan-500 to-blue-500",
    shadow:   "shadow-cyan-500/20",
    ring:     "ring-cyan-500/20",
    bg:       "bg-cyan-50",
    border:   "border-cyan-200",
    description: "Mon–Fri, 9 am to 6 pm",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Main University Campus",
    href: "#",
    gradient: "from-emerald-500 to-teal-500",
    shadow:   "shadow-emerald-500/20",
    ring:     "ring-emerald-500/20",
    bg:       "bg-emerald-50",
    border:   "border-emerald-200",
    description: "Academic Resource Centre",
  },
];

/* ─── Animation variants ─────────────────────────────────────── */
const E = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
  show: (i: number) => ({
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { delay: i * 0.1, duration: 0.52, ease: E },
  }),
};

/* ─── Input style helper — light-safe ───────────────────────── */
function inputCls(hasError?: boolean) {
  return cn(
    "flex w-full rounded-xl border bg-background px-3.5 text-sm text-foreground",
    "placeholder:text-muted-foreground/40",
    "focus:outline-none focus:ring-2 focus:ring-violet-500/25 focus:border-violet-400",
    "transition-all duration-200",
    hasError
      ? "border-red-400 focus:ring-red-400/20 focus:border-red-400"
      : "border-border hover:border-violet-300"
  );
}

/* ─── FormField ──────────────────────────────────────────────── */
function FormField({
  label, icon: Icon, error, children,
}: {
  label: string; icon: React.ElementType;
  error?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[12px] font-semibold flex items-center gap-1.5 text-muted-foreground">
        <Icon className="w-3.5 h-3.5 text-muted-foreground/60" />
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-[11px] text-red-500 flex items-center gap-1"
          >
            <AlertCircle className="w-3 h-3 shrink-0" />{error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function ContactPage() {
  const {
    register, handleSubmit, reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const {
    mutate: send, isPending, isSuccess,
    reset: resetMutation,
  } = useMutation({
    mutationFn: (data: FormData) => contactService.send(data),
    onSuccess: () => {
      toast.success("Message sent! We'll get back to you soon.");
      reset();
    },
    onError: (e) => toast.error(getApiError(e)),
  });

  return (
    <div className="min-h-screen bg-background">

      {/* ── Ambient light blobs ── */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4  -left-40  w-96 h-96 bg-violet-200/30  rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-cyan-200/20   rounded-full blur-3xl" />
        <div className="absolute top-2/3   left-1/3  w-72 h-72 bg-emerald-200/15 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "radial-gradient(circle, hsl(var(--foreground)/0.4) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: E }}
          className="text-center mb-16"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-200 bg-violet-100 text-violet-700 text-[10px] font-black tracking-[0.14em] uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
            Get In Touch
          </div>

          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-5 text-foreground">
            Contact{" "}
            <span className="gradient-text">Us</span>
          </h1>

          <p className="text-muted-foreground max-w-md mx-auto text-base leading-relaxed">
            Have questions, feedback, or suggestions?
            We&apos;d love to hear from you.
          </p>

          {/* Ornamental divider */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-border" />
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-border" />
          </div>
        </motion.div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* ══ FORM (3 / 5) ══════════════════════════════════════ */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: E, delay: 0.2 }}
          >
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 md:p-10">
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 via-purple-400 to-cyan-500 opacity-70" />
              <div className="absolute inset-x-0 top-[2px] h-px bg-gradient-to-r from-transparent via-foreground/[0.04] to-transparent" />

              <AnimatePresence mode="wait">

                {/* ── Success state ── */}
                {isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.35 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                  >
                    <div className="relative mb-6">
                      <div className="w-20 h-20 rounded-[22px] bg-gradient-to-br from-emerald-100 to-emerald-50 border border-emerald-200 flex items-center justify-center shadow-2xl shadow-emerald-100">
                        <CheckCircle2 className="w-9 h-9 text-emerald-600" />
                      </div>
                      <motion.div
                        className="absolute inset-0 rounded-[22px] border border-emerald-300/50"
                        animate={{ scale: [1, 1.45, 1.45], opacity: [0.6, 0, 0] }}
                        transition={{ duration: 1.6, repeat: Infinity }}
                      />
                    </div>

                    <h3 className="font-black text-xl text-foreground mb-2">Message Sent!</h3>
                    <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                      Thank you for reaching out. We&apos;ll review your
                      message and get back to you shortly.
                    </p>

                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => { resetMutation(); reset(); }}
                      className="mt-8 h-10 px-6 rounded-xl border border-border bg-card text-sm font-semibold text-muted-foreground hover:border-violet-300 hover:text-violet-600 transition-colors"
                    >
                      Send Another
                    </motion.button>
                  </motion.div>

                ) : (

                  /* ── Form state ── */
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit((d) => send(d))}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-5"
                  >
                    <div className="mb-8">
                      <h2 className="text-xl font-black text-foreground mb-1">Send a Message</h2>
                      <p className="text-sm text-muted-foreground/70">
                        Fill out the form below and we&apos;ll respond promptly.
                      </p>
                    </div>

                    {/* Name + Email row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <FormField label="Full Name" icon={User} error={errors.name?.message}>
                        <input
                          {...register("name")}
                          placeholder="Your full name"
                          className={cn(inputCls(!!errors.name), "h-11")}
                        />
                      </FormField>

                      <FormField label="Email Address" icon={AtSign} error={errors.email?.message}>
                        <input
                          type="email"
                          {...register("email")}
                          placeholder="you@email.com"
                          className={cn(inputCls(!!errors.email), "h-11")}
                        />
                      </FormField>
                    </div>

                    {/* Subject */}
                    <FormField label="Subject" icon={FileText} error={errors.subject?.message}>
                      <input
                        {...register("subject")}
                        placeholder="What is this regarding?"
                        className={cn(inputCls(!!errors.subject), "h-11")}
                      />
                    </FormField>

                    {/* Message */}
                    <FormField label="Message" icon={MessageSquare} error={errors.message?.message}>
                      <textarea
                        {...register("message")}
                        rows={5}
                        placeholder="Write your message here..."
                        className={cn(inputCls(!!errors.message), "py-3 resize-none")}
                      />
                    </FormField>

                    {/* Submit */}
                    <motion.button
                      type="submit"
                      disabled={isPending}
                      whileTap={{ scale: 0.98 }}
                      className="relative w-full h-12 flex items-center justify-center gap-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/25 overflow-hidden"
                    >
                      {/* Shimmer sweep */}
                      <motion.span
                        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                        initial={{ x: "-100%" }}
                        animate={{ x: "220%" }}
                        transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
                      />
                      {isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin relative" />
                          <span className="relative">Sending…</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 relative" />
                          <span className="relative">Send Message</span>
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ══ SIDEBAR (2 / 5) ═══════════════════════════════════ */}
          <div className="lg:col-span-2 space-y-4">

            {/* Contact info cards */}
            {CONTACT_INFO.map((info, i) => (
              <motion.div
                key={info.label}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
              >
                <a href={info.href} target="_blank" rel="noopener noreferrer" className="block">
                  <div className={cn(
                    "group relative overflow-hidden rounded-2xl border bg-card",
                    "p-5 cursor-pointer",
                    "transition-all duration-300 hover:shadow-lg",
                    info.border,
                    info.shadow
                  )}>
                    {/* Hover top accent */}
                    <div className={cn(
                      "absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl bg-gradient-to-r",
                      "opacity-0 group-hover:opacity-80 transition-opacity duration-300",
                      info.gradient
                    )} />
                    {/* Tint wash on hover */}
                    <div className={cn(
                      "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                      info.bg
                    )} />
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/[0.04] to-transparent" />

                    <div className="relative flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center",
                        "shadow-md ring-2 shrink-0",
                        "transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3",
                        info.gradient, info.shadow, info.ring
                      )}>
                        <info.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] text-muted-foreground/70 mb-0.5">{info.description}</p>
                        <h3 className="font-bold text-sm text-foreground leading-tight truncate">
                          {info.value}
                        </h3>
                      </div>
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}

            {/* Response time card */}
            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="show"
            >
              <div className="relative overflow-hidden rounded-2xl border border-dashed border-border bg-secondary/20 p-5">
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 animate-pulse shrink-0" />
                  <div>
                    <h4 className="text-sm font-black text-foreground mb-1.5">
                      Quick Response Guaranteed
                    </h4>
                    <p className="text-[12px] text-muted-foreground leading-relaxed">
                      We typically respond within{" "}
                      <span className="text-foreground font-semibold">24–48 hours</span>{" "}
                      on business days. For urgent matters, reach out directly.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-center text-[11px] text-muted-foreground/40 mt-16 tracking-widest"
        >
          We respect your privacy — your information is never shared ✦
        </motion.p>
      </div>
    </div>
  );
}
