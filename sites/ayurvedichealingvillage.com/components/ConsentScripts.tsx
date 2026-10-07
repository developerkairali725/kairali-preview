import { consentDefaultSnippet } from "@kairali/consent/core";

/** AHV keeps the fleet's denied-before-loaders contract. Its versioned local
 * consent controller validates saved preferences; the legacy fleet restore
 * must not grant consent before that validation. Server component only. */
export function ConsentScripts() {
  return <script id="kairali-consent-default" dangerouslySetInnerHTML={{ __html: consentDefaultSnippet() }} />;
}
