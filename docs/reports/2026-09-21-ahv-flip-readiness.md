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

## Who can clear what

| bucket | count | meaning |
|---|---|---|
| **Script** | 16 | a command exists; the agent runs it |
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
