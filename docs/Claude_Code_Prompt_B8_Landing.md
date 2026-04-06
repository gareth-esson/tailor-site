# Claude Code Prompt — B8 Okay to Ask Landing Page

**Target file:** `src/pages/questions/index.astro`
**Spec:** `docs/Tailor_Layout_Spec_B8.md` (v1.1)

---

## Context

The B8 landing page at `/questions/` already exists and works. This prompt upgrades it to match the layout spec. The page currently uses compact list rows for questions — it needs to switch to `QuestionCard.astro` cards in a paginated grid. Several other sections need surface/token/component fixes.

**Read these files first** (in order):

1. `docs/Tailor_Layout_Spec_B8.md` — the full spec. Follow it literally.
2. `src/pages/questions/index.astro` — the current implementation you're editing.
3. `src/components/QuestionCard.astro` — the card component you'll use.
4. `src/components/SignpostingBlock.astro` — the signposting component you'll use.
5. `src/lib/support-services.ts` — check the service key names (they're capitalised: `Childline`, `Brook`, `The Mix` — NOT kebab-case).
6. `src/lib/types.ts` — check `QuestionRef` interface.
7. `src/lib/content.ts` — check `toQuestionRef()` function.
8. `src/styles/tailor-site-v2.css` — token reference. Search for any token you're unsure about.

---

## Changes required

### 0. Fix `toQuestionRef` in `src/lib/content.ts`

The `toQuestionRef()` function currently does NOT include `okayToAskCategory`. QuestionCard needs it for the eyebrow. Add it:

```ts
function toQuestionRef(q: Question): QuestionRef {
  return {
    id: q.id,
    question: q.question,
    slug: q.slug,
    okayToAskCategory: q.okayToAskCategory,
    contentTags: q.contentTags,
  };
}
```

This is a prerequisite — without it, cards on B8 won't show category eyebrows.

### 1. Imports

Add to the frontmatter imports:

```ts
import QuestionCard from '../../components/QuestionCard.astro';
import SignpostingBlock from '../../components/SignpostingBlock.astro';
```

Keep the existing `GlossaryTooltips` import.

### 2. Question data — build QuestionRef array

The current code uses the full `Question` objects directly in the template. Convert them to `QuestionRef` objects so `QuestionCard` receives the right shape. In the frontmatter:

```ts
import type { QuestionRef } from '../../lib/types';

const allQuestions = await getQuestions();

const questions: QuestionRef[] = allQuestions
  .filter((q) => q.body.length > 0)
  .sort((a, b) => a.question.localeCompare(b.question))
  .map((q) => ({
    id: q.id,
    question: q.question,
    slug: q.slug,
    okayToAskCategory: q.okayToAskCategory,
    contentTags: q.contentTags,
  }));
```

Keep the `otaCategories` array and `otaBadgeClass` function — they're still used for the filter buttons.

### 3. Section 1 — Hero

**Current:** `<section class="ota-hero surface--ota">` with inner `max-w-4xl`.

**Change to:** Outer wrapper is a `<section>` with class `surface--ota`. Inner wrapper uses `max-w-[var(--container-max-reading-wide)]` instead of `max-w-4xl`. Add `w-full` to the outer section.

```html
<section class="surface--ota w-full py-[var(--space-global-2xl)] px-[var(--space-global-gutter)]">
  <div class="mx-auto w-full max-w-[var(--container-max-reading-wide)] text-center">
    <img src="/assets/ota-wordmark-dark.svg" alt="Okay to Ask" class="mx-auto mb-[var(--space-global-md)]" style="height: 3rem; width: auto;" width="280" height="48" />
    <h1 style="font-size: var(--text-display-size-h1); color: var(--text-ota-heading); line-height: 1.15;" class="mb-[var(--space-global-sm)]">
      Real questions from real young people. Answered honestly.
    </h1>
    <p style="font-size: var(--text-prose-size-body); color: var(--text-ota-muted); line-height: 1.6; max-width: 32rem;" class="mx-auto">
      Every question here was written anonymously by a young person. No judgement, no awkwardness — just honest answers.
    </p>
  </div>
</section>
```

You can keep the scoped CSS approach if you prefer (`.ota-hero__title` etc.), but every value must resolve to a token. No hardcoded colours, sizes, or spacing. The key change is `max-w-4xl` → `max-w-[var(--container-max-reading-wide)]`.

**Do NOT implement the post-it scatter.** The spec marks it as "defer to v2."

### 4. Section 2 — Book promotion

**Current:** Sits on `.surface--ota-alt` with `max-w-4xl`, has a border but no shadow.

**Change to:** No surface class on the outer wrapper — sits on `--bg-page` ground. The panel itself is a white card with shadow (the "book page" metaphor).

Outer wrapper: `<section class="w-full px-[var(--space-global-gutter)]">` — no surface class, no vertical padding on the section (the panel's margin handles spacing).

Inner panel: class `b8-book-panel` with these scoped styles:

```css
.b8-book-panel {
  background: var(--bg-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--space-global-xl);
  margin-top: var(--space-global-lg);
  margin-bottom: var(--space-global-lg);
}

@media (max-width: 767px) {
  .b8-book-panel {
    padding: var(--space-global-lg);
  }
}
```

Panel grid: `grid grid-cols-1 md:grid-cols-[1fr_auto] gap-[var(--space-global-lg)] items-center`

Book heading: `text-center md:text-left` — centred on mobile, left-aligned in the two-column desktop layout.

Mobile: cover image should appear first (above text). Use `order-[-1] md:order-none` on the image column.

Remove the `border` from `.ota-book__card` — the shadow replaces it.

### 5. Section 3 — Category filter + question card grid (the big change)

**Current:** Compact list rows with inline question links + badges.

**Replace with:** `QuestionCard.astro` cards in a 3-column paginated grid.

#### 5a. Section heading — centre it

```html
<h2 style="font-size: var(--text-prose-size-h2); color: var(--text-ota-heading);" class="text-center mb-[var(--space-global-md)]">
  Browse questions
</h2>
```

#### 5b. Filter bar — centre it

Add `justify-center` to the filter container:

```html
<div class="flex flex-wrap justify-center gap-[var(--space-global-xs)] mb-[var(--space-global-lg)]" role="group" aria-label="Filter by category">
```

Add `aria-pressed` to each button:

- "All" button: `aria-pressed="true"` (default active)
- Category buttons: `aria-pressed="false"`

Replace the hardcoded `gap: 0.5rem` in `.ota-filters` scoped CSS with `gap: var(--space-global-xs)`.

Update `.ota-filter.is-active` outline to use tokens:

```css
.ota-filter.is-active {
  opacity: 1;
  outline: var(--focus-ring-width) solid var(--focus-ring);
  outline-offset: var(--focus-ring-offset);
}
```

Change inactive opacity from `0.6` to `0.55` per spec.

#### 5c. Replace the question list with a card grid

Remove the entire `<ul class="ota-question-list">` block and replace with:

```html
<ul class="list-none p-0 m-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--space-global-md)]" role="list" id="question-grid">
  {questions.map((q) => (
    <li data-category={q.okayToAskCategory || ''}>
      <QuestionCard question={q} />
    </li>
  ))}
</ul>
```

#### 5d. Add pagination controls

Below the grid, above the result count:

```html
<div class="flex justify-center items-center gap-[var(--space-global-sm)] mt-[var(--space-global-lg)]" id="pagination-controls">
  <button class="btn btn--sm btn--tint" id="pagination-prev" type="button" disabled>Previous</button>
  <span id="pagination-indicator" style="font-size: var(--text-card-size-body); color: var(--text-ota-muted);">Page 1 of 1</span>
  <button class="btn btn--sm btn--tint" id="pagination-next" type="button">Next</button>
</div>

<p id="question-count" aria-live="polite" style="font-size: var(--text-card-size-body); color: var(--text-ota-muted);" class="text-center mt-[var(--space-global-sm)]">
  {questions.length} questions
</p>
```

#### 5e. Remove all `.ota-question-list*` scoped CSS

Delete these rules entirely — they're for the old compact rows:
- `.ota-question-list`
- `.ota-question-list__item`
- `.ota-question-list__item:hover`
- `.ota-question-list__link`
- `.ota-question-list__link:hover`
- `.ota-question-count`

### 6. Section 4 — "What is Okay to Ask?"

**Changes:**
- Replace `max-w-4xl` with `max-w-[var(--container-max-prose)]` (44rem — narrower prose measure).
- Centre the heading: add `text-center` class to `.ota-about__title`.
- Keep the body text left-aligned (only headings are centred).

### 7. Section 5 — Signposting

**Current:** Hardcoded `alert` HTML on `.surface--ota`.

**Replace with:** `SignpostingBlock.astro` on `--safeguarding-support-bg`.

```html
<section
  class="w-full py-[var(--space-struct-y-base)] px-[var(--space-global-gutter)]"
  style="background: var(--safeguarding-support-bg);"
  role="complementary"
  aria-label="Support services"
>
  <div class="mx-auto w-full max-w-[var(--container-max-reading-wide)]">
    <SignpostingBlock services={['Childline', 'Brook', 'The Mix']} />
  </div>
</section>
```

**IMPORTANT:** The service keys are capitalised with spaces: `'Childline'`, `'Brook'`, `'The Mix'`. NOT kebab-case. Check `src/lib/support-services.ts` to confirm.

Remove the entire old hardcoded signposting `<section>` and all its `.ota-signpost` CSS.

### 8. Token discipline — replace all hardcoded values

In the scoped `<style>` block, replace every remaining hardcoded value:

| Old value | Replace with |
|---|---|
| `gap: 0.5rem` (in `.ota-filters`) | `gap: var(--space-global-xs)` |
| `gap: 0.375rem` (in `.ota-question-list`) | DELETE — list is removed |
| `padding: 0.75rem 1rem` | DELETE — list is removed |
| `outline: 2px solid var(--brand-accent)` | `outline: var(--focus-ring-width) solid var(--focus-ring)` |
| `outline-offset: 2px` | `outline-offset: var(--focus-ring-offset)` |
| `max-w-4xl` (all instances) | `max-w-[var(--container-max-reading-wide)]` |

Also: the `.ota-landing` wrapper currently sets `background: var(--bg-ota-surface)`. This is wrong — the page ground should be `--bg-page` so the surface bands provide contrast. Change to:

```css
.ota-landing {
  background: var(--bg-page);
}
```

### 9. Rewrite the `<script>` — filter + pagination JS

Replace the entire `<script>` block. The new JS must handle both category filtering AND pagination together.

```html
<script>
  const PAGE_SIZE = 12;

  function initB8() {
    const filters = document.querySelectorAll<HTMLButtonElement>('.ota-filter');
    const grid = document.getElementById('question-grid');
    const countEl = document.getElementById('question-count');
    const prevBtn = document.getElementById('pagination-prev') as HTMLButtonElement | null;
    const nextBtn = document.getElementById('pagination-next') as HTMLButtonElement | null;
    const indicator = document.getElementById('pagination-indicator');
    const sectionHeading = document.querySelector('#questions-section h2');

    if (!grid || !countEl || !prevBtn || !nextBtn || !indicator) return;

    const allItems = Array.from(grid.querySelectorAll<HTMLLIElement>(':scope > li'));
    let filteredItems: HTMLLIElement[] = [];
    let currentPage = 1;
    let totalPages = 1;
    let activeCategory = 'all';

    function applyFilter(category: string) {
      activeCategory = category;
      filteredItems = category === 'all'
        ? [...allItems]
        : allItems.filter((li) => li.dataset.category === category);
      currentPage = 1;
      totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
      renderPage();
      countEl!.textContent = `${filteredItems.length} question${filteredItems.length !== 1 ? 's' : ''}`;
    }

    function renderPage() {
      const start = (currentPage - 1) * PAGE_SIZE;
      const end = start + PAGE_SIZE;

      // Hide all items first
      allItems.forEach((li) => { li.style.display = 'none'; });

      // Show only the current page of filtered items
      filteredItems.forEach((li, i) => {
        li.style.display = (i >= start && i < end) ? '' : 'none';
      });

      // Update pagination controls
      indicator!.textContent = `Page ${currentPage} of ${totalPages}`;

      prevBtn!.disabled = currentPage <= 1;
      prevBtn!.style.opacity = currentPage <= 1 ? '0.4' : '';
      prevBtn!.style.pointerEvents = currentPage <= 1 ? 'none' : '';

      nextBtn!.disabled = currentPage >= totalPages;
      nextBtn!.style.opacity = currentPage >= totalPages ? '0.4' : '';
      nextBtn!.style.pointerEvents = currentPage >= totalPages ? 'none' : '';

      // Hide pagination if only one page
      const paginationContainer = document.getElementById('pagination-controls');
      if (paginationContainer) {
        paginationContainer.style.display = totalPages <= 1 ? 'none' : '';
      }
    }

    // Filter button clicks
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

    // Pagination clicks
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderPage();
        sectionHeading?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    nextBtn.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderPage();
        sectionHeading?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    // Initial render
    applyFilter('all');
  }

  initB8();
  document.addEventListener('astro:after-swap', initB8);
</script>
```

### 10. Keep `id="questions-section"` on §3's `<section>`

The pagination scroll-to-top targets `#questions-section h2`. Make sure the section element retains this ID.

---

## What NOT to change

- **Do not** touch `QuestionCard.astro` — it's a shared component, already correct.
- **Do not** touch `SignpostingBlock.astro` — use it as-is.
- **Do not** implement the post-it scatter in the hero (§1). Spec says defer to v2.
- **Do not** add any new CSS tokens. Everything needed already exists in `tailor-site-v2.css`.
- **Do not** use `h-full` on the card `<li>` items. Cards size to their own content height.
- **Do not** change the `QuestionCard` tag click interception JS — it's already globally registered and will work on B8 automatically.

---

## Verification

After implementation, check:

1. Page loads with 12 cards showing, pagination reads "Page 1 of {n}".
2. Clicking a category filter shows only matching cards, resets to page 1, updates count.
3. Previous/Next buttons work, scroll to top of §3 on click.
4. Pagination hides when filtered set is ≤12.
5. "All" filter is active (with `aria-pressed="true"`) on initial load.
6. Book panel has white background + shadow (NOT a surface class), sits on `--bg-page` ground.
7. Signposting section uses `--safeguarding-support-bg` background (cool blue), renders via `SignpostingBlock` component.
8. All headings are centred except the book panel heading (left on desktop, centred on mobile).
9. No hardcoded colour, spacing, or size values remain in scoped CSS — everything is a token.
10. Page background is `--bg-page`, NOT `--bg-ota-surface`.
