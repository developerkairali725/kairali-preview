import { IS_STAGING, ORIGIN } from "../../lib/sitemap-source";
import { sitemapIndexXml, sitemapResponse } from "../../lib/sitemap";

export const dynamic = "force-static";

export function GET() {
  return sitemapResponse(sitemapIndexXml(ORIGIN, IS_STAGING), IS_STAGING);
}
