const BRANDS = [
  {
    name: "Kairali — The Ayurvedic Healing Village",
    href: "https://www.ayurvedichealingvillage.com",
    line: "NABH-accredited Ayurvedic hospital-retreat in Palakkad, Kerala, for physician-led treatment programmes.",
  },
  {
    name: "Kairali Ayurvedic Centres",
    href: "https://www.kairalicenters.com",
    line: "Treatment centres across nine countries, carrying forward classical Ayurvedic therapy.",
  },
  {
    name: "Kairali Ayurvedic Products",
    href: "https://www.kairaliproducts.in",
    line: "WHO-GMP-certified Ayurvedic medicines, oils, and personal care from our own manufacturing.",
  },
  {
    name: "Kairali Herbal Tea",
    href: "https://www.kairalitea.com",
    line: "Herbal tea blends rooted in Ayurvedic tradition.",
  },
  {
    name: "Kairali Franchise",
    href: "https://www.kairalifranchise.com",
    line: "Partner with the Kairali network — franchise opportunities in India and abroad.",
  },
  {
    name: "Kairali Ayurvedic Group",
    href: "https://www.kairali.com",
    line: "The group behind it all — health through ayurveda since 1908.",
  },
];

const schema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Kairali Ayurvedic Group",
  url: "https://arogyakendra.com",
  email: "info@kairali.com",
  foundingDate: "1908",
  sameAs: BRANDS.map((b) => b.href),
};

export default function Home() {
  return (
    <main style={{ maxWidth: 880, margin: "0 auto", padding: "clamp(24px, 6vw, 64px) 20px" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <p className="overline">Kairali Ayurvedic Group · Since 1908</p>
      <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", margin: "0.3em 0" }}>Arogya Kendra</h1>
      <p style={{ maxWidth: "62ch", fontSize: "1.06rem" }}>
        Arogya Kendra — the centre of health — is the gateway to the Kairali Ayurvedic
        Group. For over a century our family has practised Ayurveda the classical way:
        physician-led treatment, medicines from our own WHO-GMP-certified manufacturing,
        and an Ayurvedic way of life through natural ways of living.
      </p>
      <p>
        <a className="cta" href="mailto:info@kairali.com" data-cta="email_click">
          Write to info@kairali.com
        </a>
      </p>

      <h2 style={{ marginTop: "2.5em" }}>Find the Kairali That You Need</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
          marginTop: 16,
        }}
      >
        {BRANDS.map((b) => (
          <a key={b.href} className="brand-card" href={b.href} data-cta="brand_click">
            <h3 style={{ margin: "0 0 0.4em", fontSize: "1.15rem" }}>{b.name}</h3>
            <p style={{ margin: 0, fontSize: "0.92rem", color: "var(--ink)" }}>{b.line}</p>
          </a>
        ))}
      </div>

      <footer style={{ marginTop: "4em", paddingTop: "1.5em", borderTop: "1px solid rgba(0,96,56,0.18)", fontSize: "0.85rem" }}>
        <p>
          Kairali Ayurvedic Group · <a href="mailto:info@kairali.com">info@kairali.com</a> ·
          health through ayurveda
        </p>
      </footer>
    </main>
  );
}
