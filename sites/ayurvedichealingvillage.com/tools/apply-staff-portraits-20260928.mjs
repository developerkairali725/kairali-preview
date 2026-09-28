// STAFF-01 (28 Sep 2026): the two new doctors join the homepage "Our Experts" cards (desktop + mobile views), after
// the existing three, in the same card markup. Names and roles are the source-supported ones only (staff bank,
// staff-rana-20260926/STAFF-BANK-AND-TODO.md; handoff spelling "Aashitha"): Dr. Adhina U.B. — Resident Medical
// Officer · BAMS; Dr. Aashitha P.S. — Ayurvedic Physician · BAMS. No experience figure (the CVs' totals are
// unreconciled), no specialty, no claim. Their portraits are head-and-shoulders, so the card shows them with
// background-size:cover (the existing full-length photos keep their 135% zoom). The desktop doctor grid's column
// minimum drops 226px → 196px so five doctors sit in one row on a 1220px container instead of four plus an orphan.
// Not added: the /online-consultation/ physicians list — nothing in the sources says either doctor takes online
// consultations (flagged for the owner). Idempotent.   node tools/apply-staff-portraits-20260928.mjs [--check]
import fs from "node:fs";
const CHECK = process.argv.includes("--check");
const PEOPLE = [
  { name: "Dr. Adhina U.B.", role: "Resident Medical Officer", roleLine: "Resident Medical Officer · BAMS", src: "/ahv/assets/img/team-adhina-ub.webp" },
  { name: "Dr. Aashitha P.S.", role: "Ayurvedic Physician", roleLine: "Ayurvedic Physician · BAMS", src: "/ahv/assets/img/team-aashitha-ps.webp" },
];
const ANCHOR = 'aria-label="Dr. Akhila Oommen, Ayurvedic Physician"';
const log = [];
for (const f of ["public/ahv/views/home-hi-fi-v4.json", "public/ahv/views/home-mobile.json"]) {
  const s = fs.readFileSync(f, "utf8"); const V = JSON.parse(s);
  const ser = [(o) => JSON.stringify(o), (o) => JSON.stringify(o, null, 1), (o) => JSON.stringify(o, null, 2), (o) => JSON.stringify(o, null, 2) + "\n", (o) => JSON.stringify(o, null, 1) + "\n"].find((g) => g(V) === s);
  if (!ser) throw new Error(f + ": unknown serialisation");
  let t = V.template;
  if (t.includes(PEOPLE[0].src)) { log.push(f + ": already applied"); continue; }
  const i = t.indexOf(ANCHOR); if (i < 0) throw new Error(f + ": Akhila card not found");
  const mobile = f.includes("mobile");
  // the Akhila card = the enclosing card element; mobile cards are <div>…</div> on one line, desktop a flex column
  const start = mobile ? t.lastIndexOf("<div><div", i) : t.lastIndexOf('<div style="display:flex;flex-direction:column;gap:10px">', i);
  const endMarker = mobile ? "Kairali – The Ayurvedic Healing Village</div></div>" : "Kairali – The Ayurvedic Healing Village</div>\n    </div>";
  const end = t.indexOf(endMarker, i) + endMarker.length;
  if (start < 0 || end < endMarker.length) throw new Error(f + ": card bounds");
  const card = t.slice(start, end);
  if ((card.match(/Dr\. Akhila Oommen/g) || []).length !== 2) throw new Error(f + ": unexpected card shape");
  const make = (p) => card
    .replace(ANCHOR, `aria-label="${p.name}, ${p.role}"`)
    .replace("url(/ahv/assets/img/team-akhila-oommen-2.webp);background-size:135%;background-position:center 8%", `url(${p.src});background-size:cover;background-position:center 18%`)
    .replace(">Dr. Akhila Oommen<", `>${p.name}<`)
    .replace("Ayurvedic Physician · BAMS<br>", `${p.roleLine}<br>`);
  const added = PEOPLE.map(make);
  for (const [k, a] of added.entries()) if (!a.includes(PEOPLE[k].src) || a.includes("Akhila")) throw new Error(f + ": card clone failed");
  const sep = mobile ? "\n    " : "\n    ";
  t = t.slice(0, end) + added.map((a) => sep + a).join("") + t.slice(end);
  if (!mobile) {
    // the doctor grid is the grid that opens right before the first doctor card
    const g = t.lastIndexOf('<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(226px,100%),1fr));gap:26px">', t.indexOf('aria-label="Dr. Deepu John'));
    if (g < 0) throw new Error(f + ": doctor grid not found");
    t = t.slice(0, g) + t.slice(g).replace("minmax(min(226px,100%),1fr)", "minmax(min(196px,100%),1fr)");
  }
  V.template = t;
  if (!CHECK) fs.writeFileSync(f, ser(V));
  log.push(`${f}: 2 doctor cards added`);
}
console.log((CHECK ? "[check] " : "") + log.join("\n"));
