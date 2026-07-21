---
report_id: RPT-20260721-AMBUJ-VOICE-PROFILES
date: "2026-07-21 19:35:00 IST"
task: "D-20260721-13 — build Ambuj's requested JSON author-voice profiles from docs/sops/author-voices.md, adversarially verify fidelity, deliver via Drive, stage the reply draft with the scope question"
project: "OS v2 / web factory"
source_tool: "claude-code + workflow (10 builders + 10 adversarial verifiers)"
type: milestone-build
supersedes: null
---

# Ambuj voice profiles — built, verified, delivered (draft staged)

## What he asked (16:41 IST, thread 19f844f3326f7ce4)

Author/doctor profiles in a JSON voice schema (role, audience, tone, style booleans,
common/disliked phrases, always-include/avoid, samples, badExample, complianceBrandRules) —
he is wiring an AI content pipeline. Owner ruled via AskUserQuestion: **Build + stage, ask scope.**

## How it was built (the method is the point)

1. **10 builder agents**, one per author, each converting one voice block of
   `docs/sops/author-voices.md` into the schema under hard no-invention rules.
2. **10 adversarial verifier agents**, one per profile, hunting inventions (anything not
   traceable to the doc) and omissions (doc content dropped). **Result: 0/10 passed clean —
   the pass earned its cost.** Roshni's profile was outright unfaithful (invented role claim,
   phantom source reference); four systematic defects ran through all ten (minted slugs
   replacing the doc's real handles · 'Best for' topic lists recast as audience claims ·
   the guardrails-supremacy clause dropped · the byline-routing rule dropped).
3. **Deterministic assembly fixes** applied every catch: doc handles as slugs; audience
   fields labeled as derived; badExample prefixed `[CONSTRUCTED …]`; supremacy + routing +
   governance rules appended to every profile; per-author corrections (Deepu John warm=true
   per "reassuring"; Ashikha warm/practical=true per the doc's own words + the Ashikha-spelling
   MUST-FIX noted; Abilash's two real sourced lines restored after the builder returned [];
   Roshni rebuilt). Gita's 3 samples verified verbatim-in-doc.

## Delivery (verified)

- Drive subfolder **author-voice-profiles-v1** (1qbf0_CfoWxRUhGPEaXzFueVJtAJq7nhG) inside
  Ambuj's folder: README.json + 10 per-author JSONs.
- **Integrity:** 11/11 exact byte-size matches; roshni.json (highest-correction file)
  downloaded back and sha256-verified IDENTICAL.
- Reply draft **r3410382991035568919** staged for the owner's click: delivery + three
  binding rules (compliance-overrides-voice as a hard constraint · physician content needs
  the byline AND Dr. Deepu John's sign-off in ANY pipeline · view-only/internal) + the
  scope question (what the project publishes, where, and whether doctors' names appear)
  gating physician-byline use.

## Warts (on the record)

- A first `create_file` call shipped placeholder text instead of content: an **11-byte junk
  file** `author-voice-profiles-v1-2026-07-21.json` sits in Ambuj's folder — the Drive
  toolset has no delete; added to the owner's existing delete-later sweep (6th file). The
  draft tells Ambuj to ignore it.
- The classifier blocked mid-wave Drive writes once; owner approved and the wave completed.
- The notification mail had gone out ×3 (16:27/17:09/17:52 IST — stale drafts each clicked);
  harmless duplicates, noted so nobody re-derives it.

## Dispositions

- The adversarial verify caught a false profile and four systematic defects that a single
  build pass would have shipped to a physician-identity artifact — **IMPLEMENT** (done: the
  build→verify→deterministic-fix pattern is this report; reuse it for any generated artifact
  that models a real person)
- The 11-byte placeholder file is the create-then-verify lesson inverted: verification after
  EVERY write, including the first — **IMPLEMENT** (done: every subsequent write was
  size-checked and the riskiest sha256-diffed; the standing Drive caution already covers it)
- docs/sops/author-voices.md line 148 records the ChatGPT once-over as DONE 18 Jul — the
  session memory still said pending — **MONITOR** (home: BACKLOG — memory truth-up row: fix
  the kairali-author-voices memory this session-close; rule: the repo outranks memory on
  recorded state)
