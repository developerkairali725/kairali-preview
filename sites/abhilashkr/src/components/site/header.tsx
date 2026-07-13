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

export function Header() {
  const pathname = usePathname();
  
  const navLinks = [
    { label: "About", href: "/about" },
    { label: "Work", href: "/work" },
    { label: "Investing", href: "/investing" },
    { label: "Writing", href: "/writing" },
    { label: "Media", href: "/media" },
    { label: "Recognition", href: "/recognition" },
    { label: "Speaking", href: "/speaking" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
        <Link 
          href="/" 
          className="font-mono text-xs tracking-[0.25em] font-bold uppercase text-ink hover:text-primary transition-colors"
        >
          ABHILASH K. RAMESH
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
          <LanguageSwitcher />
          <CommandMenu />
          <ThemeToggle />
        </div>

        {/* Mobile Nav */}
        <div className="flex items-center space-x-3 md:hidden">
          <LanguageSwitcher />
          <CommandMenu />
          <ThemeToggle />
          <Sheet>
            <SheetTrigger render={
              <button className="text-ink hover:text-primary p-1 cursor-pointer" aria-label="Open mobile nav">
                <Menu className="h-5 w-5" />
              </button>
            } />
            <SheetContent side="right" className="w-72 bg-background p-6 font-mono border-l border-border">
              <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
              <div className="flex flex-col space-y-6 pt-10">
                <Link
                  href="/"
                  className="text-xs tracking-widest uppercase text-ink hover:text-primary transition-colors"
                >
                  Index Page
                </Link>
                <div className="h-[1px] bg-border w-full" />
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`text-xs tracking-widest uppercase transition-colors ${
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
