// kairali.com — flagship group-corporate site (entity: group · register A).
// IA harvested from the 14 Jul agency-build intake (docs/group-inputs/
// kairali-com-agency-build-intake.md §3): five pillars + heritage lineage.
// Per-pillar register law: the Healing Village card speaks CLINICAL
// (patient/physician/treatment/programme — KTAHV lock), Villa Raag speaks
// hospitality, Products speak pharma. First Factory site with REAL
// photography — every image is a library original (IMAGE_MANIFEST.md).

import Image from "next/image";
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

// Liveness of every href verified 2026-07-14 18:45 IST (curl 200; the
// Healing Village 403 is its Cloudflare bot challenge — site is live).
const PILLARS = [
  {
    name: "The Ayurvedic Healing Village",
    href: "https://www.ayurvedichealingvillage.com",
    line:
      "Our NABH-accredited Ayurvedic hospital in Palakkad, Kerala — physician-led treatment programmes and classical Panchakarma, from consultation to admission and discharge.",
    img: {
      src: "/images/ktahv-entrance-ganesha.jpg",
      width: 733,
      height: 1100,
      alt: "Stone Ganesha statue framed by vines at the entrance gate of the Ayurvedic Healing Village, Palakkad",
    },
  },
  {
    name: "Kairali Ayurvedic Products",
    href: "https://www.kairaliproducts.com",
    line:
      "WHO-GMP-certified classical medicines, oils and personal care, manufactured by our own unit and shipped worldwide from our stores.",
    img: {
      src: "/images/kappl-product-range.jpg",
      width: 1100,
      height: 1100,
      alt: "Range of Kairali Ayurvedic product packs and oils arranged together",
    },
  },
  {
    name: "Kairali Ayurvedic Centres",
    href: "https://www.kairalicenters.com",
    line:
      `Treatment centres across ${COUNTRIES_PHRASE} carrying forward classical Ayurvedic therapy — the group's oldest pillar.`,
    img: {
      src: "/images/centres-products-garden.jpg",
      width: 733,
      height: 1100,
      alt: "Kairali Ayurvedic preparations displayed on a wicker table in a garden at dusk",
    },
  },
  {
    name: "Ayurveda Training",
    href: "https://kairali.guru",
    line:
      "Courses in the theory and practice of Ayurveda and Panchakarma, taught at the Healing Village amid fifty acres of herbal farmland.",
    img: {
      src: "/images/training-veranda.jpg",
      width: 1100,
      height: 733,
      alt: "Circular open veranda with cane chairs and a terracotta dome ceiling at the Healing Village",
    },
  },
  {
    name: "Villa Raag, Goa",
    href: "https://villaraag.com",
    line:
      "Our boutique wellness villa in Agonda, South Goa — quiet rooms, unhurried mornings, and the Kairali way of wellbeing.",
    img: {
      src: "/images/raag-suite.jpg",
      width: 1100,
      height: 733,
      alt: "King bedroom at Villa Raag with a tufted headboard and gold pendant lights",
    },
  },
  {
    name: "Kairali Franchise",
    href: "https://www.kairalifranchise.com",
    line:
      "Partner with the Kairali network — bring a century-old practice to your city, in India and abroad.",
    img: {
      src: "/images/franchise-welcome.jpg",
      width: 1100,
      height: 733,
      alt: "Woman in a Kerala Kasavu sari offering a namaste greeting in an arched brick corridor",
    },
  },
];

