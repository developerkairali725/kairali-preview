// Project-intake pipe — store-first (Satyam's production spec): the lead lands
// in our Supabase table before any CRM step; the service key stays server-side.
import { enquiryRoute } from "@kairali/forms/route";

export const POST = enquiryRoute();
