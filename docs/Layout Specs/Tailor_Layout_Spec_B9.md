# Tailor Layout Spec — B9 Blog Index

| Field | Value |
|---|---|
| **Page** | Blog index |
| **Route** | `/blog/` |
| **Template** | `src/pages/blog/index.astro` (rewrite of existing) |
| **Layer** | Tailor (default — no `.layer-ota` class) |
| **Instances** | 1 |
| **Version** | 2.2 |
| **Date** | 2026-04-13 |

---

## 0 · Purpose

The blog index is the teacher-facing reading room of the site. Its job is to present every published blog post in a browsable, filterable list that lets the reader triage on the card surface — without having to click into each post to work out whether it's for them. The C4 blog post template already carries the weight of individual articles; B9 carries the weight of the archive.

Now that the Notion blog database exposes a Featured Image and a Published Date, the index can stop behaving like a bulleted list and start behaving like an editorial grid. The cards need to show enough (image, category, title, date, author, topics, excerpt) for a reader to pick one and move on. The page itself stays calm — the posts do the visual work.

Mood: a well-kept reading room, not a content farm. One piece of restraint that matters — no "Featured" or "Latest" hero post on this page. All published posts sit in one grid, sorted newest first. Editorial curation is a maintenance cost Tailor doesn't need at launch; automatic sort is the correct default.

---

## 1 · Reference documents

- `Tailor_Layout_Spec_C4.md` — individual blog post template (data model, featured image field, date formatting, topic tag pattern)
- `Tailor_Layout_Spec_B14.md` — topics hub (filter-pill pattern, single-page filter behaviour, responsive stack model)
- `Tailor_Layout_Spec_B8.md` — OtA landing (pagination pattern, filter + count strip)
- `Tailor_Layout_Spec_Shell.md` — header, footer, global header search, container widths
- `Tailor_Page_Content_Spec_v1.md` — B9 section
- `Tailor_Art_Direction_Brief_v1.md` — Tailor layer mood, showcase page discipline, surface language
- `Tailor_Design_System_Implementation_Notes.md` — token vocabulary, layer scoping, component patterns
- `src/lib/types.ts` — `BlogPost` interface

---

## 2 · Data requirements

### 2.1 BlogPost fields consumed

All fields are already supplied by the C4 build. No new Notion properties, no new fetcher helpers.

| Field | Type | Used for | Notes |
|---|---|---|---|
| `title` | `string` | Card title | Required |
| `slug` | `string` | Card link target `/blog/{slug}` | Required |
| `featuredImage` | `string \| null` | Card image slot | Prominent on each card — added via C4 spec |
| `publishedDate` | `string \| null` | Card meta, default sort | ISO date — added via C4 spec |
| `author` | `string` | Card meta | May be empty; render conditionally |
| `category` | `string \| null` | Card eyebrow + filter | `"Practical teaching"` / `"Curriculum & policy"` / `"Bridging content"` |
| `topics` | `LandingPageRef[]` | Card topic tags + filter | Primary topics; used for topic filter value |
| `metaDescription` | `string` | Card excerpt fallback | See §3.3 "Excerpt derivation" |
| `body` | `BlockObjectResponse[]` | Card excerpt | First paragraph block, truncated |

`targetAudience` is still present on the data model but is **not** surfaced as a filter or on the card in v2.2. Category is the stronger editorial axis — "what kind of post is this?" is a more useful filter for a teacher triaging the archive than "who is this addressed to?", and most posts in the Teachers audience cover all three categories, so the audience filter collapsed to near-meaningless distinctions in practice. Audience stays in the schema for future use.

### 2.2 Sort

Default sort: newest first by `publishedDate` descending. Posts without a `publishedDate` sort to the bottom of the list (never featured, never above dated posts). Sort is computed at build time in the page frontmatter — this is a static page, no client-side re-sort needed. Secondary sort: alphabetical by title.

A user-visible sort control is out of scope for v1 — newest-first is the only mode. The section map reserves a slot for a future sort selector but B9 v2.2 ships without it.

### 2.3 Excerpt derivation

Reuse the same derivation used on the C4 related-post cards, centralised into a helper:

```typescript
// src/lib/blog-helpers.ts
export function deriveExcerpt(post: BlogPost, maxChars = 140): string {
  // 1. First paragraph block from post.body
  const firstPara = post.body.find((b) => b.type === 'paragraph');
  const text = firstPara ? extractParagraphText(firstPara) : '';
  // 2. Fallback to metaDescription if no paragraph found
  const source = text || post.metaDescription || '';
  // 3. Word-boundary truncate, suffix with ellipsis if truncated
  if (source.length <= maxChars) return source;
  const cut = source.slice(0, maxChars).split(' ').slice(0, -1).join(' ');
  return cut + '…';
}
```

Computed in the page frontmatter, not at render time. If `deriveExcerpt()` returns an empty string, the excerpt line on the card is omitted.

### 2.4 Filter data

Two filter dimensions, both derived from the post set at build time:

- **Category filter values:** Fixed canonical list in this order — `Practical teaching`, `Curriculum & policy`, `Bridging content`. These are the three values in the Notion `Category` select on the blog database. The filter bar always renders these three pills in this order, even if one category has zero posts (the filter button shows disabled state when empty — see §3.2). Posts where `category` is null are not excluded from the archive; they simply never match a category filter (the "All" pill still shows them).
- **Topic filter values:** Deduplicated list of `topic.title` strings across all posts' `topics[]` arrays, preserving the order they first appear. Each value carries the topic slug for the `data-topic` attribute.

---

## 3 · Section map

| § | Section | Surface | Container | Required |
|---|---|---|---|---|
| 1 | Hero (headline + intro) | `--bg-tinted` | `--container-max-shell` | Yes |
| 2 | Filter bar (category + topic) | `--bg-page` | `--container-max-shell` | Yes |
| 3 | Post grid | `--bg-page` | `--container-max-shell` | Yes |
| 4 | Empty / no-results state | `--bg-page` | `--container-max-prose` | Conditional |
| 5 | Load more (pagination) | `--bg-page` | `--container-max-shell` | Conditional |

Page background: `--bg-page`.

**Surface rhythm.** Exactly two bands: one `--bg-tinted` hero at the top, then everything below on `--bg-page` continuously — no alternating tint bands, no dark authority panel. The blog index is a reading surface, not a conversion page; the C5/B5 dark-band treatment would be tonally wrong here. Rhythm comes from vertical spacing and card hierarchy, not from surface changes. One tonal switch, paced and calm.

The hero tint uses `--bg-tinted` rather than `--bg-surface` — a softer, warmer opener that matches the B5 "start tinted, resolve to page" pattern. `--bg-surface` would read almost identical to the card fills below and blur the hero/grid boundary; `--bg-tinted` gives the top of the page a clear tonal identity without shouting.

### 3.0 · Vertical rhythm

| Section | Padding |
|---|---|
| §1 Hero | `py-[var(--space-struct-y-base)]` |
| §2 Filter bar | `pt-[var(--space-global-lg)] pb-[var(--space-global-md)]` |
| §3 Post grid | `pt-0 pb-[var(--space-struct-y-base)]` (top padding absorbed into filter strip) |
| §4 Empty state | `py-[var(--space-struct-y-base)]` |
| §5 Load More | `pb-[var(--space-struct-y-base)]` (top padding `pt-[var(--space-global-lg)]`) |

Horizontal insets: `px-[var(--space-global-gutter)]` on every outer wrapper.

---

## 4 · Section details

### §1 — Hero

```
┌──────────────────────────────────────────────────────┐
│  --bg-tinted, border-bottom: --border-subtle           │
│                                                        │
│  EYEBROW  "Writing"                                    │
│                                                        │
│  h1  [COPY TBD — "Blog", "Writing", or a voice line]   │
│                                                        │
│  p   [COPY TBD — 1–2 sentence intro, prose measure]    │
│                                                        │
└──────────────────────────────────────────────────────┘
```

