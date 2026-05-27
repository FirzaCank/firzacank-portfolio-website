import Link from "next/link";
import type { CaseStudyFrontmatter } from "@/lib/mdx";
import { CATEGORY_LABEL, PROJECTS } from "@/data/projects";

export default function CaseStudyHeader({
  fm,
}: {
  fm: CaseStudyFrontmatter;
}) {
  const project = PROJECTS.find((p) => p.slug === fm.slug);

  return (
    <header className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-20 h-[420px] w-[420px] rounded-full bg-sage-soft/30 blur-3xl"
      />

      <div className="mx-auto max-w-container px-6 md:px-10 pt-10 md:pt-16 pb-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="font-sans text-xs text-ink-muted">
          <Link href="/projects" className="hover:text-sage transition-colors">
            Projects
          </Link>
          <span className="mx-2 text-ink/30">/</span>
          <span className="text-ink">{fm.title}</span>
        </nav>

        {/* Categories */}
        {project && (
          <div className="mt-8 flex flex-wrap gap-2">
            {project.categories.map((c) => (
              <span
                key={c}
                className="inline-flex items-center rounded-full bg-ink/5 px-2.5 py-0.5 font-sans text-[10px] font-medium uppercase tracking-widest text-ink-muted"
              >
                {CATEGORY_LABEL[c]}
              </span>
            ))}
          </div>
        )}

        <h1 className="mt-6 max-w-4xl font-display text-4xl md:text-6xl font-extrabold tracking-tightest text-ink leading-[1.05]">
          {fm.title}
        </h1>

        {fm.subtitle && (
          <p className="mt-6 max-w-prose font-sans text-lg text-ink-muted leading-[1.7]">
            {fm.subtitle}
          </p>
        )}

        {fm.liveUrl && (
          <div className="mt-8">
            <a
              href={fm.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-sage px-6 py-3 font-sans text-sm font-medium text-beige-card transition-colors hover:bg-sage-deep"
            >
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-beige-card"
              />
              {fm.liveLabel ?? "View live dashboard"}
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
            </a>
          </div>
        )}

        {/* Meta grid */}
        <dl className="mt-12 grid gap-x-12 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {fm.client && <MetaItem label="Client" value={fm.client} />}
          {fm.role && <MetaItem label="Role" value={fm.role} />}
          {fm.year && <MetaItem label="Year" value={fm.year} />}
          {fm.duration && <MetaItem label="Duration" value={fm.duration} />}
        </dl>

        {fm.stack && fm.stack.length > 0 && (
          <div className="mt-8 border-t border-ink/20 pt-6">
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-sage">
              Stack
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {fm.stack.map((s) => (
                <li
                  key={s}
                  className="inline-flex items-center rounded-md bg-ink/5 px-2.5 py-1 font-sans text-[11px] text-ink-muted"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-sans text-xs uppercase tracking-[0.2em] text-ink-muted">
        {label}
      </dt>
      <dd className="mt-1 font-sans text-sm text-ink">{value}</dd>
    </div>
  );
}
