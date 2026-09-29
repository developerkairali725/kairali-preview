import type { MetadataRoute } from "next";
import { IS_PRODUCTION, SITE_URL } from "@/lib/site";

// Environment switch: only SITE_ENV=production is crawlable. Local and preview builds disallow all
// crawling and also send X-Robots-Tag: noindex (next.config.ts) and robots meta noindex.
export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots {
  return IS_PRODUCTION
    ? { rules: [{ userAgent: "*", allow: "/", disallow: ["/x/", "/search-results.aspx"] }], sitemap: `${SITE_URL}/sitemap.xml`, host: SITE_URL }
    : { rules: [{ userAgent: "*", disallow: "/" }] };
}
