/**
 * theblushlounge.com — GOLDEN PAGE (the homepage; front-gate law: ONE page,
 * then STOP for approval — every later page must match this one).
 *
 * Implements the SIGNED "Champagne Editorial" direction faithfully
 * (launches/theblushlounge.com/design-review/hero-mockup-pass2.html): split
 * editorial hero, WhatsApp-first conversion (D-BL-WHATSAPP), press trust bar,
 * then the BRIEF's home structure — approach · services teaser · portfolio
 * strip · academy teaser · closing CTA. Copy is HER voice: first-person,
 * process-led, quiet confidence (voice signals mined from her own captions,
 * content-mined/theblushlounge.com/instagram-2026-07-18/profile-capture.md).
 *
 * All imagery = IG-FULLRES-SOURCED interim (D-BL-INTERIM), 1:1 swap when the
 * hi-res shoot sets arrive — see IMAGE_MANIFEST.md. No prices anywhere
 * (none exist in any trusted source — HARD GATE 6): price-on-enquiry.
 * Inner routes (/portfolio, /services, /academy, /about, /contact) land with
 * the FULL build after golden_page approval — that is the law's sequence.
 */
import Image from "next/image";
import { person, webSite, graph, serializeJsonLd } from "@kairali/schema";
import siteConfig from "../site.config.json";
import {
  SiteFooter,
  WHATSAPP_DISPLAY,
  WHATSAPP_URL,
  IG_URL,
} from "./_components/chrome";

const SITE_URL = `https://${siteConfig.domain}`;

// A8: Person (the entity answer — AEO play from STRATEGY §3) + WebSite.
// Facts limited to what is mined and owner-confirmed; nothing invented.
const jsonLd = graph(
  person({
    id: `${SITE_URL}/#sneha`,
    name: "Sneha Chowdhary",
    jobTitle: "Beauty, Bridal & SFX Makeup Artist",
    url: SITE_URL,
    sameAs: [IG_URL],
  }),
  webSite({
    id: `${SITE_URL}/#website`,
    name: "Blush Lounge — Makeup by Sneha",
    url: SITE_URL,
    inLanguage: "en",
  }),
);

const services = [
  {
    href: "/services#bridal",
    name: "Bridal",
    copy: "Luminous, structured bridal looks made to photograph true and hold from the first ritual to the last dance — airbrush or HD, always yours.",
  },
  {
    href: "/services#engagement-cocktail",
    name: "Engagement & Cocktail",
    copy: "Soft glamour with just the right amount of drama for the nights around the wedding — dewy skin, sculpted eyes, nothing heavy.",
  },
  {
    href: "/services#party",
    name: "Party & Occasion",
    copy: "Fresh, polished looks for receptions, festivals and evenings that matter — built to last, designed to feel like you.",
  },
  {
    href: "/services#editorial-sfx",
    name: "Editorial & SFX",
    copy: "Cinema Makeup School–trained editorial and special-effects work for shoots, campaigns and the covers in between.",
  },
  {
    href: "/services#grooming-men",
    name: "Grooming for Men",
    copy: "Clean, camera-ready grooming for grooms and events — precise, natural, never obvious.",
  },
];

