"use client";

import { useState } from "react";

export default function EmailCopy({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API may be blocked; fall back silently
    }
  };

  return (
    <div className="mt-3 flex flex-wrap items-center gap-3">
      <a
        href={`mailto:${email}`}
        className="font-display text-xl text-ink tracking-tighter break-all hover:text-sage transition-colors"
      >
        {email}
      </a>
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy email to clipboard"
        className="inline-flex items-center gap-1.5 rounded-full border border-ink/25 bg-beige px-3 py-1 font-sans text-xs text-ink transition-colors hover:border-sage hover:text-sage"
      >
        {copied ? (
          <>
            <CheckIcon />
            Copied
          </>
        ) : (
          <>
            <CopyIcon />
            Copy
          </>
        )}
      </button>
    </div>
  );
}

function CopyIcon() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect
        x="3"
        y="3"
        width="8"
        height="8"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M5 3V2a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M2.5 7.5l3 3 6-7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
