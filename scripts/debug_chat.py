"""Print raw Gemini SSE responses to diagnose low-level API errors.

Runs two rounds against the production model: the user question, then a
simulated tool result passback. Only for debugging the wire format; for
behavior checks use test_chat.py or eval_chat.py.
"""
import json, os, sys, urllib.request, urllib.error
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from api.chat import MODEL
from rag.tools import DECLARATIONS, run_tool
from rag.prompt import system_prompt

env = open(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env.local")).read()
key = [l.split("=", 1)[1].strip().strip('"').strip("'") for l in env.splitlines() if l.startswith("GEMINI_API_KEY=")][0]


def do_round(contents, label):
    body = {
        "systemInstruction": {"parts": [{"text": system_prompt()}]},
        "contents": contents,
        "tools": [{"functionDeclarations": DECLARATIONS}],
        "generationConfig": {"temperature": 0.4, "maxOutputTokens": 2048},
    }
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:streamGenerateContent?alt=sse"
    # key goes in the header, never the URL: query strings leak into logs and shell history
    req = urllib.request.Request(
        url,
        data=json.dumps(body).encode(),
        headers={"Content-Type": "application/json", "x-goog-api-key": key},
        method="POST",
    )
    print(f"\n=== {label} raw SSE ===")
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            for raw in r:
                line = raw.decode().strip()
                if line.startswith("data:"):
                    print(line[:300])
    except urllib.error.HTTPError as e:
        print("ERROR:", e.code, e.read().decode()[:500])


# Round 1
contents = [{"role": "user", "parts": [{"text": "project tahun 2026?"}]}]
do_round(contents, "Round 1 - user question")

# Simulate tool call result (what Gemini returned in round 1)
fc_name = "search_projects"
fc_args = {"year": "2026"}
tool_result = run_tool(fc_name, fc_args)
print(f"\nTool result: {json.dumps(tool_result)[:300]}")

contents2 = contents + [
    {"role": "model", "parts": [{"functionCall": {"name": fc_name, "args": fc_args, "id": "test_id"}}]},
    {"role": "user", "parts": [{"functionResponse": {"name": fc_name, "response": tool_result}}]},
]
do_round(contents2, "Round 2 - after tool result")
