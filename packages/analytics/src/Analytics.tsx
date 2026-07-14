import { readIds, gtagSrc, ga4ConfigSnippet, gtmSnippet, ctaListenerSnippet } from "./core.js";

/**
 * Measurement stack (Ship Gate B3/B4). Server component — reads
 * NEXT_PUBLIC_GA4_ID / NEXT_PUBLIC_GTM_ID at render:
 *  - IDs absent (today: measurement handover pending, Vikash): renders the
 *    inert data-cta listener only. Events queue in dataLayer; no loaders.
 *  - GA4 id set: async gtag.js loader + config.
 *  - GTM id set: GTM loader (container owns the tags).
 * Render AFTER <ConsentScripts/> — consent defaults must precede loaders.
 */
export function Analytics() {
  const { ga4, gtm } = readIds(process.env);
  return (
    <>
      {gtm ? (
        <script id="kairali-gtm" dangerouslySetInnerHTML={{ __html: gtmSnippet(gtm) }} />
      ) : null}
      {ga4 ? (
        <>
          <script async src={gtagSrc(ga4)} />
          <script
            id="kairali-ga4-config"
            dangerouslySetInnerHTML={{ __html: ga4ConfigSnippet(ga4) }}
          />
        </>
      ) : null}
      <script id="kairali-cta-events" dangerouslySetInnerHTML={{ __html: ctaListenerSnippet() }} />
    </>
  );
}
