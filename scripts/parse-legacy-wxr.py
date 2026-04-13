#!/usr/bin/env python3
"""
Parse the WordPress WXR export of the legacy tailoreducation.org.uk site and
produce structured JSON for the 'page' post_type only.

Scope per request: pages only. Excludes blog posts, topics (the 'project' CPT),
and anonymous questions. Also excludes Divi theme-builder artefacts
(et_pb_layout / et_template / et_header_layout / et_footer_layout / etc.),
attachments, nav menu items, custom CSS, and global styles.

The page content on the legacy site is authored in the Divi page builder, so
the raw WXR <content:encoded> is a soup of [et_pb_*] shortcodes. This script
walks that soup, extracts the actual human-authored copy (text blocks, button
labels, headings, CTA titles) and returns it as an ordered list of copy blocks
per page, plus a single flat plain-text version for quick review.
"""
from __future__ import annotations

import html
import json
import re
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Iterable

WXR_PATH = Path(__file__).resolve().parents[1] / "docs" / "legacy-site-export" / "tailoreducation.WordPress.2026-04-10.xml"
OUT_PATH = Path(__file__).resolve().parents[1] / "docs" / "legacy-site-copy.pages.json"


# ---------------------------------------------------------------------------
# WXR item parsing
# ---------------------------------------------------------------------------

def _cdata(item: str, tag: str) -> str:
    m = re.search(
        rf"<{re.escape(tag)}><!\[CDATA\[(.*?)\]\]></{re.escape(tag)}>",
        item,
        re.DOTALL,
    )
    return m.group(1) if m else ""


def _plain(item: str, tag: str) -> str:
    m = re.search(rf"<{re.escape(tag)}>(.*?)</{re.escape(tag)}>", item, re.DOTALL)
    if not m:
        return ""
    val = m.group(1)
    # strip surrounding CDATA if present
    cdata = re.match(r"\s*<!\[CDATA\[(.*?)\]\]>\s*$", val, re.DOTALL)
    return cdata.group(1) if cdata else val


def iter_items(xml_text: str) -> Iterable[str]:
    for m in re.finditer(r"<item>.*?</item>", xml_text, re.DOTALL):
        yield m.group(0)


# ---------------------------------------------------------------------------
# Divi content extraction
# ---------------------------------------------------------------------------

# Attributes on Divi shortcodes that usually carry user-authored copy. We walk
# each opening shortcode and pull copy out of these keys (in priority order).
TEXT_BEARING_ATTRS = (
    "title",
    "subtitle",
    "heading",
    "header_text",
    "button_text",
    "button_one_text",
    "button_two_text",
    "content",
    "cta_text",
    "quote",
    "pricing_title",
    "pricing_subtitle",
    "portrait_name",
    "position",
    "company_name",
    "body",
)

SELFCLOSING_SHORTCODES = {
    "et_pb_button",
    "et_pb_image",
    "et_pb_divider",
    "et_pb_icon",
}

# Shortcodes we treat as "content blocks" whose inner contents should be
# extracted as body copy.
CONTENT_BLOCK_SHORTCODES = {
    "et_pb_text",
    "et_pb_blurb",
    "et_pb_testimonial",
    "et_pb_cta",
    "et_pb_toggle",
    "et_pb_accordion_item",
    "et_pb_tab",
    "et_pb_post_title",
    "et_pb_fullwidth_header",
    "et_pb_pricing_table",
    "et_pb_number_counter",
    "et_pb_post_slider",
}


SHORTCODE_OPEN_RE = re.compile(r"\[(?P<name>et_pb_[a-z_0-9]+)(?P<attrs>[^\]]*)\]", re.IGNORECASE)
ATTR_RE = re.compile(r'(?P<k>[a-zA-Z_][a-zA-Z_0-9]*)="(?P<v>[^"]*)"')

HTML_TAG_RE = re.compile(r"<[^>]+>")
WHITESPACE_RE = re.compile(r"[ \t]+")
MULTI_NEWLINE_RE = re.compile(r"\n{3,}")


def parse_attrs(attrs_text: str) -> dict[str, str]:
    return {m.group("k"): m.group("v") for m in ATTR_RE.finditer(attrs_text)}