const portfolio = [
  {
    src: "/images/portfolio-bridal.jpg",
    label: "Bridal",
    alt: "Bridal look by Sneha Chowdhary — rose couture, luminous skin and softly defined eyes",
  },
  {
    src: "/images/portfolio-minimal-bridal.jpg",
    label: "Minimal bridal",
    alt: "Minimal, effortless bridal glam by Sneha Chowdhary — fresh skin and natural definition",
  },
  {
    src: "/images/portfolio-soft-glam.jpg",
    label: "Soft glam",
    alt: "Soft glamour look by Sneha Chowdhary — fresh, luminous skin with quiet drama",
  },
  {
    src: "/images/portfolio-structured-glam.jpg",
    label: "Structured glam",
    alt: "Structured modern glamour by Sneha Chowdhary — sculpted, flawless skin",
  },
];

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      {/* ================= HERO — the pass-2 approval object ================= */}
      <section className="hero">
        <div className="hero__copy">
          {/* no aria-label: the visible lockup text IS the accessible name
              (A5 label-content-name-mismatch fix) */}
          <a className="brand" href="/">
            <span className="brand__mark" aria-hidden="true">
              bl
            </span>
            <span className="brand__word">
              Blush Lounge
              <small>Makeup by Sneha</small>
            </span>
          </a>
          <div className="hero__center">
            <p className="eyebrow">Delhi · Worldwide — Beauty, Bridal &amp; SFX</p>
            <h1 className="display">
              Soft glamour,
              <br />
              <em>precise</em> drama.
            </h1>
            {/* pass-2 truth-register fix: "made to last" = design intent in
                her voice, not a measured performance guarantee */}
            <p className="lede">
              Luminous skin, sculpted structure, and a look made to last from
              the first photograph to the last dance — bridal, cocktail and
              editorial artistry by Sneha Chowdhary.
            </p>
            {/* WhatsApp-first funnel (pass-2 blocking fix): the verified
                number IS the primary CTA — D-BL-WHATSAPP */}
            <div className="ctas">
              <a className="btn btn--solid" href={WHATSAPP_URL} data-cta="whatsapp_click" rel="noopener">
                WhatsApp Sneha · {WHATSAPP_DISPLAY}
              </a>
              <a className="btn btn--line" href="/contact" data-cta="enquiry_open">
                Enquire for your date
              </a>
            </div>
          </div>
          <div className="trust">
            <span className="trust__label">As seen in · trained &amp; collaborated with</span>
            <span>
              <b>MAC</b> Bridal
            </span>
            <span>Femina</span>
            <span>Grazia</span>
            <span>Cinema Makeup School · LA</span>
          </div>
        </div>
        <div className="hero__image">
          <Image
            className="hero__img"
            src="/images/hero-cocktail-glam.jpg"
            alt="Bride-to-be in champagne couture at her cocktail night — makeup by Sneha Chowdhary"
            width={1400}
            height={2489}
            priority
            sizes="(max-width: 900px) 100vw, 53vw"
          />
          {/* battery pass-1: credit is now a LINK to her profile (IG-born
              visitors tap the handle) — Gate-2 advisory, data-cta wired */}
          {/* no aria-label: visible text ("makeup by Sneha @blushlounge_sneha")
              is the accessible name (A5 label-content-name-mismatch fix) */}
          <a className="credit" href={IG_URL} data-cta="ig_profile_click" rel="noopener">
            <div className="script-accent">makeup by Sneha</div>
            <div className="caps">@blushlounge_sneha</div>
          </a>
          {/* battery pass-1 (Gate-2 [3] / beauty B19): the over-image CTA
              carries the verified number — viewport parity with desktop */}
          <a className="wa-over" href={WHATSAPP_URL} data-cta="whatsapp_click" rel="noopener">
            WhatsApp Sneha · {WHATSAPP_DISPLAY}
          </a>
        </div>
      </section>

      {/* ================= APPROACH — her process, her words ================= */}
      <section className="section approach" id="approach">
        <div className="approach__media">
          <Image
            src="/images/approach-traditional-bridal.jpg"
            alt="Traditional bridal look by Sneha Chowdhary — knowing exactly where to create, never adding more"
            width={900}
            height={1600}
            sizes="(max-width: 900px) 100vw, 40vw"
            loading="lazy"
          />
        </div>
        <div>
          <p className="eyebrow">The approach</p>
          <p className="approach__quote">
            “Softness takes just as much precision as drama.”
          </p>
          <p className="approach__body">
            I keep the skin fresh and luminous, build structure where the
            camera needs it, and stop before it stops looking like you. No
            heaviness, no masks — a look that survives tears, embraces, and a
            few hundred photographs.
          </p>
          <p className="approach__body">
            Trained at Cinema Makeup School in Los Angeles, collaborator on
            MAC Bridal, featured by Femina and Grazia — and behind brides in
            Delhi, Bali, Budapest, London, Bodrum, Hong Kong and Cannes.
          </p>
        </div>
      </section>

      {/* ================= SERVICES TEASER ================= */}
      <div className="services">
        <section className="section" id="services">
          <div className="section__head">
            <p className="eyebrow">Services</p>
            {/* beauty pass-3 truth-fix: conversation claim (verifiable — her
                own WhatsApp), not an absolute delivery promise */}
            <h2 className="display">
              One conversation, <em>your</em> whole occasion.
            </h2>
            {/* battery pass-1 truth-fix (Perplexity MISLEADING / beauty B10):
                the old line promised one-on-one DELIVERY on every booking —
                unverifiable (HARD GATE 6). The verified truth: the enquiry
                conversation is with Sneha herself (D-BL-WHATSAPP, her own
                number). */}
            <p className="section-lede">
              Your enquiry goes straight to Sneha — one conversation to plan
              everything, from the trial to the final touch-up. Dates and
              quotes on enquiry.
            </p>
          </div>
          <div className="services__grid">
            {services.map((s) => (
              <a className="service" key={s.name} href={s.href}>
                <h3>{s.name}</h3>
                <p>{s.copy}</p>
                <span className="service__cue">Price on enquiry →</span>
              </a>
            ))}
            <a className="service" href={WHATSAPP_URL} data-cta="whatsapp_click" rel="noopener">
              <h3>Not sure where to start?</h3>
              <p>
                Tell me your date and your occasion on WhatsApp — I’ll tell you
                exactly what it needs.
              </p>
              <span className="service__cue">WhatsApp Sneha →</span>
            </a>
          </div>
        </section>
      </div>

      {/* ================= PORTFOLIO STRIP ================= */}
      <section className="section" id="portfolio">
        <div className="section__head">
          <p className="eyebrow">Recent work</p>
          <h2 className="display">
            The proof is in the <em>photographs</em>.
          </h2>
        </div>
        <div className="portfolio__grid">
          {portfolio.map((p) => (
            <figure key={p.src} style={{ margin: 0 }}>
              <a className="portfolio__item" href="/portfolio">
                <Image
                  src={p.src}
                  alt={p.alt}
                  width={900}
                  height={1200}
                  sizes="(max-width: 900px) 50vw, 25vw"
                  loading="lazy"
                />
                <figcaption>{p.label}</figcaption>
              </a>
            </figure>
          ))}
        </div>
        <div className="portfolio__foot">
          <a className="textlink" href="/portfolio">
            View the portfolio
          </a>
          <a className="textlink" href={IG_URL} data-cta="ig_profile_click" rel="noopener">
            More on Instagram · @blushlounge_sneha
          </a>
        </div>
      </section>

      {/* ================= ACADEMY TEASER — Blush School of Beauty ========== */}
      <div className="academy">
        <section className="section" id="academy">
          <div>
            <p className="eyebrow">Blush School of Beauty</p>
            <h2 className="display">Learn the craft behind the calm.</h2>
            <p>
              The same approach I use on my brides, taught the way I wish
              someone had taught me — online masterclasses, a PRO course, and
              self-makeup classes, from Delhi to wherever you are.
            </p>
            <ul className="academy__list">
              <li>Online bridal masterclasses</li>
              <li>PRO certification course</li>
              <li>Self-makeup classes</li>
            </ul>
            <div className="ctas">
              <a className="btn btn--ivory" href="/academy" data-cta="academy_enquiry">
                Explore the school
              </a>
            </div>
          </div>
          <div className="academy__media">
            <Image
              src="/images/academy-masterclass.jpg"
              alt="Bridal masterclass look — Blush School of Beauty, taught by Sneha Chowdhary"
              width={1100}
              height={1375}
              sizes="(max-width: 900px) 100vw, 40vw"
              loading="lazy"
            />
          </div>
        </section>
      </div>

      {/* ================= CLOSING CTA ================= */}
      <section className="close-cta" id="enquire">
        <div className="script-accent" aria-hidden="true">
          your date, your look
        </div>
        <h2 className="display">
          Wedding season books <em>early</em>.
        </h2>
        {/* beauty pass-3 truth-fix: same conversation register as the
            services lede — no absolute delivery promise */}
        <p>
          Tell me your date, your city and your occasion — I’ll come back with
          what’s possible and what it needs. One conversation, no forms to
          fight.
        </p>
        <div className="ctas">
          <a className="btn btn--solid" href={WHATSAPP_URL} data-cta="whatsapp_click" rel="noopener">
            WhatsApp Sneha · {WHATSAPP_DISPLAY}
          </a>
          <a className="btn btn--line" href="/contact" data-cta="enquiry_open">
            Send an enquiry
          </a>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
