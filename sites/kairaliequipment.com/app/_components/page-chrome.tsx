// Sub-page chrome for kairaliequipment.com — the Foundry Ledger grammar
// carried from the approved golden page: forest-700 dark page-head band
// (echoes the hero), breadcrumb rail, and the RFQ band every content page
// ends on (quote-first law — every page moves toward the quote).
import Link from "next/link";
import { EMAIL } from "./chrome";

export function Crumbs({ trail }: { trail: Array<{ name: string; href?: string }> }) {
  return (
    <nav className="crumbs" aria-label="breadcrumb">
      <ol>
        <li><Link href="/">Home</Link></li>
        {trail.map((c) => (
          <li key={c.name}>{c.href ? <Link href={c.href}>{c.name}</Link> : <span aria-current="page">{c.name}</span>}</li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHead({
  overline,
  title,
  lede,
  trail,
  ctaLabel = "Request a Quote",
  ctaHref = "/request-a-quote",
  ctaEvent = "quote-open",
}: {
  overline: string;
  title: string;
  lede?: string;
  trail: Array<{ name: string; href?: string }>;
  ctaLabel?: string;
  ctaHref?: string;
  ctaEvent?: string;
}) {
  return (
    <section className="page-head">
      <div className="container">
        <Crumbs trail={trail} />
        <p className="overline">{overline}</p>
        <h1>{title}</h1>
        {lede ? <p className="lede">{lede}</p> : null}
        <div className="cta-row">
          <a className="btn btn-primary" href={ctaHref} data-cta={ctaEvent}>{ctaLabel}</a>
        </div>
      </div>
    </section>
  );
}

/** The closing quote band — every content page ends at the same door. */
export function RfqBand({ context, event = "quote-open" }: { context?: string; event?: string }) {
  return (
    <section className="rfq-band">
      <div className="container">
        <div>
          <p className="overline">Request a quote</p>
          <h2>{context ?? "Tell us what you are equipping"}</h2>
          <p>
            Describe the project — the sales team replies from {EMAIL} with
            specifications, dimensions and a quote. No obligation attaches to a
            quote.
          </p>
        </div>
        <div className="cta-row">
          <a className="btn btn-primary" href="/request-a-quote" data-cta={event}>Request a Quote</a>
          <a className="btn btn-band-ghost" href={`mailto:${EMAIL}`} data-cta="email-click">Write to {EMAIL}</a>
        </div>
      </div>
    </section>
  );
}
