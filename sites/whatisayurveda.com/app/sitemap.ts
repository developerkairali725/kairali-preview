import type { MetadataRoute } from "next";
import { buildSitemap } from "@kairali/seo";
import siteConfig from "../site.config.json";
import { allPages } from "./lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries = [
    { path: "/", lastModified: now, changeFrequency: "weekly" as const, priority: 1 },
    ...allPages().map((p) => ({
      path: p.slug,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: p.slug === "/what-is-ayurveda" ? 0.9 : 0.7,
    })),
  ];
  return buildSitemap(siteConfig, entries) as MetadataRoute.Sitemap;
}
