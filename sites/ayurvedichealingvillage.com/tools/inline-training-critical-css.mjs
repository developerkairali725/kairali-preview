import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { TRAINING_SNAPSHOT_ROUTES } from "../app/(english)/_families/training-snapshot-fonts.mjs";
const sha = text => createHash("sha256").update(text).digest("hex");
/** Exact Next CSS bytes, original order; Flight/RSC strings are never edited. */
export function inlineTrainingCss(html, readCss, { allowNoStylesheets = false } = {}) {
  const boundary = html.indexOf("<script>(self.__next_f");
  if (boundary < 0) throw new Error("Missing Flight boundary");
  const records = [];
  const prefix = html.slice(0, boundary).replace(/<link\b[^>]*>/g, tag => {
    if (!/rel="stylesheet"/.test(tag)) return tag;
    const match = tag.match(/href="(\/_next\/static\/css\/[a-f0-9]+\.css)"/);
    if (!match) return tag;
    if (!/data-precedence="next"/.test(tag)) throw new Error("Unexpected Next stylesheet precedence");
    const css = readCss(match[1]);
    if (!css || /<\/style/i.test(css)) throw new Error("Unsafe or empty compiled stylesheet");
    records.push({ href: match[1], cssSha256: sha(css), cssBytes: Buffer.byteLength(css) });
    return `<style data-precedence="next" data-href="${match[1]}">${css}</style>`;
  });
  if (!records.length && !allowNoStylesheets) throw new Error("No original Next stylesheets to inline");
  return { html: prefix + html.slice(boundary), records };
}
export function buildTrainingCss(site) {
  const routeTable = JSON.parse(fs.readFileSync(path.join(site,"l10n/routes.json"),"utf8")).routes;
  const planned = [];
  for (const route of TRAINING_SNAPSHOT_ROUTES) {
    const locales = Object.values(routeTable[route] || {});
    if (locales.length !== 13) throw new Error("Expected thirteen training locales: " + route);
    for (const localized of locales) {
      const file = path.join(site,".next/server/app",localized.replace(/^\/|\/$/g,"") + ".html");
      const before = fs.readFileSync(file,"utf8");
      const result = inlineTrainingCss(before, href => fs.readFileSync(path.join(site,".next",href.slice("/_next/".length)),"utf8"), { allowNoStylesheets: localized === route });
      planned.push({ file, html: result.html, route: localized, beforeSha256: sha(before), afterSha256: sha(result.html), styles: result.records });
    }
  }
  if (planned.length !== 91) throw new Error("Unexpected training route count");
  // Validate every input before changing any output; all other page files stay untouched.
  for (const row of planned) fs.writeFileSync(row.file,row.html);
  fs.writeFileSync(path.join(site,".next/training-css-inline.json"),JSON.stringify({status:"PASS",pages:planned.map(({file,html,...proof})=>proof)},null,2)+"\n");
  console.log("Training critical CSS: exact stylesheet bytes inlined in " + planned.length + " localized pages; Flight unchanged.");
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) buildTrainingCss(path.resolve(path.dirname(fileURLToPath(import.meta.url)),".."));
