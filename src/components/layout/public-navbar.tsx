"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/auth-store";
import { GraduationCap, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/",            label: "Home"        },
  { href: "/papers",      label: "Papers"      },
  { href: "/explore",     label: "Explore"     },
  { href: "/departments", label: "Departments" },
  { href: "/about",       label: "About"       },
  { href: "/contact",     label: "Contact"     },
];

export function PublicNavbar() {
  const { isAuthenticated, user } = useAuthStore();
  const router    = useRouter();
  const pathname  = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur-xl">
      {/* Top accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="container mx-auto flex h-16 items-center justify-between px-4">

        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className={cn(
            "relative flex h-9 w-9 items-center justify-center rounded-xl",
            "border border-border bg-card shadow-sm",
            "transition-all duration-200 group-hover:border-primary/30 group-hover:shadow-md",
          )}>
            <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-primary/5 to-transparent" />
            <GraduationCap className="relative h-5 w-5 text-primary" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-foreground">
            Uni<span className="text-muted-foreground">Resources</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative px-3.5 py-2 rounded-lg text-[13px] font-medium transition-colors duration-150",
                pathname === link.href
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {pathname === link.href && (
                <motion.span
                  layoutId="pub-nav-pill"
                  className="absolute inset-0 rounded-lg bg-muted"
                  transition={{ type: "spring", damping: 26, stiffness: 300 }}
                />
              )}
              <span className="relative z-10">{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => router.push(user?.role === "ADMIN" ? "/admin" : "/dashboard")}
              className="h-9 px-5 rounded-xl text-[13px] font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Dashboard
            </motion.button>
          ) : (
            <>
              <button
                onClick={() => router.push("/login")}
                className="h-9 px-4 rounded-xl text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Login
              </button>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => router.push("/register")}
                className="h-9 px-5 rounded-xl text-[13px] font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors"
              >
                Get Started
              </motion.button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <motion.button
          whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
          onClick={() => setMobileOpen(!mobileOpen)}
          className={cn(
            "md:hidden flex h-9 w-9 items-center justify-center rounded-xl",
            "border border-border bg-card text-muted-foreground",
            "hover:border-primary/40 hover:text-foreground transition-colors",
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            {mobileOpen ? (
              <motion.div
                key="x"
                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0,   opacity: 1, scale: 1   }}
                exit={{   rotate: 90,  opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.15 }}
              >
                <X className="h-4 w-4" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90,  opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0,   opacity: 1, scale: 1   }}
                exit={{   rotate: -90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.15 }}
              >
                <Menu className="h-4 w-4" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{   height: 0, opacity: 0 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden border-t border-border bg-background"
          >
            <div className="px-4 pt-3 pb-5">
              <nav className="flex flex-col gap-1 mb-4">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0  }}
                    transition={{ delay: i * 0.04, duration: 0.22, ease: "easeOut" }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors",
                        pathname === link.href
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="flex gap-2 pt-4 border-t border-border">
                {isAuthenticated ? (
                  <button
                    onClick={() => { router.push("/dashboard"); setMobileOpen(false); }}
                    className="w-full h-10 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Dashboard
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => { router.push("/login"); setMobileOpen(false); }}
                      className="flex-1 h-10 rounded-xl text-[13px] font-medium border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => { router.push("/register"); setMobileOpen(false); }}
                      className="flex-1 h-10 rounded-xl text-[13px] font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      Register
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}