"use client";

import React, { useEffect, useState } from "react";
import { Link2, Check } from "lucide-react";

export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setProgress((window.scrollY / totalHeight) * 100);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[2px] bg-border z-50 pointer-events-none">
      <div 
        className="h-full bg-primary transition-all duration-75 ease-out" 
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export function CopyLinkButton({ href }: { href?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const url = href 
      ? `${window.location.origin}${href}` 
      : typeof window !== "undefined" ? window.location.href : "";
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono tracking-widest uppercase border border-border bg-card text-ink-muted hover:text-ink hover:border-primary transition-all cursor-pointer"
      title="Copy link to clipboard"
    >
      {copied ? (
        <>
          <Check size={12} className="text-primary animate-in zoom-in duration-200" />
          <span className="text-primary font-bold">Copied</span>
        </>
      ) : (
        <>
          <Link2 size={12} />
          <span>Copy Link</span>
        </>
      )}
    </button>
  );
}
