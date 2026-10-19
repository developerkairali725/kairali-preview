import Link from "next/link";

const COLLECTIONS = [
  {
    title: "Ayurvedic hospitality",
    description: "The gardens, accommodation and restorative setting of Kairali – The Ayurvedic Healing Village.",
    href: "/ayurvedic-hospitality-photo-library",
    image: "/media/pic/kairali-ayurvedic-hospitality.webp",
    width: 527,
    height: 437,
    alt: "A cottage in the tropical gardens of Kairali – The Ayurvedic Healing Village",
  },
  {
    title: "Ayurvedic treatment centres",
    description: "Treatment spaces, therapies and the care environment across Kairali Ayurvedic Centres.",
    href: "/ayurvedic-treatment-centres-photo-library",
    image: "/media/pic/kairali-ayurvedic-centres1.webp",
    width: 523,
    height: 216,
    alt: "An Ayurvedic treatment at a Kairali Ayurvedic Centre",
  },
  {
    title: "Ayurvedic products",
    description: "A visual catalogue of Kairali’s traditional medicines, personal care and wellbeing products.",
    href: "/ayurvedic-medicines-and-remedies-photo-library",
    image: "/media/pic/kairali-ayurvedic-products.webp",
    width: 262,
    height: 216,
    alt: "A selection of Kairali Ayurvedic products",
  },
] as const;

export default function PhotoLibraryLanding() {
  return (
    <section className="photo-library-landing" aria-labelledby="photo-collections">
      <div className="profile-section-head">
        <span className="overline">Explore Kairali in pictures</span>
        <h2 id="photo-collections">Three collections, one Ayurvedic tradition</h2>
        <p className="lede">Step inside Kairali’s retreats and treatment spaces, or browse the products developed from the group’s Ayurvedic heritage.</p>
      </div>
      <div className="photo-collection-grid">
        {COLLECTIONS.map((collection, index) => (
          <article className={`photo-collection-card photo-collection-${index + 1}`} key={collection.href}>
            <Link href={collection.href} className="photo-collection-image" tabIndex={-1} aria-hidden="true">
              <img src={collection.image} width={collection.width} height={collection.height} alt="" loading={index === 0 ? "eager" : "lazy"} decoding="async" />
            </Link>
            <div className="photo-collection-copy">
              <span className="photo-collection-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <h3><Link href={collection.href}>{collection.title}</Link></h3>
              <p>{collection.description}</p>
              <Link className="text-link" href={collection.href}>View collection<span className="sr-only">: {collection.title}</span></Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
