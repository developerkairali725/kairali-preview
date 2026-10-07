// The live ad routes' CampaignConfig: the reviewed copy (pages/*.ts) bound to the route facts in bindings.ts.
// Validation runs at build: copy bound to the wrong route, a doctor who is not on the current consented roster, an
// unsafe link, an in-page link the consent runtime does not measure, a price, or an unanswered question throws, so an
// incomplete page can never be built quietly.
//
// The kit fields the designed page supersedes (admission, included, chargedSeparately, stillness copy, village) are
// mirrors of `page`, kept so the shared kit code and types stay whole; the production template renders `page`.
//
// Erasable TypeScript only (node --test imports this file).

import type { CampaignConfig, DoctorRef } from "../kit/types.ts";
import { CURRENT_ROSTER, DOCTORS } from "../data/doctors.ts";
import { PRODUCTION_CAMPAIGN_FORM, PRODUCTION_PAIN_FORM, productionFamilyForm, type FormSchema } from "../forms/schema.ts";
import { richText } from "../kit/rich.ts";
import { isKnownContactHref, isKnownContactLink, MEASURED_HASHES, safeHref } from "../kit/lint/body.ts";
import { pageLinks, pageText } from "../kit/lint/page-text.ts";
import { PRICE, RATE_LINK } from "../kit/lint/pricing.ts";
import { PRICING_HIDDEN, ROUTES, SPELLING, type ProductionSlug, type RouteBinding } from "./bindings.ts";
import type { ProductionCopy } from "./copy.ts";
import { COPY } from "./pages/index.ts";

export const PRODUCTION_SLUGS: readonly ProductionSlug[] = ["treatment-packages", "panchakarma", "pain-management", "family-ayurvedic-retreat"];

class ContentError extends Error {}
function fail(path: string, why: string): never {
  throw new ContentError(`production content ${path}: ${why}`);
}

/** Registry doctors, current consented roster only (never a departed or pending doctor). */
function toDoctors(ids: readonly string[]): DoctorRef[] {
  if (!ids.length) fail("doctors", "no doctors");
  return ids.map((id, i) => {
    if (!CURRENT_ROSTER.includes(id)) fail(`doctors[${i}]`, `${id} is not on the current consented roster`);
    return DOCTORS[id] ?? fail(`doctors[${i}]`, `no registry entry for ${id}`);
  });
}

/** The route's enquiry form: the default production form, or its own (family: with the copy's health-field note). */
function toForm(binding: RouteBinding, copy: ProductionCopy): FormSchema {
  if (binding.productionForm.profile === "family-retreat") {
    const note = copy.familyFormNote?.trim() ? copy.familyFormNote : fail("familyFormNote", "the family form needs its health-field note");
    return productionFamilyForm(note);
  }
  if (copy.familyFormNote !== undefined) fail("familyFormNote", `not bound on ${binding.route} (family form only)`);
  return binding.productionForm.profile === "pain-management" ? PRODUCTION_PAIN_FORM : PRODUCTION_CAMPAIGN_FORM;
}

/**
 * Every link is safe; a tel:/mailto: link is one of the site's own contact links, showing its own text; an in-page
 * link is one the consent runtime measures (any other fragment stops measurement and the lead conversion); no link
 * leads to a tariff or rate document.
 */
function checkLinks(c: CampaignConfig): void {
  for (const { path, href, text } of pageLinks(c)) {
    if (!safeHref(href)) fail(path, `unsafe or malformed link: ${href}`);
    if (isKnownContactHref(href) && !isKnownContactLink(href, text)) fail(path, `contact link ${href} must show its own locked text, not "${text}"`);
    if (href.startsWith("#") && !MEASURED_HASHES.test(href)) fail(path, `in-page link ${href} is not measured by the consent runtime; use #enquiry`);
    if (RATE_LINK.test(href) || RATE_LINK.test(text)) fail(path, `rate/tariff link "${text}" → ${href} (owner: no rate downloads)`);
  }
}

