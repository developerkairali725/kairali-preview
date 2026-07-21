// bulkayurvedaproducts.com — GOLDEN PAGE (homepage). "The Batch Ledger", cool
// pole. KAPPL's manufacturing-partnership desk: the project-intake enquiry is
// the ONLY conversion — no cart, no checkout, no prices, ever (Factory rule;
// D-BULK-B2B). Every fact is from the owned-claims register (niche brief §1):
// the four engagement models LEAD with the canonical published wording
// (pass-2 Perplexity fix); counters carry the published figures with their
// provenance line; cert band carries the cited-owned WHO-GMP / ISO / FSSAI
// claims with the "(as published)" qualifier — the retired legacy efficacy line never carries.
// Pass-2 residue fixes applied: photography unoccluded in its own column ·
// model rows are real links with chevron affordance · cert band first viewport.
import Image from "next/image";
import { graph, kairaliOrganization, webSite, breadcrumbList, serializeJsonLd } from "@kairali/schema";
import { EnquiryForm } from "@kairali/forms/form";
import { EMAIL, WHATSAPP_URL } from "./_components/chrome";
// The four engagement models EXACTLY as published [OWN-5] — canonical wording
// leads (pass-2 fix); single source in _components/facts.ts for the Phase-1
// pages (counters + provenance line live there too, guards-pinned).
import { MODELS, CAPABILITIES, COUNTERS } from "./_components/facts";

const SITE = "https://bulkayurvedaproducts.com";

const STEPS = [
  { h: "Enquire", p: "Tell the desk your category, models of interest and scale — the form below or info@kairali.com." },
  { h: "Formulation discussion", p: "Our R&D and your brief meet: formulation, dosage form, packing and compliance path." },
  { h: "Sampling", p: "You approve the product before any batch is committed." },
  { h: "Production", p: "Manufactured at Pollachi under the published certifications, with in-house labs on the line." },
  { h: "Dispatch", p: "Batches dispatched to India and export markets, with the documentation your market needs." },
];

