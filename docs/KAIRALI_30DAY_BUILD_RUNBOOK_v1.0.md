# KAIRALI 30-DAY WEB REBUILD — MASTER RUNBOOK v1.0
**Start:** Sunday 13 July 2026, 14:00 IST · **Freeze:** Wednesday 12 August 2026
**Operator:** Abilash · **Support:** Ambuj (infra/access/security), Deepu (WP execution), Vikash (Ads/GSC/GA), Dr. Deepu John (clinical sign-off only), Content team (words only)
**Governing docs:** KAIRALI_WP_FLEET_OS_v1.0.md (WP tail) · CLAUDE_FLEET.md (agent rules) · this runbook (build sprint)

---

## 0. THE SYSTEM ON ONE PAGE

One **Next.js monorepo** (`kairali-web-factory`) on GitHub → **Vercel** (one project per site, preview deploys = human review) → **Cloudflare** DNS on everything. Shared `packages/` carry SEO, schema, i18n, compliance gates, analytics, UI — fix once, all sites inherit. Content = **MDX files** produced by the transform pipeline from the content team's docs; publishing = merge; live in ~60s. **Product microsites do not sell** — they carry unique category content and product cards via the **Shopify Storefront API**; cart/checkout/payment stay on the main Shopify store (your stated model). QA = deterministic Playwright specs per template + Lighthouse CI + nightly audit cron feeding **Fleet Pulse** (hosted on kairali.ai). WordPress survives the sprint only as KTAHV (ayurvedichealingvillage.com), managed under the Fleet OS, migrating after Day 30.

---

## 1. TOOL & MODEL ROUTING — "what creates what"

| Layer | Tool | Used for | Never used for |
|---|---|---|---|
| Workbench | **VS Code** | Seeing files, diffs, terminals. Claude Code runs in its integrated terminal. (Terminal-averse fallback: Claude Desktop app runs Claude Code without a terminal.) | It is not an agent; it decides nothing |
| Build agent | **Claude Code** | ALL repo work: scaffolds, site builds, MDX transforms, redirect maps, audits (Playwright MCP), specs, deploy scripts, Semrush/GSC pulls via MCP | Direct production WP writes (staging script only) |
| Strategy | **Claude.ai chat / Cowork** | Prioritization, content KB work, documents, reviewing drafts, evolving this runbook | Repo edits |
| Content | **Content team + Claude (chat, under Content KB)** | Drafting and human-editing the words; UI/UX feedback as annotated screenshots → GitHub issues | Publishing directly |
| WP execution | **Deepu** | Executing agent-produced KTAHV specs | Anything on Factory sites |
| Prototyping | **Antigravity** | OPTIONAL, off critical path: throwaway visual concepts only. Everything it makes is verified by Claude Code with machine evidence before any reuse | Anything that merges; anything KTAHV |

### Model routing inside Claude Code (switch with `/model`, verified July 2026)
| Model | Command | Use for |
|---|---|---|
| **Fable 5** (top tier) | `/model fable` | Architecture decisions, monorepo design, migration & 301 maps, KTAHV/GST-sensitive work, weekly audit synthesis, anything ambiguous or compliance-critical |
| **Opus 4.8** | `/model opus` (`/effort xhigh` for hardest) | Deep debugging, complex agentic loops, security review; `opusplan` mode (Opus plans, Sonnet executes) for large refactors |
| **Sonnet** (default) | `/model sonnet` | The volume worker: building sites from the template, MDX transforms, spec files, routine fixes — ~80% of the sprint |
| **Haiku 4.5** | `/model haiku` (and via API inside CI scripts) | Cheap repetitive checks: banned-word lint, frontmatter validation, link classification |

Rule of thumb: **plan on Fable, build on Sonnet, debug on Opus, lint on Haiku.**

---

## 2. DOMAIN DISPOSITION — all 84, triaged

### A. BUILD / REBUILD on the Factory — 28 properties in 5 waves

**WAVE 0 · Pilots (Days 1–6) — prove the chain, zero business risk**
| Domain | Action | Notes |
|---|---|---|
| abhilashkr.com | **Deploy today** | Already built in Next.js — becomes tenant #1, proves GitHub→Vercel→Cloudflare end-to-end on Day 0 |
| arogyakendra.com | Build (1-page) | Single-page template |
| arogyashala.in | Build (1-page) | Single-page template |
| snehachowdhary.com | Build | Personal site; theblushlounge.com relationship = Decision #6 |

