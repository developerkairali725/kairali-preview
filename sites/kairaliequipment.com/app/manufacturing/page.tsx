// /manufacturing — own factory · materials · QC · R&D (protection map §2b:
// facilities-and-row-material + quality-and-safety + research-and-development
// + green-commitment MERGE here; D-EQ-CLAIMS carries the claims as-is).
// CONTENT LAW: no green-commitment narrative exists in the record — the claim
// is carried at label granularity only, never expanded (HARD GATE 6). No
// factory dimensions, no process detail beyond the record: material specs are
// verbatim-mined.
import type { Metadata } from "next";
import Image from "next/image";
import { buildMetadata } from "@kairali/seo";
import { graph, breadcrumbList, serializeJsonLd } from "@kairali/schema";
import siteConfig from "../../site.config.json";
import { SITE_URL } from "../_lib/catalog";
import { PageHead, RfqBand } from "../_components/page-chrome";

export const metadata: Metadata = {
  ...(buildMetadata(siteConfig, {
    title: "Manufacturing — Own Factory, Materials, QC & R&D",
    description:
      "Kairali equipment is built in the group's own facility: medicated wood, teak, brass and bell metal — with the group's own quality control and R&D.",
    path: "/manufacturing",
    siteName: "Kairali Equipment",
  }) as Metadata),
  keywords: ["ayurveda equipment factory India", "medicated wood equipment", "teak steam box manufacturer", "equipment quality control"],
};

const jsonLd = graph(
  breadcrumbList({
    id: `${SITE_URL}/manufacturing#breadcrumb`,
    items: [
      { name: "Home", url: SITE_URL },
      { name: "Manufacturing", url: `${SITE_URL}/manufacturing` },
    ],
  }),
);

const MATERIALS: Array<[string, string]> = [
  ["Medicated wood", "Pathi / Droni massage beds — with brass decorative work and rose-wood finish"],
  ["Teak", "Steam boxes — with stainless-steel bottom and tank, automatic controls"],
  ["Brass & bell metal", "Urlis, Shirodhara pots and the accessory line"],
  ["Steel", "Bed stands and supports — every bed ships with stand and steel support"],
];

export default function ManufacturingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <main>
        <PageHead
          overline="Manufacturing · own facility"
          title="Our own factory, our own quality control, our own R&D"
          lede="Kairali Equipment builds in the group's own facility — the same in-house discipline the group applies to its Ayurvedic products, carried from the record, not written for this page. The group's green commitment is part of that record."
          trail={[{ name: "Manufacturing" }]}
        />
        <section className="section container">
          <div className="section-head">
            <p className="overline">Materials · from the record</p>
            <h2>What the equipment is made of</h2>
            <p className="sub">
              Every material below is quoted from the catalogue record at the
              granularity the record supports — nothing is embellished.
            </p>
          </div>
          <table className="spec-table" style={{ marginTop: 22, maxWidth: 720 }}>
            <tbody>
              {MATERIALS.map(([k, v]) => (
                <tr key={k}><td>{k}</td><td>{v}</td></tr>
              ))}
            </tbody>
          </table>
          <blockquote className="record-quote" style={{ maxWidth: 720 }}>
            <p>
              &ldquo;8.5 X 3 feet with 3 inches thickness. These massage beds are
              made of Medicated wood and have brass decorative works and rose wood
              finish. Every massage bed we supply includes a stand and steel
              support for complete stability.&rdquo;
            </p>
            <cite>The Pathi line — verbatim from the legacy catalogue</cite>
          </blockquote>
        </section>
        <section className="section container">
          <div className="cat-grid">
            <div>
              <div className="section-head">
                <p className="overline">The in-house habit</p>
                <h2>Made by the group, for institutions</h2>
                <p className="sub">
                  The group&rsquo;s manufacturing record runs from the family&rsquo;s
                  Ayurvedic manufacturing begun in 1948 to its own present-day
                  facility — factory, quality control and R&amp;D under one roof.
                  Certifications and awards are listed at record granularity on
                  the <a href="/certifications">Certifications page</a>, scoped
                  &ldquo;— group&rdquo; where they belong to the group.
                </p>
              </div>
              <p style={{ marginTop: 18 }}>
                Packaging and export terms are settled per order at quote stage;
                OEM and contract builds run on the same floor — see{" "}
                <a href="/trade/contract-manufacturing">Contract manufacturing</a>.
              </p>
            </div>
            <div className="made-figs" style={{ marginTop: 8 }}>
              <figure>
                <Image src="/images/shirodhara-pot.jpg" alt="Chain-hung brass Shirodhara pot" width={480} height={400} sizes="(min-width: 1000px) 20vw, 50vw" />
                <figcaption style={{ color: "color-mix(in srgb, var(--ink) 60%, transparent)" }}>Brass Shirodhara pot — legacy catalogue.</figcaption>
              </figure>
              <figure>
                <Image src="/images/shirodhara-equipment-set.jpg" alt="Brass Shirodhara equipment set of pots and bowls" width={520} height={340} sizes="(min-width: 1000px) 20vw, 50vw" />
                <figcaption style={{ color: "color-mix(in srgb, var(--ink) 60%, transparent)" }}>Shirodhara equipment set — legacy catalogue.</figcaption>
              </figure>
            </div>
          </div>
        </section>
        <RfqBand context="Put the factory to work on your specification" />
      </main>
    </>
  );
}
