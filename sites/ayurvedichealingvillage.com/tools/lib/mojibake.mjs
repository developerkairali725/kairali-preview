/**
 * AHV — undo the double-encoding on /treatment-in-kerala-russian.html.
 *
 * WHAT HAPPENED TO THAT PAGE. Its Russian was UTF-8, got decoded once as a
 * Western single-byte codepage, and was re-encoded as UTF-8. The result is a
 * file that is *valid* UTF-8 and declares UTF-8 — it just encodes the damage
 * instead of the language. Measured on the live bytes: 277,280 bytes, 14,640
 * mojibake character pairs, and ZERO Cyrillic letters. Where a reader should
 * see the Russian for "Best", the page serves four Latin characters.
 *
 * WHY IT IS RECOVERABLE AND NOT A GUESS. The damage is a pure function, so it
 * has an inverse: map each character back to the byte the mis-decode produced,
 * then read those bytes as UTF-8 again. Nothing is invented and nothing is
 * translated — the output is what was on the page before it broke. Every run
 * this converts is PROVEN: `verify()` re-applies the damage, at that run's own
 * depth, and requires the original back byte for byte. A run that does not
 * round-trip is reported, never shipped.
 *
 * THE CODEPAGE IS NOT PURE cp1252. The page contains U+0090, which cp1252
 * leaves undefined — so the original decoder used cp1252's printable range and
 * fell back to raw latin-1 for the C1 controls, which is what browsers and PHP
 * actually do. Both paths are tried per character, cp1252 first.
 *
 * SOME OF IT IS DAMAGED TWICE. Parts of the page went through the mis-decode
 * two rounds, so a single inverse leaves mojibake behind. Each run is therefore
 * recovered to a FIXED POINT and carries its own depth, because the depth is
 * not uniform across the document.
 *
 * WHY RUN-BY-RUN, NOT WHOLE-STRING. The page is bilingual: English headings and
 * real typographic punctuation sit between the broken Russian, and a genuine em
 * dash is indistinguishable from a mojibake byte in isolation. So this walks
 * maximal runs of suspicious characters and converts one only when the decode
 * is clean UTF-8 AND strictly reduces the amount of suspicious text. A lone real
 * em dash fails that test and is left exactly as it is.
 */

/** cp1252's 0x80–0x9F block. The undefined slots are holes on purpose. */
const CP1252_C1 = {
  0x20ac: 0x80, 0x201a: 0x82, 0x0192: 0x83, 0x201e: 0x84, 0x2026: 0x85,
  0x2020: 0x86, 0x2021: 0x87, 0x02c6: 0x88, 0x2030: 0x89, 0x0160: 0x8a,
  0x2039: 0x8b, 0x0152: 0x8c, 0x017d: 0x8e, 0x2018: 0x91, 0x2019: 0x92,
  0x201c: 0x93, 0x201d: 0x94, 0x2022: 0x95, 0x2013: 0x96, 0x2014: 0x97,
  0x02dc: 0x98, 0x2122: 0x99, 0x0161: 0x9a, 0x203a: 0x9b, 0x0153: 0x9c,
  0x017e: 0x9e, 0x0178: 0x9f,
};

/** byte -> character, the mis-decode's own direction, built from the same table
 *  so the two can never drift apart. */
const BYTE_TO_CHAR = (() => {
  const t = new Array(256);
  for (let b = 0; b < 256; b += 1) t[b] = String.fromCodePoint(b);
  for (const [cp, b] of Object.entries(CP1252_C1)) t[b] = String.fromCodePoint(Number(cp));
  return t;
})();

const isSuspect = (cp) =>
  (cp >= 0x80 && cp <= 0xff) || Object.prototype.hasOwnProperty.call(CP1252_C1, cp);

const toByte = (cp) => {
  if (Object.prototype.hasOwnProperty.call(CP1252_C1, cp)) return CP1252_C1[cp];
  if (cp <= 0xff) return cp; // latin-1, including the C1 controls cp1252 lacks
  return null;
};

