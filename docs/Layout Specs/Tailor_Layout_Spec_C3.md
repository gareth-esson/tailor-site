# C3 — Landing page layout spec

**Page:** `/topics/{slug}`
**Template:** `src/pages/topics/[...slug].astro`
**Layer:** Tailor (default) — Lexend throughout, neutral surfaces, teal accent CTAs.
**Role:** The bridge between public trust content and practical teacher intent. A teacher searching "consent RSE" or "puberty lesson plans" lands here. Must feel like the canonical, well-made page on its subject — not a flat SEO landing page.
**Instances:** 22 landing pages across 7 RSHE categories.

**Version:** 1.0
**Date:** 2026-04-08

---

## Reference documents

- `Tailor_Page_Content_Spec_v1.md` — C3 section (content structure, 10 sections)
- `Tailor_Content_Site_Build_Spec_v1.md` — Section 3.3 (template diagram), Section 4 (CTA placement rules), Section 5.2 (aggregation logic)
- `Tailor_Art_Direction_Brief_v1.md` — C3 design goals ("the most editorial", "strong hierarchy, rich sectioning, clear sense of progression")
- `Tailor_Design_System_Implementation_Notes.md` — token vocabulary, surface classes
- `Tailor_Layout_Spec_Shell.md` — header, footer, nav
- `Tailor_Image_Requirements.md` — Section 9: 4 spot illustrations for section markers (curriculum, questions, key terms, further reading)

---

## Design intent

The art direction brief says these 23 pages should feel like "the well-made central page on this subject." Strong hierarchy, rich sectioning, clear sense of progression down the page. Visual confidence making the page feel canonical.

The key challenge: the page aggregates content from four different content types (Notion prose, Questions, Glossary, Blog) plus two CTA components. It must feel like one coherent editorial page, not a dashboard of widgets. The surface rhythm, section spacing, and consistent typography do the heavy lifting here.

The questions section (§4) uses the `b11-sample-card` horizontal card from the book page — post-it image, question, and a 3-line answer excerpt. This gives teachers a real taste of the content without clicking through. The cards use OtA text tokens internally but the section itself stays on Tailor surfaces — no OtA layer activation.

---

## Shared components

- **`CtaExploreLessons.astro`** [A11] — mid-page CTA linking to app library filtered by topic. Already built, owns its own styles. Used as-is.
- **`CtaBringToSchool.astro`** [A12] — bottom-page CTA linking to services/training. Already built, owns its own styles. Used as-is.
- **`b11-sample-card`** — Horizontal question card from the B11 book page. Shows post-it image, category eyebrow, question title, 3-line answer excerpt, and "Read the full answer" link. Styles live in `tailor-site-v2.css`. Used in §4 for the questions section. Not a standalone `.astro` component — the markup is inline in the template (same pattern as B11).
- **`GlossaryTooltips.astro`** — inline glossary tooltips injected into the body prose (§2).

---

## Layer scoping

```html
<body>
  <header>…shell…</header>

  <main id="main">
    <!-- C3 content sections — Tailor layer (default, no class needed) -->
  </main>

  <footer>…shell…</footer>
</body>
```

No `.layer-ota` on `<main>`. The page is Tailor layer throughout. The `b11-sample-card` in §4 uses OtA text tokens internally (Fraunces headings, `--text-ota-heading`) but these are referenced directly in the card's CSS — no `.layer-ota` wrapper needed.

---

## Page structure in one picture

```
┌──────────────────────────────────── <header> (shell)
│
├─ <main id="main">                          ← sits on --bg-page ground
│     ├─ §1  Hero                     [--bg-surface, border-bottom, left-aligned]
│     ├─ §2  Topic overview / body    [--bg-page ground, 44rem prose]
│     ├─ §3  Curriculum mapping       [--bg-surface-alt, auto-generated from structured data]
│     │       ├─ Summary paragraph
│     │       └─ Expandable detail (DfE + PSHE grouped)
│     ├─ §4  CTA: Explore lessons     [A11 component, --bg-tinted card]
│     ├─ §5  Questions young people   [--bg-page ground, b11-sample-card, horizontal]
│     │       ask
│     ├─ §6  Further reading          [--bg-surface-alt, blog cards] (conditional)
│     ├─ §7  Related landing pages    [--bg-page ground, pill links]
│     ├─ §8  CTA: Bring to school     [A12 component, --bg-surface-alt card]
│
└──────────────────────────────────── <footer> (shell)
```

