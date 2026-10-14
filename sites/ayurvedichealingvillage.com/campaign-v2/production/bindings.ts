// What the live ad routes add to the copy (pages/*.ts): their unchanged URLs and SEO identity, the existing lead
// identity of their forms, the photographs, and the owner's recorded decisions. Facts only; no client-facing copy
// is written here.
// Batch 1: /ayurvedic-treatment-packages.html, /panchkarma-treatment.html. Batch 2: /pain-management.html,
// /family-ayurvedic-retreat-kerala.html. Remaining 20 (8 Oct 2026): REMAINING below, in four review batches of five.
//
// Erasable TypeScript only (node --test imports this file).

import type { GalleryCategory, ImageRef, PageLocale, PricingPolicy, ProductionFormProfile, Variant } from "../kit/types.ts";
import { IMAGES } from "../data/images.ts";
// Owner-approved photographs appended to the first four routes' galleries and, below, APPROVED_GALLERY_ROUTES'.
import { APPROVED_GALLERY_ADDITIONS } from "../data/gallery-images.ts";

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

export type ProductionSlug =
  | "treatment-packages" | "panchakarma" | "pain-management" | "family-ayurvedic-retreat"
  // Review batch 1
  | "monsoon-wellness" | "rejuvenation-detox" | "ayurveda-retreat" | "wellness-kerala" | "cleansing-centre"
  // Review batch 2
  | "treatment-kerala" | "south-india-cities" | "brand" | "weight-management" | "lp-south-india"
  // Review batch 3
  | "lp-hospital-kerala" | "lp-brand" | "lp-cleansing-centre" | "lp-pain-management" | "lp-panchakarma"
  // Review batch 4
  | "lp-treatment-kerala" | "lp-treatment-packages" | "lp-weight-management" | "lp-behandlung-kerala" | "lp-treatment-kerala-ru";

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
  /** The kit design variant (A Quiet Admission, B Garden Bento, C Editorial, D Direct). Default A (the first four). */
  variant?: Variant;
  /** The page language (default English): German and Russian routes render their own copy and interface. */
  locale?: PageLocale;
  /**
   * The Open Graph image of the page this replaces, unchanged (url, its recorded size where known, og:locale and
   * og:site_name as that page set them). Absent = OG_IMAGE (the R10 pages').
   */
  og?: { url: string; width?: number; height?: number; locale: string; siteName?: string };
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

/**
 * AHV-WB.025/050/077/101/147.change: a route's own share picture, 1200×630, cropped (no other edit) from one approved
 * registry photograph (data/images.ts) and described by that photograph's registry alt. og:locale and og:site_name
 * stay as before (en_IN, the default site name). Files: public/images/og/share-<slug>.jpg.
 */
const OG_OWN = (slug: ProductionSlug) => ({ url: `${SITE_ORIGIN}/images/og/share-${slug}.jpg`, width: 1200, height: 630, locale: "en_IN" });

