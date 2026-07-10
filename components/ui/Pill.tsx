export default function Pill({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: "sage" | "muted";
}) {
  const cls =
    variant === "sage"
      ? "bg-sage text-beige-card"
      : "bg-ink/10 text-ink-muted";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-sans text-[10px] font-medium uppercase tracking-widest relative -translate-y-[1px] md:-translate-y-[2px] ${cls}`}
    >
      {children}
    </span>
  );
}
