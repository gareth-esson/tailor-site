#!/usr/bin/env python3
"""Render the legacy-site copy audit as a single committable markdown file.

Reads docs/legacy-site-copy.pages.json (produced by parse-legacy-wxr.py) and
writes docs/Legacy_Site_Copy_Audit.md — an overview table plus per-page
sections with the extracted copy and the proposed remap to the new IA.
"""
from __future__ import annotations

import json
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "docs" / "legacy-site-copy.pages.json"
OUT = ROOT / "docs" / "Legacy_Site_Copy_Audit.md"


def render_blocks(blocks: list[dict]) -> str:
    lines: list[str] = []
    for b in blocks:
        kind = b["kind"]
        text = b["text"]
        if kind == "heading":
            lines.append(f"**{text}**")
            lines.append("")
        elif kind == "button":
            lines.append(f"`[button]` {text}")
            lines.append("")
        elif kind == "cta":
            lines.append(f"`[cta]` {text}")
            lines.append("")
        elif kind == "quote":
            lines.append(f"> {text}")
            lines.append("")
        elif kind == "quote-attribution":
            lines.append(f"> — *{text}*")
            lines.append("")
        elif kind == "list":
            lines.append(text)
            lines.append("")
        else:
            lines.append(text)
            lines.append("")
    return "\n".join(lines).strip()