export const ROUTES = {
  "treatment-packages": {
    slug: "treatment-packages",
    route: "/ayurvedic-treatment-packages.html",
    canonical: `${SITE_ORIGIN}/ayurvedic-treatment-packages.html`,
    ogImageAlt: img("kt-116").alt,
    og: OG_OWN("treatment-packages"),
    breadcrumbName: "Ayurvedic treatment packages",
    heroImage: img("kt-202"),
    mobileImage: img("kt-190"),
    stillnessImage: img("ahv-img-016"),
    pathwayImage: img("kt-199"),
    gallery: [...GALLERY_BASE("kt-199"), ...APPROVED_GALLERY_ADDITIONS],
    productionForm: { formVariant: "r10-ayurvedic-treatment-packages", downloadGuide: true },
  },
  panchakarma: {
    slug: "panchakarma",
    route: "/panchkarma-treatment.html",
    canonical: `${SITE_ORIGIN}/panchkarma-treatment.html`,
    ogImageAlt: img("kt-199").alt,
    og: OG_OWN("panchakarma"),
    heroImage: img("kt-199"),
    mobileImage: img("kt-190"),
    stillnessImage: img("ahv-img-016"),
    pathwayImage: img("kt-202"),
    gallery: [...GALLERY_BASE("kt-202"), ...APPROVED_GALLERY_ADDITIONS],
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
    ogImageAlt: img("kt-190").alt,
    og: OG_OWN("pain-management"),
    // Review finding (Gaurav, 8 Oct 2026): this page and /panchkarma-treatment.html showed the same hero. The desktop
    // hero is now the head-therapy portrait (its centre crop fills the near-square desktop frame) and the phone shows
    // the four-hand therapy; /panchkarma-treatment.html keeps kt-199 / kt-190. Photographs only; nothing else changed.
    heroImage: img("kt-190"),
    mobileImage: img("kt-199"),
    stillnessImage: img("ahv-img-016"),
    pathwayImage: img("kt-202"),
    gallery: [...GALLERY_BASE("kt-202"), ...APPROVED_GALLERY_ADDITIONS],
    productionForm: { formVariant: "r10-pain-management", downloadGuide: false, profile: "pain-management" },
    consultBar: false,
  },
  // Hero: a cottage among the palms and gardens, for a shared stay (no single patient in frame), on desktop and
  // phone. The gallery therefore has no kt-314 and takes both therapy photographs; kt-199 is the fifth mosaic
  // photograph, so the steps take kt-202.
  // kt-314 is the phone LCP image: at q55 its 750w WebP was 69,492 bytes and the median mobile LCP 2,562 ms. q40 is
  // 56,072 bytes for the same rendition, with no visible loss at phone size. Desktop and sizes are unchanged.
  "family-ayurvedic-retreat": {
    slug: "family-ayurvedic-retreat",
    route: "/family-ayurvedic-retreat-kerala.html",
    canonical: `${SITE_ORIGIN}/family-ayurvedic-retreat-kerala.html`,
    ogImageAlt: img("kt-314").alt,
    og: OG_OWN("family-ayurvedic-retreat"),
    heroImage: img("kt-314"),
    mobileImage: img("kt-314"),
    mobileHeroQuality: 40,
    stillnessImage: img("ahv-img-016"),
    pathwayImage: img("kt-202"),
    gallery: [
      { category: "Villas", image: img("kt-116") },
      { category: "Grounds", image: img("wx-hero") }, { category: "Grounds", image: img("gal-poolside-rest-palakkad-2026") },
      { category: "Dining", image: img("wx-dining") },
      { category: "Therapies", image: img("kt-199") }, { category: "Therapies", image: img("kt-202") },
      ...APPROVED_GALLERY_ADDITIONS,
    ],
    productionForm: { formVariant: "r10-family-retreat", downloadGuide: false, profile: "family-retreat" },
    consultBar: false,
  },
} as Record<ProductionSlug, RouteBinding>;

/** The Open Graph image of the pages this replaces (1200×630), unchanged. */
export const OG_IMAGE = { url: `${SITE_ORIGIN}/landing/r10/og.jpg`, width: 1200, height: 630 } as const;

// ── Remaining 20 (8 Oct 2026) ──────────────────────────────────────────────────────────────────────────────────
// Lead identity from the pages they replace (test/lp-v2-production-*): the specialist routes' R10 form
// (form_variant "r10-<kind>", optional gender, required country code + phone) and, everywhere else, the campaign
// enquiry form (form_variant = the route path, optional phone, guide download when the server offers one). The
// Russian route had no campaign form; it gets the campaign enquiry form under its new /lp/ path.
//
// Photographs: each page's hero is chosen for its message (therapy pages a therapy, place-led pages the village); the
// steps photograph and the gallery never repeat the hero, and the five mosaic photographs never repeat either.

const ALL_PHOTOS: { category: GalleryCategory; id: string }[] = [
  { category: "Villas", id: "kt-116" }, { category: "Villas", id: "kt-314" },
  { category: "Grounds", id: "wx-hero" }, { category: "Grounds", id: "gal-poolside-rest-palakkad-2026" },
  { category: "Dining", id: "wx-dining" },
  { category: "Therapies", id: "kt-199" }, { category: "Therapies", id: "kt-202" }, { category: "Therapies", id: "kt-190" },
];

/**
 * Every registry photograph except the hero (desktop and phone), villas first, with the steps photograph last: it is in
 * the full gallery (as on the first four routes) but never one of the five mosaic tiles.
 */
const galleryFor = (hero: string, mobile: string, steps: string): RouteBinding["gallery"] => {
  const rest = ALL_PHOTOS.filter((p) => p.id !== hero && p.id !== mobile);
  return [...rest.filter((p) => p.id !== steps), ...rest.filter((p) => p.id === steps)].map((p) => ({ category: p.category, image: img(p.id) }));
};

