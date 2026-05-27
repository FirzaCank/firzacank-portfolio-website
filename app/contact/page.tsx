import type { Metadata } from "next";
import ContactForm from "@/components/sections/ContactForm";
import EmailCopy from "@/components/sections/EmailCopy";
import { SOCIAL_LINKS } from "@/data/nav";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Firza for freelance data, dashboard, and AI engineering work. Based in Jakarta (GMT+7).",
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

          <h1 className="mt-8 max-w-4xl font-display font-extrabold tracking-tightest text-ink text-4xl sm:text-5xl md:text-6xl leading-[1.1]">
            <span className="text-ink-muted">&ldquo;</span>Ready to turn raw
            data into scalable architecture and AI systems that drive revenue?
            <span className="text-ink-muted">&rdquo;</span>
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
              <h2 className="font-display text-3xl md:text-4xl text-ink tracking-tighter">
                Send a message.
              </h2>
              <p className="mt-3 max-w-prose font-sans text-sm text-ink-muted">
                The form opens your email client with the message pre-filled, so
                there is no third-party form service in between.
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
                  <SocialRow label="LinkedIn" href={SOCIAL_LINKS.linkedin} />
                  <SocialRow label="GitHub" href={SOCIAL_LINKS.github} />
                  <SocialRow
                    label="HackerRank"
                    href={SOCIAL_LINKS.hackerrank}
                  />
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

function SocialRow({ label, href }: { label: string; href: string }) {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-between border-b border-ink/15 py-2 font-sans text-sm text-ink transition-colors hover:text-sage"
      >
        <span>{label}</span>
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

