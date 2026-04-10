# Tailor Layout Spec — B14 Topics Hub

| Field | Value |
|---|---|
| **Page** | Topics hub |
| **Route** | `/topics/` |
| **Template** | `src/pages/topics/index.astro` (rewrite of existing) |
| **Layer** | Tailor (default — no `.layer-ota` class) |
| **Version** | 1.0 |
| **Date** | 2026-04-09 |

---

## 0 · Purpose

The Topics hub is the teacher-facing catalogue of all RSHE topic landing pages. It replaces the current minimal text-link grid with a richer, filterable card layout featuring SVG illustrations, category filtering, and a curriculum trust signal. The page must feel like a confident directory — "we cover everything, and it's all mapped to the curriculum."

---

## 1 · Data requirements

### 1.1 Landing pages

Source: `getLandingPages()` from `src/lib/content.ts`.

Each `LandingPage` provides: `id`, `title`, `slug`, `category`, `metaDescription` (used as card summary text).

### 1.2 SVG illustrations

Source: `getTopicIllustrationPath(slug)` from `src/lib/topic-illustrations.ts`.

Returns `/images/topics/{filename}` or `null`. Cards with no illustration show a fallback (category-coloured `--bg-surface-alt` block).

### 1.3 Category grouping

7 Tailor categories, same mapping used in C3:

| Category label | Token suffix |
|---|---|
| Relationships | `relationships` |
| Sex & Sexual Health | `sexual-health` |
| Puberty & The Body | `puberty` |
| Identity & Diversity | `identity` |
| Online Safety & Media | `online-safety` |
| Safety & Safeguarding | `safety` |
| Health & Wellbeing | `wellbeing` |

Token reference: `--cat-{suffix}` from `tailor-site-v2.css`.

---

## 2 · Section map

| § | Section | Surface | Container |
|---|---|---|---|
| 1 | Hero | `--bg-surface` | `--container-max-shell` |
| 2 | Category filter + topic card grid | `--bg-page` | `--container-max-shell` |
| 3 | Curriculum trust signal | `--bg-surface-alt` | `--container-max-shell` |
| 4 | CTA — Bring to School `[A12]` | (component owns surface) | (component owns container) |

Page background: `--bg-page`.

---

## 3 · Section details

### §1 — Hero

```
┌──────────────────────────────────────────────────────┐
│  --bg-surface, border-bottom: --border-subtle         │
│                                                        │
│  h1  "RSHE topics"                                     │
│                                                        │
│  p   [COPY TBD — 2-3 sentences, max-width prose]      │
│                                                        │
└──────────────────────────────────────────────────────┘
```

- **Container:** `max-w-[var(--container-max-shell)]`, horizontal gutter `px-[var(--space-global-gutter)]`, vertical `py-[var(--space-global-xl)]`.
- **h1:** `font-family: var(--font-tailor-heading-stack)`, `font-size: var(--text-display-size-h1)`, `font-weight: var(--heading-weight-h1)`, `color: var(--text-heading)`. Left-aligned (Tailor headings are left-aligned).
- **Intro paragraph:** `font-family: var(--font-tailor-body-stack)`, `font-size: var(--text-prose-size-body)`, `color: var(--text-body-muted)`, `max-width: var(--container-max-prose)`, `line-height: var(--lh-body)`. Sits below h1 with `margin-top: var(--space-global-sm)`.

### §2 — Category filter + topic card grid

```
┌──────────────────────────────────────────────────────┐
│  --bg-page                                             │
│                                                        │
│  [All] [Relationships] [Sex & Sexual Health] [...]     │
│                                                        │
│  ┌────────────────────────────────────────────┐        │
│  │ ┌──────┐  Category eyebrow (--cat-color)   │        │
│  │ │ SVG  │  Topic Title                      │        │
│  │ │      │  2-line summary from metaDesc      │        │
│  │ └──────┘  Explore topic →                  │        │
│  └────────────────────────────────────────────┘        │
│                                                        │
│  ┌────────────────────────────────────────────┐        │
│  │ ┌──────┐  Category eyebrow                 │        │
│  │ │ SVG  │  Topic Title                      │        │
│  │ │      │  2-line summary                    │        │
│  │ └──────┘  Explore topic →                  │        │
│  └────────────────────────────────────────────┘        │
│                                                        │
│  … (23 cards total, no pagination)                     │
│                                                        │
└──────────────────────────────────────────────────────┘
```

#### 2a — Filter bar