const OG_EN_US = (file: string) => ({ url: `${SITE_ORIGIN}/images/og/${file}`, locale: "en_US", siteName: "Kairali Ayurvedic Healing Village" });
const OG_LP = (path: string, locale = "en_IN") => ({ url: `${SITE_ORIGIN}/campaign-v110/${path}`, locale, siteName: "Kairali — The Ayurvedic Healing Village" });

/**
 * The later routes whose full gallery also ends with the approved additions (data/gallery-images.ts), batch 2 of the
 * gallery work: the twelve English routes that show the village. The others are untouched: variant D shows no gallery,
 * the final three paid routes reuse the same approved additions below.
 */
const APPROVED_GALLERY_ROUTES: ReadonlySet<ProductionSlug> = new Set<ProductionSlug>([
  "monsoon-wellness", "rejuvenation-detox", "ayurveda-retreat", "wellness-kerala", "cleansing-centre", "treatment-kerala",
  "weight-management", "lp-hospital-kerala", "lp-cleansing-centre", "lp-pain-management", "lp-treatment-kerala", "lp-treatment-packages",
  "lp-weight-management", "lp-behandlung-kerala", "lp-treatment-kerala-ru",
]);

type Spec = {
  slug: ProductionSlug; route: string; variant: Variant; hero: string; mobile?: string; pathway: string; stillness?: string;
  form: RouteBinding["productionForm"]; og?: RouteBinding["og"]; ogAlt?: string; locale?: PageLocale; mobileQuality?: number;
};
const r10 = (kind: string): RouteBinding["productionForm"] => ({ formVariant: `r10-${kind}`, downloadGuide: false, profile: "r10" });
const enquiry = (path: string): RouteBinding["productionForm"] => ({ formVariant: path, downloadGuide: true, profile: "campaign-enquiry" });

