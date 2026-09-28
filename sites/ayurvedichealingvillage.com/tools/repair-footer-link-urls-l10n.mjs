// Locale link audit (28 Sep 2026): the shared footer built every link as B + slug + '/'. In a locale that has its own
// slugs (DE/FR legacy URLs) that produced 404s on every page (/de/our-villas/ vs the served /de/unsere-villen/), and
// the slug literals were extracted as copy, so some were translated ('offers' -> 'Angebote'). Each entry now carries
// its full site URL: English output is byte-for-byte the same href, the locale build maps it through the route table,
// and a URL is never extracted as translatable text. Idempotent.
//   node tools/repair-footer-link-urls-l10n.mjs [--check]
import fs from "node:fs";
const CHECK = process.argv.includes("--check");
const FILE = "public/ahv/components/AHV Chrome Footer.dc.html";
let s = fs.readFileSync(FILE, "utf8");
const before = s;
// ['Label','slug'] -> ['Label','https://ayurvedichealingvillage.com/slug/'] inside the four link arrays only
s = s.replace(/const (EXPLORE|DISCOVER|MORE|LEGAL) = (\[[^\n]*\]);/g, (m, name, arr) =>
  `const ${name} = ${arr.replace(/\['((?:[^'\\]|\\.)*)','([a-z0-9-]+)'\]/g, (mm, label, slug) => `['${label}','https://ayurvedichealingvillage.com/${slug}/']`)};`);
s = s.replace("const map = (a) => a.map(x => ({ label: x[0], href: B + x[1] + '/' }));", "const map = (a) => a.map(x => ({ label: x[0], href: x[1] }));");
if (s !== before && !/href: x\[1\] \}/.test(s)) throw new Error("map anchor not replaced");
if (/'\],\['[^']*','[a-z0-9-]+'\]/.test(s)) throw new Error("a slug entry was left unconverted");
if (!CHECK && s !== before) fs.writeFileSync(FILE, s);
console.log(s === before ? "already applied" : CHECK ? "would change" : "changed");
if (CHECK && s !== before) process.exitCode = 1;
