"use client";

import { cn } from "@/lib/utils";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search…",
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
      >
        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
          <circle
            cx="7"
            cy="7"
            r="5"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M11 11l3 3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <input
        type="text"
        inputMode="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full rounded-full border border-ink/25 bg-beige-card py-2.5 pl-11 pr-10 font-sans text-sm text-ink placeholder:text-ink-muted transition-colors focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/30"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-ink/5 hover:text-ink"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none">
            <path
              d="M3 3l8 8M11 3l-8 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
