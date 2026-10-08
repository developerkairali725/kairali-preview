import Image, { getImageProps } from "next/image";
import { preload } from "react-dom";
import type { Variant } from "../kit/types.ts";
import type { SectionProps } from "./LandingPage";
import { t, splitAccent } from "./text.ts";
import { heroPrice } from "./price-line";
import { PriceText } from "./interactive/Fees";
import { ConsultForm } from "./ConsultBar";
import { contact } from "../../campaign-v110/lib/site.ts";
import { NABH_NO } from "./facts.ts";
import { LATEST_TRAVELERS_CHOICE } from "../data/awards.ts";
import { WaIcon } from "./icons";
import AskAnythingButton from "../production/AskAnythingButton";
import ConsultCard from "../production/ConsultCard";
import { pageUi } from "../production/ui.ts";

// Where each artboard puts the Step-1 form and whether the hero image sits in a three-image strip.
// Markup is shared; only these two switches differ by variant. Everything visual is in sections.css.
// `sizes` is the desktop hero image's share of the viewport in each artboard; `mobileSizes` is the phone
// image's rendered width (sections.css), so a phone downloads exactly what it paints (the LCP image).
// `landscapeOnPhone`: B and D show a short landscape strip on phones (230px / 200px tall), so they use the variant's
// own landscape hero there (authoring guide §6.2) instead of the portrait `mobileImage`, which would be cropped to
// a third of its pixels.
const LAYOUT: Record<Variant, { form: boolean; strip: boolean; sizes: string; mobileSizes: string; landscapeOnPhone: boolean }> = {
  A: { form: false, strip: false, sizes: "55vw", mobileSizes: "100vw", landscapeOnPhone: false },            // form is the ConsultBar section below the hero
  B: { form: true, strip: false, sizes: "55vw", mobileSizes: "calc(100vw - 34px)", landscapeOnPhone: true }, // bento: image + form card
  C: { form: false, strip: false, sizes: "36vw", mobileSizes: "150px", landscapeOnPhone: false },            // editorial cover, single CTA
  D: { form: true, strip: true, sizes: "25vw", mobileSizes: "calc(100vw - 24px)", landscapeOnPhone: true },  // the form is the hero; image strip in the headline card
};

const DESKTOP = "(min-width: 768px)";
const MOBILE = "(max-width: 767px)";

function lowerFirst(s: string) { return s ? s[0].toLowerCase() + s.slice(1) : s; }

