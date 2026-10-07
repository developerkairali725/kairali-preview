// Render-time placeholder resolution (guide §2: "the preview renders it as a visible [placeholder]").
//
// Authors may put pending() into ANY string slot (the template casts one into every field). Most sections
// render strings raw, and React throws "Objects are not valid as a React child" on a Pending object, so the
// page would 500. resolvePlaceholders() runs once, centrally (route.ts loadRoute and generateMetadata), and
// turns every Pending in a string slot into the visible text "[id]".
//
// Slots typed Maybe<…> keep their Pending object, because their sections render it on purpose
// (structural placeholders): fees, offer, faq[].a and the doctor registry fields. `form` is code, left as is.
// Only plain objects and arrays are walked; anything else (functions, class instances) is passed through.
import type { CampaignConfig } from "./types.ts";
import { isPending } from "./pending.ts";

export const placeholderText = (id: string): string => `[${id}]`;

function deep(v: unknown): unknown {
  if (isPending(v)) return placeholderText(v.id);
  if (Array.isArray(v)) return v.map(deep);
  if (v && typeof v === "object" && [Object.prototype, null].includes(Object.getPrototypeOf(v))) {
    const out: Record<string, unknown> = {};
    for (const [k, x] of Object.entries(v)) out[k] = deep(x);
    return out;
  }
  return v;
}

/** A copy of the campaign that is safe to render: no Pending object remains outside the structural slots. */
export function resolvePlaceholders(c: CampaignConfig): CampaignConfig {
  const r = deep({ ...c, fees: null, offer: null, doctors: [], faq: [], form: undefined }) as CampaignConfig;
  r.fees = c.fees;
  r.offer = c.offer;
  r.doctors = c.doctors;
  r.faq = c.faq.map((f) => ({ q: deep(f.q) as string, a: f.a }));
  if (c.form) r.form = c.form; else delete r.form; // code, not copy: never rewritten
  return r;
}
