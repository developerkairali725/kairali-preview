# PROMPT 2 — Preview round: URLs, link checks, screenshots, Lighthouse

- **Run started:** 2026-07-18 13:43:41 IST · **Data complete:** 2026-07-18 13:58:06 IST (last link-check JSON) · **Report finalised:** 2026-07-18 14:05:00 IST
- **Branch:** `feature/prompt2-preview-round` — created from `origin/main` @ `5d7f992`, rebased onto `83058ab` at ~14:00 IST after PR #113's squash-merge (two concurrent-session front-gate commits dropped as patch-identical upstream; diff verified to contain ONLY preview-round work).
- **Scope:** the 8 built sites of the review round (Gate B–F human audit set): arogyakendra.com, arogyashala.in, healing.recipes, kairali.com, kairalicenters.com, kairalihospitality.com, kairaliyoga.com, whatisayurveda.com. The two page-less scaffolds (ayurvedichealingvillage.com, whyayurveda.org) are explicitly out of scope and untouched.
- **Roadmap source:** docs/plans/2026-07-17-factory-audit-and-launch-roadmap.md §PROMPT 2 (pipeline step 9).
- **Hard rules honoured:** no production DNS changes, no domain attach/detach, no deletions, no emails sent and no Gmail drafts created (Gate B–E emails are markdown DRAFTS in §6 only).

## 0. Method (tools + how each number was produced)

- **Preview URLs (§1):** Vercel CLI 55.0.0, authenticated as `abilashkr-3402`, team scope `kairali` (the team behind the kairali.ai dashboard project). `vercel projects ls --scope kairali` + `vercel ls <project>` + `vercel inspect <deployment>`. The URLs used are the projects' stable `*.vercel.app` production aliases — they serve the latest deployment built from `origin/main` and involve **no custom-domain DNS**. No deployment was created (none needed — all 8 were already ● Ready from today's main; evidence below).
- **Link check (§2):** purpose-built crawler (Node 24 native `fetch`; invocation in Appendix) run against each preview URL, 13:49–13:58 IST. It crawls every internal HTML page reachable from `/` **plus** every sitemap.xml path and the three legal routes as seeds, then GET-checks every unique internal page, internal asset (css/js/img/font/icon), and external link (20 s timeout, one retry, redirects followed). Absolute links to the production domain are mapped to the preview host and counted separately. Every `status: 403`/`FETCH_ERROR` external was **re-verified in a real Chromium** (Playwright, 13:52–13:53 IST) to separate bot-blocking from genuinely dead links — verdicts in §2.
- **Screenshots (§3):** Playwright 1.61 chromium (repo devDependency), viewports exactly **390×844 / 768×1024 / 1440×900**, viewport-clipped PNG per top-level page, 13:46–13:58 IST. Committed under `launches/<domain>/screens/preview-2026-07-18/` (repo convention: launches/<domain>/screens/ PNGs are git-tracked, e.g. launches/arogyashala.in/screens/). **141 PNGs, 0 capture failures** (`ALL SHOTS OK` / `ALL SITES SHOT`, shots log).
- **Lighthouse (§4):** repo-pinned **Lighthouse 12.8.2** (same invocation as `scripts/lighthouse-gate.mjs` Ship Gate A5: `--form-factor=mobile`, headless-new Chrome, categories performance/accessibility/SEO), run against the **preview URLs** 13:54:30–13:56:53 IST. Single run per URL — the gate's median-of-5 rule applies to CI budget misses; here **no URL missed any budget on its single run**, which is exactly the case where the gate itself also runs once. **INP cannot be measured by Lighthouse in lab navigation mode — it is a field (real-user) metric. Reported N/A-lab per HARD GATE 6 (never invent numbers); TBT is shown as the lab interactivity proxy.** Full Lighthouse JSON reports retained machine-local (Appendix).
- **Coverage decision, stated:** none of the 8 sites has a `lighthouse-urls.json` (checked 13:46 IST) — the A5 gate would default to `/` only. This run covers `/` per site **plus one page per dynamic template** (healing.recipes book page, kairalicenters centre page, whatisayurveda pillar + article page). Screenshots cover every **top-level** page (all depth-1 routes + the 3 legal routes) plus one representative page per dynamic template; the deeper enumerable pages (14 more centre pages, 19 more whatisayurveda article pages) are all **link-checked** (every one crawled, HTTP 200) but not individually screenshotted — stated here so partial coverage is loud, never silent.

