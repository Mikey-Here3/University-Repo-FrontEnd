"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth-store";
import { useUIStore } from "@/store/ui-store";
import { useLogout } from "@/hooks/use-auth";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SearchCommand } from "./search-command";
import { cn } from "@/lib/utils";
import {
  Menu, GraduationCap, LogOut, User,
  Settings, Search, ChevronDown,
} from "lucide-react";

export function Navbar() {
  const { user, isAuthenticated } = useAuthStore();
  const { toggleSidebar }         = useUIStore();
  const logout                    = useLogout();
  const router                    = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur-xl">
        {/* Top accent */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        <div className="flex h-16 items-center gap-4 px-4 md:px-6">

          {/* Sidebar toggle */}
          <motion.button
            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
            onClick={toggleSidebar}
            className={cn(
              "md:hidden flex h-9 w-9 items-center justify-center rounded-xl",
              "border border-border bg-card text-muted-foreground",
              "hover:border-primary/40 hover:text-foreground transition-colors",
            )}
          >
            <Menu className="h-4 w-4" />
          </motion.button>

          {/* Logo */}
          <Link
            href={isAuthenticated ? "/dashboard" : "/"}
            className="group flex items-center gap-2.5 shrink-0"
          >
            <div className={cn(
              "relative flex h-9 w-9 items-center justify-center rounded-xl",
              "border border-border bg-card shadow-sm",
              "transition-all duration-200 group-hover:border-primary/30 group-hover:shadow-md",
            )}>
              <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-primary/5 to-transparent" />
              <GraduationCap className="relative h-5 w-5 text-primary" />
            </div>
            <span className="hidden sm:block text-[15px] font-semibold tracking-tight text-foreground">
              Uni<span className="text-muted-foreground">Resources</span>
            </span>
          </Link>

          {/* Search */}
          <div className="flex-1 flex justify-center">
            {/* Wide search bar — desktop */}
            <motion.button
              whileTap={{ scale: 0.985 }}
              onClick={() => setSearchOpen(true)}
              className={cn(
                "hidden sm:flex items-center gap-3 h-9 px-4 rounded-xl w-full max-w-md",
                "border border-border bg-muted/50 text-muted-foreground",
                "hover:border-primary/30 hover:bg-muted hover:text-foreground",
                "transition-all duration-200",
              )}
            >
              <Search className="h-3.5 w-3.5 shrink-0" />
              <span className="flex-1 text-left text-[13px]">
                Search papers, courses...
              </span>
              <kbd className="text-[11px] bg-background border border-border px-1.5 py-0.5 rounded text-muted-foreground">
                ⌘K
              </kbd>
            </motion.button>

            {/* Icon-only — mobile */}
            <motion.button
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
              onClick={() => setSearchOpen(true)}
              className={cn(
                "sm:hidden flex h-9 w-9 items-center justify-center rounded-xl",
                "border border-border bg-card text-muted-foreground",
                "hover:border-primary/40 hover:text-foreground transition-colors",
              )}
            >
              <Search className="h-4 w-4" />
            </motion.button>
          </div>

          {/* ── User area ── */}
          {isAuthenticated && user ? (
            <DropdownMenu>
              {/*
               * FIX: Remove `asChild` + the inner <button>.
               * Base UI's Menu.Trigger renders its own <button> element.
               * Wrapping another <button> inside it creates invalid HTML
               * (<button> cannot contain <button>) and a hydration error.
               *
               * Apply all styling classes directly on DropdownMenuTrigger.
               * The DropdownMenuTrigger component forwards `className` to
               * the underlying Base UI trigger element.
               */}
              <DropdownMenuTrigger
                className={cn(
                  "flex items-center gap-2 rounded-xl px-2.5 py-1.5",
                  "border border-transparent outline-none",
                  "hover:border-border hover:bg-muted transition-all duration-200",
                  "focus-visible:ring-2 focus-visible:ring-primary/30",
                )}
              >
                <Avatar className="h-7 w-7 border border-border">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:block text-[13px] font-medium text-foreground">
                  {user.name}
                </span>
                <ChevronDown className="hidden md:block h-3.5 w-3.5 text-muted-foreground" />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="w-52 rounded-xl border border-border bg-background p-1.5 shadow-xl"
              >
                {/* User header */}
                <div className="px-3 py-2.5 mb-0.5">
                  <p className="text-[13px] font-semibold text-foreground leading-none mb-1">
                    {user.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground capitalize">
                    {user.role.toLowerCase()}
                  </p>
                </div>

                <DropdownMenuSeparator className="bg-border my-1" />

                <DropdownMenuItem
                  onClick={() => router.push("/profile")}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-muted-foreground focus:bg-muted focus:text-foreground cursor-pointer"
                >
                  <User className="h-3.5 w-3.5" /> Profile
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => router.push("/settings")}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-muted-foreground focus:bg-muted focus:text-foreground cursor-pointer"
                >
                  <Settings className="h-3.5 w-3.5" /> Settings
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-border my-1" />

                <DropdownMenuItem
                  onClick={logout}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-red-500 focus:bg-red-50 focus:text-red-600 cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push("/login")}
                className="h-9 px-4 rounded-xl text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Login
              </button>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => router.push("/register")}
                className="h-9 px-4 rounded-xl text-[13px] font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Register
              </motion.button>
            </div>
          )}
        </div>
      </header>

      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}