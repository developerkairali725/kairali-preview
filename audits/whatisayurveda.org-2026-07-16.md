# QA/QC audit — whatisayurveda.org (LIVE, ranking 1-page static brochure, IIS/ASP.NET)

- Audited: **2026-07-16 18:51:34 IST** (fetch window 18:36:42–18:51:34 IST)
- Auditor: factory QA pass (findings only, no fixes applied — CLAUDE.md §QA audit pass; quick-audit per task brief)
- Method: external raw-HTML capture via `curl` (desktop UA + Googlebot UA cross-check), byte-level inspection. Read-only GET/HEAD only; forms rendered, never submitted. No browser tools used (shared pane rule) — visual/mobile checks NOT RUN, listed below.
- Sample: `/` (200, 126,255 B), `/default.aspx`, `/robots.txt`, `/sitemap.xml`, `/enquirenow.aspx`, `/freeonlineconsultation.aspx`, 1 deliberate 404 probe, http/https × www/apex variant probes, all 98 on-page whyayurveda.org article links (status-checked, redirects followed), all 17 footer brand-domain links + 4 social links, 3 site-local images, 1 hot-linked `admin.kairali.com` image, whois expiry.
- Context honoured: 14 Jul mine (`docs/group-inputs/whatisayurveda-org-inventory.md`) — single-page 2014 funnel site, 98 dead article links, greenfield replacement (`sites/whatisayurveda.com`) in build. This audit confirms current state + change-since-mine.

---

## SECURITY VERDICT: **CLEAN** (as of 2026-07-16 18:51 IST)

