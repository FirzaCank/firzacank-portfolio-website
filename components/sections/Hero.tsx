"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { CV_URL, CV_URL_JA, SOCIAL_LINKS } from "@/data/nav";
import { PROJECTS } from "@/data/projects";

export default function Hero() {
  const [cvOpen, setCvOpen] = useState(false);
  return (
    <section className="relative overflow-hidden">
      {/* Decorative sage shape */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-24 h-[520px] w-[520px] rounded-full bg-sage-soft/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -left-20 h-[280px] w-[280px] rounded-full bg-terracotta/10 blur-3xl"
      />

      <div className="mx-auto max-w-container px-6 md:px-10 pt-12 md:pt-20">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <span className="h-px w-10 bg-sage" />
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-sage">
            Data, Analytics, ML &amp; AI Engineer
          </p>
        </motion.div>

        <div className="mt-8 grid items-stretch gap-10 md:grid-cols-[1.1fr_1fr] md:gap-16">
          {/* Left: Display heading + intro */}
          <div className="relative pb-16 md:pb-24">
            {/* Stats above heading like the reference */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-wrap gap-8"
            >
              <StatBadge value="+4 yrs" label="Engineering experience" />
              <StatBadge value={`+${PROJECTS.length}`} label="Projects delivered" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="mt-10 font-display text-2xl md:text-3xl font-light text-ink-muted tracking-tight"
            >
              Hello, it&rsquo;s
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-2 font-display font-extrabold tracking-tightest text-ink text-7xl sm:text-8xl md:text-[9rem] leading-[0.9]"
            >
              FIRZA
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6 max-w-prose font-sans text-lg text-ink-muted"
            >
              <span className="text-ink font-medium">Big Data Solution Engineer</span> building production-grade pipelines and AI systems.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-sans text-sm font-medium text-beige-card transition-colors hover:bg-sage"
              >
                View projects
                <Arrow />
              </Link>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCvOpen((v) => !v)}
                  aria-expanded={cvOpen}
                  aria-haspopup="true"
                  className="inline-flex items-center gap-2 rounded-full border border-terracotta px-6 py-3 font-sans text-sm font-medium text-terracotta transition-colors hover:bg-terracotta hover:text-beige-card"
                >
                  Download CV
                  <svg
                    className={`h-3 w-3 transition-transform ${cvOpen ? "rotate-180" : ""}`}
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 4.5L6 7.5L9 4.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {cvOpen && (
                  <div
                    role="menu"
                    className="absolute left-0 top-full pt-2 min-w-[220px] z-10"
                  >
                    <div className="rounded-lg border border-ink/20 bg-beige-card shadow-lg shadow-ink/10 p-2">
                      <a
                        href={CV_URL}
                        download
                        role="menuitem"
                        onClick={() => setCvOpen(false)}
                        className="flex items-center justify-between rounded-md px-3 py-2 transition-colors hover:bg-beige"
                      >
                        <div>
                          <span className="block font-sans text-sm font-medium text-ink">
                            English
                          </span>
                          <span className="block font-sans text-xs text-ink-muted mt-0.5">
                            PDF
                          </span>
                        </div>
                        <span className="font-sans text-[10px] uppercase tracking-widest text-sage">
                          EN
                        </span>
                      </a>
                      <div className="my-1 h-px bg-ink/10" />
                      <a
                        href={CV_URL_JA}
                        download
                        role="menuitem"
                        onClick={() => setCvOpen(false)}
                        className="flex items-center justify-between rounded-md px-3 py-2 transition-colors hover:bg-beige"
                      >
                        <div>
                          <span className="block font-sans text-sm font-medium text-ink">
                            日本語 (履歴書)
                          </span>
                          <span className="block font-sans text-xs text-ink-muted mt-0.5">
                            Excel
                          </span>
                        </div>
                        <span className="font-sans text-[10px] uppercase tracking-widest text-sage">
                          JP
                        </span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Social media logos row */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-10 flex flex-wrap items-center gap-6"
            >
              <SocialIcon label="LinkedIn" href={SOCIAL_LINKS.linkedin}>
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </SocialIcon>

              <SocialIcon label="GitHub" href={SOCIAL_LINKS.github}>
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
              </SocialIcon>

              <SocialIcon label="Email" copyEmail>
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </SocialIcon>

              <SocialIcon label="YouTube" href={SOCIAL_LINKS.youtube}>
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" />
                </svg>
              </SocialIcon>

              <SocialIcon label="Tableau Public" href={SOCIAL_LINKS.tableau}>
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v18M3 12h18M7.5 7.5v9M16.5 7.5v9M3.5 12H7M17 12h3.5M12 4.5v3M12 16.5v3" />
                </svg>
              </SocialIcon>

              <SocialIcon label="Lynk.id" href={SOCIAL_LINKS.lynk}>
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </SocialIcon>

              <SocialIcon label="Fastwork" href={SOCIAL_LINKS.fastwork}>
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M14.5 8.5h-2a2 2 0 0 0-2 2v2H9.5m3 0v5M9.5 12.5h4" />
                </svg>
              </SocialIcon>

              <SocialIcon label="Projects.co.id" href={SOCIAL_LINKS.projectsCoId}>
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.5 8.5h3.5a2.5 2.5 0 0 1 0 5H9.5v4" />
                  <path d="M9.5 13.5h3.5" />
                </svg>
              </SocialIcon>
            </motion.div>

            {/* Scroll cue */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-32 flex items-center gap-3 font-sans text-xs uppercase tracking-widest text-ink-muted"
            >
              <span>Scroll</span>
              <span className="h-px w-12 bg-ink-muted/40" />
            </motion.div>
          </div>

          {/* Right: Portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative flex flex-col justify-end"
          >
            <div className="relative w-full aspect-[3/4]">
              <Image
                src="/images/firza-portrait.png"
                alt="Firza Chandra portrait"
                fill
                priority
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-contain object-bottom"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-2xl text-ink tracking-tighter">{value}</p>
      <p className="mt-1 font-sans text-xs uppercase tracking-widest text-ink-muted">
        {label}
      </p>
    </div>
  );
}

function Arrow() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const EMAIL = "firzasandjaya@gmail.com";

function SocialIcon({
  label,
  href,
  copyEmail,
  children,
}: {
  label: string;
  href?: string;
  copyEmail?: boolean;
  children: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(EMAIL); }
    catch {
      const el = document.createElement("input");
      el.value = EMAIL;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const iconCls = "text-ink-muted hover:text-sage transition-all duration-300 transform hover:scale-110";
  const tooltipCls = "absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded px-2 py-0.5 font-sans text-[11px] text-beige-card bg-ink opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none";

  return (
    <div className="relative group flex flex-col items-center">
      {copyEmail ? (
        <button type="button" onClick={handleCopy} aria-label={label} className={iconCls}>
          {children}
        </button>
      ) : (
        <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={iconCls}>
          {children}
        </a>
      )}
      <span className={tooltipCls}>
        {copyEmail && copied ? "Copied!" : label}
      </span>
    </div>
  );
}

