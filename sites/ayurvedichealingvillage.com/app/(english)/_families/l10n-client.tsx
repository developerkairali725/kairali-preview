"use client";
/**
 * Locale dictionary for client components of the native pages (reviews,
 * feedback composer). The server passes ONLY the accepted translations those
 * components need (English source → translation) and the localized paths; a
 * missing entry renders the English source (counted at build, never claimed).
 */
import { createContext, useContext, type ReactNode } from "react";

type Ctx = { locale: string; dict: Record<string, string>; paths: Record<string, string> };
const L10nContext = createContext<Ctx>({ locale: "en", dict: {}, paths: {} });

export function L10nProvider({ value, children }: { value: Ctx; children: ReactNode }) {
  return <L10nContext.Provider value={value}>{children}</L10nContext.Provider>;
}
const norm = (s: string) => s.replace(/[\s ]+/g, " ").trim();
export function useT(): (s: string) => string {
  const { dict } = useContext(L10nContext);
  return (s: string) => dict[norm(s)] ?? s;
}
export function useL(): (p: string) => string {
  const { paths } = useContext(L10nContext);
  return (p: string) => paths[p] ?? p;
}
export function useLocale(): string {
  return useContext(L10nContext).locale;
}