- **Layout:** `flex flex-wrap gap-[var(--space-global-xs)]`, left-aligned.
- **"All" button:** `btn btn--sm btn--tint is-active` (teal tint, same class pattern as B8 "All" button but Tailor styling). `data-category="all"`.
- **Category pills:** Individual `<button>` elements styled as Tailor filter pills:
  - `font-family: var(--font-tailor-body-stack)`, `font-size: var(--text-card-size-body)`, `font-weight: var(--font-weight-semibold)`.
  - Default state: `background: var(--bg-surface)`, `border: var(--border-width-xs) solid var(--border-subtle)`, `border-radius: var(--radius-pill)`, `color: var(--text-body)`, `padding: var(--space-global-xs) var(--space-global-sm)`.
  - Active state (`.is-active`): `background: var(--cat-{token})`, `color: #fff`, `border-color: var(--cat-{token})`.
  - Hover (when not active): `border-color: var(--cat-{token})`, `color: var(--cat-{token})`.
  - Each button carries `data-category="{Category label}"` and `style="--cat-color: var(--cat-{token})"`.
- **ARIA:** `role="group"`, `aria-label="Filter by category"`. Each button has `aria-pressed`.
- **Spacing:** `margin-bottom: var(--space-global-lg)` below filter bar before grid starts.

#### 2b — Topic card grid

- **Layout:** Single-column stack with `gap: var(--space-global-md)`. Each card is full-width — no multi-column grid (horizontal cards already fill the width well).
- **Each card wraps in** `<a>` linking to `/topics/{slug}`.
- **Card wrapper** — `<li>` inside a `<ul role="list">`. Each `<li>` carries `data-category="{Category label}"` for filter JS.

#### 2c — Topic hub card (`.topic-hub-card`)

New card component. Horizontal layout, structurally similar to `.b11-sample-card` but with Tailor tokens throughout.

```
Mobile (< 640px):         Desktop (≥ 640px):
┌─────────────────┐       ┌──────┬──────────────────────────┐
│   ┌──────────┐  │       │      │  Category eyebrow        │
│   │   SVG    │  │       │ SVG  │  Topic Title              │
│   └──────────┘  │       │      │  2-line summary           │
│  Category       │       │      │  Explore topic →          │
│  Title          │       └──────┴──────────────────────────┘
│  Summary        │
│  Explore →      │
└─────────────────┘
```

**Styles (new `.topic-hub-card` class in `<style>` block):**

| Property | Value |
|---|---|
| `display` | `flex` / `flex-direction: column` (row at `≥ 640px`) |
| `gap` | `var(--space-global-md)` |
| `padding` | `var(--space-global-lg)` |
| `background` | `var(--bg-surface)` |
| `border` | `var(--border-width-xs) solid var(--border-subtle)` |
| `border-radius` | `var(--radius-lg)` |
| `text-decoration` | `none` |
| `color` | `inherit` |
| `transition` | `border-color var(--transition-duration) var(--transition-easing)` |
| `:hover` | `border-color: var(--cat-color, var(--brand-accent))` |

**Illustration slot (`.topic-hub-card__illustration`):**

| Property | Value |
|---|---|
| `flex-shrink` | `0` |
| `width` | `6rem` (mobile), `8rem` (≥ 640px) |
| `height` | same as width |
| `background` | `var(--bg-surface-alt)` |
| `border-radius` | `var(--radius-md)` |
| `overflow` | `hidden` |
| `display` | `flex`, `align-items: center`, `justify-content: center` |

**Illustration image (`.topic-hub-card__illustration img`):**

| Property | Value |
|---|---|
| `width` | `100%` |
| `height` | `100%` |
| `object-fit` | `contain` |
| `display` | `block` |

**Fallback:** When `getTopicIllustrationPath()` returns `null`, render the `.topic-hub-card__illustration` div without an `<img>`. The `--bg-surface-alt` backing acts as a neutral placeholder.

**Body slot (`.topic-hub-card__body`):**

| Property | Value |
|---|---|
| `display` | `flex`, `flex-direction: column` |
| `gap` | `var(--space-global-xs)` |
| `justify-content` | `center` |

**Eyebrow (`.topic-hub-card__eyebrow`):**

| Property | Value |
|---|---|
| `font-family` | `var(--font-tailor-body-stack)` |
| `font-size` | `var(--text-card-size-body)` |
| `font-weight` | `var(--font-weight-semibold)` |
| `text-transform` | `uppercase` |
| `letter-spacing` | `var(--text-eyebrow-ls)` |
| `color` | `var(--cat-color, var(--text-body-muted))` |

**Title (`.topic-hub-card__title`):**

