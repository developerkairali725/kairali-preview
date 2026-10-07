import type { CampaignConfig } from "../types.ts";
import { isPending } from "../pending.ts";

export type Issue = { level: "error" | "warning"; rule: string; path: string; message: string };

const err = (rule: string, path: string, message: string): Issue => ({ level: "error", rule, path, message });
const str = (v: unknown): string => (typeof v === "string" ? v : "");
const words = (v: unknown): number => { const t = str(v).trim(); return t ? t.split(/\s+/).length : 0; };

function len(out: Issue[], rule: string, path: string, value: unknown, min: number, max: number) {
  if (isPending(value)) return;
  const n = str(value).length;
  if (n < min || n > max) out.push(err(rule, path, `${n} chars; allowed ${min}-${max}`));
}

/**
 * Words in the conversion slots (the kit's short-page budget). A preserved source body is not counted here,
 * exactly as longForm is not: it is governed by the owner's source-preservation rule instead (kit/lint/body.ts
 * requires the policy; test/lp-v2-production-content.test.mjs measures it against the live page).
 */
export function visibleWords(c: CampaignConfig): number {
  const parts: string[] = [
    c.hero.overline, c.hero.h1, c.hero.standfirst, c.admission.heading,
    ...c.admission.steps.flatMap((s) => [s.title, s.body]), ...c.included, ...c.chargedSeparately,
    c.stillness.heading, c.stillness.body, c.village.heading, c.village.body,
    ...c.doctors.flatMap((d) => [d.name, d.role, d.qualification]),
    ...(c.films ? [c.films.featured.title, ...c.films.more.map((f) => f.title)] : []),
    ...(c.fees && !isPending(c.fees) ? c.fees.rows.flatMap((r) => [r.name, r.note]) : []),
    ...(c.feePresentation ? [c.feePresentation.heading, c.feePresentation.body] : []),
    ...(c.cta?.primarySupport ? [c.cta.primarySupport] : []),
    ...(!isPending(c.offer) && c.offer ? [c.offer.name, c.offer.headline] : []),
    ...c.faq.flatMap((f) => [f.q, f.a]),
  ].map(str);
  return parts.reduce((n, p) => n + words(p), 0);
}

/** Flesch-Kincaid grade with a simple vowel-group syllable count. */
export function gradeLevel(input: string): number {
  const text = str(input);
  const sentences = Math.max(1, (text.match(/[.!?]+/g) || []).length);
  const ws = text.split(/\s+/).filter(Boolean);
  const syll = ws.reduce((n, w) => n + Math.max(1, (w.toLowerCase().replace(/e\b/, "").match(/[aeiouy]+/g) || []).length), 0);
  return 0.39 * (ws.length / sentences) + 11.8 * (syll / Math.max(1, ws.length)) - 15.59;
}

