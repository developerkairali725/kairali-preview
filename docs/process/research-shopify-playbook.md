# TRACK B — THE SHOPIFY PLAYBOOK

*Version 1.1 · 2026-07-15 19:12:40 IST (v1.0: 2026-07-15 18:03:46 IST) · Track owner: agent · Gate approver: Abilash · Admin execution: human (Vikash/Abilash)*
*Parent: `docs/process/MASTER_PIPELINE.md` · Sibling: `docs/process/research-audience-and-psychology.md` (Stage 2). Governed by CLAUDE.md Shopify Track Doctrine (j–s).*

> **⚠️ v1.1 — READ FIRST. This document caught itself producing the exact failure it was written to prevent.**
> v1.0 asserted a Shopify filter-URL deadline (24 Apr 2026), called it a **live P0 revenue leak**, and escalated it to Abilash. **Re-verification against the primary source found the changelog says the opposite** — *"all former storefront filter URLs you have created will continue to work as expected"*, with no sunset date anywhere. The deadline traces to one blogger whose only cited source is that changelog. **The P0 is withdrawn (§1.3, §9.6); the cheap empirical check survives (B0.1); the post-mortem is §7.1a and is the most useful page here.**
> **If v1.0's P0 reached Abilash or any brief, it requires an explicit correction.** Nothing else in v1.0 was found false: Baymard's figures, the review-snippet myth correction, the canonical behaviour, and the filter model all re-verified clean (§7.2, verified list).

**What this document is.** The Shopify expression of Abilash's stage order. Same nine stages as the organic track, but on a platform that (a) forbids us the admin, (b) hard-codes its own URLs, and (c) keeps half the "build" in a database we cannot version-control. This document says what each stage *means* when those three things are true, labels every step, and specifies the machine evidence that proves the step ran.

**The one-line thesis.** *On Shopify, the sitemap stage is the whole game — because Shopify takes URL design away from you, the only architecture you still control is the taxonomy, and the taxonomy is decided at the sitemap stage by a human in an admin we cannot touch.* Everything downstream is consequence.

---

## 0. PUSHBACK — four defects in the brief's framing of this track

Per the pushback duty (CLAUDE.md, Operating Principles), filed **before** execution.

### Defect 1 — "build = theme in git" is only half true, and the missing half is the half that matters

The brief maps Abilash's build stage to "theme in git". That is right about *code* and wrong about *the store*. A Shopify storefront is two substrates:

| Substrate | Lives in | Version-controlled? | Who can change it |
|---|---|---|---|
| Theme code (Liquid, JS, CSS, sections, `robots.txt.liquid`) | git ↔ Shopify GitHub integration | **Yes** | agent (via PR) |
| Catalog & config (products, collections, tags, metafield *definitions*, filters, navigation, policies, redirects, prices) | Shopify's database | **No** | **humans only** (doctrine j/k) |

Shopify's own docs are explicit that the sync is bidirectional and non-optional: *"Files are updated in GitHub whenever changes are made to a connected theme. This can't be disabled"* ([shopify.dev — GitHub integration](https://shopify.dev/docs/storefronts/themes/tools/github)). So git is not even the sole source of truth for the half it does hold — a human editing the theme in admin **writes a commit into our repo**, and in a conflict *"the Shopify version overwrites the code editor version"* without alerting the code editor.

**Consequence for doctrine (j).** Doctrine (j) already says the live admin overrides the docs. That is correct and this document does not weaken it. But it must be extended: **for Track B, `origin/main` is NOT the state-of-truth** — it is the state-of-truth *for theme code only*. The catalog/config truth is the admin, readable via the Admin API. Our BRIEFS & STATE-TRUTH rule ("state-of-truth is ALWAYS `origin/main`") is an organic-track rule and silently mis-fires here. **This is an escalation, not a decision I can take** (§9.1).

### Defect 2 — "sitemap" on Shopify is a homonym, and conflating the two senses will cost us

Abilash's step 6 says CREATE SITE MAPS. On Shopify there are two objects with that name and **we control exactly one of them**:

- **The XML sitemap** (`/sitemap.xml`): auto-generated, split into products/collections/pages/blogs, and **not editable**. You cannot add URLs, set priorities, or exclude a URL by editing it.
- **The IA sitemap** (which collections exist, what each PDP is, how they nest, what is indexable): entirely ours to design — and it is *the* deliverable of the stage.

The trap is an agent "doing the sitemap step" by looking at `/sitemap.xml`, finding it already exists and is complete, and marking the step green. That is a step that reports success while doing nothing. **Step B4 is the IA sitemap. Reading `/sitemap.xml` is evidence-gathering for B4, never the output of B4.**