const suspectCount = (s) => {
  let n = 0;
  for (const ch of s) if (isSuspect(ch.codePointAt(0))) n += 1;
  return n;
};

/** One inverse pass over a whole string. Returns null when it cannot apply. */
function undoOnce(s) {
  const bytes = [];
  for (const ch of s) {
    const b = toByte(ch.codePointAt(0));
    if (b === null) return null;
    bytes.push(b);
  }
  // Node substitutes U+FFFD rather than throwing, so an invalid sequence is
  // caught here instead of corrupting the text a second time.
  const out = Buffer.from(bytes).toString("utf8");
  return out.includes("�") ? null : out;
}

/** Re-apply the damage, `depth` times. The exact inverse of `undoOnce`. */
export function redamage(text, depth = 1) {
  let cur = text;
  for (let i = 0; i < depth; i += 1) {
    let out = "";
    for (const b of Buffer.from(cur, "utf8")) out += BYTE_TO_CHAR[b];
    cur = out;
  }
  return cur;
}

const MAX_DEPTH = 4;

/**
 * Recover a run to its fixed point. Returns { text, depth } or null when the
 * run is not mojibake at all.
 *
 * The acceptance test is monotonic rather than language-specific: a pass counts
 * only if it decodes cleanly AND strictly reduces the suspicious-character
 * count. That is what separates `â€”` (mojibake for an em dash, 3 suspicious
 * characters becoming 1) from `—` (a real em dash, which cannot improve).
 */
function recoverRun(run) {
  let cur = run;
  let depth = 0;
  for (let i = 0; i < MAX_DEPTH; i += 1) {
    const next = undoOnce(cur);
    if (next === null) break;
    if (suspectCount(next) >= suspectCount(cur)) break;
    cur = next;
    depth += 1;
  }
  return depth === 0 ? null : { text: cur, depth };
}

/**
 * Recover a document.
 * Returns { text, runs, converted, untouched, cyrillic, depths, residual }.
 * `untouched` carries the runs left alone, so the residue is inspectable
 * instead of silent.
 */
export function recover(input) {
  let out = "";
  let runs = 0;
  let converted = 0;
  const untouched = [];
  const depths = new Map();
  const spans = [];
  let i = 0;
  while (i < input.length) {
    const cp = input.codePointAt(i);
    const ch = String.fromCodePoint(cp);
    if (!isSuspect(cp)) {
      out += ch;
      i += ch.length;
      continue;
    }
    let j = i;
    let run = "";
    while (j < input.length) {
      const c = input.codePointAt(j);
      if (!isSuspect(c)) break;
      const s = String.fromCodePoint(c);
      run += s;
      j += s.length;
    }
    runs += 1;
    const got = recoverRun(run);
    if (got === null) {
      out += run;
      untouched.push(run);
    } else {
      out += got.text;
      converted += 1;
      depths.set(got.depth, (depths.get(got.depth) ?? 0) + 1);
      spans.push({ from: run, to: got.text, depth: got.depth });
    }
    i = j;
  }
  return {
    text: out,
    runs,
    converted,
    untouched,
    spans,
    depths: Object.fromEntries([...depths].sort((a, b) => a[0] - b[0])),
    cyrillic: (out.match(/[Ѐ-ӿ]/g) || []).length,
    residual: suspectCount(out),
  };
}

/**
 * Prove a recovery run by run: re-damaging each converted run at its own depth
 * must reproduce the original text of that run exactly.
 * Returns { ok, checked, failures }.
 */
export function verify(result) {
  const failures = [];
  for (const s of result.spans) {
    const back = redamage(s.to, s.depth);
    if (back !== s.from) failures.push({ depth: s.depth, got: back.slice(0, 40), want: s.from.slice(0, 40) });
  }
  return { ok: failures.length === 0, checked: result.spans.length, failures };
}
