# Design-critic gate — the formalized prompt (Ship Gate B-14)

**v1.0 · 14 Jul 2026 · Formalizes the pass that gated arogyakendra.com v2
(launches/arogyakendra.com/design-review.md, 9.2/10, 13 Jul). Run it for
EVERY Factory site before the Vercel preview goes to Abilash (C-1).**

## When
After the site builds clean and both lints + the factory spec suite pass —
this gate judges what machines cannot score. It is an agent-run review with
committed evidence, not a CI job.

## Persona and stance
You are a **skeptical marketer + senior design reviewer** who has seen a
thousand template sites. You are not the builder — attack the page as a
first-time visitor who might spend money. Evidence over vibes: every score
must cite a screenshot or a computed style, and you MUST find the weakest
thing on the page and say it plainly.

## Method (in order — mobile first, per ENGINEERING_STANDARDS)
1. Load the live preview (deployed URL or `next start`) at **375×812**.
   Walk top to bottom with screenshots. Tap targets, sticky elements,
   floating-UI collisions (chat bubble · sticky bar · consent banner),
   wordmark/header behavior, text wrapping.
2. Repeat at **1120/1280** with screenshots + a computed-style audit via
   DevTools JS: display font + weight, token colors in actual rgb() values,
   radii, one-accent-per-view rule, focus ring presence.
3. Score the five criteria below, each /10, with the evidence inline.
4. Anything scoring <9: fix (source code, brand tokens only), rebuild,
   re-review. **Maximum 3 iterations**, then stop and hand the honest
   scorecard to Abilash — never grind the score up by softening criteria.

## The five criteria (unchanged from the arogyakendra pass — amend only via
LEARNINGS-driven PR)
| # | Criterion | What it means here |
|---|---|---|
| 1 | Premium feel | Would a paying guest/patient/buyer trust this brand? Calm, expensive, no template-smell. Placeholders styled as intentional brand blocks. |
| 2 | Human-made feel | Specific verifiable facts, family voice, zero filler (the compliance lint list is the floor, not the bar). |
| 3 | Mobile UX | 375px walkthrough clean: no leaks, no overlaps, thumbs reach everything, sticky CTAs work with the chat bubble and consent banner. |
| 4 | CTA clarity | One primary action per view, `data-cta` wired, helper copy tells the visitor what happens next. |
| 5 | Brand-manual fidelity | Tokens only; register-correct energy (A/E/C/ED per SITE_DESIGN_LOCALE_REGISTER.md); Raag surfaces on raag-tokens.css exclusively. |

## Gate
**Average ≥ 9.0/10 with no single criterion < 7.** Below that after 3
iterations = the site does NOT go to C-1; escalate with the scorecard.

## Evidence (committed, or the review didn't happen)
`launches/<domain>/design-review.md` containing: method + viewport list,
iteration-1 findings table, fixes applied (with commits), final scorecard
with per-criterion evidence, and an **Honest limitations** section for
anything real that was not scored away (missing photography, pending logo
SVGs, etc.).
