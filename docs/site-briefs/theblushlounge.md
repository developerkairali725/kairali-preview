# Site Brief — theblushlounge.com (Decision D6)

**2026-07-13 19:36:09 IST · mined + briefed per D6 (theblushlounge.com = PRIMARY, snehachowdhary.com = secondary/forward)**
**Register: E — Expressive (personal brand row in SITE_DESIGN_LOCALE_REGISTER.md) · Locale: EN · Video: HF-FULL**

---

## 0 · Mining provenance (read this first)

- **The live origin is DOWN.** As of 2026-07-13 19:15 IST, theblushlounge.com resolves in DNS (A 64.227.129.189, a DigitalOcean IP; www CNAME → apex) but the server answers on **no port** — 80, 443 and 22 all filtered/closed; `scripts/mine.py` timed out on both apex and www. This is a hosting outage or a lapsed droplet, not a DNS problem. **Flagged in QUESTIONS.md — Abilash/owner needs to decide whether to revive old hosting or let the Factory rebuild be its return.**
- Content was therefore mined from the **Wayback Machine** (latest available snapshots, homepage capture 2025-11-24 — the site was live as recently as Nov 2025). Raw HTML + text in `content-mined/theblushlounge.com/wayback/`, snapshot timestamps per page in `content-mined/theblushlounge.com/url-inventory.csv`. Per doctrine (a) this is the immutable raw-sources layer; provenance is Wayback, not live-fetch — noted so nobody mistakes it for a live crawl.
- **snehachowdhary.com carries no content to mine or map**: live fetch (both today's re-check and the earlier Wave-0 mine in `content-mined/snehachowdhary.com/`) shows only a GoDaddy parking lander (`/lander`, `_trfd "parking"`). It has no URL inventory beyond `/`.

## 1 · What the current site contains

Old-school static PHP + Bootstrap 3 brochure site ("Blush Lounge – Makeup by Sneha") with a WordPress blog bolted on at `/blog/`:

| Page | Content |
|---|---|
| `/` (index.php) | Hero "MAKEUP ARTIST / my profile", services grid: **wedding · fashion · creative · special effects · men · workshops**, gallery strip (gal1–9.jpg), one testimonial |
| `/about.php` | Sneha Chowdhary bio: bespoke makeup artist; courses with **Chandini Singh**; **Scandinavian Makeup Academy** (graduating); specialises in Bridal, Fashion & Fantasy, Stage and Creative makeup artistry; testimonial block |
| `/bridal-makeup.php` | The strongest service page: bridal process copy (one-on-one consultation → skin analysis → trial → wedding-day team incl. hair + on-request nail technician), "5+ Years Experience", enquiry CTA, opening-hours table (10:00–22:00 daily), "Bridal Beauty Key Points" bullets |
| `/creative-makeup.php`, `/fashion-makeup.php`, `/grooming-session.php` | **Thin duplicates** — all three reuse the bridal paragraph nearly verbatim (only the H1 changes) |
| `/gallery.php` | 9-image portfolio grid (gal1–9.jpg) + 2 banners, no captions |
| `/contact.php` | "Let's get in touch!" — phone **088269 21110**, email **makeoverbysneha@gmail.com**, address **Shivalik, New Delhi, India**, contact form |
| `/blog/` (WP, theme "blankslate") | 2 posts only: "BRIDAL MEKEUP" (2019-03-13, sic) and "BLUSHLOUNGE BY SNEHA" (2018-05-01, colour-correction tips). Dormant since 2019 |

Other mined facts: GTM container `GTM-MFXP2LH`; Instagram **@blushlounge_sneha**; WhatsApp links carry **two different numbers** (+91 88269 21110 and +91 88260 21114 — conflict, do not reuse either without Abilash/Sneha confirming); fonts Montserrat + decorative Allura/Antiqua; no schema, no OG tags, no sitemap found, `services.php` linked in nav but never captured (likely never built — service pages linked directly).

## 2 · Strongest content (worth carrying forward)

1. **The About bio** — real credentials (Chandini Singh course, Scandinavian Makeup Academy), a genuine voice, and a clear positioning line ("her canvas is the face"). Best raw copy on the site.
2. **The bridal process narrative** — consultation → skin analysis → trial → day-of team (hair, flowers/accessories, nail tech on request). This is a real differentiator structure; needs a rewrite, not invention.
3. **Client testimonials** — at least one real one mined; more may exist in gal pages/Instagram.
4. **The service taxonomy** — wedding / fashion / creative / special-effects / men / workshops is a complete, honest menu.
5. **Portfolio images** (gal1–9 + banners) — recoverable from Wayback, but low-res 2018-era; a fresh shoot or Instagram pull should replace them (E register lives on imagery).

Weakest: three service pages are copy-paste duplicates with typos ("MEKEUP", "trail" for trial, "coctail") — rewrite entirely; blog is dead weight (2 posts, 7 years old).

## 3 · Proposed single-site structure (E register, personal brand)

E register per the register table: full-bleed imagery, HF-FULL video allowed (personal brand — not a Kairali clinical surface; no KTAHV lock, no banned-word list applies, but zero filler-adjective copy discipline still holds). EN only. Built in `sites/theblushlounge.com` from `packages/*` like every Factory site.

```
/                  Hero (full-bleed image or HF-FULL reel) · positioning line ·
                   services teaser · portfolio strip · testimonial · WhatsApp-first CTA
/about             Sneha's story + credentials + press/testimonials (Person schema)
/services          One page, six anchored sections: bridal · fashion · creative ·
                   special-effects · men · workshops — each with OWN copy (kills the
                   duplicate-content problem), price-on-enquiry CTA
/portfolio         Gallery, category-filterable; Instagram embed/pull as living layer
/contact           WhatsApp-first + form (packages/forms) + hours + Shivalik, New Delhi
/journal (optional, later)  Revive the 2 old posts only if rewritten; else drop them
```

- Frontmatter per Factory rule (title, description, locale, keywords[], schemaType, cta); `schemaType`: Person + BeautySalon/LocalBusiness on contact.
- CTA: chat-first per 2026-07-13 18:51 DECISIONS ruling — but **her own number, not Priya's** (Priya's interim number is for Kairali sites; this is a personal brand). Number conflict above must be resolved first (QUESTIONS.md).
- Tokens: this is not a Kairali-brand surface — like villaraag it needs its own small token file rather than brand-tokens.css. **Open question for Abilash** (logged): does Blush Lounge get `blush-tokens.css`, and is there any existing brand material beyond the old logo/Allura type?

