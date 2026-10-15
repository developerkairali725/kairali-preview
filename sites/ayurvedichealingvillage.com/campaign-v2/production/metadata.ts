// Metadata and JSON-LD of the live ad routes. Unchanged from the pages they replace: canonical (the route's
// own URL, query never included), robots (indexable only on the production build, AHV_STAGING=0, exactly as
// before), the Open Graph / Twitter image and its alt (none where the replaced page had none: batch 2), the
// WebPage node and the treatment-packages breadcrumb.
// From the copy: title and description. Added: FAQPage for the FAQ the page shows (integrations/seo.ts), and a
// two-item BreadcrumbList on every other route (AHV-WB *.breadcrumb-schema, 14 Oct 2026) matching its visible
// navigation: the header logo links to the site home, and the page is named by its own visible H1 (no new copy).
// Also the site's existing Organization/Hospital entity, once per route: on the reviewed routes (REVIEWED_ENTITY_ROUTES)
// and on the routes in organization.ts ORGANIZATION_ROUTES, whose WebPage also names it as publisher (14 Oct 2026).
//
// Erasable TypeScript only (node --test imports this file).

import type { Metadata } from "next";
import type { CampaignConfig } from "../kit/types.ts";
import { faqPage, jsonLdScript } from "../integrations/seo.ts";
import { OG_IMAGE, ROUTES, SITE_ORIGIN, type ProductionSlug } from "./bindings.ts";
import { ORGANIZATION_ID, ORGANIZATION_ROUTES } from "./organization.ts";

import localeRoutes from "../../l10n/routes.json" with { type: "json" };

const SITE_NAME = "Kairali Ayurvedic Healing Village";

/**
 * AHV-WB.545.change: the "treatment in Kerala" landing page in English, German and Russian — one topic and one next step
 * (variant C, free doctor consultation, the same Palakkad hospital), each self-canonical and indexable on the same
 * terms — linked reciprocally, English as x-default. Paths from bindings.ts; no other campaign gets alternates.
 */
const TREATMENT_KERALA_CLUSTER: Readonly<Record<string, ProductionSlug>> = { en: "lp-treatment-kerala", de: "lp-behandlung-kerala", ru: "lp-treatment-kerala-ru" };
const languagesFor = (slug: ProductionSlug): Record<string, string> | undefined => {
  if (!Object.values(TREATMENT_KERALA_CLUSTER).includes(slug)) return undefined;
  const map = Object.fromEntries(Object.entries(TREATMENT_KERALA_CLUSTER).map(([locale, s]) => [locale, ROUTES[s].canonical]));
  return { ...map, "x-default": map.en };
};

// Batch003: only the 13 reviewed campaign routes. Hospital typing is owner-confirmed (30 Sep 2026);
// identity/NAP/logo match the existing main-site schema. Certificate details and MedicalClinic remain separate.
const REVIEWED_ENTITY_ROUTES: ReadonlySet<ProductionSlug> = new Set([
  "cleansing-centre", "lp-cleansing-centre", "lp-hospital-kerala", "lp-pain-management", "lp-panchakarma",
  "lp-south-india", "lp-treatment-kerala", "lp-treatment-kerala-ru", "lp-treatment-packages",
  "lp-weight-management", "south-india-cities", "treatment-kerala", "weight-management",
  // Batch004 (train D02): the six routes HOSPITAL-AUTHORITY-RESOLUTION (14 Oct 2026) moved to the same bounded scope.
  "monsoon-wellness", "rejuvenation-detox", "wellness-kerala", "brand", "lp-brand", "lp-behandlung-kerala",
]);

function reviewedOrganization(locale: string): object {
  const logoId = `${SITE_ORIGIN}/#/schema/logo/image/`;
  const logoUrl = `${SITE_ORIGIN}/ahv/assets/img/kairali-colorful-logo.png`;
  const name = "Kairali — The Ayurvedic Healing Village";
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "Hospital"], "@id": `${SITE_ORIGIN}/#organization`, name, url: `${SITE_ORIGIN}/`,
    address: {
      "@type": "PostalAddress", streetAddress: "III/73 Palayamkadu, P.O. Olassery, Kodumbu",
      addressLocality: "Palakkad", addressRegion: "Kerala", postalCode: "678551", addressCountry: "IN",
    },
    telephone: "+91 9555 156 156", email: "info@kairali.com",
    logo: {
      "@type": "ImageObject", inLanguage: locale === "en" ? "en-US" : locale, "@id": logoId,
      url: logoUrl, contentUrl: logoUrl, width: 290, height: 68, caption: name,
    },
    image: { "@id": logoId },
  };
}

