"use client";

import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from "react";
import type { CampaignConfig, Channel, Variant } from "../../kit/types.ts";
import {
  CONSENT_FIELD, DEFAULT_CHANNEL, isChannel, isRequired, validateStep,
  type FieldError, type FormValues, type ResolvedField, type ResolvedSchema,
} from "../../forms/schema.ts";
import { getAdapter, keepTokenAfterEdit, MSG_NETWORK, type ProductionFormContext, type SubmitResult } from "../../forms/adapter.ts";
import { track } from "../../integrations/track.ts";
import { readTracking } from "../../../campaign-v110/lib/enquiry/tracking.ts";
import { contact } from "../../../campaign-v110/lib/site.ts";
import { PREFILL_EVENT, claimFormStart, mergePrefill, pickPrefill, prefillLines, withoutPrefillParams, type Prefill, type PrefillLabels } from "./consult-prefill.ts";
import Success from "./Success";
import type { FormUi } from "../../production/ui.ts";

// The enquiry shell (spec §6, §7, §7b). Fields come from the schema; this shell owns validation display,
// focus, honeypot, consent, the measurement events and the submit states. A one-step schema (the default
// live campaign form) renders without the progress bar, step count or Back; the 3-step form keeps them.
//
// No-JS: the server HTML is a real <form method="post" action="/api/lead/"> whose later steps a <noscript>
// style reveals, with native `required` validation. /api/lead/ accepts JSON only today, so the native post
// needs the form-encoded acceptance from build spec §7 (backend follow-up). With JS, submit is prevented and
// the adapter posts JSON.
//
// `production` (the live ad routes): the existing form contract instead. No-JS posts go to
// /api/forms-unavailable (never reads the body), the "ahv-production" adapter builds the request itself from
// the consent-aware attribution (so nothing is written to sessionStorage here), ConsultBar answers are removed
// from the address bar once read (the consent runtime measures only allow-listed URLs), and success is the
// plain received line: public/design/lead-receipt.js then hands the visitor to /thanks/.

export type EnquiryFormProps = {
  schema: ResolvedSchema;
  adapterId?: string;
  campaign: Pick<CampaignConfig, "tracking">;
  variant: Variant;
  locale: string;
  /** Validated edge country (route.ts), sent only as the lead row's `country`. */
  country?: string;
  privacyHref: string;
  /** Option labels for ConsultBar answers that have no field in this schema (written into the message textarea). */
  prefillLabels?: PrefillLabels;
  /** Disabled when this route has no ConsultBar; query strings and events must not add answers. */
  prefillEnabled?: boolean;
  /** Live ad routes only: the route's existing form identity (forms/adapter.ts). */
  production?: ProductionFormContext;
  /** Live ad routes only: the page language's interface words (production/ui.ts). Absent = the English below. */
  ui?: FormUi;
};

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "error"; result: Extract<SubmitResult, { status: "error" }> }
  | { kind: "done"; ref: string; channel: Channel };

const NOSCRIPT_CSS = ".lp-enq__step[hidden]{display:flex!important}.lp-enq__js{display:none!important}.lp-enq__progress{display:none}";

function initialValues(schema: ResolvedSchema): FormValues {
  const v: FormValues = { [CONSENT_FIELD]: false, marketing: false, honeypot: "" };
  for (const s of schema.steps) for (const f of s.fields) v[f.name] = f.defaultValue;
  if (!isChannel(v.channel)) v.channel = DEFAULT_CHANNEL;
  return v;
}

function uuid(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === "function") return c.randomUUID();
  const b = new Uint8Array(16);
  c.getRandomValues(b);
  b[6] = (b[6] & 0x0f) | 0x40; b[8] = (b[8] & 0x3f) | 0x80;
  const h = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

