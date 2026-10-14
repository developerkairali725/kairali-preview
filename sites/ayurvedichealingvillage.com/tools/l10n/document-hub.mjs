/**
 * AHV-N08.documents.* (Train G rework, 15 Oct 2026). The document library is the maintained Kairali hub
 * (owner correction 29 Sep 2026; /Volumes/Extreme SSD - Blue 2nd/COS/shared-document-library-20260928/WEBSITE-INTEGRATION.md):
 * the site serves no library page of its own and copies no hub HTML. English /documents/ keeps its 301 to the AHV view.
 * Every locale page used to link that same English entry, so all twelve languages landed on the hub unfiltered.
 * As Villa Raag's /<locale>/download/ entries do, each locale now links its own /<prefix>/documents/ entry, which
 * english-candidate/document-redirects.json answers with ONE 301 to the hub's AHV view filtered to that language and
 * the locale's tariff currency. Direct PDF links (/documents/pdf/...) are left alone.
 */
const ENTRY = /((?:\bhref|\burl|\blink|\bto|\bmore|\bcta\w*)\\?["']?\s*[:=]\s*\\?["'])(?:https?:\/\/(?:www\.)?ayurvedichealingvillage\.com)?\/documents\/(?:index\.html)?(?=[#"'\\])/g;

/** Point every link to the document-library entry at the locale's own entry path. */
export function localizeDocumentHubLinks(text, prefix) {
  if (!prefix) return text;
  return text.replace(ENTRY, (m, pre) => pre + "/" + prefix + "/documents/");
}
