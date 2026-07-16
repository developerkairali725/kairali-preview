# QA Audit — www.kairali.guru (LIVE legacy site)

- **Auditor:** Claude (QA/QC pass per CLAUDE.md §"QA audit pass" — findings only, no fixes applied)
- **Timestamp:** 2026-07-16 16:51:20 IST
- **Method:** External fetch only (curl/WebFetch-equivalent HTTP inspection of rendered HTML; no login, no form submissions, nothing clicked). Evidence = exact URL + quoted source text or HTTP response line.
- **Scope audited:** `/` (home, a one-pager with anchor sections About/Courses/Gallery/Contact), all 5 course pages, `robots.txt`, `sitemap.xml`, 404 handling, redirect chain, internal-link + image sample, locked facts, forms.
- **Known context honoured:** EN-only status is KNOWN (Wave-2 rebuild migrates locales) — verified no dead locale links exist on the live site (zero `/de/`, `/fr/` etc. hrefs found; `/de/` itself 404s but nothing links to it). Chatbase/Priya bot presence would be fine — none detected on this site's pages.
- **Stack observed:** legacy ASP.NET WebForms (`.aspx`, `__VIEWSTATE` postback form), single shared master layout.

## Site inventory (all pages found via crawl of internal links)
| URL | HTTP | Title |
|---|---|---|
| https://www.kairali.guru/ (= /default.aspx) | 200 | Kairali Guru - Ayurvedic Training Centres \| Ayurveda Training Programs and Courses |
| /advanced-ayurveda-lifestyle-consultant-and-therapist-training-program.aspx | 200 | …Advanced Ayurveda Lifestyle Consultant and Therapist Training Program, Kerala (AALCT) |
| /intensive-ayurveda-training-program.aspx | 200 | Kairali Guru-Intensive Ayurveda Training Program \| Ayurveda Certificate Course |
| /level-one-advanced-ayurveda-training-program-for-wellness-professionals.aspx | 200 | …Level One Advanced Ayurveda Training Program for Wellness Professionals |
| /one-day-ayurveda-workshop-program.aspx | 200 | …One Day Ayurveda Workshop Program \| Short Term Ayurveda Certificate Course |
| /three-day-short-term-ayurveda-certificate-program.aspx | 200 | …Three Day Short Term Ayurveda Certificate Program |

No about/contact/blog/privacy pages exist as separate URLs (`/about-us.aspx`, `/contact-us.aspx`, `/blog/`, `/privacy-policy.aspx` all 404). About/Contact live as `#AboutUs` / `#ContactUs` anchors on the home one-pager.

---

## FINDINGS

### HIGH

- **HIGH / all 5 course pages / prices expired 6+ years ago.** Every course page's price section states verbatim: `Above rates applicable from 1st Jan, 2019 to 31st March, 2020.` while still displaying full price tables (e.g. /intensive-ayurveda-training-program.aspx: "WAP - (Delhi, Mumbai) … 42000 INR / 700 USD"; /one-day-ayurveda-workshop-program.aspx: "OAP … 9000 INR / 150 USD"; /three-day-short-term-ayurveda-certificate-program.aspx: "TAP … 25000 INR / 420 USD"). Today is 2026 — the advertised rates have been formally invalid for over six years on the exact pages where enquiries convert. **Fix (S): get current rates from ED, update the one bullet + table numbers per page (5 pages, same template block).** Facts/money → per CLAUDE.md ESCALATION, numbers must come from Abilash/ED, not be invented.

- **HIGH / all pages / analytics is dead — enquiries are untracked.** The only analytics on the site is Universal Analytics: `<script async src="https://www.googletagmanager.com/gtag/js?id=UA-111691547-1">` + `gtag('config','UA-111691547-1')` (present on home and course pages). UA properties stopped processing hits in July 2023, so course-enquiry traffic and conversions have been invisible for ~3 years. **Fix (S): swap in the group's GA4 measurement ID in the shared master page (one snippet).**

- **HIGH / https://www.kairali.guru/#ContactUs (enquiry form, sitewide — same form embedded on every page) / no consent checkbox and no privacy policy anywhere.** The "Send Enquiry" form collects Name, Phone, Email (`txtName`, `txtPhone`, `txtEmail`, `txtVerification` security code, `btnSubmit "Send Enquiry"`). The string "privacy" occurs **zero** times on any page of the site; `/privacy-policy.aspx` → 404; no consent checkbox exists. The site targets international students (testimonials from Spain etc.), so EU visitors submit personal data with no privacy notice. **Fix (S): add privacy-policy page + linked consent checkbox to the shared form block.**

