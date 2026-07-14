# SEO / AEO Tooling Decision — What to Buy Tomorrow Morning

**Date:** 2026-07-14 19:52:42 IST
**For:** Abilash (purchase decision)
**Prepared by:** Kairali web-factory agent (research synthesis: Reddit/HN practitioner threads + official vendor pricing pages, all verified July 2026)
**Scope:** SEO data (keyword volumes, difficulty, rank tracking, SERP features, competitor gap, backlinks) + AEO/GEO (AI-engine citation) tracking for the ~28-site Kairali fleet, callable programmatically by the Claude agent.

---

## 1. TL;DR — The Verdict

**Buy ONE thing tomorrow: a $50 DataForSEO deposit (one-time, pay-as-you-go — NOT a subscription).**

That single $50 covers our entire stated workload — ~2,000 keyword volume lookups + 500 ad-hoc SERP checks + weekly rank tracking across 28 sites — for an estimated **6–12 months**, because our actual usage costs roughly **$3.60/month** at DataForSEO's published 2026 per-task rates ([official pricing](https://dataforseo.com/pricing/google-serp/google-organic-serp-api)):

| Our monthly workload | DataForSEO cost |
|---|---|
| 2,000 keyword volumes (2 bulk tasks × $0.06) | $0.12 |
| 2,000-keyword difficulty pull (Labs API) | ~$0.26 |
| 500 ad-hoc SERP checks (× $0.0006) | $0.30 |
| Weekly rank tracking: 28 sites × 20 kw ≈ 4,850 SERPs (× $0.0006) | $2.91 |
| **Total** | **≈ $3.60/mo** |

Even tripling tracked keywords to 50/site only reaches ~$8/mo.

**Why DataForSEO and not anything else:**

