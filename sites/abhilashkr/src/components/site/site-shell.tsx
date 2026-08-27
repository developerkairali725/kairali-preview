import type { ReactNode } from "react";

import { Analytics } from "@/components/site/analytics";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { JsonLd } from "@/components/site/json-ld";
import { ThemeProvider } from "@/components/site/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Locale } from "@/lib/i18n";
import { instrumentSans, instrumentSerif, ibmPlexMono } from "@/lib/fonts";
import { getSiteSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";

type SiteShellProps = {
  children: ReactNode;
  locale: Locale;
};

export function SiteShell({ children, locale }: SiteShellProps) {
  const schemaData = getSiteSchema();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn(
        "h-full antialiased scroll-smooth",
        instrumentSerif.variable,
        instrumentSans.variable,
        ibmPlexMono.variable,
      )}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <JsonLd data={schemaData} />
        <ThemeProvider>
          <TooltipProvider>
            <Header locale={locale} />
            <main className="flex flex-grow flex-col">{children}</main>
            <Footer locale={locale} />
            <Analytics locale={locale} />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
