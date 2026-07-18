import type { MetadataRoute } from "next";
import { buildSitemap } from "@kairali/seo";
import siteConfig from "../site.config.json";

// Full Phase-1 sitemap (STRATEGY §1 — the indexable day-one pages).
// Phase-2 dosage-form pages graduate here only when written to depth.
// Legal pages are noindex and stay out.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = [
    { path: "/", changeFrequency: "weekly" as const, priority: 1 },
    { path: "/services/private-label", changeFrequency: "monthly" as const, priority: 0.9 },
    { path: "/services/third-party-manufacturing", changeFrequency: "monthly" as const, priority: 0.9 },
    { path: "/services/loan-licence", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/products", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/products/oils", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/products/cosmetics", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/products/medicines", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/products/shampoos-soaps", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/facility", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/quality", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/how-it-works", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/start-your-project", changeFrequency: "monthly" as const, priority: 0.9 },
    { path: "/about", changeFrequency: "yearly" as const, priority: 0.5 },
    { path: "/contact", changeFrequency: "yearly" as const, priority: 0.5 },
  ].map((p) => ({ ...p, lastModified: now }));
  return buildSitemap(siteConfig, pages) as MetadataRoute.Sitemap;
}
