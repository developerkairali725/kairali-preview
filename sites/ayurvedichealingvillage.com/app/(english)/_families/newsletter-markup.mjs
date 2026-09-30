// Shared markup for approved design templates and server-rendered snapshots.
export const newsletterMarkup = "<form class=\"ahv-newsletter\" data-ahv-newsletter=\"1\" action=\"/api/newsletter\" method=\"post\" aria-label=\"Newsletter signup\">\n<label class=\"ahv-newsletter-label\">Email address<input type=\"email\" name=\"email\" autocomplete=\"email\" inputmode=\"email\" required=\"required\" maxlength=\"254\" placeholder=\"you@example.com\" autocapitalize=\"none\" spellcheck=\"false\"></label>\n<button type=\"submit\">Subscribe</button>\n<p class=\"ahv-newsletter-permission\">By subscribing, you agree to receive Kairali news and programme updates. Unsubscribe any time. <a href=\"/privacy-policy/\">Privacy policy</a></p>\n<p class=\"ahv-newsletter-status\" role=\"status\" aria-live=\"polite\" aria-atomic=\"true\"></p>\n</form>";
export function newsletterFooters(html) {
 return html.replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, footer => footer
  .replace(/<div\b[^>]*>\s*<div\b[^>]*>Your email address<\/div>\s*<a\b[^>]*>Subscribe<\/a>\s*<\/div>/gi, newsletterMarkup)
  .replace(/<div\b[^>]*>\s*<label\b[^>]*for="ftr-mail-m"[^>]*>[\s\S]*?<\/label>\s*<input\b[^>]*>\s*<\/div>\s*<button\b[^>]*>Subscribe<\/button>/gi, newsletterMarkup));
}
