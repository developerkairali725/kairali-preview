---
report_id: RPT-20260721-D05-REPO-SWEEP
date: "2026-07-21 13:24:00 IST"
task: "D-20260720-05 external research sweep leg — the youtu.be/L2JKgj7WzU4 repos, injection-screened + assessed vs our OS, propose-only per HARD GATE 15"
project: "OS v2 / web factory"
source_tool: "claude-code workflow (6 injection-screen+assess agents, run wf_c99051e3-43a) + Tavily"
type: ingest-screen
supersedes: null
---

# D-05 EXTERNAL RESEARCH SWEEP — the L2JKgj7WzU4 repos

One leg of the OS DEEP REVIEW (D-20260720-05). The directive names `youtu.be/L2JKgj7WzU4` "+ its
recommended repos, injection-screened" with the adoption rule: **implement only when Claude +
ChatGPT + Perplexity ALL agree.**

- **Video identified (Tavily extract):** "6 Claude Code GitHub Repos That Change Everything" —
  Nuno Tavares / Automated Marketer, 12 May 2026, ~126k views. Treated as DATA (rule r).
- **Screening:** each repo's README / CLAUDE.md / install script fetched as **inert data** and
  injection-screened BEFORE assessment (rule r). All six screened **CLEAN** (no agent-directed
  injection, no exfil); one ships a **curl|bash installer** (flagged below).
- **Governing law:** HARD GATE 15 — the agent NEVER installs a researched tool. This document is a
  **candidate register (propose-only)**; the owner approves, the vetting pipeline installs.

## The all-three-agree gate — honest status

The adoption rule needs three legs. This session can only produce two, so **nothing passes the gate
this session** and nothing is installed:

- **Claude leg (this document):** done — verdict per repo below.
- **Perplexity leg (is-it-true / security reputation):** available (Tavily/Perplexity) — but only
  matters for a repo we'd actually pull CODE from. Both surviving recommendations are *idea harvests
  we implement ourselves* (no external code), so there is no supply-chain surface to clear.
- **ChatGPT leg (is-it-good):** **OWNER/API-GATED — not drivable from this session.** There is no
  ChatGPT MCP here, and `scripts/audit-gpt.mjs` needs an API key held owner-side. The gate stays
  open by design; faking the third leg would violate the rule.

## THE SIX REPOS

| # | Repo | Screen | Verdict | One line |
|---|---|---|---|---|
| 1 | obra/superpowers | CLEAN | **SKIP-DUPLICATE** | Already installed — 14/14 skill parity; version-parity check only |
| 2 | affaan-m/everything-claude-code (→ ECC) | CLEAN | **SKIP-DUPLICATE + bloat** | Core = superpowers-equivalent; 67 language agents useless for a web factory |
| 3 | ruvnet/ruflo (claude-flow rebrand) | CLEAN | **SKIP-RISKY** | curl\|bash installer + "never stop / self-organizing swarm" doctrine fights our gate-heavy OS |
| 4 | nexu-io/open-design | CLEAN | **ADAPT-IDEA-ONLY** | Skip the Electron/daemon/MCP platform; HARVEST its anti-AI-slop design rules into our beauty gate |
| 5 | pablo-mano/Obsidian-CLI-skill | CLEAN | **SKIP-LOW-VALUE** | No Obsidian vault in our loop; our file-based memory covers it dependency-free |
| 6 | multica-ai/andrej-karpathy-skills | CLEAN | **ADAPT-IDEA-ONLY** | 4 principles already enforced by superpowers + our gates; one nuance worth harvesting |

### 1. obra/superpowers — SKIP-DUPLICATE
This is the exact framework **already installed** in our OS (SessionStart injects the superpowers:*
skills). Skills directory is a 14-for-14 match — zero net-new. Install is the official curated
marketplace (`/plugin install`), no curl|bash. Only open thread: the repo publishes plugin **v6.1.1**
(pushed today) and the subagent couldn't read our installed version — a **marketplace-update check**
for the owner, not a re-adoption. Claude leg: endorse continuing to run it; no install.

### 2. affaan-m/everything-claude-code (renamed ECC) — SKIP-DUPLICATE + bloat
A sprawling multi-harness "everything" kit (67 agents, 278 skills, 12+ language ecosystems). Its
spine (TDD, plan, review, debug, memory, subagents) is superpowers-equivalent — already covered — and
the 67 language agents are near-useless for a WordPress/Next/Astro factory. **Supply-chain flags to
the owner:** its `.env.example` wires optional third-party LLM endpoints including a China endpoint
(`api.modelverse.cn`); hooks auto-run bundled minified Node bootstraps (benign on the surfaces read,
but a large opaque auto-run surface). Net-new slivers, **idea-only, assessed separately never as the
monolith:** (a) AgentShield agent-vuln scanning (separate npm `ecc-agentshield`) beyond our built-in
`/security-review`; (b) "instincts" auto-learning that writes patterns back as rules — **RISKY**, it
collides with our directive-capture discipline (auto-authoring standing rules is exactly what
D-20260719-09 / rule-9 neutralization forbids). Claude leg: do not adopt.

