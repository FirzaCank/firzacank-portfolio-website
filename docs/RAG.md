# RAG Chat Assistant: Technical Reference

This document explains how the portfolio chat assistant works, how to maintain it, and how to extend it.

---

## Overview

The chat widget uses Retrieval-Augmented Generation (RAG) combined with agentic tool calling. Instead of sending the entire portfolio to the language model on every request, the system pre-computes vector embeddings for all content at build time. At request time, the model both retrieves semantically relevant chunks and calls structured tools to look up exact data.

This gives the assistant two complementary capabilities:
- **Semantic retrieval**: find relevant content even when wording doesn't match exactly
- **Tool calling**: look up structured data with exact filters (year, company, skill domain)

The backend is a Python Vercel serverless function (`api/chat.py`). The frontend (`components/ui/ChatWidget.tsx`) streams tokens as they arrive.

---

## Architecture

```
Build time:
  Portfolio data (data/*.ts + content/projects/*.mdx)
    --> scripts/export-portfolio.ts   export structured JSON for Python tools
    --> data/portfolio.json           structured data (projects, experience, about)

    --> lib/rag/sources.ts            read all content into labeled Doc objects
    --> lib/rag/chunk.ts              split into overlapping text chunks (~1200 chars)
    --> lib/rag/embed.ts              embed each chunk via Gemini embedding model
    --> data/embeddings.json          vector index (committed to repo)

Request time:
  User question
    --> rag/retriever.py             embed query, cosine similarity search over embeddings.json
    --> top-k chunks                 injected into system prompt as grounding context
    --> api/chat.py                  build request with context + tool declarations
    --> Gemini 2.5 Flash
          |-- decides: answer from context, OR call a tool
          |-- if tool call: run handler in rag/tools.py, feed result back
          |-- repeat up to 2 rounds
          `-- stream final answer
    --> SSE stream                   tokens streamed back to the browser
