# Project structure

Conventions used across the codebase.

```
app/                        Next.js App Router (routes only)
  layout.tsx                Root layout: fonts, metadata, JSON-LD, nav + footer shell, ChatWidget
  page.tsx                  Homepage composition
  about/page.tsx            About page
  experience/page.tsx       Experience page
  projects/page.tsx         Projects index
  projects/[slug]/          Dynamic MDX case study pages (+ per-project OG image)
  contact/page.tsx          Contact page (form + side panel)
  api/contact/route.ts      Contact form email endpoint (Resend)
  opengraph-image.tsx       Default OG image generator
  robots.ts, sitemap.ts     SEO files
  icon.svg, apple-icon.png, favicon.ico

api/                        Python serverless functions (Vercel)
  chat.py                   RAG chat handler: rate limiting, retrieval, Gemini tool calling, SSE streaming
  requirements.txt          Python dependencies (numpy)

rag/                        Python RAG package used by api/chat.py
  retriever.py              Vector similarity search (numpy cosine over data/embeddings.json)
  gemini.py                 Gemini REST wrapper: embedding + streaming generateContent
  tools.py                  Tool schemas + handlers (search_projects, get_career_timeline, etc.)
  prompt.py                 System prompt: grounding, security, style rules

components/
  layout/                   App shell: Nav, MobileMenu, Footer
  sections/                 Page section blocks composed of UI + data
  ui/                       Reusable primitives: ChatWidget, CopyEmailButton, SearchBar
  mdx-components.tsx        MDX renderer overrides

content/
  projects/[slug].mdx       Project case studies, loaded by app/projects/[slug]/page.tsx

data/                       Static data sources + co-located types
  nav.ts                    NavItem type, NAV_ITEMS, SOCIAL_LINKS, CV_URL, CV_URL_JA
  about.ts                  Bio, education, certifications, skills, leadership
  experience.ts             Role type, ROLES array
  projects.ts               Project type, ProjectCategory, PROJECTS, featured helpers
  decks.ts                  Slide deck gallery data
  portfolio.json            Generated: structured portfolio export for Python tool handlers
  embeddings.json           Generated: RAG vector index (npm run build-rag)

lib/                        Pure utility functions (no JSX, no data)
  utils.ts                  cn() className merger
  site.ts                   SITE_URL + brand constants
  mdx.ts                    Case study loader
  rag/
    sources.ts              Turns all portfolio data into labeled documents
    chunk.ts                Splits documents into overlapping chunks
    embed.ts                Gemini embedding calls + cosine similarity

scripts/
  export-portfolio.ts       Build-time: exports data/*.ts into data/portfolio.json
  build-embeddings.ts       Build-time: chunk + embed content into data/embeddings.json
  test_chat.py              Manual smoke test for the chat pipeline (bypasses HTTP)
  debug_chat.py             Raw Gemini SSE inspector for debugging API errors

docs/
  DEVELOPMENT.md            Local setup, env vars, scripts
  DEPLOY.md                 GitHub + Vercel deployment guide
  STRUCTURE.md              This file
  RAG.md                    How the chat RAG system works, security controls, how to extend it

public/                     Static assets served at root
  firza-cv.pdf              English CV download
  firza-cv-ja.xlsx          Japanese CV download
  decks/                    Anonymized slide thumbnails + PDFs
  screenshots/              Dashboard screenshots
  images/                   Portrait, photos
  fonts/                    Self-hosted webfonts

styles/
  globals.css               Tailwind directives + base styles

Makefile                    Shortcuts: make dev / build / start / lint / clean
```

Generated files (`data/portfolio.json`, `data/embeddings.json`) are committed because the Python function reads them at runtime. Rebuild with `npm run build-rag` after editing any `data/*.ts` content, then commit both.

## Import conventions

Use the `@/*` path alias (configured in `tsconfig.json`):

```ts
import Nav from "@/components/layout/Nav";          // layout shell
import Hero from "@/components/sections/Hero";       // page sections
import { ROLES } from "@/data/experience";           // static data
import { cn } from "@/lib/utils";                    // utilities
import "@/styles/globals.css";                       // global styles
```

## Rules of thumb

- Data arrays and their types live together in `data/*.ts`. No separate `types/` folder.
- Components in `sections/` are page-level blocks. They are not meant to be reused across radically different contexts.
- Reusable primitives go in `components/ui/` once they emerge from real use (avoid premature abstraction).
- `lib/` is for stateless utility functions. No React, no data.
- All MDX project case studies live under `content/projects/` and are loaded by the catch-all route in `app/projects/[slug]/page.tsx`.
- Python code (`api/`, `rag/`) has no framework: `api/chat.py` is a plain `BaseHTTPRequestHandler` Vercel function, `rag/` is a small stdlib + numpy package.
