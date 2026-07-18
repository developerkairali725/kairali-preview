// /trade — B2B lanes hub + export / worldwide-alliances section (protection
// map §2c: trade-and-consultancy KEEP; worldwide-alliances MERGES here).
// CONTENT LAW: the alliance claim is carried at the record's granularity (the
// verified summary of the legacy Worldwide Alliances page) — no named markets,
// no named partners, no invented terms (HARD GATE 6).
import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@kairali/seo";
import { graph, breadcrumbList, serializeJsonLd } from "@kairali/schema";
import siteConfig from "../../site.config.json";
import { SITE_URL, TRADE_LANES } from "../_lib/catalog";
import { PageHead, RfqBand } from "../_components/page-chrome";

export const metadata: Metadata = {
  ...(buildMetadata(siteConfig, {
    title: "Trade & Export — Four Ways Institutions Work With Us",
    description:
      "Contract manufacturing, hotel and resort supply, spa-setup consultancy, distributors and importers — the group's export record, quote-first.",
    path: "/trade",
    siteName: "Kairali Equipment",
  }) as Metadata),
  keywords: ["ayurveda equipment exporter", "worldwide ayurveda equipment supply", "export spa equipment India"],
};

const jsonLd = graph(
  breadcrumbList({
    id: `${SITE_URL}/trade#breadcrumb`,
    items: [
      { name: "Home", url: SITE_URL },
      { name: "Trade & Export", url: `${SITE_URL}/trade` },
    ],
  }),
);

export default function TradeHub() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <main>
        <PageHead
          overline="Trade &amp; export"
          title="Four ways institutions work with us"
          lede="Worldwide export and alliance relationships are carried from the group's record: the group sets up resorts and Ayurvedic centres in India and abroad, and provides product and equipment support to its partners. Every lane starts the same way — tell us about the project, and the sales team quotes it."
          trail={[{ name: "Trade & Export" }]}
        />
        <section className="section container">
          <div className="lane-grid">
            {TRADE_LANES.map((l) => (
              <Link className="lane-card" key={l.slug} href={`/trade/${l.slug}`} data-cta="trade-lane-click">
                <h3>{l.name}</h3>
                <p>{l.copy}</p>
                <span className="go">{l.cta} &rarr;</span>
              </Link>
            ))}
          </div>
          <p className="lane-after">
            Export note: markets, territories and commercial terms are discussed
            per project and per partner — the record carries the capability, and
            the specifics are settled one-to-one, never published as blanket
            figures.
          </p>
        </section>
        <RfqBand context="Tell us which lane fits your project" />
      </main>
    </>
  );
}