| Property | Value |
|---|---|
| `font-family` | `var(--font-tailor-heading-stack)` |
| `font-size` | `var(--text-card-size-h2)` |
| `font-weight` | `var(--heading-weight-h2)` |
| `color` | `var(--text-heading)` |
| `line-height` | `var(--lh-heading-sub)` |
| `margin` | `0` |

**Summary (`.topic-hub-card__summary`):**

| Property | Value |
|---|---|
| `font-family` | `var(--font-tailor-body-stack)` |
| `font-size` | `var(--text-card-size-body)` |
| `color` | `var(--text-body-muted)` |
| `line-height` | `var(--lh-body)` |
| `margin` | `0` |
| `display` | `-webkit-box` |
| `-webkit-line-clamp` | `2` |
| `-webkit-box-orient` | `vertical` |
| `overflow` | `hidden` |

**Action link (`.topic-hub-card__link`):**

| Property | Value |
|---|---|
| `font-size` | `var(--text-card-size-body)` |
| `font-weight` | `var(--font-weight-bold)` |
| `color` | `var(--link-action-color)` |
| `::after` | `content: ' →'` |

### §3 — Curriculum trust signal

```
┌──────────────────────────────────────────────────────┐
│  --bg-surface-alt                                      │
│                                                        │
│  "Aligned to DfE statutory RSE guidance and the        │
│   PSHE Association Programme of Study · KS1–KS5"      │
│                                                        │
└──────────────────────────────────────────────────────┘
```

- **Container:** `max-w-[var(--container-max-shell)]`, `px-[var(--space-global-gutter)]`, `py-[var(--space-global-lg)]`.
- **Text:** Single `<p>`, `text-align: center`.
- `font-family: var(--font-tailor-body-stack)`, `font-size: var(--text-prose-size-body)`, `font-weight: var(--font-weight-medium)`, `color: var(--text-body-muted)`.
- The `·` separator is a styled `<span>` with slight horizontal padding for visual breathing room.
- This is static copy, not data-driven. Hardcoded.

### §4 — CTA — Bring to School `[A12]`

Existing `CtaBringToSchool` component.

```astro
<CtaBringToSchool
  topicTitle="RSHE topics"
  serviceTarget="training"
/>
```

`serviceTarget="training"` maps to the training URL. `topicTitle` is used in the CTA copy — "RSHE topics" keeps it general for a hub page context.

---

## 4 · Client-side behaviour

### 4.1 Category filtering

Same interaction model as B8 but simpler (no pagination).

```typescript
function initB14() {
  const filters = document.querySelectorAll<HTMLButtonElement>('.topic-filter');
  const items = document.querySelectorAll<HTMLLIElement>('.topic-hub-grid > li');

  if (!filters.length || !items.length) return;

  function applyFilter(category: string) {
    items.forEach((li) => {
      const match = category === 'all' || li.dataset.category === category;
      li.style.display = match ? '' : 'none';
    });
  }

  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      filters.forEach((f) => {
        f.classList.remove('is-active');
        f.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');
      applyFilter(btn.dataset.category || 'all');
    });
  });

  // Default: show all
  applyFilter('all');
}

document.addEventListener('astro:page-load', initB14);
```

No pagination. No scroll-to-top. No count indicator. Just show/hide.

---

## 5 · Responsive behaviour

| Breakpoint | Card layout | Illustration size | Filter bar |
|---|---|---|---|
| `< 640px` | Column (stacked) | `6rem × 6rem` | Wraps naturally |
| `≥ 640px` | Row (horizontal) | `8rem × 8rem` | Single row on most viewports |

No multi-column card grid — each card occupies full container width. The horizontal layout within the card provides enough visual density.

---

## 6 · Accessibility

- Filter group: `role="group"`, `aria-label="Filter by category"`.
- Each filter button: `aria-pressed="true|false"`.
- Card links: whole card is `<a>` wrapping content. `alt=""` on decorative illustration images.
- Semantic list: `<ul role="list">` → `<li>` for each card.
- Focus visible: relies on global `:focus-visible` outline from design system.

---

## 7 · SEO & metadata

- `<title>`: "RSHE Topics — Tailor Education"
- `<meta name="description">`: "Browse all RSHE topics — relationships, puberty, sexual health, identity, online safety and more. Curriculum-aligned teaching resources from Tailor Education."
- `canonicalPath`: `/topics/`
- No JSON-LD required for index page (individual C3 pages carry their own).

---

## 8 · Landing page roster (23 pages)

These are the topic landing pages displayed as cards. Order within each category is the display order.

