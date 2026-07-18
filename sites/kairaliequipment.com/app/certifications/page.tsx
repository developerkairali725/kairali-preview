// /certifications — KEEP-AS-PAGE (protection map §2b): the core trust lever.
// CONTENT LAW (D-EQ-CLAIMS + pass4-fixed-rulings §5): claims carried as-is at
// record granularity; the VERIFIED credentials below are group-scoped and say
// so ("— group"); badge chips are TEXT until official artwork lands (demanding
// artwork now = demanding fabrication). No equipment-specific certification
// exists in the record — none is invented. The wider group award corpus
// (travel/spa awards) belongs to the hospitality entities and is NOT printed
// here (flagged to the owner in QUESTIONS.md).
import type { Metadata } from "next";
import { buildMetadata } from "@kairali/seo";
import { graph, breadcrumbList, serializeJsonLd } from "@kairali/schema";
import siteConfig from "../../site.config.json";
import { SITE_URL } from "../_lib/catalog";
import { PageHead, RfqBand } from "../_components/page-chrome";

export const metadata: Metadata = {
  ...(buildMetadata(siteConfig, {
    title: "Certifications & Awards — Carried from the Record",
    description:
      "The group's verified credentials: NABH-accredited AYUSH hospital (AH-2024-0250) and Green Leaf, Govt. of Kerala — listed at record granularity.",
    path: "/certifications",
    siteName: "Kairali Equipment",
  }) as Metadata),
  keywords: ["certified ayurvedic equipment manufacturer", "ayurveda equipment certifications", "awards"],
};

const jsonLd = graph(
  breadcrumbList({
    id: `${SITE_URL}/certifications#breadcrumb`,
    items: [
      { name: "Home", url: SITE_URL },
      { name: "Certifications", url: `${SITE_URL}/certifications` },
    ],
  }),
);

const CREDENTIALS = [
  {
    name: "NABH — Accredited AYUSH Hospital",
    scope: "— group",
    detail:
      "Kairali — The Ayurvedic Healing Village, Palakkad, Kerala. Certificate AH-2024-0250, valid 25 April 2024 to 24 April 2027 (portal.nabh.co accredited list).",
  },
  {
    name: "Green Leaf — Govt. of Kerala",
    scope: "— group",
    detail:
      "Green Leaf certification for Kairali — The Ayurvedic Healing Village: the Government of Kerala's highest classification for Ayurveda centres.",
  },
  {
    name: "Clinical Establishment — Permanent Certificate",
    scope: "— group",
    detail:
      "Under the Kerala Clinical Establishments (Registration and Regulation) Act, 2018 — permanent certificate valid through 2030 for the Healing Village hospital.",
  },
];

export default function CertificationsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <main>
        <PageHead
          overline="Certifications &amp; awards"
          title="Carried from the record, scoped where they belong"
          lede="The credentials below are the group's verified record. Where a credential belongs to the group or its hospital rather than the equipment division, it says so — nothing is re-badged onto the equipment business."
          trail={[{ name: "Certifications" }]}
        />
        <section className="section container">
          <div className="terms-grid" style={{ marginTop: 8 }}>
            {CREDENTIALS.map((c) => (
              <div className="terms-card" key={c.name}>
                <h3>{c.name} <span style={{ fontFamily: "var(--font-caption)", fontSize: "0.72rem", color: "var(--bronze-600)" }}>{c.scope}</span></h3>
                <p>{c.detail}</p>
              </div>
            ))}
          </div>
          <p className="pdp-note" style={{ maxWidth: 720 }}>
            Badge artwork note: official certificate marks are shown as text until
            the official artwork files land — the facts above are verified; the
            graphics are simply not in hand yet. The group&rsquo;s wider award
            record (hospitality and travel awards) belongs to the group&rsquo;s
            hospitality entities and is listed on{" "}
            <a href="https://www.kairali.com" rel="noopener">kairali.com</a>.
          </p>
        </section>
        <RfqBand context="Institutional credibility, then the quote" />
      </main>
    </>
  );
}
