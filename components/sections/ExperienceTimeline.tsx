"use client";

import { useMemo, useState } from "react";
import { ROLES } from "@/data/experience";
import SearchBar from "@/components/ui/SearchBar";

export default function ExperienceTimeline() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ROLES;
    return ROLES.filter((role) => {
      const haystack = [
        role.company,
        role.placement ?? "",
        role.title,
        role.period,
        role.location,
        role.summary,
        ...role.highlights,
        ...role.stack,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query]);

  return (
    <section className="mx-auto max-w-container px-6 md:px-10 pb-20 md:pb-section">
      {/* Search */}
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search roles, tech, companies…"
        className="mb-6 max-w-md"
      />
      <p className="mb-2 font-sans text-xs uppercase tracking-[0.2em] text-ink-muted">
        Showing {filtered.length} of {ROLES.length} roles
      </p>

      <ol className="relative">
        {/* Vertical guide line */}
        <span
          aria-hidden="true"
          className="absolute left-[7px] top-3 bottom-3 hidden w-px bg-sage/40 md:block"
        />

        {filtered.map((role, idx) => (
          <li
            key={role.id}
            id={role.id}
            className="relative scroll-mt-28 pt-12 pb-12 md:pl-12"
          >
            {/* Top divider */}
            <div
              aria-hidden="true"
              className="absolute top-0 left-0 right-0 h-0.5 bg-ink/40 md:left-12"
            />
            {/* Bottom divider on last item */}
            {idx === filtered.length - 1 && (
              <div
                aria-hidden="true"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-ink/40 md:left-12"
              />
            )}

            {/* Timeline dot (desktop) */}
            <span
              aria-hidden="true"
              className="absolute left-0 top-14 hidden h-4 w-4 items-center justify-center md:flex"
            >
              <span
                className={`block h-3 w-3 rounded-full border-2 ${
                  role.current
                    ? "border-sage bg-sage"
                    : "border-ink bg-beige"
                }`}
              />
            </span>

            {/* Header row */}
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b-2 border-ink/40 pb-4">
              <div className="flex flex-wrap items-end gap-3">
                <h2 className="font-satoshi text-3xl md:text-4xl text-ink tracking-tighter">
                  {role.company}
                  {role.placement && (
                    <span className="font-satoshi text-xl md:text-2xl text-ink-muted font-bold tracking-tighter ml-2">({role.placement})</span>
                  )}
                </h2>
                {role.current && <span className="mb-1"><Pill variant="sage">Current</Pill></span>}
                {role.internship && <span className="mb-1"><Pill variant="muted">Internship</Pill></span>}
              </div>
              <p className="font-sans text-sm text-ink-muted tabular">
                {role.period}
              </p>
            </div>

            <p className="mt-2 font-display text-xl text-ink">{role.title}</p>
            <p className="mt-1 font-sans text-xs uppercase tracking-[0.2em] text-ink-muted">
              {role.location}
            </p>

            <p className="mt-5 max-w-none font-sans text-base text-ink-muted leading-relaxed">
              {role.summary}
            </p>

            {/* Highlights */}
            <div className="mt-8">
              <p className="font-sans text-xs uppercase tracking-[0.2em] text-sage">
                What I built
              </p>
              <ul className="mt-4 space-y-4">
                {role.highlights.map((h, i) => (
                  <li
                    key={i}
                    className="grid grid-cols-[auto_1fr] gap-x-4 font-sans text-sm md:text-base text-ink leading-relaxed"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-terracotta"
                    />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stack */}
            <div className="mt-8">
              <p className="font-sans text-xs uppercase tracking-[0.2em] text-sage">
                Stack
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {role.stack.map((s) => (
                  <li
                    key={s}
                    className="inline-flex items-center rounded-md bg-ink/5 px-2.5 py-1 font-sans text-[11px] text-ink-muted"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>

          </li>
        ))}
      </ol>

      {filtered.length === 0 && (
        <p className="mt-10 text-center font-sans text-sm text-ink-muted">
          No roles match &ldquo;{query.trim()}&rdquo;.
        </p>
      )}
    </section>
  );
}

function Pill({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: "sage" | "muted";
}) {
  const cls =
    variant === "sage"
      ? "bg-sage text-beige-card"
      : "bg-ink/10 text-ink-muted";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-sans text-[10px] font-medium uppercase tracking-widest relative -translate-y-[1px] md:-translate-y-[2px] ${cls}`}
    >
      {children}
    </span>
  );
}
