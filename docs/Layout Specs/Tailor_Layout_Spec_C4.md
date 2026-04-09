# Tailor Layout Spec — C4 Blog Post

| Field | Value |
|---|---|
| **Page** | Blog post |
| **Route** | `/blog/{slug}` |
| **Template** | `src/pages/blog/[...slug].astro` (rewrite of existing) |
| **Layer** | Tailor (default — no `.layer-ota` class) |
| **Instances** | ~20 at launch, growing |
| **Version** | 1.0 |
| **Date** | 2026-04-09 |

---

## 0 · Purpose

Teacher-facing editorial content. Blog posts are the primary thought-leadership and SEO surface — the vehicle for demonstrating expertise, building trust, and driving teachers toward services and lessons. The layout needs to feel authoritative and readable: clean prose measure, strong featured image, clear authorship, and purposeful CTAs.

---

## 1 · Data requirements

### 1.1 BlogPost type

Current type in `src/lib/types.ts`. **Two new fields required** (marked with ✦):

| Field | Type | Source (Notion property) | Notes |
|---|---|---|---|
| `id` | `string` | Page ID | |
| `title` | `string` | Title | Required |
| `slug` | `string` | Slug (rich text) | URL routing |
| `status` | `string \| null` | Status (select) | Only "Published" fetched |
| `topicIds` | `string[]` | Topic (relation) | Resolved to `LandingPageRef[]` |
| `topics` | `LandingPageRef[]` | Resolved | Primary topics |
| `secondaryTopicIds` | `string[]` | Secondary Topics (relation) | |
| `secondaryTopics` | `LandingPageRef[]` | Resolved | |
| `contentTags` | `string[]` | Content Tags (multi-select) | For related post scoring |
| `metaTitle` | `string` | Meta Title (rich text) | SEO |
| `metaDescription` | `string` | Meta Description (rich text) | SEO + OG description |
| `targetAudience` | `string \| null` | Target Audience (select) | "Teachers" / "School leaders" / "Parents" |
| `serviceLink` | `string \| null` | Service Link (select) | Maps to CTA service type |
| `author` | `string` | Author (rich text) | Byline |
| ✦ `featuredImage` | `string \| null` | Featured Image (files) | URL of first file in property |
| ✦ `publishedDate` | `string \| null` | Published Date (date) | ISO date string |
| `body` | `BlockObjectResponse[]` | Page blocks | Notion rich content |

### 1.2 Fetcher changes (`src/lib/fetchers.ts`)

Add to `fetchBlogPosts()` return object:

```typescript
featuredImage: getFilesUrl(p['Featured Image']),
publishedDate: getDateValue(p['Published Date']),
```

**New helper needed — `getFilesUrl()`:** Extract the URL from a Notion `files` property. Notion files properties contain an array of file objects; each has either an `external.url` or `file.url`. Return the first URL or `null`.

```typescript
function getFilesUrl(prop: any): string | null {
  if (prop?.type !== 'files' || !prop.files?.length) return null;
  const f = prop.files[0];
  return f.type === 'external' ? f.external?.url ?? null : f.file?.url ?? null;
}
```

**New helper needed — `getDateValue()`:** Extract the start date string from a Notion `date` property. Return the ISO date string or `null`.

```typescript
function getDateValue(prop: any): string | null {
  if (prop?.type !== 'date' || !prop.date?.start) return null;
  return prop.date.start;
}
```

### 1.3 Related posts

Source: `getRelatedBlogPosts(post, allPosts, 3)` from `src/lib/related-blog-posts.ts`. Returns 2–3 posts scored by shared topics, content tags, and target audience. No changes needed.

### 1.4 Glossary index

Source: `getGlossaryIndex()` from `src/lib/content.ts`. Powers inline tooltips via `injectGlossaryTooltips()`. No changes needed.

---

## 2 · Section map

