import React from "react";

export function ZariRule({ className = "" }: { className?: string }) {
  return (
    <div className={`zari-rule ${className}`} />
  );
}

export function LedgerList({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <dl className={`flex flex-col space-y-1.5 w-full ${className}`}>
      {children}
    </dl>
  );
}

interface LedgerRowProps {
  label: string;
  value: React.ReactNode;
}

export function LedgerRow({ label, value }: LedgerRowProps) {
  return (
    <div className="flex flex-wrap justify-between items-baseline gap-2 py-1 font-mono text-xs uppercase tracking-wider w-full">
      <dt className="text-ink-muted flex-shrink-0 select-none">{label}</dt>
      <div className="flex-grow border-b border-dotted border-ink-muted/20 h-1 min-w-[8px]" />
      <dd className="text-ink font-semibold text-right select-all break-words max-w-full">
        {value}
      </dd>
    </div>
  );
}
