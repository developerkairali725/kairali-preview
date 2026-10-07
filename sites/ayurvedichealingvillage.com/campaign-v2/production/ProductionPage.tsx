import type { CampaignConfig, Variant } from "../kit/types.ts";
import { skinCssVars } from "../kit/skins.ts";
import type { LpRequest } from "../route.ts";
import Header from "../sections/Header";
import Hero from "../sections/Hero";
import ConsultBar from "../sections/ConsultBar";
import ProofStrip from "../sections/ProofStrip";
import Admission from "../sections/Admission";
import Stillness from "../sections/Stillness";
import Doctors from "../sections/Doctors";
import Village from "../sections/Village";
import Faq from "../sections/Faq";
import Footer from "../sections/Footer";
import Enquiry from "../sections/interactive/Enquiry";
import Gallery from "../sections/interactive/Gallery";
import FeePlan from "./FeePlan";
import Body from "./Body";
import Interactions from "./Interactions";

/** Variant A (full content): the only variant that carries the whole source body (D drops it). */
export const PRODUCTION_VARIANT: Variant = "A";

/**
 * The request the live routes render with: static English pages for every visitor. No geo variation (the
 * routes stay cacheable and identical for search engines and ads review); consent is the site's own, everywhere.
 */
export const PRODUCTION_REQUEST: LpRequest = { locale: "en", dir: "ltr", currency: "INR", consentRequired: true, surface: "production" };

/** The kit skin vars plus skin A's self-hosted faces (production/fonts.ts), on the page's own wrapper. */
function skinStyle(v: Variant): Record<string, string> {
  return {
    ...skinCssVars(v),
    "--lp-font-display": "var(--f-marcellus),Georgia,serif",
    "--lp-font-body": "var(--f-mulish),system-ui,-apple-system,\"Segoe UI\",sans-serif",
  };
}

/**
 * Section order: Variant A's, with the owner's production rules applied. The fee table becomes the
 * enquiry-only quotation block (FeePlan); the offer band is absent (offer: null); films live in the source body;
 * the preserved source body takes the long-form slot, ahead of the enquiry so the form follows the full content.
 * Not rendered: the kit's mobile bar, "Ask anything" sheet, language switcher, tag loader and consent banner
 * (the site's own CTA bar, chat choices and consent run instead, from the production document).
 */
export default function ProductionPage({ c }: { c: CampaignConfig }) {
  const v = PRODUCTION_VARIANT;
  const req = PRODUCTION_REQUEST;
  const p = { c, v, req };
  return (
    <div className="lp lp-prod" data-variant={v} style={skinStyle(v)}>
      <Header {...p} />
      <main id="main">
        <Hero {...p} />
        <ConsultBar {...p} />
        <ProofStrip {...p} />
        <Admission {...p} />
        <Stillness {...p} />
        <Doctors {...p} />
        <Village {...p} />
        <FeePlan c={c} />
        <Body c={c} />
        <Enquiry {...p} />
        <Faq {...p} />
      </main>
      <Footer {...p} />
      <Gallery items={c.gallery} />
      <Interactions />
    </div>
  );
}