export default function Hero({ c, v, req, carry }: SectionProps) {
  const layout = LAYOUT[v];
  const desk = c.hero.image[v];
  const mob = layout.landscapeOnPhone ? desk : c.hero.mobileImage;
  const [pre, accent, post] = splitAccent(c.hero.h1, c.hero.h1Accent);
  // null when pricing is hidden (owner rule for campaign pages): no amount, chip or "charged separately" line.
  const price = heroPrice(c, req);
  const separately = price && c.chargedSeparately.length
    ? `${[c.chargedSeparately[0], ...c.chargedSeparately.slice(1).map(lowerFirst)].join(" and ")} charged separately.`
    : "";
  const production = req.surface === "production";
  const ui = pageUi(req);
  const primary = c.cta?.primary ?? "Get free doctor consultation";

  // Art direction: one <picture>, so each viewport downloads exactly one hero image. The <img> is the mobile
  // photo, so its alt describes that photo.
  const { props: { srcSet: deskSrcSet } } = getImageProps({ src: desk.src, width: desk.width, height: desk.height, alt: "", sizes: layout.sizes });
  const { props: mobProps } = getImageProps({ src: mob.src, width: mob.width, height: mob.height, alt: ui.alt[mob.id] ?? mob.alt, sizes: layout.mobileSizes, quality: c.hero.mobileQuality, priority: true });

  // The LCP image. React does not auto-preload an <img> inside <picture>, so preload each art-directed source for
  // its own media query; React puts these in <head> (and the Link header), so the phone fetches only its image,
  // before the scripts.
  preload(mobProps.src, { as: "image", imageSrcSet: mobProps.srcSet, imageSizes: layout.mobileSizes, fetchPriority: "high", media: MOBILE });
  if (deskSrcSet) preload(desk.src, { as: "image", imageSrcSet: deskSrcSet, imageSizes: layout.sizes, fetchPriority: "high", media: DESKTOP });

  // D's strip: two more photos from the campaign gallery (lazy, not hero images).
  const extras = layout.strip
    ? [c.gallery.find((g) => g.category === "Villas"), c.gallery.find((g) => g.category === "Grounds")].filter((g) => g !== undefined).map((g) => g.image)
    : [];

  return (
    <section className="lp-hero" id="top" aria-labelledby="lp-h1">
      <div className="lp-hero__copy">
        <div className="lp-hero__head">
          <p className="lp-over lp-hero__over">{t(c.hero.overline)}</p>
          <h1 id="lp-h1">{pre}{accent ? <em>{accent}</em> : null}{post}</h1>
        </div>
        <div className="lp-hero__body">
          <p className="lp-hero__stand">{t(c.hero.standfirst)}</p>
          {price && c.fees !== null ? (
            <div className="lp-hero__price">
              <p className="lp-hero__price-lead">{price.nights} nights, all-inclusive, from</p>
              <p className="lp-hero__price-amt"><PriceText fees={c.fees} locale={req.locale} currency={req.currency} /></p>
              {separately ? <p className="lp-hero__price-note">{separately}</p> : null}
            </div>
          ) : null}
          <div className="lp-hero__ctas">
            <a className="lp-btn lp-btn--primary lp-hero__cta" href="#enquiry" data-track="cta_click" data-track-cta="consult" data-track-position="hero">{primary}</a>
            {production && c.cta?.secondary ? (
              // Opens the site's existing chat choices (Priya, WhatsApp, Instagram, Messenger); no new channel.
              <AskAnythingButton className="lp-btn lp-btn--line lp-hero__ask" label={c.cta.secondary} />
            ) : (
              <a className="lp-btn lp-btn--wa lp-hero__wa" href={`https://wa.me/${contact.whatsapp.number}`} data-track="cta_click" data-track-cta="whatsapp" data-track-position="hero"><WaIcon size={20} />WhatsApp</a>
            )}
          </div>
          {/* Live ad routes: what "free" covers, right under the button that offers it (the initial consultation only). */}
          {production && c.cta?.primarySupport ? <p className="lp-hero__note">{c.cta.primarySupport}</p> : null}
          <p className="lp-hero__trust"><b>NABH</b> {ui.hero.accredited} · {NABH_NO} · {LATEST_TRAVELERS_CHOICE.alt}</p>
        </div>
      </div>
      <figure className="lp-hero__media">
        <div className="lp-hero__frame">
          <picture className="lp-hero__pic">
            <source media={DESKTOP} srcSet={deskSrcSet} sizes={layout.sizes} width={desk.width} height={desk.height} />
            <img {...mobProps} fetchPriority="high" loading="eager" className="lp-hero__img" />
          </picture>
          {price && c.fees !== null ? (
            <p className="lp-hero__chip lp-panel">From <PriceText fees={c.fees} locale={req.locale} currency={req.currency} /> · {price.nights} nights, all-in</p>
          ) : null}
        </div>
        {extras.map((im) => (
          <Image key={im.id} src={im.src} alt={ui.alt[im.id] ?? im.alt} width={im.width} height={im.height} sizes="15vw" className="lp-hero__extra" />
        ))}
      </figure>
      {layout.form ? (
        <div className="lp-hero__form">
          {/* A live route without a Step-1 bar keeps its one enquiry form: the card holds the consultation CTA instead. */}
          {production && c.consultBar === false ? <ConsultCard c={c} ui={ui} /> : <ConsultForm c={c} v={v} req={req} carry={carry} position="hero" />}
        </div>
      ) : null}
    </section>
  );
}
