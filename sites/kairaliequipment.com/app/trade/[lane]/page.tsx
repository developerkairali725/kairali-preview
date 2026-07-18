// /trade/<lane> — the four B2B lane pages (protection map §2c: each a KEEP or
// ruled MERGE; spa-consultancy absorbs consultancy-services + the
// spa-equipment-planner tool page).
// CONTENT LAW: no MOQ, lead-time, territory, market or partner facts exist in
// the record — every such answer is "settled at quote stage", never a number.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMetadata } from "@kairali/seo";
import { graph, breadcrumbList, serializeJsonLd } from "@kairali/schema";
import siteConfig from "../../../site.config.json";
import { CATEGORIES, LANE_BY_SLUG, SITE_URL, TRADE_LANES } from "../../_lib/catalog";
import { PageHead, RfqBand } from "../../_components/page-chrome";

export function generateStaticParams() {
  return TRADE_LANES.map((l) => ({ lane: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ lane: string }> }): Promise<Metadata> {
  const { lane } = await params;
  const l = LANE_BY_SLUG.get(lane);
  if (!l) return {};
  return {
    ...(buildMetadata(siteConfig, {
      title: l.title,
      description: l.description,
      path: `/trade/${l.slug}`,
      siteName: "Kairali Equipment",
    }) as Metadata),
    keywords: l.keywords,
  };
}

/** Lane-specific substance, at record granularity only. */
const LANE_BODY: Record<string, { heads: Array<[string, string]>; note?: string }> = {
  "contract-manufacturing": {
    heads: [
      ["Your specification, our floor", "OEM builds run in the same facility as the group's own equipment — medicated wood, teak, brass and bell-metal work with the group's quality control."],
      ["What to send with the enquiry", "Drawings or reference photographs, target dimensions, material preferences and quantities. The team replies with feasibility, specifications and a quote."],
    ],
  },
  "hotel-resort-spa-supply": {
    heads: [
      ["From a group that runs its own", "The family group behind this equipment operates the NABH-accredited Kairali — The Ayurvedic Healing Village and wellness properties — buyer-side experience your fit-out inherits."],
      ["Fit-out scope", "Treatment tables, Shirodhara apparatus, steam chambers, vessels and accessories — the five catalogue lines, quoted per property and per room count."],
    ],
  },
  "spa-consultancy": {
    heads: [
      ["Equip a new centre end-to-end", "Planning, equipment selection and know-how — the consultancy lane the group's record has carried for years, from room planning to the equipment list. The four-generations experience is the consultancy's substance."],
      ["The planner, folded in", "The legacy site's spa-equipment planner is part of this lane: describe the rooms and treatments you plan, and the team maps the equipment list against them at quote stage."],
    ],
  },
  "distributors-importers": {
    heads: [
      ["The alliance network", "Worldwide export and alliance relationships are carried from the group's record — the group provides product and equipment support to its partners abroad."],
      ["Territories & margins", "Discussed one-to-one with the distributor team — no blanket figures are published. Send your market, channel and volumes with the enquiry."],
      ["What moves where", "No category ranking is published — which lines perform in which market is part of the one-to-one discussion, grounded in the group's own export record."],
      ["Partner support", "Product and equipment support is what the record carries for the group's alliances; marketing and localisation support are scoped per partner at quote stage — nothing is promised that is not on record."],
    ],
  },
};

export default async function LanePage({ params }: { params: Promise<{ lane: string }> }) {
  const { lane } = await params;
  const l = LANE_BY_SLUG.get(lane);
  if (!l) notFound();
  const body = LANE_BODY[l.slug];
  const url = `${SITE_URL}/trade/${l.slug}`;

  const jsonLd = graph(
    breadcrumbList({
      id: `${url}#breadcrumb`,
      items: [
        { name: "Home", url: SITE_URL },
        { name: "Trade & Export", url: `${SITE_URL}/trade` },
        { name: l.name, url },
      ],
    }),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <main>
        <PageHead
          overline={`Trade & export · ${l.name}`}
          title={l.h1}
          lede={l.copy}
          trail={[{ name: "Trade & Export", href: "/trade" }, { name: l.name }]}
          ctaLabel={l.cta}
          ctaHref="/request-a-quote"
          ctaEvent="trade-lane-click"
        />
        <section className="section container">
          <div className="terms-grid" style={{ marginTop: 8, gridTemplateColumns: undefined }}>
            {body.heads.map(([h, p]) => (
              <div className="terms-card" key={h}>
                <h3>{h}</h3>
                <p>{p}</p>
              </div>
            ))}
          </div>
          <div className="section-head" style={{ marginTop: 36 }}>
            <p className="overline">The catalogue</p>
            <h2>The five lines this lane draws on</h2>
          </div>
          <ul className="chips chips-light" aria-label="equipment lines" style={{ marginTop: 18 }}>
            {CATEGORIES.map((c) => (
              <li key={c.slug} style={{ display: "contents" }}>
                <Link className="chip" href={`/equipment/${c.slug}`} data-cta={`category-${c.slug}`}>
                  <b>{c.name}</b>
                  <span>{c.gloss}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <RfqBand context={`${l.name}: start the conversation`} event="trade-lane-click" />
      </main>
    </>
  );
}
