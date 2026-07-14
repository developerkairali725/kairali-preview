import test from "node:test";
import assert from "node:assert/strict";
import {
  serializeJsonLd,
  graph,
  organization,
  kairaliOrganization,
  webSite,
  breadcrumbList,
  faqPage,
  person,
  physician,
  article,
  medicalWebPage,
  medicalClinic,
  product,
} from "../src/index.js";

test("kairaliOrganization carries the locked facts and never invents", () => {
  const org = kairaliOrganization({ id: "https://x.com/#org", url: "https://x.com" });
  assert.equal(org.email, "info@kairali.com");
  assert.equal(org.foundingDate, "1908");
  assert.equal(org.slogan, "health through ayurveda");
  assert.equal(org.name, "Kairali Ayurvedic Group");
  assert.ok(!("logo" in org), "absent optional facts stay absent");
});

test("serializeJsonLd escapes < (script-injection safe)", () => {
  const out = serializeJsonLd({ name: "</script><script>alert(1)</script>" });
  assert.ok(!out.includes("</script>"));
  assert.ok(out.includes("\\u003c/script"));
});

test("graph wraps nodes with @context", () => {
  const g = graph(organization({ name: "X", url: "https://x.com" }));
  assert.equal(g["@context"], "https://schema.org");
  assert.equal(g["@graph"].length, 1);
});

test("breadcrumbList positions are 1-based and ordered", () => {
  const b = breadcrumbList({
    items: [
      { name: "Home", url: "https://x.com" },
      { name: "Treatments", url: "https://x.com/treatments" },
    ],
  });
  assert.equal(b.itemListElement[0].position, 1);
  assert.equal(b.itemListElement[1].position, 2);
  assert.equal(b.itemListElement[1].item, "https://x.com/treatments");
});

test("faqPage builds Question/Answer pairs", () => {
  const f = faqPage({ questions: [{ question: "Q?", answer: "A." }] });
  assert.equal(f.mainEntity[0]["@type"], "Question");
  assert.equal(f.mainEntity[0].acceptedAnswer.text, "A.");
});

test("empty/undefined fields are stripped everywhere", () => {
  const w = webSite({ name: "X", url: "https://x.com", inLanguage: undefined });
  assert.ok(!("inLanguage" in w));
  const p = person({ name: "Y", sameAs: [] });
  assert.ok(!("sameAs" in p));
});

test("physician extends person with @type Physician", () => {
  const d = physician({ name: "Dr. X", medicalSpecialty: "Ayurveda" });
  assert.equal(d["@type"], "Physician");
  assert.equal(d.medicalSpecialty, "Ayurveda");
});

test("article links author/publisher by @id reference", () => {
  const a = article({
    headline: "H",
    url: "https://x.com/a",
    authorId: "https://x.com/#gita",
    publisherId: "https://x.com/#org",
  });
  assert.deepEqual(a.author, { "@id": "https://x.com/#gita" });
  assert.deepEqual(a.publisher, { "@id": "https://x.com/#org" });
});

test("medicalWebPage carries condition + review chain", () => {
  const m = medicalWebPage({
    name: "Back pain programme",
    url: "https://x.com/c/back-pain",
    condition: "Chronic back pain",
    lastReviewed: "2026-07-01",
    reviewedById: "https://x.com/#dr-deepu-john",
  });
  assert.equal(m.about["@type"], "MedicalCondition");
  assert.deepEqual(m.reviewedBy, { "@id": "https://x.com/#dr-deepu-john" });
});

test("medicalClinic + product build with nested address/offer", () => {
  const c = medicalClinic({
    name: "KTAHV",
    url: "https://x.com",
    address: { addressLocality: "Palakkad", addressCountry: "IN" },
  });
  assert.equal(c.address["@type"], "PostalAddress");
  const p = product({
    name: "Herbal oil",
    url: "https://x.com/p",
    offer: { url: "https://shop.example/p", price: "499", priceCurrency: "INR" },
  });
  assert.equal(p.offers["@type"], "Offer");
  assert.equal(p.offers.url, "https://shop.example/p");
});
