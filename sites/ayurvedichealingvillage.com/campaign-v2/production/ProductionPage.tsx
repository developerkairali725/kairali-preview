import type { CampaignConfig, Variant } from "../kit/types.ts";
import { skinCssVars } from "../kit/skins.ts";
import type { LpRequest } from "../route.ts";
import Header from "../sections/Header";
import Hero from "../sections/Hero";
import ConsultBar from "../sections/ConsultBar";
import ProofStrip from "../sections/ProofStrip";
import Faq from "../sections/Faq";
import Footer from "../sections/Footer";
import Enquiry from "../sections/interactive/Enquiry";
import Gallery from "../sections/interactive/Gallery";
import Lead from "./sections/Lead";
import Offering from "./sections/Offering";
import Pathway from "./sections/Pathway";
import Rest from "./sections/Rest";
import Place from "./sections/Place";
import Stories from "./sections/Stories";
import Stay from "./sections/Stay";
import Physicians from "./sections/Physicians";
import Interactions from "./Interactions";

/** Variant A ("Quiet Admission"), the owner-approved design of the live ad routes. */
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
 * One template for the four live ad routes. The reviewed copy (pages/*.ts) is set into the kit's variant-A design, in
 * the order a visitor decides:
 *
 *   hero (+ Step-1 bar on batch 1) → proof → why this page (Lead) → what it offers (Offering) → how it works (Pathway)
 *   → the quiet band (Rest) → the village and villas (Place) → patient films, where the page has them (Stories)
 *   → what a stay covers and how it is quoted (Stay) → the doctors (Physicians) → the enquiry → one FAQ → footer.
 *
 * Owner's corrections, 8 Oct 2026: one FAQ for the whole page (the kit FAQ, with FAQPage JSON-LD from the same items),
 * and the doctor biographies two sections further down than on the rejected composition — there they came straight
 * after the stillness band, ahead of the village and the fee section; here they follow both, directly before the
 * enquiry they lead into — and shown once. The old page's own structure (tables, link lists, galleries, source order)
 * is not carried over: its text and SEO topics are rewritten into these sections.
 *
 * Not rendered: the kit's mobile bar, "Ask anything" sheet, language switcher, tag loader and consent banner (the
 * site's own CTA bar, chat choices and consent run instead, from the production document); the offer band (offer:
 * null); any price (owner: hidden pricing). The Step-1 ConsultBar is left out where the route's existing form asks
 * none of its questions (`consultBar: false`, batch 2).
 */
export default function ProductionPage({ c }: { c: CampaignConfig }) {
  const page = c.page;
  if (!page) throw new Error(`production page ${c.slug}: no designed page (production/pages/${c.slug}.ts)`);
  const v = PRODUCTION_VARIANT;
  const req = PRODUCTION_REQUEST;
  const p = { c, v, req };
  return (
    <div className="lp lp-prod" data-variant={v} style={skinStyle(v)}>
      <Header {...p} />
      <main id="main">
        <Hero {...p} />
        {c.consultBar === false ? null : <ConsultBar {...p} />}
        <ProofStrip {...p} />
        <Lead lead={page.lead} />
        <Offering c={c} o={page.offering} />
        <Pathway p={page.pathway} />
        <Rest r={page.rest} image={c.stillness.image} />
        <Place c={c} pl={page.place} />
        {page.stories ? <Stories s={page.stories} /> : null}
        <Stay c={c} st={page.stay} />
        <Physicians c={c} d={page.doctors} />
        <Enquiry {...p} />
        <Faq {...p} />
      </main>
      <Footer {...p} />
      <Gallery items={c.gallery} />
      <Interactions />
    </div>
  );
}
