## AHV campaign landing template kit v2 (4 variants) + Panchakarma pilot (noindex preview)

### 1. What was built
A template kit for AHV campaign landing pages. Each campaign is one content file plus a change log, rendered in four design variants (A, B, C, D) by shared server components. Highlights:
- 4 variants with per-variant skins, locale and currency switching, EU consent banner, mobile sticky bar, gallery, "Ask anything" dialog and a facade for films.
- The default form is the **live campaign enquiry form** (one step: name, email, phone, message, consent) posting to `/api/lead/`. The 3-step form is opt-in.
- Success screen shows the opaque reference code and channel buttons (WhatsApp, Instagram, Messenger, phone). Channel URLs carry only the ref code.
- Proof area: Tripadvisor 4.6 / 450 reviews "as of August 2026" (`data/ratings.ts`), NABH, award logos (variant A). Variants B and D also show the Travelers' Choice badge in the Tripadvisor card. The Google rating shows only when `AHV_GOOGLE_REVIEWS_ENABLED` and the Places credentials are set.
- Tags and pixels load only with the master switch (`AHV_ANALYTICS=1`, `AHV_STAGING=0`). In the EU/UK, Google tags (gtag.js and GTM) load before consent and run under Advanced Consent Mode (denied by default); all other pixels wait for a granted choice. Chat is not behind the master switch, by design: it loads only when the visitor taps "Chat here now" (EU/UK: it asks first). No IDs are set in this PR.
- EU/UK/CH footer "Cookie preferences" clears the stored choice, resets Consent Mode to denied and reloads, so the banner shows again.
- `pending()` placeholders render as visible `[id]` text in every field and in the page metadata.
- Tooling: `pnpm lp:check <slug>` (lint plus a tsc type check of `campaign-v2/`), `pnpm lp:perf <slug>`, `tools/lp-contrast.mjs`, and `tools/lp-enquire-check.mjs` (no package script: run `node tools/lp-enquire-check.mjs --base <server>`).

Docs: [build spec](./2026-10-07-ahv-campaign-lp-v2-build-spec.md), [authoring guide](./2026-10-07-ahv-campaign-lp-authoring-guide.md), [performance notes](../../campaign-v2/PERF.md).

### 2. Preview URLs (all `noindex, nofollow`)
`/lp-v2/panchakarma/a`, `/b`, `/c`, `/d`

### 3. Test results
- Baseline at c85e51784 (before lp-v2): 330 tests, 327 pass, 3 fail (pre-existing, unrelated).
- After: `pnpm test` 552 tests, 552 pass, 0 fail. (The 3 baseline failures did not reproduce.)
- New lp-v2 tests: `node --test test/lp-v2-*.test.mjs` 210 pass, 0 fail.
- `npx tsc --noEmit -p .`: clean.
- `pnpm lp:check panchakarma`: types clean, 0 errors, 2 warnings (`gallery.category`: one Dining and one Therapies image; a second photo of each is an owner/content input). `--production` fails only on the open placeholders (C2, C4, C14b) and on visible words (346, minimum 450 for production).
- `node tools/lp-enquire-check.mjs`: all PASS in Chromium and WebKit (hero SKIPs are expected on B/C phones).
- `node tools/lp-contrast.mjs` (normal and `--white`): 108 text-over-photo nodes, 0 failing.
- E2E (`node tests/lp-v2-e2e.mjs <base>`, Playwright; output written locally to `docs/lp-v2/screens/15/e2e-output.txt`). Passing: no horizontal overflow or phone scrollers, consent banner only for DE, no third-party request before consent, no reply-time promise, noindex present, Tripadvisor 4.6 / 450 / "as of August 2026" and no Google item and no bracket placeholders in the proof area, all award logos 200, 503 shown verbatim, intercepted success with ref and clean channel URLs, keyboard walk (no hidden or invisible focus), Gallery / Ask / Locale dialogs trap focus, close on Esc and return focus, EUR shows `[C2]` without errors. The text-under-12px check initially flagged the proof-area source line and "/ 5" (11px); both are now 13px.
- E2E sections added in the final fixes (`LP_E2E_ONLY=5,6`): as a DE visitor, Accept, then Cookie preferences brings the banner back with the stored choice cleared (A 1440, D 390); every standalone link, button and summary is at least 48px at 390 and 1440 on A–D, including the dialog close and the error-state links (submits intercepted). Both pass.

Lighthouse (mobile = PSI default preset; median of 3; `pnpm lp:perf panchakarma`, production build over HTTP/2):

| Variant | Preset | Perf | A11y | BP | SEO | LCP ms | CLS | TBT ms | v2 JS KB |
|---|---|---|---|---|---|---|---|---|---|
| A | mobile | 99 | 100 | 100 | 66 | 2111 (warn, under 2500 limit) | 0 | 24 | 27.9 |
| B | mobile | 99 | 100 | 100 | 66 | 1958 | 0.007 | 12 | 27.9 |
| C | mobile | 100 | 100 | 100 | 66 | 1511 | 0 | 11 | 27.9 |
| D | mobile | 99 | 100 | 100 | 66 | 1953 | 0.025 | 17 | 27.9 |
| A | desktop | 100 | 100 | 100 | 66 | 451 | 0 | 0 | 27.9 |

SEO 66 is expected: the only failing SEO audit is `is-crawlable`, from the intentional noindex.