- **HIGH / footer, sitewide (home + all 5 course pages) / wrong founding year contradicting the same site's own copy.** Footer reads verbatim: `© Kairali Ayurvedic Group Since 1908.` The home page About section states: `Founded in 1989, "Kairali Ayurvedic Centre" has over 25 years of experience…` 1908 vs 1989 — the footer claim is off by 81 years and is a facts-register violation. (The "over 25 years" line is itself stale — 1989 → 2026 is 37 years.) **Fix (S): one-line footer correction + one-line About correction; correct wording to be confirmed against the group facts register.**

### MEDIUM

- **MEDIUM / https://www.kairali.guru/robots.txt / 404** and **https://www.kairali.guru/sitemap.xml / 404** (`/sitemap_index.xml`, `/sitemap.aspx` also 404). A 6-URL site with no sitemap and no robots.txt. **Fix (S): drop in static robots.txt + 6-URL sitemap.xml.**

- **MEDIUM / all pages / no `<meta name="viewport">` on any page** (checked all 6 documents — zero matches). The layout uses Bootstrap with a mobile navbar-toggle, but without the viewport tag phones render the desktop canvas zoomed out — enquiry form fields are unusable at thumb size. **Fix (S): add the standard viewport meta to the master page.**

- **MEDIUM / all pages / zero structured data.** `application/ld+json` count is 0 on every page; no Course, no Organization schema anywhere on a course-catalogue site. Also zero Open Graph/Twitter tags. **Fix (M): static JSON-LD Organization on home + Course blocks per course page — or rebuild-scope, skip, since Wave-2 templates will carry schema; ED to call.**

- **MEDIUM / https://kairali.guru/ (non-www) / duplicate host, no canonical anywhere.** Non-www serves the full site as 200 (same `<title>` verified) instead of redirecting to www; additionally `/default.aspx` serves the same page as `/` as 200; and **no page on the site has a `rel="canonical"` tag** (0 matches on all 6 pages). Three URLs can index for the same homepage. **Fix (S): host-level 301 non-www→www + canonical tag in master page.**

- **MEDIUM / https://www.kairali.guru/ (home) / zero `<h1>` on the page.** `<h1` count = 0 (sections use `<h2>`: "FREE EXPERT COUNSELING", "Introduction", "our mission"…). Course pages are correct (exactly one h1 each). **Fix (S): promote the masthead heading to h1 on home.**

- **MEDIUM / any bad URL, e.g. https://www.kairali.guru/nonexistent-page-qa-test-2026 / raw IIS default 404.** Returns the stock IIS error page: `<title>404 - File or directory not found.</title>` — no branding, no navigation back to courses. Status code itself is a correct 404 (good). **Fix (S): custom 404 page in web.config pointing back to the course list.**

- **MEDIUM / /advanced-…-training-program.aspx AND /level-one-…-wellness-professionals.aspx / duplicate meta description.** Both carry the identical description: `Kairali Ayurvedic Group offers Advance Ayurveda Training Program - An advanced level certification course for Ayurveda h…` — two different paid programs indistinguishable in SERPs. Their day-by-day syllabus tables are also near-identical copy. **Fix (S): unique description for Level One page; syllabus dedupe = Anupam judgement or rebuild-scope, skip.**

### LOW

- **LOW / /intensive-ayurveda-training-program.aspx / meta description begins with a stray fragment.** Description content starts verbatim: `- Intensive Ayurveda Training Program for Ayurveda Practitioners.` — leading "- " looks like a truncated brand prefix (placeholder-grade). **Fix (S): remove stray dash / restore prefix.**

- **LOW / /intensive-ayurveda-training-program.aspx / program-code mismatch in h1 and price table.** h1: `Intensive Ayurveda Training Program (WAP)` and price rows use code `WAP`, but WAP does not correspond to "Intensive Ayurveda Training Program" (the one-day workshop page uses OAP; AALCT and AATP 1 codes match their names). Possible copy-paste from a "Workshop Ayurveda Program". **Fix (S): confirm correct code with ED, correct h1 + table labels.**

