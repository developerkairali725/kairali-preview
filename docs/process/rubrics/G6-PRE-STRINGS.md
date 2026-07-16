# `G6-PRE-STRINGS` — strings that must never ship on a Kairali site

**Gate:** `G6-PRE` (strings component) · MASTER_PIPELINE §1141
**Enforcing command:** `node scripts/banned-string-lint.mjs [--root sites] [--json]`
**Exit contract:** `0` clean · **`2` violation OR broken control probe (CI blocks)** · `1` harness error
**Scope:** shipped site source + content — `sites/**` (`.ts .tsx .js .jsx .mjs .cjs` as code; `.json .md .mdx .html .txt` as content)
**Tests:** `packages/compliance/test/banned-string-lint.test.js` (19 tests, discovered by CI's `find packages sites -path '*/test/*.test.js'`)
**Fixtures:** `scripts/fixtures/lint/violating/` (must FAIL) · `scripts/fixtures/lint/legitimate/` (must PASS)

---

## Provenance

**Every rule here is `[OURS]` — a failure this repo committed and documented.**
None is a hypothetical, a best practice, or a borrowed checklist item. Sources:
`DECISIONS.md` 15 Jul 18:31:07 · `CLAUDE.md` LOCKED FACTS · MASTER_PIPELINE §0.7
(failures #5, #6, #7), §1112–1117 (MR-3, MR-4), §1970 (build #5).

This gate exists because of a specific, measured pathology:

> **The rule survived only as a code comment** (`chrome.tsx:5-7`). One careless
> edit re-introduces it; no lint forbids the string. — §1117

And because the ruling that removed the claim **was not fully executed**:
`DECISIONS.md` records *"Fixed + verified in built HTML (all now 0 occurrences)"*
for the blanket physician-review promise. **It was verified in built HTML, and
`llms.txt` is a route, not HTML.** The claim is still live. *Fixing one instance
is not done* (CLAUDE.md PROOF-OF-WORK). **This gate is that grep, run every time.**

## The rules

| id | Fails on | Why — the incident it closes | Applies to |
|---|---|---|---|
| `ask-a-doctor` | `ask a/an/the/our/your [adj] doctor\|physician\|vaidya\|clinician` | We shipped **"Ask a doctor on WhatsApp"** on every article. The number reaches the **Priya Chatbase AI assistant, not a physician**. On a YMYL page that is a safety claim, not a marketing one. | code + content |
| `wrong-whatsapp-38777` | the digits `9289838777`, in **any** formatting | CLAUDE.md LOCKED FACT: the number is **+91 92898 38797**. Any `…38777` is a bug — fix on sight. | code + content |
| `hardcoded-review-date` | a `REVIEW*`-named binding, or a `lastReviewed`/`reviewedOn`-family key, holding a **literal ISO date**, **in code** | We shipped `REVIEWED = "2026-07-14"` emitted as `MedicalWebPage.lastReviewed` under a named BAMS physician **on every page, for reviews that never happened**. | **code only** |
| `blanket-review-claim` | `every\|all\|each … page\|article … is/are/has been … reviewed` | *"Every health page is reviewed by a registered Ayurvedic physician"* was **false**, was ruled removed sitewide, and **is still live in two files**. Arithmetically undeliverable across ~3,400 pages; **today 0 pages carry a `reviewedOn`.** | code + content |
| `wrong-contact-email` | any `*@kairali.com` that is not `info@kairali.com` | CLAUDE.md LOCKED FACT: the public contact email everywhere is `info@kairali.com`. | code + content |
| `deepu-name-conflation` | `Deepu` not written as the full `Dr. Deepu John` | CLAUDE.md LOCKED FACT — **two Deepus**: the web developer and the chief physician. A truncated `Dr. Deepu` or bare `Deepu John` on a medical byline is the conflation the rulebook forbids. | code + content |

## Golden example — VIOLATING (must FAIL)

From `scripts/fixtures/lint/violating/article.tsx`. This is the real shape, not a toy:

```tsx
const REVIEWED = "2026-07-14";                                   // hardcoded-review-date
export const WHATSAPP_URL = "https://wa.me/919289838777";        // wrong-whatsapp-38777
const schema = { "@type": "MedicalWebPage", lastReviewed: "2026-07-14" };  // hardcoded-review-date

<p>Every health page is reviewed by a registered Ayurvedic physician before it is published.</p>
                                                                 // blanket-review-claim
<p>Reviewed by Deepu John on {REVIEWED}. Questions? Write to reservations@kairali.com.</p>
                                                    // deepu-name-conflation + wrong-contact-email
<a className="btn" href={WHATSAPP_URL}>Ask a doctor on WhatsApp</a>        // ask-a-doctor
```

**Expected: exit 2, one finding per rule, each with `file:line`.**

## Golden example — LEGITIMATE (must PASS) — *the half that decides whether this gate survives*

From `scripts/fixtures/lint/legitimate/`. **Every line is real copy from this
repo.** If a rule change makes any of it fail, **the rule is wrong, not the copy.**

```tsx
export const WHATSAPP_URL = "https://wa.me/919289838797"; // Priya = the Chatbase AI ASSISTANT
// (Abilash confirmed 15 Jul 2026). NEVER label this "ask a doctor" — on a YMYL
// health site that is a false medical claim.   ← a COMMENT EXPLAINING THE BAN IS NOT A VIOLATION

const LAUNCH_DATE = "2026-07-14";          // a launch date is not a medical claim
const PROTOCOL_RELATIVE = /^\/\//;         // a regex with `//` must not eat the line
```

```
Always consult a doctor before starting any treatment.
    → the site footer. "consult" is our house phrasing and is untouched.
Health pages reviewed by one of our Ayurvedic physicians are marked with that
doctor's name and the date they approved it.
    → honest coverage language; no blanket claim.
each page states honestly whether a physician has reviewed it yet.
    → REPORTS review state, does not ASSERT it.  ← this one caught a real false
      positive in the gate's own regex during the build.
Not every page is reviewed by a physician, and we say so on the ones that are not.
We do not claim every page is reviewed.
    → negated claims are the honest form (§0.6 negation-awareness).
{ "reviewedOn": "2026-07-15", "reviewedBy": "deepu-john" }
    → per-page CONTENT data is the LEGITIMATE datum resolveReview() requires.
      Flagging it would forbid the fix.
```

**Expected: exit 0, zero findings.**

## Control probe (§0.6 — this gate is named in the binding list)

> *A zero is not believed until a known-present control probe returns non-zero in
> the same run. No control probe ⇒ the gate did not run.*

Precedent: a banned-word scan on this machine returned **0 hits — a false
negative**; `[[:<:]]` silently fails under `ugrep`. The control word *"ayurveda"*
also returned 0, which is what exposed it. **A silently-broken lint reporting
"clean" is worse than no lint** — it is failure #2 (an implausible zero, believed,
reported as PASS) living inside the gate built to prevent failure #2.

**What runs on every invocation, before any file is read:**

| Probe | Assertion | Count today |
|---|---|---|
| per-rule positive probe | each rule flags text it MUST flag, **through the real matcher** | 6/6 |
| per-rule negation probes | each rule stays silent on our honest copy | 21/21 |
| walk probe | `files_scanned > 0` — an empty walk is a broken walk, not a clean repo | 162 files |

**A probe failure exits 2 and blocks.** Not exit 1: a gate that cannot prove it
still matches must stop the build, not log a warning.

**Deliberate-breakage test** (§11.3 fixture 3 — *"a lint whose regex is
deliberately broken; the control probe must catch it"*): a rule is replaced with
one that matches nothing and the probe is asserted to fail. See
`banned-string-lint.test.js`.

## Known limits — stated, not discovered later

1. **`packages/` is not scanned by default**, though it ships into sites, because
   `packages/compliance/src/rules.js` legitimately carries the known-bad number
   as **rule data**. Add `--root packages` once that line carries a
   `banned-string-allow:` marker.
2. **JSON content has no suppression path.** `banned-string-allow:` needs a
   comment; JSON has none. By design: fix the copy.
3. **Negation is a heuristic, not a parser.** The negation window is the current
   clause (bounded by `.`, `;`, newline). A negation placed earlier in the same
   clause but not governing the claim (*"we do not exaggerate: every page is
   reviewed"*) suppresses the finding. **Deliberate trade:** a false positive on
   honest copy gets the lint disabled; this false negative is adversarially
   shaped, and `G6-PROC`/`G6-FACT` are the backstop for prose written to slip a
   gate.
4. **`ask-a-doctor` requires an article**, so *"ask what a doctor thinks"* passes.
   Tight beats noisy.
5. **The blunt ban costs one honest phrasing.** *"…you should ask a doctor first"*
   is honest advice that this rule flags. Accepted because the house phrasing is
   already *"consult a doctor"* (untouched), the repo has **zero** occurrences in
   `sites/` today, and the escape hatch is audited (below).
6. **Template-literal values are not resolved** — `` `https://wa.me/${n}` `` is
   not traced. No site uses one today.

## Suppression — audited, never silent

A line carrying `banned-string-allow: <rule-id>` suppresses that rule **on that
line only**, and the suppression is **reported as `INFO` in every run**, so a
waiver is visible forever rather than disappearing. This is the convention
`packages/compliance` already uses. **A suppression is a decision: it belongs in
DECISIONS.md with a reason and a name.**

## Change procedure (§11.4)

**A failing gate is NEVER fixed by weakening it** (CLAUDE.md rule g). To change a
rule: a **named reason** + a **DECISIONS.md entry** (IST, to the second) +
**Abilash's approval**. **A rubric diff inside a PR that also makes the gate pass
is, by default, a finding.**

**The negation corpus is not editable to make a build pass.** If honest copy
fails, that is a *bug in the rule* and the fix goes in the rule. If a rule is
correct and the copy is wrong, the copy changes — the corpus stays.

## Known-failing today (the gate is RED, and correctly so)

As of this rubric, `node scripts/banned-string-lint.mjs` **exits 2 on `main`**
with two real findings — both instances of a claim `DECISIONS.md` already ruled
must be removed sitewide:

| File | Line | Rule |
|---|---|---|
| `sites/whatisayurveda.com/app/llms.txt/route.ts` | 17 | `blanket-review-claim` |
| `sites/whatisayurveda.com/app/page.tsx` | 96 | `blanket-review-claim` |

**This is the correct state, not a defect in the gate.** The gate goes green when
the copy is corrected to the honest language already approved and already live in
`chrome.tsx`. Per CLAUDE.md rule g, it must not be made green any other way.
