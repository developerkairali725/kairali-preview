// Store-first lead capture (Satyam production spec) — the factory one-liner.
// Needs SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in the Vercel project env
// (owner/ops item — flagged in the launch checklist; the form fails loudly,
// never silently, until the keys land).
import { enquiryRoute } from "@kairali/forms/route";

export const POST = enquiryRoute();
