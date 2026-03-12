
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://studyhouse-eight.vercel.app";
  return [
    { url: base,                  lastModified: new Date(), priority: 1.0, changeFrequency: "weekly" },
    { url: `${base}/papers`,      lastModified: new Date(), priority: 0.9, changeFrequency: "daily"  },
    { url: `${base}/departments`, lastModified: new Date(), priority: 0.8, changeFrequency: "weekly" },
    { url: `${base}/about`,       lastModified: new Date(), priority: 0.5, changeFrequency: "monthly"},
  ];
}
