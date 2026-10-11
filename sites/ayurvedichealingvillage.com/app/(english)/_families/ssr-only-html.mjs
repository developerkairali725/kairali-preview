/**
 * Server-HTML-only markup for the design view (Weight performance repair, 8 Oct 2026).
 *
 * A server component's dangerouslySetInnerHTML string is written twice: once into the HTML and once
 * into the Flight data inlined after it. The client never needs that second copy for the snapshot
 * or the boot script: React does not compare innerHTML when it hydrates, and it never re-runs an
 * inline script. On Weight the two copies cost ~56 KB gzip of the document.
 *
 * The server component puts the markup here. ssr-only-html-slot.tsx (a client component, so only a
 * short slot id crosses Flight) reads it back during the server render of the same request, in the
 * same process. A slot that is missing during the server render throws, so a build can never ship
 * an empty snapshot silently. Entries are deterministic per slot and few (one route, 13 locales),
 * so they are kept rather than deleted on read.
 */
const KEY = Symbol.for("ahv.ssrOnlyHtml");

function slots() {
  return (globalThis[KEY] ??= new Map());
}

/** Routes whose snapshot and boot script ship in the server HTML only. */
export const SSR_ONLY_HTML_ROUTES = new Set(["/contact-us/", "/weight-loss-programme/", "/treatment-for-bronchial-diseases/", "/holistic-treatment-for-rejuvenation-and-detoxification/", "/treatment-for-hypertension/"]);

export function putSsrOnlyHtml(slot, html) {
  if (typeof html !== "string") throw new TypeError(`AHV server-only markup must be a string: ${slot}`);
  slots().set(slot, html);
  return slot;
}

export function readSsrOnlyHtml(slot) {
  const html = slots().get(slot);
  if (typeof html !== "string") throw new Error(`AHV server-only markup missing for ${slot}`);
  return html;
}
