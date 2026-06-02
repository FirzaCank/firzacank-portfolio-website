import { ACHIEVEMENTS } from "@/data/about";

export default function Achievements() {
  return (
    <section className="mx-auto max-w-container px-6 md:px-10 py-20 md:py-section border-t border-ink/20">
      <div className="grid gap-12 md:grid-cols-[1fr_2fr] md:gap-16">
        <div className="md:sticky md:top-28 md:self-start">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-sage" />
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-sage">
              Achievements
            </p>
          </div>
          <h2 className="mt-6 font-display text-4xl md:text-5xl font-extrabold text-ink tracking-tighter">
            Accolades &amp; honors.
          </h2>
          <p className="mt-4 max-w-sm font-sans text-base text-ink-muted">
            National competitions and competitive scholarships.
          </p>
        </div>

        <div className="space-y-10">
          {ACHIEVEMENTS.map((a, i) => (
            <article
              key={i}
              className="border-l-2 border-sage pl-6"
            >
              <h3 className="font-display text-2xl md:text-3xl text-ink tracking-tighter">
                {a.title}
              </h3>
              <p className="mt-1 font-sans text-sm text-ink-muted italic">
                {a.context}
              </p>
              <p className="mt-3 font-sans text-base text-ink font-medium">
                {a.issuer}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
