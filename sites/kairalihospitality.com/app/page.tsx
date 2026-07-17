// kairalihospitality.com — the group's hospitality UMBRELLA (entity: group ·
// register E). Design: docs/design-research/kairalihospitality-2026-07-16.md
// (D-DESIGN-DIFF) — every device cites its brief line:
//   full-bleed photographic hero + two-line Kurale statement (§5.1, Singita/
//   Oetker/Habitas) · GOA · PALAKKAD · VYSOČINA place strip (§5.3, Lore
//   Group) · dual-audience intent fork (§5.4, COMO "I'm searching for") ·
//   three portrait 3:4 property panels in one viewport (§5.2, Singita/
//   Oetker) with dual Explore/Enquire CTAs (§5.10, COMO) · full-width 1908
//   lineage pull-quote (§5.6, Singita 100-year purpose) · honest counter
//   strip (§5.8, Design Hotels/Auberge) · asymmetric editorial pair (§5.9,
//   Aman/COMO) · "Develop with us" consultancy chapter (§5.7, Ennismore/
//   Lore/GOCO).
// "On the horizon" band (§5.5): OMITTED — zero announceable future
// properties exist (facts gate; the band ships only with Abilash-ruled
// name/year facts, never placeholders).
// Facts law (rule 6): properties + purpose = wiki/entities/
// kairali-hospitality.md (LOCKED). Svatá Kateřina name + region VERIFIED
// 16 Jul 2026 via two independent sources (katerinaresort.cz "part of the
// Kairali Ayurveda Group"; kairali.com/svata-katerina-prague-czech-
// republic.aspx; third-party corroboration) — see the build brief. RULED
// 17 Jul 2026 (Abilash): the label is "in cooperation with" — "joint
// venture" must NOT appear unless he later confirms the legal form
// (D-KH-JV-LABEL). No ownership claim is printed. Legacy "established
// 2008 subsidiary" fact NOT carried (unruled — QUESTIONS.md). Healing
// Village card = clinical register (data-register="clinical", guarded).
// Contacts: locked info@kairali.com + interim Priya WhatsApp (DECISIONS
// 2026-07-13 18:51 precedent).

import {
  graph,
  kairaliOrganization,
  webSite,
  breadcrumbList,
  localBusiness,
  serializeJsonLd,
} from "@kairali/schema";

const SITE = "https://kairalihospitality.com";
const EMAIL = "info@kairali.com";
const WHATSAPP_URL = "https://wa.me/919289838797";
const RAAG_URL = "https://villaraag.com";
const KTAHV_URL = "https://www.ayurvedichealingvillage.com";
const KATERINA_URL = "https://www.katerinaresort.cz/en";

// Rolling-number law: computed from the fixed origins, never typed.
const LINEAGE_YEARS = new Date().getFullYear() - 1908;
const GROUP_YEARS = new Date().getFullYear() - 1989;

