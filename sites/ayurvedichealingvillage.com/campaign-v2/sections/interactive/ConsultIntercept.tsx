"use client";

import type { FormEvent, MouseEvent, ReactNode } from "react";
import { track } from "../../integrations/track.ts";
import { PREFILL_EVENT, claimFormStart, pickPrefill } from "./consult-prefill.ts";

/**
 * The <form> element of ConsultForm (ConsultBar / hero card), with the JavaScript submit intercept.
 * The fields stay server-rendered children. Without JS this is the plain GET form to #enquiry.
 *
 * With JS: no navigation. The answers go to the Enquiry over the "lp-consult-prefill" event, which scrolls
 * to #enquiry and focuses the step heading. cta_click is already sent by the submit button's data-track
 * (integrations/dom.ts), so it is not repeated here; form_start fires once per page view.
 *
 * `production`: on the live ad routes the fallback never writes the answers into the URL. The site's consent
 * runtime only starts measurement on URLs whose every parameter is an allow-listed attribution value, so extra
 * parameters would silently drop the lead conversion. The fallback only moves to the form.
 */
export default function ConsultIntercept({ className, label, variant, formId, production = false, children }:
  { className: string; label: string; variant: string; formId: string; production?: boolean; children: ReactNode }) {
  const handoff = (data: FormData) => {
    const detail = pickPrefill((k) => {
      const v = data.get(k);
      return typeof v === "string" ? v : null;
    });
    if (claimFormStart()) track("form_start", { form_id: formId, variant });
    let handled = false;
    try {
      handled = !window.dispatchEvent(new CustomEvent(PREFILL_EVENT, { detail, cancelable: true }));
    } catch { /* fall through to the URL handoff */ }
    if (handled) return;
    if (production) {
      window.location.hash = "enquiry";
      return;
    }
    // Enquiry not ready: hand over through the URL it reads on mount, keeping the landing query (gclid, utm_*).
    try {
      const url = new URL(window.location.href);
      for (const [k, v] of Object.entries(detail)) if (v) url.searchParams.set(k, v);
      url.hash = "enquiry";
      window.location.assign(url.toString());
    } catch {
      window.location.hash = "enquiry";
    }
  };
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handoff(new FormData(e.currentTarget));
  };
  if (production) {
    // A real fragment link works before hydration and with JavaScript disabled. A native GET form
    // would serialize health interests into the URL and replace the existing ad attribution.
    const onClick = (e: MouseEvent<HTMLDivElement>) => {
      if (!(e.target instanceof Element) || !e.target.closest("[data-consult-trigger]")) return;
      e.preventDefault();
      const data = new FormData();
      e.currentTarget.querySelectorAll<HTMLInputElement | HTMLSelectElement>("input[name], select[name]")
        .forEach((field) => data.append(field.name, field.value));
      handoff(data);
    };
    return <div className={className} role="group" aria-label={label} onClick={onClick}>{children}</div>;
  }
  return (
    <form className={className} action="#enquiry" method="get" aria-label={label} onSubmit={onSubmit}>
      {children}
    </form>
  );
}
