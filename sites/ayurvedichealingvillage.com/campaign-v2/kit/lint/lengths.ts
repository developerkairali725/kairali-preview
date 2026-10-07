import type { CampaignConfig } from "../types.ts";
import { isPending } from "../pending.ts";
import { richText } from "../rich.ts";
import { pageText } from "./page-text.ts";

export type Issue = { level: "error" | "warning"; rule: string; path: string; message: string };

const err = (rule: string, path: string, message: string): Issue => ({ level: "error", rule, path, message });
const warn = (rule: string, path: string, message: string): Issue => ({ level: "warning", rule, path, message });
const str = (v: unknown): string => (typeof v === "string" ? v : "");
const words = (v: unknown): number => { const t = str(v).trim(); return t ? t.split(/\s+/).length : 0; };

function len(out: Issue[], rule: string, path: string, value: unknown, min: number, max: number) {
  if (isPending(value)) return;
  const n = str(value).length;
  if (n < min || n > max) out.push(err(rule, path, `${n} chars; allowed ${min}-${max}`));
}

/**
 * Words in the conversion slots (the kit's short-page budget). A designed production page counts what it renders:
 * its own sections in place of the kit fields it mirrors.
 */
export function visibleWords(c: CampaignConfig): number {
  const kit: string[] = c.page ? [] : [
    c.admission.heading, ...c.admission.steps.flatMap((s) => [s.title, s.body]), ...c.included, ...c.chargedSeparately,
    c.stillness.heading, c.stillness.body, c.village.heading, c.village.body,
  ];
  const parts: string[] = [
    c.hero.overline, c.hero.h1, c.hero.standfirst, ...kit,
    ...c.doctors.flatMap((d) => [d.name, d.role, d.qualification]),
    ...(c.films ? [c.films.featured.title, ...c.films.more.map((f) => f.title)] : []),
    ...(c.fees && !isPending(c.fees) ? c.fees.rows.flatMap((r) => [r.name, r.note]) : []),
    ...(c.cta?.primarySupport ? [c.cta.primarySupport] : []),
    ...(!isPending(c.offer) && c.offer ? [c.offer.name, c.offer.headline] : []),
    ...c.faq.flatMap((f) => [f.q, f.a]),
    ...pageText(c).map((t) => t.text),
  ].map(str);
  return parts.reduce((n, p) => n + words(p), 0);
}

/**
 * A designed production page (the live ad routes: SEO and paid-search landing in one). Its budgets are the
 * production template's capacities (production/sections/*): what each section can hold at 390px and 1440px without
 * breaking its layout. The hero, SEO and FAQ-answer rules match the kit's, widened only where the reviewed copy's
 * search titles and descriptions are the original captured ones (kept for search continuity).
 */