| Category | Title | Slug |
|---|---|---|
| Relationships | Consent | `consent` |
| Relationships | Healthy relationships | `healthy-relationships` |
| Relationships | Friendships | `friendships` |
| Relationships | Families | `families` |
| Relationships | Sex and intimacy | `sex-and-intimacy` |
| Sex & Sexual Health | Contraception | `contraception` |
| Sex & Sexual Health | STIs and sexual health | `stis-and-sexual-health` |
| Sex & Sexual Health | Pregnancy and reproductive health | `pregnancy-and-reproductive-health` |
| Sex & Sexual Health | Sex and the law | `sex-and-the-law` |
| Puberty & The Body | Puberty | `puberty` |
| Puberty & The Body | Body image | `body-image` |
| Puberty & The Body | Bodies and anatomy | `bodies-and-anatomy` |
| Identity & Diversity | LGBTQ+ inclusion | `lgbtq-inclusion` |
| Identity & Diversity | Masculinity and misogyny | `masculinity-and-misogyny` |
| Identity & Diversity | Gender stereotypes and discrimination | `gender-stereotypes-and-discrimination` |
| Online Safety & Media | Online safety | `online-safety` |
| Online Safety & Media | Sexting and sharing nudes | `sexting-and-sharing-nudes` |
| Online Safety & Media | Pornography and media literacy | `pornography-and-media-literacy` |
| Safety & Safeguarding | Abuse, exploitation and violence | `abuse-exploitation-and-violence` |
| Safety & Safeguarding | FGM and harmful practices | `fgm-and-harmful-practices` |
| Safety & Safeguarding | Personal safety | `personal-safety` |
| Health & Wellbeing | Mental health and wellbeing | `mental-health-and-wellbeing` |
| Health & Wellbeing | Self-esteem | `self-esteem` |

23 landing pages across 7 categories. The data source is `getLandingPages()` so the grid will automatically reflect whatever the Notion database contains.

---

## 9 · Contradictions & clarifications

| Topic | Resolution |
|---|---|
| Heading alignment | Left-aligned. This is a Tailor page — Tailor headings are left-aligned. (OtA headings are centred.) |
| Card style | New `.topic-hub-card` — not `.b11-sample-card` (which carries OtA text tokens internally). The hub card uses Tailor tokens throughout. |
| Multi-column grid? | No. Single-column stack of horizontal cards. The illustration + text already fills the width. Multi-column would make cards too cramped. |
| Pagination | None. 23 cards is comfortable without pagination. Filter just shows/hides. |
| SVG illustrations | Same files used on C3 hero. Same background-removed treatment. Smaller scale (6–8rem vs 10–14rem on C3). |
| Container width | `--container-max-shell` (72rem) for all sections, matching C3 and site-wide pattern. The current page uses `max-w-5xl` (64rem) — this gets upgraded. |
| Summary text source | `metaDescription` from the `LandingPage` object. If empty, the summary line is omitted from the card (eyebrow + title + link still render). |

---

## 10 · Build checklist

1. [ ] Rewrite `src/pages/topics/index.astro` — replace entire file with new template
2. [ ] Import `getLandingPages` and `getTopicIllustrationPath`
3. [ ] Build `categoryTokenMap` (same map as C3 template)
4. [ ] Render §1 hero with h1 + intro paragraph
5. [ ] Build category list from landing page data (deduplicate, preserve order)
6. [ ] Render filter bar — "All" button + 7 category pill buttons with `--cat-*` styling
7. [ ] Render `<ul>` grid of `.topic-hub-card` elements, each `<li>` with `data-category`
8. [ ] Each card: illustration (or fallback) + eyebrow + title + summary (clamped 2 lines) + "Explore topic →" link
9. [ ] Add `<script>` block with `initB14()` filter logic
10. [ ] Render §3 curriculum trust signal strip
11. [ ] Add `CtaBringToSchool` with `topicTitle="RSHE topics"` and `serviceTarget="training"`
12. [ ] Write all `.topic-hub-card` styles in `<style>` block (scoped) — do NOT add to `tailor-site-v2.css`
13. [ ] Write `.topic-filter` pill styles in `<style>` block (scoped)
14. [ ] Responsive: card column→row at 640px, illustration 6rem→8rem
15. [ ] Replace `max-w-5xl` with `max-w-[var(--container-max-shell)]` throughout
16. [ ] Update page `<title>` and meta description
17. [ ] Remove old hardcoded `categories` array — data now comes from `getLandingPages()`
18. [ ] Update JSDoc comment at top of file (describe new layout)
19. [ ] Confirm landing page roster count matches Notion data
20. [ ] Visual review: filter interaction, card hover states, responsive breakpoints, fallback illustration
