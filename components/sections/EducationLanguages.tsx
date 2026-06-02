import { EDUCATION, CERTIFICATIONS, LANGUAGES } from "@/data/about";

export default function EducationLanguages() {
  return (
    <section className="border-t border-ink/20 bg-beige-deep/30">
      <div className="mx-auto max-w-container px-6 md:px-10 py-20 md:py-section space-y-16">
        {/* Row 1: Education (Full width, max-w-3xl for optimal line readability) */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-sage" />
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-sage">
              Foundation
            </p>
          </div>
          <h2 className="mt-6 font-display text-3xl md:text-4xl text-ink tracking-tighter">
            Education.
          </h2>

          <div className="mt-8 space-y-6">
            {EDUCATION.map((e) => (
              <div key={e.institution} className="border-l-2 border-sage/60 pl-5 space-y-4">
                <div>
                  <p className="font-display text-xl text-ink tracking-tighter">
                    {e.institution}
                  </p>
                </div>
                <div>
                  <p className="font-sans text-sm font-semibold text-ink">
                    {e.degree}
                  </p>
                </div>
                <div>
                  <p className="font-sans text-sm text-ink-muted">
                    {e.faculty}
                  </p>
                </div>
                {e.detail && (
                  <div>
                    <p className="font-sans text-sm text-ink-muted leading-relaxed">
                      {e.detail}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Course & Cert (Col 1) and Languages (Col 2) */}
        <div className="grid gap-10 lg:gap-14 grid-cols-1 lg:grid-cols-2 pt-16 border-t border-ink/10">
          {/* Column 1: Course & Certification */}
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-sage" />
              <p className="font-sans text-xs uppercase tracking-[0.2em] text-sage">
                Certification
              </p>
            </div>
            <h2 className="mt-6 font-display text-3xl md:text-4xl text-ink tracking-tighter">
              Course &amp; Certification.
            </h2>
            <p className="mt-2 font-sans text-sm text-ink-muted">
              Self-directed courses and certifications.
            </p>
            
            <ul className="mt-8 space-y-3">
              {CERTIFICATIONS.map((c) => (
                <li
                  key={c.name}
                  className="flex flex-col gap-1 border-b border-ink/15 pb-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                >
                  <span className="font-sans text-sm text-ink">
                    {c.name}
                  </span>
                  <span className="font-sans text-xs text-ink-muted shrink-0">
                    {c.issuer}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Languages */}
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
