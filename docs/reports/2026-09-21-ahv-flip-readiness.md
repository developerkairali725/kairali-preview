# AHV — flip readiness, measured

_Generated 2026-09-21 from `scripts/matrix-walk.mjs` and `gates/registry.yaml`. Machine-derived —
re-run the walk rather than hand-editing this file._

## The verdict, and it is not my opinion

```
DO-NOT-SHIP — 50 blocking gates unproven, 1 unrepaired void
```

The walk's own words, worth keeping: *the site may well be fine; that is not the claim being
tested. The claim being tested is whether anyone can SHOW the steps were taken.*

So this is not a list of things that are broken. It is a list of things nobody can yet prove. Some
will pass the moment they are run. The point is that none of them has been.

**Scope:** 77 gates in the registry, **64 required for an organic site**, 47 of them blockers.
26 automated · 29 agent · 9 human. 46 built · 9 partial · 9 planned.

## The one fact that governs all of this

**No machine gate can become ship evidence unless a GitHub Actions job commits its verdict.**
Not my reading — `scripts/lib/verdict.mjs`, the module that owns the contract:

```js
if (v.runner === "local") {
  p.push('runner "local": a local run has no CI provenance, so it is
          iteration evidence, not ship evidence (§0.2)');
}
if (!prov.isCi) {
  p.push('the verdict was last committed by "..." — a human or agent edit,
          not a CI job. A hand-authored verdict is a .md file in a
          different costume (§0.2)');
}
```

The file says plainly why: *"Forging a clean matrix walk required writing one JSON file."* Rule 5 —
committed by CI — is the one that makes the other four mean anything, and it is the rule an agent
cannot satisfy on its own. Correctly so.

**Consequence, and it is the whole picture:** every machine gate on this list is blocked on GitHub
Actions running, and Actions is blocked on the missing payment method. Fixing billing does not
merely unblock PR #309 — it unblocks the entire proof chain. Until then the ledger reads
DO-NOT-SHIP no matter how good the site gets, and no amount of local work moves it.

**What is NOT blocked:** the site itself. Content, images, missing elements, SEO, schema, design
wiring — all of that is the work that makes the gates pass *when* CI finally runs, and none of it
needs CI to be done. That is what the loop is working on.

**HUMAN gates are the exception** — they require a person's commit and are explicitly NOT allowed
to be CI-signed: *"a machine cannot sign for a person."*

## Who can clear what

| bucket | count | meaning |
|---|---|---|
| **Script** | 16 | a command is named — but only **2** of those scripts exist; 7 were never built and 3 are CI jobs |
| **External AI** | 12 | a GPT / Perplexity pass over a real input artifact |
| **No machine assigned** | 15 | agent judgement or a decision — no runner exists yet |
| **Human** | 8 | owner or Deepu signature, cannot be delegated |

**43 of 51 are the agent's to clear. 8 are not.**

### Script — runnable now
| gate | stage | enforcing command |
|---|---|---|
| `G0-PRE` | S0 | ``scripts/protection-map-lint.mjs`` |
| `G1-PRE` | S1 | ``scripts/brief-lint.mjs`` |
| `G2-CITE` | S2 | ``scripts/cite-resolve.mjs`` |
| `G2-PRE` | S2 | ``scripts/dossier-lint.mjs`` |
| `G3-PRE` | S3 | ``scripts/keyword-validate.mjs + scripts/seed-lint.mjs`` |
| `G4-PRE` | S4 | ``scripts/business-case-lint.mjs`` |
| `G5-PRE` | S5 | ``scripts/sitemap-gate.mjs`` |
| `G6-CITE` | S6 | ``scripts/cite-resolve.mjs`` |
| `G6-LINT` | S6 | ``scripts/content-lint.mjs`` |
| `G6-PRE` | S6 | ``packages/compliance/bin/lint.js + scripts/claims-lint.mjs`` |
| `G7-PRE` | S7 | ``brand-lint.js + factory spec A4 + scripts/a11y-gate.mjs`` |
| `G7-PROC` | S7 | ``scripts/design-review/PROMPT.md (agent-run)`` |
| `G8-PRE` | S8 | ``gate.yml + factory-gate.yml`` |
| `G8-REVIEW` | S8 | ``code-review stage`` |
| `G8-SEC` | S8 | ``gate.yml security-review job`` |
| `G11-FLEET` | S9 | ``scripts/fleet-redirect-check.mjs`` |

