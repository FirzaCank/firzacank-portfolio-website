import { BIO_PARAGRAPHS } from "@/data/about";
import { CV_URL, CV_URL_JA } from "@/data/nav";

export default function AboutIntro() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-24 h-[420px] w-[420px] rounded-full bg-sage-soft/30 blur-3xl"
      />

      <div className="mx-auto max-w-container px-6 md:px-10 pt-12 md:pt-20 pb-16">
        <div className="flex items-center gap-3">
          <span className="h-px w-10 bg-sage" />
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-sage">
            About
          </p>
        </div>

        <h1 className="mt-6 font-satoshi text-5xl md:text-7xl font-extrabold tracking-tightest text-ink leading-[1.05]">
          Building data systems
          <br />
          that ship outcomes.
        </h1>

        <div className="mt-10 grid gap-10 md:grid-cols-[2fr_1fr] md:gap-16">
          <div className="space-y-5 max-w-prose">
            {BIO_PARAGRAPHS.map((p, i) => (
              <p
                key={i}
                className="font-sans text-base md:text-lg text-ink-muted leading-[1.75]"
                dangerouslySetInnerHTML={{ __html: p }}
              />
            ))}
          </div>

          <aside className="md:pt-2">
            <div className="rounded-2xl border border-ink/20 bg-beige-card p-6">
              <p className="font-sans text-xs uppercase tracking-[0.2em] text-ink-muted">
                Based in
              </p>
              <p className="mt-2 font-display text-2xl text-ink">
                Jakarta, Indonesia
              </p>

              <div className="mt-6 h-px bg-ink/20" />

              <p className="mt-6 font-sans text-xs uppercase tracking-[0.2em] text-ink-muted">
                Currently
              </p>
              <p className="mt-2 font-sans text-sm text-ink">
                Data Engineer @ Hypefast
              </p>

              <a
                href={CV_URL}
                download
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-terracotta px-5 py-2.5 font-sans text-sm font-medium text-beige-card transition-colors hover:bg-terracotta-deep"
              >
                Download CV (EN)
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

              <a
                href={CV_URL_JA}
                download
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full border border-ink/25 bg-beige px-5 py-2.5 font-sans text-sm font-medium text-ink transition-colors hover:border-sage hover:text-sage"
              >
                履歴書 (JP, Excel)
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
          </aside>
        </div>
      </div>
    </section>
  );
}
