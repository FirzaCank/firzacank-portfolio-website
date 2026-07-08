import { ROLES } from "@/data/experience";

export default function ExperienceIntro() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-container px-6 md:px-10 pt-12 md:pt-20 pb-12 md:pb-16">
        <div className="flex items-center gap-3">
          <span className="h-px w-10 bg-sage" />
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-sage">
            Work Experience
          </p>
        </div>

        <h1 className="mt-6 max-w-4xl font-satoshi text-5xl md:text-7xl font-extrabold tracking-tightest text-ink leading-[1.05]">
          Real Production
          <br />
          Professional Work Experience.
        </h1>

        <p className="mt-8 max-w-prose font-sans text-lg text-ink-muted leading-[1.75]">
          From telco-scale ETL pipelines processing 1B+ daily records, build automation services, MLOps platforms, to end-to-end machine learning pipelines and
          recommendation systems driving real GMV.
        </p>

        {/* Quick jump nav */}
        <nav
          aria-label="Jump to role"
          className="mt-10 flex flex-wrap gap-2"
        >
          {ROLES.map((r) => (
            <a
              key={r.id}
              href={`#${r.id}`}
              className="group inline-flex items-center gap-2 rounded-full border-2 border-sage/40 bg-beige-card px-4 py-1.5 font-sans text-xs text-ink shadow-sm shadow-ink/5 transition-all hover:border-sage hover:bg-sage hover:text-beige-card hover:shadow-md"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-sage group-hover:bg-beige-card" />
              {r.company.replace("PT ", "").split(" ")[0]}
              {r.placement && (
                <span className="text-ink-muted group-hover:text-beige-card/80">
                  @ {r.placement.replace(/^Placement in PT |\sTbk\.$/g, "")}
                </span>
              )}
              {!r.internship && (
                <span className="text-ink-muted group-hover:text-beige-card/80">· Full Time</span>
              )}
              {r.internship && (
                <span className="text-ink-muted group-hover:text-beige-card/80">· Internship</span>
              )}
              {r.current && (
                <span className="ml-1 rounded-full bg-sage px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-beige-card group-hover:bg-beige-card group-hover:text-sage">
                  Current
                </span>
              )}
              <svg
                className="ml-1 h-3 w-3 text-sage transition-transform group-hover:translate-y-0.5 group-hover:text-beige-card"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3 4.5L6 7.5L9 4.5"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}
