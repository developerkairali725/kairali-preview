// This site has no @types/react-dom. Declare the React 19 APIs used by campaign-v2:
// resource hints in Hero and the guest-video modal portal.
declare module "react-dom" {
  export function createPortal(children: import("react").ReactNode, container: Element | DocumentFragment, key?: string | null): import("react").ReactPortal;
  export function preload(href: string, options: {
    as: "image"; imageSrcSet?: string; imageSizes?: string; fetchPriority?: "high" | "low" | "auto"; media?: string;
  }): void;
}
