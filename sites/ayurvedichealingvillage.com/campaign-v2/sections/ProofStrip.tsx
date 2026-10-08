import Image, { getImageProps } from "next/image";
import type { Variant } from "../kit/types.ts";
import type { SectionProps } from "./LandingPage";
import { NABH_NO, FAMILY_TRADITION } from "./facts.ts";
import { TRIPADVISOR, monthLabel } from "../data/ratings.ts";
import { LATEST_TRAVELERS_CHOICE, awardRow, type Award } from "../data/awards.ts";
import { getGoogleRating } from "../data/google-rating.ts";
import { pageUi } from "../production/ui.ts";

// Every rating, count and award below comes from campaign-v2/data/*.ts. Never type one here.
const TA_AS_OF = `Tripadvisor, as of ${monthLabel(TRIPADVISOR.asOf)}`;
const fmtRating = (n: number) => n.toFixed(1);
const fmtCount = (n: number) => n.toLocaleString("en-US");

// Which image-bearing items each artboard shows. Items a variant never shows are not rendered at all,
// because hidden lazy images are still fetched by Chrome.
// doctors = how many faces the doctors card shows (0 = no card); B's card is mobile-only with one face.
const SHOW: Record<Variant, { tcInCard: boolean; doctors: number; awardsRow: boolean; since: boolean }> = {
  A: { tcInCard: false, doctors: 0, awardsRow: true, since: false }, // the Travelers' Choice badge is in the logo row
  B: { tcInCard: true, doctors: 1, awardsRow: false, since: true },
  C: { tcInCard: false, doctors: 0, awardsRow: false, since: true }, // text-only trust line
  D: { tcInCard: true, doctors: 3, awardsRow: false, since: false },
};

// Logo-row heights (CSS px), mirrored in sections.css (--lp-award-h). Used for `sizes` so no logo is upscaled.
const ROW_H = { desktop: 60, mobile: 44 };
const DESKTOP = "(min-width: 768px)";
const BLANK = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const awardSizes = (a: Award) => {
  const w = (h: number) => Math.ceil((h * a.logo.width) / a.logo.height);
  return `${DESKTOP} ${w(ROW_H.desktop)}px, ${w(ROW_H.mobile)}px`;
};

/** A logo shown on every breakpoint. */
function AwardLogo({ a }: { a: Award }) {
  return <Image src={a.logo.src} alt={a.alt} width={a.logo.width} height={a.logo.height} sizes={awardSizes(a)} className="lp-proof__award" />;
}

/** A logo that does not fit the phone row. Phones get a blank 1px fallback (no request for the logo) and
 *  the slot is display:none there. Desktop picks the real file through <source media>. */
function DesktopOnlyAwardLogo({ a }: { a: Award }) {
  const { props: { srcSet, sizes, ...img } } = getImageProps({ src: a.logo.src, alt: a.alt, width: a.logo.width, height: a.logo.height, sizes: awardSizes(a) });
  return (
    <picture className="lp-proof__award-pic lp-proof__award-pic--desktop">
      <source media={DESKTOP} srcSet={srcSet} sizes={sizes} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img {...img} src={BLANK} alt={a.alt} className="lp-proof__award" />
    </picture>
  );
}

/**
 * Proof, shown once per page. Every variant gets the same items; sections.css picks the artboard's form:
 * A a logo row, B and D a bento of cards, C an editorial trust line. The Google item exists only when the
 * live Places API answered (data/google-rating.ts); otherwise it is left out, with no placeholder or gap.
 */
