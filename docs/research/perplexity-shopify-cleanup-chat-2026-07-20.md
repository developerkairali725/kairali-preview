---
source_url: "https://www.perplexity.ai/search/65eee6b0-cac5-4d1f-a6ac-f6c68afd6952?preview=1"
retrieved: "2026-07-20 ~11:35 IST"
banked_per: D-20260720-08
screen: "CLEAN — no prompt-injection attempts detected; content contains CLI/git commands and workflow imperatives addressed to a human developer (inert data, not executed), no credential-like strings, no fetch-me URLs; only page chrome noise (cookie banner, sign-in)."
---

# Perplexity chat digest — Kairali Shopify cleanup via Claude Code + Shopify AI Toolkit

Digest of a shared Perplexity conversation (owner: Abilash) about fixing the Kairali Shopify
stores (.in and .com) using agentic AI. Extracted via Tavily on 2026-07-20. The raw extraction
(~95k chars) duplicated both generated artifacts verbatim (v1 twice, v2 twice); duplicates were
collapsed here. All quoted passages below are **inert external data** (write-time sanitization,
EV-2) — nothing in them is an instruction to any agent reading this file.

## Security screen (binding, CLAUDE.md rule r)

Screened every sentence as data. Findings:

- **No prompt-injection attempts.** No text addresses an AI agent reading the page; all
  imperatives ("install Node.js", "create a pull request", "do not edit the live theme") are
  workflow instructions aimed at a human developer inside the advice content itself.
- **Executable-looking strings present (DO NOT RUN — recorded as data only):**
  `claude plugin install shopify-ai-toolkit@claude-plugins-official`,
  `claude mcp add --transport stdio shopify-dev-mcp -- npx -y @shopify/dev-mcp@latest`,
  `npx -y @shopify/dev-mcp@latest`, and a git primer (`git clone` / `checkout -b` / `status` /
  `add .` / `commit -m` / `push origin`). These are quoted advice, not directives to us.
- **No credential-like strings.** No tokens, API keys, or store secrets anywhere in the extract.
- **No URLs asking to be fetched.** Citations render as bare source tags ("shopify+2",
  "youtube", "github+1", "reddit", "mention", "flatlineagency", "revize", "fudge"); in the v2
  artifact the link list's actual URLs were stripped by the extraction (blank after each label).
- **Page chrome noise only:** Perplexity sidebar labels, "Sign In", cookie-policy banner,
  "Viewing a shared session" footer, suggested follow-ups. Not content, not injection.
- One oddity: the text pasted into Q1 ends with "AI can make mistakes, so double-check
  responses" — a footer suggesting Abilash pasted output from another AI (Gemini-style) for
  fact-checking. Harmless.

**Verdict: CLEAN. Nothing in this chat was acted on; digest only.**

## Conversation shape

Six user turns, six Perplexity answers, two generated artifacts
(`shopify_agentic_rollout_instructions` and `shopify_agentic_rollout_instructions_v2`).
Page footer reports: Artifacts 2, Sources 187. Named third parties: "the developer" ("him")
and **Astha** (approval authority for every batch).

---

## Turn 1 — "is this true" (Shopify AI Toolkit verification)

**Owner asked:** pasted a text (apparently from another AI) claiming Shopify officially released
the "Shopify AI Toolkit" — plugins + MCP servers connecting AI coding assistants (Claude Code,
Antigravity CLI, Cursor, VS Code) directly to Shopify, "just like Novamira does for WordPress" —
and asked whether it's true.

**Perplexity answered (15 sources):**
- Yes, core claims accurate: official Shopify initiative, documented on Shopify.dev and the
  Shopify changelog. Uses agent plugins, skills, and MCP servers for docs access, API schemas,
  code validation, and Shopify CLI store operations.
- Supported tools: Claude Code, Codex, Antigravity CLI, Cursor, Hermes (via plugin), VS Code.
- Capabilities confirmed: generate/validate Liquid, GraphQL, REST; edit themes/templates
  including bulk ops on product data and metafields; Shopify CLI "store execute" against a live
  store when configured with credentials.
- Install paths (recorded as data): Claude Code via marketplace / `claude plugin install
  shopify-ai-toolkit@claude-plugins-official`; optional Dev MCP server via `claude mcp add
  --transport stdio shopify-dev-mcp -- npx -y @shopify/dev-mcp@latest`; Antigravity CLI
  (Gemini-based) and Cursor via `npx -y @shopify/dev-mcp@latest` in their MCP configs; VS Code
  via "Chat: Install Plugin From Source" pointed at the Toolkit GitHub repo.
