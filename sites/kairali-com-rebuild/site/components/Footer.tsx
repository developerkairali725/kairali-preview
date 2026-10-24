import Link from "next/link";
import { FOOTER_COLUMNS, LEGAL_LINKS, PHONE, SUB_BRANDS, TAGLINE } from "@/lib/site";
import { SocialLinks } from "@kairali/social";
import { Mandala, Orn } from "./Ornament";
import Form from "./Form";
import CookiePreferences from "./CookiePreferences";
import { NEWSLETTER } from "@/lib/forms";

// Premium v4 footer: charcoal-deep ground, inverted logo, gold column headings, ornament divider,
// faint mandala line-art. Columns, links and the newsletter block are unchanged from Premium v3.
export default function Footer() {
  return (
    <footer className="site-footer">
      <Mandala />
      <div className="container footer-top">
        <div className="stack" style={{ gap: 18 }}>
          <Link href="/" className="footer-brand" aria-label="Kairali Ayurvedic Group — home"><img src="/brand/kairali-logo-white.svg" alt="Kairali — health through ayurveda, since 1908" width={105} height={92} loading="lazy" decoding="async" /></Link>
          <span className="footer-tag">{TAGLINE}</span>
          <p>Corporate Office: Kairali Ayurvedic Group, D - 130, Block D, Ambedkar Colony, Mehrauli, New Delhi - 110030.</p>
          <p>Ph: <a href={PHONE.href}>{PHONE.label}</a> · Email: <a href="mailto:info@kairali.com">info@kairali.com</a></p>
          <div className="newsletter">
            <h2 className="overline on-dark">Subscribe to our Newsletter</h2>
            <p style={{ fontSize: 14 }}>Subscribe to Receive Latest News and Updates.</p>
            <Form schema={NEWSLETTER} compact formName="Newsletter subscription" idPrefix="footer-newsletter" />
          </div>
          <SocialLinks className="social" />
        </div>
        <div className="footer-cols">
          {FOOTER_COLUMNS.map((c) => (
            <div key={c.title}>
              <h2>{c.title}</h2>
              <ul>{c.links.map((l) => <li key={l.href}><Link href={l.href} prefetch={false}>{l.label}</Link></li>)}</ul>
            </div>))}
          <div style={{ gridColumn: "1 / -1" }}>
            <h2>Kairali family</h2>
            <ul style={{ display: "flex", flexWrap: "wrap", gap: "4px 22px" }}>
              {SUB_BRANDS.map((b) => <li key={b.key}><a href={b.url} rel="noopener" target="_blank">{b.name} ↗<span className="sr-only"> (opens in a new tab)</span></a></li>)}
            </ul>
          </div>
        </div>
      </div>
      <div className="container footer-orn"><Orn /></div>
      <div className="container footer-bottom">
        <p>© Kairali Ayurvedic Group · A family tradition since 1908.</p>
        <ul>
          {LEGAL_LINKS.map((l) => <li key={l.href}><Link href={l.href} prefetch={false}>{l.label}</Link></li>)}
          <li><CookiePreferences /></li>
        </ul>
      </div>
    </footer>
  );
}
