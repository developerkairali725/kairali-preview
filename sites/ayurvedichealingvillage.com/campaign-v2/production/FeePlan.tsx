import type { CampaignConfig } from "../kit/types.ts";

/**
 * Owner-approved hidden pricing (owner, 7 Oct 2026): in place of the kit's fee table, the enquiry-only
 * quotation block from the copy (feePresentation). No amount, currency, currency switcher or rate download.
 * The inclusions and the separately charged items stay in the Admission section, as in every variant.
 */
export default function FeePlan({ c }: { c: CampaignConfig }) {
  const f = c.feePresentation;
  if (!f || c.fees !== null) return null;
  return (
    <section className="lp-sec lp-feeplan" aria-labelledby="lp-feeplan-h">
      <div className="lp-head">
        <h2 id="lp-feeplan-h" className="lp-h2">{f.heading}</h2>
      </div>
      <div className="lp-feeplan__main">
        <p className="lp-feeplan__body">{f.body}</p>
        <a className="lp-btn lp-btn--primary lp-feeplan__cta" href="#enquiry" data-track="cta_click" data-track-cta="consult" data-track-position="section">{f.cta}</a>
      </div>
    </section>
  );
}
