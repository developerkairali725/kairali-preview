/**
 * theblushlounge.com chrome — footer (the approved hero carries the brand
 * lockup, so the golden page ships no separate header; the footer holds the
 * IA nav until the full build lands those routes).
 *
 * PERSONAL SOCIALS ONLY (her brand, her handles — BRIEF locked facts):
 * @blushlounge_sneha + @blushschoolofbeauty. Deliberately NOT the Kairali
 * group social set: when the fleet footer-socials lint lands (PR 139,
 * scripts/footer-socials-lint.mjs), theblushlounge.com needs the same loud
 * lint-exemption treatment as the chat bubble (CHAT_EXEMPT pattern, mirroring
 * abhilashkr's matrix exemption) — flagged in the golden-page PR body.
 *
 * Contact facts kept OFF the golden page on purpose (HARD GATE 6):
 * makeoverbysneha@gmail.com and the 10:00–22:00 hours both carry
 * CONFIRM-before-launch flags in BRIEF.md — they join /contact at full build
 * once confirmed. WhatsApp + address are owner-ruled facts and print.
 */

export const WHATSAPP_DISPLAY = "+91 88269 21110"; // D-BL-WHATSAPP (owner, 18 Jul 2026)

/** wa.me deep-link with a per-context prefill (STRATEGY §4: "Hi Sneha,
 *  enquiring for <service> on <date>" — the date stays the bride's to type). */
export function waUrl(prefill: string) {
  return `https://wa.me/918826921110?text=${encodeURIComponent(prefill)}`;
}

export const WHATSAPP_URL = waUrl("Hi Sneha — I'd like to enquire for my date.");
export const IG_URL = "https://www.instagram.com/blushlounge_sneha/";
export const IG_SCHOOL_URL = "https://www.instagram.com/blushschoolofbeauty/";

const NAV = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/services", label: "Services" },
  { href: "/academy", label: "Academy" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/**
 * Inner-page header (full build). The golden homepage carries its lockup
 * inside the hero by design and does NOT render this; every inner page does.
 * Same restraint system: lockup + tracked-caps nav + the WhatsApp lane.
 */
export function PageHeader({ current }: { current: string }) {
  return (
    <header className="pagehead">
      <a className="brand" href="/">
        <span className="brand__mark" aria-hidden="true">
          bl
        </span>
        <span className="brand__word">
          Blush Lounge
          <small>Makeup by Sneha</small>
        </span>
      </a>
      <nav className="pagehead__nav" aria-label="Site">
        {NAV.map((n) => (
          <a key={n.href} href={n.href} aria-current={n.href === current ? "page" : undefined}>
            {n.label}
          </a>
        ))}
      </nav>
      <a className="pagehead__wa" href={WHATSAPP_URL} data-cta="whatsapp_click" rel="noopener">
        WhatsApp Sneha
      </a>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer__grid">
        <div>
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
          <p className="footer__meta" style={{ marginTop: 18 }}>
            Beauty, Bridal &amp; SFX artistry by Sneha Chowdhary.
            <br />
            Shivalik, New Delhi · Delhi &amp; worldwide.
          </p>
        </div>
        <div>
          {/* h3, not h4: the document's prior heading is an h2 (A5 heading-order fix) */}
          <h3>Explore</h3>
          <ul className="footer__nav">
            <li>
              <a href="/portfolio">Portfolio</a>
            </li>
            <li>
              <a href="/services">Services</a>
            </li>
            <li>
              <a href="/academy">Blush School of Beauty</a>
            </li>
            <li>
              <a href="/about">About Sneha</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </div>
        <div>
          <h3>Say hello</h3>
          <ul className="footer__social">
            <li>
              <a href={WHATSAPP_URL} data-cta="whatsapp_click" rel="noopener">
                WhatsApp · {WHATSAPP_DISPLAY}
              </a>
            </li>
            <li>
              <a href={IG_URL} data-cta="ig_profile_click" rel="noopener">
                Instagram · @blushlounge_sneha
              </a>
            </li>
            <li>
              <a href={IG_SCHOOL_URL} data-cta="ig_profile_click" rel="noopener">
                Instagram · @blushschoolofbeauty
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer__bottom">
        <span>© 2026 Blush Lounge — Makeup by Sneha. All rights reserved.</span>
        <span>Delhi · Worldwide</span>
      </div>
    </footer>
  );
}
