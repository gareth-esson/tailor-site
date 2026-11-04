# Feelings cards: print artwork

Built by `scripts/build-feelings-cards.py`. Run `python3 scripts/build-feelings-cards.py` from the repo root to regenerate it; don't edit these files by hand.

## For the printer

- **Card size:** 85 × 55 mm (standard UK business card), landscape
- **Artboard:** 91 × 61 mm, which includes 3 mm bleed on every edge
- **Safe area:** nothing important sits closer than 5 mm to the trim edge
- **Backs:** one design, `back.svg`, shared by every card
- **Fronts:** 84 designs in `fronts/`, one copy of each
- **Text:** converted to outlines, so no fonts are needed
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