const jsonLd = graph(
  kairaliOrganization({ id: `${SITE}/#organization`, url: SITE }),
  webSite({ id: `${SITE}/#website`, name: "Bulk Ayurveda Products — a KAPPL manufacturing desk", url: SITE, publisherId: `${SITE}/#organization`, inLanguage: "en" }),
  breadcrumbList({ id: `${SITE}/#breadcrumb`, items: [{ name: "Home", url: SITE }] }),
);

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <main id="top">
        {/* ── Hero: the ledger plate, cool register ──────────────────── */}
        <section className="hero" aria-labelledby="hero-heading">
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="overline">Private label · Third party · Loan licence</p>
              <h1 id="hero-heading">
                Your brand. <span className="accent">Our WHO-GMP line.</span>
              </h1>
              <p className="lede">
                Contract manufacturing of Ayurvedic and herbal products without
                building your own plant — formulation, sourcing, production,
                packaging and QA from our Pollachi, Tamil Nadu facility, with
                in-house laboratories and herb extraction — four generations
                of Ayurvedic practice behind it.
              </p>
              <p className="forms-line">
                Capsules · tablets · syrups &amp; tonics · churnams · lehyams · balms · lotions · powders
              </p>
              <div className="accent-rule" aria-hidden="true" />
            </div>

            <div className="model-card">
              <h2>Choose your engagement model</h2>
              {/* Canonical published wording leads; the lane differentiates.
                  Each row is a LINK — chevron + hover state (pass-2 fixes). */}
              <ul className="model-list">
                {MODELS.map((m) => (
                  <li key={m.name}>
                    <a href="#start" data-cta="model-select">
                      <span className="m-name">
                        {m.name}
                        <span className="m-lane">{m.lane}</span>
                      </span>
                      <span className="m-go" aria-hidden="true">&rarr;</span>
                    </a>
                  </li>
                ))}
              </ul>
              <a className="btn btn-primary" href="#start" data-cta="rfq-open">Start your project</a>
              <p className="note">Answered by the KAPPL desk · {EMAIL}</p>
            </div>

            {/* pass-2 fix: photography unoccluded, its own column — REAL Kairali
                product-line photography from the image library (no facility shot
                exists in the library yet; nothing is faked). */}
            <figure className="hero-photo">
              <Image
                src="/images/hero-product-line.jpg"
                alt="Kairali classical choornam jars — Rasanadi, Thaleesapatradi, Dasanakanthi, Vaiswanara, Thriphaladi and Ashta Choornam"
                width={1800}
                height={1200}
                priority
                sizes="(min-width: 1000px) 20vw, 100vw"
              />
              <figcaption>Manufactured at Pollachi — Kairali&rsquo;s own classical range, from the same line.</figcaption>
            </figure>
          </div>
        </section>

        {/* ── Published cert band — FIRST viewport (pass-1 fix) ─────────── */}
        <section className="certband" aria-label="Certifications as published">
          <div className="container">
            <span className="cert">
              Certified: <em>WHO-GMP</em> · ISO · FSSAI
            </span>
            <span className="qual">Strip as published by KAPPL — certificate artefacts on the Quality wall</span>
          </div>
        </section>

        {/* ── Published counters ─────────────────────────────────────── */}
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
            <p className="pub">Figures as published by KAPPL — carried as-is, never restated</p>
          </div>
        </section>

        {/* ── Engagement models in full ──────────────────────────────── */}
        <section className="section" id="services" aria-labelledby="models-heading">
          <div className="container">
            <div className="section-head">
              <p className="overline">Engagement models</p>
              <h2 id="models-heading">Four published ways to build with KAPPL</h2>
              <p>
                Launching an Ayurvedic line usually stalls on the same wall:
                licensing, formulation and a certified plant. The four models
                below — exactly as KAPPL publishes them — are four doors through
                that wall. Pick the one that matches where your brand stands.
              </p>
            </div>
            <div className="model-grid">
              {MODELS.map((m) => (
                <div className="model-tile" key={m.name}>
                  <p className="m-lane">{m.lane}</p>
                  <h3>{m.name}</h3>
                  <p>{m.desc}</p>
                  <p className="m-go">
                    <a href="#start" data-cta="model-select">Start with this model &rarr;</a>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── What we manufacture ────────────────────────────────────── */}
        <section className="section" id="what-we-make" aria-labelledby="cap-heading">
          <div className="container">
            <div className="section-head">
              <p className="overline">What we make</p>
              <h2 id="cap-heading">The published capability</h2>
            </div>
            <div className="cap-grid">
              {CAPABILITIES.map((c) => (
                <div className="cap-card" key={c.h}>
                  <h3>{c.h}</h3>
                  <p>{c.p}</p>
                </div>
              ))}
            </div>
            <p className="cap-forms">
              Dosage forms as published: capsules · tablets · syrups &amp; tonics ·
              churnam · kwath · avaleham / lehyam · balms · lotions · powders.
            </p>
          </div>
        </section>

        {/* ── Quality ────────────────────────────────────────────────── */}
        <section className="section" id="quality" aria-labelledby="quality-heading">
          <div className="container">
            <div className="section-head">
              <p className="overline">Quality</p>
              <h2 id="quality-heading">The credibility is the factory</h2>
              <p>
                Kairali Ayurvedic Products Pvt. Ltd. manufactures at Pollachi,
                Tamil Nadu — in-house laboratories, an in-house herb-extraction
                unit and R&amp;D on one site. The certifications below are
                carried exactly as KAPPL publishes them, never expanded.
              </p>
            </div>
            <dl className="plaque-grid">
              <div className="plaque">
                <dt>WHO-GMP</dt>
                <dd>Good Manufacturing Practice — the certificate artefacts are published on kappl.co.in.</dd>
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
              Strip as published by KAPPL — the certificate artefacts join this
              site&rsquo;s Quality wall; scopes and numbers are never invented here.
            </p>
          </div>
        </section>

        {/* ── How it works ───────────────────────────────────────────── */}
        <section className="section" id="how-it-works" aria-labelledby="how-heading">
          <div className="container">
            <div className="section-head">
              <p className="overline">How it works</p>
              <h2 id="how-heading">From brief to dispatched batch</h2>
            </div>
            <ol className="steps">
              {STEPS.map((s) => (
                <li className="step" key={s.h}>
                  <h3>{s.h}</h3>
                  <p>{s.p}</p>
                </li>
              ))}
            </ol>
            <p className="step-claim">
              &ldquo;Launch Your Own Brand in Just 30 Days&rdquo; — as published by
              KAPPL. Low MOQs as published; the exact ladder is confirmed per
              project, never guessed here.
            </p>
          </div>
        </section>

        {/* ── Project intake — the one conversion ────────────────────── */}
        <section className="rfq-band" id="start" aria-labelledby="start-heading">
          <div className="container">
            <p className="overline">Start your project</p>
            <h2 id="start-heading">Tell us what you want to build</h2>
            <p className="rfq-lede">
              Category, engagement model, scale — the KAPPL desk replies with the
              formulation conversation, sampling path and a direct project quote.
            </p>
            <div className="rfq-grid">
              <div className="rfq-aside">
                <p className="rfq-fact"><strong>Email:</strong> <a href={`mailto:${EMAIL}`} data-cta="email-click">{EMAIL}</a></p>
                <p className="rfq-fact"><strong>WhatsApp:</strong> <a href={WHATSAPP_URL} data-cta="whatsapp-click">+91 92898 38797</a></p>
                <p className="rfq-fact"><strong>Models:</strong> Third party ×2 · Loan licence ×2 (as published)</p>
                <p className="rfq-fact"><strong>Facility:</strong> Pollachi, Tamil Nadu — in-house labs, herb extraction, R&amp;D</p>
              </div>
              <EnquiryForm
                site="bulkayurvedaproducts.com"
                formType="project-intake"
                subject="Manufacturing project enquiry"
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
