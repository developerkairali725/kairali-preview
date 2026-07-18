// /about — group story · four-generations heritage · past & present.
// Protection map §2b: about-us + the-ayurvedic-group + past-and-present +
// core-values + corporate MERGE here (five thin pages → one strong one);
// news-and-articles joins as a press section ONLY when real articles exist
// (none recovered — left out, not faked).
// CONTENT LAW: heritage copy strictly from the canonical lineage document
// (docs/group-inputs/kairali-lineage.md §0/§0b, FLAG-3 / D-LIN-1989-WORDING).
import type { Metadata } from "next";
import Image from "next/image";
import { buildMetadata } from "@kairali/seo";
import { graph, breadcrumbList, serializeJsonLd } from "@kairali/schema";
import siteConfig from "../../site.config.json";
import { SITE_URL } from "../_lib/catalog";
import { PageHead, RfqBand } from "../_components/page-chrome";

export const metadata: Metadata = {
  ...(buildMetadata(siteConfig, {
    title: "About — Four Generations of Ayurveda, Founded 1989",
    description:
      "The Kairali Ayurvedic Group: a family practising Ayurveda since 1908, the group founded in 1989 — and the equipment division that serves its record.",
    path: "/about",
    siteName: "Kairali Equipment",
  }) as Metadata),
  keywords: ["Kairali ayurvedic group heritage", "four generations ayurveda", "Kairali founded 1989", "family Ayurveda lineage since 1908"],
};

const jsonLd = graph(
  breadcrumbList({
    id: `${SITE_URL}/about#breadcrumb`,
    items: [
      { name: "Home", url: SITE_URL },
      { name: "About", url: `${SITE_URL}/about` },
    ],
  }),
);

// Canonical lineage document §0b — the four generations, by name.
const GENERATIONS = [
  { n: "1st", who: "Dr. Sankunny Vaidiar", what: "Opened his first clinic in Palakkad in 1908 — the family lineage begins; a second clinic in Pollachi soon after." },
  { n: "2nd", who: "Dr. K.S. Vasudevan", what: "Began the family's Ayurvedic manufacturing in 1948; developed the Spalabs range of Ayurvedic pharmaceuticals." },
  { n: "3rd", who: "K.V. Ramesh & Gita Ramesh", what: "Founded the Kairali Ayurvedic Group in 1989, with the first Kairali Ayurvedic Centre in South Delhi." },
  { n: "4th", who: "K.R. Abhilash & K.R. Abishek", what: "Directors — the generation carrying the group and its products division today." },
];

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <main>
        <PageHead
          overline="About · the group behind the equipment"
          title="A family practising Ayurveda since 1908"
          lede="Kairali Equipment is the Ayurveda-equipment manufacturing division of the Kairali Ayurvedic Group — founded in 1989 by K.V. Ramesh and Gita Ramesh, four generations deep in the practice, and the family group behind the NABH-accredited Kairali — The Ayurvedic Healing Village."
          trail={[{ name: "About" }]}
        />
        <section className="section container">
          <div className="cat-grid">
            <div>
              <div className="section-head">
                <p className="overline">Past &amp; present</p>
                <h2>Four generations, one practice</h2>
                <p className="sub">
                  The dates below are the canonical family record — 1908 is the
                  family lineage, never a company founding; the group was founded
                  in 1989.
                </p>
              </div>
              <div className="faq-list" style={{ marginTop: 20 }}>
                {GENERATIONS.map((g) => (
                  <details key={g.n} open={g.n === "1st"}>
                    <summary>{g.n} generation — {g.who}</summary>
                    <p>{g.what}</p>
                  </details>
                ))}
              </div>
              <p style={{ marginTop: 22 }}>
                In the late 1960s the family&rsquo;s Spalabs range of Ayurvedic
                pharmaceuticals was developed in Bangalore, where K.V. Ramesh —
                still in his teens — worked at his father&rsquo;s side. The
                equipment division carries that same in-house habit: the group
                manufactures for itself first, in its own facility, with its own
                quality control.
              </p>
            </div>
            <figure className="cat-fig">
              <Image src="/images/about-equipment.jpg" alt="Kairali Ayurveda equipment display from the legacy site" width={400} height={300} sizes="(min-width: 1000px) 40vw, 100vw" />
              <figcaption>From the legacy equipment site — commissioned photography pending.</figcaption>
            </figure>
          </div>
        </section>
        <RfqBand context="Work with the group's equipment division" />
      </main>
    </>
  );
}