### External AI — needs a key and a real input artifact
| gate | stage | enforcing command |
|---|---|---|
| `G0-FACT` | S0 | ``scripts/audit-perplexity.mjs`` |
| `G2-PROC` | S2 | ``scripts/audit-gpt.mjs`` |
| `G3-FACT` | S3 | ``scripts/audit-perplexity.mjs --raw`` |
| `G3-PROC` | S3 | ``scripts/audit-gpt.mjs`` |
| `G4-PROC` | S4 | ``scripts/audit-gpt.mjs`` |
| `G5-FACT` | S5 | ``scripts/audit-perplexity.mjs --raw`` |
| `G5-PROC` | S5 | ``scripts/audit-gpt.mjs`` |
| `G6-FACT` | S6 | ``scripts/audit-perplexity.mjs --raw`` |
| `G6-PROC` | S6 | ``scripts/audit-gpt.mjs`` |
| `G7-ADV` | S7 | ``scripts/audit-gpt.mjs`` |
| `G9-FACT` | S9 | ``scripts/audit-perplexity.mjs --raw`` |
| `G9-PROC` | S9 | ``scripts/audit-gpt.mjs`` |

### No machine assigned — agent judgement or a decision
| gate | stage | enforcing command |
|---|---|---|
| `C2-TIER` | S1 | — |
| `C2-SCHEDULE` | S3 | — |
| `C1-FORM` | S5 | — |
| `C2-MARKET` | S5 | — |
| `C5-POLICY` | S5 | — |
| `C1-ART9` | S6 | — |
| `C3-REVIEW` | S6 | — |
| `C3-SCHEMA` | S6 | — |
| `C3-STALE` | S6 | — |
| `C7-LOCK` | S6 | — |
| `C1-BANNER` | S7 | — |
| `C4-AXE` | S7 | — |
| `C4-CONTRAST` | S7 | — |
| `C4-TARGET` | S7 | — |
| `C1-PRECONSENT` | S9 | — |

### Human — owner or Deepu
| gate | stage | enforcing command |
|---|---|---|
| `G1-HUMAN` | S1 | — |
| `G4-HUMAN` | S4 | — |
| `G4-HUMAN-2` | S4 | — |
| `G5-HUMAN` | S5 | — |
| `G6-HUMAN-A` | S6 | — |
| `G6-HUMAN-B` | S6 | — |
| `G7-HUMAN` | S7 | — |
| `G9-HUMAN` | S9 | — |

## The void

`G6-BUILD` is VOID: it passed, but it judged work built on an approval that no longer holds, so
its PASS does not count. A voided gate is normal; an unrepaired one is the failure. It sits
downstream of 22 earlier gates — clearing those repairs it.

## Already true, and not in the unproven list

Measured today:

- structured data on **254 of 254** routes, one valid `@graph` each
- full route sweep: **508 states, 458 pass, 0 new failures** against baseline
- `chat-bubble-lint`, `front-gate`, `factory-matrix-lint`, `launch-evidence-gate`,
  `footer-socials-lint`, `cta-label-lint`, `class-map-lint`, `gate-registry-lint`,
  `evolution-lint`, `doctor` — all PASS, and for the first time they are genuinely running:
  28 scripts had been exiting 0 having checked nothing on this checkout

## Known FAILING, not merely unproven

- `banned-string-lint` — exit 2, the locked-facts set
- `report-store-lint` — **21 violations**, surfaced today when the guard bug was fixed
- `honest-ymyl-content-lint` — missing `answersQuestion`, which §4b.3 marks REQUIRED

## Images — the owner's standing complaint, quantified

1,716 distinct images across 254 routes; **1,459 appear on exactly one route**, so the tail is not
recycled. The offenders are specific: four `travel/` photographs on **131 routes each** and one
`gallery/` image on 79. Against a **70 GB / 2,675-file** library at
`/Volumes/Extreme SSD - Blue 2nd/Kairali-Image-Library` including a `ktahv-shoot-2025/` folder.
That block is the thing that reads as lazy, and it is fixable.

## The only permitted exception

Forms and the enquiry endpoint are Deepu's. Everything else is in scope.
