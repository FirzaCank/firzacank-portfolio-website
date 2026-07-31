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
    --> api/chat.py                  short/anaphoric follow-up? prefix previous user message to the retrieval query
    --> rag/retriever.py             embed query (cached for repeated questions), cosine search over embeddings.json
    --> top-k chunks                 appended to the latest user message as a delimited context block
                                     (system prompt stays byte-stable, so Gemini prefix caching can reuse it)
    --> api/chat.py                  build request with context + tool declarations
    --> Gemini 3.1 Flash-Lite
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
| `scripts/test_chat.py` | Local test script: calls `_run_chat()` directly without HTTP (single turn) |
| `scripts/chat_repl.py` | Interactive multi-turn REPL, needed for anything with conversation state; stubs the send tool unless `--live` |
| `scripts/eval_chat.py` | Golden-set eval runner: asserts answers against `scripts/golden_set.json` |
| `scripts/golden_set.json` | 37 eval cases: factual, capability, sensitive, injection, off-topic, Bahasa Indonesia, multi-turn, send-message |
| `app/api/contact/route.ts` | Next.js contact form route. Also the outbound mail path for the `send_message_to_firza` tool (rate limits, sanitizing, Resend call, HTML template all live here) |
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
| `search_experience` | Filter work history | `company`, `current`, `internship`, `stack` |
| `get_career_timeline` | All roles in chronological order | none |
| `get_skills` | Skill groups | `domain` keyword (a miss returns the full list with a note, so a wrong keyword never dead-ends the model) |
| `send_message_to_firza` | **Write tool.** Emails a visitor's message to Firza | `name`, `email`, `message` (all required), `topic` |

