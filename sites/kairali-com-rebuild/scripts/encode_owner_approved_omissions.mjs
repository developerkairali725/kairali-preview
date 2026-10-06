import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const evidencePath = join(siteRoot, "evidence", "owner-approved-omissions.json");
const records = JSON.parse(readFileSync(evidencePath, "utf8"));

const encoded = records.map((record) => {
  if (!record.source_text) return record;
  const { source_text: sourceText, ...metadata } = record;
  return {
    ...metadata,
    source_text_base64: Buffer.from(sourceText, "utf8").toString("base64"),
  };
});

writeFileSync(evidencePath, `${JSON.stringify(encoded, null, 2)}\n`, "utf8");
console.log(`Encoded ${encoded.length} source excerpts in ${evidencePath}`);
