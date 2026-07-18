// kairaliequipment.com — GOLDEN PAGE (homepage) · "The Foundry Ledger"
// Implements the pass-6 approved MODE B hero mockup
// (launches/kairaliequipment.com/design-direction/hero-mockup.html) faithfully.
//
// Content laws in force:
//  · D-EQ-CATALOG — placeholder grammar on SKU/price lines ONLY, unmistakable
//    but subordinate ("SKU-PLACEHOLDER-0NN · ₹X,XXX / $X,XXX"). PREVIEW-ONLY:
//    scripts/placeholder-lint.mjs blocks go-live while any placeholder exists.
//  · D-EQ-CLAIMS — live-site cert/export/manufacturing/heritage claims carried
//    as-is (owner trust basis). No medical-claim language anywhere.
//  · FLAG-3 / D-LIN-1989-WORDING — "Founded in 1989" is the group founding;
//    1908 is FAMILY LINEAGE only ("A family practising Ayurveda since 1908").
//  · WhatsApp count law (pass4-fixed-rulings §1) — EXACTLY TWICE: hero + sticky
//    mobile bar (chrome.tsx). Header/footer carry none.
//  · Imagery law — the 7 mined legacy photographs are the only interim real
//    imagery (image-library/legacy-kairaliequipment manifest.tsv); honestly
//    captioned; no stock, no AI imagery, no fabricated photography.
//  · Structure follows the Educational 4-Phase (docs/marketing/go-science/):
//    real problem → permanent solution → proof (credentials, honest) → the
//    installation (RFQ; price only at quote stage — never on the page).
import Image from "next/image";
import { EnquiryForm } from "@kairali/forms/form";
import {
  graph,
  kairaliOrganization,
  organization,
  webSite,
  breadcrumbList,
  serializeJsonLd,
} from "@kairali/schema";
import { EMAIL, WHATSAPP_URL, SOCIALS, WhatsAppGlyph } from "./_components/chrome";

const SITE = "https://kairaliequipment.com";

// href = the category ROUTE slug (differs from the short chip id for
// shirodhara-stand / steam-box — the ids also name data-cta events + anchors).
const CHIPS = [
  { id: "pathi", href: "/equipment/pathi", name: "Pathi / Droni", spec: "8.5 × 3 ft · 2591 × 914 mm" },
  { id: "shirodhara", href: "/equipment/shirodhara-stand", name: "Shirodhara stands", spec: "with brass pots" },
  { id: "steam", href: "/equipment/steam-box", name: "Steam boxes", spec: "teak · steel tank" },
  { id: "urlis", href: "/equipment/urlis", name: "Urlis", spec: "brass & bell metal" },
  { id: "accessories", href: "/equipment/accessories", name: "Accessories", spec: "pots · sets · steps" },
];

const TRUST: Array<{ t: string; s: string; href?: string }> = [
  { t: "Own manufacturing", s: "Facility · QC · R&D", href: "/manufacturing" },
  { t: "Certifications & awards", s: "Carried from record", href: "/certifications" },
  { t: "Worldwide alliances", s: "Distributor network", href: "/trade" },
  { t: "One family group", s: "Incl. the NABH-accredited Healing Village", href: "/about" },
];