**WAVE 1 · Product & category microsites w/ Shopify Storefront cards (Days 7–13)**
| Domain | Action | Notes |
|---|---|---|
| kairalitea.com | Create | Category content + product cards → Shopify checkout |
| kairalioil.com | Create | kairalioils.com 301s here |
| kairaliherbals.com | Create | |
| kairaliorganic.com | Create | vs KAIR brand — Decision #3 |
| kairorganics.com | Create | KAIR sub-brand — Decision #3 |
| kairproducts.com | Update | KAIR sub-brand |
| kairaliequipment.com | Create | kairaliequipments.com 301s here; B2B enquiry, no cart |
| bulkayurvedaoils.com | Rebuild multi-page | B2B bulk; Shopify integration per your note |
| bulkayurvedaproducts.com | Rebuild multi-page | Same pattern |

**WAVE 2 · Business lines & education (Days 13–19)**
| Domain | Action | Notes |
|---|---|---|
| kairalifranchise.com | Rebuild — main franchise site | ayurvedafranchise.com — Decision #4 |
| kairalicenters.com | Rebuild — main centers site | Entire center/centre/kerala* family 301s (see D) |
| kairaliyoga.com | Update/rebuild | |
| whatisayurveda.org / .com | QA/QC + canonical decision | Decision #2 (.com is newly registered Jun 2026) |
| healing.recipes | **Launch build** | Cookbooks + latest book — Gita Ramesh authority property; clean contained project |
| ayurvedajournals.com | Clarify remark ("Believe it") | Held until you clarify — Decision #7 |

**WAVE 3 · Corporate & brand (Days 19–25)**
| Domain | Action | Notes |
|---|---|---|
| kairalihospitality.com | Create | All hospitality ventures + consultancy arm (confirm "consistency" = "consultancy") |
| villaraag.com | Update | casaraag / raagcasa / raagvilla / theraagvilla all 301 here |
| kappl.co.in | Create | Pharma corporate (product/pharma register) |
| kairaliproducts.in | QA/QC | Content/brand layer over Shopify |
| kairaliproducts.us | Update | US market page |
| kairaliproduct.com | Update QA/QC | Likely 301 into .in or .com family after QA — confirm |
| kairaliproducts.cz | Create | EU market page (DE/EN content reuse) |
| kairali.ai | Build | **Fleet Pulse dashboard + internal tools home** ("Backend Websites") |

**WAVE 4 · Flagship (Days 25–30)**
| Domain | Action | Notes |
|---|---|---|
| kairali.com | **Rebuild — main group website** | Biggest build; content preloaded from Day 14; target live by Day 30 |
| ayurvedichealingvillage.com (KTAHV) | **Stays WordPress this sprint** | SALT tech-fix spec executed by Deepu (Day 1–3) + agentic QA pass; full migration is the first post-30-day project. ktahv.com + kairalivillage.com 301 here |

### B. HOLD — secure, renew, zero work this sprint
doctorveda.com · goawellnessholidays.com · kairalithailand.com · kairalitowels.com · kairbykairali.com · kaircin.com · rudanti.com · sanskritivedic.com · spaecosystem.com · spalabs.in · kairaliproducts.cn (revisit with China strategy)

### C. DROP / DO-NOT-RENEW (Sheet-1 "n" — confirm, Decision #5)
balanceglow.com · kagapp.com · mobistorr.com · tourdenight.com · trueinstantloan.com · kiapt.co.in · livelifeliveyoga.com · plus the .in center variants (kairalicenter.in, kairalicenters.in, keralacenters.in, keralacentre.in, keralacentres.in) **unless** kept as cheap 301s — my recommendation: keep the on-brand .in variants as forwards (₹ trivial), drop only the five unrelated domains.

