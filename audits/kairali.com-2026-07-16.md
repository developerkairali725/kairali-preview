# QA/QC audit — kairali.com (LIVE flagship group-corporate site, legacy ASP.NET WebForms)

- Audited: **2026-07-16 18:32:44 IST** (fetch window 18:25:49–18:32:44 IST)
- Auditor: factory QA pass (findings only, no fixes applied — CLAUDE.md §QA audit pass; D-TWO-LANE ruling 16 Jul 2026)
- Method: external raw-HTML capture via `curl` (desktop Chrome UA, `--max-time 20`), byte-level inspection. Read-only GET/HEAD only; no forms submitted; no browser tools used (pane shared with other agents).
- Sample: 10 pages fetched in full — `/`, `/about-us.aspx`, `/kairali-group-profile.aspx`, `/ayurvedic-healing-village.aspx`, `/hospitality.aspx`, `/contact-us.aspx`, `/onlineconsultation.aspx`, `/kairali-group-awards.aspx`, `/treatment-centres.aspx`, `/detail.aspx?page=top-ayurveda-health-farm-kairali-wins-south-asian-travel-awards-again` — plus `robots.txt`, `sitemap.xml`, 2 × 404 probes (`/qa-nonexistent-page-20260716.aspx` and the known-dead sitemap URL `/namastedwaar-mansurpur-muzaffarnagar-up-india.aspx`), 3 × canonicalisation redirect probes, 16 internal HEAD checks, 6 sister-domain link checks, 6 social-profile link checks. Sampling per task brief (key templates, not all ~208 URLs); the full URL universe is in `docs/group-inputs/kairali-com-live-inventory.md` (mined 15 Jul).
- Register: group-corporate. KTAHV clinical-language lock applied ONLY to KTAHV sections/pages (per CLAUDE.md Factory Rules entity register).
- Headers observed on `/`: `HTTP/2 200`, `server: Microsoft-IIS/10.0`, `x-aspnet-version: 4.0.30319`, `x-powered-by: ASP.NET`, `x-powered-by-plesk: PleskWin`.

---

## SECURITY SCREEN (rule r): CLEAN

- Injection screen across all 12 fetched HTML documents: zero hits for AI-directed text (`ignore previous`, `you are an AI`, `system prompt`, `assistant:` etc.). Nothing quarantined.
- No spam keywords, no hidden marquee, no off-topic outbound links observed in the sample (consistent with the 15 Jul mining verdict CLEAN).
- External `<script src>` on `/`: googletagmanager (`G-XKRP6ZF1R6`), `https://chat.kairali.com/embed.min.js` (own subdomain chat widget), `//translate.google.com/translate_a/element.js` — all expected. No injected third-party scripts.

---

## Findings (severity-ranked)

### H1 / SITEWIDE + 3 pages / "Since 1908" as a GROUP founding claim — the locked defect, located precisely (PR #65: 1908 = family lineage only; the Group was founded 1989)

Every occurrence below asserts 1908 as the founding of the GROUP/brand, which is WRONG per the PR #65 ruling. Verified occurrences, exact quotes:

1. **Footer, sitewide** (present on all 10 sampled pages): `© Kairali Ayurvedic Group Since 1908.` (`<div class="copymsg">&copy; Kairali Ayurvedic Group Since 1908.</div>`).
2. **Homepage nav/menu banner** (`/`, links to the group-profile page): `<a href="kairali-group-profile.aspx">Kairali: Spreading Ayurveda<br />since 1908</a>` — homepage only in the sample.
3. **https://www.kairali.com/kairali-group-profile.aspx** body, 3 further instances:
   - hero bigtext: `Kairali <span>was formed in the year 1908 and from then it has not looked back</span>`
   - Director bio: "…He is the Director of Kairali Ayurvedic Group that is a **centenarian Ayurvedic brand established in the year 1908**."
   - description block: "Kairali Ayurvedic Group, **established in the year 1908**, have been leaving its imprints behind in every nook and corner of the world…"
