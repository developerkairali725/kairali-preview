// @kairali/legal — shared privacy / terms / cookie pages for every Factory
// site. Self-contained (its own minimal chrome + brand-token styling) so it
// renders uniformly whether the host site's layout supplies a header/footer or
// not. Grounds the consent banner's privacy link (Ship Gate A12).
//
// IMPORTANT: the policy TEXT is an honest DRAFT describing what the sites
// actually do technically (Consent Mode v2 default-denied, GA4/GTM only after
// consent, forms → Kairali CRM with a consent field, no sale of data). It is
// marked "pending legal review" and MUST be reviewed by counsel before any
// production go-live. Facts come from site.config + the one locked email.

import type { ReactNode } from "react";

export type SiteFacts = { domain: string; entity?: string; siteName?: string };

const EMAIL = "info@kairali.com"; // locked fact
const REVIEWED = "14 July 2026";
const CONTROLLER = "Kairali Ayurvedic Group";

const wrap: React.CSSProperties = { maxWidth: "44rem", margin: "0 auto", padding: "0 20px" };
const page: React.CSSProperties = { background: "var(--ivory, #F7F4EA)", color: "var(--ink, #2b2b28)", minHeight: "100vh", fontFamily: "var(--font-body, system-ui), sans-serif", lineHeight: 1.7 };
const head: React.CSSProperties = { borderBottom: "1px solid color-mix(in srgb, var(--bronze-400, #b98a3a) 26%, transparent)", padding: "16px 0", background: "color-mix(in srgb, var(--ivory, #F7F4EA) 92%, transparent)" };
const h1: React.CSSProperties = { fontFamily: "var(--font-display, Georgia), serif", fontWeight: 400, color: "var(--forest-700, #0a3d2b)", fontSize: "clamp(1.9rem, 5vw, 2.6rem)", margin: "8px 0 0" };
const h2: React.CSSProperties = { fontFamily: "var(--font-display, Georgia), serif", fontWeight: 400, color: "var(--forest-700, #0a3d2b)", fontSize: "1.3rem", margin: "36px 0 0" };
const draft: React.CSSProperties = { margin: "20px 0 0", padding: "14px 18px", borderRadius: 12, borderLeft: "4px solid var(--marigold-400, #EEB41E)", background: "var(--card-bg, #fff)", fontSize: "0.92rem" };

function Frame({ facts, title, updated, children }: { facts: SiteFacts; title: string; updated: string; children: ReactNode }) {
  return (
    <div style={page}>
      <header style={head}>
        <div style={wrap}>
          <a href="/" style={{ color: "var(--forest-500, #006038)", textDecoration: "none", fontWeight: 600, fontSize: "0.9rem" }}>&larr; {facts.siteName ?? facts.domain}</a>
        </div>
      </header>
      <main style={{ ...wrap, padding: "8px 20px 64px" }}>
        <h1 style={h1}>{title}</h1>
        <p style={{ fontFamily: "var(--font-caption, sans-serif)", fontSize: "0.85rem", color: "color-mix(in srgb, var(--ink, #2b2b28) 66%, transparent)", margin: "10px 0 0" }}>
          {facts.domain} · Last reviewed {updated}
        </p>
        {children}
      </main>
    </div>
  );
}

const P = ({ children }: { children: ReactNode }) => <p style={{ margin: "14px 0 0" }}>{children}</p>;
const UL = ({ items }: { items: ReactNode[] }) => (
  <ul style={{ margin: "12px 0 0", paddingLeft: 22 }}>{items.map((it, i) => <li key={i} style={{ margin: "6px 0 0" }}>{it}</li>)}</ul>
);

/** Privacy policy — describes the sites' actual data practices. */
export function PrivacyPolicy({ facts }: { facts: SiteFacts }) {
  return (
    <Frame facts={facts} title="Privacy Policy" updated={REVIEWED}>
      <div style={draft}>
        <strong>Draft — pending legal review.</strong> This policy describes how {facts.domain} handles
        personal data today. It is being reviewed by legal counsel and may be updated before the site goes live.
      </div>

      <h2 style={h2}>Who we are</h2>
      <P>{facts.domain} is operated by {CONTROLLER} ({facts.entity === "raag" ? "Villa Raag" : CONTROLLER}), the data controller for this website. You can reach us at <a href={`mailto:${EMAIL}`} style={{ color: "var(--forest-500,#006038)" }}>{EMAIL}</a>.</P>

      <h2 style={h2}>What we collect, and why</h2>
      <UL items={[
        <><strong>Enquiry details you give us.</strong> If you submit an enquiry or contact form, we collect the name, email address, phone number, and message you provide, so we can respond and, where relevant, arrange a consultation or service.</>,
        <><strong>Consent record.</strong> When you tick the consent box on a form, we record that you consented, so we have proof the data was given willingly (as required by data-protection law).</>,
        <><strong>Analytics — only if you allow it.</strong> Cookies and analytics (such as Google Analytics) load <em>only after you choose "Accept"</em> on our cookie banner. By default they are switched off. If you accept, we collect anonymous usage data (pages viewed, approximate location, device type) to improve the site.</>,
        <><strong>Chat.</strong> If you use the chat widget, your messages are processed by our chat provider to answer your questions.</>,
      ]} />

      <h2 style={h2}>What we do not do</h2>
      <P>We do not sell your personal data. We do not share it with advertisers. We use it only to respond to you and to run and improve this website.</P>

      <h2 style={h2}>Who we share it with</h2>
      <P>Enquiry details are stored securely and passed to {CONTROLLER}&rsquo;s own customer-relationship system so the right team can reply. We use trusted service providers (for example, website hosting, analytics if you opt in, and the chat widget) who process data on our behalf under agreement. We may disclose data if required by law.</P>

      <h2 style={h2}>How long we keep it</h2>
      <P>We keep enquiry data only as long as needed to serve your request and to meet legal or record-keeping obligations, then delete it.</P>

      <h2 style={h2}>Your rights</h2>
      <P>Under India&rsquo;s Digital Personal Data Protection Act and, for visitors in the EU/UK, the GDPR, you can ask us to show you the data we hold about you, correct it, delete it, or withdraw your consent at any time. To exercise any of these, email <a href={`mailto:${EMAIL}`} style={{ color: "var(--forest-500,#006038)" }}>{EMAIL}</a>. You may also withdraw analytics consent any time by declining cookies.</P>

      <h2 style={h2}>Cookies</h2>
      <P>See our <a href="/cookie-policy" style={{ color: "var(--forest-500,#006038)" }}>Cookie Policy</a> for the specific cookies we use and how to control them.</P>

      <h2 style={h2}>Changes</h2>
      <P>We may update this policy. The &ldquo;last reviewed&rdquo; date above shows when it last changed. Questions? Write to <a href={`mailto:${EMAIL}`} style={{ color: "var(--forest-500,#006038)" }}>{EMAIL}</a>.</P>
    </Frame>
  );
}

