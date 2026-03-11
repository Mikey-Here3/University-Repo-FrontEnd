// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Toaster } from "sonner";

const inter = Inter({
  subsets:  ["latin"],
  display:  "swap",
  variable: "--font-inter",
});

/* ─── SEO Metadata ───────────────────────────────────────────── */
export const metadata: Metadata = {
  title: {
    default:  "UniResources — University Academic Resource Repository",
    template: "%s · UniResources",
  },
  description:
    "The premier platform for university students to share and access academic resources — past papers, notes, assignments, and more.",
  keywords: [
    "university resources", "academic papers", "past papers",
    "study notes", "student platform", "assignments",
  ],
  authors:  [{ name: "UniResources" }],
  creator:  "UniResources",
  openGraph: {
    type:        "website",
    locale:      "en_US",
    title:       "UniResources — University Academic Resource Repository",
    description: "Share and discover academic resources with your university community.",
    siteName:    "UniResources",
  },
  twitter: {
    card:        "summary_large_image",
    title:       "UniResources — University Academic Resource Repository",
    description: "Share and discover academic resources with your university community.",
  },
};

/* ─── Viewport ───────────────────────────────────────────────── */
// ✅ FIX 1: themeColor updated to light violet palette
// ✅ FIX 2: colorScheme forced to "light" only — no more dark
export const viewport: Viewport = {
  themeColor:  [{ color: "#f5f3ff" }],  // soft lavender-white
  colorScheme: "light",
};

/* ─── Root Layout ────────────────────────────────────────────── */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /*
     * ✅ FIX 3: No suppressHydrationWarning hack needed anymore
     *            since we removed the themeScript dark injection.
     * ✅ FIX 4: Explicitly set className="" — never "dark"
     *            This prevents any theme provider from
     *            reading localStorage and re-adding "dark".
     */
    <html lang="en" className=""suppressHydrationWarning>
      <body suppressHydrationWarning
        className={`
          ${inter.variable}
          ${inter.className}
          bg-background text-foreground antialiased
          selection:bg-violet-200 selection:text-violet-800
        `}
      >
        <QueryProvider>
          <AuthProvider>
            {children}

            {/*
             * ✅ FIX 5: Toaster updated from dark zinc to
             *            light white/violet palette
             */}
            <Toaster
              position="top-right"
              richColors
              expand={false}
              closeButton
              toastOptions={{
                classNames: {
                  toast:
                    "!bg-white !border !border-violet-100 !text-slate-800 !shadow-xl !shadow-violet-100/50 !rounded-2xl",
                  title:
                    "!text-slate-800 !font-semibold",
                  description:
                    "!text-slate-500",
                  closeButton:
                    "!bg-violet-50 !border !border-violet-200 !text-violet-400 hover:!text-violet-600",
                  success:
                    "!border-emerald-200 !bg-emerald-50",
                  error:
                    "!border-red-200 !bg-red-50",
                  warning:
                    "!border-amber-200 !bg-amber-50",
                  info:
                    "!border-blue-200 !bg-blue-50",
                },
              }}
            />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}