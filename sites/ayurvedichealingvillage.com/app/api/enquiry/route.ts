// Store-first lead capture (Satyam production spec): the lead is written to
// our own DB with an explicit consent boolean BEFORE any CRM step. Server-side
// only — the service key never reaches the client.
//
// STAGING GUARD (WOPS-AHV-ENGLISH-STAGING-BUILD-20260915-001).
// This deployment is a design-review build. While AHV_STAGING is not "0" the
// handler FAILS CLOSED: it never reads the request body, never calls
// enquiryRoute()'s handler, and therefore never reaches the lead store or any
// CRM step with real enquirer details. It answers 503 with a truthful
// "unavailable on this staging build" — it does NOT pretend to have accepted
// the enquiry, because a false success would lose a real patient's message.
//
// Production behaviour is UNCHANGED: with AHV_STAGING=0 the exported POST is
// exactly the handler @kairali/forms/route returns, byte for byte.
import { enquiryRoute } from "@kairali/forms/route";

const IS_STAGING = process.env.AHV_STAGING !== "0";

const productionPost = enquiryRoute();

export const POST = IS_STAGING
  ? async function stagingClosedPost(): Promise<Response> {
      return Response.json(
        {
          ok: false,
          staging: true,
          error:
            "This is a staging preview of the Kairali website. Enquiries are not accepted here and nothing has been sent or stored. Please email info@kairali.com.",
        },
        { status: 503, headers: { "Cache-Control": "no-store" } },
      );
    }
  : productionPost;
