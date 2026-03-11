"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

const publicPaths = [
  "/", "/login", "/register", "/about", "/contact",
  "/departments", "/programs", "/courses", "/explore", "/search",
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const { hydrate, isAuthenticated, isLoading, user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const redirecting = useRef(false);

  // Hydrate ONCE on mount
  useEffect(() => {
    hydrate();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle redirects
  useEffect(() => {
    if (isLoading) return;
    if (redirecting.current) return;

    const isPublic = publicPaths.some(
      (p) => pathname === p || pathname.startsWith(`${p}/`)
    );
    const isPapersPage = pathname.startsWith("/papers");
    const isAuthPage = pathname === "/login" || pathname === "/register";

    // Unauthenticated on protected page → login
    if (!isAuthenticated && !isPublic && !isPapersPage) {
      redirecting.current = true;
      router.replace("/login");
      setTimeout(() => { redirecting.current = false; }, 1000);
      return;
    }

    // Authenticated on login/register → dashboard
    if (isAuthenticated && isAuthPage) {
      redirecting.current = true;
      router.replace(user?.role === "ADMIN" ? "/admin" : "/dashboard");
      setTimeout(() => { redirecting.current = false; }, 1000);
      return;
    }

    // Non-admin on admin page → dashboard
    if (isAuthenticated && user && pathname.startsWith("/admin") && user.role !== "ADMIN") {
      redirecting.current = true;
      router.replace("/dashboard");
      setTimeout(() => { redirecting.current = false; }, 1000);
      return;
    }
  }, [isAuthenticated, isLoading, pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}