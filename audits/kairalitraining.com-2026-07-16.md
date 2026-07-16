# QA/QC audit — kairalitraining.com (LIVE, ASP.NET WebForms one-pager + 2 form pages, training vertical)

- Audited: **2026-07-16 19:08:36 IST** (fetch window 18:56:41–19:08:36 IST)
- Auditor: factory QA pass (findings only, no fixes applied — CLAUDE.md §QA audit pass; D-TWO-LANE 16 Jul 2026)
- Method: external raw-HTML capture via `curl` (Chrome-126 desktop UA, `--max-time 20`), byte-level inspection, read-only GET/HEAD only. No forms submitted. No browser tools used (pane shared — see NOT RUN).
- Sample: `/` (fetched 23×, see finding #1), `/default.aspx`, `/freeonlineconsultation.aspx`, `/enquirenow.aspx`, `/privacy-policy.aspx` (404), `robots.txt` (404), `sitemap.xml` (404), 1 deliberate 404 probe, http/https × www/non-www variants, 40 external links HEAD/GET-checked, 12 media.kairali.com image probes, TLS cert check.
- Stack observed: `server: Microsoft-IIS/10.0`, `x-aspnet-version: 4.0.30319`, `x-powered-by-plesk: PleskWin` — Windows/Plesk shared host, ASP.NET WebForms (`__VIEWSTATE`, `WebResource.axd`). Host IP 162.241.139.5 — **same A record as kairalitea.com** (dig, 18:57 IST). Let's Encrypt cert valid (CN=kairalitraining.com, expires 30 Sep 2026).
- Site shape: effectively a single-page brochure (`/` = `/default.aspx`, anchors #aboutus #OurBrands #blogKairali #ContactUs) + `/freeonlineconsultation.aspx` + `/enquirenow.aspx`. Purpose: lead-gen for Ayurveda training programmes.

---

## SECURITY SCREEN (rule r): no injection found; one hosting-integrity anomaly

- Spam keywords (`casino|gambling|betting|poker|viagra|payday|escort`): **0** on all 4 pages. `<marquee>`: 0. Zero-width chars: 0. No text addressing AI/agents in any fetched content (all fetched content handled as data, per rule r).
- External scripts: ASP.NET `WebResource.axd`/`ScriptResource.axd` (self), `slick.min.js` from media.kairali.com (group CDN), Google Analytics loader. No third-party injected scripts.
- **BUT see finding #1 — the server once returned a different Kairali site's homepage from this domain.**

---

## Findings (severity-ranked, evidence attached)

1. **L / hosting integrity — `https://kairalitraining.com/` served the complete kairalitea.com homepage on one request.**
   Evidence: first fetch of the session (2026-07-16 18:56:41 IST, curl `url_effective = https://kairalitraining.com/`, HTTP/2 200, `content-length: 194767`) wrote a 194,767-byte body titled `<title>Ayurvedic Tea - Kairali’s Caffeine Free Ayurvedic Herbal Infusion - Kairalitea.com</title>`. That capture is **MD5-identical** (`df611b619efac888c711f99aceb1885e`) to a direct fetch of `https://www.kairalitea.com/` made at 19:05 IST. Both domains resolve to the same IP (162.241.139.5, Plesk/IIS shared box).
   Reproducibility: NOT reproduced in 22 subsequent homepage fetches (with/without Accept-Encoding, HTTP/1.1 and HTTP/2) over the following 12 minutes — a one-off in this window. Transparency note: curl's `size_download` counter for that anomalous response printed 38,069 (the training page's size) while the on-disk body and the captured `content-length` header are both 194,767 — the counter inconsistency is unexplained; the body capture, header capture and md5 match are the hard evidence.
   Why it matters: intermittent cross-domain serving on a shared IIS/Plesk box (binding/app-pool/cache mixup) means visitors and Googlebot can intermittently see the wrong site under this domain — indexing poison and trust damage. **Escalate to Sunaj (server-side IIS site-binding / output-cache review on the PleskWin box hosting both domains).** Raw captures retained in session scratchpad `…/scratchpad/kt/` (`home.html`, `home.headers`, `tea.html`).

2. **H / sitewide — active mixed content: the site's own stylesheet and slider JS load over `http://` → https rendering is broken in modern browsers.**
   Evidence (raw head/tail of `/`): `<link rel="stylesheet" href="http://media.kairali.com/css/kairalitraining-style.css" />` (line 22), `<link … href="http://media.kairali.com/slick/slick.css">`, `slick-theme.css` (lines 17–18), `<script src="http://media.kairali.com/slick/slick.min.js" …>` (line 560). Browsers block active mixed content (CSS + JS) on https pages → the main theme stylesheet and the hero slider script do not load; page renders unstyled with a dead slider over `https://`. The same assets answer 200 over https (verified: `https://media.kairali.com/css/…` etc. all 200) — the fix is a protocol change only. Passive mixed content too: ~15 `<img src="http://media.kairali.com/images/…">` incl. the captcha image `turing.aspx`.

3. **H / locked facts — footer on every page: `© Kairali Ayurvedic Group Since 1908.`**
   Evidence: `/` line 554, `/freeonlineconsultation.aspx` line 784, `/enquirenow.aspx` line 564 — exact string `&copy; Kairali Ayurvedic Group Since 1908.` "Since 1908" attached to the GROUP is WRONG per the PR #65 ruling (1908 = family lineage only; Group founded 1989). Related frozen rolling number in the homepage stats band: **"109 Years of Experience"** (1908 + 109 = 2017 — typed in ~2017 and never updated; rolling values must be computed, not typed).

4. **H / consent & legal — homepage enquiry form's consent line names the wrong website AND links to a 404 privacy policy.**
   Evidence (`/` line 203): `<input name="chkAgree" type="checkbox" id="chkAgree" />I have read and agree to ayurvedichealingvillage.com <a target="_blank" href="privacy-policy.aspx">privacy &amp; terms of use.</a>` — (a) the text says **ayurvedichealingvillage.com** on kairalitraining.com (copy-paste from the KTAHV site); (b) the link target `https://kairalitraining.com/privacy-policy.aspx` returns **404** — an ASP.NET "The resource cannot be found." error page that additionally leaks `Version Information: … Framework Version:4.0.30319; ASP.NET Version:4.7.4136.0`. The two inner form pages use correct text ("…agree to Kairali Ayurvedic Group") linking `kairali.com/privacy-policy.aspx` (verified 200). So the defect is homepage-only, but the homepage is the primary lead form. Whether `chkAgree` is actually enforced client/server-side: **unverified** (no submission attempted — rule: never submit).

5. **H / analytics — only a dead Universal Analytics tag; the site has had no working analytics since UA sunset (Jul 2023).**
   Evidence: all 3 pages carry the legacy `analytics.js` snippet with `ga('create', 'UA-51528300-1', 'kairalitraining.com')`; zero `G-…`/`GTM-…`/gtag anywhere (grep: 0 hits). Every lead and pageview since mid-2023 is unmeasured.

6. **M / Google compliance — no robots.txt, no sitemap.**
   Evidence: `https://kairalitraining.com/robots.txt` → HTTP **404** (IIS default 404, 1,245 B); `https://kairalitraining.com/sitemap.xml` → HTTP **404**.

7. **M / duplicate content — zero canonical tags anywhere + 4 host/protocol variants and `/default.aspx` all serve 200 with no redirect.**
   Evidence: `<link rel="canonical">` count = 0 on all 4 captured pages. `http://kairalitraining.com/`, `http://www.kairalitraining.com/`, `https://www.kairalitraining.com/`, `https://kairalitraining.com/` all answer HTTP 200 with no `Location` header (verified 18:59 + 19:08 IST, same 38 KB training page body); `/default.aspx` serves the identical page (only the form action differs). Six URLs of the same homepage, no canonical, no http→https redirect, no HSTS — Google picks at random and https carries broken styling (finding #2).

8. **M / broken links (all user-visible):**
   - Top-nav promo banner **"Hand Sanitizer"** (`/` line 119) → `https://www.kairaliproducts.in/catalogsearch/result/?q=sanitizer` → HTTP **404**. A COVID-era (2020-21) promo still in the primary nav in 2026 — dated content and a dead click.
   - Blog card **"Kairali Ayurvedic Spa Now in Dubai !"** (appears 2× on `/`) → `http://www.whyayurveda.org/treatment-center/2014/06/23/kairali-ayurvedic-spa-now-in-dubai.aspx` → 301 chain → final HTTP **404** on the rebuilt whyayurveda.org.
   - Our Brands / footer link **kairaliequipment.com** → `http://www.kairaliequipment.com/` → HTTP **500** (HEAD and GET).
   - Footer social **Twitter** `http://twitter.com/Kairali_Group` → HTTP **520** via curl — could not verify externally (listed unverified, likely stale after X migration).
   - The 3 links into `ayurvedichealingvillage.com` → **403 to curl = WAF-blocked, not verified, not asserted broken** (known KTAHV WAF).
   - Rest of the 40-link inventory: 200 directly or 200 after 301 (kairali.guru, healing.recipes, kairaliyoga.com, ayurvedafranchise.com, whyayurveda Bangkok + Coconuts posts, youtube, linkedin, facebook, kairalicenters.com, kairaliproducts.in/books.html, etc.). 12/12 sampled media.kairali.com images 200.

9. **M / SEO-basics gaps on the money page** — `/` has **no `<h1>`** (h1 count 0; inner form pages have 1 each), **no Open Graph tags** (0 on all pages), **no JSON-LD** (0 on all pages — no Organization/Course schema on a training site), meta description present and sane, `<meta name="robots" content="index, follow">` present, viewport meta present on all 3 pages. Title/desc themselves are fine.

10. **M (register review — Abilash/Dr. Deepu John) / medical claim in brand card copy** — `/` (#OurBrands section): "Kairali Ayurvedic Centre — **Cure your ailments through Ayurveda with No side effects**…". "Cure" + "no side effects" is an over-claim under ASCI/AYUSH advertising norms (site is not KTAHV, so the GST language lock does not apply — flagging as compliance risk, not applying it).

11. **S / stale content** — Blog section's newest item dates to 2018 (link URLs `/2018/06/01/…`, `/2014/06/23/…`, `/2012/07/16/…`); "20 Distributors / 25 Centers / 700 Staff / 300 Products / 40 Awards" stats band is typed, of the same ~2017 vintage as "109 Years". Duplicate render: the "Dubai" blog card and the Our Brands list are each duplicated in the markup (slick carousel clones — benign but inflates the page).

12. **S / hardening (Sunaj)** — headers disclose `server: Microsoft-IIS/10.0`, `x-aspnet-version: 4.0.30319`, `x-powered-by: ASP.NET`, `x-powered-by-plesk: PleskWin`; ASP.NET error pages shown to remote users leak framework versions (finding #4); no HSTS, no X-Frame-Options/CSP observed on 200 responses; CDN assets (bootstrap 3.4.0 via maxcdn.bootstrapcdn.com, font-awesome 4.7.0 via cdnjs) load without Subresource Integrity attributes.

13. **NOTE (cosmetic, internal)** — hidden form field `hdncampionname` ("campion" = campaign, typo in field name), CSS class `g-desctiption` (typo). Invisible to users; noted for the rebuild only.

---

## LOCKED-FACTS RESULT: **FAIL**

| Check | Result | Evidence |
|---|---|---|
| Banned `+91 92898 38777` / `9289838777` | **PASS — absent** | grep 0 hits on all 4 pages (all variants) |
| `…38797` (Priya/KTAHV) | absent — not expected on this site | grep 0 hits |
| Public contact email `info@kairali.com` | **PASS — correct** | footer Contact block, all pages: `Email : info@kairali.com` (×1 per page) |
| Phone shown | `+91- 9555156156` (corporate; same number as kairalicenters.com footer) — no conflict found | footer Contact block |
| "Since 1908" on GROUP | **FAIL** | `© Kairali Ayurvedic Group Since 1908.` in footer of `/`, `/freeonlineconsultation.aspx`, `/enquirenow.aspx` (PR #65: Group = 1989) |
| Frozen rolling number | **FAIL** | `109 Years of Experience` stats band on `/` (1908+109=2017, typed not computed) |

---

## NOT RUN (honest list)

- **Mobile/visual render checks & screenshots** — browser/Playwright tools not used (shared pane, other agents running). The mixed-content breakage (#2) is asserted from spec behaviour + raw HTML, not from a rendered screenshot.
- **Form submission / consent-enforcement test** — never submit rule; `chkAgree`/validator enforcement unverified.
- **Analytics firing at runtime** — no JS execution; dead-UA verdict is from static tag inspection.
- **ayurvedichealingvillage.com link targets** — WAF 403 to curl; tried once, not bypassed, not asserted.
- **twitter.com/Kairali_Group** — 520 at edge; status unverifiable via curl.
- **Search Console / index-state data** — no access from this pass.
- **Recurrence monitoring of finding #1** — single 12-minute window only; recommend a repeated external probe (cron curl, title grep) before/while Sunaj investigates.

*Evidence artifacts (raw HTML+header captures incl. the anomalous cross-site body and its md5 twin, link-check output) retained in session scratchpad `…/scratchpad/kt/` — not committed.*

Finding count: **1 hosting-integrity (L, escalate) · 4 H · 5 M · 2 S · 1 note · locked-facts FAIL (2 fail / 2 pass)**.
