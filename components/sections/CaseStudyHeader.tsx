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

        <h1 className="mt-6 max-w-4xl font-satoshi text-4xl md:text-6xl font-extrabold tracking-tightest text-ink leading-[1.05]">
          {fm.title}
        </h1>

        {fm.subtitle && (
          <p className="mt-6 max-w-prose font-sans text-lg text-ink-muted leading-[1.7]">
            {fm.subtitle}
          </p>
        )}

        {(fm.liveUrl || fm.githubUrl) && (
          <div className="mt-8 flex flex-wrap gap-3">
            {fm.liveUrl && (
              <a
                href={fm.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-sage px-6 py-3 font-sans text-sm font-medium text-beige-card transition-colors hover:bg-sage-deep"
              >
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-beige-card" />
                {fm.liveLabel ?? "View live dashboard"}
                <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M3 11L11 3m0 0H5m6 0v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            )}
            {fm.githubUrl && (
              <a
                href={fm.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-ink/25 px-6 py-3 font-sans text-sm font-medium text-ink transition-colors hover:border-sage hover:text-sage"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                GitHub
                <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M3 11L11 3m0 0H5m6 0v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            )}
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
