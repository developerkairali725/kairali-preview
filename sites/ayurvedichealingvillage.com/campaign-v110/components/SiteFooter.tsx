import Script from "next/script";
import { siteChrome } from "../../app/(english)/search/site-chrome";
import { LOCALE_CODES, LOCALE_INFO, localizedPath } from "../../app/(english)/_families/l10n";

/** Reuse the approved site footer; campaign language links lead to locale homepages. */
export default function SiteFooter({ legalLabels }: { legalLabels?: { privacy: string; terms: string; cookies: string } }) {
  const chrome = siteChrome(legalLabels?.privacy === "Datenschutz" ? "de" : "en");
  const languages = `<nav class="ahv-footer-langs" aria-label="Site languages">${LOCALE_CODES.map(code => `<a href="${localizedPath("/", code) || "/"}" hreflang="${LOCALE_INFO[code].htmlLang}">${LOCALE_INFO[code].name}</a>`).join(" · ")}</nav>`;
  const footer = chrome.footer.replace(/<nav\b[^>]*class="ahv-footer-langs"[^>]*>[\s\S]*?<\/nav>/g, languages);
  return <div className="ahv-campaign-footer">
    <style dangerouslySetInnerHTML={{ __html: chrome.css }} />
    <div dangerouslySetInnerHTML={{ __html: footer }} />
    <Script src="/design/newsletter.js" strategy="afterInteractive" />
  </div>;
}
