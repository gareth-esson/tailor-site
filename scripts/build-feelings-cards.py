#!/usr/bin/env python3
"""Build print-ready artwork for the feelings word cards.

Writes one SVG artboard per card front and one for the shared back into
print/feelings-cards/, sized as standard UK business cards so any printer
can make them: 85 x 55 mm landscape trim with 3 mm bleed on every edge, so
each artboard is 91 x 61 mm and its coordinates are millimetres.

The words come from a feelings wheel: six families, each with an inner ring
of six words and an outer ring of six. Every family gets a family card, its
twelve words and one blank card for pupils' own words. The rings are shown
as tints of the family colour, as on the wheel.

Print shops rarely have Lexend, so no artboard contains live text: every
word is converted to outlines here, laid out with the font's own kerning.
Colours are read from src/styles/tailor-site-v2.css rather than repeated
here, so the cards cannot drift from the site's palette.

It also writes feelings-cards-fronts.pdf and feelings-cards-back.pdf, the
files to send a printer, through scripts/build-feelings-cards-pdf.mjs.

Usage:
    python3 scripts/build-feelings-cards.py
"""
from __future__ import annotations

import math
import re
import subprocess
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "print" / "feelings-cards"
CSS = ROOT / "src" / "styles" / "tailor-site-v2.css"
FONTS = ROOT / "node_modules" / "@fontsource" / "lexend" / "files"
LOGO = ROOT / "public" / "assets" / "tailor-logo-lockup-light.svg"

# ── Geometry (mm) ─────────────────────────────────────────────────────
TRIM_W, TRIM_H = 85, 55  # standard UK business card, landscape
BLEED = 3
SAFE = 5  # nothing that matters sits closer than this to the trim edge
W, H = TRIM_W + 2 * BLEED, TRIM_H + 2 * BLEED
CX, CY = W / 2, H / 2
PT = 25.4 / 72  # one point in mm

WORD_SIZE = 26 * PT  # ceiling; the longest word sets the real size
WORD_MAX_W = TRIM_W - 2 * 8
FAMILY_SIZE = 25 * PT
LABEL_SIZE = 6.5 * PT
LABEL_TRACKING = 0.12  # em
INDEX_ICON = 9
FAMILY_ICON = 24
FAMILY_GAP = 3  # between the family card's icon and its name
WALL_ICON = 5  # faces in the back's wallpaper
WALL_PITCH = 7.6
WALL_CLEAR = 4  # space kept round the logo block

# ── Content ───────────────────────────────────────────────────────────
# In the wheel's clockwise order from the top, which the back repeats.
FAMILIES = [
    ("happy", "Happy", "brand-primary",
     ["Content", "Cheerful", "Proud", "Confident", "Silly", "Energetic"],
     ["Excited", "Enthusiastic", "Eager", "Hopeful", "Optimistic", "Elation"]),
    ("surprise", "Surprise", "cat-identity",
     ["Startled", "Confused", "Shocked", "Overwhelmed", "Speechless", "Curious"],
     ["Amazed", "Moved", "Awe-struck", "Crushed", "Stunned", "Bewildered"]),
    ("peaceful", "Peaceful", "ota-cat-law",
     ["Calm", "Loving", "Affectionate", "Trusting", "Relaxed", "Thoughtful"],
     ["Caring", "Thankful", "Accepted", "Valued", "Inspired", "Passionate"]),
    ("sad", "Sad", "cat-relationships",
     ["Hurt", "Disappointed", "Guilty", "Lonely", "Tired", "Bored"],
     ["Miserable", "Depressed", "Hopeless", "Rejected", "Inferior", "Insignificant"]),
    ("anger", "Anger", "cat-sexual-health",
     ["Mad", "Offended", "Jealous", "Irritated", "Frustrated", "Annoyed"],
     ["Hostile", "Enraged", "Agitated", "Furious", "Hateful", "Disgusted"]),
    ("fear", "Fear", "cat-puberty",
     ["Shy", "Nervous", "Worried", "Anxious", "Regret", "Excluded"],
     ["Insecure", "Embarrassed", "Scared", "Frightened", "Terrified", "Panic"]),
]

