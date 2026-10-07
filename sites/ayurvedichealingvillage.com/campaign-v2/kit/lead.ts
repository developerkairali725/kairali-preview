import type { CampaignConfig, Channel, Variant } from "./types.ts";
import { refCode } from "./handoff.ts";

export type LeadAnswers = {
  program: string; month: string; duration: string; party: string; channel: Channel;
  fullName: string; email: string; phone: string; country: string;
  consent: boolean; marketing: boolean; honeypot: string;
  /**
   * Which packed lines the form actually asked about. Omitted = all of them (the three-step form).
   * A single-step schema (the live campaign form) lists only the fields it has, so no empty
   * "Program:" or default "Reply channel:" lines are written.
   */
  packed?: readonly PackedLine[];
  /** Other schema answers as "Label: value" lines (forms/adapter.ts toLeadAnswers). */
  extra?: readonly string[];
  /** The visitor's own text (a textarea mapped to message), verbatim, last. Includes any ConsultBar prefill lines. */
  message?: string;
  /** "full" = whole trimmed name in fname, lname "" (the live campaign form). Default "split" = first word / rest. */
  nameMode?: "full" | "split";
};
export type PackedLine = "program" | "month" | "party" | "channel" | "marketing";
export const ALL_PACKED: readonly PackedLine[] = ["program", "month", "party", "channel", "marketing"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** `Ref: KT-…` first, then the packed answers the form asked about, then extra lines, then the visitor's text. */
export function packMessage(a: LeadAnswers, ref: string): string {
  const on = new Set(a.packed ?? ALL_PACKED);
  const lines = [`Ref: ${ref}`];
  if (on.has("program")) lines.push(`Program: ${a.program}`);
  if (on.has("month")) lines.push(`Preferred month: ${a.month}`);
  if (on.has("party")) lines.push(`Party: ${a.party}`);
  if (on.has("channel")) lines.push(`Reply channel: ${a.channel}`);
  if (on.has("marketing")) lines.push(`Marketing opt-in: ${a.marketing ? "yes" : "no"}`);
  for (const x of a.extra ?? []) lines.push(x);
  const text = (a.message ?? "").trim();
  if (text) lines.push(text);
  return lines.join("\n");
}

export function buildLeadPayload(
  a: LeadAnswers,
  ctx: {
    campaign: CampaignConfig; variant: Variant; token: string; locale: string; tracking: Record<string, string>; pageUrl: string; referrer: string;
    /** The schema id, for form_variant ("<id>-<variant>"). Default "lp-v2-3step". */
    formId?: string;
  },
): { ok: true; body: Record<string, unknown>; ref: string } | { ok: false; reason: "honeypot" | "consent" | "email" | "url" } {
  if (a.honeypot.trim()) return { ok: false, reason: "honeypot" };
  if (!a.consent) return { ok: false, reason: "consent" };
  if (!EMAIL_RE.test(a.email.trim())) return { ok: false, reason: "email" };
  let pathname: string;
  try {
    pathname = new URL(ctx.pageUrl).pathname;
  } catch {
    return { ok: false, reason: "url" };
  }
  const full = a.fullName.trim();
  const [first, ...rest] = full.split(/\s+/);
  const fname = a.nameMode === "full" ? full : (first ?? "");
  const lname = a.nameMode === "full" ? "" : rest.join(" ");
  const ref = refCode(ctx.token);
  const t = ctx.tracking;
  return { ok: true, body: {
    form: "landing-page", submissionToken: ctx.token, site_language: ctx.locale,
    // lead_source_url carries the full landing URL including UTM query for marketing attribution, no personal data
    lead_source_url: ctx.pageUrl, referrer: ctx.referrer,
    utm_source: t.utm_source ?? "", utm_medium: t.utm_medium ?? "", utm_campaign: t.utm_campaign ?? "",
    utm_term: t.utm_term ?? "", utm_content: t.utm_content ?? "",
    gclid: t.gclid ?? "", fbclid: t.fbclid ?? "", gbraid: t.gbraid ?? "", wbraid: t.wbraid ?? "",
    fields: {
      landing_page_path: pathname,
      form_variant: `${ctx.formId ?? "lp-v2-3step"}-${ctx.variant.toLowerCase()}`,
      fname, lname,
      phone: a.phone.trim(), email: a.email.trim(), country: a.country,
      duration: a.duration, message: packMessage(a, ref), consent: true,
      track_id: ctx.campaign.tracking.trackId, campaign_name: ctx.campaign.tracking.campaignName,
      utm_keyword: t.utm_keyword ?? "",
    },
  }, ref};
}
