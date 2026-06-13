import type { Metadata } from "next";
import ContactForm from "@/components/sections/ContactForm";
import EmailCopy from "@/components/sections/EmailCopy";
import { SOCIAL_LINKS } from "@/data/nav";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Hire Firza for freelance data engineering, data analysis, dashboards, pitch decks, and AI/ML engineering. Based in Jakarta (GMT+7), available worldwide.",
  keywords: [
    "hire freelance data engineer",
    "hire data analyst",
    "freelance pitch deck designer",
    "AI engineer for hire",
    "data consultant Jakarta",
    "contact Firza Chandra",
  ],
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | Firza Chandra Sandjaya Putra",
    description:
      "Available for freelance data, dashboard, pitch deck, and AI engineering work. Based in Jakarta (GMT+7).",
    type: "website",
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -right-20 h-[420px] w-[420px] rounded-full bg-sage-soft/30 blur-3xl"
        />
        <div className="mx-auto max-w-container px-6 md:px-10 pt-12 md:pt-20 pb-12 md:pb-16">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-sage" />
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-sage">
              Contact
            </p>
          </div>

          <h1 className="mt-8 max-w-4xl font-satoshi font-extrabold tracking-tightest text-ink text-4xl sm:text-5xl md:text-6xl leading-[1.1]">
            Ready to turn raw data into scalable architecture and AI systems that drive revenue?
          </h1>

          <p className="mt-6 inline-flex items-center gap-3 font-display text-2xl md:text-3xl text-sage tracking-tighter">
            <ArrowRight />
            Let&rsquo;s talk.
          </p>

          <p className="mt-8 max-w-prose font-sans text-lg text-ink-muted leading-[1.7]">
            Open to data analysis, dashboard, pitchdeck, data engineering, data science, machine learning, and AI engineering project inquiries and
            collaborations.
            Drop a message below or reach me directly on the channels on the right.
          </p>

          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-sage/40 bg-sage-soft/15 px-4 py-2">
            <span aria-hidden="true" className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sage opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-sage" />
            </span>
            <span className="font-sans text-xs uppercase tracking-[0.18em] text-ink">
              Open to projects
            </span>
          </div>
        </div>
      </section>

      <section className="border-t border-ink/20 bg-beige-deep/30">
        <div className="mx-auto max-w-container px-6 md:px-10 py-16 md:py-20">
          <div className="grid gap-12 md:grid-cols-[1.3fr_1fr] md:gap-16">
            {/* Left: Form */}
            <div>
              <h2 className="font-satoshi text-3xl md:text-4xl text-ink tracking-tighter">
                Send a message.
              </h2>
              <p className="mt-3 max-w-prose font-sans text-sm text-ink-muted">
                Send a secure message directly to Firza&rsquo;s inbox. If direct sending fails, you can use the failsafe option to copy your draft.
              </p>

              <ContactForm to={SOCIAL_LINKS.email} />
            </div>

            {/* Right: Side panel */}
            <aside className="md:pt-2">
              <div className="rounded-2xl border border-ink/20 bg-beige-card p-7">
                <p className="font-sans text-xs uppercase tracking-[0.2em] text-ink-muted">
                  Direct email
                </p>
                <EmailCopy email={SOCIAL_LINKS.email} />

                <div className="mt-8 h-px bg-ink/20" />

                <p className="mt-8 font-sans text-xs uppercase tracking-[0.2em] text-ink-muted">
                  Profiles
                </p>
                <ul className="mt-4 space-y-2">
                  <SocialRow label="Lynk.id" href={SOCIAL_LINKS.lynk} />
                  <SocialRow label="LinkedIn" href={SOCIAL_LINKS.linkedin} />
                  <SocialRow label="GitHub" href={SOCIAL_LINKS.github} />
                  <SocialRow
                    label="HackerRank"
                    href={SOCIAL_LINKS.hackerrank}
                  />
                  <SocialRow label="YouTube" href={SOCIAL_LINKS.youtube} />
                  <SocialRow label="Fastwork" href={SOCIAL_LINKS.fastwork} />
                  <SocialRow label="Projects.co.id" href={SOCIAL_LINKS.projectsCoId} />
                </ul>

                <div className="mt-8 h-px bg-ink/20" />

                <div className="mt-8 grid grid-cols-2 gap-6">
                  <div>
                    <p className="font-sans text-xs uppercase tracking-[0.2em] text-ink-muted">
                      Based in
                    </p>
                    <p className="mt-2 font-display text-xl text-ink">
                      Jakarta
                    </p>
                    <p className="mt-1 font-sans text-xs text-ink-muted">
                      Indonesia
                    </p>
                  </div>
                  <div>
                    <p className="font-sans text-xs uppercase tracking-[0.2em] text-ink-muted">
                      Timezone
                    </p>
                    <p className="mt-2 font-display text-xl text-ink">
                      WIB
                    </p>
                    <p className="mt-1 font-sans text-xs text-ink-muted">
                      GMT+7
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-6 font-sans text-xs text-ink-muted leading-relaxed">
                Typical reply within 1 to 2 working days. For urgent matters,
                LinkedIn DM usually reaches me fastest.
              </p>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}

function ArrowRight() {
  return (
    <svg
      className="h-6 w-6 md:h-7 md:w-7"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
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

function getSocialIcon(label: string) {
  const css = "h-4 w-4 text-ink-muted group-hover:text-sage transition-colors shrink-0";
  switch (label.toLowerCase()) {
    case "linkedin":
      return (
        <svg className={css} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      );
    case "lynk.id":
      return (
        <svg className={css} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      );
    case "github":
      return (
        <svg className={css} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
        </svg>
      );
    case "hackerrank":
      return (
        <svg className={css} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 8v8M16 8v8M8 12h8" />
        </svg>
      );
    case "youtube":
      return (
        <svg className={css} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
          <polygon points="9.75 15.02 15.5 12 9.75 8.98" fill="currentColor" />
        </svg>
      );
    case "fastwork":
      return (
        <svg className={css} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M14.5 8.5h-2a2 2 0 0 0-2 2v2H9.5m3 0v5M9.5 12.5h4" />
        </svg>
      );
    case "projects.co.id":
      return (
        <svg className={css} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.5 8.5h3.5a2.5 2.5 0 0 1 0 5H9.5v4" />
          <path d="M9.5 13.5h3.5" />
        </svg>
      );
    default:
      return null;
  }
}

function SocialRow({ label, href }: { label: string; href: string }) {
  const icon = getSocialIcon(label);
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-between border-b border-ink/15 py-2.5 font-sans text-sm text-ink transition-colors hover:text-sage"
      >
        <span className="flex items-center gap-3">
          {icon}
          <span>{label}</span>
        </span>
        <svg
          className="h-3.5 w-3.5 text-ink-muted transition-colors group-hover:text-sage"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3 11L11 3m0 0H5m6 0v6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </li>
  );
}


