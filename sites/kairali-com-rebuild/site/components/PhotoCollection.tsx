type GalleryItem = { src: string; alt: string; width: number; height: number; title: string };

const decodeText = (value: string) => value
  .replace(/<[^>]+>/g, "")
  .replaceAll("&amp;", "&")
  .replaceAll("&quot;", "\"")
  .replaceAll("&#39;", "'")
  .replaceAll("&apos;", "'")
  .replaceAll("&nbsp;", " ")
  .replace(/\bInvividual\b/g, "Individual")
  .replace(/\s+/g, " ")
  .trim();

function attribute(tag: string, name: string): string {
  return tag.match(new RegExp(`${name}="([^"]*)"`, "i"))?.[1] || "";
}

function galleryItems(html: string): GalleryItem[] {
  const pattern = /(<img\b[^>]*>)\s*<h3>([\s\S]*?)<\/h3>/gi;
  return Array.from(html.matchAll(pattern), (match) => {
    const tag = match[1];
    const title = decodeText(match[2]);
    return {
      src: attribute(tag, "src"),
      alt: decodeText(attribute(tag, "alt")) || title,
      width: Number(attribute(tag, "width")) || 1200,
      height: Number(attribute(tag, "height")) || 675,
      title,
    };
  }).filter((item) => item.src && item.title);
}

export default function PhotoCollection({ html }: { html: string }) {
  const items = galleryItems(html);
  return (
    <section className="photo-gallery" aria-label="Photo collection">
      <div className="photo-gallery-grid">
        {items.map((item, index) => (
          <figure className={index === 0 ? "photo-gallery-item featured" : "photo-gallery-item"} key={`${item.src}-${index}`}>
            <div className="photo-gallery-image">
              <img src={item.src} width={item.width} height={item.height} alt={item.alt} loading={index < 2 ? "eager" : "lazy"} decoding="async" />
            </div>
            <figcaption><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><strong>{item.title}</strong></figcaption>
          </figure>
        ))}
      </div>
      <p className="photo-gallery-back"><a className="text-link" href="/photo-library">Back to all photo collections</a></p>
    </section>
  );
}