def html_to_text(snippet: str) -> str:
    """Convert a chunk of HTML to readable markdown-ish text.

    We keep paragraph/heading/list structure but drop all attributes. This is
    deliberately lossy — the goal is reviewable copy, not a pixel-perfect
    render.
    """
    s = snippet

    # Normalise line endings and strip Divi-style HTML comments.
    s = s.replace("\r\n", "\n")
    s = re.sub(r"<!--.*?-->", "", s, flags=re.DOTALL)

    # Structural tags → markdown-ish text
    s = re.sub(r"<br\s*/?>", "\n", s, flags=re.IGNORECASE)
    s = re.sub(r"</p\s*>", "\n\n", s, flags=re.IGNORECASE)
    s = re.sub(r"<p[^>]*>", "", s, flags=re.IGNORECASE)
    s = re.sub(r"<h1[^>]*>", "\n\n# ", s, flags=re.IGNORECASE)
    s = re.sub(r"<h2[^>]*>", "\n\n## ", s, flags=re.IGNORECASE)
    s = re.sub(r"<h3[^>]*>", "\n\n### ", s, flags=re.IGNORECASE)
    s = re.sub(r"<h4[^>]*>", "\n\n#### ", s, flags=re.IGNORECASE)
    s = re.sub(r"<h5[^>]*>", "\n\n##### ", s, flags=re.IGNORECASE)
    s = re.sub(r"<h6[^>]*>", "\n\n###### ", s, flags=re.IGNORECASE)
    s = re.sub(r"</h[1-6]\s*>", "\n\n", s, flags=re.IGNORECASE)
    s = re.sub(r"<li[^>]*>", "\n- ", s, flags=re.IGNORECASE)
    s = re.sub(r"</li\s*>", "", s, flags=re.IGNORECASE)
    s = re.sub(r"</?ul[^>]*>", "\n", s, flags=re.IGNORECASE)
    s = re.sub(r"</?ol[^>]*>", "\n", s, flags=re.IGNORECASE)

    # Strip all remaining tags
    s = HTML_TAG_RE.sub("", s)

    # Decode HTML entities
    s = html.unescape(s)

    # Tidy whitespace
    s = WHITESPACE_RE.sub(" ", s)
    s = "\n".join(line.rstrip() for line in s.splitlines())
    s = MULTI_NEWLINE_RE.sub("\n\n", s)
    return s.strip()


@dataclass
class CopyBlock:
    kind: str  # "heading", "paragraph", "button", "cta", "quote", "list", …
    text: str


@dataclass
class Page:
    id: str
    title: str
    slug: str
    link: str
    status: str
    post_date: str
    post_modified: str
    post_parent: str
    menu_order: str
    guessed_role: str  # Homepage candidate / About / Service / … (heuristic)
    proposed_new_url: str  # Heuristic mapping to the new IA
    remap_status: str  # Keep / Rewrite / Merge / Retire / Investigate
    word_count: int
    copy_plain: str
    copy_blocks: list[CopyBlock] = field(default_factory=list)
    seo_title: str = ""
    meta_description: str = ""


def extract_copy_blocks(raw: str) -> list[CopyBlock]:
    """Walk Divi shortcodes in document order and emit CopyBlock entries.

    Two event types contribute to the block stream:
    1. Opening shortcodes — their text-bearing attributes (button_text,
       title, heading, etc.) are emitted at the opening-tag's position.
    2. Content-block shortcodes — their inner contents are emitted at the
       opening-tag's position.

    Events are collected with their source character offset, then sorted so
    the final block list reflects the page's reading order.
    """
    events: list[tuple[int, str, str]] = []  # (pos, kind, text)

    # 1. Attribute copy from every opening shortcode
    for m in SHORTCODE_OPEN_RE.finditer(raw):
        pos = m.start()
        attrs = parse_attrs(m.group("attrs") or "")
        for attr in TEXT_BEARING_ATTRS:
            val = attrs.get(attr, "").strip()
            if not val:
                continue
            val = html.unescape(val)
            if val.startswith("#") or val.startswith("http") or val.startswith("/"):
                continue
            if len(val) < 2:
                continue
            if re.fullmatch(r"[0-9.\-_px%]+", val):
                continue
            kind = {
                "button_text": "button",
                "button_one_text": "button",
                "button_two_text": "button",
                "title": "heading",
                "subtitle": "heading",
                "heading": "heading",
                "header_text": "heading",
                "cta_text": "cta",
                "quote": "quote",
                "portrait_name": "quote-attribution",
                "company_name": "quote-attribution",
                "position": "quote-attribution",
            }.get(attr, "attribute")
            events.append((pos, kind, val))

    # 2. Inner content of content-bearing shortcodes. Divi doesn't nest text
    # blocks, so a non-greedy match between open and close tag is reliable.
    for tag in CONTENT_BLOCK_SHORTCODES:
        pattern = re.compile(
            rf"\[{tag}(?:\s[^\]]*)?\](.*?)\[/{tag}\]",
            re.IGNORECASE | re.DOTALL,
        )
        for match in pattern.finditer(raw):
            pos = match.start()
            inner = match.group(1)
            inner = re.sub(r"\[/?et_pb_[^\]]*\]", "", inner)
            text = html_to_text(inner)
            if not text:
                continue
            # Split on blank lines so we get per-paragraph granularity, but
            # nudge each chunk's position forward slightly so they stay in
            # document order relative to each other.
            for i, chunk in enumerate(re.split(r"\n{2,}", text)):
                chunk = chunk.strip()
                if not chunk:
                    continue
                if chunk.startswith(("# ", "## ", "### ", "#### ")):
                    kind = "heading"
                    chunk = chunk.lstrip("# ").strip()
                elif chunk.startswith("- "):
                    kind = "list"
                else:
                    kind = "paragraph"
                events.append((pos + i, kind, chunk))

    events.sort(key=lambda e: e[0])

    # Deduplicate adjacent-equal blocks (Divi sometimes stores the same label
    # in both the attribute and the inner text of a button/CTA).
    blocks: list[CopyBlock] = []
    seen: set[tuple[str, str]] = set()
    for _, kind, text in events:
        key = (kind, text)
        if key in seen:
            continue
        seen.add(key)
        blocks.append(CopyBlock(kind=kind, text=text))
    return blocks