export function lintLengths(c: CampaignConfig): Issue[] {
  const out: Issue[] = [];
  len(out, "length.seo.title", "seo.title", c.seo.title, 30, 60);
  len(out, "length.seo.description", "seo.description", c.seo.description, 120, 155);
  len(out, "length.hero.overline", "hero.overline", c.hero.overline, 1, 48);
  len(out, "length.hero.h1", "hero.h1", c.hero.h1, 20, 60);
  len(out, "length.hero.standfirst", "hero.standfirst", c.hero.standfirst, 90, 160);
  if (str(c.hero.h1Accent) && str(c.hero.h1) && !str(c.hero.h1).includes(str(c.hero.h1Accent))) out.push(err("hero.h1Accent", "hero.h1Accent", "must be a substring of hero.h1"));
  if (c.hero.h1Accent) len(out, "length.hero.h1Accent", "hero.h1Accent", c.hero.h1Accent, 1, 24);
  len(out, "length.admission.heading", "admission.heading", c.admission.heading, 1, 60);
  if (c.admission.steps.length !== 3) out.push(err("admission.steps", "admission.steps", "exactly 3 steps"));
  c.admission.steps.forEach((s, i) => {
    len(out, "length.admission.title", `admission.steps[${i}].title`, s.title, 1, 24);
    len(out, "length.admission.body", `admission.steps[${i}].body`, s.body, 40, 120);
  });
  if (c.included.length < 4 || c.included.length > 7) out.push(err("count.included", "included", "4-7 items"));
  c.included.forEach((x, i) => len(out, "length.included", `included[${i}]`, x, 1, 34));
  if (c.chargedSeparately.length < 1 || c.chargedSeparately.length > 4) out.push(err("count.chargedSeparately", "chargedSeparately", "1-4 items"));
  len(out, "length.stillness.heading", "stillness.heading", c.stillness.heading, 1, 45);
  len(out, "length.stillness.body", "stillness.body", c.stillness.body, 60, 150);
  len(out, "length.village.heading", "village.heading", c.village.heading, 1, 50);
  len(out, "length.village.body", "village.body", c.village.body, 60, 150);
  if (c.films) {
    if (c.films.more.length < 2 || c.films.more.length > 3) out.push(err("count.films", "films.more", "2-3 films"));
    len(out, "length.films.featured.title", "films.featured.title", c.films.featured.title, 1, 32);
    c.films.more.forEach((f, i) => len(out, "length.films.more.title", `films.more[${i}].title`, f.title, 1, 28));
  } else if (!c.body?.sections.some((s) => s.blocks.some((b) => b.type === "videoLink"))) {
    // Films may only be absent when the preserved source body carries the page's own videos.
    out.push(err("count.films", "films", "no films: set films, or keep the source body's videoLink blocks"));
  }
  if (c.doctors.length < 2 || c.doctors.length > 3) out.push(err("count.doctors", "doctors", "2-3 doctors"));
  if (c.gallery.length < 6 || c.gallery.length > 24) out.push(err("count.gallery", "gallery", "6-24 images"));
  if (c.fees && !isPending(c.fees)) c.fees.rows.forEach((r, i) => {
    len(out, "length.fees.name", `fees.rows[${i}].name`, r.name, 1, 24);
    len(out, "length.fees.note", `fees.rows[${i}].note`, r.note, 0, 60);
  });
  if (c.offer && !isPending(c.offer)) {
    len(out, "length.offer.name", "offer.name", c.offer.name, 1, 30);
    len(out, "length.offer.headline", "offer.headline", c.offer.headline, 1, 80);
  }
  if (c.faq.length < 4 || c.faq.length > 6) out.push(err("count.faq", "faq", "4-6 items"));
  c.faq.forEach((f, i) => {
    len(out, "length.faq.q", `faq[${i}].q`, f.q, 10, 70);
    if (!isPending(f.a)) { const n = words(f.a); if (n < 25 || n > 70) out.push(err("length.faq.a", `faq[${i}].a`, `${n} words; allowed 25-70`)); }
  });
  const lf = words(c.longForm);
  if (c.body) {
    // A preserved source body replaces longForm (owner: >=95% of the useful source copy, no 1200-word cap).
    // Both can never render, so longForm must be empty; the body's own rules are in kit/lint/body.ts.
    if (lf > 0) out.push(err("body.longForm", "longForm", "must be empty when body (preserved source) is set"));
  } else if (!isPending(c.longForm) && (lf < 300 || lf > 1200)) out.push(err("length.longForm", "longForm", `${lf} words; allowed 300-1200`));
  const vw = visibleWords(c);
  if (vw > 900) out.push(err("length.visibleWords", "$", `${vw} visible words; max 900`));
  if (vw < 450 && c.production) out.push(err("length.visibleWords", "$", `${vw} visible words; min 450 for production`));
  const g = gradeLevel([c.hero.standfirst, ...c.admission.steps.map((s) => s.body), c.stillness.body, c.village.body].map(str).join(" "));
  if (g > 8) out.push(err("readability.grade", "$", `grade ${g.toFixed(1)}; max 8`));
  return out;
}
