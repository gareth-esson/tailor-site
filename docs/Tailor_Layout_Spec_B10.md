# Tailor Layout Specification — B10 Search Results

**Route:** `/search?q={query}`
**Template:** `src/pages/search.astro`
**Layer:** Tailor (default, no `.layer-ota`)
**Status:** Layout spec for an already-functional page
**Depends on:** A4 Header search (SearchBar.astro), Pagefind build-time index, shell hero pattern (shared with B2/B3/B6/B7)
**Related specs:** `Tailor_Page_Content_Spec_v1.md` §B10 (lines 468–491); A4 search bar spec

---

## §0 — Frame

### 0.1 Purpose

The search results page is the destination when a user commits to a query — by pressing Enter in the header search bar, clicking "See all results →" in the A4 dropdown, or landing from an external deep link. Unlike the A4 dropdown (which is a quick-peek surface optimised for 8 results in a tight popover), B10 is a considered reading surface: larger input, grouped results by content type, optional "Show all" per group, and a dignified no-results state that routes the user toward structured browsing.

The page already works. Pagefind indexes `data-pagefind-body` regions at build, the client-side JS lazy-loads `/pagefind/pagefind.js`, runs a debounced query, and renders grouped result rows. **This spec is not a rewrite.** It specifies the design frame, section structure, per-type row treatment, token usage, and contradictions to resolve — the existing Pagefind integration is composed into a designed page rather than reinvented.

### 0.2 Code to remove / refactor in the current draft

The existing `src/pages/search.astro` is a working prototype carrying prototype debt. Resolve in the B10 build:

| # | Current state | Replace with |
|---|---|---|
| 1 | `<section class="mx-auto max-w-4xl ...">` — Tailwind-style utility width hardcoded on the section | `--container-max-reading-wide` (56rem) applied via a scoped `.search-page__shell` class; hero uses `--container-max-shell` via the shared shell-hero pattern |
| 2 | `<h1>` sized at `--text-display-size-h2` with no eyebrow, no lede — naked heading | Shell hero matching B2/B3/B6/B7: eyebrow ("Search"), h1 at `--text-display-size-h1` with query interpolation, optional lede when `q` is present |
| 3 | Entire `<style>` block is inline `style="..."` attributes on every element | Extracted `<style>` block in `search.astro` using Tailor tokens; no inline styles except where content-driven (e.g. Pagefind-returned HTML) |
| 4 | Search input wrap: `style="display: flex; gap: 0.5rem; padding: 0.75rem 1rem; background: var(--bg-surface-alt); border: var(--border-width-sm) solid var(--border-strong); border-radius: var(--radius-base);"` | `.search-page__input-wrap` class; same tokens but larger scale than A4 (see §4.2) |
| 5 | Empty state `<div id="search-page-empty">` has only a single link to `/topics/` | Structured no-results block with two browse routes (`/topics/` and `/questions/`) and optional service-enquiry escape hatch (see §4.5) |
| 6 | `typeLabels` uses `'anonymous_question': 'Questions'` — inconsistent with SearchBar which uses `'Okay to Ask'` | Unify: both surfaces use `'Okay to Ask'` for `anonymous_question`. See §10.1 |
| 7 | `getContentType(url)` checks `/services/` OR `/training` — dual path matching | Single source of truth in a shared helper `src/lib/searchTypes.ts` used by both SearchBar and search.astro |
| 8 | Result rows use large string concatenation `html += ...` with inline styles per row | Extract row rendering into a small template-function returning a DOM node; styles live in the `<style>` block keyed on `.search-result-row` + type modifiers |
| 9 | "Show all" toggle button is rendered with inline styles and no focus-visible treatment | `.search-result-group__toggle` class with focus-visible styling and `aria-expanded` state |
| 10 | Result "excerpt" uses Pagefind's default `<mark>` without scoped styling | Scope `.search-result-row__excerpt :global(mark)` with `--brand-accent-soft` background, consistent with A4 SearchBar |

### 0.3 Non-goals

- Not rebuilding Pagefind integration, result fetching, or the debounce/query logic.
- Not adding filters, facets, date-range, or per-type sort. Groups and the per-group "Show all" toggle are sufficient for this scope.
- Not implementing server-side search or a search API route — Pagefind is the mechanism.
- Not specifying A4 header search (that is a separate spec); B10 must only match A4's type taxonomy and result-click tracking event.
- Not implementing pagination. Pagefind returns all matches; "Show all" within a group reveals the rest. If result sets grow unwieldy, revisit.