- **Outer wrapper:** `<header class="blog-index-hero">`, full-bleed `--bg-tinted` with `border-bottom: var(--border-width-xs) solid var(--border-subtle)`. `w-full`, `py-[var(--space-struct-y-base)]`, `px-[var(--space-global-gutter)]`.
- **Inner wrapper:** `mx-auto w-full max-w-[var(--container-max-shell)]`. Content left-aligned (Tailor layer convention — Tailor headings never centre).

**Contents:**

1. **Eyebrow** — `<span class="blog-index-hero__eyebrow">` text: "Writing" *[COPY TBD — could also be "From the team", "Notes", or omitted entirely if Gareth prefers the h1 to stand alone]*.

| Property | Token |
|---|---|
| `font-family` | `var(--font-tailor-body-stack)` |
| `font-size` | `var(--text-card-size-body)` |
| `font-weight` | `var(--font-weight-semibold)` |
| `text-transform` | `uppercase` |
| `letter-spacing` | `var(--text-eyebrow-ls)` |
| `color` | `var(--brand-accent-text)` |
| `margin` | `0 0 var(--space-global-xs)` |

2. **h1** — `<h1 class="blog-index-hero__title">` — `[COPY TBD]`. Working placeholder: "Blog".

| Property | Token |
|---|---|
| `font-family` | `var(--font-tailor-heading-stack)` |
| `font-size` | `var(--text-display-size-h1)` |
| `font-weight` | `var(--heading-weight-h1)` |
| `line-height` | `var(--lh-display)` |
| `color` | `var(--text-heading)` |
| `margin` | `0 0 var(--space-global-sm)` |

3. **Intro prose** — `<p class="blog-index-hero__intro">` — `[COPY TBD — 1–2 sentences placing the blog for a teacher audience]`.

| Property | Token |
|---|---|
| `font-family` | `var(--font-tailor-body-stack)` |
| `font-size` | `var(--text-prose-size-body)` |
| `font-weight` | `var(--font-weight-regular)` |
| `line-height` | `var(--lh-body)` |
| `color` | `var(--text-body-muted)` |
| `max-width` | `var(--container-max-prose)` |
| `margin` | `0` |

No hero image. The blog index is not the place for a stock classroom photograph — the featured images on the cards below carry the visual identity. Adding a hero photograph here would create a "which image is the hero?" conflict with the first card.

No CTA button. The reader's next action is to scroll to the filter bar and grid.

### §2 — Filter bar

Two filter dimensions displayed as two rows of pill buttons. The bar sits directly below the hero — the `--bg-tinted` band ends at §1's `border-bottom`, and the filter strip sits on `--bg-page` continuously with the grid below it. Compact vertical rhythm, no visual drama.

```
┌──────────────────────────────────────────────────────┐
│  --bg-page                                             │
│                                                        │
│  Category                                              │
│  [All] [Practical teaching] [Curriculum & policy]      │
│  [Bridging content]                                    │
│                                                        │
│  Topic                                                 │
│  [All] [Consent] [Puberty] [Online safety] [...]       │
│                                                        │
│  Showing 12 of 37 posts                                │
└──────────────────────────────────────────────────────┘
```

- **Outer wrapper:** `<section class="blog-filters" aria-label="Filter posts">`, `w-full px-[var(--space-global-gutter)]`, vertical padding per §3.0.
- **Inner wrapper:** `mx-auto w-full max-w-[var(--container-max-shell)]`, `display: flex`, `flex-direction: column`, `gap: var(--space-global-sm)`.

**Each filter row (`.blog-filters__row`):** Desktop behaviour.

| Property | Token |
|---|---|
| `display` | `flex` |
| `flex-wrap` | `wrap` |
| `align-items` | `center` |
| `gap` | `var(--space-global-xs) var(--space-global-sm)` |

**Mobile layout (`< 768px`).** The row label stacks *above* the chips rather than sitting beside them, and the chips themselves move into a horizontal-scroll track instead of wrapping. This prevents the two filter rows from consuming half the viewport before a reader sees a single post.

```html
<div class="blog-filters__row" role="toolbar" aria-label="Filter by category">
  <span class="blog-filters__label" id="filter-category-label">Category</span>
  <div class="blog-filters__scroll" aria-labelledby="filter-category-label">
    <button class="blog-filter-chip is-active" data-filter-type="category" data-filter-value="all" aria-pressed="true">All</button>
    <button class="blog-filter-chip" data-filter-type="category" data-filter-value="Practical teaching" aria-pressed="false">Practical teaching</button>
    …
  </div>
</div>
```

`.blog-filters__scroll`:

| Property | Value |
|---|---|
| `display` | `flex` |
| `gap` | `var(--space-global-xs)` |
| `overflow-x` | `auto` |
| `scroll-snap-type` | `x mandatory` |
| `-webkit-overflow-scrolling` | `touch` |
| `scrollbar-width` | `none` (hide native scrollbar) |
| `padding-bottom` | `var(--space-global-xs)` (room for the scroll indicator — see below) |

Each chip inside the track: `scroll-snap-align: start`, `flex-shrink: 0` (so chips never compress). `.blog-filters__scroll::-webkit-scrollbar { display: none }` to hide scrollbar in Safari/Chrome.

**Scroll affordance.** A thin fade gradient on the right edge of the track hints that more chips exist off-screen. Implement via a `::after` pseudo-element on `.blog-filters__scroll` positioned absolutely at the right edge: `linear-gradient(to right, transparent, var(--bg-page))`, `width: var(--space-global-md)`, `pointer-events: none`. Hide the gradient when the track has reached its scroll-end (JS toggles a `.is-scroll-end` class on the track via a scroll listener; or set `mask-image` with a CSS-only approach if browser support allows).

**Desktop (`≥ 768px`).** `.blog-filters__scroll` drops its `overflow-x`, `scroll-snap-type`, and width-capping behaviour — chips wrap normally within the row. Use a media query inside the `<style>` block:

```css
@media (min-width: 768px) {
  .blog-filters__scroll {
    overflow-x: visible;
    scroll-snap-type: none;
    flex-wrap: wrap;
    padding-bottom: 0;
  }
  .blog-filters__scroll::after { display: none; }
}
```

**Row label (`.blog-filters__label`):** Inline label (desktop) / stacked above (mobile).

| Property | Token |
|---|---|
| `font-family` | `var(--font-tailor-body-stack)` |
| `font-size` | `var(--text-card-size-body)` |
| `font-weight` | `var(--font-weight-semibold)` |
| `text-transform` | `uppercase` |
| `letter-spacing` | `var(--text-eyebrow-ls)` |
| `color` | `var(--text-body-muted)` |
| `margin-right` | `var(--space-global-xs)` |

Text: "Category" on the first row, "Topic" on the second.

**Filter chips (`.blog-filter-chip`):** `<button>` elements, same base styling across both rows. The `-chip` suffix disambiguates from the section wrapper (`.blog-filters`) and names the shape of the control — these are chips/pills, not plain buttons, not standalone filter elements floating on a page.

| Property | Default state | `.is-active` | `:hover` (when not active) |
|---|---|---|---|
| `font-family` | `var(--font-tailor-body-stack)` | — | — |
| `font-size` | `var(--text-card-size-body)` | — | — |
| `font-weight` | `var(--font-weight-semibold)` | — | — |
| `line-height` | `var(--lh-card)` | — | — |
| `padding` | `var(--space-global-xs) var(--space-global-sm)` | — | — |
| `border` | `var(--border-width-xs) solid var(--border-subtle)` | `var(--border-width-xs) solid var(--brand-accent)` | — |
| `border-radius` | `var(--radius-pill)` | — | — |
| `background` | `var(--bg-surface)` | `var(--btn-primary-bg)` | `var(--bg-tinted)` |
| `color` | `var(--text-body)` | `#fff` | `var(--brand-accent-text)` |
| `transition` | `background var(--transition-duration) var(--transition-easing), border-color var(--transition-duration) var(--transition-easing), color var(--transition-duration) var(--transition-easing)` | — | — |

