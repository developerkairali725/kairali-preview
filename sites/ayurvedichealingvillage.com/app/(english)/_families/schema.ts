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
 * WebSite SearchAction (D-20260922-37, 23 Sep 2026): points at /search/?q={search_term_string},
 * the real results page (app/(english)/search/page.tsx, server-rendered from the search
 * index — Option B-lite). Until then it was DELIBERATELY OMITTED: live pointed it at
 * `/?s={search_term_string}`, a WordPress endpoint this rebuild does not serve, and a
 * potentialAction for a URL that 404s asserts something false to a crawler.
 */
import SITE_TREE from "../../../english-candidate/site-tree.json";
import type { CandidateRoute } from "./registry";
import { routes } from "./registry";
import { imageGallery, imageObject, itemList, videoObject } from "@kairali/schema";
import OG_IMAGES from "../../../english-candidate/og-images.json";
import GALLERIES from "../../../english-candidate/galleries-2026.json";
import FAQ_VIEW from "../../../public/ahv/views/ahv-page-faqs-and-downloads-desktop.json";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { LOCALE_INFO, localizedPath, translate, localeData, type LocaleCode } from "./l10n";

/**
 * /faqs-downloads/ — the 58 question/answer pairs the page renders (<details data-q id="q-NN"> blocks written by
 * tools/repair-faq-content.mjs), read from the served desktop view at build time so the structured data can never
 * drift from the visible text. Emitted as WebPage + FAQPage with mainEntity (Yoast's live shape). Google restricts
 * FAQ rich results to government/health authorities since Aug 2023 (SEO audit 2026-09-23), so this is for answer
 * engines and parity, not a SERP accordion promise.
 */
const FAQ_ROUTE = "/faqs-downloads/";
function faqEntities(): Array<Record<string, unknown>> {
  // Localized pages read the localized FAQ view: the schema answers are the
  // SAME catalogue entries the visible <details> render (one data source).
  const t = CTX.loc === "en"
    ? (FAQ_VIEW as { template: string }).template
    : (JSON.parse(readFileSync(join(process.cwd(), "public", "ahv", "l10n", LOCALE_INFO[CTX.loc].prefix, "views", "ahv-page-faqs-and-downloads-desktop.json"), "utf8")) as { template: string }).template;
  const decode = (h: string) =>
    h.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
  const out: Array<Record<string, unknown>> = [];
  for (const m of t.matchAll(/<details data-q="\d+" id="(q-\d+)"[^>]*>([\s\S]*?)<\/details>/g)) {
    const q = decode((m[2].match(/<h3[^>]*>([\s\S]*?)<\/h3>/) || [])[1] || "");
    const a = decode(m[2].slice(m[2].indexOf("</summary>") + 10));
    if (q && a) out.push({ "@type": "Question", "@id": `${abs(FAQ_ROUTE)}#${m[1]}`, name: q, acceptedAnswer: { "@type": "Answer", text: a } });
  }
  return out;
}

/**
 * Enquiry-family routes (/contact-us/, /online-consultation/, …) render their "Common questions" from
 * public/ahv/assets/enquiry-family-data.js (route.faq.items: {q, a.text | a.tree}). The structured data reads the
 * SAME dataset — the localized copy on locale pages — so answers never drift from the visible text (SEO/AEO audit
 * 29 Sep 2026: /contact-us/ rendered six clean Q&A pairs with no FAQPage). Emitted only on self-canonical routes.
 */
