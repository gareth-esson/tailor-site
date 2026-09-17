# The paper system

**Read this before building anything that gets printed or downloaded as a
PDF.** The screen design system does not cover paper, and the two are not
interchangeable — the first attempt at the audit sheet PDF came out on four
sides instead of two because screen values were reused on a page.

Source: `src/styles/paper.css`. Tokens are `--paper-*`.

---

## Why it is separate from `tailor-site-v2.css`

**Every type size in the screen system is a `clamp()` with a `vw` term.**

```css
--text-prose-size-h1: clamp(1.75rem, 1.4167rem + 1.6667vw, 2.75rem);
```

That is correct for a viewport and meaningless on paper. A heading sized in
`vw` resizes according to whatever window the PDF renderer happened to open,
so the same document would come out differently depending on the machine that
rendered it. Print type has to be fixed, so `--paper-text-*` is fixed points.

The same applies to rhythm: `--space-global-*` is a rem scale tuned for screen
density. Paper is denser, and it is measured in millimetres because it is a
physical object.

**Colour is not duplicated.** The ink tokens alias the screen system's text
and neutral tokens, so a printed document and the site cannot drift apart.
The one adjustment is rules: `--paper-rule` is `--neutral-300` rather than the
screen's `--border-subtle` (`--neutral-200`), because `#e3e6e8` is legible on
a backlit display and disappears on paper.

---

## The units exception

The operating rules say every visual value references a token, with raw
pixels allowed only inside `@media` queries. Paper adds one narrow exception:
**millimetres for physical geometry, points for type.** Those raw units live
in the `:root` block of `paper.css` and nowhere else — they are tokens, and
component rules consume them like any other.

---

## How a printable document is built

Three pieces:

| Piece | Where | What it does |
|---|---|---|
| `src/styles/paper.css` | — | The system: geometry, rhythm, type, ink, and the `.paper` primitives |
| `src/layouts/PaperLayout.astro` | — | A bare layout: no header, footer, cookie banner or analytics |
| `src/pages/render/<slug>.astro` | `/render/*` | The document itself, `noindex` and excluded from the sitemap |

`PaperLayout` is deliberately not `BaseLayout`. Hiding chrome at print time is
not the same as never emitting it — a cookie banner that mounts and then
hides can still shift layout mid-render, which is how a PDF ends up with a
displaced first page.

Routes under `/render/` are not pages anyone should land on. The public,
indexable page is the resource page that links to the generated file.

---

## Generating the PDF

```bash
npm install
npx playwright install chromium   # once

npm run dev                       # one terminal
npm run pdf:audit-sheet           # another
```

The output is committed to `public/downloads/` and served statically.

**Why generated rather than printed:** `window.print()` hands the output to
the reader's print dialog, which supplies its own margins, its own headers
and footers, and a "fit to page" scale. You cannot be consistent that way.
Here the page size comes from the `@page` rule, the margins come from
`.paper`, and the browser adds nothing.

**Why local rather than in the Vercel build:** the build image does not ship
Chromium, so generating during `astro build` would mean carrying a browser
download in the deploy and accepting that a failed download breaks the site.
These documents change rarely. Lesson PDFs generated from the database are a
different problem, solved in the app's own serverless environment, and do not
need the site build to grow a browser.

**After editing a document, regenerate the PDF** — and `npm test` will tell
you if you forget.

A stale PDF is the weak point of generating locally: it opens perfectly and
looks completely right, it is just out of date, and nothing else in the repo
would notice. So the generator records a SHA-256 of every source that can
change a document's appearance in `scripts/pdf-manifest.json`, and
`tests/pdf-freshness.test.mjs` checks those hashes still match.

Sources recorded per document: the render route, `paper.css`, and
`PaperLayout.astro`. **`tailor-site-v2.css` is deliberately excluded** even
though paper.css aliases its tokens — it changes constantly for screen
reasons that cannot affect a printed sheet, and a check that cries wolf every
week is worse than no check at all.

The test catches a source changing without a regeneration, a manifest entry
whose PDF is missing, and a committed PDF that is not the one the generator
produced. It does **not** catch a rendering change from outside the recorded
sources, such as a Lexend version bump. It is a freshness check, not a visual
one: it tells you the PDF was built from what is on disk now, not that it
looks right.

---

## Density is per-document

`--paper-table-font` defaults to `--paper-text-body`, and a document may
override it on the table:

```css
.check-table { --paper-table-font: 7.8pt; }
```

A dense statutory checklist is a genuinely denser document than a lesson
plan. Set density on the table, not in `:root`, so one document's needs
don't drag every other document down with it.

`--paper-fields-cols` works the same way — the number of columns in a
`.paper-fields` row is a property of the document, not the system.

---

## Checking that a document fits

`.paper` uses `min-height`, not `height`, so content that outgrows a side
spills to a visible extra page rather than being silently clipped. That is
the safer failure, but it is still a failure — the audit sheet's footers
promise "Side 1 of 2", and a four-page PDF makes a liar of them.

Measure rather than eyeball. With the render route open:

```js
const mmPx = 96 / 25.4;
[...document.querySelectorAll('.paper')].map((p, i) => {
  const h = p.getBoundingClientRect().height / mmPx;
  return { side: i + 1, heightMm: +h.toFixed(1), fits: h <= 297.5 };
});
```

A side reporting exactly `297` is sitting at its minimum height and has room.
Anything above 297 will spill.

After generating, confirm the page count — it is the check that catches
everything:

```bash
python3 -c "import re;d=open('public/downloads/rse-policy-audit-sheet.pdf','rb').read();print(len(re.findall(rb'/Type\s*/Page[^s]',d)),'pages')"
```

Page count is not automated — the freshness test knows the PDF is current,
not that it is two sides. Check it after any content change.

---

## Upstream candidate

**A paper system is not Tailor-specific.** Any project that produces a
worksheet, invoice, certificate, report or printable checklist needs the same
primitives: a page canvas, printable-margin safety, fixed type, running heads
and feet, page-break control, ruled writing lines and a print table.

This was built here because the audit sheet needed it now, and it lives in
`src/styles/paper.css` rather than `tailor-site-v2.css` so it only loads on
the pages that are documents.

**It should be reviewed for promotion into the GDH master**
(`~/Sites/gdh-master-css`). If it goes upstream, this file becomes a fork of
it rather than the original, and `SYSTEM-RULES.md` gains a paper section
alongside the component catalogue.

Related: `SYSTEM-RULES.md` §30 already specifies `.doc-row` / `.doc-list` /
`.doc-locked` for download lists and gated panels. Those are not ported into
this fork yet, and they are the natural companions to this system — the paper
system makes the file, `.doc-row` lists it, `.doc-locked` gates it. Port them
from the master rather than inventing them when download lists arrive.
