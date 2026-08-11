import type { ReactNode } from "react";

import { Analytics } from "@/components/site/analytics";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { ThemeProvider } from "@/components/site/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Locale } from "@/lib/i18n";
import { instrumentSans, instrumentSerif, ibmPlexMono } from "@/lib/fonts";
import { getPersonSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";

type SiteShellProps = {
  children: ReactNode;
  locale: Locale;
};

export function SiteShell({ children, locale }: SiteShellProps) {
  const schemaData = getPersonSchema();

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
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