| § | Section | Surface | Container |
|---|---|---|---|
| 1 | Featured image | `--bg-surface` | Full-bleed within `--container-max-shell` |
| 2 | Header (title + byline + audience + tags) | `--bg-surface` | `--container-max-prose` |
| 3 | Body content | `--bg-page` | `--container-max-prose` |
| 4 | Topic tags `[A16]` | `--bg-page` | `--container-max-prose` |
| 5 | Related blog posts `[A15]` | `--bg-surface-alt` | `--container-max-prose` |
| 6 | CTA `[A13]` | `--bg-page` | (component owns container) |

Page background: `--bg-page`.

**Section ordering note:** Topic tags move from the header (current position) to below the body. Teachers read the article first, then see contextual topic links. This matches the C1 pattern where related content sits after the body.

---

## 3 · Section details

### §1 — Featured image

```
┌──────────────────────────────────────────────────────┐
│  --bg-surface (continuous with §2 header)              │
│                                                        │
│  ┌────────────────────────────────────────────────┐    │
│  │                                                │    │
│  │         Featured image (16:9 aspect)           │    │
│  │                                                │    │
│  └────────────────────────────────────────────────┘    │
│                                                        │
└──────────────────────────────────────────────────────┘
```

- **Outer container:** `max-w-[var(--container-max-shell)]`, `px-[var(--space-global-gutter)]`. Top padding `pt-[var(--space-global-xl)]`. No bottom padding — flows directly into §2 header.
- **Image wrapper (`.blog-post__hero-img`):**
  - `border-radius: var(--radius-lg)`
  - `overflow: hidden`
  - `aspect-ratio: 16 / 9`
  - `max-width: var(--container-max-reading-wide)` — image is wider than prose but not full shell width. Creates a visual hierarchy: image at 56rem, prose at 44rem.
