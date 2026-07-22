import type { MetadataRoute } from "next";
import { buildSitemap } from "@kairali/seo";
import siteConfig from "../site.config.json";

// LP-only site: /lp/* is excluded from sitemaps by law (noindex lane), and no
// organic pages exist yet — the sitemap is intentionally empty until the full
// KTAHV rebuild lands its pages.
export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemap(siteConfig, []) as MetadataRoute.Sitemap;
}
