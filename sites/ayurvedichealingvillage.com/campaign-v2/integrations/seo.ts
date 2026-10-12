// Structured data and verification meta for /lp-v2.
//
// Canonical and hreflang are deliberately NOT emitted: every variant URL (/lp-v2/<slug>/<a|b|c|d>) is
// noindex. The canonical for a campaign's main (indexable) route is Vikash's decision; see README.md.

import type { CampaignConfig, FilmRef, Offer } from "../kit/types.ts";
import { isPending } from "../kit/pending.ts";
import { contact, site } from "../../campaign-v110/lib/site.ts";
import type { Slots } from "./slots.ts";

/** The main site origin. Must equal site.config.json "domain" (a test pins this). */
export const MAIN_SITE_URL = "https://ayurvedichealingvillage.com";

const CLINIC_ID = `${MAIN_SITE_URL}/#clinic`;
const abs = (path: string) => new URL(path, `${MAIN_SITE_URL}/`).toString();

function clinic() {
  const [street1, street2, districtLine, stateLine] = contact.address;
  const postalCode = districtLine.match(/\d{6}/)?.[0] ?? "";
  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "@id": CLINIC_ID,
    name: site.name,
    url: `${MAIN_SITE_URL}/`,
    telephone: contact.phone.href.replace(/^tel:/, ""),
    email: contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${street1}, ${street2}`,
      addressLocality: districtLine.replace(/\s*District.*$/, ""),
      addressRegion: stateLine.split(",")[0].trim(),
      postalCode,
      addressCountry: "IN",
    },
  };
}

/** FAQPage for the answered questions, or null. Exported for the production routes' JSON-LD (production/jsonld.ts). */
export function faqPage(c: CampaignConfig, locale: string) {
  const answered = c.faq.filter((f): f is { q: string; a: string } => typeof f.a === "string" && !isPending(f.a) && !!f.a.trim());
  if (!answered.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: answered.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

function video(f: FilmRef) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: f.title,
    thumbnailUrl: abs(f.thumb),
    embedUrl: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(f.youtubeId)}`,
    contentUrl: `https://www.youtube.com/watch?v=${encodeURIComponent(f.youtubeId)}`,
  };
}

function offer(o: Offer) {
  return {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: o.name,
    description: o.headline,
    url: abs(o.termsUrl),
    validFrom: o.validFrom,
    validThrough: o.validTo,
    offeredBy: { "@id": CLINIC_ID },
  };
}

/** Every JSON-LD object for a campaign page: MedicalClinic, FAQPage, VideoObject×films, Offer, then campaign.extraJsonLd. */
export function buildJsonLd(c: CampaignConfig, req: { locale: string }): object[] {
  const out: object[] = [clinic()];
  const faq = faqPage(c, req.locale);
  if (faq) out.push(faq);
  const films = c.films ? [c.films.featured, ...c.films.more] : [];
  const seen = new Set<string>();
  for (const f of films) {
    if (!f || seen.has(f.youtubeId)) continue;
    seen.add(f.youtubeId);
    out.push(video(f));
  }
  if (c.offer && !isPending(c.offer)) out.push(offer(c.offer));
  if (Array.isArray(c.extraJsonLd)) out.push(...c.extraJsonLd.filter((x) => x && typeof x === "object"));
  return out;
}

/** JSON for a <script type="application/ld+json">, with "<" escaped so it can never close the tag. */
export function jsonLdScript(items: object[]): string {
  return JSON.stringify(items).replace(/</g, "\\u003c");
}

/** Verification <meta> tags, only for filled slots. */
export function verificationMeta(slots: Pick<Slots, "verification">): { name: string; content: string }[] {
  const v = slots.verification;
  const out: { name: string; content: string }[] = [];
  if (v.google) out.push({ name: "google-site-verification", content: v.google });
  if (v.bing) out.push({ name: "msvalidate.01", content: v.bing });
  if (v.facebook) out.push({ name: "facebook-domain-verification", content: v.facebook });
  return out;
}
