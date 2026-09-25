import path from "node:path";
import crypto from "node:crypto";
export const SITE = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/%20/g, " ")), "../..");
export const rel = (...p) => path.join(SITE, ...p);
export const sha256 = (s) => crypto.createHash("sha256").update(s, "utf8").digest("hex");
