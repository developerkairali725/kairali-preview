import { useId } from "react";
import type { SectionProps } from "./LandingPage";
import { ArrowIcon } from "./icons";
import { heroPrice } from "./price-line";
import { PriceText } from "./interactive/Fees";
import { LENGTHS, formSchemaFor, monthOptions } from "../forms/schema.ts";
import ConsultIntercept from "./interactive/ConsultIntercept";

const CHANNELS = [
  ["whatsapp", "WhatsApp"], ["instagram", "Instagram"], ["messenger", "Messenger"], ["call", "Phone call"], ["email", "Email"],
] as const;

/**
 * Step 1 of the consultation: program, month and length (plus reply channel where the card has room).
 * A GET form to #enquiry; the Enquiry section (Task 13) picks the answers up. Used by ConsultBar (variant A)
 * and inside the Hero form card (variants B and D). Its shape per variant comes from sections.css.
 *
 * With JavaScript, ConsultIntercept stops the navigation and hands the answers to the Enquiry in-page.
 * Without it, a GET submit replaces the landing query string, so the allow-listed tracking parameters
 * (`carry`, from forms/carry.ts, filled on the server from the page's searchParams) ride along as hidden inputs.
 * Option values are shared with the Enquiry schema (forms/schema.ts), so either path prefills step 1.
 *
 * Production surface: no price line when pricing is hidden, the program select only when the campaign names a
 * program, and the line under the title is the campaign's own CTA support copy.
 */
export function ConsultForm({ c, v, req, position, carry }: SectionProps & { position: "consult-bar" | "hero" }) {
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;
  const showChannel = v !== "A";
  const price = heroPrice(c, req);
  const schema = formSchemaFor(c.form);
  // The three-step form's step 1 IS this bar; the one-step live form follows it as step 2.
  const total = schema.steps.length === 1 ? 2 : schema.steps.length;
  const production = req.surface === "production";
  const sub = production ? c.cta?.primarySupport : "A qualified Ayurvedic doctor, by video, before you book.";
  const submit = c.cta?.primary ?? "Get free doctor consultation";
  return (
    <ConsultIntercept className="lp-consult lp-panel" label="Free doctor consultation" variant={v} formId={schema.id} production={production}>
      {(carry ?? []).map(([k, val]) => <input key={k} type="hidden" name={k} value={val} />)}
      <div className="lp-consult__head">
        <p className="lp-consult__title">Free doctor consultation</p>
        <p className="lp-consult__step">Step 1 of {total}</p>
      </div>
      {sub ? <p className="lp-consult__sub">{sub}</p> : null}
      {price && c.fees !== null ? (
        <p className="lp-consult__price">
          <span>{price.nights} nights from</span> <b><PriceText fees={c.fees} locale={req.locale} currency={req.currency} /></b> <span>all-inclusive</span>
        </p>
      ) : null}
      <div className="lp-consult__fields">
        {c.programDefault ? (
          <div className="lp-consult__field">
            <label htmlFor={id("program")}>{c.spelling?.locale === "en-GB" ? "Programme" : "Program"}</label>
            <select id={id("program")} name="program" defaultValue={c.programDefault}>
              <option value={c.programDefault}>{c.programDefault}</option>
              <option value="advise">Not sure — advise me</option>
            </select>
          </div>
        ) : null}
        <div className="lp-consult__field">
          <label htmlFor={id("month")}>Preferred month</label>
          <select id={id("month")} name="month" defaultValue="flexible">
            {monthOptions({ locale: req.locale, now: new Date() }).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className="lp-consult__field lp-consult__field--length">
          <label htmlFor={id("length")}>Length of stay</label>
          <select id={id("length")} name="length" defaultValue="14">
            {LENGTHS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        {showChannel ? (
          <div className="lp-consult__field lp-consult__field--channel">
            <label htmlFor={id("channel")}>Reply on</label>
            <select id={id("channel")} name="channel" defaultValue="whatsapp">
              {CHANNELS.map(([val, label]) => <option key={val} value={val}>{label}</option>)}
            </select>
          </div>
        ) : null}
      </div>
      {production ? (
        <a className="lp-consult__submit" href="#enquiry" data-consult-trigger data-track="cta_click" data-track-cta="consult" data-track-position={position === "consult-bar" ? "bar" : "hero"}>
          <span className="lp-consult__label">{submit}</span><span className="lp-consult__arrow"><ArrowIcon /></span>
        </a>
      ) : (
        <button className="lp-consult__submit" type="submit" data-track="cta_click" data-track-cta="consult" data-track-position={position === "consult-bar" ? "bar" : "hero"}>
          <span className="lp-consult__label">{submit}</span><span className="lp-consult__arrow"><ArrowIcon /></span>
        </button>
      )}
    </ConsultIntercept>
  );
}

// Variant A's compact Step-1 bar, overlapping the bottom of the hero (desktop only, per the artboard).
export default function ConsultBar(p: SectionProps) {
  return (
    <section className="lp-consultbar" aria-label="Start your free doctor consultation">
      <ConsultForm {...p} position="consult-bar" />
    </section>
  );
}