4. **https://www.kairali.com/kairali-group-awards.aspx**, 2 body instances: the same Director-bio sentence ("centenarian Ayurvedic brand established in the year 1908") and the same "established in the year 1908" description block.

Counter-evidence that the correct fact exists on-site: homepage carries "Kairali established it's first Training centre in New Delhi, 1989." (also note the "it's" typo — S-sized copy fix). Fix routing: copy correction is a register/heritage-wording decision → Abilash ruling + Anupam copy; legacy-site edit vs wait-for-rebuild is Abilash's call.

### H2 / KTAHV pages & sections / clinical-language lock violations (GST SCN register)

Scanned ONLY KTAHV pages/sections per the group-corporate register rule.

- **https://www.kairali.com/ayurvedic-healing-village.aspx** (the KTAHV page on this site) — body copy:
  - "A full range of traditional treatments is available at the **resort**, and nothing pleases us more than seeing **guests** solve chronic health problems…" (banned: resort, guests)
  - "…experiencing the height of modern holistic **luxury** or have travelled far into India's distant past." (banned: luxury)
  - "…offering the height of **luxury** hospitality." (banned: luxury)
  - "**Guests** are assigned villas according to their Zodiac signs…", "…thirty **guest** villas", "…ensures that our **guests** are able to extend their lifestyle change…" (banned: guests ×3 more)
  - meta description: "…jungle villa accommodation representing the best of modern holistic **luxury**" (banned word in the SERP snippet itself)
- **Homepage KTAHV block** (`/`, "The Ayurvedic Healing Village provides a refuge…"): "A full range of traditional treatments is provided to the **guests** at the **resort**…" (banned: guests ×2, resort)
- Register-review items (proper nouns, not plain-copy violations — Abilash to rule): award titles "World **Luxury Spa** Awards 'Best **Luxury** Destination **Spa**' 2012" (linked on the KTAHV page) and "2021 World **Spa** Awards" (badge on `/`, `/hospitality.aspx`). Banned-word rule says any casing; these are third-party award names attached to KTAHV — cannot be reworded unilaterally.
- `/hospitality.aspx` KTAHV-adjacent copy: only "spa" hits are in nav labels ("Hotel & Spa Management") and the award badge above — no plain-copy banned words found in its KTAHV section.

Fix routing: KTAHV wording = clinical content → Dr. Deepu John sign-off + Abilash (GST SCN sensitivity). NOT delegated from this audit.

### H3 / SITEWIDE (all 10 sampled pages) / medical claim "Cure your ailments … with No side effects"

Cross-promo block for Kairali Ayurvedic Centre (kairalicenters) rendered on every sampled page: "**Cure your ailments through Ayurveda with No side effects**, available at Kairali centres." An unqualified cure + zero-side-effects claim (Drugs & Magic Remedies (Objectionable Advertisements) Act / ASCI exposure), and it also plants banned word "cure" on the KTAHV page (`/ayurvedic-healing-village.aspx`) via this shared block. Fix routing: medical claim → Dr. Deepu John + Abilash. Findings only here.

### M1 / 404 handling / verbose ASP.NET error page in production (`customErrors mode="Off"`)

`/qa-nonexistent-page-20260716.aspx` and `/namastedwaar-mansurpur-muzaffarnagar-up-india.aspx` both return **HTTP 404** (correct code, no soft-200) BUT the body is the raw ASP.NET "Server Error in '/' Application — The resource cannot be found." yellow-screen, exposing:
- `Version Information: Microsoft .NET Framework Version:4.0.30319; ASP.NET Version:4.7.4136.0`
- a full stack trace in an HTML comment: `[HttpException]: The file '/product-description.aspx' does not exist. at System.Web.UI.Util.CheckVirtualFileExists(…)` — which also reveals a broken catch-all rewrite sending unknown URLs to a non-existent `/product-description.aspx`
- ASP.NET's own embedded warning: "This error page might contain sensitive information because ASP.NET is configured to show verbose error messages using `<customErrors mode='Off'/>`."
Plus response-header disclosure sitewide: `server: Microsoft-IIS/10.0`, `x-aspnet-version`, `x-powered-by`, `x-powered-by-plesk`. Fix (S): `customErrors mode="RemoteOnly"` + friendly 404 page + strip version headers. Also user-facing: any mistyped URL shows visitors a developer error screen on the flagship domain.

