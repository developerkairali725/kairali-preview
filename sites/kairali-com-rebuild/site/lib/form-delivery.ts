// Server-side form delivery (MID-15049). Everything is OFF until reviewed activation approval, production mode and environment
// variables; no recipient, sender, key or ID is hard-coded (HARD GATE 6 — they come from the owner).
//
//   FORMS_DELIVERY=email            enable delivery (anything else: nothing is sent)
//   FORMS_EMAIL_API_KEY             Resend API key (https://resend.com/docs/api-reference/emails/send-email)
//   FORMS_FROM                      verified sender, e.g. "Kairali website <forms@...>"
//   FORM_TO_<ID>                    comma-separated recipients per form id (CONTACT, ENQUIRY, SVATA,
//                                   CONSULTATION, APPLICATION, NEWSLETTER); a form without one is not sent
//   FORMS_ALLOW_SENSITIVE=true      required before the medical consultation form is delivered
//   FORMS_ALLOW_UPLOADS=true        required before CV/photo files are attached (else the application is refused)
//   TURNSTILE_SECRET_KEY            required: missing secret or invalid token refuses delivery
//
// Field values are never logged. Failures log only the form id and a reason code.
import type { Field, FormSchema } from "@/lib/forms";
import { FORM_DELIVERY_APPROVED } from "@/lib/form-policy";

export type Outcome =
  | { ok: true }
  | { ok: false; status: number; reason: string; fields?: Record<string, string> };

const DIGITS = /^[0-9+\-\s()]{5,}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_TEXT = 5000;
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const FILE_TYPES: Record<string, { mime: string[]; magic: number[][] }> = {
  pdf: { mime: ["application/pdf"], magic: [[0x25, 0x50, 0x44, 0x46]] },
  doc: { mime: ["application/msword"], magic: [[0xd0, 0xcf, 0x11, 0xe0]] },
  docx: { mime: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"], magic: [[0x50, 0x4b, 0x03, 0x04]] },
  jpg: { mime: ["image/jpeg"], magic: [[0xff, 0xd8, 0xff]] },
  jpeg: { mime: ["image/jpeg"], magic: [[0xff, 0xd8, 0xff]] },
  png: { mime: ["image/png"], magic: [[0x89, 0x50, 0x4e, 0x47]] },
};

export function recipients(formId: string): string[] {
  return (process.env[`FORM_TO_${formId.toUpperCase()}`] || "").split(",").map((s) => s.trim()).filter((s) => EMAIL.test(s));
}

// Mirrors components/Form.tsx validation; the server never trusts the browser.
export function validate(fields: Field[], data: FormData): Record<string, string> {
  const e: Record<string, string> = {};
  for (const f of fields) {
    if (f.type === "heading") continue;
    const values = data.getAll(f.name).map((v) => (typeof v === "string" ? v.trim() : v.size ? v.name : ""));
    const has = values.some(Boolean);
    if (f.required && !has) { e[f.name] = f.requiredMsg || `Please enter ${f.label.toLowerCase()}`; continue; }
    const v = String(values[0] ?? "");
    if (values.some((x) => x.length > MAX_TEXT)) e[f.name] = "This entry is too long";
    if (v && f.pattern === "email" && !EMAIL.test(v)) e[f.name] = f.formatMsg || "Please provide a valid email";
    if (v && f.pattern === "digits" && !(f.type === "number" ? /^\d{1,3}$/.test(v) : DIGITS.test(v))) e[f.name] = f.formatMsg || "Enter only Numbers";
    if (v && (f.type === "select" || f.type === "radio" || f.type === "checkboxes") && f.options && values.some((x) => x && !f.options!.includes(x))) e[f.name] = "Please choose from the list";
  }
  return e;
}

async function checkFile(file: File): Promise<string | null> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  const type = FILE_TYPES[ext];
  if (!type) return "Please upload a PDF, DOC, DOCX, JPG or PNG file";
  if (file.size > MAX_FILE_BYTES) return "Files must be 5 MB or smaller";
  const head = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  if (!type.magic.some((m) => m.every((b, i) => head[i] === b))) return "This file does not match its type";
  return null;
}

async function verifyTurnstile(token: string, ip: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return false; // Delivery must never bypass server-side anti-spam.
  if (!token) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);
  try {
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
    return Boolean(((await r.json()) as { success?: boolean }).success);
  } catch { return false; }
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function deliver(schema: FormSchema, data: FormData, ip: string | null): Promise<Outcome> {
  if (!FORM_DELIVERY_APPROVED || process.env.SITE_ENV !== "production") return { ok: false, status: 503, reason: "preview-inactive" };
  if (String(data.get("website") || "")) return { ok: true }; // honeypot: accept silently, send nothing
  if (!(await verifyTurnstile(String(data.get("cf-turnstile-response") || ""), ip))) return { ok: false, status: 400, reason: "anti-spam" };

  const fields = validate(schema.fields, data);
  const files: { field: Field; file: File }[] = [];
  for (const f of schema.fields.filter((x) => x.type === "file")) {
    for (const v of data.getAll(f.name)) {
      if (typeof v === "string" || !v.size) continue;
      const bad = await checkFile(v);
      if (bad) fields[f.name] = bad; else files.push({ field: f, file: v });
    }
  }
  if (Object.keys(fields).length) return { ok: false, status: 422, reason: "invalid", fields };

  if (process.env.FORMS_DELIVERY !== "email") return { ok: false, status: 503, reason: "delivery-off" };
  if (schema.sensitive && process.env.FORMS_ALLOW_SENSITIVE !== "true") return { ok: false, status: 503, reason: "sensitive-not-approved" };
  if (files.length && process.env.FORMS_ALLOW_UPLOADS !== "true") return { ok: false, status: 503, reason: "uploads-not-approved" };
  const to = recipients(schema.id);
  const key = process.env.FORMS_EMAIL_API_KEY;
  const from = process.env.FORMS_FROM;
  if (!to.length || !key || !from) return { ok: false, status: 503, reason: "not-configured" };

  const rows = schema.fields
    .filter((f) => f.type !== "heading" && f.type !== "file")
    .map((f) => [f.label, data.getAll(f.name).map(String).filter(Boolean).join(", ")] as const)
    .filter(([, v]) => v);
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  const html = `<table cellpadding="6">${rows.map(([k, v]) => `<tr><th align="left" valign="top">${esc(k)}</th><td>${esc(v).replace(/\n/g, "<br>")}</td></tr>`).join("")}</table>`;
  const replyTo = String(data.get("email") || "");
  const attachments = await Promise.all(files.map(async ({ file }) => ({ filename: file.name, content: Buffer.from(await file.arrayBuffer()).toString("base64") })));

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from, to, subject: `kairali.com — ${schema.title} (${schema.id})`, text, html,
        ...(EMAIL.test(replyTo) ? { reply_to: replyTo } : {}),
        ...(attachments.length ? { attachments } : {}),
      }),
    });
    if (!r.ok) { console.error(`form ${schema.id}: provider status ${r.status}`); return { ok: false, status: 502, reason: "provider" }; }
    return { ok: true };
  } catch {
    console.error(`form ${schema.id}: provider unreachable`);
    return { ok: false, status: 502, reason: "provider" };
  }
}