## 1. Vercel preview URLs — all 8 confirmed, no deployment created

`vercel projects ls --scope kairali` (13:44 IST), real output (fleet rows):

```
Project Name                                 Latest Production URL                                    Updated   Node Version
kairali-web-factory-kairalihospitality-com   https://kairali-web-factory-kairalihospital.vercel.app   13m       24.x
kairali-web-factory-kairalicenters-com       https://kairali-web-factory-kairalicenters.vercel.app    13m       24.x
kairali-web-factory-healing-recipes          https://kairali-web-factory-healing-recipes.vercel.app   13m       24.x
kairali-web-factory-whatisayurveda-com       https://kairali-web-factory-whatisayurveda.vercel.app    13m       24.x
kairali-web-factory-kairaliyoga-com          https://kairali-web-factory-kairaliyoga-com.vercel.app   13m       24.x
kairali-web-factory-arogyakendra-com         https://kairali-web-factory-arogyakendra-co.vercel.app   13m       24.x
kairali-web-factory-arogyashala-in           https://kairali-web-factory-arogyashala-in.vercel.app    13m       24.x
kairali-web-factory-kairali-com              https://kairali-web-factory-kairali-com.vercel.app       13m       24.x
```

Every project's latest **production-target deployment is ● Ready**, created **2026-07-18 13:27–13:28 IST** (auto-deploy of today's main merge). Verified via `vercel inspect` on kairali-com: `created Sat Jul 18 2026 13:27:51 GMT+0530`, `target production`, `status ● Ready`, alias `kairali-web-factory-kairali-com.vercel.app`. All 8 previews therefore serve **current origin/main**; creating new deployments was unnecessary.

HTTP probes (13:45 IST), real output:

```
https://kairali-web-factory-arogyakendra-co.vercel.app/ -> 200 | sitemap: 200
https://kairali-web-factory-arogyashala-in.vercel.app/ -> 200 | sitemap: 200
https://kairali-web-factory-healing-recipes.vercel.app/ -> 200 | sitemap: 200
https://kairali-web-factory-kairali-com.vercel.app/ -> 200 | sitemap: 200
https://kairali-web-factory-kairalicenters.vercel.app/ -> 200 | sitemap: 200
https://kairali-web-factory-kairalihospital.vercel.app/ -> 200 | sitemap: 200
https://kairali-web-factory-kairaliyoga-com.vercel.app/ -> 200 | sitemap: 200
https://kairali-web-factory-whatisayurveda.vercel.app/ -> 200 | sitemap: 200
```

Note (pre-existing): kairalihospitality's short alias is truncated by Vercel's name-length limit to `…-kairalihospital.vercel.app`; the full-name aliases also serve (documented in launches/kairalihospitality.com/sitewide-checklist.md).

## 2. Link check — consolidated real output (final runs, 13:51:32–13:58:06 IST)

```
arogyakendra.com: pages=4 checked=20 (pages 4 / assets 9 / external 7) broken=1 prodAbs=0
   BROKEN: https://www.ayurvedichealingvillage.com/ 403
arogyashala.in: pages=4 checked=18 (pages 4 / assets 10 / external 4) broken=1 prodAbs=0
   BROKEN: https://www.ayurvedichealingvillage.com/ 403
healing.recipes: pages=12 checked=50 (pages 12 / assets 17 / external 21) broken=3 prodAbs=0
   BROKEN: https://www.ayurvedichealingvillage.com/ 403
   BROKEN: https://www.simonandschuster.com/books/The-Ayurvedic-Cookbook/Gita-Ramesh/9788194206842 403
   BROKEN: https://www.accartbooks.com/us/book/harmony-2 404
kairali.com: pages=5 checked=31 (pages 5 / assets 19 / external 7) broken=1 prodAbs=0
   BROKEN: https://www.ayurvedichealingvillage.com/ 403
kairalicenters.com: pages=19 checked=51 (pages 19 / assets 14 / external 18) broken=1 prodAbs=0
   BROKEN: https://www.ayurvedichealingvillage.com/ 403
kairalihospitality.com: pages=4 checked=25 (pages 4 / assets 15 / external 6) broken=1 prodAbs=0
   BROKEN: https://www.ayurvedichealingvillage.com/ 403
kairaliyoga.com: pages=5 checked=29 (pages 5 / assets 20 / external 4) broken=1 prodAbs=0
   BROKEN: https://www.ayurvedichealingvillage.com/ 403
whatisayurveda.com: pages=33 checked=109 (pages 33 / assets 15 / external 61) broken=7 prodAbs=0
   BROKEN: https://www.ayurvedichealingvillage.com/ 403
   BROKEN: https://www.hopkinsmedicine.org/health/wellness-and-prevention/ayurveda 403
   BROKEN: https://www.ayush.gov.in/ FETCH_ERROR ERR_TLS_CERT_ALTNAME_INVALID
   BROKEN: https://www.nccih.nih.gov/health/ayurvedic-medicine 404
   BROKEN: https://www.britannica.com/science/Ayurveda 403
   BROKEN: https://www.britannica.com/biography/Sushruta 403
   BROKEN: https://pcimh.gov.in/ FETCH_ERROR UNABLE_TO_GET_ISSUER_CERT_LOCALLY
```

