

import CampaignExperience from "./CampaignExperience";
import "./campaign-experience.css";
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
  campaign = false,
}: {
  children: React.ReactNode;
  campaign?: boolean;
  lang?: string;
  legalLabels?: { privacy: string; terms: string; cookies: string };
}) {
  return (
    <div id={campaign ? "ahv-campaign-page" : undefined} className={campaign ? "ahv-campaign-page" : undefined}>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <SiteHeader campaign={campaign} />
      <main id="main" lang={lang}>
        {children}
      </main>
      <SiteFooter legalLabels={legalLabels} />
      <MobileBar />
      {campaign && <CampaignExperience />}


    </div>
  );
}
