// /quality — cert wall (STRATEGY §1 row 8). Cited-owned claims ONLY
// (WHO-GMP · ISO · FSSAI, "(as published)") — guards-pinned, never expanded.
// Artefacts live on kappl.co.in [OWN-4]; linked, not paraphrased.
import type { Metadata } from "next";
import { buildMetadata } from "@kairali/seo";
import { graph, breadcrumbList, serializeJsonLd } from "@kairali/schema";
import { EMAIL, WHATSAPP_URL, PageIntro } from "../_components/chrome";
import { COUNTERS, COUNTERS_PROVENANCE } from "../_components/facts";
import siteConfig from "../../site.config.json";

const SITE = "https://bulkayurvedaproducts.com";

export const metadata: Metadata = buildMetadata(siteConfig, {
  title: "GMP Certified Ayurvedic Manufacturer — Quality | Kairali",
  description:
    "Certifications carried exactly as KAPPL publishes them — WHO-GMP, ISO, FSSAI — with certificate artefacts on the corporate site.",
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
          title="The credential rendered as artefact"
          lede="This niche brandishes badges; KAPPL publishes certificates. Every claim below is carried exactly as published — and the artefacts sit on the corporate site where any buyer can read them."
        />

        <section className="section" aria-labelledby="wall-heading">
          <div className="container">
            <div className="section-head">
              <p className="overline">As published by KAPPL</p>
              <h2 id="wall-heading">The certification wall</h2>
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
              <a href="https://kappl.co.in" rel="noopener" data-cta="corporate-link">kappl.co.in</a>{" "}
              (certification &amp; accreditation). Scopes and certificate numbers
              are never invented here; the artefact images join this wall once
              asset-mined.
            </p>
          </div>
        </section>

        <section className="counters" aria-label="Published figures">
          <div className="container">
            <div className="grid">
              {COUNTERS.map((c) => (
                <div key={c.l}>
                  <div className="n">{c.n}</div>
                  <div className="l">{c.l}</div>
                </div>
              ))}
            </div>
            <p className="pub">{COUNTERS_PROVENANCE}</p>
          </div>
        </section>

        <section className="section" aria-labelledby="practice-heading">
          <div className="container">
            <div className="prose">
              <h2 id="practice-heading">Quality as practice, not decoration</h2>
              <p>
                The laboratories sit beside the line they test; the
                herb-extraction unit feeds it; R&amp;D develops on the same
                campus. Sampling comes before any committed batch — you approve
                the product before production money moves. That sequence, not a
                badge row, is what a founder is actually buying.
              </p>
            </div>
          </div>
        </section>

        <section className="rfq-band" id="start" aria-labelledby="start-heading">
          <div className="container">
            <p className="overline">Put it to work</p>
            <h2 id="start-heading">Build on a certified line</h2>
            <p className="rfq-lede">
              Category, model, scale — the desk replies with the compliance path
              and a direct quote.
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
