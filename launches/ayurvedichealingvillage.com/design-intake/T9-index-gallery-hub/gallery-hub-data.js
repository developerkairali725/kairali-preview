// /gallery/ hub — ten child collections.
// Counts are derived, not invented:
//   8 photo routes: distinct image placements in assets/gallery-family-data.js (slider+grid are two
//   renderings of one set, so the distinct file count is used, except /photo-gallery/ which is a single
//   69-placement grid).
//   /ayurveda-gallery/: 8 placements in assets/ayurveda-gallery-data.js.
//   /video-gallery/: videoCards.count = 20 logical videos (source's 40 nodes are lazy-player + noscript pairs).
// Cover images are the first image of each child route, already downloaded and self-hosted.
window.AHV_GALLERY_HUB = {
  intro: "Ten collections of photographs and films from Kairali \u2014 The Ayurvedic Healing Village: treatment rooms and Panchakarma therapies, the villas and grounds, yoga and meditation sessions, our herbal products, and the countryside around Palakkad. Select a collection to view it in full.",
  introStatus: "DRAFT \u2014 approve or replace",
  cards: [
    { name: "Photo Gallery", href: "/photo-gallery/", count: 69, unit: "photographs",
      cover: "assets/img/gallery/00bdeed5700358e5d06bfabca8f8dd4c0d6a22e2f34c03a01ad04ef879870331.jpg" },
    { name: "Video Gallery", href: "/video-gallery/", count: 20, unit: "films",
      cover: "assets/img/AHV-Gallery-05.jpg", coverPending: true },
    { name: "Ayurveda Gallery", href: "/ayurveda-gallery/", count: 8, unit: "photographs",
      cover: "assets/img/AHV-Gallery-01.jpg" },
    { name: "Product Gallery", href: "/product-gallery/", count: 6, unit: "photographs",
      cover: "assets/img/gallery/8164cac9964d49004397690d7ff9bf893005f11e5dd921a766882bcfc0ed1e11.jpg" },
    { name: "Property Gallery", href: "/property-gallery/", count: 13, unit: "photographs",
      cover: "assets/img/gallery/8096f57d3787ab72f4d893924e162a235a0fc163ad93794a8cfb97c23172eee1.jpg" },
    { name: "Retreats Gallery", href: "/retreats-gallery/", count: 5, unit: "photographs",
      cover: "assets/img/gallery/20f21346b575f55911f8501cc677a2b148a4331a26fb3daa3402a840dce321dd.jpg" },
    { name: "Sight Seeing Gallery", href: "/sight-seeing-gallery/", count: 7, unit: "photographs",
      cover: "assets/img/gallery/6f1f3f3583e22d8e9b3bd556e13016ebd16fa8f22f1b007fc50263383688bc32.jpg" },
    { name: "Treatment Gallery", href: "/treatments-gallery/", count: 9, unit: "photographs",
      cover: "assets/img/gallery/2e470ae9a15e01e084582c199b07e7552fa4a15e651ec2e1874a1f912a47063c.jpg" },
    { name: "Villas Gallery", href: "/villas-gallery/", count: 9, unit: "photographs",
      cover: "assets/img/gallery/5c8ae296a98de0c65cf50c15a3c7796f82cc5c543eef2297974c2b2894b746bb.jpg" },
    { name: "Yoga Gallery", href: "/yoga-gallery/", count: 6, unit: "photographs",
      cover: "assets/img/gallery/e5f7c1a8a35b4263d3938e7a3c39902395046cb61045a95bf54dfab83a5afe99.jpg" }
  ]
};
