"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { NAV_ITEMS, CV_URL } from "@/data/nav";
import { cn } from "@/lib/utils";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative z-50 flex h-10 w-10 items-center justify-center text-ink"
      >
        <span className="sr-only">{open ? "Close" : "Open"} menu</span>
        <div className="relative h-4 w-6">
          <span
            className={cn(
              "absolute left-0 top-0 h-0.5 w-6 bg-current transition-transform",
              open && "translate-y-[7px] rotate-45",
            )}
          />
          <span
            className={cn(
              "absolute left-0 top-1/2 h-0.5 w-6 -translate-y-1/2 bg-current transition-opacity",
              open && "opacity-0",
            )}
          />
          <span
            className={cn(
              "absolute left-0 bottom-0 h-0.5 w-6 bg-current transition-transform",
              open && "-translate-y-[7px] -rotate-45",
            )}
          />
        </div>
      </button>

      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-beige transition-opacity duration-300",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        aria-hidden={!open}
      >
        <div className="flex h-full flex-col px-6 pt-24 pb-10 overflow-y-auto">
          <nav className="flex-1" aria-label="Mobile primary">
            <ul className="space-y-1">
              {NAV_ITEMS.map((item) => {
                if (item.children) {
                  const isExpanded = expanded === item.label;
                  return (
                    <li key={item.label} className="border-b border-ink/20">
                      <button
                        type="button"
                        aria-expanded={isExpanded}
                        onClick={() =>
                          setExpanded(isExpanded ? null : item.label)
                        }
                        className="flex w-full items-center justify-between py-4 font-display text-3xl text-ink"
                      >
                        {item.label}
                        <svg
                          className={cn(
                            "h-5 w-5 transition-transform",
                            isExpanded && "rotate-180",
                          )}
                          viewBox="0 0 20 20"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M5 8l5 5 5-5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <div
                        className={cn(
                          "overflow-hidden transition-all duration-300",
                          isExpanded ? "max-h-60 pb-4" : "max-h-0",
                        )}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="block py-2 font-sans text-base text-ink-muted hover:text-sage"
                        >
                          View all
                        </Link>
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setOpen(false)}
                            className="block py-2"
                          >
                            <span className="font-sans text-base text-ink">
                              {child.label}
                            </span>
                            {child.sublabel && (
                              <span className="ml-2 font-sans text-xs text-sage">
                                {child.sublabel}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </li>
                  );
                }

                return (
                  <li key={item.label} className="border-b border-ink/20">
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block py-4 font-display text-3xl text-ink"
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <a
            href={CV_URL}
            download
            onClick={() => setOpen(false)}
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-terracotta px-6 py-3 font-sans text-sm font-medium text-beige-card"
          >
            Download CV
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M7 2v8m0 0L4 7m3 3l3-3M2 12h10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