**Surface rhythm.** The page alternates between three ground states to create visual sectioning without heavy dividers:

1. **§1** (hero) — `--bg-surface` (white) with a bottom border. A clean, authoritative header.
2. **§2** (body prose) — sits on `--bg-page` ground. The reading zone.
3. **§3** (curriculum mapping) — `--bg-surface-alt` (cool neutral tint). The structured data section gets its own surface to distinguish it from the authored prose above.
4. **§4** (mid-page CTA) — sits on `--bg-page` ground. The CTA card itself uses `--bg-tinted` (4% teal wash) which provides the visual break.
5. **§5** (questions) — sits on `--bg-page` ground. The horizontal sample cards (`b11-sample-card`) carry their own visual weight via white backgrounds and post-it images — no section-level surface needed.
6. **§6** (blog posts) — `--bg-surface-alt` (cool neutral tint). Cards sit on the tinted ground.
7. **§7** (related pages) — sits on `--bg-page` ground. Pill links provide their own visual weight.
8. **§8** (bottom CTA) — sits on `--bg-page` ground. The CTA card uses `--bg-surface-alt` internally.

This is a fully Tailor-layer page — no OtA surfaces. The post-it images on the sample cards bring enough warmth on their own without needing a warm surface band.

### Vertical rhythm

- **§1** (hero): `py-[var(--space-global-xl)]` — generous but not as tall as a homepage hero.
- **§2** (body): `py-[var(--space-struct-y-base)]` — standard section padding.
- **§3–§8**: `py-[var(--space-struct-y-base)]` — consistent section padding throughout.
- The CTA components (§4, §8) manage their own internal padding.
- Horizontal insets: every section uses `px-[var(--space-global-gutter)]` on the outer wrapper.

### Container widths

- **§1** (hero): `--container-max-shell` (72rem). The hero spans the full shell width for authority.
- **§2** (body prose): `--container-max-prose` (44rem). Narrow reading measure for long-form content.
- **§3** (curriculum mapping): `--container-max-prose` (44rem). Reference text reads best at the prose measure.
- **§4** (mid-CTA): `--container-max-shell` (72rem). The CTA card sits within the shell container — it's a wide element.
- **§5** (questions): `--container-max-shell` (72rem). The horizontal cards need the full width for the image + body row layout.
- **§6** (blog posts): `--container-max-shell` (72rem). Three-column grid on desktop.
- **§7** (related pages): `--container-max-shell` (72rem). The pill links wrap naturally.
- **§8** (bottom CTA): `--container-max-shell` (72rem). Same as mid-CTA.

---

## Section 1 — Hero

### Role
The authoritative header. Establishes the topic, its category, and the page's Tailor-layer identity. Clean, confident, editorial. No imagery — the typography does the work.

### Desktop

**Outer wrapper.** Full-bleed `<section>` with `--bg-surface` background and a bottom border.
- Scoped class `.landing-hero`:
  ```css
  .landing-hero {
    background: var(--bg-surface);
    border-bottom: var(--border-width-xs) solid var(--border-subtle);
  }
  ```
- Tailwind on section: `w-full py-[var(--space-global-xl)] px-[var(--space-global-gutter)]`

**Inner wrapper.** `mx-auto w-full max-w-[var(--container-max-shell)]`.

**Contents (in order):**

1. **Category eyebrow.** `<span>` — the RSHE category name (e.g. "Relationships", "Puberty & The Body").
   - Font: Lexend (`--font-tailor-body-stack`), `--text-card-size-body`, `--font-weight-semibold`.
   - Colour: dynamically set via `--cat-color: var(--cat-{token})` inline style. Falls back to `--text-body-muted`.
   - `text-transform: uppercase`, `letter-spacing: var(--text-eyebrow-ls)`.
   - Tailwind: `mb-[var(--space-global-xs)]` (tightened from current `0.5rem`).

2. **Page title.** `<h1>` — the landing page title (e.g. "Consent", "Puberty").
   - Font: Lexend (`--font-tailor-heading-stack`), `--text-display-size-h1`, `--heading-weight-h1`, `--text-heading`.
   - Line-height: `--lh-display` (1.15).
   - `margin: 0`.

