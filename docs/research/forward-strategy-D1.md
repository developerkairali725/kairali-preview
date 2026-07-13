# D1 — Forward-Domain Strategy Research & Decision

**2026-07-13 18:54:37 IST · agent research per D1 delegation (DECISIONS.md 2026-07-13 18:28:44 IST)**
**Question:** ~35 surplus domains (Runbook §2D forward farm) must forward somewhere. Semantic map (each variant 301s to nearest-topic live site, Runbook recommendation) vs literal all→one domain. Which is Google-compliant and best-ROI?

---

## 1 · Findings (2024–2026 sources)

### 1.1 Google official guidance

- **301/308 permanent redirects are the sanctioned mechanism and lose no PageRank.** Google's redirects documentation treats a permanent redirect as "a signal that the redirect target should be canonical"; the redirected domain becomes an *alternate name* of the canonical URL. Server-side 301/308 preferred over meta-refresh/JS.
  — https://developers.google.com/search/docs/crawling-indexing/301-redirects
- **No chains.** Googlebot follows up to 10 hops but Google says redirect to the final destination directly; keep chains ideally ≤3. Keep redirects live **at least one year** (site-move guidance; in practice: forever for owned variants).
  — https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
- **Redirect-everything-to-homepage is a named bad practice.** John Mueller: when all old URLs 301 to one homepage regardless of what they were about, Google loses the signals and treats the redirects like soft-404s — i.e. it *ignores* them. Redirects should map to the closest equivalent content.
  — https://www.seroundtable.com/google-redirect-urls-home-26270.html
- **March 2024 spam policies (expired domain abuse).** Google now explicitly targets using a domain's past reputation to prop up unrelated content. Practitioner reading of enforcement since: 301s from old/parked domains remain defensible **only where source and destination are topically aligned**; redirecting an unrelated domain "just to pass authority" is the targeted pattern.
  — https://developers.google.com/search/blog/2024/03/core-update-spam-policies
  — https://www.dynadot.com/blog/expired-domains-google-spam-update
- **Keyword-rich/exact-match domains carry no ranking bonus and can look spammy.** Mueller (2024–25): generic keyword domains ("bestplumbernyc.com"-style) signal manipulation to users and algorithms; brands should not expect SEO value from them. Holding them defensively and forwarding them is fine; *building* on them, or expecting rankings from them, is not.
  — https://www.searchenginejournal.com/googles-john-mueller-cautions-against-keyword-rich-domains/479777/

### 1.2 Practitioner consensus (industry blogs, enterprise domain-governance guides)

- Unanimous baseline: **defensive/variant domains should 301 to the canonical host** — concentrates whatever equity exists, keeps crawling and analytics coherent, prevents duplicate-content splits from accidentally resolving parked domains.
  — https://venue.cloud/news/insights/taming-enterprise-domains-governance-redirects-dns-for-seo-security-m-a
  — https://www.dchost.com/blog/en/pointing-multiple-domains-to-one-website-301-redirects-canonicals-and-parked-domain-seo/
  — https://www.namesilo.com/blog/en/domain-names/how-to-point-multiple-domains-to-one-website-the-right-way
- Same guides: prefer the **relevant landing page/site**, not a generic homepage dump ("Prefer 301 redirects to the primary domain's relevant landing page").
- Realistic ROI expectation: owned typo/variant domains carry little link equity; their real value is **type-in traffic capture, brand protection, and preventing squatting** — the redirect preserves that at near-zero cost. Any inherited backlinks are a bonus that only transfers when the target is topically equivalent (per 1.1).
- Risk assessment for *our* case: these are **our own long-held brand variants**, not purchased expired domains — the expired-domain-abuse policy pattern (buying reputation) does not apply. There is **no known penalty for many owned domains 301ing into one property**; the realistic downside of all→one is not a penalty but **wasted signals** (Google soft-404s the mismatched ones) and lost user intent (someone typing keralatraining.* lands on a group corporate homepage instead of the training site).

### 1.3 Google Ads implications

- **Destination-mismatch policy:** a final URL that redirects to a *different domain* is a disapproval trigger (limited exceptions with prior approval arriving June 2026). Therefore **no forwarded domain may ever be used as an Ads final URL or display URL** — Ads always point directly at the live canonical site (`/lp/<campaign>` lane per Runbook §3).
  — https://support.google.com/adspolicy/answer/6368661
  — https://support.google.com/adspolicy/answer/16428020
  — https://www.seroundtable.com/google-ads-destination-mismatch-41554.html
