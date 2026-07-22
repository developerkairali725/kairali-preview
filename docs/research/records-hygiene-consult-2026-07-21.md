# External consult — gitleaks false-positive route + duplicate directive id (recorded)

- **When:** 2026-07-21 18:15 IST · **Asked on:** the owner's word ("discuss with gpt and perplexity and conclude on this")
- **Method:** the standing two-auditor lane — `audit-gpt.mjs` (is the reasoning good) + `audit-perplexity.mjs` (is the claim true) — against a neutral brief presenting both options per decision with no preferred answer. Claude's prior positions were disclosed to GPT as `--thinking` for attack, and withheld from Perplexity (contamination rule).
- **Questions:** ① #239's gate failed on a gitleaks `generic-api-key` finding that is a false positive (the "secret" is the report id `RPT-20260721-GPT-WALKTHROUGH` sitting after the word "API" in prose) — fix by rewording the prose or by a scoped allowlist? ② PR #220's unmerged GO-DOCTOR-FIX row carries D-20260721-09, an id already spent on main by AMBUJ ASSET ACCESS — keep the duplicate under the collision note, or renumber the unmerged row?

## Verdicts

- **GPT (is it good):** FAIL on both of Claude's positions. ① The "fix the report, never the lint" rule is *circular and non-portable* as evidence — it governs lint hits indicating real staleness, not scanner false positives on prose; rewording to evade a scanner leaves no audit trail. ② The keep position *"equates references in the wild with immutability of the identifier, ignoring the established pattern of tombstones/redirects/aliases"*; prose collision notes don't help parsers; precedents :99/:105 may themselves be technical debt, not good practice.
- **Perplexity (is it true):** FAIL on the brief's embedded claims. Ecosystem guidance (Mia Platform, OneUptime, HuskyCI, gitleaks discussions) consistently recommends **explicit allowlists / inline `gitleaks:allow` annotations with a stated reason** over editing content to bypass detection — narrowly-scoped entries are accepted practice; broad ones are harmful. Claude's "known false-positive class" claim was **CONTRADICTED** — no such documented class exists; withdrawn. On ids: CVE's REJECT mechanism preserves the propagated id and points to the canonical one — registries neither renumber escaped ids silently *nor* keep two live rows on one id. Duplicate keys in machine-parsed registers are a documented audit/reconciliation risk.
- **Claude (this session):** CONCEDES both. Verified the premise that made GPT's argument binding: `scripts/directive-capture.mjs:58` (`ENTRY_RE`) machine-parses every row by id, and the collision note is an HTML comment invisible to the parser — the duplicate is a real defect in a machine key, not cosmetic. **All three agree ⇒ decision.**

## Decision (all-three-agree)

1. **① ALLOWLIST, not reword.** One entry in `.gitleaks.toml` per the 14 Jul specific-finding directive. Executed with a correction found by canary: the house `regexTarget = "line"` form **leaked** — a planted `sk-proj-…` key appended to the allowlisted line was suppressed. The entry instead targets the **secret** itself, anchored (`^RPT-20260721-GPT-WALKTHROUGH$`), path-scoped. Canary re-run: planted key trips, the report id does not. Landed on #239 as 79b31ee.
2. **② RENUMBER the unmerged row, alias the escaped id.** This is the CVE-shaped reconciliation of the two auditors: the merged AMBUJ row keeps `-09` as the sole live holder (the merged-row rule is never touched); the unmerged GO-DOCTOR-FIX row takes the next free id with an explicit alias notation naming `-09`, so grep-resolution from the escaped citations (#219, c160274, the 11:49 mail) still lands on the row. The prose collision note is extended to record the resolution.
3. **Enforcement gap closed alongside:** the allocation bug is fixed (MAX+1) but nothing *rejects* a duplicate primary id at lint time — a uniqueness check is added so the class cannot recur silently.
4. **Critique REJECTED (recorded per the judge-the-critique step):** GPT's recommendation to send correction emails to downstream recipients — an external clinician does not need mail about internal directive numbering; a comment on closed #219 suffices. Also rejected: any alias sidecar file (aliases.csv) — the register is one file and the alias belongs in the row it describes.

## Full outputs (verbatim)

Both auditor outputs are preserved in the session transcript; verdict summaries above are complete
as to findings. Sources cited by Perplexity (9): docs.mia-platform.eu secret-scanning ·
stevekinney.com gitleaks course · oneuptime.com secret-detection + secret-scanning-gitleaks ·
medium.com gitleaks-workflow-errors · huskyci handling-false-positives ·
github.com/gitleaks/gitleaks/discussions/603 · dev.to devsecops-tools · skill4agent git-security-checks.
