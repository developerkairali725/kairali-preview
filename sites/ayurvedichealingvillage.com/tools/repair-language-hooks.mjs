// Stable hooks for the language switcher (25 Sep 2026, localization). The
// switcher cannot select by visible text or aria-label: both are translated.
// Adds data-ahv-lang-badge (the header "EN" controls), data-ahv-drawer (the
// mobile header drawer) and data-ahv-lang-line (the home menu's static
// language line). Attributes only — no text, style or structure changes. Idempotent.
import fs from "node:fs";
const edits = [
  { file: "public/ahv/components/AHV Chrome Header.dc.html", kind: "html", pairs: [
    [/<span style="display:flex;align-items:center;gap:6px;color:#2A2118;font-weight:700;font-size:13px;letter-spacing:1\.5px;white-space:nowrap;min-height:44px">/g, (m) => m.replace("<span ", "<span data-ahv-lang-badge=\"\" ")],
    [/<span style="border:1px solid #C9BFA8;border-radius:4px;padding:0 clamp\(6px,1\.7vw,11px\);min-height:44px;box-sizing:border-box;display:inline-flex;align-items:center;font-weight:700;font-size:13px;letter-spacing:1px;color:#2A2118">EN<\/span>/g, (m) => m.replace("<span ", "<span data-ahv-lang-badge=\"\" ")],
    [/<div style="display:\{\{ drawerDisp \}\};/g, (m) => m.replace("<div ", "<div data-ahv-drawer=\"\" ")],
  ] },
  { file: "public/ahv/views/home-mobile.json", kind: "view", pairs: [
    [/<span style="border:1px solid #C9BFA8;border-radius:4px;padding:0 11px;min-height:44px;box-sizing:border-box;display:inline-flex;align-items:center;font-weight:700;font-size:13px;letter-spacing:1px;color:#2A2118">EN<\/span>/g, (m) => m.replace("<span ", "<span data-ahv-lang-badge=\"\" ")],
    [/<div style="font-size:11\.5px;font-weight:700;letter-spacing:2\.2px;color:#75695A;margin-top:16px">ENGLISH · FRANÇAIS · DEUTSCH<\/div>/g, (m) => m.replace("<div ", "<div data-ahv-lang-line=\"\" ")],
  ] },
  { file: "public/ahv/views/home-hi-fi-v4.json", kind: "view", pairs: [
    [/<a href="https:\/\/ayurvedichealingvillage\.com\/" style="[^"]*"><svg[^>]*>(?:(?!<\/svg>)[\s\S])*<\/svg>EN ▾<\/a>/g, (m) => m.replace("<a ", "<a data-ahv-lang-badge=\"\" ")],
  ] },
];
let n = 0;
for (const e of edits) {
  const raw = fs.readFileSync(e.file, "utf8");
  const v = e.kind === "view" ? JSON.parse(raw) : null;
  let t = v ? v.template : raw;
  for (const [re, fn] of e.pairs) {
    t = t.replace(re, (m) => { if (m.includes("data-ahv-")) return m; n++; return fn(m); });
  }
  if (v) { v.template = t; fs.writeFileSync(e.file, JSON.stringify(v, null, 2) + "\n"); } else fs.writeFileSync(e.file, t);
}
console.log(`language hooks added: ${n}`);
