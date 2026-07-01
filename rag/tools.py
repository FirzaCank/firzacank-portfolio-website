"""Portfolio tools the chat model can call.

Each tool has a Gemini function declaration (schema) and a Python handler that
reads the structured data in data/portfolio.json. The model decides which tool
to call from the user's question; app.py runs the handler and feeds the result
back. This is the function/tool-calling layer on top of RAG retrieval.
"""

import json
import os
from functools import lru_cache

_PORTFOLIO_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "portfolio.json")


@lru_cache(maxsize=1)
def _data():
    with open(_PORTFOLIO_PATH, encoding="utf-8") as f:
        return json.load(f)


def _contains(haystack, needle: str) -> bool:
    return needle.lower() in str(haystack).lower()


# ---- handlers -------------------------------------------------------------

def search_projects(query="", year="", category="", stack=""):
    """Filter projects by any combination of free-text query, year, category, stack.
    Returns lightweight summaries (no full case study body)."""
    out = []
    for p in _data()["projects"]:
        if year and str(p["year"]) != str(year):
            continue
        if category and not any(_contains(c, category) for c in p["categories"]):
            continue
        if stack and not any(_contains(s, stack) for s in p["stack"]):
            continue
        if query and not (
            _contains(p["title"], query)
            or _contains(p["subtitle"], query)
            or any(_contains(s, query) for s in p["stack"])
        ):
            continue
        out.append(
            {
                "slug": p["slug"],
                "title": p["title"],
                "subtitle": p["subtitle"],
                "client": p["client"],
                "year": p["year"],
                "categories": p["categories"],
                "stack": p["stack"],
            }
        )
    return {"count": len(out), "projects": out}


def get_project_detail(slug=""):
    """Return the full case study for one project by slug."""
    for p in _data()["projects"]:
        if p["slug"] == slug:
            return {
                "title": p["title"],
                "client": p["client"],
                "year": p["year"],
                "detail": p["detail"],
            }
    return {"error": f"No project with slug '{slug}'."}


def search_experience(company="", current="", internship=""):
    """Filter full-time and internship roles by company, current flag, or internship flag."""
    out = []
    for r in _data()["experience"]:
        if company and not _contains(r["company"], company):
            continue
        if current != "" and bool(r["current"]) != (str(current).lower() == "true"):
            continue
        if internship != "" and bool(r["internship"]) != (str(internship).lower() == "true"):
            continue
        out.append(r)
    return {"count": len(out), "experience": out}


def get_career_timeline():
    """Return all roles ordered earliest to latest for chronological questions."""
    roles = list(_data()["experience"])
    # experience.ts is newest-first, so reverse for chronological order.
    ordered = list(reversed(roles))
    return {
        "timeline": [
            {
                "order": i + 1,
                "title": r["title"],
                "company": r["company"],
                "period": r["period"],
                "internship": r["internship"],
                "current": r["current"],
            }
            for i, r in enumerate(ordered)
        ]
    }


def get_skills(domain=""):
    """Return skill groups, optionally filtered to groups matching a domain keyword."""
    groups = _data()["about"]["skills"]
    if domain:
        groups = [g for g in groups if _contains(g["group"], domain) or any(_contains(i, domain) for i in g["items"])]
    return {"skills": groups}


HANDLERS = {
    "search_projects": search_projects,
    "get_project_detail": get_project_detail,
    "search_experience": search_experience,
    "get_career_timeline": get_career_timeline,
    "get_skills": get_skills,
}


# ---- Gemini function declarations -----------------------------------------

DECLARATIONS = [
    {
        "name": "search_projects",
        "description": "Search Firza's independent and client projects. Filter by free-text query, year, category (e.g. 'Data Engineer', 'AI Engineer', 'Dashboard'), or stack/technology. Use this for any question about his projects or project work.",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Free-text keyword to match against title, subtitle, or stack."},
                "year": {"type": "string", "description": "Filter by year, e.g. '2025'."},
                "category": {"type": "string", "description": "Filter by category label."},
                "stack": {"type": "string", "description": "Filter by a technology in the stack."},
            },
        },
    },
    {
        "name": "get_project_detail",
        "description": "Get the full case study (context, problem, approach, results) for one project by its slug. Call search_projects first to find the slug.",
        "parameters": {
            "type": "object",
            "properties": {"slug": {"type": "string", "description": "The project slug."}},
            "required": ["slug"],
        },
    },
    {
        "name": "search_experience",
        "description": "Search Firza's full-time roles and internships. Filter by company name, whether it's his current role, or whether it's an internship.",
        "parameters": {
            "type": "object",
            "properties": {
                "company": {"type": "string", "description": "Company name to match."},
                "current": {"type": "string", "description": "'true' for only the current role."},
                "internship": {"type": "string", "description": "'true' for only internships, 'false' for only full-time."},
            },
        },
    },
    {
        "name": "get_career_timeline",
        "description": "Get all of Firza's roles in chronological order (earliest to latest). Use for questions about his first job, career start, or full career history.",
        "parameters": {"type": "object", "properties": {}},
    },
    {
        "name": "get_skills",
        "description": "Get Firza's technical skills, optionally filtered to a domain keyword (e.g. 'cloud', 'ML', 'visualization').",
        "parameters": {
            "type": "object",
            "properties": {"domain": {"type": "string", "description": "Optional domain keyword to filter skill groups."}},
        },
    },
]


def run_tool(name: str, args: dict):
    handler = HANDLERS.get(name)
    if not handler:
        return {"error": f"Unknown tool '{name}'."}
    try:
        return handler(**(args or {}))
    except TypeError as e:
        return {"error": f"Bad arguments for '{name}': {e}"}


if __name__ == "__main__":
    # Self-check: data loads, each tool runs, filters actually filter.
    assert _data()["projects"], "no projects loaded"
    assert search_projects()["count"] == len(_data()["projects"]), "empty filter should return all"
    assert search_projects(year="1999")["count"] == 0, "impossible year should return none"
    tl = get_career_timeline()["timeline"]
    assert tl[0]["order"] == 1 and len(tl) == len(_data()["experience"]), "timeline malformed"
    assert "error" in get_project_detail(slug="nope"), "unknown slug should error"
    print(f"OK: {len(HANDLERS)} tools, {len(_data()['projects'])} projects, {len(tl)} roles.")
