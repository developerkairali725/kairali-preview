// Route-specific wordmark exception: never apply contain-fit to photographic cards.
export function logoSource(route) {
  return route === "/kairali-air-india-maharaja-club.html"
    ? "public/ahv/assets/img/AHV-V3-MaharajaClub_CMYK_Positive.webp" : null;
}
export async function renderLogo(sharp, src, dest, quality) {
  // Keep the full alpha-bearing wordmark inside a 1072x502 white field, then add64px margins.
  // Flatten before resize so transparency never turns black during JPEG conversion.
  return sharp(src).flatten({ background: "#ffffff" })
    .resize(1072, 502, { fit: "contain", background: "#ffffff" })
    .extend({ top: 64, bottom: 64, left: 64, right: 64, background: "#ffffff" })
    .jpeg({ quality, progressive: false }).toFile(dest);
}
