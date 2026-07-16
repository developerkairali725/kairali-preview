# CRITIQUE — TRACK COVERAGE · `MASTER_PIPELINE_DRAFT.md` v0.1

**2026-07-15 19:22:41 IST · as of commit `a206791` on `feat/wia-content-engine-research` · adversarial review, track-coverage angle.**
**Method:** four real scenarios walked end-to-end against the draft's own stage/gate text — (1) whatisayurveda.com's herb-monograph encyclopedia at scale, (2) a Shopify PDP/collection change with the agent READ-ONLY and live ads on PDP URLs, (3) a noindex `/lp/` for a paid MOA segment, (4) the kairali.com relaunch against its 208-URL protection map. Every claim below cites the draft line/stage or a machine check, pasted.

**Scope note:** this is a critique of TRACK COVERAGE only. Nothing here disputes the spine (S0–S12), the DO/DON'T contract, the hash-binding idea, or §11.1's "put the weight on the machine layer" — those are right, and several findings below are the draft failing its own standard rather than holding a wrong one.

---

## F1 · The pipeline governs site LAUNCHES. Track A's work is post-launch content waves — and `G9`'s hash binding makes them structurally impossible.

**Stages:** `S9`(d)2 · `S9`(b) · `S5`(f) · `S8`(e) · §10.1 `WF-B`

whatisayurveda.com **is already live**. `docs/whatisayurveda-research/BUILD_PLAN.md` §3.4, verbatim: *"whatisayurveda.com **is already live**; there is no DNS flip pending."* Roughly 20 of the ~3,400 pages exist. **3,380 of them arrive after `S10`.** The draft has no stage for that.

Machine check on the draft:

```
$ grep -ci "wave"        MASTER_PIPELINE_DRAFT.md → 2      (L848, L965 — both an auditor-check CELL in a DON'T table)
$ grep -ci "canary"      MASTER_PIPELINE_DRAFT.md → 2      (L957 S8-DO, L965 S8-DON'T)
$ grep -ci "re-entry"    MASTER_PIPELINE_DRAFT.md → 0
$ grep -ci "re-enter"    MASTER_PIPELINE_DRAFT.md → 0
$ grep -ci "incremental" MASTER_PIPELINE_DRAFT.md → 0
```

"Wave plan" is named twice, as the *check* column of two DON'Ts. It has no stage ID, no entry criterion, no exit artifact, no gate, no owner. Per the draft's own §0.4 — *"A DON'T with no check is a wish"* — a check with no stage is the mirror-image wish.

**And §10.1 absorbs the one rule that covers this into the wrong place.** `WF-B` (CLAUDE.md Lane B — *content change, any tier*) is mapped to **"S9→S10"**. But `S9`(b) entry is *"`G8` PASS; staging deployed"*, and `G9-PRE` demands *"every S0–S8 verdict exists, PASSed, and its artifact hash still matches."* No site in this repo has an S0–S8 verdict — none of those gates is built. **So under the ratified pipeline, publishing herb monograph #5 to a live site requires a 9-stage walk that has never been run for any domain.** BUILD_PLAN Phase 1 (18 monographs, ~44 pages cumulative) is blocked behind a full-site re-walk. The same applies to a one-paragraph PDP copy edit (Track B) and to a per-ad-group LP variant (Track C). **There is no small-change lane on any track.** CLAUDE.md has Lane A/Lane B today precisely because there must be one; the draft absorbs the rule and dissolves the lane.

**The hash binding then forbids the fix.** `S9`(d)2: *"Hash mismatch ⇒ the artifact changed after it passed ⇒ that gate is VOID ⇒ FAIL."* Wave 2 must add rows to `keyword-url-map.tsv` — that changes its SHA-256 — that voids `G5` — that fails `G9` **for the whole site**. Meanwhile `S5`(f) mandates exactly that edit:

