# Stage 3 — Core templates (C1 + C2)

*Briefing document for Claude Code. Read this first, then read the referenced files.*

---

## What you're building

The two most complex and highest-value page templates: question pages (C1) and glossary pages (C2). These are the core Okay to Ask content pages. They include Simple Mode toggle, glossary tooltip matching, signposting blocks, crisis support components, age flag interstitials, and related content cards.

## What already exists

- Stage 1: Astro project, Notion pipeline, route structure, typed content collections
- Stage 2: Design system integrated, font loading, base layout with layer scoping, surface classes

Read the existing codebase before making changes.

## Files to read for this stage

```
docs/Tailor_Content_Site_Build_Spec_v1.md        — sections 3.1, 3.2, 5, and 6
docs/Tailor_Page_Content_Spec_v1.md               — sections C1 and C2
docs/Tailor_Design_System_Implementation_Notes.md  — layer scoping, component reference, critical rules
```

The Build Spec defines the template logic and data rules. The Page Content Spec defines what goes on each page and in what order. The Implementation Notes tell you which CSS classes to use.

## Question page template [C1] (`/anonymous_question/{slug}`)

Build this template in order of content hierarchy (matching the page content spec):

1. **Crisis support component [A9]** — conditional. Only renders if the question's primary topic is in Safety & Safeguarding category, or if content sensitivity tags trigger it. Uses `.alert--crisis` class. Not dismissable. Shows the most relevant crisis service. Positioned above everything else.

2. **Age flag interstitial [D1]** — conditional. Only renders if Age Tier = "Age-flagged Year 9+". Uses `.alert--ageflag` class. Shows topic label, Year 9+ note, link to foundational content, "Continue to answer" button. Not a hard gate — the answer is always in the HTML.

3. **Post-it image** — the scanned post-it images are in `images/post-it-scans/`. A mapping file at `images/post-it-scans/image-map.json` maps question slugs to filenames (`{"slug": "original-filename.jpg"}`). Look up the question's slug in the map to find its image. If no match exists, render without an image. Copy matched images to `public/images/post-it-scans/` at build time (or configure Astro's static asset handling). Prominent placement. Same in both Standard and Simple mode.

4. **Simple Mode toggle [A6]** — a segmented control with "Standard" and "Simple" options. Uses `--toggle-mode-*` tokens. Reads from `localStorage` on page load (key: `simple_mode`). Must render the correct view immediately — no flash of wrong content. Build as a client-side Astro island (`client:load`).

5. **Answer content** — both versions rendered in the HTML at build time:
   - Standard view: Notion page body content (rich text blocks), with inline glossary tooltips
   - Simple view: Simple Answer property field, with inline glossary tooltips (showing Simple Definitions)
   - JavaScript toggles visibility based on localStorage preference

6. **Signposting block [A8]** — always present, not dismissable. Uses `.alert--support` class. Shows services from the Signposting multi-select field. Immediately after the answer.

7. **End-of-answer panel [A17]** — three panels on every question page:
   - Panel 1: "Get the book" → `/book`
   - Panel 2: "Explore how to teach this topic" → `/topics/{primary_topic_slug}`
   - Panel 3: "Bring RSE into your school" → `/services` or `/training`

8. **Related questions [A15]** — 3–5 related question cards. Selection logic (priority order): manual override from Related Questions field → same primary topic → same content tags → same original category. Cap at 5, deduplicate.

9. **Topic tags [A16]** — links to parent landing page(s).

### Both pages use the OtA layer

The base layout receives `layer="ota"`. The main element gets `.layer-ota`. Sections get `.surface--ota` for the warm paper ground. The header/footer stay in Lexend.

## Glossary page template [C2] (`/glossary/{slug}`)

1. **Term heading** — the glossary term as page title.

2. **Simple Mode toggle [A6]** — same component as on question pages. Same localStorage key. Same behaviour.

3. **Definition** — Standard mode shows Short Definition (prominent). Simple mode shows Simple Definition.

4. **Full explainer** — Standard mode shows Notion page body content. Simple mode shows Simple Explainer. Both include inline glossary tooltips.

5. **Related glossary terms [A15]** — from Related Terms self-relation.

6. **Questions that reference this term [A15]** — from Referenced In reverse relation.

7. **Signposting block [A8]** — if relevant to the term's topic.

8. **CTA** — "Explore [topic name] →" linking to `/topics/{primary_topic_slug}`.

9. **Topic tags [A16]**.

## Glossary tooltip system [A7]

This is the most technically complex piece. Build it as an Astro island component.

**At build time:**
- Scan rendered text content for exact matches against glossary term names (case-insensitive, whole words only)
- Only tooltip the first occurrence of each term per page
- Do not tooltip a term on its own glossary page
- Do not tooltip inside headings, image alt text, or other tooltips

**At runtime:**
- Desktop: tooltip appears on hover, stays open on hover, closes on mouse-out
- Mobile: appears on tap, closes on tap elsewhere
- Standard mode: tooltip shows Short Definition
- Simple mode: tooltip shows Simple Definition
- Every tooltip includes "Read more →" link to `/glossary/{slug}`

**Writing rules:**
- Standard answers can use glossary terms → tooltips show Short Definition
- Simple Answers can use glossary terms → tooltips show Simple Definition
- Short Definitions can use glossary terms sparingly → reader can click through
- Simple Definitions must NOT use glossary terms → this is the end of the line

## Simple Mode implementation

**Both views are in the HTML at build time.** No server-side switching. JavaScript shows/hides.

```html
<div data-mode="standard" class="mode-content">
  <!-- Standard answer with standard tooltips -->
</div>
<div data-mode="simple" class="mode-content" hidden>
  <!-- Simple answer with simple tooltips -->
</div>
```

**On page load (before first paint):**
1. Check `localStorage.getItem('simple_mode')`
2. If `'true'`, hide standard, show simple, set toggle to Simple
3. If absent or `'false'`, show standard (default)

**Critical:** No flash of wrong content. The check must happen before the content is visible. Use an inline `<script>` in the `<head>` that runs synchronously:

```html
<script>
  if (localStorage.getItem('simple_mode') === 'true') {
    document.documentElement.classList.add('simple-active');
  }
</script>
```

Then use CSS: `.simple-active [data-mode="standard"] { display: none }` and `.simple-active [data-mode="simple"] { display: block }`.

**On toggle click:**
1. Swap visibility
2. Update localStorage
3. Update toggle state and aria attributes

## What "done" looks like

1. A real question page renders from Notion data at `/anonymous_question/{slug}`
2. The page shows the correct post-it image, answer text, signposting, and related questions
3. Simple Mode toggle works — switching swaps content, preference persists across page loads
4. Glossary terms in the answer text are highlighted and show tooltips on hover/tap
5. Crisis support component appears on safeguarding-related questions
6. Age flag appears on age-flagged questions
7. A real glossary page renders at `/glossary/{slug}` with definition, explainer, and related terms
8. Typography is correct: Fraunces headings, Atkinson body, warm paper surfaces
9. All component classes from the design system are used correctly (`.alert--crisis`, `.alert--support`, `.alert--ageflag`, `.badge--ota-*`, `.mode-toggle`, `.link-action`)

## What NOT to build

- No landing pages, blog posts, service pages, or showcase pages
- No header/footer content (still placeholders)
- No search
- No analytics events
- No SEO metadata (comes in Stage 6)

---

*Stage 3 of 6. Previous: Design System Integration. Next: Landing Pages and Navigation.*
