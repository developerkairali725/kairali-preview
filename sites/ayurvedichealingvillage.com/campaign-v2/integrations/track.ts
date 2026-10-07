// track(): the single choke point for every /lp-v2 measurement event.
//   1. drop events not in EVENTS, params not declared for the event, and anything that looks like PII;
//   2. push { event, ...params } to window.dataLayer (GTM-ready);
//   3. fan out to every adapter whose slot is filled, skipping non-Consent-Mode tools in the EU/UK until
//      a granted choice is stored;
//   4. with ?lp_debug=1, console.info "[lp-track] <event> {params} → [adapters]" (also when tracking is off).
// SSR-safe (no window → no-op) and never throws.
//
// Live ad routes (<html data-lp-surface="production">) replace steps 2 and 3: the site's own consented
// runtime (window.AHV_MEASUREMENT, app/(english)/_families/consent-runtime.ts) is the only sink. Nothing is
// pushed to dataLayer and no kit adapter runs; PRODUCTION_INTERACTIONS maps the few kit events the live
// page already reported, and every other event is dropped. The lead conversion stays with
// public/design/lead-receipt.js, which observes the confirmed /api/lead/ response, so generate_lead is a no-op.

import { EVENTS, isEventName, type EventName, type EventParams } from "./events.ts";
import type { BrowserSlots as Slots } from "./slots.ts";
import { consentAllowsNonCm } from "./consent.ts";
export { consentAllowsNonCm, consentRequired, mayPersist } from "./consent.ts";
import type { Adapter, CleanParams, LpWindow } from "./adapters/shared.ts";
import { ADAPTERS } from "./adapters/index.ts";

const EMAIL = /[^\s@]+@[^\s@]+\.[^\s@]+/;
const INTL_PHONE_IN_TEXT = /(^|[^\w])\+\d[\d\s().-]{6,}\d/;
const MAX_LEN = 120;

/** Defensive scrub: true when a value looks like an email address or a phone number. */
export function looksLikePii(v: unknown): boolean {
  if (typeof v === "number") return Math.abs(Math.trunc(v)).toString().length >= 7;
  if (typeof v !== "string") return false;
  if (EMAIL.test(v)) return true;
  const compact = v.replace(/[\s().-]/g, "");
  if (/^\+?\d{7,15}$/.test(compact)) return true;
  return INTL_PHONE_IN_TEXT.test(v);
}

/** Keep only params declared for the event whose values are short scalars and not PII. */
export function cleanParams(event: EventName, params: EventParams | undefined): CleanParams {
  const out: CleanParams = {};
  if (!params || typeof params !== "object") return out;
  const allowed: readonly string[] = EVENTS[event].params;
  for (const k of allowed) {
    const v = params[k];
    if (v === undefined || v === null) continue;
    if (typeof v !== "string" && typeof v !== "number" && typeof v !== "boolean") continue;
    if (typeof v === "string" && (!v || v.length > MAX_LEN)) continue;
    if (looksLikePii(v)) continue;
    out[k] = v;
  }
  return out;
}

/** Kit event → the live page's existing interaction diagnostic (name, target). Anything not listed is dropped. */
export const PRODUCTION_INTERACTIONS: Partial<Record<EventName, readonly [string, string]>> = {
  form_start: ["form_start", "enquiry"],
  film_play: ["video_open", "video"],
};

/** true on the live ad routes: production/Document.tsx sets <html data-lp-surface="production">. */
export function isProductionSurface(w: LpWindow): boolean {
  try {
    return w.document?.documentElement?.getAttribute("data-lp-surface") === "production";
  } catch {
    return false;
  }
}

export function debugOn(w: LpWindow): boolean {
  try {
    return new URLSearchParams(w.location?.search ?? "").get("lp_debug") === "1";
  } catch {
    return false;
  }
}

export type TrackerDeps = {
  getWindow: () => LpWindow | undefined;
  adapters: readonly Adapter[];
  log: (line: string) => void;
};

/** Returns the adapter ids reached (useful for tests and the debug line). */
export function createTracker(deps: TrackerDeps) {
  return function track(event: EventName, params?: EventParams): string[] {
    const reached: string[] = [];
    try {
      const w = deps.getWindow();
      if (!w) return reached;
      const debug = debugOn(w);
      if (!isEventName(event)) {
        if (debug) deps.log(`[lp-track] dropped unknown event ${JSON.stringify(String(event))}`);
        return reached;
      }
      const clean = cleanParams(event, params);
      if (isProductionSurface(w)) {
        const mapped = PRODUCTION_INTERACTIONS[event];
        if (mapped) {
          try {
            if (w.AHV_MEASUREMENT?.recordInteraction?.(mapped[0], mapped[1]) === true) reached.push("ahv-measurement");
          } catch { /* measurement never breaks the page */ }
        }
        if (debug) deps.log(`[lp-track] ${event} ${JSON.stringify(clean)} → [${reached.join(", ")}] (production)`);
        return reached;
      }
      try {
        w.dataLayer = w.dataLayer || [];
        w.dataLayer.push({ event, ...clean });
      } catch { /* a broken dataLayer must not stop the adapters */ }
      // Slots come from the server via the loader (window.__lpSlots). No loader = tracking off = no adapters.
      const slots: Slots | undefined = w.__lpSlots;
      if (slots && slots.enabled) {
        const nonCmOk = consentAllowsNonCm(w);
        for (const a of deps.adapters) {
          try {
            if (!a.enabled(slots)) continue;
            if (!a.consentMode && !nonCmOk) continue;
            a.send(event, clean, slots, w);
            reached.push(a.id);
          } catch { /* one failing vendor never breaks the others */ }
        }
      }
      if (debug) deps.log(`[lp-track] ${event} ${JSON.stringify(clean)} → [${reached.join(", ")}]`);
    } catch { /* never throw into UI code */ }
    return reached;
  };
}

export const track = createTracker({
  getWindow: () => (typeof window === "undefined" ? undefined : (window as unknown as LpWindow)),
  adapters: ADAPTERS,
  log: (line) => { try { console.info(line); } catch { /* no console */ } },
});
