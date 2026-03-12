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
  url:         "https://studyhouse-eight.vercel.app", // ← your real URL
  ogImage:     "https://studyhouse-eight.vercel.app/og-image.png",
  description: "Free past papers, notes, midterm & final term resources for NUML university students. Download previous year question papers organized by department, course and semester.",
};

/* ─── SEO Metadata ───────────────────────────────────────────── */
export const metadata: Metadata = {
  // ✅ metadataBase is REQUIRED for og:image and canonical URLs to work
  metadataBase: new URL(siteConfig.url),

  title: {
    default:  "StudyHouse NUML — Past Papers, Notes & Exam Resources",
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
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    // ✅ Website entity
    {
      "@type":           "WebSite",
      "@id":             `${siteConfig.url}/#website`,
      url:               siteConfig.url,
      name:              "StudyHouse NUML",
      description:       siteConfig.description,
      inLanguage:        "en-US",
      potentialAction: {
        "@type":       "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },

    // ✅ Organization entity
    {
      "@type":       "Organization",
      "@id":         `${siteConfig.url}/#organization`,
      name:          "StudyHouse NUML",
      url:           siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url:     `${siteConfig.url}/logo.png`,
      },
      description:   "Free academic resource platform for NUML university students",
      address: {
        "@type":           "PostalAddress",
        addressCountry:    "PK",
        addressLocality:   "Islamabad",
      },
      sameAs: [
        "https://github.com/Mikey-Here3",
      ],
    },

    // ✅ EducationalOrganization — perfect schema type for your site
    {
      "@type":       "EducationalOrganization",
      name:          "StudyHouse NUML",
      url:           siteConfig.url,
      description:   "Academic resource repository for NUML students",
      educationalCredentialAwarded: "Past Papers, Study Notes, Exam Resources",
      address: {
        "@type":         "PostalAddress",
        addressCountry:  "PK",
      },
    },
  ],
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
