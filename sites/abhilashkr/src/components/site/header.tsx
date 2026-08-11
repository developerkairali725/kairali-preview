"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import { CommandMenu } from "./command-menu";
import { LanguageSwitcher } from "./language-switcher";
import { ZariRule } from "@/components/ui/ledger";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetTitle
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { hrefFor, NAV_KEYS, NAV_LABELS, type Locale } from "@/lib/i18n";

export function Header({ locale = "en" }: { locale?: Locale }) {
  const pathname = usePathname();

  const navLinks = NAV_KEYS.map((key) => ({
    label: NAV_LABELS[locale][key] ?? key,
    href: hrefFor(locale, key),
  }));

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:h-20 md:px-6">
        <Link 
          href={hrefFor(locale, "home")}
          className="font-mono text-xs tracking-[0.25em] font-bold uppercase text-ink hover:text-primary transition-colors"
        >
          <span className="md:hidden">AKR</span>
          <span className="hidden md:inline">ABHILASH K. RAMESH</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`text-[10px] font-mono tracking-widest uppercase transition-colors relative py-1 ${
                isActive(link.href)
                  ? "text-primary font-bold"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              {link.label}
              {isActive(link.href) ? (
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-primary animate-in fade-in duration-200" />
              ) : null}
            </Link>
          ))}
          
          <div className="w-[1px] h-4 bg-border mx-2" />
          <LanguageSwitcher locale={locale} />
          {locale === "en" ? <CommandMenu /> : null}
          <ThemeToggle />
        </div>

        {/* Mobile Nav */}
        <div className="flex items-center gap-1 md:hidden">
          <LanguageSwitcher locale={locale} />
          {locale === "en" ? <CommandMenu /> : null}
          <ThemeToggle />
          <Sheet>
            <SheetTrigger render={
              <button className="inline-flex size-11 cursor-pointer items-center justify-center text-ink hover:text-primary" aria-label="Open mobile nav">
                <Menu className="h-5 w-5" />
              </button>
            } />
            <SheetContent side="right" className="w-72 bg-background p-6 font-mono border-l border-border">
              <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
              <div className="flex flex-col space-y-6 pt-10">
                <Link
                  href={hrefFor(locale, "home")}
                  className="flex min-h-11 items-center text-xs uppercase tracking-widest text-ink transition-colors hover:text-primary"
                >
                  {NAV_LABELS[locale].home}
                </Link>
                <div className="h-[1px] bg-border w-full" />
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`flex min-h-11 items-center text-xs uppercase tracking-widest transition-colors ${
                      isActive(link.href) ? "text-primary font-bold" : "text-ink-muted hover:text-ink"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <ZariRule />
    </header>
  );
}
