"""Vercel Python handler: validate input, RAG retrieve, run Gemini tool-calling loop, stream reply."""

import hashlib
import json
import os
import re
import time
import urllib.error
import urllib.request
from http.server import BaseHTTPRequestHandler

import sys

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from rag.gemini import stream_generate
from rag.retriever import retrieve, format_context
from rag.prompt import system_prompt
from rag.tools import DECLARATIONS, run_tool

MODEL = "gemini-3.1-flash-lite"
MAX_HISTORY = 12
MAX_MSG_CHARS = 2000
MAX_MSGS = 40
MAX_BODY_BYTES = 65536  # reject oversized bodies before reading them into memory
MAX_TOOL_ROUNDS = 2  # cap tool-call loops so a confused model can't spin forever
TIME_BUDGET_S = 30  # stop starting new tool rounds past this; Vercel kills the function at 60s

# Upstash Redis (REST) keeps the daily/hourly counters accurate across cold
# starts and parallel instances. Optional: without the env vars (local dev)
# everything falls back to the in-memory counters below.
_UPSTASH_URL = os.environ.get("UPSTASH_REDIS_REST_URL", "")
_UPSTASH_TOKEN = os.environ.get("UPSTASH_REDIS_REST_TOKEN", "")

# In-memory fallback counters, reset on cold start.
_ip_hits = {}
_global = {"count": 0, "reset_at": 0.0}
_daily = {"count": 0, "reset_at": 0.0}  # protects the 500 RPD Gemini free-tier quota


def _ip_limited(ip: str) -> bool:
    now = time.time()
    # evict expired entries so the dict can't grow for the life of the instance
    if len(_ip_hits) > 1000:
        for k in [k for k, v in _ip_hits.items() if now > v["reset_at"]]:
            del _ip_hits[k]
    entry = _ip_hits.get(ip)
    if not entry or now > entry["reset_at"]:
        _ip_hits[ip] = {"count": 1, "reset_at": now + 60}
        return False
    if entry["count"] >= 20:
        return True
    entry["count"] += 1
    return False


