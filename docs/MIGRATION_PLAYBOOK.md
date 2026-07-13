# MIGRATION_PLAYBOOK.md — SEO-Safe Site Migration (v1.0)

**Scope:** ~28 revenue-earning WordPress sites (plus ~35 forwarded domains) migrating to a Next.js/Vercel monorepo in waves over 30 days. Domains stay the same (platform migration, not domain migration). DNS moves to Cloudflare; new Vercel sites are DNS-only (grey cloud), legacy WordPress stays proxied. Flagship `ayurvedichealingvillage.com` (376 pages, EN/DE/FR) migrates **last**, section-by-section. Revenue depends on organic leads (consultation forms, WhatsApp), Google Ads landing pages, and assisted Shopify sales.

**Good news baked into this plan:** because domains do not change, this is the *safest* class of migration Google describes — no Change of Address, no cross-domain signal transfer. The risk is concentrated in three places: URL/path changes, lost on-page parity (titles/schema/hreflang), and operational breakage (forms, DNS records, Ads final URLs). This playbook is organized around those risks.

---

## 1. Non-negotiable rules (the 10 things that lose business if violated)

1. **Every indexed or ads-targeted URL must resolve 200 or redirect 301/308 to its one true equivalent.** Never 404, never redirect to the homepage as a catch-all — Google treats irrelevant redirects as soft 404s and drops the signals [1]. This is the single most common cause of catastrophic post-migration traffic loss (documented cases: ~100% organic loss in 2 months from missing redirect maps) [8].
2. **Google Ads final URLs never 404 and never cross-domain-redirect.** A 404/403 at the final URL = "Destination not accessible" disapproval; a redirect off-domain = "Destination mismatch" disapproval. Either one stops ads (and leads) instantly [9][10][11].
3. **Preserve URL paths 1:1 wherever humanly possible.** A same-domain, same-URL platform swap is the lowest-risk migration there is [4]. Only change a URL when the old one is genuinely broken, and then only with a mapped 301.
4. **One change at a time.** Do not combine replatform + redesign + URL restructure + content rewrite in one launch. Mueller: "If you do everything at once, you'll never know what to fix" [4][5]. Platform swap first; restructure content in a later, separate release.
5. **Staging must be uncrawlable and unindexable** (auth + X-Robots-Tag noindex). One documented Next.js migration had its staging domain indexed and it "destroyed their main domain's authority in a week" [7]. See §2 — this is the spalabs.in incident pattern.
6. **Parity before launch:** titles, meta descriptions, H1s, canonicals, schema/structured data, hreflang, OG tags must match the old site page-for-page. A migration that silently dropped theme-generated schema lost rich snippets and 25% of CTR overnight [7]. Sites that run a parity audit keep rankings; sites that skip it lose 15–30% of organic within 90 days [6].
7. **Forms and WhatsApp links are tested with a real submission on cutover day, per site, before the team stands down.** A migration that ranks perfectly but drops leads is still a failed migration. Keep the old form backend able to receive for 72h as fallback.
8. **Copy every DNS record to Cloudflare before changing nameservers — especially MX, SPF/DKIM/DMARC TXT, and verification records.** Losing email = losing every lead notification silently. Export the full zone from the current host and diff it.
9. **Redirects live for at least 1 year** (Google's stated minimum for full signal transfer) [1]. Redirect logic lives in version-controlled `next.config.js` / middleware, not in someone's head.
10. **Never launch a wave during a peak booking season or an active high-spend campaign flight** for that site. Pause/schedule around it. Rankings can fluctuate for weeks even in perfect migrations [1] — don't stack that on top of your best revenue window.

---

## 2. Staging: how to stage safely

The failure pattern to prevent (the **spalabs.in incident pattern**): a staging/old copy of a site stays reachable and gets indexed, creating a duplicate-content shadow site that competes with (or outranks) the real one, and it stays indexed for months because nobody removes it.

**Rules for every Vercel preview / staging deployment:**

- [ ] **Layer 1 — access control (the only real protection):** enable Vercel Deployment Protection (password / Vercel Authentication) on all preview deployments. Crawlers can't authenticate, so they never see the content [15].
- [ ] **Layer 2 — `X-Robots-Tag: noindex, nofollow`** HTTP header on every non-production deployment (Vercel sets this automatically on `*.vercel.app` preview URLs; verify with `curl -I`). Belt-and-braces in case auth is ever disabled [15].
- [ ] **Do NOT rely on robots.txt `Disallow` for staging.** Blocked-but-linked URLs can still be indexed ("Indexed, though blocked by robots.txt") and robots.txt prevents Google from ever seeing your noindex tag [15].
- [ ] **Never paste staging URLs** into public channels, client-visible docs that get published, or anywhere a crawler can find them (including linking staging from a live site).
- [ ] **Production domain assignment is the "un-noindex" moment:** verify the production deployment does NOT carry noindex. Forgotten noindex on launch is the mirror-image disaster — it de-indexes the live site [1]. Add a launch check: `curl -sI https://<domain>/ | grep -i x-robots` must return nothing, and view-source must show no `noindex`.
- [ ] **Decommission old copies:** after each wave, the old WordPress origin must not remain publicly reachable on any hostname (old subdomain, hosting preview URL, IP-based vhost). If an old copy is already indexed, add noindex (not robots.txt block), then use GSC **Removals** for urgent cases, and let Google recrawl [15].
- [ ] **Audit monthly during the sprint:** search `site:<domain>` and `site:vercel.app <brand>` for leaked staging results.

---

## 3. Phasing: wave-based cutover strategy

**Why per-site waves (not per-page batches) for the ~27 small sites:** Google's official guidance is that small/medium sites should move **all at once** — it's cleaner for users and lets Google's algorithms detect and process the move faster; moving in overlapping fragments leaves Google holding two half-sites [1]. A half-migrated small site also creates internal links that criss-cross platforms and confuses canonical selection.

**Why section-by-section for the flagship (376 pages, EN/DE/FR):** Google explicitly allows large/complex sites to migrate in sections because it "makes it easier to monitor and resolve problems" [1]. For ayurvedichealingvillage.com, migrate by top-level section (e.g., `/treatments/`, `/accommodation/`, `/blog/`, then the language trees), each with its own redirect map, parity audit, and 1-week observation window. Each section must move **complete across all three languages at once** so hreflang clusters never half-break (see §9).

**Wave design:**

- **Wave 0 (pilot):** 1–2 lowest-revenue, lowest-traffic sites. Purpose: validate the entire pipeline (redirects, forms, DNS, monitoring) where mistakes are cheap. Hold 1 week before Wave 1.
- **Waves 1–N:** batch 4–6 sites per wave, ascending by revenue/traffic. Highest-earning small sites go in the final small-site waves, after the process is boring and repeatable.
- **Flagship:** only after the 30-day sprint, only after all small-site waves are stable, section-by-section as above.
- **Forwarded domains (~35):** lowest risk, do these early. Each forwarded domain 301s (Cloudflare Bulk Redirects or redirect rules) to the canonical target's equivalent page — never to a parked page, never 302.

**Timing rules:**

- Cut over **Tuesday–Thursday, morning local time**, never Friday, never before a holiday. Full team available for 48h after.
- Check the seasonality calendar (retreat booking peaks, festival/holiday demand) and the Ads calendar per site; a site in an active campaign flight or peak week is pushed to a later wave.
- **One change at a time:** each wave changes *platform only*. Redesigns are acceptable (new sites will look different) but URL structure, content, titles, and schema stay matched. Content/URL improvements are a separate release ≥4 weeks post-cutover, once the baseline is re-established [4][5].
- **Freeze window:** no content edits on a site from redirect-map lock until 1 week post-cutover (a moving target invalidates the map).

---

## 4. Pre-migration checklist (per site, complete before its wave)

**Crawl & inventory (lock 1 week before cutover):**

- [ ] Full crawl of the live WordPress site (Screaming Frog): every URL, status, title, meta description, H1, canonical, hreflang, schema types, word count. Save the crawl file — it is the parity baseline [6].
- [ ] Union the URL inventory from: crawl + XML sitemap + GSC Performance export + GA/analytics top pages + server logs if available. The crawl alone misses orphan pages that still earn traffic.
- [ ] Inventory all non-page assets that earn links/traffic: PDFs, images ranking in Image Search, feeds.

**Baselines (export and archive; you cannot recover these later):**

- [ ] GSC Performance: last 12 months — top 500 queries by impressions, top 100 pages by clicks, average position by page; CSV export [6].
- [ ] GSC Index Coverage / Pages report snapshot (count of indexed pages).
- [ ] GA4: 12 months of sessions, conversions (form submits, WhatsApp clicks) by landing page.
- [ ] Backlink inventory (Ahrefs/Semrush/GSC Links report): top linked pages — every URL with external links **must** have a 200 or exact-match 301 destination.
- [ ] Core Web Vitals baseline (CrUX/GSC) — you expect these to improve on Next.js [7]; prove it.

**Redirect map (the single most important artifact):**

- [ ] Build a 1:1 map old-URL → new-URL for **every** inventoried URL. Same-path URLs map to themselves (verify they render 200 on the Vercel preview).
- [ ] Changed URLs get a single-hop 301/308. Next.js `permanent: true` emits **308**, which Google treats identically to 301 [16][17] — acceptable; use middleware for pattern-based legacy URLs (e.g., `?p=123`, `/index.php/...`, date-based blog permalinks).
- [ ] Decide trailing-slash policy once (`trailingSlash` in next.config) and make it match the old site's canonical form, or map it — otherwise every URL silently becomes a redirect hop [17].
- [ ] No chains: old URL → final URL in one hop (Google follows up to 10 hops but recommends ≤3; every hop leaks latency and risk) [1].
- [ ] Pages being retired with no equivalent: 301 to the closest relevant parent **only if genuinely relevant**, else serve 410/404 honestly. Mass-redirecting junk to the homepage = soft-404 pattern [1].
- [ ] Test the full map against the Vercel preview with a script (`curl -sIL` each old URL, assert final status 200 and expected destination). Gate the wave on 100% pass.

**Parity audit (on password-protected preview):**

- [ ] Crawl the preview and diff against baseline crawl: titles, descriptions, H1s, canonicals, schema (JSON-LD types per template), robots meta, hreflang. Investigate every mismatch [6][7].
- [ ] Verify schema explicitly — WordPress themes/plugins (Yoast, RankMath) inject Organization/Article/Breadcrumb/FAQ schema you may not know exists; rebuild it deliberately in Next.js [7].
- [ ] Verify canonical tags are absolute, self-referencing, and point at the production domain (not the preview URL).
- [ ] New XML sitemap generated, containing only 200-status final URLs.

**Lead-flow inventory (revenue protection):**

- [ ] List every form on the site, its backend/notification path, and who receives leads. Rebuild + test each on preview (test submission reaches the real inbox/CRM).
- [ ] List every WhatsApp CTA (number, prefilled text) and `tel:`/`mailto:` links; verify on preview.
- [ ] Confirm GA4/Tag Manager, conversion tags, and any call-tracking scripts are installed on the new build with the same IDs.

**Google Ads inventory (see §8):**

- [ ] Export all final URLs, mobile URLs, tracking templates, and sitelink URLs (Google Ads Editor account export). Cross-check every one against the redirect map — each must land 200 on the new site, same domain.

**DNS preparation:**

- [ ] Export the complete current DNS zone; recreate in Cloudflare and diff (A/AAAA/CNAME/MX/TXT/SPF/DKIM/DMARC/verification records).
- [ ] Lower TTL on the site's A/CNAME records to **300 seconds** at least 24–48h before cutover.
- [ ] Pre-stage the Vercel records (apex A `76.76.21.21` / `cname.vercel-dns.com` per current Vercel docs), **grey-cloud (DNS-only)** — Cloudflare proxying in front of Vercel causes SSL/edge conflicts and is unnecessary.

---

## 5. Cutover-day checklist (per site)

Run in this order; assign a named owner per step.

1. [ ] **Final content freeze confirmed**; redirect map re-verified against preview within the last 24h.
2. [ ] **Remove staging protections on the production deployment only**: password off, confirm no `noindex` in HTML or `X-Robots-Tag` header (`curl -sI https://<preview>/ | grep -i robots`).
3. [ ] **Flip DNS** (TTL already 300s): point apex/www at Vercel, grey cloud. Verify SSL certificate issuance in Vercel completes.
4. [ ] **Smoke test within 15 minutes of propagation:**
   - Homepage, top-10-traffic pages, top-5 Ads landing pages: all 200, correct content, correct titles.
   - Run the redirect-map script against the **live** domain: 100% pass required.
   - `robots.txt` returns the production version (allows crawling, references new sitemap).
   - **Submit a real test lead through every form; click every WhatsApp CTA on mobile.** Confirm receipt.
   - Check GA4 realtime shows traffic and conversion events firing.
5. [ ] **Sitemap swap:** submit the new XML sitemap in GSC. Keep the old sitemap submitted temporarily — "URL redirects" warnings on it are normal and confirm Google is seeing your 301s; remove it once the wave's URLs are re-indexed [1].
6. [ ] **GSC Change of Address: NOT used for these sites.** The tool is only for domain changes; it must not be used for same-domain platform/path migrations [2]. (Only relevant if any property ever consolidates onto a different domain — then: verify both properties, 301 homepage-to-homepage, submit CoA, tool stays active 180 days, doesn't cover subdomains [2].)
7. [ ] **Request indexing** (GSC URL Inspection) for the homepage and top 5–10 money pages. Don't mass-request; the sitemap does the bulk work.
8. [ ] **Google Ads:** confirm ads still serving; check Ads UI for disapprovals within 2h (see §8).
9. [ ] **Keep WordPress origin alive but dark** for ≥2 weeks (reachable by you at a temp hostname with noindex, per §2) for content/asset recovery and rollback.
10. [ ] **Rollback plan on standby:** rollback = point DNS back at the old origin (5-minute TTL makes this fast). Rollback triggers are defined in §6 — decide against criteria, not panic.
11. [ ] After 1 week stable: raise TTL back to 3600s.

---

## 6. Post-migration checklist

### Day 1 (first 24–48h)

- [ ] GSC **Pages (Index Coverage)** report: watch for spikes in "Not found (404)", "Soft 404", "Page with redirect", "Excluded by noindex" — the last one is a launch-blocker-grade bug.
- [ ] GSC **Crawl Stats** (Settings → Crawl stats): expect a crawl spike as Google processes the change [1]; confirm the new host is responding 200 and fast. Insufficient server capacity during this spike is a known pitfall [1] (rarely an issue on Vercel, but check function errors/limits).
- [ ] Vercel logs / analytics: monitor 404s in real time; every unexpected 404 gets a redirect added same-day.
- [ ] Leads: count form + WhatsApp leads vs. same-weekday baseline. Investigate any gap >30% immediately (it's almost always a form/tag bug, not SEO).
- [ ] Ads: check "Destination not accessible / not working / mismatch" disapprovals and CPC/QS anomalies [9][10][11].

### Week 1 (daily checks)

- [ ] GSC Performance (filter: last 7 days vs. previous period): clicks/impressions per top-100 page list. Expect **temporary fluctuation — this is normal** [1].
- [ ] Index coverage trend: old URLs shifting to "Page with redirect", new URLs to "Indexed". A medium site takes **a few weeks** for most pages to move over in Google's index [1].
- [ ] 404 monitor (Vercel logs + GSC): patch stragglers into the redirect map.
- [ ] Spot-check `site:domain.com` — new titles/URLs appearing; no staging or duplicate hosts.
- [ ] Rankings: track the top 20 money keywords per site (rank tracker) daily.
- [ ] Leads vs. baseline, daily tally per site.

### Month 1 (weekly checks)

- [ ] GSC Performance 28-day vs. pre-migration baseline export, per page and per query.
- [ ] Core Web Vitals: confirm improvement (this is where the Next.js upside should show — Lighthouse 90+ vs. WordPress 40–60 is typical [7]).
- [ ] Old sitemap: once its URLs show ~0 indexed, remove it. Keep redirects (≥1 year [1]).

**When to worry vs. normal fluctuation:**

| Signal | Normal | Investigate | Alarm / consider rollback |
|---|---|---|---|
| Organic clicks (site-wide) | ±10–15% for 2–4 weeks | −15–30% beyond week 2 | −30%+ in week 1, or any cliff-to-near-zero |
| Rankings (money terms) | ±1–3 positions, 2–4 weeks | Persistent −5+ after week 3 | Money pages deindexed / off page 1–3 entirely |
| 404s in GSC | Handful of stragglers | Dozens, growing | Hundreds / top pages 404ing |
| Leads | ±20% day-to-day noise | −30% for 3+ days | −50%+ for 48h (treat as ops incident, not SEO) |

**Rollback criteria (pre-agreed):** roll DNS back if, within 72h, (a) top pages are 404/500 and can't be hot-fixed in hours, (b) leads are down >50% for 48h with no identified fixable cause, or (c) Ads are mass-disapproved and can't be re-approved quickly. Do **not** roll back for ranking wobble alone — re-migration whiplash (flip-flopping URLs) does more damage than riding out normal fluctuation [1][4].

---

## 7. Google Ads continuity checklist

Ads are the fastest way this migration loses money — disapprovals act in hours, not weeks.

- [ ] **Before the wave:** export every campaign's final URLs, mobile final URLs, tracking templates, custom parameters, and sitelink/asset URLs (Google Ads Editor). Verify each against the redirect map.
- [ ] **Preserve ad landing-page paths 1:1.** If a landing page URL must change, **edit the final URL in Ads at cutover** — do not lean on the redirect long-term. Policy allows same-domain redirects, but a redirect that lands on a *different domain* than the final URL is a "Destination mismatch" disapproval [10]. (Relevant for the ~35 forwarded domains: no ad may use a forwarded domain as its final URL.)
- [ ] **AdsBot must be able to crawl the new pages:** don't block `AdsBot-Google` in robots.txt; 404/403 at the final URL = "Destination not accessible" disapproval [11][9].
- [ ] **Cutover-day sequencing:** flip DNS → smoke-test the ad landing pages → update any changed final URLs in one Ads Editor batch. Note that editing final URLs resets ad review; do it at a low-traffic hour.
- [ ] **Expect (silent) learning-phase effects:** landing-page changes are a meaningful signal change; Smart Bidding may recalibrate even while the UI shows "Eligible". Make the swap the *only* change — don't touch budgets/bids/creative in the same week, and judge performance only after ~25–30 post-change conversions [12][20].
- [ ] **Conversion tracking continuity:** same conversion actions/tags (GA4 + Google Ads tag) firing on the new forms and WhatsApp clicks, verified with Tag Assistant on cutover day. A tracking gap looks like a performance collapse to Smart Bidding and triggers real bid damage.
- [ ] **Landing-page message match:** new-design pages must still contain the ad's promise (offer, headline, form above the fold) or Quality Score and CVR degrade [20].
- [ ] **Campaign calendar:** no wave ships during a site's major flight; pause non-critical campaigns for the 2–4h cutover window if forms can't be verified in advance.
- [ ] **Monitor for 72h:** Policy Manager (disapprovals), CPC, Search lost IS (rank), conversion volume vs. the prior 2 weeks.

---

## 8. Multilingual (hreflang) checklist — flagship EN/DE/FR

hreflang is the most commonly *forgotten* item in migration plans, and breaking it causes wrong-language pages to rank in the wrong country, cannibalization, and ranking volatility [13][14].

- [ ] **Inventory current hreflang** from the WordPress site (crawl extraction): every cluster (EN/DE/FR + x-default), the URL pattern per language, and whether it's emitted via HTML tags, sitemap, or plugin (WPML/Polylang inject these — parity trap, like schema [7]).
- [ ] **Rebuild deliberately in Next.js** (`alternates.languages` in the Metadata API or sitemap-level hreflang). Every page outputs its **full cluster**: self-reference + both alternates + `x-default`. Missing return tags break the whole cluster — Google requires bidirectional confirmation and silently ignores hreflang without it [13][19].
- [ ] **Correct codes:** `en`, `de`, `fr` (or `en-US` style if targeting countries — never invented codes like `en-uk`; it's `en-gb`) [19]. `x-default` points to the language selector or EN default.
- [ ] **hreflang URLs must be final URLs:** absolute, 200-status, self-canonical. An hreflang pointing at a URL that 404s or redirects invalidates the signal for the cluster [13].
- [ ] **Migrate language trees in lockstep:** when a flagship section moves, its EN, DE, and FR versions move in the same deploy so no cluster ever points across old/new with broken return tags [13][14]. This is *the* reason flagship sections are defined as "section × all languages".
- [ ] **Redirect language-to-language:** old DE URL → new DE URL, old FR → new FR. Never redirect a language version to the EN page (soft-404 + hreflang break + lost DE/FR rankings) [14][21].
- [ ] **Per-language sitemaps** (or a sitemap index) submitted in GSC; monitor Performance filtered by country (Germany, France) as separate baselines — DE/FR traffic can fail independently while EN looks fine.
- [ ] **Post-launch validation:** crawl with Screaming Frog hreflang report (missing return links, non-200 hreflang URLs = zero tolerance); spot-check `site:` queries on google.de and google.fr.

---

## 9. Red flags that make Google trust you less

Avoid anything that pattern-matches to spam during the migration window, when the sites are already under re-evaluation:

- **Mass thin/AI-generated content.** Google's scaled-content-abuse policy (March 2024, enforced through 2025 spam updates) targets "many pages… with little or no value added," regardless of whether AI or humans wrote them [18]. Do **not** use the migration to bulk-generate new pages across 28 sites from templates/AI without real editorial value — a portfolio of same-owner sites launching simultaneous templated content is exactly the footprint those systems look for. Migrate existing proven content first; add new content gradually with human expertise.
- **Redirect chains and loops.** Chains leak signals and latency; keep every redirect single-hop, and audit that Cloudflare forwarded-domain rules + Next.js redirects + trailing-slash normalization don't stack into 3-hop chains [1][17].
- **Soft 404s.** Redirecting deleted pages en masse to the homepage, or serving "not found" content with a 200 status. Google reclassifies these as soft 404s and discards them [1]. Serve honest 404/410 with a helpful not-found page.
- **Cloaking-like staging/geo setups.** Anything that shows Googlebot different content than users — e.g., an auth wall that lets Googlebot through, aggressive Cloudflare bot rules that challenge Googlebot/AdsBot on legacy proxied sites (orange cloud: verify no CAPTCHA/JS-challenge for verified bots), or country-redirects that force DE/FR visitors (and crawlers) away from the URL they requested.
- **Duplicate shadow copies.** Old WordPress origins, staging previews, or forwarded domains serving 200 duplicates of the new sites (§2). One canonical host per site, everything else redirects or is noindexed behind auth.
- **Interlinking footprint.** 28 same-owner sites cross-linking site-wide in footers looks like a link network. Link between group sites only where genuinely useful for users.
- **Flip-flopping.** Changing URLs, then changing them again weeks later, or rolling back and re-launching repeatedly. Every flip restarts the re-evaluation clock [1][4]. Lock decisions before cutover.

---

## Appendix A — Wave runbook template (copy per wave)

| When | Action | Owner | Done |
|---|---|---|---|
| T−7d | Lock content freeze; final crawl + baseline exports archived to repo (`/docs/baselines/<site>/`) | SEO | ☐ |
| T−7d | Redirect map complete, reviewed, committed; preview redirect test 100% pass | Dev | ☐ |
| T−5d | Parity audit (preview vs. baseline crawl) signed off: titles/meta/H1/canonical/schema/hreflang | SEO | ☐ |
| T−5d | Forms + WhatsApp + conversion tags verified on preview (test lead received) | Ops | ☐ |
| T−3d | Ads final-URL cross-check complete; any needed URL edits drafted in Ads Editor (not pushed) | Ads | ☐ |
| T−2d | Cloudflare zone diff vs. exported zone (MX/TXT/SPF/DKIM present); TTL lowered to 300s | Dev | ☐ |
| T−1d | Go/no-go: all above green; team availability for T+0..T+2 confirmed; rollback steps printed | Lead | ☐ |
| T+0 | DNS flip → SSL issued → smoke tests (§5 items 2–4) | Dev | ☐ |
| T+0 | Live redirect script 100% pass; test lead through every form; GA4 realtime firing | Ops | ☐ |
| T+0 | New sitemap submitted in GSC; homepage + top pages Request Indexing | SEO | ☐ |
| T+0 | Ads Editor batch pushed (if URLs changed); disapproval check at +2h | Ads | ☐ |
| T+1d | Day-1 checks (§6): GSC Pages, Vercel 404 log, leads vs. baseline, Ads policy manager | All | ☐ |
| T+2..7d | Daily Week-1 checks (§6); patch 404 stragglers same day | SEO | ☐ |
| T+7d | Wave retro: variance vs. baseline recorded in LEARNINGS.md; TTL back to 3600s; next wave go/no-go | Lead | ☐ |

**Go/no-go rule:** any red item at T−1d slips the site to the next wave. Never launch a partially-verified site to keep a calendar date — the calendar is cheaper than the traffic.

---

## Appendix B — Exact reports, commands, and monitoring stack

**GSC reports used in this playbook (per property):**

- `Performance → Search results` — filter Pages/Queries; compare date ranges; export baselines and post-launch deltas.
- `Indexing → Pages` — watch: Not found (404), Soft 404, Page with redirect, Excluded by 'noindex' tag, Duplicate without user-selected canonical.
- `Indexing → Sitemaps` — old + new sitemap status; "URL redirects" warnings on the old one are expected during transition [1].
- `Settings → Crawl stats` — crawl-rate spike, host status, response codes seen by Googlebot.
- `Links` — top linked pages (pre-migration backlink inventory cross-check).
- `URL Inspection` — spot-check live URL: indexed canonical, last crawl, mobile rendering.
- `Removals` — emergency-only, for leaked staging URLs (§2).

**Redirect verification one-liner (run against preview, then live):**

```bash
# urls.txt = one old URL per line from the inventory
while read -r u; do
  code=$(curl -s -o /dev/null -w "%{http_code} %{url_effective}" -L --max-redirs 5 "$u")
  echo "$u -> $code"
done < urls.txt | tee redirect-audit-$(date +%F).log | grep -Ev ' (200) ' || echo "ALL PASS"
```

Assert: final status 200, ≤1 hop, destination matches the map. Also spot-check headers: `curl -sI <old-url>` must show `301` or `308` (not `302`/`307`) on the first hop [1][16].

**Noindex launch check (must return nothing on production):**

```bash
curl -sI https://<domain>/ | grep -i 'x-robots'
curl -s https://<domain>/ | grep -io '<meta[^>]*noindex[^>]*>'
```

**Monitoring cadence summary:**

| Window | Cadence | What |
|---|---|---|
| T+0 to T+48h | Hourly → every few hours | Vercel 404/500 logs, form deliveries, GA4 realtime, Ads disapprovals |
| Week 1 | Daily | GSC Pages + Performance, rank tracker (top 20 terms), lead tally, 404 log |
| Weeks 2–4 | 2–3×/week | GSC Performance vs. baseline, index-shift progress, CWV |
| Months 2–12 | Monthly | Redirect log (still hit? keep ≥1 year [1]), backlink targets still 200, old sitemap retirement |

**Shopify-assisted sales note:** product/affiliate links out to Shopify are ordinary outbound links — verify every "Buy"/store CTA on the new templates points at the live Shopify URLs (not staging store previews), and that UTM parameters survive so assisted-sale attribution doesn't silently vanish from reports.

---

## 10. Source list

1. Google Search Central — Site moves with URL changes: https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
2. Google Search Console Help — Change of Address tool: https://support.google.com/webmasters/answer/9370220
3. Google Search Central — Redirects and Google Search: https://developers.google.com/search/docs/crawling-indexing/301-redirects
4. Search Engine Journal — Mueller on how to implement major site changes (stagger, keep it trackable): https://www.searchenginejournal.com/google-advises-redesign-impact-on-seo/375492/
5. Search Engine Roundtable — Google: split up a site revamp if you can: https://www.seroundtable.com/google-split-web-site-revamp-29827.html
6. SEOParity — WordPress migration checklist (47 points; parity-audit data): https://seoparity.com/resources/wordpress-migration-checklist
7. Dashweb — Migrating WordPress to Next.js: SEO wins and fails (schema loss/CTR drop, indexed staging, parity auditing): https://dashweb.agency/posts/migrating-wordpress-to-nextjs-seo-story
8. Totally Digital — SEO migration failures: real traffic-decline case studies: https://totally.digital/insights/seo-migration-failures-examples-of-traffic-declines-from-ignoring-seo/
9. Google Ads Policy — Destination requirements: https://support.google.com/adspolicy/answer/6368661
10. Google Ads Policy — Destination mismatch: https://support.google.com/adspolicy/answer/16428020
11. Google Ads Policy — Destination not accessible: https://support.google.com/adspolicy/answer/16428223
12. CanvasBlu — Google Ads "learning phase" vs. "silent learning phase": https://www.canvasblu.com/Update/Details/52/google-ads-learning-phase-vs-silent-learning-phase
13. International Webmastery — Hreflang & website migrations: https://internationalwebmastery.com/blog/hreflang-website-migrations-seo-guide/
14. seoClarity — A professional SEO's guide to international site migration: https://www.seoclarity.net/blog/international-site-migration-guide
15. Polemic Digital — Protect your staging environments: https://www.polemicdigital.com/protect-your-staging-environments
16. Next.js docs — `redirects` in next.config: https://nextjs.org/docs/app/api-reference/config/next-config-js/redirects
17. vercel/next.js discussion — 308 redirects & trailingSlash reasoning: https://github.com/vercel/next.js/discussions/15432
18. Google Search Central — Spam policies (scaled content abuse, site reputation abuse): https://developers.google.com/search/docs/essentials/spam-policies
19. Skittle Digital — Six common hreflang mistakes and fixes: https://www.skittledigital.com/international-seo-hreflang-mistakes-fix/
20. Lifesight — How to change a landing page in Google Ads safely: https://learn.lifesight.io/how-to/change-landing-page-in-google-ads/
21. OnCrawl — International website migrations: challenges and solutions: https://www.oncrawl.com/technical-seo/international-website-migrations-challenges-solutions/

---

*v1.0 — compiled 2026-07-13. Review before each wave; update §6 thresholds with observed baseline variance after Wave 0.*