---

## §1 — Route & access

- **URL:** `/search?q={query}` (also responds to `/search` with no query — shows the empty frame with a prompt to type).
- **Noindex:** yes — `BaseLayout` receives `noIndex={true}`. Search result URLs are not canonical content.
- **Entry points:** Enter key on A4 input; "See all results →" in A4 dropdown; direct link; back navigation from a result page.
- **Exit points:** click a result row; "Browse all topics" / "Browse all questions" from no-results; header nav links; service CTA from no-results (see §4.5).
- **Query param:** `q` — read once server-side for initial render (pre-fill), then owned client-side thereafter. Updates via `history.replaceState` on each debounced search — no hard reloads between keystrokes.

---

## §2 — Information architecture

One shell column. Top-to-bottom:

1. **Hero band** (shell container; `--bg-tinted`) — eyebrow + h1 + optional lede.
2. **Search input band** (reading-wide container; `--bg-page`) — the prominent query input, sticky-ish but not actually sticky.
3. **Result meta** (reading-wide; `--bg-page`) — "X results for '[query]'" + subtle helper line.
4. **Results list** (reading-wide; `--bg-page`) — groups in type order, each a card-less list with a group heading and up to 5 rows + "Show all" toggle.
5. **No-results state** (reading-wide; `--bg-surface-alt`) — when `results.length === 0 && query.trim() !== ''`: structured browse routes + escape hatch.
6. **Quiet footer CTA** (shell; `--bg-tinted`) — "Didn't find what you were looking for? Get in touch." Single `btn--outline` to `/contact`. Only shown when a query is present.

Sections 5 and 6 are mutually exclusive with the results list: the results list renders if and only if there is at least one match; the no-results state renders if and only if there is a query with zero matches; the footer CTA renders if and only if there is a query (regardless of match count).

With no query at all, the page renders sections 1–2 only, and the input is autofocused.

---

## §3 — Surface rhythm & grid

### 3.1 Surface rhythm

`tinted (hero) → page (input + results) → alt-tinted (no-results, if applicable) → tinted (footer CTA)`

When results are present: `tinted → page → tinted` — clean, non-distracting.
When no results: `tinted → page (input + meta) → alt-tinted (no-results) → tinted` — the alt-tinted band gives the empty state presence without making it feel like a dead end.

### 3.2 Containers

- Hero: `--container-max-shell` (72rem) via the shared shell-hero pattern (`.shell-hero__inner`), padded by `--space-global-gutter`.
- All other bands: `--container-max-reading-wide` (56rem) — wider than prose (44rem) because result rows benefit from breathing room in the metadata column, but narrower than shell to keep rows scannable as a single line of focus.
- Vertical rhythm: `--space-struct-y-base` between bands; `--space-global-xl` between the input band and the results list; `--space-global-lg` between group blocks within the results list; `--space-global-xs` between rows within a group.

### 3.3 Breakpoint behaviour

- `<640px`: stacked; input sizes down but stays prominent (1rem+ typography); result row metadata column wraps beneath the primary line.
- `640–960px`: single column at `--container-max-reading-wide`; rows gain a right-aligned metadata column.
- `>960px`: identical to 640–960 — width is already clamped by the reading-wide container.

---

## §4 — Sections

### 4.1 Hero band (§0, shell)

Uses the same shell-hero pattern as B2/B3/B6/B7. Surface: `--bg-tinted`.

```
┌── shell-hero (bg-tinted, pad struct-y) ───────────────────┐
│  SEARCH ·····························                    │
│                                                           │
│  # Search results for "sexuality"                         │
│                                                           │
│  Matches across questions, glossary, topics, blog,        │
│  and services. Keep typing to refine.                     │
└───────────────────────────────────────────────────────────┘
```

- **Eyebrow** (micro, `--card-eyebrow-ls`, `--text-body-muted`): `Search`
- **H1** (`--text-display-size-h1`, `--heading-weight-h1`, `--text-heading`):
  - With query: `Search results for "<query>"` — query interpolated via text content (escaped), wrapped in `<em>` styled regular-weight italic for emphasis without colour shift.
  - Without query: `Search`
