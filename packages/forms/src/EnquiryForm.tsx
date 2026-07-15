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
};

export function EnquiryForm({
  site,
  formType = "enquiry",
  action = "/api/enquiry",
  privacyHref = "/privacy",
  subject,
  heading = "Send an enquiry",
  submitLabel = "Send enquiry",
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
          message: fd.get("message"),
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

      <button className="btn btn-primary" type="submit" data-cta="enquiry_submit" disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}
