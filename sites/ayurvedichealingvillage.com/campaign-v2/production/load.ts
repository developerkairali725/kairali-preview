// The live ad routes' CampaignConfig: the content worker's frozen copy (content/*.json, verbatim) bound to the
// route facts in bindings.ts. Validation is strict and runs at build: a missing field, an unknown block type, a
// price where pricing is hidden, or an unknown doctor throws, so an incomplete page can never be built quietly.
//
// Not rendered: copy.longForm (superseded archival text; the structured body replaces it), and the internal
// metadata (source, implementationContract, wordCounts, verdict, claimDispositions, …).
//
// Batch 2 adds two route-bound copy fields, read only where the binding says so (family): copy.inclusionHeadings
// (the Admission list headings) and copy.familyFormNote (the note on the family form's optional health field).
// Present anywhere else, they throw: copy is never silently dropped. Every body link must be safe (kit/lint/body.ts
// safeHref); a tel:/mailto: link must be one of the site's own contact links with its own locked text.
//
// Erasable TypeScript only (node --test imports this file).

import packagesJson from "./content/treatment-packages.json" with { type: "json" };
import panchakarmaJson from "./content/panchakarma.json" with { type: "json" };
import painJson from "./content/pain-management.json" with { type: "json" };
import familyJson from "./content/family-ayurvedic-retreat.json" with { type: "json" };
import type { BodyBlock, BodyInline, BodySection, CampaignConfig, DoctorRef, FeePresentation, InclusionHeadings, SourceBody } from "../kit/types.ts";
import { DOCTORS } from "../data/doctors.ts";
import { PRODUCTION_CAMPAIGN_FORM, PRODUCTION_PAIN_FORM, productionFamilyForm, type FormSchema } from "../forms/schema.ts";
import { bodyLinks, isKnownContactHref, isKnownContactLink, safeHref } from "../kit/lint/body.ts";
import { PRICING_HIDDEN, ROUTES, SOURCE_PRESERVATION, SPELLING, type ProductionSlug, type RouteBinding } from "./bindings.ts";

export const PRODUCTION_SLUGS: readonly ProductionSlug[] = ["treatment-packages", "panchakarma", "pain-management", "family-ayurvedic-retreat"];
const RAW: Record<ProductionSlug, unknown> = {
  "treatment-packages": packagesJson, panchakarma: panchakarmaJson,
  "pain-management": painJson, "family-ayurvedic-retreat": familyJson,
};

class ContentError extends Error {}
const fail = (path: string, why: string): never => { throw new ContentError(`production content ${path}: ${why}`); };
type Obj = Record<string, unknown>;
const obj = (v: unknown, path: string): Obj => (v && typeof v === "object" && !Array.isArray(v) ? (v as Obj) : fail(path, "expected an object"));
const arr = (v: unknown, path: string): unknown[] => (Array.isArray(v) ? v : fail(path, "expected an array"));
const str = (v: unknown, path: string, { empty = false } = {}): string =>
  typeof v === "string" && (empty || v.trim()) ? v : fail(path, empty ? "expected a string" : "expected a non-empty string");
const strs = (v: unknown, path: string): string[] => arr(v, path).map((x, i) => str(x, `${path}[${i}]`));
const opt = (v: unknown, path: string): string | undefined => (v === undefined ? undefined : str(v, path, { empty: true }));

function inline(v: unknown, path: string): BodyInline[] {
  return arr(v, path).map((x, i) => {
    const r = obj(x, `${path}[${i}]`);
    if (r.type === "text") return { type: "text", text: str(r.text, `${path}[${i}].text`, { empty: true }) };
    if (r.type === "link") return { type: "link", text: str(r.text, `${path}[${i}].text`), href: str(r.href, `${path}[${i}].href`) };
    return fail(`${path}[${i}].type`, `unknown inline type ${String(r.type)}`);
  });
}

