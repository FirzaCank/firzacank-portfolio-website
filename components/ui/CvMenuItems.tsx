import { CV_URL, CV_URL_JA } from "@/data/nav";

// Shared body of the "Download CV" dropdown (Nav and Hero render their own
// trigger + positioning around it).
export default function CvMenuItems({ onSelect }: { onSelect?: () => void }) {
  return (
    <div className="rounded-lg border border-ink/20 bg-beige-card shadow-lg shadow-ink/5 p-2">
      <a
        href={CV_URL}
        download
        onClick={onSelect}
        className="flex items-center justify-between rounded-md px-3 py-2 transition-colors hover:bg-beige"
      >
        <div>
          <span className="block font-sans text-sm font-medium text-ink">English</span>
          <span className="block font-sans text-xs text-ink-muted mt-0.5">PDF</span>
        </div>
        <span className="font-sans text-[10px] uppercase tracking-widest text-sage">EN</span>
      </a>
      <div className="my-1 h-px bg-ink/10" />
      <a
        href={CV_URL_JA}
        download
        onClick={onSelect}
        className="flex items-center justify-between rounded-md px-3 py-2 transition-colors hover:bg-beige"
      >
        <div>
          <span className="block font-sans text-sm font-medium text-ink">日本語 (履歴書)</span>
          <span className="block font-sans text-xs text-ink-muted mt-0.5">Excel</span>
        </div>
        <span className="font-sans text-[10px] uppercase tracking-widest text-sage">JP</span>
      </a>
    </div>
  );
}