(The one lever we do have on XML sitemap membership is the `seo.hidden` metafield: set it to `1` to *"hide the page, blog post, or product from sitemaps, search engines, and your online store search"* — [Shopify Help](https://help.shopify.com/en/manual/promoting-marketing/seo/hide-a-page-from-search-engines). Note its limit, from the same page: a `seo.hidden` product **still appears in storefront collections and recommendations**; only the `Unlisted` product status removes it from those.)

### Defect 3 — "AEO should technically be the FIRST" is right, but it is not a stage

Abilash's standing ruling is that AEO comes first. On Shopify I want to *strengthen* this and *relocate* it. AEO on a store is not a content technique bolted on late; it is three concrete properties, and all three are decided at **B4 (sitemap/taxonomy)**:

1. whether products sit in Shopify's **Standard Product Taxonomy** (which unlocks category metafields that are machine-readable into Google Shopping and AI agents by default);
2. whether attributes live in **metafields** (typed, structured) or **tags** (flat strings);
3. whether **Product/Offer** structured data is complete on every PDP.

So AEO does not get its own stage — it gets a **veto at B4**. That is a stronger position than "first", because "first" is a step you can pass and then forget, whereas a veto at the architecture stage cannot be un-passed later. **Abilash's intent is preserved and hardened, not diluted.**

### Defect 4 — the brief inherits a research gap it should not paper over

The brief asks for r/shopify and r/ecommerce practitioner voice. **I could not get it.** `WebFetch` on `reddit.com` is blocked in this environment (`Claude Code is unable to fetch from www.reddit.com`), and four `site:reddit.com` searches returned zero links. What surfaced instead was a wall of agency SEO blogs — several visibly AI-generated — recycling each other.

I am **not** going to launder those into practitioner consensus. §8 records this as an open gap with a named remedy. This is the same discipline the DataForSEO incident should have had: *the absence of data is a finding, not a licence to invent.*

---

## 1. THE PLATFORM CONSTRAINTS — what Shopify actually forces (the hard floor)

Everything in this document sits on these. Each is cited to a primary source, because agency blogs get several of them wrong.

### 1.1 URL structure is not yours

Prefixes are hard-coded. You can change the **handle** (`/products/ashwagandha-tablets` → the `ashwagandha-tablets` part). You cannot change `/products/`, `/collections/`, `/pages/`, `/blogs/`; you cannot nest (`/herbs/ashwagandha/tablets` is impossible); you cannot put a product at root. Confirmed across [Vervaunt](https://vervaunt.com/changing-url-structure-in-shopify-shopify-plus-whats-possible-workarounds), [LOGEIX](https://logeix.com/shopify-seo/url-structure), [NotProvided.eu](https://www.notprovided.eu/shopify-seo-challenges-platform-architecture-limitations-and-workarounds/). The only escape is headless (Hydrogen/Oxygen) — a different, larger decision, out of scope here.

**Implication for B4:** the IA hierarchy you design will *not* be visible in the URL. It must be expressed through **internal linking and breadcrumbs instead**. This is why Aleyda Solis's internal-linking rules (§2.2) do more work on Shopify than on any other platform — links are the only place your hierarchy exists.

### 1.2 The collection-path duplicate: real, but over-sold

Shopify can serve a product at both `/products/x` and `/collections/y/products/x`. The agency-blog framing is that this is a catastrophic duplicate-content bug. **It is not** — Shopify sets the canonical on the collection-scoped URL to the clean `/products/` URL automatically. The residual issue is genuine but smaller: **inconsistent internal linking** splits crawl signals and wastes crawl budget when themes link products through the collection path.

**Where I refuse to follow the sources:** [get-ryze.ai](https://www.get-ryze.ai/blog/shopify-canonical-url-fixes-5-patterns-stores-get-wrong) and peers claim *"25–45% organic traffic increases within 60–90 days"* and *"recover 30-45% of lost rankings"* from fixing this. Those numbers are vendor marketing for a product that sells the fix, with no methodology, sample, or control. **Marked UNVERIFIED. They do not enter any report to Abilash.** (See §7.2 — this is DataForSEO-class number laundering, and the lint must catch it.)

**The defensible action, which costs nothing:** make theme templates, menus, related-product blocks, and blog links emit `/products/<handle>` (in Liquid: `product.url` unscoped, not `product.url | within: collection`). That is a real, cheap, git-side fix with a machine check (§7.3, lint `B-L4`).

### 1.3 Filters are query parameters — and a widely-repeated "deadline" that **the primary source contradicts** ⚠️

Shopify's filter model is `filter.<scope>.<attribute>[.<attribute_scope>]=value`, scope `p` (product) or `v` (variant), max 25 filters, **AND between attributes / OR within one** — all four re-verified against the primary doc on 2026-07-15 ([shopify.dev — storefront filtering](https://shopify.dev/docs/storefronts/themes/navigation-search/filtering/storefront-filtering)).

**What is VERIFIED (T2, primary).** Per [Shopify's changelog](https://changelog.shopify.com/posts/storefront-filter-urls-now-use-stable-identifiers-instead-of-text-values), from **16 March 2026** filter URLs for filter *groups* (product options, defined-value metafields) use a stable GID instead of the text value:

```
old:  ?filter.v.option.color=Blue
new:  ?filter.v.option.color=gid://shopify/FilterSettingGroup/123
```

Shopify's stated reason: *"stable identifiers make links with filters more reliable across languages and when filter labels are renamed."* Unaffected: price, availability, tag, product_type, vendor, free-text metafields.

**What is DISPUTED, and what v1.0 of this document got wrong.** v1.0 asserted that backward compatibility "was **temporary and ended 24 April 2026**", that the deadline "passed 12 weeks ago", and escalated a **P0 live revenue leak** on that basis. **On re-verification, the primary source says the opposite.** The changelog was fetched twice on 2026-07-15, the second time interrogating specifically for `"April 24" / "transition period" / "deprecat" / "sunset" / "temporary" / "stop working"`. Result: **zero matches**, and this closing sentence verbatim —

> *"Please note that all former storefront filter URLs you have created will continue to work as expected."*

[shopify.dev's filtering doc](https://shopify.dev/docs/storefronts/themes/navigation-search/filtering/storefront-filtering) likewise documents **no** deprecation timeline, transition period, or sunset date.

The 24 April 2026 deadline traces to **exactly one source**: [Pavel Ungr](https://www.pavelungr.com/shopify-change-filter-url-april-2026/) (*"tomorrow, April 24, 2026, the transition period ends"* → published ~23 Apr 2026), who claims old URLs then return **200 OK showing the unfiltered collection** with **no 301s**. His article cites **no evidence beyond the same Shopify changelog that says the opposite**.

**Why this nearly became our own DataForSEO incident — the citation looked *stronger* than it was.** v1.0 wrote *"Independently documented by Pavel Ungr"*. He is not independent corroboration of the deadline; he is the **sole origin** of it, and his stated source contradicts him. A search-summary echo also repeated the deadline back — but search summaries synthesise from indexed pages *including his*, so that echo is **circular, not confirmation**. That is precisely the logged failure mode *"handing a fact-checking auditor an artifact pre-annotated with our own conclusions, then treating its echo as independent verification."*

**Live possibilities, none of which we may assume away:** (i) Shopify communicated the deadline off-changelog (merchant email//dev digest) and Ungr saw it; (ii) the changelog was edited after his post; (iii) he inferred a sunset that was never announced. **We cannot distinguish these from here, and the difference does not change what we do.**

> **Status: DISPUTED — NOT a confirmed P0. It may not be reported to Abilash as fact, in either direction.**
> **The check survives; only its certainty and severity change.** Asserting that a filter URL with ad spend behind it actually filters is *cheap*, and the failure mode (200 OK, unfiltered) is genuinely invisible to status-code crawls **whether or not a deadline ever existed**. So B0.1 still runs first — reclassified from *"P0, confirmed leak, escalate same day"* to **"cheap empirical test that also settles the dispute."** One `curl` against our own store resolves in minutes what no amount of blog-reading can: **if old-format URLs still filter, Ungr is wrong and the changelog is right; if they don't, we have a real incident and evidence to escalate.** Our own store is a T1 source and outranks both (§7.2).

**The lesson this document must eat itself:** §7.1 nominated the 200-OK filter URL as "the purest specimen" of plausible-silently-wrong. It was more right than it knew — **the specimen was the claim, not the URL.** Well-formatted, precisely dated, confidently cited, alarming, and unsupported by its own primary source. It survived into a deliverable and would have driven a same-day P0 escalation to the Director. It was caught by the one habit that catches this class: **fetching the primary source instead of trusting the citation.**

### 1.4 `robots.txt` IS editable — via `robots.txt.liquid`, in git

The single most useful and least-known constraint, and it lands on *our* side of the line. `robots.txt.liquid` is a **theme file**, so it is in the repo, it goes through PR review, and it is one of the very few SEO-architectural levers the agent can actually pull. You can add rules to a group, remove a default rule, add custom rules and sitemaps, and vary by host for Shopify Markets ([shopify.dev — robots.txt.liquid](https://shopify.dev/docs/storefronts/themes/seo/robots-txt)).

Its limits, from the same page: only the `robots`, `group`, `rule`, `user_agent`, `sitemap`, `request` objects are permitted — no arbitrary Liquid — and Shopify warns that *"The default rules are updated regularly to ensure that SEO best practices are always applied"*, i.e. **do not replace the defaults with a static block**; add to them.

**⚠️ Kairali-specific:** CLAUDE.md Hard Gate 3 says never touch robots.txt without asking. On Track B, robots.txt is a theme file that a routine theme PR could touch. **Gate 3 therefore binds Track B PRs**: any diff touching `robots.txt.liquid` requires explicit Abilash approval, no exceptions, even though it looks like ordinary theme code. Lint `B-L6`.

### 1.5 The GitHub integration is bidirectional, and one action is irreversible

One branch ↔ one theme; published and unpublished themes both connect; a connected unpublished theme keeps its branch when published ([shopify.dev — GitHub integration](https://shopify.dev/docs/storefronts/themes/tools/github)). This is what makes "stage = preview theme" cheap and real (§4, B7).

Two hazards from the same doc: writeback cannot be disabled (Defect 1), and — *"You can't reconnect a branch to a theme after it has been disconnected."* **Disconnecting a branch is irreversible.** It therefore joins the Shopify FOREVER-HUMAN list (doctrine k), which currently does not name it. §9.2.

### 1.6 Store policies: Shopify generates them, Shopify disclaims them

Six policy types are supported — return, privacy, terms of service, shipping, legal notice, subscription — auto-linked in the checkout footer, with the return policy on order review and the shipping policy surfaced on product pages and cart, addressable at `/policies/<handle>` ([Shopify Help](https://help.shopify.com/en/manual/checkout-settings/refund-privacy-tos)).

Shopify's own words: *"Although Shopify can generate templates, you're responsible for following your published policies."* For a regulated Ayurvedic catalogue, a generated template is a liability with our name on it (§6).

---

## 2. THE CANON — named practitioners, and where they disagree

### 2.1 Baymard Institute — the CRO floor (200,000+ hours of testing; not opinion)

The gold standard the brief names, and it earns it. From [Product Page UX Best Practices](https://baymard.com/blog/current-state-ecommerce-product-page-ux) (30,000+ manually-reviewed usability scores across 155+ benchmarked sites):

- Only **48% desktop / 38% mobile** of sites reach "decent or good" product page UX. **52% / 62%** are "mediocre or worse". *The bar for beating most competitors is low; the bar for being world-class is Baymard's own list.*
- **67% of sites** fail to show shipping cost estimates on the product page.
- **44%** don't show or link the return policy on the product page.
- **81%** selling multi-quantity products omit price-per-unit.
- **37%** lack in-scale images (product against a recognisable reference).
- **89%** don't respond to negative reviews. **63%** block browsing reviewer images across reviews.

From [E-Commerce Product Lists & Filtering](https://baymard.com/research/ecommerce-product-lists) (25 rounds of testing, 4,400+ sessions, 334 sites benchmarked; 83 guidelines across 10 areas): sites with mediocre product-list usability saw **67–90% abandonment**; optimised toolsets **17–33%** — the average site needs **35 design changes**, and **36%** have flaws severe enough to actively block product-finding.

And the number that governs §6 and the whole PDP: across 50 studies the documented average cart abandonment rate is **70.22%**, and among non-browsers the top reason is **39% "extra costs too high (shipping, tax, fees)"**, followed by 21% slow delivery, 19% payment distrust, 19% forced account creation, 18% long checkout ([Baymard — cart abandonment](https://baymard.com/lists/cart-abandonment-rate); the 48%-of-US-adults figure via [eMarketer](https://www.emarketer.com/content/extra-costs-are-the-top-reason-consumers-abandon-online-carts)).

> **The Baymard synthesis for our PDP:** the top abandonment cause is a *late cost surprise*, and 67% of sites cause it by hiding shipping until checkout. **Disclosing shipping cost and return policy on the PDP is simultaneously the #1 CRO fix, an Indian/EU consumer-law duty, a `shippingDetails`/`hasMerchantReturnPolicy` schema requirement (§2.4), and an AEO input.** Four gates, one action. It is the highest-leverage element on the page and it goes in the B5 brief as mandatory.

### 2.2 Aleyda Solis — indexation as **Demand × Supply** (the framework that maps to Abilash's step 11)

From [Critical & Common E-commerce SEO Issues](https://www.aleydasolis.com/en/search-engine-optimization/ecommerce-seo-issues-how-to-fix/), the specific method — not generic advice:

- **Indexation is a Demand (search volume) × Supply (product count) test.** Index a facet/sub-category only if it clears both thresholds. She names blanket rules — "noindex everything past the second facet level" — as a *defect*, because facets often target queries better than individual products do.
- **Every product must sit in at least one indexable category > sub-category > facet path**, and those links must use **canonical URLs**, not parameter-tracked ones.
- **Thin category content** confuses intent: add consideration-stage content (USPs, real support questions, usage guidance) **blended with the products**, not a generic slab at the bottom, and never so long it buries commercial intent ([also: Optimizing Content in Category Pages](https://www.aleydasolis.com/en/search-engine-optimization/optimizing-content-in-category-pages-while-keeping-its-commercial-nature/)).
- **Internal-link priority scoring:** assign each page a priority from search volume / product count, then link proportionally.
- **Out-of-stock is a state machine, not an error** — hold 200 OK; temporary OOS → keep indexed, restock alert, update schema, reduce category linking; superseded → 301 to the new product; discontinued with traffic/links → 301 to parent category; discontinued without → **410**, and strip internal links and the feed entry.

Her "Demand × Supply" is precisely Abilash's **"WILL IT SELL?"** applied to a URL. Same question, same position in the order (before the architecture is frozen), arrived at independently. That convergence is why B4 is gated on it.

### 2.3 Google vs Aleyda on facets — a real disagreement, and who is right *for us*

**Google** ([Crawling & managing faceted navigation](https://developers.google.com/search/docs/crawling-indexing/crawling-managing-faceted-navigation)): prevent crawling of faceted URLs unless indexing is essential; **robots.txt disallow is the primary recommendation** (`disallow: /*?*color=` etc.); `rel=canonical` is *"generally less effective in the long term"*; `rel=nofollow` is *"generally less effective"* and only works if **every** anchor to that URL carries it. If facets *are* crawled: use `&` as separator, keep filter order consistent, and **return 404 when a combination has no results**.

**Aleyda:** do *not* blanket-block; block-by-default destroys facets that clear Demand × Supply and often out-target the products.

**Both are right, for different catalogues, and this is the adjudication for KAPPL:**

> Aleyda's exception earns its complexity on a catalogue with thousands of SKUs, where `/collections/boots?color=black&material=leather` has thousands of products behind it and real standalone demand. **KAPPL is an Ayurvedic manufacturer with a catalogue in the dozens.** A facet combination over dozens of SKUs will essentially never clear a Supply threshold — most will return 1–3 products or zero. **Therefore for our store, Google's simpler rule wins: disallow filter parameters in `robots.txt.liquid`; carry genuine demand as a real, hand-built, merchandised *collection* with its own copy — not as a filter URL.**
>
> This is not a rejection of Aleyda; it is her own framework returning a different answer on our inputs. And it re-derives Defect 3: **demand becomes a collection, i.e. a sitemap object.**
>
> **Trigger to revisit:** if the catalogue exceeds ~500 SKUs, or if any single facet clears both thresholds, B4 re-runs the test rather than inheriting this ruling. *(Ruling by agent, pending Abilash — §9.3.)*

### 2.4 Structured data — and the myth that has to die

**Merchant listing requirements** ([Google](https://developers.google.com/search/docs/appearance/structured-data/merchant-listing)) — *required*: `Product.name`, `Product.image`, `Product.offers`; `Offer.price` (**must be > 0**) and `Offer.priceCurrency` (ISO 4217). *Recommended*: `availability`, `shippingDetails`, `hasMerchantReturnPolicy`, `itemCondition`, `priceValidUntil`, `url`, plus `aggregateRating`, `brand.name`, `description`, `review`. Only pages where a shopper can actually purchase qualify. Return policies and loyalty programs nest under **Organization**.

**The myth.** Multiple agency blogs assert that Google bans reviews on your own site, so PDPs must not carry `aggregateRating`. **That is a misreading and it is expensive** — it would strip a Baymard-critical trust element and a recommended merchant-listing property from every PDP we own. Google's actual text ([review snippet policy](https://developers.google.com/search/docs/appearance/structured-data/review-snippet)) scopes the ban precisely:

> *"If the entity that's being reviewed controls the reviews about itself, their pages that use `LocalBusiness` or any other type of `Organization` structured data are ineligible for star review feature."*

The ban is on **self-serving reviews about the `LocalBusiness`/`Organization` entity**. **Product** reviews collected from real customers on your own PDP are allowed and recommended. What *is* banned, and binds us: **don't aggregate reviews from other sites**, **ratings must be sourced directly from users**, and **don't have human editors create/curate/compile ratings**.

**Kairali reading:** PDP `Product.aggregateRating` from genuine verified-buyer reviews — **allowed, do it**. Star markup on a Kairali `Organization`/`LocalBusiness` page from testimonials we control — **not allowed, never ship it**. Importing Amazon/marketplace reviews into PDP schema — **banned**. Staff-written or staff-curated ratings — **banned** (and separately a §6 compliance offence).

### 2.5 Theme performance — signal vs vendor noise

Credible and mechanically true: Online Store 2.0 renders per-section, so a template only loads the sections on that URL; the dominant real-world costs are **apps, pixels, popups, review widgets, chat widgets and third-party scripts** — swapping themes without auditing apps moves little ([DebugBear](https://www.debugbear.com/blog/shopify-speed-optimization), [Clyro](https://www.clyro.com/blog/shopify-theme-performance)). Use lab tools (Lighthouse) to debug and **RUM/Web Performance Dashboard** to judge; a lab pass can coexist with real-user failure.

The frequently-quoted *"20–40 Lighthouse point"* OS 2.0 gain and *"Dawn scores 95+"* are vendor/agency figures without published method — **UNVERIFIED, directionally plausible, not quotable to Abilash**. Our own Lighthouse run against our own preview theme is the only number that enters a report (B7).

**Note the collision with doctrine (k):** app install/removal is FOREVER-HUMAN. So the largest performance lever on Track B **is not ours to pull**. The agent's job is to *measure and evidence* the app cost and hand a ranked, quantified removal list to the human. That is a deliverable, not an excuse.

### 2.6 AEO/GEO — where the evidence actually is, and where it is being sold to us

The credible, mechanical part sits inside primary sources already cited: Shopify's **Standard Product Taxonomy** unlocks category metafields that are machine-readable into Google Shopping/Meta by default ([Blink](https://blinkseo.co.uk/blogs/news/metafields-vs-tags-a-shopify-taxonomy-guide), [Shopify Help — smart collections with metafields](https://help.shopify.com/en/manual/custom-data/metafields/smart-collections)); complete Product/Offer markup is what a machine reads (§2.4). **That is AEO on a store.** It is taxonomy + schema + feed, and it is all decided at B4.

The rest of the AEO/GEO literature I surfaced is vendor content marketing: *"752% YoY surge in AI referrals"*, *"ChatGPT ecommerce traffic converts 31% higher"* ([Yotpo](https://www.yotpo.com/blog/ecommerce-aeo/), [ALM Corp](https://almcorp.com/blog/aeo-geo-playbook-retail-ai-search-2026/), [Stackmatix](https://www.stackmatix.com/blog/aeo-for-ecommerce)) — no sample, no method, no control, published by firms selling AEO tooling. **UNVERIFIED. Barred from reports.** Abilash's AEO ruling is implemented at B4 through taxonomy and schema, which are verifiable, not through these numbers, which are not.

---

## 3. ABILASH'S STAGES → WHAT THEY MEAN ON SHOPIFY

The brief's mapping, corrected by §0–§2. **Bold = changed from the brief's framing.**

| # | Stage | On the organic track | **On Shopify (Track B)** | Substrate | Who executes |
|---|---|---|---|---|---|
| B0 | **Mine** | live-site inventory | **Live admin + storefront inventory; API read; filter-URL breakage check (§1.3); app/script cost census** | admin (read) | agent |
| B1 | Plan | brief | Commercial frame: which SKUs, which markets, PDP-URL freeze list (doctrine m) | git | agent |
| B2 | Audience | dossier | **Unchanged — Stage 2 doc governs.** Buyer ≠ patient: register is product-pharma, not clinical | git | agent |
| B3 | Keywords | keyword map | Keywords **from** B2 language; India needs Hindi/Devanagari/Hinglish (§7.1) | git | agent |
| B4 | **SITEMAP** | URL tree | **Collection taxonomy + PDP set + tags-vs-metafields + indexation (Demand×Supply) + Standard Product Taxonomy + AEO veto.** NOT `/sitemap.xml` (§0 Defect 2) | **spec in git → admin by human** | agent specs, human executes |
| B5 | Content | page briefs | PDP + collection copy briefs; **compliance gate (§6) is a hard pre-condition, not a review** | git | content-geo-writer |
| B6 | Build | Next.js | **Theme code in git** (`robots.txt.liquid`, schema, templates, links) — half the store (§0 Defect 1) | git | agent (PR) |
| B7 | Stage | Vercel preview | **Unpublished theme on a branch** (§1.5) + Lighthouse + design-qa + seo-aeo-geo-auditor | git ↔ theme | agent |
| B8 | Publish | human DNS flip | **HUMAN publishes theme** (doctrine k). Agent prepares; agent never clicks | admin | **human only** |
| B9 | Maintain | weekly QA | catalog lint Mondays (doctrine l) + catalog-compliance (p) + filter-URL regression + app-cost drift | both | agent → human |

**The structural finding, stated plainly:** B4 is the only stage whose output the agent cannot execute. We specify the taxonomy; a human types it in. Therefore **the B4 deliverable is not a decision — it is an executable spec** (§5), precise enough that a human can apply it without judgement calls, and diff-able afterwards so we can *prove* what was applied. A vague B4 is not a slow B4; it is a B4 that silently didn't happen.

---

## 4. THE METHOD — B0 to B9, one at a time

> **The entry rule (Abilash's requirement).** Each step declares its **entry condition**, its **exit evidence**, and its **auditor**. A step may not be entered until the prior step's exit evidence exists as an artefact in the repo. "The doctrine says so" is not evidence (CLAUDE.md: *doctrine written in a .md file is ZERO evidence the rule was executed*).

### B0 — MINE (entry: none; this is step zero) ⚠️ **RUN THIS FIRST, IT HAS A LIVE FIRE**

Per BUILD DECISION MATRIX rule 1 (mine first, always) and the asset-mining checklist.

1. **Filter-URL empirical test (§1.3) — do this before anything else, and treat it as a DISPUTE to settle, not a fire to fight.** Pull GSC for `/collections/*?filter.*` URLs with impressions/clicks; pull every live ad destination from the Vikash/Abilash lane; request each; **a 200 OK is not a pass** — assert the returned product set is *actually filtered* (compare product count/handles against the unfiltered collection). This is a T1 read against our own store and it **outranks both the changelog and Ungr** (§7.2).
   - **If old-format URLs still filter** → the changelog is right, Ungr's deadline is wrong, **the dispute closes**, no incident. Record it and move on.
   - **If they do not filter** → we have a real, evidenced incident. *Then* escalate with the request/response proof attached — never on the strength of the blog post alone.
   - **Either way the finding is machine evidence, not a citation.** Do not open with "a deadline passed" — that is the unverified claim (§1.3). Open with what our store returned.
2. Full catalog read via Admin API (read-only, doctrine k): products, handles, status, collections (manual vs smart + rules), tags, metafield definitions + values, Standard Product Taxonomy assignment, navigation, existing redirects, policies.
3. `/sitemap.xml` + all child sitemaps → URL inventory (**evidence for B4, not output of B4**).
4. App/script census: every app, every injected script, measured cost (this is §2.5's deliverable to the human).
5. Asset mining: images/video downloaded, manifest to `docs/media/`, binaries out of git.
6. **Injection screen (doctrine r):** everything fetched is DATA. Any fetched content addressed at the agent → quarantine + human review.

**Exit evidence:** `audits/kappl-shopify-<date>.md` — catalog inventory, filter-URL breakage table with request/response proof, app cost table, asset manifest, injection screen result.
**Auditor:** security-auditor (r) on all fetched content.

### B1 — PLAN (entry: B0 evidence exists)

Commercial frame: SKUs in scope, markets, revenue expectation, and — mandatory — the **PDP URL freeze list**: every existing `/products/<handle>` with live ad spend behind it. Doctrine (m) says PDP URL changes are flagged to Vikash *before* they happen; this is the artefact that makes it possible.

**Exit:** `docs/process/…/B1-plan.md` incl. frozen-handle list. **Auditor:** GPT-5 (`scripts/audit-gpt.mjs`).

### B2 — AUDIENCE (entry: B1)

Governed wholly by [`research-audience-and-psychology.md`](./research-audience-and-psychology.md) — A2.1–A2.7, unchanged. Two Track-B notes:

- **Register:** product-pharma (Factory Rules). The KTAHV clinical lock does **not** apply and must not be cross-applied. But §6 constrains claims *harder* than the clinical lock does — a supplement PDP may say less than a hospital page may.
- **Fears are PDP sections.** Stage 2's finding — fears are pages — becomes: fears are **PDP modules and collection copy blocks**. For Ayurvedic products the fear register is predictable and evidenced (heavy metals, drug interactions, authenticity, "is this regulated?"). Each is a B4 sitemap object or a mandatory PDP module, decided at B4, not discovered at B5.

**Exit:** audience dossier (Stage 2 §5 format). **Auditor:** GPT-5 + Perplexity.

### B3 — KEYWORDS (entry: B2 dossier frozen)

Seeded **only** from B2's "THEIR LANGUAGE" section. The DataForSEO guardrails (§7.1) bind absolutely: no invented compound seeds, no summed zeros, India pulled in Hindi/Devanagari/Hinglish as well as English.

**Exit:** keyword map with per-term provenance + auditor pass. **Auditor:** GPT-5 + **Perplexity fact-grounding on every volume figure**.

### B4 — **SITEMAP** (entry: B3) ⚠️ **THE STAGE THAT DECIDES THE STORE**

Six sub-steps, in order.

**B4.1 — Collection taxonomy.** Every collection: handle, manual vs smart (+ exact rules), the demand it serves, its copy brief, its parent in the *conceptual* hierarchy (which URLs cannot express — §1.1), and its indexation verdict. Collections mirror **how customers shop**, not internal inventory.

**B4.2 — Tags vs metafields (the AEO decision).** The rule from the sources, and it is a good one: *if an attribute defines what the product **IS** → metafield; if it defines how you are currently **SELLING** it → tag* ([Blink](https://blinkseo.co.uk/blogs/news/metafields-vs-tags-a-shopify-taxonomy-guide), [Mark Gono](https://markgono.com/blog/tags-vs-metafields/)). Tags are flat strings and collide across meanings ("red" = colour and = clearance); metafields are typed and machine-readable. Tags must be prefixed (`color-pink`, never `pink`) ([Shopify Help](https://help.shopify.com/en/manual/custom-data/metafields/smart-collections)).

For Kairali specifically, these are **metafields, never tags**: dosha, classical text reference, botanical/Latin name, Ayurvedic Pharmacopoeia reference, dosage, contraindications, AYUSH licence number, FSSAI licence number, bioactive source (plant/animal — §6). These are *what the product is*, they are what an AI agent must read, and — decisively — several are **regulatory disclosures that must be structured and auditable**, which a flat tag can never be.

**B4.3 — Standard Product Taxonomy assignment.** Assign every product; take the category metafields Shopify unlocks. This is the AEO baseline (§2.6) and it is nearly free.

**B4.4 — Indexation (Demand × Supply).** Run Aleyda's test on every collection and facet. Per the §2.3 adjudication: facets → `robots.txt.liquid` disallow; real demand → a hand-built merchandised collection. Every product must have ≥1 indexable canonical path (§2.2). Record the verdict and the numbers **per URL**.

**B4.5 — Protection map (BUILD DECISION MATRIX rule 2).** Every legacy URL gets an explicit fate: KEEP / MERGE-into-X / 301-to-exact-single-hop-X. Never redirect a content-rich ranking page to a thin target; never bulk-redirect to the homepage. OOS/discontinued follow Aleyda's state machine (§2.2), **410 included** — a discontinued no-traffic SKU is a 410, not a 301, and not a live page. Redirects import as a two-column CSV (`Redirect from`, `Redirect to`) — **prepared by agent, imported by human**.

**B4.6 — AEO veto (§0 Defect 3).** B4 does not exit unless: every product has a Standard Taxonomy category; every regulated attribute is a typed metafield; every PDP in the plan carries complete Product/Offer (§2.4); shipping + returns are structured, not prose.

**Exit evidence:** `B4-sitemap-spec.md` — the executable spec (§5). **Auditor:** GPT-5 **and** Perplexity **and** seo-aeo-geo-auditor. **Gate: Abilash.** *B4 is the stage where being slow is cheapest and being wrong is most expensive. It gets the most auditing.*

### B5 — CONTENT (entry: B4 approved by Abilash)

Briefs → drafts via **content-geo-writer only** (doctrine o; its compliance gate is mandatory). PDP anatomy is Baymard-driven and non-negotiable (§2.1): in-scale imagery; shipping cost **on the page**; returns **on the page**; price-per-unit where multi-quantity; button-style variant selectors, not dropdowns; real reviews with image browsing; negative reviews answered.

**§6 is a pre-condition, not a review.** A claim that cannot be substantiated is not written and then caught — it never enters the draft.

**Exit:** drafts + compliance gate PASS + substantiation dossier (§6.4). **Auditor:** content-geo-writer gate + GPT-5 + **Perplexity on every factual/health claim**.

### B6 — BUILD (entry: B5 passed)

Theme code, in git, by PR (§0 Defect 1 — this is *half* the store; B4's spec is the other half and a human executes it).

Scope: templates/sections; **canonical-path internal linking** (§1.2); `robots.txt.liquid` (§1.4 — **Gate 3 applies, Abilash approval required**); Product/Offer/breadcrumb JSON-LD (§2.4); `seo.hidden` handling; performance hygiene. **Never** a cart, checkout, or payment form (Factory Rules) — checkout is Shopify's.

**Exit:** merged PR + green CI + `/security-review` pass (doctrine e) + code-review stage (h). **Auditor:** code-review + security-auditor pre-PR (s).

### B7 — STAGE (entry: B6 merged)

Unpublished theme connected to the branch (§1.5). Then, **in parallel** (doctrine n): **design-qa** and **seo-aeo-geo-auditor**, both PASS/FAIL, both attached as evidence. Plus: Lighthouse on our own preview (the only speed number that may be quoted — §2.5); Rich Results test on real PDP/collection URLs; filter-URL regression (§1.3); mobile viewport; policy links resolve.

**Exit:** preview theme URL that opens + both reports + Lighthouse output pasted in full (PROOF-OF-WORK RULES).
**Auditor:** design-qa ∥ seo-aeo-geo-auditor ∥ GPT-5 full-matrix re-walk.

### B8 — PUBLISH (entry: B7 all green + Abilash approval) — **HUMAN**

Publishing a theme is FOREVER-HUMAN (doctrine k). Agent prepares the publish pack (what changes, PDP URL diff vs the B1 freeze list, redirect CSV, rollback = previous theme kept unpublished, Vikash ad-destination notice per doctrine m). **Agent does not click.** Then post-publish QA fetch: live URLs, diff vs intent, show the diff (PROOF-OF-WORK).

### B9 — MAINTAIN (entry: B8 done)

Mondays, alongside wiki lint: **catalog lint** (`scripts/shopify-catalog-lint.mjs`, doctrine l) + **catalog-compliance** (p) — findings route to the engineer, **never auto-fix** (doctrine l is explicit). Add to the Monday pass: filter-URL regression (§1.3 will recur — Shopify ships breaking changes), app/script cost drift (§2.5), schema validity on a PDP sample, `/policies/*` reachability, Search Console coverage delta, and **the full matrix re-walk before any ship claim**.

Every change is logged by the logger sub-agent via the PostToolUse hook into `agent-log.jsonl` + `wiki/log.md` (doctrine q) — no separate changelogs.

---

## 5. THE DELIVERABLE — `B4-sitemap-spec.md` (the executable spec)

Because a human executes B4 (§3), the spec must be typed-in-able and diff-able. Format:

```
## 1. COLLECTIONS
   handle | title | manual|smart(+exact rules) | demand(kw, vol, source, date)
          | supply(SKU count) | INDEX|NOINDEX(+why) | parent(conceptual) | copy brief ref

## 2. PRODUCTS
   handle | title | Standard Taxonomy category | collections | canonical path
          | state(live|preorder|OOS-temp|superseded|discontinued) → action per §2.2
          | ⚠️ HANDLE FROZEN? (B1 ad-spend list — doctrine m)

## 3. METAFIELD DEFINITIONS      ← the AEO + compliance layer
   namespace.key | type | applies to | required? | REGULATORY? (§6) | AEO surface | source of value

## 4. TAGS
   prefixed tag | merchandising purpose | why NOT a metafield  ← must justify against B4.2

## 5. FILTERS
   filter | scope(p|v) | DOES IT ACTUALLY FILTER? (tested, product-set asserted, date)
          | robots.txt disposition

## 6. INDEXATION LEDGER          ← Demand × Supply, per URL, with numbers and provenance

## 7. PROTECTION MAP             ← every legacy URL: KEEP | MERGE→x | 301→x | 410

## 8. REDIRECT CSV               ← two columns exactly; agent prepares, human imports

## 9. AEO VETO CHECKLIST         ← B4.6, each item PASS/FAIL with evidence

## 10. GAPS & UNKNOWNS           ← what we could NOT evidence. Never empty by default.

## 11. PROVENANCE                ← sources, dates, API pulls, injection screen result
```

**Post-execution diff is mandatory.** After the human applies it, the agent re-reads the admin via API and diffs applied-vs-spec. Doctrine (j): the live admin overrides the docs — so the docs get corrected to match reality, never the reverse. *Un-diffed execution is an unverified claim* (doctrine f).

---

## 6. THE COMPLIANCE MODULE — Ayurvedic products are regulated speech

**This is the section that can cost the company money rather than rankings.** Kairali is KAPPL: WHO-GMP Ayurvedic manufacturing, selling into India and abroad. Every jurisdiction we ship to regulates what a PDP may *say*.

### 6.1 India — the hard floor

**Drugs and Magic Remedies (Objectionable Advertisements) Act, 1954** ([full text — India Code](https://www.indiacode.nic.in/bitstream/123456789/1412/1/195421.pdf); [overview](https://en.wikipedia.org/wiki/Drugs_and_Magic_Remedies_(Objectionable_Advertisements)_Act,_1954)). It prohibits advertising a drug or remedy as curing/diagnosing/preventing any condition in its Schedule (**54 conditions**, incl. cancer, diabetes, heart disease, TB, obesity, paralysis, sexual impotence, menstrual disorders, insanity, leprosy), and separately bans claims about inducing miscarriage, preventing conception, or improving sexual pleasure. **It is a cognizable offence.** It binds Ayurveda: §3 was amended to route ASU-drug guidance through the Technical Advisory Board under §33C of the Drugs and Cosmetics Act, 1940.

**A PDP is an advertisement.** Every word of copy, every meta description, every collection description, every review we choose to surface, every schema `description`.

**FSSAI** (Health Supplements/Nutraceuticals Regulations 2016, amended through 2025 — [compendium PDF](https://www.fssai.gov.in/upload/uploadfiles/files/Compendium_Nutra_29_09_2021.pdf)): labels **must not** claim to prevent, treat or cure disease. Supplements may make general claims ("supports immunity"); nutraceuticals may make specific functional claims ("supports liver function") **only with scientific substantiation**. Required: FSSAI licence number, ingredients by common name, daily recommended usage, dates, storage, allergens, **bioactive source (plant/animal)**, and **"NOT FOR MEDICINAL USE"** where applicable. Regulation 16 (2022) requires botanicals be sourced from the Indian Pharmacopoeia, Ayurvedic Pharmacopoeia or recognised compendia — **Ayurvedic herbs are not automatically approved**.

**ASCI / AYUSH:** ASCI has monitored AYUSH advertising under a 2017 MoU with the Ministry; all claims must be capable of substantiation. Post-*IMA v. Patanjali*, the Supreme Court's **7 May 2024** order imposed a **self-declaration regime for advertisements**, with emphasis on vulnerable groups ([AZB](https://www.azbpartners.com/bank/the-patanjali-journey-supreme-courts-expanding-scrutiny-on-advertising-compliance-for-cosmetics/), [Lexology](https://www.lexology.com/library/detail.aspx?g=41334f4a-bb85-4658-b7dc-c34d0f9d11e2)). **The enforcement climate for Ayurvedic advertising in India in 2026 is the most hostile it has ever been, and the cautionary tale is our own sector's biggest brand.**

### 6.2 USA — FTC (and the disclaimer that doesn't save you)

**FTC Health Products Compliance Guidance, Dec 2022** ([FTC](https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance) · [PDF](https://www.ftc.gov/system/files/ftc_gov/pdf/Health-Products-Compliance-Guidance.pdf)), replacing the 1998 supplement guide and now covering all health-related products. Health claims need **competent and reliable scientific evidence**, generally **randomised, controlled human clinical testing** by relevant experts.

Two findings that kill common patterns:

- **The DSHEA disclaimer does not launder a deceptive ad.** *"Inclusion of a DSHEA disclaimer or similar disclosure will not cure an otherwise deceptive ad."* DSHEA has **no effect on the FTC Act** ([Covington](https://www.cov.com/en/news-and-insights/insights/2023/01/ftc-issues-new-guidance-on-health-related-claims-to-replace-the-dietary-supplements-advertising-guide), [Cooley](https://www.cooley.com/news/insight/2023/2023-03-02-ftc-revises-health-products-compliance-guidance)). **You cannot make a disease claim and then footnote your way out.**
- **Hedging words are read as *positive* claims.** Consumers read "promising", "preliminary", "initial", "pilot" as product attributes, not caveats — especially when the study is touted. So *"promising early research suggests X may help with Y"* is, to the FTC, a claim that X helps with Y — needing full substantiation. **This is exactly the sentence an LLM writes when asked to be careful about a health claim.** It is the single most likely compliance defect our own pipeline will generate, and B5's gate must target it specifically.

*(Note the contested edge: [Kelley Drye](https://www.kelleydrye.com/viewpoints/blogs/ad-law-access/misguided-the-ftc-attempts-to-redefine-the-law-with-its-health-products-compliance-guidance) argues the FTC overreached its statutory authority in this guidance. Industry-side counsel may be right on the law — **and it is irrelevant to us**: the FTC enforces against the guidance regardless, and we are not the party who should be financing that test case.)*

### 6.3 Distribution channel — Google Merchant Center

If the store feeds Shopping, Google's policy is an additional filter ([Healthcare & medicines](https://support.google.com/merchants/answer/6150151), [Unapproved pharmaceuticals and supplements](https://support.google.com/merchants/answer/6165956)): no herbal/dietary supplements with active pharmaceutical or dangerous ingredients; no false or misleading health claims; **no non-government-approved or non-prescription product marketed as safe or effective for preventing/curing/treating a disease or ailment**; some healthcare content needs country preauthorisation, and where no certification path exists for a country, **it cannot be promoted there at all**.

**This is the tightest of the three.** A claim can be legal in India, legal-ish under FTC, and still get the whole Merchant Center account suspended — which takes the ad channel down, which is Vikash's lane and real revenue. **Merchant Center policy is therefore the binding constraint on PDP copy, not the loosest.**

### 6.4 The Kairali claim rules (binding, B5 pre-condition)

1. **No Schedule-J/1954-Act condition may appear as a benefit claim anywhere on the store** — copy, meta, collection text, schema, alt text, or a surfaced review. Grep-able. Lint `B-L1`.
2. **Every health claim carries a substantiation reference** in the substantiation dossier before it is drafted — citation, study type, whether it is RCT-grade human evidence. No dossier entry → **the claim is not written**. Not "flagged": not written.
3. **Hedged claims are claims** (§6.2). "May help", "promising research suggests", "traditionally used to treat <Schedule condition>" — all treated as full claims requiring full substantiation. Lint `B-L2` greps the hedge list.
4. **"Traditionally used in Ayurveda for…" is not a safe harbour.** It is a claim with a costume on. It gets the same test.
5. **Required disclosures are metafields, not prose** (B4.2): FSSAI licence, AYUSH licence, bioactive source, dosage, contraindications, "NOT FOR MEDICINAL USE" where applicable. Structured = auditable = machine-checkable = AEO-visible. Four wins, one decision.
6. **Reviews are regulated speech too.** A customer review claiming a Schedule-condition cure, surfaced by us, is our advertisement. Review moderation is a compliance function, not a marketing one. And per §2.4 we may not curate ratings — so moderation must remove policy-violating content **without shaping the rating**. *(This is genuinely tricky and needs Dr. Deepu John + counsel — §9.4.)*
7. **Clinical sign-off:** any therapeutic-adjacent claim needs Dr. Deepu John before staging→production (Hard Gate 7). *Dr. Deepu John = chief physician. Deepu = web developer. Never conflated.*
8. **Jurisdiction = strictest applicable.** If the store ships to India + US + EU, copy satisfies the tightest rule (usually Merchant Center, §6.3), not the average.

> **The uncomfortable synthesis.** §2.1 says the PDP converts on trust, proof, and answering fear. §6 says the most persuasive sentences are the illegal ones. **The resolution is not to be vague — vague fails Baymard *and* §6.2's hedge trap.** It is to be **specific about things we can prove**: WHO-GMP manufacturing, the NABH hospital behind the brand, Ayurvedic Pharmacopoeia sourcing, heavy-metal testing, the actual licence numbers, 60 years of practice. *We answer the fear register (§4/B2) with verifiable institutional facts instead of unverifiable health claims.* Kairali's real assets are legal to state and rare in this category. **That is the position — and it is a better one than our competitors', because most of them cannot make it.**

---

## 7. VALIDATION — how we prove this instead of hallucinating it

### 7.1 The design test case — DataForSEO, replayed on Shopify

The failure to make impossible: invented compound seeds ("turmeric curcumin") understating turmeric 11× and amla 25×; implausible zeros summed into cluster totals; India pulled English-only; reported to the Director as fact.

Its Track B twins, and the step that must catch each:

| Track B analogue | Caught at | Mechanism |
|---|---|---|
| Invented metafield/tag names not in the actual admin | B0 → B4 | every name in the spec must trace to an API read or be marked NEW |
| Zero/near-zero facet demand summed into a "collection opportunity" | B4.4 | Demand × Supply, per-URL, with provenance; **a 0 is a finding, not an input** |
| India catalogue keywords pulled English-only | B3 | Hindi/Devanagari/Hinglish mandatory (identical rule to the organic track) |
| **Old-format filter URLs returning 200 OK with unfiltered results** | **B0.1** | **assert the product set, never the status code** |
| Vendor stats ("752% AI referral surge", "25–45% traffic lift") quoted to Abilash | B5/B9 | §7.2 tiering; vendor-sourced numbers barred |
| "We fixed collection-path linking" claimed from one template | B6 | grep ALL templates, ALL locales (PROOF-OF-WORK: fixing one instance ≠ done) |
| **A single blog's dated "deadline" escalated to the Director as a confirmed P0** | **§1.3 / v1.1** | **fetch the PRIMARY source; "independently documented" must mean a second origin, not a second page** |

### 7.1a THE SPECIMEN THIS DOCUMENT PRODUCED ITSELF — read this before trusting any citation here

**v1.0 of this file failed its own test, and the failure is instructive enough to keep on the record rather than quietly edit away.**

It asserted a Shopify filter-URL deadline (24 Apr 2026) that **the cited primary source explicitly contradicts** (*"all former storefront filter URLs you have created will continue to work as expected"*), called it *"the live hazard in this document"*, computed that it *"passed 12 weeks ago"*, and raised a **same-day P0 escalation to Abilash** on it. Every ingredient of the DataForSEO incident was present:

| DataForSEO incident | v1.0 §1.3 |
|---|---|
| Invented compound seeds *looked* like real keywords | An invented deadline *looked* like a real changelog fact |
| Plausible, well-formatted numbers | Plausible, precisely-dated claim with a code block |
| Reported to the Director as fact | Escalated to the Director as a P0 |
| Zeros summed without asking if a 0 is believable | A sunset asserted without asking if the source said it |
| Caught by GPT-5, after the fact | Caught by re-fetching the primary source, before it shipped |

**Three transferable rules, earned rather than theorised:**

1. **"Independently documented by X" is a claim requiring proof.** v1.0 wrote it about a source whose *only* evidence was the document it contradicted. **Independence means a second ORIGIN, not a second URL.** Before writing "independently", name what the second source *saw*.
2. **A search-summary echo is not corroboration.** It synthesises the indexed pages — including the one you are trying to check. Getting your claim back is **circularity**, the logged pre-annotation failure wearing a new hat.
3. **Alarming claims deserve MORE scrutiny, not less — and they reliably get less.** A P0 creates urgency; urgency suppresses verification; the claim rides the alarm past the gate. **The scariest number in any report is the one most likely to be unchecked.** Invert the instinct: *the more alarming, the harder the primary-source check, before it is spoken aloud.*

**The generalised lesson, which is the actual point of this document:** *the DataForSEO error was not a data error. It was a **plausibility** error — numbers that looked right, in a format that looked authoritative, unchecked against reality.* Every analogue above has the same shape: **plausible, well-formatted, silently wrong.** v1.0 nominated the 200-OK filter URL as the purest specimen because it is *literally a success response for a failure* — and then produced a better specimen by believing a blog about it. This is why B0 asserts the product set, why §7.2 ranks our own store above every blog, and why **every gate here demands the artefact rather than the claim — including the claims in this file.**

### 7.2 Source tiering (which numbers may reach Abilash)

| Tier | Source | May be quoted? |
|---|---|---|
| **T1** | Our own machine evidence: API reads, Lighthouse on our preview, crawls, GSC | **Yes — preferred** |
| **T2** | Platform primary docs: shopify.dev, Shopify Help, Shopify changelog, Google Search Central, Merchant Center, FTC, FSSAI, India Code | **Yes** |
| **T3** | Named research with published method: **Baymard**; named practitioners with specific method: **Aleyda Solis**, **Kevin Indig**, **DebugBear**, **Pavel Ungr** | **Yes, attributed — but see the T3 caveat below** |
| **T4** | Real practitioner discussion (r/shopify, r/ecommerce, r/bigseo) | Yes, as *signal*, attributed — **⚠️ we currently have none (§8.1)** |
| **T5** | Vendor/agency blogs with unmethoded stats, esp. selling the fix | **NO. Never quoted. Not to Abilash, not in a report, not as a hedge.** |

Every T5 stat I encountered is named and quarantined in §2.2, §2.5, §2.6 rather than deleted — so a future agent re-encountering them knows they were assessed and rejected, and doesn't relitigate.

> **⚠️ The T3 caveat, added in v1.1 and paid for in §7.1a.** *Tier is a property of the CLAIM, not of the author.* A T3 practitioner is trustworthy **where they show their method** and drops to T5 **where they assert a bare fact sourced to a primary doc that does not contain it**. Pavel Ungr's *mechanism* (no 301s; old filter URLs would return 200 OK unfiltered; which filter types are affected) is precise, expert, and worth acting on. His **deadline is T5** — contradicted by the primary source, corroborated by nobody. v1.0 imported the deadline on the credibility of the mechanism.
>
> **The operational rule: never inherit a T2 fact through a T3 summary.** If a practitioner attributes a fact to shopify.dev, Google, or the FTC, **fetch that page**. Their reading is a hypothesis; the primary doc is the evidence. This applies to every citation in this document — *including the ones I verified, which are marked as verified precisely so the next agent knows which ones I actually opened.*
>
> **Verified by direct primary fetch on 2026-07-15:** filter model/25-cap/AND-OR logic (shopify.dev); filter GID change + *"will continue to work as expected"* (changelog); review-snippet ban scoped to `LocalBusiness`/`Organization` (Google); Baymard 70.22% across 50 studies + 39% extra costs / 21 / 19 / 19 / 18 (Baymard); Shopify auto-canonicalises collection-scoped product URLs to `/products/` (corroborated, multi-source). **Not re-verified in v1.1 and still carrying v1.0's trust:** the §6 regulatory citations (§8.3 already flags their shelf life), `robots.txt.liquid` limits, `seo.hidden` behaviour, GitHub-integration irreversibility. **Treat the unverified list as unverified** (doctrine f).

### 7.3 Lint rules (mechanical, not judgement) → `scripts/shopify-catalog-lint.mjs`

| ID | Rule | Fails when |
|---|---|---|
| `B-L1` | Schedule-condition scan (§6.4.1) | any 1954-Act Schedule condition appears as benefit claim in copy/meta/schema/alt/review |
| `B-L2` | Hedge-word scan (§6.2) | "may help", "promising", "preliminary", "traditionally used to treat", etc. without a dossier entry |
| `B-L3` | Substantiation coverage | a health claim with no dossier reference |
| `B-L4` | Canonical internal linking (§1.2) | any template emits `/collections/*/products/*` |
| `B-L5` | Filter-URL **function**, not format (§1.3) | a filter URL that is linked, advertised, or indexed **does not actually filter** (assert the product set vs the unfiltered collection — never the status code, never the syntax alone). *v1.1: was "uses pre-24-Apr-2026 syntax", which encoded a disputed deadline into a lint. A lint must test **behaviour we can observe**, not a date we could not verify.* |
| `B-L6` | **Gate 3 tripwire** (§1.4) | a PR diff touches `robots.txt.liquid` without recorded Abilash approval |
| `B-L7` | Schema completeness (§2.4) | PDP missing name/image/offers/price>0/priceCurrency; or `aggregateRating` on `Organization`/`LocalBusiness` |
| `B-L8` | Required disclosure metafields (§6.4.5) | product missing FSSAI/AYUSH/source/dosage metafields |
| `B-L9` | Standard Taxonomy coverage (B4.3) | any product without a category assignment |
| `B-L10` | Orphan / indexable-path (§2.2) | a product with no indexable canonical category path |
| `B-L11` | T5 stat leak (§7.2) | a vendor-blog statistic appears in any report or brief |
| `B-L12` | Spec drift (§5) | admin state diverges from `B4-sitemap-spec.md` without a DECISIONS entry |
| `B-L13` | **Harness tag leakage** (v1.1) | any generated `.md` contains stray tool-call XML (`invoke`/`content`/`parameter` closing tags). *v1.0 of this very file shipped with them. Trivial to catch, trivially missed.* |
| `B-L14` | **Unsourced date/deadline** (§7.1a) | a report asserts a dated platform deadline, deprecation, or sunset whose primary source was not fetched and quoted. *The §1.3 class. If it is alarming and dated, it must carry a primary-source quote or the word DISPUTED.* |

Per doctrine (l): findings route to the engineer, **never auto-fix**. Per doctrine (g): **a failing lint is never fixed by weakening it.**

### 7.4 Auditors

- **GPT-5** (`scripts/audit-gpt.mjs`) — strict-JSON, exit 2 on FAIL, gates CI. Runs at **every** step exit.
- **Perplexity** (fact-grounding, live search + citations) — mandatory on B3 (every volume figure), B5 (every health claim), and **all of §6** (regulation changes; this document's legal citations have a shelf life).
- **design-qa ∥ seo-aeo-geo-auditor** — parallel, both attached, after every build/visual change (doctrine n).
- **security-auditor** — injection screen on all fetched content (r), pre-PR posture (s).
- **Checker pass** (doctrine f) — every step: re-read the instruction, diff claim vs machine evidence, **list anything unverified as unverified**.

---

## 8. GAPS & UNKNOWNS — what this document could not evidence

*Never empty by default. Stating these is the doctrine working, not the doctrine failing.*

### 8.1 ⚠️ No practitioner-community evidence (the brief's explicit ask — UNMET)

Abilash asked specifically for what practitioners say on Reddit. **This document contains none**, and the T4 tier above is empty. Cause: `WebFetch` on reddit.com is blocked in this environment; four `site:reddit.com` queries returned zero links. What returned instead was agency SEO content, much of it apparently AI-generated, recycling the same claims.

**I did not substitute agency blogs for practitioner consensus.** The T3 practitioners here (Baymard, Aleyda Solis, Pavel Ungr, Kevin Indig, DebugBear) are the strongest evidence I could actually obtain, and they are strong — but they are not the r/shopify operator voice that was requested.

**v1.1 — gap independently reproduced, cause upgraded from "blocked" to structural.** Re-attempted on 2026-07-15 via a different route (`WebSearch` with `allowed_domains: [reddit.com]`) and got a hard refusal at the crawler level, verbatim:

> `API Error: 400 The following domains are not accessible to our user agent: ['reddit.com']`

An unrestricted keyword search for the same r/shopify discussion returned **zero links**. So this is **not a transient fetch failure and not a query-craft problem** — Reddit is inaccessible to this agent by design ([Anthropic — crawler/blocking policy](https://support.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)). **No amount of retrying from inside a session will fix it; the remedy must come from outside.**

**Partial substitute attempted, and honestly reported as weak.** [Shopify Community](https://community.shopify.com/c/technical-q-a/seo-problem-filter-in-collection-pages-creates-it-s-own-url-how/m-p/2568971) *is* fetchable and *is* operator voice. But the top answer on filtered-collection URLs asserts they *"won't [be] indexed in search engine because it is not permanent URL"* — **which is simply wrong**, and contradicted by Google's own faceted-navigation guidance (§2.3), the entire existence of which presumes facets get crawled and indexed. **I am recording it as a negative finding, not laundering it into T4.** It is a useful calibration: *community voice is a signal about what operators believe and do — it is not an authority on what the platform does.* Mining it will require separating operator *experience* (valuable, unobtainable elsewhere) from operator *theory* (frequently wrong, and cheaper to check against T2).

**Remedy (needs a decision — §9.5):** route via Perplexity (can search Reddit and cite — and it is already being onboarded as our fact-grounding auditor, so this is nearly free); or have a human pull threads into `docs/kappl-inputs/`. Until then **§2's practitioner layer is authority-based, not community-based, and this document says so rather than pretending otherwise.**

**And a v1.1 note on why this gap matters *less* than it looked.** The brief wanted practitioner voice as a corrective to generic blog filler. §7.1a is evidence that the real corrective was never the *tier* of the source — it was **fetching the primary document**. A T4 Reddit thread asserting the April deadline would have been *equally wrong* and rather more persuasive. **Practitioner voice is worth having for sequencing, war stories, and what actually breaks in production; it is not a substitute for the primary source, and it must not be treated as one when we get it.**

### 8.2 The store's actual state is unknown to this document

Written without an Admin API read. Every §1 constraint is platform-general and cited; **nothing here is a claim about our store**. Catalogue size, collections, tags, metafields, apps, filter-URL exposure, ad destinations — all unknown until B0. **In particular, §2.3's ruling (block facets, catalogue is small) is an assumption from "KAPPL is a manufacturer with dozens of SKUs" and must be re-tested against the real SKU count at B4.4.** If I am wrong about catalogue size, Aleyda's exception may apply and the ruling flips.

### 8.3 Legal content has a shelf life and I am not counsel

§6 is researched, cited, and **not legal advice**. The Patanjali line is moving; FSSAI amends regularly; Merchant Center policy changes without notice. §6 needs Perplexity re-grounding before every launch and human counsel before any aggressive claim. **The 1954 Act's Schedule is the stable floor; everything above it moves.**

### 8.4 Shopify ships breaking changes — and we cannot reliably tell breakage from rumour without our own store

The March 2026 filter-URL change is real and is not an anomaly: **a store on Shopify is a store on someone else's roadmap.** B9 must actively watch [changelog.shopify.com](https://changelog.shopify.com/), because a status-code lint cannot see a 200-OK regression.

**But §1.3/§7.1a sharpen this gap.** The changelog is necessary and **not sufficient**: it did not state the sunset Ungr reports, so either Shopify communicates breaking changes off-changelog (→ watching the changelog alone is insufficient) **or** a credible practitioner published a deadline that does not exist (→ practitioner alerts need primary-source confirmation before they drive action). **We do not currently know which, and both have a remedy in the same direction: the authoritative signal is our own storefront, tested.** Platform-watch produces *hypotheses*; only B0.1-style assertions produce *facts*. Budget B9 accordingly — a synthetic check that asserts a filter's product set, running weekly, beats any amount of changelog reading.

### 8.5 Untested: whether a human can execute a B4 spec cleanly

§5's whole design rests on "precise enough that a human executes it without judgement calls." **That has never been tried here.** First run should be small (one collection tree), diffed hard, and the format revised from what actually went wrong.

---

## 9. ESCALATIONS FOR ABILASH

Per ESCALATION and the UNATTENDED RULE — these go to QUESTIONS.md; work continues.

1. **§0 Defect 1 — state-of-truth.** "State-of-truth is ALWAYS `origin/main`" is an organic-track rule that mis-fires on Track B, where catalog/config truth lives in the admin. Proposal: amend BRIEFS & STATE-TRUTH to *"`origin/main` for code; the live admin (via API read) for catalog/config — doctrine (j)."* **Needs a ruling.**
2. **§1.5 — FOREVER-HUMAN list.** Doctrine (k) does not name *disconnecting a GitHub branch from a theme*, which Shopify documents as irreversible. Proposal: add it. **Needs a ruling.**
3. **§2.3 — facet indexation ruling.** Agent's adjudication (Google's rule over Aleyda's exception, on catalogue-size grounds) with a revisit trigger at ~500 SKUs. **Needs ratification, and re-testing at B4.4 against the real SKU count (§8.2).**
4. **§6.4.6 — review moderation.** Removing policy-violating reviews without shaping the rating (Google bans curated ratings; India bans the claims). Needs Dr. Deepu John + counsel. **Genuinely unresolved.**
5. **§8.1 — Reddit/practitioner access.** The brief's explicit ask is unmet and I cannot fix it from here. **Needs a decision.**
6. **§1.3 — DISPUTED, not a P0. (Corrected in v1.1 — v1.0 escalated this as a confirmed live fire; that escalation was withdrawn.)** The 24 Apr 2026 filter-URL deadline is asserted by one SEO blogger and **contradicted by Shopify's own changelog**, which says former filter URLs *"will continue to work as expected"* and states no sunset. **Nothing is confirmed and nothing should alarm anyone yet.** What is needed is not a ruling but **access**: GSC + the live ad destination list, so B0.1 can settle it empirically against our own store in minutes. **Requesting access; asserting nothing.** If v1.0's version of this item already reached Abilash in any brief, **it needs an explicit correction** — that is the DataForSEO lesson applied to ourselves rather than recited.

---

## 10. SOURCES

**Shopify primary (T2)**
- [robots.txt.liquid](https://shopify.dev/docs/storefronts/themes/seo/robots-txt) · [GitHub integration](https://shopify.dev/docs/storefronts/themes/tools/github) · [Storefront filtering](https://shopify.dev/docs/storefronts/themes/navigation-search/filtering/storefront-filtering) · [shopify.dev changelog](https://shopify.dev/changelog)
- [**Storefront filter URLs now use stable identifiers instead of text values** — Shopify Changelog](https://changelog.shopify.com/posts/storefront-filter-urls-now-use-stable-identifiers-instead-of-text-values) ⚠️ *the §1.3 dispute — **fetched twice on 2026-07-15**; states no sunset date and says former filter URLs "will continue to work as expected"*
- [Hide a page from search engines (`seo.hidden`)](https://help.shopify.com/en/manual/promoting-marketing/seo/hide-a-page-from-search-engines) · [Store policies](https://help.shopify.com/en/manual/checkout-settings/refund-privacy-tos) · [Smart collections with metafields](https://help.shopify.com/en/manual/custom-data/metafields/smart-collections)

**Google primary (T2)**
- [Crawling & managing faceted navigation](https://developers.google.com/search/docs/crawling-indexing/crawling-managing-faceted-navigation) · [Product structured data](https://developers.google.com/search/docs/appearance/structured-data/product) · [Merchant listing](https://developers.google.com/search/docs/appearance/structured-data/merchant-listing) · [Review snippet policy](https://developers.google.com/search/docs/appearance/structured-data/review-snippet)
- [Merchant Center — Healthcare & medicines](https://support.google.com/merchants/answer/6150151) · [Unapproved pharmaceuticals and supplements](https://support.google.com/merchants/answer/6165956) · [Shopping ads policies](https://support.google.com/merchants/answer/6149970)

**Regulatory (T2)**
- [Drugs and Magic Remedies (Objectionable Advertisements) Act, 1954 — India Code PDF](https://www.indiacode.nic.in/bitstream/123456789/1412/1/195421.pdf) · [overview](https://en.wikipedia.org/wiki/Drugs_and_Magic_Remedies_(Objectionable_Advertisements)_Act,_1954)
- [FTC Health Products Compliance Guidance (Dec 2022)](https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance) · [PDF](https://www.ftc.gov/system/files/ftc_gov/pdf/Health-Products-Compliance-Guidance.pdf) · analysis: [Covington](https://www.cov.com/en/news-and-insights/insights/2023/01/ftc-issues-new-guidance-on-health-related-claims-to-replace-the-dietary-supplements-advertising-guide) · [Cooley](https://www.cooley.com/news/insight/2023/2023-03-02-ftc-revises-health-products-compliance-guidance) · dissent: [Kelley Drye](https://www.kelleydrye.com/viewpoints/blogs/ad-law-access/misguided-the-ftc-attempts-to-redefine-the-law-with-its-health-products-compliance-guidance)
- [FSSAI Nutraceutical Compendium (PDF)](https://www.fssai.gov.in/upload/uploadfiles/files/Compendium_Nutra_29_09_2021.pdf) · [FSSAI Nutra direction 2022 (PDF)](https://www.fssai.gov.in/upload/advisories/2022/03/6243ef28079ceDirection_Nutra_30_03_2022.pdf)
- [The Patanjali Journey: SC scrutiny on advertising compliance — AZB](https://www.azbpartners.com/bank/the-patanjali-journey-supreme-courts-expanding-scrutiny-on-advertising-compliance-for-cosmetics/) · [Lexology](https://www.lexology.com/library/detail.aspx?g=41334f4a-bb85-4658-b7dc-c34d0f9d11e2) · [ASCI healthcare advertising report — WTR](https://www.worldtrademarkreview.com/article/asci-report-indicates-need-stronger-scrutiny-and-regulation-in-healthcare-advertising)

**Research & named practitioners (T3)**
- Baymard: [Product Page UX Best Practices](https://baymard.com/blog/current-state-ecommerce-product-page-ux) · [Product page usability benchmark](https://baymard.com/blog/product-page-usability-report-and-benchmark) · [Product Lists & Filtering](https://baymard.com/research/ecommerce-product-lists) · [Product Details Page research](https://baymard.com/research/product-page) · [Cart abandonment statistics](https://baymard.com/lists/cart-abandonment-rate)
- [Extra costs are the No.1 reason consumers abandon carts — eMarketer](https://www.emarketer.com/content/extra-costs-are-the-top-reason-consumers-abandon-online-carts)
- Aleyda Solis: [Critical & Common E-commerce SEO Issues](https://www.aleydasolis.com/en/search-engine-optimization/ecommerce-seo-issues-how-to-fix/) · [Optimizing Content in Category Pages](https://www.aleydasolis.com/en/search-engine-optimization/optimizing-content-in-category-pages-while-keeping-its-commercial-nature/) · [Building a Modern Day E-commerce SEO Strategy](https://speakerdeck.com/aleyda/building-a-modern-day-e-commerce-seo-strategy)
- [Pavel Ungr — Shopify Is Breaking Filter URLs](https://www.pavelungr.com/shopify-change-filter-url-april-2026/) ⚠️ **SPLIT-TIER (§7.2 caveat, §7.1a):** *mechanism* (no 301s; 200-OK-unfiltered failure mode; affected/unaffected filter types) = **T3, usable**. *The 24 Apr 2026 deadline* = **T5, contradicted by the primary source he cites, corroborated by nobody — DO NOT quote.**
- [Kevin Indig — Growth Memo, e-commerce](https://www.growth-memo.com/t/e-commerce) · [DebugBear — Shopify speed optimization](https://www.debugbear.com/blog/shopify-speed-optimization)
- Taxonomy: [Blink — Metafields vs tags](https://blinkseo.co.uk/blogs/news/metafields-vs-tags-a-shopify-taxonomy-guide) · [Mark Gono — Tags vs Metafields](https://markgono.com/blog/tags-vs-metafields/)

**Platform limitations (T3, corroborated across independent sources)**
- [Vervaunt — Changing URL structure in Shopify](https://vervaunt.com/changing-url-structure-in-shopify-shopify-plus-whats-possible-workarounds) · [LOGEIX — Can you change the Shopify URL structure?](https://logeix.com/shopify-seo/url-structure) · [NotProvided.eu — Shopify SEO architecture limitations](https://www.notprovided.eu/shopify-seo-challenges-platform-architecture-limitations-and-workarounds/) · [Go Fish Digital — Shopify XML sitemaps](https://gofishdigital.com/blog/shopify-xml-sitemaps/)

**T5 — assessed and REJECTED (recorded so they are not relitigated; never quotable)**
- [get-ryze.ai — canonical fixes](https://www.get-ryze.ai/blog/shopify-canonical-url-fixes-5-patterns-stores-get-wrong) *("25–45% traffic in 60–90 days" — no method)* · [Yotpo — Ecommerce AEO](https://www.yotpo.com/blog/ecommerce-aeo/) *("752% YoY")* · [ALM Corp — AEO/GEO Playbook](https://almcorp.com/blog/aeo-geo-playbook-retail-ai-search-2026/) · [Stackmatix — AEO for ecommerce](https://www.stackmatix.com/blog/aeo-for-ecommerce) *("31% higher conversion")*

**Internal**
- `CLAUDE.md` (Hard Gates 1–8; Shopify Track Doctrine j–s; Factory Rules; BUILD DECISION MATRIX; PROOF-OF-WORK) · `docs/process/research-audience-and-psychology.md` (Stage 2 — governs B2) · `docs/ENGINEERING_STANDARDS.md` · `scripts/audit-gpt.mjs` · `scripts/shopify-catalog-lint.mjs` (§7.3 extends it)

---

## CHANGELOG
- **v1.1 (2026-07-15 19:12:40 IST): CORRECTION RELEASE — the document failed its own test and the failure is now its most valuable section.**
  - **§1.3 P0 WITHDRAWN.** v1.0's "backward compatibility was temporary and ended 24 Apr 2026 / deadline passed 12 weeks ago / live revenue leak" is **contradicted by the primary source**. Shopify's changelog, fetched twice on 2026-07-15 and interrogated specifically for `"April 24"/"transition period"/"deprecat"/"sunset"/"temporary"/"stop working"` → **zero matches**, plus verbatim: *"all former storefront filter URLs you have created will continue to work as expected."* shopify.dev documents no sunset either. The deadline has **one origin** ([Pavel Ungr](https://www.pavelungr.com/shopify-change-filter-url-april-2026/)), whose sole cited source is the changelog that contradicts him. v1.0's *"independently documented by"* was **false** — a second URL, not a second origin. Status: **DISPUTED, not fact, in either direction.**
  - **The check survives, the alarm does not.** B0.1 reframed from *"P0, escalate same day"* to *"cheap empirical test that settles the dispute"* — our own store is T1 and outranks both sources (§7.2).
  - **§7.1a ADDED** — post-mortem mapping v1.0 §1.3 onto the DataForSEO incident ingredient-by-ingredient. Three earned rules: *"independently documented" needs a second **origin***; *a search-summary echo is **circular**, not corroboration*; ***alarming claims get less scrutiny exactly when they need more*** — invert the instinct.
  - **§7.2 T3 caveat ADDED:** **tier is a property of the CLAIM, not the author.** Ungr split-tiered — mechanism T3 (usable), deadline T5 (barred). **Never inherit a T2 fact through a T3 summary; fetch the primary doc.** Added an explicit **verified-vs-still-unverified list** so the next agent knows which citations were actually opened (doctrine f).
  - **`B-L5` REWRITTEN** from *"uses pre-24-Apr-2026 syntax"* to *"the filter does not actually filter"* — **v1.0 was about to encode an unverified deadline into automation**, where it would have run unquestioned every Monday. Lints must assert observable behaviour, not dates we could not verify. §5 FILTERS spec field changed likewise.
  - **§9.6 corrected** (P0 → access request, no assertion, + explicit "if this reached Abilash, correct it"). **§8.4 sharpened**: the changelog is necessary and **not sufficient** — the authoritative signal is our own storefront, tested.
  - **§8.1 gap independently reproduced** and upgraded from "blocked" to structural: `WebSearch` on reddit.com returns a hard crawler-level refusal (verbatim error recorded), unrestricted search returns zero links → **not fixable from inside a session**. Shopify Community tried as a substitute; its top answer on filtered URLs is **wrong** (claims filter URLs "won't [be] indexed") and is recorded as a **negative finding, not laundered into T4**.
  - **Re-verified clean and unchanged:** Baymard (70.22% / 50 studies / 39-21-19-19-18), the review-snippet myth correction (ban scoped to `LocalBusiness`/`Organization`, **not** Product), Shopify's automatic canonical to `/products/`, filter model + 25-cap + AND/OR logic.
  - **Fixed:** v1.0's file terminated with two stray XML tool-call closing tags (a `content` close followed by an `invoke` close) leaked from the harness into the deliverable — a malformed artefact that no gate caught, and a reminder that **"the file exists" is not "the file is well-formed."** Worth a lint of its own: `B-L13`, grep every generated `.md` for harness tag leakage.
- v1.0 (2026-07-15 18:03:46 IST): Initial definition of Track B. Maps Abilash's stages to B0–B9 on Shopify. **Pushback filed (§0):** "build = theme in git" covers only the code half of the store and the GitHub sync is bidirectional and non-disableable; "sitemap" is a homonym on Shopify and the XML sitemap is not editable; AEO is relocated from "first stage" to a **veto at B4**, which is stronger; the brief's Reddit ask is **unmet and declared** rather than papered over. ~~**Live P0 surfaced (§1.3):** Shopify's filter-URL GID migration deadline (24 Apr 2026) passed 12 weeks ago and breaks old URLs with a **200 OK**, invisible to status-code checks — B0 checks this first.~~ ← **RETRACTED in v1.1: the deadline is contradicted by Shopify's own changelog and was never verified. Struck, not deleted — this is the record of the error §7.1a analyses.** **Myth corrected (§2.4):** Google's self-serving-review ban is scoped to `Organization`/`LocalBusiness`, **not** Product — PDP `aggregateRating` from real buyers is allowed. **Adjudication (§2.3):** Google's block-facets rule beats Aleyda's index-facets exception *for our catalogue size*, by her own Demand×Supply framework — pending ratification and re-test at B4.4. **Open escalations:** 6, in §9.
