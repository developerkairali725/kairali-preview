// Air India only: preserve a real published-terms link after regenerating its two specific views.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
export const TERMS_URL = "https://www.airindia.com/content/air-india/in/en/maharaja-club/partner-offers/kairali.html";
export const TERMS_ANCHOR = "<a data-ahv-airindia-terms=\"1\" href=\"https://www.airindia.com/content/air-india/in/en/maharaja-club/partner-offers/kairali.html\" target=\"_blank\" rel=\"noopener noreferrer\" style=\"display:inline-flex;align-items:center;min-height:44px;margin:0 0 20px;color:#F7F4EA;text-decoration:underline;text-underline-offset:3px\">Read Air India partnership terms</a>";
export function addTermsLink(template) {
  if (template.includes('data-ahv-airindia-terms="1"')) {
    if (!template.includes(TERMS_ANCHOR)) throw new Error("Unexpected existing Air India terms link; review before replacement");
    return template;
  }
  const marker = "{{ mv.membershipBanner.body }}</p>";
  if (template.split(marker).length !== 2) throw new Error("Expected exactly one Air India membership banner");
  return template.replace(marker, marker + "\n        " + TERMS_ANCHOR);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
 const site=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
 let changed=0;
 for (const variant of ["desktop","mobile"]) {
  const p=path.join(site,"public/ahv/views/ahv-page-campaign-retreat--air-india-"+variant+".json");
  const raw=fs.readFileSync(p,"utf8"), d=JSON.parse(raw), t=addTermsLink(d.template);
  if(t===d.template)continue;
  changed++;
  if(!process.argv.includes("--check"))fs.writeFileSync(p,raw.replace(JSON.stringify(d.template).slice(1,-1),JSON.stringify(t).slice(1,-1)));
 }
 if(process.argv.includes("--check") && changed)process.exitCode=1;
 console.log("Air India terms views requiring repair: "+changed);
}