# White text does not read on yellow, so Peaceful's solid card takes ink.
DARK_ON_SOLID = {"peaceful"}

# The wheel's rings as tints of the family colour, mixed into white.
TINT_INNER = 0.42
TINT_OUTER = 0.18


# ── Colour ────────────────────────────────────────────────────────────
def read_tokens() -> dict[str, str]:
    """First hex definition of each custom property, i.e. the :root value."""
    tokens: dict[str, str] = {}
    for name, value in re.findall(r"--([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})\b", CSS.read_text()):
        tokens.setdefault(name, value.lower())
    return tokens


def mix(a: str, b: str, p: float) -> str:
    """p of a, the rest b. Same result as CSS color-mix(in srgb, a p, b)."""
    ca = [int(a[i:i + 2], 16) for i in (1, 3, 5)]
    cb = [int(b[i:i + 2], 16) for i in (1, 3, 5)]
    return "#" + "".join(f"{round(x * p + y * (1 - p)):02x}" for x, y in zip(ca, cb))


# ── Type ──────────────────────────────────────────────────────────────
class Face:
    """One Lexend weight: glyph outlines, advances and pair kerning."""

    def __init__(self, weight: int):
        self.font = TTFont(FONTS / f"lexend-latin-{weight}-normal.woff")
        self.cmap = self.font.getBestCmap()
        self.glyphs = self.font.getGlyphSet()
        self.hmtx = self.font["hmtx"]
        self.upm = self.font["head"].unitsPerEm
        self.cap = self.font["OS/2"].sCapHeight / self.upm
        gpos = self.font["GPOS"].table
        indices = sorted({
            i for rec in gpos.FeatureList.FeatureRecord if rec.FeatureTag == "kern"
            for i in rec.Feature.LookupListIndex
        })
        self.kern_lookups = [
            gpos.LookupList.Lookup[i].SubTable for i in indices
            if gpos.LookupList.Lookup[i].LookupType == 2
        ]

    def kern(self, left: str, right: str) -> int:
        # Each lookup contributes once, from the first subtable that matches.
        total = 0
        for subtables in self.kern_lookups:
            for st in subtables:
                cov = st.Coverage.glyphs
                if left not in cov:
                    continue
                if st.Format == 1:
                    pairs = st.PairSet[cov.index(left)].PairValueRecord
                    rec = next((r for r in pairs if r.SecondGlyph == right), None)
                    if rec is None:
                        continue
                    total += getattr(rec.Value1, "XAdvance", 0) or 0
                else:
                    c1 = st.ClassDef1.classDefs.get(left, 0)
                    c2 = st.ClassDef2.classDefs.get(right, 0)
                    value = st.Class1Record[c1].Class2Record[c2].Value1
                    total += (getattr(value, "XAdvance", 0) or 0) if value else 0
                break
        return total

    def layout(self, text: str, tracking: float = 0) -> tuple[list[str], list[float], float]:
        """Glyph names, x offsets and total width, all in font units."""
        names = [self.cmap[ord(ch)] for ch in text]
        xs, x = [], 0.0
        for i, name in enumerate(names):
            xs.append(x)
            x += self.hmtx[name][0]
            if i + 1 < len(names):
                x += self.kern(name, names[i + 1]) + tracking * self.upm
        return names, xs, x

    def width(self, text: str, size: float, tracking: float = 0) -> float:
        return self.layout(text, tracking)[2] * size / self.upm

    def outline(self, text: str, size: float, x: float, baseline: float,
                fill: str, tracking: float = 0, anchor: str = "start") -> str:
        names, xs, w = self.layout(text, tracking)
        s = size / self.upm
        if anchor == "middle":
            x -= w * s / 2
        pen = SVGPathPen(self.glyphs, ntos=lambda v: f"{v:.3f}".rstrip("0").rstrip("."))
        for name, gx in zip(names, xs):
            self.glyphs[name].draw(TransformPen(pen, (s, 0, 0, -s, x + gx * s, baseline)))
        return f'<path fill="{fill}" d="{pen.getCommands()}"/>'