3. **Pagefind aliases.** Hidden `<div>` with `data-pagefind-meta="aliases"` and `display: none`. No visual impact — purely for search indexing.

### Mobile

- Title size steps down via the display ramp clamp.
- Category eyebrow and title remain left-aligned at all widths.

---

## Section 2 — Topic overview (body prose)

### Role
The editorial heart of the page. Contains the topic overview and learning objectives — pulled from the Notion page body and rendered as prose. This is where the teacher understands what the topic covers and why it matters. Curriculum mapping is handled separately in §3 via structured data.

### Desktop

**Outer wrapper.** No surface class — sits on `--bg-page` ground.
- Tailwind: `w-full py-[var(--space-struct-y-base)] px-[var(--space-global-gutter)]`

**Inner wrapper.** `mx-auto w-full max-w-[var(--container-max-prose)]` — the 44rem reading measure. Long-form content needs the narrow column.

**Prose container.** `<div class="prose">` wrapping the rendered Notion body HTML (with glossary tooltips injected).

**Prose typography (scoped via `.landing-body :global(.prose)`):**

- Body: `--font-tailor-body-stack`, `--text-prose-size-body`, `--text-body`, line-height 1.7.
- `h2`: `--font-tailor-heading-stack`, `--text-prose-size-h2`, `--heading-weight-h2`, `--text-heading`. Margin: `var(--space-global-lg)` top, `var(--space-global-sm)` bottom. These are sub-sections within the body (e.g. "Learning objectives", "What this topic covers").
- `h3`: `--font-tailor-heading-stack`, `--text-prose-size-h3`, `--heading-weight-h3`, `--text-heading`. Margin: `var(--space-global-md)` top, `var(--space-global-xs)` bottom.
- `p`: margin-bottom `var(--space-global-sm)`.
- `ul`, `ol`: margin-bottom `var(--space-global-sm)`, padding-left `1.5rem`.
- `li`: margin-bottom `0.25rem`.
- `a`: `--brand-accent-text` colour, `text-decoration: underline`.

**Spot illustrations.** The art direction brief specifies 4 spot illustrations for section markers within the body content (curriculum mapping, questions, key terms, further reading). These are referenced in `Tailor_Image_Requirements.md` section 9. When the illustrations are ready, they can be inserted as decorative `<img>` elements at the start of each relevant `h2` within the rendered prose. For now, this is deferred — the prose renders cleanly without them.

### Mobile

- Prose column fills the viewport minus the gutter. No change needed.
- Heading sizes step down via clamp.

---

## Section 3 — Curriculum mapping

### Role
The statutory reference layer. Auto-generated from structured data — each landing page inherits curriculum statements from its underlying granular topics via the Curriculum Statements database. A teacher or school leader scanning this section can immediately see which DfE and PSHE Association requirements this topic addresses, without anyone having to author it per page.

### Data source

**Notion database:** Curriculum Statements (`4f168ac0-0146-4013-b009-9abd06f143e3`).
**Fields:** Statement (title, exact quoted text), Source (select: "DfE RSE Statutory Guidance 2026" or "PSHE Association Programme of Study 2020"), Section Reference (text, e.g. "Relationships Education: Being Safe, 1"), Key Stage (multi-select: KS1–KS5), Topics (relation to granular topics).

**Resolution chain:** Landing page → `granularTopicIds` → Topics DB → `Curriculum Statements` relation → statement entries. A landing page's curriculum statements are the union of all statements linked to any of its underlying granular topics. Deduplicate (a statement linked to multiple topics under the same landing page should only appear once).

### Data fetching

In `getStaticPaths()`, for each landing page, collect curriculum statements from the underlying topics. This requires either:

- A new Notion API query at build time: for each landing page, look up the Curriculum Statements relation on each granular topic and collect the statement data (text, source, section reference, key stages). OR
- A new `getCurriculumStatements()` function in `src/lib/content.ts` that fetches all statements and their topic relations, allowing the template to filter by topic IDs at build time.

The second approach (fetch all, filter in JS) is more efficient — one API call for the whole database, then filter per page. The data shape passed to the template:

```ts
interface CurriculumStatement {
  id: string;
  statement: string;
  source: 'DfE RSE Statutory Guidance 2026' | 'PSHE Association Programme of Study 2020';
  sectionReference: string;
  keyStages: string[];
}
```

