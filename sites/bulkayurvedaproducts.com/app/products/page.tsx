// /products/ — what-we-manufacture hub (STRATEGY §1 row 5). The four published
// capability categories [OWN-5] as doors; full dosage-form line as published.
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { buildMetadata } from "@kairali/seo";
import { graph, breadcrumbList, itemList, serializeJsonLd } from "@kairali/schema";
import { EnquiryForm } from "@kairali/forms/form";
import { EMAIL, WHATSAPP_URL, PageIntro } from "../_components/chrome";
import { CAPABILITIES, DOSAGE_FORMS } from "../_components/facts";
import siteConfig from "../../site.config.json";

const SITE = "https://bulkayurvedaproducts.com";

export const metadata: Metadata = buildMetadata(siteConfig, {
  title: "Ayurvedic Products Manufacturing — Categories | Kairali",
  description:
    "The published capability: Ayurvedic oils, herbal cosmetics, classical medicines, shampoos and soaps — every published dosage form, one line.",
  path: "/products",
}) as Metadata;

const jsonLd = graph(
  breadcrumbList({
    id: `${SITE}/products#breadcrumb`,
    items: [
      { name: "Home", url: SITE },
      { name: "What we manufacture", url: `${SITE}/products` },
    ],
  }),
  itemList({
    id: `${SITE}/products#categories`,
    name: "KAPPL manufacturing capability — published categories",
    items: CAPABILITIES.map((c) => ({ name: c.h, url: `${SITE}/products/${c.slug}` })),
  }),
);

export default function ProductsHub() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <main id="top">
        <PageIntro
          overline="What we make"
          title="Four categories, one certified line"
          lede="Everything below is the published KAPPL capability — manufactured at Pollachi with in-house laboratories, herb extraction and R&D, under any of the four published engagement models."
        />

        <section className="section" aria-labelledby="cats-heading">
          <div className="container">
            <div className="section-head">
              <p className="overline">The capability</p>
              <h2 id="cats-heading">Choose your category</h2>
            </div>
            <div className="cap-grid">
              {CAPABILITIES.map((c) => (
                <div className="cap-card" key={c.slug}>
                  <h3>{c.h}</h3>
                  <p>{c.p}</p>
                  <p style={{ marginTop: 14 }}>
                    <Link href={`/products/${c.slug}`} data-cta="category-open">See the capability &rarr;</Link>
                  </p>
                </div>
              ))}
            </div>
            <p className="cap-forms">Dosage forms as published: {DOSAGE_FORMS}.</p>
            <figure className="hero-photo" style={{ minHeight: 280, marginTop: 26 }}>
              <Image
                src="/images/classical-range.jpg"
                alt="Kairali classical thailam bottles — the range manufactured on the Pollachi line"
                width={1800}
                height={1200}
                sizes="(min-width: 1000px) 60vw, 100vw"
              />
              <figcaption>The classical range from the same line — real product photography, honestly captioned.</figcaption>
            </figure>
          </div>
        </section>

        <section className="rfq-band" id="start" aria-labelledby="start-heading">
          <div className="container">
            <p className="overline">Start your project</p>
            <h2 id="start-heading">Name the category, we take it from there</h2>
            <p className="rfq-lede">
              Category, engagement model, scale — the KAPPL desk replies with
              the formulation conversation and a direct project quote.
            </p>
            <div className="rfq-grid">
              <div className="rfq-aside">
                <p className="rfq-fact"><strong>Email:</strong> <a href={`mailto:${EMAIL}`} data-cta="email-click">{EMAIL}</a></p>
                <p className="rfq-fact"><strong>WhatsApp:</strong> <a href={WHATSAPP_URL} data-cta="whatsapp-click">+91 92898 38797</a></p>
                <p className="rfq-fact"><strong>Categories:</strong> Oils · Cosmetics · Medicines · Shampoos &amp; soaps</p>
                <p className="rfq-fact"><strong>Facility:</strong> Pollachi — WHO-GMP · ISO · FSSAI (as published)</p>
              </div>
              <EnquiryForm
                site="bulkayurvedaproducts.com"
                formType="project-intake"
                subject="Manufacturing project enquiry — capability"
                heading="Start your project"
                submitLabel="Send project enquiry"
              />
            </div>
          </div>
        </section>
      </main>

      <div className="sticky-cta" aria-label="Contact">
        <a className="btn btn-secondary" href={WHATSAPP_URL} data-cta="whatsapp-click">WhatsApp</a>
        <a className="btn btn-primary" href="#start" data-cta="rfq-open">Start your project</a>
      </div>
    </>
  );
}
