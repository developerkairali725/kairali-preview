import type { MetadataRoute } from "next";
import { buildRobots } from "@kairali/seo";
import siteConfig from "../site.config.json";

// STAGING LOCK (WOPS-AHV-ENGLISH-STAGING-BUILD-20260915-001): the English
// candidate is a review build, so robots.txt disallows everything. This backs
// up the authoritative X-Robots-Tag header set in next.config.ts — a header,
// unlike a meta tag, cannot be overwritten by the approved design's own
// runtime head writer.
//
// Set AHV_STAGING=0 to restore the production robots policy, which is the
// allow-all the LP lane needs (its /lp/ noindex is per-page meta-robots, and a
// robots.txt block would hide that noindex from crawlers).
const IS_STAGING = process.env.AHV_STAGING !== "0";

export default function robots(): MetadataRoute.Robots {
  if (IS_STAGING) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return buildRobots(siteConfig) as MetadataRoute.Robots;
}