/** One typed block. Only the documented fields are kept (CONTENT-READY.json schema.blockTypes). */
export function toBlock(v: unknown, path: string): BodyBlock {
  const b = obj(v, path);
  switch (b.type) {
    case "h2": case "h3": case "p": {
      const block: BodyBlock = { type: b.type as "h2" | "h3" | "p", text: str(b.text, `${path}.text`) };
      return b.inline === undefined ? block : { ...block, inline: inline(b.inline, `${path}.inline`) };
    }
    case "quote": return { type: "quote", text: str(b.text, `${path}.text`), attribution: str(b.attribution, `${path}.attribution`) };
    case "list": return { type: "list", items: strs(b.items, `${path}.items`) };
    case "table": return { type: "table", headers: strs(b.headers, `${path}.headers`), rows: arr(b.rows, `${path}.rows`).map((r, i) => strs(r, `${path}.rows[${i}]`)) };
    case "programme": {
      const sanskrit = opt(b.sanskrit, `${path}.sanskrit`);
      return { type: "programme", label: str(b.label, `${path}.label`), href: str(b.href, `${path}.href`), ...(sanskrit ? { sanskrit } : {}) };
    }
    case "videoLink": {
      const thumbnail = opt(b.thumbnail, `${path}.thumbnail`);
      return { type: "videoLink", href: str(b.href, `${path}.href`), label: str(b.label, `${path}.label`), ...(thumbnail ? { thumbnail } : {}) };
    }
    case "image": {
      const caption = opt(b.caption, `${path}.caption`);
      const w = typeof b.sourceWidth === "number" ? b.sourceWidth : undefined;
      const h = typeof b.sourceHeight === "number" ? b.sourceHeight : undefined;
      return { type: "image", src: str(b.src, `${path}.src`), alt: str(b.alt, `${path}.alt`), ...(caption ? { caption } : {}), ...(w && h ? { sourceWidth: w, sourceHeight: h } : {}) };
    }
    case "link": return { type: "link", text: str(b.text, `${path}.text`), href: str(b.href, `${path}.href`) };
    default: return fail(`${path}.type`, `unknown block type ${String(b.type)}`);
  }
}

function toBody(copy: Obj): SourceBody {
  const sections: BodySection[] = arr(copy.sourceBody, "sourceBody").map((s, i) => {
    const sec = obj(s, `sourceBody[${i}]`);
    return { sourceSection: str(sec.sourceSection, `sourceBody[${i}].sourceSection`), blocks: arr(sec.blocks, `sourceBody[${i}].blocks`).map((b, j) => toBlock(b, `sourceBody[${i}].blocks[${j}]`)) };
  });
  return {
    intro: strs(copy.sourceBodyIntro, "sourceBodyIntro"),
    sections,
    closing: arr(copy.sourceBodyClosing, "sourceBodyClosing").map((b, j) => toBlock(b, `sourceBodyClosing[${j}]`)),
  };
}

function toFeePresentation(v: unknown): FeePresentation {
  const f = obj(v, "feePresentation");
  if (f.mode !== "enquiry-only") fail("feePresentation.mode", "expected enquiry-only");
  return { mode: "enquiry-only", heading: str(f.heading, "feePresentation.heading"), body: str(f.body, "feePresentation.body"), cta: str(f.cta, "feePresentation.cta") };
}

function toDoctors(v: unknown): DoctorRef[] {
  return strs(v, "doctorRegistryIds").map((id, i) => DOCTORS[id] ?? fail(`doctorRegistryIds[${i}]`, `no registry entry for ${id}`));
}

/** copy.inclusionHeadings: exactly { included, chargedSeparately }, both non-empty; any other key is unbound copy. */
function toInclusionHeadings(v: unknown): InclusionHeadings {
  const h = obj(v, "inclusionHeadings");
  for (const k of Object.keys(h)) if (k !== "included" && k !== "chargedSeparately") fail(`inclusionHeadings.${k}`, "no binding for this heading");
  return { included: str(h.included, "inclusionHeadings.included"), chargedSeparately: str(h.chargedSeparately, "inclusionHeadings.chargedSeparately") };
}

/** The route's enquiry form: the default production form, or its own (family: with copy.familyFormNote on the health field). */
function toForm(binding: RouteBinding, copy: Obj): FormSchema {
  if (binding.productionForm.profile === "family-retreat") return productionFamilyForm(str(copy.familyFormNote, "familyFormNote"));
  if (copy.familyFormNote !== undefined) fail("familyFormNote", `not bound on ${binding.route} (family form only)`);
  return binding.productionForm.profile === "pain-management" ? PRODUCTION_PAIN_FORM : PRODUCTION_CAMPAIGN_FORM;
}

/** Every body link is safe; a tel:/mailto: link is one of the site's own contact links, showing its own text. */
function checkLinks(c: CampaignConfig): void {
  for (const { path, href, text } of bodyLinks(c)) {
    if (!safeHref(href)) fail(path, `unsafe or malformed link: ${href}`);
    if (isKnownContactHref(href) && !isKnownContactLink(href, text)) fail(path, `contact link ${href} must show its own locked text, not "${text}"`);
  }
}

