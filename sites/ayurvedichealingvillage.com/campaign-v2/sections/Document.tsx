import type { ReactNode } from "react";
import { Marcellus, Mulish, Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import type { CampaignConfig, Variant } from "../kit/types.ts";
import { SKINS, skinCssVars } from "../kit/skins.ts";
import { geoConsentDefaultSnippet } from "../kit/consent-region.ts";
import { ConsentBanner } from "@kairali/consent";
import { site } from "../../campaign-v110/lib/site.ts";
import { INTEGRATIONS } from "../integrations/slots.ts";
import { loaderSnippet } from "../integrations/loader.ts";
import { buildJsonLd, jsonLdScript, verificationMeta } from "../integrations/seo.ts";
import Tracking from "./Tracking";

// Fonts (Task 19, PERF.md): self-hosted by next/font, display: swap, with size-adjusted fallbacks (no swap CLS).
// Preloads are per route, not per variant, so preloading every family put ~213 KB of woff2 (12 files) ahead of
// the LCP hero image. Exactly ONE preload now: Marcellus latin, the hero heading font of A and C (the default
// variant). Every other face, and every non-latin subset, is still declared (unicode-range) and loads on use.
const marcellus = Marcellus({ weight: "400", subsets: ["latin"], display: "swap", variable: "--f-marcellus" });
const mulish = Mulish({ subsets: ["latin", "latin-ext", "cyrillic"], display: "swap", variable: "--f-mulish", preload: false });
const instrument = Instrument_Serif({ weight: "400", style: ["normal", "italic"], subsets: ["latin", "latin-ext"], display: "swap", variable: "--f-instrument", preload: false });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin", "latin-ext", "cyrillic-ext"], display: "swap", variable: "--f-jakarta", preload: false });

const FONT_VAR = { marcellus: "var(--f-marcellus)", instrument: "var(--f-instrument)", jakarta: "var(--f-jakarta)", mulish: "var(--f-mulish)" } as const;
const SCRIPT_FALLBACK = '"Noto Sans Devanagari","IBM Plex Sans Arabic","PingFang SC","Hiragino Sans","Apple SD Gothic Neo","Noto Sans CJK SC",system-ui,sans-serif';

/**
 * The <html>/<body> shell for /lp-v2: lang/dir per request, skin + font vars per variant, geo consent default,
 * then the integrations layer (campaign-v2/integrations): verification meta, JSON-LD, the tag loader (only
 * when the master switch is on) and the client-side data-track listener.
 */
export default function Document({ campaign, variant, locale, dir, consentRequired, children }:
  { campaign: CampaignConfig; variant: Variant; locale: string; dir: "ltr" | "rtl"; consentRequired: boolean; children: ReactNode }) {
  const skin = SKINS[variant];
  const style = {
    ...skinCssVars(variant),
    "--lp-font-display": `${FONT_VAR[skin.fonts.display]},Georgia,${SCRIPT_FALLBACK}`,
    "--lp-font-body": `${FONT_VAR[skin.fonts.body]},${SCRIPT_FALLBACK}`,
  } as Record<string, string>;
  return (
    <html lang={locale} dir={dir} className={`${marcellus.variable} ${mulish.variable} ${instrument.variable} ${jakarta.variable}`}>
      <head>
        <script id="lp-consent-default" dangerouslySetInnerHTML={{ __html: geoConsentDefaultSnippet(consentRequired) }} />
        {INTEGRATIONS.enabled ? <script id="lp-integrations" dangerouslySetInnerHTML={{ __html: loaderSnippet(INTEGRATIONS) }} /> : null}
        {verificationMeta(INTEGRATIONS).map((m) => <meta key={m.name} name={m.name} content={m.content} />)}
        <script id="lp-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(buildJsonLd(campaign, { locale })) }} />
      </head>
      <body className="lp" data-variant={variant} style={style}>
        {children}
        <Tracking />
        {consentRequired ? <ConsentBanner privacyHref={site.legal.privacy} /> : null}
      </body>
    </html>
  );
}