# ── Icons ─────────────────────────────────────────────────────────────
# Each family is a Tailor button (the logo's two-tone disc) with a face:
# the buttonholes are the eyes. Drawn in a 24-unit box centred on 12,12.
# {c} is the feature colour.
_S = 'fill="none" stroke="{c}" stroke-linecap="round" stroke-linejoin="round"'


def _eyes(y: float, r: float = 1.3) -> str:
    return (f'<circle cx="8.9" cy="{y}" r="{r}" fill="{{c}}"/>'
            f'<circle cx="15.1" cy="{y}" r="{r}" fill="{{c}}"/>')


FACES = {
    "happy": _eyes(10.3)
    + f'<path {_S} stroke-width="1.5" d="M8.2 13.6Q12 17.8 15.8 13.6"/>',
    "surprise": _eyes(10.7)
    + f'<path {_S} stroke-width="1.1" d="M7.3 7.6Q8.9 6.3 10.5 7.6M13.5 7.6Q15.1 6.3 16.7 7.6"/>'
    + f'<circle {_S} stroke-width="1.4" cx="12" cy="15.5" r="1.9"/>',
    "peaceful": f'<path {_S} stroke-width="1.3" d="M7.4 10.6Q8.9 12.3 10.4 10.6M13.6 10.6Q15.1 12.3 16.6 10.6"/>'
    + f'<path {_S} stroke-width="1.4" d="M9.6 14.6Q12 16.5 14.4 14.6"/>',
    "sad": _eyes(10.8)
    + f'<path {_S} stroke-width="1.1" d="M7.3 8.5L10.3 7.3M16.7 8.5L13.7 7.3"/>'
    + f'<path {_S} stroke-width="1.5" d="M8.8 16.4Q12 13.2 15.2 16.4"/>',
    "anger": _eyes(11)
    + f'<path {_S} stroke-width="1.3" d="M7.2 7.4L10.5 8.9M16.8 7.4L13.5 8.9"/>'
    + f'<path {_S} stroke-width="1.5" d="M9.2 15.8Q12 14.3 14.8 15.8"/>',
    "fear": _eyes(10.8, 1.6)
    + f'<path {_S} stroke-width="1.1" d="M7.3 8.2L10.3 6.9M16.7 8.2L13.7 6.9"/>'
    + f'<path {_S} stroke-width="1.2" d="M8.4 15.6Q9.3 14.6 10.2 15.6T12 15.6T13.8 15.6T15.6 15.6"/>',
}


def icon(key: str, cx: float, cy: float, d: float, rim: str, disc: str, features: str) -> str:
    s = d / 24
    return (f'<g transform="translate({cx - d / 2:.3f} {cy - d / 2:.3f}) scale({s:.5f})">'
            f'<circle cx="12" cy="12" r="12" fill="{rim}"/>'
            f'<circle cx="12" cy="12" r="9.4" fill="{disc}"/>'
            + FACES[key].replace("{c}", features) + "</g>")


# ── Cards ─────────────────────────────────────────────────────────────
def svg(body: str) -> str:
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}mm" height="{H}mm" '
            f'viewBox="0 0 {W} {H}">\n{body}\n</svg>\n')


def background(colour: str) -> str:
    return f'<rect width="{W}" height="{H}" fill="{colour}"/>'


def corner_index(face: Face, key: str, name: str, ic: tuple[str, str, str], label: str) -> str:
    """Icon and family name top left, repeated upside down bottom right,
    so the family reads from either side of a table."""
    c = BLEED + SAFE + INDEX_ICON / 2
    baseline = c + face.cap * LABEL_SIZE / 2
    group = (icon(key, c, c, INDEX_ICON, *ic)
             + face.outline(name.upper(), LABEL_SIZE, c + INDEX_ICON / 2 + 2, baseline,
                            label, LABEL_TRACKING))
    return group + f'<g transform="rotate(180 {CX} {CY})">{group}</g>'


