import type { MetadataRoute } from "next";
import { buildSitemap } from "@kairali/seo";
import siteConfig from "../site.config.json";
import { CATEGORIES, TRADE_LANES } from "./_lib/catalog";

// FULL-SITE sitemap (golden_page signed; STRATEGY §1). LAW (§6.2): placeholder
// PDPs (/equipment/<category>/sku-placeholder-00N) are noindex and EXCLUDED
// here until real SKUs replace them — category pages ARE indexable (their
// content is real and mined).
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: "weekly" | "monthly" = "weekly") => ({
    path,
    lastModified: now,
    changeFrequency,
    priority,
  });
  return buildSitemap(siteConfig, [
    page("/", 1),
    page("/equipment", 0.9),
    ...CATEGORIES.map((c) => page(`/equipment/${c.slug}`, 0.8)),
    page("/trade", 0.7),
    ...TRADE_LANES.map((l) => page(`/trade/${l.slug}`, 0.7)),
    page("/request-a-quote", 0.9),
    page("/about", 0.5, "monthly"),
    page("/manufacturing", 0.6, "monthly"),
    page("/certifications", 0.5, "monthly"),
    page("/faq", 0.6),
    page("/contact", 0.5, "monthly"),
    page("/privacy", 0.1, "monthly"),
    page("/terms", 0.1, "monthly"),
    page("/cookie-policy", 0.1, "monthly"),
  ]) as MetadataRoute.Sitemap;
}
