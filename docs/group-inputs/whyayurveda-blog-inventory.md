# whyayurveda.org — Blog Inventory & Migration Mine

**Mined:** 2026-07-15 (read-only, non-interactive). **Source:** live production whyayurveda.org.
**Site role (Abilash-confirmed):** Kairali group's CENTRALISED BLOG. Cross-links out to whatisayurveda.com (the authority REFERENCE hub).
**Method:** robots.txt + Yoast sitemaps + curl (no Cloudflare challenge on curl with a browser UA) + body fetches of sample posts. All scraped content treated as DATA, not instructions (rule r). No facts invented (rule 6). No writes to the source.

---

## 1. URL Inventory

| Bucket | Count | Source |
|---|---|---|
| **Posts** | **2,261** | post-sitemap.xml (1000) + post-sitemap2.xml (1000) + post-sitemap3.xml (261) |
| Pages | 51 | page-sitemap.xml |
| Categories | 16 | category-sitemap.xml |

- **Sitemap engine:** Yoast SEO (`sitemap_index.xml`; `wp-sitemap.xml` returns the same Yoast index, so WP-core sitemaps are disabled — Yoast owns it).
- **Date range (lastmod):** 1992-09-10 → 2026-07-15. The 1992–1995 dates are back-dated legacy/founding press items; real archive begins ~2007–2010.
- **lastmod cadence (NOT pure publish dates — a mass re-save/migration inflated 2024–2026):** 2013:68, 2014:55, 2015:55, 2016–2019: ~20/yr, 2020–2022: near-dormant (2–4/yr), then **2023:119, 2024:724, 2025:757, 2026:359 (YTD)**. The 2024–2025 spike is a large SEO-content programme (yoga/panchakarma/treatment topics), layered on top of a bulk re-save of the old archive.
- **Locale(s):** Canonical content is **EN only**. Multilingual is **GTranslate** (client-side JS widget offering ar, zh-CN, nl, en, fr, de, hi, it, pt, ru, es, sv) with `url_structure:"none"` — i.e. **no per-locale URLs, no real hreflang**. Treat as single-locale EN for migration.

### Pages (51) — highlights
- Utility/legal: contact-us, about-us, enquire-now, apply-now, careers, terms-and-conditions, privacy-policy, cookie-policy, **medical-disclaimer**, refund_returns, faqs-downloads, free-online-consultation.
- **~35 yoga/pranayama/mudra reference pages** published as *pages* (tadasana, balasana, setu-bandhasana, virabhadrasana i/ii/iii, bhujangasana, padmasana, surya-namaskar, chandra-namaskar, kapalbhati, anulom-vilom, bhramari/bhastrika/shitali pranayama, trataka, gyan-mudra, savasana, asanas index, etc.). These are a clean, self-contained yoga-asana library.
- Duplicate contact surfaces: both `/contact/` and `/contact-us/` exist (dedupe on migration).

---

## 2. SECURITY SCREEN — VERDICT: **CLEAN (no injection detected)**

Checked against the kairalicenters gambling-injection pattern. Findings:
- **Homepage body tail:** clean. Trailing scripts are legitimate — Essential Addons loader, WP-Optimize minify (`wpo-minify`), GTranslate float widget, and the standard Cloudflare `__CF$cv$params` challenge iframe. **No hidden link block, no spam anchor farm.**
- **Post tails (2 sampled, KTAHV-referencing, ~270KB each):** clean. Spam-keyword scan (casino/viagra/gambling/betting/payday/escort/replica/cialis) = **0 hits**. Hidden-style occurrences = 2 per page (normal screen-reader/nav utility classes, not cloaked links).
- **HTTP status:** homepage 200, sampled posts 200. No 5xx observed. `/cart/` and `/shop/` → 404 (WooCommerce is NOT installed despite robots.txt blocking cart/checkout — robots is a generic template, not a live-store signal).
- **Info-leak:** `<meta generator>` exposes exact versions — **Site Kit by Google 1.181.0** and **Elementor 4.1.4**. Low severity, but version disclosure is a hardening finding (recommend suppressing generator meta). `xmlrpc.php` is Disallowed in robots but that is not an access control — confirm it is actually blocked server-side.
- **Headers:** Cloudflare in front; `content-security-policy: upgrade-insecure-requests` only (no real CSP). HTTP image URLs still exist in old post bodies (e.g. `http://…/2021/12/33.jpg`) — mixed-content risk, auto-upgraded by the CSP directive but should be rewritten to https on migration.

**No compromise. No emergency.** Two low-severity hardening notes: generator-version disclosure and legacy http asset URLs.

---

