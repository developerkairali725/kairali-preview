# AHV — the twelve 301s, and their machine evidence

**Written:** 2026-09-19 18:58:41 IST
**Branch:** `codex/ahv-english-staging-20260915`
**Ruling:** Abilash, in chat, 2026-09-19 — *"make all these pages 301"*, against the list in
`docs/reports/2026-09-19-ahv-article-template-families-and-design-brief.md` §7.

**Correction to that list:** it was described in chat as "eleven pages". It is **twelve** —
six leftovers + three `-old` form duplicates + `/cart/` + `/checkout/` + `/offers/new/`. All
twelve are redirected; the miscount was in the prose, not the list.

---

## 1. The map

Source of truth: `sites/ayurvedichealingvillage.com/english-candidate/redirect-map.json`,
which carries the reason and the measured Search Console figures for every row.

| Source | → Target | Why |
|---|---|---|
| `/test-page/` | `/` | h1 "Test Page". Scratch page, no subject. |
| `/test-page-2/` | `/givefeedback/` | h1 "Test Page" but titled *Write a Review / Give Testimonials* — a scratch copy of the feedback page. |
| `/testing/` | `/` | h1 "Testing". Scratch page, no subject. |
| `/gift-test/` | `/gift-vouchers/` | h1 "Shop" — a WooCommerce shop test. No shop exists; vouchers are the nearest real page. |
| `/my-account/` | `/` | WooCommerce account page. No commerce, no accounts. |
| `/how-to-reach-old/` | `/how-to-reach/` | Superseded duplicate; the live page earns 410 clicks. |
| `/contact-us-old/` | `/contact-us/` | Superseded duplicate; the live page earns 310 clicks. |
| `/enquiry-form-old/` | `/enquiry-form/` | Superseded duplicate. |
| `/online-consultation-old/` | `/online-consultation/` | Superseded duplicate; the live page earns 379 clicks. |
| `/cart/` | `/packages/` | WooCommerce cart, no commerce. `/packages/` is the content-rich equivalent (733 words, 27 cards). |
| `/checkout/` | `/packages/` | Same. |
| `/offers/new/` | `/offers/senior-citizen-offer/` | 93% identical; the offer it copies earns 236 clicks to its 0. Its canonical already pointed here. |

**301 explicitly, not Next's `permanent: true`** — that emits 308. Google treats the two alike,
but 301 is what was asked for and substituting a status code is not the agent's call.

