import type { MetadataRoute } from "next";
import { buildSitemap } from "@kairali/seo";
import siteConfig from "../site.config.json";

// Golden page only — /products/*, /about, /contact join at full build
// (STRATEGY §1); /privacy is noindex boilerplate and stays out of the sitemap.
export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemap(siteConfig, [
    { path: "/", lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
  ]) as MetadataRoute.Sitemap;
}
