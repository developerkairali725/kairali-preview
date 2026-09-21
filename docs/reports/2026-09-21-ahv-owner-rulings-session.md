# AHV English staging — ten owner rulings, taken one at a time and executed

**Session: 2026-09-21, 13:20–17:40 IST.** Branch `codex/ahv-english-staging-20260915`.
As of commit `66ee339f` plus this report.

The owner asked for the open questions one at a time so the work could finish rather than stall.
Ten were asked; ten were answered; all ten are executed and pushed. This is the record of what he
decided, what was built, and — where it matters — where he overruled a recommendation.

---

## 1 · The standing blocker has not moved

PR #309 is still DRAFT / BLOCKED. Re-checked today: `changes`, `gate`, `brand-lint`,
`security-review`, `front-gate` all FAILURE, each completing in 1–2s with the
payments/spending-limit annotation, plus one failing Vercel project. **Only the owner can clear
it** — GitHub → Org settings → Billing & plans. The PR stays a draft deliberately: green here
would mean the checks never ran.

## 2 · The rulings, and what each produced

| # | Ruling | Built |
|---|---|---|
| 1 | Chapter 08 uses the rebuild's own programme set | 38 programmes, **all 38 routes asserted present** in the manifest; the tool exits 1 rather than degrade a dead programme to plain text |
| 2 | Chapter 06 NABH-first, **keep the lapsed certificates** | 29 entries ordered; ISO (through 2025-02-16) and Ayur Diamond (through 2026-07-24) retained, exposure logged |
| 3 | Embed the official Tripadvisor widget | `cdsratingsonlynarrow`; live 4.6 / 453 reviews |
| 4 | Hero = option **E**, not my recommended regrade | installed at 1280×572 |
| 5 | Defence discount: **20% is real** | 8 strings, two payloads, both snapshots re-prerendered |
| 6 | Ship the chat bubble **as-is** | on all English routes; dashboard fix drafted |
| 7 | **Wire Consent Mode properly** | `ConsentScripts` + a `boot.ts` consent bridge |
| 8 | Structured data: **match live, per route** | 254/254 routes emit a valid `@graph` |
| 9 | `partners@` / `press@` don't exist | replaced with the locked `info@kairali.com` |
| 10 | Deepu's UI asks: **neither** — the design stands | both routed to the designer as change requests |

## 3 · Where I was wrong, on the record

Three of my own claims did not survive measurement. Each is recorded in its commit, and they are
collected here because the pattern is the point.

- **The Tripadvisor widget.** I put it to the owner carrying two objections — that it sets
  third-party cookies against his no-consent ruling and injects an iframe into a sweep that fails
  on iframes. He overrode both. Measured: **0 iframes, 0 cookies, 0 localStorage keys.** Perplexity
  had declined to confirm my claim from Tripadvisor's own docs and told me to inspect the rendered
  widget; it was right to.
- **A "site-wide dead consent notice".** An early run showed the cookie notice's buttons dead and I
  was heading toward reporting a pre-existing sitewide defect. It did not reproduce on a clean
  build, on three routes, across four build variants. The failing run had also logged a resource
  404 — the server had been started against a `.next` that was rebuilt underneath it.
- **My own award tool.** Its first run reported three lapsed certificates and named a registration
  valid until **2028** as one of them, because it compared three different printed date formats as
  strings. The true count is two.

The habit that caught all three is the same one this project already learned: an audit finding is
a candidate, not a fact.

## 4 · What the measurements found that nobody asked for

- **Structured data was a regression, not a gap.** The question was "should we add schema". The
  live site emits `Organization`, `WebSite`, `BreadcrumbList` and `WebPage` on *every* page; the
  rebuild emitted **zero** on 254 routes. Flipping DNS would have dropped all of it sitewide — on a
  migration whose entire purpose is absorbing the legacy ranking value.
- **The discount contradiction was wider than reported.** Not one page: the slug said 30, the H1
  said 20, the tier table capped at 20, and a *second* live page promised a flat 30% on everything.
  What settled it without guessing was measuring the two sibling offer pages — senior-citizen and
  Olympics both read "up to 20%" with the identical 10/15/20 tiers.
- **A gate that could not see the thing it guards.** `chat-bubble-lint` looked only for
  `app/layout.tsx`, so this site — split into `(english)` and `(lp)` route-group roots — read as
  "no root layout at all" and its real layouts were never inspected. Separately, its main guard
  compared `import.meta.url` to `process.argv[1]` as strings, so on any path containing a space
  `main()` never ran and the gate **exited 0 having checked nothing**. Both fixed; 13 tests.
- **A correction I owe the record.** I first reported the programme tariff as "32 of 38 prices
  expire in nine days". Wrong framing: the dataset holds a validity *window*, the new tariff year
  runs **2026-10-01 → 2027-09-30**, and five training programmes already carry it. The rates run to
  2027; 32 rows simply have not been refreshed. Same date, different meaning — a refresh task, not a
  cliff.
- **The hero the owner picked was a WordPress derivative.** Option E existed in the repo at
  1024×458, below the 1200px slot. Its `legacyUrl` carried WordPress's own `-1024x458` suffix; the
  unsuffixed original is 1280×572 *and a smaller file*.

## 5 · Evidence

Every change was measured on the built site, not asserted:

```
structured data   254 / 254 routes emit exactly one valid @graph
                  1,261 emitted text fields · 0 not already in that route's own metadata
consent mode      default denied → accept → 1 update (analytics+ad granted)
                  next page load re-applies synchronously: default → update → update
chat bubble       script injected · config set · correct bot id
full sweep        508 states · 458 pass · 50 fail · NEW failures 0 (identical to baseline)
tests             site suite 46/46 · chat-bubble-lint 13/13 · chat-bubble-lint PASS
```

## 6 · What is still open

**Owner / other hands:**
1. **GitHub Actions billing** — nothing on this PR can go green until it clears.
2. **The Chatbase dashboard** — wrong WhatsApp number, no AI disclosure, banned 1908 wording. The
   exact replacement copy is drafted; one edit fixes every fleet site.
3. **The 2026-27 numbers for 32 programmes.** Corrected by the owner after this report's first draft: the tariff year runs to **September 2027**, not out in nine days. Five training programmes already carry `2026-10-01 → 2027-09-30`; the other 32 are still on the 2025-26 window. A data refresh due at the 1 October changeover — and the three linked price-list PDFs are still named `25-26`.
4. **Dr. Deepu John** — the 87% claim, carried forward on the owner's ruling, *not* reviewed.
5. **Deepu** — the real enquiry endpoint; the live site's own `infoo@kairali.com` typo.
6. **The designer** — the two change requests, one of them a real functional gap (no contact
   affordance anywhere in the header, on 254 routes).

**Not ruled, so not done:** the landline renders in three formats sitewide (78 / 45 / 41). Raised
as an aside in the contact question; no ruling was given, so nothing was normalised.

**Still unwired:** the long-form advertising page. Every owner input it was blocked on is now
resolved and its data artifacts are built — but nothing has been wired into the site yet, and the
form still posts to the live WordPress host.
