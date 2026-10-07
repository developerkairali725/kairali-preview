// Type check for `pnpm lp:check` (guide §14: schema/type errors are errors). Node type-stripping never checks
// types, so a misspelt or missing CampaignConfig field would otherwise pass. Runs the site's own tsc once
// (whole project, no emit, ~3 s) and keeps only diagnostics in campaign-v2/ (the kit and every campaign file).
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const HEAD = /^(.+?)\((\d+),(\d+)\): error (TS\d+): (.*)$/;

/** Pure: tsc --pretty false output → diagnostics under `prefix` (continuation lines folded in). Exported for tests. */
export function parseTscOutput(text, prefix = "campaign-v2/") {
  const out = [];
  let cur = null;
  for (const line of String(text).split(/\r?\n/)) {
    const m = line.match(HEAD);
    if (m) {
      const file = m[1].split(path.sep).join("/");
      cur = file.startsWith(prefix) ? { file, line: Number(m[2]), col: Number(m[3]), code: m[4], message: m[5] } : null;
      if (cur) out.push(cur);
    } else if (cur && /^\s+\S/.test(line)) {
      cur.message += " " + line.trim();
    } else {
      cur = null;
    }
  }
  return out;
}

/** Runs tsc. Returns { ok, diagnostics, error? }. `error` is set when tsc itself could not run. */
export function typeCheck({ cwd = SITE, prefix = "campaign-v2/" } = {}) {
  let tsc;
  try { tsc = createRequire(path.join(cwd, "package.json")).resolve("typescript/bin/tsc"); }
  catch { return { ok: false, diagnostics: [], error: "typescript is not installed (run pnpm install)" }; }
  const r = spawnSync(process.execPath, [tsc, "--noEmit", "--pretty", "false", "--incremental", "false", "-p", "."], { cwd, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (r.error) return { ok: false, diagnostics: [], error: String(r.error.message || r.error) };
  const diagnostics = parseTscOutput(r.stdout + "\n" + r.stderr, prefix);
  return { ok: diagnostics.length === 0, diagnostics };
}
