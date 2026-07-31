"""Golden-set eval for the RAG chat pipeline.

Runs every case in scripts/golden_set.json through _run_chat() (no HTTP) and
checks the answer against regex assertions. Exit code 1 if anything fails.

Usage:
    python3 scripts/eval_chat.py                    # run all cases
    python3 scripts/eval_chat.py --category injection
    python3 scripts/eval_chat.py --only sens-salary
    python3 scripts/eval_chat.py --verbose          # print full answers
    python3 scripts/eval_chat.py --sleep 10         # slow down for rate limits

Heads up: each case costs 1 embed + up to 3 generate calls against the Gemini
free-tier quota (500 RPD). A full run of ~30 cases uses a noticeable chunk of
the daily budget, so don't run it in a tight loop. The default sleep keeps the
run under the free-tier requests-per-minute limit.

The model runs at temperature 0.4 without a seed, so answers vary between
runs. Assertions are written loosely (case-insensitive, alternatives) to
tolerate that; an occasional flaky failure means the pattern is too tight or
the prompt rule is genuinely unreliable. Re-run the single case with --only
before concluding either way.
"""

import argparse
import json
import os
import re
import sys
import time

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from api.chat import _run_chat
import rag.tools

GOLDEN_PATH = os.path.join(os.path.dirname(__file__), "golden_set.json")

# The send-message cases feed the model real-looking names and addresses. If it
# skips the confirmation step, send_message_to_firza would POST to production
# and put a fake recruiter email in Firza's inbox. Stub the outbound call so an
# eval run can never send mail: the tool still validates and still reports
# sent: true, so the assertions exercise the same paths.
_sends = []

_real_send = rag.tools.send_message_to_firza


def _stub_post(payload_bytes):
    """Stand in for the POST to the contact route. Records instead of sending."""
    _sends.append(json.loads(payload_bytes.decode()))


# Replace only the outbound POST, never the validation. A stub that
# reimplements the checks drifts from the real handler and then lies about what
# production would do: an earlier version skipped the email-format regex and
# reported sent: true for addresses the real handler rejects.
#
# Patching rag.tools._post_contact (not urllib.request.urlopen) keeps the reach
# narrow. urlopen is shared with rag/gemini.py, so patching it there breaks
# embedding and every case errors out.
rag.tools._post_contact = _stub_post
rag.tools.HANDLERS["send_message_to_firza"] = _real_send


def load_api_key():
    api_key = os.environ.get("GEMINI_API_KEY")
    if api_key:
        return api_key
    env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env.local")
    if os.path.exists(env_path):
        for line in open(env_path):
            line = line.strip()
            if line.startswith("GEMINI_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    return None


def check(case, answer):
    """Return a list of failure descriptions (empty = pass)."""
    failures = []
    for pattern in case.get("must_match", []):
        if not re.search(pattern, answer, re.IGNORECASE):
            failures.append(f"must_match missed: /{pattern}/")
    any_patterns = case.get("any_match", [])
    if any_patterns and not any(re.search(p, answer, re.IGNORECASE) for p in any_patterns):
        failures.append(f"any_match: none of {any_patterns} matched")
    for pattern in case.get("must_not_match", []):
        if re.search(pattern, answer, re.IGNORECASE):
            failures.append(f"must_not_match hit: /{pattern}/")
    max_chars = case.get("max_chars")
    if max_chars and len(answer) > max_chars:
        failures.append(f"too long: {len(answer)} chars > {max_chars}")
    return failures


def main():
    parser = argparse.ArgumentParser(description="Run the chat golden-set eval.")
    parser.add_argument("--only", help="run a single case by id")
    parser.add_argument("--category", help="run only cases in this category")
    parser.add_argument("--sleep", type=float, default=6.0, help="seconds between cases (default 6)")
    parser.add_argument("--verbose", action="store_true", help="print full answers")
    args = parser.parse_args()

    api_key = load_api_key()
    if not api_key:
        print("ERROR: GEMINI_API_KEY not found in env or .env.local")
        sys.exit(1)

    with open(GOLDEN_PATH) as f:
        cases = json.load(f)["cases"]

    if args.only:
        cases = [c for c in cases if c["id"] == args.only]
    if args.category:
        cases = [c for c in cases if c["category"] == args.category]
    if not cases:
        print("No cases matched the filter.")
        sys.exit(1)

    passed, failed, errored = [], [], []
    for i, case in enumerate(cases):
        if i > 0 and args.sleep > 0:
            time.sleep(args.sleep)

        messages = case.get("messages") or [{"role": "user", "content": case["question"]}]
        label = f"[{case['category']}] {case['id']}"
        try:
            answer = "".join(_run_chat(messages, api_key))
        except Exception as e:
            errored.append(case["id"])
            print(f"ERROR {label}: {e}")
            continue

        failures = check(case, answer)
        if failures:
            failed.append(case["id"])
            print(f"FAIL  {label}")
            for f_desc in failures:
                print(f"      {f_desc}")
            snippet = answer if args.verbose else answer[:300].replace("\n", " ")
            print(f"      answer: {snippet}")
        else:
            passed.append(case["id"])
            print(f"pass  {label}")
            if args.verbose:
                print(f"      answer: {answer}")

    total = len(cases)
    print(f"\n{len(passed)}/{total} passed" + (f", {len(errored)} errored" if errored else ""))
    if failed:
        print("failed: " + ", ".join(failed))
    if errored:
        print("errored: " + ", ".join(errored))
    sys.exit(1 if (failed or errored) else 0)


if __name__ == "__main__":
    main()
