import type { CampaignConfig, Variant } from "../../kit/types.ts";
import type { ProductionUi } from "../ui.ts";

/** Roman step numerals, as the kit's Admission sets them (variant A). */
export const NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII"];
export const numeral = (i: number): string => NUMERALS[i] ?? String(i + 1);

/** What every designed section receives from the template: the variant, the page's interface words, its chapter (C). */
export type SecProps = { v: Variant; ui: ProductionUi; no?: string };

/**
 * A section's call to action: the route's primary CTA to the enquiry form. "#enquiry" is a fragment the site's consent
 * runtime measures; no other in-page link is used on these pages.
 */
export function ConsultCta({ c }: { c: CampaignConfig }) {
  return (
    <a className="lp-btn lp-btn--primary lp-pcta" href="#enquiry"
      data-track="cta_click" data-track-cta="consult" data-track-position="section">
      {c.cta?.primary ?? "Get free doctor consultation"}
    </a>
  );
}