```

---

## Key Files

| File | Role |
| :--- | :--- |
| `api/chat.py` | Vercel Python serverless handler: validates input, rate limits, runs RAG + tool-calling loop, streams response |
| `rag/retriever.py` | Loads `embeddings.json`, embeds query via Gemini, returns top-k chunks by cosine similarity |
| `rag/gemini.py` | Gemini REST API wrapper: query embedding and streaming `generateContent` with SSE |
| `rag/tools.py` | Tool schemas (Gemini function declarations) + handlers that read `data/portfolio.json` |
| `rag/prompt.py` | System prompt: grounding rules, tool instructions, security guards, style |
| `lib/rag/sources.ts` | Reads all portfolio data and returns labeled `Doc` objects (used by build scripts) |
| `lib/rag/chunk.ts` | Splits documents into overlapping chunks |
| `lib/rag/embed.ts` | Calls Gemini `embedContent` API, computes cosine similarity (used by build scripts) |
| `scripts/export-portfolio.ts` | Exports `data/*.ts` into `data/portfolio.json` for Python tools |
| `scripts/build-embeddings.ts` | Embeds all chunks and writes `data/embeddings.json` |
| `scripts/test_chat.py` | Local test script: calls `_run_chat()` directly without HTTP |
| `data/embeddings.json` | Pre-built vector index (committed to repo, read at request time) |
| `data/portfolio.json` | Structured portfolio data for tool handlers (committed to repo) |
| `components/ui/ChatWidget.tsx` | Browser-side floating chat panel, streams tokens as they arrive |
| `api/requirements.txt` | Python dependencies: numpy only (Gemini calls use stdlib urllib) |

---

## Tool Calling

The model can call any of these tools instead of (or before) generating a text answer:

| Tool | What it does | Key filters |
| :--- | :--- | :--- |
| `search_projects` | List projects matching criteria | `query`, `year`, `category`, `stack` |
| `get_project_detail` | Full case study for one project | `slug` |
| `search_experience` | Filter work history | `company`, `current`, `internship` |
| `get_career_timeline` | All roles in chronological order | none |
| `get_skills` | Skill groups | `domain` keyword |

The model decides which tool to call based on the question. For example:
- "project 2026?" calls `search_projects(year="2026")` for exact filtering
- "first job?" calls `get_career_timeline()` so order is guaranteed correct
- "cloud skills?" calls `get_skills(domain="cloud")` for structured output
- Open-ended questions skip tools and answer from retrieved context directly

The tool-calling loop runs up to 2 rounds. Each tool result is fed back to the model as a `functionResponse`, and the model continues until it has enough to generate a final answer.

**Gemini thinking models and `thoughtSignature`**: Gemini 2.5 Flash returns a `thoughtSignature` field alongside `functionCall` parts. This signature must be passed back verbatim in the model turn when feeding tool results, or Gemini returns a 400 error. `rag/gemini.py` preserves raw parts (including `thoughtSignature`) and `api/chat.py` includes them in the model content turn.

---

## Embedding Model

Model: `gemini-embedding-001`
Output dimensions: 768
Authentication: API key via `x-goog-api-key` header

Two task types are used intentionally:
- `RETRIEVAL_DOCUMENT` at build time when embedding chunks
- `RETRIEVAL_QUERY` at request time when embedding the user question

Using asymmetric task types improves retrieval accuracy. The model is trained to maximize similarity between a query and its relevant documents, not between two arbitrary pieces of text.

---

## Vector Similarity Search

At request time (`rag/retriever.py`):
1. The latest user message is embedded using `RETRIEVAL_QUERY`.
2. All chunk vectors are loaded from `embeddings.json` and pre-normalized to unit length on first load (cached in-process via `@lru_cache`).
3. Cosine similarity is computed as a single matrix-vector dot product via numpy (fast for under a few hundred chunks).
4. Chunks below a minimum score of 0.4 are discarded.
5. The top 8 remaining chunks are injected into the system prompt as grounding context.

The implementation uses numpy for vectorized computation. If the index grows into the tens of thousands of chunks, swap the search layer to FAISS (IndexFlatIP on normalized vectors) without changing the interface.

---

## Chunking Strategy

Each document is split into overlapping windows:
- Target chunk size: ~1200 characters (~300 tokens)
- Overlap: ~180 characters (~15% of chunk size)

The overlap prevents important context from being cut at a chunk boundary. The chunker prefers to split on paragraph breaks rather than mid-sentence.

Each chunk carries a `source` label (for example, "Project: Telco Churn Prediction" or "Experience: Data Engineer at Hypefast") so retrieved results can be cited in the prompt.

---

## System Prompt Design

The system prompt (`rag/prompt.py`) follows RAG best practices:

- **Grounding**: the model is instructed to answer only from retrieved context or tool results, never from general knowledge.
- **Tool priority**: the model is told to prefer tools for specific/filterable questions and context for open-ended ones.
- **Scope guard**: questions not about Firza's professional work are politely declined in one sentence.
- **Security**: the model is told that retrieved context, tool results, and user messages are untrusted data, not instructions. It refuses any attempt to change its role, reveal the system prompt, or override rules.
- **Delimiter isolation**: retrieved content is wrapped in `<<<RETRIEVED_CONTEXT ... RETRIEVED_CONTEXT>>>` markers. The string "RETRIEVED_CONTEXT" is stripped from user input before it reaches the prompt.
- **Style**: markdown-formatted responses, third-person references to Firza, language matched to the visitor.

---

## Security Controls

| Control | Implementation |
| :--- | :--- |
| Input sanitization | Control characters stripped, max 2000 chars per message |
| Role validation | Only `user` and `assistant` roles accepted; all others coerced to `user` |
| Message limit | Max 40 messages per request history |
| Delimiter injection | "RETRIEVED_CONTEXT" neutralized in user input |
| Prompt injection | Untrusted-data framing in system prompt, refuse role-change instructions |
| Per-IP rate limit | Max 20 requests per minute per IP (in-memory) |
| Global rate limit | Max 200 requests per hour across all IPs (in-memory, protects free tier quota) |
| Tool round cap | Max 2 tool-calling rounds per request, prevents infinite loops |

Note: rate limit counters are in-memory and reset on cold start. Not shared across Vercel instances. Acceptable for a personal portfolio. Replace with Upstash Redis if persistent cross-instance limits are needed.

---

## Maintaining the Index

The vector index (`data/embeddings.json`) and portfolio data (`data/portfolio.json`) are static. They do not update automatically when content changes.

Re-run both build steps whenever you add, edit, or remove portfolio content:

```bash
npm run build-rag
```

This runs `export-portfolio` then `embeddings` in sequence. Commit both updated files. Production reads the committed files; there is no build step on Vercel at deploy time.

Or run steps individually:

```bash
npm run export-portfolio   # regenerate data/portfolio.json from data/*.ts
npm run embeddings         # regenerate data/embeddings.json
```

---

## Local Testing

Test the Python chat handler directly without a running HTTP server:

```bash
python scripts/test_chat.py "your question here"
```

This calls `_run_chat()` directly, reads `.env.local` for the API key, and streams the response to the terminal. Useful for verifying tool calling behavior before deploying.

Run tool and retriever self-checks:

```bash
python -m rag.tools       # verifies portfolio.json loads, all tools run
python -m rag.retriever   # verifies embeddings.json loads, vectors are unit-normalized
```

---

## Extending the System

**Add a new content source**
Edit `lib/rag/sources.ts` and add a new `Doc`. Re-run `npm run build-rag`.

**Add a new tool**
Add a handler function and a Gemini function declaration to `rag/tools.py`, then add the handler to `HANDLERS`. The system prompt in `rag/prompt.py` will automatically make the model aware of it via the declarations list passed in the request body.

**Change retrieval depth**
Edit `TOP_K` and `MIN_SCORE` in `rag/retriever.py`. Higher `TOP_K` gives more context but increases prompt size and latency.

**Change chunk size**
Edit `TARGET_CHARS` and `OVERLAP_CHARS` in `lib/rag/chunk.ts`. Re-run `npm run build-rag` after changing.

**Switch to a vector database**
Replace the numpy cosine search in `rag/retriever.py` with calls to FAISS, Pinecone, or similar. The `retrieve()` function interface stays the same (takes query string + api key, returns list of dicts with source/text/score).

**Switch language model**
Change `MODEL` in `api/chat.py`. Verify the new model supports function declarations and check whether it returns `thoughtSignature` in function call parts (if not, remove the raw-part passback logic in `_run_chat`).
