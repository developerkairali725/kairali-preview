/**
 * One-off, reviewed codemod: route the native pages' visible strings through
 * the locale dictionary. JSX text → {T("…")}, text-bearing JSX attributes →
 * attr={T("…")}, display literals in JSX expressions → T("…"), internal
 * root-relative hrefs → {L("…")}. Components get T/L from the locale (server:
 * t()/localizedPath(); client: useT()/useL()). English output is unchanged
 * (T returns the source for "en"). Diffs are reviewed by hand afterwards.
 *   node tools/l10n/codemod-native.mjs <file.tsx> [...]
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const req = createRequire(import.meta.url);
const store = path.resolve("../../node_modules/.pnpm");
const babel = req(path.join(store, fs.readdirSync(store).filter((d) => /^@babel\+parser@7\./.test(d)).sort().pop(), "node_modules/@babel/parser"));
const norm = (s) => s.replace(/[\s ]+/g, " ").trim();
const meaningful = (s) => /\p{L}/u.test(s);
const TEXT_ATTRS = /^(alt|aria-label|title|placeholder|label|aria-description)$/;
const DISPLAY_KEYS = /^(label|title|heading|text|body|description|desc|cta|question|answer|lede|intro|note|caption|name|hint|summary|kicker|eyebrow|button|message|empty|subtitle|help)$/;
for (const file of process.argv.slice(2)) {
  const code = fs.readFileSync(file, "utf8");
  const client = /^\s*['"]use client['"]/.test(code);
  const ast = babel.parse(code, { sourceType: "module", plugins: ["typescript", "jsx"] });
  const edits = [];
  const fnStarts = [];
  const walk = (node, parent, inFn) => {
    if (!node || typeof node.type !== "string") return;
    const isFn = /Function/.test(node.type);
    if (isFn && /^[A-Z]/.test(node.id?.name || (parent?.type === "VariableDeclarator" ? parent.id.name : "") || "") && node.body?.type === "BlockStatement") fnStarts.push(node);
    const within = inFn || isFn;
    if (within && node.type === "JSXText") {
      const s = norm(node.value);
      if (meaningful(s)) {
        const lead = node.value.match(/^\s*/)[0], trail = node.value.match(/\s*$/)[0];
        const keepLead = lead && !lead.includes("\n") ? "{" + JSON.stringify(lead) + "}" : lead;
        const keepTrail = trail && !trail.includes("\n") ? "{" + JSON.stringify(trail) + "}" : trail;
        edits.push([node.start, node.end, keepLead + "{T(" + JSON.stringify(s) + ")}" + keepTrail]);
      }
    } else if (within && node.type === "JSXAttribute" && node.value?.type === "StringLiteral") {
      const n = String(node.name.name);
      if (TEXT_ATTRS.test(n) && meaningful(node.value.value)) edits.push([node.value.start, node.value.end, "{T(" + JSON.stringify(norm(node.value.value)) + ")}"]);
      if (n === "href" && /^\/(?!ahv\/|documents\/|api\/|_next\/)[a-z0-9-/]*(#[\w-]*)?$/.test(node.value.value)) {
        const [p, h] = node.value.value.split("#");
        edits.push([node.value.start, node.value.end, "{L(" + JSON.stringify(p) + ")" + (h !== undefined ? " + " + JSON.stringify("#" + h) : "") + "}"]);
      }
    } else if (within && node.type === "StringLiteral" && parent && meaningful(node.value) && !/^(\/|https?:|#|mailto:|tel:)/.test(node.value) && !/^[a-z][\w-]*$/.test(node.value)) {
      const inExpr = parent.type === "JSXExpressionContainer" || parent.type === "ConditionalExpression" || parent.type === "LogicalExpression";
      const k = parent.type === "ObjectProperty" && parent.value === node ? parent.key.name || parent.key.value : null;
      if (inExpr || (k && DISPLAY_KEYS.test(k))) edits.push([node.start, node.end, "T(" + JSON.stringify(norm(node.value)) + ")"]);
    }
    if (within && !client && node.type === "JSXExpressionContainer" && node.expression?.type === "MemberExpression" && !node.expression.computed && DISPLAY_KEYS.test(node.expression.property.name) && parent?.type === "JSXElement") {
      edits.push([node.expression.start, node.expression.end, "T(" + code.slice(node.expression.start, node.expression.end) + ")"]);
    }
    if (within && node.type === "TemplateLiteral" && parent?.type === "JSXExpressionContainer" && node.quasis.some((q) => meaningful(q.value.cooked || ""))) console.error(`MANUAL ${file}:${code.slice(0, node.start).split("\n").length} template literal with prose: ${code.slice(node.start, node.end).slice(0, 90)}`);
    for (const key of Object.keys(node)) {
      if (["loc", "start", "end", "extra", "comments", "leadingComments", "trailingComments", "innerComments"].includes(key)) continue;
      const v = node[key];
      if (Array.isArray(v)) v.forEach((c) => walk(c, node, within));
      else if (v && typeof v.type === "string") walk(v, node, within);
    }
  };
  walk(ast.program, null, false);
  // inject T/L at the top of each component body
  for (const fn of fnStarts) {
    const at = fn.body.start + 1;
    edits.push([at, at, client
      ? "\n const T = useT(); const L = useL();"
      : "\n const T = (s: string) => translate(locale, s); const L = (p: string) => localizedPath(p, locale) ?? p;"]);
    if (!client && fn.params.length === 0) {
      const open = code.indexOf("(", fn.id ? fn.id.end : fn.start);
      edits.push([open + 1, open + 1, "{ locale = \"en\" }: { locale?: LocaleCode }"]);
    }
  }
  edits.sort((a, b) => b[0] - a[0] || b[1] - a[1]);
  let out = code;
  let last = Infinity;
  for (const [s, e, r] of edits) { if (e > last) continue; out = out.slice(0, s) + r + out.slice(e); last = s; }
  const imp = client
    ? `import { useT, useL } from "${path.relative(path.dirname(file), "app/(english)/_families/l10n-client").replace(/^(?!\.)/, "./")}";\n`
    : `import { translate, localizedPath, type LocaleCode } from "${path.relative(path.dirname(file), "app/(english)/_families/l10n").replace(/^(?!\.)/, "./")}";\n`;
  out = client ? out.replace(/^(\s*['"]use client['"];?\n)/, `$1${imp}`) : imp + out;
  // Next.js allows only its own exports in page.tsx: the localized view moves to
  // view.tsx (named PageView) and page.tsx re-exports metadata + a thin default.
  if (!client && /export default function Page\(\{ locale/.test(out)) {
    out = out.replace(/export default function Page\(\{ locale = "en" \}: \{ locale\?: LocaleCode \}\)/, "export function PageView({ locale = \"en\" }: { locale?: LocaleCode })");
    const viewFile = path.join(path.dirname(file), "view.tsx");
    fs.writeFileSync(viewFile, out);
    const hasMeta = /export const metadata/.test(out), hasDyn = out.match(/export const (dynamic|revalidate)\s*=\s*[^;\n]+/g) || [];
    fs.writeFileSync(file, `import { PageView } from "./view";\n${hasMeta ? 'export { metadata } from "./view";\n' : ""}${hasDyn.join(";\n")}${hasDyn.length ? ";\n" : ""}\n/** English route; the localized view is shared with the locale lane (app/(english)/_families/native-pages.tsx). */\nexport default function Page() {\n  return <PageView />;\n}\n`);
    console.log(`${file}: ${edits.length} edits → view.tsx + thin page.tsx`);
    continue;
  }
  fs.writeFileSync(file, out);
  console.log(`${file}: ${edits.length} edits`);
}
