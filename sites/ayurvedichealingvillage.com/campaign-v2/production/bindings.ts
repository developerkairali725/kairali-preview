// What the two live ad routes add to the copy (content/*.json): their unchanged URLs and SEO identity, the
// existing lead identity of their forms, the photographs, and the owner's recorded decisions. Facts only; no
// client-facing copy is written here (the copy is the content worker's, in content/*.json).
//
// Erasable TypeScript only (node --test imports this file).

import type { GalleryCategory, ImageRef, PricingPolicy, SourcePreservation } from "../kit/types.ts";
import { IMAGES } from "../data/images.ts";

export const SITE_ORIGIN = "https://ayurvedichealingvillage.com";

/** Owner, 7 Oct 2026: campaign pages show no numeric prices and no rate downloads; enquiry-only quotation. */
export const PRICING_HIDDEN: PricingPolicy = {
  display: "hidden", approvedBy: "owner", date: "2026-10-07",
  rule: "Campaign pages show no numeric prices or rate-download links; fees are enquiry-only (quotation).",
};

/** Owner, 7 Oct 2026: the useful copy of the live page survives (>=95%); overrides the kit's 1200-word longForm cap. */
export const SOURCE_PRESERVATION: SourcePreservation = {
  approvedBy: "owner", date: "2026-10-07",
  rule: "At least 95% of the useful copy of the current live page is retained on the replacement page (measured against the page it replaces); this replaces the kit's 300-1200-word longForm limits for these routes only.",
  minRetention: 0.95,
};

/** The approved copy and the preserved live-page text are British English ("programme", "personalised"). */
export const SPELLING = {
  locale: "en-GB",
  reason: "The approved production copy and the preserved live-page source are British English; converting them would rewrite approved and preserved copy.",
} as const;

export type ProductionSlug = "treatment-packages" | "panchakarma";

export type RouteBinding = {
  slug: ProductionSlug;
  /** Unchanged public URL (no redirect, no move). */
  route: string;
  canonical: string;
  /** Open Graph image alt text of the page this replaces, unchanged. */
  ogImageAlt: string;
  /** Second breadcrumb item of the page this replaces (treatment packages only had one). */
  breadcrumbName?: string;
  heroImage: ImageRef;
  mobileImage: ImageRef;
  stillnessImage: ImageRef;
  gallery: { category: GalleryCategory; image: ImageRef }[];
  /** The route's existing lead identity: fields.form_variant and the guide download, as the page it replaces. */
  productionForm: { formVariant: string; downloadGuide: boolean };
};

const img = (id: string): ImageRef => {
  const ref = IMAGES[id];
  if (!ref) throw new Error(`production/bindings: unknown image ${id}`);
  return ref;
};

const GALLERY_BASE = (therapy: string): RouteBinding["gallery"] => [
  { category: "Villas", image: img("kt-116") }, { category: "Villas", image: img("kt-314") },
  { category: "Grounds", image: img("wx-hero") }, { category: "Grounds", image: img("gal-poolside-rest-palakkad-2026") },
  { category: "Dining", image: img("wx-dining") }, { category: "Therapies", image: img(therapy) },
];

export const ROUTES: Record<ProductionSlug, RouteBinding> = {
  "treatment-packages": {
    slug: "treatment-packages",
    route: "/ayurvedic-treatment-packages.html",
    canonical: `${SITE_ORIGIN}/ayurvedic-treatment-packages.html`,
    ogImageAlt: "Kairali Ayurvedic Healing Village in Palakkad, Kerala",
    breadcrumbName: "Ayurvedic treatment packages",
    heroImage: img("kt-202"),
    mobileImage: img("kt-190"),
    stillnessImage: img("gal-post-therapy-stillness-wakem"),
    gallery: GALLERY_BASE("kt-199"),
    productionForm: { formVariant: "r10-ayurvedic-treatment-packages", downloadGuide: true },
  },
  panchakarma: {
    slug: "panchakarma",
    route: "/panchkarma-treatment.html",
    canonical: `${SITE_ORIGIN}/panchkarma-treatment.html`,
    ogImageAlt: "Kairali Ayurvedic Healing Village, Palakkad",
    heroImage: img("kt-199"),
    mobileImage: img("kt-190"),
    stillnessImage: img("gal-post-therapy-stillness-wakem"),
    gallery: GALLERY_BASE("kt-202"),
    productionForm: { formVariant: "r10-panchakarma", downloadGuide: false },
  },
};

/** The Open Graph image of the pages this replaces (1200×630), unchanged. */
export const OG_IMAGE = { url: `${SITE_ORIGIN}/landing/r10/og.jpg`, width: 1200, height: 630 } as const;
