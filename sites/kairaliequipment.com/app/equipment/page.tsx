// /equipment — catalog hub (STRATEGY §1): 5 category cards + trust context +
// RFQ CTA. ItemList schema (§4); category content is REAL (mined), everything
// below category level is owner-ordered placeholder (D-EQ-CATALOG).
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { buildMetadata } from "@kairali/seo";
import { graph, breadcrumbList, serializeJsonLd } from "@kairali/schema";
import siteConfig from "../../site.config.json";
import { CATEGORIES, SITE_URL } from "../_lib/catalog";
import { PageHead, RfqBand } from "../_components/page-chrome";

export const metadata: Metadata = {
  ...(buildMetadata(siteConfig, {
    title: "Ayurvedic Spa Equipment — The Kairali Catalogue",
    description:
      "Five equipment lines from Kairali's own facility: Pathi (Droni) beds, Shirodhara stands, steam boxes, urlis and accessories. Quote-first — no prices.",
    path: "/equipment",
    siteName: "Kairali Equipment",
  }) as Metadata),
  keywords: ["ayurvedic spa equipment", "panchakarma equipment supplier", "ayurveda hospital equipment", "spa equipment India"],
};

const jsonLd = graph(
  breadcrumbList({
    id: `${SITE_URL}/equipment#breadcrumb`,
    items: [
      { name: "Home", url: SITE_URL },
      { name: "Equipment", url: `${SITE_URL}/equipment` },
    ],
  }),
  {
    "@type": "ItemList",
    "@id": `${SITE_URL}/equipment#itemlist`,
    name: "Kairali Ayurveda equipment lines",
    itemListElement: CATEGORIES.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      url: `${SITE_URL}/equipment/${c.slug}`,
    })),
  },
);

export default function EquipmentHub() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <main>
        <PageHead
          overline="The catalogue · five lines"
          title="Ayurvedic spa equipment, from the group's own facility"
          lede="Every line is the real category from our legacy catalogue — dimensions and materials as mined from the record. Model-level SKUs and prices are owner-ordered placeholders until the full catalogue lands; every project is quoted, not carted."
          trail={[{ name: "Equipment" }]}
        />
        <section className="section container">
          <p className="grid-note">
            Photography: from the legacy catalogue — a commissioned studio shoot
            of all five lines is a flagged dependency. No stock, no AI imagery.
          </p>
          <div className="line-grid">
            {CATEGORIES.map((c) => (
              <article className="line-card" key={c.slug}>
                <figure>
                  <Image src={c.img.src} alt={c.img.alt} width={520} height={390} sizes="(min-width: 1000px) 33vw, (min-width: 640px) 50vw, 100vw" />
                </figure>
                <div className="lc-body">
                  <h3>{c.name}</h3>
                  <p className="lc-gloss">{c.gloss}</p>
                  <p>{c.copy}</p>
                  <table className="spec-table">
                    <tbody>
                      {c.specs.slice(0, 3).map(([k, v]) => (
                        <tr key={k}><td>{k}</td><td>{v}</td></tr>
                      ))}
                    </tbody>
                  </table>
                  <Link className="btn btn-primary lc-cta" href={`/equipment/${c.slug}`} data-cta={`category-${c.slug}`}>
                    See the {c.name} line
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
        <RfqBand context="Equipping a hospital wing, a resort spa, a new centre?" />
      </main>
    </>
  );
}
