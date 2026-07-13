"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

type BioLength = "20w" | "100w" | "400w";

export function BioSelector() {
  const [activeTab, setActiveTab] = useState<BioLength>("100w");
  const [copied, setCopied] = useState(false);

  const bios = {
    "20w": "Executive Director at Kairali Ayurvedic Group, scaling century-long Ayurvedic therapeutics globally, backing clean wellness innovations, and advising on AYUSH policies.",
    "100w": "Abhilash Kalathil Ramesh is the Executive Director of the Kairali Ayurvedic Group, preserving a traditional Indian medicine heritage since 1908. He oversees international growth, pharmaceutical manufacturing (KAPPL), day-spa clinics (KAC), and boutique hospitality (Villa Raag). Combining legacy family wisdom with operational AI, he standardizes treatments across 27+ countries. He is a founding board member of AYUSHEXCIL, advising the Ministry of AYUSH on global policy. As an angel investor, he backs startups in biotech, clean formulas, organic agriculture, and green hotel infrastructure.",
    "400w": "Abhilash Kalathil Ramesh is the Executive Director of the Kairali Ayurvedic Group, representing the fourth generation of a family dedicated to authentic Ayurvedic medicine since 1908. He directs the group's global footprint, spanning the NABH-accredited hospital (Kairali – The Ayurvedic Healing Village, Palakkad), WHO-GMP-certified pharmaceutical manufacturing (KAPPL), a network of day-spas (KAC), and boutique wellness hospitality (Villa Raag, Goa). Under his leadership, Kairali has expanded to over 27+ countries, standardizing Ayurvedic wellness protocols for international audiences. Beyond corporate management, Abhilash is a founding board member of AYUSHEXCIL (the Ayush Export Promotion Council), established under the Ministry of AYUSH, Government of India, where he works with policymakers to establish global export standards for traditional herbs and holistic medicine. As an active angel investor, he backs early-stage founders in biotechnology, organic agriculture, clean personal care formulations, and regenerative hospitality infrastructures, providing regulatory intelligence and distribution channels. Integrating artificial intelligence into legacy processes, he scales operational systems while keeping Kairali clinically grounded."
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(bios[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full border border-border bg-card p-6 flex flex-col space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex space-x-2 font-mono text-[10px] tracking-widest uppercase">
          {(["20w", "100w", "400w"] as BioLength[]).map((len) => (
            <button
              key={len}
              onClick={() => setActiveTab(len)}
              className={`px-3 py-1 border transition-colors cursor-pointer ${
                activeTab === len
                  ? "border-primary bg-primary text-background font-bold"
                  : "border-border text-ink-muted hover:text-ink hover:border-ink-muted"
              }`}
            >
              {len === "20w" ? "Micro (20w)" : len === "100w" ? "Short (100w)" : "Full (400w)"}
            </button>
          ))}
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1 border border-border font-mono text-[10px] tracking-widest uppercase text-ink-muted hover:text-ink hover:border-primary transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check size={12} className="text-primary animate-in zoom-in" />
              <span className="text-primary font-bold">Copied</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy text</span>
            </>
          )}
        </button>
      </div>

      <div className="font-sans text-sm text-ink leading-relaxed whitespace-pre-wrap select-all">
        {bios[activeTab]}
      </div>
    </div>
  );
}