def main() -> None:
    pages = json.loads(SRC.read_text(encoding="utf-8"))

    out: list[str] = []
    out.append("# Legacy site copy audit — tailoreducation.org.uk")
    out.append("")
    out.append(
        "*Full copy extracted from the live WordPress site as of 10 April 2026, "
        "scoped to published pages only. Blog posts, topic pages (WordPress "
        "`project` CPT under `/topic/`), and anonymous questions are intentionally "
        "excluded per the current remap brief — those come from Notion on the new site.*"
    )
    out.append("")
    out.append(
        "*Source of truth: `docs/legacy-site-export/tailoreducation.WordPress.2026-04-10.xml` "
        "(WordPress 6.9.4 WXR). Regenerate via `python3 scripts/parse-legacy-wxr.py && "
        "python3 scripts/build-legacy-audit-md.py`.*"
    )
    out.append("")

    # Headline findings
    out.append("## Headline findings")
    out.append("")
    out.append(
        "- **Only 19 pages total** (17 published, 2 draft). The legacy site's heavy lifting is "
        "done by the `project` CPT (topic pages, 37 of them) and an anonymous-question system that "
        "is not exported by the WordPress WXR at all — likely a plugin-stored custom data store. "
        "For this audit those are out of scope."
    )
    out.append(
        "- **Site is authored in Divi** (Elegant Themes page builder). Every page's content is a "
        "soup of `[et_pb_*]` shortcodes, so the extraction here walks Divi content blocks and "
        "attributes in document order to rebuild the reading-order copy. Quality varies — pages "
        "that lean heavily on Divi modules with dynamic content (Glossary, Blog, The Question "
        "Collection) come out thin because the module output isn't stored as authored copy."
    )
    out.append(
        "- **The site is visibly out of date.** The Contact page footer reads `© 2019 Tailor Education`. "
        "The Privacy Policy is still in **draft**. The standalone `sex-relationships-education` page "
        "(acting as homepage) was authored before the current Tailor Teach / Okay to Ask split."
    )
    out.append(
        "- **`RSE for Vulnerable Young People` is an empty placeholder** on the live site — the "
        "only content in `[et_pb_text]` is blank. It's referenced in the nav menu but has nothing "
        "to read. Flagged as *Merge* into `/services/rse-for-send-and-ap` on the new site."
    )
    out.append(
        "- **Five service pages** on the legacy site collapse to **three** on the new site: Primary "
        "and Secondary keep their own pages; Special, Alternative Provision and Vulnerable YP merge "
        "into the new SEND & AP service page (Circuits)."
    )
    out.append(
        "- **Two near-duplicate training pages**: the standalone `/training` ('Training & Consultancy', "
        "490 words) and `/rse-training` ('RSE Training', 491 words) have almost identical length and "
        "overlapping content. Both remap to the new `/services/rse-training`. Pick the stronger "
        "source copy during rewrite."
    )
    out.append(
        "- **`/universities-and-fe` and `/events` have no equivalent** in the new site's IA — flagged "
        "*Investigate* for a keep/retire decision."
    )
    out.append(
        "- **The Question Collection page** (`/anonymous-questions-about-sex-relationships`) is the "
        "legacy equivalent of the new `/questions/` Okay to Ask landing. Only 83 words of authored "
        "copy — the rest of the page was a dynamic question grid."
    )
    out.append("")

    # Overview table
    out.append("## Overview — all 19 pages")
    out.append("")
    out.append("| # | Title | Slug | Status | Words | Role | Remap | Proposed new URL |")
    out.append("|---|---|---|---|---|---|---|---|")
    for i, p in enumerate(pages, 1):
        out.append(
            f"| {i} | {p['title']} | `{p['slug']}` | {p['status']} | {p['word_count']} | "
            f"{p['guessed_role']} | {p['remap_status']} | `{p['proposed_new_url']}` |"
        )
    out.append("")

    # Legend
    out.append("### Remap status legend")
    out.append("")
    out.append(
        "- **Keep** — copy is still fit for purpose, lift-and-shift with light edits.\n"
        "- **Rewrite** — page has a clear equivalent on the new site, but the copy needs rewriting "
        "against the current brand and audience split (Tailor Teach for teachers, Okay to Ask for YP).\n"
        "- **Merge** — two or more legacy pages collapse into a single new page. Source the best bits "
        "from each.\n"
        "- **Retire** — no equivalent on the new site and no reason to keep the copy.\n"
        "- **Investigate** — unclear whether the page has an equivalent, needs a product decision."
    )
    out.append("")

    # Per-page sections
    out.append("## Page detail")
    out.append("")
    out.append(
        "Each section below has the page metadata, the proposed remap, and the extracted copy "
        "in document order. Copy blocks are labelled by kind so reviewers can skim structure: "
        "**bold** = heading, ``[button]`` = button text, ``[cta]`` = CTA block title, "
        "`> quote` = testimonial, plain text = body paragraph."
    )
    out.append("")

    for p in pages:
        title = p["title"]
        slug = p["slug"] or "(no slug)"
        out.append(f"### {title}")
        out.append("")
        out.append(
            f"- **Legacy URL:** {p['link']}\n"
            f"- **Slug:** `{slug}`\n"
            f"- **Status:** {p['status']}\n"
            f"- **Last modified (GMT):** {p['post_modified'] or '—'}\n"
            f"- **Word count:** {p['word_count']}\n"
            f"- **Role (guessed):** {p['guessed_role']}\n"
            f"- **Proposed new URL:** `{p['proposed_new_url']}`\n"
            f"- **Remap status:** **{p['remap_status']}**"
        )
        if p["seo_title"]:
            out.append(f"- **SEO title:** {p['seo_title']}")
        if p["meta_description"]:
            out.append(f"- **Meta description:** {p['meta_description']}")
        out.append("")
        out.append("#### Extracted copy")
        out.append("")
        if p["copy_blocks"]:
            out.append(render_blocks(p["copy_blocks"]))
        else:
            out.append("*No copy extracted — the page appears to be empty on the legacy site or "
                       "its content lives in a Divi module that doesn't store authored copy (e.g. "
                       "a dynamic archive).*")
        out.append("")
        out.append("---")
        out.append("")

    out.append(f"*Audit generated {datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')} "
               f"from `docs/legacy-site-copy.pages.json`.*")
    out.append("")

    OUT.write_text("\n".join(out), encoding="utf-8")
    print(f"wrote {OUT} ({len(pages)} pages, {OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
