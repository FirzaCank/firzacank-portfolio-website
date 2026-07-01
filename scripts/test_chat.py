"""Quick local test for the Python RAG chat handler.

Bypasses HTTP entirely — calls _run_chat() directly and prints the streamed response.
Run with: python scripts/test_chat.py
"""

import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from api.chat import _run_chat

question = sys.argv[1] if len(sys.argv) > 1 else "project Firza tahun 2026 apa saja?"
messages = [{"role": "user", "content": question}]

api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    # try loading from .env.local
    env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env.local")
    if os.path.exists(env_path):
        for line in open(env_path):
            line = line.strip()
            if line.startswith("GEMINI_API_KEY="):
                api_key = line.split("=", 1)[1].strip().strip('"').strip("'")
                break

if not api_key:
    print("ERROR: GEMINI_API_KEY not found in env or .env.local")
    sys.exit(1)

print(f"Q: {question}\nA: ", end="", flush=True)
for chunk in _run_chat(messages, api_key):
    print(chunk, end="", flush=True)
print()
