import Link from "next/link";
import { SOCIAL_LINKS } from "@/data/nav";

export default function CTA() {
  return (
    <section className="mx-auto max-w-container px-6 md:px-10 py-20 md:py-section">
      <div className="relative overflow-hidden rounded-3xl bg-ink p-10 md:p-16">
        {/* Decorative shapes */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sage/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-terracotta/20 blur-3xl"
        />

        <div className="relative grid gap-10 md:grid-cols-[2fr_1fr] md:items-center">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-sage-soft" />
              <p className="font-sans text-xs uppercase tracking-[0.2em] text-sage-soft">
                Let&rsquo;s talk
              </p>
            </div>
            <h2 className="mt-6 font-display text-4xl md:text-5xl font-extrabold text-beige-card tracking-tighter">
              Need to streamline workflows with automated pipelines or unlock data-driven insights that win your next pitch deck?
            </h2>
            <p className="mt-4 max-w-lg font-sans text-base text-beige-card/80">
              Open for consulting work in data engineering,
              analytics (pitch deck/dashboard/Excel/Sheets), data science, machine learning, MLOps, and AI engineering.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-terracotta px-6 py-3 font-sans text-sm font-medium text-beige-card transition-colors hover:bg-terracotta-deep"
            >
              Start a conversation
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
            <a
              href={`mailto:${SOCIAL_LINKS.email}`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-beige-card/30 px-6 py-3 font-sans text-sm font-medium text-beige-card transition-colors hover:bg-beige-card/10"
            >
              {SOCIAL_LINKS.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
