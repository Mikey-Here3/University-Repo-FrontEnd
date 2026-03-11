"use client";

import { useAuthStore } from "@/store/auth-store";
import { Navbar }       from "./navbar";
import { Sidebar }      from "./sidebar";
import { Footer }       from "./footer";
import { motion }       from "framer-motion";
import { GraduationCap } from "lucide-react";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  /* ── Loading screen ── */
  if (isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-6 bg-background">
        {/* Logo pulse */}
        <motion.div
          animate={{ scale: [1, 1.07, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card shadow-lg"
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/5 to-transparent" />
          <GraduationCap className="relative h-6 w-6 text-primary" />
        </motion.div>

        {/* Spinner ring */}
        <div className="relative h-7 w-7">
          <div className="absolute inset-0 rounded-full border-2 border-muted" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary"
          />
        </div>

        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Loading…
        </p>
      </div>
    );
  }

  /* ── Guest layout ── */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
        <Footer />
      </div>
    );
  }

  /* ── Authenticated layout ── */
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <motion.main
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex-1 overflow-auto"
        >
          <div className="container mx-auto px-4 py-6 md:px-6">
            {children}
          </div>
        </motion.main>
      </div>
      <Footer />
    </div>
  );
}