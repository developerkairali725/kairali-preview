// campaign-v2/kit/lint/pricing.ts — owner-approved hidden pricing (owner, 7 Oct 2026: campaign pages show no
// numeric prices and no rate downloads; enquiry-only quotation instead). Only active with pricing.display
// "hidden". Every visible string is scanned (the authored copy, including a designed page's sections, and alt
// text), and every link of a designed page, so a price or a tariff link is an error to resolve, never shipped.
import type { CampaignConfig } from "../types.ts";
import type { Issue } from "./lengths.ts";
import { allText } from "./claims.ts";
import { altTexts } from "./assets.ts";
import { pageLinks } from "./page-text.ts";

const err = (rule: string, path: string, message: string): Issue => ({ level: "error", rule, path, message });

const CURRENCY = "(?:₹|rs\\.?|inr|usd|us\\$|\\$|€|eur|£|gbp|aed|dhs?)";
/** A money amount: a currency next to a number, a number next to a currency word, or a number per night/day/person. */
export const PRICE = new RegExp(
  `${CURRENCY}\\s?\\d|\\d[\\d,.]*\\s?(?:${CURRENCY}|rupees?|dollars?|euros?|pounds sterling|dirhams?)(?![a-z])|\\d[\\d,.]*\\s*(?:\\/|per)\\s*(?:night|day|person|head|pax)\\b`,
  "i",
);
/** A tariff / rate document or price list, by link text or destination. */
export const RATE_LINK = /tariff|\brates?\b|rate[ -]?(?:card|list|sheet)|price[ -]?list|\bpricing\b|\/pdf\/|\.pdf(?:[?#]|$)|kairali-documents\./i;

export function lintPricing(c: CampaignConfig): Issue[] {
  const out: Issue[] = [];
  if (c.pricing?.display !== "hidden") return out;
  if (c.pricing.approvedBy !== "owner" || !c.pricing.date?.trim() || !c.pricing.rule?.trim()) out.push(err("pricing.policy", "pricing", "hidden pricing must record the owner's approval (approvedBy, date, rule)"));
  if (c.fees !== null) out.push(err("pricing.fees", "fees", "hidden pricing: fees must be null"));
  // The enquiry-only quotation: a designed page's "what your stay covers" section (production/sections/Stay.tsx).
  if (!c.page?.stay.lists.length) out.push(err("pricing.presentation", "page.stay", "hidden pricing needs the enquiry-only quotation section"));
  if (c.offer !== null) out.push(err("pricing.offer", "offer", "hidden pricing: no offer block (offers are priced)"));
  for (const { path, text } of [...allText(c), ...altTexts(c)]) {
    const m = text.match(PRICE);
    if (m) out.push(err("price.leak", path, `numeric price "${m[0]}" on a hidden-pricing page`));
  }
  for (const { path, href, text } of pageLinks(c)) {
    if (RATE_LINK.test(href) || RATE_LINK.test(text)) out.push(err("price.rateLink", path, `rate/tariff link "${text}" → ${href} on a hidden-pricing page (owner decision needed)`));
  }
  return out;
}
