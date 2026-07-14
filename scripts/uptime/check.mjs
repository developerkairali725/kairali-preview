// Interim uptime listener (Ship Gate B10) — deterministic, no AI, no deps.
// Reads sites.json, probes each URL, prints a report, exits 1 if anything
// is DOWN. The workflow turns a non-zero exit into a GitHub issue.
//
// Judgement rules (mirrors scripts/redirects/verify-forwards.sh):
//   2xx/3xx            → UP
//   403 + cf headers   → UP for expect:"cf" sites (bot challenge = alive)
//   timeout / 5xx / network error → DOWN (after one retry, 15s apart)
import { readFileSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

const { sites } = JSON.parse(
  readFileSync(new URL("./sites.json", import.meta.url), "utf8"),
);

const TIMEOUT_MS = 20_000;
const UA = "kairali-uptime/1.0 (+https://github.com/kairali-digital/kairali-web-factory)";

async function probe(site) {
  const method = site.method ?? "HEAD";
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(site.url, {
      method,
      redirect: "follow",
      signal: ctrl.signal,
      headers: { "user-agent": UA },
    });
    const cfServed = res.headers.get("server")?.includes("cloudflare") || res.headers.has("cf-ray");
    if (res.ok || (res.status >= 300 && res.status < 400)) return { up: true, status: res.status };
    // Some hosts reject HEAD (405) — a body-bearing GET answer still means UP.
    if (res.status === 405 && method === "HEAD") return probe({ ...site, method: "GET" });
    if (res.status === 403 && site.expect === "cf" && cfServed) return { up: true, status: 403, note: "cf-challenge" };
    return { up: false, status: res.status };
  } catch (err) {
    return { up: false, status: 0, note: err.name === "AbortError" ? "timeout" : String(err.cause?.code ?? err.message) };
  } finally {
    clearTimeout(timer);
  }
}

async function probeWithRetry(site) {
  const first = await probe(site);
  if (first.up) return first;
  await sleep(15_000);
  const second = await probe(site);
  return { ...second, retried: true };
}

const results = await Promise.all(
  sites.map(async (s) => ({ site: s, ...(await probeWithRetry(s)) })),
);

const down = results.filter((r) => !r.up);
for (const r of results) {
  const flag = r.up ? "UP  " : "DOWN";
  console.log(
    `${flag} ${String(r.status).padStart(3)} ${r.site.name.padEnd(28)} ${r.site.url}${r.note ? `  (${r.note})` : ""}${r.retried ? "  [after retry]" : ""}`,
  );
}

if (down.length > 0) {
  // Machine-readable block the workflow lifts into the issue body.
  console.log("\n::DOWN-REPORT::");
  console.log(
    down.map((r) => `- **${r.site.name}** ${r.site.url} — status ${r.status}${r.note ? ` (${r.note})` : ""}`).join("\n"),
  );
  process.exit(1);
}
console.log(`\nAll ${results.length} sites up.`);
