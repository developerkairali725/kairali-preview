// bulkayurvedaoils.com — GOLDEN PAGE (homepage). "The Batch Ledger", warm pole.
// KAPPL's bulk-supply desk: RFQ is the ONLY conversion — no cart, no checkout,
// no prices, ever (Factory rule; D-BULK-B2B). Every fact on this page is from
// the owned-claims register (docs/kappl-inputs/bulk-b2b-niche-brief.md §1):
// cert strip carries the cited-owned WHO-GMP / ISO / FSSAI claims with the
// "(as published)" qualifier — the retired legacy efficacy line is never carried.
// Pass-2 residue fixes applied: unoccluded photography column · "(as
// published)" on the dark strip · visible mobile nav (chrome) · one primary CTA.
import Image from "next/image";
import { graph, kairaliOrganization, webSite, breadcrumbList, serializeJsonLd } from "@kairali/schema";
import { EnquiryForm } from "@kairali/forms/form";
import { EMAIL, WHATSAPP_URL, STORE_BULK_COLLECTION } from "./_components/chrome";
// The live bulk collection's verified formats [OWN-6] — single source, nothing
// else is promised (moved to _components/catalog.ts for the Phase-1 pages).
import { THAILAMS, POWDERS } from "./_components/catalog";

const SITE = "https://bulkayurvedaoils.com";

const LANES = [
  {
    h: "Spas, hotels & resorts",
    p: "Provision abhyanga, shirodhara and treatment programmes at therapy volume — the same classical formulations, in 5-litre supply packs.",
  },
  {
    h: "Panchakarma centres & clinics",
    p: "Repeat therapeutic volume for physician-led practice: classical thailams and therapy powders, batch after batch, from one certified line.",
  },
  {
    h: "Distributors & importers",
    p: "KAPPL's published distribution lanes — retail, wholesale and exclusive regional agreements — supplied from the factory, India and export.",
  },
];

const STEPS = [
  {
    h: "Send your requirement",
    p: "Formulations, quantities, destination. The RFQ below, WhatsApp, or info@kairali.com — whichever your desk prefers.",
  },
  {
    h: "Quote & documentation",
    p: "The KAPPL desk quotes direct from the Pollachi facility, with pack formats and the documentation your purchase process needs.",
  },
  {
    h: "Batch dispatch",
    p: "Bulk packs dispatched to India and export markets. Minimums and lead times are confirmed per formulation in your quote — never guessed here.",
  },
];