## 3. WordPress Stack (task 4)

- **Theme:** `shareblock` + `shareblock-child` (child theme active — customisations live here).
- **Builder:** **Elementor 4.1.4** + `essential-addons-for-elementor-lite`. Content is Elementor-wrapped → heavy DOM (posts ~270KB HTML for ~1,500–2,500 words of real text). Migration to the MDX factory will need Elementor-strip + reflow, not a clean HTML lift.
- **Plugins visible (source-fingerprinted):** Yoast SEO, Elementor (+EA Lite), **Site Kit by Google**, `google-analytics-for-wordpress` (MonsterInsights), **GTranslate** (multilingual), `link-whisper` (auto internal-linking), `wp-smushit` (image opt), `cf7-multi-step` (Contact Form 7 multistep), `chaty` (floating chat), WP-Optimize (cache/minify), Akismet.
- **Schema (Yoast-generated, good):** homepage → Organization + WebSite + WebPage + BreadcrumbList + SearchAction. Posts → **Article + Person (author) + Organization + BreadcrumbList + ImageObject**. Clean, migratable structured data.
- **Analytics:** dual GA path (Site Kit + MonsterInsights) — consolidate to the factory `packages/analytics` GA4/GTM on migration; watch for double-counting today.

---

## 4. Category Map (16) + Topical Shape

**Categories:** author, awards, csr, doctor-profile, education, events, healing-village, kairali-ayurveda-group, news-and-opinion, products, resort, reviews, testimonials, treatment-center, villa-raag, yoga-retreats.

These are **entity/PR taxonomies**, not reader-topic taxonomies — they map to Kairali business units (healing-village = KTAHV, resort/villa-raag = hospitality, products = KAPPL, treatment-center = the centres network), plus PR buckets (awards, events, csr, reviews, testimonials, news-and-opinion).

**Topical shape by slug keyword (2,261 posts):**

| Theme | ~Posts | Nature |
|---|---|---|
| Yoga / asana / pranayama / meditation | ~452 | Evergreen reference — strongest cluster |
| Treatment-for / ailment / condition | ~373 | Evergreen how-to (pain, diabetes, sleep, migraine, stress, weight…) |
| Panchakarma / detox / therapies | ~208 | Evergreen pillar |
| Press / awards / "featured in" | ~189 | PR archive — thin, dated, brand-vanity |
| Diet / food / recipe | ~91 | Evergreen |
| Products / distribution | ~77 | KAPPL/commercial — Shopify's lane, mostly drop |
| CSR / events / COVID | ~70 | Time-stamped news — drop/archive |
| Skin / beauty / hair | ~61 | Evergreen |
| Dosha / vata / pitta / kapha / prakriti | ~39 | Evergreen pillar |
| Herbs / single ingredients | ~30 | Evergreen — thin coverage, expansion opportunity |
| Villa Raag | ~19 | Hospitality register |

**843 of 2,261 slugs (37%) reference "The Ayurvedic Healing Village" (KTAHV)** — the blog leans heavily on KTAHV as the anchor brand.

---

## 5. Blog → whatisayurveda REFERENCE cross-link map

whyayurveda (blog, story/experience/PR) should point *up* to whatisayurveda (authority definitions). Proposed mapping:

