/** Separate newsletter contract — deliberately NOT an enquiry/CRM lead.
 * Delivery is unavailable until Deepu connects the approved email service,
 * verifies double opt-in, abuse controls and unsubscribe/suppression handling.
 * Fail closed in every environment: do not read, log, store or forward the body.
 * Changing AHV_STAGING alone must never activate an unconfigured newsletter.
 */
export async function POST(request: Request): Promise<Response> {
  const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };
  if ((request.headers.get("accept") || "").includes("text/html")) {
    return new Response(
      '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Newsletter signup | Kairali</title><main><h1>Newsletter signup is not connected yet</h1><p>Nothing has been saved or sent. Please try again later.</p><p><a href="/">Return to Kairali</a></p></main></html>',
      { status: 503, headers: { ...headers, "Content-Type": "text/html; charset=utf-8" } },
    );
  }
  return Response.json(
    { ok: false, code: "NEWSLETTER_NOT_CONFIGURED" },
    { status: 503, headers },
  );
}
