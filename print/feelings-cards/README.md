# Feelings cards: print artwork

Built by `scripts/build-feelings-cards.py`. Run `python3 scripts/build-feelings-cards.py` from the repo root to regenerate it; don't edit these files by hand.

## For the printer

Send these two files:

- **`feelings-cards-fronts.pdf`:** 84 pages, one per card front
- **`feelings-cards-back.pdf`:** 1 page, the back every card shares

The same artwork is also here as SVG (`back.svg` and `fronts/`) for any printer that asks for it.

- **Card size:** 85 × 55 mm (standard UK business card), landscape
- **Page size:** 91 × 61 mm, which includes 3 mm bleed on every edge
- **Safe area:** nothing important sits closer than 5 mm to the trim edge
- **Quantity:** one copy of each front, all with the same back
- **Text:** converted to outlines, so no fonts are needed
- **Images:** none; everything is vector, so it prints sharp at any size
- **Transparency:** none
- **Colour:** RGB. Ask for a proof: the yellow and the teal are the colours most likely to shift when converted to CMYK.

## What's in the set

Six families, numbered in the wheel's order: Happy, Surprise, Peaceful, Sad, Anger, Fear. Each family has 14 cards:

| File number | Card |
|---|---|
| `00` | The family card, in solid colour |
| `01` to `06` | Inner-ring words, mid tint |
| `07` to `12` | Outer-ring words, pale tint |
| `13` | A blank card for a pupil's own word |

`proof.html` shows every card with the trim line (solid) and the safe area (dashed) drawn on top. It is only for checking. Don't send it to the printer.
