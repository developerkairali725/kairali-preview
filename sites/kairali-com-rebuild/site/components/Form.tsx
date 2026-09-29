"use client";
import { useEffect, useRef, useState } from "react";
import type { Field, FormSchema } from "@/lib/forms";

type Errors = Record<string, string>;
type Status = "idle" | "error" | "sending" | "preview";
const DIGITS = /^[0-9+\-\s()]{5,}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(fields: Field[], data: FormData): Errors {
  const e: Errors = {};
  for (const f of fields) {
    if (f.type === "heading") continue;
    const values = data.getAll(f.name).map((v) => (typeof v === "string" ? v.trim() : v.size ? v.name : ""));
    const has = values.some(Boolean);
    if (f.required && !has) { e[f.name] = f.requiredMsg || `Please enter ${f.label.toLowerCase()}`; continue; }
    const v = String(values[0] ?? "");
    if (v && f.pattern === "email" && !EMAIL.test(v)) e[f.name] = f.formatMsg || "Please provide a valid email";
    if (v && f.pattern === "digits" && !(f.type === "number" ? /^\d{1,3}$/.test(v) : DIGITS.test(v))) e[f.name] = f.formatMsg || "Enter only Numbers";
  }
  return e;
}

export default function Form({ schema, preset = {}, compact = false, formName }: { schema: FormSchema; preset?: Record<string, string | string[]>; compact?: boolean; formName?: string }) {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const summaryRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const id = (n: string) => `${schema.id}-${n}`;
  const [focusTick, setFocusTick] = useState(0);
  useEffect(() => {
    if (!focusTick) return;
    if (status === "error") summaryRef.current?.focus();
    if (status === "preview") statusRef.current?.focus();
  }, [focusTick, status]);

  function onSubmit(ev: { preventDefault(): void; currentTarget: HTMLFormElement }) {
    ev.preventDefault();
    const data = new FormData(ev.currentTarget);
    if (String(data.get("website") || "")) return; // honeypot: silently ignore automated fills
    const e = validate(schema.fields, data);
    setErrors(e);
    if (Object.keys(e).length) {
      setStatus("error");
      setFocusTick((t) => t + 1);
      return;
    }
    setStatus("sending");
    // Local build: nothing is transmitted. The preview state below says so explicitly.
    window.setTimeout(() => { setStatus("preview"); setFocusTick((t) => t + 1); }, 500);
  }

  const describedBy = (f: Field) => [f.hint ? id(f.name) + "-hint" : "", errors[f.name] ? id(f.name) + "-err" : ""].filter(Boolean).join(" ") || undefined;
  const pre = (n: string) => preset[n];

  function renderField(f: Field) {
    const err = errors[f.name];
    const common = { id: id(f.name), name: f.name, "aria-invalid": err ? true : undefined, "aria-describedby": describedBy(f), "aria-required": f.required || undefined } as const;
    const label = (<>{f.label}{f.required && <span className="req" aria-hidden="true">*</span>}</>);
    let control: React.ReactNode;
    if (f.type === "textarea") control = <textarea {...common} placeholder={f.placeholder} autoComplete={f.autoComplete} />;
    else if (f.type === "select") control = (
      <select {...common} defaultValue={(pre(f.name) as string) || ""} autoComplete={f.autoComplete}>
        <option value="">--select--</option>
        {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>);
    else if (f.type === "radio" || f.type === "checkboxes" || f.type === "consent") {
      const list = f.type === "consent" ? [f.label] : f.options || [];
      const checked = new Set(([] as string[]).concat((pre(f.name) as string[] | string) || []));
      return (
        <div className={`field${f.full ? " full" : ""}`} key={f.name}>
          <fieldset aria-invalid={err ? true : undefined} aria-describedby={describedBy(f)}>
            {f.type !== "consent" && <legend>{label}</legend>}
            <div className={`choices${f.cols ? " cols" : ""}`}>
              {list.map((o, i) => (
                <label className="choice" key={o}>
                  <input type={f.type === "radio" ? "radio" : "checkbox"} name={f.name} value={f.type === "consent" ? "yes" : o} id={i === 0 ? id(f.name) : undefined} defaultChecked={checked.has(o)} />
                  <span>{f.type === "consent" ? <>I have read and agree to kairali.com <a href="/privacy-policy.aspx">privacy</a> &amp; <a href="/terms-and-conditions.aspx">terms of use</a>.{f.required && <span className="req" aria-hidden="true">*</span>}</> : o}</span>
                </label>))}
            </div>
            {f.hint && <p className="hint" id={id(f.name) + "-hint"}>{f.hint}</p>}
            {err && <p className="error" id={id(f.name) + "-err"}>{err}</p>}
          </fieldset>
        </div>);
    } else if (f.type === "file") control = <input {...common} type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />;
    else control = <input {...common} type={f.type === "number" ? "text" : f.type} inputMode={f.pattern === "digits" ? "numeric" : undefined} placeholder={f.placeholder} autoComplete={f.autoComplete} defaultValue={(pre(f.name) as string) || undefined} />;
    return (
      <div className={`field${f.full ? " full" : ""}`} key={f.name}>
        <label htmlFor={id(f.name)}>{label}</label>
        {control}
        {f.hint && <p className="hint" id={id(f.name) + "-hint"}>{f.hint}</p>}
        {err && <p className="error" id={id(f.name) + "-err"}>{err}</p>}
      </div>);
  }

  const errList = Object.entries(errors);
  return (
    <form className="form" noValidate onSubmit={onSubmit} aria-label={formName || schema.title} data-form={schema.id}>
      {schema.intro && <p className="meta">{schema.intro}</p>}
      {schema.sensitive && (
        <div className="notice" role="note">This consultation form asks for personal health information. It is used only to prepare your consultation with a Kairali physician. It is not an emergency service; if you need urgent medical care, contact your local emergency services.</div>
      )}
      {status === "error" && errList.length > 0 && (
        <div className="form-status error" role="alert" tabIndex={-1} ref={summaryRef}>
          <strong>Please check {errList.length === 1 ? "one field" : `${errList.length} fields`}:</strong>
          <ul>{errList.map(([n, m]) => <li key={n}><a href={`#${id(n)}`}>{m}</a></li>)}</ul>
        </div>)}
      <div className={`form-grid${compact ? "" : " two"}`}>
        {schema.fields.map(renderField)}
      </div>
      <div className="hp" aria-hidden="true"><label htmlFor={id("website")}>Leave this field empty</label><input id={id("website")} name="website" tabIndex={-1} autoComplete="off" /></div>
      <div className="actions">
        <button className="btn" type="submit" disabled={status === "sending"} aria-disabled={status === "sending"}>{status === "sending" ? "Checking…" : schema.submitLabel}</button>
      </div>
      <div aria-live="polite">
        {status === "sending" && <div className="form-status sending">Checking your details…</div>}
        {status === "preview" && (
          <div className="form-status preview" tabIndex={-1} ref={statusRef}>
            <strong>Details checked — not sent.</strong> This is a local preview of the new kairali.com. Form delivery is not connected yet, so nothing has been sent to Kairali and no one will receive this message. For a real enquiry, call <a href="tel:+919555156156">+91-9555156156</a> or email <a href="mailto:info@kairali.com">info@kairali.com</a>.
          </div>)}
      </div>
    </form>
  );
}
