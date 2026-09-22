import type { MetadataRoute } from "next";
import { buildSitemap } from "@kairali/seo";
import siteConfig from "../site.config.json";
import { routes } from "./(english)/_families/registry";
import { galleryImageUrls } from "./(english)/_families/schema";
import redirectMap from "../english-candidate/redirect-map.json";

// STAGING LOCK (WOPS-AHV-ENGLISH-STAGING-BUILD-20260915-001): a noindexed
// review build publishes no sitemap. The 252 approved English routes are
// wired up below and turn on with AHV_STAGING=0, so going to production is a
// flag flip rather than a rewrite. /lp/* stays excluded by law (noindex lane).
const IS_STAGING = process.env.AHV_STAGING !== "0";

export default function sitemap(): MetadataRoute.Sitemap {
  if (IS_STAGING) return [];
  // A route that canonicalises to another approved route (route-overrides.json,
  // sitemapExclude) still serves its page but is not a sitemap entry: listing
  // a URL whose canonical points elsewhere is a Search Console warning.
  //
  // A route in the protection map (english-candidate/redirect-map.json) no
  // longer serves at all — it 301s. Reading the map here rather than relying on
  // a matching sitemapExclude flag means the two can never drift: adding a
  // redirect removes the URL from the sitemap in the same edit.
  //
  // Image extension (22 Sep 2026, galleries): the eight gallery routes list
  // every photograph they render (english-candidate/galleries-2026.json, the
  // same manifest the page and its ImageGallery markup read), so Google Images
  // discovers the set without crawling the tiles. Other routes carry none.
  // Still [] under the staging lock above — nothing here runs until AHV_STAGING=0.
  const redirected = new Set(Object.keys(redirectMap.redirects));
  return buildSitemap(
    siteConfig,
    routes
      .filter((r) => !r.sitemapExclude && !redirected.has(r.path))
      .map((r) => {
        const images = galleryImageUrls(r.path);
        return images.length ? { path: r.path, images } : { path: r.path };
      }),
  ) as MetadataRoute.Sitemap;
}