const jsonLd = graph(
  kairaliOrganization({
    id: "https://kairali.com/#organization",
    url: "https://kairali.com",
    sameAs: PILLARS.map((p) => p.href),
  }),
  webSite({
    id: "https://kairali.com/#website",
    name: "Kairali Ayurvedic Group",
    url: "https://kairali.com",
    publisherId: "https://kairali.com/#organization",
    inLanguage: "en",
  }),
  breadcrumbList({
    id: "https://kairali.com/#breadcrumb",
    items: [{ name: "Home", url: "https://kairali.com" }],
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

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      <header className="site-header">
        <div className="container">
          {/* KAG brand mark — vector (Q17: raster → SVG swap complete) */}
          <a className="logo-link" href="#top" aria-label="Kairali Ayurvedic Group — home">
            <img
              src="/images/kairali-icon.svg"
              alt="Kairali — health through ayurveda, a family tradition since 1908"
              width="75"
              height="52"
            />
            <span className="logo-name">Kairali Ayurvedic Group</span>
          </a>
          <nav className="site-nav" aria-label="Sections">
            <a href="#healing-village">Healing Village</a>
            <a href="#pillars">Products</a>
            <a href="#heritage">Heritage</a>
            <a href="#contact">Contact</a>
          </nav>
          <a
            className="btn btn-secondary header-cta"
            href={WHATSAPP_URL}
            data-cta="whatsapp_click"
          >
            <WhatsAppIcon />
            WhatsApp
          </a>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <div className="accent-rule" aria-hidden="true" />
              <p className="overline">One Family · Six Doors · Palakkad, Kerala</p>
              <h1>Health through Ayurveda — a family tradition since 1908</h1>
              <p className="lede">
                For four generations, one family has practised Ayurveda the
                classical way — a NABH-accredited hospital in Kerala, medicines
                from our own WHO-GMP-certified manufacturing, treatment centres
                in {COUNTRIES_PHRASE}, training for the next generation, and a
                wellness villa by the sea in Goa.
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
                One message reaches the whole group — we will point you to the
                right Kairali door.
              </p>
            </div>
            <figure className="hero-photo">
              {/* next/image: the 461KB 1800×1200 original was the LCP element
                  (7.3s mobile) — A5 gate finding, 17 Jul. Optimizer serves
                  responsive AVIF/WebP under next start AND Vercel. */}
              <Image
                src="/images/hero-healing-village-bridge.jpg"
                alt="White wooden footbridge leading through misty tropical forest to a stilted building at the Ayurvedic Healing Village"
                width={1800}
                height={1200}
                priority
                sizes="(min-width: 960px) 52vw, 100vw"
              />
              <figcaption>The Ayurvedic Healing Village, Palakkad — morning.</figcaption>
            </figure>
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
                <dd>Ayurvedic hospital in Palakkad, Kerala.</dd>
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

        <section className="section" id="pillars" aria-labelledby="pillars-heading">
          <div className="container">
            <div className="section-head">
              <p className="overline">One Group, Six Doors</p>
              <h2 id="pillars-heading">The Kairali Family</h2>
              <p>
                Every door below is part of the same family — the same
                physicians, the same medicines, the same promise of health
                through ayurveda.
              </p>
            </div>
            <div className="brand-grid">
              {PILLARS.map((p, i) => (
                <a
                  key={p.href}
                  id={i === 0 ? "healing-village" : undefined}
                  className="brand-card"
                  href={p.href}
                  data-cta="brand_click"
                >
                  <figure className="card-photo">
                    <img
                      src={p.img.src}
                      alt={p.img.alt}
                      width={p.img.width}
                      height={p.img.height}
                      loading="lazy"
                    />
                  </figure>
                  <div className="brand-body">
                    <h3>{p.name}</h3>
                    <p className="brand-line">{p.line}</p>
                    <span className="brand-visit">Visit the site &rarr;</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="heritage" id="heritage" aria-labelledby="heritage-heading">
          <div className="container heritage-grid">
            <figure className="heritage-photo">
              <img
                src="/images/heritage-therapy-cabinets.jpg"
                alt="Traditional wooden steam-bath cabinets beside an arched brick window in a therapy block at the Healing Village"
                width="1400"
                height="933"
                loading="lazy"
              />
              <figcaption>
                Traditional steam-bath cabinets in the therapy block, Palakkad.
              </figcaption>
            </figure>
            <div>
              <p className="overline">Our Lineage</p>
              <h2 id="heritage-heading">A family practice, four generations deep</h2>
              <p>
                Kairali&rsquo;s story begins with the physicians of one Kerala
                family — the late Dr.&nbsp;Sankunny Vaidiar and
                Dr.&nbsp;K.&nbsp;S.&nbsp;Vasudevan — whose practice grew from a
                village clinic into a group serving patients across the world.
              </p>
              <p>
                The same family carries it forward today: classical formulations
                manufactured to WHO-GMP standard, physician-led treatment at the
                Healing Village, and centres that keep the tradition within
                reach of {COUNTRIES_PHRASE}.
              </p>
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

      <footer className="site-footer" id="contact">
        <div className="container">
          <p className="tagline">health through ayurveda</p>
          <p>
            Kairali Ayurvedic Group ·{" "}
            <a href={`mailto:${EMAIL}`} data-cta="email_click">{EMAIL}</a> ·{" "}
            <a href={WHATSAPP_URL} data-cta="whatsapp_click">WhatsApp +91 92898 38797</a> ·{" "}
            {/* Group IVR — Q-KC3 CLOSED / D-20260714-QKC3 (B-073 restore) */}
            <a href="tel:+919555156156" data-cta="call_click">Call +91 95551 56156</a>
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
