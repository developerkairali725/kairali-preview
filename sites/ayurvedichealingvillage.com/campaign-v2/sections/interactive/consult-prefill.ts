// ConsultBar → Enquiry handoff in the same page view (with JavaScript). The ConsultBar dispatches a
// cancelable "lp-consult-prefill" event on window; a mounted Enquiry calls preventDefault() to say
// "handled", fills step 1, scrolls to #enquiry and focuses the step heading. If nobody handled it
// (Enquiry not hydrated yet), the ConsultBar falls back to a URL navigation that Enquiry reads on mount.
//
// form_start must fire once per page view whichever form the visitor touches first.

export const PREFILL_EVENT = "lp-consult-prefill";
export const PREFILL_KEYS = ["program", "month", "length", "channel"] as const;
export type Prefill = Partial<Record<(typeof PREFILL_KEYS)[number], string>>;

let started = false;
/** true the first time it is called in this page view, false afterwards. */
export function claimFormStart(): boolean {
  if (started) return false;
  started = true;
  return true;
}

/**
 * The address without the ConsultBar's own keys (path + remaining query + hash), or null when there were
 * none. The live routes' consent runtime only measures allow-listed URL parameters. Pure.
 */
export function withoutPrefillParams(href: string): string | null {
  try {
    const url = new URL(href);
    let changed = false;
    for (const k of PREFILL_KEYS) {
      if (url.searchParams.has(k)) { url.searchParams.delete(k); changed = true; }
    }
    return changed ? url.pathname + url.search + url.hash : null;
  } catch {
    return null;
  }
}

/** Only the known keys, as short strings. */
export function pickPrefill(get: (k: string) => string | null | undefined): Prefill {
  const out: Prefill = {};
  for (const k of PREFILL_KEYS) {
    const v = get(k);
    if (typeof v === "string" && v && v.length <= 80) out[k] = v;
  }
  return out;
}

// ── Live campaign form (one step, no program/month/length fields) ─────────────────────────────────
// The bar's answers cannot map to fields, so they go into the "How can we help?" textarea as editable
// lines. Only values that are one of the bar's own options are written (labels, not raw values).

export type PrefillOption = { value: string; label: string };
export type PrefillLabels = Partial<Record<(typeof PREFILL_KEYS)[number], readonly PrefillOption[]>>;
const LINE_LABELS: Record<(typeof PREFILL_KEYS)[number], string> = {
  program: "Program", month: "Preferred month", length: "Length of stay", channel: "Reply on",
};

/** "Program: X\nPreferred month: Y\nLength of stay: Z\n" (plus "Reply on: …" when the bar had a channel). Pure. */
export function prefillLines(p: Prefill, labels: PrefillLabels): string {
  let out = "";
  for (const k of PREFILL_KEYS) {
    const v = p[k];
    if (!v) continue;
    const opt = labels[k]?.find((o) => o.value === v);
    if (opt) out += `${LINE_LABELS[k]}: ${opt.label}\n`;
  }
  return out;
}

const PREFILL_LINE = new RegExp(`^(?:${Object.values(LINE_LABELS).join("|")}): .*$`);

/** Put a new prefill block at the top of the textarea, replacing an earlier block; the visitor's own text stays. Pure. */
export function mergePrefill(current: string, block: string): string {
  const lines = current.split("\n");
  let i = 0;
  while (i < lines.length && PREFILL_LINE.test(lines[i])) i++;
  const rest = lines.slice(i).join("\n");
  return block + rest;
}
