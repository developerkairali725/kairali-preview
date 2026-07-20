// arogyashala.in — brand-protective one-pager (entity: group · register A).
// Design: docs/design-research/arogyashala-2026-07-16.md (D-DESIGN-DIFF) —
// dark centered opening, TWO-DOOR dual-audience router, numbered programme
// flow, authenticity-verification block, annotated storefront figure, FAQ.
// Facts law (rule 6): programme definition = wiki/entities/arogya-brands.md
// (Abilash ruling 16 Jul); group facts = locked/licensed only; NO outlet
// counts, NO locations, NO commercial figures (roster blocked, commercials
// gated per Decision #59 family). Legacy cure-claim copy was deliberately
// NOT carried over (content-mined/arogyashala.co.in, compliance floor).
// WhatsApp = interim Priya number (DECISIONS 2026-07-13 18:51, arogyakendra
// precedent) until the group number ruling lands.

import {
  graph,
  kairaliOrganization,
  webSite,
  breadcrumbList,
  faqPage,
  serializeJsonLd,
} from "@kairali/schema";
import { SocialLinks } from "@kairali/social";

const SITE = "https://arogyashala.in";
const EMAIL = "info@kairali.com";
const WHATSAPP_URL = "https://wa.me/919289838797";

// Rolling-number law: computed from the fixed origins, never typed.
const LINEAGE_YEARS = new Date().getFullYear() - 1908;
const GROUP_YEARS = new Date().getFullYear() - 1989;

const FAQS = [
  {
    q: "Is this a franchise-fee page?",
    a: "No. This page only starts the conversation. If your counter qualifies, Kairali shares the programme's commercial details with you directly — nothing is published here.",
  },
  {
    q: "Do I need to run a chemist shop?",
    a: "The programme is designed for chemists and retail counters in tier-2 and tier-3 cities that want Kairali branding. If you run a different kind of shop, write to us anyway — we will tell you honestly whether it fits.",
  },
  {
    q: "Who supplies the products?",
    a: "Kairali Ayurvedic Products — the group’s own WHO-GMP-certified manufacturing. Your counter carries the genuine Kairali range, with product training and usage guidance for your staff.",
  },
  {
    q: "How do customers know a counter is genuine?",
    a: `Every genuine Arogya Shala counter is authorised by Kairali. Anyone can verify a board by writing to ${EMAIL} or messaging us on WhatsApp.`,
  },
  {
    q: "Is medical treatment given at the counter?",
    a: "No. An Arogya Shala counter retails Kairali products. Consultation and treatment belong with physicians — at Kairali's NABH-accredited hospital in Palakkad and its clinics — never at a retail counter.",
  },
];

const jsonLd = graph(
  kairaliOrganization({
    id: `${SITE}/#organization`,
    url: SITE,
  }),
  webSite({
    id: `${SITE}/#website`,
    name: "Arogya Shala",
    url: SITE,
    publisherId: `${SITE}/#organization`,
    inLanguage: "en",
  }),
  faqPage({
    id: `${SITE}/#faq`,
    questions: FAQS.map((f) => ({ question: f.q, answer: f.a })),
  }),
  breadcrumbList({
    id: `${SITE}/#breadcrumb`,
    items: [{ name: "Home", url: SITE }],
  }),
);

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