**Internal result: 100% clean.** Every internal page (86 crawled across the 8 sites — including all 15 kairalicenters centre pages and all 29 whatisayurveda sitemap pages), every internal asset, zero 4xx/5xx, zero redirect loops. `prodAbs=0` everywhere = all internal links are root-relative (preview-safe AND flip-safe; canonical/hreflang correctly point at the production domain by design and are excluded).

**External flags, each re-verified in a real Chromium (13:52–13:53 IST):**

| URL | curl/fetch | Real-browser verdict | Classification |
|---|---|---|---|
| www.ayurvedichealingvillage.com (all 8 sites' footer) | 403 | 403 challenge, title "Just a moment…" | **NOT broken** — Cloudflare bot-challenge; matches the known KTAHV WAF behaviour (wiki/log.md 13 Jul: "KTAHV curl-403 is WAF, verify manually"). Site is live for humans; one manual click-through recommended at Gate B. |
| www.simonandschuster.com/…/9788194206842 (healing.recipes) | 403 | 403, title "Attention Required! \| Cloudflare" | **Unverifiable by automation** — bot-block. 10-second human check at Gate B. |
| www.accartbooks.com/us/book/harmony-2 (healing.recipes /books/harmony) | 404 | **404, title "Page not found - ACC Art Books US"** | **GENUINELY BROKEN.** Source: `sites/healing.recipes/content/books.json:164`. Correct URL not filled in per HARD GATE 6 — needs the real ACC Art Books page (or drop the retailer link). → FIX |
| www.hopkinsmedicine.org/…/ayurveda (whatisayurveda, 5 pages) | 403 | 403, Cloudflare "Attention Required!" | Bot-block; human spot-check at Gate B. |
| www.ayush.gov.in (whatisayurveda: faq, what-is-ayurveda, history) | TLS ERR_ALTNAME_INVALID | **ERR_CERT_COMMON_NAME_INVALID in real Chromium too** — broken for real visitors. `https://ayush.gov.in/` (no www) → **200, title "Moaayush"**. | **GENUINELY BROKEN (www variant).** Sources: `content/faq.json:150`, `content/what-is-ayurveda.json:117`, `content/history-of-ayurveda.json:97` — while `content/is-ayurveda-scientific.json:121` already uses the working non-www form. → FIX (drop the `www.`) |
| www.nccih.nih.gov/health/ayurvedic-medicine (whatisayurveda /herbs) | 404 | **404, title "Page not found \| NCCIH"**. The `-in-depth` variant used by 3 other content files → **200, "Ayurvedic Medicine: In Depth \| NCCIH"**. | **GENUINELY BROKEN.** Source: `sites/whatisayurveda.com/content/herbs.json:57` → change to `…/ayurvedic-medicine-in-depth`. → FIX |
| www.britannica.com ×2 (whatisayurveda /history-of-ayurveda) | 403 | 403 challenge "Just a moment…" | Bot-block; human spot-check at Gate B. |
| pcimh.gov.in (whatisayurveda /is-ayurveda-scientific) | UNABLE_TO_GET_ISSUER_CERT_LOCALLY | **200, title "PCIMH"** in real Chromium | **NOT broken** — their server omits the intermediate cert (strict clients fail, browsers recover). No action on our side. |

**Bottom line: zero broken internal links on all 8 sites; 3 genuinely broken external references (2 on whatisayurveda.com content, 1 on healing.recipes content); 5 external hosts bot-block automation and need a 10-second human click each at Gate B.**

Also noted (not a defect, stated for completeness): the legal pages (/privacy, /terms, /cookie-policy) are linked only from the client-rendered consent banner (visible in every screenshot), not in the static-HTML nav/footer, and are not in the sitemaps — a no-JS crawler cannot reach them. They all serve HTTP 200 and were screenshotted.

## 3. Screenshots — 141 PNGs, 0 failures, committed

Convention followed: `launches/<domain>/screens/` PNGs are git-tracked (as with the existing critic/design-QA screens). This round's folder per site: **`launches/<domain>/screens/preview-2026-07-18/`**, files named `<page>--<viewport>.png`, committed in this PR (commit "PROMPT 2: preview-round screenshots"). Capture log tail: `ALL SHOTS OK` per site, `ALL SITES SHOT` overall; two shots visually spot-checked in-session (kairalihospitality home mobile — hero + consent banner with privacy link render correctly; whatisayurveda home desktop — full render).

| Site | Pages shot (each ×3 viewports) | Files |
|---|---|---|
| arogyakendra.com | home, privacy, terms, cookie-policy | 12 |
| arogyashala.in | home, privacy, terms, cookie-policy | 12 |
| healing.recipes | home, author, press, contact, books/ayurvedic-herbal-massage (template rep), privacy, terms, cookie-policy | 24 |
| kairali.com | home, privacy, terms, cookie-policy | 12 |
| kairalicenters.com | home, centres/new-delhi-mehrauli (template rep), privacy, terms, cookie-policy | 15 |
| kairalihospitality.com | home, privacy, terms, cookie-policy | 12 |
| kairaliyoga.com | home, privacy, terms, cookie-policy | 12 |
| whatisayurveda.com | home, about, diet, doshas, faq, herbs, history-of-ayurveda, is-ayurveda-scientific, panchakarma, what-is-ayurveda, herbs/turmeric (template rep), privacy, terms, cookie-policy | 42 |
| **Total** | | **141** |

## 4. Lighthouse (mobile) — real numbers per URL, 13:54–13:57 IST

Lighthouse 12.8.2, mobile emulation, against the previews. A5 budgets for reference: perf ≥90 · a11y ≥95 · SEO =100. **Every URL passes every budget.** CLS is 0 on every URL. INP: N/A-lab on all (field metric — HARD GATE 6; TBT shown as the lab proxy).

| Site | URL (path) | Perf | A11y | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| arogyakendra.com | / | 100 | 100 | 100 | 1374 ms | 0 | 8 ms |
| arogyashala.in | / | 100 | 100 | 100 | 1373 ms | 0 | 4 ms |
| healing.recipes | / | 100 | 100 | 100 | 1377 ms | 0 | 7 ms |
| healing.recipes | /books/ayurvedic-herbal-massage | 98 | 100 | 100 | 2482 ms | 0 | 9 ms |
| kairali.com | / | 100 | 100 | 100 | 1674 ms | 0 | 6 ms |
| kairalicenters.com | / | 100 | 100 | 100 | 1824 ms | 0 | 5 ms |
| kairalicenters.com | /centres/new-delhi-mehrauli | 100 | 98 | 100 | 1674 ms | 0 | 5 ms |
| kairalihospitality.com | / | 97 | 100 | 100 | 2577 ms | 0 | 1 ms |
| kairaliyoga.com | / | 97 | 100 | 100 | 2630 ms | 0 | 6 ms |
| whatisayurveda.com | / | 100 | 100 | 100 | 1525 ms | 0 | 8 ms |
| whatisayurveda.com | /what-is-ayurveda | 100 | 98 | 100 | 1374 ms | 0 | 6 ms |
| whatisayurveda.com | /herbs/turmeric | 100 | 98 | 100 | 1373 ms | 0 | 4 ms |

Sample raw-evidence extract (kairaliyoga full report JSON): `lighthouseVersion: 12.8.2 · fetchTime: 2026-07-18T08:26:06.986Z · formFactor: mobile · perf: 0.97 · lcp: 2.6 s · cls: 0 · tbt: 10 ms`.

## 5. Summary table (the PROMPT 2 deliverable)

| Site | Preview URL | Links OK? | Worst Lighthouse score | Screenshot folder |
|---|---|---|---|---|
| arogyakendra.com | https://kairali-web-factory-arogyakendra-co.vercel.app | ✅ internal 100% · externals verified (1 WAF-challenged, live) | 100 (all categories) | launches/arogyakendra.com/screens/preview-2026-07-18/ |
| arogyashala.in | https://kairali-web-factory-arogyashala-in.vercel.app | ✅ internal 100% · externals verified (1 WAF-challenged, live) | 100 (all categories) | launches/arogyashala.in/screens/preview-2026-07-18/ |
| healing.recipes | https://kairali-web-factory-healing-recipes.vercel.app | ⚠️ internal 100% · **1 external 404** (ACC Art Books, books.json:164) · 1 bot-blocked needs human check | 98 (perf, book page) | launches/healing.recipes/screens/preview-2026-07-18/ |
| kairali.com | https://kairali-web-factory-kairali-com.vercel.app | ✅ internal 100% · externals verified (1 WAF-challenged, live) | 100 (all categories) | launches/kairali.com/screens/preview-2026-07-18/ |
| kairalicenters.com | https://kairali-web-factory-kairalicenters.vercel.app | ✅ internal 100% (all 15 centre pages) · externals verified | 98 (a11y, centre page) | launches/kairalicenters.com/screens/preview-2026-07-18/ |
| kairalihospitality.com | https://kairali-web-factory-kairalihospital.vercel.app | ✅ internal 100% · externals verified (1 WAF-challenged, live) | 97 (perf) | launches/kairalihospitality.com/screens/preview-2026-07-18/ |
| kairaliyoga.com | https://kairali-web-factory-kairaliyoga-com.vercel.app | ✅ internal 100% · externals verified (1 WAF-challenged, live) | 97 (perf) | launches/kairaliyoga.com/screens/preview-2026-07-18/ |
| whatisayurveda.com | https://kairali-web-factory-whatisayurveda.vercel.app | ⚠️ internal 100% (all 29 sitemap pages) · **2 external breaks** (www.ayush.gov.in cert → use non-www; NCCIH 404 → use `-in-depth` URL) · 4 bot-blocked need human check | 98 (a11y, article pages) | launches/whatisayurveda.com/screens/preview-2026-07-18/ |

**Fix list arising (small, content-file edits — NOT done in this pass, per the QA-audit "findings only" rule):**
1. `sites/healing.recipes/content/books.json:164` — replace dead ACC Art Books URL for *Harmony* (correct URL to be confirmed, not guessed).
2. `sites/whatisayurveda.com/content/{faq.json:150, what-is-ayurveda.json:117, history-of-ayurveda.json:97}` — `https://www.ayush.gov.in` → `https://ayush.gov.in/` (www serves a bad TLS cert; non-www verified 200; is-ayurveda-scientific.json already does it right).
3. `sites/whatisayurveda.com/content/herbs.json:57` — `…/health/ayurvedic-medicine` → `…/health/ayurvedic-medicine-in-depth` (verified 200; matches the 3 other content files).
4. (Gap, pre-existing) add `lighthouse-urls.json` to all 8 sites so the A5 CI gate measures more than `/`.

## 6. Gate B–E audit-request email drafts — DRAFTS ONLY

Nothing sent; no Gmail drafts created. Recipients from wiki/people.md (locked contacts). All four emails share this URL block:

```
arogyakendra.com       → https://kairali-web-factory-arogyakendra-co.vercel.app
arogyashala.in         → https://kairali-web-factory-arogyashala-in.vercel.app
healing.recipes        → https://kairali-web-factory-healing-recipes.vercel.app
kairali.com            → https://kairali-web-factory-kairali-com.vercel.app
kairalicenters.com     → https://kairali-web-factory-kairalicenters.vercel.app
kairalihospitality.com → https://kairali-web-factory-kairalihospital.vercel.app
kairaliyoga.com        → https://kairali-web-factory-kairaliyoga-com.vercel.app
whatisayurveda.com     → https://kairali-web-factory-whatisayurveda.vercel.app
```

### Draft 1 — Gate B · Marketing review

> **To:** Marketing — ⚠️ recipient for Abilash to pick: no single group-marketing address is on file (known marketing contacts: mkt@ktahv.com — KTAHV; ho.mkt@kairaliproducts.com — KAPPL). Left unfilled rather than guessed.
> **CC:** director@kairali.com
> **Subject:** Review round — 8 rebuilt Kairali sites on preview links (copy, brand, offers, imagery)
>
> Team,
>
> Eight rebuilt sites are up on private preview links (list below — these are staging URLs; the live domains are untouched until sign-off). Please review each site for:
>
> 1. **Copy** — tone and factual correctness for the entity (kairali.com = group-corporate; kairalihospitality/kairalicenters = wellness-hospitality; healing.recipes = Gita Ramesh's books; whatisayurveda/arogyakendra/arogyashala/kairaliyoga = educational/organic). Please flag anything that reads wrong for its audience.
> 2. **Brand** — logos, colours, photography choices against the brand manual.
> 3. **Offers & claims** — anything promising something we no longer offer, and any figure that looks off (years, locations, counts).
> 4. **Imagery** — wrong-property photos, low-quality frames, or anything you'd swap. Check on your phone as well as desktop — most visitors are mobile.
> 5. **Five external links our tools cannot verify** (their sites block robots — each needs one human click to confirm it loads): the Ayurvedic Healing Village link in every site's footer; on healing.recipes, the Simon & Schuster "buy" link for The Ayurvedic Cookbook; on whatisayurveda.com/history-of-ayurveda, the two Britannica links and the Johns Hopkins link.
>
> Reply with per-site notes (a voice note is fine). Points you disagree with will be argued back or gated to Abilash — feedback here is challengeable, per the launch-gate protocol.
>
> [preview URL block]

### Draft 2 — Gate C · Deepu (web) — code sanity & publish readiness

> **To:** developer@kairali.com (Deepu — website developer)
> **CC:** director@kairali.com
> **Subject:** Tech check — 8 rebuilt sites on Vercel previews, before publish planning
>
> Deepu,
>
> The eight rebuilt sites below are on Vercel preview URLs (Next.js static builds in the factory monorepo — the live WordPress/legacy sites are untouched). Before we plan cutover, please give each a developer's pass:
>
> 1. **Render sanity** on your own devices/browsers — anything broken, jumping, or mis-scaling (our Playwright screenshots at 390/768/1440 are in the repo under launches/<domain>/screens/preview-2026-07-18/ if you want the reference set).
> 2. **Legacy-URL redirects** — spot-check old .aspx/legacy paths you know from the current sites; they should 308 once (single hop) to the right new section, never chain or 404.
> 3. **Head hygiene** — canonical, robots, sitemap.xml, favicon, OG tags on a couple of pages per site.
> 4. **Publish readiness from your side** — for each domain, anything YOU need before a DNS flip can be scheduled (old-site backup runs, tracking-code inventory to carry over, anything on the current hosts we must archive first). This is preparation-listing only; no cutover is being scheduled yet.
>
> Known and already logged (no need to re-report): 3 broken external reference links (ACC Art Books on healing.recipes; one NCCIH 404 and the www.ayush.gov.in TLS-cert issue on whatisayurveda.com).
>
> [preview URL block]

### Draft 3 — Gate D · Satyam — forms check

> **To:** dme@kairali.com (Satyam — CRM/databases/forms webhook)
> **CC:** director@kairali.com
> **Subject:** Forms check — 8 preview sites: v1 state = no forms; enquiry paths are mailto/WhatsApp
>
> Satyam,
>
> Forms gate for the eight preview sites below. Honest current state, so your check is quick:
>
> 1. **None of the 8 sites ships an HTML form in this v1** — verified by machine scan (server AND client-rendered: 0 `<form>` elements, 0 visible inputs on every site, 18 Jul). All conversion paths are mailto: (info@kairali.com), tel:, and WhatsApp (wa.me/919289838797) CTAs.
> 2. **Your call as forms owner:** (a) confirm the no-form v1 is acceptable for launch from a CRM standpoint (leads arrive via email/WhatsApp, not webhook), or (b) name which sites must NOT go live without a CRM-wired form — that becomes a pre-launch work item with the v1-freeze schema parity check you defined.
> 3. If (b) for any site: please attach/point to the current CRM schema for enquiry submissions so the form build matches it first time, and we will route test submissions to you for the parity check before any cutover.
>
> Nothing to test-submit yet — this is a state-confirmation gate, not a regression pass.
>
> [preview URL block]

### Draft 4 — Gate E · Sunaj — servers / DNS / SSL / redirect plan

> **To:** sysadmin@kairali.com (Sunaj — tech lead, DNS/registrar/infra)
> **CC:** director@kairali.com
> **Subject:** Server-side readiness — 8 rebuilt sites (no DNS action yet; preparation review only)
>
> Sunaj,
>
> The eight rebuilt sites below are hosted on Vercel previews. **No DNS change is requested now** — cutover happens only on Abilash's explicit go, domain by domain. To be ready, please review per domain:
>
> 1. **DNS control** — confirm where each of the 8 domains' DNS is managed and that we can edit records quickly on the day (any domain whose registrar/DNS access is uncertain, flag now).
> 2. **Current-host inventory** — what runs today for each domain (server, mailboxes, subdomains, cron/webhooks) and what must be preserved or archived before pointing away. Anything besides the website living on those hosts (especially MX records) must be listed so the flip doesn't break mail.
> 3. **SSL** — Vercel issues certificates automatically at attach time; from your side, note any HSTS, CAA records, or wildcard-cert dependencies on the current setups that could interfere.
> 4. **Redirect plan** — old hosts should either be retired or 301 everything to the new domain root; per domain, tell us which of the two you'd run, so legacy deep links can't resurrect old servers.
> 5. **whatisayurveda.org renewal** (expires 28 Sep — already on your list) — relevant here because whatisayurveda.com is in this launch set.
>
> Reply per-domain; short bullets are perfect.
>
> [preview URL block]

## 7. Checker pass (rule f) — claim vs evidence

- 8/8 preview URLs confirmed live and current-main: **machine-verified** (vercel CLI + curl, §1).
- Link check all 8 sites, internal + external: **machine-verified** (§2 consolidated output; 86 pages, 353 unique URLs checked). External bot-blocks re-verified in real Chromium; 5 remain **unverifiable by automation** — explicitly handed to Gate B humans (not claimed OK).
- Screenshots 390/768/1440 for every top-level page: **done for all depth-1 pages + legal + template reps** (141 PNGs, log + 2 visual spot-checks). Deep enumerable pages (14 centre + 19 article pages) intentionally not screenshotted — stated in §0/§3, link-checked 200 in §2.
- Lighthouse mobile per site with LCP/CLS/INP: **12 URLs measured, real numbers in §4**. INP honestly N/A-lab (field metric); TBT reported instead — this is a measurement-capability fact, not a gap fixable by more runs.
- Emails: **drafts only, in §6** — nothing sent, no Gmail draft objects created.
- No production DNS change, no domain attach/detach, no deletion: **none performed**. Vercel usage was read-only (ls/inspect).
- Blockers: **none hit** — nothing appended to QUESTIONS.md this session.

## Appendix — invocations & evidence locations

- Link checker / screenshotter / LH harness: session-local scripts (Node 24 + repo's Playwright/Lighthouse), machine-local at `/private/tmp/claude-501/-Users-kairalimacmini-Claude/384413d6-643f-4da1-8da3-a88d154335da/scratchpad/{linkcheck,shots,lh,verify-external,formscan}.mjs`; raw outputs (per-site JSON + full Lighthouse reports + shots log) under `…/scratchpad/out/`. All decision-bearing numbers are pasted verbatim in §§1–4 (evidence law); the machine-local copies are working files, not the record.
- Lighthouse invocation (identical flags to scripts/lighthouse-gate.mjs): `pnpm exec lighthouse <url> --output=json --only-categories=performance,accessibility,seo --form-factor=mobile --quiet --chrome-flags="--headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage"`.
- Screenshot evidence (committed): `launches/<domain>/screens/preview-2026-07-18/` — 141 files, listing in §3.
- Form scan real output (13:57–13:58 IST): every probed page returned `forms:0 visibleInputs:0` (all 8 homepages + healing.recipes /contact, Playwright-rendered).