const SPECS: Spec[] = [
  // Review batch 1
  { slug: "monsoon-wellness", route: "/karkidaka-chikitsha-or-monsoon-wellness.html", variant: "C", hero: "kt-190", stillness: "ahv-img-016", pathway: "kt-202", form: r10("monsoon") },
  { slug: "rejuvenation-detox", route: "/preventive-rejuvenation-detoxification.html", variant: "C", hero: "kt-202", stillness: "ahv-img-016", pathway: "kt-199", form: r10("detox"), og: OG_OWN("rejuvenation-detox"), ogAlt: img("kt-202").alt },
  { slug: "ayurveda-retreat", route: "/ayurveda-retreat-kerala.html", variant: "B", hero: "wx-hero", pathway: "kt-199", form: r10("retreat") },
  { slug: "wellness-kerala", route: "/wellness-resort-kerala.html", variant: "B", hero: "kt-314", pathway: "kt-202", form: enquiry("/wellness-resort-kerala.html"), og: OG_EN_US("wellness-resort-kerala.html.jpg") },
  { slug: "cleansing-centre", route: "/kairali-cleansing-centre.html", variant: "A", hero: "kt-202", mobile: "kt-190", stillness: "ahv-img-016", pathway: "kt-199", form: enquiry("/kairali-cleansing-centre.html"), og: OG_EN_US("kairali-cleansing-centre.html.jpg") },
  // Review batch 2
  { slug: "treatment-kerala", route: "/treatment-in-kerala.html", variant: "A", hero: "kt-199", mobile: "kt-190", stillness: "ahv-img-016", pathway: "kt-202", form: enquiry("/treatment-in-kerala.html"), og: OG_EN_US("treatment-in-kerala.html.jpg") },
  { slug: "south-india-cities", route: "/Ayurveda_Treatment_Neo_S.India_Cities.html", variant: "D", hero: "wx-hero", pathway: "kt-199", form: enquiry("/Ayurveda_Treatment_Neo_S.India_Cities.html"), og: OG_EN_US("ayurveda_treatment_neo_s.india_cities.html.jpg") },
  { slug: "brand", route: "/Kairali_Brand_and_Competition_Neo-original.html", variant: "D", hero: "kt-314", pathway: "kt-202", form: enquiry("/Kairali_Brand_and_Competition_Neo-original.html"), og: OG_EN_US("kairali_brand_and_competition_neo-original.html.jpg") },
  { slug: "weight-management", route: "/weight-loss.html", variant: "C", hero: "kt-314", stillness: "ahv-img-016", pathway: "kt-202", form: enquiry("/weight-loss.html"), og: OG_EN_US("weight-loss.html.jpg") },
  { slug: "lp-south-india", route: "/lp/ayurveda-treatment-south-india/", variant: "D", hero: "kt-199", pathway: "kt-202", form: enquiry("/lp/ayurveda-treatment-south-india/"), og: OG_LP("ahv/assets/img/wx-welcome.webp") },
  // Review batch 3
  { slug: "lp-hospital-kerala", route: "/lp/ayurvedic-hospital-kerala/", variant: "A", hero: "wx-hero", stillness: "ahv-img-016", pathway: "kt-199", form: enquiry("/lp/ayurvedic-hospital-kerala/"), og: OG_LP("ahv/assets/img/wx-hero.webp") },
  { slug: "lp-brand", route: "/lp/kairali-brand/", variant: "D", hero: "wx-hero", pathway: "kt-202", form: enquiry("/lp/kairali-brand/"), og: OG_LP("ahv/assets/img/wx-hero.webp") },
  { slug: "lp-cleansing-centre", route: "/lp/kairali-cleansing-centre/", variant: "A", hero: "kt-190", stillness: "ahv-img-016", pathway: "kt-202", form: enquiry("/lp/kairali-cleansing-centre/"), og: OG_LP("images/therapy-panchakarma.jpg") },
  // Not kt-199: /pain-management.html and /panchkarma-treatment.html already share that hero (review finding, 8 Oct).
  { slug: "lp-pain-management", route: "/lp/pain-management/", variant: "A", hero: "kt-202", mobile: "kt-190", stillness: "ahv-img-016", pathway: "kt-199", form: enquiry("/lp/pain-management/"), og: OG_LP("images/therapy-pain-management.jpg") },
  { slug: "lp-panchakarma", route: "/lp/panchkarma-treatment/", variant: "D", hero: "kt-202", pathway: "kt-199", form: enquiry("/lp/panchkarma-treatment/"), og: OG_LP("images/consultation-pulse.webp") },
  // Review batch 4
  // AHV-WB.457.change: the phone's small C cover shows the registry villa photograph kt-314 (no single patient in frame)
  // instead of the therapy photograph; desktop keeps kt-199. As on every route with a phone override, the gallery omits
  // the phone hero, so the mosaic never repeats it.
  { slug: "lp-treatment-kerala", route: "/lp/treatment-in-kerala/", variant: "C", hero: "kt-199", mobile: "kt-314", stillness: "ahv-img-016", pathway: "kt-202", form: enquiry("/lp/treatment-in-kerala/"), og: OG_LP("ahv/assets/img/wx-pathway.jpg") },
  { slug: "lp-treatment-packages", route: "/lp/treatment-packages/", variant: "B", hero: "kt-116", pathway: "kt-199", form: enquiry("/lp/treatment-packages/"), og: OG_LP("images/therapy-abhyanga.jpg") },
  // Phone LCP is the landscape wx-dining rendition (CI image-delivery: w750 q75, 53,382 bytes, est. 14,367 saveable);
  // q40 as on family-ayurvedic-retreat's landscape phone hero. Same photo and crop; desktop unchanged; q40 bytes unmeasured.
  { slug: "lp-weight-management", route: "/lp/weight-loss/", variant: "A", hero: "wx-dining", stillness: "ahv-img-016", pathway: "kt-202", form: enquiry("/lp/weight-loss/"), og: OG_LP("images/consultation-pulse.webp"), mobileQuality: 40 },
  { slug: "lp-behandlung-kerala", route: "/lp/behandlung-in-kerala/", variant: "C", hero: "kt-190", stillness: "ahv-img-016", pathway: "kt-199", locale: "de", form: enquiry("/lp/behandlung-in-kerala/"), og: OG_LP("images/patient-villa-maharaja.jpg", "de_DE") },
  // New campaign path (owner); /treatment-in-kerala-russian.html redirects here (next.config.ts), query string kept.
  { slug: "lp-treatment-kerala-ru", route: "/lp/treatment-in-kerala-russian/", variant: "C", hero: "kt-202", stillness: "ahv-img-016", pathway: "kt-199", locale: "ru", form: enquiry("/lp/treatment-in-kerala-russian/"), og: { url: `${SITE_ORIGIN}/images/og/treatment-in-kerala-russian.html.jpg`, width: 1200, height: 630, locale: "ru_RU", siteName: "Kairali Ayurvedic Healing Village" } },
];

