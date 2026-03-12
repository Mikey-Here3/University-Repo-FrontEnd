// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Toaster } from "sonner";

/* ────────────────────────────────────────────────────────────── */
/* Fonts                                                         */
/* ────────────────────────────────────────────────────────────── */
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

/* ────────────────────────────────────────────────────────────── */
/* Site Config (SINGLE SOURCE OF TRUTH)                           */
/* ────────────────────────────────────────────────────────────── */
const siteConfig = {
  name: "StudyHouse NUML",
  url: "https://studyhouse.online",
  ogImage: "https://studyhouse.online/og-image.png",
  description:
    "Download NUML past papers (Midterm & Final) from 2015–2026. Free previous year papers organized by department, semester and course. No signup required.",
};

/* ────────────────────────────────────────────────────────────── */
/* SEO METADATA                                                   */
/* ────────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default:
      "NUML Past Papers 2024–2026 | StudyHouse – Midterm & Final Papers Download",
    template: "%s | StudyHouse NUML",
  },

  description: siteConfig.description,

  keywords: [
    "NUML past papers",
    "NUML university past papers",
    "NUML previous year papers",
    "NUML midterm papers",
    "NUML final term papers",
    "NUML exam papers",
    "NUML question papers",
    "NUML CS past papers",
    "NUML BBA past papers",
    "NUML English past papers",
    "National University of Modern Languages past papers",
    "university past papers Pakistan",
    "free past papers download",
  ],

  authors: [{ name: "StudyHouse NUML" }],
  creator: "StudyHouse NUML",
  publisher: "StudyHouse NUML",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    url: siteConfig.url,
    title: "NUML Past Papers | StudyHouse",
    description: siteConfig.description,
    siteName: "StudyHouse NUML",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "NUML Past Papers – StudyHouse",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "NUML Past Papers | StudyHouse",
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
};

/* ────────────────────────────────────────────────────────────── */
/* VIEWPORT                                                       */
/* ────────────────────────────────────────────────────────────── */
export const viewport: Viewport = {
  themeColor: [{ color: "#f5f3ff" }],
  colorScheme: "light",
};

/* ────────────────────────────────────────────────────────────── */
/* JSON‑LD STRUCTURED DATA (GOOGLE VALID)                          */
/* ────────────────────────────────────────────────────────────── */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": `${siteConfig.url}/#organization`,
      name: "StudyHouse NUML",
      url: siteConfig.url,
      description:
        "Free academic resource platform for NUML students providing past papers, midterm and final exam resources.",
      address: {
        "@type": "PostalAddress",
        addressCountry: "PK",
      },
      sameAs: [
        "https://github.com/Mikey-Here3",
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Where can I download NUML past papers?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "You can download NUML past papers for all departments from StudyHouse, organized by semester and course.",
          },
        },
        {
          "@type": "Question",
          name: "Are NUML midterm and final papers available?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Yes, StudyHouse provides both NUML midterm and final term past papers completely free.",
          },
        },
      ],
    },
  ],
};

/* ────────────────────────────────────────────────────────────── */
/* ROOT LAYOUT                                                    */
/* ────────────────────────────────────────────────────────────── */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* JSON‑LD for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      </head>

      <body
        suppressHydrationWarning
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

            <Toaster
              position="top-right"
              richColors
              closeButton
              toastOptions={{
                classNames: {
                  toast:
                    "!bg-white !border !border-violet-100 !text-slate-800 !shadow-xl !rounded-2xl",
                  title: "!font-semibold",
                },
              }}
            />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