/** The production CampaignConfig of one live ad route. Throws on any content problem. */
export function productionCampaign(slug: ProductionSlug): CampaignConfig {
  const binding: RouteBinding = ROUTES[slug] ?? fail("slug", `unknown production route ${slug}`);
  const file = obj(RAW[slug], slug);
  const copy = obj(file.copy, "copy");
  if (copy.route !== binding.route) fail("copy.route", `${String(copy.route)} is not ${binding.route}`);
  if (copy.slug !== binding.slug) fail("copy.slug", `${String(copy.slug)} is not ${binding.slug}`);
  // Route-bound headings (family only): required where bound, and never silently ignored elsewhere.
  if (!binding.inclusionHeadings && copy.inclusionHeadings !== undefined) fail("inclusionHeadings", `not bound on ${binding.route}`);
  const inclusionHeadings = binding.inclusionHeadings ? toInclusionHeadings(copy.inclusionHeadings) : undefined;
  // Owner rule: hidden pricing. The copy must carry no fee data and no offer block at all.
  if (copy.fees !== null) fail("copy.fees", "must be null (owner-approved hidden pricing)");
  if (copy.offer !== null) fail("copy.offer", "must be null on these routes");
  const seo = obj(copy.seo, "seo");
  const hero = obj(copy.hero, "hero");
  const admission = obj(copy.admission, "admission");
  const stillness = obj(copy.stillness, "stillness");
  const village = obj(copy.village, "village");
  const adMatch = obj(copy.adMatch, "adMatch");
  const h1Accent = opt(hero.h1Accent, "hero.h1Accent");
  const heroImage = binding.heroImage;
  const programDefault = str(copy.programDefault, "programDefault", { empty: true });
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
    seo: { title: str(seo.title, "seo.title"), description: str(seo.description, "seo.description") },
    adMatch: { keywords: strs(adMatch.keywords, "adMatch.keywords"), adHeadlines: strs(adMatch.adHeadlines, "adMatch.adHeadlines") },
    hero: {
      overline: str(hero.overline, "hero.overline"), h1: str(hero.h1, "hero.h1"), ...(h1Accent ? { h1Accent } : {}),
      standfirst: str(hero.standfirst, "hero.standfirst"),
      image: { A: heroImage, B: heroImage, C: heroImage, D: heroImage }, mobileImage: binding.mobileImage,
    },
    // Without a ConsultBar (batch 2) the copy's program name is editorial context only: no form or lead value.
    programDefault: binding.consultBar === false ? "" : programDefault,
    tracking: { campaignName: binding.slug, trackId: "" },
    admission: {
      heading: str(admission.heading, "admission.heading"),
      steps: arr(admission.steps, "admission.steps").map((s, i) => {
        const st = obj(s, `admission.steps[${i}]`);
        return { title: str(st.title, `admission.steps[${i}].title`), body: str(st.body, `admission.steps[${i}].body`) };
      }),
    },
    included: strs(copy.included, "included"),
    chargedSeparately: strs(copy.chargedSeparately, "chargedSeparately"),
    stillness: { heading: str(stillness.heading, "stillness.heading"), body: str(stillness.body, "stillness.body"), image: binding.stillnessImage },
    doctors: toDoctors(copy.doctorRegistryIds),
    village: { heading: str(village.heading, "village.heading"), body: str(village.body, "village.body") },
    gallery: binding.gallery,
    fees: null,
    offer: null,
    faq: arr(copy.faq, "faq").map((f, i) => {
      const q = obj(f, `faq[${i}]`);
      return { q: str(q.q, `faq[${i}].q`), a: str(q.a, `faq[${i}].a`) };
    }),
    longForm: "",
    pricing: PRICING_HIDDEN,
    feePresentation: toFeePresentation(copy.feePresentation),
    cta: { primary: str(copy.primaryCta, "primaryCta"), primarySupport: str(copy.primaryCtaSupport, "primaryCtaSupport"), secondary: str(copy.secondaryCta, "secondaryCta") },
    productionForm: binding.productionForm,
    body: toBody(copy),
    sourcePreservation: SOURCE_PRESERVATION,
    spelling: SPELLING,
    form: { schema: toForm(binding, copy), adapterId: "ahv-production" },
    ...(inclusionHeadings ? { inclusionHeadings } : {}),
    ...(binding.consultBar === false ? { consultBar: false as const } : {}),
  };
  checkLinks(c);
  return c;
}

/** The archival longForm word count of a route's copy (audit only; never rendered). */
export function archivalLongFormWords(slug: ProductionSlug): number {
  const copy = obj(obj(RAW[slug], slug).copy, "copy");
  const t = typeof copy.longForm === "string" ? copy.longForm.trim() : "";
  return t ? t.split(/\s+/).length : 0;
}
