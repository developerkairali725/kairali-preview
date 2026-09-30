/** No-JavaScript / pre-hydration fallback for design forms awaiting integration.
 * Never parse or forward the body, even when AHV_STAGING is switched off.
 */
export async function POST(): Promise<Response> {
  return new Response(
    '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Contact Kairali</title><main><h1>This form is being connected</h1><p>Your details have not been saved or sent. Please contact our team directly.</p><p><a href="mailto:info@kairali.com">Email info@kairali.com</a> · <a href="https://wa.me/919289838797">WhatsApp patient care</a></p><p><a href="/contact-us/">Contact options</a></p></main></html>',
    { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } },
  );
}
