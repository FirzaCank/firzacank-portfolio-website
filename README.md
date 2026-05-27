# Firza Chandra Sandjaya Putra — Portfolio

Personal portfolio showcasing fulltime data engineering work and freelance side projects across data analysis, dashboards, pitch decks, and AI engineering.

Live: https://firzacank.vercel.app

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS with custom design tokens
- Bricolage Grotesque (display) + Inter (body) via `next/font`
- Framer Motion for reveal animations
- MDX-based project case studies
- Dynamic OG images via `next/og`

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

## Development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deployment

See [DEPLOY.md](./DEPLOY.md) for step-by-step push to GitHub and connect to Vercel.

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
styles/globals.css       # Tailwind entry + custom resets
```