Pass `curriculumStatements: CurriculumStatement[]` as a prop to each landing page.

### Desktop

**Outer wrapper.** Full-bleed `<section>` with `--bg-surface-alt` background.
- Tailwind: `w-full py-[var(--space-struct-y-base)] px-[var(--space-global-gutter)]`
- `style="background: var(--bg-surface-alt);"`

**Inner wrapper.** `mx-auto w-full max-w-[var(--container-max-prose)]` — same prose measure as §2.

**Section heading.** `<h2>` — "Curriculum alignment"
- Font: Lexend, `--text-prose-size-h2`, `--heading-weight-h2`, `--text-heading`.
- Tailwind: `mb-[var(--space-global-md)]`
- Left-aligned.

**Summary paragraph.** Auto-generated from the data. A compact 2–3 sentence paragraph that a teacher can scan:

> This topic addresses [n] requirements from the DfE statutory RSE guidance and [m] learning outcomes from the PSHE Association Programme of Study, across Key Stages [list]. [If both sources are present: "It covers statutory requirements in [DfE sections] and aligns with PSHE Association core themes in [PSHE areas]."]

The summary is generated at build time from the statement data. Template logic counts statements per source and extracts the unique key stages and section reference prefixes. The exact wording can be templated:

```ts
const dfeStatements = curriculumStatements.filter(s => s.source.startsWith('DfE'));
const psheStatements = curriculumStatements.filter(s => s.source.startsWith('PSHE'));
const allKeyStages = [...new Set(curriculumStatements.flatMap(s => s.keyStages))].sort();
```

Style: `--text-prose-size-body`, `--text-body`, line-height 1.7. Same as body prose.

**Expandable detail.** Below the summary, a `<details>` element containing the full statement list, grouped by source document.

```html
<details class="curriculum-detail">
  <summary class="curriculum-detail__toggle">
    View all curriculum references
  </summary>
  <div class="curriculum-detail__content">
    <!-- DfE group -->
    <!-- PSHE group -->
  </div>
</details>
```

**`<summary>` styling:**
- `--text-prose-size-body`, `--font-weight-semibold`, `--brand-accent-text` colour.
- `cursor: pointer`. Arrow/chevron via the native `<details>` disclosure triangle (browser default is fine; no custom icon needed).
- Tailwind: `mt-[var(--space-global-md)]`

**Expanded content — grouped by source:**

Each source gets a sub-heading and a list of statements:

```html
<h3>DfE RSE Statutory Guidance 2026</h3>
<ul>
  <li>
    <span class="curriculum-statement__text">"[statement text]"</span>
    <span class="curriculum-statement__ref">[section reference] · [key stages]</span>
  </li>
  ...
</ul>

<h3>PSHE Association Programme of Study 2020</h3>
<ul>
  <li>...</li>
</ul>
```

**Statement styling:**
- `.curriculum-statement__text`: `--text-prose-size-body`, `--text-body`, `font-style: italic` (these are direct quotes).
- `.curriculum-statement__ref`: `--text-card-size-body`, `--text-body-muted`. The section reference and key stages on the same line, separated by ` · `.
- List items: `margin-bottom: var(--space-global-xs)`.
- Sub-headings (`h3`): `--text-prose-size-h3`, `--heading-weight-h3`, `--text-heading`. `margin-top: var(--space-global-md)`, `margin-bottom: var(--space-global-xs)`.

**Conditional rendering.** Only render this section if `curriculumStatements.length > 0`. Given that 84 of 87 topics are mapped, most landing pages will have statements. If a landing page has no statements (because its underlying topics have none), the section simply doesn't appear.

### Mobile

- Prose column fills the viewport minus the gutter. No change needed.
- The `<details>` element is natively interactive on all browsers — no JS needed.

---

## Section 4 — CTA: Explore lessons [A11]

### Role
Mid-page conversion point. Catches the teacher's intent after they've read the overview and curriculum alignment, and before they browse student-facing content (questions).

### Implementation

**Use `CtaExploreLessons.astro` as-is.** The component owns its own `<section>`, container, and styles. No wrapper needed from the template.

**Current issue:** The component uses `max-w-4xl` instead of `max-w-[var(--container-max-shell)]`. This should be updated in the component to use the token.

