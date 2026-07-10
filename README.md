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

## Getting started

```bash
npm install
cp .env.local.example .env.local   # add GEMINI_API_KEY and RESEND_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The chat widget requires a Gemini API key — get one free at [aistudio.google.com/api-keys](https://aistudio.google.com/api-keys).

After editing portfolio content, rebuild the RAG index before deploying:

```bash
npm run build-rag   # regenerates data/portfolio.json and data/embeddings.json
```

Commit both updated files. See [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md) for the full setup guide.

## Challenges

The main technical challenge was building a RAG pipeline that stays grounded. Embedding the entire portfolio and doing cosine retrieval was straightforward, but getting the model to answer accurately without hallucinating required several iterations:

- **Retrieval alone was not enough.** Open-ended queries returned relevant chunks, but questions like "what was his first job?" or "projects in 2026?" needed exact ordering and filtering that semantic search cannot guarantee. The solution was a hybrid: RAG for context, structured tool calling for precise lookups.
- **Gemini thinking models return a `thoughtSignature` field** alongside function call parts. This signature must be passed back verbatim when feeding tool results, or the API returns a 400 error. It took debugging the raw SSE stream to catch this.
- **Asymmetric embedding task types matter.** Using `RETRIEVAL_QUERY` at request time and `RETRIEVAL_DOCUMENT` at build time improved retrieval relevance noticeably versus using the same task type for both. Easy to miss in the docs.
- **Free tier limits are tight on most models.** `gemini-3.5-flash` hit 503 overload errors in production, and most flash models only allow 20 requests per day on the free tier. Settled on `gemini-3.1-flash-lite` (500 RPD) after validating tool calling and answer accuracy with a fixed test set. Lite models needed an explicit "MUST call the tool first" instruction in the prompt to stop them answering capability questions from context alone.

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
