import { categorySitemap, IS_STAGING } from "../../../lib/sitemap-source";
import { SITEMAP_CATEGORIES, sitemapCategory, sitemapResponse, sitemapXml } from "../../../lib/sitemap";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return SITEMAP_CATEGORIES.map((category) => ({ category: `${category}.xml` }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ category: string }> }) {
  const category = sitemapCategory((await params).category);
  if (!category) return new Response("Not found", { status: 404 });
  return sitemapResponse(sitemapXml(categorySitemap(category)), IS_STAGING);
}
