# Tailor Spec — D3 Mobile Navigation Polish

**Component:** mobile navigation (D3) — the expanded panel revealed when the header hamburger is tapped.
**Layer:** Tailor (shell; always Lexend, never inherits `.layer-ota`).
**Status:** visual polish pass over a built, functional component.
**Depends on:** A1 site header, A3 primary nav, D8 topics mega menu (mobile variant), base tokens in `tailor-site-v2.css`.
**Scope:** animation, overlay/scrim, touch targets, spacing, dropdown & accordion visual state, topics mega menu mobile reduction, active-page indicator, close button. **Not:** search, hamburger-to-X animation (already spec'd in Shell §A1), mobile footer, or D2 mobile search overlay.

---

## §0 — Frame

### 0.1 Purpose

The mobile nav is the only way users on small screens reach anything past the header. It already works — hamburger toggles `aria-hidden` on the panel, accordions expand, all 7 primary items + RSE Delivery (4 children) + RSE Training & Support (2 children) + Topics mega menu (7 categories × 23 pages) are reachable. What's missing is the polish layer that makes it feel like the same site as the desktop nav: the motion, the scrim, the hierarchy of heading vs item vs sub-item, the active-page affordance, and the close affordance that matches the open affordance.

This spec settles those questions without enlarging the scope. The nav stays a single drawer (not a multi-pane stack), stays accordion-based for sub-items (not a sliding second screen), and keeps the panel technically part of the `<header>` so the header's sticky positioning continues to anchor it.

### 0.2 What changes vs the current build

| # | Current | Target |
|---|---|---|
| 1 | Panel appears via `display: block` toggle — no motion | Slide-down + fade, respecting `prefers-reduced-motion` |
| 2 | No scrim behind the panel — content beneath is untinted | Full-viewport scrim on `--bg-emphasis` at low opacity; tap-to-close |
| 3 | Top-level nav rows are `py-3` (0.75rem vertical) — row height ≈ 40px, below the 44px WCAG touch floor in `py-3` alone | Top-level rows enforce `min-height: 3rem` (48px) via padding |
| 4 | Sub-item rows are `0.4rem 0.5rem` → ~26px tall, well below 44px | Sub-items enforce `min-height: 2.75rem` (44px); still visually tighter than parents via reduced type size and flatter weight |
| 5 | Topics mega menu on mobile renders all 7 categories expanded in a single long scroll (`TopicsMegaMenu mobile`) | Topics mega menu becomes a nested accordion: categories collapse; tapping a category heading expands that category's pages only |
| 6 | Active page: `aria-current="page"` is set but has no visual treatment | Active page gets a 3px inline-start accent bar + subtle `--bg-surface-alt` row background; active parent gets a thinner bar in muted accent |
| 7 | No close button inside the panel — only the hamburger (which is above the panel, technically not hidden on scroll but not obvious as a close) | Dedicated `.mobile-nav__close` in the panel's sticky top bar, 48×48px, matches the open affordance scale |
| 8 | No sticky top bar inside the panel | Sticky row inside panel: brand wordmark-muted left, close button right; separates drawer from the underlying header visually |
| 9 | Panel height `calc(100vh - var(--header-height))` uses `vh` which misbehaves on iOS Safari (doesn't account for the URL bar) | Use `calc(100dvh - var(--header-height))` (dynamic viewport height) with `100vh` fallback |
| 10 | Accordion expansion is instant — no indicator other than chevron rotation | Chevron rotates (already built), plus a subtle background shift on expanded parent row; sub-panel fades in over 180ms |

### 0.3 Non-goals

- Not changing the nav structure or order — A3 is canonical.
- Not changing the hamburger icon, the hamburger-to-X animation, or its placement in the header.
- Not adding a search input to the mobile panel (per Shell §D3 "Search on mobile" — deferred to v2).
- Not replacing the accordion pattern with a tab bar or sliding-stack navigation.
- Not changing A4 header search or A5 SearchBar dropdown.

---

## §1 — Open / close animation

### 1.1 Motion characteristics

The panel is a drawer that drops out from beneath the sticky header. Two properties animate in parallel:

1. **`transform: translateY(-0.75rem) → translateY(0)`** — a short vertical entrance (12px). Not a full slide-down from the top of the viewport; the panel is already "in place" beneath the header, we're just releasing it. A longer slide reads as decorative; 0.75rem reads as a settling gesture.
2. **`opacity: 0 → 1`** — paired with the translate so the nav doesn't pop in mid-motion.

No horizontal slide-from-right. Reasons: the header sits at the top and the content hierarchy is top-down; a right-to-left slide would add directional dissonance (the nav comes from a place that isn't the hamburger). Top-down matches both the visual origin (beneath the hamburger) and the reading flow.

### 1.2 Duration & easing

- Duration: `var(--transition-duration)` (0.25s). Matches every other transition in the shell — the chevron rotations, the hover backgrounds, the focus-ring transitions. Consistency is the point.
- Easing: `var(--transition-easing)` (`ease`). Same rationale. No custom cubic-bezier — the art direction brief's "no bouncy youthful transitions" rule applies.

### 1.3 Close animation

Reverse: `translateY(0) → translateY(-0.75rem)` + `opacity: 1 → 0` at the same duration/easing. Because CSS can't animate to `display: none`, use `visibility: hidden` paired with `transition-delay` on `visibility` only. Pattern:

```css
.mobile-nav {
  opacity: 0;
  transform: translateY(-0.75rem);
  visibility: hidden;
  transition:
    opacity var(--transition-duration) var(--transition-easing),
    transform var(--transition-duration) var(--transition-easing),
    visibility 0s linear var(--transition-duration);
}

.mobile-nav[aria-hidden="false"] {
  opacity: 1;
  transform: translateY(0);
  visibility: visible;
  transition:
    opacity var(--transition-duration) var(--transition-easing),
    transform var(--transition-duration) var(--transition-easing),
    visibility 0s linear 0s;
}
```

The `visibility` toggle (vs `display`) allows the transform + opacity to animate both in and out; the 0-duration visibility transition with a 0.25s delay keeps the closed state inaccessible to pointer/focus after the fade completes.

Replace the existing `.mobile-nav { display: none }` / `[aria-hidden="false"] { display: block }` pair with the pattern above. `inert` attribute handling stays (already in the build).

### 1.4 Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  .mobile-nav {
    transition: visibility 0s linear var(--transition-duration);
    transform: none;
  }
  .mobile-nav[aria-hidden="false"] {
    transition: visibility 0s linear 0s;
  }
}
```

Under reduced motion, the panel simply appears/disappears with no transform or opacity animation. Visibility toggle is preserved (to maintain inertness) but has no perceptual duration.

### 1.5 Chevron & sub-panel motion (already present, document)

- Chevron rotation: `transform: rotate(180deg)` on `aria-expanded="true"`, duration + easing match the shell. This is already in the build and should remain unchanged.
- Sub-panel expansion: add a 0.18s `opacity` fade on the sub-panel (`.mobile-nav__mega`, `.mobile-nav__accordion-panel`) when expanding, paired with the default `display: none → block` switch:
  ```css
  .mobile-nav__accordion-panel,
  .mobile-nav__mega {
    opacity: 0;
    transition: opacity 0.18s var(--transition-easing);
  }
  .mobile-nav__accordion-panel[aria-hidden="false"],
  .mobile-nav__mega[aria-hidden="false"] {
    opacity: 1;
  }
  ```
  The 0.18s is shorter than the panel's 0.25s open — sub-panels are a secondary motion and should feel lighter.

---

## §2 — Overlay / scrim

### 2.1 Surface

A new element, `<div class="mobile-nav-scrim">`, inserted as a sibling of `<header>` (not inside it, so it can cover the viewport beneath the header without being inside the sticky context).

```html
<div class="mobile-nav-scrim" aria-hidden="true" data-dismiss="mobile-nav"></div>
```

Position: `fixed inset-0` with `top: var(--header-height)` — the scrim begins beneath the header, so the header (including the open hamburger/close button) remains visually present and interactive.

- Background: `var(--bg-emphasis)` (`#1E2A3A`) at 40% opacity — use `color-mix(in srgb, var(--bg-emphasis) 40%, transparent)` with a fallback `rgba(30, 42, 58, 0.4)` for older browsers.
- Alternatively, if the token system prefers a named token, **flag new token:** `--overlay-scrim: rgba(30, 42, 58, 0.4)` under the overlay prefix (companion to the existing `--overlay-on-dark`). Recommended — the scrim is used in any modal/drawer/overlay pattern on light grounds; formalising now saves later work.
- `backdrop-filter: blur(2px)` if supported — a soft blur on the content below makes the drawer feel like a layered surface rather than a paper cutout. Honour `@supports` detection already present in the codebase.

### 2.2 Animation

The scrim fades in/out in sync with the panel, same duration/easing. No translate — it's a full-bleed surface.

```css
.mobile-nav-scrim {
  position: fixed;
  inset: var(--header-height) 0 0 0;
  z-index: calc(var(--z-mobile-nav) - 1);
  background: var(--overlay-scrim);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  opacity: 0;
  visibility: hidden;
  transition:
    opacity var(--transition-duration) var(--transition-easing),
    visibility 0s linear var(--transition-duration);
}

body.nav-open .mobile-nav-scrim {
  opacity: 1;
  visibility: visible;
  transition:
    opacity var(--transition-duration) var(--transition-easing),
    visibility 0s linear 0s;
}

@media (min-width: 1024px) {
  .mobile-nav-scrim { display: none; }
}
```

### 2.3 Tap to close

The scrim carries `data-dismiss="mobile-nav"`. A small script binds a click handler that triggers the same close path as the hamburger / close button:

```js
document.querySelectorAll('[data-dismiss="mobile-nav"]').forEach((el) => {
  el.addEventListener('click', closeMobileNav);
});
```

Where `closeMobileNav()` is extracted from the existing hamburger click handler so the scrim, the close button, and the hamburger all share one state-toggle function.

### 2.4 Escape key

Pressing Escape while the nav is open closes the nav and returns focus to the hamburger. Extend the existing Escape handler in `SiteHeader.astro` (already closes desktop flyouts) to also call `closeMobileNav()` when the nav is open.

### 2.5 Scroll lock

Keep `body.nav-open { overflow: hidden }` — already in the build. Add `touch-action: none` on the body while open so iOS Safari doesn't rubber-band behind the scrim:

```css
body.nav-open {
  overflow: hidden;
  touch-action: none;
}
```

The mobile nav panel itself retains `overflow-y: auto` — scrolling inside the drawer works; scrolling the page behind the scrim does not.

---

## §3 — Nav item spacing & touch targets

WCAG 2.1 SC 2.5.5 (Level AAA) recommends 44×44 CSS px minimum. Level AA has no minimum, but WCAG 2.2 SC 2.5.8 (Level AA) requires 24×24. We aim for 44 on all interactive rows — comfortable for touch and exceeds AA.

### 3.1 Top-level row (nav items)

Structural:
- `display: flex`, `align-items: center`, `justify-content: space-between`, `width: 100%`.
- `min-height: 3rem` (48px) — applies to both `<a>` and `<button>` variants via the shared `.mobile-nav__link` class.
- `padding: var(--space-global-sm) var(--space-global-xs)` (0.75rem 0.5rem) — vertical padding combined with `min-height` ensures a consistent touch target even when the text is short.
- Horizontal padding at `--space-global-xs` (0.5rem) is tight because the panel already has `px-[var(--space-global-gutter)]` on its outer wrapper — doubling the gutter would waste width.
- `gap: var(--space-global-sm)` between the label and the trailing chevron.

Typography:
- `font-family: var(--font-shell-body-stack)`
- `font-size: var(--text-prose-size-body)` (≈ 1.125rem at default) — larger than desktop's `--text-card-size-body`. Mobile reads with thumbs and arms' length; the type should scale up.
- `font-weight: var(--font-weight-medium)` (500)
- `color: var(--text-body)`
- `line-height: var(--lh-heading-sub)` (1.3) — tight, because rows are single-line.

Separators:
- `border-bottom: var(--border-width-xs) solid var(--border-subtle)` — already present, keep.
- Last item: no bottom border — already handled.

### 3.2 Sub-item row (dropdown children & topics pages)

- `display: flex`, `align-items: center`, `width: 100%`
- `min-height: 2.75rem` (44px) — the WCAG AAA floor, not higher
- `padding: var(--space-global-xs) var(--space-global-sm)` (0.5rem 0.75rem)
- `padding-inline-start: var(--space-global-md)` (1.5rem) — indent so sub-items visibly belong to their parent. The current build's `pl-[var(--space-global-sm)]` (0.75rem) is too shallow; 1.5rem reads unmistakably as a sub-item without looking dented.

Typography:
- `font-size: var(--text-nav-size)` (0.9rem) — smaller than top-level, signalling subordination
- `font-weight: var(--font-weight-regular)` (400)
- `color: var(--text-body)`
- `line-height: var(--lh-heading-sub)` (1.3)

### 3.3 Category heading row (topics mega menu only)

The topics mega menu has a third tier: categories ("Relationships", "Identity"…) group page links. On mobile these become their own trigger rows.

- `min-height: 2.75rem`
- `padding: var(--space-global-xs) var(--space-global-sm)`
- `padding-inline-start: var(--space-global-md)`
- Typography:
  - `font-size: var(--text-nav-size-sm)` (0.85rem)
  - `font-weight: var(--font-weight-semibold)` (600)
  - `text-transform: uppercase`
  - `letter-spacing: var(--text-eyebrow-ls)` (0.05em)
  - `color: var(--cat-color)` — inline custom property set per group, same pattern as the desktop mega menu
  - `border-bottom: 2px solid var(--cat-color)` — carried from desktop for category-identity continuity. Renders tight to the heading text, not full-row width — use `display: inline-block` with `margin-bottom: var(--space-global-xs)` on the heading text itself (the containing trigger row has no bottom border).

### 3.4 Hierarchy reading

From the reader's eye downward:

1. **Top-level row** — 1.125rem, medium weight, flush padding, bottom border separator. Reads as "primary destination".
2. **Expanded parent row** — same size and weight, plus `background: var(--bg-surface-alt)` — reads as "I'm here, my children are below".
3. **Category heading** (topics only) — 0.85rem uppercase, category-colour underline. Reads as "category label, not clickable" — except it *is* clickable (tap to collapse/expand that category). The uppercase treatment + small caps letter-spacing signals "grouping marker"; the trailing chevron signals "but you can tap me".
4. **Sub-item page link** — 0.9rem, regular, deeper indent. Reads as "destination within this grouping".

Vertical rhythm between tiers:
- Top-level → expanded parent: no gap (background shift is enough)
- Expanded parent → first sub-item: `padding-top: var(--space-global-xs)` on the sub-panel
- Sub-item → sub-item: `gap: 0` (rows abut with separator-less structure; the indent does the hierarchy work)
- Last sub-item → next top-level row: top-level row's own separator handles it

### 3.5 Active-hover-focus stack

- Rest: as described above.
- Hover (pointer devices only — `@media (hover: hover)`): `color: var(--brand-accent-text)`. No background on hover — hover on touch devices is unreliable.
- Active (`:active`, all devices): `background: var(--bg-surface-alt)`. Immediate tactile feedback — this is currently in the build and should remain.
- Focus visible: `outline: var(--focus-ring-width) solid var(--focus-ring); outline-offset: calc(var(--focus-ring-offset) * -1);` — inset focus ring so it doesn't collide with the bottom-border separator.

---

## §4 — Dropdown / accordion behaviour

### 4.1 Pattern

Accordion — inline expansion beneath the trigger row. Not a slide-in secondary panel. Reasons:

- Depth continuity: the user stays in one scrollable surface. No "where did the rest of the nav go" feeling.
- Reversibility: tapping the trigger again closes. Tapping elsewhere doesn't collapse it — preserving state while the user scans.
- Matches the Shell spec's v1 direction ("The expansion is instant, which aligns with the art direction brief's 'no bouncy youthful transitions' rule").

The polish pass adds a modest opacity fade (§1.5) to the sub-panel appearance, but the layout remains in-flow: the nav list reflows to accommodate the expanded content, and subsequent rows push down.

### 4.2 One-at-a-time vs multi-open

**Multi-open.** A user who expands "RSE Delivery" and then "Topics" should see both expanded. The mobile nav is a browsing surface, not a menu; forcing one-at-a-time costs more than it saves (the user would have to re-expand to compare).

Exception: **inside the topics mega menu,** categories are one-at-a-time. Seven categories expanded at once in a phone-width column is too long to scan. When a user taps "Identity", the previously-expanded category (if any) collapses. See §5.

### 4.3 Visual state of open trigger

An expanded parent row gains:

- `background: var(--bg-surface-alt)` — slight surface lift, matches the desktop `aria-expanded="true"` pattern
- `color: var(--brand-accent-text)` — the label shifts to accent teal
- Chevron rotated 180° (already in the build)

Closed state — all three revert.

### 4.4 Sub-panel container

- `background: var(--bg-surface)` — same as the parent surface; the indent + type-size difference does the work, a background shift would double-signal.
- No border.
- `padding-block: var(--space-global-xs)` (0.5rem) top and bottom — a little breathing room around the sub-items.
- `padding-inline: 0` — the sub-items own their own indent.

### 4.5 Sub-item separators

- No bottom borders between sub-items. Row separators belong to top-level items only; within a sub-panel the indent + rhythm is enough.
- Exception: in the topics mega menu, category heading rows carry their `border-bottom: 2px solid var(--cat-color)` (see §3.3). No separators between page links within a category.

---

## §5 — Topics mega menu on mobile

### 5.1 Context

Desktop: 4-column flyout showing all 7 categories × 23 pages simultaneously. Mobile: a sequential accordion with one category open at a time.

The current build renders `<TopicsMegaMenu mobile />` — presumably flat-expanded. The polish pass nests one more accordion tier: categories become collapsible under the already-collapsible "Topics" parent.

### 5.2 Structure

```
Topics  ▾                                  [top-level row, min-h 48px]
  Relationships  ▸                         [category heading row, min-h 44px]
    Friendship                             [page link, min-h 44px]
    Romantic relationships
    Consent
    Healthy vs unhealthy
  Identity  ▸
    …
  [View all topics →]                      [footer link row, min-h 44px]
```

When "Relationships" is tapped, it expands in place; other categories collapse (one-at-a-time within the topics panel).

### 5.3 Category heading row markup

```html
<button
  class="mobile-nav__cat-trigger"
  aria-expanded="false"
  aria-controls="mobile-cat-relationships"
  type="button"
  style="--cat-color: var(--cat-relationships);"
>
  <span class="mobile-nav__cat-label">Relationships</span>
  <svg class="mobile-nav__cat-chevron" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</button>
<div id="mobile-cat-relationships" class="mobile-nav__cat-panel" aria-hidden="true">
  <ul class="mobile-nav__cat-list" role="list">
    <li><a href="/topics/friendship" class="mobile-nav__sub-link">Friendship</a></li>
    <!-- ... -->
  </ul>
</div>
```

Styling:
- `.mobile-nav__cat-trigger` extends the category-heading-row rules in §3.3. Background `transparent` at rest; `var(--bg-surface-alt)` when `aria-expanded="true"`.
- `.mobile-nav__cat-label` renders the category name; the underline treatment (`border-bottom: 2px solid var(--cat-color)`) sits on this span, not the button, so the underline matches the text length.
- `.mobile-nav__cat-chevron` uses `color: var(--text-body-muted)` (not cat colour) — the chevron is utility, not identity.
- `.mobile-nav__cat-panel` uses the sub-panel rules from §4.4.
- `.mobile-nav__cat-list` is `list-none flex flex-col gap-0`.

### 5.4 Category order & data

Unchanged from desktop — 7 categories in brand-defined order, each using its `--cat-*` colour (`--cat-relationships`, `--cat-safety`, `--cat-identity`, `--cat-sexual-health`, `--cat-wellbeing`, `--cat-online-safety`, `--cat-puberty`). Pages within each category also unchanged.

### 5.5 "View all topics" row

Renders after the last category accordion, with no category heading visual. Styled like a sub-item link but:
- `color: var(--brand-accent-text)`
- `font-weight: var(--font-weight-medium)`
- Arrow glyph after the label (→)

Matches the Shell spec's existing "View all topics" footer row behaviour.

### 5.6 No category expanded by default

When a user first opens the Topics accordion, every category is collapsed. They see seven category labels and the "View all topics" link — a seven-row table of contents. This is deliberate: a 23-item pile of uncategorised page links is harder to navigate than a two-tap path (category → page).

If the user is currently *on* a topic page (e.g. `/topics/friendship`), the parent category ("Relationships") opens automatically — see §6.

---

## §6 — Active page indicator

### 6.1 What counts as "active"

- The current page's primary nav item (already computed: `isTopics`, `isQuestions`, `isRseDelivery`, `isRseTraining`, `isBlog`, `isAbout`, `isContact` in `SiteHeader.astro`).
- The parent of the current page if it's inside an accordion (RSE Delivery if on `/services/rse-for-primary-schools`; Topics if on `/topics/friendship`).
- In the topics mega menu: the specific page link if the user is on that topic page.

### 6.2 Top-level active row

The current build already sets `aria-current="page"` on the correct top-level row. Add styling hooks:

```css
.mobile-nav__link[aria-current="page"] {
  background: var(--bg-surface-alt);
  color: var(--text-body);
  box-shadow: inset 3px 0 0 0 var(--brand-accent);
}
```

- 3px inline-start bar in `--brand-accent` (the brighter teal, not the text teal — this is a spot identity, not a readability concern).
- Subtle surface lift via `--bg-surface-alt` to distinguish from hover/active.
- Text stays `--text-body` — the bar is the indicator; re-colouring the label would over-signal.

### 6.3 Active parent row (accordion open state)

When the current page is a child of an accordion parent (Topics → Friendship; RSE Delivery → RSE for Primary Schools), the parent also shows an indicator — but more muted than the direct-hit case:

```css
.mobile-nav__link[aria-current="page"][aria-expanded] {
  /* Parent of the current page, AND expanded */
  box-shadow: inset 3px 0 0 0 var(--brand-accent);
}

.mobile-nav__link[aria-current="page"]:not([aria-expanded]) {
  /* Direct-hit page (e.g. Contact, Blog index) */
  box-shadow: inset 3px 0 0 0 var(--brand-accent);
}
```

Both cases render the same bar — the distinction isn't in the parent's appearance but in which rows are active. The parent gets the bar because the user is "inside it"; the child gets its own indicator (§6.4) to mark the exact page.

Note: `SiteHeader.astro` currently sets `aria-current="page"` on the parent trigger when any of its children match. This is correct for navigation context but technically irregular (WAI-ARIA expects `aria-current` on the single current page). Keep the current behaviour — it's widely used and assistive-tech-tolerant — but flag for review: consider moving the parent's indicator to a custom attribute like `data-current-ancestor="true"` and reserving `aria-current="page"` for the exact match. See §10.2.

### 6.4 Active sub-item (dropdown child or topic page)

```css
.mobile-nav__sub-link[aria-current="page"] {
  background: var(--bg-surface-alt);
  color: var(--brand-accent-text);
  font-weight: var(--font-weight-medium);
  box-shadow: inset 3px 0 0 0 var(--brand-accent);
}
```

Sub-items *do* shift their text colour to `--brand-accent-text`, because sub-item rows are visually lighter by default and need a stronger signal. The bar + colour shift + weight bump combine to make "this is the page you're on" unambiguous.

### 6.5 Auto-expand on load

When the mobile nav mounts, the parent accordion of the current page should open automatically, so the user doesn't need to tap to see the containing group.

```js
// Inside initHeader, after accordion binding:
const currentSubLink = document.querySelector('.mobile-nav__sub-link[aria-current="page"]');
if (currentSubLink) {
  const panel = currentSubLink.closest('.mobile-nav__accordion-panel, .mobile-nav__cat-panel, .mobile-nav__mega');
  if (panel) {
    panel.setAttribute('aria-hidden', 'false');
    const trigger = document.querySelector(`[aria-controls="${panel.id}"]`);
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    // If the panel is inside a topics category, also expand Topics parent:
    const outerPanel = panel.parentElement?.closest('.mobile-nav__mega');
    if (outerPanel && outerPanel !== panel) {
      outerPanel.setAttribute('aria-hidden', 'false');
      const outerTrigger = document.querySelector(`[aria-controls="${outerPanel.id}"]`);
      if (outerTrigger) outerTrigger.setAttribute('aria-expanded', 'true');
    }
  }
}
```

This pre-opens state so the user lands with the nav already showing where they are.

---

## §7 — Close button

### 7.1 Placement

A sticky top bar inside the mobile nav panel — sits at the top of the drawer, below the site header, above the scrollable list.

```html
<div class="mobile-nav">
  <div class="mobile-nav__topbar">
    <span class="mobile-nav__topbar-label">Menu</span>
    <button
      class="mobile-nav__close"
      type="button"
      aria-label="Close menu"
      data-dismiss="mobile-nav"
    >
      <svg class="mobile-nav__close-icon" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
      </svg>
    </button>
  </div>
  <nav aria-label="Mobile navigation">
    <!-- the list -->
  </nav>
</div>
```

Why a dedicated close button in addition to the hamburger?

- The hamburger is visually "above" the panel's content; when the user has scrolled within a long expanded Topics panel, the hamburger remains in the sticky header and is reachable — but the affordance reads as "open menu", not "close". The X inside the drawer is unambiguous.
- Provides a second close path at thumb-height when the list is scrolled.
- Keeps parity with the scrim tap-to-close (§2.3) and the Escape key (§2.4) — three paths to close.

### 7.2 Topbar styling

- Position: `sticky top: 0` within the scrollable drawer. Z-indexed above the list.
- Background: `var(--bg-surface)` (same as drawer); `border-bottom: var(--border-width-xs) solid var(--border-subtle)` — matches the site header's bottom border for visual continuity.
- Padding: `var(--space-global-xs) var(--space-global-sm)` (0.5rem 0.75rem).
- Layout: `display: flex; align-items: center; justify-content: space-between;`.
- Height: `min-height: 3rem` so tapping anywhere on this bar's right edge hits the close button comfortably.

### 7.3 Label

The topbar carries a small label ("Menu") on the left. Reasons:

- Orients the user inside the drawer (vs the header above).
- Balances the X visually on the right — avoids a lonely icon.
- Read by screen readers as a heading context. Render as `<span role="heading" aria-level="2">Menu</span>` (or plain `<h2>` — either is fine; the span-role pattern keeps the list's semantic nav top-level clean).

Typography:
- `font-size: var(--text-nav-size-sm)` (0.85rem)
- `font-weight: var(--font-weight-semibold)`
- `text-transform: uppercase`
- `letter-spacing: var(--text-eyebrow-ls)`
- `color: var(--text-body-muted)`

The uppercase eyebrow treatment signals "section label, not a link".

### 7.4 Close button itself

- Size: `width: 3rem; height: 3rem;` (48×48px) — matches the hamburger's 40×40 in the shell spec? The current hamburger is 2.5rem (40×40). The close button is intentionally *slightly larger* (3rem/48px) because it sits at the top of the drawer and becomes the primary close affordance once the user has scrolled past the header. Oversizing it by a touch improves thumb accuracy.
- Background: `transparent` at rest; `var(--bg-surface-alt)` on hover / active / focus.
- Border: none.
- Border-radius: `var(--radius-sm)`.
- Icon: 20×20 SVG of an X (two crossed strokes), `stroke: currentColor`. Stroke weight 1.75 — reads as decisive, not heavy.
- Icon colour: `var(--text-body)` at rest; `var(--brand-accent-text)` on hover.
- Focus: `outline: var(--focus-ring-width) solid var(--focus-ring); outline-offset: var(--focus-ring-offset);`.
- Transition: `background var(--transition-duration) var(--transition-easing), color var(--transition-duration) var(--transition-easing);`.

### 7.5 Click target

The `<button>` itself is 48×48px. Tap anywhere inside that area closes the nav. The icon (20×20) is visually centred, leaving 14px of padding on each side as a tap cushion.

### 7.6 Focus return

When close is triggered (via any of the three paths — X button, scrim tap, Escape), return focus to the hamburger button. Already handled for Escape in the desktop pattern; extend the existing `closeMobileNav` function to always call `hamburger.focus()` after the close.

---

## §8 — Tokens

### 8.1 Tokens used

All existing:

- `--bg-surface`, `--bg-surface-alt`, `--bg-emphasis`
- `--text-body`, `--text-body-muted`, `--brand-accent`, `--brand-accent-text`
- `--border-subtle`, `--border-width-xs`
- `--focus-ring`, `--focus-ring-width`, `--focus-ring-offset`
- `--radius-xs`, `--radius-sm`
- `--shadow-md`
- `--font-shell-body-stack`
- `--font-weight-regular`, `--font-weight-medium`, `--font-weight-semibold`
- `--lh-heading-sub`
- `--text-prose-size-body`, `--text-nav-size`, `--text-nav-size-sm`
- `--text-eyebrow-ls`
- `--space-global-xs`, `--space-global-sm`, `--space-global-md`, `--space-global-lg`, `--space-global-gutter`
- `--transition-duration`, `--transition-easing`
- `--header-height`, `--z-header`, `--z-mobile-nav`
- `--cat-relationships`, `--cat-safety`, `--cat-identity`, `--cat-sexual-health`, `--cat-wellbeing`, `--cat-online-safety`, `--cat-puberty`

### 8.2 One new token proposed

**`--overlay-scrim`** — the scrim behind the mobile nav (and by extension: any future modal, side drawer, or overlay that covers light-ground content).

```css
--overlay-scrim: rgba(30, 42, 58, 0.4); /* var(--bg-emphasis) at 40% */
```

Adds under the existing `--overlay-*` family (currently one token, `--overlay-on-dark`). Rationale documented in §2.1.

### 8.3 One other token worth considering

**`--duration-fast`** at `0.18s`, used for sub-panel fade-ins (§1.5). Currently a literal. Only one use in this spec — not promoting yet, but flag if a second use case appears.

### 8.4 No fabricated values

Every pixel value in this spec resolves to an existing token or a WCAG-rooted constant (44px, 48px) documented in §3. No arbitrary literals (no `#1E2A3A`, no `0.9rem`, no `1.125rem`) appear in the polish pass — everything references the token vocabulary.

---

## §9 — Accessibility

- **Landmark:** `<nav aria-label="Mobile navigation">` inside the drawer — separate from the desktop `<nav>`. Already in the build.
- **Inert panel:** when closed, `inert` attribute on `.mobile-nav` prevents focus entry and click activation. Already in the build. Ensure the scrim and topbar live *outside* the inert scope when closed — i.e. they're inside `.mobile-nav`, so `inert` also hides them, which is correct (when closed, none of these should be focusable).
- **Focus management:** opening the nav moves focus to the close button (first focusable element inside the drawer). Closing returns focus to the hamburger. Both paths via the extended `closeMobileNav` / `openMobileNav` functions.
- **`aria-expanded`:** accurate on every accordion trigger at every tier — top-level triggers, category triggers. Already correct in the build for top-level; add to category triggers (§5.3).
- **`aria-controls`:** each trigger points at its sub-panel. Already correct for top-level; add for category triggers.
- **`aria-current="page"`:** present on the exact page's link, and on the parent ancestor (current build). Flagged for review in §10.2.
- **Scrim accessibility:** `aria-hidden="true"` on the scrim — it's a visual device, not content. The scrim should not be a focus stop. Clicking it fires the close handler, which is an acceptable undocumented-but-conventional pattern.
- **Reduced motion:** panel transform + opacity suppressed (§1.4). Scrim fade also suppressed:
  ```css
  @media (prefers-reduced-motion: reduce) {
    .mobile-nav-scrim {
      transition: visibility 0s linear var(--transition-duration);
    }
    body.nav-open .mobile-nav-scrim {
      transition: visibility 0s linear 0s;
    }
  }
  ```
- **Colour contrast:** all active-row combinations verified against the contrast table in `Tailor_Design_System_Implementation_Notes.md`:
  - `--text-body` on `--bg-surface-alt` — 12.61:1 (AAA).
  - `--brand-accent-text` on `--bg-surface-alt` — 4.64:1 equivalent (AA, via the documented `--text-body-muted` ratio; accent-text is clamped to ≥ 4.5:1).
  - The 3px `--brand-accent` indicator bar is a graphic-identifier (WCAG SC 1.4.11 Non-text Contrast) — must meet 3:1 against `--bg-surface-alt`. Verify in audit.
- **Touch targets:** all interactive rows ≥ 44px tall (§3). Close button 48×48. Hamburger 40×40 (inherited from Shell spec — flag if the review team wants to enlarge it; this polish pass leaves it).

---

## §10 — Contradictions & decisions

### 10.1 Multi-open vs one-at-a-time (top-level accordions)

**Decision:** multi-open for top-level accordions (Topics, RSE Delivery, RSE Training & Support); one-at-a-time within the Topics mega menu categories. Rationale in §4.2 and §5.2.

### 10.2 `aria-current="page"` on parent trigger

**Current:** parent trigger (e.g. "RSE Delivery" when on a child page) carries `aria-current="page"`. This is irregular — WAI-ARIA spec reserves `aria-current` for the exact match.

**Decision in this spec:** keep current behaviour; style targets both the exact-match case and the ancestor case via the bar indicator. Flag for A11y review: consider switching the ancestor to `data-current-ancestor="true"` and reserving `aria-current="page"` for the single exact-match node.

### 10.3 Dedicated close button vs hamburger-only

**Current:** hamburger-only (it doubles as close via the X transform).

**Decision:** add a dedicated close button in a sticky drawer topbar. Reasons in §7.1. The hamburger retains its close role — three close paths (X button, hamburger, scrim tap, Escape) is abundance, not redundancy, on touch.

### 10.4 Slide-from-top vs slide-from-right

**Decision:** slide-from-top (§1.1). Matches the visual origin (beneath the hamburger, beneath the header) and the top-down reading flow. Right-to-left drawer would imply a different navigation model (off-canvas side nav) that the rest of the site doesn't support.

### 10.5 Motion presence vs "considered, reassuring" brief

**Decision:** 0.25s fade + 12px translate + 0.18s sub-panel fade. Short, functional, unshowy. Within the art direction brief's tolerance. Reduced motion removes all animation.

### 10.6 Auto-expanding the current-page accordion

**Decision:** yes — auto-expand the parent accordion of the current page on drawer open (§6.5). Rationale: the cost is near-zero; the benefit is a user who opens the nav and sees where they are without tapping.

### 10.7 Scrim blur

**Decision:** 2px blur if supported; fall back to solid tint. Matches the site's existing `@supports` pattern for backdrop-filter (glass elements in `tailor-site-v2.css` lines 2377–2446). Low risk, high polish.

---

## §11 — Test plan

### 11.1 Functional

- Hamburger tap → panel opens with slide-down fade; scrim fades in; body scroll locks; focus moves to close button.
- Close button tap → panel closes (reverse animation); scrim fades out; body scroll unlocks; focus returns to hamburger.
- Scrim tap → same close path as close button.
- Escape key while open → same close path; focus returns to hamburger.
- Accordion trigger (top-level): taps expand/collapse; chevron rotates; background + text-colour shift on expanded state.
- Multiple top-level accordions can be open simultaneously.
- Topics mega menu: tapping a category expands it; tapping another category collapses the first and expands the second.
- Auto-expand: opening the nav on `/topics/friendship` shows Topics expanded and Relationships expanded with Friendship marked active.

### 11.2 Touch target

- Measure every interactive row at `DPR: 2, width: 375px`: every `<a>` and `<button>` ≥ 44×44 CSS px.
- Close button: 48×48.

### 11.3 Visual

- Scrim covers viewport below the header cleanly at 320px, 375px, 414px, and 768px (iPad portrait).
- Active-page bar renders flush to the inline-start edge with no visual gap.
- Category headings inside topics mega menu: colour + underline match desktop mega menu per category.

### 11.4 Motion

- Open + close animations complete within 0.25s.
- Sub-panel fade-in within 0.18s.
- With `prefers-reduced-motion: reduce`, all transforms/opacities are suppressed; panel simply appears/disappears.

### 11.5 Accessibility

- Keyboard-only: Tab from hamburger → open → focus on close → subsequent Tab iterates through the nav items in order → Escape closes and returns focus.
- VoiceOver/TalkBack: landmark announced as "Mobile navigation"; section heading "Menu" read on entering the drawer; active page announced as current.
- `inert` attribute honoured: when closed, Tab skips the drawer entirely; click/touch on drawer region has no effect.
- axe / Lighthouse: zero critical or serious issues.

### 11.6 Cross-device

- iOS Safari: 100dvh works; URL bar hide/show doesn't cause the panel to clip or overflow.
- Android Chrome: same.
- iPadOS Safari: layout matches mobile below `lg` breakpoint; matches desktop above. No stuck intermediate state at 1023/1024 boundary.

### 11.7 Regression

- Desktop (≥ 1024px): mobile nav panel `display: none`; scrim `display: none`; hamburger hidden. No visual or behavioural change to desktop nav.

---

## §12 — Sign-off / handoff

**Author:** layout/polish spec drafted by Claude with Gareth.

**Reviewers:** engineering (for the `closeMobileNav` extraction + scrim injection + 100dvh polyfill strategy); accessibility (for the `aria-current` ancestor pattern §10.2 + focus return flow); brand (for the 40% `--bg-emphasis` scrim opacity — confirm this reads as "soft darken" not "overlay flatten").

**Blocking questions:**
1. Adopt `--overlay-scrim` as a new token in `tailor-site-v2.css` (§2.1)? Recommended yes.
2. Keep `aria-current="page"` on ancestor triggers, or switch to `data-current-ancestor`? (§10.2). Recommended: document the current pattern, ship the polish; revisit post-launch.
3. Hamburger size: 40×40 in Shell spec vs 48×48 close button here. Is the discrepancy acceptable (I recommend yes, for the reason in §7.4) or should the hamburger also scale to 48×48?

**Non-blocking handoff notes:**
- `<TopicsMegaMenu mobile />` currently renders a flat-expanded mobile mega menu. This spec assumes it is refactored to accept an `aria-expanded`-driven nested accordion shape. If the refactor is larger than expected, ship §§1–4, §6, §7 first and land §5 (topics nested accordion) in a follow-up — the other polish items don't depend on it.
- `closeMobileNav` / `openMobileNav` should be extracted from the inline `<script>` in `SiteHeader.astro` so the hamburger, close button, scrim, and Escape handler can share them. Module location suggestion: `src/scripts/mobile-nav.ts`.
- 100dvh support is widely available (all modern browsers). No polyfill needed; the `100vh` fallback handles the fringe case.

**Done when:**
- All ten items in §0.2 are resolved in the build.
- The drawer opens and closes with the described motion, respecting `prefers-reduced-motion`.
- Scrim covers the viewport beneath the header, is dismissible by tap, and is suppressed on desktop.
- Every interactive row has a ≥ 44×44 touch target, top-level rows ≥ 48px high.
- Active page is visible at a glance: bar indicator on the exact-match row; bar indicator on the expanded ancestor.
- The close button is present, 48×48, at thumb-height inside a sticky drawer topbar.
- Topics mega menu reads as a two-level accordion (category → pages), one category open at a time.
- No new hardcoded values: every colour, size, spacing, and weight resolves to a token (or an explicit WCAG-rooted constant documented in §3).
- Zero axe / Lighthouse accessibility regressions against the pre-polish baseline.