// Annotated storefront — ORIGINAL illustration (no photo exists of a real
// counter yet; an honest drawing beats a stock fake). Callouts are HTML for
// accessibility; the SVG is decorative geometry in brand tokens.
function StorefrontFigure() {
  return (
    <figure className="storefront" aria-describedby="storefront-callouts">
      <svg viewBox="0 0 560 330" role="img" aria-label="Illustration of a neighbourhood chemist counter carrying Arogya Shala branding">
        {/* awning */}
        <rect x="40" y="52" width="480" height="16" rx="4" fill="var(--forest-500)" />
        <path d="M40 68h480l-14 26H54Z" fill="var(--forest-700)" />
        {/* the board */}
        <rect x="120" y="8" width="320" height="44" rx="6" fill="var(--forest-700)" />
        <text x="280" y="37" textAnchor="middle" fontFamily="var(--font-display)" fontSize="24" fill="var(--ivory)">
          AROGYA SHALA
        </text>
        <circle cx="425" cy="30" r="9" fill="var(--marigold-400)" />
        {/* shop body */}
        <rect x="54" y="94" width="452" height="196" fill="var(--card-bg)" stroke="var(--bronze-400)" strokeOpacity="0.4" />
        {/* shelf with the range */}
        <rect x="80" y="120" width="180" height="8" fill="var(--bronze-400)" opacity="0.6" />
        <rect x="90" y="96" width="22" height="24" rx="2" fill="var(--leaf-500)" />
        <rect x="118" y="100" width="18" height="20" rx="2" fill="var(--forest-500)" />
        <rect x="142" y="94" width="24" height="26" rx="2" fill="var(--bronze-400)" />
        <rect x="172" y="100" width="18" height="20" rx="2" fill="var(--forest-700)" />
        <rect x="196" y="96" width="22" height="24" rx="2" fill="var(--leaf-500)" />
        <rect x="80" y="160" width="180" height="8" fill="var(--bronze-400)" opacity="0.6" />
        <rect x="94" y="136" width="20" height="24" rx="2" fill="var(--forest-500)" />
        <rect x="120" y="140" width="24" height="20" rx="2" fill="var(--leaf-500)" />
        <rect x="150" y="134" width="18" height="26" rx="2" fill="var(--forest-700)" />
        <rect x="174" y="140" width="22" height="20" rx="2" fill="var(--bronze-400)" />
        {/* counter */}
        <rect x="300" y="180" width="180" height="70" rx="4" fill="var(--ivory)" stroke="var(--bronze-400)" strokeOpacity="0.5" />
        <rect x="300" y="180" width="180" height="12" fill="var(--forest-500)" opacity="0.85" />
        {/* authorised-counter mark on the counter front */}
        <circle cx="390" cy="222" r="16" fill="none" stroke="var(--forest-500)" strokeWidth="2.5" />
        <path d="M383 222l5 5 9-10" fill="none" stroke="var(--forest-500)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* ground */}
        <rect x="30" y="290" width="500" height="3" fill="var(--bronze-400)" opacity="0.5" />
        {/* callout markers */}
        <circle cx="136" cy="30" r="12" fill="var(--ink)" />
        <text x="136" y="35" textAnchor="middle" fontFamily="var(--font-caption)" fontSize="13" fill="var(--ivory)">1</text>
        <circle cx="170" cy="145" r="12" fill="var(--ink)" />
        <text x="170" y="150" textAnchor="middle" fontFamily="var(--font-caption)" fontSize="13" fill="var(--ivory)">2</text>
        <circle cx="430" cy="222" r="12" fill="var(--ink)" />
        <text x="430" y="227" textAnchor="middle" fontFamily="var(--font-caption)" fontSize="13" fill="var(--ivory)">3</text>
      </svg>
      <figcaption id="storefront-callouts">
        <ol className="callouts">
          {/* single span per item: the li is a flex row of marker + text —
              bare <strong> + text nodes would become separate flex columns */}
          <li>
            <span>
              <strong>The Arogya Shala board</strong> — Kairali branding over
              your own shopfront.
            </span>
          </li>
          <li>
            <span>
              <strong>The Kairali shelf</strong> — the WHO-GMP Kairali range,
              supplied to your counter.
            </span>
          </li>
          <li>
            <span>
              <strong>The authorised-counter mark</strong> — what customers can
              verify with Kairali directly.
            </span>
          </li>
        </ol>
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

      {/* ---------- Dark centered opening (no fleet page opens dark) ---------- */}
      <header className="hero-dark">
        <div className="container">
          <a className="wordmark" href="/" aria-label="Arogya Shala — home">
            <img src="/images/kairali-icon.svg" alt="" aria-hidden="true" width="44" height="31" />
          </a>
          <p className="overline">A Kairali Retail Programme</p>
          <h1>Arogya Shala — the Kairali counter for your neighbourhood.</h1>
          <p className="lede">
            Kairali branding and the genuine Kairali range, for chemists and
            retail counters across India — from the family that has practised
            Ayurveda for {LINEAGE_YEARS} years.
          </p>
        </div>
      </header>

      <main>
        {/* ---------- THE TWO DOORS — the layout IS the router ---------- */}
        <nav className="doors container" aria-label="Choose your path">
          <a className="door" href="#owners" data-cta="door_owner">
            <span className="door-kicker">For shop owners</span>
            <span className="door-title">I run a chemist shop or retail counter</span>
            <span className="door-hint">The programme, step by step &darr;</span>
          </a>
          <a className="door" href="#verify" data-cta="door_verify">
            <span className="door-kicker">For customers</span>
            <span className="door-title">I saw the Arogya Shala board at a shop</span>
            <span className="door-hint">Check that it&rsquo;s genuine &darr;</span>
          </a>
        </nav>

        {/* ---------- OWNERS' DOOR ---------- */}
        <section className="section" id="owners" aria-labelledby="owners-heading">
          <div className="container">
            <p className="overline">For Shop Owners</p>
            <h2 id="owners-heading">What an Arogya Shala counter is</h2>
            <p className="measure">
              Arogya Shala is Kairali&rsquo;s retail-branding programme for
              chemists and retail outlets in tier-2 and tier-3 cities — the
              straightforward way to become a Kairali retailer. Your shop
              stays yours — the board, the shelf and the range become
              Kairali. Products come from Kairali Ayurvedic Products, the
              group&rsquo;s own WHO-GMP-certified manufacturing, with product
              training and usage guidance for your staff.
            </p>

            <StorefrontFigure />

            <h3 className="flow-heading">What happens after you write to us</h3>
            <ol className="flow">
              <li>
                <span className="flow-num" aria-hidden="true">01</span>
                <div>
                  <strong>You enquire.</strong> A WhatsApp message or an email
                  with your name, phone number, pincode and shop type is
                  enough.
                </div>
              </li>
              <li>
                <span className="flow-num" aria-hidden="true">02</span>
                <div>
                  <strong>Kairali evaluates the counter.</strong> We look at
                  the location and the fit, and talk the programme through
                  with you. Commercial details are shared directly with
                  qualified applicants.
                </div>
              </li>
              <li>
                <span className="flow-num" aria-hidden="true">03</span>
                <div>
                  <strong>The board and the range arrive.</strong> Your
                  counter gets its Arogya Shala branding, the Kairali shelf,
                  and staff guidance for the products it carries.
                </div>
              </li>
            </ol>

            <div className="cta-row">
              <a className="btn btn-primary" href={WHATSAPP_URL} data-cta="whatsapp_owner">
                <WhatsAppIcon />
                WhatsApp us about your shop
              </a>
              <a className="btn btn-secondary" href={`mailto:${EMAIL}?subject=Arogya%20Shala%20enquiry%20—%20my%20shop`} data-cta="email_owner">
                Write to {EMAIL}
              </a>
            </div>
          </div>
        </section>

        {/* ---------- TRUST — precisely-attributed group facts ---------- */}
        <section className="band-trust" aria-label="The Kairali Group behind the programme">
          <div className="container">
            <dl className="trust-lines">
              <div>
                <dt>A family practising Ayurveda since 1908</dt>
                <dd>{LINEAGE_YEARS} years of practice in the same family.</dd>
              </div>
              <div>
                <dt>Kairali Ayurvedic Group, founded 1989</dt>
                <dd>
                  {GROUP_YEARS} years — founded by K.&nbsp;V.&nbsp;Ramesh and
                  Gita Ramesh, with the first Kairali Ayurvedic Centre in
                  South Delhi.
                </dd>
              </div>
              <div>
                <dt>Ayurvedic manufacturing in the family since 1948</dt>
                <dd>
                  Begun by Dr.&nbsp;K.S.&nbsp;Vasudevan — the line the WHO-GMP
                  Kairali range continues.
                </dd>
              </div>
              <div>
                <dt>NABH-accredited hospital</dt>
                <dd>Kairali — The Ayurvedic Healing Village, Palakkad, Kerala.</dd>
              </div>
              <div>
                <dt>WHO-GMP-certified manufacturing</dt>
                <dd>Kairali Ayurvedic Products — the range your counter carries.</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* ---------- CUSTOMERS' DOOR — authenticity as a service ---------- */}
        <section className="section verify" id="verify" aria-labelledby="verify-heading">
          <div className="container">
            <p className="overline">For Customers</p>
            <h2 id="verify-heading">Saw an Arogya Shala board? Check it in one message.</h2>
            <p className="measure">
              Every genuine Arogya Shala counter is authorised by Kairali. If
              you have seen the board at a shop near you — or a product that
              claims to be Kairali — we will confirm it, so you always know
              what you are buying is genuine.
            </p>
            <div className="cta-row">
              <a className="btn btn-primary" href={WHATSAPP_URL} data-cta="whatsapp_verify">
                <WhatsAppIcon />
                Verify a counter on WhatsApp
              </a>
              <a className="btn btn-secondary" href={`mailto:${EMAIL}?subject=Verify%20an%20Arogya%20Shala%20counter`} data-cta="email_verify">
                Verify by email
              </a>
            </div>
          </div>
        </section>

        {/* ---------- FAQ ---------- */}
        <section className="section faq" aria-labelledby="faq-heading">
          <div className="container">
            <p className="overline">Straight Answers</p>
            <h2 id="faq-heading">Before you ask</h2>
            <div className="faq-list">
              {FAQS.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
            {/* closing action — the page never ends further than one glance
                from an enquiry (critic it.2 carried polish) */}
            <div className="cta-row">
              <a className="btn btn-primary" href={WHATSAPP_URL} data-cta="whatsapp_closing">
                <WhatsAppIcon />
                Start the conversation
              </a>
              <a className="btn btn-secondary" href={`mailto:${EMAIL}?subject=Arogya%20Shala%20enquiry`} data-cta="email_closing">
                Write to {EMAIL}
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <p className="footer-title">Arogya Shala — a Kairali Ayurvedic Group programme</p>
          <p>
            <a href={`mailto:${EMAIL}`} data-cta="email_click">{EMAIL}</a> ·{" "}
            <a href={WHATSAPP_URL} data-cta="whatsapp_click">WhatsApp +91 92898 38797</a>
          </p>
          <nav className="footer-nav" aria-label="Kairali sites">
            <a href="https://www.kairali.com">Kairali Ayurvedic Group</a>
            <a href="https://www.kairaliproducts.in">Kairali Store (India)</a>
            <a href="https://www.ayurvedichealingvillage.com">The Ayurvedic Healing Village</a>
          </nav>
          {/* D-20260718-04: the shared fleet social set — handles live in
              packages/social/src/config.ts ONLY (one-file true-up) */}
          <SocialLinks className="footer-nav footer-social" />
          <nav className="footer-nav footer-legal" aria-label="Legal">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/cookie-policy">Cookies</a>
          </nav>
          <p className="footer-fine">
            © {new Date().getFullYear()} Kairali Ayurvedic Group · a family
            practising Ayurveda since 1908
          </p>
        </div>
      </footer>
    </>
  );
}