def build() -> list[tuple[str, str]]:
    tokens = read_tokens()
    white = "#ffffff"
    ink = tokens["text-heading"]
    regular, semibold, bold = Face(400), Face(600), Face(700)

    every_word = [w for *_, inner, outer in FAMILIES for w in inner + outer]
    widest = max(semibold.width(w, WORD_SIZE) for w in every_word)
    word_size = min(WORD_SIZE, WORD_SIZE * WORD_MAX_W / widest)

    files: list[tuple[str, str]] = []
    for n, (key, name, token, inner, outer) in enumerate(FAMILIES, start=1):
        prefix = f"{n}-{key}"
        base = tokens[token]
        deep = mix(base, ink, 0.55)
        on = ink if key in DARK_ON_SOLID else white
        normal_icon = (base, deep, white)

        def word_card(word: str, tint: float) -> str:
            baseline = CY + semibold.cap * word_size / 2
            return svg(background(mix(base, white, tint))
                       + corner_index(semibold, key, name, normal_icon, deep)
                       + semibold.outline(word, word_size, CX, baseline, ink, anchor="middle"))

        # The family card is its own index: a large icon over the name,
        # centred as one group. Corner indices would crowd it at this height.
        stack = FAMILY_ICON + FAMILY_GAP + bold.cap * FAMILY_SIZE
        top = CY - stack / 2
        family = svg(
            background(base)
            + icon(key, CX, top + FAMILY_ICON / 2, FAMILY_ICON, mix(white, base, 0.45), white, deep)
            + bold.outline(name, FAMILY_SIZE, CX, top + stack, on, anchor="middle"))
        files.append((f"{prefix}-00-{key}.svg", family))

        for i, word in enumerate(inner + outer, start=1):
            tint = TINT_INNER if i <= len(inner) else TINT_OUTER
            slug = word.lower().replace(" ", "-")
            files.append((f"{prefix}-{i:02d}-{slug}.svg", word_card(word, tint)))

        blank = svg(background(mix(base, white, TINT_OUTER))
                    + corner_index(semibold, key, name, normal_icon, deep)
                    + f'<path d="M14 {CY + 3}H{W - 14}" stroke="{deep}" stroke-width="0.35" '
                      f'stroke-linecap="round"/>')
        files.append((f"{prefix}-13-blank.svg", blank))

    files.append(("back.svg", back(tokens, regular)))
    return files


def logo(x: float, y: float, width: float, ground: str) -> tuple[str, float]:
    """The light lockup, inlined, with its half-transparent mark flattened
    against the ground. Print RIPs handle transparency unevenly; two opaque
    fills give the same picture without it."""
    src = LOGO.read_text()
    vb_w, vb_h = map(float, re.search(r'viewBox="0 0 ([\d.]+) ([\d.]+)"', src).group(1, 2))
    fills = dict(re.findall(r"\.(cls-\d)\s*{\s*fill:\s*(#[0-9a-f]{3,6})", src))
    paths = re.findall(r'<path class="(cls-\d)" d="([^"]+)"/>', src)
    mark = fills["cls-3"]
    out, mark_layers = [], 0
    for cls, d in paths:
        if cls == "cls-3":
            # Two stacked 50% layers: the outer ring shows one, the inner disc both.
            mark_layers += 1
            fill = mix(mark, ground, 0.5 if mark_layers == 1 else 0.75)
        else:
            fill = fills[cls]
        out.append(f'<path fill="{fill}" d="{d}"/>')
    s = width / vb_w
    return f'<g transform="translate({x:.3f} {y:.3f}) scale({s:.5f})">{"".join(out)}</g>', vb_h * s