/** Owner rule (hidden pricing): no amount anywhere in the page's copy or its FAQ. */
function checkPrices(c: CampaignConfig): void {
  const texts = [...pageText(c), ...c.faq.map((f, i) => ({ path: `faq[${i}]`, text: `${f.q} ${String(f.a)}` }))];
  for (const { path, text } of texts) {
    const m = text.match(PRICE);
    if (m) fail(path, `numeric price "${m[0]}" (owner: no prices on these pages)`);
  }
}

/** The production CampaignConfig of one live ad route. Throws on any content problem. */
export function productionCampaign(slug: ProductionSlug): CampaignConfig {
  const binding: RouteBinding = ROUTES[slug] ?? fail("slug", `unknown production route ${slug}`);
  const copy: ProductionCopy = COPY[slug] ?? fail("slug", `no copy for ${slug}`);
  if (copy.slug !== binding.slug) fail("copy.slug", `${copy.slug} is not ${binding.slug}`);
  if (copy.route !== binding.route) fail("copy.route", `${copy.route} is not ${binding.route}`);
  const p = copy.page;
  const heroImage = binding.heroImage;
  const c: CampaignConfig = {
    slug: binding.slug,
    route: binding.route,
    previewRoute: "", // not previewed under /lp-v2: these configs serve the live routes only
    defaultVariant: "A",
    variants: ["A"],
    index: false, // the kit's preview flag; the live routes keep their own robots (production/metadata.ts)
    locales: ["en"],
    translations: [{ locale: "en", review: "approved" }],
    modesty: "standard",
    wordingOverrides: [],
    production: true,
    seo: { title: copy.seo.title, description: copy.seo.description },
    adMatch: { keywords: [...copy.adMatch.keywords], adHeadlines: [...copy.adMatch.adHeadlines] },
    hero: {
      overline: copy.hero.overline, h1: copy.hero.h1, standfirst: copy.hero.standfirst,
      image: { A: heroImage, B: heroImage, C: heroImage, D: heroImage }, mobileImage: binding.mobileImage,
      ...(binding.mobileHeroQuality === undefined ? {} : { mobileQuality: binding.mobileHeroQuality }),
    },
    // Without a ConsultBar (batch 2) the copy's program name is editorial context only: no form or lead value.
    programDefault: binding.consultBar === false ? "" : copy.programDefault,
    tracking: { campaignName: binding.slug, trackId: "" },
    admission: { heading: p.pathway.heading, steps: p.pathway.steps.map((s) => ({ title: s.title, body: richText(s.body) })) },
    included: p.stay.lists.filter((l) => !l.extra).flatMap((l) => l.items),
    chargedSeparately: p.stay.lists.filter((l) => l.extra).flatMap((l) => l.items),
    stillness: { heading: p.rest.heading, body: p.rest.paragraphs.join(" "), image: binding.stillnessImage },
    doctors: toDoctors(copy.doctors),
    village: { heading: p.place.heading, body: p.place.paragraphs.map(richText).join(" ") },
    gallery: binding.gallery,
    fees: null,
    offer: null,
    faq: copy.faq.map((f, i) => ({
      q: f.q.trim() ? f.q : fail(`faq[${i}].q`, "empty question"),
      a: f.a.trim() ? f.a : fail(`faq[${i}].a`, "unanswered question"),
    })),
    longForm: "",
    pricing: PRICING_HIDDEN,
    cta: { primary: copy.cta.primary, primarySupport: copy.cta.primarySupport, secondary: copy.cta.secondary },
    productionForm: binding.productionForm,
    spelling: SPELLING,
    form: { schema: toForm(binding, copy), adapterId: "ahv-production" },
    page: { ...p, pathway: { ...p.pathway, image: binding.pathwayImage } },
    ...(binding.consultBar === false ? { consultBar: false as const } : {}),
  };
  checkLinks(c);
  checkPrices(c);
  return c;
}
