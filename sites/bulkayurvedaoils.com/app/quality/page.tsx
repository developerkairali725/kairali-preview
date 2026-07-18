// /quality — the certification wall (STRATEGY §1 row 9). Cited-owned claims
// ONLY (WHO-GMP · ISO · FSSAI, "(as published)") — the guards test pins that
// this strip is never expanded. Certificate ARTEFACTS live on kappl.co.in
// [OWN-4]; until they are asset-mined into this site, we LINK the published
// page rather than paraphrase it (artefacts, not adjectives).
import type { Metadata } from "next";
import { buildMetadata } from "@kairali/seo";
import { graph, breadcrumbList, serializeJsonLd } from "@kairali/schema";
import { EMAIL, WHATSAPP_URL, PageIntro } from "../_components/chrome";
import siteConfig from "../../site.config.json";

const SITE = "https://bulkayurvedaoils.com";

export const metadata: Metadata = buildMetadata(siteConfig, {
  title: "WHO-GMP Ayurvedic Manufacturer — Quality | Kairali",
  description:
    "The credibility is the factory: Pollachi line, in-house labs and herb extraction. Certifications carried as published — WHO-GMP, ISO, FSSAI.",
  path: "/quality",
}) as Metadata;

const jsonLd = graph(
  breadcrumbList({
    id: `${SITE}/quality#breadcrumb`,
    items: [
      { name: "Home", url: SITE },
      { name: "Quality", url: `${SITE}/quality` },
    ],
  }),
);

export default function Quality() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <main id="top">
        <PageIntro
          overline="Quality"
          title="The credibility is the factory"
          lede="The mid-tier of this niche decorates with badges. KAPPL's difference is that the credential is real: a WHO-GMP-certified pharmaceutical line at Pollachi, Tamil Nadu, with in-house laboratories and an in-house herb-extraction unit — and certificates published where anyone can read them."
        />

        <section className="section" aria-labelledby="wall-heading">
          <div className="container">
            <div className="section-head">
              <p className="overline">As published by KAPPL</p>
              <h2 id="wall-heading">The certification wall</h2>
              <p>
                Every claim below is carried exactly as KAPPL publishes it —
                never expanded, never numbered beyond what the published
                artefacts show.
              </p>
            </div>
            <dl className="plaque-grid">
              <div className="plaque">
                <dt>WHO-GMP</dt>
                <dd>Good Manufacturing Practice — the certificate artefacts are published on kappl.co.in&rsquo;s certification page.</dd>
              </div>
              <div className="plaque">
                <dt>ISO</dt>
                <dd>Quality-management certification, as published by KAPPL.</dd>
              </div>
              <div className="plaque">
                <dt>FSSAI</dt>
                <dd>Indian food-safety registration, as published by KAPPL.</dd>
              </div>
            </dl>
            <p className="plaque-qual">
              Read the published certificate artefacts on{" "}
              <a href="https://kappl.co.in" rel="noopener" data-cta="corporate-link">
                kappl.co.in
              </a>{" "}
              (certification &amp; accreditation). Scopes and certificate numbers
              are never invented here; the artefact images join this wall once
              asset-mined.
            </p>
          </div>
        </section>

        <section className="section" aria-labelledby="factory-heading">
          <div className="container">
            <div className="section-head">
              <p className="overline">Pollachi, Tamil Nadu</p>
              <h2 id="factory-heading">What the factory holds in-house</h2>
            </div>
            <div className="lane-grid">
              <div className="lane-card">
                <h3>The manufacturing line</h3>
                <p>Classical thailams, proprietary oils and therapy powders prepared on one certified pharmaceutical line — the same line that supplies Kairali&rsquo;s own retail range.</p>
              </div>
              <div className="lane-card">
                <h3>In-house laboratories</h3>
                <p>Quality control on site, not outsourced — the laboratories sit beside the line they test.</p>
              </div>
              <div className="lane-card">
                <h3>Herb extraction &amp; R&amp;D</h3>
                <p>An in-house herb-extraction unit and R&amp;D on the same campus — raw material to finished batch under one roof.</p>
              </div>
            </div>
            <p className="ledger-note">
              Four generations of Ayurvedic manufacture: practising since 1908,
              formally founded in 1989 — as the group publishes it.
            </p>
          </div>
        </section>

        <section className="rfq-band" id="rfq" aria-labelledby="rfq-heading">
          <div className="container">
            <p className="overline">Put it to work</p>
            <h2 id="rfq-heading">Quote a certified batch</h2>
            <p className="rfq-lede">
              The certifications above travel with every quote — formulations,
              quantities and destination to the desk, documentation back.
            </p>
            <p style={{ marginTop: 24 }}>
              <a className="btn btn-primary" href="/request-a-quote" data-cta="rfq-open">Get a bulk quote</a>
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
        <a className="btn btn-primary" href="/request-a-quote" data-cta="rfq-open">Get a bulk quote</a>
      </div>
    </>
  );
}