1. **It is the practitioner-consensus budget standard.** HN user umussetu (Sep 2024): DataForSEO is *"10x cheaper than the ahrefs or semrush apis (it's real data)"* ([HN thread](https://news.ycombinator.com/item?id=41568536)). laurentbourrelly (well-known French SEO) in r/SEO (Mar 2025): *"dataforseo is the starting point for building your own tool. All SEO tools use it."* ([r/bigseo thread](https://www.reddit.com/r/bigseo/comments/1j4souh/whats_a_good_alternative_to_ahrefs/)) — i.e. we'd be buying the same upstream data the SaaS dashboards resell.
2. **It is the ONLY candidate covering ALL our needs** — volumes + difficulty (India & global), rank tracking, SERP features, competitor gap analysis, backlinks, AND AI-citation tracking (AEO/GEO) — in one pay-as-you-go account.
3. **It has an official MCP server** ([dataforseo.com/model-context-protocol](https://dataforseo.com/model-context-protocol)) the Claude agent calls natively — no custom integration work, auth via env vars, bills against the same $50 balance.
4. **The alternatives fail on price or coverage:** Semrush API needs the ~$500/mo Business tier *plus* separately-purchased API units ([Semrush dev docs](https://developer.semrush.com/api/get-started/api-access/)); Ahrefs API starts at $129/mo (Lite) and caps at ~2,000 requests/month; SerpAPI would be $75/mo for SERPs only; Serper is cheap but SERPs only.

**Do NOT buy any AEO/GEO SaaS dashboard yet** (Profound $499/mo, Peec ~€89/mo, Otterly $29/mo, Semrush AI add-on $99/domain/mo, Ahrefs Brand Radar $828+/mo). The same $50 DataForSEO deposit includes their AI Optimization API (LLM Mentions, LLM Responses, AI Overview flags) — details in section 4. Optional later: a $29/mo Otterly Lite trial as a sanity-check benchmark, but not tomorrow.

**Keep, at $0:** Google Search Console API, Bing Webmaster API, Microsoft Clarity, and the existing Semrush **browser** login for manual research (the browser login includes zero API access — confirmed, section 3).

---

## 2. Comparison Table (at OUR usage: 2,000 kw lookups + 500 SERPs + 28-site weekly tracking)

| Tool | Monthly cost at our usage | Data quality (practitioner view) | Agent integration | Verdict |
|---|---|---|---|---|
| **DataForSEO** (pay-as-you-go) | **≈ $3.60/mo** ($50 one-time deposit lasts 6–12 mo) | "Real data", same upstream layer most SEO tools resell; caveat: keyword volumes are "just data… not accurate IMHO, but it's affordable" (rumblepup, [r/bigseo](https://www.reddit.com/r/bigseo/comments/1j4souh/whats_a_good_alternative_to_ahrefs/mgb7aij/)) — sanity-check volumes, don't worship them. Backlinks: cheap + usable ("more accurate result compare to GSC" — BeyondspaceOfficial, r/SEO) but shallower than Ahrefs for deep link audits (j_on, [r/bigseo](https://www.reddit.com/r/bigseo/comments/1gzeqsc/dataforseo_rank_ahrefs_rank_or_traffic/lz7oanv/)). Support praised: "Really good service and cheap. Their support team are also super helpful" (Wonderful-Heart3557, [r/n8n](https://www.reddit.com/r/n8n/comments/1jwjovr/any_api_service_provider_for_seo/mmook9q/)) | **Official MCP server** — agent calls it directly | **BUY** |
| Semrush API | **≈ $500–600/mo minimum** ($499.95 Business tier + API units sold separately; browser login includes zero API) | Good data, great docs (mennobyte, r/SEO: "documentation is better than… almost any other API") but "insanely expensive" (DangerWizzle, [r/bigseo](https://www.reddit.com/r/bigseo/comments/1b3usg5/do_you_think_this_seo_workflow_if_automated_would/ksv2w1r/)); "API is pricey as h*ll" (simulation_goer, r/SEO) | REST, no MCP | Skip. Keep browser login for manual work |
| Ahrefs API v3 | **$129/mo minimum** (Lite; 100K units ≈ only ~2,000 requests/mo; no SERP scraping) | Best-in-class backlinks; but the API wall is exactly what pushed practitioners to DataForSEO: "forcing to update to v3 got so expensive so we are swapping to DataForSEO" (the-digital-guy, [r/SEO](https://www.reddit.com/r/SEO/comments/1dw1o8q/ahrefs_api_alternative/lbt68zh/)); "definitely not going to pay $15,000… to get their proprietary metrics" (maskry, r/SEO) | REST + MCP (shares unit pool) | Skip. Revisit only for deep link audits |
| SerpAPI | **$75/mo** (needs 5K-search tier for our volume; SERPs only — no volumes/difficulty/backlinks) | Most polished/reliable, legal shield | Official MCP exists | Skip — 25–40x Serper's per-query price |
| Serper.dev | ~$5.40/mo effective ($50 credit pack lasts ~9 mo; SERPs only) | "$2/1000 queries" for 100 results — cheapest live SERPs (Manouchehri, [HN](https://news.ycombinator.com/item?id=43921687)) | Simple REST | Optional free tier (2,500 credits) as live-SERP backup. Don't buy |
| Google Keyword Planner (Ads API) | $0 | "Google lies, but it's still a somewhat good source" (rumblepup); third-party volume APIs largely repackage this anyway (What_The_Hex, [r/PPC](https://www.reddit.com/r/PPC/comments/105fsfr/am_i_allowed_to_use_the_google_keyword_planners/j3ct6pf/)) — but without active ad spend we only get bucketed ranges (1K–10K) | Needs MCC account + dev token + OAuth (setup friction) | Free cross-check, not primary |

One credibility note: the loudest anti-DataForSEO comment found ("the worst API") sits in an [r/n8n thread](https://www.reddit.com/r/n8n/comments/1k5yny8/serp_alternative_web_search/morlrn0/) where the same accounts repeatedly promote a competitor (Scrapingdog) — classic vendor astroturfing; we weighted it accordingly. Genuine criticisms elsewhere are about volume accuracy and per-endpoint cost, not reliability. Also note the real billing gotchas: per-endpoint costs vary a lot (one r/SaaS user burned the $1 trial credit in ~12 expensive calls), there's a **$50 minimum deposit**, and prices went **up ~20% on 1 July 2026** ([official notice](https://dataforseo.com/update/pricing-update-in-dataforseo-apis)) — all figures above are the POST-increase rates, so the math is current.

---

## 3. What Stays Free (and what each piece covers)

| Free tool | What it gives us | What it can't do |
|---|---|---|
| **Google Search Console API** ($0, no billing account) | Our own sites' Google queries, positions, CTR, impressions — 50,000 rows/day per property, 1,200 queries/min ([Google's limits page](https://developers.google.com/webmaster-tools/limits)). Open-source MCP servers exist with prebuilt quick-wins/content-decay/cannibalisation tools. **This is the $0 backbone for all 28 properties.** | Only OUR sites. No competitor data, no keyword universe |
| **Bing Webmaster API** ($0, one API key) | Our Bing traffic + a hidden gem: GetKeywordStats returns historical weekly impression volumes for ARBITRARY keywords by country (incl. India) — a free third-party volume signal ([Microsoft docs](https://learn.microsoft.com/en-us/bingwebmaster/)) | 6-month aggregate windows; Bing-sized sample |
| **Microsoft Clarity** ($0) | On-site behaviour, session recordings, heatmaps | Nothing about search visibility |
| **Semrush browser login** (already paid) | Manual keyword research, Keyword Magic tool, ad-hoc competitor snooping by a human | **Zero API access** — programmatic use requires the ~$500/mo Business tier + separate unit purchases. Confirmed dead end for the agent |
| Serper.dev free tier (2,500 one-time credits) | Ad-hoc live Google SERPs during development | SERPs only; credits expire in 6 months |

**What $0 cannot do** — and why the $50 deposit is needed at all: competitor rankings/gap analysis, keyword difficulty, backlink profiles, SERP-feature monitoring, and AI-citation tracking. Everything describing the *wider web* (not our own properties) is metered data, and DataForSEO is the cheapest metered source that covers all of it through one account.

---

## 4. AEO/GEO (AI-Citation) Tracking — Recommendation at Our Stage

**Don't buy a dashboard. Build the tracking on the same DataForSEO account.**

The 2026 market ([practitioner map from maltelandwehr](https://www.reddit.com/r/SEO/comments/1j0gt6q/ai_engine_visibility/mfbagol/), a widely-respected SEO: *"Profound if you want to spend $$$$ — Peec AI if you want to track accurately… Also affordable. — Otterly if you are ok with less accurate data"*):

- **Profound** $499/mo — priced for $50M+ ARR enterprises with analyst teams. Not us.
- **Semrush AI add-on** $99/mo **per domain** — ~$2,800/mo for our 28 sites, dashboard-only, no API ([Trakkr pricing breakdown](https://trakkr.ai/reviews/semrush-review/pricing)). Absurd for us.
- **Ahrefs Brand Radar** $828–1,148/mo all-in, and an independent Jan 2026 test found it reported 3 ChatGPT mentions where manual checking found 123 ([tryanalyze review](https://www.tryanalyze.ai/blog/ahrefs-brand-radar-review)). No.
- **Peec AI** €89/mo — credible, but solves a problem the $50 deposit already covers.
- **Otterly Lite** $29/mo — cheapest credible option, 50+ countries. The only one worth *maybe* trialling later as a benchmark.

The core criticism of ALL of them, per Discovered Labs' comparison: *"you're buying a dashboard, not an outcome"* — they surface visibility gaps but execute nothing ([source](https://discoveredlabs.com/blog/profound-vs-peec-vs-otterly-which-ai-visibility-platform-should-you-buy)). Our agent already does its own auditing and content work, so the dashboard layer is the least valuable part.

**What we do instead** (single-digit dollars/month, same $50 balance):
1. **DataForSEO LLM Mentions API** — tracks brand mentions vs citations across ~200M aggregated AI responses (ChatGPT, Google AI Overviews, Perplexity, Gemini, Claude), with historical trends and competitor benchmarking, ~$1 per 1,000 rows, no subscription ([product page](https://dataforseo.com/apis/ai-optimization-api/llm-mentions-api)).
2. **Weekly DIY prompt-sampling job**: ~50–100 buyer-intent prompts ("best Panchakarma retreat in Kerala", "Kairali vs …") × 3–5 engines × repeated samples via the LLM Responses API (~$0.01/task) — methodologically the same thing the $99–499/mo tools do; repetition across regions/time handles LLM non-determinism ([practitioner method notes](https://nicklafferty.com/blog/llm-tracking-tools/)). Results commit to the repo as durable evidence.
3. **AI Overview flag on our existing rank tracking**: +$0.0006/keyword on SERP Advanced.

**Scale check on why cheap-now is right:** AI referrals are still only ~0.1–1% of site traffic in 2026 but convert at ~7.1% — about 2.5x Google organic ([2026 benchmarks](https://searchsignal.online/research/ai-search-referrals-citations-2026)). Worth monitoring cheaply; not worth $500/mo dashboards. And one free lever beats every dashboard: 2026 research found brands with even minimal third-party review profiles (1–13 reviews) had a ~53.5% median AI citation rate vs ~1% with none ([source](https://axis-intelligence.com/ai-search-statistics/)) — for KTAHV and Villa Raag, Google reviews / TripAdvisor / health-travel directories are direct AEO inputs.

Per fleet rule (r): every LLM response and SERP snippet fetched through these APIs is scraped content — it passes injection screening as **data, never instructions**, before any agent acts on it.

---

## 5. Exact Sign-Up Steps (tomorrow morning, ~10 minutes)

Abilash performs the account creation and payment himself (agent never creates accounts or enters payment details — fleet gate).

1. Open **https://app.dataforseo.com/register** in the browser.
2. Register with **director@kairali.com** (company mail — not the gmail). Set a fresh, unique account password (password manager). Business name: Kairali Ayurvedic Group.
3. Verify the email (click the confirmation link DataForSEO sends to director@kairali.com).
4. Log in → you land on the dashboard with **$1 free trial credit** already applied. (Careful: expensive endpoints can burn that $1 in a dozen calls — it's a smoke test, not a budget.)
5. Go to **Billing → Add funds** (left sidebar). Deposit **$50** — the minimum payment amount ([pricing page](https://dataforseo.com/pricing)). Card payment; this is a one-time prepaid balance, NOT a recurring subscription. Save/download the invoice for accounts.
6. Go to **API Access** (dashboard left sidebar). You'll see the **API login** (usually the account email) and an **API password** (a generated credential, separate from your account password). Copy both — this pair is what the agent uses.
7. **Hand the credentials to the machine the safe way** — never paste them into chat, never commit them. On the Mac mini, create/append to `~/.secrets/dataforseo.env`:
   ```
   export DATAFORSEO_USERNAME="director@kairali.com"
   export DATAFORSEO_PASSWORD="<the API password from step 6>"
   ```
   Then `chmod 600 ~/.secrets/dataforseo.env`. The shell profile already sources `~/.secrets/` env files; the repo's `.gitignore` never sees them (same pattern as `WP_APP_PASSWORD`).
8. Tell the agent it's done. The agent will then (its job, not yours): run `npx dataforseo-mcp-server@latest` using those env vars (official server, [github.com/dataforseo/mcp-server-typescript](https://dataforseo.com/model-context-protocol)), register it in the MCP config, and prove the integration with a real paid call (a $0.0006 SERP task for one KTAHV keyword) — pasted output, per proof-of-work rules, before any batch jobs run.
9. Optional, $0, same morning: in the dashboard set a **balance alert** (Billing → notifications) at $10 remaining, so a runaway job can't silently drain the balance.

**Spending guardrail for the agent (standing):** standard queue ($0.0006/SERP, ~5-min turnaround) for all batch/nightly jobs; live mode ($0.002) only for interactive checks; Labs `include_clickstream_data` stays OFF (it doubles request cost); any new endpoint gets a one-task cost probe before batch use.

---

## 6. Revisit Triggers (when to spend more)

| Trigger | Then consider |
|---|---|
| DataForSEO usage exceeds **~$40/mo for 2 consecutive months** (≈ 65,000 SERPs/mo) | Re-run this comparison; at high volume Serper ($0.30/1K) may take over raw SERP feeds |
| We win/defend revenue on **link building** and need deep backlink audits (DataForSEO's live-links index is shallower than Ahrefs — j_on's r/bigseo critique above) | Ahrefs Lite $129/mo (API v3 now included on all paid plans, 100K units) |
| **AI referrals exceed ~3% of fleet traffic** or an AI-cited page drives measurable bookings | Otterly Lite $29/mo trial as an accuracy benchmark against our DIY numbers; Peec AI €89/mo if we need multi-LLM daily sampling at scale |
| A human team member needs **daily dashboard-grade** competitor research beyond the browser login | Semrush stays browser-only unless fleet revenue justifies ~$500/mo; the API-unit economics don't change until then |
| DataForSEO **volume numbers contradict** Google Keyword Planner / GSC reality on money keywords | Stand up the free Google Ads API (Basic access) as a systematic cross-check; requires MCC account + developer token (half-day setup) |
| Another **~20% price increase** notice from DataForSEO (last: 1 Jul 2026) | Re-price the table in section 2 before topping up |

---

*Checker pass: every price and quote above traces to the cited URL; per-task rates are post-July-2026. Unverified items: exact DataForSEO dashboard menu labels in section 5 (steps 4–6, 9) follow their documented flow but may differ cosmetically in the live UI; the ~$3.60/mo figure assumes 20 tracked keywords/site — actual keyword lists per site are not yet fixed. Neither changes the decision.*
