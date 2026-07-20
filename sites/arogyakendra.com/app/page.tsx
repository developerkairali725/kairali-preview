// arogyakendra.com — brand-protective single page for the Kairali Ayurvedic
// Group (entity: group · register A). Copy rules: Brand Manual ch.11.
// Image slots are described placeholders (ENGINEERING_STANDARDS placeholder-
// first rule) — specs mirror IMAGE_MANIFEST.md; swap-in is mechanical.

import {
  graph,
  kairaliOrganization,
  webSite,
  breadcrumbList,
  serializeJsonLd,
} from "@kairali/schema";
// Network counts are COMPUTED from the verified centres roster — never typed
// (canonical: KAC site figures, ruled 17 Jul 2026; PROJECT_CONTEXT §12).
import { CENTRES_COUNT, COUNTRIES_PHRASE, COUNTRIES_PHRASE_TITLE } from "@kairali/facts";
import { SocialLinks } from "@kairali/social";

const WHATSAPP_URL = "https://wa.me/919289838797"; // interim Priya number (DECISIONS.md 2026-07-13 18:51 IST)
const EMAIL = "info@kairali.com";

const BRANDS = [
  {
    name: "Kairali — The Ayurvedic Healing Village",
    href: "https://www.ayurvedichealingvillage.com",
    line: "NABH-accredited Ayurvedic hospital-retreat in Palakkad, Kerala, for physician-led treatment programmes.",
    slot: "brand-healing-village",
    subject: "Healing Village treatment pavilion amid Kerala greenery",
    alt: "Treatment pavilion of Kairali's Ayurvedic Healing Village surrounded by palms in Palakkad, Kerala",
  },
  {
    name: "Kairali Ayurvedic Centres",
    href: "https://www.kairalicenters.com",
    line: "Treatment centres in India and overseas, carrying forward classical Ayurvedic therapy.",
    slot: "brand-centres",
    subject: "Therapy room interior at a Kairali Ayurvedic Centre",
    alt: "Calm therapy room with a wooden treatment table at a Kairali Ayurvedic Centre",
  },
  {
    name: "Kairali Ayurvedic Products",
    href: "https://www.kairaliproducts.in",
    line: "WHO-GMP-certified Ayurvedic medicines, oils, and personal care from our own manufacturing.",
    slot: "brand-products",
    subject: "Kairali herbal oils and medicines arranged with raw herbs",
    alt: "Bottles of Kairali Ayurvedic oils beside fresh herbs and grinding stones",
  },
  {
    name: "Kairali Herbal Tea",
    href: "https://www.kairalitea.com",
    line: "Herbal tea blends rooted in Ayurvedic tradition.",
    slot: "brand-tea",
    subject: "Kairali herbal tea being poured, loose blend alongside",
    alt: "Cup of Kairali herbal tea being poured with the loose-leaf blend beside it",
  },
  {
    name: "Kairali Franchise",
    href: "https://www.kairalifranchise.com",
    line: "Partner with the Kairali network — franchise opportunities in India and abroad.",
    slot: "brand-franchise",
    subject: "Kairali centre entrance with signage, welcoming and professional",
    alt: "Entrance of a Kairali Ayurvedic Centre with brand signage",
  },
  {
    name: "Kairali Ayurvedic Group",
    href: "https://www.kairali.com",
    line: "The group behind it all — health through ayurveda, a family tradition since 1908.",
    slot: "brand-group",
    subject: "Founding family or heritage still-life: mortar, pestle, palm leaf",
    alt: "Heritage still-life of a stone mortar and pestle with fresh Ayurvedic herbs",
  },
];

// Checklist A8 / pagewise structured-data items: Organization + WebSite +
// BreadcrumbList (Home only — this is a one-pager) in a single @graph.
const jsonLd = graph(
  kairaliOrganization({
    id: "https://arogyakendra.com/#organization",
    url: "https://arogyakendra.com",
    sameAs: BRANDS.map((b) => b.href),
  }),
  webSite({
    id: "https://arogyakendra.com/#website",
    name: "Arogya Kendra",
    url: "https://arogyakendra.com",
    publisherId: "https://arogyakendra.com/#organization",
    inLanguage: "en",
  }),
  breadcrumbList({
    id: "https://arogyakendra.com/#breadcrumb",
    items: [{ name: "Home", url: "https://arogyakendra.com" }],
  }),
);

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function LeafMark() {
  return (
    <svg width="72" height="72" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M32 6C16 20 12 38 32 58c20-20 16-38 0-52Z" />
      <path d="M32 14v38M32 26l-8-6M32 26l8-6M32 38l-10-7M32 38l10-7" strokeWidth="1.4" />
    </svg>
  );
}

/** Described placeholder per docs/ENGINEERING_STANDARDS.md — the spec it
 *  carries matches its row in IMAGE_MANIFEST.md. */
