

import MobileBar from "./MobileBar";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

// Wraps every landing page with the shared chrome. `lang` marks the page's own
// content (e.g. "de" for /lp/behandlung-in-kerala/); the shared header, footer,
// sticky bar and cookie bar stay English (root lang="en") until translated.
export default function PageShell({
  children,
  lang,
  legalLabels,
}: {
  children: React.ReactNode;
  lang?: string;
  legalLabels?: { privacy: string; terms: string; cookies: string };
}) {
  return (
    <div>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main" lang={lang}>
        {children}
      </main>
      <SiteFooter legalLabels={legalLabels} />
      <MobileBar />


    </div>
  );
}
