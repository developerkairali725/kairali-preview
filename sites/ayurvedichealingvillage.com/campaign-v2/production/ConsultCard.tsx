import type { CampaignConfig } from "../kit/types.ts";
import { ArrowIcon } from "../sections/icons";
import AskAnythingButton from "./AskAnythingButton";
import type { ProductionUi } from "./ui.ts";

/**
 * The B (Garden Bento) and D (Direct) hero card on a live ad route without a Step-1 bar: the slot where those artboards
 * put the Step-1 form, holding the consultation itself instead — what is free, the route's primary CTA to the one
 * enquiry form (#enquiry) and the site's existing chat choices. It asks no question, so the route's lead contract is
 * exactly the enquiry form's; no answer is carried anywhere.
 */
export default function ConsultCard({ c, ui }: { c: CampaignConfig; ui: ProductionUi }) {
  const primary = c.cta?.primary ?? ui.hero.card;
  return (
    <div className="lp-consult lp-consult--card lp-panel">
      <div className="lp-consult__head">
        <p className="lp-consult__title">{ui.hero.card}</p>
      </div>
      {c.cta?.primarySupport ? <p className="lp-consult__sub">{c.cta.primarySupport}</p> : null}
      <a className="lp-consult__submit" href="#enquiry" data-track="cta_click" data-track-cta="consult" data-track-position="hero">
        <span className="lp-consult__label">{primary}</span><span className="lp-consult__arrow"><ArrowIcon /></span>
      </a>
      {c.cta?.secondary ? <AskAnythingButton className="lp-btn lp-btn--line lp-consult__ask" label={c.cta.secondary} /> : null}
    </div>
  );
}
