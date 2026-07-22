// Store-first lead capture (Satyam production spec): the lead is written to
// our own DB with an explicit consent boolean BEFORE any CRM step. Server-side
// only — the service key never reaches the client.
import { enquiryRoute } from "@kairali/forms/route";

export const POST = enquiryRoute();
