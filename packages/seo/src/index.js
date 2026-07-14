/**
 * @kairali/seo — meta, canonical, robots, sitemap, llms.txt (Checklist A6/A9/B2).
 *
 * Gate behaviour: buildMetadata THROWS on a title >60 chars or description
 * >155 chars, and on a missing description — so `pnpm build` (static
 * generation) fails instead of shipping a non-conforming page. Gates fail
 * builds; they are never advisory (CLAUDE.md rule g).
 *
 * /lp/<campaign> landing pages are noindex BY DEFAULT (Factory rule); a page
 * must opt out explicitly ({ index: true }) to be indexable under /lp/.
 *
 * hreflang comes from @kairali/i18n so completeness + reciprocity are by
 * construction, not by review.
 */

import { hreflangLanguages, localePath, declaredLocales } from "@kairali/i18n";

export const LIMITS = { title: 60, description: 155 };

/** OG image law (Brand Manual ch.08). */
export const OG_IMAGE = { width: 1200, height: 630 };

export function siteUrl(config) {
  return `https://${config.domain}`;
}

function assertLength(kind, value, max, where) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`seo: ${where} has no ${kind} — every page ships title + description (A6)`);
  }
  if (value.length > max) {
    throw new Error(
      `seo: ${where} ${kind} is ${value.length} chars (max ${max}): "${value}"`,
    );
  }
}

/**
 * Build a Next.js Metadata object for one page.
 *
 * @param {object} config site.config.json ({ domain, locales, ... })
 * @param {object} page
 * @param {string} page.title           ≤60 chars (throws otherwise)
 * @param {string} page.description     ≤155 chars (throws otherwise)
 * @param {string} [page.path="/"]      route path WITHOUT locale prefix
 * @param {string} [page.locale="en"]   this page's locale
 * @param {string} [page.siteName]      OG site_name (defaults to title)
 * @param {string} [page.ogImage]       absolute or site-relative 1200×630 asset;
 *                                      OMIT until a real asset exists — never fabricate
 * @param {boolean} [page.index]        override indexability (default: true, except /lp/*)
 * @param {"website"|"article"} [page.ogType="website"]
 */
export function buildMetadata(config, page) {
  const base = siteUrl(config);
  const path = page.path ?? "/";
  const locale = page.locale ?? "en";
  const where = `${config.domain}${path} [${locale}]`;

  assertLength("title", page.title, LIMITS.title, where);
  assertLength("description", page.description, LIMITS.description, where);
  if (!path.startsWith("/")) throw new Error(`seo: page.path must start with "/": ${where}`);
  if (!declaredLocales(config).includes(locale)) {
    throw new Error(`seo: locale "${locale}" is not declared for ${config.domain}`);
  }

  const canonical = base + localePath(path, locale);
  const isLp = path === "/lp" || path.startsWith("/lp/");
  const index = page.index ?? !isLp;
  const multiLocale = declaredLocales(config).length > 1;

  const ogImages = page.ogImage
    ? [{ url: page.ogImage, width: OG_IMAGE.width, height: OG_IMAGE.height }]
    : undefined;

  /** @type {Record<string, unknown>} */
  const metadata = {
    metadataBase: new URL(base),
    title: page.title,
    description: page.description,
    alternates: {
      canonical,
      // hreflang only where >1 locale is declared; single-locale sites emit
      // canonical only (no self-referencing one-language clusters).
      ...(multiLocale ? { languages: hreflangLanguages(config, path, { baseUrl: base }) } : {}),
    },
    robots: { index, follow: index },
    openGraph: {
      type: page.ogType ?? "website",
      url: canonical,
      siteName: page.siteName ?? page.title,
      title: page.title,
      description: page.description,
      locale: ogLocale(locale),
      ...(ogImages ? { images: ogImages } : {}),
    },
    twitter: {
      card: page.ogImage ? "summary_large_image" : "summary",
      title: page.title,
      description: page.description,
    },
  };
  return metadata;
}

/** Map a bare locale to an OG locale tag (market defaults for our audiences). */
function ogLocale(locale) {
  const map = { en: "en_IN", de: "de_DE", fr: "fr_FR", ar: "ar_AE", ru: "ru_RU" };
  return map[locale] ?? locale;
}

/**
 * robots.txt (app/robots.ts). Allow-all by default — indexability is
 * controlled per page via meta robots (so /lp/ noindex never depends on
 * robots.txt, which would BLOCK crawling and hide the noindex).
 */
export function buildRobots(config, { disallow = [] } = {}) {
  return {
    rules: [{ userAgent: "*", allow: "/", ...(disallow.length ? { disallow } : {}) }],
    sitemap: `${siteUrl(config)}/sitemap.xml`,
  };
}

/**
 * sitemap.xml (app/sitemap.ts) from a page list. Multi-locale sites emit one
 * entry per locale with reciprocal alternates. /lp/* is excluded (noindex
 * lane never appears in the sitemap).
 *
 * @param {object} config
 * @param {Array<{path:string,lastModified?:Date|string,changeFrequency?:string,priority?:number}>} pages
 */
export function buildSitemap(config, pages) {
  const base = siteUrl(config);
  const locales = declaredLocales(config);
  /** @type {Array<Record<string, unknown>>} */
  const entries = [];
  for (const page of pages) {
    if (page.path === "/lp" || page.path.startsWith("/lp/")) continue;
    for (const locale of locales) {
      entries.push({
        url: base + localePath(page.path, locale),
        ...(page.lastModified ? { lastModified: page.lastModified } : {}),
        ...(page.changeFrequency ? { changeFrequency: page.changeFrequency } : {}),
        ...(page.priority !== undefined ? { priority: page.priority } : {}),
        ...(locales.length > 1
          ? { alternates: { languages: hreflangLanguages(config, page.path, { baseUrl: base }) } }
          : {}),
      });
    }
  }
  return entries;
}

/**
 * llms.txt (B2 GEO/AI-readiness): markdown per the llmstxt.org convention —
 * H1 name, blockquote summary, canonical facts, curated links. Facts come
 * from the CALLER's verified sources (locked facts, site brief) — this
 * builder formats, it never invents.
 *
 * Serve via app/llms.txt/route.ts returning text/plain.
 *
 * @param {object} config
 * @param {{name:string, summary:string, facts?:string[],
 *          sections?: Array<{title:string, links: Array<{title:string,url:string,note?:string}>}>}} doc
 */
export function buildLlmsTxt(config, doc) {
  if (!doc.name || !doc.summary) {
    throw new Error(`seo: llms.txt for ${config.domain} needs name + summary`);
  }
  const lines = [`# ${doc.name}`, "", `> ${doc.summary}`, ""];
  if (doc.facts?.length) {
    for (const fact of doc.facts) lines.push(`- ${fact}`);
    lines.push("");
  }
  for (const section of doc.sections ?? []) {
    lines.push(`## ${section.title}`, "");
    for (const link of section.links) {
      lines.push(`- [${link.title}](${link.url})${link.note ? `: ${link.note}` : ""}`);
    }
    lines.push("");
  }
  return lines.join("\n");
}
