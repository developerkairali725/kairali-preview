// The page-context WhatsApp prefill of the live ad routes. Pure; node --test imports this file.
//
// English precedent (approved, unchanged): app/(lp)/_components/lp-sticky.tsx —
//   "Hello, I would like to enquire about " + document.title + " (" + window.location.pathname + ")."
// Russian (owner decision 9, 14 Oct 2026, OWNER-DECISIONS-20261014-ANSWERS.json "9-russian-whatsapp", row
// AHV-WB.536.whatsapp-message): a simple translation of that sentence for /lp/treatment-in-kerala-russian/. The page title
// is quoted rather than declined, so the sentence stays grammatical for any title. Same number, text parameter only.
// German (Train J3, AHV-WB.514.whatsapp-message): the same simple translation for /lp/behandlung-in-kerala/, on owner
// decision 9's precedent and owner decision 39 (15 Oct 2026, "Skip the review": no native review for German copy).
//
// Erasable TypeScript only (node --test imports this file).

/** The site's WhatsApp link (Priya, +91 92898 38797), exactly as the production sections render it. */
export const WHATSAPP_BASE = "https://wa.me/919289838797";

export type PrefillLocale = "en" | "ru" | "de";

/** The prefill sentence for a page title and path. */
export function prefillMessage(locale: PrefillLocale, title: string, pathname: string): string {
  if (locale === "ru") return "Здравствуйте! Хочу узнать подробнее: «" + title + "» (" + pathname + ").";
  if (locale === "de") return "Hallo, ich möchte mich nach „" + title + "“ erkundigen (" + pathname + ").";
  return "Hello, I would like to enquire about " + title + " (" + pathname + ").";
}

/** The WhatsApp link with the prefill as its only (URL-encoded) parameter. */
export function prefillHref(locale: PrefillLocale, title: string, pathname: string): string {
  return WHATSAPP_BASE + "?text=" + encodeURIComponent(prefillMessage(locale, title, pathname));
}

/** Only the bare site link is rewritten: any link that already carries text, or another number, is left alone. */
export function isBareWhatsApp(href: string | null | undefined): boolean {
  return href === WHATSAPP_BASE;
}
