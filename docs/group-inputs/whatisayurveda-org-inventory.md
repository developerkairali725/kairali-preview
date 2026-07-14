# whatisayurveda.org — Legacy Content Inventory (mine-our-own pass)

Timestamp: 2026-07-14 (mined live). Source treated as DATA, read-only. Verdicts below are recommendations only — Abilash decides.

## Executive summary

**whatisayurveda.org is NOT a content site. It is a single-page (one-page-scroll) static brochure from ~2014**, served off IIS (ASP.NET; `/default.aspx` returns 200, everything else 404). There is no CMS, no robots.txt, no sitemap (all of `/robots.txt`, `/sitemap.xml`, `/wp-sitemap.xml`, `/sitemap_index.xml` → 404). The "blog" section on the page is a widget that pulls ~98 article teasers whose "More" links ALL point to **whyayurveda.org** — a sibling Kairali domain that has since been rebuilt as a WordPress site ("WhyAyurveda by Kairali") where **every one of those old `.aspx` article URLs now 404s**. So the legacy article content is effectively gone from the open web at both domains; only titles + homepage excerpts survive here.

Practical consequence for the new whatisayurveda.com: **there is almost nothing to migrate**. This is a greenfield build. The mine yields (a) the historical URL/anchor structure, (b) the article title corpus (topic ideas + what NOT to write), (c) 94 legacy images, (d) a catalogue of claim patterns to avoid, (e) the discovery that whyayurveda.org exists as a live sibling site (has `sitemap_index.xml` → 200; separate mining task if wanted).

## 1. URL inventory / structure

Live URLs on the domain:

| URL | Status | Notes |
|---|---|---|
| `https://whatisayurveda.org/` | 200 (126 KB) | The entire site. Sections via anchors: `#home` `#about` `#enquirenow` `#onlineconsultations` `#blog` `#ourbrands` `#contact` |
| `https://whatisayurveda.org/default.aspx` | 200 | Duplicate of `/` (no canonical tag observed — duplicate-content leak) |
| `https://www.whatisayurveda.org/` | 200 | www variant also resolves (no canonical consolidation) |
| everything else probed (`/index.html`, `/about.html`, `/blog.aspx`, `/contact.html`, robots, 3 sitemap paths) | 404 | IIS default 404 page |

Why it's shaped this way: it was built as a 2013–14-era "exact-match-domain" one-pager whose job was to catch "what is ayurveda" searches and funnel them to the group's 16+ brand domains (kairali.com, ayurvedichealingvillage.com, kairaliproducts.com, kairaliyoga.com, etc.) — a link hub, not an educational resource. The blog widget syndicated teasers from the group's blog platform at whyayurveda.org / admin.kairali.com.

Head data: `<title>What is Ayurveda | What is Ayurevdic [sic — typo live in title] | What is Ayurvedic Treatment | …`; meta keywords include "what is ayurvedic spa". Google + Bing site-verification metas present. `robots: index,follow`.

### Outbound link map (98 whyayurveda.org article links, ALL now 404)

By category path: awards 18 · healing-village 16 · products 17 · yoga-retreats 14 · reviews 12 · treatment-center 10 · testimonials 6 · csr 2 · topics 2 · events 1. Date range 2008-05 → 2014-04 (site frozen since ~April 2014).

Plus brand links: kairali.com, ayurvedichealingvillage.com, kairaliproducts.com, kairaliyoga.com, kairalicenters.com, kairaliherbals.com, kairalihospitality.com, kairalitraining.com, kairaliequipment.com, keralaequipments.com, keralatraining.com, keralaayurvedainstitute.com, ayurvedafranchise.com, arogyakendra.co.in, arogyashala.co.in, keyawellness.com — all plain HTTP (mixed-content/redirect debt). Social: FB/Twitter/LinkedIn/YouTube.

## 2. Per-section topic + quality verdicts (single page ⇒ per-section)