Disabled state (category pill with zero matching posts, e.g. if no Bridging content posts exist yet): `opacity: 0.5`, `pointer-events: none`, `aria-disabled="true"`. The pill still renders so the set of three categories is visually stable.

**ARIA and data attributes:**

- Row wrapper: `role="toolbar"`, `aria-label="Filter by category"` / `"Filter by topic"`. Toolbar (rather than `role="group"`) is the correct pattern here because each row is a *set of controls all operating on the same axis with a single-active-selection model* — the WAI-ARIA authoring practice for a toolbar gives us Left/Right arrow navigation within a row and Tab between rows for free (see §6 keyboard handling).
- Each chip: `aria-pressed="true|false"`, `data-filter-type="category" | "topic"`, `data-filter-value="{value}"` where value is the canonical label (`"Practical teaching"`, `"Consent"`, etc.) or `"all"` for the "All" chip at the start of each row.
- Each chip carries `tabindex="-1"` except the currently-active chip in each row, which carries `tabindex="0"`. Tab lands on the active chip; Left/Right moves between chips and updates the `tabindex` roving pattern (managed in JS — see §6).
- "All" chip for each row: starts `.is-active` with `aria-pressed="true"` and `tabindex="0"` by default.
- Filter strip wrapper: `data-pagefind-ignore="all"` — the filter chips are interactive controls that Pagefind should never surface in search-result snippets. See §9.

**Result count (`.blog-filters__count`):** Small live region below the two filter rows. Updates as filters change.

| Property | Token |
|---|---|
| `font-family` | `var(--font-tailor-body-stack)` |
| `font-size` | `var(--text-card-size-body)` |
| `font-weight` | `var(--font-weight-regular)` |
| `color` | `var(--text-body-muted)` |
| `margin-top` | `var(--space-global-xs)` |

Format: `"Showing {visibleCount} of {totalCount} posts"`. Use `aria-live="polite"` so assistive tech announces filter changes.

### §3 — Post grid

```
┌──────────────────────────────────────────────────────┐
│  --bg-page                                             │
│                                                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  IMAGE   │  │  IMAGE   │  │  IMAGE   │             │
│  │          │  │          │  │          │             │
│  ├──────────┤  ├──────────┤  ├──────────┤             │
│  │ CATEGORY │  │ CATEGORY │  │ CATEGORY │             │
│  │ Title    │  │ Title    │  │ Title    │             │
│  │ Excerpt  │  │ Excerpt  │  │ Excerpt  │             │
│  │ Author · │  │ Author · │  │ Author · │             │
│  │ Date     │  │ Date     │  │ Date     │             │
│  │ Topics   │  │ Topics   │  │ Topics   │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│                                                        │
│  (repeat — 12 per batch, Load More at §5 if archive > 24)     │
└──────────────────────────────────────────────────────┘
```

- **Outer wrapper:** `<section class="blog-grid-section">`, `w-full px-[var(--space-global-gutter)]`, padding per §3.0.
- **Inner wrapper:** `mx-auto w-full max-w-[var(--container-max-shell)]`.
- **Grid (`.blog-grid`):** `<ul role="list">` — semantic list.

| Property | Value |
|---|---|
| `display` | `grid` |
| `grid-template-columns` | `1fr` (mobile) → `repeat(2, 1fr)` at `≥ 640px` → `repeat(3, 1fr)` at `≥ 1024px` |
| `gap` | `var(--space-global-lg)` |
| `list-style` | `none` |
| `padding` | `0` |
| `margin` | `0` |

