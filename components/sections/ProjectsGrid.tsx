"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  PROJECTS,
  CATEGORY_LABEL,
  type ProjectCategory,
} from "@/data/projects";
import { cn } from "@/lib/utils";

type Filter = ProjectCategory | "all";

const CATEGORY_ORDER: ProjectCategory[] = [
  "data-analyst",
  "data-engineer",
  "data-science",
  "ai-engineer",
  "pitch-deck",
  "dashboard",
];

export default function ProjectsGrid() {
  const [filter, setFilter] = useState<Filter>("all");

  const sortedProjects = useMemo(() => {
    return [...PROJECTS].sort((a, b) => Number(b.year) - Number(a.year));
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return sortedProjects;
    return sortedProjects.filter((p) => p.categories.includes(filter));
  }, [filter, sortedProjects]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: PROJECTS.length };
    for (const cat of CATEGORY_ORDER) {
      c[cat] = PROJECTS.filter((p) => p.categories.includes(cat)).length;
    }
    return c;
  }, []);

  return (
    <section className="mx-auto max-w-container px-6 md:px-10 pb-20 md:pb-section">
      {/* Filter chips */}
      <div
        role="tablist"
        aria-label="Filter projects by category"
        className="flex flex-wrap gap-2 border-b border-ink/20 pb-8"
      >
        <FilterChip
          active={filter === "all"}
          onClick={() => setFilter("all")}
          label="All"
          count={counts.all}
        />
        {CATEGORY_ORDER.map((cat) => (
          <FilterChip
            key={cat}
            active={filter === cat}
            onClick={() => setFilter(cat)}
            label={CATEGORY_LABEL[cat]}
            count={counts[cat]}
          />
        ))}
      </div>

      {/* Results count */}
      <p className="mt-8 font-sans text-xs uppercase tracking-[0.2em] text-ink-muted">
        Showing {filtered.length} of {PROJECTS.length} projects
      </p>

      {/* Grid */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <Link
            key={p.slug}
            href={`/projects/${p.slug}`}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink/20 bg-beige-card p-6 transition-all hover:border-sage hover:shadow-lg hover:shadow-ink/5"
          >
            <div
              aria-hidden="true"
              className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-sage-soft/25 blur-2xl"
            />

            <div className="relative flex items-center justify-between">
              <div className="flex flex-wrap gap-1.5">
                {p.categories.slice(0, 2).map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center rounded-full bg-ink/5 px-2 py-0.5 font-sans text-[10px] font-medium uppercase tracking-widest text-ink-muted"
                  >
                    {CATEGORY_LABEL[c]}
                  </span>
                ))}
              </div>
              <span className="font-sans text-xs text-ink-muted tabular">
                {p.year}
              </span>
            </div>

            <h2 className="relative mt-5 font-satoshi text-xl md:text-2xl text-ink tracking-tighter leading-tight">
              {p.title}
            </h2>

            <p className="relative mt-3 flex-1 font-sans text-sm text-ink-muted line-clamp-3">
              {p.subtitle}
            </p>

            <div className="relative mt-5 flex items-end justify-between gap-4 border-t border-ink/20 pt-3">
              <p className="font-sans text-xs text-ink-muted">{p.client}</p>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-beige-card transition-all group-hover:bg-terracotta">
                <svg
                  className="h-3 w-3"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 11L11 3m0 0H5m6 0v6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 text-center font-sans text-sm text-ink-muted">
          No projects in this category yet.
        </p>
      )}
    </section>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 font-sans text-sm transition-colors",
        active
          ? "border-ink bg-ink text-beige-card"
          : "border-ink/25 bg-beige-card text-ink hover:border-sage hover:text-sage",
      )}
    >
      {label}
      <span
        className={cn(
          "rounded-full px-1.5 py-0.5 font-sans text-[10px] tabular",
          active ? "bg-beige-card/20" : "bg-ink/5",
        )}
      >
        {count}
      </span>
    </button>
  );
}
