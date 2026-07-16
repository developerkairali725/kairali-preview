/**
 * strip-annotations.mjs — THE RAW-ARTIFACT STRIPPER (X-19).
 *
 * WHY THIS EXISTS — a real incident, 15 Jul 2026:
 * We quarantined `demand.md` by prepending our own analysis ("⛔ DO NOT USE —
 * fake compound seeds, implausible zeros, England-only India…"). We then handed
 * that file to the Perplexity fact-gate. It dutifully "found" the faults — by
 * reciting OUR conclusions back at us ("the artifact itself states…"). That is
 * not verification; it is an echo wearing a verdict's clothes. Worse, it is the
 * mechanism by which a future agent could fake a passing fact-check: pre-load
 * the conclusion, let the auditor agree, ship the "evidence".
 *
 * THE RULE: a fact-grounding auditor must see the RAW artifact. Our annotations,
 * warnings, quarantine headers and conclusions are stripped before it ever
 * reads them. If a verdict's justification cites the artifact rather than an
 * external source, that finding is worthless.
 *
 * MASTER_PIPELINE build item #2 makes this a PRECONDITION of wiring the auditors
 * into CI, not a follow-up: "the draft named the hazard and then structured the
 * work so the hazard is the default path."
 *
 * Convention for new annotations — wrap them so stripping is exact:
 *   <!-- AGENT-ANALYSIS-START -->  …our commentary…  <!-- AGENT-ANALYSIS-END -->
 * Legacy/unmarked annotations are caught heuristically (see CONTAMINATION_MARKERS)
 * and reported, so nothing is removed silently.
 */

/** Explicit sentinels — the preferred, exact mechanism. */
const SENTINEL = /<!--\s*AGENT-ANALYSIS-START\s*-->[\s\S]*?<!--\s*AGENT-ANALYSIS-END\s*-->/g;

/**
 * Phrases that mark a block as OUR conclusion rather than the artifact's own
 * content. Deliberately narrow: over-stripping silently deletes real content and
 * would make an auditor judge a phantom.
 */
const CONTAMINATION_MARKERS = [
  /⛔/,
  /\bDO NOT USE\b/i,
  /\bquarantin/i,
  /\bsuperseded by\b/i,
  /\bthis data is flawed\b/i,
  /\baudit .{0,20}returned \*{0,2}FAIL/i,
  /\bverified against .{0,30}and (it was|they were) (right|correct)\b/i,
  /\bDATA FAULT\b/,
];

/** True if a chunk reads as our own analysis rather than source content. */
function looksLikeOurAnalysis(chunk) {
  return CONTAMINATION_MARKERS.some((re) => re.test(chunk));
}

/**
 * Strip our annotations from an artifact before a fact-checker reads it.
 *
 * @param {string} text raw file contents
 * @returns {{ clean: string, stripped: string[], wasContaminated: boolean }}
 *   `stripped` lists a short excerpt of each removed region so the removal is
 *   auditable — we never silently mutate evidence.
 */
export function stripAnnotations(text) {
  const stripped = [];
  let clean = text;

  // 1. exact, sentinel-wrapped regions
  clean = clean.replace(SENTINEL, (m) => {
    stripped.push(`[sentinel] ${excerpt(m)}`);
    return "";
  });

  // 2. a LEADING blockquote block that is our quarantine banner. Only the
  //    leading one: a blockquote deep in a document is far more likely to be
  //    genuine quoted source material, and removing that would corrupt the
  //    artifact under review.
  const lines = clean.split("\n");
  let i = 0;
  while (i < lines.length && lines[i].trim() === "") i++;
  if (i < lines.length && lines[i].startsWith(">")) {
    let j = i;
    while (j < lines.length && (lines[j].startsWith(">") || lines[j].trim() === "")) j++;
    const block = lines.slice(i, j).join("\n");
    if (looksLikeOurAnalysis(block)) {
      stripped.push(`[leading blockquote] ${excerpt(block)}`);
      clean = lines.slice(j).join("\n");
    }
  }

  // 3. HTML comments carrying our conclusions
  clean = clean.replace(/<!--[\s\S]*?-->/g, (m) =>
    looksLikeOurAnalysis(m) ? (stripped.push(`[html comment] ${excerpt(m)}`), "") : m,
  );

  return { clean: clean.replace(/^\n+/, ""), stripped, wasContaminated: stripped.length > 0 };
}

function excerpt(s) {
  const one = s.replace(/\s+/g, " ").trim();
  return one.length > 90 ? one.slice(0, 90) + "…" : one;
}

/**
 * Does a verdict cite the artifact instead of an external source? That is the
 * signature of a contaminated audit — the finding is worthless and the gate must
 * not count it as verification.
 *
 * @param {string} evidence the auditor's stated evidence for a finding
 */
export function isSelfReferentialEvidence(evidence) {
  return /\bthe artifact (itself )?(states|says|notes|admits|flags|explicitly)/i.test(evidence)
    || /\bas (stated|noted) in the (artifact|document|file)\b/i.test(evidence)
    || /\bthe (document|file) itself\b/i.test(evidence);
}
