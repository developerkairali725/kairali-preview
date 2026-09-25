// Adds Dr Deepu John's approved referral/transfer FAQ (Gmail 1a0d8161285e0b95,
// 25 Sep 2026, "Website FAQ – Suggested wording") to the Addiction Recovery
// page, directly after the withdrawal-acceptance question, in every surface
// that carries the FAQ: the approved-FAQ ledger, both views' visible <details>,
// both views' FAQPage JSON-LD and the view logic list. Idempotent.
// The prerender snapshot is regenerated afterwards (template ids shift).
import fs from "node:fs";

const ROUTE = "/de-addiction-and-rehabilitation-from-alcohol-drugs-tobacco/";
const AFTER_Q = "Do you accept patients undergoing alcohol or drug withdrawal?";
const Q = "What happens if a patient undergoing withdrawal requires a higher level of medical care?";
const A = "Withdrawal is managed under medical supervision at Kairali. If a patient's condition requires emergency treatment, specialist assessment, investigations, or intensive care beyond the level available at the facility, the Treating Physician/RMO will assess the situation and arrange referral or hospital transfer as clinically appropriate. Emergency and intensive-care cases may be referred to Thankam Hospital, Palakkad, while investigations or examinations may be arranged at Pulse Doctors and Labs, Palakkad, as required. Transport and appropriate accompaniment are arranged by the Front Office team, with clinical escort where necessary. Patients and companions are informed that additional ambulance, escort, hospital and treatment charges may apply.";

const html = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const jsonStr = (s) => JSON.stringify(s);
let changed = 0;

// 1. Ledger
const ledgerPath = "english-candidate/approved-programme-faqs-20260925.json";
const ledger = JSON.parse(fs.readFileSync(ledgerPath, "utf8"));
const row = ledger.routes.find((r) => r.route === ROUTE);
if (!row.faqs.some((f) => f.q === Q)) {
  const i = row.faqs.findIndex((f) => f.q === AFTER_Q);
  if (i < 0) throw new Error("anchor question missing in ledger");
  row.faqs.splice(i + 1, 0, { q: Q, a: A });
  if (!row.sources.includes("CLINICAL-REFERRAL-FAQ-20260925 (Gmail 1a0d8161285e0b95, Dr Deepu John)"))
    row.sources.push("CLINICAL-REFERRAL-FAQ-20260925 (Gmail 1a0d8161285e0b95, Dr Deepu John)");
  fs.writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2) + "\n");
  changed++;
}

// 2. Views
for (const side of ["desktop", "mobile"]) {
  const p = `public/ahv/views/ahv-page-de-addiction-rehabilitation-${side}.json`;
  const v = JSON.parse(fs.readFileSync(p, "utf8"));
  let t = v.template;
  if (!t.includes(html(Q))) {
    const qi = t.indexOf(`>${html(AFTER_Q)}</summary>`);
    if (qi < 0) throw new Error(`anchor summary missing in ${side}`);
    const start = t.lastIndexOf("<details", qi);
    const end = t.indexOf("</details>", qi) + "</details>".length;
    const block = t.slice(start, end);
    const next = block
      .replace(/(<summary[^>]*>)[\s\S]*?(<\/summary>)/, (_, a, b) => a + html(Q) + b)
      .replace(/(<p[^>]*>)[\s\S]*?(<\/p>)/, (_, a, b) => a + html(A) + b);
    t = t.slice(0, end) + "\n" + next + t.slice(end);
    // JSON-LD FAQPage entry
    const ldAnchor = `{"@type": "Question", "name": ${jsonStr(AFTER_Q)}`;
    const li = t.indexOf(ldAnchor);
    if (li < 0) throw new Error(`anchor JSON-LD missing in ${side}`);
    const liEnd = t.indexOf("}}", li) + 2;
    t = t.slice(0, liEnd) + `, {"@type": "Question", "name": ${jsonStr(Q)}, "acceptedAnswer": {"@type": "Answer", "text": ${jsonStr(A)}}}` + t.slice(liEnd);
    v.template = t;
    changed++;
  }
  if (!v.logic.includes(jsonStr(Q))) {
    const la = `{"q": ${jsonStr(AFTER_Q)}`;
    const li = v.logic.indexOf(la);
    if (li >= 0) {
      const liEnd = v.logic.indexOf("}", li) + 1;
      v.logic = v.logic.slice(0, liEnd) + `, {"q": ${jsonStr(Q)}, "a": ${jsonStr(A)}}` + v.logic.slice(liEnd);
      changed++;
    }
  }
  fs.writeFileSync(p, JSON.stringify(v, null, 2) + "\n");
}
console.log(`referral FAQ: ${changed} surface(s) updated`);
