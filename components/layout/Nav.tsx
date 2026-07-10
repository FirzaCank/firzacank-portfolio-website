"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_ITEMS, CV_URL, CV_URL_JA } from "@/data/nav";
import { cn } from "@/lib/utils";
import MobileMenu from "./MobileMenu";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close any open dropdown on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenDropdown(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "backdrop-blur-md bg-beige/80 border-b border-ink/15"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto max-w-container px-6 md:px-10">
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            aria-label="Home"
            aria-current={isActive("/") ? "page" : undefined}
            className={cn(
              "group inline-flex h-10 w-10 items-center justify-center rounded-full border transition-all hover:border-sage hover:bg-sage hover:text-beige-card",
              isActive("/")
                ? "border-sage bg-sage text-beige-card"
                : "border-ink/25 text-ink",
            )}
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 8.5L10 3l7 5.5V16a1 1 0 0 1-1 1h-3v-5H7v5H4a1 1 0 0 1-1-1V8.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="Primary"
          >
            {NAV_ITEMS.map((item) => {
              if (item.children) {
                const isOpen = openDropdown === item.label;
                const active = isActive(item.href);
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(item.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      onClick={() =>
                        setOpenDropdown(isOpen ? null : item.label)
                      }
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-sans text-sm transition-colors",
                        active
                          ? "bg-sage/15 font-semibold text-sage-deep"
                          : "text-ink-muted hover:text-sage",
                      )}
                    >
                      {item.label}
                      <svg
                        className={cn(
                          "h-3 w-3 transition-transform",
                          isOpen && "rotate-180",
                        )}
                        viewBox="0 0 12 12"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M3 4.5L6 7.5L9 4.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    {/* plain list of links: no role=menu without full menu keyboard semantics */}
                    {isOpen && (
                      <div className="absolute left-0 top-full pt-2 min-w-[240px]">
                        <div className="rounded-lg border border-ink/20 bg-beige-card shadow-lg shadow-ink/5 p-2">
                          <Link
                            href={item.href}
                            className="block rounded-md px-3 py-2 font-sans text-sm text-ink-muted hover:bg-beige hover:text-ink transition-colors"
                          >
                            View all
                          </Link>
                          <div className="my-1 h-px bg-ink/10" />
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block rounded-md px-3 py-2 transition-colors hover:bg-beige"
                            >
                              <span className="block font-sans text-sm text-ink">
                                {child.label}
                              </span>
                              {child.sublabel && (
                                <span className="block font-sans text-xs text-sage mt-0.5">
                                  {child.sublabel}
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              const active = isActive(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-full px-4 py-2 font-sans text-sm transition-colors",
                    active
                      ? "bg-sage/15 font-semibold text-sage-deep"
                      : "text-ink-muted hover:text-sage",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* CV dropdown */}
            <div
              className="relative ml-3"
              onMouseEnter={() => setOpenDropdown("__cv__")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                onClick={() =>
                  setOpenDropdown(openDropdown === "__cv__" ? null : "__cv__")
                }
                aria-expanded={openDropdown === "__cv__"}
                aria-haspopup="true"
                className="inline-flex items-center gap-2 rounded-full border border-terracotta px-5 py-2 font-sans text-sm font-medium text-terracotta transition-all hover:bg-terracotta hover:text-beige-card"
              >
                Download CV
                <svg
                  className={cn(
                    "h-3 w-3 transition-transform",
                    openDropdown === "__cv__" && "rotate-180",
                  )}
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 4.5L6 7.5L9 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {openDropdown === "__cv__" && (
                <div className="absolute right-0 top-full pt-2 min-w-[220px]">
                  <div className="rounded-lg border border-ink/20 bg-beige-card shadow-lg shadow-ink/5 p-2">
                    <a
                      href={CV_URL}
                      download
                      className="flex items-center justify-between rounded-md px-3 py-2 transition-colors hover:bg-beige"
                    >
                      <div>
                        <span className="block font-sans text-sm font-medium text-ink">
                          English
                        </span>
                        <span className="block font-sans text-xs text-ink-muted mt-0.5">
                          PDF
                        </span>
                      </div>
                      <span className="font-sans text-[10px] uppercase tracking-widest text-sage">
                        EN
                      </span>
                    </a>
                    <div className="my-1 h-px bg-ink/10" />
                    <a
                      href={CV_URL_JA}
                      download
                      className="flex items-center justify-between rounded-md px-3 py-2 transition-colors hover:bg-beige"
                    >
                      <div>
                        <span className="block font-sans text-sm font-medium text-ink">
                          日本語 (履歴書)
                        </span>
                        <span className="block font-sans text-xs text-ink-muted mt-0.5">
                          Excel
                        </span>
                      </div>
                      <span className="font-sans text-[10px] uppercase tracking-widest text-sage">
                        JP
                      </span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile menu */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
