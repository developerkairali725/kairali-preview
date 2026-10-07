// Pure parts of the live routes' client wiring (Interactions.tsx, AskAnythingButton.tsx), importable by
// node --test. Erasable TypeScript only.

/**
 * The live page's interaction diagnostics, unchanged: the same link → (name, target) mapping as
 * app/(campaign)/ayurvedic-treatment-packages.html/GuestSupport.tsx. `inProgrammeSection` = the link sits in
 * #section-1 or #section-6. Pure.
 */
export type Interaction = readonly [name: string, target: string];
export function interactionForLink(href: string, inProgrammeSection: boolean): Interaction | null {
  if (href === "#enquiry") return ["enquiry_open", "enquiry"];
  if (href.startsWith("tel:")) return ["contact_click", "phone"];
  if (href.startsWith("mailto:")) return ["contact_click", "email"];
  if (href.includes("wa.me/")) return ["contact_click", "whatsapp"];
  if (href.includes("google.com/maps/")) return ["contact_click", "directions"];
  if (href.includes("/pdf/")) return ["tariff_download", "tariff"];
  if (href.includes("youtube.com/")) return ["video_open", "video"];
  if (inProgrammeSection) return ["programme_open", "programme"];
  return null;
}

/** The site's existing chat choices (public/design/review-chrome.js builds them on body[data-ahv-campaign]). */
export const CONTACT_DIALOG_ID = "ahv-contact-controls";
export const CONTACT_TRIGGER = ".ahv-contact-trigger";

type ChatDoc = {
  querySelector(sel: string): { click(): void } | null;
  getElementById(id: string): { open?: boolean; showModal?: () => void; querySelector(sel: string): { focus(): void } | null } | null;
};

/**
 * "Ask Anything" opens the same choices as the header Chat control (WhatsApp us, Chat with Priya, Instagram,
 * Facebook Messenger): it clicks that control when present, else opens the dialog itself. Returns true when
 * something opened. Never adds a channel or swaps chat for WhatsApp.
 */
export function openExistingChatChoices(doc: ChatDoc): boolean {
  const trigger = doc.querySelector(CONTACT_TRIGGER);
  if (trigger) {
    trigger.click();
    return true;
  }
  const dialog = doc.getElementById(CONTACT_DIALOG_ID);
  if (!dialog || typeof dialog.showModal !== "function") return false;
  if (!dialog.open) dialog.showModal();
  dialog.querySelector("button[data-ahv-close]")?.focus();
  return true;
}
