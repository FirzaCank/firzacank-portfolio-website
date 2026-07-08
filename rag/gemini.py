"""Gemini API calls: query embedding and the streaming tool-calling chat loop.

Uses the REST API directly (no SDK) to keep the Vercel Python bundle small.
The chat loop lets Gemini decide which portfolio tools to call, runs them, feeds
the results back, and streams the final answer token by token.
"""

import json
import time
import urllib.request
import urllib.error

_BASE = "https://generativelanguage.googleapis.com/v1beta/models"
EMBED_MODEL = "gemini-embedding-001"
EMBED_DIM = 768  # must match the dimension the index was built with


def _post(url: str, payload: dict, api_key: str):
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode(),
        headers={"Content-Type": "application/json", "x-goog-api-key": api_key},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode())


def embed_query(text: str, api_key: str) -> list:
    """Embed a search query. RETRIEVAL_QUERY task type makes query and document
    embeddings asymmetric, which improves retrieval accuracy."""
    url = f"{_BASE}/{EMBED_MODEL}:embedContent"
    payload = {
        "model": f"models/{EMBED_MODEL}",
        "content": {"parts": [{"text": text}]},
        "taskType": "RETRIEVAL_QUERY",
        "outputDimensionality": EMBED_DIM,
    }
    data = _post(url, payload, api_key)
    values = data.get("embedding", {}).get("values")
    if not values:
        raise RuntimeError("embed response missing values")
    return values


def stream_generate(model: str, body: dict, api_key: str):
    """Collect a full generateContent response and yield parts.

    Uses SSE streaming for transport but buffers all chunks before yielding,
    because Gemini interleaves thoughtSignature/functionCall/text across chunks
    and we need the full picture before handing off to the tool-calling loop.

    Yields dicts: {"text": str}, {"function_call": {...}}, or {"finish": str}.
    """
    url = f"{_BASE}/{model}:streamGenerateContent?alt=sse"
    req = urllib.request.Request(
        url,
        data=json.dumps(body).encode(),
        headers={"Content-Type": "application/json", "x-goog-api-key": api_key},
        method="POST",
    )
    all_parts = []  # raw parts including thoughtSignature, preserved for round-2 passback
    finish_reason = None

    for attempt in range(2):
        try:
            with urllib.request.urlopen(req, timeout=25) as resp:
                buf = ""
                for raw in resp:
                    buf += raw.decode()
                    for line in buf.split("\n"):
                        line = line.strip()
                        if not line.startswith("data:"):
                            continue
                        chunk = line[5:].strip()
                        if not chunk or chunk == "[DONE]":
                            continue
                        try:
                            parsed = json.loads(chunk)
                        except json.JSONDecodeError:
                            continue
                        candidate = (parsed.get("candidates") or [{}])[0]
                        for part in candidate.get("content", {}).get("parts", []):
                            if "text" in part or "functionCall" in part or "thoughtSignature" in part:
                                all_parts.append(part)
                        fr = candidate.get("finishReason")
                        if fr and fr != "OTHER":
                            finish_reason = fr
                    buf = ""
            break  # success
        except urllib.error.HTTPError as e:
            # retry 503 (transient overload) only; retrying 429 just burns more quota
            if e.code == 503 and attempt == 0:
                time.sleep(2)
                continue
            raise

    for part in all_parts:
        if "text" in part and part["text"]:
            yield {"text": part["text"]}
        elif "functionCall" in part:
            # yield the full raw part so caller can pass thoughtSignature back
            yield {"function_call": part["functionCall"], "_raw_part": part}

    if finish_reason:
        yield {"finish": finish_reason}
