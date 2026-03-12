import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Toaster } from "sonner";

const inter = Inter({
  subsets:  ["latin"],
  display:  "swap",
  variable: "--font-inter",
});

/* ─── Site Config ───────────────────────────────────────────── */
const siteConfig = {
  name:        "StudyHouse NUML",
  url:         "https://studyhouse-eight.vercel.app", // ✅ Use your actual URL
  ogImage:     "https://studyhouse-eight.vercel.app/og-image.png", // ✅ Ensure this image exists
  description: "Download NUML past papers (Midterm & Final) from 2015–2026. Free previous year papers organized by department, semester and course. No signup required."
};

/* ─── SEO Metadata ───────────────────────────────────────────── */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default: "Download NUML Past Papers 2024–2026 | StudyHouse - Midterm & Final Papers",
    template: "%s | StudyHouse NUML",
  },

  description: siteConfig.description,

  // ✅ Keywords people actually search on Google
  keywords: [
    "NUML past papers",
    "NUML university past papers",
    "NUML previous year papers",
    "NUML midterm papers",
    "NUML final term papers",
    "NUML exam papers",
    "NUML question papers",
    "NUML study notes",
    "National University of Modern Languages past papers",
    "NUML CS past papers",
    "NUML IT past papers",
    "NUML BBA past papers",
    "NUML English past papers",
    "NUML MBA past papers",
    "university past papers Pakistan",
    "free past papers download",
    "Pakistan university exam resources",
    "academic resources for students",
    "past papers Pakistan",
  ],

  authors:  [{ name: "StudyHouse NUML" }],
  creator:  "StudyHouse NUML",
  publisher: "StudyHouse NUML",

  alternates: {
    canonical: "/",
  },

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

  twitter: {
    card:        "summary_large_image",
    title:       "StudyHouse NUML — Past Papers & Exam Resources",
    description: siteConfig.description,
    images:      [siteConfig.ogImage],
  },
};

/* ─── Viewport ───────────────────────────────────────────────── */
export const viewport: Viewport = {
  themeColor:  [{ color: "#f5f3ff" }],
  colorScheme: "light",
};

/* ─── JSON-LD Structured Data ────────────────────────────────── */
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
        "https://www.google.com/search?q=StudyHouse+NUML"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+92-51-111-2222", // ← Add your real phone
        "contactType": "Customer Support",
        "areaServed": "PK",
        "availableLanguage": ["English", "Urdu"]
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
            "text": "You can download free NUML past papers from StudyHouse organized by department, semester and course."
          }
        },
        {
          "@type": "Question",
          "name": "Are NUML midterm and final papers available?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, StudyHouse provides both midterm and final term past papers for all NUML departments."
          }
        },
        {
          "@type": "Question",
          "name": "Is registration required to access papers?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No, StudyHouse allows anonymous paper browsing and downloading without any signup process."
          }
        }
      ]
    }
  ]
};

/* ─── Root Layout ────────────────────────────────────────────── */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
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
