"use client";

import { useState } from "react";

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex h-[34px] items-center gap-1.5 border border-line px-2.5 text-[12px] text-muted transition-colors hover:border-ink hover:text-ink"
      aria-label={`${label} ${value}`}
    >
      {copied ? "Copied" : label}
    </button>
  );
}