| Section | Content | Verdict (recommendation) |
|---|---|---|
| `#home` hero | 3-slide carousel funneling to KTAHV / Yoga / Delhi centre | DROP — pure 2014 funnel copy |
| `#about` | ~150 words "what is Ayurveda" definition (root-cause vs symptom framing, Vedas origin) | REWRITE-FROM-SCRATCH — the topic is right (it IS the site's reason to exist) but the copy is thin, generic, and typo-ridden ("Her you can get the knowledge") |
| `#enquirenow` / `#onlineconsultations` | lead forms ("Free Ayurvedic Consultation") posting to legacy backend | DROP — new site is non-revenue educational; consultation funnels belong to KTAHV |
| `#blog` | ~98 teaser cards, all links dead at whyayurveda.org | DROP links; MINE titles as topic corpus (see §3/§4) |
| `#ourbrands` | 16 brand-logo tiles → group domains | REWRITE — a modern, honest group footer/"About Kairali" block is legitimate for an authority site; the wall-of-domains format is not |
| `#contact` | Delhi corporate office, +91-9555156156, info@kairali.com | KEEP FACTS ONLY (verify phone against current locked facts before reuse; email matches locked `info@kairali.com`) |

Keep-worthy topic seeds from the dead article corpus (titles worth re-commissioning as clean educational pieces under the new register): "What are the treatment methods in Ayurveda", "Panchakarma — the ultimate detox" (drop "yogic cure" framing), "Yoga and Ayurveda: their true relationship", "The wonders of Indian philosophy: Samkhya / Mimamsa / Vedanta", "Aum — the key to Indian wisdom", "Ujjayi breath", "Planning your daily cycle the yogic way" (dinacharya), "Why Ayurveda is unique among systems of medicine" (needs careful non-comparative rewrite).

## 3. Banned / risky claim patterns found (do NOT reproduce)

The page text (mostly blog teasers) is a checklist of DMR Act / FSSAI / FTC violations. Occurrence counts in visible text: "cure" ×9, "treat/treatment(disease-linked)" heavy, "permanent relief" ×3, spa ×35, resort ×22, luxury ×4.

Named disease-cure patterns (article titles live on the page):
- "A natural CURE for slipped disc"
- "Get PERMANENT RELIEF from arthritis with Kairali Ayurveda"
- "CONTROL your diabetes with Kairali Ayurveda"
- "Treating hypertension with Kairali's Ayurveda" / "keep hypertension afar"
- "Treat migraine with the help of Ayurveda" / "natural relief from sinusitis and migraine"
- "Kairali's ayurvedic treatment for bronchial diseases"
- "help people ailing with heart problem"
- "Yoga therapy for depression"
- "Ayurvedic remedies for BREAST ENHANCEMENTS" (DMR Act Schedule J territory)
- "On your way to SKIN FAIRNESS" / fairness product promotion (also brand-reputation risk in 2026)
- "De-addiction and rehabilitation retreats"

Register violations vs today's KTAHV clinical lock (context: this page promotes KTAHV as) "best Ayurvedic Wellness SPA", "LUXURY Ayurvedic retreats", "GUESTS", "RESORT". None of this language may carry over anywhere KTAHV is referenced.

## 4. Image harvest

Saved to `/Users/kairalimacmini/Claude/Kairali-Digital/image-library/legacy-whatisayurveda-org/` — **94 images ≥25 KB, ~15 MB**, all verified real JPEG/PNG, filenames prefixed `home-` (single-page site), manifest at `manifest.tsv` (filename / source_url / bytes / page). Sources: 4 site-local hero/section images (`home-kairali-view-home.jpg`, `home-kairaliyoga.jpg`, `home-kairaliayurvedictreatmentcentre.jpg`, brand tiles) + ~90 blog images hot-linked from `admin.kairali.com/BlogImages/` (still live!) — includes KTAHV grounds/gate shots, shirodhara/panchakarma treatment photos, yoga classes, award/press scans (Nat Geo Top-50, World Luxury Spa 2012, PATWA, Elle, Lonely Planet), guest-feedback scans. NOTE: many carry legacy spa/luxury framing in filenames; treat award-logo images as press evidence, not new-site creative.

## 5. Follow-ups surfaced (for Abilash)

1. whyayurveda.org is a LIVE rebuilt WordPress sibling ("WhyAyurveda by Kairali", `sitemap_index.xml` → 200) — where did the 98 legacy articles' equity go, and should IT be mined next / consolidated into whatisayurveda.com strategy?
2. `admin.kairali.com/BlogImages/` is a publicly readable legacy asset store — inventory/security review candidate.
3. whatisayurveda.org has zero migratable article content ⇒ 301 plan is simple: `/`, `/default.aspx`, www-variant → new .com homepage; no deep-URL mapping needed.
4. Verify +91-9555156156 (legacy Delhi corporate phone on the page) before any reuse — not in locked facts.
