// Reusable route-handler factory. A site adds ONE file:
//   // app/api/enquiry/route.ts
//   import { enquiryRoute } from "@kairali/forms/route";
//   export const POST = enquiryRoute();
// It runs server-side (Node runtime), reads the Supabase service key from env,
// and calls storeLead — store-first, so a lead is written to our DB before any
// downstream CRM step. The service key never reaches the browser.
import { storeLead } from "./store.js";

export function enquiryRoute() {
  return async function POST(req: Request): Promise<Response> {
    let input: Record<string, unknown>;
    try {
      input = await req.json();
    } catch {
      return Response.json({ ok: false, error: "invalid body" }, { status: 400 });
    }
    if (input.company) return Response.json({ ok: true }, { status: 200 }); // honeypot: pretend success
    const site = String(input.site ?? "");
    const formType = input.formType ? String(input.formType) : undefined;
    try {
      const result = await storeLead(input, { site, formType, consent: input.consent === true });
      return Response.json({ ok: true, id: result.id }, { status: 201 });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "error";
      // client-actionable validation vs server/config failure
      const client = /consent|required|site is required/.test(msg);
      return Response.json({ ok: false, error: client ? msg : "could not submit" }, { status: client ? 422 : 500 });
    }
  };
}
