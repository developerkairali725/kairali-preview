// campaign-v2/kit/lint/language.ts
import type { CampaignConfig } from "../types.ts";
import type { Issue } from "./lengths.ts";
import { allText } from "./claims.ts";
import { altTexts } from "./assets.ts";
import { AWARD_PROPER_NOUNS } from "../../data/awards.ts";

// "cure" is deliberately absent: lintClaims already errors on it, so one word is not reported twice.
const BANNED = ["spa", "resort", "holiday", "luxury", "journey", "guests?"];
const BRITISH: [RegExp, string][] = [
  [/\bprogrammes?\b/i, "program"], [/\bcentres?\b/i, "center"], [/\bcentred\b/i, "centered"],
  [/\bcolour(s|ed|ful)?\b/i, "color"], [/\bpractise[sd]?\b/i, "practice/practiced"], [/\btraveller/i, "traveler"],
  [/\bfavourites?\b/i, "favorite"], [/\bhonour(s|ed)?\b/i, "honor"],
  [/\b(organis|personalis|recognis|specialis|minimis|maximis|optimis)(e|es|ed|ing|ation)\b/i, "-ize spelling"],
];
const THERAPY: [RegExp, string][] = [
  [/\bAbhyanga\b(?!m)/, "Abhyangam"], [/\bUdvartana\b/i, "Udhwarthanam"], [/\bNetra Tarpana\b(?!m)/, "Netra Tarpanam"],
];
const TIME = /\b(within|in)\s+(\d+|a few|few)\s+(minutes?|mins?|hours?|hrs?)\b|\bin minutes\b/gi;
const REPLYWORD = /\b(repl(y|ies)|respon(d|ds|se)|answers?|call you back|call back|get back|hear from|contact you|be in touch)\b/gi;
const wordIndex = (text: string, pos: number) => (text.slice(0, pos).match(/\S+/g) || []).length;
function replyTime(text: string): boolean {
  const times = [...text.matchAll(TIME)].map((m) => wordIndex(text, m.index ?? 0));
  const replies = [...text.matchAll(REPLYWORD)].map((m) => wordIndex(text, m.index ?? 0));
  return times.some((t) => replies.some((r) => Math.abs(t - r) <= 8));
}

const GENERIC = new Set("kerala india indian south north city cities treatment treatments therapy therapies ayurveda ayurvedic hospital centre center clinic program programs programme retreat package packages best near me top cost price".split(" "));
const core = (t: string) => (t.toLowerCase().match(/[\p{L}\p{N}]+/gu) || []).filter((w) => w.length >= 3 && !GENERIC.has(w));

// Award names from data/awards.ts are proper nouns ("World Luxury Hotel & Spa Awards"): the register check skips them.
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const AWARD_NAMES = new RegExp([...AWARD_PROPER_NOUNS].sort((a, b) => b.length - a.length).map((n) => escape(n).replace(/'/g, "['’]")).join("|"), "gi");
export const withoutAwardNames = (text: string): string => text.replace(AWARD_NAMES, "");

export function lintLanguage(c: CampaignConfig): Issue[] {
  const out: Issue[] = [];
  const allowed = new Set((c.wordingOverrides ?? []).map((o) => o.term.toLowerCase()));
  // House spelling: American by default (guide §8.1). "en-GB" only with a recorded reason (e.g. a production page
  // whose reviewed copy is British); the reason is required, never assumed.
  const spelling = c.spelling;
  const british = spelling?.locale === "en-GB";
  if (spelling?.locale === "en-GB" && !(typeof spelling.reason === "string" && spelling.reason.trim())) out.push({ level: "error", rule: "spelling.locale", path: "spelling.reason", message: "en-GB needs a recorded reason" });
  for (const { path, text } of allText(c)) {
    const registerText = withoutAwardNames(text);
    for (const w of BANNED) {
      const m = registerText.match(new RegExp(`\\b${w}\\b`, "i"));
      if (m && !allowed.has(m[0].toLowerCase()) && !allowed.has(m[0].toLowerCase().replace(/s$/, ""))) {
        out.push({ level: "warning", rule: "register", path, message: `banned register word "${m[0]}" (owner override needed)` });
      }
    }
    const spellText = registerText.replace(/Travell?ers['’]?\s+Choice/gi, "");
    if (!british) for (const [re, us] of BRITISH) if (re.test(spellText)) out.push({ level: "error", rule: "spelling.us", path, message: `use American spelling: ${us}` });
    for (const [re, good] of THERAPY) if (re.test(text)) out.push({ level: "warning", rule: "therapy-names", path, message: `use ${good}` });
    if (replyTime(text)) out.push({ level: "error", rule: "reply-time", path, message: "no reply-time promises" });
  }
  // Alt text (guide §9: "never write … in alt text"): the register words, with award proper nouns exempt as above.
  for (const { path, text } of altTexts(c)) {
    const registerText = withoutAwardNames(text);
    for (const w of BANNED) {
      const m = registerText.match(new RegExp(`\\b${w}\\b`, "i"));
      if (m && !allowed.has(m[0].toLowerCase()) && !allowed.has(m[0].toLowerCase().replace(/s$/, ""))) out.push({ level: "warning", rule: "register", path, message: `banned register word "${m[0]}" in alt text (owner override needed)` });
    }
  }
  const h1Words = new Set(core(typeof c.hero.h1 === "string" ? c.hero.h1 : ""));
  const keywords = (c.adMatch.keywords ?? []).filter((k): k is string => typeof k === "string");
  const keyWords = keywords.flatMap(core);
  if (h1Words.size && keyWords.length && !keyWords.some((w) => h1Words.has(w))) out.push({ level: "warning", rule: "ad-match", path: "hero.h1", message: "h1 shares no core keyword with adMatch.keywords" });
  return out;
}