The CTA card uses `--bg-tinted` (4% teal wash) with a `--border-subtle` border and `--radius-lg`. On desktop it's a row layout (text left, button right). On mobile it stacks.

### Surface context

The CTA sits on `--bg-page` ground. The tinted card provides its own visual separation — no section-level surface class needed.

---

## Section 5 — Questions young people ask

### Role
The bridge between teacher and student worlds. Shows real questions aggregated from the underlying granular topics. The post-it images and answer excerpts give the teacher a flavour of what young people are actually asking — and how the answers read — without leaving the page.

### Design decision: `b11-sample-card` (horizontal card with excerpt)

Use the same horizontal sample card from the B11 book page. Each card shows: post-it image (left), category eyebrow + question title + 3-line answer excerpt + "Read the full answer" link (right). This is a better fit than the compact vertical `QuestionCard` because:

- The answer excerpt lets the teacher judge tone and quality without clicking through.
- The horizontal layout scans naturally as a stacked list — one question per row.
- On a page aimed at teachers deciding whether to use this content, showing the answer matters more than fitting maximum cards into a grid.

The `b11-sample-card` styles already exist in `tailor-site-v2.css` (lines 3000–3074). The card uses OtA text tokens internally (`--text-ota-heading`, `--heading-ota-weight-h2`, `--text-ota-muted`) — the post-it images and OtA typography bring warmth to the card content without needing an OtA surface on the section itself.

### Desktop

**Outer wrapper.** No surface class — sits on `--bg-page` ground.
- Tailwind: `w-full py-[var(--space-struct-y-base)] px-[var(--space-global-gutter)]`

**Inner wrapper.** `mx-auto w-full max-w-[var(--container-max-shell)]`.

**Section heading.** `<h2>` — "Questions young people ask"
- Font: Lexend (`--font-tailor-heading-stack`), `--text-prose-size-h2`, `--heading-weight-h2`, `--text-heading`.
- Tailwind: `mb-[var(--space-global-md)]`
- Left-aligned.

**Card stack.** A vertical list of `b11-sample-card` elements:
- Container: `<div>` — Tailwind: `flex flex-col gap-[var(--space-global-md)]`
- Each card: `<a href="/anonymous_question/{slug}" class="b11-sample-card">` — same markup as B11.

**Card contents (in order):**

1. **Post-it image.** `<img class="b11-sample-card__postit">` — `width: 8rem`, `mix-blend-mode: multiply`, rotated via `--postit-rotation`. `loading="lazy"`.
2. **Card body.** `<div class="b11-sample-card__body">`:
   - **Category eyebrow.** `<span class="b11-sample-card__eyebrow">` — the OtA category name (e.g. "Puberty"). Uppercase, bold, tracked.
   - **Question title.** `<div class="b11-sample-card__question">` — the question text. Fraunces, `--text-card-size-h2`, `--heading-ota-weight-h2`.
   - **Answer excerpt.** `<p class="b11-sample-card__excerpt">` — the `simpleAnswer` field, clamped to 3 lines. `--text-card-size-body`, `--text-ota-muted`.
   - **Link.** `<span class="b11-sample-card__link">Read the full answer</span>` — teal, with `→` arrow via `::after`.

**Layout.** Column on mobile, row on desktop (`sm:` breakpoint via the existing media query in `tailor-site-v2.css`). Post-it sits left, body right.

**Hover.** Border colour transitions to `--brand-accent`.

**Data requirement.** The cards need `simpleAnswer` from the full `Question` objects — this is the 3-line excerpt source. Unlike `QuestionCard` (which only needs `QuestionRef`), this card uses the full question data. The existing `questions` array from `getStaticPaths` already contains full `Question` objects, so no mapping is needed.

**Display limit.** Show a maximum of 6 questions. If the aggregated set exceeds 6, display the first 6 (answered questions sort first, then alphabetically — the existing sort handles this) and add a "See all questions" link below the stack:

```html
<a href="/questions/" class="btn btn--sm btn--outline has-icon-hover">
  See all {questions.length} questions
</a>
```

This keeps the section scannable. Landing pages with 30+ questions shouldn't display them all inline.

**Conditional rendering.** Only render this section if `questions.length > 0`.

### Mobile

- Cards stack vertically (column layout within each card).
- Post-it image appears above the card body.
- Section heading stays left-aligned.

