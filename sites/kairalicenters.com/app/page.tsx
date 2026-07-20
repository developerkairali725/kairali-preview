// kairalicenters.com — network hub. Lists the VERIFIED centres (India +
// international) from lib/centres.ts (re-exported from @kairali/facts, the
// canonical roster since the 17 Jul 2026 ruling — PROJECT_CONTEXT §12). No
// aggregate count is printed in this site's copy; the trust strip leads with
// heritage + accreditation instead.
import Image from "next/image";
import Link from "next/link";
import { graph, kairaliOrganization, webSite, breadcrumbList, serializeJsonLd } from "@kairali/schema";
import { INDIA_CENTRES, INTERNATIONAL_CENTRES, type Centre } from "./lib/centres";

const SITE = "https://kairalicenters.com";
const WHATSAPP_URL = "https://wa.me/919289838797";

const TRUST = [
  { dt: "Since 1908", dd: "Four generations of Ayurvedic physicians." },
  { dt: "NABH-Accredited", dd: "Our teaching hospital in Palakkad, Kerala." },
  { dt: "WHO-GMP Pharmacy", dd: "Our own certified medicine manufacturing." },
  { dt: "Physician-Led", dd: "Classical treatment, qualified doctors." },
];

function CentreCard({ c }: { c: Centre }) {
  return (
    <Link className="centre-card" href={`/centres/${c.slug}`} data-cta="centre_click">
      <div className="cc-body">
        <span className="cc-place">{c.city}{c.region ? ` · ${c.region}` : ""}</span>
        <h3>{c.name}</h3>
        <p className="cc-addr">{c.address}</p>
        {c.partner ? <span className="cc-tag">Partner centre</span> : null}
        <span className="cc-go">View centre &rarr;</span>
      </div>
    </Link>
  );
}

const jsonLd = graph(
  kairaliOrganization({ id: `${SITE}/#organization`, url: SITE }),
  webSite({ id: `${SITE}/#website`, name: "Kairali Ayurvedic Centres", url: SITE, publisherId: `${SITE}/#organization`, inLanguage: "en" }),
  breadcrumbList({ id: `${SITE}/#breadcrumb`, items: [{ name: "Home", url: SITE }] }),
);

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <main id="top">
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <div className="accent-rule" aria-hidden="true" />
              <p className="overline">Kairali Ayurvedic Group · A family tradition since 1908</p>
              <h1>Find a Kairali Ayurvedic Centre</h1>
              <p className="lede">
                Classical Ayurvedic treatment, close to you — from the same
                family of physicians behind our NABH-accredited hospital in
                Kerala. Choose a centre to see its address, timings, and how to
                book a consultation.
              </p>
              <div className="cta-row">
                <a className="btn btn-secondary" href="#india" data-cta="browse_india">Centres in India</a>
                <a className="btn btn-secondary" href="#international" data-cta="browse_intl">International</a>
              </div>
            </div>
            <figure className="hero-photo">
              {/* next/image: the 216KB 1800×1200 original was the LCP element
                  (A5 gate finding, 17 Jul — CI perf 89). Optimizer serves
                  responsive AVIF/WebP; sizes matches the 1fr/1fr hero grid. */}
              <Image src="/images/hero-reception.jpg" alt="A Kairali Ayurvedic Centre — a welcoming treatment reception with traditional preparations" width={1800} height={1200} priority sizes="(min-width: 900px) 50vw, 100vw" />
              <figcaption>Classical Ayurveda, physician-led, at every Kairali centre.</figcaption>
            </figure>
          </div>
        </section>

        <section className="trust-strip" aria-label="About the Kairali Group">
          <div className="container">
            {TRUST.map((t) => (
              <dl className="trust-item" key={t.dt}><dt>{t.dt}</dt><dd>{t.dd}</dd></dl>
            ))}
          </div>
        </section>

        <section className="section" id="india" aria-labelledby="india-heading">
          <div className="container">
            <div className="section-head">
              <p className="overline">In India</p>
              <h2 id="india-heading">Kairali Centres across India</h2>
              <p>Treatment centres in {[...new Set(INDIA_CENTRES.map((c) => c.city))].length} cities. Call ahead to confirm timings and book a consultation.</p>
            </div>
            <div className="centre-grid">
              {INDIA_CENTRES.map((c) => <CentreCard key={c.slug} c={c} />)}
            </div>
          </div>
        </section>

        <section className="section" id="international" aria-labelledby="intl-heading">
          <div className="container">
            <div className="section-head">
              <p className="overline">Around the world</p>
              <h2 id="intl-heading">International Kairali Centres</h2>
              <p>Kairali-affiliated Ayurvedic centres in {[...new Set(INTERNATIONAL_CENTRES.map((c) => c.country))].join(", ")}.</p>
            </div>
            <div className="centre-grid">
              {INTERNATIONAL_CENTRES.map((c) => <CentreCard key={c.slug} c={c} />)}
            </div>
          </div>
        </section>
      </main>

      <div className="sticky-cta" aria-label="Contact">
        <a className="btn btn-primary" href={WHATSAPP_URL} data-cta="whatsapp_click">Book on WhatsApp</a>
      </div>
    </>
  );
}
