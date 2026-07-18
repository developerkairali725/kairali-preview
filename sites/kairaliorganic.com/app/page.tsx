// kairaliorganic.com GOLDEN PAGE — the Kairali Organics brand home
// ("The Apothecary Ledger", launches/kairaliorganic.com/DESIGN_DIRECTION.md,
// built faithful to the pass-2 hero-mockup.svg).
//
// COPY LAW (every line has a mined or ruled basis — HARD GATE 6):
// · "100% chemical-free" — owner ruling D3 + the live site's own About copy
//   ("made from natural ingredients and are 100% chemical-free"), carried
//   with the ASCI/green-claims pairing: an explicit ingredient-transparency +
//   no-certification statement in the philosophy band. NEVER "certified".
// · HERO FIX (pass-2 Perplexity blocker): the draft absolute "Nothing that
//   isn't from the earth" is REPLACED by the mined, non-absolute
//   "Made from natural ingredients" (live About copy, verbatim basis).
// · The nine + descriptors — mined VERBATIM from the live Organics page
//   (docs/kappl-inputs/kair-pair-brand-mining.md §3a). Kairtis is NOT listed
//   (unruled, BRIEF open-Q1). KAIR products never appear here (D3); the one
//   crossing is the labelled sister-range block.
// · Heritage — ONLY the lineage doc's approved constructions: Group founded
//   1989 (K. V. Ramesh + Gita Ramesh); family practising Ayurveda since 1908;
//   KAPPL incorporated 2007, manufacturing in the family since 1948. The
//   legacy "since its inception in 1908" / "100-year" forms are retired and
//   guarded against in test/guards.test.js.
// · KTAHV awards carousel from the legacy page: DROPPED (register mismatch —
//   hospitality awards never decorate a KAPPL product shell; BRIEF open-Q2).
// · Where-to-buy: the two owned Shopify stores get links + events; BigBasket/
//   Flipkart/Amazon are NAMED without links — the legacy page's marketplace
//   links are a hidden dropdown pointing at a 2016 tea listing and a bare
//   search URL (mined 18 Jul 2026), and inventing brand-store URLs is banned
//   (rule 6). Canonical marketplace storefront URLs = owner question.
// · Contacts: locked info@kairali.com; interim Priya WhatsApp (standing rule).
// · Socials: the VERIFIED interim set (D-SOCIALS-INTERIM, 18 Jul 2026 —
//   HTTP-checked profiles). Swap to @kairali/social <SocialLinks/> the moment
//   the fleet-socials PR (no. 139) lands — a one-import change, noted in the
//   PR body. (Written "no. 139" here because "#"+digits reads as a hex color
//   to brand-lint's rogue-hex rule.)
// GO-SCIENCE (D-20260718-20): section order follows the Educational 4-Phase —
// hero states the promise (MCB: secret desire "genuinely chemical-free
// Ayurvedic care" without the label-scrutiny anxiety), the formulary presents
// the nine (Phase 2), the philosophy band strips the "is it really
// chemical-free / is it certified?" objections (Phase 1+2 + objection strip),
// manufacturing heritage carries proof (Phase 3), where-to-buy + enquiry are
// the low-pressure installation/hand-raise (Phase 4; prices NEVER on this
// shell — they live at the stores). Evidence:
// launches/kairaliorganic.com/go-science/2026-07-18-selfcheck.md

import {
  graph,
  kairaliOrganization,
  organization,
  webSite,
  breadcrumbList,
  serializeJsonLd,
} from "@kairali/schema";

const SITE = "https://kairaliorganic.com";
const EMAIL = "info@kairali.com";
const WHATSAPP_URL = "https://wa.me/919289838797";
const STORE_IN = "https://www.kairaliproducts.in";
const STORE_COM = "https://www.kairaliproducts.com";
const KAIR_URL = "https://www.kairbykairali.com";
const GROUP_URL = "https://www.kairali.com";

