"""Interactive multi-turn REPL for the chat handler.

test_chat.py sends one question and exits, which cannot exercise anything that
needs conversation state (the send_message_to_firza confirmation flow needs
four turns). This keeps the history and loops.

Run:  python3 scripts/chat_repl.py           # send tool stubbed, no real email
      python3 scripts/chat_repl.py --live    # send tool armed, real email sent

Commands inside the REPL:  /new  reset history      /quit  exit
"""

import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from api.chat import _run_chat
import rag.tools

LIVE = "--live" in sys.argv

if not LIVE:
    # Default to stubbed: an accidental send during a UI-less test run still
    # lands a real email in Firza's inbox, and that is a surprising cost for
    # something you ran to check phrasing. Pass --live when you actually want
    # to verify end-to-end delivery.
    #
    # The stub reuses the real handler's validation and only replaces the HTTP
    # call. A stub that reimplements the checks drifts from the real one and
    # then lies: an earlier version skipped the email-format regex and happily
    # reported sent: true for "budi@@invalid", which the real handler rejects.
    # Replace only the outbound POST, so every validation and guard in the real
    # handler still runs and what the REPL reports matches production. Patching
    # urllib.request.urlopen instead would also hit rag/gemini.py, which shares
    # the module, and break embedding.
    import json as _json

    def _stub_post(payload_bytes):
        sent = _json.loads(payload_bytes.decode())
        print(f"\n  [STUB] would email Firza: {sent['name']} <{sent['email']}> topic={sent['topic']!r}")

    rag.tools._post_contact = _stub_post


def load_key():
    key = os.environ.get("GEMINI_API_KEY")
    if key:
        return key
    env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env.local")
    if os.path.exists(env_path):
        for line in open(env_path):
            line = line.strip()
            if line.startswith("GEMINI_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    return None


api_key = load_key()
if not api_key:
    print("ERROR: GEMINI_API_KEY not found in env or .env.local")
    sys.exit(1)

mode = "LIVE (real emails will be sent)" if LIVE else "stubbed (no email will be sent)"
print(f"Chat REPL. Send tool: {mode}.")
print("Type /new to reset the conversation, /quit to exit.\n")

messages = []
while True:
    try:
        text = input("you> ").strip()
    except (EOFError, KeyboardInterrupt):
        print()
        break
    if not text:
        continue
    if text == "/quit":
        break
    if text == "/new":
        messages = []
        print("(history cleared)\n")
        continue

    messages.append({"role": "user", "content": text})
    stats = {}
    print("bot> ", end="", flush=True)
    reply = ""
    for chunk in _run_chat(messages, api_key, stats):
        print(chunk, end="", flush=True)
        reply += chunk
    print()
    messages.append({"role": "assistant", "content": reply})

    tools = stats.get("tools") or []
    sent = stats.get("sent")
    if tools or sent is not None:
        print(f"  [tools: {tools or 'none'}  sent: {sent}]")
    print()
