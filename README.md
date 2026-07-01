# Firza Chandra Sandjaya Putra - Portfolio

Personal portfolio showcasing data engineering work and independent projects across data analysis, dashboards, pitch decks, and AI engineering.

Live: https://firzacank.vercel.app

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS with custom design tokens
- Satoshi Variable (headings) + Bricolage Grotesque (display) + Inter (body) via `next/font` + `next/font/local`
- Framer Motion for reveal animations
- MDX-based project case studies with `githubUrl` frontmatter support
- Dynamic OG images via `next/og`
- Copy-to-clipboard email with toast notification (hero, footer, CTA, contact)
- RAG chat assistant: floating "Ask me" button, answers from site content via Gemini, responses rendered as markdown (see below)

## RAG chat assistant

A floating "Ask me" button lets visitors ask anything about Firza's work. The assistant only answers from actual portfolio content, so it cannot make up facts. Answers are fast and grounded because only the relevant pieces of the site are sent to the model, not the whole thing.

The backend is a Python Vercel serverless function (`api/chat.py`) using Gemini tool calling — the model decides per question whether to answer from retrieved context or call a structured tool (`search_projects`, `get_career_timeline`, etc.).

Re-run `npm run build-rag` whenever you add or edit content, then commit the updated `data/embeddings.json` and `data/portfolio.json`. See [RAG Chat Assistant](./docs/RAG.md) for setup and extension details.

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

- **[Development Guide](./docs/DEVELOPMENT.md)**: Setup instructions, local running instructions, and package scripts.
- **[Deployment Guide](./docs/DEPLOY.md)**: Steps to push to GitHub and deploy to production on Vercel.
- **[Project Structure](./docs/STRUCTURE.md)**: Architecture details, directory outline, and coding conventions.
- **[RAG Chat Assistant](./docs/RAG.md)**: How the portfolio chat works: embedding, retrieval, prompt design, security controls, and how to extend it.

## License

MIT. See [LICENSE](./LICENSE).

## Project structure

```
app/                     # Next.js App Router routes
  contact/               # Contact page (form + side panel)
  projects/[slug]/       # Dynamic case study pages
  api/contact/route.ts   # Contact form email endpoint (Resend)
  opengraph-image.tsx    # Default OG generator
  robots.ts, sitemap.ts  # SEO files
  icon.svg, apple-icon.png, favicon.ico
components/
  layout/                # Nav, Footer, MobileMenu
  sections/              # Hero, FeaturedProjects, ContactForm, SlideGallery, etc.
  ui/                    # Shared UI (CopyEmailButton, ChatWidget, etc.)
  mdx-components.tsx     # MDX renderer overrides
content/projects/        # Case studies (.mdx)
api/
  chat.py                # Python serverless handler: RAG + Gemini tool calling, streams reply
  requirements.txt       # Python dependencies (numpy)
rag/                     # Python RAG package
  retriever.py           # Vector similarity search (numpy cosine over embeddings.json)
  gemini.py              # Gemini REST wrapper: embedding + streaming generateContent
  tools.py               # Tool schemas + handlers (search_projects, get_career_timeline, etc.)
  prompt.py              # System prompt: grounding, security, style
data/                    # nav, projects, decks, about, experience
  embeddings.json        # Pre-built RAG vector index (run: npm run build-rag)
  portfolio.json         # Structured portfolio data for Python tool handlers
lib/
  mdx.ts                 # Case study loader
  site.ts                # SITE_URL + brand constants
  rag/                   # Build-time helpers: chunking, embedding, source building
public/
  decks/                 # Anonymized slide thumbnails + PDFs
  screenshots/           # Dashboard screenshots
  images/                # Portrait
  fonts/                 # Satoshi Variable (woff2/woff)
styles/globals.css       # Tailwind entry + custom resets
```