export default async function ProofStrip({ c, v, req }: SectionProps) {
  const production = req.surface === "production";
  const ui = pageUi(req);
  // Live ad routes show the family-tradition line in every variant (review finding, 8 Oct 2026: the heritage line was
  // missing). The wording is the owner's approved fact (sections/facts.ts), never a derived "100 years".
  const show = production ? { ...SHOW[v], since: true } : SHOW[v];
  const en = ui.lang === "en";
  let asOf = TA_AS_OF;
  if (!en) {
    const [y, m] = TRIPADVISOR.asOf.split("-").map(Number);
    asOf = `${ui.proof.asOf} ${new Intl.DateTimeFormat(ui.lang, { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(y, m - 1, 1)))}`;
  }
  const doctors = c.doctors.slice(0, show.doctors);
  const google = await getGoogleRating();
  const tc = LATEST_TRAVELERS_CHOICE;
  return (
    <section className="lp-proof" aria-label={ui.proof.aria}>
      <div className={`lp-proof__grid${google ? "" : " lp-proof__grid--no-google"}`}>
        <div className="lp-proof__item lp-proof__item--ta">
          {show.tcInCard ? <Image className="lp-proof__tc" src={tc.logo.src} alt={tc.alt} width={tc.logo.width} height={tc.logo.height} sizes="56px" /> : null}
          <div>
            <p className="lp-proof__num">{fmtRating(TRIPADVISOR.rating)}<span className="lp-proof__of"> / 5</span></p>
            <p className="lp-proof__label">{fmtCount(TRIPADVISOR.reviewCount)} {ui.proof.reviews}</p>
            <p className="lp-proof__src">
              <a className="lp-proof__link" href={TRIPADVISOR.listingUrl} target="_blank" rel="noopener"
                aria-label={en ? `${TA_AS_OF}: ${fmtRating(TRIPADVISOR.rating)} out of 5 from ${fmtCount(TRIPADVISOR.reviewCount)} reviews (opens Tripadvisor in a new tab)` : `${asOf}: ${fmtRating(TRIPADVISOR.rating)} / 5 · ${fmtCount(TRIPADVISOR.reviewCount)} ${ui.proof.reviews}`}>{asOf}</a>
            </p>
          </div>
        </div>
        {google ? (
          <div className="lp-proof__item lp-proof__item--google">
            <p className="lp-proof__num">{fmtRating(google.rating)}<span className="lp-proof__of"> / 5</span></p>
            <p className="lp-proof__label">{fmtCount(google.count)} Google reviews</p>
            {google.mapsUri ? (
              <p className="lp-proof__src">
                <a className="lp-proof__link" href={google.mapsUri} target="_blank" rel="noopener"
                  aria-label={`Google: ${fmtRating(google.rating)} out of 5 from ${fmtCount(google.count)} reviews (opens Google Maps in a new tab)`}>Google</a>
              </p>
            ) : null}
          </div>
        ) : null}
        <div className="lp-proof__item lp-proof__item--nabh">
          <p className="lp-proof__num">NABH</p>
          <p className="lp-proof__label">{ui.proof.hospital} · <span className="lp-proof__cert">{NABH_NO}</span></p>
        </div>
        {show.since ? (
          <div className="lp-proof__item lp-proof__item--since">
            <p className="lp-proof__num" aria-hidden="true">1908</p>
            <p className="lp-proof__label">{en ? FAMILY_TRADITION : ui.proof.tradition}</p>
          </div>
        ) : null}
        {doctors.length ? (
          <div className="lp-proof__item lp-proof__item--doctors">
            <span className="lp-proof__faces">
              {doctors.map((d) => (
                <Image key={d.id} src={d.photo.src} alt="" width={d.photo.width} height={d.photo.height} sizes="56px" className="lp-proof__face" />
              ))}
            </span>
            <p className="lp-proof__label"><b>{ui.proof.doctors}</b> <span>{doctors[0].name} {ui.proof.team}</span></p>
          </div>
        ) : null}
        {show.awardsRow ? (
          <div className="lp-proof__awards">
            {awardRow().map(({ award, mobile }) => mobile ? <AwardLogo key={award.id} a={award} /> : <DesktopOnlyAwardLogo key={award.id} a={award} />)}
          </div>
        ) : null}
      </div>
    </section>
  );
}
