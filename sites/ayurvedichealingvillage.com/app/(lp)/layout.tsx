import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { asap, kurale, lato } from "@kairali/ui/fonts/kairali";
import "@kairali/ui/fonts/kairali.css";
import { faviconIcons } from "@kairali/seo";
import { ConsentScripts, ConsentBanner } from "@kairali/consent";
import { ChatbaseLoader } from "@kairali/chat";
import { SocialLinks } from "@kairali/social";
import { Analytics } from "@kairali/analytics";
import "../../styles/tokens.css";
import "../globals.css";

// KTAHV LP lane — CLINICAL REGISTER ONLY (CLAUDE.md language lock).
// This layout is deliberately CHROMELESS: no site header, no nav, no footer
// link farm (LANDING_PAGE_DOCTRINE §1 — 1:1 attention ratio). Each /lp/ page
// carries its own metadata via buildMetadata (noindex by default under /lp/).
//
// LOCALE LAW FLAG (loud, per Factory rules): site.config.json declares ["en"]
// TONIGHT. The DE-market campaign page /lp/behandlung-in-kerala ships in
// German as a single-locale campaign page (gates/registry.yaml
// hreflang-reciprocal: n/a for class landing — "a locale variant is a separate
// campaign page"). FR is PENDING; the EN/DE/FR locale trees arrive with the
// full KTAHV organic rebuild, which restores the three-locale declaration.
// A5 perf evidence (21 Jul CI 89-median on two LPs; local LH audit trail in the
// fix commit): the LP mobile LCP is the <h1> TEXT, and its final paint waited on
// ~151KB / 10 preloaded font files. Two of those were measured dead weight:
//   · latin-ext — zero U+0100-024F chars in ANY built page (EN/DE/FR copy sits
//     in Google's latin ranges; ä/ö/ü/ß/é/œ are all latin-subset). next/font
//     keeps the non-preloaded subsets as unicode-range @font-face fallbacks, so
//     if an ext char ever ships, the browser still fetches that file on demand —
//     nothing is lost but the forced preload.
//   · Lato 300 — no font-weight:300 anywhere in the site or its packages.
// Preload set: 150.8KB/10 files → 85.4KB/5 files. Families/weights in use are
// UNTOUCHED (the approved design's type ramp is not a perf lever).
export const metadata: Metadata = {
  icons: faviconIcons(),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  // The authorized staging candidate exposes the approved English routes only.
  // Retain the older LP implementation for a separate future release.
  if (process.env.AHV_STAGING !== "0") notFound();
  return (
    <html lang="en" className={`${kurale.variable} ${asap.variable} ${lato.variable}`}>
      <head>
        {/* Order is law: consent defaults (denied) BEFORE any tag loader */}
        <ConsentScripts />
        <Analytics />
      </head>
      <body>
        {children}
        {/* D-20260718-05: chat bubble mandatory fleet-wide, always the ONE
            shared component. The LP lane's 1:1-attention doctrine has no
            registry exemption for this site — if the owner wants the LPs
            bubble-free, that is a loud exemption row, not a silent skip. */}
        <ChatbaseLoader />
        {/* D-20260718-04: the shared fleet social set — handles single-sourced
            in packages/social. Rendered as a minimal strip: this LP layout is
            otherwise chromeless by doctrine (1:1 attention), and the fleet law
            still binds every site. */}
        <footer className="lp-social-strip">
          <SocialLinks />
        </footer>
        <ConsentBanner privacyHref="/privacy" />
      </body>
    </html>
  );
}
