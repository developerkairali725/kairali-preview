# MISSING-ASSET PROTOCOL — creative-asset requests (D-20260719-28/-29)

Captured 2026-07-19 19:0x IST from owner chat (Wispr voice). Doctrine line lands in CLAUDE.md v2
at M1; enforcement mechanism (registry row + workflow hook) rides M2. This SOP is the operating
text until then.

## The two rules

**1. Self-solve escalation ladder (D-20260719-28).** At ANY stage of any build — a tool missing,
an instruction not understood, or confidence low — the agent does NOT stall and does NOT ship a
stop-gap. The ladder is:

1. Try to solve it properly itself (research, repo, docs).
2. Consult external AIs — Perplexity / ChatGPT — for a BEST solution (best practice, not a
   band-aid), with the consultation recorded.
3. Only if still unsolved: come to the owner with ONE precise ask (what was tried, what the
   external AIs said, what decision is actually needed).

This extends D-20260719-08 (external-AI checkpoints) and D-20260719-09 (right-tool-right-time):
the same external-AI lane that verifies work also unblocks work.

**2. Missing-asset requests (D-20260719-29).** When a site/LP build needs an image or video that
does not exist in the asset base (`content-mined/`, `docs/media/`, brand-manual Drive folders):

- The agent DRAFTS an email to the creative team (draft-only rule — the owner clicks send)
  asking whether the asset exists, and if not, requesting a shoot or generation.
- The request must carry an EXACT spec, never a vague ask. Spec format below.
- Until the asset arrives the build proceeds with a flagged placeholder (HARD GATE 6: never
  invent; flag the gap) — the request is the flag's escalation, not a build blocker.

## The spec format (owner-supplied demo, ingested verbatim)

Every requested still is specified with the **7-part framework**:

> **[Subject] + [Action] + [Environment] + [Camera] + [Lens] + [Lighting] + [Style]**

plus, always:

- **Exact pixel dimensions + aspect ratio** for the slot it fills (and the rendered slot path,
  e.g. `sites/<domain>/app/...` hero @ 1920×1080 + the responsive crops).
- Filters / grading / color notes where the design requires them (match brand tokens).
- Register lock notes where the entity requires them (KTAHV: clinical register — no spa/resort
  framing in the imagery either).

Every requested video is specified as a **frame-by-frame storyboard**: one 7-part spec per
scene/still, then per-shot motion beats broken as `[0–Xs]` timings, source-still references
((Image 1), (Image 2)…), and an `Audio:` line — exactly the format of the owner's demo files:

- [prompt-builder-cheat-sheet.md](prompt-builder-cheat-sheet.md) — the mix-and-match vocabulary
  (30 options × 5 columns; source xlsx committed under `source/`).
- [meta-prompt-workflow-extract.md](meta-prompt-workflow-extract.md) — the meta-prompt workflow
  (Gemini as prompt-writer → Nano Banana stills → Veo animation → CapCut/Canva assembly).

Owner Drive sources: doc `1-EsjloVkh8CtOMF-SGVt6O0RUiWqaVDC9f0nR7grfFw` (tab t.yki4uxppjk4w),
sheet `1zTgBHZy31k9eFj-ISCTbrkPwNXtT3tacjZnrls_z82w`.

## Who receives requests

Creative-team routing per wiki/people.md (marketing lane; Vikash for SEO-adjacent creative,
mkt@ktahv.com lane for shoots) — the draft names the recipient per asset entity; the owner
corrects routing on send. Requests are logged in the site's `launches/<domain>/` folder
(asset-requests section) so the gap and its chase survive the session.