def plain_text_from_blocks(blocks: list[CopyBlock]) -> str:
    lines: list[str] = []
    for b in blocks:
        if b.kind == "heading":
            lines.append(f"\n## {b.text}\n")
        elif b.kind == "button":
            lines.append(f"[button] {b.text}")
        elif b.kind == "cta":
            lines.append(f"[cta] {b.text}")
        elif b.kind == "quote":
            lines.append(f"\n> {b.text}")
        elif b.kind == "quote-attribution":
            lines.append(f"> — {b.text}")
        elif b.kind == "list":
            lines.append(b.text)
        else:
            lines.append(b.text)
    text = "\n".join(lines)
    text = MULTI_NEWLINE_RE.sub("\n\n", text)
    return text.strip()


# ---------------------------------------------------------------------------
# Heuristic mapping from legacy slugs → new IA (see docs/Tailor_Site_Structure_v1.md)
# ---------------------------------------------------------------------------

# (legacy_slug, title_fragment) -> (guessed_role, proposed_new_url, remap_status)
ROLE_MAP: dict[str, tuple[str, str, str]] = {
    "sex-relationships-education": ("Homepage (candidate)", "/", "Rewrite"),
    "about": ("About", "/about", "Rewrite"),
    "contact": ("Contact", "/contact", "Rewrite"),
    "training": ("Training (legacy)", "/services/rse-training", "Merge"),
    "rse-training": ("RSE Training", "/services/rse-training", "Rewrite"),
    "schools": ("Schools hub (legacy)", "/services", "Merge"),
    "rse-for-primary-schools": ("Service — Primary", "/services/rse-for-primary-schools", "Rewrite"),
    "rse-for-secondary-schools": ("Service — Secondary", "/services/rse-for-secondary-schools", "Rewrite"),
    "rse-for-special-schools": ("Service — Special", "/services/rse-for-send-and-ap", "Merge"),
    "tailored-rse-for-alternative-provision": ("Service — AP", "/services/rse-for-send-and-ap", "Merge"),
    "rse-for-vulnerable-young-people": ("Service — Vulnerable YP", "/services/rse-for-send-and-ap", "Merge"),
    "universities-and-fe": ("Universities & FE", "(no equivalent — retire?)", "Investigate"),
    "events": ("Events", "(no equivalent — retire?)", "Investigate"),
    "topics": ("Topics hub", "/topics/", "Rewrite"),
    "anonymous-questions-about-sex-relationships": ("Okay to Ask landing", "/questions/", "Rewrite"),
    "glossary": ("Glossary hub", "/glossary/", "Rewrite"),
    "blog": ("Blog index", "/blog/", "Rewrite"),
    "privacy-policy": ("Privacy policy", "/privacy", "Rewrite"),
    "style": ("Dev/Style page", "(retire)", "Retire"),
}