---

## Section 6 — For teachers: further reading (conditional)

### Role
Blog content relevant to this topic. Only renders if blog posts exist tagged to the underlying granular topics. The conditional nature means many landing pages won't have this section — that's fine, the page flows cleanly without it.

### Desktop

**Outer wrapper.** Full-bleed `<section>` with `--bg-surface-alt` background.
- Tailwind: `w-full py-[var(--space-struct-y-base)] px-[var(--space-global-gutter)]`
- `style="background: var(--bg-surface-alt);"`

**Inner wrapper.** `mx-auto w-full max-w-[var(--container-max-shell)]`.

**Section heading.** `<h2>` — "For teachers: further reading"
- Font: Lexend, `--text-prose-size-h2`, `--heading-weight-h2`, `--text-heading`.
- Tailwind: `mb-[var(--space-global-md)]`
- Left-aligned.

**Blog card grid.**
- Tailwind: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--space-global-sm)]`
- Each card is an `<a>` link wrapping the card content:

```html
<a href="/blog/{slug}" class="card blog-card">
  <div class="card__body">
    <div class="card__eyebrow">{targetAudience}</div>
    <div class="card__title">{title}</div>
    <div class="blog-card__author">By {author}</div>
  </div>
</a>
```

**Blog card styling (scoped):**
- Uses the existing `.card` base class from the design system (white background, subtle border, radius, shadow).
- `.card__eyebrow`: category/audience label. `--text-card-size-body`, `--font-weight-semibold`, `--text-body-muted`, `text-transform: uppercase`, `letter-spacing: var(--text-eyebrow-ls)`.
- `.card__title`: `--text-card-size-h3` (or `--text-prose-size-body`), `--heading-weight-h3`, `--text-heading`.
- `.blog-card__author`: `--text-card-size-body`, `--text-body-muted`, `margin-top: 0.25rem`.
- Hover: standard card lift (`--card-lift-distance`) if the `.card` base class includes it, otherwise `translateY(-2px)` + `border-color: var(--brand-accent)`.

**Conditional rendering.** Only render if `blogPosts.length > 0`.

### Mobile

- Grid collapses to single column.

---

## Section 7 — Related landing pages

### Role
Cross-linking within the topic architecture. Shows other landing pages in the same category, plus thematically related cross-category pages. Helps the teacher explore adjacent topics.

### Desktop

**Outer wrapper.** No surface class — sits on `--bg-page` ground.
- Tailwind: `w-full py-[var(--space-struct-y-base)] px-[var(--space-global-gutter)]`

**Inner wrapper.** `mx-auto w-full max-w-[var(--container-max-shell)]`.

**Section heading.** `<h2>` — "Related topics"
- Font: Lexend, `--text-prose-size-h2`, `--heading-weight-h2`, `--text-heading`.
- Tailwind: `mb-[var(--space-global-md)]`
- Left-aligned.

**Pill links.** A flex-wrap row of topic links styled as pills:
- Container: `flex flex-wrap gap-[var(--space-global-xs)]`
- Each link: `<a href="/topics/{slug}" class="landing-pill">`

**Pill styling (scoped class `.landing-pill`):**
```css
.landing-pill {
  display: inline-block;
  padding: var(--space-global-xs) var(--space-global-sm);
  background: var(--bg-surface);
  border: var(--border-width-xs) solid var(--border-subtle);
  border-radius: var(--radius-pill);
  font-family: var(--font-tailor-body-stack);
  font-size: var(--text-card-size-body);
  font-weight: var(--font-weight-medium);
  color: var(--text-body);
  text-decoration: none;
  transition: border-color var(--transition-duration) var(--transition-easing),
              color var(--transition-duration) var(--transition-easing);
}
.landing-pill:hover {
  border-color: var(--brand-accent);
  color: var(--brand-accent-text);
}
```

Note: the current implementation uses hardcoded `0.5rem 1rem` padding. Replace with token values `var(--space-global-xs) var(--space-global-sm)`.

**Conditional rendering.** Only render if `relatedPages.length > 0`.

### Mobile

- Pills wrap naturally. No change needed.

---

## Section 8 — CTA: Bring this into your school [A12]

### Role
Bottom-of-page conversion. Catches the teacher who has browsed all the way down — they're engaged, now convert. The target varies per landing page (delivery, training, drop days, consultancy).

### Implementation

**Use `CtaBringToSchool.astro` as-is.** The component owns its own `<section>`, container, and styles.

**Current issue:** Same as §3 — the component uses `max-w-4xl` instead of `max-w-[var(--container-max-shell)]`.

The CTA card uses `--bg-surface-alt` with `--radius-lg`, centred text, and a primary button. The heading uses `--text-display-size-h3` (larger than section headings) for emphasis.

### Surface context

The CTA sits on `--bg-page` ground. The `--bg-surface-alt` card provides visual separation.

---

## Tokens required

All tokens used in this spec already exist in `tailor-site-v2.css`. No new tokens needed.

**Surface/background tokens used:**
- `--bg-page` (page ground)
- `--bg-surface` (hero, card backgrounds)
- `--bg-surface-alt` (alternating sections, bottom CTA)
- `--bg-tinted` (mid-CTA card)

**Category colour tokens used:**
- `--cat-relationships`, `--cat-sexual-health`, `--cat-puberty`, `--cat-identity`, `--cat-online-safety`, `--cat-safety`, `--cat-wellbeing` — for the hero eyebrow.
- `--text-ota-heading`, `--text-ota-muted`, `--heading-ota-weight-h2` — used by `b11-sample-card` internally (card-level OtA text tokens, no layer activation needed).

**Typography tokens used:**
- `--font-tailor-heading-stack`, `--font-tailor-body-stack` — throughout.
- `--text-display-size-h1`, `--text-prose-size-h2`, `--text-prose-size-h3`, `--text-prose-size-body`, `--text-card-size-body` — text scale.
- `--heading-weight-h1`, `--heading-weight-h2`, `--heading-weight-h3`, `--font-weight-semibold`, `--font-weight-medium` — weights.
- `--text-heading`, `--text-body`, `--text-body-muted` — colours.
- `--text-eyebrow-ls` — category label tracking.

---

## Accessibility notes

- `<main id="main">` is the skip-link target from the shell.
- Each section uses semantic `<section>` elements. Section headings (`<h2>`) provide the landmark label.
- Questions stack: each `b11-sample-card` is an `<a>` element — fully clickable block link with focus ring. Post-it images use `alt=""` (decorative).
- Blog cards: each is an `<a>` link with the card as the click target.
- Related topic pills: native `<a>` links with visible focus ring.
- Category eyebrow colour: the `--cat-*` tokens are decorative; the category name is text content, so colour blindness doesn't affect comprehension.
- Conditional sections: the page structure remains coherent regardless of which conditional sections render. The CTA positions (mid-page, bottom) adapt naturally.
- Pagefind body: `data-pagefind-body` on the outermost wrapper ensures full-text search indexing.

---

## Differences from current implementation

The existing template (`src/pages/topics/[...slug].astro`) is functional but needs these updates to match this spec:

1. **Container width.** All `max-w-4xl` instances → `max-w-[var(--container-max-shell)]`. The shell container (72rem) is wider than 4xl (56rem) and gives the card grids room for 3 columns.

2. **Body prose container.** Should use `max-w-[var(--container-max-prose)]` (44rem) for the reading measure, NOT `max-w-[var(--container-max-shell)]`. The prose section is the one section that narrows.

3. **New §3: Curriculum mapping from structured data.** Add a new section between body prose and the Explore Lessons CTA. This pulls curriculum statements from the Curriculum Statements Notion database via the landing page's granular topic relations. Renders as a summary paragraph + `<details>` expandable with full statement list grouped by source. Requires new data fetching in `getStaticPaths()` and a `CurriculumStatement` type.

4. **Questions section: compact rows → `b11-sample-card` stack.** Replace the current `<ul>` of inline question links + badges with horizontal `b11-sample-card` cards (same as B11 book page). Stacked vertically with `gap-[var(--space-global-md)]`. Each card shows post-it image, category eyebrow, question title, 3-line answer excerpt, and "Read the full answer" link. Capped at 6 cards with a "See all" link if more exist. No OtA surface — the section stays on `--bg-page` ground.

5. **Key terms section removed.** The current implementation has a glossary `<dl>` grid. Remove it entirely — key terms are not needed on landing pages.

6. **Section backgrounds.** Current implementation uses `landing-section--alt` on two sections. This spec adds `--bg-surface-alt` on §3 (curriculum mapping) and maintains it on §6 (key terms) and §8 (related pages).

7. **Hero category eyebrow spacing.** Current `margin-bottom: 0.5rem` → `mb-[var(--space-global-xs)]`.

8. **Hardcoded spacing in scoped CSS.** Several values (`0.5rem`, `0.75rem 1rem`, `0.25rem`) should be replaced with token equivalents per the token discipline rules.

9. **CTA component containers.** Both `CtaExploreLessons` and `CtaBringToSchool` use `max-w-4xl` internally. These should be updated to `max-w-[var(--container-max-shell)]`.

10. **Vertical padding consistency.** Current sections use `py-[var(--space-global-lg)]` (2rem). This spec uses `py-[var(--space-struct-y-base)]` (clamp 4–6rem) for content sections, providing more generous vertical rhythm. The hero keeps `py-[var(--space-global-xl)]` (3rem).

11. **Section borders.** Current implementation uses `border-top` on `.landing-section`. With the surface colour alternation providing clear section breaks, the top borders are redundant. Remove them — let the surface changes do the work.

12. **Page count.** The codebase currently references 23 landing pages. The roster has been updated to 22 (see build checklist for specific changes).

---

## Build checklist

**Data layer:**
1. Create `getCurriculumStatements()` in `src/lib/content.ts` — fetches all entries from the Curriculum Statements Notion database. Returns `CurriculumStatement[]` with fields: `id`, `statement`, `source`, `sectionReference`, `keyStages`, `topicIds`.
2. Add `CurriculumStatement` interface to `src/lib/types.ts`.
3. In `getStaticPaths()`, call `getCurriculumStatements()` and for each landing page, filter statements where any of the statement's `topicIds` match the landing page's `granularTopicIds`. Deduplicate. Pass as `curriculumStatements` prop.
4. Import `getPostItImagePath` from `../../lib/post-it-images`.
5. Remove the glossary section (§7 in current code) — key terms, glossary `<dl>`, `GlossaryTermCard` imports, and `glossaryRefs` mapping. Also remove the `glossary` prop and related data fetching from `getStaticPaths` if no other section needs it (glossary tooltips in the prose still need `glossaryIndex`, but the glossary term list itself is no longer displayed).

**Template changes:**
6. Replace all `max-w-4xl` with `max-w-[var(--container-max-shell)]` on section inner wrappers.
7. Set body prose (§2) inner wrapper to `max-w-[var(--container-max-prose)]` (44rem).
8. Add new §3 curriculum mapping section: summary paragraph + `<details>` expandable with statements grouped by source.
9. Replace question list with `b11-sample-card` horizontal cards (same markup as B11 book page). Stacked vertically, max 6, with "See all" link.
10. Remove the glossary/key terms section entirely.
11. Expand blog card grid columns: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`.
12. Update section vertical padding from `py-[var(--space-global-lg)]` to `py-[var(--space-struct-y-base)]`.
13. Remove `border-top` from `.landing-section` — surface changes handle section breaks.
14. Replace hardcoded spacing values (`0.5rem`, `0.75rem 1rem`, `0.25rem`) with tokens.
15. Update hero eyebrow margin from `0.5rem` to `var(--space-global-xs)`.

**Component updates:**
16. Update `CtaExploreLessons.astro` internal container from `max-w-4xl` to `max-w-[var(--container-max-shell)]`.
17. Update `CtaBringToSchool.astro` internal container from `max-w-4xl` to `max-w-[var(--container-max-shell)]`.

**Landing page roster (22 pages — codebase needs updating):**
18. Rename "Sex and intimacy" → "Positive sexuality and intimacy" (slug: `positive-sexuality-and-intimacy`).
19. Rename "Gender stereotypes and discrimination" → "Stereotypes, prejudice and discrimination" (slug: `stereotypes-prejudice-and-discrimination`).
20. Add new page: "Drugs, alcohol and vaping" (slug: `drugs-alcohol-and-vaping`, category: Health & Wellbeing).
21. Remove "Bodies and anatomy" page.
22. Remove "Self-esteem" page.
23. Update topics index page count from 23 to 22.

**Deferred:**
24. Spot illustrations: defer to v2 (assets not yet ready).
