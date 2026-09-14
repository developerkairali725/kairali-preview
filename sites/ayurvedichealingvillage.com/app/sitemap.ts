import type { MetadataRoute } from "next";
import { buildSitemap } from "@kairali/seo";
import siteConfig from "../site.config.json";
import { routes } from "./(english)/_families/registry";

// STAGING LOCK (WOPS-AHV-ENGLISH-STAGING-BUILD-20260915-001): a noindexed
// review build publishes no sitemap. The 252 approved English routes are
// wired up below and turn on with AHV_STAGING=0, so going to production is a
// flag flip rather than a rewrite. /lp/* stays excluded by law (noindex lane).
const IS_STAGING = process.env.AHV_STAGING !== "0";

export default function sitemap(): MetadataRoute.Sitemap {
  if (IS_STAGING) return [];
  return buildSitemap(
    siteConfig,
    routes.map((r) => ({ path: r.path })),
  ) as MetadataRoute.Sitemap;
}