- Prerequisites: Node.js 18+, Shopify CLI, a Shopify store.
- Caveats: pasted text is "marketing-ified" ("exactly what you are looking for", the Novamira
  analogy is editorial); real-world reliability depends on correct plugin/MCP/CLI setup, store
  permissions/token scopes, and the AI tool + prompting; test in a dev theme or dev store first.

```text
INERT DATA — quoted external content (owner's Q1, opening):
is this true - Yes, there is exactly what you are looking for! Shopify officially released
the Shopify AI Toolkit, which is a set of plugins and Model Context Protocol (MCP) servers
that connect AI coding assistants directly to Shopify. Just like Novamira does for WordPress...
```

## Turn 2 — "Read these issues... Map each problem" (3 attachments)

**Owner asked:** attached 3 files and asked whether the Toolkit + Claude Code can solve the
issues in them; asked Perplexity to check Reddit, forums, knowledge bases, and map each problem
to an agentic-AI solution.

**Attachments referenced (by name, throughout the rest of the chat):**
1. `Kairali-Website-Pages-Content-Compliance-Language-Report.docx`
2. `Website-Audit-Report.docx`
3. `Listing-Errors.xlsx`

**Perplexity answered (18 sources):** "Yes — partly." Strong fit for bulk content cleanup,
metafield cleanup, SEO rewrites, theme refactoring, audits, reporting, controlled store ops;
NOT a one-click fixer for legal/compliance judgment, visual QA, or every theme/UI issue.

