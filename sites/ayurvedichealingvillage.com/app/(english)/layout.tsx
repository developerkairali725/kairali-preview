import type { Metadata } from "next";
import type { ReactNode } from "react";
import { faviconIcons } from "@kairali/seo";
import { ChatbaseLoader } from "@kairali/chat";
import { ConsentScripts } from "@kairali/consent";
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
 * cookie, identify no visitor and are not consent-gated. They are emitted
 * ALWAYS, and deliberately not behind the analytics flag — that coupling bundled
 * two unrelated decisions, so a go-live with tracking still off would have
 * broken Search Console, Bing Webmaster and Meta verification on day one.
 * Corrected 2026-09-16 (D-20260916-09).
 */
const verification = analyticsConfig.verification;
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
        {/* Consent Mode v2 defaults, DENIED, before any loader — the pilot
            security-audit ordering contract, added on the owner's ruling of
            2026-09-21 ("wire Consent Mode properly") alongside the chat bubble.

            This lane keeps its OWN visitor-facing notice (the approved design's,
            extended site-wide in _families/boot.ts on localStorage
            "ktahv-consent") — nothing here adds a second banner or asks a second
            question. What this adds is the signal layer underneath it: boot.ts
            now calls gtag("consent","update", …) on whichever notice records the
            choice, and mirrors the record into the fleet key so THIS snippet can
            re-apply it synchronously on the next page load.

            Before this pair, adding the script alone would have set everything
            denied with nothing in the lane to grant it — startMeasurement()
            calls gtag("config") and never gtag("consent") — and an accepting
            visitor would have been measured in denied mode forever. */}
        <ConsentScripts />
        {/* ALWAYS emitted, deliberately NOT behind the analytics flag.
            Ownership proof is not tracking: these set no cookie, identify no
            visitor and are not a consent matter. They were previously gated on
            AHV_ANALYTICS, which bundled two unrelated decisions together -- so a
            go-live with tracking still off (a live possibility, since activation
            is a separate Vikash decision) would have broken Search Console, Bing
            Webmaster and Meta domain verification on day one, during the exact
            week the migration data matters most. */}
        {/* Layout for the directions page and the gold primary on contact/enquiry.
            Scoped by data-ahv-route, so loading it site-wide is inert elsewhere.
            Lives in public/design/, outside public/ahv/, so a design re-import
            cannot erase it. */}
        <link rel="stylesheet" href="/design/directions.css" />
        <link rel="stylesheet" href="/design/article-reader.css" />
        <link rel="stylesheet" href="/design/campaign.css" />
        {/* Sitewide consistency layer (owner's 22 Sep 2026 final-build
            directive, D-20260922-13): the homepage and package pages are the
            gold standard; every OTHER family is brought to their type floor,
            button system, tap targets, prose measure and motifs. Both files
            key on data-ahv-consistency="1", which design-view.tsx emits only
            for the unlocked families (english-candidate/
            consistency-locked-families.json, derived by
            tools/build-consistency-lock.mjs) — the locked families are
            unreachable by construction. The script is the one part CSS
            cannot do: a computed-size floor on inline-sized micro labels and
            data-labels for phone-stacked tables. It runs its own observer on
            the design root and never touches boot.ts. */}
        <link rel="stylesheet" href="/design/consistency.css" />
        <script defer src="/design/consistency.js" />
        {/* Shared chrome, every page INCLUDING the homepage (owner rulings
            D-20260922-17/-18/-19, 22 Sep 2026): the desktop header on one row
            with the EN/DE/FR switch kept (chrome.css, ≥1180px), the copyright
            line on every footer and WhatsApp +91 92898 38797 under the hospital
            phone (chrome.js). Not scoped by data-ahv-consistency on purpose —
            the header and footer are one component on every family. */}
        <link rel="stylesheet" href="/design/chrome.css" />
        <script defer src="/design/chrome.js" />
        <link rel="stylesheet" href="/design/newsletter.css" />
        <script defer src="/design/newsletter.js" />
        {/* Site search (D-20260922-32, Option A): one engine + one prebuilt index
            (/ahv/search-index.json, tools/build-search-index.mjs) behind the header's
            search control on every page, the programme finder and the FAQ filter.
            search.js takes over the header's inert dialog at runtime, like chrome.js
            does for the footer; the package component is never edited. */}
        <link rel="stylesheet" href="/design/search.css" />
        <script defer src="/design/search.js" />
        {/* ONE section navigation for every content family (owner, 23 Sep 2026):
            the captured WordPress sidebars are removed and a governed rail built
            from the owner-authorised breadcrumbs takes their place — data from
            tools/build-section-nav.mjs, layout in section-nav.css, DOM in
            section-nav.js. Loaded after search.js; runs only on listed routes. */}
        <link rel="stylesheet" href="/design/section-nav.css" />
        <script defer src="/design/section-nav.data.js" />
        <script defer src="/design/section-nav.js" />
        <meta name="google-site-verification" content={verification.googleSiteVerification} />
        <meta name="msvalidate.01" content={verification.msvalidate01} />
        <meta name="facebook-domain-verification" content={verification.facebookDomainVerification} />
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
               replaces the node with the compiled design.
            3. The prerendered snapshot is taken at phone width. While the
               root is "held" (server state, before the runtime renders) a
               desktop viewport keeps it invisible on the paper tone rather
               than painting a phone layout; once boot pushes the template the
               root is "released" and the snapshot leaves the flow so the live
               view is the only thing on screen. Phones keep the snapshot
               visible throughout - that is the mobile-first paint. */}
        <style>
          {"html,body{margin:0;background:#F7F4EA;color:#2A2118}x-dc{display:none!important}" + /* approved design payload palette (site.config.json vendored note). brand-allow: rogue-hex */
            "#ahv-design-root[data-ahv-snapshot-state='released']>[data-ahv-snapshot]{display:none!important}" +
            "@media (min-width:700px){#ahv-design-root[data-ahv-snapshot-state='held']>*{visibility:hidden!important}}"}
        </style>
        {children}
        {/* Mandatory fleet chat bubble (D-20260718-05), added on the owner's
            explicit ruling of 2026-09-21 after he was shown the three open
            defects in the shared Chatbase config and chose to ship anyway:
            the bot's footer prints WhatsApp +91-92898-38794 against the locked
            +91 92898 38797, it presents as a human "Priya Sharma" with no
            honest-AI disclosure, and it says "Trusted since 1908", the
            group-attached wording D-1908-WORDING bans. None of those live in
            this repo -- they are dashboard config -- so the flag is the loudest
            thing this lane can raise: QUESTIONS.md Q-CHATBOT-WRONG-NUMBER, and
            the exact replacement copy is drafted in
            docs/drafts/chatbase-priya-config-fix.md for whoever holds the
            dashboard.

            DEFAULT (ungated) DELIBERATELY, and this is a consent decision:
            consentGated reads @kairali/consent's own storage key, which THIS
            lane never writes -- it runs the approved design's own notice via
            localStorage["ktahv-consent"] in _families/boot.ts. Passing
            consentGated here would defer the bubble on a key nobody sets, i.e.
            silently never load it. The fleet default changes no consent logic
            (HARD GATE 11) and matches the owner's standing "no consent" ruling;
            the loader still defers injection to first interaction or a 6s idle,
            so it never competes with LCP. */}
        <ChatbaseLoader />
      </body>
    </html>
  );
}