def back(tokens: dict[str, str], regular: Face) -> str:
    """Every card shares this back: the six faces repeated as a wallpaper,
    with a clear space in the middle for the logo and address.

    The pattern runs off every edge into the bleed, so a card trimmed a
    millimetre out looks the same as one trimmed true."""
    ground = tokens["brand-secondary"]
    parts = [background(ground)]

    # Logo block, centred on the card.
    logo_w = 34
    _, logo_h = logo(0, 0, logo_w, ground)  # measure, then place
    url_gap = 4
    block = logo_h + url_gap + regular.cap * LABEL_SIZE
    top = CY - block / 2

    # The clear space: no face may come closer than this to the block.
    clear_x = logo_w / 2 + WALL_CLEAR
    clear_y = block / 2 + WALL_CLEAR

    # Offset rows on a hexagonal pitch, symmetric about the centre so the
    # clear space sits evenly in the pattern.
    pitch_y = WALL_PITCH * math.sqrt(3) / 2
    cols = math.ceil(W / 2 / WALL_PITCH) + 1
    rows = math.ceil(H / 2 / pitch_y) + 1
    keys = [f[0] for f in FAMILIES]
    colours = {f[0]: tokens[f[2]] for f in FAMILIES}
    placed: list[tuple[float, float, str]] = []
    turn = 0
    for j in range(-rows, rows + 1):
        offset = WALL_PITCH / 2 if j % 2 else 0
        for i in range(-cols, cols + 1):
            x, y = CX + i * WALL_PITCH + offset, CY + j * pitch_y
            r = WALL_ICON / 2
            if x + r < 0 or x - r > W or y + r < 0 or y - r > H:
                continue
            if abs(x - CX) < clear_x + r and abs(y - CY) < clear_y + r:
                continue
            # Next family in turn, skipping any a neighbour already shows,
            # so no two touching faces match.
            near = {k for px, py, k in placed if math.hypot(px - x, py - y) < WALL_PITCH * 1.1}
            for step in range(len(keys)):
                key = keys[(turn + step) % len(keys)]
                if key not in near:
                    break
            turn = keys.index(key) + 1
            placed.append((x, y, key))

    for x, y, key in placed:
        base = colours[key]
        # As the logo's button sits on a dark ground: a dim rim, a bright
        # centre, and holes that show the ground through.
        parts.append(icon(key, x, y, WALL_ICON, mix(base, ground, 0.5), base, ground))

    parts.append(logo(CX - logo_w / 2, top, logo_w, ground)[0])
    parts.append(regular.outline("TAILOR-RSE.ORG.UK", LABEL_SIZE, CX, top + block,
                                 tokens["neutral-300"], LABEL_TRACKING, anchor="middle"))
    return svg("".join(parts))


def proof(names: list[str]) -> str:
    """A page for checking the set by eye: every card at size, with the
    trim (solid) and safe area (dashed) drawn over it. Not for the printer."""
    cards = "".join(
        f'<figure><div class="card"><img src="{n}" alt=""><i class="trim"></i><i class="safe"></i></div>'
        f'<figcaption>{n.split("/")[-1]}</figcaption></figure>'
        for n in names)
    return f"""<!doctype html>
<html lang="en-GB"><head><meta charset="utf-8"><title>Feelings cards proof</title>
<style>
  body {{ margin: 0; padding: 8mm; font: 9px/1.3 system-ui, sans-serif; background: #e3e6e8; color: #1f2329; }}
  main {{ display: grid; grid-template-columns: repeat(5, {W}mm); gap: 6mm 4mm; }}
  figure {{ margin: 0; }}
  .card {{ position: relative; width: {W}mm; height: {H}mm; }}
  .card img {{ display: block; width: 100%; height: 100%; }}
  .card i {{ position: absolute; pointer-events: none; }}
  .trim {{ inset: {BLEED}mm; outline: 0.2mm solid #e8483f; }}
  .safe {{ inset: {BLEED + SAFE}mm; outline: 0.2mm dashed #e8483f; opacity: 0.5; }}
  figcaption {{ margin-top: 1mm; }}
</style></head>
<body><main>{cards}</main></body></html>
"""


def main() -> None:
    files = build()
    fronts = OUT / "fronts"
    fronts.mkdir(parents=True, exist_ok=True)
    for old in fronts.glob("*.svg"):
        old.unlink()
    for name, content in files:
        (OUT / name if name == "back.svg" else fronts / name).write_text(content)
    names = ["back.svg"] + [f"fronts/{n}" for n, _ in files if n != "back.svg"]
    (OUT / "proof.html").write_text(proof(names))
    print(f"{len(files) - 1} fronts and 1 back -> {OUT.relative_to(ROOT)}")

    # Printers ask for PDF, so make those from the SVGs just written.
    subprocess.run(["node", "scripts/build-feelings-cards-pdf.mjs"], cwd=ROOT, check=True)


if __name__ == "__main__":
    main()
