import type { MetadataRoute } from "next";
import { buildSitemap } from "@kairali/seo";
import siteConfig from "../site.config.json";

// `lastModified` reflects the factual metadata/entity revision shipped on
// 2026-08-27. Google ignores priority/change-frequency hints, so the sitemap
// carries only canonical URLs and truthful modification dates.
export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemap(siteConfig, [
    { path: "/", lastModified: "2026-08-27" },
    { path: "/portfolio", lastModified: "2026-08-27" },
    { path: "/services", lastModified: "2026-08-27" },
    { path: "/academy", lastModified: "2026-08-27" },
    { path: "/about", lastModified: "2026-08-27" },
    { path: "/contact", lastModified: "2026-08-27" },
    { path: "/journal", lastModified: "2026-08-27" },
    { path: "/journal/makeup-colour-correction-guide", lastModified: "2026-08-27" },
    { path: "/privacy", lastModified: "2026-08-27" },
    { path: "/cookie-policy", lastModified: "2026-08-27" },
  ]) as MetadataRoute.Sitemap;
}
