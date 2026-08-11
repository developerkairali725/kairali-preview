declare module "next/font/local" {
  type FontSource =
    | string
    | Array<{
        path: string;
        weight?: string;
        style?: string;
      }>;

  interface LocalFontOptions {
    src: FontSource;
    display?: "auto" | "block" | "swap" | "fallback" | "optional";
    weight?: string;
    style?: string;
    variable?: string;
    preload?: boolean;
    fallback?: string[];
    declarations?: Array<{ prop: string; value: string }>;
  }

  interface LocalFontResult {
    className: string;
    variable: string;
    style: {
      fontFamily: string;
      fontWeight?: number;
      fontStyle?: string;
    };
  }

  export default function localFont(options: LocalFontOptions): LocalFontResult;
}
