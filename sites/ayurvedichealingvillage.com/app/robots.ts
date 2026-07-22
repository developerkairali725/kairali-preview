import type { MetadataRoute } from "next";
import { buildRobots } from "@kairali/seo";
import siteConfig from "../site.config.json";

// Allow-all robots.txt BY DESIGN: /lp/ noindex is meta-robots per page (seo
// package default under /lp/) — a robots.txt block would hide the noindex.
export default function robots(): MetadataRoute.Robots {
  return buildRobots(siteConfig) as MetadataRoute.Robots;
}