// Category-level copy is REAL (verbatim-mined specs — INV §4 / STRATEGY §1);
// everything below category level is an owner-ordered placeholder.
const LINES: Array<{
  id: string;
  name: string;
  gloss: string;
  copy: string;
  img: { src: string; alt: string; caption: string };
  specs: Array<[string, string]>;
  sku: string;
}> = [
  {
    id: "pathi",
    name: "Pathi — Wooden Massage Bed",
    gloss: "Droni · Dharapathi",
    copy:
      "The traditional Panchakarma table in medicated wood with brass work, on a stand with steel support — the spec carried unchanged from our legacy catalogue.",
    img: {
      src: "/images/wooden-massage-bed.jpg",
      alt: "Pathi wooden massage bed in medicated wood with brass fittings",
      caption: "From the legacy catalogue — commissioned shoot pending.",
    },
    specs: [
      ["Dimensions", "8.5 × 3 ft (2591 × 914 mm)"],
      ["Slab thickness", "3 in (76 mm)"],
      ["Material", "Medicated wood · brass work"],
    ],
    sku: "SKU-PLACEHOLDER-001",
  },
  {
    id: "shirodhara",
    name: "Shirodhara Stand",
    gloss: "Dhara stand · brass pot",
    copy:
      "Chain-hung brass Shirodhara pot on its stand — the continuous-stream apparatus of the classical dhara treatments.",
    img: {
      src: "/images/shirodhara-stand.jpg",
      alt: "Brass Shirodhara stand arm with hanging chains and wooden holders",
      caption: "From the legacy catalogue — commissioned shoot pending.",
    },
    specs: [
      ["Pot", "Brass, chain-hung"],
      ["Height & flow set", "— awaiting catalog —"],
    ],
    sku: "SKU-PLACEHOLDER-002",
  },
  {
    id: "steam",
    name: "Steam Box",
    gloss: "Swedana chamber",
    copy:
      "The upright steam chamber for swedana — teak body with a steel steam tank, built for daily treatment-room duty.",
    img: {
      src: "/images/steam-bath.jpg",
      alt: "Upright wooden steam bath chamber with brass-trimmed panels",
      caption: "From the legacy catalogue — commissioned shoot pending.",
    },
    specs: [
      ["Material", "Teak · steel tank"],
      ["Chamber size", "— awaiting catalog —"],
    ],
    sku: "SKU-PLACEHOLDER-003",
  },
  {
    id: "urlis",
    name: "Urlis — Treatment Vessels",
    gloss: "Uruli · brass & bell metal",
    copy:
      "Brass and bell-metal vessels for oils, choornams and treatment preparations — cast the way temple kitchens cast them.",
    img: {
      src: "/images/ayurvedic-spa-equipments-oil.jpg",
      alt: "Brass vessels holding medicated oil and herbal powders",
      caption: "From the legacy catalogue — commissioned shoot pending.",
    },
    specs: [
      ["Material", "Brass · bell metal"],
      ["Sizes", "— awaiting catalog —"],
    ],
    sku: "SKU-PLACEHOLDER-004",
  },
  {
    id: "accessories",
    name: "Accessories",
    gloss: "Pots · sets · steps",
    copy:
      "The named accessory line from the legacy catalogue: Shirodhara pot, Shirodhara equipment set, and the Droni step.",
    img: {
      src: "/images/droni-step.jpg",
      alt: "Three-tier wooden Droni step with brass scrollwork frame",
      caption: "From the legacy catalogue — commissioned shoot pending.",
    },
    specs: [
      ["Named items", "Shirodhara pot · set · Droni step"],
      ["Further items", "— awaiting catalog —"],
    ],
    sku: "SKU-PLACEHOLDER-005",
  },
];

// Per-lane SPECIFIC next steps (beauty B18): each lane names its own action
// and links its own page; nothing promises an artifact that does not exist
// (HARD GATE 6 — no "distributor pack" until one does).
const LANES = [
  {
    id: "contract-manufacturing",
    name: "Contract manufacturing",
    copy: "OEM builds on our own factory floor — your specification, our craft.",
    cta: "Start an OEM enquiry",
  },
  {
    id: "hotel-resort-spa-supply",
    name: "Hotels, resorts & spas",
    copy: "Equipment for wellness properties, from a group that runs its own.",
    cta: "Discuss a property fit-out",
  },
  {
    id: "spa-consultancy",
    name: "Spa-setup consultancy",
    copy: "Equip a new centre end-to-end — planning, equipment, and know-how.",
    cta: "Plan a new centre",
  },
  {
    id: "distributors-importers",
    name: "Distributors & importers",
    copy: "Join the worldwide alliance network carried from our export record.",
    cta: "Start a distributor enquiry",
  },
];