> **DON'T treat the map as a one-time document** — *"Stale maps usually fail"* **[TM #9]** | Map has a review date

**`S5` requires the map to be revised; `S9` voids every downstream gate when it is. The two rules cannot both be satisfied.** The hash binding is the best idea in §9 and it is currently specified at whole-file granularity, which is the granularity that breaks it.

**What to do**
1. **Define the re-entry contract as a first-class object** — `SW` (wave), or `S5.9`/`S6`/`S8`/`S9-Δ` with a scoped gate. The model already exists and is better than anything in the draft: **BUILD_PLAN §3.4's phase table** (Phase 0→4, each with its own explicit gate and its own named blocker). It is not referenced in the draft.
2. **Hash-bind at row/slice granularity, not file granularity.** A wave-2 append must void only the rows it touches. `G9-PRE` then re-hashes the *slice* under review. Without this, the mechanism that "converts the walk from a ritual into a proof" (§9(d)2) converts it into a full-site re-walk per page.
3. **Re-map `WF-B` off "S9→S10".** A content change re-enters at the stage that owns the decision it changes (new URL → S5; new claim → S6; new copy → S6), not at the pre-launch proof gate.

---

## F2 · The physician gate contradicts itself inside `S6`, and §13 Q1 asks Abilash the wrong question.

**Stages:** `S6`(h) `G6-HUMAN` · `S6`(d) MR-1 · §10.6 · §13 #1

`S6`(h): **`G6-HUMAN` · Dr. Deepu John (or the named panel doctor) — clinical sign-off · BLOCK · "HUMAN — not negotiable, not routable around."** §10.6 repeats it. HG-7 backs it.

`S6`(d), thirty lines above, the TIERED TRUST model (MR-1): *"`reviewedOn` is per-page data set **ONLY on real sign-off**. **No review ⇒ no byline badge, no `lastReviewed`, no Physician JSON-LD**… An honest absence beats a false claim."* — i.e. **an unreviewed page ships, honestly unmarked.**

**Both cannot be true.**
- If `G6-HUMAN` blocks per page, tiered trust is dead, and whatisayurveda ships BUILD_PLAN Phase 1 (~44 pages) and stops. The 3,400 target is not "at risk" — it is already refused by the pipeline.
- If tiered trust governs, `G6-HUMAN` is **not** blocking, and §10.6's *"not routable around"* is false as written.

The draft never adjudicates. **§13 #1 then asks the unanswerable version of the question** — *"Does the ~3,400-page target survive contact with a real physician panel's throughput?"* — when the pipeline has already answered it in two incompatible directions. The decision Abilash actually needs is narrow, and he can give it in one sentence:

> **Is `G6-HUMAN` blocking on every clinical page, or only on pages that ASSERT a review?**

**And the draft drops the model that resolves it.**

```
$ grep -ci "institution" MASTER_PIPELINE_DRAFT.md → 0
```

`S6`(c) names `lib/medical-review.ts` as an input and misses its architecture. BUILD_PLAN §4.1 **P3** and §4.2 specify the **institutional review line** — *"Reviewed under the medical-review policy of **the registered physicians of the Kairali Ayurvedic Group**"* → `/editorial-policy` — plus a **dated roster** (`headFrom`/`headTo`, so a 2028 head change does not silently re-attribute a 2026 review) and `reviewedBy: [{Person}, {Organization}]`. That is the schema-level expression of *authoritativeness that survives a head change*, it matches the ratified roster memory (*reviewers are config/roster, not hard-coded; head can change*), it is **already in the code the draft cites**, and it is the only construct in the repo that lets per-page review coverage grow without either lying or halting. The draft's S6 discusses MR-1's honest-absence half and none of the institutional half.

**Also unresolved in the same place:** BUILD_PLAN Q5 states the real fork — *"is 'physician-reviewed' per-page, or per-template-with-spot-check? **The honest answer must be stated on `/about`**"* — which is the same `/about` that is §13 #2's live known-false claim (MR-4). The two open decisions are one decision, and the draft lists them separately.