- Keyword insertion into display-URL domains is separately banned — another reason the keyword domains have no paid-media use.
- Semantic forwarding is Ads-neutral and Ads-safe: forwards only ever serve organic/type-in traffic.

### 1.4 What forwarding will NOT do (expectation-setting for Abilash)

- It will **not** make the target sites rank for the keywords in the forwarded domains (EMD bonus is long dead — 1.1).
- Most of the ~35 domains have negligible backlink profiles; measurable SEO lift will be small. The wins are: type-in traffic kept, brand surface defended, estate consolidated to one Cloudflare control plane, zero duplicate-content risk.

---

## 2 · DECISION

**Adopt the semantic map (Runbook §2D recommendation): every surplus domain 301s, via Cloudflare Bulk Redirects, to the topically nearest LIVE Kairali property — never all→one.**

**Rationale:** Google's own guidance and 2024–2026 practitioner consensus align on every axis tested. 301 consolidation of owned brand variants is explicitly sanctioned and penalty-free; the only pattern Google punishes or ignores is *topic-mismatched* redirecting — which is exactly what all→one would mass-produce (soft-404-style ignored redirects, wasted type-in intent). Semantic forwarding preserves the little equity and the real type-in traffic these domains hold, costs the same one Cloudflare afternoon, and creates zero Ads exposure. All→one has no offsetting benefit.

---

## 3 · Implementation rules (binding for the Day 2–3 forward farm)

1. **301 only.** Permanent, server-side (Cloudflare edge). Never 302/307, never meta-refresh, never JS. Redirects stay live indefinitely (minimum 1 year is Google's floor; ours don't expire).
2. **No chains.** Every source domain points **directly** at the final canonical URL of its target site (the https, correct-host, trailing-slash-canonical form). When a target site later changes canonical URL, update the bulk-redirect list — never stack a redirect on a redirect.
3. **Per-family semantic mapping** (nearest-topic live site; families per Runbook §2D):
   - centers/centre family (kairalicentre/centres/center .com/.in, keralacenters/centre/centres .com/.in, healthspacenter(s).com) → **kairalicenters.com**
   - training/education family (keralatraining, kairalitraining, traininginayurveda, keralaayurvedainstitute, kairaliayurvedainstitute) → **kairali.guru**
   - product/pharma variants (kairalioils, kairaliequipments, kairaliorganics, kairalipharma, keralaequipments, keralaherbals, keralapharma, keralatowels, kairaliproducts.com) → the matching Wave-1 product microsite (kairalioil.com, kairaliequipment.com, kairaliorganic.com, …); where no product site exists → **kairaliproducts.in**
   - whyayurveda(.com/.in/.org) → **whatisayurveda.com** (canonical per D2)
   - raag family (casaraag, raagcasa, raagvilla, theraagvilla) → **villaraag.com**
   - KTAHV names (ktahv.com, kairalivillage.com) → **ayurvedichealingvillage.com**
   - arogya variants (arogyakendra.co.in, arogyashala.co.in) → **arogyakendra.com** / **arogyashala.in**
   - houseofayurveda.in, kairali.co.in, and anything with no closer topical home → **kairali.com**
   - aayurvedafranchise → kairalifranchise.com **only if D4 = merge** (else hold).
4. **Domain-level default = target site's homepage; path passthrough only where meaningful.** These are variant *domains* (not migrated sites with URL inventories), so `variant.tld/*` → target homepage is the correct one-hop mapping; where a variant historically mirrored a live structure, map those known paths 1:1 instead (Mueller: closest equivalent content).
5. **Cloudflare Bulk Redirects, one account-level list, CSV-maintained in-repo.** The mapping CSV lives in this repo (single source of truth), is reviewed before upload, and every change is committed. Preserve query strings on passthrough.
6. **A forwarded domain never appears in Google Ads** (final URL, display URL, or tracking template) and never hosts content, MX-independent email pointers excepted.
7. **Verification pass after go-live:** curl every source domain (http+https, apex+www) → assert single-hop 301 → correct target → 200. Evidence file to `audits/forward-farm-<date>.md`.
8. **Timing guard:** a family's forward flips only when its target site is LIVE. Until then the domain stays parked/held — never 301 to a coming-soon page (soft-404 risk). Interim forwards for not-yet-built targets go to the nearest live parent (e.g. kairali.com) and are re-pointed at launch — each re-point edits the list (rule 2), never chains.

**DNS/Cloudflare execution is a HUMAN action (Abilash/Ambuj flip) — this document prepares; it does not push.**
