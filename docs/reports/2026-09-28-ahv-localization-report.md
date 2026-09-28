# AHV main-website localization + English feedback — worker report

Task WOPS-AHV-FINAL-DRAFT-20260924-001. Worker: Claude CLI (claude-opus-5-5). Updated 2026-09-28 IST.
- Branch `codex/ahv-final-draft-20260924`, pushed fast-forward to `codex/ahv-english-staging-20260915` (PR #309). The PR stays BLOCKED on its protected review gate; no bypass was used.
- The 25 Sep interim report is preserved at `logs/REPORT-interim-20260925.md`; its architecture section still describes the system accurately.

**Status: candidate on protected staging — NOT release-ready.**
- **What is complete:** translation is complete, hosted QA is done, and English feedback EF-04, EF-04a and EF-25 are on staging.
- **What still blocks release:** clinical sign-off, native-speaker review, and owner facts (listed below).
- **Actions not taken:** no production or DNS action, no emails, no credits.

## Staging (protected)
- **Alias:** https://ahv-final-staging.vercel.app → **dpl_HEZxY3oq7fFM1cA2wXfhJH3nU743** (target: preview), aliased 2026-09-28 09:06:17 IST.
  - Built from `f5e7fd8c`; logs are in `logs/vercel-*-20260928-r4.*`.
  - 2,941 static pages.
- **Protection:** anonymous request → 302 to Vercel login; `x-robots-tag: noindex, nofollow, noarchive, noimageindex`; robots.txt `Disallow: /`.
- **Rollback chain (all previews):** dpl_6UHi7gcLA1mbsq7AVsrvh263FAfs → dpl_7oD89UyjXkQhdAdpX5R4zzoeJJxY → dpl_F9LWa6pJpFQbiRZmmr63c5y9WtDK → dpl_DZDP8tUC2e7VsgpA1b4tEGBMSmNe.

## Translation completeness (exact)
- **Jobs:** 7,344 of 7,344 locale-batch jobs accepted, 0 rejections open. A full revalidation against the frozen source passes 7,344/7,344.
  - Batches: 612 per locale, at most 25 units each.
  - Workers ran in 3–5 parallel lanes at medium effort; retries at high effort. Runs: wf_082c9d81-bbb, wf_8347816b-1cc, wf_4dc34964-d8e, wf_56871d82-02d, wf_3d3009ee-328.
- **Catalogue size:** 14,110–14,117 of 14,117 units per locale.
- **Not translated (by rule):** 27 unit-locales, covering 11 distinct English source units that the workers refused under the clinical rules. The sentences:
  - "cure any malady";
  - cancer-patient passages;
  - "best medicines";
  - "increases … longevity";
  - "permanent solution for bronchial issues";
  - one Panchakarma description (zh).

  Plus the Spanish/Italian ordinal fragments "rd"/"th". These show in English. They are the release gate's only failure (`l10n/release-gate.json`), and they need Dr. Deepu John to rule on the ENGLISH claims first (HARD GATE 7).
- **Numeric check:** 32 reviewed, source-bound exceptions (`l10n/validator-exceptions.json`). Each one names the exact unit, frozen hash, locale and required rendering; no general loosening.
  - Idiomatic renderings: Arabic dual and ordinal words, German decimal comma, Roman-numeral centuries, Dutch "anderhalf", Japanese 10万/30万, Korean hour+minute, Russian "однодневный", French "9 h à 17 h".
  - The rest are owner-approved PDF texts.
  - Genuine errors were retried, not excepted:
    - Italian "over 60" for "Senior Citizen", an invented threshold.
    - A Russian 25th-anniversary gloss.
    - Empty French fragments.
    - Hindi SEO text over the length limit.
    - Untranslated times and titles with no reason given.
- **Label consistency:** 12 coordinator overrides in `l10n/overrides/*.json`, each validated. They align the homepage menu and footer labels with the shared header in 7 locales (e.g. DE "Yoga & Ausbildung" → "Yoga & Training", FR "Nous contacter" → "Contact").
- **Linguistic review:** no native-speaker review has been done. Machine validation and coordinator review are not a linguistic sign-off.

## Server-rendered localized HTML
- 222 routes × 12 locales rendered from the final catalogue (`l10n/prerender/<locale>/`, git-ignored). Every snapshot is present and matches its hash in `l10n/prerender-manifest.json`.
- EN snapshots: 236 routes plus the 20 English 301s.

## Defects found and fixed this round (all committed, tests added where a guard is possible)
| Defect | Fix (commit) |
|---|---|
| Four `.html` routes (`/ayurvedic-treatment-packages.html`, `/karkidaka-…`, `/panchkarma-treatment.html`, `/treatment-in-kerala-russian.html`) returned 404 in all 12 locales, while English hreflang and the switcher linked to them | `enPathFor` stopped appending a slash to file-style paths (ac236815) |
| Locale finders requested a `search-index.<lang>.json` that is never built: a 404 on every locale page, and the unread response kept a connection open so prerender stalled | `search.js` uses the locale index directly (ac236815) |
| 17 pages that English retires with a 301 (cart/checkout, test pages, `*-old`, map, attraction splits, founders-message) were live pages in all 12 locales | `routes.mjs` mirrors each English 301 per locale to the target's localized path (204 single-hop 301s, chains collapsed; a0afb60f) |
| Homepage menu/footer labels differed from the shared header in 7 locales | validated overrides; the EF-04a guard now runs per locale and asserts both menus exist (ab4ef248) |
| Family header, EF-25 coverage, pinned bars, cookie notice over the homepage menu, FR overflow, homepage register, finder badge/Clear, /panchakarma/ retired sidebar | see `../english-feedback-20260926/CLAUDE-EF-DISPOSITIONS.md` (28 Sep section) |

## Tests
- Site unit suite: **163/163 pass**, including chrome-consistency in 17 cases (EN + 12 locales) and l10n 26/26.
- Test intent changes (flagged for review, not self-approved):
  - `newsletter-and-form-transport`: the >200 coverage bar is now measured on the served footer form.
  - `chrome-consistency`: extended to all locales.

## Hosted QA on the SAME alias (tools under `vc env run`; evidence in the listed folders)
- **EF readback** (`../english-feedback-20260926/hosted-readback-20260928/alias-r4/`): 10 pages × 1440/390, all 200.
  - Short Yoga label shown in each language: EN "YOGA & TRAINING", FR "YOGA ET FORMATION", JA "ヨガ・トレーニング", HI "योग और प्रशिक्षण".
  - No long Sanskrit label in the chrome.
  - Family header on family pages.
  - The cookie notice overlaps nothing, and drops below the open homepage menu in EN/DE/FR/AR.
- **Currency defaults** on /ayurvedic-treatments/ (37 priced cards per locale): EN/HI ₹; DE/FR/ES/IT/PT/NL €; RU/AR/ZH/JA/KO $. This is selection of the approved table, never conversion.
- **Language switcher, footer, RTL, CJK:** `qa-switcher-hosted-20260928/results.json`. Summary below.
- **Console:** 0 errors on all pages checked, except the homepage at 390px. There, the third-party Chatbase widget's style request is blocked by CORS on the preview origin; that is a Chatbase dashboard setting, outside this repo.

### Language switcher, footer, RTL, CJK (hosted, final alias)
- **Coverage:** 13 languages × {homepage, deep programme page /panchakarma-therapy/ in each language's own slug} × {1440, 360, 390, 430} = **104 page-views**. Evidence: `qa-switcher-hosted-20260928/` (results.json + screenshots of the open switcher, phone menu and footer).
- **Switcher:** 13 options on every page, each pointing to THIS page's localized equivalent (deep links; no reset to the homepage). The switcher is present on desktop and in the phone menu.
- **Keyboard:** open and Escape work on desktop.
- **Server language and direction:** `lang`/`dir` are correct and survive hydration. Arabic is `rtl`; the other 12 are `ltr`.
- **Footer:** no horizontal overflow at 360/390/430 or desktop in any language, including Arabic and CJK.
- **Errors:** one Chatbase CORS error plus its uncaught "Failed to fetch" per page (third-party widget allowlist); 0 other console errors; 0 other failed requests.
- **Not re-tested on hosted this round:**
  - The persisted language choice across navigation; it was verified locally on 25 Sep.
  - Touch-specific gestures beyond Playwright's mobile emulation.
  - Physical devices.

## Exact blockers before any production step (the release checkpoint goes to the parent)
1. **Clinical (HARD GATE 7):** 11 English source claims are untranslated in some locales and need Dr. Deepu John's ruling on the English text first:
   - "cure any malady";
   - cancer-patient passages;
   - "best medicines";
   - longevity;
   - "permanent solution for bronchial issues";
   - the Panchakarma description.

   The EN cancer supportive-care page also still carries "[TO CONFIRM — physician wording]".
2. **Language lock (GST exposure):** about 1,400 banned-word occurrences remain in migrated legacy English body copy across 220 pages, plus 92 in legacy SEO titles and descriptions. The translations inherit the English meaning (workers substituted the clinical register where the rules allowed). This needs Abilash's decision on a sitewide register rewrite.
3. **Linguistic review:** no native-speaker review in any of the 12 languages.
4. **Owner facts still flagged "[TO CONFIRM]":**
   - defence-offer eligibility;
   - training schedules and yoga session times;
   - villa rates and the identical 144–244 sq ft on the villa pages;
   - "Book my treatment" → enquiry form on 21 pages;
   - an enquiry-form programme preselect;
   - the Chatbase dashboard allowlist and its wrong number (Q-CHATBOT-WRONG-NUMBER).
5. **Legacy routing:** 8 legacy URLs with no equivalent go to their nearest page; they are flagged for owner review (`l10n/routes.json` redirects marked "NO EQUIVALENT").
6. **Review gate:** PR #309 is BLOCKED on its protected review gate. It needs owner or authorized review; no admin bypass.
7. **Production and DNS:** none performed. The staging build is noindex by design and must not be promoted as production.
