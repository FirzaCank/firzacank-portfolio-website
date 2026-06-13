import { PROJECTS } from "@/data/projects";

export default function ProjectsIntro() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-20 h-[420px] w-[420px] rounded-full bg-sage-soft/30 blur-3xl"
      />

      <div className="mx-auto max-w-container px-6 md:px-10 pt-12 md:pt-20 pb-8 md:pb-12">
        <div className="flex items-center gap-3">
          <span className="h-px w-10 bg-sage" />
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-sage">
            Projects
          </p>
        </div>

        <h1 className="mt-6 max-w-4xl font-satoshi text-5xl md:text-7xl font-extrabold tracking-tightest text-ink leading-[1.05]">
          {PROJECTS.length} Project Highlights
        </h1>

        <p className="mt-8 max-w-prose font-sans text-lg text-ink-muted leading-[1.75]">
          Selected work across data analysis, dashboards, pitch decks, and AI
          engineering.
        </p>

        <div className="mt-6 flex items-center gap-2.5">
          <p className="font-sans text-sm italic text-ink-muted">
            Use search bar or filters below to narrow by words or category
          </p>
          <ArrowDown />
        </div>
      </div>
    </section>
  );
}

function ArrowDown() {
  return (
    <svg
      className="h-4 w-4 text-sage animate-bounce"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8 3v10m0 0l-4-4m4 4l4-4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
