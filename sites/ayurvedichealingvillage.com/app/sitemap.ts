import { routeRobots } from "./(english)/_families/robots-policy";
import type { MetadataRoute } from "next";
import { buildSitemap } from "@kairali/seo";
import siteConfig from "../site.config.json";
import { routes } from "./(english)/_families/registry";
import { galleryImageUrls } from "./(english)/_families/schema";
import redirectMap from "../english-candidate/redirect-map.json";
import { TARGET_CODES, alternates, localizedPath, ORIGIN } from "./(english)/_families/l10n";

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
  const indexable = routes.filter((r) => !r.sitemapExclude && !redirected.has(r.path) && routeRobots(r, false).startsWith("index"));
  const english = buildSitemap(
    siteConfig,
    indexable.map((r) => {
      const images = galleryImageUrls(r.path);
      return images.length ? { path: r.path, images } : { path: r.path };
    }),
  ) as MetadataRoute.Sitemap;
  // Locale equivalents (25 Sep 2026): the same indexable set, at each locale's
  // reviewed URL (legacy German/French URLs where they are served), every entry
  // carrying the full reciprocal hreflang cluster + x-default. Routes without a
  // locale equivalent (campaign pages) simply have none — no cross-language
  // fallback URL is ever listed.
  const withAlternates = english.map((e) => {
    const path = e.url.replace(ORIGIN, "");
    const langs = alternates(path);
    return Object.keys(langs).length > 2 ? { ...e, alternates: { languages: langs } } : e;
  });
  const locales = indexable.flatMap((r) => {
    const langs = alternates(r.path);
    const images = galleryImageUrls(r.path);
    return TARGET_CODES.map((c) => localizedPath(r.path, c)).filter((p): p is string => !!p).map((p) => ({
      url: ORIGIN + p,
      ...(images.length ? { images } : {}),
      alternates: { languages: langs },
    }));
  });
  return [...withAlternates, ...locales] as MetadataRoute.Sitemap;
}
