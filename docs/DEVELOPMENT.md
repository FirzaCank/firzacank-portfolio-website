# Local Development Guide

This guide details the environment setup, commands, and workflow for developing the portfolio site locally.

---

## Prerequisites

Ensure you have **Node.js** (LTS version recommended) installed on your system. You can verify your installation by running:

```bash
node --version
npm --version
```

---

## Setup & Running Locally

1. **Install Dependencies**
   Install all package dependencies defined in `package.json`:
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   Copy the example file and fill in your own keys:
   ```bash
   cp .env.local.example .env.local
   ```
   - `GEMINI_API_KEY`: powers the RAG chat and embedding builds. Free at [aistudio.google.com/api-keys](https://aistudio.google.com/api-keys).
   - `RESEND_API_KEY`: powers the contact form. Get one at [resend.com/api-keys](https://resend.com/api-keys).
   - `NEXT_PUBLIC_SITE_URL`: keep `http://localhost:3000` for local dev.

   `.env.local` is gitignored. Never commit real keys.

3. **Run the Development Server**
   Start a local Next.js development server:
   ```bash
   npm run dev
   ```

4. **Open the Application**
   Navigate to [http://localhost:3000](http://localhost:3000) in your web browser. The application supports Hot Module Replacement (HMR), so changes to your code will reflect instantly in the browser.

---

## Available Scripts

The following NPM scripts are configured in this project:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs the Next.js app in development mode with hot-reloading at `localhost:3000`. |
| `npm run build` | Compiles and optimizes the application for production deployment. |
| `npm run start` | Starts the production server. Requires a prior production build (`npm run build`). |
| `npm run lint` | Runs ESLint to check for code issues, style errors, and best practices. |
| `npm run build-rag` | The one to use after editing portfolio content in `data/*.ts`. Runs `export-portfolio` then `embeddings`, keeping both generated files in sync. Commit the updated `data/portfolio.json` and `data/embeddings.json`. Requires `GEMINI_API_KEY` in `.env.local`. |
| `npm run export-portfolio` | Exports `data/*.ts` content into `data/portfolio.json` (read by the Python tool handlers). Rarely run alone; prefer `build-rag`. |
| `npm run embeddings` | Rebuilds the RAG vector index at `data/embeddings.json` from the exported portfolio. Rarely run alone; prefer `build-rag`. |

Running only `embeddings` after a content edit leaves `portfolio.json` stale, so the chat tools would answer from old data. Always use `build-rag`.

### Python helper scripts

The chat backend is Python (`api/chat.py` + `rag/`). Two manual scripts help when working on it (both need `GEMINI_API_KEY` in `.env.local` and `numpy` installed, e.g. `python3 -m venv .venv && .venv/bin/pip install numpy`):

| Command | Description |
| :--- | :--- |
| `python3 scripts/test_chat.py "your question"` | Smoke test: runs the full chat pipeline (retrieval + tools + Gemini) without HTTP and prints the streamed reply. |
| `python3 scripts/eval_chat.py` | Golden-set eval: runs ~30 assertion-checked cases (grounding, injection, sensitive questions, Bahasa Indonesia) through the pipeline. Run after changing the prompt, tools, or model. See [RAG.md](./RAG.md#golden-set-eval). |
| `python3 scripts/debug_chat.py` | Prints the raw Gemini SSE response body. Only for diagnosing low-level API errors. |

---

## Developer Documentation

To keep the development experience organized, the documentation is split into specialized guides:

- **[Project Structure](./STRUCTURE.md)**: Details on project directory structures, importing conventions, and architectural rules of thumb.
- **[Deployment Guide](./DEPLOY.md)**: Detailed step-by-step instructions to push to GitHub and deploy production builds to Vercel under the custom domain.
- **[RAG Chat Assistant](./RAG.md)**: How the portfolio chat works technically, and how to maintain the vector index.
