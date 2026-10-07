import type { CampaignConfig, ImageRef } from "../types.ts";
import type { Issue } from "./lengths.ts";
import { collectPending, isPending } from "../pending.ts";
import { isExpired } from "../price.ts";

const err = (rule: string, path: string, message: string): Issue => ({ level: "error", rule, path, message });
const warn = (rule: string, path: string, message: string): Issue => ({ level: "warning", rule, path, message });
const money = (x: unknown): boolean => typeof x === "number" && Number.isFinite(x) && x > 0;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
/** Locales with a content loader. Until <slug>.<locale>.ts files are loaded, any other locale would serve English copy under another lang. */
export const SUPPORTED_LOCALES: readonly string[] = ["en"];
export const GALLERY_MIN_PER_CATEGORY = 2;
const BAD_ALT = /^(image|photo|picture|hero|img)\b|\b(image|photo) of\b|\.(jpe?g|png|webp)$/i;

export function pageImages(c: CampaignConfig): { path: string; ref: ImageRef }[] {
  return [
    ...Object.entries(c.hero.image).map(([v, ref]) => ({ path: `hero.image.${v}`, ref })),
    { path: "hero.mobileImage", ref: c.hero.mobileImage },
    { path: "stillness.image", ref: c.stillness.image },
    ...c.gallery.map((g, i) => ({ path: `gallery[${i}]`, ref: g.image })),
  ];
}

/** Alt text of every informative image on the page (decorative images render alt=""). Scanned by the claims and register lint. */
export function altTexts(c: CampaignConfig): { path: string; text: string }[] {
  const seen = new Set<string>();
  return pageImages(c).filter(({ ref }) => !ref.decorative && typeof ref.alt === "string" && ref.alt && !seen.has(ref.id) && seen.add(ref.id))
    .map(({ path, ref }) => ({ path: `${path}.alt`, text: ref.alt }));
}

export function lintAssets(c: CampaignConfig, now: Date): Issue[] {
  const out: Issue[] = [];
  const imgs = pageImages(c);
  const seen = new Map<string, string>();
  for (const { path, ref } of imgs) {
    if (path.startsWith("hero.image.") || path === "hero.mobileImage") continue; // hero may repeat across variants
    if (seen.has(ref.id)) out.push(err("image.duplicate", path, `${ref.id} already used at ${seen.get(ref.id)}`));
    seen.set(ref.id, path);
  }
  for (const { path, ref } of imgs) {
    const minEdge = path.startsWith("hero.") ? 1600 : 1200;
    if (Math.max(ref.width, ref.height) < minEdge) out.push(err("image.size", path, `${ref.id} long edge < ${minEdge}px`));
    if (ref.consent === "pending") out.push(err("image.consent", path, `${ref.id} consent pending`));
    if (c.modesty === "gcc" && !ref.gccSafe) out.push(err("image.gcc", path, `${ref.id} not gccSafe`));
    if (!ref.decorative && (ref.alt.length < 20 || ref.alt.length > 125 || BAD_ALT.test(ref.alt))) out.push(err("image.alt", path, `bad alt: "${ref.alt}"`));
    if (ref.location === "ho-centre" && /palakkad|village/i.test(ref.alt)) out.push(err("image.location", path, "HO-centre image must not mention Palakkad/village"));
  }
  if (c.films) for (const [i, f] of [c.films.featured, ...c.films.more].entries()) if (!f.consent) out.push(err("film.consent", `films[${i}]`, f.youtubeId));
  if (c.fees === null) {
    // No fee data at all is only valid as an owner-approved hidden-pricing decision (kit/lint/pricing.ts).
    if (c.pricing?.display !== "hidden") out.push(err("fees.null", "fees", "fees: null needs pricing.display \"hidden\" (owner-approved)"));
  } else if (!isPending(c.fees)) {
    if (!c.fees.source) out.push(err("fees.source", "fees.source", "tariff source required"));
    if (!c.fees.validTo || isExpired(c.fees.validTo, now)) out.push(err("fees.expired", "fees.validTo", "missing or past"));
    if (c.fees.rows.length < 1 || c.fees.rows.length > 4) out.push(err("count.fees", "fees.rows", "1-4 rows"));
    // A currency the tariff lacks falls back to USD (kit/price.ts); without USD the page shows "[no tariff]".
    c.fees.rows.forEach((r, i) => {
      const priced = (["single", "twinEach"] as const).filter((k) => Object.values(r[k] ?? {}).some(money));
      if (!priced.length) out.push(err("fees.usd", `fees.rows[${i}]`, "row has no price; every row needs a USD figure"));
      for (const k of priced) if (!money(r[k].USD)) out.push(err("fees.usd", `fees.rows[${i}].${k}`, "no USD figure: other currencies fall back to USD, else the page shows [no tariff]"));
    });
  }
  if (c.offer && !isPending(c.offer)) {
    const o = c.offer as Record<keyof NonNullable<typeof c.offer>, unknown>;
    const s = (k: keyof typeof o): string => (typeof o[k] === "string" ? (o[k] as string).trim() : "");
    const skip = (k: keyof typeof o) => isPending(o[k]); // a pending() field is reported by pending.production
    for (const k of ["name", "headline", "termsUrl", "source"] as const) if (!skip(k) && !s(k)) out.push(err("offer.fields", `offer.${k}`, "required when an offer is set"));
    if (s("termsUrl") && !/^(https:\/\/|\/(?![\/\\]))/.test(s("termsUrl"))) out.push(err("offer.fields", "offer.termsUrl", "must be https:// or a same-site path"));
    for (const k of ["validFrom", "validTo"] as const) if (!skip(k) && !ISO_DATE.test(s(k))) out.push(err("offer.fields", `offer.${k}`, "YYYY-MM-DD required"));
    if (ISO_DATE.test(s("validFrom")) && ISO_DATE.test(s("validTo")) && s("validFrom") > s("validTo")) out.push(err("offer.fields", "offer.validFrom", "after validTo"));
    if (!skip("validTo") && isExpired(s("validTo"), now)) out.push(err("offer.expired", "offer.validTo", "offer expired"));
  }
  // Warning, not error: the pilot shows one Dining and one Therapies photo; a lone tile reads as an afterthought.
  const perCat = new Map<string, number>();
  for (const g of c.gallery) perCat.set(g.category, (perCat.get(g.category) ?? 0) + 1);
  for (const [cat, n] of perCat) if (n < GALLERY_MIN_PER_CATEGORY) out.push(warn("gallery.category", "gallery", `${cat}: ${n} image; use at least ${GALLERY_MIN_PER_CATEGORY} per category, or drop the category`));
  for (const l of c.locales) if (!SUPPORTED_LOCALES.includes(l)) out.push(err("locale.unsupported", "locales", `${l}: translations are not loaded yet (guide §10); only "en" can ship`));
  for (const l of c.locales) {
    const t = c.translations.find((x) => x.locale === l);
    if (!t || t.review !== "approved") out.push(err("locale.unreviewed", "locales", `${l} has no approved review`));
  }
  if (c.index !== false) out.push(err("index", "index", "variant pages must be noindex"));
  if (c.production) for (const p of collectPending(c)) out.push(err("pending.production", p.path, `${p.id}: ${p.note}`));
  return out;
}