type FaqTree = { k: string; v?: string; c?: FaqTree[] };
function datasetFaq(routePath: string): Array<{ q: string; a: string; i: number }> {
  const file = CTX.loc === "en"
    ? join(process.cwd(), "public", "ahv", "assets", "enquiry-family-data.js")
    : join(process.cwd(), "public", "ahv", "l10n", LOCALE_INFO[CTX.loc].prefix, "assets", "enquiry-family-data.js");
  let data: { routes?: Array<{ path: string; faq?: { items?: Array<{ q?: string; a?: { text?: string; tree?: FaqTree[] } }> } }> } | undefined;
  try {
    const w: Record<string, unknown> = {};
    new Function("window", readFileSync(file, "utf8"))(w);
    data = w.AHV_ENQUIRY as typeof data;
  } catch { return []; }
  const flat = (n: FaqTree[] = []): string => n.map((x) => (x.k === "t" ? x.v ?? "" : flat(x.c))).join("");
  const r = data?.routes?.find((x) => x.path === routePath);
  return (r?.faq?.items ?? [])
    .map((it, i) => ({ q: (it.q ?? "").replace(/\s+/g, " ").trim(), a: (it.a?.text ?? flat(it.a?.tree)).replace(/\s+/g, " ").trim(), i }))
    .filter((x) => x.q && x.a);
}
const DATASET_FAQ_ROUTES = new Set(["/contact-us/", "/online-consultation/"]);

const ORIGIN = "https://ayurvedichealingvillage.com";
/**
 * Locale context for one routeSchema() call (25 Sep 2026). Human-readable values
 * come from the accepted catalogue (the same entries the visible page renders);
 * URLs are the reviewed localized routes; entity @ids of the organization,
 * website and logo stay stable across languages.
 */
let CTX: { loc: LocaleCode; lang: string; t: (s: string) => string } = { loc: "en", lang: "en-US", t: (s) => s };
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
  return `${ORIGIN}${CTX.loc === "en" ? path : localizedPath(path, CTX.loc) ?? path}`;
}

/**
 * A short label for a crumb: the route's own title up to its first separator.
 * SEO titles here read "Contact Us | Kairali …", so the head of the title is
 * the page's own name. Nothing is invented — if a title has no separator the
 * whole title is used.
 */
function crumbName(rawTitle: string | null, fallback: string): string {
  const title = rawTitle ? CTX.t(rawTitle) : rawTitle;
  if (!title) return fallback;
  const head = title.split(/\s*[|–—]\s*/)[0].trim();
  return head || title.trim();
}

/**
 * The site tree (tools/build-site-tree.mjs): the same hierarchy the /sitemap/ page
 * and the left rail show (owner, 23 Sep 2026: one navigation, consistent everywhere).
 * path -> { section hub, ancestors, titles }.
 */
type TreeNode = { path: string | null; title: string; children: TreeNode[] };
const TREE = SITE_TREE as unknown as {
  sections: Array<{ id: string; title: string; hub: string | null; children: TreeNode[] }>;
  index: Record<string, { section: string; ancestors: string[] }>;
};
const TREE_TITLE = new Map<string, string>();
const TREE_HUB = new Map<string, string | null>();
for (const s of TREE.sections) {
  TREE_HUB.set(s.id, s.hub);
  if (s.hub) TREE_TITLE.set(s.hub, s.title);
  const walk = (list: TreeNode[]) => list.forEach((n) => { if (n.path) TREE_TITLE.set(n.path, n.title); walk(n.children); });
  walk(s.children);
}

/** Home → section hub → tree ancestors → self (the site tree); else Home → (URL parent, if a real route) → self. */
function breadcrumb(route: CandidateRoute) {
  const items: Array<Record<string, unknown>> = [
    { "@type": "ListItem", position: 1, name: CTX.t("Home"), item: abs("/") },
  ];
  const placed = TREE.index[route.path];
  if (placed) {
    const hub = TREE_HUB.get(placed.section);
    const chain = [...(hub && hub !== route.path ? [hub] : []), ...placed.ancestors.filter((a) => a !== hub)];
    for (const a of chain) items.push({ "@type": "ListItem", position: items.length + 1, name: CTX.t(TREE_TITLE.get(a) ?? a), item: abs(a) });
    items.push({ "@type": "ListItem", position: items.length + 1, name: TREE_TITLE.has(route.path) ? CTX.t(TREE_TITLE.get(route.path)!) : crumbName(route.metadata.title, route.path) });
    return { "@type": "BreadcrumbList", "@id": `${abs(route.path)}#breadcrumb`, itemListElement: items };
  }
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
    inLanguage: CTX.lang,
    "@id": `${abs(route.path)}#primaryimage`,
    url: `${ORIGIN}${src}`,
    contentUrl: `${ORIGIN}${src}`,
    width: OG.width,
    height: OG.height,
  };
}

