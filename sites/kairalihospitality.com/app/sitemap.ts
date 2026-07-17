import type { MetadataRoute } from "next";
import { buildSitemap } from "@kairali/seo";
import siteConfig from "../site.config.json";

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemap(siteConfig, [
    { path: "/", lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
  ]) as MetadataRoute.Sitemap;
}