for (const sp of SPECS) {
  const hero = img(sp.hero);
  ROUTES[sp.slug] = {
    slug: sp.slug,
    route: sp.route,
    canonical: `${SITE_ORIGIN}${sp.route}`,
    heroImage: hero,
    mobileImage: img(sp.mobile ?? sp.hero),
    ...(sp.mobileQuality === undefined ? {} : { mobileHeroQuality: sp.mobileQuality }),
    stillnessImage: img(sp.stillness ?? "gal-post-therapy-stillness-wakem"),
    pathwayImage: img(sp.pathway),
    gallery: [...galleryFor(sp.hero, sp.mobile ?? sp.hero, sp.pathway), ...(APPROVED_GALLERY_ROUTES.has(sp.slug) ? APPROVED_GALLERY_ADDITIONS : [])],
    productionForm: sp.form,
    consultBar: false,
    variant: sp.variant,
    ...(sp.locale ? { locale: sp.locale } : {}),
    ...(sp.og ? { og: sp.og } : {}),
    ...(sp.ogAlt ? { ogImageAlt: sp.ogAlt } : {}),
  };
}

/**
 * Owner decision 10 (14 Oct 2026, OWNER-DECISIONS-20261014-ANSWERS.json "10-photos"; rows AHV-WB.005 hero/how, .060,
 * .400 how, .403, .445 hero/how): the bare-back therapy hero (desktop and phone) and "How it works" photographs on these
 * routes become pulse-check, reception or village photographs with no identifiable person, from the existing image
 * bank (data/images.ts). Applied after the routes are built, so every existing gallery entry and the five mosaic tiles
 * stay exactly as they were. A new steps photograph is appended once at the very end of the route's full gallery (every
 * steps photograph is one of the route's gallery photographs, outside the mosaic; category per STEP_CATEGORY); a new
 * hero is never in the gallery. On each route the hero and the steps photograph differ; sibling heroes differ
 * (/pain-management.html vs /lp/pain-management/). Reversible: delete a route's entry.
 */
export const PHOTO_PICKS_20261014: Readonly<Partial<Record<ProductionSlug, { hero?: string; pathway?: string; keepPhone?: true }>>> = {
  // Train B (15 Oct 2026): AHV-WB.005.hero-image and AHV-WB.403.change are excluded (rejected by the candidate's
  // independent REVIEW.json), so treatment-packages and lp-pain-management keep their prior heroes; their steps rows stay.
  "treatment-packages": { pathway: "ahv-img-045" }, // AHV-WB.005.how-image
  "pain-management": { hero: "ahv-img-034" }, // AHV-WB.060.change (partial: no person-free doctor photo left for both siblings)
  "lp-pain-management": { pathway: "ahv-img-026" }, // AHV-WB.400.how-image
  // Train B (15 Oct 2026): the phone cover stays Train A's AHV-WB.457.change villa photograph kt-314 (already no
  // bare-back photograph), so the decision-10 hero applies to the desktop hero only on this route.
  "lp-treatment-kerala": { hero: "ahv-img-012", pathway: "ahv-img-045", keepPhone: true }, // AHV-WB.445.hero-image, AHV-WB.445.how-image
};
/** Gallery category of an appended steps photograph: the pulse check with the therapies (as the approved consultation-room
 *  photo ahv-img-033), the reception lounge with the grounds (its owner-approved placement, "The hospital and its grounds"). */
const STEP_CATEGORY: Readonly<Record<string, GalleryCategory>> = { "ahv-img-045": "Therapies", "ahv-img-026": "Grounds" };
for (const [slug, pick] of Object.entries(PHOTO_PICKS_20261014) as [ProductionSlug, { hero?: string; pathway?: string; keepPhone?: true }][]) {
  const r = ROUTES[slug];
  if (pick.hero) { r.heroImage = img(pick.hero); if (!pick.keepPhone) r.mobileImage = img(pick.hero); }
  if (pick.pathway) {
    r.pathwayImage = img(pick.pathway);
    const category = STEP_CATEGORY[pick.pathway];
    if (!category) throw new Error(`production/bindings: no gallery category for steps photograph ${pick.pathway}`);
    r.gallery = [...r.gallery, { category, image: r.pathwayImage }];
  }
}

/** The 20 routes added on 8 Oct 2026, in their four review batches of five. */
export const REVIEW_BATCHES: readonly (readonly ProductionSlug[])[] = [
  SPECS.slice(0, 5).map((x) => x.slug), SPECS.slice(5, 10).map((x) => x.slug),
  SPECS.slice(10, 15).map((x) => x.slug), SPECS.slice(15, 20).map((x) => x.slug),
];
