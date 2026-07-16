// healing.recipes shared chrome — header + footer on every page.
// Contact policy (rule 6): locked email only; NO phone number until Abilash
// confirms one (Q-HR-PHONE — the legacy site's number is unverified).
const EMAIL = "info@kairali.com";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container">
        <a className="wordmark" href="/" aria-label="Healing Recipes — home">
          <img
            src="/images/kairali-icon.svg"
            alt=""
            aria-hidden="true"
            width="40"
            height="28"
          />
          <span>healing.recipes</span>
        </a>
        <nav className="site-nav" aria-label="Sections">
          <a href="/#shelf">The Books</a>
          <a href="/author">The Author</a>
          <a href="/press">Press</a>
          <a href="/contact">Contact</a>
        </nav>
        <a className="btn btn-primary header-cta" href="/books/harmony" data-cta="header_harmony">
          Get&nbsp;Harmony
        </a>
      </div>
    </header>
  );
}

export function SiteFooter() {
  // Rolling-number rule (DECISIONS 16 Jul): the year is computed at build,
  // never typed as a literal that rots.
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container">
        <p className="footer-title">healing.recipes — the books of Gita Ramesh</p>
        <p className="footer-line">
          A Kairali Ayurvedic Group site ·{" "}
          <a href={`mailto:${EMAIL}`} data-cta="email_click">
            {EMAIL}
          </a>
        </p>
        <nav className="footer-nav" aria-label="Site">
          <a href="/#shelf">The Books</a>
          <a href="/author">The Author</a>
          <a href="/press">Press</a>
          <a href="/contact">Contact</a>
        </nav>
        <nav className="footer-nav" aria-label="Kairali sites">
          <a href="https://www.kairali.com">Kairali Ayurvedic Group</a>
          <a href="https://www.kairaliproducts.in">Kairali Store (India)</a>
          <a href="https://www.kairaliproducts.com">Kairali Store (International)</a>
          <a href="https://www.ayurvedichealingvillage.com">The Ayurvedic Healing Village</a>
        </nav>
        <nav className="footer-nav footer-legal" aria-label="Legal">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/cookie-policy">Cookies</a>
        </nav>
        <p className="footer-fine">
          © {year} Kairali Ayurvedic Group · a family practising Ayurveda since 1908
        </p>
      </div>
    </footer>
  );
}
