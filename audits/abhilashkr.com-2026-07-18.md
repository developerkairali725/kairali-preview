# abhilashkr.com — publish-lane audit + fix pass · 2026-07-18 18:51:24 IST

Lane: PUBLISH (owner directive D-20260718-17 — publish the portfolio to its domain, fix anything necessary, NO chat bubble).
Site class: personal / matrix-EXEMPT (D-RULE-MATRIX-EXEMPT, standing ruling 17 Jul 2026). Maintenance + publish, NOT a redesign — no front gates armed, no restyle performed.
Branch: feature/abhilashkr-publish (base: main @ 8759ed6).

## What was found → fixed (all small, faithful; content untouched)

1. **Site still pointed at its Vercel preview URL, not its domain** — `src/lib/config.ts` `SITE_URL` was `https://portfolio-website-six-pi-92.vercel.app`; canonical tags, OG url/images, hreflang, sitemap.xml, feed.xml and JSON-LD all key off it. → set to `https://abhilashkr.com`.
2. Same stale preview host hard-coded in `public/robots.txt` (Sitemap line), `public/llms.txt` (all 7 key-page links), and the OG-image footer label in `src/app/api/og/route.tsx`. → all now `abhilashkr.com`.
3. **ESLint errors (2)** in `src/app/api/og/route.tsx`: `react/jsx-no-comment-textnodes` on the `{section} // EST. 1908` text node, and `@typescript-eslint/no-explicit-any` on the catch. → template-literal for the label (identical render), typed error narrowing. `pnpm lint` now clean.
4. **Contact form silently discarded messages** — submit handler was `// Simulate contact form submission`: it showed "Transmission Logged" and threw the visitor's message away. No backend exists and HARD GATE 6 forbids inventing one. → submit now composes a `mailto:info@kairali.com` draft (locked public contact address, already shown on the page) with the division subject + message body, and the success state honestly says the email draft was opened. UI otherwise unchanged.

## Verified NOT broken (no action)

- DE / FR entries in the language switcher are deliberate greyed-out "coming soon" spans, not links — left as designed (TODO(i18n) documented in the component).
- Footer socials = his personal LinkedIn only. Left exactly as-is per D-20260718-17 (personal links, not the group set).
- Phone (IVR) +91-9555-156-156 and info@kairali.com are pre-existing site content (locked facts untouched).
- 404 page renders correctly (`/nonexistent-page` → 404).

## Chat bubble (D-20260718-17: must NOT appear)

- Zero `@kairali/chat` / Chatbase imports or scripts anywhere in `sites/abhilashkr` (grep + rendered-DOM check on every page).
- `scripts/chat-bubble-lint.mjs` exempts the site via the shared EXEMPT ledger and prints it LOUDLY every run; the ledger entry in `scripts/factory-matrix-lint.mjs` now cites **D-20260718-17** explicitly (was only D-RULE-MATRIX-EXEMPT). chat-bubble-lint: PASS · factory-matrix-lint: PASS · all 14 scripts/test suites: 245/245 pass.
- No footer-socials lint exists yet (D-20260718-04 is blocked on Q-SOCIAL-LINKS-SOURCE); the registry gate `social-press-links` is a per-launch packet check, not a repo lint — nothing to exempt there today.

## Machine evidence

- `pnpm install --frozen-lockfile` clean · `pnpm build` clean (Next.js 16.2.10, 21/21 static pages) · `pnpm lint` clean after fixes.
- HTTP pass (next start, port 4315): all 16 pages + sitemap.xml, robots.txt, llms.txt, feed.xml, manifest.json, /api/og → 200; unknown route → 404.
- Link/image crawl: 128 internal URLs referenced across all 16 pages — 0 broken. External links: whyayurveda.org ×3 and outlooktraveller.com → 200; LinkedIn 999 / worldtravelawards 403 = bot-blocks, links valid.
- Playwright (repo @playwright/test 1.61.1, Chromium): **20/20 pass** — per page: HTTP 200, zero console errors, zero broken `<img>`, no chatbase node in DOM; mobile 375×812: no horizontal overflow (/, /about, essay), hamburger nav opens; contact form: fill → submit → honest "Draft Prepared" state renders.
- Metadata spot-checks: canonical `https://abhilashkr.com[/about|/writing/...]`, og:url + og:image on the domain, sitemap/feed URLs on the domain.

## Deploy + domain state (see PR body for the live proof)

- Vercel project `kairali-web-factory-abhilashkr` (team kairali, prj_6fD2BkvrieK5dQPBnOD18sICPJjh), git-linked to kairali-digital/kairali-web-factory, production branch `main`, root `sites/abhilashkr` — merging this PR auto-deploys production; a CLI `vercel --prod` of this branch was also run so production carries the fixes immediately.
- DNS reality at audit time: abhilashkr.com registered at GoDaddy (nameservers ns67/ns68.domaincontrol.com), apex A 15.197.148.33 / 3.33.130.190 = GoDaddy parking lander. **DNS is NOT on Vercel — the record flip is the owner's one manual step** (records in the PR body). DNS flips are HUMAN actions (Factory rule).