def guess_role(slug: str, title: str) -> tuple[str, str, str]:
    if slug in ROLE_MAP:
        return ROLE_MAP[slug]
    return ("Other", "(needs mapping)", "Investigate")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def main() -> None:
    xml_text = WXR_PATH.read_text(encoding="utf-8")
    pages: list[Page] = []

    for item in iter_items(xml_text):
        if _cdata(item, "wp:post_type") != "page":
            continue
        title_m = re.search(r"<title>(.*?)</title>", item, re.DOTALL)
        raw_title = title_m.group(1) if title_m else ""
        cdata_m = re.match(r"\s*<!\[CDATA\[(.*?)\]\]>\s*$", raw_title, re.DOTALL)
        title = (cdata_m.group(1) if cdata_m else raw_title).strip()

        link_m = re.search(r"<link>(.*?)</link>", item, re.DOTALL)
        link = link_m.group(1) if link_m else ""

        slug = _cdata(item, "wp:post_name")
        status = _cdata(item, "wp:status")
        post_id = _plain(item, "wp:post_id")
        post_parent = _plain(item, "wp:post_parent")
        menu_order = _plain(item, "wp:menu_order")
        post_date = _cdata(item, "wp:post_date_gmt") or _cdata(item, "wp:post_date")
        post_modified = _cdata(item, "wp:post_modified_gmt") or _cdata(item, "wp:post_modified")

        content_m = re.search(
            r"<content:encoded><!\[CDATA\[(.*?)\]\]></content:encoded>",
            item,
            re.DOTALL,
        )
        content_raw = content_m.group(1) if content_m else ""
        excerpt_m = re.search(
            r"<excerpt:encoded><!\[CDATA\[(.*?)\]\]></excerpt:encoded>",
            item,
            re.DOTALL,
        )
        excerpt_raw = excerpt_m.group(1) if excerpt_m else ""

        # SEO meta (Yoast / Rank Math) — scan postmeta
        seo_title = ""
        meta_desc = ""
        for meta in re.finditer(
            r"<wp:postmeta>\s*<wp:meta_key><!\[CDATA\[(.*?)\]\]></wp:meta_key>\s*<wp:meta_value><!\[CDATA\[(.*?)\]\]></wp:meta_value>\s*</wp:postmeta>",
            item,
            re.DOTALL,
        ):
            k, v = meta.group(1), meta.group(2)
            if k in ("_yoast_wpseo_title", "rank_math_title"):
                seo_title = v
            elif k in ("_yoast_wpseo_metadesc", "rank_math_description"):
                meta_desc = v

        copy_blocks = extract_copy_blocks(content_raw)
        # If the page content isn't Divi-shortcoded, fall back to raw HTML
        if not copy_blocks and content_raw.strip():
            text = html_to_text(content_raw)
            if text:
                for chunk in re.split(r"\n{2,}", text):
                    chunk = chunk.strip()
                    if not chunk:
                        continue
                    kind = "heading" if chunk.startswith("#") else "paragraph"
                    copy_blocks.append(CopyBlock(kind=kind, text=chunk.lstrip("# ").strip()))

        copy_plain = plain_text_from_blocks(copy_blocks)
        word_count = len(re.findall(r"\S+", copy_plain))
        role, proposed_new_url, remap_status = guess_role(slug, title)

        pages.append(
            Page(
                id=post_id,
                title=title,
                slug=slug,
                link=link,
                status=status,
                post_date=post_date,
                post_modified=post_modified,
                post_parent=post_parent,
                menu_order=menu_order,
                guessed_role=role,
                proposed_new_url=proposed_new_url,
                remap_status=remap_status,
                word_count=word_count,
                copy_plain=copy_plain,
                copy_blocks=copy_blocks,
                seo_title=seo_title,
                meta_description=meta_desc,
            )
        )

    # Sort by a rough "importance" order: homepage → about → schools → services → content hubs → legal → dev
    role_order = [
        "Homepage (candidate)",
        "About",
        "Schools hub (legacy)",
        "Service — Primary",
        "Service — Secondary",
        "Service — Special",
        "Service — AP",
        "Service — Vulnerable YP",
        "RSE Training",
        "Training (legacy)",
        "Universities & FE",
        "Events",
        "Topics hub",
        "Okay to Ask landing",
        "Glossary hub",
        "Blog index",
        "Contact",
        "Privacy policy",
        "Dev/Style page",
        "Other",
    ]
    order_index = {r: i for i, r in enumerate(role_order)}
    pages.sort(key=lambda p: (order_index.get(p.guessed_role, 99), p.title))

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(
        json.dumps(
            [
                {
                    **asdict(p),
                    "copy_blocks": [asdict(b) for b in p.copy_blocks],
                }
                for p in pages
            ],
            indent=2,
            ensure_ascii=False,
        ),
        encoding="utf-8",
    )
    print(f"wrote {OUT_PATH} ({len(pages)} pages)")
    for p in pages:
        print(f"  [{p.status}] {p.title} ({p.slug}) — {p.word_count} words, {len(p.copy_blocks)} blocks → {p.guessed_role}")


if __name__ == "__main__":
    main()