### 4. Screenshots
Full-page screenshots (4 variants x 1440/390 x IN/DE, plus form 503/success and EUR states) are kept out of git to avoid ~89MB of binary history in the monorepo. `docs/lp-v2/screens/` is git-ignored; `node tests/lp-v2-e2e.mjs <base>` regenerates them. The full set from this verification run is archived with the owner and is available on request.

### 5. Open owner inputs (build spec section 11)
- **C2**: 14-night "from" totals per villa category, currencies, validity date (Sales / owner). Shows `[C2]` in the preview.
- **C4**: doctor qualifications, years, languages; confirm the three doctors (Dr. Deepu John). Shows `[C4]` in the preview.
- **C8**: Healing Village opening year (1908 = family tradition, decided; owner to confirm).
- **C14**: is the patient seen by a doctor every day of the admission? Until then the copy says "throughout your admission" (Dr. Deepu John).
- **C14b**: physician-approved guidance on typical Panchakarma length of stay (FAQ "How long should my admission be?", not yet in spec section 11; add it there).

C5 (ratings) is resolved. Other items in section 11 (C3, C7, C9, C10, C11, C13) are listed in the spec and are not blockers for this preview.

`[C2]` and `[C4]` placeholders are expected in the preview.

### 6. Known gaps against the build spec §13 done-bar
- **No-JS submission:** the native `<form>` post to `/api/lead/` returns 415 today (the route accepts JSON only).
- **Honeypot:** checked client-side only; there is no server-side check yet.
- **Success:** shows the §7b in-page handoff (ref code and channel buttons) instead of redirecting to `/ppc-thanks/`.
- **German:** Accept-Language `de` does not render German. Only `en` ships; translations are not wired, and `lp:check` now fails any locale other than `en` (guide §10, "not yet supported").
- **Screenshots:** not attached in git (see §4). Attach a subset to the GitHub PR itself.

### 7. History note
Commit `8c2d24e48` ("shared route guard, Document shell and variant composition") does not compile on its own; the next commit fixes it. Squash or skip it when bisecting.

### 8. Out-of-scope follow-ups
- **Server-side honeypot and no-JS route (one PR on `/api/lead/`):**
  - accept form-encoded bodies, map the native field names to the `fields` shape and answer with a 303 redirect. The native form posts `fullName`, `consent=true` and `lp_hp_ref` as flat fields, which do not match the JSON contract;
  - the adapter does not send the honeypot value today (`forms/adapter.ts`, `kit/lead.ts` drops it client-side), so it must forward it (e.g. a top-level `hp`) before a server check can work.
- **Global Privacy Control:** honour `navigator.globalPrivacyControl` in `kit/consent-region.ts` and `integrations/consent.ts`.
- **GTM consent:** GTM loads in the EU before consent. Gate it like the other non-Consent-Mode tools, or require built-in consent checks on every GTM tag (`integrations/README.md`).
- **Meta Pixel:** add `fbq('set','autoConfig',false,id)` and keep Automatic Advanced Matching off in Events Manager (turn off automatic form matching), so the pixel never reads the free-text or contact fields.
- **Google rating:** add Suspense or a time budget to the `ProofStrip` Google fetch before enabling `AHV_GOOGLE_REVIEWS_ENABLED` (a cold or missed fetch can add up to 2.75 s TTFB).
- **Images:** re-encode `gal-poolside-rest-palakkad-2026.jpg` (3.5 MB) and `gal-post-therapy-stillness-wakem.jpg` (PNG data under a `.jpg` name). Not rewritten here, because new blobs would add to history while the old ones stay.
- Server-side conversions (Meta CAPI, Google enhanced conversions / offline import).
- Lead-store columns for program and channel (and marketing opt-in).
- Rebase the EU banner onto PR #353's granular consent once it merges.
- Chatbase placeholder "Type your health concern..." invites health data. Flag to the chat owner.
- Higher-resolution doctor portraits are needed.
- Google rating needs `AHV_GOOGLE_REVIEWS_ENABLED`, `AHV_GOOGLE_PLACES_API_KEY` and `AHV_GOOGLE_PLACE_ID`.
- Tracking IDs to fill at go-live (`campaign-v2/integrations/README.md`).
- Migrating the other 15 campaign routes; moving ad traffic (owner + Vikash, per URL).

### Final verification fixes
- `served-tree-lint`: `/.next-lp-perf/` and `/docs/lp-v2/screens/` added to `NOT_SERVED` with reasons.
- Proof-area small text raised from 11px to 13px (`.lp-proof__src`, `.lp-proof__of`).

### Final review fixes
- Cookie preferences works on /lp-v2 (EU/UK/CH).
- `pending()` renders as `[id]` everywhere, including `<title>`; `generateMetadata` shares the page's slug guard.
- `lp:check` type-checks `campaign-v2/`, lists open placeholders on previews, and enforces the guide's remaining rules: film titles, fee rows (with a USD figure in every row), offer fields, gallery per category (warning), alt text scanned for claims and register words, `en`-only locales.
- Authoring guide matches the code: campaign registration, compiling §4 example, image sizes, form variant name, no server-side conversions, what variant D drops, §10 not yet supported.
- Remaining 44px tap targets raised to 48px.

### 9. Safety
Nothing deployed to production; no ad URLs changed; no consent/analytics change outside /lp-v2.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