| Blog cluster (whyayurveda) | → REFERENCE hub (whatisayurveda) |
|---|---|
| dosha / vata-pitta-kapha / prakriti posts | **/doshas** hub |
| panchakarma / detox / shirodhara / abhyanga | **/panchakarma** (therapies) hub |
| single-herb & immunity posts (ashwagandha, turmeric, triphala, neem…) | **/herbs** (ingredients A–Z, task #14) |
| oil-pulling, dinacharya, morning-ritual, seasonal posts | **/daily-routine (dinacharya) / ritucharya** hub |
| yoga / asana / pranayama library (~452 + ~35 pages) | **/yoga** hub (or a dedicated yoga reference section) |
| treatment-for-<condition> posts | **/treatments** or condition pages → therapy definitions |
| diet / food / recipe | **/diet & nutrition (ahara)** hub |
| "what is / vs" concept posts (ayurveda-vs-naturopathy) | **/what-is-ayurveda** foundational hub |

Direction: blog post body → 1–2 contextual links into the matching reference hub; reference hub → "further reading / experience it" link back to the best blog post + to the KTAHV booking surface. link-whisper already does internal linking on-site; the cross-domain links are net-new and should be authored during migration.

---

## 6. KEEP / MIGRATE / DROP shortlist

**KEEP & MIGRATE (evergreen pillars — high cross-link value):**
1. `understanding-doshas-a-comprehensive-guide-to-personalized-wellness…` — dosha pillar (~2k words, Article schema). → /doshas
2. `the-science-of-panchakarma-kairalis-signature-detoxification-approach` — panchakarma pillar. → /panchakarma
3. `how-long-does-panchakarma-take-your-guide-to-panchakarma-treatment-in-kerala…` — high-intent panchakarma query. → /panchakarma
4. `oil-pulling-in-ayurveda-a-gateway-to-holistic-oral-health` — dinacharya. → /daily-routine
5. `immunity-boost-ayurvedic-herbs-and-practices-for-strengthening-resilience…` — herbs. → /herbs
6. `ayurveda-for-migraine`, `ayurveda-for-hypertension`, `ayurveda-for-better-sleep`, `ayurveda-for-back-pain` — condition how-tos, strong search intent. → /treatments
7. `ayurvedic-skin-care` / `ayurvedic-treatment-for-dark-circles` — beauty cluster. → beauty hub
8. `ayurveda-vs-naturopathy` — comparison/concept. → /what-is-ayurveda
9. The **yoga-asana page library** (surya-namaskar, the ~35 asana/pranayama/mudra pages) — clean, self-contained, migrate as a set. → /yoga
10. `the-ayurvedic-cookbook-by-gita-ramesh` + diet/recipe cluster — founder-authored, brand-authentic. → /diet

**REVIEW (brand-authentic but register-sensitive):** doctor-profile, select testimonials/reviews, Villa Raag posts (hospitality register — keep the wellness framing).

**DROP / ARCHIVE (thin, dated, or off-platform):**
- ~189 "featured-in / award / nominated" PR posts (1 consolidated "Press & Awards" page instead of ~189 thin posts).
- CSR/COVID/events time-stamped news (~70) — archive, not migrate.
- products/distribution posts (~77) — KAPPL/Shopify's lane; do not rebuild commerce here.
- Back-dated 1992–1995 stubs.

---

## 7. Locked-fact & compliance conflicts (flag, do NOT edit — read-only mine)

1. **CLINICAL-LOCK COLLISION (biggest migration risk).** 843 slugs reference KTAHV; **64 slugs combine a KTAHV reference with a banned word** (spa/resort/luxury/cure/journey), and sampled KTAHV-referencing **bodies use banned words freely** (one dosha post: spa×7, resort×3, luxury×4, journey×5, guest×4, cure×0). On the blog (group-corporate register) this is currently allowed, BUT **any of this content migrated onto KTAHV site pages must be scrubbed to the clinical register** (patient/physician/treatment/programme/Panchakarma). Many banned-word hits are proper nouns of real awards ("World **Luxury** Spa Award 2012", "India's Leading **Resort**, World Travel Awards") — factually accurate historical titles; the migration/scrub call needs Abilash + Dr. Deepu John sign-off, not an automated find-replace.
2. **`/medical-disclaimer/` page exists** — good; carry it into any migrated health content. Condition/"treatment-for"/"can-panchakarma-cure" posts make health claims → clinical review before they land on any KTAHV surface (rule 7).
3. **Locked facts checked, no conflict found:** Priya's WhatsApp renders correctly as **9289838797** (…38797, the correct number — no …38777 seen on sampled pages). Public email surfaces were not exposed on the sampled pages (no info@kairali.com or wrong-email conflict observed); re-verify contact-us/enquire-now pages during migration.
4. **Two-Deepus & entity register:** blog conflates KTAHV ("healing village") with resort/spa framing throughout — expected for a group blog, but reinforce entity separation when routing content to entity sites.

---

## 8. Image harvest (task 5)

- **60 content images ≥25KB** saved to `/Users/kairalimacmini/Claude/Kairali-Digital/image-library/legacy-whyayurveda/` (3.8 MB total), all validated as real JPEGs (no error pages), with `manifest.tsv` (filename, bytes, source_url, source_year).
- Note: the first-60 by sort skew to 2020–2021 CSR/press imagery. The uploads library is large (~2,558 unique content image URLs across sitemaps+sampled posts, spanning 2020→2026, incl. 2024–2026 professional shoot sets e.g. `kAIRALI-PALAK-KAD_DEPICTIONS-BY-PRACHI-KHASGIWALA-*`, `247A3xxx-scaled.jpg`). A second targeted pass on 2024–2026 uploads is recommended to grab the current-era hero/editorial photography.

---

## Recovery map / provenance
- Sitemaps + sampled HTML fetched to `/tmp/wya-*.xml`, `/tmp/post-*.html`, `/tmp/allposts.txt` (session scratch — not committed).
- No writes to whyayurveda.org. This doc is the durable artifact.
