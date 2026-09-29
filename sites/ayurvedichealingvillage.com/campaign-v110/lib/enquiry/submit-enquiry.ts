// ─────────────────────────────────────────────────────────────────────────────
// ENQUIRY SUBMISSION — BACKEND SWAP POINT
//
// The enquiry backend is not ready yet, so submitting the form composes the
// guest's answers into a WhatsApp message to the reservations number and
// opens WhatsApp. Nothing is stored or sent until the guest presses send.
//
// To connect the real backend, replace the body of `submitEnquiry` with a
// POST, for example:
//
//   const res = await fetch("/api/enquiry", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });
//   if (!res.ok) throw new Error("Enquiry failed");
//   return { channel: "backend" };
//
// and update the note under the form (EnquiryForm `handoffNote`).
// `data.tracking` already carries utm_* / gclid from the landing URL.
// ─────────────────────────────────────────────────────────────────────────────

import { contact } from "../site";

export type EnquiryData = {
  name: string;
  phone: string;
  email: string;
  concern: string;
  travelMonth: string;
  duration: string;
  message: string;
  consent: boolean;
  page: string;
  tracking: Record<string, string>;
};

export type EnquiryResult = { channel: "whatsapp" | "backend"; url?: string };

export function composeEnquiryMessage(d: EnquiryData): string {
  const lines: (string | null)[] = [
    "Hello, I would like to plan a programme at Kairali – The Ayurvedic Healing Village.",
    "",
    `Name: ${d.name}`,
    `Phone / WhatsApp: ${d.phone}`,
    d.email ? `Email: ${d.email}` : null,
    d.concern ? `Area of concern: ${d.concern}` : null,
    d.travelMonth ? `Travel month: ${d.travelMonth}` : null,
    d.duration ? `Length of stay: ${d.duration}` : null,
    d.message ? `Message: ${d.message}` : null,
    "",
    `Page: ${d.page}`,
  ];
  const ref = Object.entries(d.tracking)
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");
  if (ref) lines.push(`Ref: ${ref}`);
  return lines.filter((l) => l !== null).join("\n");
}

export async function submitEnquiry(data: EnquiryData): Promise<EnquiryResult> {
  const url = `https://wa.me/${contact.whatsapp.number}?text=${encodeURIComponent(
    composeEnquiryMessage(data)
  )}`;
  // No "noopener" feature string: with it, window.open always returns null.
  const win = window.open(url, "_blank");
  if (win) win.opener = null;
  // Pop-up blocked (common in in-app browsers from Meta ads): go there directly.
  else window.location.href = url;
  return { channel: "whatsapp", url };
}
