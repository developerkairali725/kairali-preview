import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
export const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const rel = (...p) => path.join(SITE, ...p);
export const sha256 = (s) => crypto.createHash("sha256").update(s, "utf8").digest("hex");