---

## F3 · Track B: `B4` is the only stage the agent cannot execute — and the draft dropped the one mechanism that detects whether it happened.

**Stages:** `S5`(j) Shopify · `S9`(j) B7 · `S10`(j) B8 · §12.2

The draft states the finding correctly and then removes its detector. `S5`(j):

> **⚠️ THE STRUCTURAL FINDING:** **B4 is the only stage whose output the agent cannot execute.** … **A vague B4 is not a slow B4; it is a B4 that silently didn't happen.**

`research-shopify-playbook.md` §5, line 360, has the answer:

> **Post-execution diff is mandatory.** After the human applies it, the agent re-reads the admin via API and diffs applied-vs-spec. Doctrine (j): the live admin overrides the docs — so the docs get corrected to match reality, never the reverse. *Un-diffed execution is an unverified claim* (doctrine f).

Machine check on the draft:

```
$ grep -ci "post-execution"     MASTER_PIPELINE_DRAFT.md → 0
$ grep -ci "applied-vs-spec"    MASTER_PIPELINE_DRAFT.md → 0
$ grep -ci "re-reads the admin" MASTER_PIPELINE_DRAFT.md → 0
```

**Gone.** What remains: `G5-PRE` (`sitemap-gate.mjs`) lints **our TSV**, never the store. `S9`(j)/B7 is an unpublished theme preview. `S10`(j)/B8's publish pack is entirely **pre**-execution (*"what changes · PDP URL diff vs the B1 freeze list · redirect CSV · rollback · Vikash ad-destination notice"*). **Nothing on Track B ever reads the store back.** So the store — the only artifact that matters on Track B — is the one artifact with no gate. This is X-6 (*"a checklist item without a machine gate silently rots"*, which the draft calls *"the meta-rule that justifies this entire document"*) committed by the document itself, on the track where a human is the executor and therefore where drift is guaranteed rather than possible.

It is also **cheap**: `S0`(j) already mandates *"full catalog read via Admin API (read-only)"*. The post-execution diff is the same call, run a second time, `diff`ed against `B4-sitemap-spec.md`. That is an XS build.

**Second, related hole in the same track:** `S10`(f) *"DON'T publish a Shopify theme, install/remove an app, or change ANY Setting. The agent is READ-ONLY in the Shopify admin. | SD-k | 🔴 **no guard blocks Shopify admin writes**"* — correctly flagged, and then **absent from §12.2's 18-item build list**, which claims to rank by *(stakes × mechanizability)*. Verified:

```
$ grep -n "cloudflare\|shopify\|admin" scripts/hooks/guard.sh
26:  *"api.cloudflare.com/client"*"dns_records"*) block "DNS change — FOREVER-HUMAN action (Abilash/Ambuj flip)";;
```

`guard.sh` already blocks the Cloudflare DNS API by URL pattern. The identical one-line pattern for `*.myshopify.com/admin/api/*` on mutating verbs does not exist and is not scheduled. **The single hardest safety constraint on Track B — doctrine (k) — is prose, and the fix is a copy of a line that is already in the file.**

**Third:** `research-shopify-playbook.md` §286 specifies B4's auditors as *"GPT-5 **and** Perplexity **and** seo-aeo-geo-auditor. **Gate: Abilash.**"* The draft's `G5` table is `G5-PRE` / `G5-PROC` (GPT-5) / `G5-HUMAN`. **There is no `G5-FACT` on any track.** B4.4's indexation ledger is explicitly numeric (*"Record the verdict and the numbers per URL"*) — S5 is where demand numbers become permanent architecture, and it is the one starred stage with no fact-grounding auditor.

---

## F4 · Track C: the pipeline cannot launch a new campaign. It requires the data that only running the campaign produces.

**Stages:** `S3`(j) C · `S4`(b)

