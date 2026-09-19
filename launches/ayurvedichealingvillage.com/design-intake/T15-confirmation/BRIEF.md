# T15 CONFIRMATION — the owner's brief, and what the pages actually say today

**Family:** what a person sees immediately after they submit a form. 10 routes on
`ahv-page-confirmation-desktop` / `-mobile`.
**Recorded:** 2026-09-19 IST, from the owner, verbatim below.

---

## 1. The owner's brief — VERBATIM, do not paraphrase

> Family: what a person sees immediately after they submit a form.
>
> Design against: /thanks-old/ — 83 words, 2 images. That is the richest one.
> EIGHT OF THE TEN ARE COMPLETELY EMPTY TODAY — zero words. Somebody fills in a form,
> presses send, and lands on nothing. That is the problem to solve.
>
> It needs, in this order:
>   1. Unmistakable confirmation that it WAS sent — not a shrug, a receipt.
>   2. What happens next, in plain words, with a real timeframe.
>   3. What to do if they need an answer sooner: WhatsApp +91 92898 38797 and
>      info@kairali.com, both tappable.
>   4. Somewhere useful to go next, so the page is not a dead end.
>
> Design it as a calm, reassuring, deliberately quiet page. No celebration animation.
> Somebody who has just asked a hospital about their health does not want confetti.
>
> Note: /cart/ and /checkout/ are in this family although this site has NO commerce.
> Ignore them — I am getting a decision on those separately.

---

## 2. What the ten pages render today — measured, not assumed

Word counts are from `<main>` in the committed prerender snapshots, chrome stripped.

| route | words | images |
|---|---:|---:|
| /book-now/ | 75 | 1 |
| /checkout/ | 19 | 1 |
| /cart/ | 17 | 1 |
| /contact-us/thank-you/ | 26 | 1 |
| /emailsubscriber/ | 26 | 1 |
| /onlinebookingthankyou/ | 26 | 1 |
| /onlineconsultation-thanks/ | 26 | 1 |
| /ppc-thanks/ | 26 | 1 |
| /thanks-old/ | 26 | 2 |
| /thanks/ | 26 | 1 |

**Two corrections to the brief, both in the same direction — it is worse than described.**

**(a) `/thanks-old/` is not the richest and does not carry 83 words.** It renders 26, the
same as seven others. The richest rendered page is `/book-now/` at 75 words, and that is a
*sales* page about booking a stay, not a confirmation. The "0 – 0 – 83" figures in the
families report are dataset-record counts, not rendered words.

**(b) The eight are not empty. They say something worse than nothing.** Eight of the ten
render this, verbatim:

> **"This page cannot confirm whether a message or booking was submitted. Go home"**

(`/emailsubscriber/` says the same about a newsletter subscription.)

So a patient who has just asked a hospital about their health is told, in writing, that the
site does not know whether their message went anywhere. That is not a blank page. It is an
explicit statement of failure, and it is the real problem to solve.

The text lives in `public/ahv/assets/confirmation-family-data.js`, not in the view, so it is
per-route data rather than template chrome.

---

## 3. THREE THINGS THE DESIGN CANNOT DECIDE — owner input needed before build

### 3.1 We cannot promise "it WAS sent" while the forms are off

Requirement 1 asks for "unmistakable confirmation that it WAS sent — not a shrug, a receipt."
That disclaimer is almost certainly a deliberate, honest placeholder: **the forms are not
switched on.** The session handover lists as the real go-live blocker "Deepu — the three
WPForms confirmation settings (IDs 11965, 18926, 8055), and switching the forms on."

A receipt page that asserts delivery while the forms are off would be a false statement to
patients on a hospital site (HARD GATE 6 — never invent; nothing here may claim a thing that
did not happen). The design can and should be built for the true state; what it *says* has
to follow the forms.

**Decision needed:** either (i) Deepu switches the forms on first and the page says "sent",
or (ii) the page ships with copy that is true while they are off. **Design the layout either
way — only the sentence changes.** Do not let the mockup hard-code "We have received your
message" until (i) is done.

### 3.2 +91 92898 38797 is Priya, the AI assistant — not a physician

CLAUDE.md locked facts, and `scripts/banned-string-lint.mjs` enforces it: that number reaches
the **Priya AI assistant**, not a doctor. The rule exists because "Ask a doctor on WhatsApp"
shipped once and reached the chatbot (DECISIONS.md 15 Jul 18:31:07, MR-3) — a false medical
claim on a YMYL page.

Requirement 3 is fine as an escalation route. The wording is not free: it must disclose the
channel as an AI assistant, and must not imply a clinician answers faster there. "Ask Priya,
our AI assistant" passes; "speak to our doctor now" does not, and the lint will block it.

The number itself is correct and matches the locked fact (…38797, never …38777).

### 3.3 The chrome on these pages carries a banned phrase

Every one of the ten renders `Kairali — The Ayurvedic Healing Village · Since 1908` in the
chrome. Group-attached "Since 1908" is the form DECISIONS.md 16 Jul ruled against — 1908 is
the FAMILY lineage, the GROUP was founded 1989 — and it is one of 255 files in the open
`Q-AHV-BANNED-STRINGS` finding. **Chrome is LOCKED** (shared with owner-approved pages), so
this is not the design's to fix, but whatever ships here inherits it until that ruling lands.

---

## 4. Scope

**Design for eight routes.** `/cart/` and `/checkout/` are excluded by the owner's own note —
a decision on them is coming separately, and both already carry a 301 in
`english-candidate/redirect-map.json` (to `/packages/`).

`/book-now/` is in this family by template but reads as a booking *sales* page, not a
confirmation. Worth the owner's eye: does it become a confirmation page, or does it leave the
family?

---

## 5. What is needed in this folder before any build

1. `desktop-*.png` (1440) and `mobile-*.png` (390), or the Claude Design share links.
2. Gate 1 then runs — `scripts/design-review.mjs --stage pre` — where ChatGPT and Perplexity
   must SEE the image, not a description. MODE A gets the same external eyes as MODE B.
3. A signed row for this family in `launches/ayurvedichealingvillage.com/approvals.yaml` —
   the owner's word, never the agent's.
