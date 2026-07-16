import type { MetadataRoute } from "next";
import { buildSitemap } from "@kairali/seo";
import siteConfig from "../site.config.json";
import booksData from "../content/books.json";

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemap(siteConfig, [
    { path: "/", lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    ...booksData.books.map((b) => ({
      path: `/books/${b.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: b.slug === "harmony" ? 0.9 : 0.8,
    })),
    { path: "/author", lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { path: "/press", lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { path: "/contact", lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
  ]) as MetadataRoute.Sitemap;
}