export default function EnquiryForm({ schema, adapterId, campaign, variant, locale, country, privacyHref, prefillLabels, prefillEnabled = true, production, ui }: EnquiryFormProps) {
  // A page language other than English replaces the validation messages by field, then by code (production/ui.ts).
  const say = (e: FieldError) => ui?.errors[e.field === "fullName" ? "name" : e.field] ?? ui?.errors[e.code] ?? e.message;
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;
  const formId = schema.id;
  const last = schema.steps.length - 1;
  const single = schema.steps.length === 1;
  // The textarea that receives ConsultBar answers when the schema has no program/month/length fields.
  const noteField = schema.steps.flatMap((s) => s.fields).find((f) => f.type === "textarea" && f.mapsTo === "message")?.name;

  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<FormValues>(() => initialValues(schema));
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  // What to focus after the next render: a step heading, the first invalid field, or the submit message.
  const [focus, setFocus] = useState<{ to: "heading" | "field" | "message"; key: string; scroll?: boolean } | null>(null);

  const token = useRef<string | null>(null);
  const lastError = useRef<SubmitResult | null>(null);
  const leadFired = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const headings = useRef<(HTMLHeadingElement | null)[]>([]);
  const messageRef = useRef<HTMLDivElement>(null);

  const channel: Channel = isChannel(values.channel) ? values.channel : DEFAULT_CHANNEL;
  const fieldsByName = useRef(new Map<string, ResolvedField>());
  fieldsByName.current = new Map(schema.steps.flatMap((s) => s.fields.map((f) => [f.name, f] as const)));

  /** Prefill values must match an option of the field they target; anything else is ignored. */
  const applyPrefill = useCallback((p: Prefill) => {
    if (!prefillEnabled) return;
    setValues((prev) => {
      const next = { ...prev };
      const unmapped: Prefill = {};
      for (const [k, v] of Object.entries(p) as [keyof Prefill, string | undefined][]) {
        const f = fieldsByName.current.get(k);
        if (typeof v !== "string") continue;
        if (!f) { unmapped[k] = v; continue; }
        if (f.options && !f.options.some((o) => o.value === v)) continue;
        next[k] = v;
      }
      // Live campaign form: "Program: …\nPreferred month: …\nLength of stay: …" at the top of the message, editable.
      if (noteField && prefillLabels) {
        const block = prefillLines(unmapped, prefillLabels);
        if (block) next[noteField] = mergePrefill(typeof prev[noteField] === "string" ? (prev[noteField] as string) : "", block);
      }
      return next;
    });
  }, [noteField, prefillLabels, prefillEnabled]);

  const startOnce = useCallback(() => {
    if (claimFormStart()) track("form_start", { form_id: formId, variant });
  }, [formId, variant]);

  // Mount: progressive enhancement on, ConsultBar answers from the query string (no-JS bar or a fallback).
  useEffect(() => {
    setHydrated(true);
    if (!prefillEnabled) return;
    try {
      const q = new URLSearchParams(window.location.search);
      const p = pickPrefill((k) => q.get(k));
      if (Object.keys(p).length) applyPrefill(p);
      if (production) {
        const clean = withoutPrefillParams(window.location.href);
        if (clean !== null) window.history.replaceState(window.history.state, "", clean);
      }
    } catch { /* no URL access */ }
  }, [applyPrefill, production, prefillEnabled]);

  // Same-page ConsultBar submit (consult-prefill.ts).
  useEffect(() => {
    if (!prefillEnabled) return;
    const onPrefill = (e: Event) => {
      e.preventDefault(); // "handled" — the ConsultBar does not fall back to a navigation
      const detail = (e as CustomEvent<Prefill>).detail ?? {};
      if (status.kind === "done") {
        setFocus({ to: "heading", key: "done", scroll: true });
        return;
      }
      applyPrefill(detail);
      setErrors([]);
      setStep(0);
      setFocus({ to: "heading", key: "0", scroll: true });
    };
    window.addEventListener(PREFILL_EVENT, onPrefill);
    return () => window.removeEventListener(PREFILL_EVENT, onPrefill);
  }, [applyPrefill, status.kind, prefillEnabled]);

  // Move focus after the DOM reflects the new step / errors / message.
  useEffect(() => {
    if (!focus) return;
    let el: HTMLElement | null = null;
    if (focus.to === "heading") {
      el = focus.key === "done" ? document.getElementById(id("done")) : headings.current[Number(focus.key)] ?? null;
    } else if (focus.to === "message") {
      el = messageRef.current;
    } else {
      const f = fieldsByName.current.get(focus.key);
      if (f?.type === "channel" || f?.type === "radio") {
        el = formRef.current?.querySelector<HTMLElement>(`input[name="${f.name}"]:checked`)
          ?? formRef.current?.querySelector<HTMLElement>(`input[name="${f.name}"]`) ?? null;
      } else {
        el = document.getElementById(id(focus.key));
      }
    }
    if (el) {
      if (focus.scroll) {
        const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        document.getElementById("enquiry")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        el.focus({ preventScroll: true });
      } else {
        el.focus();
      }
    }
    setFocus(null);
    // id() is stable for the component's life
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus]);

  const set = (name: string, v: string | boolean) => {
    setValues((prev) => ({ ...prev, [name]: v }));
    if (errors.some((e) => e.field === name)) setErrors((prev) => prev.filter((e) => e.field !== name));
    if (status.kind === "error") setStatus({ kind: "idle" });
    // As the live form (onInput): an edit after a failed attempt is a new enquiry, so it gets a new token.
    // Except after 502 SHEET_SYNC_FAILED: the row is stored, and the retry must return it (adapter.ts).
    if (status.kind !== "submitting" && lastError.current && !keepTokenAfterEdit(lastError.current)) {
      token.current = null;
      lastError.current = null;
    }
  };

  const showErrors = (errs: FieldError[]) => {
    setErrors(errs);
    for (const e of errs) track("form_error", { form_id: formId, field: e.field, code: e.code });
    setFocus({ to: "field", key: errs[0].field });
  };

  const onContinue = () => {
    const errs = validateStep(schema, step, values, channel);
    if (errs.length) return showErrors(errs);
    setErrors([]);
    track("form_step_complete", { form_id: formId, step: step + 1 });
    const next = Math.min(last, step + 1);
    setStep(next);
    setFocus({ to: "heading", key: String(next) });
  };

  const onBack = () => {
    setErrors([]);
    const prev = Math.max(0, step - 1);
    setStep(prev);
    setFocus({ to: "heading", key: String(prev) });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status.kind === "submitting" || status.kind === "done") return;
    if (step < last) return onContinue(); // Enter inside an earlier step
    const errs = validateStep(schema, step, values, channel);
    if (errs.length) return showErrors(errs);
    setErrors([]);
    startOnce();
    track("form_submit_attempt", { form_id: formId });
    setStatus({ kind: "submitting" });
    token.current = token.current ?? uuid();
    let result: SubmitResult;
    try {
      result = await getAdapter(adapterId).submit(values, {
        schema, campaign, variant, locale, country, token: token.current,
        // Production reads the consent-aware attribution itself; readTracking() would persist the URL values.
        tracking: production ? {} : readTracking(), pageUrl: window.location.href, referrer: document.referrer,
        ...(production ? { production } : {}),
      });
    } catch {
      result = { status: "error", code: "network", message: MSG_NETWORK };
    }
    if (result.status === "received") {
      lastError.current = null;
      // As the live form: a same-origin guide the server offers downloads at once (adapter.ts safeGuideUrl).
      if (result.guideUrl) {
        try {
          const a = document.createElement("a");
          a.href = result.guideUrl; a.download = ""; a.hidden = true;
          document.body.appendChild(a); a.click(); a.remove();
        } catch { /* the success screen still shows */ }
      }
      // generate_lead fires ONLY here: a live, confirmed store in this page view, once.
      if (!leadFired.current) {
        leadFired.current = true;
        track("generate_lead", { form_id: formId, transaction_id: result.token, ref: result.ref });
      }
      setStatus({ kind: "done", ref: result.ref, channel });
      return;
    }
    lastError.current = result;
    track("form_submit_failed", { form_id: formId, status: String(result.httpStatus ?? result.code) });
    setStatus({ kind: "error", result });
    setFocus({ to: "message", key: "message" });
  };

  if (status.kind === "done") {
    return (
      <div className="lp-enq__card">
        <Success channel={status.channel} refCode={status.ref} headingId={id("done")} successText={schema.successText} plain={!!production} />
      </div>
    );
  }

  const errFor = (name: string) => errors.find((e) => e.field === name);
  const describedBy = (name: string, hint?: boolean) =>
    [hint ? id(`${name}-hint`) : "", errFor(name) ? id(`${name}-err`) : ""].filter(Boolean).join(" ") || undefined;

  const renderField = (f: ResolvedField) => {
    const req = isRequired(f, channel);
    const label = !req && f.optionalLabel ? f.optionalLabel : f.label;
    const err = errFor(f.name);
    const val = typeof values[f.name] === "string" ? (values[f.name] as string) : "";
    const errEl = err ? <p id={id(`${f.name}-err`)} className="lp-enq__err">{say(err)}</p> : null;
    const hintEl = f.hint ? <p id={id(`${f.name}-hint`)} className="lp-enq__hint">{f.hint}</p> : null;

    if (f.type === "channel" || f.type === "radio") {
      return (
        <fieldset key={f.name} className={`lp-enq__group${f.type === "channel" ? " lp-enq__group--channel" : ""}`}
          aria-describedby={describedBy(f.name, !!f.hint)} aria-invalid={err ? true : undefined}>
          <legend className="lp-enq__label">{label}</legend>
          <div className="lp-enq__tiles">
            {(f.options ?? []).map((o) => (
              <label key={o.value} className="lp-enq__tile">
                <input type="radio" name={f.name} value={o.value} checked={val === o.value} required={req}
                  aria-invalid={err ? true : undefined} aria-describedby={err ? id(`${f.name}-err`) : undefined}
                  onChange={() => {
                    set(f.name, o.value);
                    if (f.type === "channel") track("channel_select", { channel: o.value });
                  }} />
                <span>{o.label}</span>
              </label>
            ))}
          </div>
          {hintEl}
          {errEl}
        </fieldset>
      );
    }
    const common = {
      id: id(f.name), name: f.name, required: req, maxLength: f.maxLength,
      "aria-invalid": err ? true : undefined, "aria-describedby": describedBy(f.name, !!f.hint),
    } as const;
    return (
      <div key={f.name} className={`lp-enq__field lp-enq__field--${f.type} lp-enq__field--name-${f.name}`}>
        <label className="lp-enq__label" htmlFor={id(f.name)}>{label}</label>
        {f.type === "select" ? (
          <select {...common} value={val} onChange={(e) => set(f.name, e.target.value)}>
            {(f.options ?? []).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        ) : f.type === "textarea" ? (
          <textarea {...common} rows={f.rows ?? 3} value={val} placeholder={f.placeholder}
            onChange={(e) => set(f.name, e.target.value)} />
        ) : (
          <input {...common} type={f.type} value={val} pattern={f.pattern} autoComplete={f.autocomplete} placeholder={f.placeholder}
            inputMode={f.type === "tel" ? "tel" : f.type === "email" ? "email" : undefined}
            onChange={(e) => set(f.name, e.target.value)} />
        )}
        {hintEl}
        {errEl}
      </div>
    );
  };

  const consentErr = errFor(CONSENT_FIELD);
  const submitting = status.kind === "submitting";
  const waHref = `https://wa.me/${contact.whatsapp.number}`;

  return (
    <div className="lp-enq__card">
      <noscript><style>{NOSCRIPT_CSS}</style></noscript>
      <form ref={formRef} className="lp-enq__form" method="post" action={production ? "/api/forms-unavailable" : "/api/lead/"} noValidate={hydrated}
        onSubmit={onSubmit} onFocus={startOnce} onChange={startOnce} aria-label={ui?.formAria ?? "Free doctor consultation enquiry"}>
        {single ? null : (
          <ol className="lp-enq__progress" aria-hidden="true">
            {schema.steps.map((s, i) => (
              <li key={s.id} className={i <= step ? "is-on" : undefined}>{i + 1} · {s.short}</li>
            ))}
          </ol>
        )}

        {schema.steps.map((s, i) => (
          <fieldset key={s.id} className="lp-enq__step" hidden={i !== step}>
            <legend className="lp-enq__legend">
              {single ? null : <span className="lp-enq__count">{(ui?.stepOf ?? "Step {i} of {n}").replace("{i}", String(i + 1)).replace("{n}", String(schema.steps.length))}</span>}
              <h3 className="lp-enq__title" tabIndex={-1} ref={(el) => { headings.current[i] = el; }}>{s.title}</h3>
            </legend>
            {s.intro ? <p className="lp-enq__intro-line">{s.intro}</p> : null}
            <div className={`lp-enq__fields lp-enq__fields--${s.id}`}>{s.fields.map(renderField)}</div>

            {i === last ? (
              <div className="lp-enq__checks">
                <div className="lp-enq__check-wrap">
                  <label className="lp-enq__check">
                    <input type="checkbox" id={id(CONSENT_FIELD)} name="consent" value="true" required
                      checked={values[CONSENT_FIELD] === true} onChange={(e) => set(CONSENT_FIELD, e.target.checked)}
                      aria-invalid={consentErr ? true : undefined} aria-describedby={consentErr ? id(`${CONSENT_FIELD}-err`) : undefined} />
                    <span>{schema.consentLabels[channel]}</span>
                  </label>
                  {/* Legal links remain outside the consent label; production shares one wrapping row. */}
                  {production ? (
                    <div className="lp-enq__legal-links">
                      <a className="lp-enq__privacy" href={production ? "/new-privacy-policy/" : privacyHref} target="_blank" rel="noopener">{schema.privacyLabel}</a>
                      <span aria-hidden="true">·</span>
                      {production ? <a className="lp-enq__privacy" href="/terms-and-conditions/" target="_blank" rel="noopener">{ui?.terms ?? "Terms"}</a> : null}
                    </div>
                  ) : <a className="lp-enq__privacy" href={privacyHref} target="_blank" rel="noopener">{schema.privacyLabel}</a>}
                  {consentErr ? <p id={id(`${CONSENT_FIELD}-err`)} className="lp-enq__err">{say(consentErr)}</p> : null}
                </div>
                {schema.marketingOptIn ? (
                  <label className="lp-enq__check lp-enq__check--optional">
                    <input type="checkbox" name="marketing" value="true" checked={values.marketing === true}
                      onChange={(e) => set("marketing", e.target.checked)} />
                    <span>Optional: send me occasional news and offers.</span>
                  </label>
                ) : null}
                {/* Honeypot: visually hidden (not display:none, so bots still fill it), out of the tab order and AT.
                    A neutral name and an unrecognised autocomplete token keep browser autofill and password
                    managers from filling it for real visitors. Rejected client-side (kit/lead.ts); a server-side
                    check is a backend follow-up. */}
                <div className="lp-enq__hp" aria-hidden="true">
                  <label htmlFor={id("lp_hp_ref")}>{ui?.honeypot ?? "Leave this empty"}</label>
                  <input id={id("lp_hp_ref")} type="text" name="lp_hp_ref" tabIndex={-1} autoComplete="nope-lp"
                    value={typeof values.honeypot === "string" ? values.honeypot : ""} onChange={(e) => set("honeypot", e.target.value)} />
                </div>
              </div>
            ) : null}

            <div className={`lp-enq__nav${i === 0 ? " lp-enq__nav--first" : ""}`}>
              {i > 0 ? <button type="button" className="lp-btn lp-btn--line lp-enq__back lp-enq__js" onClick={onBack}>{ui?.back ?? "Back"}</button> : null}
              {i < last ? (
                <button type="button" className="lp-btn lp-btn--primary lp-enq__next lp-enq__js" onClick={onContinue}>{ui?.next ?? "Continue"}</button>
              ) : (
                <button type="submit" className="lp-btn lp-btn--primary lp-enq__next" disabled={submitting} aria-disabled={submitting || undefined}>
                  {submitting ? (ui?.sending ?? "Sending…") : schema.submitLabel}
                </button>
              )}
            </div>
            {/* A form with an optional health question (family route) carries its own note as that field's hint instead. */}
            {i === 0 && schema.genericNote !== false ? <p className="lp-enq__note">{ui?.note ?? "No medical details needed. Your doctor asks for those privately at consultation."}</p> : null}
          </fieldset>
        ))}

        {status.kind === "error" ? (
          <div className="lp-enq__msg" role="alert" tabIndex={-1} ref={messageRef}>
            <p>{status.result.message}</p>
            <p className="lp-enq__msg-links">
              <a href={waHref} target="_blank" rel="noopener noreferrer" data-track="cta_click" data-track-cta="whatsapp" data-track-position="section">WhatsApp {contact.whatsapp.display}</a>
              <a href={`mailto:${contact.email}`} data-track="cta_click" data-track-cta="email" data-track-position="section">{contact.email}</a>
            </p>
          </div>
        ) : null}
      </form>
    </div>
  );
}
