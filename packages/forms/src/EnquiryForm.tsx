"use client";
// Accessible enquiry form (DESIGN_DOCTRINE §1.5: labels ALWAYS visible above
// fields, correct mobile keyboards, no forced accounts). Required consent
// checkbox + privacy link (DPDP). Honeypot for bots. Posts JSON to a same-site
// route handler (default /api/enquiry) which calls storeLead server-side — the
// service key never touches the client. data-cta on the submit (Ship Gate A4).
import { useState, type FormEvent } from "react";

export type EnquiryFormProps = {
  /** which site this form belongs to (stored with the lead) */
  site: string;
  /** form category, e.g. "enquiry" | "consultation" | "franchise" | "rfq" */
  formType?: string;
  /** route handler endpoint (same-origin) */
  action?: string;
  /** /privacy on every Factory site (via @kairali/legal) */
  privacyHref?: string;
  /** subject line prefilled (e.g. a centre name) */
  subject?: string;
  heading?: string;
  submitLabel?: string;
  /** data-cta event name on the submit control (Ship Gate A4 / per-site
   *  integrations plan — e.g. kairaliequipment STRATEGY §4 names the RFQ
   *  submit event "quote-request-submit"). Additive; default unchanged. */
  submitCta?: string;
  /** OPT-IN structured B2B/RFQ fields (kairaliequipment STRATEGY §4 signed
   *  integrations plan). All default OFF — the fleet form is unchanged.
   *  CRM-contract note: `country` maps to the canonical CRM_FIELDS entry;
   *  the non-canonical extras (organisation, categories, project type,
   *  scale) are folded into the canonical `message` as a labelled preamble —
   *  the Satyam CRM payload spec is never altered from a form. */
  rfq?: {
    /** organisation/company text field (named "organisation" — the "company"
     *  name is the honeypot and must never be a real field) */
    organisation?: boolean;
    /** country text field (canonical CRM field) */
    country?: boolean;
    /** category-of-interest checkboxes; pre-tick via defaultCategories
     *  (hidden pre-fill when opened from a category page) */
    categoryOptions?: string[];
    defaultCategories?: string[];
    /** project-type select */
    projectTypeOptions?: string[];
    /** quantity / project-scale free-text field */
    scale?: boolean;
  };
};

export function EnquiryForm({
  site,
  formType = "enquiry",
  action = "/api/enquiry",
  privacyHref = "/privacy",
  subject,
  heading = "Send an enquiry",
  submitLabel = "Send enquiry",
  submitCta = "enquiry_submit",
  rfq,
}: EnquiryFormProps) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (fd.get("company")) return; // honeypot tripped — silently drop
    if (fd.get("consent") !== "on") {
      setError("Please tick the consent box so we may reply.");
      return;
    }
    setState("sending");
    setError("");
    // Non-canonical RFQ extras ride inside the canonical `message` field as a
    // labelled preamble — visible to the sales team, CRM contract untouched.
    const preamble = rfq
      ? [
          rfq.organisation && fd.get("organisation") ? `Organisation: ${fd.get("organisation")}` : "",
          rfq.categoryOptions?.length && fd.getAll("categories").length
            ? `Categories of interest: ${fd.getAll("categories").join(", ")}`
            : "",
          rfq.projectTypeOptions?.length && fd.get("projectType") ? `Project type: ${fd.get("projectType")}` : "",
          rfq.scale && fd.get("scale") ? `Quantity / project scale: ${fd.get("scale")}` : "",
        ]
          .filter(Boolean)
          .join("\n")
      : "";
    try {
      const res = await fetch(action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site,
          formType,
          consent: true,
          fullName: fd.get("fullName"),
          countrycode: fd.get("countrycode"),
          phone: fd.get("phone"),
          email: fd.get("email"),
          subject: subject ?? fd.get("subject"),
          country: rfq?.country ? fd.get("country") || undefined : undefined,
          message: preamble ? `${preamble}\n\n${fd.get("message")}` : fd.get("message"),
          landingPage: typeof window !== "undefined" ? window.location.href : undefined,
          referrer: typeof document !== "undefined" ? document.referrer : undefined,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setState("sent");
      form.reset();
    } catch {
      setState("error");
      setError("Something went wrong. Please try again, or WhatsApp us.");
    }
  }

  if (state === "sent") {
    return (
      <div className="enquiry-sent" role="status">
        <p><strong>Thank you — your enquiry has reached us.</strong> Our team will be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form className="enquiry-form" onSubmit={onSubmit} noValidate>
      {heading ? <h3 className="enquiry-heading">{heading}</h3> : null}

      <div className="field">
        <label htmlFor="ef-name">Your name</label>
        <input id="ef-name" name="fullName" type="text" autoComplete="name" required />
      </div>

      <div className="field-row">
        <div className="field field-cc">
          <label htmlFor="ef-cc">Code</label>
          <input id="ef-cc" name="countrycode" type="text" inputMode="tel" placeholder="+91" defaultValue="+91" />
        </div>
        <div className="field field-phone">
          <label htmlFor="ef-phone">Phone / WhatsApp</label>
          <input id="ef-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required />
        </div>
      </div>

      <div className="field">
        <label htmlFor="ef-email">Email</label>
        <input id="ef-email" name="email" type="email" inputMode="email" autoComplete="email" required />
      </div>

      {rfq?.organisation ? (
        <div className="field">
          <label htmlFor="ef-org">Company / organisation</label>
          <input id="ef-org" name="organisation" type="text" autoComplete="organization" />
        </div>
      ) : null}

      {rfq?.country ? (
        <div className="field">
          <label htmlFor="ef-country">Country</label>
          <input id="ef-country" name="country" type="text" autoComplete="country-name" />
        </div>
      ) : null}

      {rfq?.categoryOptions?.length ? (
        <fieldset className="field ef-cats">
          <legend>Category of interest</legend>
          {rfq.categoryOptions.map((c) => (
            <label key={c} className="ef-cat">
              <input
                type="checkbox"
                name="categories"
                value={c}
                defaultChecked={rfq.defaultCategories?.includes(c)}
              />
              <span>{c}</span>
            </label>
          ))}
        </fieldset>
      ) : null}

      {rfq?.projectTypeOptions?.length ? (
        <div className="field">
          <label htmlFor="ef-ptype">Project type</label>
          <select id="ef-ptype" name="projectType" defaultValue="">
            <option value="">— select —</option>
            {rfq.projectTypeOptions.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      ) : null}

      {rfq?.scale ? (
        <div className="field">
          <label htmlFor="ef-scale">Quantity / project scale</label>
          <input id="ef-scale" name="scale" type="text" placeholder="e.g. 12 treatment rooms, one container" />
        </div>
      ) : null}

      {subject ? null : (
        <div className="field">
          <label htmlFor="ef-subject">Subject</label>
          <input id="ef-subject" name="subject" type="text" />
        </div>
      )}

      <div className="field">
        <label htmlFor="ef-message">How can we help?</label>
        <textarea id="ef-message" name="message" rows={4} required />
      </div>

      {/* honeypot — hidden from humans, tempting to bots */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}>
        <label htmlFor="ef-company">Company</label>
        <input id="ef-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <label className="consent">
        <input type="checkbox" name="consent" required />
        <span>
          I agree that Kairali may use my details to respond to this enquiry, as described in the{" "}
          <a href={privacyHref}>privacy policy</a>.
        </span>
      </label>

      {error ? <p className="enquiry-error" role="alert">{error}</p> : null}

      <button className="btn btn-primary" type="submit" data-cta={submitCta} disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}
