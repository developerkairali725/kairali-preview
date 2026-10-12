// campaign-v2/kit/lint/page-text.ts — every visible string and every link of a designed production page
// (CampaignConfig.page), for the claims, register, spelling, reply-time, link and pricing lints and for
// production/load.ts. Text is what a reader sees ("[label](href)" contributes its label). Pure, erasable TypeScript.
import type { CampaignConfig, RichText } from "../types.ts";
import { richLinks, richText } from "../rich.ts";

export type PageItem = { path: string; text: string };
export type PageLinkItem = { path: string; href: string; text: string };

export function pageText(c: CampaignConfig): PageItem[] {
  const out: PageItem[] = [];
  const p = c.page;
  if (!p) return out;
  const add = (path: string, v: string | undefined) => { if (v && v.trim()) out.push({ path, text: v }); };
  const rich = (path: string, list: readonly RichText[] | undefined) => list?.forEach((t, i) => add(`${path}[${i}]`, richText(t)));
  add("page.lead.heading", p.lead.heading);
  rich("page.lead.paragraphs", p.lead.paragraphs);
  p.lead.points?.forEach((t, i) => add(`page.lead.points[${i}]`, t));
  const o = p.offering;
  add("page.offering.kicker", o.kicker);
  add("page.offering.heading", o.heading);
  if (o.kind === "cards") {
    rich("page.offering.intro", o.intro);
    o.cards.forEach((card, i) => {
      add(`page.offering.cards[${i}].title`, card.title);
      card.links?.forEach((l, j) => add(`page.offering.cards[${i}].links[${j}]`, l.label));
      rich(`page.offering.cards[${i}].paragraphs`, card.paragraphs);
    });
  } else if (o.kind === "row") {
    add("page.offering.lead", o.lead);
    o.items.forEach((t, i) => add(`page.offering.items[${i}]`, t));
    rich("page.offering.paragraphs", o.paragraphs);
  } else {
    rich("page.offering.intro", o.intro);
    o.topics.forEach((t, i) => {
      add(`page.offering.topics[${i}].title`, t.title);
      add(`page.offering.topics[${i}].body`, richText(t.body));
    });
  }
  add("page.pathway.heading", p.pathway.heading);
  rich("page.pathway.intro", p.pathway.intro);
  p.pathway.steps.forEach((s, i) => {
    add(`page.pathway.steps[${i}].title`, s.title);
    add(`page.pathway.steps[${i}].body`, richText(s.body));
  });
  if (p.rest) {
    add("page.rest.heading", p.rest.heading);
    p.rest.paragraphs.forEach((t, i) => add(`page.rest.paragraphs[${i}]`, t));
  }
  add("page.place.heading", p.place?.heading);
  rich("page.place.paragraphs", p.place?.paragraphs);
  p.place?.villas?.forEach((v, i) => {
    add(`page.place.villas[${i}].name`, v.name);
    add(`page.place.villas[${i}].body`, v.body);
    add(`page.place.villas[${i}].link`, v.link.label);
  });
  if (p.stories) {
    add("page.stories.heading", p.stories.heading);
    add("page.stories.body", p.stories.body);
    p.stories.films.forEach((f, i) => add(`page.stories.films[${i}].title`, f.title));
  }
  add("page.stay.heading", p.stay.heading);
  rich("page.stay.paragraphs", p.stay.paragraphs);
  p.stay.lists.forEach((l, i) => {
    add(`page.stay.lists[${i}].heading`, l.heading);
    l.items.forEach((t, j) => add(`page.stay.lists[${i}].items[${j}]`, t));
  });
  rich("page.stay.after", p.stay.after);
  add("page.doctors.heading", p.doctors.heading);
  add("page.doctors.intro", p.doctors.intro);
  add("page.faqHeading", p.faqHeading);
  add("page.closing.heading", p.closing.heading);
  rich("page.closing.paragraphs", p.closing.paragraphs);
  return out;
}

export function pageLinks(c: CampaignConfig): PageLinkItem[] {
  const out: PageLinkItem[] = [];
  const p = c.page;
  if (!p) return out;
  const rich = (path: string, list: readonly RichText[] | undefined) => list?.forEach((t, i) =>
    richLinks(t).forEach((l, k) => out.push({ path: `${path}[${i}].link[${k}]`, href: l.href, text: l.text })));
  rich("page.lead.paragraphs", p.lead.paragraphs);
  const o = p.offering;
  if (o.kind === "cards") {
    rich("page.offering.intro", o.intro);
    o.cards.forEach((card, i) => {
      card.links?.forEach((l, j) => out.push({ path: `page.offering.cards[${i}].links[${j}]`, href: l.href, text: l.label }));
      rich(`page.offering.cards[${i}].paragraphs`, card.paragraphs);
    });
  } else if (o.kind === "row") {
    rich("page.offering.paragraphs", o.paragraphs);
  } else {
    rich("page.offering.intro", o.intro);
    o.topics.forEach((t, i) => rich(`page.offering.topics[${i}].body`, [t.body]));
  }
  rich("page.pathway.intro", p.pathway.intro);
  p.pathway.steps.forEach((s, i) => rich(`page.pathway.steps[${i}].body`, [s.body]));
  rich("page.place.paragraphs", p.place?.paragraphs);
  p.place?.villas?.forEach((v, i) => out.push({ path: `page.place.villas[${i}].link`, href: v.link.href, text: v.link.label }));
  p.stories?.films.forEach((f, i) => out.push({ path: `page.stories.films[${i}]`, href: f.href, text: f.title }));
  rich("page.stay.paragraphs", p.stay.paragraphs);
  rich("page.stay.after", p.stay.after);
  rich("page.closing.paragraphs", p.closing.paragraphs);
  return out;
}