- **LOW / /level-one-…-wellness-professionals.aspx / "Advance" vs "Advanced".** h1 reads `Level One Advance Ayurveda Training Program…` while the `<title>` and URL say "Advanced". Same word also inconsistent in the shared meta description. Related spelling drift: syllabus says `Panchmahabuta` on the AALCT page but `Panchamahabuta` on Level One. **Fix (S): copy pass on the two pages.**

- **LOW / home #ContactUs / form has captcha but the "Security Code" field gives no refresh/explanation.** Captcha image is served by `Turing.aspx` (200, image/jpeg, ~1KB). Form renders correctly; submission NOT tested (auditor does not submit forms). Noting only that a homegrown captcha plus no consent UX is enquiry friction. **Rebuild-scope, skip** beyond the consent item above.

- **LOW / html tag is bare `<html>` — no `lang` attribute** on any page; charset/a11y hygiene. **Fix (S): `lang="en"` in master page.**

## Locked-facts check
- **+91 92898 38777 (WRONG number): 0 occurrences anywhere — PASS.** 38797: also 0 occurrences (site simply doesn't use that line).
- Phone used sitewide: `tel:+919555156156` (footer/contact). Not in my locked-facts list either way — **flag to ED to confirm 9555156156 is still the live training-enquiries line**, since every enquiry call routes there.
- Email used sitewide: `mailto:info@kairali.guru` — locked facts expect `info@kairali.com`. **Flag to ED: confirm the .guru mailbox is monitored** or point the link at the register address. (Not marked HIGH because a domain-specific alias may be intentional; unverified.)

## Checks with no findings (evidence of absence)
- No dead locale links: zero hreflang tags and zero `/de|/fr|…` hrefs in any page's markup; nav is anchors + the 5 course URLs only.
- No mixed content: zero `src="http://` / `href="http://` asset references on any page; `http://` and non-www both 301/200 to HTTPS fine (http→https 301 works on both hosts).
- Broken-link sample: all internal hrefs (5 course pages, default.aspx, css, favicons, manifest) return 200; sampled images (logo, gallery/1.jpg, map.jpg, leg-therapy.png) all 200 with correct content-types.
- All 22 home-page `<img>` tags have alt attributes.
- Every page has exactly one title and one meta description (duplication issues noted above).

## Unverified (per Checker doctrine)
- Form submission end-to-end (deliberately not submitted); where `btnSubmit` delivers enquiries (server-side) is unknown from outside.
- Whether info@kairali.guru is a live mailbox; whether +91 9555156156 is current.
- Mobile rendering asserted from the missing viewport meta, not from a device-lab screenshot.

---

## DELEGATION SPLIT

**Deepu (WP/web tech)** — all one-file master-page edits on the legacy ASP.NET host:
1. GA4 snippet replacing dead UA-111691547-1 (HIGH)
2. viewport meta + `lang="en"` + canonical tag in master page (MEDIUM/LOW)
3. robots.txt + sitemap.xml statics (MEDIUM)
4. non-www→www 301 + custom 404 in web.config (MEDIUM)
5. h1 on home masthead (MEDIUM)

**Anupam (copy)** — after ED supplies verified facts/numbers:
1. Current course rates + validity line on all 5 course pages (HIGH — numbers from ED only)
2. Footer "Since 1908" → correct year; "over 25 years" refresh (HIGH — wording from facts register)
3. Privacy policy page copy + consent-checkbox label (HIGH — legal language → ED sign-off per ESCALATION rule)
4. Level One unique meta description; IATP stray-dash description; Advance/Advanced + Panchmahabuta spelling pass; WAP code confirmation (MEDIUM/LOW)

**Sunaj (infra)** —
1. Confirm hosting access to the ASP.NET box / web.config for the redirect + 404 items (blocking Deepu's #4)
2. Verify info@kairali.guru mailbox routing and +91 9555156156 line ownership; report to ED (locked-facts flags)
3. GA4 property/stream creation if none exists for kairali.guru (feeds Deepu's #1)

**ED (Abilash) decisions needed:** current price list; footer year wording; whether schema JSON-LD is worth doing pre-Wave-2 or rebuild-scope-skip; mailbox/phone confirmations.

*No fixes applied in this pass. No commits made (per task instruction). File: audits/kairali-guru-2026-07-16.md*