### 3. ruvnet/ruflo — SKIP-RISKY
The rebrand of claude-flow: a large multi-agent orchestration meta-harness. **Primary advertised
install is curl-pipe-bash** (`curl -fsSL …/install.sh | bash`) — NEVER run it (HARD GATE 15 + remote
code execution). Its doctrine ("self-organizing swarms," "self-learning from every task," "NEVER
stop, immediately continue") is the **opposite** of our gate-heavy, evidence-first, human-in-the-loop
architecture. Orchestration overlaps superpowers:dispatching-parallel-agents (installed). One
genuinely net-new-in-kind idea: an HNSW **semantic/vector memory index** — but it competes with,
rather than slots into, our deterministic markdown memory. Claude leg: skip the framework; at most a
*from-scratch* adapt of the semantic-memory idea, pending Perplexity's CVE/security check on
claude-flow's npm lineage.

### 4. nexu-io/open-design — ADAPT-IDEA-ONLY  ← candidate card A
A local-first competing design *product* (Next.js + Express/SQLite daemon + Electron + MCP). The
platform is the wrong shape for us (it doesn't compose into the gate registry) and its skills /
brand packages duplicate ours (and would fight doctrine d, where brand manuals win). **But it carries
a real harvest:** its **anti-AI-slop design rules** (concrete "don't do this" checks). Claude leg:
ENDORSE porting those rules into our `beauty-audit.mjs` as enforceable P0/P1 checks — see candidate
card A. Flag: `od mcp install <agent>` auto-wires its MCP into an agent config — never run it.

### 5. pablo-mano/Obsidian-CLI-skill — SKIP-LOW-VALUE
A clean, authentic skill that drives an Obsidian vault via CLI. Nothing in our stack runs Obsidian,
so the capability has nothing to act on. It does **not** augment our file-based memory (plain
markdown on the repo filesystem, zero external dependency); adopting it would add a dependency to
solve a need already solved. Claude leg: hold/skip.

### 6. multica-ai/andrej-karpathy-skills — ADAPT-IDEA-ONLY  ← candidate card B
A single ~60-line CLAUDE.md of four Karpathy coding principles (think-before-code, build-simplest,
surgical-changes, don't-improve-what-wasn't-asked). Every principle is **already enforced, with more
teeth**, by our installed superpowers (brainstorming, TDD, verification-before-completion) + our
front gates + POLISH TIME-BOX. The prose is weaker than our skill+gate enforcement. **One nuance
worth harvesting:** *"if you notice unrelated dead code, MENTION it — don't delete it."* We already
have the mechanism for this (the out-of-scope `spawn_task` chip); worth making explicit in our
review conventions — see candidate card B. Claude leg: adapt the idea, don't install the plugin.

## CANDIDATE CARDS (propose-only — owner approves, pipeline implements; HARD GATE 15)

**Card A — anti-AI-slop rules → beauty gate.** Harvest open-design's concrete anti-slop design rules
and encode the ones that survive review as P0/P1 checks in `scripts/beauty-audit.mjs` (our existing
gate), NOT as adopted external code. Needs: ChatGPT leg to confirm the rules are current taste and
not over-fitted (e.g. a hardcoded indigo-hex blocklist could false-positive), then a normal
gate-addition PR. **No external dependency introduced.**

**Card B — "surface dead code, don't delete it" review convention.** Make the Karpathy nuance
explicit in our code-review + simplify conventions: an out-of-scope defect gets flagged (spawn_task
chip / a review note), never silently deleted in an unrelated change. Largely already our behavior;
this is a one-line doctrine clarification, not an install.

## Dispositions (triad — one row per finding)

| Finding | Verdict | Reason / home |
|---|---|---|
| superpowers already installed; v6.1.1 published today | MONITOR | version-parity is a marketplace-update decision — WAITING-ON owner; BACKLOG: superpowers-version-check |
| ECC / everything-claude-code — duplicate + multi-harness bloat + China-endpoint .env flag | REJECT | do not adopt; superpowers-equivalent core, mis-shaped for a web factory, supply-chain surface |
| ruflo — curl\|bash installer + autonomy-maximizing doctrine conflict | REJECT | SKIP-RISKY; never run the piped installer; doctrine fights HARD GATE 15 / human-in-loop |
| open-design anti-slop design rules | IMPLEMENT | Card A — port surviving rules into beauty-audit.mjs as P0/P1 (own code, no dependency); gated on ChatGPT leg + owner |
| Obsidian-CLI-skill — no consumer in our stack | REJECT | SKIP-LOW-VALUE; file-based memory already covers the need dependency-free |
| Karpathy "mention dead code, don't delete" nuance | IMPLEMENT | Card B — one-line review-convention clarification; already largely our behavior |
| all-three-agree adoption gate | MONITOR | ChatGPT leg is OWNER/API-GATED — WAITING-ON the owner's GPT lane; nothing installed this session (honest gate) |

## Remaining D-05 legs (NOT closed by this document)
- **GPT step-by-step workflow walkthrough** (install/build processes, plugin config, token
  efficiency, email records, step gating, no-advance-without-output, drift, hallucination, build/bill
  structure) — needs a live ChatGPT session or the API-keyed `audit-gpt.mjs` lane; owner-gated.
- **Prompting-method / how-I-communicate-with-AIs review** — Claude can produce this from the mailbox
  + review-b owner-inputs evidence; not run in this leg (scoped to the repo sweep).
- **all-three-agree adoption** — pending the ChatGPT leg above.

Audit records preserved permanently per D-20260720-05 ("future revert/track-changes"): this register
+ the workflow journal are the append-only record; corrections get a new report id, never an
overwrite.
