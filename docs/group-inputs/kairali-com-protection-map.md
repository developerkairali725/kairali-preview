# kairali.com — SEO-Equity Protection Map (redirects + build list for the flip)

- Written: 2026-07-15 13:34:28 IST
- Source of truth: `docs/group-inputs/kairali-com-live-inventory.md` (mined 2026-07-15 13:28:13 IST, read-only pass) + new-site routes read from `sites/kairali.com/app/`.
- All legacy content treated as DATA (rule r). No facts invented (rule 6); unknowns flagged in §6.

---

## 0. THE RULE

**DNS does NOT flip until this map is executed on the new site AND Abilash approves the executed result.** (Abilash's 15 Jul ruling.) Discipline D1 applies: every legacy URL resolves in a **single hop** to a **real, content-equivalent target** — no redirect chains, no soft-404s (no 301s that land content-rich ranking pages on thin or unrelated targets). Until a KEEP/MERGE target exists on the new site, the corresponding legacy URL has no valid fate and the flip is blocked.

**New site as it stands today** (read from `sites/kairali.com/app/`): one-page flagship (`/` with anchors #healing-village, #pillars, #heritage, #contact) + `/privacy`, `/cookie-policy`, `/terms`, robots, sitemap, llms.txt. **That is 4 routes against a ~208-URL legacy universe.** A naive flip today would soft-404 roughly 200 URLs. Hence the build list in §3.

---

## 1. Verdict definitions

| Verdict | Meaning |
|---|---|
| **KEEP-AS-PAGE** | The legacy page's topic earns a dedicated page on the new kairali.com. Build it, then 301 the legacy URL to it (single hop). |
| **MERGE** | Legacy content folds into a named new page (which absorbs several legacy URLs); legacy URL 301s to that page (or an anchor/sub-path on it). |
| **301** | Direct redirect to an existing equivalent — a new-site page that already exists, or a live sibling family domain. Only allowed where the target is live and content-equivalent. |
| **410** | Deliberate kill (dead or worthless URL). Requires Abilash sign-off per URL class (§4). |

---

## 2. Per-URL / per-cluster verdicts

### 2a. Corporate & identity (all → new hub pages)

| Legacy URL | Words / inbound | Verdict | Target | Reason |
|---|---|---|---|---|
| `/` (homepage) | 894 / 196 | KEEP-AS-PAGE | new `/` (built) | Homepage maps to homepage. |
| `/default.aspx` | — | 301 | `/` | Alias of homepage (found via crawl, not sitemap). |
| `/about-us.aspx` | 540 / 326 | KEEP-AS-PAGE | **`/about`** | Highest-inbound page on the site (326). Anchor of the corporate cluster. |
| `/kairali-group-profile.aspx` | **5810** / 205 | MERGE | `/about` | Deepest content page on the site; its substance becomes the body of `/about`. Do NOT 301 to the current one-pager — that is a soft-404 of the site's richest page. |
| `/mission-and-vision.aspx` | 490 / 4 | MERGE | `/about` | Thin; folds into `/about`. |
| `/founders-message.aspx` | 737 / 4 | MERGE | `/about` | Folds into `/about` (heritage section). |
| `/management-team.aspx` | 872 / 3 | MERGE | `/about` | Leadership section of `/about`. |
| `/kairali-ayurveda-brands.aspx` | 384 / 1 | MERGE | `/about` (or `/#pillars`) | Thin brand index; the new home's pillars section already covers it. |
| `/ayurveda-csr.aspx` | 884 / 200 | KEEP-AS-PAGE | **`/csr`** | 200 inbound links, substantive, brand-differentiating. |
| `/testimonials.aspx` | 1089 / 138 | KEEP-AS-PAGE | **`/testimonials`** | 1k words of social proof; too rich to fold into the one-pager. |

### 2b. Contact & lead capture

| Legacy URL | Words / inbound | Verdict | Target | Reason |
|---|---|---|---|---|
| `/contact-us.aspx` | 954 / 266 | KEEP-AS-PAGE | **`/contact`** | Carries the enquiry form; the `#contact` footer anchor is not an equivalent. |
| `/get-in-touch.aspx` | 771 / 196 | MERGE | `/contact` | Doorway duplicate of contact-us (inventory §6.5). |
| `/enquiry-form.aspx` | 855 / 68 | MERGE | `/contact` | Same form, third variant. |
| `/locations.aspx` | 708 / 4 | MERGE | `/contact` | Locations block inside `/contact` (or `/treatment-centres` if that page carries the locator — decide at build). |
| `/onlineconsultation.aspx` | 1101 / 269 | KEEP-AS-PAGE | **`/consultation`** | 269 inbound + a 22-field consultation form = a top-3 lead asset. Must exist on the hub (or 301 to a live KTAHV consultation page only once one exists — none verified today). Clinical wording → Dr. Deepu John sign-off. |
| `/ayurveda-newsletter.aspx` | 387 / 1 | MERGE | `/media` | Thin newsletter blurb; signup lives site-wide anyway. |

### 2c. Careers

| Legacy URL | Words / inbound | Verdict | Target | Reason |
|---|---|---|---|---|
| `/careers.aspx` | 740 / 267 | KEEP-AS-PAGE | **`/careers`** | 267 inbound; recruiting is a real business function. |
| `/current-openings.aspx` | 1991 / 3 | MERGE | `/careers` | Openings list inside `/careers`. |
| `/apply-now.aspx` | 1055 / 3 | MERGE | `/careers` | Apply form inside `/careers`. |
| `/apply-now.aspx?id=…` (5 URLs) | — | 301 | `/careers` | Query-string deep-links; need an explicit rewrite rule (path maps miss them). |

### 2d. Awards & press — the E-E-A-T backbone. DO NOT BLEED.

| Legacy URL/cluster | Count | Verdict | Target | Reason |
|---|---|---|---|---|
| `/kairali-group-awards.aspx` | 4751 words / 7 inbound | KEEP-AS-PAGE | **`/awards`** | 25 years of awards in one 4.7k-word page. |
| `/detail.aspx?page=<slug>` | **77** (70 sitemap + 7 crawl-found 2019–2020) | MERGE | `/awards` archive — per-item 301 to `/awards/<slug>` (preferred) or `/awards#<slug>` | 1995–2020 press/award corpus (World Travel Awards, World Luxury Spa Awards, NABH, Nat Geo top-50, FICCI, ISO, SATA, TripAdvisor CoE ×5, founder awards). Largest single crater risk in the flip. Query-string URLs — explicit rewrite rule required. Blanket-301 to one page only if Abilash accepts the dilution; per-item archive pages preserve most equity. |
| `/media-centre.aspx` | 790 / 131 | KEEP-AS-PAGE | **`/media`** | Press hub; receives the gallery/news merges below. |
| `/kairali-news.aspx` | 402 / 73 | MERGE | `/media` | News index folds in. |
| `/archive.aspx` | 705 / 66 | MERGE | `/media` | Archive index folds in. |
| `/media-gallery.aspx`, `/photo-library.aspx`, `/video-library.aspx` | 3 | MERGE | `/media` | Triplicate gallery variants (inventory §6.5); 60 legacy images already archived locally for reuse. |

### 2e. Ayurveda knowledge cluster (~informational equity)

Inventory maps these to whatisayurveda.com, but **no live, content-equivalent whatisayurveda pages are verified today** — and cross-domain 301s bleed equity (inventory §9.1). So: build ONE condensed pillar on the hub now; optionally re-point per-page to whatisayurveda.com later, once equivalents exist and rankings have stabilised.

| Legacy URL | Words / inbound | Verdict | Target | Reason |
|---|---|---|---|---|
| `/ayurveda.aspx` | 859 / 261 | KEEP-AS-PAGE | **`/ayurveda`** (pillar) | 261 inbound; the cluster head. |
| `/discover-ayurveda.aspx` | 857 / 138 | MERGE | `/ayurveda` | Near-duplicate of the head page. |
| `/why-ayurveda.aspx` | 1138 / 139 | MERGE | `/ayurveda` | Near-duplicate; richest variant — its content leads the merged body. |
| `/vedic-knowledge.aspx` | 807 / 139 | MERGE | `/ayurveda` | Section of the pillar. |
| `/ayurvedic-diet.aspx` | 956 / 138 | MERGE | `/ayurveda` | Section of the pillar. |
| `/ayurveda-treatments.aspx` | 1005 / 138 | MERGE | `/ayurveda` | Treatments overview section. Legacy text uses banned KTAHV-register words (guests ×4, cure ×3, journey ×1) — re-register before reuse wherever it describes KTAHV; clinical claims need Dr. Deepu John. |
| `/kairali-blog.aspx` | 4325 / 138 | MERGE | `/ayurveda` (article index) | 4.3k-word blog index; individual posts live on admin.kairali.com images — see §6 image dependency. |

### 2f. KTAHV / hospitality (sibling-site 301s — conditional on target being live)

ayurvedichealingvillage.com is live today (verified as an outbound-link destination in the mining pass; page-level equivalence NOT verified — see §6).

| Legacy URL | Words / inbound | Verdict | Target | Reason |
|---|---|---|---|---|
| `/ayurvedic-healing-village.aspx` | 1044 / 146 | 301 | KTAHV site (property overview page) | The property has its own domain; hub keeps only the `#healing-village` teaser. Exact target URL must be verified live before the rule ships. Legacy copy is saturated with banned words (spa ×11, luxury ×4, cure, guests ×3) — nothing migrates into KTAHV pages without re-registering + Dr. Deepu John sign-off. |
| `/hospitality.aspx` | 654 / 261 | MERGE | `/partnerships` | Despite the name, this is B2B spa-consulting/hospitality-services content (spa ×14 — non-KTAHV register is fine here); belongs with franchise/consulting, not a KTAHV 301. |
| `/yoga-ayurveda-retreats.aspx` | 736 / 139 | 301 | KTAHV site (retreats/programmes page) | Retreat programmes are KTAHV inventory. Verify target exists; else MERGE into `/ayurveda` until it does. |
| `/ayurvedic-hospitality-photo-library.aspx` | 923 / 4 | 301 | KTAHV site (gallery) | Property gallery. Verify target. |
| `/ayurvedic-hospitality-video-library.aspx` | 403 / 69 | 301 | KTAHV site (gallery/videos) | Verify target. |
| `/virtual-tour.aspx` | 395 / 4 | 301 | KTAHV site (tour/gallery) | Verify target. |

### 2g. Products / KAPPL (301 to kairaliproducts.com — live Shopify)

kairaliproducts.com is live (outbound-link destination in the mining pass). Exact collection/page targets must be confirmed against the live store (rule j: read the admin/live store, then map). Flag the mapping to Vikash before shipping — live Ads may point at product URLs (rule m).

| Legacy URL | Words / inbound | Verdict | Target | Reason |
|---|---|---|---|---|
| `/ayurvedic-products.aspx` | 780 / 269 | 301 | kairaliproducts.com (home or all-products collection) | Product catalogue lives on Shopify; hub keeps only the `#pillars` teaser. |
| `/patented-ayurvedic-remedies.aspx` | 844 / 139 | 301 | kairaliproducts.com (remedies collection — verify) | Content-equivalent collection required; if none exists, MERGE a short section into `/about` instead of a soft-404. |
| `/ayurvedic-medicine.aspx` | 912 / 138 | 301 | kairaliproducts.com (medicines collection — verify) | Same condition. |
| `/ayurvedic-pharmacy-brands.aspx` | 596 / 138 | 301 | kairaliproducts.com (verify) | Same condition. |
| `/ayurvedic-spa-equipment.aspx` | 614 / 138 | 301 | kairaliproducts.com (equipment collection — verify) | Same condition. |
| `/skin-care-and-body-products.aspx` | 1234 / 138 | 301 | kairaliproducts.com (skin/body collection — verify) | Richest product page (1.2k words); needs a real collection target, not the store home. |
| `/ayurvedic-medicines-and-remedies-photo-library.aspx` | 576 / 4 | 301 | kairaliproducts.com | Low-equity gallery. |
| `/ayurvedic-medicines-and-remedies-video-library.aspx` | 407 / 4 | 301 | kairaliproducts.com | Low-equity gallery. |

### 2h. Treatment centres (kairalicenters.com is NOT a safe 301 target today)

kairalicenters.com had the hacked-WP spam pattern (inventory §5 cross-reference). **Do not 301 equity into a compromised domain.** Until it is verified clean:

| Legacy URL | Words / inbound | Verdict | Target | Reason |
|---|---|---|---|---|
| `/treatment-centres.aspx` | 605 / 261 | KEEP-AS-PAGE | **`/treatment-centres`** (hub locator) | 261 inbound; hub-side locator with centre list + contact routing. |
| `/ayurveda-treatment-centres.aspx` | 969 / 142 | MERGE | `/treatment-centres` | Doorway duplicate. |
| `/ayurvedic-treatment-centres-photo-library.aspx` | 507 / 4 | MERGE | `/treatment-centres` | Gallery folds in. |
| `/ayurvedic-treatment-centres-video-library.aspx` | 404 / 4 | MERGE | `/treatment-centres` | Gallery folds in. |

Re-point these to kairalicenters.com later ONLY after that site passes a security re-audit — Abilash decision (§4).

### 2i. Franchise / partnerships / B2B

| Legacy URL | Words / inbound | Verdict | Target | Reason |
|---|---|---|---|---|
| `/ayurveda-spa-franchise.aspx` | **1676** / 137 | KEEP-AS-PAGE | **`/partnerships`** | Richest B2B page; franchise is a revenue line. (If a dedicated franchise Factory site ships later, re-point then — not before it exists.) |
| `/hotel-and-spa-management.aspx` | 909 / 137 | MERGE | `/partnerships` | Consulting services section. |
| `/partnerships-and-investment.aspx` | 753 / 4 | MERGE | `/partnerships` | Investment section. |
| `/our-partner-resorts.aspx` | 563 / 132 | MERGE | `/partnerships` | Partner-resort roster. |
| `/our-partners.aspx` | 483 / 66 | MERGE | `/partnerships` | Partner roster (duplicate-ish). |
| `/svata-katerina-prague-czech-republic.aspx` | 1730 / 5 | MERGE | `/partnerships` (own section/anchor) | 1.7k-word international flagship-partner page with its own enquiry form; too rich to drop, too niche for its own hub page. |

### 2j. Training / academy

| Legacy URL | Words / inbound | Verdict | Target | Reason |
|---|---|---|---|---|
| `/training.aspx` | 676 / 267 | KEEP-AS-PAGE | **`/academy`** | 267 inbound; cluster head. |
| `/ayurveda-college.aspx` | 897 / 139 | MERGE | `/academy` | College section. |
| `/yoga-teacher-training.aspx` | 734 / 137 | MERGE | `/academy` | TTC section. |

### 2k. Villa Raag

| Legacy URL | Words / inbound | Verdict | Target | Reason |
|---|---|---|---|---|
| `/villa-raag.aspx` | 1369 / 1 | 301 | Villa Raag Factory site (once live); until then MERGE a teaser into `/#pillars` and 301 there | Not even in the legacy sitemap; 1 inbound link. Conditional 301 — no live Villa Raag domain/URL verified in this pass (§6). |

### 2l. Legal, utility, downloads, dead

| Legacy URL/cluster | Verdict | Target | Reason |
|---|---|---|---|
| `/privacy-policy.aspx` (1365 w / 72) | 301 | `/privacy` (exists) | Equivalent exists on the new site today. Confirm the new page's coverage is a superset before flip. |
| `/terms-and-conditions.aspx` (692 w / 69) | 301 | `/terms` (exists) | Same. |
| `/security-policy.aspx` (856 w / 3) | MERGE | `/privacy` | Fold security-policy text into `/privacy` (or a section); no dedicated page warranted. |
| `/sitemap.aspx` (562 w / 66) | 301 | `/` | HTML sitemap; new site has sitemap.xml. |
| `/useful-links.aspx` (382 w / 1) | 301 | `/` | Link-list page, near-zero equity. |
| `/download-centre.aspx` (674 w / 138) | KEEP-AS-PAGE | **`/downloads`** | Receives the brochure-PDF redirects below. |
| `/download/…` brochures & manuals (subset of 58) | 301 | `/downloads` (or the specific new brochure file) | Brochures likely hold backlinks; keep them reachable. |
| `/download/…` tariff/price sheets 2016–2020 (subset of 58) | 410 (pending backlink check) | — | 6-year-stale prices (rule 6: never resurface). 410 only after GSC/Ahrefs confirms no material backlinks; any backlinked one → 301 to `/downloads`. Split between the two subsets is UNKNOWN until the backlink data arrives (§4, §6). |
| `/namastedwaar-mansurpur-muzaffarnagar-up-india.aspx` | 410 | — | Already 404 (dead sitemap entry); make it a deliberate 410. |

### 2m. Verdict counts

| Verdict | Legacy URLs covered |
|---|---|
| KEEP-AS-PAGE | **14** (homepage + 13 topic pages → 13 new routes + `/`) |
| MERGE | **33 content pages + 77 award/news detail pages = 110** |
| 301 | **20 content/alias pages + 5 apply-now?id + brochure-class PDFs (~subset of 58, pending backlink split)** |
| 410 | **1 confirmed (namastedwaar) + stale tariff-sheet PDFs (subset of 58, pending backlink check + Abilash sign-off)** |
| **Total universe** | **~208** (199 sitemap + 9 crawl-found) — every URL above resolves to exactly one fate |

---

## 3. BUILD LIST for the new kairali.com (blocking the flip, priority order)

Priority = inbound-link mass × lead value × equity at risk. Provisional until GSC impressions/clicks re-rank it (§4).

| # | New route | Absorbs (legacy URLs) | Why this priority |
|---|---|---|---|
| 1 | **`/about`** | about-us (326 inbound) + group-profile (5810 w) + mission-and-vision + founders-message + management-team + kairali-ayurveda-brands | Highest inbound page + the site's deepest content page land here. |
| 2 | **`/awards`** (+ `/awards/<slug>` archive ×77) | kairali-group-awards (4751 w) + all 77 detail.aspx items | The E-E-A-T backbone; biggest single crater risk. Needs the query-string rewrite rule. |
| 3 | **`/contact`** | contact-us (266) + get-in-touch (196) + enquiry-form + locations | Primary enquiry channel; three legacy form pages converge here. |
| 4 | **`/consultation`** | onlineconsultation (269 inbound, 22-field form) | Top lead-gen asset on the legacy site. Clinical register + Dr. Deepu John sign-off. |
| 5 | **`/careers`** | careers (267) + current-openings (1991 w) + apply-now + 5 apply-now?id links | Third-highest inbound cluster; live recruiting function. |
| 6 | **`/ayurveda`** | ayurveda (261) + why-ayurveda + discover-ayurveda + vedic-knowledge + ayurvedic-diet + ayurveda-treatments + kairali-blog (4325 w) | ~7k words of informational equity; cross-domain 301 to whatisayurveda would bleed it (inventory §9.1). |
| 7 | **`/partnerships`** | ayurveda-spa-franchise (1676 w) + hospitality (261) + hotel-and-spa-management + partnerships-and-investment + our-partner-resorts + our-partners + svata-katerina (1730 w) | The B2B/franchise revenue cluster, ~6k words. |
| 8 | **`/treatment-centres`** | treatment-centres (261) + ayurveda-treatment-centres + 2 centre galleries | 261 inbound and its natural sibling target (kairalicenters.com) is unsafe until re-audited. |
| 9 | **`/academy`** | training (267) + ayurveda-college + yoga-teacher-training | Training cluster, 267 inbound at head. |
| 10 | **`/media`** | media-centre (131) + kairali-news + archive + media-gallery + photo-library + video-library + ayurveda-newsletter | Press hub; receives 7 legacy URLs. |
| 11 | **`/downloads`** | download-centre (138) + brochure-class PDFs | Redirect target for backlinked brochures. |
| 12 | **`/csr`** | ayurveda-csr (200 inbound) | Substantive, 200 inbound. |
| 13 | **`/testimonials`** | testimonials (1089 w, 138 inbound) | Social-proof page. |

Rebuild upside to bake in as these ship (inventory §6): JSON-LD on every page (legacy has zero), canonicals everywhere (legacy has one), clean titles (legacy is keyword-stuffed), a live sitemap (legacy frozen at 2020-01-20).

**Register warning for build:** any migrated copy describing KTAHV must be re-registered to clinical language first (legacy pages carry spa/resort/luxury/cure/guests — inventory §7) and clinical content needs Dr. Deepu John's sign-off. Non-KTAHV pages (partnerships, products, Villa Raag) are exempt.

---

## 4. What needs Abilash

1. **Search Console read access** (kairali.com property) — to rank all ~208 URLs by real impressions/clicks/queries and re-order §3, plus catch indexed legacy URLs this crawl missed (the sitemap is provably incomplete). Also Ahrefs/backlink export if available — required for the PDF 301-vs-410 split (§2l).
2. **Deliberate kills** — confirm the 410 list: namastedwaar page, stale tariff/price-sheet PDFs, and whether any legacy page should die on purpose (e.g. useful-links, sitemap.aspx could be 410 instead of 301-to-home if he prefers a cleaner index).
3. **Awards architecture decision** — per-item `/awards/<slug>` archive (max equity retention, more build) vs one consolidated `/awards` page receiving all 77 via blanket 301 (accepts dilution).
4. **Extra contact emails** — career@kairali.com + 5 centre-specific addresses found live conflict with the locked "info@kairali.com everywhere" fact; keep/kill call (carried over from inventory §8).
5. **kairalicenters.com** — approve holding `/treatment-centres` equity on the hub until that domain passes a security re-audit.
6. **Product-URL mapping to Vikash** before any product 301 rules ship (rule m — live Ads may target them); confirm live collection URLs on kairaliproducts.com (rule j).
7. **Final flip approval** after this map is executed and post-execution QA (fetch + diff per rule) is shown.

---

## 5. Execution notes (for whoever builds the redirect layer)

- Query-string URLs (`detail.aspx?page=…` ×77, `apply-now.aspx?id=…` ×5) need explicit rewrite rules — a path-based map silently misses all 82.
- Single hop only: legacy → final target directly. No legacy → new-home → page chains.
- `admin.kairali.com` serves blog/news images; if any legacy content is preserved verbatim during transition, that subdomain must stay resolvable or images 404 (inventory §6.8).
- http/non-www variants already 301 to `https://www.kairali.com/` — the new edge config must preserve those host-level redirects, then apply this map (still one hop per D1: host-variant redirects should point straight at the final https://www target of the mapped path where feasible).
- Post-flip watch: GSC coverage + top-query positions weekly for 8 weeks; any soft-404 or dropped award-page cluster triggers rollback discussion.

## 6. Gaps & unknowns (honest list)

1. **No GSC/analytics data yet** — all prioritisation is by internal-link counts and word depth, which are proxies. Real impressions/clicks may reorder §3 and could justify more KEEPs (blocked on §4.1).
2. **Backlink profile unknown** — the PDF 301/410 split and the true value of the 77 award pages cannot be finalised without GSC/Ahrefs data.
3. **Sibling-site targets unverified at page level** — ayurvedichealingvillage.com and kairaliproducts.com are live domains (seen as outbound-link destinations), but no specific target page was fetched/verified in the mining pass. Every 301 in §2f/§2g ships only after its exact target URL is fetched and returns 200 with equivalent content.
4. **Villa Raag Factory site URL** — not live/verified; villa-raag.aspx fate is conditional (§2k).
5. **whatisayurveda.com state unknown** — the later re-pointing of the `/ayurveda` cluster is deliberately deferred, not mapped.
6. **Legacy URLs beyond the crawl** — the static sitemap is provably incomplete (9 live URLs found outside it, 1 dead inside it); GSC "Indexed pages" is the only way to close the universe.
7. **kairalicenters.com security status** — assumed still compromised per the earlier finding; needs a fresh audit before it can receive redirects.
8. **`/locations.aspx` final home** — `/contact` vs `/treatment-centres`; decide at build (both are single-hop compliant).