/** Terms of use. */
export function TermsOfService({ facts }: { facts: SiteFacts }) {
  const medical = facts.entity !== "raag";
  return (
    <Frame facts={facts} title="Terms of Use" updated={REVIEWED}>
      <div style={draft}><strong>Draft — pending legal review.</strong></div>

      <h2 style={h2}>Using this website</h2>
      <P>By using {facts.domain} you agree to these terms. The site and its content are provided by {CONTROLLER} for information. Please use it lawfully and do not attempt to disrupt or misuse it.</P>

      {medical ? (
        <>
          <h2 style={h2}>Not medical advice</h2>
          <P>The information on this site is educational and is <strong>not a substitute for professional medical advice, diagnosis, or treatment</strong>. Ayurvedic therapies and herbs should be used under the guidance of a qualified physician. Always consult a doctor before starting any treatment, and never disregard professional advice because of something you read here.</P>
        </>
      ) : null}

      <h2 style={h2}>Our content</h2>
      <P>The text, images, logos, and design on this site belong to {CONTROLLER} or its licensors and are protected by copyright and trademark law. You may read and share links to our pages, but you may not copy, republish, or use our content commercially without written permission.</P>

      <h2 style={h2}>Links to other sites</h2>
      <P>We may link to other websites for convenience. We are not responsible for their content or their privacy practices.</P>

      <h2 style={h2}>Limitation of liability</h2>
      <P>We work to keep the information accurate and the site available, but we provide it &ldquo;as is&rdquo; without warranties. To the extent permitted by law, {CONTROLLER} is not liable for any loss arising from your use of, or reliance on, this website.</P>

      <h2 style={h2}>Governing law</h2>
      <P>These terms are governed by the laws of India. Questions? Write to <a href={`mailto:${EMAIL}`} style={{ color: "var(--forest-500,#006038)" }}>{EMAIL}</a>.</P>
    </Frame>
  );
}

/** Cookie policy — matches the Consent Mode v2 behaviour the sites ship. */
export function CookiePolicy({ facts }: { facts: SiteFacts }) {
  return (
    <Frame facts={facts} title="Cookie Policy" updated={REVIEWED}>
      <div style={draft}><strong>Draft — pending legal review.</strong></div>

      <h2 style={h2}>How we use cookies</h2>
      <P>A cookie is a small file a website stores on your device. On {facts.domain}, non-essential cookies are switched <strong>off by default</strong>. Nothing beyond what is strictly necessary is stored until you choose &ldquo;Accept&rdquo; on our cookie banner.</P>

      <h2 style={h2}>The cookies we use</h2>
      <UL items={[
        <><strong>Essential (always on).</strong> A small record of your cookie choice, so we do not ask you again on every page. These do not track you.</>,
        <><strong>Analytics (only after you accept).</strong> If you accept, Google Analytics sets cookies to measure anonymous, aggregated usage so we can improve the site. Decline, and these never load.</>,
        <><strong>Chat widget.</strong> If you open the chat, the chat provider may set cookies needed for the conversation to work.</>,
      ]} />

      <h2 style={h2}>Controlling cookies</h2>
      <P>You can change your choice at any time by declining in the banner, and you can clear or block cookies in your browser settings. Blocking essential cookies may stop parts of the site from working.</P>

      <h2 style={h2}>More</h2>
      <P>See our <a href="/privacy" style={{ color: "var(--forest-500,#006038)" }}>Privacy Policy</a> for how we handle personal data, or write to <a href={`mailto:${EMAIL}`} style={{ color: "var(--forest-500,#006038)" }}>{EMAIL}</a>.</P>
    </Frame>
  );
}
