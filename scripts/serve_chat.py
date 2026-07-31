"""Serve api/chat.py locally so the browser widget can talk to it.

Why this exists: api/chat.py is a Vercel Python function, so `next dev` returns
404 for POST /api/chat, and `vercel dev` only runs the Python runtime reliably
when the project is linked (and even then it is fragile on macOS with pyenv).
This runs the same handler class over stdlib http.server, no Vercel involved.

Run:  python3 scripts/serve_chat.py            # port 8000
      python3 scripts/serve_chat.py --port 8001

Then point the widget at it. In .env.local:
      NEXT_PUBLIC_CHAT_API_URL=http://localhost:8000/api/chat
and restart `npm run dev`.

CORS is allowed for localhost:3000 only, matching the widget's dev origin.
"""

import argparse
import os
import sys
from http.server import HTTPServer

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

# Load .env.local before importing the handler: it reads GEMINI_API_KEY at
# request time from os.environ, and there is no dotenv dependency here.
_env = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env.local")
if os.path.exists(_env):
    for _line in open(_env):
        _line = _line.strip()
        if not _line or _line.startswith("#") or "=" not in _line:
            continue
        _k, _v = _line.split("=", 1)
        os.environ.setdefault(_k.strip(), _v.strip().strip('"').strip("'"))

from api.chat import handler as ChatHandler

DEV_ORIGIN = "http://localhost:3000"


class LocalChatHandler(ChatHandler):
    """The production handler plus the CORS preflight a browser needs.

    Vercel terminates same-origin requests so api/chat.py never needs CORS.
    Here the page is on :3000 and this server is on another port, so the
    browser sends an OPTIONS preflight and requires the headers below.
    """

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", DEV_ORIGIN)
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Max-Age", "86400")
        self.end_headers()

    def end_headers(self):
        # inject on every response, including the streamed 200
        self.send_header("Access-Control-Allow-Origin", DEV_ORIGIN)
        super().end_headers()


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--port", type=int, default=8000)
    args = ap.parse_args()

    if not os.environ.get("GEMINI_API_KEY"):
        print("ERROR: GEMINI_API_KEY not found in env or .env.local")
        sys.exit(1)

    print(f"chat handler on http://localhost:{args.port}/api/chat")
    print(f"point the widget there with NEXT_PUBLIC_CHAT_API_URL, then restart npm run dev")
    HTTPServer(("127.0.0.1", args.port), LocalChatHandler).serve_forever()