- **Lede** (`--text-prose-size-lede`, `--text-body-muted`, `line-height: var(--lh-body)`, `max-width: var(--container-max-prose)`):
  - With query: `Matches across questions, glossary, topics, blog, and services. Keep typing to refine.` [COPY TBD — copywriter review]
  - Without query: `Type a question, topic, or term. Okay to Ask answers, glossary definitions, blog pieces, and services all search together.` [COPY TBD]

### 4.2 Search input band (§1, reading-wide)

This is the page's functional centre. **It must read as more prominent than A4.**

Scale delta vs A4:

| Property | A4 (SearchBar) | B10 (search page) |
|---|---|---|
| Input height (padding) | `0.5rem 0.75rem` | `0.875rem 1rem` |
| Input font size | `--text-prose-size-body` | `--text-prose-size-lede` (18px+ at desktop) |
| Border width | `--border-width-xs` | `--border-width-sm` |
| Border colour | `--border-subtle` | `--border-strong` |
| Radius | `--radius-sm` | `--radius-base` |
| Wrap padding | none (inline input) | `0.75rem 1rem` container padding around the input |
| Icon | small magnifier (A4 pattern) | larger magnifier at `1.25rem`, inline-start |

**Markup:**

```html
<div class="search-page__input-wrap">
  <svg class="search-page__input-icon" aria-hidden="true"><!-- magnifier --></svg>
  <label class="sr-only" for="search-page-input">Search Tailor Education</label>
  <input
    id="search-page-input"
    class="search-page__input"
    type="search"
    name="q"
    value={query}
    placeholder="Search questions, topics, glossary…"
    autocomplete="off"
    autocorrect="off"
    spellcheck="false"
    aria-describedby="search-page-hint"
  />
  <button
    type="button"
    class="search-page__input-clear"
    id="search-page-clear"
    aria-label="Clear search"
    hidden
  >
    <svg aria-hidden="true"><!-- x --></svg>
  </button>
</div>
<p class="search-page__hint" id="search-page-hint">
  Results update as you type.
</p>
```

**Behaviour:**
- Autofocus on mount when `q` is empty; otherwise focus is placed but caret at end.
- Clear button becomes visible when `value.length > 0`; clicking it empties the input, re-focuses, and re-runs search (which clears results and returns to the "no query" frame).
- Enter key does not reload — search is live. Enter is a no-op except that it blurs the input on touch devices to dismiss the keyboard.
- `aria-describedby="search-page-hint"` — screen reader hears "Results update as you type" after the input label.

### 4.3 Result meta (§2, reading-wide)

A single line between the input and the results list, only shown when `query.trim() !== ''`:

```
<p class="search-page__meta" aria-live="polite">
  {resultCount, plural, one {1 result} other {# results}} for "<query>"
</p>
```

- Typography: `--text-card-size-body`, `--text-body-muted`, `--font-weight-medium`.
- Includes `aria-live="polite"` so assistive tech announces result count changes without interrupting.
- When `resultCount === 0` this line is suppressed — the no-results block owns the messaging.

### 4.4 Results list (§3, reading-wide)

Ordered groups — hide any group with zero matches.