Each `<li class="blog-grid__item">` carries `data-category="{category}"` and `data-topics="{pipe-delimited topic titles}"` for filter JS. `data-topics` format: `"|Consent|Puberty|"` (pipe-wrapped so substring matching is unambiguous — "Sexual health" won't accidentally match "Sex & the law" etc.). `data-category` is the raw category string or an empty string when `category` is null. No `data-page` attribute — the Load More pattern reveals matches in sequence rather than by page-number partitioning (see §5).

### §3.1 — Blog index card (`.blog-index-card`)

A new card component, distinct from `QuestionCard` (wrong content type) and from the `.topic-hub-card` on B14 (different axis — topics not posts). Vertical card, full width of its grid cell, with a prominent 16:9 featured image, then body content stacked below.

Whole card is a single `<a href="/blog/{slug}" class="blog-index-card">`. No nested interactive elements — topic tags are rendered as plain text labels inside the card, not as independent links.

**Structure:**

```html
<li class="blog-grid__item" data-category="Practical teaching" data-topics="|Consent|Healthy relationships|">
  <a href="/blog/{slug}" class="blog-index-card">
    <div class="blog-index-card__img">
      {featuredImage
        ? <img src={featuredImage} alt="" loading="lazy" />
        : <div class="blog-index-card__img-fallback" aria-hidden="true" />}
    </div>
    <div class="blog-index-card__body">
      {category && <div class="blog-index-card__eyebrow">{category}</div>}
      <h3 class="blog-index-card__title">{title}</h3>
      {excerpt && <p class="blog-index-card__excerpt">{excerpt}</p>}
      <div class="blog-index-card__meta">
        {author && <span class="blog-index-card__author">By {author}</span>}
        {author && publishedDate && <span class="blog-index-card__meta-sep" aria-hidden="true">·</span>}
        {publishedDate && <time datetime={publishedDate} class="blog-index-card__date">{formatDate(publishedDate)}</time>}
      </div>
      {topics.length > 0 && (
        <div class="blog-index-card__topics">
          {topics.map((t, i) => (
            <span class="blog-index-card__topic">{t.title}{i < topics.length - 1 && <span class="blog-index-card__topic-sep" aria-hidden="true"> · </span>}</span>
          ))}
        </div>
      )}
    </div>
  </a>
</li>
```

**Card container (`.blog-index-card`):**

| Property | Token / value |
|---|---|
| `display` | `flex` |
| `flex-direction` | `column` |
| `height` | `100%` (fill grid cell) |
| `background` | `var(--bg-surface)` |
| `border` | `var(--border-width-xs) solid var(--border-subtle)` |
| `border-radius` | `var(--radius-lg)` |
| `overflow` | `hidden` |
| `text-decoration` | `none` |
| `color` | `inherit` |
| `box-shadow` | `var(--shadow-xs)` |
| `transition` | `box-shadow var(--transition-duration) var(--transition-easing), border-color var(--transition-duration) var(--transition-easing), transform var(--transition-duration) var(--transition-easing)` |

**Hover / focus-visible:**

| Property | Value |
|---|---|
| `box-shadow` | `var(--shadow-lg)` |
| `border-color` | `var(--brand-accent)` |
| `transform` | `translateY(var(--card-lift-distance))` |

Card uses the same lift pattern as the design system's `.card--lift` variant but with a resting `--shadow-xs` instead of `--shadow-none` — the featured image is prominent enough that starting shadowless feels floaty on `--bg-page`. The subtle resting shadow anchors the card.

**Image slot (`.blog-index-card__img`):**

| Property | Value |
|---|---|
| `position` | `relative` |
| `aspect-ratio` | `16 / 9` |
| `width` | `100%` |
| `overflow` | `hidden` |
| `background` | `var(--bg-surface-alt)` (shows while loading) |

The `<img>` inside: `width: 100%`, `height: 100%`, `object-fit: cover`, `display: block`, `loading: lazy`. First three cards on the page (above the fold on most viewports) use `loading: eager` — see §6.

**Image fallback (`.blog-index-card__img-fallback`):** When `featuredImage` is null, render a `<div>` with the same 16:9 aspect ratio and a `--bg-tinted` fill. No placeholder icon, no "image coming soon" text. Just a coloured panel — matches the C4 "no featured image" posture.

```css
.blog-index-card__img-fallback {
  width: 100%;
  height: 100%;
  background: var(--bg-tinted);
}
```

**Body (`.blog-index-card__body`):**

| Property | Value |
|---|---|
| `display` | `flex` |
| `flex-direction` | `column` |
| `gap` | `var(--space-global-xs)` |
| `padding` | `var(--space-global-md)` |
| `flex` | `1` (fill remaining card height so cards in same row match) |

**Eyebrow — category (`.blog-index-card__eyebrow`):**

| Property | Token |
|---|---|
| `font-family` | `var(--font-tailor-body-stack)` |
| `font-size` | `var(--text-card-size-h6)` |
| `font-weight` | `var(--font-weight-bold)` |
| `text-transform` | `uppercase` |
| `letter-spacing` | `var(--card-eyebrow-ls)` |
| `color` | `var(--brand-accent-text)` |
| `line-height` | `var(--lh-card)` |
| `margin` | `0` |

Uses `--card-eyebrow-ls` (0.1em) not `--text-eyebrow-ls` (0.05em) — this is a card context, matching the global `.card__eyebrow` convention. Colour is the teal `--brand-accent-text` across all three categories — the three blog categories don't have their own colour system the way OtA categories do, and introducing one would fight the Tailor layer's calm palette. The category label does the distinguishing work; the colour stays consistent.

**Title (`.blog-index-card__title`):**

| Property | Token |
|---|---|
| `font-family` | `var(--font-tailor-heading-stack)` |
| `font-size` | `var(--text-card-size-h3)` |
| `font-weight` | `var(--heading-weight-h3)` |
| `line-height` | `var(--lh-heading-sub)` |
| `color` | `var(--text-heading)` |
| `margin` | `0` |

Rendered as `<h3>` semantically. The page h1 is in §1; the filter bar's row labels sit at h2 *in spirit* but are rendered as `<span>` so they don't clutter heading-nav. That leaves h3 as the natural level for each card title — which is the right answer anyway, because it means a screen-reader user using heading-nav (H shortcut) can jump post-to-post-to-post through the grid without stopping on a layer of filter-region headings first. Class name doesn't encode the heading level, so `<h3>` is just a change of tag.

**Excerpt (`.blog-index-card__excerpt`):**

| Property | Token |
|---|---|
| `font-family` | `var(--font-tailor-body-stack)` |
| `font-size` | `var(--text-card-size-body)` |
| `font-weight` | `var(--font-weight-regular)` |
| `line-height` | `var(--lh-body)` |
| `color` | `var(--text-body-muted)` |
| `margin` | `0` |
| `display` | `-webkit-box` |
| `-webkit-line-clamp` | `2` |
| `-webkit-box-orient` | `vertical` |
| `overflow` | `hidden` |

Line-clamped to 2 lines. `deriveExcerpt()` already truncates to ~140 chars; the clamp is a visual safety net in case that truncation still overflows the card width.

**Meta row (`.blog-index-card__meta`):**

| Property | Value |
|---|---|
| `display` | `flex` |
| `flex-wrap` | `wrap` |
| `align-items` | `center` |
| `gap` | `var(--space-global-xs)` |
| `font-family` | `var(--font-tailor-body-stack)` |
| `font-size` | `var(--text-card-size-body)` |
| `font-weight` | `var(--font-weight-regular)` |
| `line-height` | `var(--lh-card)` |
| `color` | `var(--text-body-muted)` |
| `margin-top` | `var(--space-global-xs)` |

**Date formatting.** Use `formatDate()` from a shared helper at build time, formatted as `"9 Apr 2026"` using `Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })`. Matches the C4 meta line format exactly. Rendered inside a `<time datetime="{ISO}">` element.

If `publishedDate` is null, omit the `<time>` element and the `·` separator — show only the author. If `author` is also empty, the `.blog-index-card__meta` row omits entirely.

**Separator (`.blog-index-card__meta-sep`):** A middle dot character (`·`). `color: var(--text-body-muted)`, `aria-hidden="true"`.

**Topics row (`.blog-index-card__topics`):**

| Property | Value |
|---|---|
| `display` | `flex` |
| `flex-wrap` | `wrap` |
| `font-family` | `var(--font-tailor-body-stack)` |
| `font-size` | `var(--text-card-size-h6)` |
| `font-weight` | `var(--font-weight-medium)` |
| `line-height` | `var(--lh-card)` |
| `color` | `var(--brand-accent-text)` |
| `margin-top` | `var(--space-global-xs)` |

**Each topic (`.blog-index-card__topic`):** Plain text label. Not a pill, not a chip, not an independent link — the whole card is already a link. Middle dot separator between topics (inside the span, not via `::after`, so flex-wrap handles it cleanly).

**Topic overflow.** If a post has more than 3 topics, render the first 3 and suffix `"+N more"` (e.g. `Consent · Puberty · Online safety · +2 more`). The `"+N more"` suffix uses the same token set as a topic label but with `color: var(--text-body-muted)` and `font-weight: var(--font-weight-regular)`.

### §3.2 — Card states

| State | Visual |
|---|---|
| Rest | `--shadow-xs`, `--border-subtle` |
| Hover / focus-visible | `--shadow-lg`, `--brand-accent` border, `translateY(-2px)` |
| Filtered out | `display: none` (via JS) |
| Paginated out | `display: none` (via JS) |

Card focus ring: relies on the global `:focus-visible` outline from the design system (the `<a>` element receives focus). No separate focus styles on the card itself.

### §4 — Empty / no-results state

Conditional. Rendered inside the `.blog-grid-section` wrapper when a filter combination produces zero visible cards (JS toggles display), or when the blog has zero published posts at build time (rendered instead of the grid).

```
┌──────────────────────────────────────────────────────┐
│  --bg-page                                             │
│                                                        │
│  h2   "No posts match these filters"                   │
│  p    "Try clearing a filter or browse all topics →"   │
│                                                        │
│  [Clear filters]  [Browse topics →]                   │
└──────────────────────────────────────────────────────┘
```

- **Container:** `mx-auto w-full max-w-[var(--container-max-prose)]`, `text-align: left`, `py-[var(--space-struct-y-base)]`.
- **h2:** `font-family: var(--font-tailor-heading-stack)`, `font-size: var(--text-prose-size-h3)`, `font-weight: var(--heading-weight-h3)`, `line-height: var(--lh-heading)`, `color: var(--text-heading)`, `margin: 0 0 var(--space-global-sm)`.
- **Body (`<p>`):** `font-size: var(--text-prose-size-body)`, `color: var(--text-body-muted)`, `line-height: var(--lh-body)`, `margin: 0 0 var(--space-global-md)`. Text: `[COPY TBD — "Try clearing a filter or browse all topics →"]`.
- **Buttons:** `<button class="btn btn--std btn--outline">Clear filters</button>` (triggers `resetFilters()` in JS) and `<a class="btn btn--std btn--primary has-icon-hover" href="/topics/">Browse topics</a>`. `display: flex`, `gap: var(--space-global-sm)`, `flex-wrap: wrap`.

**Two distinct trigger conditions:**

1. **Filter-empty** — live, JS-driven: the grid renders but all cards are hidden by filter. Show the empty state in place of the grid. Both CTAs render.
2. **Archive-empty** — build-time: `posts.length === 0`. Show a softer message without the "Clear filters" button (there are no filters to clear). `[COPY TBD — "No posts yet. Check back soon, or explore topics →"]`. Only the "Browse topics" CTA renders.

### §5 — Load more (progressive pagination)

Conditional. Renders only when filtered-visible post count exceeds `POSTS_PER_PAGE` (default `12`). Client-side pagination — all matching posts render into the DOM at build time; JS reveals batches of `POSTS_PER_PAGE` at a time by toggling a `.is-hidden-batch` class.

**Skip threshold — ship without it at launch.** When `posts.length <= 24` (i.e. the whole archive fits in two batches), the Load More control is **not rendered at all**. The extra chrome for the sake of one click isn't worth the visual cost, and at launch with 5–15 posts the archive will always fit in the first batch anyway. The logic ships behind a gate so pagination quietly activates once the archive grows past 24 posts, without requiring a code change. The gate lives in the page frontmatter:

```astro
---
const showLoadMore = posts.length > 24;
---
```

```
┌──────────────────────────────────────────────────────┐
│  --bg-page                                             │
│                                                        │
│        Showing 12 of 37 posts                          │
│                                                        │
│              [  Load more posts  ]                     │
│                                                        │
└──────────────────────────────────────────────────────┘
```

- **Outer wrapper:** `<nav class="blog-pagination" aria-label="Blog pagination">`, `w-full px-[var(--space-global-gutter)]`, `pt-[var(--space-global-lg)]`, `pb-[var(--space-struct-y-base)]`. Rendered only when `showLoadMore === true`.
- **Inner wrapper:** `mx-auto w-full max-w-[var(--container-max-shell)]`, `display: flex`, `flex-direction: column`, `align-items: center`, `gap: var(--space-global-sm)`.

**Load more button (`.blog-pagination__load-more`):**

Use the existing button system — `<button class="btn btn--std btn--outline" type="button">Load more posts</button>`. No icon modifier — the label does the work; arrow glyphs on a stacked "Load more" button read as directional noise.

Hidden (not `disabled`, but removed from layout with `hidden` attribute) when all matching posts are visible. `disabled` would leave a dead control sitting below the grid; hiding it is cleaner.

**Status line (`.blog-pagination__status`):**

| Property | Token |
|---|---|
| `font-family` | `var(--font-tailor-body-stack)` |
| `font-size` | `var(--text-card-size-body)` |
| `font-weight` | `var(--font-weight-regular)` |
| `color` | `var(--text-body-muted)` |

Format: `"Showing {visibleCount} of {matchedCount} posts"`. Same sentence structure as the filter bar's result count — intentionally redundant at the top and bottom of the grid so the user always knows where they are without scrolling to either end. `aria-live="polite"` so Load More clicks are announced.

*Note: the §2 filter-bar count is the authoritative live region; the §5 status line is its pair at the grid's base. If assistive tech announces both, that's acceptable — better than missing the state change. If duplicate announcements become noisy in testing, drop `aria-live` from §5 and keep §2 as the single announcer.*

**Scroll behaviour.** No scroll jump on Load More — the newly-revealed batch appears directly below the user's current scroll position, which is the whole point of the pattern (versus numbered pagination where the user needs to re-orient). Focus management: after Load More resolves, move keyboard focus to the *first newly-revealed card's link* so keyboard users continue reading into the new batch rather than having focus stranded on the button. When the button disappears (final batch loaded), focus moves to the status line instead.

**URL state.** The page number is **not** mirrored in the URL. Filter state is (see §6), but the "how many batches have I loaded" state is ephemeral — a refresh resets to the first batch. This is intentional: bookmarks and shared links go to a canonical filter view, not a scroll-depth snapshot. If a user wants to deep-link to "the 37th post", the post has its own URL at `/blog/{slug}/`.

---

## 5 · Template structure

```
<BaseLayout>
  <header class="blog-index-hero">             ← §1 --bg-tinted band
    <div class="blog-index-hero__inner">
      §1: Eyebrow + h1 + intro
    </div>
  </header>

  <main class="blog-index">                     ← --bg-page
    <section class="blog-filters" aria-label="Filter posts" data-pagefind-ignore="all">
      §2: Category toolbar + Topic toolbar + count
    </section>

    <section class="blog-grid-section">
      <ul class="blog-grid" role="list">
        §3: .blog-grid__item × n        — cards
      </ul>
      <div class="blog-empty" hidden>
        §4: Empty / no-results state
      </div>
    </section>

    {showLoadMore && (
      <nav class="blog-pagination" aria-label="Blog pagination">
        §5: Status line + Load More button
      </nav>
    )}
  </main>
</BaseLayout>
```

Everything inside `<BaseLayout>` is Tailor layer by default. No `.layer-ota` class anywhere on this page.

---

## 6 · Client-side behaviour

```typescript
// src/pages/blog/index.astro — script block

const POSTS_PER_PAGE = 12;

function initB9() {
  const grid       = document.querySelector<HTMLUListElement>('.blog-grid');
  const chips      = document.querySelectorAll<HTMLButtonElement>('.blog-filter-chip');
  const count      = document.querySelector<HTMLElement>('.blog-filters__count');
  const empty      = document.querySelector<HTMLElement>('.blog-empty');
  const pagination = document.querySelector<HTMLElement>('.blog-pagination');
  const loadMore   = document.querySelector<HTMLButtonElement>('.blog-pagination__load-more');
  const status     = document.querySelector<HTMLElement>('.blog-pagination__status');
  const toolbars   = document.querySelectorAll<HTMLElement>('.blog-filters__row[role="toolbar"]');

  if (!grid) return;

  const items = Array.from(grid.querySelectorAll<HTMLLIElement>('.blog-grid__item'));
  let currentCategory = 'all';
  let currentTopic    = 'all';
  let batchesShown    = 1;  // load-more state; never persisted to URL

  // ─── URL state ───────────────────────────────────────────────
  function hydrateFromURL() {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category');
    const top = params.get('topic');
    if (cat) currentCategory = cat;
    if (top) currentTopic    = top;
    // Reflect hydrated state back onto chips
    chips.forEach((chip) => {
      const type  = chip.dataset.filterType;
      const value = chip.dataset.filterValue || 'all';
      const active =
        (type === 'category' && value === currentCategory) ||
        (type === 'topic'    && value === currentTopic);
      chip.classList.toggle('is-active', active);
      chip.setAttribute('aria-pressed', active ? 'true' : 'false');
      chip.tabIndex = active ? 0 : -1;
    });
  }

  function pushURL() {
    const params = new URLSearchParams();
    if (currentCategory !== 'all') params.set('category', currentCategory);
    if (currentTopic    !== 'all') params.set('topic',    currentTopic);
    const qs = params.toString();
    const next = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
    window.history.replaceState(null, '', next);
  }

  // ─── Filtering + rendering ───────────────────────────────────
  function matchesFilters(item: HTMLLIElement): boolean {
    const categoryOk = currentCategory === 'all' || item.dataset.category === currentCategory;
    const topicsAttr = item.dataset.topics || '';
    const topicOk    = currentTopic === 'all' || topicsAttr.includes(`|${currentTopic}|`);
    return categoryOk && topicOk;
  }

  function render(opts: { focusFirstNew?: boolean } = {}) {
    const matched  = items.filter(matchesFilters);
    const maxBatch = Math.max(1, Math.ceil(matched.length / POSTS_PER_PAGE));
    if (batchesShown > maxBatch) batchesShown = maxBatch;
    const visibleCount = Math.min(matched.length, batchesShown * POSTS_PER_PAGE);

    // Hide everything, then reveal the first `visibleCount` matched
    items.forEach((li) => { li.style.display = 'none'; });
    const visibleItems = matched.slice(0, visibleCount);
    visibleItems.forEach((li) => { li.style.display = ''; });

    if (count)  count.textContent  = `Showing ${visibleCount} of ${matched.length} posts`;
    if (empty)  empty.hidden       = matched.length > 0;
    if (status) status.textContent = `Showing ${visibleCount} of ${matched.length} posts`;

    if (loadMore && pagination) {
      const hasMore = matched.length > visibleCount;
      loadMore.hidden = !hasMore;
      pagination.hidden = matched.length <= POSTS_PER_PAGE;
    }

    // After Load More, move focus to the first newly-revealed card (a11y)
    if (opts.focusFirstNew) {
      const firstNew = visibleItems[Math.max(0, visibleCount - POSTS_PER_PAGE)];
      const link = firstNew?.querySelector<HTMLAnchorElement>('a.blog-index-card');
      if (link) link.focus();
      else if (status) status.focus();
    }
  }

  // ─── Chip click handling ─────────────────────────────────────
  function activateChip(btn: HTMLButtonElement) {
    const type  = btn.dataset.filterType as 'category' | 'topic';
    const value = btn.dataset.filterValue || 'all';
    document
      .querySelectorAll<HTMLButtonElement>(`.blog-filter-chip[data-filter-type="${type}"]`)
      .forEach((b) => {
        const isThis = b === btn;
        b.classList.toggle('is-active', isThis);
        b.setAttribute('aria-pressed', isThis ? 'true' : 'false');
        b.tabIndex = isThis ? 0 : -1;
      });
    if (type === 'category') currentCategory = value;
    else                      currentTopic    = value;
    batchesShown = 1;          // reset batch count on filter change
    pushURL();
    render();
  }

  chips.forEach((btn) => {
    btn.addEventListener('click', () => activateChip(btn));
  });

  // ─── ARIA Toolbar keyboard nav — Left/Right roving tabindex ─
  toolbars.forEach((toolbar) => {
    const rowChips = Array.from(toolbar.querySelectorAll<HTMLButtonElement>('.blog-filter-chip'));
    toolbar.addEventListener('keydown', (e) => {
      const currentIdx = rowChips.findIndex((c) => c === document.activeElement);
      if (currentIdx < 0) return;
      let nextIdx = currentIdx;
      if (e.key === 'ArrowRight')      nextIdx = (currentIdx + 1) % rowChips.length;
      else if (e.key === 'ArrowLeft')  nextIdx = (currentIdx - 1 + rowChips.length) % rowChips.length;
      else if (e.key === 'Home')       nextIdx = 0;
      else if (e.key === 'End')        nextIdx = rowChips.length - 1;
      else return;
      e.preventDefault();
      rowChips[currentIdx].tabIndex = -1;
      rowChips[nextIdx].tabIndex    = 0;
      rowChips[nextIdx].focus();
      // Arrow keys move focus only — do NOT auto-activate. The user
      // presses Enter/Space to commit the selection (standard toolbar
      // single-selection behaviour).
    });
  });

  // ─── Load more ───────────────────────────────────────────────
  loadMore?.addEventListener('click', () => {
    batchesShown += 1;
    render({ focusFirstNew: true });
  });

  // ─── Empty state "Clear filters" ─────────────────────────────
  document.querySelector<HTMLButtonElement>('.blog-empty__clear')?.addEventListener('click', () => {
    currentCategory = 'all';
    currentTopic    = 'all';
    batchesShown    = 1;
    chips.forEach((b) => {
      const isAll = b.dataset.filterValue === 'all';
      b.classList.toggle('is-active', isAll);
      b.setAttribute('aria-pressed', isAll ? 'true' : 'false');
      b.tabIndex = isAll ? 0 : -1;
    });
    pushURL();
    render();
  });

  // ─── Initial render ──────────────────────────────────────────
  hydrateFromURL();
  render();
}

document.addEventListener('astro:page-load', initB9);
```

**State model.** Filter state is mirrored to the URL query string (`?category=…&topic=…`); load-more batch count is not. A refresh on `/blog/?category=Practical%20teaching` returns the user to the same filtered view with one batch of posts visible, every time. This makes filter views bookmarkable, shareable, and linkable from elsewhere in the site (e.g. topic pages can deep-link to `/blog/?topic=Consent` to show consent posts). Canonical URL is unconditionally `/blog/` regardless of query string — see §9.

**URL encoding.** Values are stored unencoded in the `data-filter-value` attribute (as the canonical category/topic label) and encoded by `URLSearchParams` on write. On read, `URLSearchParams.get()` returns the decoded value. No manual `encodeURIComponent` calls needed.

**Invalid URL values.** If the URL contains `?category=BOGUS` (a value not matching any chip), the hydrate step still sets `currentCategory = 'BOGUS'` but no chip will `.is-active` and no posts will match → the empty state renders with a "Clear filters" action. This is an acceptable degradation; we don't silently rewrite the URL on invalid values.

---

## 7 · Responsive behaviour

| Breakpoint | Grid | Card image | Filter bar | Load More |
|---|---|---|---|---|
| `< 640px` | 1 column | 16:9, full card width | Label stacks above chips; chips in horizontal-scroll track with `scroll-snap-type: x mandatory` | Full-width `btn--std` |
| `≥ 640px` | 2 columns | 16:9 | Label stacks above chips; scroll track still active | Centered |
| `≥ 768px` | 2 columns | 16:9 | Label inline with chips; chips wrap normally (no scroll track) | Centered |
| `≥ 1024px` | 3 columns | 16:9 | Label inline; chips wrap | Centered |

Two structural breakpoints matter here: **640px** (grid goes 1→2 cols) and **768px** (filter bar switches from scroll track to wrap). Above 1024px, the grid steps up to 3 columns but the filter bar doesn't change further. The card height equalises across columns via `height: 100%` + `flex: 1` on the body.

**Mobile filter track.** Below 768px, the filter chips live inside `.blog-filters__scroll` with `overflow-x: auto`, `scroll-snap-type: x mandatory`, hidden scrollbar, and a right-edge fade gradient to hint at overflow (see §2 filter bar for full CSS). The label for each row (`Category` / `Topic`) stacks above the track, not beside it, so the scroll track gets the full viewport width. This follows the "horizontally-scrolling chip rail" pattern familiar from iOS filter UI and Material Design's chip scroll — the convention carries the affordance.

**Image loading.** First 3 cards (first row on desktop, first 1–2 on mobile) use `loading="eager"`; all subsequent use `loading="lazy"`. The eager-loaded range is a build-time cutoff — mark `posts.slice(0, 3)` and pass `eager` into the card component.

---

## 8 · Accessibility

- `<header>` wraps the hero. `<main>` wraps everything below. `<nav aria-label="Blog pagination">` wraps §5 when present.
- **Heading hierarchy.** h1 in §1 hero; card titles at h3 (see §3.1 rationale — allows heading-nav jumping between posts). Filter-row labels are rendered as `<span>` not `<h2>`, because they are UI labels not content sections.
- **Filter toolbars.** Each filter row carries `role="toolbar"` with `aria-label="Filter by category"` / `"Filter by topic"`. WAI-ARIA toolbar keyboard pattern applies: Tab moves between toolbars (and into/out of the filter region), Arrow Left / Arrow Right move between chips within a toolbar, Home / End jump to first / last chip. Chips use roving `tabindex` — the active chip is `tabindex="0"`, all others `tabindex="-1"`. Arrow keys move focus but do not auto-activate; the user presses Enter or Space to commit (matching WAI-ARIA single-selection toolbar behaviour, consistent with macOS/iOS segmented-control UX).
- **Pressed state.** Each chip carries `aria-pressed="true"` (active) or `aria-pressed="false"` (inactive).
- **Live regions.** Result count (`.blog-filters__count`) and Load More status (`.blog-pagination__status`) both `aria-live="polite"`. If dual-announcement proves noisy, drop the Load More `aria-live` in testing.
- **Cards.** Whole card is `<a>`. Topic labels inside are plain text, not nested links — avoids nested-interactive issues.
- **Featured image.** `alt=""` (decorative — the title alongside carries the information). Matches the C4 related-card treatment. Per-post editorial alt text is a later enhancement.
- **Dates.** `<time datetime="{ISO}">` on every date.
- **Fallback image** `<div>` has `aria-hidden="true"`.
- **Load More button.** `<button type="button">` — not a link. Carries a natural label ("Load more posts"); no `aria-expanded` or other state attribute needed. On activation, moves focus to the first newly-revealed card's `<a>` so the user lands on reading content, not stranded on the just-clicked button.
- **Empty-state** "Clear filters" is a `<button>`; "Browse topics" is an `<a>` — semantically correct for their behaviours.
- **Reduced motion.** No smooth scroll is triggered by filter changes or Load More — the JS doesn't scroll the page. Card hover `translateY(-2px)` is cosmetic only and respects the global `@media (prefers-reduced-motion)` rule in the design system.

---

## 9 · SEO & metadata

- `<title>`: `"Blog — Tailor Education"` *[COPY TBD — Gareth may prefer "Writing — Tailor Education"]*.
- `<meta name="description">`: *[COPY TBD — 1 sentence. Draft: "Practical guidance on RSE teaching, curriculum planning, and bringing relationships education to life in schools."]*.
- **Canonical URL.** `canonicalPath: "/blog/"`, emitted **unconditionally** — every filtered view (`?category=Practical%20teaching`, `?topic=Consent`, etc.) declares `/blog/` as its canonical. There is no distinct indexable URL per filter combination; the filter state is a presentation layer on the same underlying archive. Crawlers should index `/blog/` once; users bookmark `/blog/?topic=Consent` and get the filtered view back on visit.
- `og:type`: `"website"`.
- `og:image`: Omit (the index has no single hero image). If launch needs social preview artwork, Gareth supplies a dedicated OG image.
- **Pagefind integration.** The whole site uses Pagefind for on-site search. Two concerns on this page:
  - The filter strip (`<section class="blog-filters" data-pagefind-ignore="all">`) carries `data-pagefind-ignore="all"` so none of the chip button text ("Practical teaching", "Consent", etc.) leaks into search-result snippets. Without this, searching for a topic name surfaces the blog index as a match on the literal chip text — misleading and unhelpful.
  - The grid itself is *not* ignored — Pagefind can index card titles and excerpts so the index acts as a secondary entry point. However the canonical search target for any given post is the post's own page at `/blog/{slug}/`. The C4 post template carries the same title and excerpt content, and Pagefind's ranking will prefer the longer post body. In practice, searching "consent lesson" lands on individual posts, not on the blog index.
  - The Load More button and status line are inside `<nav class="blog-pagination">`; this can optionally carry `data-pagefind-ignore="all"` too. Not strictly needed since the content is just "Load more posts" and "Showing 12 of 37 posts" — unlikely to match any real query — but a belt-and-braces exclusion costs nothing.
- **JSON-LD — `Blog` schema.** Use `@type: "Blog"` rather than `ItemList`. `Blog` is the semantically correct schema.org type for this page (per schema.org's own guidance: "A blog, sometimes known as a 'weblog'. Note that posts are usually times; one can assume that every `BlogPosting` in the `blogPost` property is of that type."). `ItemList` is generic and doesn't tell crawlers "this is a blog index" — `Blog` does. Google supports both but prefers `Blog` for actual blog index pages.

```json
{
  "@context": "https://schema.org",
  "@type": "Blog",
  "name": "Tailor Education — Blog",
  "url": "https://tailoreducation.org.uk/blog/",
  "blogPost": [
    {
      "@type": "BlogPosting",
      "headline": "{post.title}",
      "url": "https://tailoreducation.org.uk/blog/{slug}/",
      "datePublished": "{post.publishedDate}",
      "author": { "@type": "Person", "name": "{post.author}" },
      "image": "{post.featuredImage}",
      "description": "{post.metaDescription}"
    }
    // … up to 50 posts, newest first
  ]
}
```

Limit to the first 50 posts to cap payload. Only render when `posts.length > 0`. Omit `author` when the field is empty; omit `image` when `featuredImage` is null; omit `datePublished` when `publishedDate` is null.

---

## 10 · Contradictions & clarifications

| Topic | Resolution |
|---|---|
| Featured / lead post | **Not used.** All posts sit in one uniform grid sorted newest-first. Editorial curation overhead isn't worth the visual cost on v2. The C4 spec treats the archive as a flat list; B9 matches. The first card in the grid is, by definition, the latest. This supersedes the v1.0 "§2 featured lead post" section. |
| Card component reuse | New `.blog-index-card`. Not `QuestionCard` (wrong content type, OtA-layer styling). Not `.topic-hub-card` (different axis — topics not posts, horizontal layout). Not the design-system `.card` base (card needs a specific media→category→title→excerpt→meta→topics stack that doesn't map cleanly to `.card__eyebrow` / `.card__title` / `.card__text`). Scoped to `<style>` in the page template. |
| Filter approach | Two dimensions (category + topic), client-side, single active pill per row. AND'd together. Matches B14's model, extended to two axes. No multi-select — if Gareth needs that later it's a v3 feature. |
| Why category and not audience | Category ("Practical teaching" / "Curriculum & policy" / "Bridging content") is the stronger editorial axis for a teacher triaging the archive — it answers "what kind of post is this?" rather than "who is it addressed to?". Most posts at launch target the same audience (Teachers) so an audience filter would collapse to a near-single-state control in practice. Category is a real Notion select with meaningful cardinality. `targetAudience` stays in the schema for future use but isn't surfaced in v2.2. |
| Sort control | Not surfaced as UI in v2.2. Newest-first is the only mode. Reserve the space architecturally; ship without the selector. |
| Pagination — Load More vs numbered | **Load More** pattern, not numbered Previous/Next. Numbered pagination makes sense when pages are resource-bounded (server round-trips, reading checkpoints in a long-form book). This archive is fully client-side rendered; there's no round-trip cost to revealing the next batch. Load More keeps the reader's scroll position stable and avoids the "Page 2 of 4" cognitive overhead — the user's mental model is "more posts below" not "next page of posts". |
| Pagination — ship-gate | `posts.length > 24` threshold. At launch with ~5–15 posts, the Load More control is suppressed entirely — the full archive renders and no pagination chrome appears. The logic ships behind the gate so Load More quietly turns on once the archive grows, without needing a code change. |
| Filter state in URL | Filter state mirrors to `?category=…&topic=…`; Load More batch count does not. Rationale: filter views are the thing worth bookmarking and sharing; scroll-depth snapshots are not. Canonical URL is unconditionally `/blog/` regardless of query string — crawlers index one URL, users bookmark any. |
| ARIA Toolbar vs Group | Each filter row is `role="toolbar"` (not `role="group"`) because each row is a *set of controls operating on the same axis with single-selection semantics* — the toolbar pattern gives roving-tabindex keyboard nav (Left/Right within a row, Tab between rows) for free. Group would force Tab through every chip, which is noise. |
| `contentTags` field | Not surfaced as a filter in v2.2. Stays in the data for related-post scoring (already used by C4). If a third filter axis is wanted later, this is the hook. |
| Heading alignment | Left. Tailor layer convention. No centred headings anywhere on this page. |
| Card heading level | `<h3>` on every card title (not `<h2>`). Filter-row labels are `<span>` rather than `<h2>`, so h3 is the natural next level; and a screen-reader user navigating by heading (H shortcut) can jump post-to-post-to-post through the grid without traversing a layer of filter-section headings first. |
| Container width | `--container-max-shell` (72rem) for every section except §4 (empty state, prose measure). |
| Hero surface | `--bg-tinted`, not `--bg-surface`. `--bg-surface` would read almost identical to the card fills below and blur the hero/grid boundary; `--bg-tinted` gives the top of the page a clear tonal identity without shouting. Matches the B5 "start tinted, resolve to page" pattern. |
| Hero image | None. Covered in §1 rationale. |
| Dark band anywhere on page | No. Blog is a reading surface; C5/B5 dark-band treatment would misfire here. |
| Mobile filter layout | Below 768px, chips move into a horizontal-scroll track (`overflow-x: auto`, `scroll-snap-type: x mandatory`) with the row label stacked above. Rationale: two filter rows wrapping across 3–4 chip-lines each can consume half the viewport before a reader sees a post. The scroll track is a strong mobile convention (iOS / Material), and the right-edge fade gradient carries the affordance. |
| Pagefind integration | `data-pagefind-ignore="all"` on the filter strip so chip button text doesn't leak into on-site search result snippets. Optionally on the Load More block too. Grid cards are not ignored — Pagefind ranks the individual post pages higher anyway. |
| JSON-LD schema choice | `@type: "Blog"` with nested `blogPost[]` of `@type: "BlogPosting"` entries. Not `ItemList`. `Blog` is the semantically specific type for this page; `ItemList` is generic and gives crawlers less to work with. |
| Number of topics on a card | First 3, then "+N more". Prevents card-height runaway on posts tagged into many topics. |
| Category eyebrow colour | `--brand-accent-text` across all three categories. The three blog categories don't have their own colour system the way OtA categories do, and introducing one would fight the Tailor layer's calm palette. The label does the distinguishing work. |
| Featured image aspect | 16:9. Matches C4 hero aspect. Consistent social card appearance. |
| Excerpt length | 140 chars word-boundary truncated at build time; CSS line-clamp to 2 visual lines is a safety net. |
| Class naming — `.blog-filter-chip` | The pill control is `.blog-filter-chip`, not `.blog-filter`. The `-chip` suffix names the shape of the control and disambiguates from the section wrapper `.blog-filters`. |
| Relationship to v1.0 spec | This is v2.2 and supersedes the 2026-04-11 v1.0 draft and the intermediate v2.1. The v1.0 featured-post section is retired. The v1.0 three-axis filter is reduced to two (category + topic); `targetAudience` and `contentTags` stay in the data for future use. What *is* reclaimed from v1.0: URL query-string state, ARIA Toolbar keyboard pattern, Pagefind integration, JSON-LD `Blog` schema, Load More pagination, mobile horizontal-scroll chip track. |

---

## 11 · Build checklist

### Data layer

1. [ ] Add `deriveExcerpt(post, maxChars = 140)` helper to `src/lib/blog-helpers.ts` (reuses C4's first-paragraph logic, falls back to `metaDescription`).
2. [ ] Add `formatDate(iso)` helper to `src/lib/blog-helpers.ts` if not already present — British short format via `Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })`. Match C4 exactly.
3. [ ] Sort posts newest-first at build time in the page frontmatter. Posts without `publishedDate` to the bottom; secondary sort alphabetical by title.
4. [ ] Derive filter data: fixed category list (`Practical teaching`, `Curriculum & policy`, `Bridging content`), deduplicated topic list (ordered by first appearance).

### Template

5. [ ] Rewrite `src/pages/blog/index.astro`.
6. [ ] §1 hero: `<header class="blog-index-hero">` with eyebrow + h1 + intro paragraph; all on `--bg-tinted` band with bottom border.
7. [ ] §2 filter bar: two `.blog-filters__row` rows with `role="toolbar"` (Category, Topic), each with label + chip track. Chips carry `data-filter-type="category" | "topic"`, `data-filter-value`, `aria-pressed`, roving `tabindex`. "All" chip starts active.
8. [ ] Mobile chip track: `.blog-filters__scroll` with `overflow-x: auto`, `scroll-snap-type: x mandatory`, right-edge fade. `@media (min-width: 768px)` drops the track and lets chips wrap.
9. [ ] Filter strip wrapper carries `data-pagefind-ignore="all"`.
10. [ ] Result count element (`.blog-filters__count`) with `aria-live="polite"`.
11. [ ] §3 grid: `<ul class="blog-grid" role="list">`. Each `<li class="blog-grid__item">` carries `data-category`, `data-topics` (pipe-delimited).
12. [ ] Each card: new `.blog-index-card` component inside the `<li>`. 16:9 image → category eyebrow → h3 title → excerpt → meta → topics.
13. [ ] Image fallback: `.blog-index-card__img-fallback` `<div>` on `--bg-tinted` when `featuredImage` is null.
14. [ ] First 3 cards: `loading="eager"` on `<img>`; remainder `loading="lazy"`.
15. [ ] §4 empty state: two modes — archive-empty (build-time, no "Clear filters" button) and filter-empty (live, both CTAs).
16. [ ] §5 Load More: `<nav class="blog-pagination">` containing status line + `.blog-pagination__load-more` button. Rendered only when `showLoadMore = posts.length > 24`.
17. [ ] Page-scoped `<style>` block with `.blog-index-hero`, `.blog-filters`, `.blog-filter-chip`, `.blog-filters__scroll`, `.blog-grid`, `.blog-index-card` (and sub-parts), `.blog-empty`, `.blog-pagination`. Do **not** add any of these classes to `tailor-site-v2.css`.
18. [ ] `<script>` block with `initB9()` — URL-state hydrate + chip activation + toolbar keyboard nav (Left/Right/Home/End) + Load More + empty-state toggle + focus management on Load More.

### SEO

19. [ ] `<title>` and meta description passed to `BaseLayout`.
20. [ ] JSON-LD `@type: "Blog"` with `blogPost[]` of `BlogPosting` entries (first 50 posts, newest first), only when posts exist.
21. [ ] `canonicalPath: "/blog/"` emitted unconditionally (i.e. same canonical for `/blog/` and all `?category=…&topic=…` query variants).

### Verification

22. [ ] Visual review at `< 640px`, `640–767px`, `768–1023px`, `≥ 1024px`. Grid goes 1→2 at 640; filter bar goes scroll-track→wrap at 768; grid goes 2→3 at 1024.
23. [ ] Filter combinations: each category × each topic × "all" — confirm correct cards visible. Test the `category === null` case (posts should only appear when the category filter is "All").
24. [ ] URL state round-trip: click Category=Practical teaching → URL shows `?category=Practical%20teaching`; refresh → same filter active, one batch visible. Share the URL to a second window → same view.
25. [ ] Invalid URL value: navigate to `?category=BOGUS` → empty state renders with "Clear filters" action.
26. [ ] Load More: with >24 posts, button appears; click loads 12 more; focus lands on first newly-revealed card. Final click hides button, focus moves to status line.
27. [ ] Ship-gate: with ≤24 posts, no Load More button in DOM at all.
28. [ ] Filter + Load More interaction: loading batch 3, then clicking a filter → batch count resets to 1 automatically; status and count re-render.
29. [ ] Empty state: "Clear filters" resets all chips and pushes clean URL `/blog/`.
30. [ ] Card hover / focus-visible: shadow lifts, border teal, `translateY(-2px)`.
31. [ ] Image eager-load: first 3 cards load without scroll; remainder lazy.
32. [ ] Featured-image-null path: fallback block renders on `--bg-tinted`, no broken image icon.
33. [ ] Keyboard nav: Tab into first toolbar → focus lands on active chip. Left/Right moves between chips in row, does NOT auto-activate. Enter/Space activates. Tab moves to next toolbar; Tab moves into grid. Home/End jump to first/last chip.
34. [ ] `aria-pressed` toggles correctly on each activation.
35. [ ] Screen-reader pass (VoiceOver or NVDA): toolbar labels announced on Tab-in, active chip announced as "pressed", result count updates announced, Load More status announced.
36. [ ] Pagefind build: search for "Practical teaching" should not return the blog index itself (filter chip text is excluded); should return individual posts that contain that phrase in body copy.
37. [ ] View page source: JSON-LD `@type: "Blog"` present when posts exist, absent when archive-empty. Canonical `/blog/` present regardless of query string.
38. [ ] Build with zero published posts — archive-empty state renders, no JS errors, no JSON-LD block.
39. [ ] Final grep: `.blog-filter` without `-chip` returns zero matches in `src/pages/blog/index.astro`.

---

## 12 · Open items for Gareth

- **Page headline copy** — "Blog" vs "Writing" vs a voice line. The spec ships with "Blog" as working placeholder.
- **Hero intro copy** — 1–2 sentence intro.
- **Empty-state copy** — both modes.
- **SEO meta description** — 1 sentence.
- **Optional OG image** — if launch social preview is wanted, Gareth supplies. Otherwise B9 has no `og:image` and social cards fall back to the site-level default.

*Tokens used in this spec are all present in `tailor-site-v2.css` v2.0.0 and require no additions.*
