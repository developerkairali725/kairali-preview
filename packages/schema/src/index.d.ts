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
  logo?: string;
  foundingDate?: string;
  slogan?: string;
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
