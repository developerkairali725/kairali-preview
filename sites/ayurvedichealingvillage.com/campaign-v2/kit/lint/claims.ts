// campaign-v2/kit/lint/claims.ts
import type { BodyBlock, CampaignConfig } from "../types.ts";
import type { Issue } from "./lengths.ts";
import { isPending } from "../pending.ts";
import { altTexts } from "./assets.ts";

/** Visible text of one preserved-body block (inline runs win over `text`). Pure. */
export function blockTexts(b: BodyBlock): string[] {
  switch (b.type) {
    case "h2": case "h3": case "p": return [b.inline ? b.inline.map((r) => r.text).join(" ") : b.text];
    case "quote": return [b.text, b.attribution];
    case "list": return [...b.items];
    case "table": return [...b.headers, ...b.rows.flat()];
    case "programme": return [b.label, ...(b.sanskrit ? [b.sanskrit] : [])];
    case "videoLink": return [b.label];
    case "image": return [b.alt, ...(b.caption ? [b.caption] : [])];
    case "link": return [b.text];
  }
}

/**
 * The preserved source body (production pages only): owner-approved carryover of the live page's copy, kept
 * word for word. Linted separately from the authored copy below, so findings in it are reported as preserved
 * source (warnings) instead of being silently rewritten or failing the authored-copy rules.
 */
