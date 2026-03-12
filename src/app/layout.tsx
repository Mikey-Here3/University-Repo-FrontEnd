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

/* ─── Site Config ────────────────────────────────────────────── */
const siteConfig = {
  name:        "StudyHouse NUML",
  url:         "https://studyhouse.online", // ← your real URL
  ogImage:     "https://studyhouse.online/og-image.png",
description:
"Download NUML past papers (Midterm & Final) from 2015–2026. Free previous year papers organized by department, semester and course. No signup required."
/* ─── SEO Metadata ───────────────────────────────────────────── */
export const metadata: Metadata = {
  // ✅ metadataBase is REQUIRED for og:image and canonical URLs to work
  metadataBase: new URL(siteConfig.url),

  title: {
default: "NUML Past Papers 2024–2026 | StudyHouse - Midterm & Final Papers Download"
  template: "%s | StudyHouse NUML",
  },

  description: siteConfig.description,

  // ✅ Keywords people actually search on Google
  keywords: [
    // High intent NUML specific searches
    "NUML past papers",
    "NUML university past papers",
    "NUML previous year papers",
    "NUML midterm papers",
    "NUML final term papers",
    "NUML exam papers",
    "NUML question papers",
    "NUML study notes",
    "National University of Modern Languages past papers",

    // Department specific
    "NUML CS past papers",
    "NUML IT past papers",
    "NUML BBA past papers",
    "NUML English past papers",
    "NUML MBA past papers",

    // General academic searches
    "university past papers Pakistan",
    "free past papers download",
    "Pakistan university exam resources",
    "academic resources for students",
    "past papers Pakistan",
  ],

  authors:  [{ name: "StudyHouse NUML" }],
  creator:  "StudyHouse NUML",
  publisher: "StudyHouse NUML",

  // ✅ Canonical URL — prevents duplicate content penalty
  alternates: {
    canonical: "/",
  },

  // ✅ Tells Google to index and follow all links
  robots: {
    index:          true,
    follow:         true,
    googleBot: {
      index:               true,
      follow:              true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet":       -1,
    },
  },

  // ✅ Open Graph — shows rich preview on WhatsApp, Facebook, LinkedIn
  openGraph: {
    type:        "website",
    locale:      "en_US",
    url:         siteConfig.url,
    title:       "StudyHouse NUML — Past Papers, Notes & Exam Resources",
    description: siteConfig.description,
    siteName:    "StudyHouse NUML",
    images: [
      {
        url:    siteConfig.ogImage,
        width:  1200,
        height: 630,
        alt:    "StudyHouse NUML — Past Papers & Academic Resources",
      },
    ],
  },

  // ✅ Twitter/X card
  twitter: {
    card:        "summary_large_image",
    title:       "StudyHouse NUML — Past Papers & Exam Resources",
    description: siteConfig.description,
    images:      [siteConfig.ogImage],
  },

  // ✅ Verification — add these after verifying in Google Search Console
  // verification: {
  //   google: "your-google-verification-code",
  // },
};

/* ─── Viewport ───────────────────────────────────────────────── */
export const viewport: Viewport = {
  themeColor:  [{ color: "#f5f3ff" }],
  colorScheme: "light",
};

/* ─── JSON-LD Structured Data ────────────────────────────────── */
// This makes Google show rich results — star ratings, breadcrumbs etc.
// app/layout.tsx - Add课程-specific schema
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "name": "StudyHouse NUML",
      "url": siteConfig.url,
      "description": "Academic resource platform for NUML students providing past papers, study notes and exam resources",
      "sameAs": [
        "https://github.com/Mikey-Here3",
        "https://linkedin.com/in/your-linkedin"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1-555-000-0000",
        "contactType": "Support",
        "areaServed": "PK",
        "availableLanguage": ["English", "Urdu"]
      }
    },
    
    // For each department page, add:
    {
      "@type": "Course",
      "name": "Computer Science",
      "description": "Past papers, study materials and exam resources for NUML Computer Science students",
      "hasPart": {
        "@type": "ScholarlyArticle",
        "name": "CS Past Papers Archive",
        "url": `${siteConfig.url}/departments/cse`,
        "about": {
          "@type": "=",
          "text": "http://dbpedia.org/resource/Computer_Sci"
        }
      }
    },
    
    // Add Exam paper schema per paper page:
    {
      "@type": "Course",
      "name": "Data Structures 2024",
      "credentialScale": "Past Paper",
      "provider": {
        "@type": "EducationalOrganization",
        "name": "StudyHouse NUML"
      }
    },
    {
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Where can I download NUML past papers?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can download free NUML past papers from StudyHouse organized by department and semester."
      }
    },
    {
      "@type": "Question",
      "name": "Are NUML midterm and final papers available?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, StudyHouse provides both midterm and final term past papers for NUML students."
      }
    }
  ]
}
  ]
};

/* ─── Root Layout ────────────────────────────────────────────── */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="" suppressHydrationWarning>
      <head>
        {/* ✅ JSON-LD injected into <head> for Google to read */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
              expand={false}
              closeButton
              toastOptions={{
                classNames: {
                  toast:       "!bg-white !border !border-violet-100 !text-slate-800 !shadow-xl !shadow-violet-100/50 !rounded-2xl",
                  title:       "!text-slate-800 !font-semibold",
                  description: "!text-slate-500",
                  closeButton: "!bg-violet-50 !border !border-violet-200 !text-violet-400 hover:!text-violet-600",
                  success:     "!border-emerald-200 !bg-emerald-50",
                  error:       "!border-red-200 !bg-red-50",
                  warning:     "!border-amber-200 !bg-amber-50",
                  info:        "!border-blue-200 !bg-blue-50",
                },
              }}
            />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
