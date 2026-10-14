import type { ReactNode } from "react";
import Script from "next/script";
import { ChatbaseLoader } from "@kairali/chat";
import { ConsentScripts } from "../../../components/ConsentScripts";
import analyticsConfig from "../../../analytics.config.json";

/**
 * The shared document for every locale of the approved-design lane: the
 * English root layout and each locale's root layout render THIS, so the head
 * assets, consent layer, chrome scripts and chat loader are one definition.
 * Moved verbatim from app/(english)/layout.tsx (25 Sep 2026, localization);
 * the only parameters are the document language/direction, the directory the
 * sitewide runtime scripts load from (locale copies carry translated UI text,
 * built by tools/l10n/build.mjs) and an optional inline script that installs
 * the locale's UI dictionary before those scripts run.
 */
const verification = analyticsConfig.verification;

export function SiteDocument({
  children,
  lang = "en-US",
  dir = "ltr",
  designBase = "/design/",
  l10nScript,
}: {
  children: ReactNode;
  lang?: string;
  dir?: "ltr" | "rtl";
  designBase?: string;
  l10nScript?: string;
}) {
  return (
    <html lang={lang} dir={dir} suppressHydrationWarning>
      <head>
        {/* Default denied before loaders; only the current AHV consent revision may grant. */}
        <ConsentScripts />
        {/* Keep one-use thank-you navigation tied to a confirmed lead receipt. */}
        <Script src="/design/lead-receipt.js" strategy="beforeInteractive" />
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

        <script defer src={`${designBase}consistency.min.js`} />
        {/* Shared chrome, every page INCLUDING the homepage (owner rulings
            D-20260922-17/-18/-19, 22 Sep 2026): the desktop header on one row
            with the EN/DE/FR switch kept (chrome.css, ≥1180px), the copyright
            line on every footer and WhatsApp +91 92898 38797 under the hospital
            phone (chrome.js). Not scoped by data-ahv-consistency on purpose —
            the header and footer are one component on every family. */}

        <script defer src={`${designBase}review-chrome.js`} />


        <script src={`${designBase}film-player.js`} defer />
        <script defer src={`${designBase}newsletter.js`} />
        {/* Form delivery for the two form kinds with no view-logic submit handler: the walk-in (OPD)
            intake and the legacy campaign/landing routes. Both are inert elsewhere, post to /api/lead/
            and show receipt only after the server confirms storage (a truthful "not connected" otherwise). */}
        <script defer src={`${designBase}opd-form-submit.js`} />
        <script defer src={`${designBase}landing-page-form-submit.js`} />
        {/* Exit-intent "10% OFF on all Treatment Packages" offer with a real enquiry form (owner decision,
            14 Oct 2026). One file for every locale (its own 13-locale copy, chosen from the URL prefix, like
            lead-receipt.js), so it is not a designBase copy. It stays inert on confirmation, legal, lead-form and
            paid campaign pages (DEC-PAID-NAV), posts to /api/lead/ as "exit-intent" and adds no tracking. */}
        <script defer src="/design/exit-offer.js" />
        {/* Site search (D-20260922-32, Option A): one engine + one prebuilt index
            (/ahv/search-index.json, tools/build-search-index.mjs) behind the header's
            search control on every page, the programme finder and the FAQ filter.
            search.js takes over the header's inert dialog at runtime, like chrome.js
            does for the footer; the package component is never edited. */}

        <script defer src={`${designBase}search.min.js`} />
        {/* ONE section navigation for every content family (owner, 23 Sep 2026):
            the captured WordPress sidebars are removed and a governed rail built
            from the owner-authorised breadcrumbs takes their place — data from
            tools/build-section-nav.mjs, layout in section-nav.css, DOM in
            section-nav.js. Loaded after search.js; runs only on listed routes. */}

        <script defer src={`${designBase}section-nav.data.js`} />
        <script defer src={`${designBase}section-nav.js`} />
        {/* ONE compact family header (owner, 26 Sep 2026 — EF-04 header takeover + EF-25): on
            every site-tree family page the family navigation replaces the primary navigation in
            the same header row; labels via window.__AHV_T, hrefs via AHV_LOCAL_PATHS, so one file
            serves every locale. */}

        <script defer src="/design/family-header.js?v=20261006-row" />
        <meta name="google-site-verification" content={verification.googleSiteVerification} />
        <meta name="msvalidate.01" content={verification.msvalidate01} />
        <meta name="facebook-domain-verification" content={verification.facebookDomainVerification} />
      </head>
      <body data-ahv-chat-open="false">
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
               visible throughout - that is the mobile-first paint.
               The live root (#dc-root, mounted FIRST in the root by boot, which
               marks the root data-ahv-live-pending from that moment until the
               swap) waits out of flow at top 0, invisible, while a phone keeps
               the snapshot on screen; boot swaps the two in one frame
               ("retired") once the live DOM has settled, so the live page never
               moves into the viewport (lane P-perf, 29 Sep 2026: that move
               scored CLS 1.0 on phones) and the sitewide scripts restyle it
               before anyone sees it (desktop CLS 0.15-0.29 from those passes on
               /festivals/ and the retreat page). Desktop shows paper until the
               swap, as it already did while held. If the runtime never renders
               ("held" after release) boot moves its partial root back behind
               the snapshot, where it always was. Nothing here may target
               #dc-root without data-ahv-live-pending: without JavaScript the
               server snapshot itself still carries that id.
               The desktop hold is display:none, not visibility:hidden (lane
               P-perf, 29 Sep 2026): the visitor saw nothing either way, but an
               invisible-yet-laid-out phone snapshot still downloaded its eager
               and near-fold images and its inline backgrounds, competing with
               the live view (runtime mounted 1.3-1.5 s later on staging). The
               snapshot stays in the served HTML for crawlers and no-JS readers.
            4. Inline background images are not fetched until boot marks their
               element data-ahv-bg (first screen at once, the rest near the
               viewport — media-loading.mjs, createBackgroundDeferral). Inline
               here so it applies to the server snapshot from the first style
               pass. Scoped to the design-view root (data-ahv-bg-defer), the
               only root the boot script runs in — native views that reuse the
               id are never matched. Only background-image is suppressed: colour, size and
               position stay, so a tile shows its own fill until the image
               arrives, as on a slow connection today. Behind
               (scripting:enabled): with JavaScript off nothing would ever
               reveal them, so a no-JS reader keeps every background, and a
               browser that does not know the query simply loads as before. */}
        {/* Marks a scripted document before the styles apply (the desktop hold above keys on it), and arms the
            runtime-failure fallback: if the root is still "held" after 10 s, the snapshot is revealed. */}
        <script dangerouslySetInnerHTML={{ __html: "(function(){var d=document.documentElement;d.setAttribute('data-ahv-js','');setTimeout(function(){var r=document.getElementById('ahv-design-root');if(r&&r.getAttribute('data-ahv-snapshot-state')==='held')r.setAttribute('data-ahv-fallback','');},10000);})();" }} />
        <style>
          {"html,body{margin:0;background:#F7F4EA;color:#2A2118}x-dc{display:none!important}" + /* approved design payload palette (site.config.json vendored note). brand-allow: rogue-hex */
            "@media (min-width:700px){#ahv-design-root[data-ahv-snapshot-state='released']>[data-ahv-snapshot]{display:none!important}}" +
            // Reserve the first viewport while a translated/runtime view mounts.
            "#ahv-design-root[data-ahv-snapshot-state='held'],#ahv-design-root[data-ahv-snapshot-state='released']{min-height:100vh}" +
            "#ahv-design-root[data-ahv-live-pending]{position:relative}#ahv-design-root[data-ahv-live-pending]>#dc-root{position:absolute!important;top:0!important;left:0!important;right:0!important;visibility:hidden!important;pointer-events:none!important}" +
            // Desktop hold only when this document runs script (html[data-ahv-js], set by the inline script below)
            // and the runtime has not failed (data-ahv-fallback). Without JavaScript, or when the runtime never
            // releases the hold, the phone-width snapshot is shown as a centred readable column instead of a blank
            // page (parent review 29 Sep 2026: desktop no-JS showed nothing; the snapshot is in the HTML).
            "@media (min-width:700px){html[data-ahv-js] #ahv-design-root[data-ahv-snapshot-state='held']:not([data-ahv-fallback])>*{display:none!important}" +
            "#ahv-design-root[data-ahv-snapshot-state='held']>[data-ahv-snapshot]{max-width:480px;margin:0 auto;box-shadow:0 0 0 100vmax #F7F4EA}}" + /* same approved design payload palette as the body rule above. brand-allow: rogue-hex */
            // A snapshot captured with the cookie notice carries a copy whose buttons need script; without script no
            // tracking can run, so that inert copy is not shown to no-JS readers (scripted pages are unaffected).
            "html:not([data-ahv-js]) #ahv-consent{display:none!important}" +
            "@media (scripting:enabled){#ahv-design-root[data-ahv-bg-defer] [style*='url(']:not([data-ahv-bg]){background-image:none!important}}"}
        </style>
        {/* Arabic script is cursive: the design's uppercase letter-spacing (tracked
            labels, eyebrows) breaks letter joining, so it is reset for Arabic
            only. Applies to the locale lane's lang="ar" documents; no other
            locale or the English lane is affected. */}
        {lang === "ar" ? <style>{"html[lang=ar] body *{letter-spacing:0!important}html[dir=rtl] #ahv-contact-controls{direction:ltr}html[dir=rtl] #ahv-contact-controls .ahv-contact-label{unicode-bidi:plaintext}"}</style> : null}
        {l10nScript ? <script dangerouslySetInnerHTML={{ __html: l10nScript }} /> : null}
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
