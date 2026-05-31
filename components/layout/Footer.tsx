import Link from "next/link";
import { SOCIAL_LINKS } from "@/data/nav";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink/20 bg-beige-deep/40">
      <div className="mx-auto max-w-container px-6 md:px-10 py-16">
        <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr]">
          {/* Brand + tagline */}
          <div>
            <p className="font-display text-3xl tracking-tighter text-ink">
              Firza Chandra
            </p>
            <p className="mt-3 max-w-sm font-sans text-sm text-ink-muted">
              Data Engineer, AI Engineer, and ML Engineer building end-to-end
              data pipelines and scalable MLOps frameworks.
            </p>
            <p className="mt-4 font-sans text-xs uppercase tracking-widest text-sage">
              Jakarta, Indonesia
            </p>
          </div>

          {/* Sitemap */}
          <div>
            <p className="font-sans text-xs uppercase tracking-widest text-ink-muted">
              Sitemap
            </p>
            <ul className="mt-4 space-y-2">
              <FooterLink href="/about">About</FooterLink>
              <FooterLink href="/experience">Experience</FooterLink>
              <FooterLink href="/projects">Projects</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
            </ul>
          </div>

          {/* Social */}
          <div>
            <p className="font-sans text-xs uppercase tracking-widest text-ink-muted">
              Connect
            </p>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href={`mailto:${SOCIAL_LINKS.email}`}
                  className="font-sans text-sm text-ink hover:text-sage transition-colors"
                >
                  Email
                </a>
              </li>
              <li>
                <a
                  href={SOCIAL_LINKS.lynk}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-sm text-ink hover:text-sage transition-colors"
                >
                  Lynk.id
                </a>
              </li>
              <li>
                <a
                  href={SOCIAL_LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-sm text-ink hover:text-sage transition-colors"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={SOCIAL_LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-sm text-ink hover:text-sage transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href={SOCIAL_LINKS.hackerrank}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-sm text-ink hover:text-sage transition-colors"
                >
                  HackerRank
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-ink/20 pt-6">
          <p className="font-sans text-xs text-ink-muted">
            &copy; {year} Firza Chandra Sandjaya Putra. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="font-sans text-sm text-ink hover:text-sage transition-colors"
      >
        {children}
      </Link>
    </li>
  );
}