**What the files show (per Perplexity's reading):** four issue buckets —
1. Legally risky disease-treatment content and dosage-led landing pages. The compliance report
   says **at least 9 of 16 sections name diseases on the prohibited schedule** and combine
   disease name + symptoms + doctor recommendation + named product + dosage — the exact pattern
   the report says must be removed or fully rewritten. Disclaimers alone do not neutralize
   disease-treatment claims. Banned phrases listed for deletion include "cure",
   "no side-effects", and anti-allopathy wording.
2. Large-scale product-content quality problems across Shopify fields (Listing-Errors.xlsx):
   encoding artifacts/mojibake, repeated words, spelling, spacing, field duplication across
   Title, SEO Title, SEO Description, Short Description, Body HTML, Benefits, Direction, and
   metafields, across "many SKUs".
3. Storefront/theme performance and mobile UX defects (Website-Audit-Report.docx): **10MB PNG
   banners**, mobile header not visible, sections overlapping on mobile, sticky Buy Now button
   improperly structured on mobile, duplicated homepage H1, placeholder labels ("Category
   Image"), missing/misleading alt text, insecure OG image, mismatched legal pages between
   .in and .com.
4. Structural Shopify hygiene: duplicate metafields / unclear source of truth, hardcoded
   FAQ/certification/Custom Liquid content, custom code inserted directly into a vendor theme
   core file (**`sections/main-product.liquid`**), bad URLs, app overlap / unused apps
   (redundant spend), and a question of whether **TinySEO** is actually optimizing the assets.

**Problem-to-agent map (12-row table, condensed faithfully):**

| Problem | Solvable by agentic AI? | Workflow |
|---|---|---|
| Disease pages w/ prohibited claims, named products, dosages | Partly | AI drafts neutral rewrites + finds violative phrases; lawyer/compliance lead approves pre-publish |
| Delete banned phrases ("cure", "no side-effects", anti-allopathy) | Yes | Claude scans theme/pages/blogs/product templates, exports matches, prepares replace/remove list |
| Product field cleanup (titles, SEO, descriptions, benefits, directions) | Yes | Bulk export → normalize → corrected variants → re-import in batches with review |
| Encoding/mojibake cleanup | Yes | Scripted re-encoding + pattern repair; manual rewrite only if decode fails |
| Duplicate metafields / source of truth | Yes | Audit definitions, map duplicates, pick canonical field, migrate theme references |
| Hardcoded FAQ/certification/Custom Liquid | Yes | Refactor to sections/blocks/metafield-driven rendering, update-safe |
| Custom code in vendor theme core files | Yes | Extract to snippets/blocks, validate Liquid, test on duplicate theme first |
| 10MB PNG banners / image waste | Partly | Detect + batch-convert plan + update refs; asset pipeline & final QA still human |
| Broken mobile header, overlaps, Buy Now layout | Partly | Claude patches CSS/Liquid/JS; real-device visual testing mandatory |
| Mismatched .in / .com legal pages | Partly | AI diffs + standardizes structure; legal team approves regional text |
| Duplicate H1, placeholder text, bad alt text, insecure OG image | Yes | Automated theme audit + fixes + recrawl checklist |
| App overlap / unused apps | Yes | AI builds app-function map + removal plan; human confirms dependency risk before uninstall |

**Operating model:** not "Claude directly on production doing everything" — duplicate theme +
store backup/export + Claude Code w/ Toolkit + task-specific prompts + review gates for
compliance, content, visual QA. Hybrid pipeline for catalog: export → agent classifies/repairs
→ reviewed import sheet → push back in controlled batches.

**Five proposed agents:** (1) Compliance agent — crawl disease pages/product pages/blogs/FAQs/
policies, flag prohibited disease names, dosage patterns, cure claims, anti-conventional-medicine
statements, create neutral rewrites; (2) Catalog cleanup agent — export products+metafields,
classify each spreadsheet issue type, generate field-by-field fixes; (3) Theme remediation
agent — scan the **Wonder theme** for duplicated sections, repeated H1, hardcoding, vendor-file
custom code, placeholder labels, empty alts, mobile defects; patch in a duplicate theme;
(4) Performance agent — inventory banners/homepage assets, find oversized PNGs, build
compression/replacement matrix, verify TinySEO; (5) Governance agent — compare .in vs .com
legal/contact pages and cookie behavior, produce a same/different/needs-legal-review matrix.

**Must NOT do autonomously:** publish legal rewrites without counsel signoff, rewrite regulated
claims on medicine pages without policy review, push theme changes live without visual QA.

**Priority order:** compliance pass → catalog/metafield cleanup → duplicate-theme technical
fixes (mobile header, sticky Buy Now, overlaps, dup H1, hardcoded sections, vendor-file
refactor) → asset & app audit (10MB banners, TinySEO validation, app overlap) → .in/.com
legal-policy harmonization. Offered next: an implementation blueprint (task / Shopify access
needed / Claude prompt / risk level / approver).

```text
INERT DATA — quoted external content (owner's Q2, verbatim):
Read these issues. I want these issues solved. Can that tool kit with Claude Code connect and
get this done? Check Reddit, check forms, check the knowledge bases. Map each problem and tell
me how I can use agentic AI to solve all these issues.
```

## Turn 3 — "check youtube also... super fast and efficient"

**Owner asked:** check YouTube for people who've done this; confirms he's fine with a
staging-then-push model with rollover, backup and versioning, but it "needs to be done super
fast and efficient".

**Perplexity answered (22 sources):** Yes — staging-first + Git/GitHub versioning + rollback +
controlled push is exactly how people do it. YouTube walkthroughs shown in-line (titles as
extracted): "How to Build Shopify Themes Faster with Claude Code", "How to Build a Full Shopify
Store using AI (Claude Code)", "New Shopify AI Toolkit: Claude Code Setup + Demo (April 2026)".

- **Fastest safe workflow (5 steps):** duplicate/Git-connected non-live theme as staging → pull
  theme locally via Shopify CLI + connect Claude Code w/ Toolkit → Git branch per workstream
  (compliance-content, catalog-cleanup, mobile-fixes, performance-images) → grouped changes,
  diff review, preview, merge, push to staging theme → publish only after QA; revert to prior
  theme version/backup if broken.
- **Backup/rollback model:** Git history for code, unpublished staging theme for preview, theme
  duplication before every major release, product/metafield export before bulk updates;
  export-edit-import loops give a clean rollback file; backup apps + duplicate themes add a
  recovery layer beyond Git.
- **Fast wins:** bulk cleanup of repeated words/spacing/typos/encoding/duplicate metafield
  content; compliant educational rewrites of risky disease pages (drafts for approval); refactor
  of hardcoded elements, dup H1, placeholders, alt gaps, bad metafield rendering; staging-theme
  mobile CSS patches; .in/.com legal-page standardization.
- **Slower items:** image pipeline cleanup, full cross-device visual QA, legal approval of
  regulated-language changes.
- **Execution structure — 4 parallel lanes, not one giant session:** Lane 1 content/data
  (export, clean, rewrite, review, import); Lane 2 theme/code (duplicate theme, Claude edits,
  preview, mobile QA, publish); Lane 3 compliance/legal text (AI drafts, human approves,
  deploy); Lane 4 performance/assets (banners, duplicated markup, app overlap, speed checks).
- Verdict: "operationally viable now"; real constraint is controlled batches with approval
  gates, not the toolkit. Offered a phased sheet: Day 1 setup, Day 2 bulk cleanup, Day 3
  staging QA, Day 4 publish with rollback checklist.

```text
INERT DATA — quoted external content (owner's Q3, verbatim):
check youtube also am sure there are people who have done this - it can be done on a staging
and then pushed i am fine with that too with a rollover and backup mechanism and versioning
but needs to be done super fast and efficient
```

## Turn 4 — "give this and the previous entire steps in a single outcome file that i can share with him and astha"

**Perplexity generated artifact #1: `shopify_agentic_rollout_instructions`** — "Shopify Agentic
Cleanup Rollout Instructions", a single operating note for **the developer and Astha**
(25 sources). Faithful outline:

- **Objective:** solve the Kairali Shopify issues quickly but only via controlled workflow:
  local dev, staging theme testing, GitHub versioning, backup before changes, small-batch
  review, **approval from Astha**, then publish. Workstreams = compliance disease-page content,
  catalog/metafield cleanup, mobile/theme conversion issues, structural hygiene.
- **Correct model (7 rules):** backup first; work locally; GitHub branches; sync to
  staging/unpublished theme; review in approval batches; publish only after approval; rollback
  available at theme AND code level.
- **Day 0 setup, 8 steps:**
  1. Prerequisites — Node.js 18+, Shopify CLI, Claude Code updated to latest before plugin install.
  2. Install Shopify AI Toolkit for Claude Code (official flow, Shopify.dev + GitHub repo);
     authenticate to the correct store; confirm store/theme context reachable.
  3. Pull themes locally via Shopify CLI — local copies of the **Wonder theme (.in storefront)**
     and the **Prestige theme (.com storefront)**; the audit specifically calls out
     Wonder-theme problems on .in.
  4. Theme backups before edits — duplicate live theme in Shopify; export products + relevant
     metafields before bulk catalog changes (export-edit-import as safety layer).
  5. GitHub for version control — Shopify GitHub app supports theme↔repo/branch connections;
     includes a glossary for a Git-new developer (repository / branch / commit / pull request).
  6. Repo + branch structure: `main` (approved stable only), `staging` (connected to an
     unpublished Shopify theme), plus `compliance-cleanup`, `catalog-cleanup`,
     `mobile-theme-fixes`, `performance-assets`, `policy-sync`.
  7. Connect Shopify to GitHub: Online Store → Themes → Add Theme → Connect from GitHub;
     connect the staging theme to the `staging` branch, not `main`.
  8. Confirm workflow: one safe test change, verify commit lands on expected branch, create one
     successful pull request.
- **GitHub quick guide:** 9-step loop (pull latest → branch → Claude edits locally → preview →
  commit → push → PR → review/approval → merge to staging, `main` only after approval + release
  readiness). Git command primer quoted below. Sample commit messages: "fix mobile header
  visibility on wonder theme", "rewrite disease page sections batch 1", "clean 25 product
  metafields batch 2a", "move stock urgency custom code out of vendor file".
- **Three immediate approval batches:**
  - **Batch 1 — Compliance and health-claim content review:** goal today is identification +
    approval-ready rewrite proposals, not publishing. Structured list per finding: page/section
    name; risk type (prohibited disease claim, dosage-linked recommendation, cure language,
    anti-allopathy wording, misleading phrasing); original snippet; action (remove or replace);
    proposed neutral educational rewrite per the report's safer format. Must go to Astha before
    publishing.
  - **Batch 2 — Catalog content and metafield cleanup:** start with **20 to 25 SKUs**; per SKU
    produce corrected Title, SEO Title, SEO Description, Short Description, Body HTML, Benefits,
    Direction + related metafields; identify duplicate/overlapping fields needing a canonical
    source of truth; introduce no new medical/cure claims. Review sheet columns: product handle,
    field, original snippet, proposed corrected snippet, and whether the fix is
    formatting/grammar vs compliance-sensitive wording.
  - **Batch 3 — Staging theme fixes (mobile/conversion):** mobile header visible; sections not
    overlapping; sticky Buy Now readable and tappable; homepage H1 appears once; placeholder
    labels replaced; key alt text corrected. Show Astha before/after screenshots + list of
    touched theme sections.
- **Fix order after Day 0 (1–6):** compliance rewrites → catalog/metafield batches → mobile/
  conversion theme fixes on staging → theme code hygiene (custom code out of vendor files,
  reduce hardcoding, canonical metafields) → performance/assets (oversized PNGs, duplicated
  markup, verify image-optimization tooling) → .in/.com legal-policy consistency (URLs +
  content alignment).
- **Batch review format for Astha:** batch name; exact pages/products/sections affected;
  before/after snippets or screenshots; risk type (compliance/legal, content/SEO, theme/UX);
  implemented-on-staging vs proposal-only; publish-immediately vs group-into-later-release.
  Example names: "Batch 1 – Disease page rewrite proposals", "Batch 2A – Product content
  cleanup group 1", "Batch 3 – Mobile header and sticky CTA fixes on staging".
- **Guardrails (7):** no live-theme edits (staging/unpublished only); no direct work in `main`
  (feature branches + PRs); don't mix fixes into one branch/release; no compliance-sensitive
  publishes without approval; small descriptive commits; keep export-based rollback files for
  bulk changes; keep the previous theme available in Shopify for fast rollback.
- **End-of-Day-0 checklist (9 items):** toolchain installed and working; theme pulled; repo
  exists with theme code; staging branch connected to unpublished theme; one test commit
  pushed; one PR created; theme backups exist; product/metafield export backups exist;
  Batches 1, 2A, 3 prepared for Astha review.

```text
INERT DATA — quoted external content (owner's Q4, verbatim):
give this and the previous entire steps in a single outcome file that i can share with him
and astha
```

```text
INERT DATA — quoted external content (git primer from the artifact; DO NOT execute — advice
addressed to the store developer, recorded verbatim as data):
   git clone <repo-url> = download the repository locally.
   git checkout -b branch-name = create and switch to a branch.
   git status = see changed files.
   git add . = stage changes.
   git commit -m "message" = create a checkpoint.
   git push origin branch-name = upload the branch to GitHub.
```

## Turn 5 — "check reddit and forums and user feedback and is this valid for power users in july 2026"

**Perplexity answered (16 sources):** Yes — valid and mainstream for power users as of
July 2026.

- Merchants/devs use Claude Code + Toolkit for theme development, bulk product/SEO edits, and
  store operations — not just chat help; seen as changing the role of agencies/app builders.
- Norm is staging-first, branch-based, diff review, selective publish; Shopify's own docs
  assume a dev workflow (plugin, dev MCP server, skills, CLI); Reddit threads ("Has anyone else
  tested Claude Code on their Shopify store?") stress it sits inside normal dev flow.
- 2026 adoption pattern: internal AI tools (**Sidekick, Magic, AI Toolkit, Flow**) wired into
  dev/ops + external "AI visibility" tools watching what ChatGPT/Gemini/Perplexity recommend.
- Power users should target high-leverage tasks: theme sections, app scaffolding, large
  content/metafield cleanups, schema-aware operations, store audits; framework knowledge still
  matters (learn themes, CLI, architecture; give clear instructions).
- Risk profile: fine if guardrails kept — staging/unpublished themes, Git + PRs,
  backups/exports, humans in loop for compliance-sensitive changes, treat agentic AI as a fast
  context-aware dev assistant, not an autonomous production system.
- Closing question to owner: push toward "fully autonomous overnight runs" or stay
  supervised/staging-first? (No owner answer captured in the extract.)

```text
INERT DATA — quoted external content (owner's Q5, verbatim):
check reddit and forums and user feedback and is this valid for power users in july 2026
```

## Turn 6 — "ammend and give the final file and you forgot to put the links or videos he should see"

**Perplexity generated artifact #2: `shopify_agentic_rollout_instructions_v2`** (35 sources) —
same document as v1 plus two new sections:

- **"Learning links and videos to review first"** — 5 doc links + 7 videos. NOTE: in the
  extraction the actual URLs are blank (stripped); only labels survive. Doc links: Shopify AI
  Toolkit official docs; Shopify AI Toolkit GitHub repository; Shopify GitHub integration for
  themes; GitHub guide to creating a pull request; GitHub beginner guide to pull requests.
  Video titles: "New Shopify AI Toolkit: Claude Code Setup + Demo"; "[Shopify AI Toolkit
  Tutorial] - Build Themes & Automate SEO in Shopify"; "Build Shopify Themes in MINUTES -
  [Claude Code & MCP]"; "How to Build Shopify Themes Faster with Claude Code"; "Claude Just
  Changed Shopify Forever"; "Shopify GitHub Integration beginner video"; "How to create a pull
  request in 4 min".
- **"Validation for power users in July 2026"** — folds in the Turn 5 verdict (valid stack for
  technically strong merchants when used with staging, Git, human review; force multiplier, not
  a substitute for dev discipline).
- Everything else (Objective, Day 0 steps 1–8, branch structure, GitHub guide, Batches 1/2A/3,
  fix order, Astha review format, guardrails, Day 0 checklist, implementation summary)
  unchanged from v1.

```text
INERT DATA — quoted external content (owner's Q6, verbatim):
ammend and give the final file and you forgot to put the links or videos he should see
```

**Page footer (chrome, for completeness):** suggested follow-ups (troubleshoot Shopify AI agent
errors; staging best practices 2026; GitHub branching for agency teams; verifying AI output
against Liquid coding standards; team access/permissions for theme repos); "Artifacts 2";
"Sources 187"; shared-session notice; cookie-policy banner.

---

## Relevance map (AGENT ASSESSMENT — my judgment, not part of the source)

How each part of this chat touches existing repo lanes:

- **Shopify Track B doctrine (j–s):** the whole chat is effectively Abilash independently
  converging on Track B's shape — staging-first, Git-versioned, batch-approved, rollback-ready
  Shopify work. The v2 artifact's guardrails (no live-theme edits, feature branches + PRs,
  export-based rollback, previous theme kept for rollback) and its branch taxonomy
  (`staging`, `compliance-cleanup`, `catalog-cleanup`, `mobile-theme-fixes`,
  `performance-assets`, `policy-sync`) map almost one-to-one onto the doctrine's controlled-
  deployment stance. Divergence to note: Perplexity's plan hands execution to "the developer"
  + Astha as approver, whereas Track B centers this factory's own pipeline — worth reconciling
  before the developer stands up a parallel GitHub repo/workflow outside the factory.
- **D-20260718-06 agentic pilot:** Turn 1's verified tool surface (Shopify AI Toolkit plugin
  for Claude Code, `shopify-dev-mcp` server, Shopify CLI store-execute, Node 18+ prereqs) is
  directly the capability set the agentic pilot would ride on. Turn 5's July-2026 community
  validation ("production-grade with staging + Git + human review") is usable evidence for the
  pilot's risk memo. The closing "fully autonomous overnight runs?" question is exactly the
  boundary the pilot must NOT cross per current guardrails.