**Group order** (fixed; most-likely-intent first, service last so it doesn't dominate):

1. Questions (Okay to Ask) — `anonymous_question`
2. Glossary — `glossary`
3. Topics — `topics`
4. Blog — `blog`
5. Services — `services`
6. Other — `other` (catch-all; rarely populated)

**Group block markup:**

```html
<section class="search-result-group" data-group-type="anonymous_question">
  <h2 class="search-result-group__heading">
    Okay to Ask
    <span class="search-result-group__count">({n})</span>
  </h2>
  <ol class="search-result-group__list">
    <!-- up to 5 rows; rest have [hidden] -->
  </ol>
  <button
    type="button"
    class="search-result-group__toggle"
    data-toggle-for="anonymous_question"
    aria-expanded="false"
    hidden
  >
    Show all {n} Okay to Ask results
  </button>
</section>
```

- Group heading: `--text-prose-size-h3`, `--heading-weight-h3`, `--text-heading`. Count is muted at `--text-body-muted`, regular weight, preceded by a non-breaking space.
- List: unordered semantically (`<ul>` acceptable; the example uses `<ol>` so that position is stable — use `<ul>` with `data-position` on each row for simpler DOM). Either is fine; pick one and be consistent.
- Toggle appears only when `n > 5`; hidden otherwise. Toggles `aria-expanded` and reveals/hides rows beyond position 5 by removing/adding `[hidden]` (not `display: none` — `hidden` so that keyboard focus order remains correct).

**Per-type row treatment:**

All rows share a base structure, differing only in what appears in the metadata slot. The row is a full-width clickable area but the click target is the heading link; the rest of the row is visually grouped but not a second focus target.

Base row structure:

```
┌── .search-result-row ────────────────────────────────────┐
│  {type-specific eyebrow, if any}                         │
│  [Primary heading link]                                  │
│  {type-specific metadata line OR excerpt}                │
└──────────────────────────────────────────────────────────┘
```

- Row vertical padding: `0.625rem 0` (keep tight — this is a scan surface, not a card).
- Row divider: `border-bottom: var(--border-width-xs) solid var(--border-subtle)`; last row in a group: `border-bottom: none`.
- Heading link: `--text-prose-size-body`, `--font-weight-semibold`, `--text-heading`; hover → `--brand-accent-text` + underline.
- No card background, no card radius, no card border. Rows are text-first.

Type-specific slots (in order of priority when both excerpt and eyebrow exist, eyebrow wins):

| Type | Eyebrow (optional) | Primary | Metadata line |
|---|---|---|---|
| `anonymous_question` | — | Question title (e.g. "What is consent?") | Pagefind excerpt — first 1–2 sentences, with `<mark>` highlights; clamped to 2 lines via `-webkit-line-clamp: 2` |
| `glossary` | Term (e.g. "Consent") in `--text-card-size-body`, uppercase not applied, `--font-weight-semibold`, `--brand-accent-text` | Fallback heading: also the term if Pagefind `meta.title` matches | Definition preview — 1 line clamped (`line-clamp: 1`), `--text-body-muted` |
| `topics` | Category label ("Topic" in small caps via `--card-eyebrow-ls`, `--text-body-muted`) | Topic name | Short excerpt — 1 line clamped |
| `blog` | — | Post title | Date (`d MMM yyyy`) + " · " + excerpt — both `--text-body-muted`, `--text-card-size-body`, 1 line clamped |
| `services` | — | Service name | 1-line tagline from Pagefind excerpt |
| `other` | — | Pagefind title | Excerpt |

**Mark (`<mark>`) styling (scoped):**
- Background: `--brand-accent-soft`
- Colour: inherit
- Padding: `0 0.125em`
- Radius: `--radius-xs`
- Matches A4 SearchBar's highlight treatment for visual continuity.

**Excerpt clamping:**
- Use CSS `-webkit-line-clamp` (with `display: -webkit-box`, `-webkit-box-orient: vertical`, `overflow: hidden`) — supported cross-browser.
- Fall back to `overflow: hidden; text-overflow: ellipsis; white-space: nowrap` for 1-line clamps where line-clamp is unnecessary.

### 4.5 No-results state (§4, alt-tinted)

Only renders when `query.trim() !== '' && totalResults === 0`.

```
┌── .search-no-results (bg-surface-alt, pad lg, radius-lg) ──┐
│                                                            │
│  ## No results for "{query}"                               │
│                                                            │
│  A few things to try:                                      │
│                                                            │
│  → Check spelling, or try a shorter / more general word.   │
│  → Browse questions organised by topic.                    │
│  → Read the glossary for clear definitions.                │
│                                                            │
│  [Browse topics →]   [View all questions →]                │
│                                                            │
│  ─────────────────────────────────────────────────         │
│                                                            │
│  Looking for a service? Get in touch and we'll help.       │
│  [Get in touch →]                                          │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

- Heading: `--text-prose-size-h2`, `--heading-weight-h2`, `--text-heading`.
- Intro line: `--text-prose-size-body`, `--text-body`, `line-height: var(--lh-body)`.
- Suggestion list: three bullet prompts using a right-pointing arrow glyph (→) in `--brand-accent-text`, followed by body text. Rendered as `<ul>` with styled markers (no default bullets), `margin: var(--space-global-sm) 0 var(--space-global-md)`.
- Primary actions: two outline buttons side-by-side (`.btn--std .btn--outline`):
  - "Browse topics →" → `/topics/`
  - "View all questions →" → `/questions/` (or `/anonymous_question/` — confirm canonical path in §10.3)
- Separator: subtle `hr` at `--border-subtle`, `border-width: var(--border-width-xs)`, margin `var(--space-global-md) 0`.
- Escape hatch: quiet service prompt + single `.btn--primary` to `/contact`.

Copy marked [COPY TBD] — copywriter review. Phrasing must not shame the user for an unmatched query; "No results for" is neutral and direct.

### 4.6 Footer CTA (§5, tinted)

Only when `query.trim() !== ''`. Suppressed when the user hasn't searched (no query yet → no CTA needed).

```
Didn't find what you needed? We might still be able to help.
[Get in touch →]
```

- Heading-as-paragraph: `--text-prose-size-h3`, `--heading-weight-h3` to give it stature without a real h-level (this is a CTA, not a content section).
- Button: `.btn .btn--std .btn--primary .has-icon-hover` → `/contact`.
- Centred; `text-align: center`; `padding: var(--space-struct-y-base) var(--space-global-gutter)`.

---

## §5 — Template structure

```astro
---
/**
 * Search results page [B10] — /search
 * Pagefind-powered client-side search.
 * Query read from ?q=; initial render pre-fills the input.
 * All fetching + rendering happens client-side; server only paints the shell.
 */
import BaseLayout from '../layouts/BaseLayout.astro';
import ShellHero from '../components/ShellHero.astro';
import SearchIcon from '../components/icons/SearchIcon.astro';
import CloseIcon from '../components/icons/CloseIcon.astro';

const query = Astro.url.searchParams.get('q')?.trim() || '';
const hasQuery = query.length > 0;

// Title: include query when present, still within a reasonable length.
const title = hasQuery
  ? `Search: "${query}" — Tailor Education`
  : 'Search — Tailor Education';
---

<BaseLayout
  title={title}
  description="Search questions, glossary, topics, blog, and services across Tailor Education."
  canonicalPath="/search"
  noIndex={true}
>
  <ShellHero
    eyebrow="Search"
    surface="tinted"
  >
    <h1 slot="heading" class="search-page__h1">
      {hasQuery ? (
        <Fragment>Search results for <em>"{query}"</em></Fragment>
      ) : (
        <Fragment>Search</Fragment>
      )}
    </h1>
    <p slot="lede" class="search-page__lede">
      {hasQuery
        ? 'Matches across questions, glossary, topics, blog, and services. Keep typing to refine.'
        : 'Type a question, topic, or term. Okay to Ask answers, glossary definitions, blog pieces, and services all search together.'}
    </p>
  </ShellHero>

  <section class="search-page__band search-page__band--input">
    <div class="search-page__shell">
      <div class="search-page__input-wrap">
        <SearchIcon class="search-page__input-icon" />
        <label class="sr-only" for="search-page-input">Search Tailor Education</label>
        <input
          id="search-page-input"
          class="search-page__input"
          type="search"
          name="q"
          value={query}
          placeholder="Search questions, topics, glossary…"
          autocomplete="off"
          autocorrect="off"
          spellcheck="false"
          aria-describedby="search-page-hint"
        />
        <button
          type="button"
          class="search-page__input-clear"
          id="search-page-clear"
          aria-label="Clear search"
          hidden
        >
          <CloseIcon />
        </button>
      </div>
      <p class="search-page__hint" id="search-page-hint">Results update as you type.</p>
    </div>
  </section>

  <section class="search-page__band search-page__band--results">
    <div class="search-page__shell">
      <p
        class="search-page__meta"
        id="search-page-meta"
        aria-live="polite"
        hidden
      ></p>
      <div class="search-page__results" id="search-page-results" role="region" aria-label="Search results"></div>
      <div class="search-no-results" id="search-page-empty" hidden>
        <!-- populated by script with heading + query echo -->
      </div>
    </div>
  </section>

  <section class="search-page__band search-page__band--cta" id="search-page-footer-cta" hidden>
    <div class="search-page__shell search-page__shell--center">
      <p class="search-page__cta-text">Didn't find what you needed? We might still be able to help.</p>
      <a href="/contact" class="btn btn--std btn--primary has-icon-hover">Get in touch</a>
    </div>
  </section>
</BaseLayout>

<script>
  import { initSearchPage } from '../scripts/search-page';
  initSearchPage();
  document.addEventListener('astro:after-swap', initSearchPage);
</script>

<style>
  /* scoped tailor tokens — see §7 */
</style>
```

Notes:
- Uses the new shared `ShellHero.astro` (to be created if not present — otherwise inline the hero pattern used in B2/B3). Hero composition matches B2/B3/B6/B7.
- Result rendering, empty-state population, and toggle handling all live in `src/scripts/search-page.ts` (extracted from the inline `<script>` in the current draft).
- `role="region"` + `aria-label` on the results container gives assistive tech a landmark for quick jump-to.

---

## §6 — Behaviour & JS

### 6.1 Extract to `src/scripts/search-page.ts`

- `initSearchPage()`: idempotent; guards against double-init; re-binds on `astro:after-swap`.
- Lazy-loads `/pagefind/pagefind.js` on first interaction OR on mount when `q` is present.
- Exposes no globals; imports `getContentType` and `typeLabels` from `src/lib/searchTypes.ts`.

### 6.2 Query lifecycle

- **Initial render:** if `q` is present in URL, run a search on DOM ready. Input already pre-filled by the server.
- **Input:** debounce 300ms (NOT 200ms — the page surface can afford patience; see §10.2). Minimum query length: 1 char (NOT 2; page is committed, user wants to see what's there).
- **URL sync:** `history.replaceState` on each settled search, updating `?q=` without a navigation.
- **Clear:** clicking the clear button empties input, clears results, sets URL to `/search` (no `?q`), hides meta line and footer CTA, hides no-results block.

### 6.3 Rendering

- Group results by `getContentType(result.url)`.
- Iterate `typeOrder`; skip any type with zero matches.
- For each non-empty group, render group heading + up to 5 rows + optional "Show all" toggle.
- Excerpt is Pagefind's `result.excerpt` with `<mark>` pre-injected. Never bypass escaping on URL or title — use `textContent` for those.

### 6.4 Analytics

Preserve the existing event surface. These are fired via `window.trackEvent` guarded by `typeof window.trackEvent === 'function'`:

- `site_search_query` — fired after a settled search completes. Payload: `{ query, result_count, source_page: '/search' }`.
- `site_search_result_click` — fired on result link click. Payload: `{ query, result_slug: url, result_type, position }`. Position is the 1-based index within the group, so that clicks on position 1 of Questions and position 1 of Glossary both read as "first-in-group" — this preserves B10's grouped nature in the analytics model.

Do not double-fire: a single settled search fires exactly one `site_search_query`. Repeated typing on the same final query should not re-fire (compare against last fired query before emitting).

### 6.5 Error handling

- If Pagefind fails to load (network error, index not deployed): render a quiet inline error into `#search-page-results`:
  > Search is temporarily unavailable. Try [browsing topics](/topics/) or [all questions](/questions/) instead.
  - Surface: `--bg-surface-alt`, padding `--space-global-md`, radius `--radius-base`, bordered `--border-subtle`.
- No alert, no toast, no modal. The page remains browsable.

### 6.6 Focus & keyboard

- Autofocus input on empty-query mount; otherwise no autofocus (user came back from a result and shouldn't be yanked).
- Tab order: input → clear button (if visible) → first result heading → subsequent headings → "Show all" toggle → next group, etc. → no-results actions → footer CTA.
- `Enter` key in input: blur on touch devices (dismiss keyboard); no-op on desktop (search is already live).
- `Escape` key in input: clear query (same as clear button).

---

## §7 — Tokens

### 7.1 Tokens used

Surfaces: `--bg-tinted`, `--bg-page`, `--bg-surface`, `--bg-surface-alt`
Text: `--text-heading`, `--text-body`, `--text-body-muted`, `--brand-accent-text`
Borders: `--border-subtle`, `--border-strong`
Border width: `--border-width-xs`, `--border-width-sm`
Accent: `--brand-accent`, `--brand-accent-soft` (for `<mark>` highlight)
Radius: `--radius-xs`, `--radius-sm`, `--radius-base`, `--radius-lg`
Typography sizes: `--text-display-size-h1`, `--text-prose-size-h2`, `--text-prose-size-h3`, `--text-prose-size-lede`, `--text-prose-size-body`, `--text-card-size-body`, `--text-aux-size-micro`
Heading weights: `--heading-weight-h1`, `--heading-weight-h2`, `--heading-weight-h3`
Body weights: `--font-weight-regular`, `--font-weight-medium`, `--font-weight-semibold`
Line heights: `--lh-display`, `--lh-heading`, `--lh-body`
Letter spacing: `--card-eyebrow-ls`
Spacing: `--space-global-xs`, `--space-global-sm`, `--space-global-md`, `--space-global-lg`, `--space-global-xl`, `--space-global-gutter`, `--space-struct-y-base`
Containers: `--container-max-shell`, `--container-max-reading-wide`, `--container-max-prose`
Transitions: `--transition-duration`, `--transition-easing`
Font stacks: `--font-tailor-heading-stack`, `--font-tailor-body-stack`

### 7.2 No new tokens required

Everything resolves to tokens already in the Tailor layer. No B10-specific fabrications.

### 7.3 Flagged (reference only)

- `--text-on-emphasis` and `--text-on-emphasis-muted` — flagged in B3 as missing but not used here (no `--bg-emphasis` band in B10).

---

## §8 — Accessibility

- **Landmarks:** `BaseLayout` provides `<main>`; result region has `role="region"` + `aria-label="Search results"`.
- **Live regions:** the meta line uses `aria-live="polite"` so result counts announce without interruption. The results region itself is NOT `aria-live` — too noisy on every keystroke.
- **Focus:** visible focus rings on input, clear button, result heading links, and "Show all" toggle. Use `outline: 2px solid var(--brand-accent); outline-offset: 2px` — matches existing form spec in EnquiryForm.
- **Contrast:** body-muted text on all surfaces meets 4.5:1. `--brand-accent-text` on `--bg-page` and `--bg-surface-alt` both meet AA. `<mark>` on `--brand-accent-soft` — verify 4.5:1 in the audit; if marginal, switch to an inline outline rather than background highlight.
- **Autocomplete:** `autocomplete="off"` on the input — search queries are ephemeral, not credentials.
- **Screen reader flow:** hero → input → meta (live) → results region → no-results / CTA. The meta live region is the primary "did the search work?" feedback channel.
- **Reduced motion:** no motion to honour beyond the default hover transitions, which already respect `prefers-reduced-motion` globally.

---

## §9 — SEO / metadata

- `<title>`: `Search: "{query}" — Tailor Education` when query present; `Search — Tailor Education` otherwise.
- `<meta name="description">`: fixed — `Search questions, glossary, topics, blog, and services across Tailor Education.`
- `<link rel="canonical" href="/search">` — no query param in canonical.
- `<meta name="robots" content="noindex, follow">` via `noIndex={true}` on `BaseLayout`. Search URLs are not canonical content; we don't want them in the index, but internal links on the page are still followable.
- No JSON-LD. Search result pages don't warrant `SearchResultsPage` schema given the noindex directive.

---

## §10 — Contradictions & decisions

### 10.1 Type label mismatch — RESOLVE before B10 ships

Current state:

| Surface | `anonymous_question` label |
|---|---|
| `src/components/SearchBar.astro` (A4) | `'Okay to Ask'` |
| `src/pages/search.astro` (B10 draft) | `'Questions'` |

Both pages index the same content but name the type differently. This is the type of inconsistency that erodes trust — a user who sees "Okay to Ask" in the dropdown and then "Questions" after pressing Enter will assume either (a) those are different things, or (b) the site is sloppy.

**Decision:** both surfaces use `'Okay to Ask'` for `anonymous_question`. Reasoning: "Okay to Ask" is the brand, and the page URLs live under `/anonymous_question/` but render as Okay to Ask entries. Using the brand name reinforces the layer affordance; "Questions" is generic and doesn't carry the promise.

**Action:** extract `typeLabels`, `typeOrder`, and `getContentType` into `src/lib/searchTypes.ts`; import into both files; delete the duplicated literals.

### 10.2 Debounce + min-query-length mismatch — KEEP DIFFERENT

| Surface | Debounce | Min length |
|---|---|---|
| A4 SearchBar | 200ms | 2 chars |
| B10 search page | 300ms | 1 char |

Both defensible, for different reasons:
- A4 is a peek surface — snappy, but needs to avoid 1-char noise in a cramped popover.
- B10 is a committed surface — the user is here on purpose; 1-char queries like "q" or "s" are acceptable; 300ms lets them finish typing before the page reflows.

**Decision:** keep different. Document in code comments so the next maintainer doesn't "unify" them by accident.

### 10.3 Questions index route

Current state: the canonical browse route for anonymous questions isn't confirmed. The B10 no-results block links to "View all questions →". Possible routes:
- `/questions/` — friendlier, matches the label.
- `/anonymous_question/` — matches the internal slug.
- `/topics/` — different surface, not a direct match.

**Decision requested:** confirm which of `/questions/` vs `/anonymous_question/` is the canonical index. If `/questions/` doesn't exist, either create an alias or link to `/topics/` + "View questions organised by topic". This spec assumes `/questions/` exists; if not, substitute `/topics/`.

### 10.4 Service group dominance risk

Service pages are few (6) and highly optimised — a generic query can match a service page at top relevance and push more-useful content (a matching question) below the fold. Placing `services` last in `typeOrder` (§4.4) mitigates this without hiding services. Do not "boost" services; respect the query intent.

### 10.5 Pagefind index freshness

Pagefind indexes at build. New Notion content (questions, glossary terms) won't appear in search until the next build. This is acceptable given weekly-to-daily build cadence, but worth noting if build frequency drops.

---

## §11 — Test plan

**Functional:**
- Query in URL → input pre-filled, search runs, results render without keystroke.
- Live typing → debounced 300ms → URL updates via `replaceState` → results re-render.
- Clear button → visible only when input has value → click empties → URL becomes `/search` → results clear.
- "Show all" toggle → reveals hidden rows in the same group → `aria-expanded` flips → toggle button disappears (or changes to "Show less" — spec TBD; recommend disappears-when-revealed, for simplicity).
- Zero results → no-results block renders with query echoed → results list hidden → footer CTA still renders (has query).
- No query → hero + input only; no meta, no results block, no no-results, no footer CTA.
- Pagefind load failure → error block renders with browse-fallback links.

**Visual regression:**
- Hero shell matches B2/B3/B6/B7 shell-hero crop.
- Input is visibly larger than A4 header bar.
- Result rows have consistent vertical rhythm; dividers line up at the reading-wide container edge.
- `<mark>` highlights match A4 SearchBar visual.

**Accessibility:**
- Keyboard-only: Tab reaches input → clear → each heading link → "Show all" → next group's headings → footer CTA. No traps.
- VoiceOver / NVDA: landmark nav lists "Search results" region; meta announces on settled search; result count announced on group reveal.
- Focus rings visible on all interactive elements.
- axe / Lighthouse: 0 critical issues.

**Analytics:**
- `site_search_query` fires once per settled query (verify no duplicate fires on identical repeated queries).
- `site_search_result_click` fires on link click with correct `position`, `result_type`, `result_slug`.

**Content QA:**
- Every live content type that uses `data-pagefind-body` (questions, glossary, topics, blog, services) returns at least one result for a representative query.
- `data-pagefind-ignore="all"` excluded regions (blog filters, pagination) don't surface as matches.

---

## §12 — Sign-off / handoff

**Author:** layout spec drafted by Claude with Gareth.
**Reviewers:** copy (for hero lede + no-results copy); engineering (for `src/lib/searchTypes.ts` extraction + `src/scripts/search-page.ts` extraction); brand (for Okay to Ask label decision in §10.1).
**Blocking questions:**
1. Confirm `/questions/` route (§10.3).
2. Confirm B10 canonical label for `anonymous_question` is `'Okay to Ask'` (§10.1) — assumption in this spec.
3. Confirm copy for hero lede + no-results suggestion list ([COPY TBD]).

**Not blocking, handoff notes:**
- `ShellHero.astro` may or may not exist yet as a shared component; if not, inline the pattern (same as B2/B3/B6/B7 do today).
- `CloseIcon` + `SearchIcon` — reuse the Lucide-style icons already in `src/components/icons/` or inline SVG if absent.
- If the team prefers not to extract `src/lib/searchTypes.ts`, duplicate the literals but mirror the values exactly; a code comment must point from each surface to the other.

**Done when:**
- Hero matches sibling specs.
- Input reads as more prominent than A4 at every breakpoint.
- Type labels and grouping match between A4 and B10.
- All tokens resolve to Tailor-layer variables.
- `noIndex` is set and canonical is `/search`.
- The ten items in §0.2 are resolved.