### D. FORWARD FARM — ~35 domains, one Cloudflare afternoon (Day 2–3)
kairalicentre/centres/center(.com/.in) family · keralacenters/centre/centres(.com/.in) · keralaequipments · keralaherbals · keralapharma · keralatowels · keralatraining · keralaayurvedainstitute · kairaliayurvedainstitute · kairalitraining · traininginayurveda · kairalioils · kairaliequipments · kairaliorganics · kairalipharma · kairaliproducts.com · healthspacenter(s).com · houseofayurveda.in · arogyakendra.co.in · arogyashala.co.in · whyayurveda(.com/.in/.org) · kairalivillage.com · ktahv.com · casaraag/raagcasa/raagvilla/theraagvilla · kairali.co.in · aayurvedafranchise (if Decision #4 = merge)

Your note says all Forwards → **one** main domain (TBD). **My strong recommendation is semantic forwarding instead** — each variant 301s to its nearest live site (centers family → kairalicenters.com; training family → kairali.guru; whyayurveda → whatisayurveda canonical; raag family → villaraag.com; village/ktahv → ayurvedichealingvillage.com; everything else → kairali.com). All-to-one throws away topical link equity and type-in intent. **Decision #1.** Implementation is identical either way: Cloudflare Bulk Redirects, one list, done in an afternoon.

---

## 3. PPC LANDING PAGES — the protocol (not in the domain list, now in scope)

1. **Day 0 (today):** Vikash exports from Google Ads — Landing Pages report + all final URLs by campaign/ad group, plus tracking templates/UTM conventions. Every live final URL becomes a row in the register: URL · campaign · monthly spend · destination site (new).
2. **Factory landing template:** each site gets `/lp/<campaign-slug>` routes — single-CTA layout, form + WhatsApp variants, `noindex` by default, `data-cta` events wired, locale-aware.
3. **Iron rule: a live final URL never 404s.** Cutover per campaign, not per site: deploy new page → verify spec pass → update final URLs in Google Ads (tracking template intact) → watch CTR/CVR/Quality Score for 72h before the next campaign. Where the old URL path can be preserved on the new stack, preserve it; where not, 301 with query-string passthrough.
4. Landing pages are code + MDX like everything else — versioned, gated, previewable. New campaign page = one MDX file + merge; live in minutes. This is the "lightning speed" lane for Anupam/Vikash.

---

## 4. DAY 0 — TODAY, SUNDAY 13 JULY, 14:00 IST

**14:00–14:30 · Accounts.** Create GitHub org (`kairali-digital`) + private repo `kairali-web-factory`. Create/confirm Vercel team, connect the GitHub org. Confirm Cloudflare account (create if none — it becomes the DNS home for everything).

**14:30–15:15 · Machine.** Install VS Code + Git + Node LTS (for project tooling). Install Claude Code — native installer (npm route is deprecated):
```bash
curl -fsSL https://claude.ai/install.sh | bash
claude          # log in with your Max plan when prompted
claude doctor   # verify
claude mcp add playwright npx @playwright/mcp@latest
```

**15:15–16:00 · Scaffold.** In Claude Code (`/model fable` for this one): scaffold the Turborepo monorepo — `sites/`, `packages/{ui,seo,schema,i18n,compliance,analytics}`, root `CLAUDE.md` (paste CLAUDE_FLEET.md + the Factory addendum in §7 below). Commit, push, import into Vercel.

**16:00–17:00 · First tenant live.** Drop the already-built abhilashkr.com Next.js site into `sites/abhilashkr`, deploy on Vercel, point DNS at Cloudflare. **A live site on the new system before 5 PM today.** This is deliberately the lowest-stakes domain you own — it proves GitHub→Vercel→Cloudflare with zero business risk.

**17:00–17:30 · Delegate (WhatsApp).** Vikash: Google Ads landing-page/final-URL export + GSC & GA4 admin access list, by tomorrow noon. Ambuj: start the registrar/hosting credential inventory (Fleet OS §0 register) + list which domains' DNS he can move to Cloudflare this week. Deepu: heads-up — KTAHV technical-fix spec lands with him tomorrow.

**17:30–18:15 · First shared package.** Claude Code (`/model sonnet`): generate `packages/compliance` — the banned-word lint (KTAHV list EN/DE/FR + locked-facts checks) as an ESLint/CI rule. Commit. Every future site inherits the GST gate automatically from this moment.

**18:15–19:00 · Decisions.** Answer the 7 decisions in §6, drop them in `DECISIONS.md` in the repo (and to me). These unblock Days 2–3.

---

## 5. DAYS 1–30

| Days | Work | Gate to pass |
|---|---|---|
| **1** (Mon 14) | Extract kairali.guru components/i18n into `packages/`. Claude Code crawls KTAHV → generates **SALT tech-fix spec** (301s for legacy .html + /fr-fr/, block /wp-includes/ + /cpanel, trailing-slash canonical, noindex bookings subdomain, fix Traveller's Choice badge) → to Deepu. PPC export lands → register rows created. | Spec in Deepu's hands; packages compile |
| **2–3** | Cloudflare zone consolidation begins (as access arrives). **Forward farm**: bulk 301 list per Decision #1 — live. **Factory template v1**: 5-page microsite + landing template + trilingual i18n + SEO/schema/compliance wired + Playwright spec skeleton + Lighthouse CI. | Template deploys clean; specs green on template |
| **4–6** | **Wave 0 live** (4 pilots). Deepu executes KTAHV spec; agent verifies with crawl evidence. Semrush MCP connected; GSC API wired for live domains. | 4 sites live; KTAHV fixes verified; nightly cron running on pilots |
| **7–13** | **Wave 1** (9 product/B2B microsites). Shopify Storefront API token + `packages/product-card` (buy → main Shopify checkout). Content team feeds category copy through pipeline. PPC landing routes for any campaign pointing at these domains — cutover per protocol §3. | Each site: specs green + Lighthouse ≥ budget + your preview approval before DNS flips |
| **13–19** | **Wave 2** (business lines + education). healing.recipes launch build (Gita Ramesh content — clinical pass NOT needed, brand pass yes). whatisayurveda canonical executed per Decision #2. Keyword maps per live site via Semrush MCP → frontmatter. | Same per-site gate |
| **19–25** | **Wave 3** (corporate/brand + market pages). **Fleet Pulse built on kairali.ai**: nightly audit JSON (crawl, links, schema, tags, hreflang, banned words, Lighthouse, uptime, GSC) → one RAG screen, all domains, "edit page" deep-links. MainWP live for the WP tail. | Dashboard shows every live domain green/amber/red |
| **25–29** | **Wave 4: kairali.com** build sprint (content preloaded from Day 14, structure from the sitemap work we've already done). Remaining PPC cutovers. 301 cutovers from any old hosting. | kairali.com specs green + your section-by-section approval |
| **29–30** | Freeze. Handover pack: this runbook + Fleet OS + CLAUDE.md + Fleet Pulse walkthrough. Half-day working session with your IT person: one full cycle (content change → preview → merge → live → dashboard). Tier-3 sunset list final call. | IT person completes one unassisted publish cycle |

**Daily rhythm during the sprint (yours, ~45 min):** 10 min Fleet Pulse · 20 min preview-link approvals · 15 min unblock decisions. Everything else is the agent + team.

---

## 6. DECISIONS NEEDED (answer today, §4 18:15 block)

1. **Forward strategy:** semantic map (recommended, table in §2D) or literal all→one (if so, which domain)?
2. **whatisayurveda:** canonical = .org (aged, live, needs QA) or .com (fresh Jun 2026)? Loser 301s to winner.
3. **Kairali Organic vs KAIR (kairorganics/kairproducts/kairbykairali):** two distinct brands, or consolidate into one?
4. **ayurvedafranchise.com:** QA + keep as SEO satellite, or 301 into kairalifranchise.com?
5. **Drop list:** confirm the five unrelated domains die (balanceglow, kagapp, mobistorr, tourdenight, trueinstantloan); confirm .in center variants become cheap forwards instead of drops.
6. **snehachowdhary.com vs theblushlounge.com:** which is primary (other 301s)?
7. **ayurvedajournals.com** remark says "Believe it" — clarify intent (leave it / build it / brand name?).

---

## 7. CLAUDE.md FACTORY ADDENDUM (paste below CLAUDE_FLEET.md content in the repo root)

```markdown
## FACTORY RULES (monorepo)
- Every site lives in sites/<domain>, built ONLY from packages/* — no copy-pasted components.
- Every page is MDX with complete frontmatter: title, description, locale, keywords[], schemaType, cta.
- Locales: EN always; DE/FR where the site brief says so. A page missing a locale is flagged, never silently EN-only.
- Product cards use packages/product-card (Shopify Storefront API). NEVER build a cart, checkout, or payment form — checkout is the main Shopify store, always.
- Landing pages live at /lp/<campaign>, noindex by default, single CTA, data-cta events required.
- Entity register: KTAHV pages = clinical lock (see above). Villa Raag / hospitality = wellness-hospitality register. KAPPL/product sites = product-pharma register. kairali.com = group-corporate register (clinical lock applies ONLY to KTAHV sections/links).
- A site ships when: pnpm build clean · spec suite green · Lighthouse ≥ 90 perf / 100 SEO on key templates · compliance lint zero findings · Abilash approved the Vercel preview.
- DNS flips are HUMAN actions. The agent prepares; Abilash/Ambuj flip.
```

---

## 8. POST-30-DAY QUEUE (do not start early)
1. **KTAHV migration** — 376 pages, its own 3–4 week plan (content rewrite waves + 301 map + booking engine decision). The sprint's Factory + specs make this a mechanical project, not a leap.
2. **Shopify track** — theme code under Git, storefront QA agent, the affiliate-microsite content flywheel.
3. kairaliproducts.cn / China strategy · Japan market pages (ties to your Japan audit) · TinaCMS visual editing if the content team asks for buttons.

*v1.0 — locked 13 Jul 2026, 14:00 IST.*
