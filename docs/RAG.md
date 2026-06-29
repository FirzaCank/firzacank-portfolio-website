# RAG Chat Assistant: Technical Reference

This document explains how the portfolio chat assistant works, how to maintain it, and how to extend it.

---

## Overview

The chat widget uses Retrieval-Augmented Generation (RAG). Instead of sending the entire portfolio to the language model on every request, the system pre-computes vector embeddings for all content at build time. At request time, only the most relevant pieces are retrieved and sent to the model.

This approach has two benefits: replies are fast (small prompt) and grounded (the model cannot answer beyond what is in the index).

---

## Architecture

```
Build time:
  Portfolio content (MDX + data files)
    --> chunk.ts        split into overlapping text chunks
    --> embed.ts        each chunk embedded via Gemini API
    --> embeddings.json vector index written to disk

Request time:
  User question
    --> embed.ts        question embedded (RETRIEVAL_QUERY task type)
    --> chat-context.ts cosine similarity against all chunk vectors
    --> top-5 chunks    injected into system prompt
    --> Gemini 3.5 Flash generates answer strictly from those chunks
    --> SSE stream      tokens streamed back to the browser
```

---

## Key Files

| File | Role |
| :--- | :--- |
| `lib/rag/sources.ts` | Reads all portfolio data (about, experience, projects, MDX) and returns labeled `Doc` objects |
| `lib/rag/chunk.ts` | Splits each document into overlapping chunks (~1200 chars, ~180 char overlap) |
| `lib/rag/embed.ts` | Calls Gemini `embedContent` API, normalizes vectors, computes cosine similarity |
| `lib/chat-context.ts` | Embeds the query, ranks all chunks by similarity, returns the top-K above a score threshold |
| `scripts/build-embeddings.ts` | Build-time script: loads sources, chunks, embeds, writes `data/embeddings.json` |
| `app/api/chat/route.ts` | API endpoint: validates input, rate-limits, retrieves chunks, calls Gemini, streams response |
| `components/ui/ChatWidget.tsx` | Browser-side floating chat panel, streams tokens as they arrive |
| `data/embeddings.json` | The pre-built vector index (committed to the repo, read at request time) |

---

## Embedding Model

Model: `gemini-embedding-001`
Output dimensions: 768
Authentication: API key via `?key=` query parameter

Two task types are used intentionally:
- `RETRIEVAL_DOCUMENT` at build time when embedding chunks
- `RETRIEVAL_QUERY` at request time when embedding the user question

Using asymmetric task types (document vs. query) improves retrieval accuracy compared to treating both sides the same. The model is trained to maximize similarity between a query and its relevant documents, not between two arbitrary pieces of text.

---

## Chunking Strategy

Each document is split into overlapping windows:
- Target chunk size: ~1200 characters (~300 tokens)
- Overlap: ~180 characters (~15% of chunk size)

The overlap prevents important context from being cut at a chunk boundary. The chunker prefers to split on paragraph breaks rather than mid-sentence.

Each chunk carries a `source` label (for example, "Project: Telco Churn Prediction" or "Experience: Data Engineer at Hypefast") so retrieved results can be cited in the prompt.

---

## Retrieval

At request time:
1. The latest user message is embedded using `RETRIEVAL_QUERY`.
2. Cosine similarity is computed between the query vector and every chunk vector in `embeddings.json`.
3. Chunks are sorted by score (highest first).
4. Chunks below a minimum score of 0.4 are discarded.
5. The top 5 remaining chunks are passed to the model as context.

The 0.4 threshold prevents loosely related chunks from padding the prompt. The top-5 limit keeps the prompt small.

---

## System Prompt Design

The system prompt follows RAG best practices:

- **Grounding**: the model is instructed to answer only from the retrieved context, never from general knowledge.
- **Scope guard**: questions not about Firza's professional work are politely declined.
- **Security**: the model is told that both the retrieved context and the user's message are untrusted data, not instructions. It is instructed to refuse any attempt to change its role, reveal the system prompt, or override these rules.
- **Delimiter isolation**: retrieved content is wrapped in `<<<RETRIEVED_CONTEXT ... RETRIEVED_CONTEXT>>>` markers. The string "RETRIEVED_CONTEXT" is stripped from user input before it reaches the prompt, closing the context-delimiter spoofing vector.
- **Style**: markdown-formatted responses (paragraphs, bullet points, bold for key metrics), third-person references to Firza, language matched to the visitor. The chat widget renders markdown via `react-markdown` + `remark-gfm`.

---

## Security Controls

| Control | Implementation |
| :--- | :--- |
| Input sanitization | Control characters stripped, max 2000 chars per message |
| Role validation | Only `user` and `assistant` roles accepted; all others coerced to `user` |
| Message limit | Max 20 messages per request |
| Delimiter injection | "RETRIEVED_CONTEXT" neutralized in user input |
| Prompt injection | Untrusted-data framing in system prompt, refuse role-change instructions |
| Per-IP rate limit | Max 20 requests per minute per IP (in-memory) |
| Global rate limit | Max 200 requests per hour across all IPs (in-memory, protects free tier quota) |

Note: the in-memory rate limit counters reset on cold start and are not shared across Vercel instances. This is acceptable for a personal portfolio. If traffic grows, replace with Upstash Redis.

---

## Maintaining the Index

The vector index in `data/embeddings.json` is static. It does not update automatically when content changes.

Re-run the build script whenever you add, edit, or remove portfolio content:

```bash
npm run embeddings
```

Then commit the updated `data/embeddings.json`. Production reads the committed file; there is no embedding step on Vercel at deploy time.

---

## Extending the System

**Add a new content source**
Edit `lib/rag/sources.ts` and add a new `Doc` to the returned array. Re-run `npm run embeddings`.

**Change retrieval depth**
Edit `TOP_K` and `MIN_SCORE` in `lib/chat-context.ts`. Higher `TOP_K` gives more context but increases prompt size and latency. Lower `MIN_SCORE` includes weaker matches.

**Change chunk size**
Edit `TARGET_CHARS` and `OVERLAP_CHARS` in `lib/rag/chunk.ts`. Smaller chunks improve retrieval precision but require more API calls at build time. Re-run `npm run embeddings` after changing these values.

**Switch to a vector database**
Replace the `loadIndex` and cosine search in `lib/chat-context.ts` with calls to Pinecone, Upstash Vector, or similar. The `Chunk` and `Retrieved` types stay the same; only the storage and query layer changes.

**Upgrade the language model**
Change `MODEL` in `app/api/chat/route.ts`. Verify that the new model supports `thinkingConfig.thinkingLevel` or remove that field if it does not.
