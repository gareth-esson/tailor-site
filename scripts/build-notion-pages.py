#!/usr/bin/env python3
"""Emit the `pages` array for notion-create-pages, one batch at a time.

Usage: build-notion-pages.py <batch_index> <batch_size>

Reads docs/legacy-site-copy.pages.json and prints a JSON array of page objects
(each with properties and content) sized to the requested slice. The array is
ready to paste into a notion-create-pages MCP call.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "docs" / "legacy-site-copy.pages.json"

# Map the parser's guessed_role → Notion Role option (must match the DB schema)
ROLE_TO_NOTION = {
    "Homepage (candidate)": "Homepage",
    "About": "About",
    "Schools hub (legacy)": "Schools hub",
    "Service — Primary": "Service",
    "Service — Secondary": "Service",
    "Service — Special": "Service",
    "Service — AP": "Service",
    "Service — Vulnerable YP": "Service",
    "RSE Training": "Training",
    "Training (legacy)": "Training",
    "Universities & FE": "Universities & FE",
    "Events": "Events",
    "Topics hub": "Topics hub",
    "Okay to Ask landing": "Okay to Ask landing",
    "Glossary hub": "Glossary hub",
    "Blog index": "Blog index",
    "Contact": "Contact",
    "Privacy policy": "Legal",
    "Dev/Style page": "Dev/Style",
    "Other": "Other",
}


def render_body(page: dict) -> str:
    """Build the Notion page body — a stub pointing at the full markdown audit.

    The full extracted copy for every page lives in the committed markdown
    audit at docs/Legacy_Site_Copy_Audit.md. Keeping the Notion row body light
    avoids 19 MCP round-trips and makes the DB work as a lightweight index.
    """
    slug = page["slug"] or "(no slug)"
    return (
        f"This row is an index entry. The full extracted legacy copy for this "
        f"page lives in `docs/Legacy_Site_Copy_Audit.md` in the repo, under the "
        f"section for **{page['title']}** (`{slug}`).\n\n"
        f"**Legacy URL:** {page['link']}\n\n"
        f"**Proposed remap:** `{page['proposed_new_url']}` — **{page['remap_status']}**\n\n"
        f"*Use this DB to track review progress and capture notes. Use the markdown "
        f"audit to read and edit the actual legacy copy.*"
    )


def build_page(page: dict) -> dict:
    role = ROLE_TO_NOTION.get(page["guessed_role"], "Other")
    status = "Published" if page["status"] == "publish" else "Draft"

    properties = {
        "Page title": page["title"],
        "Old URL": page["link"],
        "Slug": page["slug"] or "",
        "Status": status,
        "Role": role,
        "Remap": page["remap_status"],
        "Proposed new URL": page["proposed_new_url"],
        "Word count": page["word_count"],
        "SEO title": page.get("seo_title", "") or "",
        "Meta description": page.get("meta_description", "") or "",
        "Review": "Not started",
    }
    # Last modified — strip time, keep YYYY-MM-DD
    if page.get("post_modified"):
        date_str = page["post_modified"][:10]
        properties["date:Last modified:start"] = date_str
        properties["date:Last modified:end"] = None
        properties["date:Last modified:is_datetime"] = 0

    return {
        "properties": properties,
        "content": render_body(page),
    }


def main() -> None:
    if len(sys.argv) < 3:
        print("usage: build-notion-pages.py <batch_index> <batch_size>", file=sys.stderr)
        sys.exit(2)
    batch_index = int(sys.argv[1])
    batch_size = int(sys.argv[2])
    pages = json.loads(SRC.read_text(encoding="utf-8"))
    slice_pages = pages[batch_index * batch_size : (batch_index + 1) * batch_size]
    out = [build_page(p) for p in slice_pages]
    # Compact JSON so it fits in one tool result
    print(json.dumps(out, ensure_ascii=False))


if __name__ == "__main__":
    main()
