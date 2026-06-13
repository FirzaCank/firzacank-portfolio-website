// Impact metrics distilled from CV bullets. Numbers anchor the "what I do" claim.

const METRICS = [
  {
    value: "1B+",
    label: "Daily records processed",
    detail: "PySpark medallion architecture on Snowflake",
  },
  {
    value: "200x",
    label: "ROI per brand",
    detail: "Smart voucher optimization via K-Means + Linear Programming",
  },
  {
    value: "96x",
    label: "Faster invoice extraction",
    detail: "From 8 hours to 5 minutes with Document AI",
  },
  {
    value: "IDR 300M",
    label: "Monthly GMV driven",
    detail: "Marketplace recommendation systems",
  },
];

export default function Snapshot() {
  return (
    <section className="border-y border-ink/20 bg-sage-soft/15">
      <div className="mx-auto max-w-container px-6 md:px-10 py-16 md:py-20">
        <div className="flex items-center gap-3">
          <span className="h-px w-10 bg-sage" />
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-sage">
            Impact at a glance
          </p>
        </div>
        <h2 className="mt-6 max-w-2xl font-satoshi text-3xl md:text-4xl text-ink tracking-tighter">
          Engineered for Production Impact.
        </h2>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {METRICS.map((m) => (
            <div key={m.label} className="border-l-2 border-sage pl-5">
              <p className="font-display text-4xl md:text-5xl text-ink tracking-tighter leading-none">
                {m.value}
              </p>
              <p className="mt-3 font-sans text-sm font-medium text-ink">
                {m.label}
              </p>
              <p className="mt-1 font-sans text-xs text-ink-muted leading-snug">
                {m.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
