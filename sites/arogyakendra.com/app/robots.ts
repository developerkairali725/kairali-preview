import type { MetadataRoute } from "next";
import { buildRobots } from "@kairali/seo";
import siteConfig from "../site.config.json";

export default function robots(): MetadataRoute.Robots {
  return buildRobots(siteConfig) as MetadataRoute.Robots;
}
