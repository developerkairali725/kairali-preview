/**
 * AHV English candidate — per-route structured data (JSON-LD).
 *
 * WHY THIS EXISTS. It is not a missing nice-to-have, it is a REGRESSION the
 * flip would have shipped. Measured 2026-09-21 against the live site: every
 * live page emits two ld+json blocks carrying WebPage, ImageObject,
 * BreadcrumbList, WebSite and Organization. The rebuild emitted ZERO, on all
 * 254 routes and all 254 snapshots. Flipping DNS would have dropped the
 * Organization entity, breadcrumb rich results and the sitelinks searchbox
 * sitewide — on a migration whose whole purpose is absorbing the legacy
 * ranking value. Owner ruling, 2026-09-21: match live, generated per route.
 *
 * PARITY IS WITH THE LIVE SITE'S *VALID* GRAPH, NOT BUG-FOR-BUG. Two defects in
 * the live markup are deliberately not reproduced:
 *   · live emits a SECOND, hand-rolled WebPage block whose `name` contains
 *     escaped HTML ("&lt;small class=&quot;sline&quot;…"). One clean WebPage is
 *     emitted here instead.
 *   · live's deepest breadcrumb crumb is a whole marketing string — "…80%
 *     guest-trusted scientific detox… | 30,000+ Lives Transformed" — which
 *     carries a KTAHV-locked word AND two unsourced claims. Crumb names here
 *     come from the route's own title.
 * Live also invents a /programs/ breadcrumb level that does not exist as a URL.
 * A parent crumb is emitted ONLY when that route is really in the manifest.
 *
 * EVERY VALUE IS READ, NOTHING IS COMPOSED (HARD GATE 6):
 *   · title / description / canonical  — the route's own manifest metadata
 *   · primary image + 1200x630         — english-candidate/og-images.json, the
 *                                        files tools/build-og-images.mjs wrote;
 *                                        dimensions verified on disk
 *   · organisation name                — the string the approved design's own
 *                                        chrome prints as the logo's alt on
 *                                        every page
 *   · logo url + 290x68                — the chrome's own <img>, and the file's
 *                                        real canvas size, which agree
 *
 * DELIBERATELY OMITTED: the WebSite SearchAction. Live points it at
 * `/?s={search_term_string}`, a WordPress endpoint this rebuild does not serve
 * — site search is still an open item (QUESTIONS.md Q-AHV-SEARCH-CONTROL).
 * Emitting a potentialAction for a URL that 404s would be asserting something
 * false to a crawler. It lands with search, not before.
 */
import type { CandidateRoute } from "./registry";
import { routes } from "./registry";
import OG_IMAGES from "../../../english-candidate/og-images.json";

const ORIGIN = "https://ayurvedichealingvillage.com";
const LANG = "en-US";
const SITE_ID = `${ORIGIN}/#website`;
const ORG_ID = `${ORIGIN}/#organization`;
const LOGO_ID = `${ORIGIN}/#/schema/logo/image/`;

/** The name the approved design's own chrome prints, on every page, as the logo alt. */
const ORG_NAME = "Kairali — The Ayurvedic Healing Village";
/** The chrome's own logo <img>, and its real canvas size (they agree: 290x68). */
const LOGO = { url: `${ORIGIN}/ahv/assets/img/kairali-colorful-logo.png`, width: 290, height: 68 };
/** tools/build-og-images.mjs writes a 1200x630 baseline JPEG for every route. */
const OG = { width: 1200, height: 630 };

const OG_MAP = OG_IMAGES as Record<string, string>;
const BY_PATH = new Map(routes.map((r) => [r.path, r]));

/** Absolute URL for a route path, using the locked public origin. */
function abs(path: string): string {
  return `${ORIGIN}${path}`;
}

/**
 * A short label for a crumb: the route's own title up to its first separator.
 * SEO titles here read "Contact Us | Kairali …", so the head of the title is
 * the page's own name. Nothing is invented — if a title has no separator the
 * whole title is used.
 */
function crumbName(title: string | null, fallback: string): string {
  if (!title) return fallback;
  const head = title.split(/\s*[|–—]\s*/)[0].trim();
  return head || title.trim();
}

/** Home → (parent, only if it is a real route) → self. */
function breadcrumb(route: CandidateRoute) {
  const items: Array<Record<string, unknown>> = [
    { "@type": "ListItem", position: 1, name: "Home", item: abs("/") },
  ];
  if (route.path !== "/") {
    if (route.segments.length > 1) {
      const parentPath = `/${route.segments.slice(0, -1).join("/")}/`;
      const parent = BY_PATH.get(parentPath);
      // No parent route, no invented level — live's /programs/ crumb is exactly
      // that mistake, and it points at a URL the site does not serve.
      if (parent) {
        items.push({
          "@type": "ListItem",
          position: items.length + 1,
          name: crumbName(parent.metadata.title, parentPath),
          item: abs(parentPath),
        });
      }
    }
    // The current page is the last crumb and carries no `item`, per the live graph.
    items.push({
      "@type": "ListItem",
      position: items.length + 1,
      name: crumbName(route.metadata.title, route.path),
    });
  }
  return {
    "@type": "BreadcrumbList",
    "@id": `${abs(route.path)}#breadcrumb`,
    itemListElement: items,
  };
}

/** The route's share image, when tools/build-og-images.mjs generated one. */
function primaryImage(route: CandidateRoute) {
  const src = OG_MAP[route.path];
  if (!src) return null;
  return {
    "@type": "ImageObject",
    inLanguage: LANG,
    "@id": `${abs(route.path)}#primaryimage`,
    url: `${ORIGIN}${src}`,
    contentUrl: `${ORIGIN}${src}`,
    width: OG.width,
    height: OG.height,
  };
}

/**
 * The route's @graph. Shape follows the live site's valid block so the flip is
 * parity rather than a redesign of the site's entity model.
 */
export function routeSchema(route: CandidateRoute): Record<string, unknown> {
  const url = route.metadata.canonical ?? abs(route.path);
  const image = primaryImage(route);

  const webPage: Record<string, unknown> = {
    "@type": "WebPage",
    "@id": url,
    url,
    name: route.metadata.title ?? ORG_NAME,
    isPartOf: { "@id": SITE_ID },
    breadcrumb: { "@id": `${abs(route.path)}#breadcrumb` },
    inLanguage: LANG,
  };
  if (route.metadata.description) webPage.description = route.metadata.description;
  if (image) {
    webPage.primaryImageOfPage = { "@id": image["@id"] };
    webPage.image = { "@id": image["@id"] };
    webPage.thumbnailUrl = image.url;
  }

  const graph: Array<Record<string, unknown>> = [webPage];
  if (image) graph.push(image);
  graph.push(breadcrumb(route));
  graph.push({
    "@type": "WebSite",
    "@id": SITE_ID,
    url: abs("/"),
    name: ORG_NAME,
    publisher: { "@id": ORG_ID },
    inLanguage: LANG,
    // No potentialAction/SearchAction: see the header note — the endpoint does
    // not exist yet, and a crawler should not be told otherwise.
  });
  graph.push({
    "@type": "Organization",
    "@id": ORG_ID,
    name: ORG_NAME,
    url: abs("/"),
    logo: {
      "@type": "ImageObject",
      inLanguage: LANG,
      "@id": LOGO_ID,
      url: LOGO.url,
      contentUrl: LOGO.url,
      width: LOGO.width,
      height: LOGO.height,
      caption: ORG_NAME,
    },
    image: { "@id": LOGO_ID },
  });

  return { "@context": "https://schema.org", "@graph": graph };
}
