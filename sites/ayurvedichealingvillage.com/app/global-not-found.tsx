import type { Metadata } from "next";
import "@kairali/ui/brand-tokens.css";
import recoveryCopy from "./recovery-copy.json";
import RecoveryPanel from "./recovery-panel";
import { LOCALE_CODES, LOCALE_INFO, localizedPath, translate } from "./(english)/_families/l10n";

export const metadata: Metadata = {
  title: "Page not found | Kairali — The Ayurvedic Healing Village",
  robots: { index: false, follow: true },
};

const css = `*{box-sizing:border-box}[hidden]{display:none!important}body{margin:0;background:var(--ivory);color:var(--forest-700);font-family:Arial,sans-serif;line-height:1.6}main{max-width:920px;margin:auto;padding:40px 24px 64px}header{border-bottom:1px solid color-mix(in srgb,var(--forest-700) 20%,var(--ivory));padding-bottom:24px}header img{max-width:100%;height:auto}.code{font-family:Georgia,serif;font-size:clamp(72px,14vw,140px);line-height:1;margin:40px 0 8px;color:var(--forest-500)}h2{font-family:Georgia,serif;font-size:clamp(25px,5vw,38px);font-weight:normal;margin:0 0 12px}p{max-width:560px}.language{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin:28px 0 20px}select{font:inherit;padding:10px 16px;background:white;border:1px solid var(--leaf-700);border-radius:4px;max-width:100%;min-height:44px}.recovery{border-top:1px solid color-mix(in srgb,var(--forest-700) 20%,var(--ivory));padding:20px 0}.recovery:not([data-current]){display:none}.recovery h3{margin:0 0 12px;font-size:16px;font-weight:normal}nav{display:flex;gap:12px;flex-wrap:wrap}nav a{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:10px 22px;border:1px solid var(--forest-500);border-radius:4px;color:inherit;text-decoration:none}nav a:first-child{background:var(--forest-700);color:white}a:focus-visible,select:focus-visible{outline:3px solid var(--bronze-600);outline-offset:4px}footer{margin-top:40px;font-size:13px;color:var(--leaf-700)}@media(max-width:420px){main{padding:24px 20px 40px}nav{flex-direction:column}nav a{width:100%}}`;

/** Unmatched routes bypass all root layouts: no measurement or form transport. */
export default function GlobalNotFound() {
  const locales = LOCALE_CODES.map((locale) => ({ locale, ...LOCALE_INFO[locale], copy: recoveryCopy[locale], links: [
    { href: localizedPath("/", locale) ?? "/", label: translate(locale, "Home") },
    { href: locale === "en" ? "/search/" : `/search/?lang=${locale}`, label: translate(locale, "Search") },
    { href: localizedPath("/contact-us/", locale) ?? "/contact-us/", label: translate(locale, "Contact us") },
  ] }));
  return (
    <html lang="en-US">
      <head><style dangerouslySetInnerHTML={{ __html: css }} /><link rel="icon" href="/icon.svg" /></head>
      <body>
        <main>
          <header><a href="/"><img src="/ahv/assets/img/kairali-colorful-logo.webp" width="290" height="68" alt="Kairali — The Ayurvedic Healing Village" /></a></header>
          <h1 className="code">404</h1>
          <RecoveryPanel locales={locales} />
          <noscript><style>{`.recovery:not([data-current]){display:block}#recovery-language-control{display:none}`}</style></noscript>
          <footer>Kairali — The Ayurvedic Healing Village · Palakkad, Kerala</footer>
        </main>
      </body>
    </html>
  );
}
