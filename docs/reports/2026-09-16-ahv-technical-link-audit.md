# AHV English — technical link audit

Date: 2026-09-16 · Task `WOPS-AHV-ENGLISH-STAGING-BUILD-20260915-001`
Ruling: **D-20260916-06** — the English build is a port of the already-live site, so
inherited claim/clinical-language issues are not go-live blockers and content is fixed
later; what must be clean is the technical layer: **zero 404s, zero wrong linking,
nothing else Google would flag.**

Method: two independent passes against the rebuilt site — (a) every one of the **1,849
internal URLs** referenced anywhere in the 252 snapshots, tested individually, and (b) a
full link-graph crawl from `/` with `<script>` stripped, the way a crawler parses.

---

## 1. Fixed

| Defect | Count | Fix |
|---|---:|---|
| Links keeping the **production origin** in the server HTML | 228 | Localised to paths. `boot.ts` fixed these at runtime, so a visitor never saw it — but a crawler followed them off the deployment to the live WordPress site. 226 were on `/sitemap` alone. |
| **Malformed URL** `…ayurvedichealingvillage.comtel:+91-…` | 2 | A base concatenated onto a `tel:` URI — a link that went nowhere. |
| Missing `/ahv` prefix on a design asset | 1 | File existed under the correct prefix all along. |
| Link to a page that does not exist | 1 | `/programs/intensive-ayurveda-training-program-wap-hv` → `/yoga-meditation-training/`. |
| Legacy WordPress media | 2 | `fauna-booklet.pdf` → the identical file already in the design package. The 2025 award certificate mirrored from production into `public/images/` (82 KB). |
| DE/RU links on `/sitemap` | 3 | Pointed at English equivalents so nothing 404s; real targets once `de`/`ru` ship in translation Wave 1. |
| `http://` outbound links | 10 | Upgraded to `https://`. Every host verified to serve https 200 **before** being listed — no destination invented. |

**Impact of the first row alone:** pages reachable by a non-JS crawl went **180 → 225**,
and orphans **72 → 27**.

## 2. Current state

```
internal URLs        1,849 checked · 1 broken · 0 malformed
link-graph crawl     0 4xx/5xx · 0 redirect chains · 0 redirects to non-200
                     0 missing <title> · 0 missing <h1> · 0 multiple <h1>
                     0 images without alt · 0 invalid JSON-LD
                     0 insecure http:// links · 0 thin pages (<600 chars)
crawler text         252 routes · min 1,438 / median 6,259 / max 30,020
browser @390px       252 routes · 0 render failures · 0 overflow
                     0 broken images · 0 JS errors · 0 live-domain links
```

## 3. The one remaining 404

`/download/ayurvedaworkshop-in-kairali.pdf`, linked from `/ayurveda-workshop`.

**It returns 404 on the live production site as well.** The file does not exist anywhere —
not in the repo, not on production — so it cannot be repaired by retargeting. It needs
the actual PDF from Deepu, or the link removed. Reported rather than papered over.

## 4. Needs an owner decision — not fixed, deliberately

### 4.1 `og:image` will break at the DNS flip — 182 of 252 pages

49 distinct `og:image` URLs, **all** pointing at `ayurvedichealingvillage.com/wp-content/…`.
46 of them resolve on production today; 3 already 404 there (`/og-card.jpg` among them,
which is the homepage's). The new site does not serve `/wp-content/`, so **the moment the
domain points at Vercel, every one of these breaks.**

This is not a ranking error — `og:image` drives social and chat link previews — but it is
exactly the "wrong linking that breaks at go-live" class. Three options:

1. Mirror the 46 images into the new site and repoint the metadata (a few MB — the brief
   excludes large binary media, so this needs a nod).
2. Add a rewrite for `/wp-content/*` to the old host, if it stays up.
3. Repoint the metadata at images the new site already has.

### 4.2 Twenty-seven orphan routes — in the sitemap, linked from nothing

Not broken, but Google would see thin or duplicate pages. They fall into four groups:

| Group | Routes |
|---|---|
| **Should probably not be live at all** | `/cart/` `/checkout/` `/my-account/` — a cart and checkout on a hospital site, which the Factory rules prohibit building. Plus `/test-page/` `/test-page-2/` `/testing/` `/gift-test/`. |
| **Superseded duplicates** | `/contact-us-old/` `/enquiry-form-old/` `/how-to-reach-old/` `/online-consultation-old/` `/thanks-old/` `/new-privacy-policy/` — near-duplicates of the live pages, a classic duplicate-content flag. |
| **Thank-you pages** (orphan is normal) | `/contact-us/thank-you/` `/onlinebookingthankyou/` `/onlineconsultation-thanks/` |
| **Real content, genuinely unlinked** | `/learn-about-ayurveda/` `/our-story/` `/panchakarma/` `/yoga-and-ayurveda/` `/family-ayurvedic-retreat-kerala.html` `/revitalizing-and-strengthening-treatment-for-cancer-patients/` `/kairali-air-india-maharaja-club.html` `/payment-policy-compliance/` `/offers/new/` `/offers/defence-paramilitary-personnel-get-upto-30-off/` `/postulez-maintenant/` |

Two things worth the owner's eye: **`/postulez-maintenant/` is a French page sitting in
the English build**, and the last group is real content that nothing links to — it will be
crawled from the sitemap and look low-value.

Recommendation at go-live: `noindex` or drop the first two groups; add internal links to
the fourth. All three are content/scope calls, which the owner has deferred.

### 4.3 Canonical and structured data are client-side only — by design

225 pages carry **no canonical and no JSON-LD in the server response**; both appear once
JavaScript runs. This is **deliberate and documented** in `app/(english)/_families/
metadata.ts`: emitting them server-side *as well* produced **two** `<link rel="canonical">`
and **two** `<meta name="robots">` in every head, which an independent 320px review
flagged across all 25 routes it checked.

So this is a considered trade-off, not an oversight, and naively "fixing" it would
reintroduce a defect someone already caught. The cost is that a non-JS crawler sees no
canonical and no structured data — the same argument that made server-side rendering a
blocker (D-20260915-03). Worth revisiting **as a design change**, by moving the emission
to one place rather than adding a second.

### 4.4 Inherited duplicate metadata

5 duplicate `<title>` groups, 4 duplicate meta-description groups, and 2 pages with no
description (`/thanks`, `/ppc-thanks` — both thank-you pages, normally noindex anyway).
All inherited from the approved source, which `metadata.ts` preserves on purpose
(HARD GATE 6 — nothing composed or invented). Content lane, per D-20260916-06.

## 5. Process note

Two "findings" during this pass were mine, not the site's, and both were caught by
checking served bytes before trusting a number:

- A `pkill` pattern did not match the running server, so the replacement hit
  `EADDRINUSE` and several results were measured against a **stale build**. Killing by
  PID and asserting on the served bytes fixed it. This is the second time this failure
  mode has appeared in this workstream.
- An audit regex matched the word `canonical` inside the boot script's own source
  comment, producing a phantom "broken link".
