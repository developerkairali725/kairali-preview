export type Centre = {
  slug: string;
  name: string;
  city: string;
  region?: string;
  country: string;
  address: string;
  phones: string[];
  email?: string;
  hours?: string;
  partner?: boolean;
  /** caveat surfaced in the UI / for review */
  note?: string;
};

export declare const CANONICAL_COUNT_RULING: string;
export declare const CENTRES: Centre[];
export declare const INDIA_CENTRES: Centre[];
export declare const INTERNATIONAL_CENTRES: Centre[];
export declare const COUNTRIES: string[];
export declare const CENTRES_COUNT: number;
export declare const COUNTRIES_COUNT: number;
export declare function numberWord(n: number): string;
export declare const COUNTRIES_WORD: string;
export declare const COUNTRIES_PHRASE: string;
export declare const COUNTRIES_PHRASE_TITLE: string;
export declare const CENTRES_NETWORK_LINE: string;
export declare function centreBySlug(slug: string): Centre | undefined;