// The nine, in the approved mockup's ledger order, descriptors mined verbatim
// (live Organics page §3a). Slugs are the STRATEGY's reserved /products/ slugs;
// on the golden page they anchor to the formulary rows below.
const THE_NINE = [
  { slug: "kaircin", name: "Kaircin", category: "Ayurvedic Facial Oil", benefit: "for Youthful Radiant Skin" },
  { slug: "kairoil", name: "Kairoil", category: "Ayurvedic Hair Oil", benefit: "for Health & Lustre" },
  { slug: "kairbal", name: "Kairbal", category: "Ayurvedic Body Cleansing Powder", benefit: "for Beautiful Glowing Skin" },
  { slug: "kairpack", name: "Kairpack", category: "Ayurvedic Face Pack", benefit: "for Supple & Radiant Skin" },
  { slug: "kairwash", name: "Kairwash", category: "Ayurvedic Hair Cleansing Powder", benefit: "for Healthy & Shiny Tresses" },
  { slug: "kairheal", name: "Kairheal", category: "Ayurvedic Body Oil", benefit: "for Fractures & Sprains" },
  { slug: "kairkare", name: "Kairkare", category: "Ayurvedic Body Oil", benefit: "for Detoxifying & Destressing" },
  { slug: "kairkare-plus", name: "Kairkare Plus", category: "Ayurvedic Body Oil", benefit: "for Muscular Aches & Pains" },
  { slug: "kairbossom", name: "Kairbossom", category: "Ayurvedic Body Oil", benefit: "for Beautiful Bosom" },
];

// Verified interim social set (D-SOCIALS-INTERIM, 18 Jul 2026) — every URL
// HTTP-checked to a live matching profile before shipping. ONE list, reused
// for the footer AND Organization sameAs so the two can never drift.
const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/kairaliayurvedichealingvillage" },
  { label: "YouTube", href: "https://www.youtube.com/@kairaliayurvedagroup" },
  { label: "Facebook", href: "https://www.facebook.com/KairaliGroup" },
  { label: "X (Twitter)", href: "https://x.com/KairaliGroup" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/kairali-ayurvedic-group" },
  { label: "Pinterest", href: "https://in.pinterest.com/kairalihealing" },
];

