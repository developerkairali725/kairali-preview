import type { MetadataRoute } from "next";
import { buildSitemap } from "@kairali/seo";
import siteConfig from "../site.config.json";
import { CENTRES } from "./lib/centres";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return buildSitemap(siteConfig, [
    { path: "/", lastModified: now, changeFrequency: "weekly" as const, priority: 1 },
    ...CENTRES.map((c) => ({ path: `/centres/${c.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
  ]) as MetadataRoute.Sitemap;
}
