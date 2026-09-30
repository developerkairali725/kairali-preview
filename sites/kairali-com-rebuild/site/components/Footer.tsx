import Link from "next/link";
import { FOOTER_COLUMNS, LEGAL_LINKS, PHONE, SOCIAL, SUB_BRANDS } from "@/lib/site";
import { Canopy } from "./Motif";
import Form from "./Form";
import { NEWSLETTER } from "@/lib/forms";

const ICONS: Record<string, string> = {
  fb: "M14 8h3V4h-3c-2.8 0-4 1.7-4 4.3V10H7v4h3v8h4v-8h3l1-4h-4V8.6c0-.4.3-.6.6-.6z",
  x: "M4 4h4.5l4 5.6L17.2 4H20l-6.2 7.3L20.5 20H16l-4.4-6-5.1 6H3.7l6.6-7.6z",
  in: "M5 9h3v11H5zM6.5 4a1.8 1.8 0 110 3.6 1.8 1.8 0 010-3.6zM10 9h3v1.6c.5-.9 1.7-1.8 3.4-1.8 3.2 0 3.6 2 3.6 4.7V20h-3v-5.6c0-1.3 0-3-1.8-3s-2.2 1.4-2.2 2.9V20h-3z",
  pi: "M12 3a9 9 0 00-3.3 17.4c-.1-.8-.1-2 .1-2.8l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.4 1.8-2.4.9 0 1.3.6 1.3 1.4 0 .9-.5 2.1-.8 3.3-.2 1 .5 1.8 1.5 1.8 1.8 0 3.1-1.9 3.1-4.6 0-2.4-1.7-4.1-4.2-4.1-2.9 0-4.5 2.1-4.5 4.4 0 .9.3 1.8.8 2.3.1.1.1.2.1.3l-.3 1.2c0 .2-.2.3-.4.2-1.3-.6-2.1-2.5-2.1-4 0-3.3 2.4-6.3 6.9-6.3 3.6 0 6.4 2.6 6.4 6 0 3.6-2.3 6.5-5.4 6.5-1.1 0-2.1-.6-2.4-1.2l-.7 2.5c-.2.9-.9 2.1-1.3 2.8A9 9 0 1012 3z",
  ig: "M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4zm5 5a4 4 0 100 8 4 4 0 000-8zm5.5-2a1 1 0 100 2 1 1 0 000-2zM12 10a2 2 0 110 4 2 2 0 010-4z",
  yt: "M21.6 7.2a2.5 2.5 0 00-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 002.4 7.2 26 26 0 002 12a26 26 0 00.4 4.8 2.5 2.5 0 001.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 001.8-1.8A26 26 0 0022 12a26 26 0 00-.4-4.8zM10 15V9l5.2 3z",
};

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
          <ul className="social" aria-label="Kairali on social media">
            {SOCIAL.map((s) => (<li key={s.label} style={{ listStyle: "none" }}><a href={s.href} rel="noopener" target="_blank" data-social={s.id} aria-label={`${s.label} (opens in a new tab)`}><svg viewBox="0 0 24 24" aria-hidden="true"><path d={ICONS[s.icon]} /></svg></a></li>))}
          </ul>
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
