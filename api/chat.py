"""Vercel Python handler: validate input, RAG retrieve, run Gemini tool-calling loop, stream reply."""

import json
import os
import time
import urllib.error
from http.server import BaseHTTPRequestHandler

import sys

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from rag.gemini import stream_generate
from rag.retriever import retrieve, format_context
from rag.prompt import system_prompt
from rag.tools import DECLARATIONS, run_tool

MODEL = "gemini-2.5-flash"
MAX_HISTORY = 12
MAX_MSG_CHARS = 2000
MAX_MSGS = 40
MAX_TOOL_ROUNDS = 2  # cap tool-call loops so a confused model can't spin forever

# ponytail: in-memory counters, reset on cold start. Fine for a portfolio.
# Move to Upstash/Redis only if persistent cross-instance limits are needed.
_ip_hits = {}
_global = {"count": 0, "reset_at": 0.0}


def _ip_limited(ip: str) -> bool:
    now = time.time()
    entry = _ip_hits.get(ip)
    if not entry or now > entry["reset_at"]:
        _ip_hits[ip] = {"count": 1, "reset_at": now + 60}
        return False
    if entry["count"] >= 20:
        return True
    entry["count"] += 1
    return False


def _global_limited() -> bool:
    now = time.time()
    if now > _global["reset_at"]:
        _global["count"] = 0
        _global["reset_at"] = now + 3600
    if _global["count"] >= 200:
        return True
    _global["count"] += 1
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
    for m in raw_msgs:
        if not isinstance(m, dict):
            continue
        role = "assistant" if m.get("role") == "assistant" else "user"
        content = _sanitize(m.get("content"))
        if content.strip():
            out.append({"role": role, "content": content})
    return out or None


def _to_gemini_contents(messages):
    return [
        {"role": "model" if m["role"] == "assistant" else "user", "parts": [{"text": m["content"]}]}
        for m in messages[-MAX_HISTORY:]
    ]


def _run_chat(messages, api_key):
    """Yield answer text chunks, running the tool-calling loop up to MAX_TOOL_ROUNDS."""
    last_user = next((m["content"] for m in reversed(messages) if m["role"] == "user"), "")
    try:
        hits = retrieve(last_user, api_key)
        context = format_context(hits)
    except Exception as e:  # retrieval failure shouldn't 500 the whole chat
        print(f"Retrieval failed: {e}")
        context = "(No relevant information found in the portfolio.)"

    contents = _to_gemini_contents(messages)

    for _ in range(MAX_TOOL_ROUNDS):
        body = {
            "systemInstruction": {"parts": [{"text": system_prompt(context)}]},
            "contents": contents,
            "tools": [{"functionDeclarations": DECLARATIONS}],
            "generationConfig": {
                "temperature": 0.4,
                "maxOutputTokens": 2048,
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
            result = run_tool(fc.get("name", ""), fc.get("args", {}))
            contents.append(
                {
                    "role": "user",
                    "parts": [{"functionResponse": {"name": fc.get("name", ""), "response": result}}],
                }
            )
        # loop again so the model can answer from the tool results

    # Exhausted tool rounds without a final text answer.
    if not produced_text:
        yield "Sorry, I couldn't complete that lookup. Please try rephrasing or contact Firza directly."


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            return self._json(500, {"error": "GEMINI_API_KEY not configured on the server."})

        if _global_limited():
            return self._json(429, {"error": "The assistant is getting a lot of traffic right now. This is temporary — please try again in a few minutes."})
        ip = (self.headers.get("x-forwarded-for") or "unknown").split(",")[0].strip()
        if _ip_limited(ip):
            return self._json(429, {"error": "You've sent a few messages quickly. Please wait a moment and try again."})

        try:
            length = int(self.headers.get("content-length", 0))
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
        try:
            for chunk in _run_chat(messages, api_key):
                self.wfile.write(chunk.encode())
                self.wfile.flush()
        except urllib.error.HTTPError as e:
            print(f"Chat error: HTTP Error {e.code}: {e.reason}")
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
            print(f"Chat error: {e}")
            try:
                self.wfile.write(b"\n\nSomething went wrong on my end. Feel free to explore the Projects or Experience pages, or reach out via the Contact page.")
            except OSError:
                pass

    def _json(self, status, obj):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(obj).encode())
