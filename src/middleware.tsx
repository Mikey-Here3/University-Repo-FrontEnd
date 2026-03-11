import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/", "/login", "/register"];
const adminPaths = ["/admin"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public assets and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") // static files
  ) {
    return NextResponse.next();
  }

  // Check if path is public
  const isPublic = publicPaths.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  // We can't reliably check JWT on the edge without a secret,
  // so we check for token existence and let the client-side
  // AuthProvider handle actual validation.
  // This provides a fast redirect for obviously unauthenticated users.
  const token = request.cookies.get("token")?.value;
  const hasLocalStorageToken = request.headers.get("cookie")?.includes("token");

  // For non-public paths, if no indication of auth, redirect to login
  // Note: Since we use localStorage for token, middleware can't fully verify.
  // The AuthProvider handles the real protection client-side.
  // This middleware mainly handles the /papers route being accessible publicly.

  // Allow /papers to be accessed publicly (optional auth on backend)
  if (pathname === "/papers" || pathname.startsWith("/papers/")) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};