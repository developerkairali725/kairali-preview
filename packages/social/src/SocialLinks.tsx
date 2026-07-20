import { SOCIAL_PROFILES } from "./config";

/**
 * Fleet footer social links — the ONE shared component every Factory site
 * renders in its footer (D-20260718-04; Factory rule: packages/* only, no
 * copy-pasted components).
 *
 * Plain anchors ONLY: no embed widgets, no follow buttons, no share SDKs,
 * no tracking pixels — a footer link must not phone home (consent ruling).
 * Server component by design (no "use client"): zero client JS shipped.
 *
 * The handles live in ./config.ts — the single place the Astha/Anupam
 * true-up (D-SOCIALS-INTERIM) will edit. Links carry `data-social="<id>"`
 * (a styling/analytics hook, deliberately NOT `data-cta`: these are
 * profile links, not conversion CTAs, and the A4 touch-target law budgets
 * `data-cta` controls at 44x44).
 */
export function SocialLinks({
  className = "footer-social",
  ariaLabel = "Kairali Ayurvedic Group on social media",
}: {
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <nav className={className} aria-label={ariaLabel}>
      {SOCIAL_PROFILES.map((p) => (
        <a
          key={p.id}
          href={p.href}
          target="_blank"
          rel="noopener noreferrer"
          data-social={p.id}
        >
          {p.label}
        </a>
      ))}
    </nav>
  );
}