/* ------------------------------------------------------------------ *
 * Galleries (22 Sep 2026, D-20260922-31): ImageGallery + ImageObject per
 * photograph + VideoObject per embedded facade, generated from the SAME
 * manifest the page renders from (english-candidate/galleries-2026.json,
 * written by tools/build-galleries-2026.mjs), so the markup can never say
 * something the page does not show. creditText / copyrightNotice come from
 * the manifest (the notice wording is an open owner question and is flagged
 * there, not decided here); license / acquireLicensePage are NOT emitted —
 * no licence page exists and none is invented. uploadDate / duration appear
 * only where the video register carried them.
 * ------------------------------------------------------------------ */
interface GalleryImage { src: string; width: number; height: number; alt: string; caption: string }
interface GalleryVideo { youtubeId: string; title: string; description: string; poster: { src: string }; uploadDate?: string; duration?: string }
interface GalleryChapter { id: string; title: string; images: GalleryImage[]; video: GalleryVideo | null }
interface GalleryRoute { path: string; h1: string; intro: string; hero: GalleryImage; chapters: GalleryChapter[] }
interface GalleryManifest { creditText: string; copyrightNotice: string; routes: GalleryRoute[] }

const GALLERY_MANIFEST = GALLERIES as unknown as GalleryManifest;
const GALLERY_BY_PATH = new Map(GALLERY_MANIFEST.routes.map((g) => [g.path, g]));

/** Every image the route's gallery shows — the hero first — as absolute URLs (sitemap image extension). */
export function galleryImageUrls(routePath: string): string[] {
  const g = GALLERY_BY_PATH.get(routePath);
  if (!g) return [];
  return [g.hero, ...g.chapters.flatMap((ch) => ch.images)].map((im) => `${ORIGIN}${im.src}`);
}

function galleryNodes(route: CandidateRoute, url: string): Array<Record<string, unknown>> {
  const g = GALLERY_BY_PATH.get(route.path);
  if (!g) return [];
  const all = [g.hero, ...g.chapters.flatMap((ch) => ch.images)];
  const idFor = (im: GalleryImage) => `${url}#image-${im.src.split("/").pop()!.replace(/\.webp$/, "")}`;
  const imageNodes = all.map((im, i) =>
    imageObject({
      id: idFor(im),
      contentUrl: `${ORIGIN}${im.src}`,
      // caption = the visible figcaption; description = the alt. `name` would repeat the caption verbatim.
      caption: CTX.t(im.caption),
      description: CTX.t(im.alt),
      width: im.width,
      height: im.height,
      creditText: GALLERY_MANIFEST.creditText,
      copyrightNotice: GALLERY_MANIFEST.copyrightNotice,
      // The page's own Organization node (same name the chrome prints) — a
      // reference, not a repeated inline object, so 60 images do not carry 60 copies.
      creatorId: ORG_ID,
      representativeOfPage: i === 0,
    }),
  );
  // One ItemList per chapter, listing that chapter's ImageObject @ids in order
  // (spec §6.5) — references only; the captions live once, on the ImageObjects.
  const chapters = g.chapters.map((ch) =>
    itemList({
      id: `${url}#${ch.id}`,
      name: CTX.t(ch.title),
      items: ch.images.map((im) => ({ id: idFor(im) })),
    }),
  );
  const videos = g.chapters
    .filter((ch) => ch.video)
    .map((ch) => {
      const v = ch.video as GalleryVideo;
      return videoObject({
        id: `${url}#video-${v.youtubeId}`,
        name: CTX.t(v.title),
        description: CTX.t(v.description),
        thumbnailUrl: `${ORIGIN}${v.poster.src}`,
        ...(v.uploadDate ? { uploadDate: v.uploadDate } : {}),
        ...(v.duration ? { duration: v.duration } : {}),
        embedUrl: `https://www.youtube-nocookie.com/embed/${v.youtubeId}`,
        url: `${url}#${ch.id}`,
        publisherId: ORG_ID,
        isFamilyFriendly: true,
        inLanguage: CTX.lang,
      });
    });
  const gallery = imageGallery({
    id: `${url}#gallery`,
    name: CTX.t(g.h1),
    description: CTX.t(g.intro),
    url,
    mainEntityOfPageId: url,
    inLanguage: CTX.lang,
    images: imageNodes,
    videos: videos.map((v) => ({ "@id": v["@id"] as string })),
    hasPart: chapters,
  });
  return [gallery, ...videos];
}

