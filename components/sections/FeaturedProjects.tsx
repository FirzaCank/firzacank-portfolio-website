import Link from "next/link";
import { FEATURED_PROJECTS, PROJECTS, CATEGORY_LABEL } from "@/data/projects";

export default function FeaturedProjects() {
  return (
    <section className="border-t border-ink/20 bg-beige-deep/30">
      <div className="mx-auto max-w-container px-6 md:px-10 py-20 md:py-section">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-sage" />
              <p className="font-sans text-xs uppercase tracking-[0.2em] text-sage">
                Selected Projects
              </p>
            </div>
            <h2 className="mt-6 max-w-2xl font-satoshi text-4xl md:text-5xl font-extrabold text-ink tracking-tighter">
              Project highlights where I have delivered impact.
            </h2>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 font-sans text-sm font-medium text-terracotta hover:text-terracotta-deep"
          >
            All {PROJECTS.length} projects
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {FEATURED_PROJECTS.map((p) => (
            <Link
              key={p.slug}
              href={`/projects/${p.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink/20 bg-beige-card p-7 transition-all hover:border-sage hover:shadow-lg hover:shadow-ink/5"
            >
              {/* Decorative gradient */}
              <div
                aria-hidden="true"
                className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-sage-soft/30 blur-2xl transition-opacity group-hover:opacity-100"
              />

              {/* Categories */}
              <div className="relative flex flex-wrap gap-2">
                {p.categories.slice(0, 2).map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center rounded-full bg-ink/5 px-2.5 py-0.5 font-sans text-[10px] font-medium uppercase tracking-widest text-ink-muted"
                  >
                    {CATEGORY_LABEL[c]}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h3 className="relative mt-5 font-satoshi text-2xl md:text-3xl text-ink tracking-tighter leading-tight">
                {p.title}
              </h3>

              <p className="relative mt-3 font-sans text-sm text-ink-muted">
                {p.subtitle}
              </p>

              {/* Bottom row: stack + arrow */}
              <div className="relative mt-6 flex items-end justify-between gap-4 pt-4 border-t border-ink/20">
                <div className="flex flex-wrap gap-1.5">
                  {p.stack.slice(0, 4).map((s) => (
                    <span
                      key={s}
                      className="font-sans text-[11px] text-ink-muted"
                    >
                      {s}
                      <span className="ml-1.5 text-ink/20">·</span>
                    </span>
                  ))}
                </div>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-beige-card transition-all group-hover:bg-terracotta">
                  <svg
                    className="h-3.5 w-3.5"
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
      </div>
    </section>
  );
}
