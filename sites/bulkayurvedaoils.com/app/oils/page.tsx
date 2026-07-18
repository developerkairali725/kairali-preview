// /oils/ — bulk catalog hub (STRATEGY §1 row 2). "The Batch Ledger", warm pole.
// The full verified ledger [OWN-6] + the three category doors + RFQ. ItemList
// schema at honest granularity — the 11 live SKUs, nothing invented.
import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@kairali/seo";
import { graph, breadcrumbList, itemList, serializeJsonLd } from "@kairali/schema";
import { EnquiryForm } from "@kairali/forms/form";
import { EMAIL, WHATSAPP_URL, STORE_BULK_COLLECTION, PageIntro } from "../_components/chrome";
import { THAILAMS, POWDERS, OIL_PACK, POWDER_PACK } from "../_components/catalog";
import siteConfig from "../../site.config.json";

const SITE = "https://bulkayurvedaoils.com";

export const metadata: Metadata = buildMetadata(siteConfig, {
  title: "Ayurvedic Oils Wholesale — Bulk Catalog | Kairali KAPPL",
  description:
    "The verified bulk catalog — classical thailams in 5 L cans, therapy powders in kilogram packs. Manufacturer-direct, quoted per formulation.",
  path: "/oils",
}) as Metadata;

const CATEGORIES = [
  {
    href: "/oils/classical-thailams",
    h: "Classical thailams",
    p: "The live bulk collection's four classical oils — abhyanga and Panchakarma practice formulations in 5-litre supply cans.",
  },
  {
    href: "/oils/proprietary-oils",
    h: "Proprietary oils",
    p: "Kairali's own oil formulations in wholesale bulk packaging — the store's published proprietary collection, quoted direct.",
  },
  {
    href: "/oils/therapy-powders-choornams",
    h: "Therapy powders & choornams",
    p: "Udwarthanam, kizhi and classical choornams in 500 g – 1 kg packs — the powders that work alongside the oils.",
  },
];

const jsonLd = graph(
  breadcrumbList({
    id: `${SITE}/oils#breadcrumb`,
    items: [
      { name: "Home", url: SITE },
      { name: "Oils & powders", url: `${SITE}/oils` },
    ],
  }),
  itemList({
    id: `${SITE}/oils#catalog`,
    name: "Kairali bulk formulation ledger — live wholesale collection",
    items: [
      ...THAILAMS.map((t) => ({ name: t, url: `${SITE}/oils/classical-thailams` })),
      ...POWDERS.map((p) => ({ name: p, url: `${SITE}/oils/therapy-powders-choornams` })),
    ],
  }),
);

export default function OilsHub() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <main id="top">
        <PageIntro
          overline="Oils & powders"
          title="The bulk catalog, formulation by formulation"
          lede="Everything KAPPL supplies in bulk packs today — classical thailams, proprietary oils and therapy powders, manufactured at Pollachi and quoted direct. No trading layer, no repacking."
        />

        {/* Category doors */}
        <section className="section" aria-labelledby="cat-heading">
          <div className="container">
            <div className="section-head">
              <p className="overline">Three ledgers</p>
              <h2 id="cat-heading">Choose your category</h2>
            </div>
            <div className="lane-grid">
              {CATEGORIES.map((c) => (
                <div className="lane-card" key={c.href}>
                  <h3>{c.h}</h3>
                  <p>{c.p}</p>
                  <p className="lane-go">
                    <Link href={c.href} data-cta="category-open">See the ledger &rarr;</Link>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The full verified ledger */}
        <section className="section" id="ledger" aria-labelledby="ledger-heading">
          <div className="container">
            <div className="section-head">
              <p className="overline">The live range</p>
              <h2 id="ledger-heading">The bulk formulation ledger</h2>
              <p>
                Eleven live bulk listings, as published on the Kairali
                store&rsquo;s wholesale collection. Pack formats are the
                verified ones — minimums and lead times are confirmed per
                formulation in your quote, never guessed here.
              </p>
            </div>
            <div className="ledger-wrap">
              <table className="ledger">
                <thead>
                  <tr>
                    <th scope="col">Formulation</th>
                    <th scope="col">Form</th>
                    <th scope="col">Bulk pack</th>
                  </tr>
                </thead>
                <tbody>
                  {THAILAMS.map((t) => (
                    <tr key={t}>
                      <td>{t}</td>
                      <td>Classical thailam (oil)</td>
                      <td className="pack">{OIL_PACK}</td>
                    </tr>
                  ))}
                  {POWDERS.map((p) => (
                    <tr key={p}>
                      <td>{p}</td>
                      <td>Therapy powder / choornam</td>
                      <td className="pack">{POWDER_PACK}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="ledger-note">
              Retail listings for the same range live on the{" "}
              <a href={STORE_BULK_COLLECTION} rel="noopener" data-cta="storefront-handoff">
                Kairali store&rsquo;s wholesale collection
              </a>
              . Bulk supply itself is quoted, never carted.
            </p>
            <div className="cross-desk">
              Want these formulations under your own brand instead?{" "}
              <a href="https://www.bulkayurvedaproducts.com" rel="noopener" data-cta="cross-desk">
                The manufacturing desk handles private label, third party and loan licence
              </a>
              .
            </div>
          </div>
        </section>

        {/* RFQ — embedded on every money page (strategy §4) */}
        <section className="rfq-band" id="rfq" aria-labelledby="rfq-heading">
          <div className="container">
            <p className="overline">Request a quote</p>
            <h2 id="rfq-heading">Quote the formulations your desk needs</h2>
            <p className="rfq-lede">
              Name the formulations, quantities and destination — the KAPPL desk
              replies with a direct quote and the documentation your purchase
              process needs.
            </p>
            <div className="rfq-grid">
              <div className="rfq-aside">
                <p className="rfq-fact"><strong>Email:</strong> <a href={`mailto:${EMAIL}`} data-cta="email-click">{EMAIL}</a></p>
                <p className="rfq-fact"><strong>WhatsApp:</strong> <a href={WHATSAPP_URL} data-cta="whatsapp-click">+91 92898 38797</a></p>
                <p className="rfq-fact"><strong>Packs:</strong> 5 L cans (oils) · 500 g – 1 kg (powders)</p>
                <p className="rfq-fact"><strong>Dispatch:</strong> India &amp; export markets</p>
              </div>
              <EnquiryForm
                site="bulkayurvedaoils.com"
                formType="rfq"
                subject="Bulk supply quote — catalog"
                heading="Request a bulk supply quote"
                submitLabel="Request a quote"
              />
            </div>
          </div>
        </section>
      </main>

      <div className="sticky-cta" aria-label="Contact">
        <a className="btn btn-secondary" href={WHATSAPP_URL} data-cta="whatsapp-click">WhatsApp</a>
        <a className="btn btn-primary" href="#rfq" data-cta="rfq-open">Get a bulk quote</a>
      </div>
    </>
  );
}