**Every source measures zero clicks**, and every target is an existing approved route — the
CLAUDE.md BUILD DECISION MATRIX rule 2 condition ("content-rich ranking pages are never
redirected to thin targets") is satisfied by measurement, not by assertion.

---

## 2. Evidence

### Static integrity — `test/redirect-map.test.mjs`, 11 assertions

Registry gate `redirect-map-tests` is `status: planned`; its generated per-URL spec lands at M2.
Under CLAUDE.md §10 (activation semantics) a dormant gate still binds conduct, so the assertions
it describes are made here against the artefact that exists today. **This is not a claim that the
gate passed** — the gate's own mechanism does not exist yet.

```
✔ the owner's ruling is carried in full — twelve routes, no more, no fewer
✔ 301, because that is what was asked for
✔ every source is a real approved route, not a guess
✔ every target is a real approved route
✔ no chains — a target is never itself a source
✔ no route redirects to itself
✔ source and target both carry the site's trailing slash
✔ nothing that earns clicks is being redirected
✔ every redirect carries a written reason
✔ a redirected route never also carries a conflicting canonical override
✔ no legacy URL is left outside the map — the leftovers the audit named are all covered
ℹ tests 28   ℹ pass 28   ℹ fail 0
```

(28 = these 11 plus the 17 pre-existing lead-conversion tests, all still green.)

### Compiled into the build — `.next/routes-manifest.json`

```
redirects compiled into the build: 12 of 12
  301  /test-page/                    -> /
  301  /test-page-2/                  -> /givefeedback/
  301  /testing/                      -> /
  301  /gift-test/                    -> /gift-vouchers/
  301  /my-account/                   -> /
  301  /how-to-reach-old/             -> /how-to-reach/
  301  /contact-us-old/               -> /contact-us/
  301  /enquiry-form-old/             -> /enquiry-form/
  301  /online-consultation-old/      -> /online-consultation/
  301  /cart/                         -> /packages/
  301  /checkout/                     -> /packages/
  301  /offers/new/                   -> /offers/senior-citizen-offer/
```

### Live responses — `next start`, every URL probed

```
SOURCE                         STATUS  LOCATION                   TARGET RESPONDS
PASS /test-page/                    301  /                                 / -> 200
PASS /test-page-2/                  301  /givefeedback/                    /givefeedback/ -> 200
PASS /testing/                      301  /                                 / -> 200
PASS /gift-test/                    301  /gift-vouchers/                   /gift-vouchers/ -> 200
PASS /my-account/                   301  /                                 / -> 200
PASS /how-to-reach-old/             301  /how-to-reach/                    /how-to-reach/ -> 200
PASS /contact-us-old/               301  /contact-us/                      /contact-us/ -> 200
PASS /enquiry-form-old/             301  /enquiry-form/                    /enquiry-form/ -> 200
PASS /online-consultation-old/      301  /online-consultation/             /online-consultation/ -> 200
PASS /cart/                         301  /packages/                        /packages/ -> 200
PASS /checkout/                     301  /packages/                        /packages/ -> 200
PASS /offers/new/                   301  /offers/senior-citizen-offer/     /offers/senior-citizen-offer/ -> 200

12 pass, 0 fail  (301 + exact Location + target answers 200 in ONE hop)
```

### No collateral damage — full sweep

```
=== full sweep: every other approved route still answers ===
  checked 240 routes, non-200: 0
```

### Sitemap

```
sitemap entries (AHV_STAGING=0): 235
redirected URLs leaking into the sitemap: 0 []
```

`app/sitemap.ts` now reads the redirect map directly rather than relying on a matching
`sitemapExclude` flag in `route-overrides.json`, so the two can never drift: adding a redirect
removes the URL from the sitemap in the same edit. `/test-page-2/` and `/gift-test/` had **no**
`sitemapExclude` row before this change and would otherwise have been listed.

---

## 3. One finding, recorded and deliberately not chased

**The slash-less form costs two hops.** `/cart` answers `308 → /cart/`, then `301 → /packages/`.

```
  /cart                        first=308 -> /cart/        final=200  hops=3
```

This is inherent to `trailingSlash: true`, which is a deliberate site-wide decision recorded in
`next.config.ts` — every one of the 252 routes behaves this way, not just these twelve. The legacy
WordPress URLs that hold the rankings all carry the trailing slash, so real inbound traffic takes
the single-hop path verified above.

Chasing it would mean twelve more redirect sources to remove a second hop from URLs that measure
zero clicks. Under the POLISH TIME-BOX rule — *fix only what ships or blocks a live site* — that
ships no defect. Recorded here rather than fixed.

---

## 4. Concurrent writer in this worktree — needs the owner's eye

While this work ran, **another process was writing to this worktree**:

```
node tools/prerender-english.mjs --base http://127.0.0.1:4321 --out english-candidate/prerender   (started 16:19)
npm exec next start -p 4321                                                                        (started 15:52)
```

It has modified **122 files under `english-candidate/prerender/`**, stripping `loading="lazy"`
from images. The git status at the start of this session was clean, so those changes arrived
during it, from a session that is not this one.

**Nothing of theirs was committed, and nothing of theirs was stopped or reverted** — killing
another session's run is not the agent's call. Only the five files this work actually touched
were staged.

Two consequences worth knowing:
- That prerender run loaded `tools/prerender-english.mjs` **before** this change, so it will still
  write snapshots for the twelve redirected routes. They are unreachable (the redirect intercepts
  before any page renders), so they are dead bytes rather than a defect. The next prerender run
  skips them.
- If two sessions are editing this branch, one will clobber the other. That is the concurrent-writer
  hazard CLAUDE.md §BRIEFS & STATE-TRUTH names.

---

## 5. What this does NOT do

- **Nothing changes on production.** These redirects live in the staging build and take effect at
  the DNS flip, like every other route rule in this lane (HARD GATE 1).
- **No page was unpublished, deleted, or had its status changed** by the agent. The owner ruled;
  this implements the ruling.
- `/postulez-maintenant/` — the French apply-now page — is `sitemapExclude` but was **not** in the
  owner's list, so it still serves. Flagged, not touched.