const jsonLd = graph(
  kairaliOrganization({
    id: "https://www.kairali.com/#organization",
    sameAs: SOCIALS.map((s) => s.href),
  }),
  organization({
    id: `${SITE}/#organization`,
    name: "Kairali Equipment",
    url: SITE,
    email: EMAIL,
    description:
      "The Ayurveda-equipment manufacturing division of the Kairali Ayurvedic Group: Pathi (Droni) massage beds, Shirodhara stands, steam boxes, urlis and treatment accessories, made in the group's own facility and supplied to hospitals, resorts and spas.",
    parentId: "https://www.kairali.com/#organization",
  }),
  webSite({
    id: `${SITE}/#website`,
    name: "Kairali Equipment",
    url: SITE,
    publisherId: `${SITE}/#organization`,
    inLanguage: "en",
  }),
  breadcrumbList({ id: `${SITE}/#breadcrumb`, items: [{ name: "Home", url: SITE }] }),
);

/** Dimensioned technical drawing — the REAL mined 8.5 ft × 3 ft / 3 in spec as
 *  engineering linework (pass-3 ruling: the honest interim hero asset; dual
 *  units per pass-4 fixables). Colors via CSS classes — tokens only. */
function PathiDrawing() {
  return (
    <svg
      viewBox="0 0 440 236"
      role="img"
      aria-label="Dimensioned side elevation of the Pathi wooden massage bed: 8 feet 6 inches long (2591 millimetres), slab 3 inches (76 millimetres) thick, on stand"
    >
      <g className="ln-ink" strokeWidth="2" fill="none" strokeLinecap="round">
        <path d="M62 84 Q66 70 78 72 L362 72 Q374 70 378 84 L378 96 L62 96 Z" />
        <path d="M84 96 L84 172 M100 96 L100 172 M340 96 L340 172 M356 96 L356 172" />
        <path d="M76 172 L108 172 M332 172 L364 172" />
        <path d="M100 128 L340 128" />
      </g>
      <g className="ln-bronze" strokeWidth="1" fill="none">
        <path d="M62 104 L62 206 M378 104 L378 206" />
        <path d="M62 200 L378 200" />
        <path className="fl-bronze" d="M62 200 l7 -3 v6 z M378 200 l-7 -3 v6 z" />
        <path d="M386 72 L410 72 M386 96 L410 96" />
        <path d="M404 72 L404 96" />
        <path className="fl-bronze" d="M404 72 l-3 7 h6 z M404 96 l-3 -7 h6 z" />
      </g>
      <g className="tx-ink">
        <text x="220" y="192" fontSize="13" fontWeight="700" textAnchor="middle">8 ft 6 in · 2591 mm</text>
        <text x="414" y="82" fontSize="10" fontWeight="700">3 in</text>
        <text x="414" y="93" fontSize="8.5">76 mm</text>
        <text className="tx-bronze" x="220" y="52" fontSize="9" textAnchor="middle" letterSpacing="1">MEDICATED WOOD · BRASS WORK · STAND + STEEL SUPPORT</text>
      </g>
      <g className="tx-bronze">
        <text x="62" y="228" fontSize="8.5" letterSpacing="1">PATHI / DRONI — SIDE ELEVATION · PLAN WIDTH 3 FT · NOT TO SCALE</text>
      </g>
    </svg>
  );
}

function PdfGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <main id="top">
        {/* ── The forge hero — forest-700 dark ground ─────────────────────── */}
        <section className="hero">
          <div className="container">
            <div>
              <p className="overline">Manufacturer · Exporter · Four Generations of Ayurveda</p>
              <h1>The equipment beneath the <em>treatment</em>.</h1>
              <p className="lede">
                Pathi massage beds in medicated wood, Shirodhara stands, teak steam
                chambers, bell-metal urlis and the treatment-room accessories —
                built in our own facility by the Kairali Ayurvedic Group, the
                family group behind the NABH-accredited Kairali — The Ayurvedic
                Healing Village, and supplied to hospitals, resorts and spas
                across our export markets.
              </p>
              <div className="cta-row">
                <a className="btn btn-primary" href="#request-a-quote" data-cta="quote-open">Request a Quote</a>
                <a className="btn btn-wa" href={WHATSAPP_URL} data-cta="whatsapp-click">
                  <WhatsAppGlyph />
                  WhatsApp us
                </a>
                <a className="btn btn-pdf" href="/catalogue-placeholder.pdf" data-cta="catalogue-download">
                  <PdfGlyph />
                  Catalogue (PDF)
                </a>
              </div>
              <p className="email-line">
                Prefer email? Write to <a href={`mailto:${EMAIL}`} data-cta="email-click">{EMAIL}</a> —
                specs and dimensions for all five lines are in the catalogue.
              </p>
              <ul className="chips" aria-label="equipment lines">
                {CHIPS.map((c) => (
                  <li key={c.id} style={{ display: "contents" }}>
                    <a className="chip" href={c.href} data-cta={`category-${c.id}`}>
                      <b>{c.name}</b>
                      <span>{c.spec}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <div className="ledger" aria-label="heritage ledger">
                <div><b>1908</b><span>Family lineage</span></div>
                <div><b>1989</b><span>Group founded</span></div>
                <div><b>In-house</b><span>Manufacturing</span></div>
                <div><b>Worldwide</b><span>Export &amp; alliances</span></div>
              </div>
              <ul className="badges" aria-label="group credentials">
                <li className="badge"><b>NABH</b> Accredited AYUSH hospital — group (AH-2024-0250)</li>
                <li className="badge"><b>GREEN LEAF</b> Govt. of Kerala — group</li>
              </ul>
            </div>

            {/* Specimen sheet — dimensioned technical drawing of the real spec */}
            <aside className="product-card" aria-label="specimen sheet — sample catalog card">
              <div className="sheet-head">
                <span>Specimen sheet · Pathi line</span>
                <span className="sheet-note">Spec from legacy catalogue — interim drawing</span>
              </div>
              <div className="drawing">
                <PathiDrawing />
              </div>
              <div className="card-body">
                <h3>Pathi — Wooden Massage Bed (Droni)</h3>
                <table className="spec-table">
                  <tbody>
                    <tr><td>Dimensions</td><td>8.5 × 3 ft (2591 × 914 mm)</td></tr>
                    <tr><td>Slab thickness</td><td>3 in (76 mm)</td></tr>
                    <tr><td>Material</td><td>Medicated wood · brass work</td></tr>
                  </tbody>
                </table>
                <div className="ph-meta">
                  <span className="ph-tag">PLACEHOLDER</span>
                  SKU-PLACEHOLDER-001 · ₹X,XXX / $X,XXX — until the real catalogue lands
                </div>
                <div className="thumb-row">
                  <Image src="/images/wooden-massage-bed.jpg" alt="Legacy catalogue photograph of the Pathi wooden massage bed" width={86} height={72} />
                  <p>
                    Legacy catalogue photograph, for reference — a commissioned studio
                    shoot of all five lines is a flagged build dependency (real
                    photography, never stock).
                  </p>
                </div>
                <a className="btn btn-primary card-cta" href="#request-a-quote" data-cta="quote-open-pathi">
                  Request a Quote — Pathi line
                </a>
              </div>
            </aside>
          </div>
        </section>

        {/* ── Trust strip — D-EQ-CLAIMS levers, as-is ─────────────────────── */}
        <section className="trust" aria-label="why institutions buy from Kairali">
          <div className="container">
            {TRUST.map((t) =>
              t.href ? (
                <a className="item" href={t.href} key={t.t} data-cta={`trust-${t.href.slice(1)}`}>
                  <i aria-hidden="true" />
                  <div>{t.t}<span>{t.s}</span></div>
                </a>
              ) : (
                <div className="item" key={t.t}>
                  <i aria-hidden="true" />
                  <div>{t.t}<span>{t.s}</span></div>
                </div>
              ),
            )}
          </div>
        </section>

        {/* ── The five equipment lines (real mined category copy) ─────────── */}
        <section className="section container" id="equipment">
          <div className="section-head">
            <p className="overline">The catalogue · five lines</p>
            <h2>Equipment for the treatment room, from a family practising Ayurveda since 1908</h2>
            <p className="sub">
              Every line below is the real category from our legacy catalogue —
              dimensions and materials as mined from the record. Model-level SKUs
              and prices are owner-ordered placeholders until the full catalogue
              lands; every project is quoted, not carted.
            </p>
            {/* Beauty B4 (restraint): ONE photography disclaimer for the whole
                grid, replacing five identical per-card captions. */}
            <p className="grid-note">
              Photography: from the legacy catalogue — a commissioned studio shoot
              of all five lines is a flagged dependency. No stock, no AI imagery.
            </p>
          </div>
          <div className="line-grid">
            {LINES.map((l) => (
              <article className="line-card" key={l.id} id={`line-${l.id}`}>
                <figure>
                  <Image src={l.img.src} alt={l.img.alt} width={520} height={390} sizes="(min-width: 1000px) 33vw, (min-width: 640px) 50vw, 100vw" />
                </figure>
                <div className="lc-body">
                  <h3>{l.name}</h3>
                  <p className="lc-gloss">{l.gloss}</p>
                  <p>{l.copy}</p>
                  <table className="spec-table">
                    <tbody>
                      {l.specs.map(([k, v]) => (
                        <tr key={k}><td>{k}</td><td>{v}</td></tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="ph-meta">
                    <span className="ph-tag">PLACEHOLDER</span>
                    {l.sku} · ₹X,XXX / $X,XXX
                  </div>
                  <a className="btn btn-primary lc-cta" href="#request-a-quote" data-cta={`quote-open-${l.id}`}>
                    Request a quote — {CHIPS.find((c) => c.id === l.id)?.name}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── Manufacturing & heritage — claims as-is, lineage per FLAG-3 ─── */}
        <section className="made" id="manufacturing">
          <div className="container">
            <div id="about">
              <p className="overline">Manufacturing &amp; heritage</p>
              <h2>Made in our own facility, by the family group behind the Healing Village</h2>
              <p>
                Kairali Equipment is the manufacturing arm of the Kairali Ayurvedic
                Group — founded in 1989, a family practising Ayurveda since 1908,
                four generations deep. The same family group runs the NABH-accredited
                Kairali — The Ayurvedic Healing Village.
                {/* pass4-fixed-rulings §6: affiliation claim ONLY — the
                    equipment-identity equivalence ("the equipment we ship is the
                    equipment our own physicians and therapists work on every day")
                    is owner-banned and guard-tested (test/guards.test.js). */}
              </p>
              <p>
                Our own factory, our own quality control, our own R&amp;D and the
                group&rsquo;s green commitment — carried from the record, not written
                for this page. Certifications and awards are listed at the
                granularity the record supports, scoped &ldquo;— group&rdquo; where
                they belong to the group.
              </p>
              {/* Beauty B4 (restraint): the heritage ledger renders ONCE, in the
                  hero — the duplicate that sat here was removed; the same facts
                  live in the prose above. */}
              <p className="made-more">
                The full story is on <a href="/about">the About page</a>; the
                factory, materials and QC on <a href="/manufacturing">Manufacturing</a>.
              </p>
            </div>
            <div className="made-figs">
              <figure>
                <Image src="/images/shirodhara-pot.jpg" alt="Chain-hung brass Shirodhara pot" width={480} height={400} sizes="(min-width: 1000px) 20vw, 50vw" />
                <figcaption>Brass Shirodhara pot — legacy catalogue.</figcaption>
              </figure>
              <figure>
                <Image src="/images/shirodhara-equipment-set.jpg" alt="Brass Shirodhara equipment set of pots and bowls" width={520} height={340} sizes="(min-width: 1000px) 20vw, 50vw" />
                <figcaption>Shirodhara equipment set — legacy catalogue.</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* ── Trade & export lanes ─────────────────────────────────────────── */}
        <section className="section container" id="trade">
          <div className="section-head">
            <p className="overline">Trade &amp; export</p>
            <h2>Four ways institutions work with us</h2>
            <p className="sub">
              Worldwide export and alliance relationships are carried from the
              group&rsquo;s record. Every lane starts the same way: tell us about
              the project, and the sales team quotes it.
            </p>
          </div>
          <div className="lane-grid">
            {LANES.map((l) => (
              <a className="lane-card" key={l.id} href={`/trade/${l.id}`} data-cta="trade-lane-click">
                <h3>{l.name}</h3>
                <p>{l.copy}</p>
                <span className="go">{l.cta} &rarr;</span>
              </a>
            ))}
          </div>
          <p className="lane-after">
            Every lane ends the same way: your enquiry reaches the sales team at{" "}
            {EMAIL}, and the reply comes back with specifications, dimensions and
            a quote — nothing to pay, nothing to commit.
          </p>
        </section>

        {/* ── Commercial terms — beauty B18: the must-answer B2B items, answered
            or explicitly deferred to their named pages; no invented figures
            (HARD GATE 6). ─────────────────────────────────────────────────── */}
        <section className="section container terms" aria-label="commercial terms">
          <div className="section-head">
            <p className="overline">Commercial terms</p>
            <h2>What we share at quote stage</h2>
          </div>
          <div className="terms-grid">
            <div className="terms-card">
              <h3>MOQs &amp; lead times</h3>
              <p>
                Shared at quote stage for your exact configuration — never
                published as blanket figures. The process is on the{" "}
                <a href="/faq">procurement FAQ</a>.
              </p>
            </div>
            <div className="terms-card">
              <h3>Territories &amp; margins</h3>
              <p>
                Discussed one-to-one with the distributor team — including which
                lines move in your market; no ranking is published.{" "}
                <a href="/trade/distributors-importers">Start a distributor enquiry</a>.
              </p>
            </div>
            <div className="terms-card">
              <h3>Packaging, localisation &amp; support</h3>
              <p>
                Export packing, labelling and partner support are scoped per
                order — the group&rsquo;s record carries product and equipment
                support for its alliances. Capability on{" "}
                <a href="/manufacturing">Manufacturing</a>.
              </p>
            </div>
            <div className="terms-card">
              <h3>Certifications &amp; documents</h3>
              <p>
                The group&rsquo;s certifications and awards are listed at record
                granularity on <a href="/certifications">Certifications</a>.
              </p>
            </div>
          </div>
        </section>

        {/* ── RFQ — the money section (Phase 4: the installation) ─────────── */}
        <section className="rfq" id="request-a-quote">
          <div className="container rfq-grid">
            <div>
              <p className="overline">Request a quote</p>
              <h2>Tell us what you are equipping</h2>
              <p className="sub" style={{ margin: "12px 0 0" }}>
                A hospital wing, a resort spa, a new centre, a container order —
                describe the project and the team will come back with
                specifications, dimensions and a quote.
              </p>
              <p className="after-note">
                <strong>What happens next:</strong> your enquiry reaches the sales
                team at {EMAIL}. Prices, lead times and export terms are shared at
                quote stage — nothing is published or invented on this site. No
                obligation attaches to a quote.
              </p>
              <p className="rfq-email">
                Prefer your own mail client? <a href={`mailto:${EMAIL}`} data-cta="email-click">Write to {EMAIL}</a>
              </p>
            </div>
            <EnquiryForm
              site="kairaliequipment.com"
              formType="rfq"
              privacyHref="/privacy"
              subject="Equipment RFQ — kairaliequipment.com"
              heading="Request a quote"
              submitLabel="Request a quote"
              submitCta="quote-request-submit"
            />
          </div>
        </section>
      </main>
    </>
  );
}