export function bodyText(c: CampaignConfig): { path: string; text: string }[] {
  const out: { path: string; text: string }[] = [];
  if (!c.body) return out;
  const add = (path: string, v: unknown) => { if (typeof v === "string" && v.trim()) out.push({ path, text: v }); };
  c.body.intro.forEach((t, i) => add(`body.intro[${i}]`, t.replace(/^#{1,6}\s+/, "")));
  c.body.sections.forEach((s, i) => s.blocks.forEach((b, j) => blockTexts(b).forEach((t) => add(`body.sections[${i}].blocks[${j}]`, t))));
  c.body.closing.forEach((b, j) => blockTexts(b).forEach((t) => add(`body.closing[${j}]`, t)));
  return out;
}

export function allText(c: CampaignConfig): { path: string; text: string }[] {
  const out: { path: string; text: string }[] = [];
  const add = (path: string, v: unknown) => { if (typeof v === "string" && v) out.push({ path, text: v }); };
  add("seo.title", c.seo.title); add("seo.description", c.seo.description);
  add("hero.overline", c.hero.overline); add("hero.h1", c.hero.h1); add("hero.standfirst", c.hero.standfirst);
  add("admission.heading", c.admission.heading);
  c.admission.steps.forEach((s, i) => { add(`admission.steps[${i}].title`, s.title); add(`admission.steps[${i}].body`, s.body); });
  c.included.forEach((x, i) => add(`included[${i}]`, x)); c.chargedSeparately.forEach((x, i) => add(`chargedSeparately[${i}]`, x));
  add("stillness.heading", c.stillness.heading); add("stillness.body", c.stillness.body);
  add("village.heading", c.village.heading); add("village.body", c.village.body);
  if (c.films) [c.films.featured, ...c.films.more].forEach((f, i) => add(`films[${i}].title`, f.title));
  if (c.cta) { add("cta.primary", c.cta.primary); add("cta.primarySupport", c.cta.primarySupport); add("cta.secondary", c.cta.secondary); }
  if (c.feePresentation) { add("feePresentation.heading", c.feePresentation.heading); add("feePresentation.body", c.feePresentation.body); add("feePresentation.cta", c.feePresentation.cta); }
  c.faq.forEach((f, i) => { add(`faq[${i}].q`, f.q); if (!isPending(f.a)) add(`faq[${i}].a`, f.a); });
  if (c.offer && !isPending(c.offer)) { add("offer.name", c.offer.name); add("offer.headline", c.offer.headline); }
  c.doctors.forEach((d, i) => { add(`doctors[${i}].role`, d.role); add(`doctors[${i}].qualification`, d.qualification); });
  if (c.fees && !isPending(c.fees)) c.fees.rows.forEach((r, i) => { add(`fees.rows[${i}].name`, r.name); add(`fees.rows[${i}].note`, r.note); });
  add("longForm", c.longForm);
  return out;
}

const TIME_BOUND = /\b(in|within|after)\s+(just\s+|only\s+)?\d+\s+(days?|weeks?)\b/gi;
const OUTCOME = /\b(results?|relief|relieve[sd]?|improve[sd]?|improvement|lose|lost|loss|weight|recover(y|ed)?|reduce[sd]?|heal(ed|ing)?|transform(ed|ation)?|detox|cleanse[sd]?|slimmer|pain-free|cured)\b/gi;
const wordIndex = (text: string, pos: number) => (text.slice(0, pos).match(/\S+/g) || []).length;

const CLAIMS: { re: RegExp; near?: RegExp; why: string }[] = [
  { re: /\b(cure[sd]?|curative|heals?|reverses?|eliminates?)\b/i, why: "cure language" },
  { re: /\b(obesity|diabet\w*|blood pressure|hypertension|cholesterol|thyroid|cancer|arthritis|infertility|asthma|psoriasis|parkinson\w*|alzheimer\w*)\b/i, why: "disease claim (DMR Act / ad policy)" },
  { re: /\b\d+(\.\d+)?\s?(kg|kgs|kilos?|lbs?|pounds)\b/i, why: "numeric weight outcome" },
  { re: /\b\d+(\.\d+)?\s?%/i, why: "percentage claim" },
  { re: /\bzero (side[- ]effects?|adverse)/i, why: "safety absolute" },
  { re: /\b(best|no\.?\s?1|number one|world[- ]class|guaranteed?)\b/i, why: "unsourced superlative/guarantee" },
  { re: /\b\d[\d,.]*\s?(k|m)?\+\s*(lives|patients|guests|therapies)/i, why: "unsupported count" },
  { re: /\b(scientifically|clinically) proven\b/i, why: "proof claim" },
  // Durations are written as "14 nights" / "a 14-night program", which stays allowed; "in 21 days" implies an outcome.
  { re: TIME_BOUND, near: OUTCOME, why: "time-bound outcome" },
  { re: /\b\d{1,3}(,\d{3})+\+?\s*(lives|patients|guests|therapies)\b/i, why: "unsupported count" },
  { re: /\b\d+(\.\d+)?\s?(k|m)\+?\s*(lives|patients|guests|therapies)\b/i, why: "unsupported count" },
  { re: /\bbefore\s*(and|&|\/)\s*after\b/i, why: "before/after" },
];

// A duration phrase only counts when an outcome word sits within 8 words of it ("Free cancellation within 7 days" is fine).
function timeBoundMatch(text: string, re: RegExp, near: RegExp): RegExpMatchArray | null {
  // Remove brand name "Healing Village" with a placeholder of same word count to preserve positions
  const cleanedText = text.replace(/\bHealing Village\b/gi, "HV_BRAND HV_BRAND");
  const outcomes = [...cleanedText.matchAll(near)].map((m) => wordIndex(cleanedText, m.index ?? 0));
  for (const m of cleanedText.matchAll(re)) {
    const w = wordIndex(cleanedText, m.index ?? 0);
    if (outcomes.some((o) => Math.abs(o - w) <= 8)) return m;
  }
  return null;
}

// Negated disease mentions ("not a treatment for diabetes") are intentionally errors: disease names must not appear in ad-landing copy at all.
// The preserved source body gets the same patterns as warnings ("claims.preservedSource"): every hit is listed for
// the clinical/claims review of the inherited copy (owner rule: no new claims, nothing silently rewritten).
export function lintClaims(c: CampaignConfig): Issue[] {
  const out: Issue[] = [];
  const scan = (items: { path: string; text: string }[], level: Issue["level"], rule: string) => {
    for (const { path, text } of items) for (const { re, near, why } of CLAIMS) {
      const m = near ? timeBoundMatch(text, re, near) : text.match(re);
      if (m) out.push({ level, rule, path, message: `${why}: "${m[0]}"` });
    }
  };
  scan([...allText(c), ...altTexts(c)], "error", "claims");
  scan(bodyText(c), "warning", "claims.preservedSource");
  return out;
}
