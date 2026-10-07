import type { JSX } from "react";
import type { CampaignConfig, Variant } from "../kit/types.ts";
import { SECTION_ORDER, type SectionId } from "../kit/variants.ts";
import type { LpRequest } from "../route.ts";
import Header from "./Header"; import Hero from "./Hero"; import ConsultBar from "./ConsultBar";
import ProofStrip from "./ProofStrip"; import OfferBand from "./OfferBand"; import Admission from "./Admission";
import Stillness from "./Stillness"; import Doctors from "./Doctors"; import Village from "./Village";
import Faq from "./Faq"; import LongForm from "./LongForm"; import Footer from "./Footer";
import Films from "./interactive/Films"; import Fees from "./interactive/Fees"; import Enquiry from "./interactive/Enquiry";
import MobileBar from "./interactive/MobileBar"; import Gallery from "./interactive/Gallery";
import { carryParams, type SearchParams } from "../forms/carry.ts";
import "./sections.css";

/** `carry`: allow-listed tracking params for the no-JS ConsultForm GET (forms/carry.ts). Only ConsultBar and Hero get it. */
export type SectionProps = { c: CampaignConfig; v: Variant; req: LpRequest; carry?: [string, string][] };

// ProofStrip is an async server component (it may read the live Google rating).
const MAP: Record<SectionId, (p: SectionProps) => JSX.Element | null | Promise<JSX.Element | null>> = {
  header: Header, hero: Hero, consultBar: ConsultBar, proof: ProofStrip, offer: OfferBand, admission: Admission,
  stillness: Stillness, doctors: Doctors, village: Village, enquiry: Enquiry,
  // Films and Fees are client components: hand them plain data, never the whole config.
  // Neither renders without data (films live in a preserved source body; fees null = owner-approved hidden pricing).
  films: ({ c, v }) => (c.films ? <Films films={c.films} v={v} /> : null),
  fees: ({ c, v, req }) => (c.fees === null ? null : <Fees fees={c.fees} v={v} locale={req.locale} currency={req.currency} />),
  faq: Faq, longForm: LongForm, footer: Footer,
};

/** Sections in the variant's order. The <html>/<body> shell is Document, rendered by the root layout. */
// header and footer render outside <main> so they stay banner / contentinfo landmarks.
export default function LandingPage({ campaign, variant, req, searchParams }:
  { campaign: CampaignConfig; variant: Variant; req: LpRequest; searchParams?: SearchParams }) {
  const order = SECTION_ORDER[variant];
  const carry = carryParams(searchParams);
  const render = (id: SectionId) => {
    const S = MAP[id];
    return <S key={id} c={campaign} v={variant} req={req} {...(id === "consultBar" || id === "hero" ? { carry } : {})} />;
  };
  return (
    <>
      {order.includes("header") ? render("header") : null}
      <main>{order.filter((id) => id !== "header" && id !== "footer").map(render)}</main>
      {order.includes("footer") ? render("footer") : null}
      {order.includes("village") ? (
        <Gallery items={campaign.modesty === "gcc" ? campaign.gallery.filter((g) => g.image.gccSafe) : campaign.gallery} />
      ) : null}
      <MobileBar c={campaign} v={variant} req={req} />
    </>
  );
}
