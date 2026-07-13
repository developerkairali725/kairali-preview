# M2 SHOPIFY SETUP PROMPT — paste as ONE message into Claude Code
# PRECONDITIONS: M2 Master Setup FINAL v2 is complete (factory repo, hooks, MCPs live);
# SHOPIFY_TRACK_CONTEXT.md placed in the factory repo root and pushed;
# run from ~/work (the parent of kairali-web-factory) → claude → /model fable → paste below.
# ─────────────────────────────────────────────────────────────────────────────

You are extending the Kairali system to the Shopify track (KAPPL e-commerce —
the group's ONLY checkout and revenue surface). The AUTONOMY DOCTRINE and
ESCALATION LIST (E1–E5) from the factory setup apply verbatim, with this
extension to E5 — FOREVER-HUMAN on Shopify: publishing any theme; installing
or removing apps; ANY change under Settings (payments, checkout, shipping,
taxes, markets, domains); prices, discounts, refunds. You are READ-ONLY in
the Shopify admin. You audit, build in git, and prepare; humans click.
Evidence rule stands: real output at every step; never claim without proof.

PHASE 0 — LOAD THE BRAIN.
Read, in full: kairali-web-factory/SHOPIFY_TRACK_CONTEXT.md,
PROJECT_CONTEXT.md, SITE_DESIGN_LOCALE_REGISTER.md (the C-register rows),
SITE_LAUNCH_CHECKLIST_v1.0.md, CLAUDE.md. Confirm in 6 bullets: the
one-checkout rule; KAPPL register vs KTAHV lock; claims-by-buyer-market;
forever-human list; theme code-lane; live-admin-overrides-docs. Then proceed.

PHASE 1 — TOOLING.
Install Shopify CLI (npm i -g @shopify/cli@latest). Verify shopify version
and that theme-check runs. Nothing else.

PHASE 2 — ACCESS + STAGE 0 (the question that changes everything).
shopify auth login → (E2: pause for my browser login; use my/store owner
account or the staff account Ambuj provides). Then DETERMINE, with evidence
from the live admin/CLI:
  U1. Are kairaliproducts.in and kairaliproducts.com ONE store with two
      domains (Shopify Markets) or TWO separate stores? (Check Settings →
      Domains and Markets via read-only browsing with Playwright if needed.)
  U2. Plan tier. U3. Theme name/version. U5. Backup app present?
Record answers in kairali-web-factory/DECISIONS.md AND update
SHOPIFY_TRACK_CONTEXT.md §3 via commit. If TWO stores: every subsequent
phase runs per store, .in first. Then walk me (E3, click-by-click, plain
words) through creating ONE custom app per store in the admin with:
Storefront API access (public token, product read) + Admin API READ scopes
for products, content, themes, orders(read). I paste tokens into
~/work/.env.shopify (never into git — confirm .gitignore covers it).

PHASE 3 — THEME REPO + DISASTER-RECOVERY BASELINE.
gh: create PRIVATE repo kairali-shopify-theme, clone to ~/work/. For each
store: shopify theme pull the LIVE PUBLISHED theme into
themes/<store>/live/ and commit as "Live theme snapshot 2026-07-13 —
rollback baseline. DO NOT EDIT; copy to work from here." Copy
SHOPIFY_TRACK_CONTEXT.md + a thin CLAUDE.md into this repo (rules: factory
repo is source of truth; E5-Shopify list; theme-check + preview before any
share; only Abilash publishes). Push. This snapshot is the store's only
theme backup if U5 = none — say so in the commit if true.

PHASE 4 — FULL READ-ONLY AUDIT (the Comet audit, reborn here).
Using Admin API reads + Playwright read-only browsing of the admin, produce
docs/SHOPIFY_AUDIT_2026-07-13.md in the factory repo, per store, weighted
exactly: (1) checkout/payments/shipping/taxes snapshot — screenshots +
config summary, NO changes; GST/HSN completeness on .in, duties handling on
.com; (2) conversion surfaces — PDP/cart quality, mobile Lighthouse on the
live storefront, trust signals present (WHO-GMP, since-1908); (3) compliance
— Customer Privacy/consent state, DPDP/GDPR posture, how GA4 + pixels are
actually wired (native channels vs theme-pasted scripts — flag every pasted
script); (4) app inventory — name, monthly cost, scopes/data access,
storefront JS weight, keep/kill/replace recommendation; (5) SEO + catalog
hygiene — counts of products missing meta title/description/alt text,
duplicate titles, broken links, redirect table state, Product JSON-LD
validity on PDPs. End with a prioritized fix table: item · severity ·
revenue impact · who clicks (me / engineer / Ambuj) · agent-preparable?
STOP after presenting the audit for my review before Phase 5. (E4)

PHASE 5 — CATALOG LINT v1 (the always-recheck for store content).
Write scripts/shopify-catalog-lint.mjs in the factory repo: pull ALL
products, collections, pages via Admin API (read token from env); run the
full compliance lint — KAPPL register, claims lens per store market, group
banned filler, locked facts, missing SEO fields, images without alt, .in
missing HSN/GST — output a dated markdown report as a PR. Run it once NOW,
paste the summary counts. Wire it into the Monday ritual in CLAUDE.md
(alongside wiki lint): findings route to the engineer, never auto-fix.

PHASE 6 — STOREFRONT CONTRACT (feeds Wave-1 microsites).
In the factory repo, write packages/product-card/CONTRACT.md: env var names
per store, the exact fields consumed (handle, title, price, compareAtPrice,
currency, images, variant availability, canonical PDP URL), and the rule
that every buy action resolves to Shopify checkout. Prove it: one live
Storefront API fetch of one real product per store, paste the JSON with the
token redacted.

PHASE 7 — DEV THEME LANE (prepare, don't restyle yet).
From the snapshot, create themes/<store>/dev/, push it to the store as an
UNPUBLISHED development theme, and give me the preview URL. Run theme-check
and Lighthouse against the preview; record baseline scores in the audit
doc. Map where brand tokens WOULD wire in (theme settings vs CSS custom
properties) as docs/THEME_TOKEN_MAP.md — mapping only; visual work is a
later, separately-approved task.

PHASE 8 — SHARED MEMORY.
Update factory wiki/shopify.md with: Stage-0 answers, audit headline
findings, token/contract locations, the Monday catalog-lint ritual; entry
in wiki/log.md. Append to BOTH repos' CLAUDE.md: (j) live admin overrides
docs; (k) Shopify forever-human list; (l) Monday catalog lint; (m) PDP URL
changes must be flagged to Vikash BEFORE they happen (live Ads point at
them).

PHASE 9 — BRAIN CHECK, THEN STOP.
Prove in 8 bullets: one-checkout rule · Stage-0 answer (now known) · the
rollback path (which theme to republish) · claims-by-buyer-market with one
example of a banned US claim · forever-human list · catalog lint cadence ·
storefront contract location · who publishes themes. Paste /mcp and the
lint summary again. Commit trail "Shopify track: Stage 0, baseline, audit,
lint, contract". Then STOP — no theme restyling, no store changes, until
Abilash says so.

# ─────────────────────────────────────────────────────────────────────────────
# ABILASH'S MOMENTS (the agent will pause for exactly these):
#  · shopify auth browser login (E2)  · custom-app token creation clicks (E3,
#    guided)  · reviewing the Phase-4 audit before Phase 5 (E4)
# AFTER IT STOPS: sit with the new engineer, walk the audit's fix table,
# assign the "who clicks" column, and schedule the first Monday lint review.
