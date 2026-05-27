import { EDUCATION, CERTIFICATIONS, LANGUAGES } from "@/data/about";

export default function EducationLanguages() {
  return (
    <section className="border-t border-ink/20 bg-beige-deep/30">
      <div className="mx-auto max-w-container px-6 md:px-10 py-20 md:py-section">
        <div className="grid gap-14 md:grid-cols-2">
          {/* Education + Certs */}
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-sage" />
              <p className="font-sans text-xs uppercase tracking-[0.2em] text-sage">
                Education
              </p>
            </div>
            <h2 className="mt-6 font-display text-3xl md:text-4xl text-ink tracking-tighter">
              Foundations.
            </h2>

            <div className="mt-8 space-y-6">
              {EDUCATION.map((e) => (
                <div key={e.institution} className="border-l-2 border-sage/60 pl-5">
                  <p className="font-display text-xl text-ink tracking-tighter">
                    {e.institution}
                  </p>
                  <p className="mt-1 font-sans text-sm text-ink">{e.degree}</p>
                  {e.detail && (
                    <p className="mt-2 font-sans text-sm text-ink-muted">
                      {e.detail}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-12 border-t border-ink/20 pt-8">
              <h3 className="font-display text-2xl text-ink tracking-tighter">
                Continuing education
              </h3>
              <p className="mt-1 font-sans text-sm text-ink-muted">
                Self-directed courses and certifications.
              </p>
              <ul className="mt-6 space-y-3">
                {CERTIFICATIONS.map((c) => (
                  <li
                    key={c.name}
                    className="flex flex-col gap-1 border-t border-ink/20 pt-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                  >
                    <span className="font-sans text-sm text-ink">
                      {c.name}
                    </span>
                    <span className="font-sans text-xs text-ink-muted">
                      {c.issuer}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Languages */}
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-sage" />
              <p className="font-sans text-xs uppercase tracking-[0.2em] text-sage">
                Languages
              </p>
            </div>
            <h2 className="mt-6 font-display text-3xl md:text-4xl text-ink tracking-tighter">
              How I communicate.
            </h2>

            <ul className="mt-8 space-y-3">
              {LANGUAGES.map((l) => (
                <li
                  key={l.name}
                  className="flex items-baseline justify-between gap-6 border-b border-ink/20 pb-3"
                >
                  <span className="font-display text-xl text-ink">
                    {l.name}
                  </span>
                  <span className="font-sans text-sm text-ink-muted">
                    {l.level}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
