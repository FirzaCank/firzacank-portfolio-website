import Link from "next/link";
import { ROLES } from "@/data/experience";
import Pill from "@/components/ui/Pill";

export default function FeaturedExperience() {
  return (
    <section className="mx-auto max-w-container px-6 md:px-10 py-20 md:py-section">
      <div className="grid gap-12 md:grid-cols-[1fr_2.5fr] md:gap-16">
        {/* Left: section heading */}
        <div className="md:sticky md:top-28 md:self-start">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-sage" />
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-sage">
              Experience
            </p>
          </div>
          <h2 className="mt-6 font-satoshi text-4xl md:text-5xl font-extrabold text-ink tracking-tighter">
            Where I&rsquo;ve built.
          </h2>
          <p className="mt-4 max-w-sm font-sans text-base text-ink-muted">
            Telco, consumer aggregator, and digital products. ~4 years of
            production systems with proven revenue impact.
          </p>
          <Link
            href="/experience"
            className="mt-6 inline-flex items-center gap-2 font-sans text-sm font-medium text-terracotta hover:text-terracotta-deep"
          >
            Read full timeline and contributions
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

        {/* Right: role list */}
        <ol className="space-y-px">
          {ROLES.map((role) => (
            <li
              key={role.id}
              className="group border-t border-ink/25 last:border-b px-4 md:px-6 py-6 transition-all hover:bg-beige-card hover:rounded-xl"
            >
              <Link
                href={`/experience#${role.id}`}
                className="block"
                aria-label={`${role.title} at ${role.company}`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                  <div className="flex flex-wrap items-end gap-3">
                    <h3 className="font-satoshi text-2xl md:text-3xl text-ink tracking-tighter">
                      {role.company}
                      {role.placement && (
                        <span className="font-display text-lg md:text-xl text-ink-muted font-bold tracking-tighter ml-2">({role.placement})</span>
                      )}
                    </h3>
                    {role.current && <span className="mb-1"><Pill variant="sage">Current</Pill></span>}
                    {role.internship && <span className="mb-1"><Pill variant="muted">Internship</Pill></span>}
                  </div>
                  <p className="font-sans text-sm text-ink-muted">
                    {role.period}
                  </p>
                </div>
                <p className="mt-2 font-sans text-base text-ink">
                  {role.title}
                </p>
                <p className="mt-3 max-w-2xl font-sans text-sm text-ink-muted">
                  {role.summary}
                </p>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