const jsonLd = graph(
  kairaliOrganization({
    id: `${SITE}/#organization`,
    url: SITE,
    // Site icon (served by the app router from app/icon.png) + the group's
    // own live sites — locked destinations only, no third-party profiles
    // invented (rule 6).
    logo: `${SITE}/icon.png`,
    sameAs: [
      "https://www.kairali.com",
      "https://www.ayurvedichealingvillage.com",
      "https://villaraag.com",
    ],
  }),
  webSite({
    id: `${SITE}/#website`,
    name: "Kairali Hospitality",
    url: SITE,
    publisherId: `${SITE}/#organization`,
    inLanguage: "en",
  }),
  // The two Indian properties carry parentOrganization; the Czech JV is
  // deliberately NOT modelled as owned/parented — its legal form is an open
  // Abilash ruling (wiki), so no machine-readable ownership claim ships.
  localBusiness({
    id: `${SITE}/#villa-raag`,
    type: "LodgingBusiness",
    name: "Villa Raag",
    url: RAAG_URL,
    address: { addressLocality: "Agonda", addressRegion: "Goa", addressCountry: "IN" },
    parentId: `${SITE}/#organization`,
  }),
  localBusiness({
    id: `${SITE}/#healing-village-org`,
    type: "Hospital",
    name: "Kairali — The Ayurvedic Healing Village",
    url: KTAHV_URL,
    address: { addressLocality: "Palakkad", addressRegion: "Kerala", addressCountry: "IN" },
    parentId: `${SITE}/#organization`,
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

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      {/* ---------- Full-bleed photographic hero (§5.1) — first Factory
          surface where imagery touches the viewport edges ---------- */}
      <header className="hero">
        <img
          className="hero-photo"
          src="/images/hero-villa-raag-dusk.jpg"
          srcSet="/images/hero-villa-raag-dusk-800.jpg 800w, /images/hero-villa-raag-dusk-1200.jpg 1200w, /images/hero-villa-raag-dusk.jpg 1600w"
          sizes="100vw"
          alt="Twilight facade of Villa Raag in Agonda, Goa — a white villa with a columned portico, its glass doors lit warm from within, framed by coconut palms."
          width={1600}
          height={1067}
          fetchPriority="high"
        />
        <div className="hero-veil" aria-hidden="true" />
        <div className="hero-inner">
          <div className="hero-top container">
            <a className="wordmark" href="/" aria-label="Kairali Hospitality — home">
              <img src="/images/kairali-icon.svg" alt="" aria-hidden="true" width="40" height="28" />
              <span>Kairali Hospitality</span>
            </a>
            <a className="hero-enquire" href="#enquire" data-cta="header_enquire">
              Enquire
            </a>
          </div>
          <div className="hero-statement container">
            <p className="overline hero-overline">The Kairali Ayurvedic Group</p>
            <h1>
              <span>Places built to restore.</span>{" "}
              <span>A family practising Ayurveda for {LINEAGE_YEARS} years.</span>
            </h1>
            {/* Typographic place strip (§5.3, Lore Group AMS|LDN|NYC) */}
            <p className="place-strip" aria-label="Goa, Palakkad, Vysočina">
              GOA <span aria-hidden="true">·</span> PALAKKAD <span aria-hidden="true">·</span> VYSOČINA
            </p>
          </div>
        </div>
      </header>

      <main>
        {/* ---------- Intent fork (§5.4, COMO "I'm searching for…") — one
            white INDEX SLAB breaching the hero, three numbered segments
            split by bronze hairlines. Deliberately NOT the arogyashala.in
            door-card anatomy (design-qa it.1 similarity note): no per-card
            top border, no separate cards, no hover shadow-lift — a single
            registry bar with 01/02/03 index rows. ---------- */}
        <nav className="fork" aria-label="Choose your path">
          <a className="door" href="#properties" data-cta="door_stay">
            <span className="door-head">
              <span className="door-index" aria-hidden="true">01</span>
              <span className="door-kicker">Stay</span>
            </span>
            <span className="door-title">I want to stay at a Kairali property</span>
            <span className="door-hint">The three places &darr;</span>
          </a>
          <a className="door" href="#develop" data-cta="door_develop">
            <span className="door-head">
              <span className="door-index" aria-hidden="true">02</span>
              <span className="door-kicker">Develop with us</span>
            </span>
            <span className="door-title">I&rsquo;m building a wellness property</span>
            <span className="door-hint">Consultancy, from the group that runs its own &darr;</span>
          </a>
          {/* The hospital segment — clinical register (KTAHV lock) */}
          <a
            className="door"
            href={KTAHV_URL}
            data-cta="door_clinical"
            data-register="clinical"
          >
            <span className="door-head">
              <span className="door-index" aria-hidden="true">03</span>
              <span className="door-kicker">Treatment</span>
            </span>
            <span className="door-title">I&rsquo;m seeking Ayurvedic treatment</span>
            <span className="door-hint">
              Kairali &mdash; The Ayurvedic Healing Village, the group&rsquo;s
              NABH-accredited hospital &rarr;
            </span>
          </a>
        </nav>

        {/* ---------- Three portrait property panels, one viewport (§5.2) ---------- */}
        <section className="section properties" id="properties" aria-labelledby="properties-heading">
          <div className="container">
            <p className="overline">The Properties</p>
            <h2 id="properties-heading">Three places, two countries.</h2>
            <div className="panels">
              {/* Villa Raag — wellness-hospitality register. Portrait
                  derivative re-cropped from the library original so the
                  floral-mosaic plunge pool — the photograph's subject — sits
                  in the panel's clear zone (design review it.1, finding 2). */}
              <article className="panel">
                <img
                  src="/images/panel-villa-raag-pool.jpg"
                  srcSet="/images/panel-villa-raag-pool-560.jpg 560w, /images/panel-villa-raag-pool.jpg 800w"
                  sizes="(min-width: 980px) 347px, (min-width: 760px) 560px, calc(100vw - 40px)"
                  alt="An open-air plunge pool at Villa Raag with a floral mosaic floor and a mosaic-clad water feature, overlooking dense palm greenery."
                  width={800}
                  height={1067}
                  loading="lazy"
                />
                <div className="panel-veil" aria-hidden="true" />
                <div className="panel-copy">
                  <p className="panel-place">Agonda · Goa</p>
                  <h3>Villa Raag</h3>
                  <p className="panel-line">
                    The group&rsquo;s boutique wellness property, a villa in
                    the palms above Agonda.
                  </p>
                  <p className="panel-ctas">
                    <a href={RAAG_URL} data-cta="raag_explore">Explore villaraag.com &rarr;</a>
                    <a href={`mailto:${EMAIL}?subject=Villa%20Raag%20stay%20enquiry`} data-cta="raag_enquire">Enquire</a>
                  </p>
                </div>
              </article>

              {/* Healing Village — CLINICAL register card (KTAHV lock;
                  guarded by test/guards.test.js against the banned lexicon) */}
              <article className="panel" id="healing-village" data-register="clinical">
                <img
                  src="/images/panel-healing-village-cottage.jpg"
                  srcSet="/images/panel-healing-village-cottage-560.jpg 560w, /images/panel-healing-village-cottage.jpg 800w"
                  sizes="(min-width: 980px) 347px, (min-width: 760px) 560px, calc(100vw - 40px)"
                  alt="A stone-and-brick patient cottage with a tiled gabled roof among coconut palms at Kairali — The Ayurvedic Healing Village, Palakkad, a stone footpath crossing a garden water channel to its entrance."
                  width={800}
                  height={1067}
                  loading="lazy"
                />
                <div className="panel-veil" aria-hidden="true" />
                <div className="panel-copy">
                  <p className="panel-place">Palakkad · Kerala</p>
                  <h3>Kairali &mdash; The Ayurvedic Healing Village</h3>
                  <p className="panel-line">
                    The group&rsquo;s NABH-accredited hospital, open since
                    14 February 1999 &mdash; physician-led treatment
                    programmes.
                  </p>
                  <p className="panel-ctas">
                    <a href={KTAHV_URL} data-cta="ktahv_site">Hospital site &rarr;</a>
                    <a href={`mailto:${EMAIL}?subject=Healing%20Village%20treatment%20enquiry`} data-cta="ktahv_enquire">Treatment enquiry</a>
                  </p>
                </div>
              </article>

              {/* Svatá Kateřina — text-first (no rights-cleared photograph
                  in the library yet; IMAGE_MANIFEST.md GAP note). The quiet
                  rule-and-diamond colophon mark composes the dark field so
                  the panel reads deliberate, not like a failed image
                  (design review it.1, finding 4) — token-pure, currentColor. */}
              <article className="panel panel-dark">
                <div className="panel-motif" aria-hidden="true">
                  <svg width="120" height="24" viewBox="0 0 120 24" fill="none">
                    <line x1="0" y1="12" x2="46" y2="12" stroke="currentColor" strokeWidth="1" />
                    <rect x="55.5" y="7.5" width="9" height="9" transform="rotate(45 60 12)" stroke="currentColor" strokeWidth="1" />
                    <line x1="74" y1="12" x2="120" y2="12" stroke="currentColor" strokeWidth="1" />
                  </svg>
                </div>
                <div className="panel-copy panel-copy-static">
                  <p className="panel-place">Vysočina · Czech Republic</p>
                  <h3>Resort Svatá Kateřina</h3>
                  <p className="panel-line">
                    Ayurvedic programmes in the Bohemian-Moravian Highlands,
                    run in cooperation with the Kairali Ayurvedic Group in a
                    purpose-built Ayurvedic Pavilion.
                  </p>
                  <p className="panel-ctas">
                    <a href={KATERINA_URL} data-cta="katerina_explore">Explore katerinaresort.cz &rarr;</a>
                    <a href={`mailto:${EMAIL}?subject=Svata%20Katerina%20stay%20enquiry`} data-cta="katerina_enquire">Enquire</a>
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ---------- 1908 lineage pull-quote + honest counters (§5.6, §5.8) ---------- */}
        <section className="band-lineage" aria-label="The family behind the places">
          <div className="container">
            <blockquote>
              One family has practised Ayurveda since 1908, when
              Dr.&nbsp;Sankunny Vaidiar opened his first clinic in Palakkad
              &mdash; {LINEAGE_YEARS} years. The Kairali Ayurvedic Group,
              founded in 1989 by K.&nbsp;V.&nbsp;Ramesh and Gita Ramesh,
              carries that practice into its places.
            </blockquote>
            <dl className="counters">
              <div>
                <dt>3</dt>
                <dd>properties</dd>
              </div>
              <div>
                <dt>2</dt>
                <dd>countries</dd>
              </div>
              <div>
                <dt>{GROUP_YEARS}</dt>
                <dd>years of the Group</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* ---------- Consultancy chapter (§5.7) — our properties ARE the
            case studies; portfolio first, consultancy second (GOCO note) ---------- */}
        <section className="section develop" id="develop" aria-labelledby="develop-heading">
          <div className="container">
            <span className="accent-bar" aria-hidden="true" />
            <p className="overline">Consultancy</p>
            <h2 id="develop-heading">Develop with us.</h2>
            <p className="measure">
              Kairali helps people who are starting out &mdash; a first
              wellness property, an Ayurveda wing, a full campus. The group
              has done every part of this for itself: it runs an
              NABH-accredited Ayurvedic hospital in Palakkad and a boutique
              wellness property in Goa, it brings Ayurveda to the Czech
              Republic in cooperation with Resort Svatá Kateřina, and it
              manufactures its own WHO-GMP-certified Ayurvedic product range.
              That working knowledge is what we consult with.
            </p>

            <div className="services">
              <div className="service">
                <h3>Concept</h3>
                <p>
                  What to build and why: positioning, the treatment or
                  wellness programme your property should stand on, and the
                  plan that keeps the Ayurveda genuine.
                </p>
              </div>
              <div className="service">
                <h3>Build</h3>
                <p>
                  Therapy spaces done right: layouts, materials and equipment
                  for treatment rooms, kitchens and grounds &mdash; and the
                  physicians, therapists and products to fill them.
                </p>
              </div>
              <div className="service">
                <h3>Operate</h3>
                <p>
                  Running standards from the group&rsquo;s own properties:
                  daily practice, staff training, and supply from
                  Kairali&rsquo;s own manufacturing.
                </p>
              </div>
            </div>

            {/* Asymmetric editorial pair (§5.9, Aman/COMO) — real frames
                from the properties we run; captions describe the frame */}
            <figure className="proof-pair">
              <div className="proof-landscape">
                <img
                  src="/images/develop-raag-hall.jpg"
                  srcSet="/images/develop-raag-hall-560.jpg 560w, /images/develop-raag-hall.jpg 800w, /images/develop-raag-hall-1200.jpg 1200w"
                  sizes="(min-width: 980px) 609px, (min-width: 760px) 56vw, calc(100vw - 40px)"
                  alt="The dining hall at Villa Raag in the evening — a turquoise cascading glass chandelier over a long banquet table, beside a white-pebble indoor courtyard."
                  width={1200}
                  height={800}
                  loading="lazy"
                />
                <figcaption>The dining hall at Villa Raag, Agonda.</figcaption>
              </div>
              <div className="proof-portrait">
                <img
                  src="/images/develop-ktahv-morning.jpg"
                  srcSet="/images/develop-ktahv-morning-560.jpg 560w, /images/develop-ktahv-morning.jpg 800w, /images/develop-ktahv-morning-1200.jpg 1200w"
                  sizes="(min-width: 980px) 451px, (min-width: 760px) 41vw, calc(100vw - 40px)"
                  alt="A staff member crosses a lawn at the Palakkad campus at dawn, swinging a smoking clay incense burner through the morning light."
                  width={800}
                  height={1067}
                  loading="lazy"
                />
                <figcaption>Dawn on the Palakkad campus.</figcaption>
              </div>
            </figure>
            <p className="proof-line">
              The case studies are the properties above &mdash; the places the
              group runs every day.
            </p>

            <div className="cta-row">
              <a className="btn btn-primary" href={WHATSAPP_URL} data-cta="whatsapp_develop">
                <WhatsAppIcon />
                WhatsApp us about your project
              </a>
              <a className="btn btn-secondary" href={`mailto:${EMAIL}?subject=Develop%20with%20Kairali%20—%20consultancy%20enquiry`} data-cta="email_develop">
                Write to {EMAIL}
              </a>
            </div>
          </div>
        </section>

        {/* ---------- Closing enquiry band ---------- */}
        <section className="band-enquire" id="enquire" aria-labelledby="enquire-heading">
          <div className="container">
            <p className="overline">Enquiries</p>
            <h2 id="enquire-heading">Start the conversation.</h2>
            <p className="measure">
              A stay at one of the properties, a partnership, or a project of
              your own &mdash; one message reaches the group.
            </p>
            <div className="cta-row">
              <a className="btn btn-primary" href={WHATSAPP_URL} data-cta="whatsapp_closing">
                <WhatsAppIcon />
                WhatsApp +91 92898 38797
              </a>
              <a className="btn btn-secondary" href={`mailto:${EMAIL}?subject=Kairali%20Hospitality%20enquiry`} data-cta="email_closing">
                Write to {EMAIL}
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <p className="footer-title">Kairali Hospitality &mdash; the Kairali Ayurvedic Group&rsquo;s properties</p>
          <p>
            <a href={`mailto:${EMAIL}`} data-cta="email_click">{EMAIL}</a> ·{" "}
            <a href={WHATSAPP_URL} data-cta="whatsapp_click">WhatsApp +91 92898 38797</a>
          </p>
          <nav className="footer-nav" aria-label="The properties">
            <a href={RAAG_URL}>Villa Raag</a>
            <a href={KTAHV_URL}>Kairali &mdash; The Ayurvedic Healing Village</a>
            <a href={KATERINA_URL}>Resort Svatá Kateřina</a>
          </nav>
          <nav className="footer-nav" aria-label="Kairali sites">
            <a href="https://www.kairali.com">Kairali Ayurvedic Group</a>
            <a href="https://www.kairaliproducts.in">Kairali Store (India)</a>
          </nav>
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