- **Image (`<img>`):**
  - `width: 100%`, `height: 100%`, `object-fit: cover`, `display: block`
  - `loading: eager` (above the fold, LCP candidate)
  - `alt` attribute: use post title as fallback alt text (Notion files don't carry alt text). Format: `"Featured image for {post.title}"`.
- **Conditional:** If `featuredImage` is `null`, omit the entire §1 block. §2 header renders normally without the image — the `--bg-surface` band still works.
- **OG meta:** When `featuredImage` exists, pass it to `BaseLayout` as `ogImage` for social sharing previews. Add `og:image` and `twitter:image` meta tags.

### §2 — Header

```
┌──────────────────────────────────────────────────────┐
│  --bg-surface (continuous from §1), border-bottom      │
│                                                        │
│  h1  "Blog post title"                                 │
│                                                        │
│  By Author Name  ·  9 Apr 2026  ·  [Teachers]   [↗]   │
│                                                        │
└──────────────────────────────────────────────────────┘
```

- **Container:** `max-w-[var(--container-max-prose)]`, `px-[var(--space-global-gutter)]`, `pt-[var(--space-global-lg)]`, `pb-[var(--space-global-xl)]`.
- **Surface:** `--bg-surface` with `border-bottom: var(--border-width-xs) solid var(--border-subtle)`. Continuous with §1 — both §1 and §2 sit inside the same `<header>` element on the `--bg-surface` band.
- **h1:** `font-family: var(--font-tailor-heading-stack)`, `font-size: var(--text-display-size-h1)`, `font-weight: var(--heading-weight-h1)`, `color: var(--text-heading)`, `line-height: var(--lh-display)`. Left-aligned (Tailor heading). `margin: 0 0 var(--space-global-sm)`.
- **Meta line (`.blog-post__meta`):** Flex row, `justify-content: space-between`, `align-items: center`. The left side holds the text metadata, the right side holds the share button.
  - **Left group (`.blog-post__meta-left`):** `display: flex`, `flex-wrap: wrap`, `gap: var(--space-global-sm)`, `align-items: center`.
    - **Author:** `font-family: var(--font-tailor-body-stack)`, `font-size: var(--text-card-size-body)`, `color: var(--text-body-muted)`. Text: "By {author}". Conditional — omit if no author.
    - **Date:** Same tokens as author. Formatted as human-readable: "9 Apr 2026" (use `Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })`). Conditional — omit if no `publishedDate`.
    - **Separator:** When both author and date render, insert a `·` character between them. Style: `color: var(--text-body-muted)`.
    - **Target audience badge:** `padding: 0.125rem 0.5rem`, `background: var(--bg-surface-alt)`, `border-radius: var(--radius-pill)`, `font-weight: var(--font-weight-medium)`, `font-size: var(--text-card-size-body)`. Conditional — omit if no `targetAudience`.
  - **Share button (`.blog-post__share`):** Right-aligned, `flex-shrink: 0`.
    - `<button>` element (not a link — triggers JS behaviour).
    - Uses the Web Share API (`navigator.share()`) where available; falls back to copying the page URL to clipboard.
    - **Icon:** Share/external-link icon (inline SVG, 20×20). `color: var(--text-body-muted)`. No text label — icon only.
    - **Styling:** `background: none`, `border: var(--border-width-xs) solid var(--border-subtle)`, `border-radius: var(--radius-pill)`, `padding: 0.375rem 0.625rem`, `cursor: pointer`.
    - **Hover:** `border-color: var(--brand-accent)`, `color: var(--brand-accent-text)`.
    - **Transition:** `border-color var(--transition-duration) var(--transition-easing), color var(--transition-duration) var(--transition-easing)`.
    - **Feedback:** On successful copy, briefly swap icon to a checkmark for 2 seconds, then revert.
    - **Share data:** `{ title: post.title, url: canonicalUrl }`.
    - **ARIA:** `aria-label="Share this article"`.
- **No topic tags here.** Tags move to §4, after the body.

### §3 — Body content

```
┌──────────────────────────────────────────────────────┐
│  --bg-page                                             │
│                                                        │
│  [Rendered Notion body content at prose measure]       │
│  [Inline glossary tooltips A7 active]                  │
│                                                        │
└──────────────────────────────────────────────────────┘
```

- **Container:** `max-w-[var(--container-max-prose)]`, `px-[var(--space-global-gutter)]`, `py-[var(--space-struct-y-base)]`.
- **Prose styles** — scoped via `.blog-post__body :global(.prose)`:

| Element | Tokens |
|---|---|
| Body text | `font-family: var(--font-tailor-body-stack)`, `font-size: var(--text-prose-size-body)`, `color: var(--text-body)`, `line-height: var(--lh-prose)` |
| `h2` | `--font-tailor-heading-stack`, `--text-prose-size-h2`, `--heading-weight-h2`, `color: var(--text-heading)`, `margin-top: var(--space-global-lg)`, `margin-bottom: var(--space-global-sm)` |
| `h3` | `--font-tailor-heading-stack`, `--text-prose-size-h3`, `--heading-weight-h3`, `color: var(--text-heading)`, `margin-top: var(--space-global-md)`, `margin-bottom: var(--space-global-xs)` |
| `p` | `margin-bottom: var(--space-global-sm)` |
| `ul`, `ol` | `margin-bottom: var(--space-global-sm)`, `padding-left: 1.5rem` |
| `li` | `margin-bottom: 0.25rem` |
| `a` | `color: var(--brand-accent-text)`, `text-decoration: underline` |
| `blockquote` | `border-left: 3px solid var(--brand-accent)`, `padding-left: var(--space-global-md)`, `margin: var(--space-global-md) 0`, `font-style: italic`, `color: var(--text-body-muted)` |

- **Glossary tooltips (A7):** Applied via `injectGlossaryTooltips(bodyHtml, glossaryIndex)`. The tooltip component handles Tailor-layer rendering automatically (Lexend body text, neutral surfaces). `<GlossaryTooltips />` component included at page bottom for the tooltip JS.
- **Notion images in body:** Notion body blocks may contain images. These render at full prose width via `renderBlocks()`. No special handling needed — existing render pipeline handles this.

### §4 — Topic tags `[A16]`

```
┌──────────────────────────────────────────────────────┐
│  --bg-page (continuous from §3)                        │
│                                                        │
│  Topics:  [Consent]  [Healthy relationships]           │
│           [Online safety]                              │
│                                                        │
└──────────────────────────────────────────────────────┘
```

- **Container:** `max-w-[var(--container-max-prose)]`, `px-[var(--space-global-gutter)]`, `pb-[var(--space-global-lg)]`. No top padding — flows from §3.
- **Label:** "Topics" prefix, `font-family: var(--font-tailor-body-stack)`, `font-size: var(--text-card-size-body)`, `font-weight: var(--font-weight-semibold)`, `color: var(--text-body-muted)`. Inline with the first tag.
- **Tag pills:** Same styling as current `.blog-post__tag`:
  - Primary topics: `background: var(--bg-tinted)`, `color: var(--brand-accent-text)`, `border-radius: var(--radius-pill)`, hover `background: var(--brand-accent-soft)`.
  - Secondary topics: `background: var(--bg-surface-alt)`, `color: var(--text-body-muted)`, hover reveals teal.
  - `padding: 0.25rem 0.75rem`, `font-size: var(--text-card-size-body)`, `font-weight: var(--font-weight-medium)`.
- **Layout:** `display: flex`, `flex-wrap: wrap`, `gap: 0.375rem`, `align-items: center`.
- **Links:** Each tag links to `/topics/{slug}`. Analytics attributes retained (`data-analytics-event="blog_to_topic_click"`).
- **Conditional:** Section omitted if no topics.
- **Separator:** A subtle top border `border-top: var(--border-width-xs) solid var(--border-subtle)` with `padding-top: var(--space-global-lg)` to separate from body content.

### §5 — Related blog posts `[A15]`

```
┌──────────────────────────────────────────────────────┐
│  --bg-surface-alt, border-top                          │
│                                                        │
│  h2  "Related articles"                                │
│                                                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ Audience  │  │ Audience  │  │ Audience  │             │
│  │ Title     │  │ Title     │  │ Title     │             │
│  │ Author    │  │ Author    │  │ Author    │             │
│  │ Date      │  │ Date      │  │ Date      │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│                                                        │
└──────────────────────────────────────────────────────┘
```

- **Surface:** `background: var(--bg-surface-alt)`, `border-top: var(--border-width-xs) solid var(--border-subtle)`.
- **Container:** `max-w-[var(--container-max-reading-wide)]`, `px-[var(--space-global-gutter)]`, `py-[var(--space-struct-y-base)]`.
  - **Note:** Wider container than prose (56rem vs 44rem) to accommodate the 3-column card grid comfortably. Matches the C3 pattern where card grids use `--container-max-reading-wide`.
- **h2:** `font-family: var(--font-tailor-heading-stack)`, `font-size: var(--text-prose-size-h2)`, `font-weight: var(--heading-weight-h2)`, `color: var(--text-heading)`, `margin: 0 0 var(--space-global-md)`. Left-aligned.
- **Card grid:** `display: grid`, `gap: var(--space-global-sm)`. `1fr` on mobile, `repeat(3, 1fr)` at `≥ 768px`. `repeat(2, 1fr)` at `≥ 640px` as intermediate step.
- **Each card** uses the existing `.card` base class:
  - `background: var(--card-bg)` (`--bg-surface`), `border-radius: var(--card-radius)`, `border: var(--card-border)`.
  - **Card body:** `card__body` with `card__eyebrow` (target audience), `card__title` (post title).
  - **Author line:** `font-size: var(--text-card-size-body)`, `color: var(--text-body-muted)`, `margin-top: 0.25rem`. Text: "By {author}".
  - **Date line:** Same tokens. Formatted date below author. Conditional — omit if no date.
  - **Featured image on card:** If the related post has a `featuredImage`, show it in a `.card__img` slot above the body with `aspect-ratio: 16/9`, `object-fit: cover`. This makes cards visually richer in the grid. Conditional — card renders without image slot if none.
- **Whole card is a link:** `<a href="/blog/{slug}">` wrapping the card.
- **Conditional:** Section omitted if no related posts.

### §6 — CTA `[A13]`

Existing `CtaBlogBottom` component. No changes to the component itself.

```astro
<CtaBlogBottom serviceLink={post.serviceLink} primaryTopic={primaryTopic} />
```

- If `serviceLink` is set (delivery / training / drop-days / rse-policy-curriculum-planning): shows "Want help with {service}?" → enquiry form link.
- If no service link but primary topic exists: shows "Explore lessons on {topic}" → topic landing page.
- If neither: omitted.
- **Container:** Component uses `max-w-3xl` — update to `max-w-[var(--container-max-prose)]` for token consistency.

---

## 4 · Template structure

The `<article>` wraps everything. Featured image and header share a single `<header>` element on the `--bg-surface` band.

```
<article class="blog-post">
  <header class="blog-post__header">         ← --bg-surface band
    §1: Featured image (conditional)
    §2: Title + byline + audience + share
  </header>
  <section class="blog-post__body">           ← --bg-page
    §3: Body content (prose + tooltips)
  </section>
  <section class="blog-post__tags">           ← --bg-page (continuous)
    §4: Topic tags [A16]
  </section>
  <section class="blog-post__related">        ← --bg-surface-alt
    §5: Related posts [A15]
  </section>
  §6: <CtaBlogBottom />                       ← --bg-page
</article>
<GlossaryTooltips />
```

---

## 5 · Client-side behaviour

### 5.1 Share button

```typescript
function initShare() {
  const btn = document.querySelector<HTMLButtonElement>('.blog-post__share');
  if (!btn) return;

  const shareData = {
    title: btn.dataset.shareTitle || document.title,
    url: btn.dataset.shareUrl || window.location.href,
  };

  btn.addEventListener('click', async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (e) {
        // User cancelled or share failed — no action needed
      }
    } else {
      // Fallback: copy URL to clipboard
      await navigator.clipboard.writeText(shareData.url);
      // Visual feedback: swap to checkmark
      const icon = btn.querySelector('.share-icon');
      const check = btn.querySelector('.check-icon');
      if (icon && check) {
        icon.style.display = 'none';
        check.style.display = 'block';
        setTimeout(() => {
          icon.style.display = '';
          check.style.display = 'none';
        }, 2000);
      }
    }
  });
}

document.addEventListener('astro:page-load', initShare);
```

The button carries `data-share-title` and `data-share-url` attributes set from the Astro template. Two inline SVG icons sit inside the button: `.share-icon` (visible by default) and `.check-icon` (hidden, shown on successful copy).

---

## 6 · Responsive behaviour

| Breakpoint | Featured image | Prose measure | Related grid |
|---|---|---|---|
| `< 640px` | Full width (within gutter), rounded corners, 16:9 | Natural width | 1 column |
| `≥ 640px` | `max-width: var(--container-max-reading-wide)` | `--container-max-prose` (44rem) | 2 columns |
| `≥ 768px` | Same | Same | 3 columns |

The featured image is centred within the shell container on larger screens. On mobile, it fills the available width within the global gutter.

---

## 7 · SEO & metadata

- **`<title>`:** `post.metaTitle || '{post.title} | Tailor Education'`
- **`<meta name="description">`:** `post.metaDescription || '{post.title} — expert RSE guidance for teachers from Tailor Education.'`
- **`og:type`:** `"article"`
- **`og:image`:** `post.featuredImage` when available. This is the primary social sharing image.
- **`twitter:image`:** Same as `og:image`.
- **`canonicalPath`:** `/blog/{slug}/`
- **JSON-LD — Article:**

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{post.title}",
  "image": "{post.featuredImage}",
  "datePublished": "{post.publishedDate}",
  "author": { "@type": "Person", "name": "{post.author}" },
  "publisher": {
    "@type": "Organization",
    "name": "Tailor Education",
    "url": "https://tailoreducation.org.uk"
  },
  "articleSection": "{topics joined by ', '}"
}
```

`image` and `datePublished` are conditional — omit from JSON-LD if null.

---

## 8 · Accessibility

- `<article>` as top-level semantic element.
- `<header>` wraps §1 + §2.
- Featured image: `alt="Featured image for {post.title}"`.
- Topic tags: links with visible text (topic title). Analytics attributes don't interfere.
- Glossary tooltips: handled by existing A7 component (keyboard-accessible, `aria-describedby`).
- Related posts: whole-card links with semantic card structure.
- Date: render in a `<time datetime="{ISO date}">` element for machine readability.
- Share button: `aria-label="Share this article"`. Keyboard-accessible `<button>` element. Clipboard copy feedback is visual only — consider adding a visually-hidden live region (`aria-live="polite"`) announcing "Link copied" for screen readers.

---

## 9 · Contradictions & clarifications

| Topic | Resolution |
|---|---|
| Topic tags position | Moved from header to after body (§4). Matches C1 pattern — contextual links after reading, not before. Current template has them in the header. |
| Container widths | Prose sections use `--container-max-prose` (44rem). Related posts grid uses `--container-max-reading-wide` (56rem) for card breathing room. Featured image uses `--container-max-reading-wide`. Current template uses `max-w-3xl` (~48rem) throughout — needs updating. |
| Featured image aspect | 16:9, matching standard OG image ratios and blog convention. `object-fit: cover` handles non-conforming source images. |
| Featured image width | `--container-max-reading-wide` (56rem), wider than prose but narrower than shell. Creates visual hierarchy — image is the widest element, then cards, then prose. |
| Date formatting | `Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })` → "9 Apr 2026". Not US format. |
| Heading alignment | Left-aligned throughout. Tailor layer — no centred headings. |
| CtaBlogBottom container | Currently `max-w-3xl` — update to `max-w-[var(--container-max-prose)]` for token discipline. |
| Related card images | Optional featured image in `.card__img` slot. Cards without images still work — body section fills the card. |

---

## 10 · Build checklist

### Data layer

1. [ ] Add `Featured Image` (files) property to Notion blog database (if not already added)
2. [ ] Add `Published Date` (date) property to Notion blog database (if not already added)
3. [ ] Add `getFilesUrl()` helper to `src/lib/fetchers.ts`
4. [ ] Add `getDateValue()` helper to `src/lib/fetchers.ts`
5. [ ] Update `fetchBlogPosts()` to extract `featuredImage` and `publishedDate`
6. [ ] Update `BlogPost` type in `src/lib/types.ts` with `featuredImage: string | null` and `publishedDate: string | null`

### Template

7. [ ] Restructure `<header>` to contain both §1 (featured image) and §2 (title/byline)
8. [ ] Add featured image block with `aspect-ratio: 16/9`, `--container-max-reading-wide` width, `border-radius: var(--radius-lg)`, `object-fit: cover`
9. [ ] Add date to meta line with `<time datetime>` element and `Intl.DateTimeFormat` formatting
10. [ ] Add `·` separator between author and date
11. [ ] Restructure meta line as `space-between` flex row — left group (author/date/badge), share button right
12. [ ] Add share button with inline SVG share icon + hidden checkmark icon, `aria-label`, `data-share-title`, `data-share-url`
13. [ ] Add `<script>` block with `initShare()` — Web Share API with clipboard fallback
14. [ ] Move topic tags from header to §4 (after body), add top border separator and "Topics" label
15. [ ] Replace all `max-w-3xl` with `max-w-[var(--container-max-prose)]`
16. [ ] Add `--container-max-reading-wide` to featured image wrapper
17. [ ] Update §5 related posts container to `max-w-[var(--container-max-reading-wide)]`
18. [ ] Add responsive grid step: 2-col at `≥ 640px`, 3-col at `≥ 768px`
19. [ ] Add optional featured image to related post cards (`.card__img` slot)

### SEO

20. [ ] Pass `featuredImage` to BaseLayout for `og:image` / `twitter:image` meta tags
21. [ ] Add `datePublished` to JSON-LD (conditional)
22. [ ] Add `image` to JSON-LD (conditional)
23. [ ] Ensure BaseLayout supports `ogImage` prop (may need adding)

### Component updates

24. [ ] Update `CtaBlogBottom` — replace `max-w-3xl` with `max-w-[var(--container-max-prose)]`

### Verification

25. [ ] Visual review: featured image rendering at all breakpoints
26. [ ] Check OG tags with social preview tool (Facebook debugger / Twitter card validator)
27. [ ] Confirm glossary tooltips still work in body
28. [ ] Confirm related post scoring still works with new fields
29. [ ] Test conditional rendering: no image, no date, no author, no topics, no related posts
30. [ ] Test share button: Web Share API on mobile, clipboard fallback on desktop, checkmark feedback
