// Metadata and JSON-LD of the live ad routes. Unchanged from the pages they replace: canonical (the route's
// own URL, query never included), robots (indexable only on the production build, AHV_STAGING=0, exactly as
// before), the Open Graph / Twitter image and its alt (none where the replaced page had none: batch 2), the
// WebPage node and the treatment-packages breadcrumb.
// From the copy: title and description. Added: FAQPage for the FAQ the page shows (integrations/seo.ts).
//
// Erasable TypeScript only (node --test imports this file).

import type { Metadata } from "next";
import type { CampaignConfig } from "../kit/types.ts";
import { faqPage, jsonLdScript } from "../integrations/seo.ts";
import { OG_IMAGE, ROUTES, SITE_ORIGIN, type ProductionSlug } from "./bindings.ts";

import localeRoutes from "../../l10n/routes.json" with { type: "json" };

const SITE_NAME = "Kairali Ayurvedic Healing Village";

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
  if (b.breadcrumbName) {
    page.breadcrumb = {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_ORIGIN}/` },
        { "@type": "ListItem", position: 2, name: b.breadcrumbName, item: b.canonical },
      ],
    };
  }
  const faq = faqPage(c, b.locale ?? "en");
  return faq ? [page, faq] : [page];
}

/** The <script type="application/ld+json"> body ("<" escaped). */
export const productionJsonLdScript = (slug: ProductionSlug, c: CampaignConfig): string => jsonLdScript(productionJsonLd(slug, c));
