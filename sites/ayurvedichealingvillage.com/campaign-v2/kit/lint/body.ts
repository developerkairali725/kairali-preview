// campaign-v2/kit/lint/body.ts — the links of a designed production page (CampaignConfig.page): programme, villa,
// film and inline copy links. Every link must be safe, a tel:/mailto: link must be one of the site's own contact
// links showing its own text, an in-page link must be one the consent runtime measures, and a film must be a YouTube
// watch link with a same-site thumbnail. production/load.ts applies the same rules at build time.
import type { CampaignConfig } from "../types.ts";
import type { Issue } from "./lengths.ts";
import { contact } from "../../../campaign-v110/lib/site.ts";
import { pageLinks } from "./page-text.ts";

const err = (rule: string, path: string, message: string): Issue => ({ level: "error", rule, path, message });

/**
 * The site's own phone and email links (locked facts, campaign-v110/lib/site.ts), each with the visible text the
 * live pages give it. The only tel: / mailto: values a page may carry: exact strings, no other number or address,
 * no query (?subject=, ?body=), no case or spacing variant. Not a protocol allowance.
 */
export const KNOWN_CONTACT_LINKS: readonly { href: string; text: string }[] = [
  { href: contact.phone.href, text: contact.phone.display },
  { href: `mailto:${contact.email}`, text: contact.email },
];
export const isKnownContactHref = (href: unknown): boolean => KNOWN_CONTACT_LINKS.some((k) => k.href === href);
/** A known contact href whose visible text is that contact's own (no "+91 …" text on another number). */
export const isKnownContactLink = (href: unknown, text: unknown): boolean => KNOWN_CONTACT_LINKS.some((k) => k.href === href && k.text === text);

/** Same-site path, https URL, an in-page anchor or one of the site's known contact links; never javascript:, data:, protocol-relative or bare hosts. */
export function safeHref(href: unknown): boolean {
  return typeof href === "string" && (/^\/(?![\/\\])\S*$/.test(href) || /^https:\/\/[^\s/]+(\/\S*)?$/.test(href) || /^#[A-Za-z][\w-]*$/.test(href) || isKnownContactHref(href));
}
/** In-page anchors the site's consent runtime measures (consent-runtime.ts measurementUrlSafe). */
export const MEASURED_HASHES = /^#(?:enquiry|main|contact|section-[0-8]|written-testimonials|press)$/;
const YOUTUBE = /^https:\/\/(www\.)?(youtube\.com\/watch\?v=[\w-]{11}|youtu\.be\/[\w-]{11})$/;
const SAME_SITE = /^\/(?![\/\\])\S+$/;

export function lintLinks(c: CampaignConfig): Issue[] {
  const out: Issue[] = [];
  for (const { path, href, text } of pageLinks(c)) {
    if (!safeHref(href)) out.push(err("page.href", path, `unsafe or malformed link: ${href}`));
    else if (isKnownContactHref(href) && !isKnownContactLink(href, text)) out.push(err("page.contact", path, `contact link ${href} must show its own locked text, not "${text}"`));
    else if (href.startsWith("#") && !MEASURED_HASHES.test(href)) out.push(err("page.hash", path, `in-page link ${href} is not measured by the consent runtime; use #enquiry`));
  }
  c.page?.stories?.films.forEach((f, i) => {
    if (!YOUTUBE.test(f.href)) out.push(err("page.film", `page.stories.films[${i}]`, `not a YouTube watch link: ${f.href}`));
    if (!SAME_SITE.test(f.thumb.src)) out.push(err("page.film", `page.stories.films[${i}].thumb`, "thumbnail must be a same-site path"));
  });
  return out;
}
