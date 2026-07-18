import type { MetadataRoute } from "next";
import { buildSitemap } from "@kairali/seo";
import siteConfig from "../site.config.json";

// Full Phase-1 sitemap (STRATEGY §1 — the indexable day-one pages).
// Phase-2 formulation pages graduate here only when written to depth.
// Legal pages are noindex and stay out.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = [
    { path: "/", changeFrequency: "weekly" as const, priority: 1 },
    { path: "/oils", changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/oils/classical-thailams", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/oils/proprietary-oils", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/oils/therapy-powders-choornams", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/for/spas-hotels-resorts", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/for/panchakarma-centres-clinics", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/for/distributors-importers", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/quality", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/how-bulk-supply-works", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/request-a-quote", changeFrequency: "monthly" as const, priority: 0.9 },
    { path: "/about", changeFrequency: "yearly" as const, priority: 0.5 },
    { path: "/contact", changeFrequency: "yearly" as const, priority: 0.5 },
  ].map((p) => ({ ...p, lastModified: now }));
  return buildSitemap(siteConfig, pages) as MetadataRoute.Sitemap;
}