function lintProductionPage(c: CampaignConfig): Issue[] {
  const out: Issue[] = [];
  const p = c.page;
  if (!p) return out;
  len(out, "length.seo.title", "seo.title", c.seo.title, 30, 70);
  len(out, "length.seo.description", "seo.description", c.seo.description, 110, 165);
  len(out, "length.hero.overline", "hero.overline", c.hero.overline, 1, 48);
  len(out, "length.hero.h1", "hero.h1", c.hero.h1, 20, 60);
  len(out, "length.hero.standfirst", "hero.standfirst", c.hero.standfirst, 90, 160);
  if (str(c.hero.h1Accent) && !str(c.hero.h1).includes(str(c.hero.h1Accent))) out.push(err("hero.h1Accent", "hero.h1Accent", "must be a substring of hero.h1"));
  const heading = (path: string, v: string) => len(out, "length.page.heading", path, v, 4, 72);
  heading("page.lead.heading", p.lead.heading);
  if (p.lead.paragraphs.length < 1 || p.lead.paragraphs.length > 3) out.push(err("count.page.lead", "page.lead.paragraphs", "1-3 paragraphs"));
  if (p.lead.points && (p.lead.points.length < 2 || p.lead.points.length > 6)) out.push(err("count.page.points", "page.lead.points", "2-6 points"));
  p.lead.points?.forEach((t, i) => len(out, "length.page.point", `page.lead.points[${i}]`, t, 1, 90));
  const o = p.offering;
  heading("page.offering.heading", o.heading);
  if (o.kind === "cards" && (o.cards.length < 2 || o.cards.length > 6)) out.push(err("count.page.cards", "page.offering.cards", "2-6 cards"));
  if (o.kind === "cards") o.cards.forEach((card, i) => len(out, "length.page.cardTitle", `page.offering.cards[${i}].title`, card.title, 1, 60));
  if (o.kind === "row" && (o.items.length < 3 || o.items.length > 7)) out.push(err("count.page.row", "page.offering.items", "3-7 items"));
  if (o.kind === "row") o.items.forEach((t, i) => len(out, "length.page.rowItem", `page.offering.items[${i}]`, t, 1, 24));
  if (o.kind === "index" && (o.topics.length < 4 || o.topics.length > 20)) out.push(err("count.page.topics", "page.offering.topics", "4-20 topics"));
  if (o.kind === "index") o.topics.forEach((t, i) => len(out, "length.page.topicTitle", `page.offering.topics[${i}].title`, t.title, 1, 60));
  heading("page.pathway.heading", p.pathway.heading);
  if (p.pathway.steps.length < 2 || p.pathway.steps.length > 3) out.push(err("count.page.steps", "page.pathway.steps", "2-3 steps"));
  p.pathway.steps.forEach((s, i) => len(out, "length.page.stepTitle", `page.pathway.steps[${i}].title`, s.title, 1, 48));
  // The rest band's card sits over a 520px photograph on desktop.
  len(out, "length.stillness.heading", "page.rest.heading", p.rest.heading, 1, 48);
  const rest = p.rest.paragraphs.join(" ");
  if (rest.length < 60 || rest.length > 450) out.push(err("length.stillness.body", "page.rest.paragraphs", `${rest.length} chars; allowed 60-450`));
  heading("page.place.heading", p.place.heading);
  if (p.place.villas && (p.place.villas.length < 2 || p.place.villas.length > 4)) out.push(err("count.page.villas", "page.place.villas", "2-4 villas"));
  if (p.stories && (p.stories.films.length < 1 || p.stories.films.length > 4)) out.push(err("count.page.films", "page.stories.films", "1-4 films"));
  heading("page.stay.heading", p.stay.heading);
  if (p.stay.lists.length < 1 || p.stay.lists.length > 2) out.push(err("count.page.lists", "page.stay.lists", "1-2 lists"));
  p.stay.lists.forEach((l, i) => {
    if (l.items.length < 2 || l.items.length > 8) out.push(err("count.page.listItems", `page.stay.lists[${i}].items`, "2-8 items"));
    l.items.forEach((t, j) => len(out, "length.page.listItem", `page.stay.lists[${i}].items[${j}]`, t, 1, 120));
  });
  heading("page.doctors.heading", p.doctors.heading);
  heading("page.closing.heading", p.closing.heading);
  // Every current physician the reviewed copy introduces (the production roster), never a placeholder.
  if (c.doctors.length < 2 || c.doctors.length > 6) out.push(err("count.doctors", "doctors", "2-6 doctors"));
  // One FAQ for the whole page (owner): the questions the reviewed copy answers, merged, never split.
  if (c.faq.length < 4 || c.faq.length > 10) out.push(err("count.faq", "faq", "4-10 items"));
  c.faq.forEach((f, i) => {
    len(out, "length.faq.q", `faq[${i}].q`, f.q, 10, 90);
    if (!isPending(f.a)) { const n = words(f.a); if (n < 25 || n > 70) out.push(err("length.faq.a", `faq[${i}].a`, `${n} words; allowed 25-70`)); }
  });
  if (c.gallery.length < 6 || c.gallery.length > 24) out.push(err("count.gallery", "gallery", "6-24 images"));
  if (words(c.longForm) > 0) out.push(err("page.longForm", "longForm", "must be empty: the designed page carries the long copy in its sections"));
  const vw = visibleWords(c);
  if (vw < 450 || vw > 3600) out.push(err("length.visibleWords", "$", `${vw} visible words; allowed 450-3600 for a designed production page`));
  // Readability is reported, not blocking, on reviewed production copy (clinical register; long proper nouns).
  const g = gradeLevel([c.hero.standfirst, ...p.lead.paragraphs.map(richText), ...p.pathway.steps.map((s) => richText(s.body)), ...p.rest.paragraphs].map(str).join(" "));
  if (g > 12) out.push(warn("readability.grade", "$", `grade ${g.toFixed(1)}; aim for 12 or lower on a production page`));
  return out;
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
  if (c.page) return lintProductionPage(c);
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
  } else {
    out.push(err("count.films", "films", "no films"));
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
  if (!isPending(c.longForm) && (lf < 300 || lf > 1200)) out.push(err("length.longForm", "longForm", `${lf} words; allowed 300-1200`));
  const vw = visibleWords(c);
  if (vw > 900) out.push(err("length.visibleWords", "$", `${vw} visible words; max 900`));
  if (vw < 450 && c.production) out.push(err("length.visibleWords", "$", `${vw} visible words; min 450 for production`));
  const g = gradeLevel([c.hero.standfirst, ...c.admission.steps.map((s) => s.body), c.stillness.body, c.village.body].map(str).join(" "));
  if (g > 8) out.push(err("readability.grade", "$", `grade ${g.toFixed(1)}; max 8`));
  return out;
}
