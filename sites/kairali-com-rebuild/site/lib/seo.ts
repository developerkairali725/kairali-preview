import type { Metadata } from "next";
import { ASSET_ORIGIN, IS_PRODUCTION, SITE_NAME, SITE_URL } from "./site";
import { absolute, excerpt, pageHeading, pages, photos, familyPhotoKey, type Page } from "./content";
import { cleanRoute } from "./routes";

// Title/description policy (docs/SEO-METADATA-DECISIONS.md):
//  - live title/description kept verbatim where distinct across the site (search continuity);
//  - where the live value is shared by several URLs (e.g. 78 award pages), a descriptive
//    replacement is built from the page's own H1 and opening copy. No keywords are invented.
let dupT: Set<string> | null = null;
let dupD: Set<string> | null = null;
function dupSets() {
  if (!dupT || !dupD) {
    const t = new Map<string, number>(); const d = new Map<string, number>();
    for (const p of Object.values(pages())) {
      if (p.route.includes("?page=1") ) continue;
      t.set(p.title, (t.get(p.title) || 0) + 1); d.set(p.description, (d.get(p.description) || 0) + 1);
    }
    dupT = new Set([...t].filter(([, n]) => n > 1).map(([k]) => k));
    dupD = new Set([...d].filter(([, n]) => n > 1).map(([k]) => k));
  }
  return { dupT, dupD };
}

export function titleFor(p: Page): { title: string; changed: boolean } {
  if (p.route.split("?")[0] === "/kairali-group-profile.aspx") {
    return { title: `Our Story & Leadership | ${SITE_NAME}`, changed: true };
  }
  const { dupT } = dupSets();
  if (p.title && !dupT.has(p.title)) return { title: p.title, changed: false };
  return { title: `${pageHeading(p)} | ${SITE_NAME}`, changed: true };
}
export function descriptionFor(p: Page): { description: string; changed: boolean } {
  const { dupD } = dupSets();
  if (p.description && !dupD.has(p.description) && p.description.length > 40) return { description: p.description, changed: false };
  return { description: excerpt(p.text || p.description, 158), changed: true };
}

export type MetaInput = {
  route: string; title: string; description: string; image?: string; imageAlt?: string;
  type?: "website" | "article"; noindex?: boolean; canonical?: string | null; absoluteTitle?: boolean;
};

export function buildMetadata(m: MetaInput): Metadata {
  const url = m.canonical === null ? undefined : (m.canonical || absolute(m.route));
  const image = m.image || "/og/ahv-grounds-pond.jpg";
  const alt = m.imageAlt || "Kairali – The Ayurvedic Healing Village, Palakkad";
  const indexable = IS_PRODUCTION && !m.noindex;
  return {
    metadataBase: new URL(SITE_URL),
    title: m.absoluteTitle === false ? m.title : { absolute: m.title },
    description: m.description,
    alternates: url ? { canonical: url } : undefined,
    robots: indexable ? { index: true, follow: true } : { index: false, follow: !m.noindex },
    openGraph: {
      type: m.type || "website", url: url || absolute(m.route), siteName: SITE_NAME, title: m.title, description: m.description, locale: "en_IN",
      images: [{ url: ASSET_ORIGIN + image, width: 1200, height: 630, alt }],
    },
    twitter: { card: "summary_large_image", site: "@Kairali_Group", title: m.title, description: m.description, images: [{ url: ASSET_ORIGIN + image, alt }] },
  };
}

export function pageMetadata(p: Page, opts: Partial<MetaInput> = {}): Metadata {
  const key = familyPhotoKey(p);
  const ph = photos()[key];
  return buildMetadata({
    route: cleanRoute(p.route), title: titleFor(p).title, description: descriptionFor(p).description,
    image: ph?.og, imageAlt: ph?.alt, type: p.route.startsWith("/detail.aspx") ? "article" : "website", ...opts,
  });
}
