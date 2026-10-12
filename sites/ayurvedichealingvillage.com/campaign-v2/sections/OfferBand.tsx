import type { SectionProps } from "./LandingPage";
import { isPending } from "../kit/pending.ts";

function fmtDate(iso: string, locale: string) {
  const d = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? iso : new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(d);
}

// Per-campaign offer. null → no band; pending → a visible placeholder so review catches it.
export default function OfferBand({ c, req }: SectionProps) {
  const o = c.offer;
  if (o === null) return null;
  if (isPending(o)) {
    return (
      <section className="lp-offer" aria-label="Current offer">
        <div className="lp-offer__card">
          <div className="lp-offer__copy">
            <p className="lp-over">[{o.id}]</p>
            <p className="lp-offer__headline">[{o.id}] Offer pending confirmation</p>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="lp-offer" aria-label="Current offer">
      <div className="lp-offer__card">
        <div className="lp-offer__copy">
          <p className="lp-over">{o.name}</p>
          <p className="lp-offer__headline">{o.headline}</p>
          <p className="lp-offer__terms">
            Valid {fmtDate(o.validFrom, req.locale)} to {fmtDate(o.validTo, req.locale)}. <a href={o.termsUrl}>Offer terms</a>
          </p>
        </div>
        <a className="lp-btn lp-btn--primary lp-offer__cta" href="#enquiry" data-track="cta_click" data-track-cta="offer" data-track-position="section">Claim with a free consultation</a>
      </div>
    </section>
  );
}
