import Link from "next/link";
import { PROJECTS } from "@/data/projects";

export default function CaseStudyNav({ currentSlug }: { currentSlug: string }) {
  const idx = PROJECTS.findIndex((p) => p.slug === currentSlug);
  if (idx === -1) return null;

  const prev = idx > 0 ? PROJECTS[idx - 1] : null;
  const next = idx < PROJECTS.length - 1 ? PROJECTS[idx + 1] : null;

  return (
    <section className="border-t border-ink/20">
      <div className="mx-auto max-w-container px-6 md:px-10 py-12 grid gap-6 md:grid-cols-2">
        {prev ? (
          <Link
            href={`/projects/${prev.slug}`}
            className="group rounded-xl border border-ink/20 bg-beige-card p-6 transition-all hover:border-sage"
          >
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-ink-muted">
              Previous
            </p>
            <p className="mt-2 font-display text-lg md:text-xl text-ink group-hover:text-sage transition-colors">
              {prev.title}
            </p>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/projects/${next.slug}`}
            className="group rounded-xl border border-ink/20 bg-beige-card p-6 text-right transition-all hover:border-sage"
          >
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-ink-muted">
              Next
            </p>
            <p className="mt-2 font-display text-lg md:text-xl text-ink group-hover:text-sage transition-colors">
              {next.title}
            </p>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </section>
  );
}