/** `env` is injected in tests; robots follow the build's AHV_STAGING exactly as the old pages did. */
export function productionMetadata(slug: ProductionSlug, c: CampaignConfig, env: Record<string, string | undefined> = process.env): Metadata {
  const b = ROUTES[slug];
  const title = c.seo.title;
  // The replaced page's Open Graph image, og:locale and og:site_name (bindings.ts `og`); the R10 pages' by default.
  const og = { url: b.og?.url ?? OG_IMAGE.url, width: b.og ? b.og.width : OG_IMAGE.width, height: b.og ? b.og.height : OG_IMAGE.height, locale: b.og?.locale ?? "en_IN", siteName: b.og?.siteName ?? SITE_NAME };
  const description = c.seo.description;
  return {
    title,
    description,
    alternates: {
      canonical: b.canonical,
      // The released Monsoon page shares this existing 13-language sitemap cluster.
      ...(slug === "monsoon-wellness" ? { languages: {
        ...Object.fromEntries(Object.entries(localeRoutes.routes["/karkidaka-chikitsha-or-monsoon-wellness.html"]).map(([locale, route]) => [locale, SITE_ORIGIN + route])),
        "x-default": b.canonical,
      } } : {}),
      ...(languagesFor(slug) ? { languages: languagesFor(slug) } : {}),
    },
    robots: { index: env.AHV_STAGING === "0", follow: true },
    openGraph: {
      type: "website", locale: og.locale, siteName: og.siteName, title, description, url: b.canonical,
      images: [{ url: og.url, ...(og.width ? { width: og.width, height: og.height } : {}), ...(b.ogImageAlt ? { alt: b.ogImageAlt } : {}) }],
    },
    twitter: { card: "summary_large_image", title, description, images: [og.url] },
  };
}

export function productionJsonLd(slug: ProductionSlug, c: CampaignConfig): object[] {
  const b = ROUTES[slug];
  const page: Record<string, unknown> = {
    "@context": "https://schema.org", "@type": "WebPage", "@id": `${b.canonical}#webpage`, url: b.canonical,
    name: c.seo.title, description: c.seo.description, inLanguage: b.locale ?? "en",
    isPartOf: { "@type": "WebSite", url: `${SITE_ORIGIN}/`, name: SITE_NAME },
  };
  // Treatment packages keeps the replaced page's recorded name; every other route uses its visible H1. The German and
  // Russian routes have no approved word for "Home", so their first item is the language-neutral site name.
  page.breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: (b.locale ?? "en") === "en" ? "Home" : SITE_NAME, item: `${SITE_ORIGIN}/` },
      { "@type": "ListItem", position: 2, name: b.breadcrumbName ?? c.hero.h1, item: b.canonical },
    ],
  };
  const faq = faqPage(c, b.locale ?? "en");
  const nodes: object[] = faq ? [page, faq] : [page];
  // Train B (15 Oct 2026): C01/C02/D02 (REVIEWED_ENTITY_ROUTES) and D01 (ORGANIZATION_ROUTES) add the same entity
  // (@id #organization); cleansing-centre is in both, so the node is emitted once, as the main-site parity node.
  if (ORGANIZATION_ROUTES.has(slug)) {
    // The hospital that publishes the page; the same @id as the English graph (schema.ts ORG_ID), so one entity.
    page.publisher = { "@id": ORGANIZATION_ID };
  }
  if (REVIEWED_ENTITY_ROUTES.has(slug) || ORGANIZATION_ROUTES.has(slug)) nodes.push(reviewedOrganization(b.locale ?? "en"));
  return nodes;
}

/** The <script type="application/ld+json"> body ("<" escaped). */
export const productionJsonLdScript = (slug: ProductionSlug, c: CampaignConfig): string => jsonLdScript(productionJsonLd(slug, c));