const jsonLd = graph(
  kairaliOrganization({ id: `${SITE}/#organization`, url: SITE }),
  webSite({ id: `${SITE}/#website`, name: "Bulk Ayurveda Oils — a KAPPL supply desk", url: SITE, publisherId: `${SITE}/#organization`, inLanguage: "en" }),
  breadcrumbList({ id: `${SITE}/#breadcrumb`, items: [{ name: "Home", url: SITE }] }),
);

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <main id="top">
        {/* ── Hero: the ledger plate ─────────────────────────────────── */}
        <section className="hero" aria-labelledby="hero-heading">
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="overline">WHO-GMP manufacturer · Since 1908, founded 1989</p>
              <h1 id="hero-heading">
                Classical Ayurvedic oils, <span className="accent">by the batch.</span>
              </h1>
              <p className="lede">
                Manufacturer-direct bulk supply of classical thailams, proprietary
                oils and therapy powders — for spas, panchakarma centres, clinics
                and distributors. No trading layer, no repacking: every batch is
                quoted direct from our Pollachi facility.
              </p>
              <div className="accent-rule" aria-hidden="true" />
            </div>

            <div className="spec-card">
              <h2>Supply specification</h2>
              <table className="spec">
                <tbody>
                  <tr>
                    <td>Oil pack format</td>
                    <td><span className="big">5 L</span>&ensp;per can, classical thailams</td>
                  </tr>
                  <tr>
                    <td>Powder pack format</td>
                    <td><span className="big">1 kg</span>&ensp;choornams &amp; kizhi powders</td>
                  </tr>
                  <tr>
                    <td>Certifications</td>
                    <td>WHO-GMP · ISO · FSSAI <span className="qual">(as published)</span></td>
                  </tr>
                  <tr>
                    <td>Dispatch</td>
                    <td>India &amp; export markets — quoted direct</td>
                  </tr>
                  <tr>
                    <td>Buyer lanes</td>
                    <td>Spas &amp; hotels · Panchakarma centres · Distributors &amp; importers</td>
                  </tr>
                </tbody>
              </table>
              <a className="btn btn-primary" href="#rfq" data-cta="rfq-open">Get a bulk quote</a>
              <p className="note">Enquiries answered by the KAPPL desk · {EMAIL}</p>
            </div>

            {/* pass-2 fix: full-height, unoccluded photography column — REAL
                product photography from the Kairali image library, never stock */}
            <figure className="hero-photo">
              <Image
                src="/images/hero-classical-thailams.jpg"
                alt="Kairali classical thailams — Kottamchukkadi, Maha Narayana and Dhanwantharam Thailam bottles with boxed Anu Thailam and Ksheerabala 101"
                width={1800}
                height={1200}
                priority
                sizes="(min-width: 1000px) 22vw, 100vw"
              />
              <figcaption>Kairali classical thailams — the retail range; bulk supply ships in 5 L cans.</figcaption>
            </figure>
          </div>
        </section>

        {/* ── Dark trust strip — cited-owned claims only, qualifier carried ── */}
        <section className="trust-strip" aria-label="Certifications as published">
          <div className="container">
            <span className="cert">
              Certified: <em>WHO-GMP</em> · ISO · FSSAI <span className="qual">(as published by KAPPL)</span>
            </span>
            <span className="heritage">Trusted since 1908 — four generations of Ayurvedic manufacture</span>
          </div>
        </section>

        {/* ── Segment lanes ──────────────────────────────────────────── */}
        <section className="section" id="for-your-business" aria-labelledby="lanes-heading">
          <div className="container">
            <div className="section-head">
              <p className="overline">For your business</p>
              <h2 id="lanes-heading">One certified line, three kinds of buyer</h2>
              <p>
                Provisioning classical oils at volume usually means traders,
                unclear provenance and stock that arrives repacked. This desk
                removes that layer: you buy from the manufacturer.
              </p>
            </div>
            <div className="lane-grid">
              {LANES.map((l) => (
                <div className="lane-card" key={l.h}>
                  <h3>{l.h}</h3>
                  <p>{l.p}</p>
                  <p className="lane-go">
                    <a href="#rfq" data-cta="category-rfq">Get a bulk quote &rarr;</a>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── The batch ledger: live bulk formulations ───────────────── */}
        <section className="section" id="oils" aria-labelledby="oils-heading">
          <div className="container">
            <div className="section-head">
              <p className="overline">Oils &amp; powders</p>
              <h2 id="oils-heading">The bulk formulation ledger</h2>
              <p>
                The formulations KAPPL supplies in bulk packs today — classical
                thailams used in abhyanga and Panchakarma practice, and the
                therapy powders that work alongside them. Per-formulation pages
                follow; the ledger below is the live, verified range.
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
                      <td className="pack">5 L per can</td>
                    </tr>
                  ))}
                  {POWDERS.map((p) => (
                    <tr key={p}>
                      <td>{p}</td>
                      <td>Therapy powder / choornam</td>
                      <td className="pack">500 g – 1 kg</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="ledger-note">
              Eleven live bulk listings, as published on the Kairali store&rsquo;s
              wholesale collection —{" "}
              <a href={STORE_BULK_COLLECTION} rel="noopener" data-cta="storefront-handoff">
                see the retail listings
              </a>
              . Bulk supply itself is quoted, never carted.
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
                Tamil Nadu — with in-house laboratories and an in-house
                herb-extraction unit. The certifications below are carried
                exactly as KAPPL publishes them, never expanded.
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

        {/* ── How bulk supply works ──────────────────────────────────── */}
        <section className="section" id="how-it-works" aria-labelledby="how-heading">
          <div className="container">
            <div className="section-head">
              <p className="overline">How it works</p>
              <h2 id="how-heading">From enquiry to batch dispatch</h2>
            </div>
            <ol className="steps">
              {STEPS.map((s) => (
                <li className="step" key={s.h}>
                  <h3>{s.h}</h3>
                  <p>{s.p}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── RFQ — the one conversion ───────────────────────────────── */}
        <section className="rfq-band" id="rfq" aria-labelledby="rfq-heading">
          <div className="container">
            <p className="overline">Request a quote</p>
            <h2 id="rfq-heading">Tell us what your practice needs</h2>
            <p className="rfq-lede">
              Formulations, quantities, destination — the KAPPL desk replies with
              a direct quote and the documentation your purchase process needs.
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
                subject="Bulk supply quote"
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
