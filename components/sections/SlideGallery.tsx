"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";

export type SlideGalleryProps = {
  /** Slug used to locate slides under /public/decks/{slug}/slide-XX.png */
  slug?: string;
  /** Slide numbers to display (matches filename suffix, e.g. 2 → slide-02.png) */
  slides?: number[];
  /** Explicit image paths (overrides slug/slides when provided) */
  images?: string[];
  /** Filename of the downloadable PDF inside /public/decks/{slug}/ */
  pdfFile?: string;
  /** Label for the download button */
  pdfLabel?: string;
  /** Heading above the gallery */
  title?: string;
  /** Small label above the heading */
  eyebrow?: string;
};

export default function SlideGallery({
  slug,
  slides,
  images,
  pdfFile,
  pdfLabel = "Download deck (PDF)",
  title = "From the deck",
  eyebrow = "Deliverable",
}: SlideGalleryProps) {
  const [active, setActive] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const lightboxRef = useRef<HTMLDivElement | null>(null);

  const items = useMemo(() => {
    return images
      ? images.map((_, i) => i + 1)
      : slides ?? [];
  }, [images, slides]);
  const basePath = slug ? `/decks/${slug}` : "";

  const slidePath = (n: number) =>
    images
      ? images[n - 1]
      : `${basePath}/slide-${String(n).padStart(2, "0")}.png`;

  const close = useCallback(() => setActive(null), []);
  const nextSlide = useCallback(() => {
    if (active === null) return;
    const i = items.indexOf(active);
    setActive(items[(i + 1) % items.length]);
  }, [active, items]);
  const prevSlide = useCallback(() => {
    if (active === null) return;
    const i = items.indexOf(active);
    setActive(items[(i - 1 + items.length) % items.length]);
  }, [active, items]);

  const toggleFullscreen = useCallback(async () => {
    const el = lightboxRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Browser may block; ignore
    }
  }, []);

  // Sync isFullscreen with actual API state
  useEffect(() => {
    const onChange = () =>
      setIsFullscreen(document.fullscreenElement === lightboxRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !document.fullscreenElement) close();
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key.toLowerCase() === "f") {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      // Exit fullscreen when closing lightbox
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, [active, close, nextSlide, prevSlide, toggleFullscreen]);

  return (
    <section
      aria-label={title}
      className="mx-auto max-w-container px-6 md:px-10 py-12 md:py-16 border-t border-ink/20"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-sage">
            {eyebrow}
          </p>
          <h2 className="mt-2 font-display text-3xl md:text-4xl text-ink tracking-tighter">
            {title}
          </h2>
        </div>
        {pdfFile && (
          <a
            href={`${basePath}/${pdfFile}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-terracotta px-5 py-2.5 font-sans text-sm font-medium text-terracotta transition-colors hover:bg-terracotta hover:text-beige-card"
          >
            {pdfLabel}
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M7 2v8m0 0L4 7m3 3l3-3M2 12h10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        )}
      </div>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((n) => (
          <li key={n}>
            <button
              type="button"
              onClick={() => setActive(n)}
              className="group relative block aspect-video w-full overflow-hidden rounded-xl border border-ink/20 bg-beige-card transition-all hover:border-sage hover:shadow-lg hover:shadow-ink/5"
              aria-label={`Open slide ${n}`}
            >
              <Image
                src={slidePath(n)}
                alt={`Slide ${n}`}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform group-hover:scale-[1.02]"
              />
            </button>
          </li>
        ))}
      </ul>

      {/* Lightbox */}
      {active !== null && (
        <div
          ref={lightboxRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Slide ${active} preview`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95"
          onClick={close}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-ink/60 text-beige-card backdrop-blur transition-colors hover:bg-ink/80"
          >
            <svg className="h-5 w-5" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M9 2L4 7l5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-ink/60 text-beige-card backdrop-blur transition-colors hover:bg-ink/80"
          >
            <svg className="h-5 w-5" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M5 2l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Top-right control cluster */}
          <div className="absolute right-4 top-4 z-10 flex gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleFullscreen();
              }}
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              title={isFullscreen ? "Exit fullscreen (F)" : "Fullscreen (F)"}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-ink/60 text-beige-card backdrop-blur transition-colors hover:bg-ink/80"
            >
              {isFullscreen ? (
                <svg className="h-5 w-5" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path
                    d="M5 1v4H1M9 1v4h4M5 13V9H1M9 13V9h4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path
                    d="M1 5V1h4M13 5V1H9M1 9v4h4M13 9v4H9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                close();
              }}
              aria-label="Close preview"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-ink/60 text-beige-card backdrop-blur transition-colors hover:bg-ink/80"
            >
              <svg className="h-5 w-5" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M3 3l8 8M11 3l-8 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Slide counter */}
          <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-ink/60 px-3 py-1 font-sans text-xs text-beige-card backdrop-blur">
            {items.indexOf(active) + 1} / {items.length}
          </div>

          {/* Image fills viewport, contained */}
          <div
            className="relative h-full w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={slidePath(active)}
              alt={`Slide ${active}`}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}
    </section>
  );
}
