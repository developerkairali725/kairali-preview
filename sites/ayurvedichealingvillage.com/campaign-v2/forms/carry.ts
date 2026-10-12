// No-JS carry-through for the ConsultBar GET form. A native GET submit replaces the page's query string,
// so the ad click ids would be lost; the form re-sends these allow-listed keys as hidden inputs, filled on
// the server from the landing URL. Only these keys, never anything else from the URL.

export const CARRY_KEYS = [
  "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "utm_keyword",
  "gclid", "gbraid", "wbraid", "fbclid",
] as const;
export const CARRY_MAX = 200;

export type SearchParams = Record<string, string | string[] | undefined>;

/** [key, value] pairs to render as hidden inputs, in CARRY_KEYS order. Pure. */
export function carryParams(sp: SearchParams | undefined | null): [string, string][] {
  const out: [string, string][] = [];
  if (!sp || typeof sp !== "object") return out;
  for (const k of CARRY_KEYS) {
    if (!Object.hasOwn(sp, k)) continue;
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v !== "string") continue;
    const s = v.trim().slice(0, CARRY_MAX);
    if (s) out.push([k, s]);
  }
  return out;
}
