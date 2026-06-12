# Firza Chandra Sandjaya Putra - Portfolio

Personal portfolio showcasing fulltime data engineering work and freelance side projects across data analysis, dashboards, pitch decks, and AI engineering.

Live: https://firzacank.vercel.app

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS with custom design tokens
- Satoshi Variable (headings) + Bricolage Grotesque (display) + Inter (body) via `next/font` + `next/font/local`
- Framer Motion for reveal animations
- MDX-based project case studies with `githubUrl` frontmatter support
- Dynamic OG images via `next/og`
- Copy-to-clipboard email with toast notification (hero, footer, CTA, contact)

## Design tokens

WCAG AA/AAA verified palette:

| Token | Hex | Use |
|---|---|---|
| `beige` | `#F5EFE4` | Base background |
| `beige-card` | `#FBF8F2` | Cards |
| `sage` | `#5A7058` | Primary, AAA on beige |
| `sage-soft` | `#A8B89E` | Decorative only |
| `terracotta` | `#B5552E` | Accent / CTA |
| `ink` | `#1F2419` | Body text, AAA |
| `ink-muted` | `#4A5145` | Secondary text, AAA |

## Documentation

For technical guides on working with this project, refer to the following documents:

- **[Development Guide](./DEVELOPMENT.md)**: Setup instructions, local running instructions, and package scripts.
- **[Deployment Guide](./DEPLOY.md)**: Steps to push to GitHub and deploy to production on Vercel.
- **[Project Structure](./STRUCTURE.md)**: Architecture details, directory outline, and coding conventions.

## License

MIT. See [LICENSE](./LICENSE).

## Project structure

```
app/                     # Next.js App Router routes
  contact/               # Contact page (form + side panel)
  projects/[slug]/       # Dynamic case study pages
  opengraph-image.tsx    # Default OG generator
  robots.ts, sitemap.ts  # SEO files
  icon.svg, apple-icon.png, favicon.ico
components/
  layout/                # Nav, Footer, MobileMenu
  sections/              # Hero, FeaturedProjects, ContactForm, SlideGallery, etc.
  ui/                    # Shared UI (CopyEmailButton, etc.)
  mdx-components.tsx     # MDX renderer overrides
content/projects/        # 10 case studies (.mdx)
data/                    # nav, projects, decks, about, experience
lib/
  mdx.ts                 # Case study loader
  site.ts                # SITE_URL + brand constants
public/
  decks/                 # Anonymized slide thumbnails + PDFs
  screenshots/           # Dashboard screenshots
  images/                # Portrait
  fonts/                 # Satoshi Variable (woff2/woff)
styles/globals.css       # Tailwind entry + custom resets
```
