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
  localBusiness,
  product,
  book,
  itemList,
  service,
  imageGallery,
  imageObject,
  videoObject,
} from "../src/index.js";

test("kairaliOrganization carries the locked facts and never invents", () => {
  const org = kairaliOrganization({ id: "https://x.com/#org", url: "https://x.com" });
  assert.equal(org.email, "info@kairali.com");
  // D-1908 regression (PR #65): Group founded 1989; 1908 = lineage only,
  // carried in description with the licensed phrasing — never foundingDate.
  assert.equal(org.foundingDate, "1989");
  assert.match(org.description, /family practising Ayurveda since 1908/);
  assert.doesNotMatch(JSON.stringify(org).replace(/family practising Ayurveda since 1908/g, ""), /1908/);
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

test("service-area Organization carries coverage without inventing a location", () => {
  const b = organization({
    id: "https://example.com/#business",
    name: "Example Business",
    url: "https://example.com",
    telephone: "+91 00000 00000",
    description: "Appointment-only service with no walk-in storefront.",
    areaServed: ["Delhi", "Noida"],
    sameAs: ["https://www.instagram.com/example/"],
  });
  assert.equal(b["@type"], "Organization");
  assert.deepEqual(b.areaServed, ["Delhi", "Noida"]);
  assert.deepEqual(b.sameAs, ["https://www.instagram.com/example/"]);
  assert.equal("address" in b, false);
});

test("book builds with author ref, offers carry NO price, gaps stay absent", () => {
  const b = book({
    id: "https://healing.recipes/books/harmony#book",
    name: "Harmony",
    alternateName: "Harmony: Essential Ayurveda for All",
    authorId: "https://healing.recipes/#gita-ramesh",
    isbn: "9789349474826",
    numberOfPages: 280,
    datePublished: "2026-03",
    publisherName: "Roli Books",
    bookFormat: "Hardcover",
    offers: [{ url: "https://rolibooks.com/product/harmony-essential-ayurveda-for-all", sellerName: "Roli Books" }],
  });
  assert.equal(b["@type"], "Book");
  assert.deepEqual(b.author, { "@id": "https://healing.recipes/#gita-ramesh" });
  assert.equal(b.publisher.name, "Roli Books");
  assert.equal(b.bookFormat, "https://schema.org/Hardcover");
  assert.equal(b.offers[0].seller.name, "Roli Books");
  assert.equal("price" in b.offers[0], false);
  const lean = book({ name: "Ayurvedic Herbal Massage" });
  assert.equal("award" in lean, false);
  assert.equal("offers" in lean, false);
});

test("itemList numbers items in order and never invents fields", () => {
  const l = itemList({
    id: "https://bulkayurvedaoils.com/oils/#catalog",
    name: "Bulk formulation ledger",
    items: [
      { name: "Balaguluchyadi Kera Thailam", url: "https://bulkayurvedaoils.com/oils/classical-thailams" },
      { name: "Udwarthanam Powder" },
    ],
  });
  assert.equal(l["@type"], "ItemList");
  assert.equal(l.numberOfItems, 2);
  assert.equal(l.itemListElement[0].position, 1);
  assert.equal(l.itemListElement[1].name, "Udwarthanam Powder");
  assert.equal("url" in l.itemListElement[1], false);
  const refs = itemList({ name: "Chapter", items: [{ id: "https://x/#image-1" }] });
  assert.deepEqual(refs.itemListElement[0].item, { "@id": "https://x/#image-1" });
  assert.equal("name" in refs.itemListElement[0], false);
});

test("service carries the quote model — provider by @id, no offers/price surface", () => {
  const s = service({
    id: "https://bulkayurvedaproducts.com/services/private-label#service",
    name: "Private label Ayurvedic manufacturing",
    providerId: "https://bulkayurvedaproducts.com/#organization",
    serviceType: "Contract manufacturing",
  });
  assert.equal(s["@type"], "Service");
  assert.deepEqual(s.provider, { "@id": "https://bulkayurvedaproducts.com/#organization" });
  assert.equal("offers" in s, false);
  assert.equal("price" in s, false);
});

test("imageObject: contentUrl required; credit + copyright pass through; nothing invented", () => {
  const i = imageObject({
    id: "https://ayurvedichealingvillage.com/treatments-gallery/#img-1",
    contentUrl: "https://ayurvedichealingvillage.com/ahv/assets/img/gallery-2026/treatments/oil-abhyanga-01.webp",
    name: "Abhyanga: two therapists work herbal oil along a patient's legs.",
    caption: "Abhyanga: two therapists work herbal oil along a patient's legs.",
    description: "Abhyanga, two therapists working herbal oil along a patient's legs on a wooden therapy table",
    width: 1067, height: 1600,
    creditText: "Kairali – The Ayurvedic Healing Village",
    copyrightNotice: "© Kairali Ayurvedic Group",
    creatorName: "Kairali – The Ayurvedic Healing Village",
    representativeOfPage: false,
  });
  assert.equal(i["@type"], "ImageObject");
  assert.equal(i.url, i.contentUrl, "url defaults to contentUrl");
  assert.equal(i.creator.name, "Kairali – The Ayurvedic Healing Village");
  assert.equal("license" in i, false, "no licence page → no license field");
  assert.equal("acquireLicensePage" in i, false);
  assert.equal("representativeOfPage" in i, false, "false is omitted; only the hero says true");
  assert.throws(() => imageObject({ name: "x" }), /contentUrl/);
});

test("videoObject: name + thumbnail required; uploadDate/duration only when supplied", () => {
  const full = videoObject({
    id: "https://ayurvedichealingvillage.com/treatments-gallery/#video-DehKsHYtoJM",
    name: "The quiet room and therapy area",
    description: "The quiet room and the therapy area of the treatment block.",
    thumbnailUrl: "https://ayurvedichealingvillage.com/ahv/assets/img/gallery-2026/video/DehKsHYtoJM.webp",
    uploadDate: "2023-05-05",
    duration: "PT47S",
    embedUrl: "https://www.youtube-nocookie.com/embed/DehKsHYtoJM",
    publisherId: "https://ayurvedichealingvillage.com/#organization",
    isFamilyFriendly: true,
    inLanguage: "en-US",
  });
  assert.equal(full["@type"], "VideoObject");
  assert.equal(full.duration, "PT47S");
  assert.deepEqual(full.publisher, { "@id": "https://ayurvedichealingvillage.com/#organization" });
  const lean = videoObject({ name: "A few minutes of yoga", thumbnailUrl: "https://x/y.webp" });
  assert.equal("uploadDate" in lean, false, "never typed in");
  assert.equal("duration" in lean, false);
  assert.throws(() => videoObject({ name: "x" }), /thumbnailUrl/);
});

test("imageGallery: accepts ImageObject nodes, hasPart chapters and videos; string form unchanged", () => {
  const strings = imageGallery({ name: "Portfolio", images: ["https://x/a.jpg"] });
  assert.deepEqual(strings.image, ["https://x/a.jpg"]);
  assert.equal("hasPart" in strings, false);
  const node = imageObject({ contentUrl: "https://x/b.webp", creditText: "Kairali" });
  const g = imageGallery({
    id: "https://ayurvedichealingvillage.com/yoga-gallery/#gallery",
    name: "Yoga Gallery",
    url: "https://ayurvedichealingvillage.com/yoga-gallery/",
    mainEntityOfPageId: "https://ayurvedichealingvillage.com/yoga-gallery/",
    inLanguage: "en-US",
    images: [node],
    videos: [videoObject({ name: "v", thumbnailUrl: "https://x/p.webp" })],
    hasPart: [itemList({ name: "The yoga hall", items: [{ name: "img", url: "https://x/b.webp" }] })],
  });
  assert.equal(g.image[0]["@type"], "ImageObject");
  assert.equal(g.video[0]["@type"], "VideoObject");
  assert.equal(g.hasPart[0]["@type"], "ItemList");
  assert.deepEqual(g.mainEntityOfPage, { "@id": "https://ayurvedichealingvillage.com/yoga-gallery/" });
});