## 4 · 301 plan (snehachowdhary.com → theblushlounge.com, per D1 semantic-map rules)

Per `docs/research/forward-strategy-D1.md` implementation rules 1–8:

1. **Direction:** snehachowdhary.com (and www) → theblushlounge.com. D6 fixes the canonical; the personal-name domain is the variant.
2. **Mapping:** snehachowdhary.com has **no URL inventory** (parking lander only) → D1 rule 4 applies in its simplest form: `snehachowdhary.com/*` → `https://theblushlounge.com/` (domain-level default to homepage, query strings preserved). No per-path map exists or is needed.
3. **Mechanics:** 301 only, server-side at the edge (Cloudflare Bulk Redirects list, CSV in-repo), single hop, apex+www, http+https all covered. Never a forwarded domain in any Ads final/display URL.
4. **Timing guard (D1 rule 8):** the forward flips **only when the rebuilt theblushlounge.com is LIVE**. Today theblushlounge.com is *down* — flipping now would 301 into a dead origin. Until launch, snehachowdhary.com stays parked as-is.
5. **Same-domain legacy redirects (on theblushlounge.com itself, in the new site's config, not Cloudflare):** old PHP paths → new routes, closest-equivalent per Mueller: `/about.php→/about`, `/contact.php→/contact`, `/gallery.php→/portfolio`, `/bridal-makeup.php→/services#bridal`, `/creative-makeup.php→/services#creative`, `/fashion-makeup.php→/services#fashion`, `/grooming-session.php→/services#workshops`, `/services.php→/services`, `/blog/*→/journal/*` if revived else `/`.
6. **Verification:** post-flip curl pass (http+https × apex+www × both domains) → single-hop 301 → 200; evidence to `audits/forward-farm-<date>.md`.
7. **DNS/Cloudflare execution is a HUMAN action** (Abilash/Ambuj). This brief prepares; it does not push.

## 5 · Open items (also in QUESTIONS.md)

- Hosting outage: revive old droplet or accept downtime until Factory rebuild ships?
- WhatsApp number conflict (…21110 vs …21114) — which is Sneha's real one?
- Blush Lounge brand assets: logo source file, any palette, `blush-tokens.css` decision.
- Access to Instagram @blushlounge_sneha for fresh portfolio imagery (old gallery is 2018-era low-res).
- Build-wave placement: not on the Wave map (personal site) — needs Abilash to slot it.
