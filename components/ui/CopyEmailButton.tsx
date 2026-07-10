"use client";

import { useState, useEffect, useRef } from "react";

const EMAIL = "firzasandjaya@gmail.com";

interface Props {
  /** Visual variant */
  variant?: "link" | "button" | "icon" | "cta-dark";
  /** Override label text (link/button variants) */
  label?: string;
  className?: string;
}

export default function CopyEmailButton({
  variant = "link",
  label,
  className = "",
}: Props) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      // fallback: create temp input
      const el = document.createElement("input");
      el.value = EMAIL;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2500);
  };

  if (variant === "icon") {
    return (
      <>
        <button
          type="button"
          onClick={copy}
          aria-label="Copy email address"
          className={className}
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </button>
        <Toast show={copied} />
      </>
    );
  }

  if (variant === "cta-dark") {
    return (
      <>
        <button
          type="button"
          onClick={copy}
          className={`inline-flex items-center justify-center gap-2 rounded-full border border-beige-card/30 px-6 py-3 font-sans text-sm font-medium text-beige-card transition-colors hover:bg-beige-card/10 ${className}`}
        >
          {copied ? "Copied!" : (label ?? EMAIL)}
        </button>
        <Toast show={copied} />
      </>
    );
  }

  if (variant === "button") {
    return (
      <>
        <button
          type="button"
          onClick={copy}
          className={className}
        >
          {copied ? "Copied!" : (label ?? "Copy email")}
        </button>
        <Toast show={copied} />
      </>
    );
  }

  // default: "link" — looks like a text link
  return (
    <>
      <button
        type="button"
        onClick={copy}
        className={`font-sans text-sm text-ink hover:text-sage transition-colors ${className}`}
      >
        {copied ? "Copied!" : (label ?? "Email")}
      </button>
      <Toast show={copied} />
    </>
  );
}

function Toast({ show }: { show: boolean }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 font-sans text-sm text-beige-card shadow-lg shadow-ink/20 transition-all duration-300 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
      }`}
    >
      <svg className="h-3.5 w-3.5 text-sage shrink-0" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M2.5 7.5l3 3 6-7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Copied {EMAIL}
    </div>
  );
}
