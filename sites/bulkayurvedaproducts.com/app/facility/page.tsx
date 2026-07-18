// /facility — the Pollachi facility story (STRATEGY §1 row 7). Published
// facts only [OWN-5]; REAL photography only — the facility-photo gap is
// FLAGGED, not faked (IMAGE_MANIFEST: no facility shot exists in the library;
// kappl.co.in facility/3D assets await the asset-mining pass).
import type { Metadata } from "next";
import Image from "next/image";
import { buildMetadata } from "@kairali/seo";
import { graph, breadcrumbList, serializeJsonLd } from "@kairali/schema";
import { EMAIL, WHATSAPP_URL, PageIntro } from "../_components/chrome";
import siteConfig from "../../site.config.json";

const SITE = "https://bulkayurvedaproducts.com";

export const metadata: Metadata = buildMetadata(siteConfig, {
  title: "Pollachi WHO-GMP Manufacturing Facility | Kairali",
  description:
    "KAPPL manufactures at Pollachi, Tamil Nadu — a WHO-GMP line with in-house laboratories, herb extraction and R&D on one campus.",
  path: "/facility",
}) as Metadata;

const jsonLd = graph(
  breadcrumbList({
    id: `${SITE}/facility#breadcrumb`,
    items: [
      { name: "Home", url: SITE },
      { name: "Facility", url: `${SITE}/facility` },
    ],
  }),
);

export default function Facility() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <main id="top">
        <PageIntro
          overline="The facility"
          title="Pollachi: where every batch is made"
          lede="A founder buys capacity with their eyes. KAPPL's plant at Pollachi, Tamil Nadu is the substance behind every claim on this site — a certified pharmaceutical line with its laboratories, herb extraction and R&D on the same campus."
        />

        <section className="section" aria-labelledby="campus-heading">
          <div className="container">
            <div className="section-head">
              <p className="overline">One campus</p>
              <h2 id="campus-heading">What operates under the one roof</h2>
            </div>
            <div className="cap-grid">
              <div className="cap-card">
                <h3>The manufacturing line</h3>
                <p>Oils, cosmetics, medicines, shampoos and soaps across the published dosage forms — the same line that supplies Kairali&rsquo;s own retail range.</p>
              </div>
              <div className="cap-card">
                <h3>In-house laboratories</h3>
                <p>Quality control beside the line it tests — not a courier run to an external lab.</p>
              </div>
              <div className="cap-card">
                <h3>Herb-extraction unit</h3>
                <p>Raw herb to active extract on site — provenance the buyer can trace to one address.</p>
              </div>
              <div className="cap-card">
                <h3>R&amp;D</h3>
                <p>The formulation-development arm behind the &ldquo;your concept, our R&amp;D&rdquo; loan-licence model.</p>
              </div>
            </div>
            <p className="ledger-note" style={{ marginTop: 18 }}>
              Certifications as published by KAPPL: WHO-GMP · ISO · FSSAI — the
              certificate artefacts are published on{" "}
              <a href="https://kappl.co.in" rel="noopener" data-cta="corporate-link">kappl.co.in</a>.
            </p>
          </div>
        </section>

        <section className="section" aria-labelledby="see-heading">
          <div className="container">
            <div className="prose">
              <h2 id="see-heading">See it before you sign</h2>
              <p>
                An honest note about photography: this page shows real product
                photography from the Pollachi line rather than facility interiors,
                because no facility photograph exists in the group&rsquo;s image
                library yet — and this desk does not decorate with stock. The
                corporate site carries the facility&rsquo;s published pages, and
                the desk arranges direct conversations for serious projects.
              </p>
            </div>
            <figure className="hero-photo" style={{ minHeight: 280, marginTop: 26 }}>
              <Image
                src="/images/classical-range.jpg"
                alt="Kairali classical thailam bottles manufactured at the Pollachi facility"
                width={1800}
                height={1200}
                sizes="(min-width: 1000px) 60vw, 100vw"
              />
              <figcaption>What the line produces — real product photography; facility interiors join after the asset pass.</figcaption>
            </figure>
          </div>
        </section>

        <section className="rfq-band" id="start" aria-labelledby="start-heading">
          <div className="container">
            <p className="overline">Put the plant to work</p>
            <h2 id="start-heading">Start the project conversation</h2>
            <p className="rfq-lede">
              Category, model, scale — the desk replies with the formulation
              conversation and a direct quote.
            </p>
            <p style={{ marginTop: 24 }}>
              <a className="btn btn-primary" href="/start-your-project" data-cta="rfq-open">Start your project</a>
            </p>
            <p className="rfq-fact" style={{ marginTop: 18 }}>
              <strong>Email:</strong> <a href={`mailto:${EMAIL}`} data-cta="email-click">{EMAIL}</a>
              &ensp;·&ensp;
              <strong>WhatsApp:</strong> <a href={WHATSAPP_URL} data-cta="whatsapp-click">+91 92898 38797</a>
            </p>
          </div>
        </section>
      </main>

      <div className="sticky-cta" aria-label="Contact">
        <a className="btn btn-secondary" href={WHATSAPP_URL} data-cta="whatsapp-click">WhatsApp</a>
        <a className="btn btn-primary" href="/start-your-project" data-cta="rfq-open">Start your project</a>
      </div>
    </>
  );
}