def _redis_incr(key: str, ttl: int):
    """INCR key, set TTL on first write. Returns the new count, or None on failure."""
    try:
        req = urllib.request.Request(
            f"{_UPSTASH_URL}/pipeline",
            data=json.dumps([["INCR", key], ["EXPIRE", key, str(ttl), "NX"]]).encode(),
            headers={"Content-Type": "application/json", "Authorization": f"Bearer {_UPSTASH_TOKEN}"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=2) as resp:
            results = json.loads(resp.read().decode())
        return int(results[0]["result"])
    except Exception as e:
        print(json.dumps({"evt": "redis_error", "error": str(e)[:200]}))
        return None


def _global_limited():
    """Return 'daily', 'hourly', or False.

    Uses Redis when configured (survives cold starts and multi-instance
    fan-out, which the Gemini 500 RPD quota actually needs); falls back to
    in-memory counters when Redis is absent or unreachable.
    """
    # each chat = 1 embed + up to 3 generate calls (2 tool rounds + 1 no-tools
    # fallback pass), so 150 chats/day = max 450 generate RPD, under the 500 cap
    if _UPSTASH_URL and _UPSTASH_TOKEN:
        day = time.strftime("%Y%m%d", time.gmtime())
        daily_count = _redis_incr(f"chat:daily:{day}", 86400 + 3600)
        if daily_count is not None:
            if daily_count > 150:
                return "daily"
            hour = time.strftime("%Y%m%d%H", time.gmtime())
            hourly_count = _redis_incr(f"chat:hourly:{hour}", 7200)
            if hourly_count is not None and hourly_count > 200:
                return "hourly"
            return False
        # Redis unreachable: fall through to in-memory so the guard still exists

    now = time.time()
    if now > _global["reset_at"]:
        _global["count"] = 0
        _global["reset_at"] = now + 3600
    if now > _daily["reset_at"]:
        _daily["count"] = 0
        _daily["reset_at"] = now + 86400
    if _daily["count"] >= 150:
        return "daily"
    if _global["count"] >= 200:
        return "hourly"
    _global["count"] += 1
    _daily["count"] += 1
    return False


def _sanitize(s) -> str:
    text = ("" if s is None else str(s))[:MAX_MSG_CHARS]
    # strip control chars and neutralize context-delimiter spoofing
    text = "".join(c for c in text if c == "\n" or c == "\t" or ord(c) >= 0x20)
    return text.replace("RETRIEVED_CONTEXT", "retrieved context")


def _validate(raw_msgs):
    """Return a clean [{role, content}] list, or None if invalid."""
    if not isinstance(raw_msgs, list) or not raw_msgs or len(raw_msgs) > MAX_MSGS:
        return None
    out = []
    # only the last MAX_HISTORY messages reach the model; skip validating the rest
    for m in raw_msgs[-MAX_HISTORY:]:
        if not isinstance(m, dict):
            continue
        role = "assistant" if m.get("role") == "assistant" else "user"
        content = _sanitize(m.get("content"))
        if content.strip():
            out.append({"role": role, "content": content})
    return out or None


_FOLLOWUP_RE = re.compile(
    r"\b(it|that|this|those|these|he|him|his|there|one|more|else|itu|ini|dia|tersebut|lagi|lainnya)\b",
    re.IGNORECASE,
)


def _retrieval_query(messages) -> str:
    """Build the text to embed for retrieval.

    A short or anaphoric follow-up ("tell me more about that") embeds to
    near-noise on its own, so prefix it with the previous user message.
    """
    users = [m["content"] for m in messages if m["role"] == "user"]
    if not users:
        return ""
    last = users[-1]
    if len(users) >= 2 and (len(last) < 40 or _FOLLOWUP_RE.search(last)):
        return f"{users[-2]}\n{last}"
    return last


def _to_gemini_contents(messages, context):
    contents = [
        {"role": "model" if m["role"] == "assistant" else "user", "parts": [{"text": m["content"]}]}
        for m in messages[-MAX_HISTORY:]
    ]
    # Retrieved context rides on the latest user turn instead of the system
    # prompt: the system instruction stays byte-stable across requests (so
    # Gemini's implicit prefix caching can reuse it) and the variable part
    # sits last in the request. _sanitize() already neutralizes the marker
    # string in visitor text, so this block can't be spoofed from the client.
    block = f"\n\n<<<RETRIEVED_CONTEXT\n{context}\nRETRIEVED_CONTEXT>>>"
    for c in reversed(contents):
        if c["role"] == "user":
            c["parts"][0]["text"] += block
            break
    return contents


def _run_chat(messages, api_key, stats=None):
    """Yield answer text chunks, running the tool-calling loop up to MAX_TOOL_ROUNDS.

    `stats` (optional dict) is filled with retrieval/tool metrics for logging.
    """
    stats = stats if stats is not None else {}
    t0 = time.time()
    try:
        hits = retrieve(_retrieval_query(messages), api_key)
        context = format_context(hits)
        stats["chunks"] = len(hits)
        stats["top_score"] = round(hits[0]["score"], 3) if hits else None
    except Exception as e:  # retrieval failure shouldn't 500 the whole chat
        print(f"Retrieval failed: {e}")
        context = "(No relevant information found in the portfolio.)"

    contents = _to_gemini_contents(messages, context)
    stats["tools"] = []

    for round_no in range(MAX_TOOL_ROUNDS):
        stats["rounds"] = round_no + 1
        body = {
            "systemInstruction": {"parts": [{"text": system_prompt()}]},
            "contents": contents,
            "tools": [{"functionDeclarations": DECLARATIONS}],
            "generationConfig": {
                "temperature": 0.4,
                "maxOutputTokens": 1024,  # answers are 2-4 sentences by design; caps abuse of long outputs
            },
        }

        pending_calls = []   # list of (function_call_dict, raw_part_dict)
        produced_text = False
        for item in stream_generate(MODEL, body, api_key):
            if "text" in item:
                produced_text = True
                yield item["text"]
            elif "function_call" in item:
                pending_calls.append((item["function_call"], item.get("_raw_part", {"functionCall": item["function_call"]})))

        if not pending_calls:
            return  # model answered with text only; done

        # Pass all raw model parts back (includes thoughtSignature) — required by Gemini thinking models.
        model_parts = [raw_part for _, raw_part in pending_calls]
        contents.append({"role": "model", "parts": model_parts})

        for fc, _ in pending_calls:
            stats["tools"].append(fc.get("name", ""))
            result = run_tool(fc.get("name", ""), fc.get("args", {}))
            contents.append(
                {
                    "role": "user",
                    "parts": [{"functionResponse": {"name": fc.get("name", ""), "response": result}}],
                }
            )
        # loop again so the model can answer from the tool results — unless
        # we're close enough to Vercel's 60s kill that the fallback pass
        # (25s worst case) is the safer way to spend the remaining time
        if time.time() - t0 > TIME_BUDGET_S:
            break

    # Exhausted tool rounds without a final text answer. Run one last pass with
    # function calling forced off so the model must answer in text from the tool
    # results it already gathered (including empty ones, which the bridging
    # prompt handles). Tools stay declared because the history contains
    # functionCall/functionResponse parts; only the calling mode is disabled.
    # Higher token cap: thinking models spend output tokens reasoning first.
    if not produced_text:
        contents.append(
            {
                "role": "user",
                "parts": [{"text": "(System: tool budget exhausted. Answer the visitor's question now in plain text using the tool results and retrieved context above. Do not call any more tools.)"}],
            }
        )
        body = {
            "systemInstruction": {"parts": [{"text": system_prompt()}]},
            "contents": contents,
            "tools": [{"functionDeclarations": DECLARATIONS}],
            "toolConfig": {"functionCallingConfig": {"mode": "NONE"}},
            "generationConfig": {"temperature": 0.4, "maxOutputTokens": 2048},
        }
        finish = None
        for item in stream_generate(MODEL, body, api_key):
            if "text" in item:
                produced_text = True
                yield item["text"]
            elif "finish" in item:
                finish = item["finish"]
        stats["finish"] = finish
        if not produced_text:
            print(f"Final no-tools pass produced no text, finishReason={finish}")

    if not produced_text:
        yield "Sorry, I couldn't complete that lookup. Please try rephrasing or contact Firza directly."


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        t0 = time.time()
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            return self._json(500, {"error": "GEMINI_API_KEY not configured on the server."})

        # cheap scraper filter: reject browser requests from foreign origins.
        # Bare curl (no Origin) still passes; rate limits handle that case.
        origin = self.headers.get("origin") or ""
        if origin and origin not in ("https://firzacank.vercel.app", "http://localhost:3000"):
            return self._json(403, {"error": "Forbidden."})

        # per-IP check runs first: a throttled IP must not consume the
        # global/daily budget that protects the Gemini quota
        # x-real-ip is set by Vercel and not client-spoofable, unlike x-forwarded-for
        ip = (self.headers.get("x-real-ip") or self.headers.get("x-forwarded-for") or "unknown").split(",")[0].strip()
        if _ip_limited(ip):
            return self._json(429, {"error": "You've sent a few messages quickly. Please wait a moment and try again."})

        limited = _global_limited()
        if limited == "daily":
            return self._json(429, {"error": "The assistant has reached its daily limit. Please come back tomorrow, or reach out via the Contact page."})
        if limited:
            return self._json(429, {"error": "The assistant is getting a lot of traffic right now. This is temporary — please try again in a few minutes."})

        try:
            length = int(self.headers.get("content-length", 0))
            if length > MAX_BODY_BYTES:
                return self._json(413, {"error": "Request too large."})
            raw = json.loads(self.rfile.read(length).decode())
        except (ValueError, json.JSONDecodeError):
            return self._json(400, {"error": "Invalid request body."})

        messages = _validate(raw.get("messages"))
        if not messages:
            return self._json(400, {"error": "messages array required."})

        # Stream the answer as plain text.
        self.send_response(200)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        stats = {}
        error = None
        try:
            for chunk in _run_chat(messages, api_key, stats):
                self.wfile.write(chunk.encode())
                self.wfile.flush()
        except urllib.error.HTTPError as e:
            error = f"HTTP {e.code}: {e.reason}"
            msg = (
                b"\n\nThe AI assistant is taking a short break right now due to high demand. "
                b"Please try again in a few minutes. "
                b"In the meantime, feel free to explore the Projects or Experience pages."
            ) if e.code in (503, 429) else (
                b"\n\nSomething went wrong on my end. "
                b"You can explore the Projects or Experience pages while I sort this out, "
                b"or reach out directly via the Contact page."
            )
            try:
                self.wfile.write(msg)
            except OSError:
                pass
        except Exception as e:
            error = str(e)[:200]
            try:
                self.wfile.write(b"\n\nSomething went wrong on my end. Feel free to explore the Projects or Experience pages, or reach out via the Contact page.")
            except OSError:
                pass

        # one structured line per request: greppable in Vercel logs
        print(json.dumps({
            "evt": "chat",
            "ip": hashlib.sha256(ip.encode()).hexdigest()[:12],
            "latency_ms": int((time.time() - t0) * 1000),
            "msgs": len(messages),
            "chunks": stats.get("chunks"),
            "top_score": stats.get("top_score"),
            "rounds": stats.get("rounds"),
            "tools": stats.get("tools"),
            "finish": stats.get("finish"),
            "error": error,
        }))

    def _json(self, status, obj):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(obj).encode())
