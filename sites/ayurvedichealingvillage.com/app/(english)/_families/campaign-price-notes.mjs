/**
 * AHV-M028.01 (Train G rework, 15 Oct 2026). Owner rule P06/ADD08: campaign pages present no prices. The 12 localized
 * /ayurvedic-treatment-packages.html routes (the long-form view; English is the campaign-v2 variant A, already price-free)
 * lost their villa tariffs, rate-download links and "from" amount in the view source. One accepted locale paragraph joins
 * a kept introduction and the now-orphaned "the rates mentioned are per night" note with a <br>, as ONE translation unit,
 * so the note cannot be cut from the source without dropping every locale's introduction to English. The paragraph is
 * marked data-ahv-campaign-price-note; this cuts the <br> and everything after it, in the live template (boot.ts) and in
 * the server snapshot (content-review.mjs), in every locale. Self-contained: boot.ts injects its source text.
 */
export function removeCampaignPriceNotes(html, route) {
  if (route !== "/ayurvedic-treatment-packages.html" || !html) return html;
  return html.replace(/(<p\b[^>]*\bdata-ahv-campaign-price-note\b[^>]*>)([^<]*)<br\b[^>]*>[\s\S]*?(<\/p>)/gi, "$1$2$3");
}
