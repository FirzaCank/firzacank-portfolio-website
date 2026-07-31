# Firza Chandra Sandjaya Putra - Portfolio

Personal portfolio showcasing data engineering work and independent projects across data analysis, dashboards, pitch decks, and AI engineering.

Live: https://firzacank.vercel.app

## Highlights

- **Next.js 15** (App Router) + TypeScript + Tailwind CSS, deployed on Vercel
- **Agentic RAG chat assistant**: a floating "Ask me" widget that answers questions about Firza's work grounded on actual site content, and can pass a visitor's message straight to him without leaving the chat
- MDX-based project case studies with dynamic OG images
- SEO: JSON-LD structured data, sitemap, per-page metadata

## RAG chat assistant

The backend is a Python serverless function using Gemini with a hybrid approach: semantic retrieval over pre-built embeddings for open-ended questions, plus structured tool calling for precise lookups (career timeline, project filters). Guardrails cover grounding, prompt injection, and off-topic handling, verified by a golden-set eval suite.

Key engineering decisions:

- **Hybrid RAG + tool calling**: semantic search alone cannot guarantee exact ordering or filtering ("first job?", "projects in 2026?"), so the model calls structured tools for those.
- **Asymmetric embedding task types** (`RETRIEVAL_QUERY` vs `RETRIEVAL_DOCUMENT`) measurably improved retrieval relevance.
- **Static system prompt** with context appended to the user turn, so Gemini's implicit prefix caching can reuse the prompt across requests.
- **One tool with a side effect, guarded accordingly**: five tools are read-only lookups; a sixth emails a visitor's message to Firza. Because a wrong answer is correctable next turn and a wrong send is not, that one requires visitor-supplied contact details, an explicit confirmation, and a code-level cap of one delivery per request rather than trusting the prompt alone. It reuses the existing contact-form route instead of adding a second mail path, and the eval harness stubs it so test runs can never send real email.

See [docs/RAG.md](./docs/RAG.md) for the full architecture.

## Getting started

```bash
npm install
cp .env.local.example .env.local   # fill in your own API keys
npm run dev
```

After editing portfolio content, rebuild the RAG index and commit the generated files:

```bash
npm run build-rag
```

## Documentation

- **[Development Guide](./docs/DEVELOPMENT.md)**: setup, scripts, local workflow
- **[Deployment Guide](./docs/DEPLOY.md)**: GitHub + Vercel deployment
- **[Project Structure](./docs/STRUCTURE.md)**: directory layout and conventions
- **[RAG Chat Assistant](./docs/RAG.md)**: architecture, security controls, eval suite

## License

MIT. See [LICENSE](./LICENSE).
