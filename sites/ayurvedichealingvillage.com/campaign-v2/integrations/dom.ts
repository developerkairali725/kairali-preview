// Declarative tracking: any element with data-track="<event>" plus data-track-<param>="…" calls track()
// on click (data-track-youtube-id → param youtube_id). One delegated listener for the whole page, so
// sections stay server components. Also fires scroll_depth at 50% and 90%, once each.
//
// Legacy 12a markup (data-cta / data-cta-position) is still understood and mapped to cta_click.

import { track as defaultTrack } from "./track.ts";
import type { EventName, EventParams } from "./events.ts";

type TrackFn = (event: EventName, params?: EventParams) => unknown;

type El = { getAttribute(n: string): string | null; attributes: ArrayLike<{ name: string; value: string }>; closest(sel: string): El | null };

const LEGACY_POSITION: Record<string, string> = { "consult-bar": "bar", offer: "section" };

/** Pure: the event + params a clicked element should produce, or null. Exported for tests. */
export function eventFromElement(target: El | null): { event: string; params: EventParams } | null {
  if (!target || typeof target.closest !== "function") return null;
  const el = target.closest("[data-track],[data-cta]");
  if (!el) return null;
  const name = el.getAttribute("data-track");
  if (name) {
    const params: EventParams = {};
    for (const a of Array.from(el.attributes)) {
      if (a.name.startsWith("data-track-")) params[a.name.slice(11).replace(/-/g, "_")] = a.value;
    }
    return { event: name, params };
  }
  const cta = el.getAttribute("data-cta");
  if (!cta) return null;
  const pos = el.getAttribute("data-cta-position") ?? "";
  return { event: "cta_click", params: { cta, position: LEGACY_POSITION[pos] ?? pos } };
}

/** Installs the click + scroll listeners. Returns an uninstall function. Browser only; no-op on the server. */
export function installDomTracking(track: TrackFn = defaultTrack): () => void {
  if (typeof document === "undefined" || typeof window === "undefined") return () => {};
  const onClick = (e: Event) => {
    try {
      const hit = eventFromElement(e.target as unknown as El);
      if (hit) track(hit.event as EventName, hit.params);
    } catch { /* never break a click */ }
  };
  // Capture phase: runs before navigation handlers and even if a component stops propagation.
  document.addEventListener("click", onClick, true);

  const fired = new Set<number>();
  let ticking = false;
  const measure = () => {
    ticking = false;
    const doc = document.documentElement;
    const max = Math.max(doc.scrollHeight, document.body?.scrollHeight ?? 0);
    if (max <= 0) return;
    const pct = ((window.scrollY + window.innerHeight) / max) * 100;
    for (const mark of [50, 90]) {
      if (pct >= mark && !fired.has(mark)) {
        fired.add(mark);
        track("scroll_depth", { percent: mark });
      }
    }
    if (fired.size === 2) window.removeEventListener("scroll", onScroll);
  };
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(measure);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  // Short pages: 50/90% may already be visible without any scroll.
  window.requestAnimationFrame(measure);

  return () => {
    document.removeEventListener("click", onClick, true);
    window.removeEventListener("scroll", onScroll);
  };
}
