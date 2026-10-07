// campaign-v2/kit/lint/claims.ts
import type { CampaignConfig } from "../types.ts";
import type { Issue } from "./lengths.ts";
import { isPending } from "../pending.ts";
import { altTexts } from "./assets.ts";
import { pageText } from "./page-text.ts";

/**
 * Every visible string of the authored copy. A designed production page (`page`) is linted as what it renders: its
 * own sections replace the kit fields it mirrors (admission, included, chargedSeparately, stillness copy, village),
 * so those are not read twice. Doctor tenure, focus and languages are registry facts, linted with the registry.
 */
export function allText(c: CampaignConfig): { path: string; text: string }[] {
  const out: { path: string; text: string }[] = [];
  const add = (path: string, v: unknown) => { if (typeof v === "string" && v) out.push({ path, text: v }); };
  add("seo.title", c.seo.title); add("seo.description", c.seo.description);
  add("hero.overline", c.hero.overline); add("hero.h1", c.hero.h1); add("hero.standfirst", c.hero.standfirst);
  if (!c.page) {
    add("admission.heading", c.admission.heading);
    c.admission.steps.forEach((s, i) => { add(`admission.steps[${i}].title`, s.title); add(`admission.steps[${i}].body`, s.body); });
    c.included.forEach((x, i) => add(`included[${i}]`, x)); c.chargedSeparately.forEach((x, i) => add(`chargedSeparately[${i}]`, x));
    add("stillness.heading", c.stillness.heading); add("stillness.body", c.stillness.body);
    add("village.heading", c.village.heading); add("village.body", c.village.body);
  }
  if (c.films) [c.films.featured, ...c.films.more].forEach((f, i) => add(`films[${i}].title`, f.title));
  if (c.cta) { add("cta.primary", c.cta.primary); add("cta.primarySupport", c.cta.primarySupport); add("cta.secondary", c.cta.secondary); }
  c.faq.forEach((f, i) => { add(`faq[${i}].q`, f.q); if (!isPending(f.a)) add(`faq[${i}].a`, f.a); });
  if (c.offer && !isPending(c.offer)) { add("offer.name", c.offer.name); add("offer.headline", c.offer.headline); }
  c.doctors.forEach((d, i) => { add(`doctors[${i}].role`, d.role); add(`doctors[${i}].qualification`, d.qualification); });
  if (c.fees && !isPending(c.fees)) c.fees.rows.forEach((r, i) => { add(`fees.rows[${i}].name`, r.name); add(`fees.rows[${i}].note`, r.note); });
  add("longForm", c.longForm);
  out.push(...pageText(c));
  return out;
}

const TIME_BOUND = /\b(in|within|after)\s+(just\s+|only\s+)?\d+\s+(days?|weeks?)\b/gi;
const OUTCOME = /\b(results?|relief|relieve[sd]?|improve[sd]?|improvement|lose|lost|loss|weight|recover(y|ed)?|reduce[sd]?|heal(ed|ing)?|transform(ed|ation)?|detox|cleanse[sd]?|slimmer|pain-free|cured)\b/gi;
const wordIndex = (text: string, pos: number) => (text.slice(0, pos).match(/\S+/g) || []).length;

