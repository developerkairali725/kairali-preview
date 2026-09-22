// Hand-maintained declarations for src/index.js (plain-ESM house style).
// Keep in sync with the JSDoc there.

export type JsonLdNode = Record<string, unknown>;

export function serializeJsonLd(node: JsonLdNode): string;
export function graph(...nodes: JsonLdNode[]): JsonLdNode;

export function organization(o: {
  id?: string;
  name: string;
  url: string;
  email?: string;
  telephone?: string;
  logo?: string;
  foundingDate?: string;
  description?: string;
  slogan?: string;
  areaServed?: string | string[];
  sameAs?: string[];
  parentId?: string;
}): JsonLdNode;

export function kairaliOrganization(o?: {
  id?: string;
  url?: string;
  sameAs?: string[];
  logo?: string;
}): JsonLdNode;

export function webSite(w: {
  id?: string;
  name: string;
  url: string;
  publisherId?: string;
  inLanguage?: string | string[];
}): JsonLdNode;

export function breadcrumbList(b: {
  id?: string;
  items: Array<{ name: string; url: string }>;
}): JsonLdNode;

export function faqPage(f: {
  id?: string;
  questions: Array<{ question: string; answer: string }>;
}): JsonLdNode;

export function person(p: {
  id?: string;
  name: string;
  jobTitle?: string;
  url?: string;
  sameAs?: string[];
  affiliationId?: string;
}): JsonLdNode;

export function physician(p: {
  id?: string;
  name: string;
  jobTitle?: string;
  url?: string;
  sameAs?: string[];
  affiliationId?: string;
  medicalSpecialty?: string;
}): JsonLdNode;

export function article(a: {
  id?: string;
  headline: string;
  url: string;
  authorId?: string;
  author?: JsonLdNode;
  datePublished?: string;
  dateModified?: string;
  image?: string;
  inLanguage?: string;
  publisherId?: string;
}): JsonLdNode;

export function medicalWebPage(m: {
  id?: string;
  name: string;
  url: string;
  condition?: string;
  lastReviewed?: string;
  reviewedById?: string;
  reviewedBy?: JsonLdNode;
  inLanguage?: string;
}): JsonLdNode;

export function medicalClinic(c: {
  id?: string;
  name: string;
  url: string;
  email?: string;
  telephone?: string;
  address?: Record<string, string>;
  medicalSpecialty?: string;
  parentId?: string;
}): JsonLdNode;

export function localBusiness(b: {
  id?: string;
  type?: string;
  name: string;
  url: string;
  email?: string;
  telephone?: string;
  address?: Record<string, string>;
  parentId?: string;
}): JsonLdNode;

export function product(p: {
  id?: string;
  name: string;
  url: string;
  image?: string;
  description?: string;
  brand?: string;
  offer?: {
    url: string;
    price?: string;
    priceCurrency?: string;
    availability?: string;
  };
}): JsonLdNode;

export function book(b: {
  id?: string;
  name: string;
  alternateName?: string;
  url?: string;
  image?: string;
  authorId?: string;
  isbn?: string;
  numberOfPages?: number;
  datePublished?: string;
  publisherName?: string;
  inLanguage?: string;
  award?: string;
  bookFormat?: "Hardcover" | "Paperback" | "EBook";
  offers?: Array<{ url: string; sellerName?: string }>;
}): JsonLdNode;

export function itemList(l: {
  id?: string;
  name?: string;
  /** {name, url?} entries, or {id} references to nodes already in the graph. */
  items: Array<{ name?: string; url?: string; id?: string }>;
}): JsonLdNode;

export function service(s: {
  id?: string;
  name: string;
  description?: string;
  url?: string;
  providerId?: string;
  serviceType?: string;
  areaServed?: string | string[];
}): JsonLdNode;

export function course(c: {
  id?: string;
  name: string;
  description?: string;
  url?: string;
  providerId?: string;
  providerName?: string;
  providerUrl?: string;
  courseMode?: string;
  inLanguage?: string;
}): JsonLdNode;

export function imageGallery(g: {
  id?: string;
  name: string;
  description?: string;
  url?: string;
  mainEntityOfPageId?: string;
  inLanguage?: string;
  /** URL strings (blushlounge form) or ImageObject nodes from imageObject(). */
  images?: Array<string | JsonLdNode>;
  /** VideoObject nodes from videoObject(). */
  videos?: JsonLdNode[];
  /** One ItemList per chapter (itemList()). */
  hasPart?: JsonLdNode[];
}): JsonLdNode;

export function imageObject(i: {
  id?: string;
  contentUrl: string;
  url?: string;
  thumbnailUrl?: string;
  name?: string;
  caption?: string;
  description?: string;
  width?: number;
  height?: number;
  creditText?: string;
  copyrightNotice?: string;
  creatorName?: string;
  creatorId?: string;
  license?: string;
  acquireLicensePage?: string;
  representativeOfPage?: boolean;
  inLanguage?: string;
}): JsonLdNode;

export function videoObject(v: {
  id?: string;
  name: string;
  description?: string;
  thumbnailUrl: string | string[];
  uploadDate?: string;
  duration?: string;
  embedUrl?: string;
  contentUrl?: string;
  url?: string;
  publisherId?: string;
  publisherName?: string;
  isFamilyFriendly?: boolean;
  inLanguage?: string;
}): JsonLdNode;