function ImagePlaceholder({
  slot,
  subject,
  mood,
  dims,
  format,
  alt,
  ratio,
  className = "",
}: {
  slot: string;
  subject: string;
  mood: string;
  dims: string;
  format: string;
  alt: string;
  ratio: string;
  className?: string;
}) {
  return (
    <figure className={`ph ${className}`} style={{ aspectRatio: ratio }} role="img" aria-label={alt}>
      <span className="ph-mark">
        <LeafMark />
      </span>
      <figcaption className="ph-spec" aria-hidden="true">
        <span className="ph-slot">{slot} · {dims} · {format}</span>
        {subject} — {mood}
      </figcaption>
    </figure>
  );
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      <header className="site-header">
        <div className="container">
          <a className="wordmark" href="#top" aria-label="Arogya Kendra — home">
            Arogya Kendra
          </a>
          <a
            className="btn btn-secondary header-cta"
            href={WHATSAPP_URL}
            data-cta="whatsapp_click"
          >
            <WhatsAppIcon />
            Chat on WhatsApp
          </a>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <div className="accent-rule" aria-hidden="true" />
              <p className="overline">Kairali Ayurvedic Group · A family tradition since 1908</p>
              <h1>Arogya Kendra — The Centre of Health</h1>
              <p className="lede">
                Arogya kendra means &ldquo;centre of health&rdquo;. For four
                generations our family has practised Ayurveda the classical way
                — physician-led treatment at our NABH-accredited
                hospital-retreat, medicines from our own WHO-GMP-certified
                manufacturing, and treatment centres across {COUNTRIES_PHRASE}.
              </p>
              <div className="cta-row">
                <a className="btn btn-primary" href={WHATSAPP_URL} data-cta="whatsapp_click">
                  <WhatsAppIcon />
                  Chat With Us on WhatsApp
                </a>
                <a className="btn btn-secondary" href={`mailto:${EMAIL}`} data-cta="email_click">
                  <MailIcon />
                  Write to {EMAIL}
                </a>
              </div>
              <p className="cta-note">
                Tell us what you are looking for — we will point you to the
                right Kairali door.
              </p>
            </div>
            <ImagePlaceholder
              className="ph-hero"
              slot="hero-main"
              subject="Kairali therapy or Kerala nature photography"
              mood="natural warm colour, calm, human (Brand Manual ch.05)"
              dims="1600×900"
              format="AVIF/WebP"
              alt="Warm photograph of an Ayurvedic therapy in progress amid Kerala greenery at a Kairali centre"
              ratio="16 / 9"
            />
          </div>
        </section>

        <section className="trust" aria-label="Kairali credentials">
          <div className="container">
            <dl className="trust-card">
              <div>
                <dt>Since 1908</dt>
                <dd>Four generations of classical Ayurvedic practice.</dd>
              </div>
              <div>
                <dt>NABH-Accredited</dt>
                <dd>Hospital-retreat in Palakkad, Kerala.</dd>
              </div>
              <div>
                <dt>WHO-GMP Certified</dt>
                <dd>Medicines from our own manufacturing.</dd>
              </div>
              <div>
                <dt>{COUNTRIES_PHRASE_TITLE}</dt>
                <dd>{CENTRES_COUNT} Ayurvedic treatment centres across the world.</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="section" aria-labelledby="brands-heading">
          <div className="container">
            <div className="section-head">
              <p className="overline">One Family of Brands</p>
              <h2 id="brands-heading">Find the Kairali You Need</h2>
              <p>
                Every door below is part of the same family — the same
                physicians, the same medicines, the same promise of health
                through ayurveda.
              </p>
            </div>
            <div className="brand-grid">
              {BRANDS.map((b) => (
                <a key={b.href} className="brand-card" href={b.href} data-cta="brand_click">
                  <ImagePlaceholder
                    slot={b.slot}
                    subject={b.subject}
                    mood="natural warm colour (ch.05)"
                    dims="640×360"
                    format="AVIF/WebP"
                    alt={b.alt}
                    ratio="16 / 9"
                  />
                  <div className="brand-body">
                    <h3>{b.name}</h3>
                    <p className="brand-line">{b.line}</p>
                    <span className="brand-visit">Visit the site &rarr;</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="promise" aria-labelledby="promise-heading">
          <div className="container">
            <p className="overline" id="promise-heading">Our Promise</p>
            <p className="promise-quote">
              Health through ayurveda — a family promise kept daily since 1908.
            </p>
            <div className="cta-row">
              <a className="btn btn-inverse" href={WHATSAPP_URL} data-cta="whatsapp_click">
                <WhatsAppIcon />
                Chat With Us on WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <p className="tagline">health through ayurveda</p>
          <p>
            Kairali Ayurvedic Group ·{" "}
            <a href={`mailto:${EMAIL}`} data-cta="email_click">{EMAIL}</a> ·{" "}
            <a href={WHATSAPP_URL} data-cta="whatsapp_click">WhatsApp +91 92898 38797</a>
          </p>
          {/* D-20260718-04: the shared fleet social set — handles live in
              packages/social/src/config.ts ONLY (one-file true-up) */}
          <SocialLinks />
          <p>A family tradition since 1908 · Palakkad, Kerala, India</p>
        </div>
      </footer>

      <div className="sticky-cta" aria-label="Quick contact">
        <a className="btn btn-primary" href={WHATSAPP_URL} data-cta="whatsapp_click">
          <WhatsAppIcon />
          WhatsApp Us
        </a>
        <a
          className="btn btn-secondary"
          href={`mailto:${EMAIL}`}
          data-cta="email_click"
          aria-label={`Email ${EMAIL}`}
        >
          <MailIcon />
        </a>
      </div>
    </>
  );
}
