import { consentDefaultSnippet, storedConsentSnippet } from "./core.js";

/**
 * Inline consent bootstrap — render in <head> (or first in <body>) BEFORE
 * <Analytics/> so the default-denied state exists before any tag loads.
 * Server component; ships zero client JS of its own.
 */
export function ConsentScripts() {
  return (
    <>
      <script
        id="kairali-consent-default"
        dangerouslySetInnerHTML={{ __html: consentDefaultSnippet() }}
      />
      <script
        id="kairali-consent-stored"
        dangerouslySetInnerHTML={{ __html: storedConsentSnippet() }}
      />
    </>
  );
}