The first five are read-only lookups over `data/portfolio.json`. `send_message_to_firza` is the only tool with a side effect, and it carries extra guards the read-only tools do not need. See [Write Tool](#write-tool-send_message_to_firza).

The model decides which tool to call based on the question. For example:
- "project 2026?" calls `search_projects(year="2026")` for exact filtering
- "first job?" calls `get_career_timeline()` so order is guaranteed correct
- "cloud skills?" calls `get_skills(domain="cloud")` for structured output
- Open-ended questions skip tools and answer from retrieved context directly

The tool-calling loop runs up to 2 rounds. Each tool result is fed back to the model as a `functionResponse`, and the model continues until it has enough to generate a final answer.

If both rounds end in tool calls with no text, a final pass runs with function calling forced off (`toolConfig.functionCallingConfig.mode = NONE`), an appended "tool budget exhausted, answer now" user message, and a higher token cap (2048, because thinking models spend output tokens reasoning before emitting text). This forces a text answer from the tool results already gathered. The apology fallback only fires if even this pass produces nothing, and the `finishReason` is logged when that happens. `run_tool` also logs every call (`tool: name(args) -> result`) to the function logs for debugging.

**Gemini thinking models and `thoughtSignature`**: Gemini thinking models return a `thoughtSignature` field alongside `functionCall` parts. This signature must be passed back verbatim in the model turn when feeding tool results, or Gemini returns a 400 error. `rag/gemini.py` preserves raw parts (including `thoughtSignature`) and `api/chat.py` includes them in the model content turn.

---

## Write Tool: `send_message_to_firza`

This turns the assistant from a read-only Q&A bot into one that can act: a visitor with hiring or collaboration intent can have their message emailed to Firza without leaving the chat.

### Why it is treated differently

A wrong *answer* shows the visitor bad information and can be corrected in the next turn. A wrong *action* puts a real email in Firza's inbox and cannot be undone. Every guard below exists because of that asymmetry.

### It reuses the contact form, it does not reimplement it

The handler POSTs to `app/api/contact/route.ts` rather than calling Resend directly. That route already owns rate limiting, input sanitizing, email validation, the Resend call, and the HTML template. Duplicating any of that in Python would create a second, divergent mail path.

Consequences worth knowing:
- Changing the destination address or email template is a one-place edit that covers both the form and the chat.
- The form and the chat **share** the contact route's abuse limits (5/IP/min, 50/hour global). A burst through one throttles the other.
- Those limits are in-memory and per-instance (see the `ponytail:` note in the route), so they are a spam speed bump, not a distributed-abuse defence. Upstash is already wired up for chat and is the upgrade path if this ever matters.
- `CONTACT_API_URL` overrides the target; it defaults to the production URL.

### Guards

| Guard | Where | Why |
| :--- | :--- | :--- |
| Requires name, email, and message | `send_message_to_firza` validates before anything else | The model must never invent contact details. Missing fields return an error telling it to ask the visitor. |
| Email format check | Regex in the handler | A malformed address means a silently lost lead. |
| Validation runs **before** the one-send guard | Ordering in the handler | A rejected call is not a send, so the model stays free to retry with corrected arguments. |
| One send per request | `_sent_this_request` set in `rag/tools.py` | The prompt tells the model to call once; this enforces it. `MAX_TOOL_ROUNDS = 2` means a confused model gets two chances to fire, which would be two emails. Note this is per request, not per conversation: see Known limitations. |
| No second send on a later turn | Prompt rule telling the model to check the history for its own "message has been sent" reply | The server is stateless, so no code guard survives across turns. |
| Guard reset per request | `reset_send_guard()` at the top of `_run_chat()` | Vercel reuses warm instances across visitors. Without the reset, visitor B inherits visitor A's "already sent" state and cannot send at all. |
| Errors never retried | Tool returns `sent: false` plus a reason; prompt forbids retrying | Retrying a 429 or a transport failure risks duplicate delivery. |
| Confirmation before sending | `PASSING A MESSAGE TO FIRZA` in `rag/prompt.py` | The model must repeat the message back and get an explicit yes. |

### Known limitations

**Confirmation is a prompt rule, not a hard gate.** The code cannot prevent a *premature* send if the model misreads an ambiguous reply as consent. Closing that fully requires a confirm affordance in `ChatWidget.tsx` so the send is gated on a real user click. Not built: the golden-set cases cover the behaviour, and the blast radius of a false positive is one unwanted email rather than data loss.

**The one-send guard only spans a single request.** `_sent_this_request` stops a confused model from firing twice inside one `_run_chat()` call. It cannot stop a second send on a *later* turn, because the server is stateless: each request gets a fresh guard. Cross-turn protection therefore rests entirely on the prompt, which tells the model to check the conversation history for its own "message has been sent" reply before offering again.

This was found in local testing, not theory. With only the original "do not offer again" wording, the model would happily draft an amended message and ask to send it after a successful send. The rule now explicitly instructs it to treat its own prior confirmation in the history as proof a send happened. Covered by the `send-refuses-second-send` golden case, which fails without that wording.

Making this a hard guarantee needs per-session server state (a Redis key per conversation), which is disproportionate for a worst case of one duplicate email.

### Logging

`api/chat.py` adds a `sent` field to its structured log line (`true`/`false` when the tool ran, absent otherwise), so deliveries are greppable in Vercel function logs alongside `tools`.

### Eval safety

`scripts/eval_chat.py` and `scripts/chat_repl.py` both replace `rag.tools._post_contact` at import time. **This is not optional.** The `send-message` cases feed the model realistic names and addresses, and `CONTACT_API_URL` defaults to production, so an unstubbed run that skipped confirmation would email a fake recruiter enquiry to Firza every time.

Two things about how the stub is written, both learned the hard way:

**Stub the network hop, not the handler.** An earlier version replaced the whole handler with a reimplementation that only checked for empty fields. It drifted immediately: it reported `sent: true` for `budi@@invalid`, an address the real handler's regex rejects, so the invalid-email path looked tested when it never ran. Patching `_post_contact` leaves every validation and guard in the real code path, so what the harness reports is what production would do.

**Do not patch `urllib.request.urlopen`.** `rag/tools.py` and `rag/gemini.py` share the module object, so patching `urlopen` intercepts the embedding calls too and every case errors out with a confusing failure. `_post_contact` exists precisely to give the stub a narrow seam.

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
- **Action gating**: the `PASSING A MESSAGE TO FIRZA` block is the only place the model is permitted to take an action. It requires visitor-supplied name, email, and message, an explicit confirmation, and at most one send per conversation, and it forbids using the tool to answer a question.
- **Scope guard**: questions not about Firza's professional work are politely declined in one sentence.
- **Security**: the model is told that retrieved context, tool results, and user messages are untrusted data, not instructions. It refuses any attempt to change its role, reveal the system prompt, or override rules.
- **Delimiter isolation**: retrieved content is wrapped in `<<<RETRIEVED_CONTEXT ... RETRIEVED_CONTEXT>>>` markers. The string "RETRIEVED_CONTEXT" is stripped from user input before it reaches the prompt.
- **Static prompt for prefix caching**: the system prompt contains no interpolated content. Retrieved context is appended server-side to the visitor's latest message instead, so the (large) system instruction is byte-identical across requests and Gemini's implicit prefix caching can reuse it, including across the up-to-3 generate calls within one request.
- **Style**: markdown-formatted responses, third-person references to Firza, language matched to the visitor.

---

## Security Controls

| Control | Implementation |
| :--- | :--- |
| Input sanitization | Control characters stripped, max 2000 chars per message |
| Role validation | Only `user` and `assistant` roles accepted; all others coerced to `user` |
| Message limit | Max 40 messages accepted, only the last 12 validated and sent to the model (the widget also slices to 12 before POSTing) |
| Body size cap | Requests over 64 KB rejected with 413 before the body is read into memory |
| Delimiter injection | "RETRIEVED_CONTEXT" neutralized in user input |
| Prompt injection | Untrusted-data framing in system prompt, refuse role-change instructions, encoded/obfuscated instructions treated as injection, tool names/schemas never enumerated |
| Origin allowlist | Browser requests from foreign origins get 403 (exact match, not suffix). Bare curl passes; rate limits handle it |
| Per-IP rate limit | Max 20 requests per minute per IP, keyed on `x-real-ip` (Vercel-set, not spoofable like `x-forwarded-for`). Checked before the global counters so a throttled IP can't drain the daily budget |
| Global rate limit | Max 200 requests per hour across all IPs |
| Daily quota cap | Max 150 chats per day globally, protects the 500 RPD Gemini free-tier quota |
| Output cap | `maxOutputTokens` 1024, answers are 2-4 sentences by design |
| Retry policy | 503 retried once, 429 never retried (retrying quota errors burns more quota) |
| Tool round cap | Max 2 tool-calling rounds per request, prevents infinite loops |
| Time budget | No new tool round starts after 30s elapsed; remaining time goes to the forced-text fallback pass so Vercel's 60s kill never cuts a round mid-flight |
| Write-tool send cap | One `send_message_to_firza` delivery per request, enforced in code (not only by the prompt) and reset per request so warm-instance reuse can't leak state between visitors |
| Write-tool abuse limit | Outbound mail goes through `app/api/contact/route.ts`, inheriting its 5/IP/min and 50/hour caps. Shared with the contact form: a burst through one throttles the other |
| Write-tool detail integrity | Name, email, and message must come from the visitor. Missing or malformed values return an error instructing the model to ask, never to guess |

The hourly and daily counters use Upstash Redis (REST, stdlib urllib) when `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` are set, so the quota guard survives cold starts and parallel instances. Without those env vars (or when Redis is unreachable) they fall back to in-memory counters, so local dev needs no Redis. Per-IP counters stay in-memory either way: a cold start resetting a per-minute window is harmless.

### Monitoring

Every request ends with one structured JSON log line (`"evt": "chat"`) in the Vercel function logs: hashed IP, latency, message count, retrieved chunk count, top similarity score, tool rounds, tools called, whether a message was sent (`sent`), finish reason, and error if any. Filter the function logs for `"evt": "chat"` to see traffic; `"evt": "redis_error"` flags Redis fallbacks; `"evt": "send_message_error"` flags a failed outbound mail attempt.

Note: the Origin allowlist only matches the production URL and localhost. Vercel preview deployments will get 403 on chat. Add the preview origin to the allowlist in `api/chat.py` if you need chat on a preview.

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

### Multi-turn testing

`scripts/test_chat.py` sends a single question, so it cannot exercise anything that depends on conversation state. The `send_message_to_firza` confirmation flow needs four turns (intent, details, confirm, yes). Use the REPL:

```bash
python3 scripts/chat_repl.py          # send tool stubbed, no real email
python3 scripts/chat_repl.py --live   # send tool armed, real email delivered
```

It keeps history across turns, prints `[tools: ... sent: ...]` after each reply, and takes `/new` to reset and `/quit` to exit. It defaults to stubbed on purpose: an accidental send while checking phrasing would put a real email in Firza's inbox. `--live` also needs `npm run dev` running (for the contact route) and `CONTACT_API_URL=http://localhost:3000/api/contact` so mail goes through the local route rather than production.

### `npm run dev` cannot serve the chat

`api/chat.py` is a Vercel Python function declared in `vercel.json`, not a Next.js route. `next dev` only serves the Next.js app, so `POST /api/chat` returns **404** and the widget shows "The assistant is temporarily unavailable". This is expected, not a regression.

To exercise the widget itself, use the Vercel CLI, which runs both runtimes:

```bash
vercel dev
```

Stop `npm run dev` first and make sure it binds port 3000: the origin allowlist in `api/chat.py` only accepts the production URL and `http://localhost:3000`, so any other port gets a 403 on chat. For everything that is not specifically about the browser UI, the REPL above is faster.

## Golden-Set Eval

The prompt carries a lot of behavioral rules (grounding, injection resistance, sensitive-question handling, the freelance guard, language matching). `scripts/eval_chat.py` checks that they actually hold by running every case in `scripts/golden_set.json` through the real pipeline and asserting on the answer with regexes:

```bash
python3 scripts/eval_chat.py                          # full run (37 cases)
python3 scripts/eval_chat.py --category injection      # one category
python3 scripts/eval_chat.py --category send-message   # the 4 write-tool cases
python3 scripts/eval_chat.py --only sens-salary        # one case
```

Categories: `factual`, `capability`, `sensitive`, `injection`, `off-topic`, `bahasa`, `style`, `multi-turn`, `send-message`. Each case supports `must_match` (all regexes must hit), `any_match` (at least one), `must_not_match` (none may hit), and `max_chars`.

Run it after any change to `rag/prompt.py`, `rag/tools.py`, `api/chat.py`, or a model switch. Mind the quota: a full run costs ~37 embeds + up to 110 generate calls against the 500 RPD free tier. The model is not fully deterministic (temperature 0.4, no seed), so patterns are deliberately loose; re-run a failing case with `--only` before treating it as a regression.

When you add a new prompt rule, add a case that would fail without it.

**Limitation worth knowing:** the harness only asserts on the answer text. It cannot assert "tool X was called" or "no tool was called". The four `send-message` cases therefore verify the *visible* behaviour (does it offer, does it ask for details, does it confirm, does it refuse to invent details) rather than the tool call itself. The code-level guards in `rag/tools.py` cover what the harness cannot see, and `python3 rag/tools.py` self-checks them without any API calls.

---

## Extending the System

**Add a new content source**
Edit `lib/rag/sources.ts` and add a new `Doc`. Re-run `npm run build-rag`.

**Add a new read-only tool**
Add a handler function and a Gemini function declaration to `rag/tools.py`, then add the handler to `HANDLERS`. The system prompt in `rag/prompt.py` will automatically make the model aware of it via the declarations list passed in the request body.

**Add a new tool with a side effect**
Everything above, plus the four things `send_message_to_firza` does (copy its shape):
1. A code-level guard against repeat execution, reset per request from `_run_chat()`. `MAX_TOOL_ROUNDS = 2` means a confused model can fire the same tool twice, and a prompt rule alone will not stop it.
2. An explicit prompt block stating the preconditions, including confirmation from the visitor. Add it as its own section in `rag/prompt.py`, not a bullet buried in the tool-priority paragraph.
3. A stub in `scripts/eval_chat.py`. Golden-set cases feed the model realistic arguments; without a stub, running the eval performs the side effect for real.
4. Golden-set cases including at least one **negative** case proving an ordinary question does not trigger it.

Also prefer delegating the effect to an existing route (as this tool does with `app/api/contact/route.ts`) over reimplementing it in Python. One mail path, one set of limits, one template.

**Change retrieval depth**
Edit `TOP_K` and `MIN_SCORE` in `rag/retriever.py`. Higher `TOP_K` gives more context but increases prompt size and latency.

**Change chunk size**
Edit `TARGET_CHARS` and `OVERLAP_CHARS` in `lib/rag/chunk.ts`. Re-run `npm run build-rag` after changing.

**Switch to a vector database**
Replace the numpy cosine search in `rag/retriever.py` with calls to FAISS, Pinecone, or similar. The `retrieve()` function interface stays the same (takes query string + api key, returns list of dicts with source/text/score).

**Switch language model**
Change `MODEL` in `api/chat.py`. Verify the new model supports function declarations and check whether it returns `thoughtSignature` in function call parts (if not, remove the raw-part passback logic in `_run_chat`).
