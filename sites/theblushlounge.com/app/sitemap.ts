import type { MetadataRoute } from "next";
import { buildSitemap } from "@kairali/seo";
import siteConfig from "../site.config.json";

// Full build (golden_page signed 2026-07-18 23:44:57 IST): the signed
// STRATEGY sitemap, complete.
export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemap(siteConfig, [
    { path: "/", changeFrequency: "monthly", priority: 1 },
    { path: "/portfolio", changeFrequency: "weekly", priority: 0.9 },
    { path: "/services", changeFrequency: "monthly", priority: 0.9 },
    { path: "/academy", changeFrequency: "monthly", priority: 0.8 },
    { path: "/about", changeFrequency: "monthly", priority: 0.7 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
    { path: "/journal", changeFrequency: "monthly", priority: 0.7 },
    {
      path: "/journal/makeup-colour-correction-guide",
      lastModified: "2026-08-11",
      changeFrequency: "yearly",
      priority: 0.7,
    },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/cookie-policy", changeFrequency: "yearly", priority: 0.3 },
  ]) as MetadataRoute.Sitemap;
}
