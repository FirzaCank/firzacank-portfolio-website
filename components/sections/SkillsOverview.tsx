import { SKILL_GROUPS } from "@/data/about";

export default function SkillsOverview() {
  return (
    <section className="border-y border-ink/20 bg-beige-deep/30">
      <div className="mx-auto max-w-container px-6 md:px-10 py-20 md:py-section">
        <div className="flex items-center gap-3">
          <span className="h-px w-10 bg-sage" />
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-sage">
            Tech Stack
          </p>
        </div>
        <h2 className="mt-6 max-w-2xl font-display text-4xl md:text-5xl font-extrabold text-ink tracking-tighter">
          The tools I reach for.
        </h2>

        <div className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {SKILL_GROUPS.map((g) => (
            <div key={g.group}>
              <p className="font-sans text-xs uppercase tracking-[0.2em] text-ink-muted">
                {g.group}
              </p>
              <ul className="mt-3 flex flex-wrap gap-x-2 gap-y-1">
                {g.items.map((item) => (
                  <li
                    key={item}
                    className="font-sans text-sm text-ink"
                  >
                    {item}
                    <span className="ml-2 text-ink/25">·</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
