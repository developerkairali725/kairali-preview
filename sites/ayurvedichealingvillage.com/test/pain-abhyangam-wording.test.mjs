// AHV-WB.054.change / AHV-LATER-016.01: workbook User Review 9 Oct!57, adopted 14 Oct.
// Description only. Preserve the other procedures and individual doctor-direction qualifications.
import { test } from "node:test";
import assert from "node:assert/strict";
import { productionCampaign } from "../campaign-v2/production/load.ts";
import { pageText } from "../campaign-v2/kit/lint/page-text.ts";

const description = "Discuss therapies such as Abhyangam – full-body medicated oil therapy; Kizhi, a herbal treatment; Pizhichil, a warm oil treatment; Kati Basti, herbal oil pooling; or Nasya, nasal administration. Your doctor explains which procedures suit you and what each session involves.";

test("Pain's loaded treatment description uses approved Abhyangam terminology, retaining all qualifications", () => {
  const campaign = productionCampaign("pain-management");
  const strings = pageText(campaign).map(({ text }) => text);
  assert.equal(campaign.route, "/pain-management.html");
  assert.deepEqual(strings.filter((text) => text.includes("Abhyangam")), [description]);
  assert.ok(!strings.some((text) => text.includes("Abhyangam, a medicated oil massage")));
});

test("reviewed German procedural equivalent keeps its existing doctor-direction and inclusion qualifications", () => {
  const strings = pageText(productionCampaign("lp-behandlung-kerala")).map(({ text }) => text);
  assert.ok(strings.includes("Abhyanga ist eine Ganzkörpermassage mit medizinierten Ölen. Bei Shirodhara wird ein gleichmäßiger Ölstrahl über die Stirn geführt. Beide sind mögliche, ärztlich verordnete Behandlungen; sie gehören nicht automatisch zu jedem Programm."));
});