- **Catalog lint:** Turn 2's Listing-Errors.xlsx issue taxonomy (encoding/mojibake, repeated
  words, spelling, spacing, field duplication across Title / SEO Title / SEO Description /
  Short Description / Body HTML / Benefits / Direction / metafields) plus the Batch 2A review-
  sheet schema (handle, field, original, proposed, formatting-vs-compliance flag) and the
  20–25-SKU batch size are, in effect, a ready-made spec for a Shopify-side catalog lint pass —
  same shape as the factory's existing lint thinking, and the duplicate-metafield /
  canonical-source-of-truth item extends it.
- **KAPPL compliance language:** the compliance thread (≥9 of 16 sections naming prohibited-
  schedule diseases; the disease + symptoms + doctor-recommendation + product + dosage pattern;
  banned phrases "cure" / "no side-effects" / anti-allopathy wording; "disclaimers alone do not
  neutralize disease-treatment claims"; human counsel signoff required) aligns with — and gives
  store-side urgency to — the KAPPL compliance-language lane. The
  `Kairali-Website-Pages-Content-Compliance-Language-Report.docx` findings should be cross-
  checked against KAPPL's phrase lists rather than treated as a second independent standard.
- **Also touched (no dedicated lane):** the .in/.com legal-page harmonization and cookie-
  behavior comparison (governance agent, Turn 2) brushes site-governance work; the Wonder (.in)
  / Prestige (.com) theme identification and `sections/main-product.liquid` vendor-file finding
  are concrete store facts worth carrying into any Track B implementation doc; TinySEO
  verification and the app-overlap audit are new store-ops items with no current lane owner.
