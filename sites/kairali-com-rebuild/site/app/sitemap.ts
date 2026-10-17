import type { MetadataRoute } from "next";
import { pages } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

// Canonical, indexable HTML pages only. Excluded: /kairali-blog.aspx?page=1 (canonicalises to the base URL),
// /search-results.aspx (noindex utility) and documents (historical editions; see docs/SEO-METADATA-DECISIONS.md).
// No <lastmod>: the live server sent no Last-Modified and content dates are not known per page.
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  return Object.keys(pages())
    .filter((r) => r !== "/kairali-blog.aspx?page=1")
    .sort()
    // Next's sitemap serializer writes URL strings directly into <loc>. Escape query
    // separators so routes such as `detail.aspx?page=...&category=...` remain valid XML.
    .map((r) => ({ url: SITE_URL + (r === "/" ? "/" : r.replace(/&/g, "&amp;")) }));
}