const CLAIMS: { re: RegExp; near?: RegExp; why: string }[] = [
  { re: /\b(cure[sd]?|curative|heals?|reverses?|eliminates?)\b/i, why: "cure language" },
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

// ── Disease-treatment claims (guide §9: the DMR Act Schedule terms, plus the ad-policy terms) ─────────────
// Naming a diagnosis is not a claim: copy may invite a visitor to discuss one they already have ("Discuss osteoarthritis,
// rheumatoid arthritis or other joint concerns", "Share your diagnosis, blood-pressure history and prescriptions").
// A sentence (or ;-clause) that names a disease IS a claim, however far apart its words are, when it
//   - asserts an effect on a condition: treat, cure, heal, reverse, normalize, control, manage, lower, reduce,
//     relieve, improve, prevent, … ("We treat … type 2 diabetes", "can permanently normalize … glucose … diabetes");
//   - ties a service to it: "treatment for …", "a programme against …", "our arthritis programme";
//   - offers something for it: "Ayurveda for diabetes".
// Negations stay claims ("not a treatment for blood pressure"). The one exception is the reader's own history, where
// the treatment or effect word belongs to the visitor: "how you currently manage your blood pressure", "your current
// diabetes treatment", "any previous treatment for arthritis". Claims are errors; a neutral mention is a
// "disease.mention" warning, so clinical review sees every diagnosis a page names.
const DISEASE_SRC = String.raw`obesity|diabet\w*|blood[- ]pressure|hypertension|cholesterol|thyroid|cancer|\w*arthritis|infertility|asthma|psoriasis|parkinson\w*|alzheimer\w*`;
const DISEASE = new RegExp(String.raw`\b(${DISEASE_SRC})\b`, "gi");
const HAS_DISEASE = new RegExp(String.raw`\b(${DISEASE_SRC})\b`, "i");
const TRAILING_DISEASE = new RegExp(String.raw`\b(${DISEASE_SRC})\s*$`, "i");
/** What a claim says happens to a condition: the verbs and their nouns. */
const EFFECT = /\b(treat(s|ed|ing)?|cur(e|es|ed|ing|ative)|heal(s|ed|ing)?|revers(e|es|ed|al|ing)|eliminat(e|es|ed|ing|ion)|normali[sz](e|es|ed|ing|ation)|regulat(e|es|ed|ing|ion)|control(s|led|ling)?|manag(e|es|ed|ing|ement)|lower(s|ed|ing)?|reduc(e|es|ed|ing|tion)|reliev(e|es|ed|ing)|relief|improv(e|es|ed|ing|ement)|prevent(s|ed|ing|ion)?|overcom(e|es|ing)|beat(s|ing)?|fight(s|ing)?|rid of|free (of|from)|balanc(e|es|ed|ing)|reset|recover(s|ed|ing|y)?|results?|remed(y|ies)|resolv(e|es|ed|ing)|restor(e|es|ed|ing)|help(s|ed|ing)? with)\b/gi;
/** Services that, tied to a disease, offer to treat it. */
const SERVICE_SRC = String.raw`treatments?|therap(?:y|ies)|programmes?|programs?|packages?|care|retreats?|clinics?|cent(?:re|er)s?|specialists?|medicines?|remed(?:y|ies)`;
const SERVICE_FOR = new RegExp(String.raw`\b(${SERVICE_SRC})\s+(for|of|against)\b(?=[^.!?;]*\b(${DISEASE_SRC})\b)`, "gi");
const DISEASE_SERVICE = new RegExp(String.raw`\b(${DISEASE_SRC})\s+(${SERVICE_SRC})\b`, "gi");
const ENDS_IN_SERVICE = new RegExp(String.raw`\b(${SERVICE_SRC})\s+$`, "i");
/** "for diabetes", but not "for your diabetes records / history / medicines" (a request about the visitor's own papers). */
const BARE_FOR = new RegExp(String.raw`\b(for|against)\s+(your\s+|the\s+)?(${DISEASE_SRC})\b(?!\s+(history|records?|reports?|diagnos[ie]s|medicines?|medications?|prescriptions?|monitoring|tests?|details|concerns))`, "gi");
/** The reader's own history: a verb whose subject is the visitor describing themselves, or a noun that is theirs. */
const OWN_VERB = /\b((how|what|which)\s+you(\s+(currently|already|usually|now|previously))?|you\s+(currently|already|usually|previously))\s+$/i;
/** A qualifier alone is not ownership ("our current treatment for …" is an offer): it needs the visitor's your/their, or
 *  "any" after a request that the visitor disclose it ("share any previous treatment …", not "we offer any current …"). */
const OWN_QUALIFIER = String.raw`current|existing|previous|prior|ongoing|earlier|usual|other`;
const DISCLOSE_ANY = String.raw`\b(share|bring|list|mention|describe|disclose|tell(\s+\w+){1,2}\s+about)\s+any\s+(${OWN_QUALIFIER})`;
const OWN_NOUN = new RegExp(String.raw`(\b(your|their)(\s+(${OWN_QUALIFIER}))?|${DISCLOSE_ANY})\s+$`, "i");

/** The words before `index` in their own phrase (from the last comma, bracket or dash), less a disease name at its end. */
function phraseBefore(s: string, index: number): string {
  const before = s.slice(0, index);
  const from = Math.max(before.lastIndexOf(","), before.lastIndexOf("("), before.lastIndexOf("—"), before.lastIndexOf("–")) + 1;
  return before.slice(from).replace(TRAILING_DISEASE, "");
}
/** True when the treatment or effect word at `index` is the visitor's own history, not an offer. */
const ownHistory = (s: string, index: number): boolean => {
  const p = phraseBefore(s, index);
  return OWN_VERB.test(p) || OWN_NOUN.test(p);
};

/** The phrase that makes a disease name a treatment claim, or null when a disease is only named. Pure. */
export function diseaseClaim(text: string): string | null {
  for (const s of text.split(/(?<=[.!?;])\s+/)) {
    const disease = s.match(HAS_DISEASE)?.[0];
    if (!disease) continue;
    for (const m of s.matchAll(SERVICE_FOR)) if (!ownHistory(s, m.index ?? 0)) return `${m[0]} … ${disease}`;
    for (const m of s.matchAll(DISEASE_SERVICE)) if (!ownHistory(s, m.index ?? 0)) return m[0];
    for (const m of s.matchAll(BARE_FOR)) if (!ENDS_IN_SERVICE.test(s.slice(0, m.index ?? 0))) return m[0];
    for (const m of s.matchAll(EFFECT)) if (!ownHistory(s, m.index ?? 0)) return `${m[0]} … ${disease}`;
  }
  return null;
}

/** Every disease name a text mentions. Pure. */
export const diseaseNames = (text: string): string[] => [...text.matchAll(DISEASE)].map((m) => m[0]);

export function lintClaims(c: CampaignConfig): Issue[] {
  const out: Issue[] = [];
  for (const { path, text } of [...allText(c), ...altTexts(c)]) {
    for (const { re, near, why } of CLAIMS) {
      const m = near ? timeBoundMatch(text, re, near) : text.match(re);
      if (m) out.push({ level: "error", rule: "claims", path, message: `${why}: "${m[0]}"` });
    }
    const claim = diseaseClaim(text);
    if (claim) out.push({ level: "error", rule: "claims", path, message: `disease-treatment claim (DMR Act / ad policy): "${claim}"` });
    else for (const name of new Set(diseaseNames(text))) out.push({ level: "warning", rule: "disease.mention", path, message: `names "${name}" as a diagnosis to discuss, with no treatment claim (clinical review)` });
  }
  return out;
}
