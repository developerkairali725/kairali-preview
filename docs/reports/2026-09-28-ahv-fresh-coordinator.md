# AHV fresh coordinator session — WOPS-AHV-FINAL-DRAFT-20260924-001
Written 2026-09-28 23:11:21 IST. Session 13d01115-5fb0-4b9f-a5e6-8df5d936639b; start HEAD 4552f9ec → end HEAD d5e33aa5 (pushed to PR #309 head).

## Where it stands
- **Stable protected staging:** https://ahv-final-staging.vercel.app → dpl_9K73gVgguumSE35iutANP7pjfeTH (commit d5e33aa5), preview target. Production and DNS untouched.
- **Festival regression (owner P0):** root cause was the 28 Sep large-desktop composition in article-reader.css; shared fix 3374e0e5 moves lone photos and one-card lists into the text column. Hosted-verified on the stable alias (/festivals/ 1440/390, /de/festivals/ 1920) and on the preview; 120-route sweep 37→10 flagged (the 10 are subheading pairs that read correctly and routes without a main element). Owner browser review pending.
- **Commits:** 3374e0e5 festival · 72987a9c SEO heads · bc908449 clinical batches + medical corrections · ad1484f4 rates/offers/EF-12/RMO · 464a9813 l10n freeze · 9f2d265c EN prerender 229/229 · b2f959a1 translations 72/72 · bb8936d0 es/it ordinals · a38a5b25 + d5e33aa5 QUESTIONS · 4aceb2b0 + c5f54914 campaign forms/typos · ed57dd5b 12-locale snapshots.
- **Tests:** node --test 167/167; strict l10n build clean in 12 locales; revalidate 7512/7512; release gate FAIL on two structural residuals only (Q-AHV-L10N-GATE-RETIRED).
- **Hosted evidence (deliverable folder):** festival/hosted-*, hosted-r13a/ (EF sweep 52 PASS / 0 FAIL, readback), hosted-r13b/ (EF sweep 61 PASS / 0 FAIL on the final candidate, locale persistence).
- **Medical copy:** changed under the owner's 28 Sep authority; not a clinician signature. Dr. Deepu John's review is still required before production (HARD GATE 7).

## Every register row (68)

| # | Row | Priority | Disposition |
|---|---|---|---|
| 1 | EF-01 — Homepage currency toggle and approved rates | P1 | HOSTED PASS on stable staging R13b dpl_9K73gVgg (hosted-r13b/ef-sweep: status 200, 0 broken images, 0 bad internal links, fix-proof text) + preview R13a |
| 2 | EF-02 — Old Ayurveda package names and broken links | P1 | HOSTED PASS on stable staging R13b dpl_9K73gVgg (hosted-r13b/ef-sweep: status 200, 0 broken images, 0 bad internal links, fix-proof text) + preview R13a |
| 3 | EF-03 — Yoga prices restored | P1 | HOSTED PASS on stable staging R13b dpl_9K73gVgg (hosted-r13b/ef-sweep: status 200, 0 broken images, 0 bad internal links, fix-proof text) + preview R13a |
| 4 | EF-06 — Permanent clinical-establishment certificate | P1 | HOSTED PASS on stable staging R13b dpl_9K73gVgg (hosted-r13b/ef-sweep: status 200, 0 broken images, 0 bad internal links, fix-proof text) + preview R13a |
| 5 | EF-09 — Cuisine image and clickable destinations | P1 | HOSTED PASS on stable staging R13b dpl_9K73gVgg (hosted-r13b/ef-sweep: status 200, 0 broken images, 0 bad internal links, fix-proof text) + preview R13a |
| 6 | EF-10 — Experience upgraded images/copy/links | P1 | HOSTED PASS on stable staging R13b dpl_9K73gVgg (hosted-r13b/ef-sweep: status 200, 0 broken images, 0 bad internal links, fix-proof text) + preview R13a |
| 7 | EF-14 — About images/facts/links | P1 | HOSTED PASS on stable staging R13b dpl_9K73gVgg (hosted-r13b/ef-sweep: status 200, 0 broken images, 0 bad internal links, fix-proof text) + preview R13a |
| 8 | EF-15 — Things-to-do imagery/copy/links | P1 | HOSTED PASS on stable staging R13b dpl_9K73gVgg (hosted-r13b/ef-sweep: status 200, 0 broken images, 0 bad internal links, fix-proof text) + preview R13a |
| 9 | EF-18 — Gallery hub sizing/clickable child navigation | P1 | HOSTED PASS on stable staging R13b dpl_9K73gVgg (hosted-r13b/ef-sweep: status 200, 0 broken images, 0 bad internal links, fix-proof text) + preview R13a |
| 10 | EF-20 — Virtual tour honest coming-soon presentation | P1 | HOSTED PASS on stable staging R13b dpl_9K73gVgg (hosted-r13b/ef-sweep: status 200, 0 broken images, 0 bad internal links, fix-proof text) + preview R13a; virtual tour stays honest coming-soon until footage (TOUR-VIDEO) |
| 11 | EF-22 — Video-gallery first thumbnail | P1 | HOSTED PASS on stable staging R13b dpl_9K73gVgg (hosted-r13b/ef-sweep: status 200, 0 broken images, 0 bad internal links, fix-proof text) + preview R13a |
| 12 | EF-23 — Retreats duplicate images and useful gallery captions | P1 | HOSTED PASS on stable staging R13b dpl_9K73gVgg (hosted-r13b/ef-sweep: status 200, 0 broken images, 0 bad internal links, fix-proof text) + preview R13a |
| 13 | EF-04 — Single family header takes over primary; compact filters; no extra family bottom CTA | P1 | HOSTED on preview R13a (readback 7 routes x2 widths incl. /de/, /ar/): header takeover + short label OK; repeat of keyboard/RTL deep check on stable pending |
| 14 | EF-04a — Short Yoga & Training label on home/shared headers | P1 | HOSTED on preview R13a: only 'YOGA & TRAINING' in headers/menus, no long label anywhere |
| 15 | EF-16 — Sightseeing family style and uniform footer; remove underline drift | P1 | HOSTED PASS on stable staging R13b dpl_9K73gVgg (hosted-r13b/ef-sweep: status 200, 0 broken images, 0 bad internal links, fix-proof text) + preview R13a |
| 16 | EF-25 — Policy/compliance/site family navigation, cookie overlap and every sitemap family | P1 | HOSTED on preview R13a: consent notice never overlaps contacts/header; family nav on legal pages |
| 17 | EF-05 — iPhone preferred dates empty/focus/selected states | P2 | WebKit iPhone-13 emulation PASS locally; physical iPhone not available (recorded); hosted EF-05 row PASS R13a |
| 18 | EF-07 — All offers: terms, internal notes, nav and staggered discount consistency | P1 | COMMITTED ad1484f4 (C-05 mobile card, C-14 safeguards, C-20/C-23 bands) + hosted OD-OFF/OD-DEF PASS on R13a; owner items C-06/C-21/C-22/C-24 open |
| 19 | EF-08 — Senior offer hero/pills/awards/portrait and experience claims | P1 | COMMITTED 4552f9ec+bc908449 (biography, claims); hosted OD-OFF PASS R13a; EN-only page (offers excluded from l10n by owner) |
| 20 | EF-11 — Facilities: remove conference hall; owner-confirmed facilities and services | P3 | HOSTED PASS on stable staging R13b dpl_9K73gVgg (hosted-r13b/ef-sweep: status 200, 0 broken images, 0 bad internal links, fix-proof text) + preview R13a |
| 21 | EF-12 — Knowledge family including13 therapy placeholders/shifted alt text | P1 | COMMITTED ad1484f4 (42 alt/image fixes, 7 routes); structural placeholder/duplicate cards + creative request pending (not applied); hosted check next candidate |
| 22 | EF-13 — Walk-in OPD copy/images/links and rates | P2 | PDF fix preserved (not reopened); OPD reception number + '35 centres' + 'internationally certified' need source (QUESTIONS item 6) |
| 23 | EF-17 — Careers family navigation, closed BDM role and application routing | P2 | BDM closed; C-32 labels removed + search label pinned (ad1484f4); hosted OD-BDM PASS R13a; careers backend = Deepu |
| 24 | EF-19 — Wrong HO/Delhi photos, older-library replacements and >3 uses | P1 | Batches 1/2 applied earlier; 41 groups classified; batches 03/04 approval HTML built (50 proposals, NOT approved) — owner |
| 25 | EF-21 — Merge Ayurveda gallery into treatments gallery | P2 | HOSTED PASS on stable staging R13b dpl_9K73gVgg (hosted-r13b/ef-sweep: status 200, 0 broken images, 0 bad internal links, fix-proof text) + preview R13a; caption relevance retained |
| 26 | EF-24 — Merge true retreat duplicates and repair archive navigation | P3 | HOSTED PASS on stable staging R13b dpl_9K73gVgg (hosted-r13b/ef-sweep: status 200, 0 broken images, 0 bad internal links, fix-proof text) + preview R13a; distinct events preserved |
| 27 | STAFF-01 — New/existing doctor profiles, yoga/nurse biographies and portraits | P0 | 4552f9ec translated (b2f959a1) + RMO overrides fr/es/it/ar; 12+ years removed (bc908449); online-consultation list/24h claim + unprofiled cards open (Q-AHV-STAFF01-FOLLOWUPS) |
| 28 | TRAINING — One-to-one/group classes by arrangement, no fixed dates | P3 | HOSTED PASS on stable staging R13b dpl_9K73gVgg (hosted-r13b/ef-sweep: status 200, 0 broken images, 0 bad internal links, fix-proof text) + preview R13a |
| 29 | ENQUIRY-CONTEXT — Editable treatment/course preselection and honest CTA labels | P2 | Treatment preselect verified; course/generic/visitor checks open |
| 30 | CLINICAL-COPY — Exact three owner-approved claim-replacement batches | P0 | COMMITTED bc908449 (+addendum ad1484f4), prerendered 9f2d265c, translated b2f959a1; Dr. Deepu John review before production |
| 31 | FAQ — Historic22 FAQ items and one addiction referral answer | P1 | 24/24 published EN+12 locales (lane B); corrections committed bc908449; 25 optional disclosure answers + 7 fact-gap items for owner |
| 32 | VILLA-FACTS — Correct villa sizes, room1001/1002 facilities and rates | P1 | BLOCKED on staff measurements (Santhosh/Anoop via COS); staging placeholder allowed |
| 33 | HOSPITAL-COPY — Professional hospital wording; no internal comments | P1 | COMMITTED bc908449/ad1484f4 (cancer markers, internal notes, Travel Consultant, lavish/health-resort para); served-snapshot sweep 0 hits; C-27 held for owner; D-09 heads owner |
| 34 | MOBILE-ORIGINAL — Brown Book Now alignment/size, Maharaja CTA, larger hero video, burger search | P2 | PARTIAL hosted (R13a home 390 + menu open); mobile search open/type/results + 44px sweep still to run on stable |
| 35 | RATE-PARITY — Full approved tariffs/currency/validity/totals/policies across all page surfaces | P1 | COMMITTED bc908449 + ad1484f4 (cancer tariff + 157 lane-C entries); 23 owner/fact items in QUESTIONS; C-37 locale currency tables need generator change |
| 36 | LANGUAGES — All13languages complete after latest English changes | P0 | Delta 72/72 translated; strict build clean; 12x215 snapshots; hosted spot checks on stable (de cancer, fr staff/RMO); release gate structural residuals → Q-AHV-L10N-GATE-RETIRED |
| 37 | LANGUAGE-UX — Switcher desktop colour, deep-link persistence, Arabic/footer/newsletter | P1 | HOSTED on stable: locale kept on every navigation step (de/ar/ja); 'leak' flags are the external booking engine/EN-only campaign/xml sitemap; desktop header-click step timed out (tool) |
| 38 | CAMPAIGNS — Vikash28manifest and landing-page imports/QA | P2 | Audited (rebuilt 28 rows); retreat/treatment form contrast + typos still open for coordinator; Vikash sheet export + switch decisions owner |
| 39 | FORMS — Real enquiries, consultation,training,OPD,career/newsletter/guide/popup delivery | P1 | BLOCKED on Deepu PR317 backend; integration QA prep |
| 40 | DATA-CONSENT — Uploads/access/retention/CRM choice and policy enforcement | P2 | BLOCKED on Deepu/Sunaj/HR operational proof; notices QA |
| 41 | MEASUREMENT — Correct GA4/Ads/Meta/account/event/consent and share cards | P2 | Read-only audit done (no activation); paid-click query guard + conversions need owner ruling (HG11) |
| 42 | CHATBASE — Priya wrong number/preview CORS and usable chat | P2 | BLOCKED(Chatbase dashboard): bot shows +91-92898-38794 and preview CORS errors; site links all correct |
| 43 | SEARCH-SEO — High-volume legacy/paid/locale URL coverage and SEO | P1 | COMMITTED 72987a9c (native heads/hreflang); 22 findings in lanes/D-seo; D-09 owner; legacy URL gaps D-12 need GSC evidence |
| 44 | PERFORMANCE — Owner PSI/GTmetrix plus full first-party media audit | P2 | NOT RUN this session (needs freeze + owner PSI/GTmetrix settings); next after owner review |
| 45 | PR-RELEASE — PR309/324/314 exact-head checks, review/security/dependencies | P1 | Inspected (lane D). New commits not yet pushed to PR309 head; owner lint ruling + authenticated review required |
| 46 | PRODUCTION — Production build/config/domain, backup/rollback and DNS release | P1 | HUMAN-GATED: no production/DNS without recorded exact authority |
| 47 | DOC-HUB — Same documents link,final78screen editions andcurrency language mapping | P3 | LIVE-COMPLETE; monitor |
| 48 | STAFF-NOTICE — Internal rates/name email inclKaran/Ambuj | P3 | SENT; 2 bounces recorded; no duplicate send |
| 49 | TOUCHQ — Sunaj/vendor programme-name mapping and Anoop follow-through | P3 | OPERATIONAL: Sunaj/vendor, 6 Oct deadline |
| 50 | DISCOVERY-PREP — Engine/accounts/directory research, localized descriptions | P2 | Prep split done; IndexNow key + engine accounts human (Vikash/Trusha) |
| 51 | DISCOVERY-POST — Production submissions/indexing/directory listing and reporting | P3 | AFTER LAUNCH trigger L |
| 52 | MONITOR-LIVE — Release0–2h,24–48h,days3–7,weeks2–4 checks | P3 | AFTER LAUNCH trigger L |
| 53 | ANNOUNCEMENT — Customer/database newsite/rates/HealingSecrets/OPD/yoga announcement | P3 | AFTER LAUNCH |
| 54 | TOUR-VIDEO — Integrate newly shot actual virtual tour | P3 | HOLD: awaiting footage |
| 55 | REVIEWS-LIVE — Optional live review feed and refresh | P3 | HOLD: post-launch |
| 56 | PRINT-PDFS — Separate print-quality hosting | P3 | HOLD: hosting decision |
| 57 | EXTRA-CONTENT — Additional informational hubs/search improvements | P3 | HOLD: post-launch |
| 58 | NEW-SHOOT — Additional gallery expansion/newportrait shoot | P3 | HOLD: assets |
| 59 | TF-01 — All23team-audit groups mapped | P2 | Mapped; TF-08/TF-18/TF-19 hosted rows PASS (R13a + R13b) |
| 60 | FOOTER-13 — Footer language coverage | P2 | HOSTED PASS on stable staging R13b dpl_9K73gVgg (hosted-r13b/ef-sweep: status 200, 0 broken images, 0 bad internal links, fix-proof text) + preview R13a |
| 61 | DESKTOP-SECONDARY — Large-desktop secondary families | P3 | DEFERRED post-launch (owner); functional defects tracked separately |
| 62 | PACKAGES-MOTIF-NAV — Packages motif and redundant lower navigation | P3 | HOSTED PASS on stable staging R13b dpl_9K73gVgg (hosted-r13b/ef-sweep: status 200, 0 broken images, 0 bad internal links, fix-proof text) + preview R13a |
| 63 | OWNER-DUP-MERGES — Owner48duplication decisions | P2 | HOSTED PASS on stable staging R13b dpl_9K73gVgg (hosted-r13b/ef-sweep: status 200, 0 broken images, 0 bad internal links, fix-proof text) + preview R13a; remaining owner-48 reconciliation separate |
| 64 | AWARDS-LAYOUT — Awards family layout/navigation | P2 | Local link check 0 bad on 4 awards routes; visual polish deferred (owner) |
| 65 | CSR-MAP-ASPECT — CSR Where we are and Resort Map desktop image sizing | P1 | Local 390/1440/1920/2560 no distortion/upscale (96578052 + festival fix); hosted sweep R13a no overflow; maps block hidden except how-to-reach |
| 66 | PRODUCTS-IMAGE-NAV — Ayurvedic-products stretched hero/product imagery and surviving desktop rail | P1 | Local 4-width check clean; hosted article sweep R13a clean |
| 67 | AROGYA-LOWER-IMAGES — Arogya Kendra content and oversized images above footer | P3 | CONFIG-COMPLETE r11; maps block stays hidden except how-to-reach (3bbdedb7) — no regression seen in hosted sweeps |
| 68 | FESTIVAL-LAYOUT — Festival hub/detail layout regression (owner 28 Sep: 'You broke it') | P0 | HOSTED-VERIFIED on stable staging (R13b); owner browser review pending |

## Owner / named-owner items (exact)
See QUESTIONS.md Q-AHV-FRESH-20260928-OWNER-ITEMS (9 items) and Q-AHV-L10N-GATE-RETIRED. External blockers unchanged: Deepu Sahani (forms backend, PR #317 conflict, consent checkbox wording), Santhosh/Anoop via COS (villa areas), Chatbase dashboard owner (wrong WhatsApp 38794, CORS allowlist), Vikash (campaign sheet export, legacy→/lp switch), owner authenticated review + lint-precision ruling for PR #309.

## Deferred / post-launch
DESKTOP-SECONDARY visual polish, awards visual polish, DISCOVERY-POST, MONITOR-LIVE, ANNOUNCEMENT, TOUR-VIDEO, REVIEWS-LIVE, PRINT-PDFS, EXTRA-CONTENT, NEW-SHOOT (dependency-led).

## Not verified (checker pass)
- No physical iPhone; WebKit emulation only (EF-05).
- Owner's own browser review of the festival page not yet done.
- Desktop header-click step of the locale-persistence tool timed out; the step itself was not re-run manually.
- Structural EF-12 cards (11 placeholder, 3 duplicate) not changed; 'Unique Feautures' typo deferred to the next l10n delta.
- Operational enforcement of retention/consent is out of agent reach (Sunaj/HR/Deepu).
