// whatisayurveda.com — home. An educational front door: hero, trust furniture
// (accreditations), and the five learning clusters. Non-revenue; routes intent
// to the group properties. Register: group/educational.
import Image from "next/image";
import Link from "next/link";
import {
  graph,
  kairaliOrganization,
  webSite,
  breadcrumbList,
  serializeJsonLd,
} from "@kairali/schema";

const SITE = "https://whatisayurveda.com";
const WHATSAPP_URL = "https://wa.me/919289838797";

const CLUSTERS = [
  { href: "/what-is-ayurveda", title: "What is Ayurveda?", body: "Start here — the doshas, how Ayurveda understands health, and what it can and cannot do, explained plainly." },
  { href: "/doshas", title: "The three doshas", body: "Vata, pitta and kapha — what the constitution model means, and the honest limits of the science behind it." },
  { href: "/panchakarma", title: "Panchakarma", body: "The five classical therapies, what a programme involves, and why it is done under a physician's supervision." },
  { href: "/herbs", title: "Ayurvedic herbs", body: "Ashwagandha, triphala, brahmi, turmeric — traditional use, what studies show, and real cautions." },
  { href: "/is-ayurveda-scientific", title: "Is Ayurveda scientific?", body: "A candid look at the evidence, the heavy-metals question, regulation, and how quality is controlled." },
  { href: "/faq", title: "Common questions", body: "Short, direct answers to the questions people most often ask about Ayurveda." },
];

const TRUST = [
  { dt: "Since 1908", dd: "Four generations of Ayurvedic physicians." },
  { dt: "NABH-Accredited", dd: "Our teaching hospital in Palakkad, Kerala." },
  { dt: "WHO-GMP Pharmacy", dd: "Our own certified manufacturing." },
  { dt: "Physician-Reviewed", dd: "Every health page checked by a BAMS doctor." },
];

const jsonLd = graph(
  kairaliOrganization({ id: `${SITE}/#organization`, url: SITE }),
  webSite({ id: `${SITE}/#website`, name: "What is Ayurveda", url: SITE, publisherId: `${SITE}/#organization`, inLanguage: "en" }),
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
              <p className="overline">An educational resource · Kairali Ayurvedic Group</p>
              <h1>What is Ayurveda?</h1>
              <p className="lede">
                A clear, honest guide to the world&rsquo;s oldest system of
                medicine — written and reviewed by practising Ayurvedic
                physicians. What it is, how it works, and what the evidence
                actually says.
              </p>
              <div className="cta-row">
                <Link className="btn btn-primary" href="/what-is-ayurveda" data-cta="start_reading">
                  Start with the basics
                </Link>
                <Link className="btn btn-secondary" href="/is-ayurveda-scientific" data-cta="read_evidence">
                  Does it actually work?
                </Link>
              </div>
            </div>
            <figure className="hero-photo">
              {/* next/image: the 266KB 1800×1200 original was the LCP element
                  (A5 gate finding, 17 Jul — CI perf 88). Optimizer serves
                  responsive AVIF/WebP; sizes matches the 1fr/1fr hero grid. */}
              <Image
                src="/images/hero-herbs-oils.jpg"
                alt="Herbal poultices and medicated oils in brass vessels on a rattan tray — traditional Ayurvedic preparations"
                width={1800}
                height={1200}
                priority
                sizes="(min-width: 900px) 50vw, 100vw"
              />
              <figcaption>Traditional Ayurvedic preparations — medicated oils and herbal poultices.</figcaption>
            </figure>
          </div>
        </section>

        <section className="trust-strip" aria-label="About the Kairali Group">
          <div className="container">
            {TRUST.map((t) => (
              <dl className="trust-item" key={t.dt}>
                <dt>{t.dt}</dt>
                <dd>{t.dd}</dd>
              </dl>
            ))}
          </div>
        </section>

        <section className="section" aria-labelledby="learn-heading">
          <div className="container">
            <div className="section-head">
              <p className="overline">Learn Ayurveda</p>
              <h2 id="learn-heading">Where would you like to begin?</h2>
              <p>
                Each guide opens with a short, direct answer, then goes deeper.
                Pages reviewed by one of our physicians carry that doctor’s name and the date; the rest say they have not been</p>
            </div>
            <div className="cluster-grid">
              {CLUSTERS.map((c) => (
                <Link key={c.href} className="cluster-card" href={c.href} data-cta="cluster_click">
                  <div className="cc-body">
                    <h3>{c.title}</h3>
                    <p>{c.body}</p>
                    <span className="go" style={{ display: "inline-block", marginTop: 10, fontWeight: 600, color: "var(--forest-500)" }}>
                      Read &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="promise-heading">
          <div className="container reading">
            <p className="overline" id="promise-heading">Our promise</p>
            <div className="capsule lead">
              We will not overstate what Ayurveda can do. Where the evidence is
              strong, we say so; where it is thin or absent, we say that too.
              This site exists to help you understand Ayurveda clearly — not to
              sell you anything.
            </div>
          </div>
        </section>
      </main>

      <div className="sticky-cta" aria-label="Ask a question">
        <a className="btn btn-primary" href={WHATSAPP_URL} data-cta="whatsapp_click">Ask Priya, our AI assistant</a>
      </div>
    </>
  );
}
