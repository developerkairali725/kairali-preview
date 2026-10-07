// What the live ad routes add to the copy (pages/*.ts): their unchanged URLs and SEO identity, the existing lead
// identity of their forms, the photographs, and the owner's recorded decisions. Facts only; no client-facing copy
// is written here.
// Batch 1: /ayurvedic-treatment-packages.html, /panchkarma-treatment.html. Batch 2: /pain-management.html,
// /family-ayurvedic-retreat-kerala.html.
//
// Erasable TypeScript only (node --test imports this file).

import type { GalleryCategory, ImageRef, PricingPolicy, ProductionFormProfile } from "../kit/types.ts";
import { IMAGES } from "../data/images.ts";

export const SITE_ORIGIN = "https://ayurvedichealingvillage.com";

/** Owner, 7 Oct 2026: campaign pages show no numeric prices and no rate downloads; enquiry-only quotation. */
export const PRICING_HIDDEN: PricingPolicy = {
  display: "hidden", approvedBy: "owner", date: "2026-10-07",
  rule: "Campaign pages show no numeric prices or rate-download links; fees are enquiry-only (quotation).",
};

/** The reviewed copy is British English ("programme", "personalised"). */
export const SPELLING = {
  locale: "en-GB",
  reason: "The reviewed production copy of 8 Oct 2026 (owner-correction/*.md, independent review PASS) is British English; converting it would rewrite reviewed copy.",
} as const;

export type ProductionSlug = "treatment-packages" | "panchakarma" | "pain-management" | "family-ayurvedic-retreat";

export type RouteBinding = {
  slug: ProductionSlug;
  /** Unchanged public URL (no redirect, no move). */
  route: string;
  canonical: string;
  /** Open Graph image alt text of the page this replaces, unchanged; absent where that page had none (batch 2). */
  ogImageAlt?: string;
  /** Second breadcrumb item of the page this replaces (treatment packages only had one). */
  breadcrumbName?: string;
  heroImage: ImageRef;
  mobileImage: ImageRef;
  mobileHeroQuality?: number;
  stillnessImage: ImageRef;
  /**
   * The therapy photograph beside the numbered steps: one of the route's own gallery photographs (as the kit's
   * Admission draws its photograph from the gallery), never the hero or one of the five mosaic photographs.
   */
  pathwayImage: ImageRef;
  gallery: { category: GalleryCategory; image: ImageRef }[];
  /**
   * The route's existing lead identity: fields.form_variant and the guide download, as the page it replaces, plus
   * `profile` when its existing form is not the default production form (family: the R10 familyFields form).
   */
  productionForm: { formVariant: string; downloadGuide: boolean; profile?: ProductionFormProfile };
  /**
   * false (batch 2) = the replaced page's form asked no program, month or length question. No kit ConsultBar: its
   * fixed 14/21/28-night lengths are batch 1's (these pages state no fixed duration, and the family form asks its own
   * preferred duration), and its answers would be written into the message field, which on the family form is the
   * health-conditions field. copy.programDefault then stays editorial context, never a form or lead value.
   */
  consultBar?: false;
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
    pathwayImage: img("kt-199"),
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
    pathwayImage: img("kt-202"),
    gallery: GALLERY_BASE("kt-202"),
    productionForm: { formVariant: "r10-panchakarma", downloadGuide: false },
  },
  // Batch 2. Lead identity: app/(campaign)/_traffic/TrafficLanding.tsx (R10EnquiryForm formType → `r10-${formType}`,
  // downloadGuide false). The replaced pages set no Open Graph image alt and no breadcrumb, so neither is added.
  // Hero: the registry's warm-oil therapy by two therapists (the replaced hero, a warm-oil knee therapy, is not in
  // the image registry); kt-202 stays in the gallery as on /panchkarma-treatment.html.
  "pain-management": {
    slug: "pain-management",
    route: "/pain-management.html",
    canonical: `${SITE_ORIGIN}/pain-management.html`,
    heroImage: img("kt-199"),
    mobileImage: img("kt-190"),
    stillnessImage: img("gal-post-therapy-stillness-wakem"),
    pathwayImage: img("kt-202"),
    gallery: GALLERY_BASE("kt-202"),
    productionForm: { formVariant: "r10-pain-management", downloadGuide: false, profile: "pain-management" },
    consultBar: false,
  },
  // Hero: a cottage among the palms and gardens, for a shared stay (no single patient in frame), on desktop and
  // phone. The gallery therefore has no kt-314 and takes both therapy photographs; kt-199 is the fifth mosaic
  // photograph, so the steps take kt-202.
  "family-ayurvedic-retreat": {
    slug: "family-ayurvedic-retreat",
    route: "/family-ayurvedic-retreat-kerala.html",
    canonical: `${SITE_ORIGIN}/family-ayurvedic-retreat-kerala.html`,
    heroImage: img("kt-314"),
    mobileImage: img("kt-314"),
    mobileHeroQuality: 55,
    stillnessImage: img("gal-post-therapy-stillness-wakem"),
    pathwayImage: img("kt-202"),
    gallery: [
      { category: "Villas", image: img("kt-116") },
      { category: "Grounds", image: img("wx-hero") }, { category: "Grounds", image: img("gal-poolside-rest-palakkad-2026") },
      { category: "Dining", image: img("wx-dining") },
      { category: "Therapies", image: img("kt-199") }, { category: "Therapies", image: img("kt-202") },
    ],
    productionForm: { formVariant: "r10-family-retreat", downloadGuide: false, profile: "family-retreat" },
    consultBar: false,
  },
};

/** The Open Graph image of the pages this replaces (1200×630), unchanged. */
export const OG_IMAGE = { url: `${SITE_ORIGIN}/landing/r10/og.jpg`, width: 1200, height: 630 } as const;
