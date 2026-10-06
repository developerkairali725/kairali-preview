import Link from "next/link";
import { FOOTER_COLUMNS, LEGAL_LINKS, PHONE, SUB_BRANDS } from "@/lib/site";
import { SocialLinks } from "@kairali/social";
import { Canopy } from "./Motif";
import Form from "./Form";
import { NEWSLETTER } from "@/lib/forms";

export default function Footer() {
  return (
    <footer className="site-footer">
      <Canopy style={{ left: -140, bottom: -120, width: 720 }} />
      <div className="container footer-top">
        <div className="stack" style={{ gap: 20 }}>
          <Link href="/" className="footer-brand" aria-label="Kairali Ayurvedic Group — home"><img src="/brand/kairali-logo-white.svg" alt="Kairali — health through ayurveda, since 1908" width={109} height={96} /></Link>
          <p>Corporate Office: Kairali Ayurvedic Group, D - 130, Block D, Ambedkar Colony, Mehrauli, New Delhi - 110030.</p>
          <p>Ph: <a href={PHONE.href}>{PHONE.label}</a> · Email: <a href="mailto:info@kairali.com">info@kairali.com</a></p>
          <div className="newsletter">
            <h2 className="overline on-dark" style={{ fontFamily: "var(--font-body)" }}>Subscribe to our Newsletter</h2>
            <p style={{ fontSize: 14 }}>Subscribe to Receive Latest News and Updates.</p>
            <Form schema={NEWSLETTER} compact formName="Newsletter subscription" />
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
      <div className="container footer-bottom">
        <p>© Kairali Ayurvedic Group · A family tradition since 1908.</p>
        <ul>{LEGAL_LINKS.map((l) => <li key={l.href}><Link href={l.href} prefetch={false}>{l.label}</Link></li>)}</ul>
      </div>
    </footer>
  );
}
