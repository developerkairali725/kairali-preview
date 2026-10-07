// This site has no @types/react-dom. The one react-dom API campaign-v2 uses is the server-side resource hint
// (Hero.tsx preloads the LCP image per media query); typed here to the React 19 signature it relies on.
declare module "react-dom" {
  export function preload(href: string, options: {
    as: "image"; imageSrcSet?: string; imageSizes?: string; fetchPriority?: "high" | "low" | "auto"; media?: string;
  }): void;
}