### M2 / https://www.kairali.com/ (homepage head) / homepage carries About-Us metadata and Facebook-scraped OG tags

- `<title>` = "Kairali Ayurvedic Group | Most Authentic Ayurveda brand | **Mission & Vision | Partnerships & Investment**" and meta description literally begins "Kairali Ayurvedic Group's **About Us page** is where you will find…" — the homepage presents About-page metadata in the SERP (near-duplicate of `/about-us.aspx`'s description).
- OG tags are copy-pasted from Facebook's own page markup: `og:title` = "Kairali Ayurvedic Group - Company - New Delhi | **Facebook - 90 photos**", `og:description` = "…**1,869 likes · 6 talking about this.** www.kairali.com is a leading Ayurvedic Company…". Any share of kairali.com renders as a stale Facebook listing. (Also `og:audio` points to a raga MP3.)
Fix (S): write a homepage title/description; replace OG title/description/image with real ones.

### M3 / all inner pages / `rel=canonical` missing everywhere except homepage

Canonical present only on `/` (`<link rel="canonical" href="https://www.kairali.com">` — no trailing slash, minor). Zero canonicals on all 9 sampled inner pages including `detail.aspx?page=…` (query-string URLs are exactly where canonicals matter). Confirms the 15 Jul inventory, still true today.

### M4 / 70 × `detail.aspx?page=…` award pages / one identical title + description across the whole cluster

Sampled `detail.aspx?page=top-ayurveda-health-farm…`: `<title>` = "Kairali Ayurvedic Group | Ayurvedic Treatments | Ayurvedic Spa | Ayurvedic Medicine" — **byte-identical to `/kairali-group-profile.aspx`'s title**, same shared description. 70 sitemap URLs (the E-E-A-T backbone cluster, protection-map §2d) present as duplicate titles/descriptions to Google. Verified on 1 sample + template mechanics (server-side shared head); remaining 69 asserted as highly likely, not individually fetched.

### M5 / https://www.kairali.com/sitemap.xml / stale static sitemap: dead URL in, live pages out

- Static file "created with Free Online Sitemap Generator www.xml-sitemaps.com"; 199 URLs; `lastmod` frozen at 2020-01-20 (141 URLs) and 2019 dates (58) — nothing newer than 2020-01-20.
- Contains `/namastedwaar-mansurpur-muzaffarnagar-up-india.aspx` → fetched today: **HTTP 404** (dead URL shipped to Google since ≥2020).
- Missing live pages: `/villa-raag.aspx` (HEAD 200 today) not in sitemap.

### M6 / /contact-us.aspx + /onlineconsultation.aspx / consent checkbox PRE-CHECKED on both lead forms

Both forms render with `<input name="chkAgree" type="checkbox" id="chkAgree" checked="checked" />` next to "I have read and agree to kairali.com [privacy policy]" — pre-ticked consent is not valid opt-in consent (DPDP/GDPR hygiene). Forms otherwise render fine with privacy-policy links (`privacy-policy.aspx`, HEAD 200) adjacent; consultation form also has an "Enter Security Code" field. Render checked in raw HTML only — visual render NOT RUN. Fix (S): default both checkboxes to unchecked + required.

### M7 / https://www.kairali.com/contact-us.aspx / mixed content — Google Maps embed loaded over http://

`src="http://maps.google.co.in/maps?...&output=embed"` on the https page — active mixed content; modern browsers block http:// frames on https pages, so the head-office map very likely does not render at all (render not verified — no browser this pass). Fix (S): switch embed to https.

### M8 / SITEWIDE footer (all 10 sampled pages) / dead external CSR link

`href="http://www.whyayurveda.org/topics/csr.aspx"` → follows to `https://whyayurveda.org/topics/csr.aspx` → **HTTP 404** (verified). The group's CSR credibility link 404s from every page of the flagship site. Fix (S): point at `/ayurveda-csr.aspx` or the correct whyayurveda URL once one exists.

### S1 / SITEWIDE / dead legacy Google Analytics (`ga.js`/`_gaq`) still shipped

Every sampled page runs the ancient async ga.js snippet: `_gaq.push(['_setAccount', 'UA-1014497-1'])` — Universal Analytics stopped processing hits July 2023/24; this is dead code + a wasted request on every load. GA4 `G-XKRP6ZF1R6` via gtag.js is correctly present sitewide (incl. detail.aspx sample) — analytics itself is alive. Fix (S): delete the _gaq block.

### S2 / /kairali-group-profile.aspx + /kairali-group-awards.aspx / CMS editor leak in production markup

`<ins cite="mailto:user" datetime="2015-10-29T14:11"></ins>` — WYSIWYG tracked-changes residue (with placeholder author `mailto:user`) shipped in the live HTML of both pages since 2015. Cosmetic (empty element) but a template/code leak per audit scope. Fix (S): strip the `<ins>` in the CMS content.

### S3 / /kairali-group-profile.aspx (+ /kairali-group-awards.aspx) / frozen rolling numbers

- "a **centenarian** Ayurvedic brand" (×2 per page, both pages) — a typed age claim frozen since ~2015, and it compounds the H1 1908-claim problem.
- "Mr. Ramesh has **40 years of experience** in the sphere of Ayurveda" — typed, not computed; unverifiable freshness. Flag per locked-facts rule (rolling values must be computed, not typed).

### S4 / /kairali-group-profile.aspx / __VIEWSTATE payload is 74,924 chars (~73 KB) on the site's deepest content page

(home: 2,176; contact: 6,616.) Pure page-weight waste on every load. Fix: rebuild-scope in practice; noting for the record.

### NOTE (hygiene, no action) / robots.txt is WordPress boilerplate on an ASP.NET site

Disallows `/cart/`, `/checkout/`, `/my-account/`, `/tag/`, `/feed/`, `/trackback/` — paths that don't exist on this stack (copy-paste template). Harmless; otherwise robots.txt is fine: `Allow: /`, single `Sitemap:` directive, AI bots (GPTBot/ClaudeBot/PerplexityBot etc.) explicitly allowed. Per CLAUDE.md gate 3, robots.txt is not to be touched without asking anyway.

### NOTE (rebuild-scope, skip) / zero JSON-LD anywhere

0 `application/ld+json` blocks on all 10 sampled pages — no Organization schema on the flagship corporate domain. New build already scopes this; do not retrofit the legacy site.

### PASS (verified good)

- **Canonicalisation:** `http://kairali.com/`, `http://www.kairali.com/`, `https://kairali.com/` all 301 single-hop → `https://www.kairali.com/` (verified 18:27 IST).
- **Viewport meta** present on all sampled pages; `<meta name="robots" content="index, follow">`; no stray noindex found anywhere in the sample.
- **No Lorem ipsum** on any sampled page.
- **Internal links:** 16-URL HEAD sample (nav/footer targets incl. `villa-raag.aspx`, `kairali-blog.aspx`, `download-centre.aspx`, `privacy-policy.aspx`, `terms-and-conditions.aspx`) — 16/16 HTTP 200. No 4xx/5xx internal content links found.
- **404s return real HTTP 404** (not soft-200) — the defect is the error page body (M1), not the status code.
- **Sister-site links:** kairalicenters.com, kairaliproducts.in, kairaliproducts.com, kairaliyoga.com all reachable (200 after redirects). `ayurvedichealingvillage.com` → 403 to curl = known WAF behaviour, NOT asserted broken (it has its own audit today).
- **Social links (footer):** twitter.com/Kairali_Group, instagram, linkedin, pinterest, youtube all 200. facebook.com/KairaliGroup returned 400 to curl — Facebook routinely 400s bots; **unverified, not asserted broken**.
- **Forms render** in raw HTML (contact: 21 inputs/1 textarea/3 selects; consultation: 53 inputs/6 textareas/6 selects) with adjacent privacy-policy links. Never submitted (rule).

---

## LOCKED FACTS — RESULT: **FAIL (1 of 4 locked checks fails, materially)**

| Locked fact | Result | Evidence |
|---|---|---|
| `+91 92898 38777` / `9289838777` must not appear | **PASS — absent** | 0 hits across all 12 fetched documents (all spacing variants grepped). The correct `…38797` also absent — this site publishes head-office `+91-9555156156` instead (tel: links on all pages), consistent with kairalicenters usage; not a locked violation. |
| Public contact email = `info@kairali.com` | **PASS** | `mailto:info@kairali.com` on `/contact-us.aspx`; no other public contact email found on any sampled page; no wrong-domain mailboxes in the sample. |
| No "Since 1908" GROUP claim (1908 = lineage; Group = 1989, PR #65) | **FAIL — 6 distinct instances, one sitewide** | See finding H1: footer `© Kairali Ayurvedic Group Since 1908.` on all 10 sampled pages; homepage nav "Spreading Ayurveda since 1908"; "formed in the year 1908", "centenarian Ayurvedic brand established in the year 1908" ×2 pages, "established in the year 1908" ×2 pages. |
| No frozen rolling numbers | **FLAG** | "centenarian" ×4 (2 pages), "40 years of experience" ×1 (see S3). No "115+ years"-style strings found. |

---

## NOT RUN (honest gaps)

- **Mobile/visual render checks** — no browser/Playwright this pass (shared pane rule). Affects: actual render of the blocked http:// map embed (M7), pre-checked checkbox visual state (M6), homepage audio autoplay behaviour, Google Translate widget function, chat.kairali.com widget function, image loading.
- **Full crawl** — 10 of ~208 URLs fetched in full; 69 of 70 `detail.aspx` pages, all 58 `/download/` PDFs (stale 2017–2020 tariff sheets flagged in inventory — treated as known, unverified today), and the careers `apply-now.aspx?id=…` deep-links not individually checked.
- **Facebook page link** — curl 400; cannot verify the profile is live.
- **ayurvedichealingvillage.com sister link** — 403 to curl (WAF); covered by its own audit file today, not re-verified here.
- **Analytics firing** — tag presence verified in HTML only; no runtime event/network verification without a browser.
- **DE/FR locales** — none exist on this site (EN-only, no hreflang); banned-word DE/FR equivalents therefore N/A here.
- **Lighthouse/perf scores** — not run (no browser); VIEWSTATE weight noted from bytes only.

---

## DELEGATION SPLIT (proposals only — this pass fixes nothing)

**Abilash (rulings, most first):**
1. H1 "Since 1908" — decide: hotfix the legacy footer/copy now vs. carry the correction only into the rebuild (PR #65 wording).
2. H2 — KTAHV banned words on ayurvedic-healing-village.aspx + homepage KTAHV block; and rule on third-party award names containing Luxury/Spa.
3. H3 — "Cure … No side effects" sitewide block (with Dr. Deepu John).

**Dr. Deepu John (clinical sign-off):** H2 replacement wording (guests→patients, resort→hospital/healing village, luxury→(drop)); H3 claim rewrite.

**Deepu (web exec, after rulings):** M1 customErrors+friendly 404, M2 homepage meta/OG, M5 regenerate sitemap.xml (needs gate-3 ask first? sitemap.xml is a static file, not robots.txt — still confirm), M6 uncheck consent boxes, M7 https map embed, M8 CSR link target, S1 delete _gaq, S2 strip `<ins>`.

**Anupam (copy):** 1989/1908 heritage lines once Abilash rules; "it's first Training centre" typo; S3 rolling-number rewrites.

*Evidence artifacts (raw HTML captures, headers, sitemap) retained in session scratchpad `…/scratchpad/kcom/` — not committed.*
