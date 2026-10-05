import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const downloads = JSON.parse(
  readFileSync(join(siteRoot, "site", "content", "downloads.json"), "utf8"),
);

const currentEntryPoints = {
  "ahv-ayurveda-earlier": ["ayurveda"],
  "ahv-yoga-earlier": ["yoga"],
  "ahv-admission-earlier": ["accommodation"],
  "raag-earlier": ["programme-rates", "room-rates", "dining"],
  "kappl-prices-earlier": ["kappl-retail", "kappl-wholesale"],
  "kappl-catalogues-earlier": [
    "kappl-retail",
    "kappl-wholesale",
    "kappl-manufacturing",
  ],
  "ahv-profile-earlier": ["healing-secrets"],
  "centres-earlier": [],
  "group-earlier": ["training", "healing-secrets"],
};

const currentById = new Map(downloads.current.map((group) => [group.id, group]));
const sha256 = (path) =>
  createHash("sha256").update(readFileSync(path)).digest("hex");
const csvCell = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;

const records = downloads.earlier.flatMap((group) =>
  group.editions.map((edition) => {
    const relativeUrl = decodeURIComponent(edition.url.replace(/^\//, ""));
    const localPath = join(siteRoot, "site", "public", relativeUrl);
    const currentCollections = (currentEntryPoints[group.id] ?? []).map((id) => {
      const current = currentById.get(id);
      return {
        id,
        title: current?.title ?? id,
        hub: `${downloads.portal.replace("property=all", `property=${current?.property ?? "all"}`)}#${id}`,
      };
    });
    const disposition = edition.rates
      ? "preserve-direct-hide-from-current"
      : edition.period
        ? "preserve-direct-historical"
        : "owner-review-currentness";

    return {
      property: group.property,
      groupId: group.id,
      groupTitle: group.title,
      label: edition.label,
      url: edition.url,
      format: edition.format,
      period: edition.period,
      currency: edition.currency,
      containsRates: edition.rates,
      bytes: edition.bytes,
      expectedSha256: edition.sha256,
      localExists: existsSync(localPath),
      localSha256: existsSync(localPath) ? sha256(localPath) : "",
      hashMatches: existsSync(localPath) && sha256(localPath) === edition.sha256,
      disposition,
      currentCollections,
      ownerDecisionRequired:
        disposition === "owner-review-currentness" || currentCollections.length === 0,
    };
  }),
);

if (records.length !== 72) {
  throw new Error(`Expected 72 legacy files, found ${records.length}`);
}
if (records.some((record) => !record.hashMatches)) {
  throw new Error("One or more legacy files are missing or fail SHA-256 verification");
}

const summary = {
  reviewedOn: "2026-10-05",
  sourceInventoryCheckedOn: downloads.checked,
  portal: downloads.portal,
  legacyFiles: records.length,
  pdfFiles: records.filter((record) => record.format === "PDF").length,
  pptxFiles: records.filter((record) => record.format === "PPTX").length,
  priceOrTariffFiles: records.filter((record) => record.containsRates).length,
  explicitlyDatedFiles: records.filter((record) => record.period).length,
  hashVerifiedFiles: records.filter((record) => record.hashMatches).length,
  ownerDecisionRequired: records.filter((record) => record.ownerDecisionRequired).length,
};

writeFileSync(
  join(siteRoot, "evidence", "legacy-document-review-2026-10-05.json"),
  `${JSON.stringify({ summary, records }, null, 2)}\n`,
);

const csvColumns = [
  "property",
  "groupId",
  "label",
  "url",
  "format",
  "period",
  "currency",
  "containsRates",
  "bytes",
  "expectedSha256",
  "localExists",
  "hashMatches",
  "disposition",
  "currentCollections",
  "ownerDecisionRequired",
];
const csv = [
  csvColumns.map(csvCell).join(","),
  ...records.map((record) =>
    csvColumns
      .map((column) =>
        csvCell(
          column === "currentCollections"
            ? record.currentCollections.map((item) => item.id).join("|")
            : record[column],
        ),
      )
      .join(","),
  ),
].join("\n");
writeFileSync(
  join(siteRoot, "evidence", "legacy-document-review-2026-10-05.csv"),
  `${csv}\n`,
);

const groupRows = downloads.earlier.map((group) => {
  const grouped = records.filter((record) => record.groupId === group.id);
  const collections = (currentEntryPoints[group.id] ?? []).join(", ") || "none";
  return `| ${group.title} | ${grouped.length} | ${grouped.filter((item) => item.containsRates).length} | ${collections} |`;
});

const markdown = `# MID-15049 legacy document review — 5 October 2026

This is the separate review requested for the 72 preserved legacy downloads. It records technical disposition and the current portal collection that should be used for new journeys. It does not delete, redirect or declare an old business document current without an owner decision.

## Result

- ${summary.legacyFiles}/${summary.legacyFiles} legacy direct files exist locally and match their recorded SHA-256 hashes.
- ${summary.pdfFiles} are PDFs and ${summary.pptxFiles} is a PPTX presentation.
- ${summary.priceOrTariffFiles} contain prices or tariffs. They remain available only for legacy direct-URL continuity and are excluded from the current-document cards.
- ${summary.explicitlyDatedFiles} have an explicit period or year. They remain labelled as earlier files.
- ${summary.ownerDecisionRequired} need an owner decision because they have no exact current collection or their undated content may still conflict with current facts.
- The maintained portal has ${downloads.current.length} current collections with ${downloads.current.reduce((total, group) => total + group.editions.length, 0)} editions.

## Group review

| Legacy group | Files | Price/tariff files | Current portal collection(s) |
|---|---:|---:|---|
${groupRows.join("\n")}

## Release rule

1. New page journeys use the maintained document portal and its current collections.
2. Old price/tariff files are not presented as current documents.
3. Exact legacy paths stay byte-identical until the owner approves a redirect or retirement list.
4. \`centres-earlier\` has no exact current document collection. Its three files require a specific owner disposition.
5. Undated brochures, catalogues and profiles marked \`owner-review-currentness\` require content-owner confirmation before they can be promoted, replaced or retired.

The complete per-file decision register is in \`evidence/legacy-document-review-2026-10-05.csv\`; machine-readable evidence, hashes and portal links are in \`evidence/legacy-document-review-2026-10-05.json\`.
`;
writeFileSync(
  join(siteRoot, "docs", "MID-15049-LEGACY-DOCUMENT-REVIEW-2026-10-05.md"),
  markdown,
);

console.log(JSON.stringify(summary, null, 2));
