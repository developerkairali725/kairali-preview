import React from "react";

export function ZariRule({ className = "" }: { className?: string }) {
  return (
    <div className={`zari-rule ${className}`} />
  );
}

export function LedgerList({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <dl className={`grid w-full grid-cols-[auto_minmax(0,1fr)] gap-x-2 gap-y-1.5 ${className}`}>
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
    <>
      <dt className="py-1 font-mono text-xs uppercase tracking-wider text-ink-muted select-none">
        {label}
      </dt>
      <dd className="flex min-w-0 items-baseline gap-2 py-1 text-right font-mono text-xs font-semibold uppercase tracking-wider text-ink before:min-w-2 before:flex-1 before:border-b before:border-dotted before:border-ink-muted/20">
        <span className="max-w-full break-words select-all">{value}</span>
      </dd>
    </>
  );
}
