"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "./theme-provider";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { 
  FileText, 
  User, 
  Briefcase, 
  Award, 
  MapPin, 
  Mail, 
  Copy, 
  SunMoon, 
  ArrowRight,
  Sparkles,
  Newspaper
} from "lucide-react";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [copiedText, setCopiedText] = useState<string | null>(null);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const bios = {
    "20w": "Executive Director at Kairali Ayurvedic Group, scaling century-long Ayurvedic therapeutics globally, backing clean wellness innovations, and advising on AYUSH policies.",
    "100w": "Abhilash Kalathil Ramesh is the Executive Director of the Kairali Ayurvedic Group, preserving a traditional Indian medicine heritage since 1908. He oversees international growth, pharmaceutical manufacturing (KAPPL), day-spa clinics (KAC), and boutique hospitality (Villa Raag). Combining legacy family wisdom with operational AI, he standardizes treatments across 27+ countries. He is a founding board member of AYUSHEXCIL, advising the Ministry of AYUSH on global policy. As an angel investor, he backs startups in biotech, clean formulas, organic agriculture, and green hotel infrastructure.",
    "400w": "Abhilash Kalathil Ramesh is the Executive Director of the Kairali Ayurvedic Group, representing the fourth generation of a family dedicated to authentic Ayurvedic medicine since 1908. He directs the group's global footprint, spanning the NABH-accredited hospital (Kairali – The Ayurvedic Healing Village, Palakkad), WHO-GMP-certified pharmaceutical manufacturing (KAPPL), a network of day-spas (KAC), and boutique wellness hospitality (Villa Raag, Goa). Under his leadership, Kairali has expanded to over 27+ countries, standardizing Ayurvedic wellness protocols for international audiences. Beyond corporate management, Abhilash is a founding board member of AYUSHEXCIL (the Ayush Export Promotion Council), established under the Ministry of AYUSH, Government of India, where he works with policymakers to establish global export standards for traditional herbs and holistic medicine. As an active angel investor, he backs early-stage founders in biotechnology, organic agriculture, clean personal care formulations, and regenerative hospitality infrastructures, providing regulatory intelligence and distribution channels. Integrating artificial intelligence into legacy processes, he scales operational systems while keeping Kairali clinically grounded."
  };

  const runCommand = (command: () => void) => {
    command();
    // Keep open if copying so they see feedback, else close
    if (!copiedText) {
      setOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 text-[10px] font-mono tracking-widest uppercase border border-border bg-card text-ink-muted hover:text-ink hover:border-primary transition-colors cursor-pointer"
      >
        <span>Search ledger</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 bg-background px-1.5 font-mono text-[9px] text-[#9ba69b] border border-border">
          <span className="text-[10px]">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search page..." />
        <CommandList className="font-mono text-xs">
          <CommandEmpty>No results found.</CommandEmpty>
          
          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => runCommand(() => router.push("/"))}>
              <User className="mr-2 h-4 w-4" />
              <span>Index Page (Home)</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/about"))}>
              <User className="mr-2 h-4 w-4" />
              <span>About & Timeline</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/work"))}>
              <Briefcase className="mr-2 h-4 w-4" />
              <span>Enterprise & Brands</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/investing"))}>
              <Sparkles className="mr-2 h-4 w-4" />
              <span>Angel Investing Thesis</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/writing"))}>
              <FileText className="mr-2 h-4 w-4" />
              <span>Essays & Articles</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/media"))}>
              <Newspaper className="mr-2 h-4 w-4" />
              <span>Press Log</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/recognition"))}>
              <Award className="mr-2 h-4 w-4" />
              <span>Recognition</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/speaking"))}>
              <Sparkles className="mr-2 h-4 w-4" />
              <span>Speaking Kit & Booking</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/now"))}>
              <MapPin className="mr-2 h-4 w-4" />
              <span>Now page (/now)</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/faq"))}>
              <FileText className="mr-2 h-4 w-4" />
              <span>Frequently Asked Questions</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Essays & Publications">
            <CommandItem onSelect={() => runCommand(() => router.push("/writing/running-ayurveda-house-ai-ops"))}>
              <ArrowRight className="mr-2 h-3 w-3" />
              <span>1. Running a 118-Year House on AI Ops</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/writing/german-wellness-travellers-ayurveda"))}>
              <ArrowRight className="mr-2 h-3 w-3" />
              <span>2. What German Wellness Travellers Taught Me</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/writing/panchakarma-clinical-protocol"))}>
              <ArrowRight className="mr-2 h-3 w-3" />
              <span>3. Panchakarma is a Clinical Protocol</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/writing/family-business-succession-systems"))}>
              <ArrowRight className="mr-2 h-3 w-3" />
              <span>4. Family-Business Succession</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/writing/palakkad-beppu-ayurveda-japan"))}>
              <ArrowRight className="mr-2 h-3 w-3" />
              <span>5. Taking Kerala Ayurveda to Japan</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Theme">
            <CommandItem onSelect={() => runCommand(() => setTheme(theme === "dark" ? "kasavu" : "dark"))}>
              <SunMoon className="mr-2 h-4 w-4" />
              <span>Switch Theme (Current: {theme})</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Copy Operations">
            <CommandItem onSelect={() => runCommand(() => copyToClipboard(bios["20w"], "20w"))}>
              <Copy className="mr-2 h-4 w-4" />
              <span>{copiedText === "20w" ? "✓ Copied!" : "Copy 20-word Bio"}</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => copyToClipboard(bios["100w"], "100w"))}>
              <Copy className="mr-2 h-4 w-4" />
              <span>{copiedText === "100w" ? "✓ Copied!" : "Copy 100-word Bio"}</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => copyToClipboard(bios["400w"], "400w"))}>
              <Copy className="mr-2 h-4 w-4" />
              <span>{copiedText === "400w" ? "✓ Copied!" : "Copy 400-word Bio"}</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => copyToClipboard("info@kairali.com", "email"))}>
              <Mail className="mr-2 h-4 w-4" />
              <span>{copiedText === "email" ? "✓ Copied!" : "Copy Contact Email"}</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