`S3`(j) Landing pages, verbatim:

> 🔴 **INVERTED — and this is where the DataForSEO-class error dies by construction.** LP keywords are **bought, not discovered**: they are **read from the Ads search-terms report** — the record of what people **actually typed and we actually paid for.** *No modelled volume is involved, so no modelled volume can be wrong.*

`S4`(b) entry: *"**`G3` PASS committed — all three of `G3-PRE`, `G3-FACT`, `G3-PROC`.** An architecture decision may not be taken from unaudited demand data."*

**A net-new `/lp/` for a net-new paid MOA segment has no search-terms report.** The report is an *output* of spend. So: no seeds → no `G3` → no `S4` → no GO → no `S5` → no build. **The pipeline's only legal path to a new campaign is to have already run it.** The commission's own Track C scenario — *"a noindex `/lp/` campaign landing page for a paid MOA segment"* — is precisely the case that deadlocks.

**This is a transcription loss, not a design position.** `research-landing-page-playbook.md` §92 defines the rule with three sources, not one:

> **SEED PROVENANCE RULE.** A keyword may enter an LP brief only if it is (a) a row in the account's **search-terms report** (a real human typed it), **or (b) a verbatim VoC quote** (a real human wrote it), **or (c) an explicit Abilash/Vikash bid decision recorded in the brief.**

…and LP-4 carries the explicit escape hatch:

> **HALT IF:** no live campaign exists yet (new campaign, no history) → then the keyword list comes from **Vikash/Abilash's bid decision**, explicitly recorded as such, and the page is built to the VoC. **It does not come from the agent's imagination, and it does not come from a third-party volume tool presented as fact.**

Machine check:

```
$ grep -ci "bid decision"    MASTER_PIPELINE_DRAFT.md → 0
$ grep -ci "no live campaign" MASTER_PIPELINE_DRAFT.md → 0
```