const jsonLd = graph(
  kairaliOrganization({
    id: `${SITE}/#group`,
    logo: `${SITE}/icon.png`,
    sameAs: [GROUP_URL, ...SOCIALS.map((s) => s.href)],
  }),
  organization({
    id: `${SITE}/#organization`,
    name: "Kairali Organics",
    url: SITE,
    email: EMAIL,
    logo: `${SITE}/icon.png`,
    description:
      "The Kairali Ayurvedic Group's proprietary Organics range — nine 100% chemical-free Ayurvedic formulations made from natural ingredients.",
    parentId: `${SITE}/#group`,
  }),
  webSite({
    id: `${SITE}/#website`,
    name: "Kairali Organics",
    url: SITE,
    publisherId: `${SITE}/#organization`,
    inLanguage: "en",
  }),
  breadcrumbList({ id: `${SITE}/#breadcrumb`, items: [{ name: "Home", url: SITE }] }),
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

      {/* ---------- Letterhead nav (mockup: strengthened pass-2 lockup) ---------- */}
      <header className="topnav">
        <div className="container topnav-inner">
          <a className="lockup" href="/" aria-label="Kairali Organics — home">
            <span className="lockup-name">
              KAIRALI <em>ORGANICS</em>
            </span>
            <span className="lockup-rule" aria-hidden="true" />
            <span className="lockup-desc">The proprietary formulary of the Kairali Ayurvedic Group</span>
          </a>
          <nav className="topnav-links" aria-label="Page sections">
            <a href="#the-nine">The Nine</a>
            <a href="#philosophy">Philosophy</a>
            <a href="#where-to-buy">Where to Buy</a>
            <a href="#manufacturing">About</a>
          </nav>
          <a className="nav-enquire" href="#enquire" data-cta="header-enquire">
            Enquire
          </a>
        </div>
      </header>

      {/* ---------- Hero: asymmetric editorial split (mockup-faithful) ---------- */}
      <main>
        <section className="hero" aria-label="Kairali Organics">
          <div className="hero-panel surface-dark">
            <div className="hero-panel-inner">
              <p className="overline">100% Chemical-Free · By Formulation</p>
              <h1>Nine formulations. Made from natural ingredients.</h1>
              <p className="hero-sub">
                The Kairali Organics proprietary range &mdash; Ayurvedic
                formulations in compliance with the doshas.
              </p>
              <p>
                <a className="hero-proof" href="#philosophy">
                  What chemical-free means here &darr;
                </a>
              </p>
              <div className="cta-row">
                <a className="btn btn-hero-primary" href="#the-nine" data-cta="hero-primary">
                  Meet the Nine
                </a>
                <a className="btn btn-hero-ghost" href="#where-to-buy" data-cta="hero-where-to-buy">
                  Where to buy
                </a>
              </div>
            </div>
          </div>
          <div className="hero-still">
            <figure className="hero-frame" style={{ margin: 0 }}>
              <img
                src="/images/hero-organic-range.jpg"
                srcSet="/images/hero-organic-range-800.jpg 800w, /images/hero-organic-range-1200.jpg 1200w, /images/hero-organic-range.jpg 1600w"
                sizes="(min-width: 900px) 52vw, calc(100vw - 40px)"
                alt="The Kairali Organics range — ivory apothecary cartons with bronze botanical engravings, standing in two rows among pink orchid blossoms, photographed against soft garden greenery."
                width={1600}
                height={1067}
                fetchPriority="high"
              />
              <figcaption>
                The proprietary Organics range, from the group&rsquo;s own photography &mdash; natural warm.
              </figcaption>
            </figure>
          </div>
        </section>

        {/* ---------- The ledger strip: the site's signature motif ---------- */}
        <nav className="ledger" aria-label="The nine formulations">
          <div className="ledger-inner">
            {THE_NINE.map((p, i) => (
              <a key={p.slug} href={`#${p.slug}`}>
                <span className="ledger-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="ledger-name">{p.name}</span>
              </a>
            ))}
          </div>
        </nav>

        {/* ---------- The formulary: nine numbered ledger rows (Phase 2) ---------- */}
        <section className="section" id="the-nine" aria-labelledby="nine-heading">
          <div className="container">
            <p className="overline">The Formulary</p>
            <h2 id="nine-heading">The nine, as a ledger.</h2>
            <p className="measure">
              Kairali Organics is the Kairali Ayurvedic Group&rsquo;s chemical-free
              line: nine proprietary formulations, each carrying the Kair- name,
              each entered below exactly as the range keeps its own ledger.
            </p>
            <ol className="formulary-list">
              {THE_NINE.map((p, i) => (
                <li key={p.slug} id={p.slug}>
                  <span className="f-num" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3>{p.name}</h3>
                  <p className="f-desc">
                    <strong>{p.category}</strong> &mdash; {p.benefit}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------- Philosophy: claim + transparency + no-cert (objection strip) ---------- */}
        <section className="band-philosophy" id="philosophy" aria-labelledby="philosophy-heading">
          <div className="container philosophy-grid">
            <div className="philosophy-copy">
              <p className="overline">The Philosophy</p>
              <h2 id="philosophy-heading">Chemical-free, by formulation.</h2>
              <p>
                Every product in the range is made from natural ingredients and
                is 100% chemical-free &mdash; the promise the range was created
                around, formulated in compliance with the doshas of the human
                body.
              </p>
              <p className="philosophy-plain">
                Said plainly: chemical-free is our formulation promise, not a
                certification &mdash; we hold no organic certification and claim
                none. What we claim is what we do: formulations from natural
                ingredients, with every ingredient declared on the label.
              </p>
              <p>
                Read the label wherever you buy &mdash; and as this site grows,
                each formulation&rsquo;s page will carry its full ingredient
                list here too.
              </p>
            </div>
            <figure className="philosophy-frame" style={{ margin: 0 }}>
              <img
                src="/images/still-life-apothecary.jpg"
                srcSet="/images/still-life-apothecary-560.jpg 560w, /images/still-life-apothecary-800.jpg 800w, /images/still-life-apothecary.jpg 1200w"
                sizes="(min-width: 900px) 42vw, calc(100vw - 40px)"
                alt="An apothecary still life of the Organics range — cream jars with wooden lids, amber dropper bottles in presentation boxes, and ivory cartons arranged with a fallen pink orchid."
                width={1200}
                height={800}
                loading="lazy"
              />
              <figcaption>The range, kept the old way: jars, droppers, cartons.</figcaption>
            </figure>
          </div>
        </section>

        {/* ---------- Where to buy: the hand-off (Phase 4 — no prices here) ---------- */}
        <section className="section buy-band" id="where-to-buy" aria-labelledby="buy-heading">
          <div className="container">
            <p className="overline">Where to Buy</p>
            <h2 id="buy-heading">No cart here &mdash; by design.</h2>
            <p className="measure">
              This is the brand&rsquo;s home, not its checkout. The nine are
              stocked at the group&rsquo;s own stores; prices live there.
            </p>
            <div className="cta-row">
              <a className="btn btn-primary" href={STORE_IN} data-cta="buy-online-in">
                Shop kairaliproducts.in
              </a>
              <a className="btn btn-secondary" href={STORE_COM} data-cta="buy-online-com">
                Shop kairaliproducts.com
              </a>
            </div>
            <p className="buy-note">
              Also stocked on BigBasket, Flipkart and Amazon &mdash; search
              &ldquo;Kairali&rdquo; where you already shop.
            </p>
          </div>
        </section>

        {/* ---------- Manufacturing trust: proof, not adjectives (Phase 3) ---------- */}
        <section className="section made-by" id="manufacturing" aria-labelledby="made-heading">
          <div className="container">
            <p className="overline">Made by the Group</p>
            <h2 id="made-heading">The maker&rsquo;s own hands.</h2>
            <p className="measure">
              The Kairali Ayurvedic Group was founded in 1989 by
              K.&nbsp;V.&nbsp;Ramesh and Gita Ramesh &mdash; a family practising
              Ayurveda since 1908. The Organics range is made by the
              group&rsquo;s own WHO-GMP-certified Ayurvedic manufacturer,
              incorporated in 2007, carrying a manufacturing practice the family
              has kept since 1948.
            </p>
            <dl className="counters">
              <div>
                <dt>9</dt>
                <dd>formulations in the range</dd>
              </div>
              <div>
                <dt>1948</dt>
                <dd>manufacturing in the family since</dd>
              </div>
              <div>
                <dt>1989</dt>
                <dd>the Group founded</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* ---------- Sister range: the ONE labelled crossing (naming-trap strip) ---------- */}
        <section className="section" id="sister-ranges" aria-labelledby="sister-heading">
          <div className="container">
            <p className="overline">Sister Ranges</p>
            <h2 id="sister-heading">Two names, two promises.</h2>
            <div className="sister-card">
              <h3>KAIR by Kairali</h3>
              <p>
                The Kair- prefix belongs to the nine above. KAIR by Kairali is
                the group&rsquo;s separate herbal-cosmetics range &mdash;
                Ayurveda-influenced soaps, shampoos and body care &mdash; with
                its own home and its own promise. It is not part of the
                chemical-free nine, and the nine are not KAIR.
              </p>
              <a href={KAIR_URL} data-cta="sister-range-kair">
                Visit kairbykairali.com &rarr;
              </a>
            </div>
          </div>
        </section>

        {/* ---------- Enquiry: the hand-raise ---------- */}
        <section className="band-enquire" id="enquire" aria-labelledby="enquire-heading">
          <div className="container">
            <p className="overline">Enquiries</p>
            <h2 id="enquire-heading">Talk to the group.</h2>
            <p className="measure">
              Distributor and bulk enquiries, gifting, or a question about any
              of the nine &mdash; one message reaches the right desk.
            </p>
            <div className="cta-row">
              <a
                className="btn btn-primary"
                href={`mailto:${EMAIL}?subject=Kairali%20Organics%20enquiry`}
                data-cta="enquiry-email"
              >
                Write to {EMAIL}
              </a>
              <a className="btn btn-secondary" href={WHATSAPP_URL} data-cta="whatsapp-click">
                <WhatsAppIcon />
                WhatsApp +91 92898 38797
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <p className="footer-title">
            Kairali Organics &mdash; the proprietary formulary of the Kairali
            Ayurvedic Group
          </p>
          <p>
            <a href={`mailto:${EMAIL}`} data-cta="footer-email">{EMAIL}</a> ·{" "}
            <a href={WHATSAPP_URL} data-cta="footer-whatsapp">WhatsApp +91 92898 38797</a>
          </p>
          <nav className="footer-nav" aria-label="Kairali sites">
            <a href={GROUP_URL}>Kairali Ayurvedic Group</a>
            <a href={STORE_IN}>Kairali Store (.in)</a>
            <a href={STORE_COM}>Kairali Store (.com)</a>
            <a href={KAIR_URL}>KAIR by Kairali</a>
          </nav>
          {/* Verified interim social set — swap to @kairali/social
              <SocialLinks/> when the fleet-socials PR (no. 139) lands
              (D-20260718-04) */}
          <nav className="footer-nav" aria-label="Kairali on social media">
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href}>
                {s.label}
              </a>
            ))}
          </nav>
          <nav className="footer-nav footer-legal" aria-label="Legal">
            <a href="/privacy">Privacy</a>
          </nav>
          <p className="footer-fine">
            © {new Date().getFullYear()} Kairali Ayurvedic Group · founded 1989
            &mdash; a family practising Ayurveda since 1908
          </p>
        </div>
      </footer>
    </>
  );
}
