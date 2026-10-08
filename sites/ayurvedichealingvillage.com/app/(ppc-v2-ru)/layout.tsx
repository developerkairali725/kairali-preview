import type { ReactNode } from "react";
import ProductionDocument from "../../campaign-v2/production/Document";

// Root layout of the Russian live ad route rebuilt on the campaign-v2 kit (/lp/treatment-in-kerala-russian/): the production document in Russian,
// with the site's own consent, measurement, lead receipt and chat, and the site's localized chrome.
export default function Layout({ children }: { children: ReactNode }) {
  return <ProductionDocument lang="ru">{children}</ProductionDocument>;
}