**Sources (b) and (c) were dropped; only (a) survived.** The research anticipated the deadlock and solved it; the master pipeline lost the solution and inherited the deadlock. Note the source that was dropped is a **named-human decision** — the exact provenance class the draft trusts most everywhere else (`G3-PRE` #3's zero-volume waiver: *"Override requires a committed, NAMED HUMAN waiver file — never an agent's judgement"*).

**Second, unpriced on this track: human-gate density vs variant economics.** Per LANDING_PAGE_DOCTRINE §1, *"Each ad group gets its own message-matched variant, not a shared generic page"* (Instapage AdMap; a cited 254% lift). The draft applies `G1-HUMAN` (Abilash, 6-bullet comprehension) + `G4-HUMAN` (Abilash, will-it-sell) + `G5-HUMAN` (Abilash, approves the tree) + `G9-HUMAN` (Abilash, approves the preview) **per asset**. A six-ad-group campaign = **24 Director approvals**. The pipeline makes the highest-ROI LP practice the most expensive activity in the system. It needs a per-**campaign** vs per-**variant** gate distinction: mandate the four humans on the campaign mandate; make variants a Δ under the approved mandate.

---

## F5 · §14's absorption check covers `inventory-existing-rules.md` only. The research this commission ordered has no absorption check — and three material rules are already lost.

**Section:** §14 · §13 #10

§14 is the best part of the document and it gates the wrong half. It greps 252 rule IDs out of the *old* register and proves `NOT ABSORBED: 0 / 252`. It caught SP-9 doing it, and says so:

> **X-6** — *a checklist item without a machine gate silently rots.* An "I absorbed everything" claim is a checklist item. Ungated, it was **99.6% true**, which is the most dangerous kind of wrong.

**The 252 IDs are the rules the repo already had.** The *new* content — the practitioner research the commission was actually about, 12 documents and ~1.06 MB — carries no IDs and no check. **F3 and F4 above are both instances of this**, found by hand, in two greps each:

| Lost rule | Source | In the draft |
|---|---|---|
| **Post-execution admin diff** (*"Un-diffed execution is an unverified claim"*) | `research-shopify-playbook.md` §5 L360 | `grep -ci "post-execution"` → **0** |
| **LP seed provenance (b) VoC + (c) named bid decision**, and the `HALT IF: no live campaign` clause | `research-landing-page-playbook.md` §92, LP-4 | `grep -ci "bid decision"` → **0** |
| **B4's Perplexity auditor** (*"GPT-5 and Perplexity and seo-aeo-geo-auditor"*) | `research-shopify-playbook.md` §286 | no `G5-FACT` exists on any track |

Two of the three losses fall on **Track B and Track C** — the two tracks with the least prose in the draft and the most external liability behind them (a human executing in a live admin; a cognizable offence under D&MR). That is not coincidence: hand transcription loses most where the source is least familiar.

**Fix, before ratification, and it is the same work as §13 #10:** the research docs already carry IDs in places (`LP-1`…`LP-11`, `B0`…`B9`, `K1`…`K9`, `V1`…`V10`, `C1`…`C7`). Finish the ID-ing, extend §14's grep to all 12 files, and re-run. Then §14's claim covers the document's actual content instead of its inheritance. Per §14's own closing recommendation — *"this pipeline's rule-set should be GENERATED from the repo… not transcribed by hand"* — this finding is the draft's own diagnosis, unapplied to itself.

---

## F6 · The fleet has cross-domain — and cross-TRACK — 301 dependencies. Every gate is scoped `<domain>`. No gate can see a target die.

**Stages:** `G0-PRE` · `G5-PRE` · `S5`(j) B4.5 · every `audits/<domain>/G*-verdict.json`

kairali.com's protection map is not self-contained. Machine check:

```
$ grep -oE "kairaliproducts\.com|kairalicenters\.com|whatisayurveda\.com" \
    docs/group-inputs/kairali-com-protection-map.md | sort | uniq -c
  12 kairaliproducts.com      ← the LIVE SHOPIFY STORE — Track B
   6 kairalicenters.com       ← Track A, mid-rebuild
   3 whatisayurveda.com       ← Track A, live
```

The map already flags the risk in prose — §2f *"sibling-site 301s — **conditional on target being live**"*, §2h *"kairalicenters.com is **NOT a safe 301 target today**"* — and the pipeline has nowhere to put it. **Every artifact is `docs/<entity>-inputs/<domain>-*`; every verdict is `audits/<domain>/G*-verdict.json`; every gate ID is per-domain.** `G5-PRE` asserts *"every 301 target resolves 200 single-hop"* — a **snapshot**, taken at *this* domain's S5, of a URL owned by a **different domain's pipeline**, which will keep moving afterwards.

**The concrete failure the pipeline cannot catch, using only the draft's own rules:**

1. kairali.com passes `G5` — its 12 `/products/*` targets on kairaliproducts.com resolve 200. Verdict + hash committed.
2. Later, the store runs **B4.5**, whose rule the draft carries verbatim: *"OOS/discontinued follow Aleyda's state machine… **410 included** — a discontinued no-traffic SKU is a **410**, not a 301."* "No-traffic" is judged on the **store's** analytics, blind to 12 legacy kairali.com URLs pointed at it.
3. The 410 lands. kairali.com's `G5` verdict is now false — **but its artifact hash still matches**, so `G9-PRE` passes it, and `S9`'s matrix walk certifies the site.
4. Result: ~12 backlinked legacy URLs 301 into a 410 — which is `G0`(f)'s own DON'T (*"DON'T redirect a content-rich ranking page to a thin target… authority is discarded rather than forwarded"*), **committed by a different site's gate passing correctly.**

Note this is worse than a stale check: the hash binding **actively certifies** the stale verdict, because the hash proves *our* file didn't change, and our file was never the thing that changed. **The hash binding proves internal consistency and is silent about external dependencies — and on a 28-site fleet with sibling 301s, the external dependencies are where the equity is.**

**What to do**
- **A fleet-level inbound-301 register** (`docs/redirects/` is the natural home): for every URL, who points at it, from which domain, on which track. Any site's `S5`/`B4.5` must consult it before retiring, 410-ing, or re-handling a URL. A "no-traffic SKU" that is the single-hop target of 12 backlinked legacy URLs is not a no-traffic SKU.
- **A scheduled cross-domain target-resolve check at `S11`**, not a one-shot at `G5`. Targets you don't own need re-verification, not a snapshot.
- **State the ruling:** cross-domain 301 targets are a **fleet invariant**, and no per-domain gate can express one. Today the pipeline has no fleet-level object at all.

---

## F7 · Scale: `G6-FACT` says fact-ground every medical claim; `S9` says sample. The carve-out is the document's only uncited DON'T — and it weakens the YMYL gate while the repo's real scale answer sits unbuilt and unlisted.

**Stages:** `S6`(h) `G6-FACT` · `S9`(f) · §0.2 · §12.2

`S6`(h): **`G6-FACT` ★ · Perplexity — "every medical claim fact-grounded. Its highest-value use" · BLOCK.**
§0.2 prices `FACT` at **$0.05–1** per call.
BUILD_PLAN §2.7 rules 3/6 set the per-page floor: *"≥3 citations"*, *"Every `outcomes[]`, `mechanisms[]`, `interactions.*`, `safety.*` row has ≥1 `cites`. **No uncited health claims, ever.**"*

3,400 monographs × ~10 claims ⇒ tens of thousands of calls ⇒ **~$1.7k–$34k+ per full pass**, against an auditor the draft itself scores at **~37% wrong**. That is the *"burn millions of tokens"* outcome, arrived at by a gate written to prevent it.

`S9`(f) resolves this — by weakening it:

> | **DON'T audit 3,400 pages individually.** | cost discipline **[J]** | Sample + template-level audit |

Three problems, all internal to the draft:

1. **It is the only DON'T in the document with no authority behind it.** `[J]` = *"judgement, labelled as such"* per §0.4's source key. Every other DON'T carries `[P]`/`[S]`/`[OURS]`. And §0.4's own contract says: *"A DON'T with no check is a **wish**, marked ⚠️, and is an **open question** — not a rule."* It is not marked ⚠️, and it is not in §13.
2. **It weakens the highest-stakes gate in the pipeline**, which KD-g forbids without exception (*"a failing gate is NEVER fixed by weakening it — fix the cause or escalate"*, `SX`(f)). This one was weakened silently, in a DON'T table, on YMYL.
3. **Sampling is the wrong instrument for facts.** It is right for design and template shape; a fabricated drug interaction on page 2,743 is not a template defect that a sample finds. `PW-2` — *"DON'T treat fixing one instance as done. Grep/audit ALL instances"* — is `SX`, i.e. binding at every stage including S9. **The two rules sit 780 lines apart and contradict.**

**The repo already has the correct answer, and §12.2 doesn't list it.** BUILD_PLAN **§2.7** is a **35-rule, CI-blocking, per-page content lint** — the machine layer §11.1 demands, at 3,400-page scale, for ~$0. It includes: citation contiguity + resolution; `safety.pregnancy`/`lactation`/`preSurgery`/`longTermSafety` present-or-explicit-`insufficient-data` (*"silence is not"*); DMR-Schedule × cure-verb hard fail; `review.reviewedOn` present, ISO, not future, **not equal to the build date**; a source **denylist** (*"the failure mode for this site is not fabrication — it is **laundering** a supplement blog's claim into a cited-looking safety statement"*); and a distribution check (*"a monograph where everything works is a lint failure"*). **§12.2's 18-item build list does not contain it.**

**Two of its rules belong in the master document verbatim, because they are the draft's own doctrine improved:**

- **Rule 22 — negation-awareness.** *"the Healing Secrets booklet contains 'is not a cure for cancer; it is designed to work alongside the care of your treating medical team' — **exemplary honest drafting that a naive lint flags.** Train reviewers to click past the one lint that matters most and the lint is worse than nothing."* The draft's `G6-PRE` banned-word lint is marked ✅ **LIVE** with no negation clause. A lint that punishes our best sentence teaches everyone to ignore it.
- **Rule 23 — control-word validation, and this one is severe.** *"Every banned-word scan MUST validate against a known-present control word before its zero is believed… the first scan returned **0 hits — a false negative**; `[[:<:]]` word-boundary syntax silently fails under this machine's `grep` (it is `ugrep`). The control word 'ayurveda' **also returned 0**, which is what exposed it… **A silently-broken banned-word lint reporting 'clean' is worse than no lint.**"*

**Read F7's rule 23 against §0.5 failure #2.** Failure #2 is *"summed implausible zeros and reported them as fact."* A banned-word lint that returns 0 because its regex silently didn't match **is failure #2 living inside the gate built to prevent failure #2** — an implausible zero, believed, and reported as PASS. It has already happened once on this machine, on this repo, and it is documented. The draft's `G6-PRE` is marked ✅ LIVE with no control-word assertion, and `G3-PRE` #3 (ZERO CHALLENGE) applies the principle to *keyword volumes only*. **The zero-challenge principle is not keyword-specific. It belongs in `SX`, binding on every machine gate that can return a zero — including the ones marked ✅ LIVE.**

---

## F8 · Relaunch: `S4` imports Cooper's greenfield verdicts onto live ranked domains — and `S0` has already committed the architecture four stages earlier.

**Stages:** `S4`(d)/(e) · `S5`(b) E9 · `S0`(g) · §1.3 D4

§1.3 **D4** gets it right — *"His order is greenfield; most of our work is not"* — and then applies the correction **at `S0` only**. `S4` remains an unmodified Cooper stage-gate: *"Adopt Cooper's four outputs verbatim **[P]**: **GO · KILL · HOLD · RECYCLE**."* Those are **new-product-development** verdicts. On a live, ranked, 208-URL corporate domain they do not name the decision space:

- **KILL** a domain that already ranks and already carries the group's inbound-link mass? Meaning what — leave the legacy ASPX site up forever? 410 the lot?
- **HOLD** = the legacy site stays live indefinitely — which is `S4`(f)'s own DON'T (*"DON'T let HOLD become a graveyard… A HOLD with no owner is a KILL that nobody had the nerve to make"*).
- **RECYCLE** into what, when the asset is the URLs and the backlinks?

The real relaunch verdicts are different: **relaunch now / relaunch later / leave as-is / retire the domain** — and their criterion is **equity at risk**, not `S4`'s reverse income statement, premortem and kill test.

**Worse: `S0` already decided the architecture, and it was right to.** `docs/group-inputs/kairali-com-protection-map.md` §3 is a **13-route, priority-ordered build list**, written **2026-07-15 13:34:28 IST**, ranked by *"inbound-link mass × lead value × equity at risk"*:

| # | New route | Why this priority (verbatim) |
|---|---|---|
| 1 | `/about` | *"Highest inbound page (326) + the site's deepest content page (5,810 w) land here."* |
| 2 | `/awards` (+77 archive) | *"The E-E-A-T backbone; biggest single crater risk."* |
| 4 | `/consultation` | *"Top lead-gen asset on the legacy site (269 inbound, 22-field form)."* |

**That is a sitemap.** It was produced at `S0`, before `S1`–`S4` existed, from measured legacy signals — and it is **correct work**. On a relaunch, architecture is *derived from inherited equity first*, and demand refines it. The draft inverts this: `S5`(b) **E9** makes the sitemap conditional on **`G4` = GO**, and `S5` claims to own architecture. So the draft's order says the 13-route map should not have existed yet — while its own `S0`(g) deliverable list mandates a protection map *"every legacy URL, its fate, its target"*, and cites this exact file as the model.

**The unruled collision.** The draft rules the protection map against **keywords** — `K9`: *"**DON'T let a keyword stage decide URLs** — S5 owns architecture and **the PROTECTION MAP outranks it**"* — and never rules it against **`G4`**. So: if `S4` returns KILL or HOLD for the `/csr` cluster, `S0`'s map says **KEEP-AS-PAGE** (200 inbound links). Which wins? Nothing in the document says. Given the draft's own cost-asymmetry argument (§1.6), the answer should be obvious and stated: **for KEEP verdicts backed by measured legacy signals, `S0` outranks `S4`** — you cannot "kill" equity you already own; you can only discard it.

**What to do**
1. **Add archetype `R` (relaunch) to `S1`(d)4's {E, L, N}**, with its own `S4` criteria — equity at risk, protection-map completeness, target-site readiness (F6) — instead of a reverse income statement for a site that has been trading for years.
2. **Rule `S0` > `S4` for KEEP-AS-PAGE verdicts** carrying measured inbound/GSC signal, and say so in `S5`(b) E9 next to `G4 = GO`.
3. **Name what `S0`'s map is:** on a relaunch it is a *provisional architecture*, and `S5` is where demand and register-lock refine it — not where it is first drawn. The draft's *"the protection map MERGES INTO the sitemap"* (`S5`) is the right instinct with the wrong direction of travel.

---

## Cross-cutting: the in-flight-site question nobody asked

Four sites are already built (kairali.com, whatisayurveda.com, kairalicenters.com, + arogyakendra per LEARNINGS). **None has an `audits/<domain>/G*-verdict.json` for any stage — those gates do not exist.** X-16 is ratified as *retroactive* (*"all sites, built and future"*). So on the day this is ratified:

- **either** every built site is un-shippable until `S1`–`S6` are backfilled — the 30-day sprint stops;
- **or** they are grandfathered — and the pipeline governs nothing that ships this month.

**The draft does not choose.** §13 lists 12 open decisions and this is not among them. Given Abilash's *"FIX IT EVERYWHERE IN THE REPO"*, it should be #13 and it is probably blocking: **what is the backfill contract for a site that reached S8 before the pipeline existed?** The honest answer is likely a scoped one — backfill `S2` (dossier) and `S5` (keyword→URL map) only, because those are the two artifacts every later stage reads — but it must be a ruling, not a default.

---

## What I did NOT verify (per doctrine (f))

- **I ran no gate, no build, no lint, no auditor.** Every finding above is a reading of the draft against sibling documents and against `grep`. Pasted greps are real; conclusions drawn from them are mine.
- **I did not re-verify the sibling docs' external claims** (Cooper, Aleyda, Unbounce, Instapage's 254%, Baymard, the GEO percentages). Where I cite them I am citing *the sibling doc's claim*, carried forward — the same caveat the draft's §14 makes about itself.
- **`origin/main` was not consulted** (BS-1). This is `feat/wia-content-engine-research` @ `a206791`. Rules present only on main are missed here.
- **I did not check whether the store's live state matches `B4`'s assumptions** — no Shopify admin read was performed. F3's argument is about the *absence of a mechanism*, not about a specific drift I observed.
- **The 208-URL and 12/6/3 cross-domain counts are `grep` outputs from the protection map**, not an independent crawl. If the map is wrong, F6's arithmetic is wrong with it — but F6's *structural* claim (no fleet-level gate exists) does not depend on the counts.
- **F1's claim that no site has S0–S8 verdicts** rests on the draft's own §12.1/§12.2 ledger (those scripts are marked 🔴 NOT BUILT), not on my own filesystem audit of `audits/`.
