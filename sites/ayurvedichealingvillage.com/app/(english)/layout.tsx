import type { Metadata } from "next";
import type { ReactNode } from "react";
import { faviconIcons } from "@kairali/seo";
import analyticsConfig from "../../analytics.config.json";

/**
 * AHV English candidate — root layout for the approved-design lane.
 *
 * This is a SECOND root layout (Next.js route-group root layouts). The LP lane
 * keeps its own at app/(lp)/layout.tsx, unchanged. The two are separated
 * because the LP layout is deliberately chromeless-plus-fleet-furniture — it
 * appends a social strip and a consent banner to every page it wraps — and the
 * approved English design already carries its own header, footer, social row
 * and cookie notice. Wrapping the design in the LP layout would have shown the
 * reviewer two footers and two consent banners, i.e. not the approved design.
 *
 * CONSENT AND ANALYTICS (owner ruling, 15 Sep 2026 — supersedes the note this
 * replaces, which recorded them as deliberately absent pending his word):
 *   · The cookie notice is now SITE-WIDE. The approved design carried one, but
 *     only in the two home views — 250 of 252 routes offered no choice at all.
 *     boot.ts extends the design's own mechanism, reusing its storage key and
 *     values so one choice covers every page and two notices can never appear.
 *   · Measurement ids load only when the build sets AHV_ANALYTICS=1 AND the
 *     visitor has accepted. Both locks are off on staging, so reviewers never
 *     reach the production GA4/Clarity properties.
 *   · The chat loader remains absent; it was not part of the ruling.
 *
 * The verification metas below are ownership proof, not tracking: they set no
 * cookie and are not consent-gated. They are emitted under the same build flag
 * because they only mean anything on the production domain — and if they are
 * missing at the DNS flip, Search Console and Bing verification break.
 */
const verification = analyticsConfig.verification;
const analyticsOn =
  process.env[analyticsConfig.activation.env] === analyticsConfig.activation.enabledWhen;
export const metadata: Metadata = {
  icons: faviconIcons(),
  // No robots meta here BY DESIGN: the approved design writes its own, and a
  // second one made every head carry a duplicate. Staging no-index is held by
  // the X-Robots-Tag header (next.config.ts), robots.txt, the import-time
  // rewrite of the payload's robots values, and the boot head guard.
};

export default function EnglishCandidateLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-US">
      <head>
        {analyticsOn ? (
          <>
            <meta name="google-site-verification" content={verification.googleSiteVerification} />
            <meta name="msvalidate.01" content={verification.msvalidate01} />
            <meta name="facebook-domain-verification" content={verification.facebookDomainVerification} />
          </>
        ) : null}
      </head>
      <body>
        {/* Two rules, both load-bearing.
            1. Paper tone from the approved design, so the first paint before
               the runtime mounts is the design's background, not white.
            2. x-dc{display:none} is the SAME rule support.js installs from
               <head> in the package, and it has to be in the served CSS for
               the same reason: the approved templates carry 281 interpolated
               <img loading="lazy" src="{{ expr }}"> tags. Visible for even one
               frame, the browser resolves "{{ expr }}" as a URL and 404s.
               Hidden from the start, lazy loading never begins and the runtime
               replaces the node with the compiled design. */}
        <style>
          {"html,body{margin:0;background:#F7F4EA;color:#2A2118}x-dc{display:none!important}"}
        </style>
        {children}
      </body>
    </html>
  );
}