/**
 * The route's @graph. Shape follows the live site's valid block so the flip is
 * parity rather than a redesign of the site's entity model.
 */
export function routeSchema(route: CandidateRoute, locale: LocaleCode = "en"): Record<string, unknown> {
  CTX = locale === "en" ? { loc: "en", lang: "en-US", t: (s) => s } : { loc: locale, lang: LOCALE_INFO[locale].htmlLang, t: (s) => translate(locale, s) };
  const lmeta = locale === "en" ? null : localeData(locale)?.meta[route.path] ?? null;
  const url = locale === "en" ? route.metadata.canonical ?? abs(route.path) : abs(route.path);
  const image = primaryImage(route);

  const webPage: Record<string, unknown> = {
    "@type": "WebPage",
    "@id": url,
    url,
    name: lmeta?.title ?? route.metadata.title ?? ORG_NAME,
    isPartOf: { "@id": SITE_ID },
    breadcrumb: { "@id": `${abs(route.path)}#breadcrumb` },
    inLanguage: CTX.lang,
  };
  const desc = lmeta?.description ?? route.metadata.description;
  if (desc) webPage.description = desc;
  if (route.path === FAQ_ROUTE) {
    const faqs = faqEntities();
    if (faqs.length) { webPage["@type"] = ["WebPage", "FAQPage"]; webPage.mainEntity = faqs; }
  } else if (DATASET_FAQ_ROUTES.has(route.path) && url === abs(route.path)) {
    const faqs = datasetFaq(route.path).map((f) => ({ "@type": "Question", "@id": `${url}#faq-${f.i + 1}`, name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } }));
    if (faqs.length) { webPage["@type"] = ["WebPage", "FAQPage"]; webPage.mainEntity = faqs; }
  }
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
    url: `${ORIGIN}/`,
    name: ORG_NAME,
    publisher: { "@id": ORG_ID },
    inLanguage: CTX.lang,
    // Sitelinks search box shape (schema.org SearchAction + EntryPoint): the target is the
    // real /search/ results page, the query-input name matches the template placeholder.
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: abs("/search/") + "?q={search_term_string}" },
      "query-input": "required name=search_term_string",
    },
  });
  // Gallery routes: ImageGallery (with ImageObject nodes + chapter ItemLists) and VideoObject per facade.
  for (const node of galleryNodes(route, url)) graph.push(node);
  graph.push({
    // NABH-accredited Ayurvedic hospital (locked fact). Address, telephone and email are exactly those the
    // /contact-us/ page prints; no founding date (the site's "Since 1908" is the group's heritage line, not this
    // entity's founding) and no sameAs guesses (SEO/AEO audit 29 Sep 2026: the node carried no NAP at all).
    "@type": ["Organization", "Hospital"],
    "@id": ORG_ID,
    name: ORG_NAME,
    url: `${ORIGIN}/`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "III/73 Palayamkadu, P.O. Olassery, Kodumbu",
      addressLocality: "Palakkad",
      addressRegion: "Kerala",
      postalCode: "678551",
      addressCountry: "IN",
    },
    telephone: "+91 9555 156 156",
    email: "info@kairali.com",
    logo: {
      "@type": "ImageObject",
      inLanguage: CTX.lang,
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
