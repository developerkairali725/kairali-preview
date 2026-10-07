import { CAMPAIGNS } from "../campaign-v2/campaigns/index.ts";
import { lintCampaign } from "../campaign-v2/kit/lint/index.ts";
import { collectPending } from "../campaign-v2/kit/pending.ts";
import { typeCheck } from "./lp-typecheck.mjs";

// pnpm lp:check [slug…] [--production] [--no-types]
//   --production  lint as a production route (any pending() is an error)
//   --no-types    skip the tsc type check (it runs once for all slugs, ~3 s)
const args = process.argv.slice(2);
const forceProd = args.includes("--production");
const skipTypes = args.includes("--no-types");
const slugs = args.filter((a) => !a.startsWith("--"));
const targets = slugs.length ? slugs : Object.keys(CAMPAIGNS).filter((s) => s !== "_template");

for (const slug of targets) {
  if (!Object.hasOwn(CAMPAIGNS, slug)) {
    console.log(`✖ unknown campaign: ${slug} (is it registered in campaign-v2/campaigns/index.ts?)`);
    process.exit(2);
  }
}

let failed = false;
if (!skipTypes) {
  const tc = typeCheck();
  if (!tc.ok) failed = true;
  if (tc.error) console.log(`✖ types: could not run tsc: ${tc.error}`);
  else console.log(`${tc.ok ? "✔" : "✖"} types (campaign-v2/: ${tc.diagnostics.length} errors)`);
  for (const d of tc.diagnostics) console.log(`  error   ${("type." + d.code).padEnd(22)} ${d.file}:${d.line}:${d.col}  ${d.message}`);
}

for (const slug of targets) {
  const c = CAMPAIGNS[slug];
  const prod = forceProd || c.production;
  const { errors, warnings } = lintCampaign(forceProd ? { ...c, production: true } : c);
  if (errors.length) failed = true;
  console.log(`${errors.length ? "✖" : "✔"} ${slug} (${errors.length} errors, ${warnings.length} warnings)`);
  for (const i of [...errors, ...warnings]) console.log(`  ${i.level.padEnd(7)} ${i.rule.padEnd(22)} ${i.path}  ${i.message}`);
  // On a preview the placeholders are allowed; list them so the author sees what is still open (guide §2).
  if (!prod) {
    const open = collectPending(c);
    if (open.length) console.log(`  ${open.length} pending() placeholder(s), allowed on preview, errors on production:`);
    for (const p of open) console.log(`  pending ${p.id.padEnd(22)} ${p.path}  ${p.note}`);
  }
}
process.exit(failed ? 1 : 0);
