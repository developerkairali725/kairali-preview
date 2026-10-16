// The live ad routes' pre-submit WhatsApp links (AHV-WB.*.whatsapp-message): the same locked number, opened with a
// neutral message naming the page the visitor came from, so patient care knows the context. The page name is the
// route's own reviewed SEO title (production/pages/*.ts) without its " | …" brand suffix; nothing else goes in: no
// visitor input, symptoms, prices, query string or tracking value, and nothing is sent automatically (the visitor
// still writes and sends the message in WhatsApp). The post-submit hand-off (kit/handoff.ts, the enquiry reference)
// is separate and unchanged.
//
// Only the production surface gets a message; the /lp-v2 kit previews keep the bare link. A page language without a
// reviewed message here (German, Russian) also keeps the bare link rather than an English one. The German line
// (AHV-WB.514) was rejected in review (no native/owner acceptance; the generated DE chat choices stay bare) and is
// excluded from Train A, so /lp/behandlung-in-kerala/ keeps the bare link everywhere.
//
// Erasable TypeScript only (node --test imports this file).

import type { CampaignConfig } from "../kit/types.ts";
import { contact } from "../../campaign-v110/lib/site.ts";

/** `{page}` = the page name. Locales absent here keep the bare link. */
export const WHATSAPP_PAGE_MESSAGE: Partial<Record<string, string>> = {
  en: "Hello, I would like to enquire about your “{page}” page.",
};

/** The bare WhatsApp link (the locked patient-care number). */
export const WHATSAPP_HREF = `https://wa.me/${contact.whatsapp.number}`;

/** The page name a message uses: the route's SEO title, without the brand suffix after " | ". */
export const whatsappPageName = (c: Pick<CampaignConfig, "seo">): string => c.seo.title.split(" | ")[0].trim();

/** The WhatsApp link for one rendered page: page-context prefill on the live ad routes, else the bare link. */
export function whatsappHref(c: Pick<CampaignConfig, "seo">, req: { surface?: string; locale: string }): string {
  const template = req.surface === "production" ? WHATSAPP_PAGE_MESSAGE[req.locale] : undefined;
  const page = template ? whatsappPageName(c) : "";
  return template && page ? `${WHATSAPP_HREF}?text=${encodeURIComponent(template.replace("{page}", page))}` : WHATSAPP_HREF;
}
