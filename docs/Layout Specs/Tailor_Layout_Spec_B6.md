# Tailor Layout Spec — B6 Testimonials

| Field | Value |
|---|---|
| **Page** | Testimonials |
| **Route** | `/testimonials` |
| **Template** | `src/pages/testimonials.astro` (rewrite of existing draft — see §0.1) |
| **Layer** | Tailor (default — no `.layer-ota` class) |
| **Instances** | 1 |
| **Version** | 1.0 |
| **Date** | 2026-04-13 |

---

## 0 · Purpose

`/testimonials` is the social-proof page. It exists to host every approved testimonial in one place so that (a) a reader arriving from a C5 service page's proof band can click through for the whole collection, (b) a reader following a homepage or nav link can scan real, attributable feedback from real schools, and (c) a reader on B2 About or B3 Our Approach who wants more than a single pulled quote can find the full evidence base.

Three readers arrive here:

1. **School decision-makers** — a PSHE lead, SLT member, or headteacher who has been on a C5 service page and clicked the "Read more testimonials →" link under the featured quote. They want to see that the one testimonial wasn't cherry-picked. They will scan by service tag — "what do schools say about your *delivery*?" is a different question from "what do schools say about your *training*?" Primary audience.
2. **Prospective collaborators** — third-sector leads, partner organisations, universities, MAT central teams — looking for confirmation that Tailor has been vouched for by people like them. Secondary audience, but important for the breadth of voices represented.
3. **Parents and casual visitors** — occasional readers who want to see that Tailor isn't talking about itself in an echo chamber.

The page's job is to carry volume gracefully. The approved testimonial pool is currently ~20 entries and will grow. A naïve 2-column card grid at that volume reads as a wall; the layout's job is to introduce structure (by service) without fragmenting the collection, and to handle variable quote lengths (one-sentence to full-paragraph) without visual awkwardness.

**Mood.** Calm, credible, collected. Not shouty. Not "trusted by 10,000+ schools" hero-with-logos energy — this site does not have that kind of volume to boast about and shouldn't pretend. The page earns trust by letting real voices speak at their natural length, attributed wherever possible, tagged by context so a reader can find the evidence relevant to them. Surface rhythm is quiet: `tinted hero → page filter band → page grid → soft tinted CTA`. No authority band on B6 — testimonials *are* the authority.

**Compatibility with C5.** The C5 service-page template renders a single featured testimonial inside a dark proof band (`.service-proof-band__quote` on `--bg-emphasis` at `--text-display-size-h3` italic). That treatment is a *display* of one testimonial; B6 is a *collection* of many. They serve different functions and look different on purpose. But the underlying data model is the same — both read from the same Notion data source, both carry quote + name + role + school + service tag. This spec designs the B6 card and proposes a small refactor path (§5.3) that makes the same `TestimonialCard.astro` component render in two variants (`"card"` for B6, `"band"` for C5) off the same data shape. The refactor is desirable but not a ship-blocker — if B6 ships first with its own card markup, C5's existing band stays put, and the component consolidation happens as a follow-up.

---

## 0.1 · Relationship to the existing `src/pages/testimonials.astro`

A draft of this page exists at `src/pages/testimonials.astro` (69 lines, last touched as a placeholder) with a hand-typed `testimonials` array in the frontmatter, a single `<section class="testimonials-page">` container, a 2-column grid at `≥768px`, and a dual-button CTA ("View services" outline + "Get in touch" primary).

**This spec supersedes the draft.** The rewrite:

- **Replaces** the hand-typed array with a Notion-backed fetch (§2.1). Testimonials are content, not site chrome — they belong in the CMS so the approval workflow lives in Notion, not in the repo.
- **Adds** a filter bar (§4.2) with chips per Service tag so a reader can scan by the service they're interested in. Reuses B9's filter pattern (role="toolbar", aria-pressed, roving tabindex, URL query-string state) scoped to a new class namespace.
- **Replaces** the fixed 2-column grid with a **CSS multi-column flow** (§4.3) that handles variable quote lengths natively. At wide widths, cards flow across 3 columns; at tablet, 2; at mobile, 1. Unlike a grid, multi-column respects each card's natural height, so a one-sentence card and a full-paragraph card can sit next to each other without one being stretched or one being truncated.
- **Refactors** the card into a `TestimonialCard.astro` component (§5.3) usable in both the B6 grid and (as a follow-up refactor) the C5 proof band.
- **Replaces** the draft's dual-button CTA with a single-button tinted card close (§4.5), same pattern as B2 / B3 — one primary action, "Work with us", linking to `/contact`.
- **Fixes** the corrupted character in the draft's `<title>` attribute (line 19: `"Testimonials �� Tailor Education"` → `"Testimonials — Tailor Education"`).
- **Replaces** hardcoded values (`max-w-4xl`, raw `0.125rem` on the footer gap) with token references.

Section §0.2 below enumerates the specific code in the existing draft that must be removed or replaced during the rewrite.

---

## 0.2 · Code to remove / replace from the existing draft

Before building the new B6, the following items in `src/pages/testimonials.astro` are removed:

| Line(s) in draft | What | Action |
|---|---|---|
| 8–15 | Hand-typed `testimonials` array | Delete — data comes from Notion via `getTestimonials()` (§2.1) |
| 19 | Corrupted em-dash in `<title>` (`"Testimonials ��"`) | Replace with UTF-8 em-dash: `"Testimonials — Tailor Education"` |
| 23 | `<section class="testimonials-page">` root | Replace with `<main class="testimonials-page">` — this is a page-level wrapper |
| 24 | `max-w-4xl` on inner wrapper | Replace with `--container-max-shell` on the hero/grid and page-level vertical rhythm tokens per §3 |
| 25–28 | Hero block (title + intro) inside the same section as the grid | Split into dedicated `.testimonials-hero` section on `--bg-tinted` (§4.1) |
| 30–41 | Inline-rendered `.testimonial-card` markup | Extract to `TestimonialCard.astro` component (§5.3), looped from fetched data |
| 34 | `"{t.quote}"` with double-quote character in markup | Use CSS-generated quotation marks instead (`.testimonial-card__quote::before / ::after`) — avoids needing to escape quotes in Notion content and keeps typography-quote styling consistent |
| 36 | `.testimonial-card__footer` as `<span>`-only | Expand to Name (line 1) / Role (line 2) / School (line 3) / optional service-tag chip (line 4) per §4.4 |
| 43–47 | `.testimonials-cta` with two buttons | Rewrite as single-button tinted card (§4.5) |
| 52–68 | Inline `<style>` block | Rewrite — token references only, new class names; grid rule replaced with multi-column flow (§4.3) |
| 57 | `.testimonials-grid` as `display: grid` | Replace with `column-count` / `column-gap` multi-column flow (§4.3). Keep the class name. |
| 58 | `.testimonial-card` with `border-left: 4px solid var(--brand-accent)` | Keep the left-accent-border device but token-ise the width (`--border-width-md`) and make the colour token-driven (`--brand-accent-border`) so a future theme override changes one value |
| 60 | `gap: 0.125rem` raw | Replace with `var(--space-global-xs)` |
| 65 | `.testimonials-cta` flex rule | Delete — new CTA card pattern is column flex, centred, one button (§4.5) |
| 68 | `@media (min-width: 768px)` 2-col grid rule | Delete — multi-column flow handles responsiveness natively via `column-width` |

