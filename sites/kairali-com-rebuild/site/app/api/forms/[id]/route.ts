import { NextResponse, type NextRequest } from "next/server";
import { CONSULTATION, CONTACT, GENERAL_ENQUIRY, NEWSLETTER, SVATA_ENQUIRY, applicationSchema, type FormSchema } from "@/lib/forms";
import { deliver } from "@/lib/form-delivery";
import { FORM_DELIVERY_APPROVED } from "@/lib/form-policy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SCHEMAS: Record<string, () => FormSchema> = {
  contact: () => CONTACT,
  enquiry: () => GENERAL_ENQUIRY,
  svata: () => SVATA_ENQUIRY,
  consultation: () => CONSULTATION,
  application: () => applicationSchema(),
  newsletter: () => NEWSLETTER,
};

const MAX_BODY = 12 * 1024 * 1024;
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;
const hits = new Map<string, number[]>(); // best effort per instance; Turnstile is the real anti-spam control

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > LIMIT;
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Reject before reading multipart bodies, health information or CV uploads.
  if (!FORM_DELIVERY_APPROVED || process.env.SITE_ENV !== "production") {
    return NextResponse.json({ ok: false, reason: "preview-inactive" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
  const { id } = await params;
  const schema = SCHEMAS[id]?.();
  if (!schema) return NextResponse.json({ ok: false, reason: "unknown-form" }, { status: 404 });

  const origin = req.headers.get("origin");
  if (origin && origin !== req.nextUrl.origin) return NextResponse.json({ ok: false, reason: "origin" }, { status: 403 });
  if (Number(req.headers.get("content-length") || 0) > MAX_BODY) return NextResponse.json({ ok: false, reason: "too-large" }, { status: 413 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || null;
  if (ip && limited(ip)) return NextResponse.json({ ok: false, reason: "rate-limited" }, { status: 429 });

  let data: FormData;
  try { data = await req.formData(); } catch { return NextResponse.json({ ok: false, reason: "bad-request" }, { status: 400 }); }

  const out = await deliver(schema, data, ip);
  if (out.ok) return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  return NextResponse.json({ ok: false, reason: out.reason, fields: out.fields }, { status: out.status, headers: { "Cache-Control": "no-store" } });
}
