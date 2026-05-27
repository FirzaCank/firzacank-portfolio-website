import { LEADERSHIP } from "@/data/about";

export default function Leadership() {
  return (
    <section className="mx-auto max-w-container px-6 md:px-10 py-20 md:py-section">
      <div className="grid gap-12 md:grid-cols-[1fr_2fr] md:gap-16">
        <div className="md:sticky md:top-28 md:self-start">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-sage" />
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-sage">
              Leadership
            </p>
          </div>
          <h2 className="mt-6 font-display text-4xl md:text-5xl font-extrabold text-ink tracking-tighter">
            Beyond the code.
          </h2>
          <p className="mt-4 max-w-sm font-sans text-base text-ink-muted">
            Student organization leadership during my time at ITB. Operations,
            people, partnerships.
          </p>
        </div>

        <div className="space-y-10">
          {LEADERSHIP.map((l) => (
            <article
              key={l.organization}
              className="border-l-2 border-sage pl-6"
            >
              <h3 className="font-display text-2xl md:text-3xl text-ink tracking-tighter">
                {l.organization}
              </h3>
              <p className="mt-1 font-sans text-sm text-ink-muted italic">
                {l.context}
              </p>
              <p className="mt-3 font-sans text-base text-ink font-medium">
                {l.role}
              </p>
              <ul className="mt-4 space-y-3">
                {l.highlights.map((h, i) => (
                  <li
                    key={i}
                    className="font-sans text-sm text-ink-muted leading-relaxed"
                  >
                    {h}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