**No changes needed to:** `BaseLayout` import, the `description` copy (which is serviceable as-is).

**Routes to preserve:** `/contact` (CTA target, §4.5). `/services` no longer linked directly from B6 — if a reader wants services they reach them via the main nav.

---

## 1 · Reference documents

- `Tailor_Layout_Spec_Shell.md` — header, footer, container-width tokens
- `Tailor_Layout_Spec_B9.md` — blog index; source of the filter-chip pattern, URL query-string state model, Pagefind integration, and `role="toolbar"` keyboard behaviour B6 reuses
- `Tailor_Layout_Spec_B2.md` — About; soft single-button CTA card pattern reused in §4.5
- `Tailor_Layout_Spec_B3.md` — Our Approach; prose-page precedent for not using a dark band except where earned (B6 doesn't use one at all)
- `Tailor_Layout_Spec_C5.md` — service page; source of the existing `.service-proof-band__quote` pattern that the new `TestimonialCard.astro` component is designed to subsume as its `"band"` variant
- `Tailor_Page_Content_Spec_v1.md` — B6 section (minimal; this spec extends rather than contradicts)
- `Tailor_Art_Direction_Brief_v1 (1).md` — "structured, spacious, editorial, but not austere"; "trust signals integrated naturally, not tacked on"; "genuine tonal range"
- `Tailor_Design_System_Implementation_Notes.md` — token vocabulary, layer scoping, component patterns
- `src/lib/fetchers.ts` — existing Notion fetcher patterns (`fetchBlogPosts`, `fetchCurriculumStatements`); `getTestimonials` follows the same shape
- `src/lib/content.ts` — existing build-time content cache that new testimonial data plugs into
- `src/components/ServicePageStyles.astro` §6 — C5's current dark proof band markup, preserved until the follow-up component consolidation

---

## 2 · Data requirements

### 2.1 Testimonials — Notion data source

Testimonials live in a Notion data source (`4fede26f-29ad-4c3b-a67b-31065b0a19c3`). Fields:

| Notion field | Type | Purpose |
|---|---|---|
| `Quote` | Rich text / body content | The testimonial text. Variable length — from one sentence to a full paragraph (~300 words max). Editorial team should target ≤120 words for most entries; longer entries still render, they just occupy a taller card. |
| `Name` | Title | Attributed name, or an anonymous descriptor when full name is not available (e.g. "Workshop participant", "Head of PSHE"). Never leave empty — use a descriptor. |
| `Role` | Text | Job title — "Head of PSHE", "PSHE Lead", "Deputy Head", "CPD Lead", etc. Optional but strongly encouraged. |
| `School or organisation` | Text | Where the person is from — "Acme Academy, West Midlands" or "Primary school, London". Specific is better than generic; "Secondary school, South East" is acceptable when the school has not given explicit naming permission. |
| `Service tag` | Multi-select | Controls the filter. Values (canonical): `RSE delivery`, `RSE training`, `Drop days`, `Circuits (SEND/AP)`, `RSE policy & curriculum planning`, `Universities & FE`, `About / general`. Multi-select so a testimonial that cites both training and delivery can appear under both filters. |
| `Setting` | Select | `Primary school`, `Secondary school`, `SEND school`, `Alternative provision`, `Third sector`, `Higher education`, `Other`. Not rendered on the card in v1 — used for future refinements (§12 Open items). |
| `Voice` | Select | `School staff`, `Third sector lead`, `Young person`, `Academic / collaborator`, `Parent`. Not rendered on the card in v1 — reserved for a future "by voice" filter (§12). |
| `Approved for live site` | Checkbox | Gate. Only entries with this checked render on B6. Pre-ship, default value across the database is unchecked; content team checks entries one-by-one after confirming attribution permissions. |
| `Order` | Number (optional) | Optional hand-override for featured ordering. When unset, order is "most recently added" (Notion `created_time`). |

### 2.2 Type shape

```typescript
// src/lib/types.ts — add:

export interface Testimonial {
  id: string;
  /** The testimonial text. Plain string, pre-rendered from Notion rich text. Line breaks preserved as `\n`; renderer converts to paragraph breaks. */
  quote: string;
  /** Attributed name or anonymous descriptor. Never empty. */
  name: string;
  /** Job title. May be empty. */
  role: string;
  /** School or organisation. May be empty. */
  organisation: string;
  /** Service tag multi-select values. At least one expected; if empty, entry falls under the "About / general" implicit bucket. */
  serviceTags: ServiceTag[];
  /** Setting select. May be empty. Reserved for future use. */
  setting: Setting | '';
  /** Voice select. May be empty. Reserved for future use. */
  voice: Voice | '';
}

export type ServiceTag =
  | 'RSE delivery'
  | 'RSE training'
  | 'Drop days'
  | 'Circuits (SEND/AP)'
  | 'RSE policy & curriculum planning'
  | 'Universities & FE'
  | 'About / general';

export type Setting =
  | 'Primary school'
  | 'Secondary school'
  | 'SEND school'
  | 'Alternative provision'
  | 'Third sector'
  | 'Higher education'
  | 'Other';

export type Voice =
  | 'School staff'
  | 'Third sector lead'
  | 'Young person'
  | 'Academic / collaborator'
  | 'Parent';
```

### 2.3 Fetcher

Add to `src/lib/fetchers.ts` following the existing `fetchCurriculumStatements()` shape:

```typescript
const TESTIMONIALS_DB = '4fede26f-29ad-4c3b-a67b-31065b0a19c3';

export async function fetchTestimonials(): Promise<Testimonial[]> {
  console.log('Fetching testimonials...');
  try {
    const pages = await queryDatabase(TESTIMONIALS_DB, {
      property: 'Approved for live site',
      checkbox: { equals: true },
    });

    const testimonials: Testimonial[] = pages.map((page) => {
      const p = page.properties;
      return {
        id: page.id,
        quote: getRichTextValue(p['Quote']),
        name: getTitleValue(p['Name']),
        role: getRichTextValue(p['Role']),
        organisation: getRichTextValue(p['School or organisation']),
        serviceTags: getMultiSelectValues(p['Service tag']) as ServiceTag[],
        setting: (getSelectValue(p['Setting']) || '') as Setting | '',
        voice: (getSelectValue(p['Voice']) || '') as Voice | '',
      };
    });

    // Sort: explicit Order ascending (if set), then Notion created_time descending.
    testimonials.sort(/* per §2.4 */);

    console.log(`  ✓ ${testimonials.length} testimonials fetched`);
    return testimonials;
  } catch (error) {
    console.warn(`  ⚠ Could not fetch testimonials (database may not be shared with integration yet):`, (error as Error).message);
    return [];
  }
}
```

Wire into `src/lib/content.ts`:

- Add `fetchTestimonials` to the import list.
- Add `_testimonials: Testimonial[] | null = null` to the cached-data block.
- Add `const testimonials = await cached('testimonials', fetchTestimonials);` to `_loadAllContentImpl()`.
- Export `getTestimonials(): Promise<Testimonial[]>` matching the existing `getBlogPosts()` / `getCurriculumStatements()` pattern.
- Optionally export `getTestimonialsByService(tag: ServiceTag): Promise<Testimonial[]>` as a convenience for C5 service pages that want to pluck their feature quote; in v1 C5 can keep its hand-typed `testimonialQuote` until the component consolidation happens.

### 2.4 Ordering

Default server-side ordering (before client-side filtering applies):

1. Entries with an explicit `Order` number ascending (low number = earliest in the list).
2. Remaining entries by Notion `created_time` descending (newest first).

This gives the content team a way to pin priority testimonials without having to manually order the whole list.

### 2.5 Minimum / maximum volume

- **Minimum for the page to render.** 1 approved entry. If zero entries are approved (expected pre-ship), the template renders the hero and an empty-state card (`.testimonials-empty`) reading "[COPY TBD: e.g. 'Testimonials coming soon — we're collecting feedback from schools we've worked with.']" plus the CTA; no filter bar, no grid.
- **Maximum.** None — the multi-column flow handles arbitrary volume. At ~50+ entries a "Load more" pattern à la B9 would start to help (§12 Open items).

### 2.6 No other data

No blog posts, no topic refs, no portraits, no images. B6 is a typography page.

---

## 3 · Section map

| # | Section | Surface | Container | Vertical padding | Role |
|---|---|---|---|---|---|
| 4.1 | Hero | `--bg-tinted` | `--container-max-shell` | `--space-global-xl` | Title + intro line |
| 4.2 | Filter bar | `--bg-page` | `--container-max-shell` | `--space-global-md` (top) · `--space-global-sm` (bottom) | Service-tag chips + result count |
| 4.3 | Grid | `--bg-page` | `--container-max-shell` | `--space-struct-y-base` (bottom only — top is handled by §4.2 bottom padding) | The collection |
| 4.4 | Empty state (conditional) | `--bg-page` | `--container-max-prose` | `--space-struct-y-base` | Shows only when current filter has zero matches |
| 4.5 | Work with us (CTA) | `--bg-surface-alt` | `--container-max-prose` | `--space-global-xl` | Single primary action, soft tinted card |

**Surface rhythm read-out.** `tinted → page → page → (page) → alt-tinted`. Only two tint cycles — the hero lift and the CTA lift. The grid stays on `--bg-page` so the cards (on `--bg-surface`) can sit against a plain canvas without surface-on-surface muddiness. No dark band on this page.

**Container rhythm read-out.** `shell → shell → shell → prose → prose`. The hero, filter, and grid all share the 72rem shell (grid needs the width for the multi-column flow at desktop). The empty state and CTA contract to the 44rem prose column because both are single short paragraphs and read better at reading measure.

---

## 4 · Section details

### 4.1 Hero

**Role.** Establish the page identity and set a quiet trust register before the grid begins.

**Surface.** Full-bleed `<section class="testimonials-hero">` on `--bg-tinted` with a `--border-subtle` bottom border.

**Inner wrapper.** `mx-auto w-full max-w-[var(--container-max-shell)] px-[var(--space-global-gutter)] py-[var(--space-global-xl)]`.

**Contents (in order):**

1. **Eyebrow.** `<span class="testimonials-hero__eyebrow">` — "Social proof". Uppercase, `--text-eyebrow-ls`, `--text-card-size-body`, `--font-weight-semibold`, `--text-body-muted`. Margin-bottom `--space-global-xs`.
2. **Page title.** `<h1 class="testimonials-hero__title">` — "What schools say". Lexend, `--text-display-size-h1`, `--heading-weight-h1`, `--text-heading`, `line-height: var(--lh-display)`. Margin `0 0 var(--space-global-md)`.
3. **Lede.** `<p class="testimonials-hero__lede">` — one sentence. `[COPY TBD: e.g. "Feedback from the schools, teachers and partners we've worked with."]` Body stack, `--text-prose-size-lede`, `--font-weight-regular`, `--text-body`, `line-height: var(--lh-prose)`. Margin `0`.

**Mobile.** Title clamps down; all content remains left-aligned.

---

### 4.2 Filter bar

**Role.** Let a reader narrow the collection to the service they're interested in. Reuses the B9 filter pattern exactly — `role="toolbar"`, roving tabindex, `aria-pressed`, URL query-string state — so a reader who has learnt the pattern on B9 already knows how B6 behaves.

**Surface.** `<section class="testimonials-filters" aria-labelledby="testimonials-filters-label">` on `--bg-page`.

**Inner wrapper.** `mx-auto w-full max-w-[var(--container-max-shell)] px-[var(--space-global-gutter)] pt-[var(--space-global-md)] pb-[var(--space-global-sm)]`.

**Contents (in order):**

1. **Hidden label** for the toolbar: `<h2 id="testimonials-filters-label" class="sr-only">Filter testimonials</h2>` — keeps the heading outline intact without forcing visible heading text that would compete with the hero.
2. **Filter row.** `<div class="testimonials-filters__row" role="toolbar" aria-labelledby="testimonials-filters-label">` — a single row (unlike B9 which has two). Contains:
   - Inline label `<span class="testimonials-filters__label" aria-hidden="true">Service</span>`. Body stack, `--text-card-size-body`, `--font-weight-medium`, `--text-body-muted`.
   - Chip track `<div class="testimonials-filters__scroll">` wrapping the chips. Mobile: `overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch;` with a right-edge mask fade. Desktop (`≥768px`): drops overflow and lets chips wrap.
   - One chip per Service tag value in canonical order, plus an "All" chip at the start of the row:
     - **All** (starts active, `aria-pressed="true"`, `tabindex="0"`)
     - RSE delivery
     - RSE training
     - Drop days
     - Circuits (SEND/AP)
     - RSE policy & curriculum planning
     - Universities & FE
     - About / general
3. **Result count.** `<p class="testimonials-filters__count" aria-live="polite">` — "Showing {n} testimonials". Body stack, `--text-card-size-body`, `--text-body-muted`. Updated by JS on every filter change. Margin-top `--space-global-xs`.

**Chip styling (`.testimonial-filter-chip`).** `<button>` elements sharing all visual styling with B9's `.blog-filter-chip` (pill shape, `--bg-surface-alt` default / `--bg-tinted` active / `--text-body` default / `--text-heading` active, border `--border-width-xs` solid `--border-subtle`, `--radius-pill`, padding `var(--space-global-xs) var(--space-global-sm)`, font `--text-card-size-body` `--font-weight-medium`). The class name differs by namespace (`.testimonial-filter-chip` not `.blog-filter-chip`) because the two pages scope their chips independently; the visual rule is copy-pasted into this page's `<style>` block. See §10 and §12 for the follow-up to extract a shared `.filter-chip` primitive.

**Data attributes on each chip:**

- `data-filter-type="service"` (constant; B6 has only one filter axis)
- `data-filter-value="{canonical tag}"` or `"all"`

**ARIA toolbar keyboard nav** — same as B9 §6:

- Left / Right arrows step the roving `tabindex="0"` along the chip row (wrapping at the ends).
- Home / End jump to the first / last chip.
- Space / Enter activate the focused chip.
- The `aria-pressed` state updates on the activated chip; the previously active chip flips back to `aria-pressed="false"`.

**URL state.** Filter state is encoded as a query string:

- Default ("All" active): canonical URL is `/testimonials/` (no query string). Canonical `<link>` in `<head>` always points at `/testimonials/` so Google does not index filter URLs as duplicate pages.
- Any other filter: URL becomes `/testimonials/?service={tag}` where `{tag}` is the canonical `ServiceTag` value URL-encoded (e.g. `/testimonials/?service=RSE%20training`).
- On page load, JS parses the URL, sets the matching chip active, and filters the grid — enabling deep-links from C5 proof-band links (see §6 JS).

**Mobile.** The chip track horizontal-scrolls; a right-edge fade mask signals scrollability. Label sits above the track (stacked).

**Copy-path for C5 deep links.** Each C5 service page's "Read more testimonials →" link should be updated from `href="/testimonials"` to `href="/testimonials/?service={canonical tag for this service}"` — so a reader coming from the Training service page lands on B6 with the Training filter pre-applied. Noted in §12 as a follow-up task on the C5 side.

---

### 4.3 Grid

**Role.** Render the filtered testimonial collection as a masonry-style flow that handles variable quote lengths without stretching cards to equal heights.

**Surface.** `<section class="testimonials-grid" aria-label="Testimonials">` on `--bg-page`.

**Inner wrapper.** `mx-auto w-full max-w-[var(--container-max-shell)] px-[var(--space-global-gutter)] pb-[var(--space-struct-y-base)]` — no top padding; §4.2's bottom padding carries the gap.

**Multi-column flow.** This is the key design choice. Instead of `display: grid`, the grid uses CSS multi-column:

```css
.testimonials-grid__inner {
  column-width: 22rem; /* ~352px — target column width */
  column-gap: var(--space-global-md);
}
.testimonial-card {
  break-inside: avoid;
  margin: 0 0 var(--space-global-md); /* vertical gap via margin, not row-gap */
  display: inline-block; /* required for reliable break-inside in all browsers */
  width: 100%;
}
```

**Why multi-column, not grid.** Cards have intrinsically variable height — one-sentence testimonials versus full-paragraph ones differ by 3–5× in height. A CSS grid with `grid-template-columns: repeat(auto-fill, minmax(22rem, 1fr))` produces fixed row heights and either stretches short cards (ugly whitespace) or truncates long ones (loses the content). A `display: grid` with `grid-auto-rows: masonry` (which does what we want) is still behind a feature flag in most browsers as of April 2026. CSS multi-column achieves masonry flow today, in every browser, with no JS. The only cost is that reading order is top-to-bottom within a column, then across — which is fine for a testimonials collection (order is editorial, not sequential), and mitigated by the filter (the user isn't usually reading linearly anyway).

**Column counts by viewport:**

| Viewport | Column behaviour |
|---|---|
| <640px | Single column (content fills the shell minus gutter, no multi-column kicks in because `column-width: 22rem` exceeds available width) |
| 640–1023px | 2 columns (typical iPad width) |
| 1024–1279px | 3 columns |
| ≥1280px | 3 columns (column-width cap prevents a 4-column wall; cards stay readable) |

**Filtered-out cards.** When a filter excludes a card, the card element keeps `display: inline-block` but carries `[hidden]` (via the HTML attribute set by JS). Browsers honour `[hidden] { display: none !important; }` which collapses the column flow correctly. No animation on hide/show at v1 (animating `display` is not robust; fade-in on `[hidden]`-to-visible would require JS-driven opacity transitions and is deferred to a follow-up).

**Mobile.** Single column, vertical stacking. The `column-count` naturally drops to 1 because `column-width: 22rem` can't fit in a sub-22rem viewport.

---

### 4.4 Testimonial card

**Role.** One testimonial in the grid. Contains the quote, attribution metadata, and (optionally) a service-tag pill linking the card to the filter it appears under.

**Component.** Extracted as `src/components/TestimonialCard.astro`. Props:

```typescript
interface Props {
  testimonial: Testimonial;
  /** "card" (default) for B6 grid; "band" for C5 dark proof-band. */
  variant?: 'card' | 'band';
  /** When true, render the service-tag pill at card foot. Defaults true on "card", false on "band". */
  showServiceTag?: boolean;
}
```

For the B6 use case, all cards render with `variant="card"` and `showServiceTag={true}`.

**Markup (card variant):**

```astro
<blockquote
  class="testimonial-card"
  data-testimonial-id={testimonial.id}
  data-service-tags={testimonial.serviceTags.join('|')}
>
  <p class="testimonial-card__quote">{testimonial.quote}</p>
  <footer class="testimonial-card__footer">
    <cite class="testimonial-card__attribution">
      <span class="testimonial-card__name">{testimonial.name}</span>
      {testimonial.role && (
        <span class="testimonial-card__role">{testimonial.role}</span>
      )}
      {testimonial.organisation && (
        <span class="testimonial-card__org">{testimonial.organisation}</span>
      )}
    </cite>
    {showServiceTag && testimonial.serviceTags[0] && (
      <span class="testimonial-card__service-pill" data-service-tag={testimonial.serviceTags[0]}>
        {testimonial.serviceTags[0]}
      </span>
    )}
  </footer>
</blockquote>
```

**Visual treatment:**

- **Outer.** `.testimonial-card` — `background: var(--bg-surface)`, `border: var(--border-width-xs) solid var(--border-subtle)`, `border-left: var(--border-width-md) solid var(--brand-accent-border)` (the accent bar — kept from the draft because it's a strong testimonial-identifying device that Tailor readers already recognise), `border-radius: var(--radius-lg)`, `padding: var(--space-global-lg)`.
- **Quote.** `.testimonial-card__quote` — Lexend body stack, `--text-prose-size-body`, `--font-weight-regular`, `--text-body`, `line-height: var(--lh-prose)`, margin `0 0 var(--space-global-sm)`. Italic is **not** applied at the card level (long passages of italic are hard to read). Instead, quote punctuation is handled typographically:
  - `.testimonial-card__quote::before { content: open-quote; }`
  - `.testimonial-card__quote::after { content: close-quote; }`
  - Uses the browser's `quotes` CSS property, set at the card root: `quotes: "\201C" "\201D" "\2018" "\2019";` (curly double and single marks). This keeps Notion content free of escaped quote characters and ensures consistent typography across all cards.
- **Footer.** `.testimonial-card__footer` — `display: flex`, `flex-direction: column`, `gap: var(--space-global-xs)`. Contains the attribution `<cite>` and (optionally) the service-tag pill. On wide cards (≥30rem effective column width — rare but possible), the footer switches to `flex-direction: row` with `justify-content: space-between` for a single-line footer; this is a progressive enhancement via container query and is optional at v1 ship.
- **Attribution `<cite>`.** `display: flex; flex-direction: column; gap: var(--space-global-3xs)` (or `0.125rem` if no 3xs token exists — flag §12). Non-italic (the browser default italic on `<cite>` is overridden).
- **Name.** `.testimonial-card__name` — Lexend, `--text-card-size-body`, `--font-weight-semibold`, `--text-heading`. First line of the three-line attribution.
- **Role.** `.testimonial-card__role` — `--text-card-size-body`, `--font-weight-regular`, `--text-body-muted`. Conditional — only rendered if `role` is non-empty.
- **Organisation.** `.testimonial-card__org` — `--text-card-size-body`, `--font-weight-regular`, `--text-body-muted`. Conditional — only rendered if `organisation` is non-empty.
- **Service pill.** `.testimonial-card__service-pill` — inline-block, `background: var(--bg-tinted)`, `color: var(--brand-accent-text)`, `font-size: var(--text-card-size-body)`, `font-weight: var(--font-weight-medium)`, padding `var(--space-global-3xs) var(--space-global-xs)`, `border-radius: var(--radius-pill)`. Shows the first service tag only (keeps the card visually light); if an entry has multiple tags, additional tags are implicit via the filter behaviour (card still shows under each tag's filter). Non-interactive — this is a label, not a link; if a reader wants to filter, they use the filter bar.

**Variable quote length handling.**

- No truncation, no line-clamp, no "read more". A testimonial is small enough that clamping loses content and feels untrusting of the reader. The multi-column flow absorbs height variation natively.
- No minimum height. Short cards look like short cards and that's fine.
- Quote paragraph breaks. If a quote contains explicit line breaks (`\n\n`), the renderer converts them into `<br><br>` inside the single `<p class="testimonial-card__quote">`. Alternatively, quote can be rendered as multiple `<p>` elements, but keeping the quote inside a single paragraph keeps the CSS-generated open/close quotes working correctly (otherwise quotes open and close on every paragraph).

**Why Lexend, not Fraunces italic.** A page of Fraunces italic testimonials would fight the layer boundary the art direction brief establishes (Fraunces lives on the OTA layer). Plain Lexend with typographic curly quotes is the right Tailor-layer register.

**Hover / focus.** `.testimonial-card` is a non-interactive element — no hover state, no focus ring. The only interactive descendants are any inline `<a>` links within the quote (rare; future support only) and the (non-interactive by spec) service-tag pill. Filter chips in §4.2 are the interactive controls.

---

### 4.5 Work with us (CTA)

**Role.** Single soft close. The reader who has scanned the testimonials has seen the evidence; the CTA is a quiet handshake.

**Pattern.** Same as B2 §4.5 and B3 §4.6 — soft tinted card, single primary button.

**Surface.** `<section class="testimonials-cta">` on `--bg-surface-alt`.

**Inner wrapper.** `mx-auto w-full max-w-[var(--container-max-prose)] px-[var(--space-global-gutter)] py-[var(--space-global-xl)]`.

**Card.** `<div class="testimonials-cta__card">` — `--bg-tinted`, `--radius-lg`, border `--border-width-xs` solid `--border-subtle`, padding `--space-global-lg`, `display: flex; flex-direction: column; gap: var(--space-global-sm); align-items: center;`, text-align centre.

**Card contents:**

1. **Heading.** `<h2 class="testimonials-cta__title">` — "Want to work with us?" (replaces the draft's `<p>` with a proper heading so the outline stays intact). Lexend, `--text-prose-size-h2`, `--heading-weight-h2`, `--text-heading`, margin `0`.
2. **Supporting line.** `<p class="testimonials-cta__text">` — one sentence. `[COPY TBD: e.g. "Tell us about your school and what you need — we'll come back within a couple of working days."]` Body stack, `--text-prose-size-body`, `--text-body-muted`, margin `0`, `max-width: 32rem`.
3. **Primary button.** `<a class="btn btn--std btn--primary has-icon-hover" href="/contact">Get in touch</a>`.

No secondary button. The draft's outline "View services" is removed — a reader on B6 who wants services reaches them via the main nav, and keeping the close to a single action preserves the B2 / B3 close-pattern consistency.

**Mobile.** Card padding steps to `--space-global-md` at narrow widths.

---

## 5 · Template structure

### 5.1 Page-level template

```astro
---
/**
 * Testimonials page [B6] — /testimonials
 * Social proof. Tailor layer.
 * Data: Notion testimonials database (see §2).
 */
import BaseLayout from '../layouts/BaseLayout.astro';
import TestimonialCard from '../components/TestimonialCard.astro';
import { getTestimonials } from '../lib/content';
import type { ServiceTag } from '../lib/types';

const testimonials = await getTestimonials();

const SERVICE_TAGS: ServiceTag[] = [
  'RSE delivery',
  'RSE training',
  'Drop days',
  'Circuits (SEND/AP)',
  'RSE policy & curriculum planning',
  'Universities & FE',
  'About / general',
];
---

<BaseLayout
  title="Testimonials — Tailor Education"
  description="What schools say about working with Tailor Education — testimonials from teachers and school leaders."
  canonicalPath="/testimonials"
>
  <main class="testimonials-page">

    <!-- §4.1 Hero -->
    <section class="testimonials-hero">
      <div class="mx-auto w-full max-w-[var(--container-max-shell)] px-[var(--space-global-gutter)] py-[var(--space-global-xl)]">
        <span class="testimonials-hero__eyebrow">Social proof</span>
        <h1 class="testimonials-hero__title">What schools say</h1>
        <p class="testimonials-hero__lede">[COPY TBD]</p>
      </div>
    </section>

    {testimonials.length > 0 ? (
      <>
        <!-- §4.2 Filter bar -->
        <section class="testimonials-filters" aria-labelledby="testimonials-filters-label">
          <div class="mx-auto w-full max-w-[var(--container-max-shell)] px-[var(--space-global-gutter)] pt-[var(--space-global-md)] pb-[var(--space-global-sm)]">
            <h2 id="testimonials-filters-label" class="sr-only">Filter testimonials</h2>
            <div class="testimonials-filters__row" role="toolbar" aria-labelledby="testimonials-filters-label">
              <span class="testimonials-filters__label" aria-hidden="true">Service</span>
              <div class="testimonials-filters__scroll">
                <button class="testimonial-filter-chip is-active" data-filter-type="service" data-filter-value="all" aria-pressed="true" tabindex="0">All</button>
                {SERVICE_TAGS.map((tag) => (
                  <button class="testimonial-filter-chip" data-filter-type="service" data-filter-value={tag} aria-pressed="false" tabindex="-1">{tag}</button>
                ))}
              </div>
            </div>
            <p class="testimonials-filters__count" aria-live="polite">
              Showing {testimonials.length} testimonials
            </p>
          </div>
        </section>

        <!-- §4.3 Grid -->
        <section class="testimonials-grid" aria-label="Testimonials">
          <div class="testimonials-grid__inner mx-auto w-full max-w-[var(--container-max-shell)] px-[var(--space-global-gutter)] pb-[var(--space-struct-y-base)]">
            {testimonials.map((t) => (
              <TestimonialCard testimonial={t} variant="card" showServiceTag={true} />
            ))}
          </div>
        </section>

        <!-- §4.4 Empty state (hidden by default; shown by JS when filter has 0 matches) -->
        <div class="testimonials-empty" hidden>
          <div class="mx-auto w-full max-w-[var(--container-max-prose)] px-[var(--space-global-gutter)] py-[var(--space-struct-y-base)]">
            <p class="testimonials-empty__text">No testimonials in this category yet. <button type="button" class="testimonials-empty__reset">Show all</button></p>
          </div>
        </div>
      </>
    ) : (
      <!-- Pre-launch: no approved entries yet -->
      <section class="testimonials-empty-initial">
        <div class="mx-auto w-full max-w-[var(--container-max-prose)] px-[var(--space-global-gutter)] py-[var(--space-struct-y-base)]">
          <p>[COPY TBD: "Testimonials coming soon..."]</p>
        </div>
      </section>
    )}

    <!-- §4.5 Work with us -->
    <section class="testimonials-cta">
      <div class="mx-auto w-full max-w-[var(--container-max-prose)] px-[var(--space-global-gutter)] py-[var(--space-global-xl)]">
        <div class="testimonials-cta__card">
          <h2 class="testimonials-cta__title">Want to work with us?</h2>
          <p class="testimonials-cta__text">[COPY TBD]</p>
          <a class="btn btn--std btn--primary has-icon-hover" href="/contact">Get in touch</a>
        </div>
      </div>
    </section>

  </main>
</BaseLayout>

<script>
  /* See §6 — filter behaviour, URL sync, result count, empty state. */
</script>

<style>
  /* See §4 for all class rules; no styles repeated here in the spec. */
</style>
```

### 5.2 JSON-LD

See §9.

### 5.3 `TestimonialCard.astro` component

New file: `src/components/TestimonialCard.astro`.

The component renders *two* visual variants from the same data:

- `variant="card"` — the B6 grid treatment described in §4.4. Light surface, bordered, left accent bar, three-line attribution, optional service pill.
- `variant="band"` — the C5 proof-band treatment. Dark surface (inherits from the parent `.service-proof-band` section — the component renders only the inner markup, not the surface wrapper). Display-H3 italic quote, single-line em-dash-prefixed source, no service pill. Matches the current `.service-proof-band__quote` + `.service-proof-band__source` markup in `src/components/ServicePageStyles.astro` §6.

```astro
---
import type { Testimonial } from '../lib/types';

interface Props {
  testimonial: Testimonial;
  variant?: 'card' | 'band';
  showServiceTag?: boolean;
}

const { testimonial, variant = 'card', showServiceTag = variant === 'card' } = Astro.props;

// Pre-compose the single-line source used by the "band" variant.
const sourceLine = [testimonial.name, testimonial.role, testimonial.organisation]
  .filter(Boolean)
  .join(', ');
---

{variant === 'card' ? (
  <blockquote
    class="testimonial-card"
    data-testimonial-id={testimonial.id}
    data-service-tags={testimonial.serviceTags.join('|')}
  >
    <p class="testimonial-card__quote">{testimonial.quote}</p>
    <footer class="testimonial-card__footer">
      <cite class="testimonial-card__attribution">
        <span class="testimonial-card__name">{testimonial.name}</span>
        {testimonial.role && <span class="testimonial-card__role">{testimonial.role}</span>}
        {testimonial.organisation && <span class="testimonial-card__org">{testimonial.organisation}</span>}
      </cite>
      {showServiceTag && testimonial.serviceTags[0] && (
        <span class="testimonial-card__service-pill">{testimonial.serviceTags[0]}</span>
      )}
    </footer>
  </blockquote>
) : (
  <>
    <blockquote>
      <p class="service-proof-band__quote">{testimonial.quote}</p>
    </blockquote>
    <span class="service-proof-band__source">— {sourceLine}</span>
  </>
)}
```

**Migration path for C5.** C5 service pages today hand-type `testimonialQuote` / `testimonialSource` strings. The follow-up refactor (noted in §12):

1. Use `getTestimonialsByService(tag)` (added in §2.3) inside each C5 page's frontmatter to pull the first matching testimonial.
2. Replace the hand-typed `<blockquote><p>...</p></blockquote>` + `<span class="service-proof-band__source">` with `<TestimonialCard testimonial={featuredQuote} variant="band" />`.
3. Keep the `.service-proof-band` wrapper section on the C5 page itself — the component renders only the inner markup.

This refactor is not a prerequisite for shipping B6. B6 can ship first and the C5 consolidation happens as a cleanup after.

---

## 6 · Client-side behaviour

Single inline `<script>` block at page foot. Progressive-enhancement model — if JS is disabled, all testimonials render (the filter bar still appears but chips do nothing; that's acceptable because the "All" state already shows everything, and a no-JS user is seeing the correct default view).

**Responsibilities:**

### 6.1 Filter state

Keeps an `activeFilter: ServiceTag | 'all'` variable. On page load:

1. Parse `window.location.search` for `?service=...`.
2. If present and the value matches a known `ServiceTag`, set `activeFilter` to that tag and activate the matching chip.
3. If absent or invalid, `activeFilter = 'all'` and the "All" chip stays active.
4. Apply the initial filter to the grid.

### 6.2 Chip click handler

On chip click (or keyboard Space / Enter):

1. Flip `aria-pressed` on the previously active chip to `"false"`.
2. Flip `aria-pressed` on the clicked chip to `"true"`, and `tabindex="0"` on it and `"-1"` on the others (roving tabindex).
3. Read the new `data-filter-value`.
4. If `"all"`, remove the query string and update canonical URL state via `history.replaceState({}, '', '/testimonials/')`.
5. Otherwise, set `history.replaceState({}, '', '/testimonials/?service=' + encodeURIComponent(value))`.
6. Apply the filter (§6.3).
7. Update the result count (§6.4).

### 6.3 Grid filter application

Iterates every `.testimonial-card` element:

- If `activeFilter === 'all'`, clear `hidden` on all cards.
- Otherwise, parse the card's `data-service-tags` attribute (pipe-joined list), and set `hidden` on cards whose tag list does *not* include `activeFilter`.

### 6.4 Result count

After applying the filter, counts the non-hidden cards and updates the `.testimonials-filters__count` text to "Showing N testimonials" (or "Showing 1 testimonial" on the singular case). The `aria-live="polite"` region announces the change to screen-reader users.

### 6.5 Empty state

If the post-filter count is 0:

1. Set `hidden` on the grid's inner wrapper.
2. Remove `hidden` from the `.testimonials-empty` block.
3. The "Show all" button inside the empty block wires to the same handler as the "All" chip — clicking it resets the filter to `all` and restores the grid.

### 6.6 Keyboard navigation inside the toolbar

Exactly the B9 roving-tabindex pattern:

- Left arrow: focus previous chip (wrap to last at start).
- Right arrow: focus next chip (wrap to first at end).
- Home: focus first chip.
- End: focus last chip.
- Space / Enter on focused chip: activate (same as click).

### 6.7 Popstate

On `popstate` (back/forward), re-read the URL and re-apply the filter — so the browser history remembers filter state across navigation.

---

## 7 · Responsive behaviour

| Viewport | Hero | Filters | Grid | CTA |
|---|---|---|---|---|
| ≥1280px | Shell, title at full clamp max | Label inline, chips wrap within row | 3 columns via multi-column flow | Prose-width card, centred |
| 1024–1279px | Shell, title step | As above | 3 columns | As above |
| 768–1023px | Shell, title smaller step | As above, chips wrap | 2 columns | As above |
| 640–767px | Shell, title clamp mid-range | Label stacked above chip track; chip track horizontal-scrolls with snap + right fade | 2 columns | Card padding steps `--space-global-md` |
| <640px | Title at clamp min | As above | 1 column (multi-column doesn't split 22rem into viewports <22rem) | As above |

**No JS-driven column changes.** The multi-column flow reshuffles purely via CSS column-width, which is what makes it a robust choice.

---

## 8 · Accessibility

- **Landmarks.** `<main class="testimonials-page">` at the root. Each section is a `<section>`; hero carries the `<h1>`, filter section carries a visually-hidden `<h2>`, CTA carries a visible `<h2>`, grid carries an `aria-label` (no heading because its content is the cards themselves). The page's heading outline is h1 → h2 (filter, CTA); the cards are `<blockquote>` elements with no `<h3>` because their first line (`.testimonial-card__name`) is semantic attribution, not a heading.
- **Blockquote + cite.** Each card is a `<blockquote>` containing the quote `<p>` and a `<footer>` with a `<cite>` for attribution — the semantic HTML shape for a quoted testimonial with attribution.
- **`aria-pressed` on chips.** Each filter chip carries `aria-pressed="true" | "false"` reflecting the current active filter. Screen readers announce "pressed" / "not pressed" state accordingly.
- **`role="toolbar"` + roving tabindex.** See §6 keyboard. Focus leaves the toolbar naturally via Tab from the active chip; arrow keys move focus between chips within the toolbar.
- **`aria-live="polite"` result count.** Announces "Showing N testimonials" after every filter change, so screen-reader users hear the effect of their action.
- **Empty-state reset button.** `<button type="button" class="testimonials-empty__reset">Show all</button>` — a real button, keyboard-reachable, with visible focus state. The empty state is announced via the grid swap (the empty block is not inside an `aria-live` region on v1; if this proves confusing in testing, add `aria-live="polite"` to the empty block).
- **Focus styles.** Chip focus uses the default `outline: 2px solid var(--focus-ring)` pattern from the design system; never remove focus outlines.
- **Reduced motion.** N/A — no motion on this page.
- **Colour contrast.** The accent left-border on the card is decorative; no text-on-accent contrast concern. Service-pill text (`--brand-accent-text` on `--bg-tinted`) must meet AA 4.5:1 for body text — verify with the existing token pair (it is used elsewhere; should be fine).
- **Pagefind indexing.** The whole page is indexed; individual cards are indexable paragraphs so Pagefind can return matches for testimonial content. Service-tag pill text is indexed as part of the card.

---

## 9 · SEO

- **`<title>`** — `Testimonials — Tailor Education`. (UTF-8 em-dash, not the corrupted character in the draft.)
- **`<meta name="description">`** — draft wording is serviceable: "What schools say about working with Tailor Education — testimonials from teachers and school leaders."
- **`<link rel="canonical">`** — `/testimonials/` unconditionally, regardless of filter query-string state. Filter URLs are not duplicate pages in Google's eyes.
- **JSON-LD.** Emit a single `ItemList` in `<head>` containing every approved testimonial. Each item is a `Review` referencing `Tailor Education` as the `itemReviewed`:

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "Review",
        "reviewBody": "[quote]",
        "author": { "@type": "Person", "name": "[name]" },
        "itemReviewed": {
          "@type": "EducationalOrganization",
          "name": "Tailor Education",
          "url": "https://tailor-education.co.uk"
        }
      }
    }
    /* … one per testimonial */
  ]
}
```

Note: Google's guidelines discourage aggregating self-collected reviews into `AggregateRating` snippets, and Tailor does not publish a rating value. `ItemList` of `Review` items is the honest shape — it doesn't promise a star rating.

- **Open Graph / Twitter Card.** Handled by BaseLayout from `title` + `description`. No custom OG image at v1.
- **Pagefind.** Entire page indexed. Each `.testimonial-card` is indexable paragraph content. No `data-pagefind-ignore` regions.

---

## 10 · Contradictions with other specs

| Source | What it says | What B6 does | Why |
|---|---|---|---|
| `Tailor_Page_Content_Spec_v1.md` §B6 | 3 sections: headline, testimonials, CTA | 5 sections: hero, filter bar, grid, (conditional) empty state, CTA | The content spec's structure is a shorthand; the hero-plus-filter split and the conditional empty state are layout-level concerns not captured at the content-spec level. No disagreement on substance. |
| `Tailor_Page_Content_Spec_v1.md` §B6 CTA | "Work with us →" (→ B5 or B7) | Single CTA → `/contact` (B7) only | B5 is reachable from the main nav on every page; adding a second button here would violate the "one close, one action" pattern used on B2 and B3. A reader who wants services uses the nav. |
| Existing `src/pages/testimonials.astro` | Hand-typed `testimonials` array in frontmatter | Notion-backed fetch via new `getTestimonials()` | Testimonials are content with an approval workflow; they need a CMS gate, not a repo gate. |
| Existing `src/pages/testimonials.astro` | `display: grid` with fixed 2-column rule | `column-count` multi-column flow | Testimonials have 3–5× variable height; grid either stretches or truncates; multi-column respects natural height. See §4.3 rationale. |
| Existing `src/pages/testimonials.astro` | Quote wrapped in `"{t.quote}"` (escaped double-quotes in markup) | CSS-generated curly quotes via `::before` / `::after` + `quotes` property | Keeps Notion content quote-free and standardises quote typography across the collection. |
| Existing `src/components/ServicePageStyles.astro` §6 | C5 renders a hand-written testimonial inline via `.service-proof-band__quote` + `.service-proof-band__source` | B6 introduces `TestimonialCard.astro` with `variant="card" \| "band"`; C5 migrates to use `<TestimonialCard variant="band" />` on the same data | User's brief explicitly asks for component compatibility across B6 and C5. The migration happens as a follow-up; B6 does not block C5. |
| `Tailor_Art_Direction_Brief_v1 (1).md` — "Fraunces for pull quotes" | Fraunces is a pull-quote font on the OTA layer | B6 cards use Lexend (not Fraunces) | B6 is Tailor-layer. Using Fraunces on an entire page of testimonials would read as OTA-layer voice applied to a Tailor-layer context. Single Fraunces pull-quotes are acceptable (as in B3 §4.2); a page of them is not. |
| `Tailor_Layout_Spec_B9.md` — filter chip class | Class is `.blog-filter-chip` (page-scoped) | B6's chip class is `.testimonial-filter-chip` (page-scoped) | Follows the B9 convention that chip classes are scoped to their page. A future refactor to a shared `.filter-chip` primitive would consolidate both — noted in §12. |

---

## 11 · Build checklist

- [ ] Add `fetchTestimonials()` to `src/lib/fetchers.ts` following the `fetchCurriculumStatements()` shape (§2.3).
- [ ] Add `Testimonial`, `ServiceTag`, `Setting`, `Voice` types to `src/lib/types.ts` (§2.2).
- [ ] Wire `fetchTestimonials` into `src/lib/content.ts` — add cached slot, update `_loadAllContentImpl`, export `getTestimonials()`; optionally export `getTestimonialsByService()`.
- [ ] Confirm Notion integration has access to data source `4fede26f-29ad-4c3b-a67b-31065b0a19c3`; share with the integration if not.
- [ ] Confirm Notion schema matches §2.1 field names exactly; rename Notion fields or the fetcher if they drift.
- [ ] Rewrite `src/pages/testimonials.astro` from the existing draft using §0.2 removal table + §5.1 template.
- [ ] Replace corrupted em-dash in `<title>` attribute (draft line 19) with UTF-8 em-dash.
- [ ] Replace root `<section class="testimonials-page">` with `<main class="testimonials-page">`.
- [ ] Create `src/components/TestimonialCard.astro` with `variant="card" | "band"` and `showServiceTag` props (§5.3).
- [ ] §4.1 Hero: `--bg-tinted`, `--container-max-shell`, eyebrow / h1 / lede.
- [ ] §4.2 Filter bar: `role="toolbar"`, one chip per service tag + "All", roving tabindex, `aria-pressed`.
- [ ] §4.2 Chip styling copy-pasted from B9's `.blog-filter-chip` rules, renamed to `.testimonial-filter-chip` (§4.2 chip styling note).
- [ ] §4.2 Mobile chip track: `.testimonials-filters__scroll` with `overflow-x: auto`, `scroll-snap-type: x mandatory`, right-edge fade. `@media (min-width: 768px)` drops the track.
- [ ] §4.2 Result count `.testimonials-filters__count` with `aria-live="polite"`.
- [ ] §4.3 Grid: `column-width: 22rem`, `column-gap: var(--space-global-md)`, card `break-inside: avoid`, `display: inline-block`, `width: 100%`.
- [ ] §4.3 Filtered cards use `hidden` attribute; CSS `[hidden] { display: none !important; }` is respected (native default).
- [ ] §4.4 Card markup via component; left accent border via `--border-width-md` solid `--brand-accent-border`; curly quotes via `quotes` + `::before` / `::after`.
- [ ] §4.4 Three-line attribution in `<cite>` with `.testimonial-card__name` / `__role` / `__org`; role and org conditionally rendered.
- [ ] §4.4 Optional service-tag pill using first tag only.
- [ ] §4.5 CTA: single-button tinted card, `/contact`.
- [ ] §6 JS: URL state parse, chip click handler, `history.replaceState`, popstate re-apply, empty-state swap, result count update, roving tabindex keyboard nav.
- [ ] §9 JSON-LD: `ItemList` of `Review` items emitted in `<head>` (one per approved testimonial).
- [ ] §9 Canonical is unconditionally `/testimonials/` regardless of query string.
- [ ] §9 Pagefind indexes all cards; no `data-pagefind-ignore` regions.
- [ ] Update each C5 service page's "Read more testimonials →" link to `href="/testimonials/?service={canonical tag}"` (the deep-link-to-filter tasks listed in §12).
- [ ] Visual pass at 360 / 640 / 1024 / 1440 px; confirm multi-column behaviour and chip wrap at each.
- [ ] Keyboard-only pass through hero → chips → cards → CTA button; confirm focus states visible throughout.
- [ ] Screen-reader pass: hero `<h1>` announces, toolbar announces "Filter testimonials, toolbar, [chip name] button, pressed", card quote + cite pattern announces correctly.
- [ ] Empty state: apply a service filter that matches zero cards, confirm empty block shows, reset button returns grid.
- [ ] Empty state: no approved entries — confirm initial empty state (`.testimonials-empty-initial`) renders and hero + CTA still surround it.
- [ ] All `[COPY TBD]` blocks resolved before ship.

---

## 12 · Open items

- **Notion schema verification.** §2.1 field names are based on the brief; verify against the live data source before coding the fetcher. If field names differ (e.g. "School" vs "School or organisation"), update the fetcher rather than renaming in Notion.
- **`--space-global-3xs` token.** §4.4 attribution block uses `var(--space-global-3xs)` (or falls back to `0.125rem`). If the token doesn't exist in `tailor-site-v2.css`, either add it (design-system-level) or fall back to the raw value inline with a comment (page-level). Flag pre-build.
- **`--brand-accent-border` token.** §4.4 left-border colour uses `--brand-accent-border` (so a future theme override changes one value). If the token does not exist, introduce it as an alias of `--brand-accent` or fall back to `--brand-accent` directly. Flag pre-build.
- **C5 component consolidation.** After B6 ships, migrate each of the 6 C5 service pages (`rse-training`, `rse-policy-curriculum-planning`, `rse-for-send-and-ap`, `rse-for-secondary-schools`, `rse-for-primary-schools`, `drop-days`) from hand-typed `testimonialQuote` strings to `<TestimonialCard variant="band" />` sourced via `getTestimonialsByService()`. Each migration is a small, independent PR; batching them is optional.
- **Deep-link query strings from C5.** As part of the C5 migration, each page's "Read more testimonials →" link should change from `/testimonials` to `/testimonials/?service={canonical tag for this page's service}` so the B6 filter pre-applies on arrival.
- **Setting / Voice filters.** §2.1 captures Setting and Voice but B6 v1 does not filter on them. A future B6 v2 could introduce a secondary filter row (Setting: Primary / Secondary / SEND / AP / HE) — matching B9's dual-row pattern. Gauge demand before adding; adds complexity for a small reader slice.
- **Load-more at high volume.** At ~50+ approved testimonials, scrolling the whole collection on mobile starts to feel long. If / when that threshold is crossed, port B9's Load More pattern (default skip threshold 24; show-all button reveals the rest). Not needed at current volume.
- **Shared `.filter-chip` primitive.** B9 and B6 now carry near-identical chip rules under different class names. A future refactor extracts a shared primitive in `tailor-site-v2.css` (e.g. `.filter-chip` base + `.blog-filter-chip` / `.testimonial-filter-chip` namespacing only for JS hooks). Out of scope for B6 ship; worth doing before a third filter-bar use case lands.
- **Portrait / avatar support.** If Notion later gains a portrait upload field, `.testimonial-card` accommodates a small 2.5rem circular portrait at card-top-left with text reflowing to its right. Currently the card is text-only, intentionally — the brief does not include a portrait field and the collective voice reads as more credible without them (schools value attribution, not faces).
- **Featured testimonial flag.** The Notion schema could grow a `Featured on homepage` checkbox so B1 homepage can pluck a single testimonial without a per-page hand-override. Out of scope for B6; noted as content-model creep to watch for.
- **Fade-in animation on filter change.** Currently cards snap between `hidden` and visible. A gentle opacity fade via JS (not CSS `display` transition, which doesn't work) would soften the filter UX. Deferred — not a v1 priority.
- **Copy resolution.** All `[COPY TBD]` blocks on hero lede, empty-state initial, empty-state filtered, and CTA supporting line need final copy before ship.
