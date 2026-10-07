import type { BrowserSlots as Slots } from "../slots.ts";
import type { EventName, ParamValue } from "../events.ts";

type Fn = (...args: unknown[]) => unknown;

/** The slice of `window` the integrations touch. Tests pass a plain object shaped like this. */
export type LpWindow = {
  dataLayer?: unknown[];
  gtag?: Fn;
  fbq?: Fn;
  clarity?: Fn;
  uetq?: { push: Fn };
  lintrk?: Fn;
  ttq?: { track: Fn };
  __ahvConsentRequired?: boolean;
  __lpSlots?: Slots;
  localStorage?: { getItem(k: string): string | null; setItem(k: string, v: string): void };
  location?: { search: string };
  /** Read only for <html data-lp-surface> (the live ad routes). */
  document?: { documentElement?: { getAttribute(name: string): string | null } | null };
  /** The site's consented measurement runtime (consent-runtime.ts); present on the live ad routes. */
  AHV_MEASUREMENT?: { recordInteraction?: (name: string, target: string) => boolean };
};

export type CleanParams = Record<string, ParamValue>;

export type Adapter = {
  /** Stable id, shown in the [lp-track] debug line. */
  id: string;
  /**
   * true for tools governed by Google Consent Mode (GA4, Google Ads): they still receive events in the
   * EU/UK before consent, because Consent Mode limits them to cookieless pings. false tools are skipped
   * there until a granted choice is stored.
   */
  consentMode: boolean;
  /** Whether the slot is filled. An empty ID means the adapter is a no-op everywhere. */
  enabled(slots: Slots): boolean;
  /** The inline boot JS for this tool ("" when its slot is empty). loader.ts composes these. */
  load(slots: Slots): string;
  /** Forward one already-scrubbed event. Must never throw (track() also guards). */
  send(event: EventName, params: CleanParams, slots: Slots, w: LpWindow): void;
};

/** JSON for interpolation into an inline <script>: "<" is escaped so the value can never close the tag. */
export const js = (v: unknown): string => JSON.stringify(v).replace(/</g, "\\u003c");
