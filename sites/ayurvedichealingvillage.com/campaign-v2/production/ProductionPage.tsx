import type { ReactNode } from "react";
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
import StickyHeader from "./StickyHeader";
import { uiFor } from "./ui.ts";
import { sectionOrder, type Block } from "./section-order.ts";

/** Variant A ("Quiet Admission"), the owner-approved design of the first four live ad routes, and the default. */
export const PRODUCTION_VARIANT: Variant = "A";

/**
 * The request the live routes render with: static pages for every visitor, in the route's own language (English, or
 * German / Russian on those two routes). No geo variation (the routes stay cacheable and identical for search engines
 * and ads review); consent is the site's own, everywhere.
 */
export const PRODUCTION_REQUEST: LpRequest = { locale: "en", dir: "ltr", currency: "INR", consentRequired: true, surface: "production" };
export const productionRequest = (c: CampaignConfig): LpRequest => ({ ...PRODUCTION_REQUEST, locale: c.locales[0] ?? "en" });

/**
 * Each variant's self-hosted faces (production/fonts.ts). A and C: Marcellus + Mulish (the kit skins). B: Instrument
 * Serif display (the kit's B face, self-hosted) + Mulish. D: Mulish throughout (the kit's D face, Plus Jakarta Sans, is
 * not self-hosted on this site, so the site's own sans stands in at the same weights). Russian: Cyrillic is not in
 * these files, so its words fall back to the system serif / sans for the whole run, never letter by letter.
 */
const FONTS: Record<Variant, { display: string; body: string }> = {
  A: { display: "var(--f-marcellus)", body: "var(--f-mulish)" },
  B: { display: "var(--f-instrument)", body: "var(--f-mulish)" },
  C: { display: "var(--f-marcellus)", body: "var(--f-mulish)" },
  D: { display: "var(--f-mulish)", body: "var(--f-mulish)" },
};
function skinStyle(v: Variant, locale: string): Record<string, string> {
  const f = FONTS[v];
  if (locale === "ru") {
    return { ...skinCssVars(v), "--lp-font-display": "Georgia,\"Times New Roman\",serif", "--lp-font-body": "system-ui,-apple-system,\"Segoe UI\",Roboto,Arial,sans-serif" };
  }
  return {
    ...skinCssVars(v),
    "--lp-font-display": `${f.display},Georgia,serif`,
    "--lp-font-body": `${f.body},system-ui,-apple-system,"Segoe UI",sans-serif`,
  };
}

/** C numbers its chapters in reading order (the kit's "01 The method → 02 … "); the other variants use kickers. */
const CHAPTERED: Block[] = ["offering", "pathway", "place", "stay", "physicians"];

/**
 * One template for the live ad routes. The reviewed copy (pages/*.ts) is set into the route's kit variant (bindings.ts
 * `variant`, default A — the four first routes, unchanged), in the order a visitor decides:
 *
 *   hero (+ Step-1 bar on batch 1) → proof → the variant's designed sections → the enquiry → one FAQ → footer.
 *
 * The designed sections' order is section-order.ts: the variant's default (doctors last, before the enquiry), except
 * on the routes it lists, where the owner (10 Oct 2026) moved the same doctors section up to follow the lead.
 *
 * The old page's own structure (tables, link lists, galleries, source order) is not carried over: its text and SEO
 * topics are rewritten into these sections. Owner, 8 Oct 2026: on desktop the header stays pinned while the page
 * scrolls, with the consultation CTA in it (StickyHeader + production.css), in every variant.
 *
 * Not rendered: the kit's mobile bar, "Ask anything" sheet, language switcher, tag loader and consent banner (the
 * site's own CTA bar, chat choices and consent run instead, from the production document); the offer band (offer:
 * null); any price (owner: hidden pricing). The Step-1 ConsultBar is left out where the route's existing form asks
 * none of its questions (`consultBar: false`); in B and D the hero card then holds the consultation CTA instead.
 */
export default function ProductionPage({ c }: { c: CampaignConfig }) {
  const page = c.page;
  if (!page) throw new Error(`production page ${c.slug}: no designed page (production/pages/${c.slug}.ts)`);
  const v = c.defaultVariant ?? PRODUCTION_VARIANT;
  const req = productionRequest(c);
  const ui = uiFor(req.locale);
  const p = { c, v, req };
  const order = sectionOrder(c, v);
  let chapter = 0;
  const sec = (b: Block) => ({ v, ui, ...(v === "C" && CHAPTERED.includes(b) ? { no: String(++chapter).padStart(2, "0") } : {}) });
  const render = (b: Block): ReactNode => {
    switch (b) {
      case "lead": return <Lead key={b} lead={page.lead} {...sec(b)} />;
      case "offering": return <Offering key={b} c={c} o={page.offering} {...sec(b)} />;
      case "pathway": return <Pathway key={b} p={page.pathway} {...sec(b)} />;
      case "rest": return page.rest ? <Rest key={b} r={page.rest} image={c.stillness.image} /> : null;
      case "place": return page.place ? <Place key={b} c={c} pl={page.place} {...sec(b)} /> : null;
      case "stories": return page.stories ? <Stories key={b} s={page.stories} {...sec(b)} /> : null;
      case "stay": return <Stay key={b} c={c} st={page.stay} {...sec(b)} />;
      case "physicians": return <Physicians key={b} c={c} d={page.doctors} {...sec(b)} />;
    }
  };
  return (
    <div className="lp lp-prod" data-variant={v} data-mobile-consult={c.slug === "treatment-packages" || c.slug === "panchakarma" ? "" : undefined} lang={ui.lang} style={skinStyle(v, req.locale)}>
      <Header {...p} />
      <main id="main">
        <Hero {...p} />
        {c.consultBar === false ? null : <ConsultBar {...p} />}
        <ProofStrip {...p} />
        {order.map(render)}
        <Enquiry {...p} />
        <Faq {...p} />
      </main>
      <Footer {...p} />
      {order.includes("place") ? <Gallery items={c.gallery} ui={ui.gallery} alt={ui.alt} /> : null}
      <Interactions />
      <StickyHeader />
    </div>
  );
}