- Spam keywords (`casino|gambling|betting|poker|bookmaker|viagra|wager`): 0 hits on all 3 fetched pages.
- `<marquee>`: 0. Hidden-element CSS (`text-indent:-…`, large negative `left`, `display:none` payloads): 0. Zero-width chars (U+200B/C/D): 0.
- `eval(`/`atob(`/`String.fromCharCode`: 0.
- **No cloaking**: Googlebot-UA fetch of `/` byte-identical to desktop fetch (126,255 B both).
- External scripts: google-analytics.com (dead UA, see #2), `cdn.onesignal.com/sdks/OneSignalSDK.js`, `http://html5shim.googlecode.com` (IE<9 conditional; googlecode.com host defunct — dead reference, not an active threat). External iframes: YouTube embed, Google Maps embed, two same-origin form iframes. Nothing injected.
- Rule (r) screen: no AI-directed text / prompt-injection strings in any fetched content (home, both form pages, whyayurveda redirect targets): 0 hits.

---

## CHANGE SINCE 14 JUL MINE

**One material change: 37 of the 98 whyayurveda.org article links now resolve.** The mine recorded ALL 98 as 404 (whyayurveda.org rebuild had no redirect map then). Re-checked all 98 today with redirects followed: **61 → 404, 37 → 200** on the rebuilt whyayurveda.org (e.g. `…/treat-migraine-with-the-help-of-ayurveda…aspx` → `https://whyayurveda.org/treat-migraine-with-the-help-of-ayurveda-2/` 200). A partial legacy-URL redirect map evidently shipped with the whyayurveda.org rebuild. Everything else — [Beta Site] labels, title typo, dead UA tag, mojibake, variant duplication — is unchanged from the mine. Homepage still 200 at 126,255 B; `/default.aspx` still byte-identical duplicate.

Domain expiry **verified by whois: `Registry Expiry Date: 2026-09-28T08:30:10Z`** — 74 days out; renewal is with Sunaj per org-inventory context.

---

## Findings (severity-ranked; site is replacement-queued, so most are legacy-debt "note" unless lead-path or compliance)

1. **H (compliance — DPDP/GDPR) / https://whatisayurveda.org/freeonlineconsultation.aspx** / The "Free Ayurvedic Consultation" form **collects health data with no consent checkbox**: fields `txtPresentHealthProblems`, `txtPersonalHistory`, `txtPreviousClinicalDetails`, marital status, plus name/contact — the only checkboxes are `chkDependOn$0–3` (symptom dependencies), none is a consent acceptance. No captcha either (spam exposure on a live backend). Privacy policy IS linked (`http://www.kairali.com/privacy-policy.aspx` → 301 → https, 200 OK). Same no-consent/no-captcha state on `/enquirenow.aspx`. Forms render correctly (ASP.NET WebForms postback to self, `__VIEWSTATE` present) — render-checked only, never submitted. Decision for Abilash: disable the two lead forms on this legacy page now, or accept until DNS cutover.
2. **M / sitewide (all 3 pages, line 26 of each head)** / **Analytics dead ~3 years**: only `ga('create', 'UA-51306046-1', 'whatisayurveda.org')` — Universal Analytics stopped processing hits July 2023. No GA4, no GTM. The site has recorded nothing since; any traffic/ranking evidence for the migration protection map must come from Search Console, not GA.
3. **M / host + page variants — duplicate content, no consolidation** / `https://whatisayurveda.org/`, `https://www.…/`, `http://…/`, `http://www.…/` and `/default.aspx` **all return HTTP 200, byte-identical 126,255 B — zero redirects** (`http://` does NOT 301 to https), **zero `rel="canonical"` anywhere** (grep: 0 hits), no HSTS header. Five indexable copies of the one page, all `<meta name="robots" content="index, follow">`. Google is left to guess the canonical of a ranking page.
4. **M / https://whatisayurveda.org/robots.txt and /sitemap.xml** / both **404** (IIS default 404 body). No crawl directives, no sitemap — confirmed unchanged from mine.
5. **M / https://whatisayurveda.org/ line 97** / **Active mixed content**: `<iframe src="http://www.youtube.com/embed/DSZ4U7rTRSM"` — http iframe on an https page is blocked outright by modern browsers, so the hero video never loads on the https variant (the video itself is alive: YouTube oEmbed 200, "Experience the goodness of Ayurveda…"). Fix is a one-character `s`. Also line 24: `<script src="http://html5shim.googlecode.com/svn/trunk/html5.js">` (IE<9 conditional; host defunct since 2016 — dead weight).
6. **M / #blog section — 61 dead outbound article links** / of 98 `whyayurveda.org/...aspx` "More" links, **61 still end 404** after redirects (37 now resolve — see change section). Every dead one is a user-visible dead end on a ranking page. Full result list retained in scratchpad (`why_results.txt`).
7. **M / #ourbrands + footer — dead/broken brand links (all plain `http://`)** / checked all 17 + 4 social, redirects followed: `kairaliherbals.com` **connection failure (curl exit 000 — site unreachable)**; `kairaliequipment.com` **HTTP 500**; `keyawellness.com` **200 but final URL is `hugedomains.com/domain_profile.cfm?d=keyawellness.com` — the domain is lost/parked for sale and the group site links to a squatter page** (reputational); `twitter.com/Kairali_Group` 520 and `facebook.com/pages/Kairaliayurvedicgroup/…` 400 (both behind bot walls — **unverified**, legacy URL formats suspect); `ayurvedichealingvillage.com` 403 to curl (known WAF — unverified here, site known-live). Remaining 13 resolve 200. Every brand href is `http://` (protocol debt, sitewide).
8. **M / https://whatisayurveda.org/ lines 46+52 (header, sitewide-visible)** / literal **"[Beta Site]" and "[Coming soon]" labels rendered in the page header of a live, ranking site** — 12 years on. Unchanged from mine.
9. **S / `<title>` (line 7)** / typo **"Ayurevdic"** live in the title tag: `What is Ayurveda | What is Ayurevdic | What is Ayurvedic Treatment | What is Ayurveda Treatment` — user-visible in SERP/tab, plus 2014-style keyword stuffing. Meta keywords include "what is ayurvedic spa".
10. **S / visible copy, 51 occurrences** / **UTF-8 mojibake** (`â€™`, `â€œ`, `â€“`) throughout blog-teaser text, e.g. line 781 "Sanskriti Vedic Retreatâ€™s Opening", line 380 "â€œIndiaâ€™s". Encoding corruption is user-visible.
11. **S / #contact (line ~1699)** / **malformed HTML**: Google-Maps embed opens with a double bracket — `<<iframe src="https://www.google.com/maps/embed?…"` — a raw template/code leak on the contact section.
12. **S / #about (line 139)** / typo "**Her** you can get the knowledge of Ayurveda, its therapies, treatment methods and **the much more**." — unchanged from mine.
13. **S / headers (all pages)** / version disclosure: `server: Microsoft-IIS/10.0`, `x-aspnet-version: 4.0.30319`, `x-powered-by-plesk: PleskWin`. Plus jQuery 1.9.1 (2013). Hardening note for Sunaj if the site lives past cutover.
14. **S / form pages indexable** / `/enquirenow.aspx` and `/freeonlineconsultation.aspx` are iframe-content pages but carry `robots: index, follow` and full titles — thin standalone pages competing in the index.
15. **S / OneSignal push widget (lines 1845–1857)** / legacy SDK with `autoRegister: true` (auto-prompts visitors for push permission) + notify button, appId `9681eb39-…`, subdomain `whatisayurveda` — orphaned 2016-era push infra; whether the OneSignal app still exists is **unverified** externally.
16. **NOTE (register/compliance — rebuild handles it, recorded for the record)** / page promotes KTAHV as "Best Ayurvedic Wellness **Spa**", "**resort**", "**luxury** Ayurvedic retreats", "**guests**" (word-boundary counts: spa ×42, resort/resorts ×32, luxury ×7, cure ×11) and the mined DMR-Act claim patterns ("natural cure for slipped disc", "permanent relief from arthritis", "control your diabetes"…) are all still live in teaser text. KTAHV clinical-lock violations wherever KTAHV is referenced; contact blurb itself says "luxury Ayurvedic retreats, international spa franchises". Known from mine; unchanged; new-site register is the fix.
17. **NOTE / schema & social meta** / zero JSON-LD, zero Open Graph, no hreflang (single-locale EN). Legacy-scope; the .com rebuild carries schema.
18. **PASS / 404 handling** / `/qa-nonexistent-page-20260716/` → true HTTP 404 (IIS default page, 1,245 B; unbranded but no soft-200).
19. **PASS / assets** / site-local images sampled (`logo.png`, `kairali-view-home.jpg`, `favicon.ico`) all 200; hot-linked `admin.kairali.com/BlogImages/…jpg` still 200 (that store remains publicly readable — follow-up #2 from the mine stands).

## LOCKED-FACTS RESULT: **PASS**

- Banned `+91 92898 38777` / `9289838777`: **0 occurrences** (all spacing variants) on home + both form pages. The correct `…38797` also absent — this non-KTAHV page carries no KTAHV WhatsApp at all; nothing to scrub.
- Public email: **`info@kairali.com` — correct, ×1** (contact section, line 1695). No wrong-domain mailboxes found.
- "Since 1908" / bare "1908" / "1989" group-founding claims: **0 occurrences**. Frozen rolling numbers ("115+ years", "N years of…"): **0 occurrences**.
- **Verify (not a locked fact)**: sole phone on page is `+91- 9555156156` (line 1694, Delhi corporate). Same number found ×78 on kairalicenters.com in today's audit — consistent across properties but not in LOCKED FACTS; flagged per mine follow-up #4, do not reuse unverified.

## NOT RUN (honest list)

- **Mobile/visual render checks** — no browser tools this pass (shared-pane rule): one-page-scroll behaviour, iframe sizing, [Beta Site] visual prominence, push-prompt UX unobserved.
- **Form submission** — never (rule); backend delivery of the two lead forms unverified.
- **JS execution** — `BlogDisplayJS.js` runtime behaviour and OneSignal prompt not executed; static source only.
- **Search Console / traffic data** — not accessible this pass; ranking-value claims rest on the 14 Jul mine context.
- **Twitter (520), Facebook (400), ayurvedichealingvillage.com (403)** — bot-walled/WAF; statuses recorded, liveness unverified, no bypass attempted.
- **OneSignal app liveness** — external check not possible.
- **whyayurveda.org content quality** — separate audit (`audits/whyayurveda.org-2026-07-16.md`); only link statuses checked here.

Finding count: **1 security verdict (CLEAN) · 1 H · 7 M · 7 S · 2 notes · 2 pass · locked facts PASS**.

*Evidence artifacts (raw HTML, headers, 98-link status list, brand-link results) retained in session scratchpad `…/scratchpad/wia/` — not committed.*
