# Tailor Layout Spec — B2 About

| Field | Value |
|---|---|
| **Page** | About |
| **Route** | `/about` |
| **Template** | `src/pages/about.astro` (rewrite of existing draft — see §0.1) |
| **Layer** | Tailor (default — no `.layer-ota` class) |
| **Instances** | 1 |
| **Version** | 1.0 |
| **Date** | 2026-04-13 |

---

## 0 · Purpose

`/about` is the trust page, not the overview page. The site's nav already tells visitors *what* Tailor does (services, training, blog, Okay to Ask); the homepage and landing pages already tell them *how* the work is shaped. The About page answers a different question: **who is this, and why should we trust them with our children's RSE?**

Three readers arrive here, in roughly this order of priority:

1. **School decision-makers** — PSHE leads, SLT, a headteacher vetting a provider before signing a purchase order. They need to see a real organisation, a real practitioner, and credible credentials. They are the primary audience.
2. **Parents** — occasionally, a parent whose child's school has bought Tailor content will visit `/about` to check out who's behind what their child is being taught. They are a secondary audience with a legitimate interest.
3. **Prospective collaborators / journalists** — looking for the mission, the founder story, and a point of contact.

All three benefit from the same page. None benefit from a services overview on this page — the nav does that. None benefit from a feature-by-feature pitch — the C5 service pages do that. What they all benefit from is: a clear statement of what Tailor is and why it exists, real faces with real names, a short version of the approach story (with a door to the long version), evidence of the thinking through recent writing, and a single quiet CTA if they want to make contact.

**Mood.** Calm institutional trust. Not corporate. Not salesy. Not a founder-narcissism page. Think "who we are and how we think" — the organisation leads, the team sits inside it, the writing speaks for itself. Surface rhythm is quiet; there is no dark authority band on this page because the whole page *is* the trust signal, and beating the reader over the head with a dark-surface "TRUST US" section would undercut it.

---

## 0.1 · Relationship to the existing `src/pages/about.astro`

A draft version of this page exists at `src/pages/about.astro` (last touched as a placeholder implementation) with five sections: Tailor Education, Meet the team, The Okay to Ask project, Framework alignment, CTA. The draft uses ad-hoc class names (`.about-hero`, `.about-section`, `.team-card`, `.team-grid`, etc.) and hardcoded style values (`max-w-4xl`, raw `line-height: 1.7`, non-tokenised font sizes on some rules).

**This spec supersedes the draft.** The rewrite:

- **Drops** the Okay to Ask section (Okay to Ask has its own front door at `/questions/` and prominent homepage placement — it doesn't need elevation on the About page).
- **Drops** the Framework alignment section (duplicates `/our-approach` and pulls the page toward an overview the content spec explicitly routes to B3).
- **Adds** "Our approach" — a short signal-of-thinking section with a clear link to `/our-approach`, replacing the Framework alignment block.
- **Adds** "From our blog" — 2–3 featured blog posts demonstrating depth and credibility, reusing the B9 `.blog-index-card` component.
- **Renames** the team card class from `.team-card` (too generic) to `.about-team-card`, following the B9 convention of page-scoped card classes (`.blog-index-card`, `.topic-hub-card`, etc.).
- **Replaces** the initials-avatar placeholder (`GE` in a tinted circle) with a proper photograph slot, with the circle-initials pattern retained only as a per-card fallback when a team member hasn't supplied a portrait yet.
- **Replaces** hardcoded font sizes / line-heights / widths with token references (`--lh-body`, `--lh-prose`, `--container-max-prose`, etc.).
- **Rewrites** the CTA section as a single soft "Get in touch" card instead of the current dual-button row (the "See our approach" button is absorbed into §3's inline link — one button, one primary action at the bottom of the page).

Section §0.2 below enumerates the specific code in the existing draft that must be removed or replaced during the rewrite.

---

## 0.2 · Code to remove / replace from the existing draft

Before building the new B2, the following items in `src/pages/about.astro` are removed:

| Line(s) in draft | What | Action |
|---|---|---|
| 15 | `<article class="about-page">` root | Replace with `<main class="about-page">` — this is a page-level wrapper, not an article |
| 31–48 | Placeholder team cards with initials avatars (`GE`, `TE`) | Replace entirely — new `.about-team-card` component with photo slot (see §4.2) |
| 53–65 | `<!-- 3. The Okay to Ask project -->` section | Delete — Okay to Ask doesn't belong on B2 |
| 67–76 | `<!-- 4. Framework alignment -->` section | Delete — supersede with "Our approach" signal-section (§4.3) |
| 79–86 | Current CTA section (dual buttons, centred) | Rewrite as soft planning-call card (see §4.5) |
| 90–109 | Entire `<style>` block | Rewrite — use token references only, new class names under §4 |
| 94 | `line-height: 1.7` (raw value) | Replace with `var(--lh-prose)` |
| 94, 98 | `max-width: 36rem` (raw value) | Replace with `var(--container-max-prose)` |
| 101 | `.team-card` class | Rename to `.about-team-card` |
| 102 | `width: 3.5rem; height: 3.5rem` avatar (raw) | Replace with `--about-team-avatar-size` local token (see §4.2) |
| 105 | `line-height: 1.5` (raw) | Replace with `var(--lh-card)` |
| 109 | `@media (min-width: 768px)` breakpoint | Keep the 768px breakpoint but extend — team grid steps 1 → 2 at 640px and 2 → 3 at 1024px (see §7) |

**No changes needed to:** `BaseLayout` import, the `title` / `description` / `canonicalPath` attributes (though description copy is TBD — see §9), the top-level `.about-page { background: var(--bg-page); }` rule.

**Routes and links to preserve:** `/our-approach` (inline link from §4.3), `/contact` (CTA target from §4.5). Both exist elsewhere in the site; no routing changes needed.

---

## 1 · Reference documents

- `Tailor_Layout_Spec_B9.md` — blog index; source of the `.blog-index-card` component reused in §4.4
- `Tailor_Layout_Spec_B5.md` — services hub; surface-rhythm conventions (tinted open, page reading mode, alt-tinted CTA close) informing this page's rhythm
- `Tailor_Layout_Spec_B1.md` — homepage; layer-scoping model, hero photography conventions
- `Tailor_Layout_Spec_C4.md` — blog post template; source of `BlogPost` data model, date formatting, `deriveExcerpt()` / `formatDate()` helpers
- `Tailor_Layout_Spec_Shell.md` — header, footer, container-width tokens
- `Tailor_Page_Content_Spec_v1.md` — B2 section (note: content spec's section list is superseded by this spec; see §10 contradictions)
- `Tailor_Art_Direction_Brief_v1 (1).md` — "calm authority" mood, anti-SaaS photography direction, the "real faces" principle
- `Tailor_Design_System_Implementation_Notes.md` — token vocabulary, layer scoping, component patterns
- `src/lib/types.ts` — `BlogPost` interface
- `src/lib/blog-helpers.ts` — `formatDate()`, `deriveExcerpt()` (both already used by B9 / C4)

---

## 2 · Data requirements

### 2.1 Team members

No Notion schema for team members exists yet. For v1 of B2, **team data is a typed array declared in the page frontmatter** — a hand-edited constant. Adding a Notion-backed team database is a nice future move but is out of scope for this page ship.

```typescript
// src/pages/about.astro — frontmatter

interface TeamMember {
  name: string;
  role: string;
  bio: string;                    // 1–2 sentences, plain text
  portrait: string | null;        // public asset path, e.g. "/team/gareth.jpg"
  portraitAlt: string | null;     // descriptive alt — not decorative; see §8
  credentials?: string;           // optional one-line credential/qualification
  linkedIn?: string;              // optional external profile link
}

const team: TeamMember[] = [
  {
    name: 'Gareth Esson',
    role: 'Founder & RSE Specialist',
    bio: '[COPY TBD — 1–2 sentences on background, years in RSE, what Gareth writes and delivers]',
    portrait: '/team/gareth.jpg',      // [ASSET TBD — supply before launch]
    portraitAlt: '[COPY TBD — portrait description, e.g. "Gareth Esson, smiling, seated in a classroom"]',
    credentials: '[COPY TBD — e.g. "QTS · PSHE Association member"]',
  },
  // Additional team members added here as hired / confirmed.
];
```

**Gareth first, every other member second, in confirmed-join order.** No alphabetical sort (Founder leads; historical order beats arbitrary ordering for a small team); the array order *is* the render order.

**Missing fields.** If `portrait` is null, render the initials-avatar fallback (see §4.2). If `credentials` is absent, the credentials line on the card omits entirely. If `linkedIn` is absent, no external link rendered.

**Why this shape.** The team is expected to be small (1–4 people for launch, single-digit for the foreseeable future). A Notion-backed team directory is the right long-term home — it lets a non-dev change the team without a deploy — but building it is a disproportionate cost for the v1 ship. The TypeScript interface is the contract; when a Notion migration happens later, the Astro component reads from `getTeamMembers()` instead of the local array and nothing else changes.

### 2.2 Featured blog posts

The "From our blog" section shows **3 posts**. Selection is hand-picked, not auto-latest. Rationale: the About page is the credibility signal; a brand-new blog post that hasn't been peer-reviewed, or a post on a narrow topic the reader doesn't care about, should not automatically surface here.

**Selection model.**

```typescript
// src/pages/about.astro — frontmatter

const FEATURED_SLUGS: string[] = [
  // [COPY TBD — 3 slugs chosen by Gareth for launch]
  // e.g. 'the-consent-conversation', 'teaching-puberty-without-flinching', ...
];

import { getBlogPosts } from '../lib/content';
const allPosts = await getBlogPosts();
const featuredPosts = FEATURED_SLUGS
  .map((slug) => allPosts.find((p) => p.slug === slug))
  .filter((p): p is BlogPost => p !== undefined);
```

**Fallback.** If `featuredPosts.length < 3` (a chosen slug is no longer published, or the array is empty for some reason), fill up to 3 from newest-first published posts, de-duplicated against whatever `FEATURED_SLUGS` *did* resolve. This keeps the section at 3 cards on every build without manual intervention.

**Empty state.** If there are zero published posts (early-site state), omit §4.4 entirely — render nothing in place of it, not a "no posts yet" placeholder. The section only earns its spot on the page when it has real content.

**Fields consumed per post.** Same subset as B9: `title`, `slug`, `featuredImage`, `publishedDate`, `author`, `category`, `topics`, `metaDescription`, `body` (for `deriveExcerpt()`). No new fetcher helpers.

---

## 3 · Section map

| § | Section | Surface | Container | Required |
|---|---|---|---|---|
| 1 | Hero (headline + mission paragraph) | `--bg-tinted` | `--container-max-shell` | Yes |
| 2 | Tailor Education — who we are / why a CIC | `--bg-page` | `--container-max-prose` | Yes |
| 3 | Meet the team (grid) | `--bg-surface-alt` | `--container-max-shell` | Yes |
| 4 | Our approach (signal + link) | `--bg-page` | `--container-max-prose` | Yes |
| 5 | From our blog (3 cards) | `--bg-surface-alt` | `--container-max-shell` | Conditional (skip if 0 posts) |
| 6 | Get in touch (soft CTA card) | `--bg-page` | `--container-max-prose` | Yes |

Page background: `--bg-page`.

**Surface rhythm.** Warm tinted open → page reading mode → alt-tinted team block → page reading mode → alt-tinted blog block → page closing CTA. The pattern is deliberately a pair of tint-lift/page-return cycles: each tint carries a "collection of things" (team members, blog posts), each page-ground section carries a "piece of prose" (mission, approach). The reader's eye gets a consistent cue that tinted bands mean grid content and page-ground means reading content.

No `--bg-emphasis` dark band anywhere on this page. The dark band is for testimonials and single-moment authority statements (C5, B5); the About page doesn't have that kind of moment. Using the dark band for, say, the mission statement would shout where this page wants to speak quietly.

### 3.1 Vertical rhythm

| Section | Padding |
|---|---|
| §1 Hero | `py-[var(--space-struct-y-base)]` |
| §2 Tailor Education | `py-[var(--space-struct-y-base)]` |
| §3 Meet the team | `py-[var(--space-struct-y-base)]` |
| §4 Our approach | `py-[var(--space-struct-y-base)]` |
| §5 From our blog | `py-[var(--space-struct-y-base)]` |
| §6 Get in touch | `py-[var(--space-struct-y-base)]` |

Horizontal insets: `px-[var(--space-global-gutter)]` on every outer wrapper.

Uniform vertical rhythm across the page is intentional here. B5 uses compressed rhythms on its framework strip because that section is a tertiary signal; on B2 every section is primary, so every section gets the full struct-y band.

---

## 4 · Section details

### §1 — Hero

```
┌──────────────────────────────────────────────────────┐
│  --bg-tinted, border-bottom: --border-subtle           │
│                                                        │
│  EYEBROW  "About Tailor Education"                     │
│                                                        │
│  h1  [COPY TBD — headline: e.g.                        │
│       "RSE built by teachers, trusted by schools."]    │
│                                                        │
│  p   [COPY TBD — 1–2 sentence mission statement        │
│       at prose-lead size]                              │
│                                                        │
└──────────────────────────────────────────────────────┘
```

- **Outer wrapper:** `<header class="about-hero">`, full-bleed `--bg-tinted` with `border-bottom: var(--border-width-xs) solid var(--border-subtle)`. `w-full`, `py-[var(--space-struct-y-base)]`, `px-[var(--space-global-gutter)]`.
- **Inner wrapper:** `mx-auto w-full max-w-[var(--container-max-shell)]`. Content left-aligned (Tailor layer convention).

**Contents:**

1. **Eyebrow** — `<span class="about-hero__eyebrow">` text: "About Tailor Education" or "About us". Working copy: "About".

| Property | Token |
|---|---|
| `font-family` | `var(--font-tailor-body-stack)` |
| `font-size` | `var(--text-card-size-body)` |
| `font-weight` | `var(--font-weight-semibold)` |
| `text-transform` | `uppercase` |
| `letter-spacing` | `var(--text-eyebrow-ls)` |
| `color` | `var(--brand-accent-text)` |
| `margin` | `0 0 var(--space-global-xs)` |

2. **h1** — `<h1 class="about-hero__title">` — `[COPY TBD]`. Working placeholder: "About Tailor Education". The headline is allowed to be a short voice line rather than a literal label, e.g. *"RSE built by teachers, trusted by schools."* — the trust proposition up top.

| Property | Token |
|---|---|
| `font-family` | `var(--font-tailor-heading-stack)` |
| `font-size` | `var(--text-display-size-h1)` |
| `font-weight` | `var(--heading-weight-h1)` |
| `line-height` | `var(--lh-display)` |
| `color` | `var(--text-heading)` |
| `margin` | `0 0 var(--space-global-sm)` |

3. **Mission lede** — `<p class="about-hero__lede">` — `[COPY TBD — 1–2 sentences: what Tailor is, who it serves, what it believes. E.g. "Tailor Education is a community-interest company delivering expert relationships and sex education resources, training, and support to UK schools. Everything we publish is written by practising educators and aligned to statutory guidance."]`.

| Property | Token |
|---|---|
| `font-family` | `var(--font-tailor-body-stack)` |
| `font-size` | `var(--text-prose-size-lede)` |
| `font-weight` | `var(--font-weight-regular)` |
| `line-height` | `var(--lh-prose)` |
| `color` | `var(--text-body)` |
| `max-width` | `var(--container-max-prose)` |
| `margin` | `0` |

No hero image. A stock classroom photograph here would create the same "which image is the hero?" conflict with the team portraits below that B9 avoided with the blog index. The team photos below carry the visual identity; the hero carries the words.

No CTA button. The reader's next action is to scroll into the page; the closing §6 CTA is the single conversion target.

### §2 — Tailor Education — who we are

A prose section answering three linked questions in order: *What is Tailor? Why a CIC? What does it believe?* Kept short — one headline, two or three paragraphs, no subheadings.

```
┌──────────────────────────────────────────────────────┐
│  --bg-page                                             │
│                                                        │
│  h2  "Tailor Education"                                │
│                                                        │
│  p   [COPY TBD — first paragraph: what Tailor is, what │
│       it does, who it serves]                          │
│                                                        │
│  p   [COPY TBD — second paragraph: the CIC structure,  │
│       why it matters. One sentence on community-       │
│       interest status and what that commits us to.]    │
│                                                        │
│  p   [COPY TBD (optional third) — a single belief      │
│       statement about honesty-in-RSE, in Gareth's      │
│       voice. This is the paragraph that sounds like    │
│       a person, not an organisation.]                  │
│                                                        │
└──────────────────────────────────────────────────────┘
```

- **Outer wrapper:** `<section class="about-intro">`, `w-full px-[var(--space-global-gutter)] py-[var(--space-struct-y-base)]`.
- **Inner wrapper:** `mx-auto w-full max-w-[var(--container-max-prose)]`. Prose measure — this is a reading block, not a layout block.

**Heading (`<h2 class="about-intro__title">`):** "Tailor Education" *[COPY TBD — or "Who we are"]*.

| Property | Token |
|---|---|
| `font-family` | `var(--font-tailor-heading-stack)` |
| `font-size` | `var(--text-prose-size-h2)` |
| `font-weight` | `var(--heading-weight-h2)` |
| `line-height` | `var(--lh-heading)` |
| `color` | `var(--text-heading)` |
| `margin` | `0 0 var(--space-global-md)` |

**Paragraphs (`<p class="about-intro__para">`):**

| Property | Token |
|---|---|
| `font-family` | `var(--font-tailor-body-stack)` |
| `font-size` | `var(--text-prose-size-body)` |
| `font-weight` | `var(--font-weight-regular)` |
| `line-height` | `var(--lh-prose)` |
| `color` | `var(--text-body)` |
| `margin` | `0 0 var(--space-global-md)` (last paragraph has `margin-bottom: 0`) |

**No inline CTA.** This section does not link out. The reader is in reading mode; links here would nudge them out before they reach the team grid. The one exception: if the CIC paragraph is short enough, the word "community-interest company" may link to the Companies House public record as a trust signal — optional; Gareth's call.

### §3 — Meet the team

```
┌──────────────────────────────────────────────────────┐
│  --bg-surface-alt                                      │
│                                                        │
│  h2  "Meet the team"                                   │
│                                                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  PHOTO   │  │  PHOTO   │  │  PHOTO   │             │
│  │          │  │          │  │          │             │
│  ├──────────┤  ├──────────┤  ├──────────┤             │
│  │ NAME     │  │ NAME     │  │ NAME     │             │
│  │ Role     │  │ Role     │  │ Role     │             │
│  │ Creds    │  │ Creds    │  │ Creds    │             │
│  │ Bio      │  │ Bio      │  │ Bio      │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│                                                        │
└──────────────────────────────────────────────────────┘
```

- **Outer wrapper:** `<section class="about-team" aria-labelledby="about-team-title">`, `w-full px-[var(--space-global-gutter)] py-[var(--space-struct-y-base)]`. Background: `var(--bg-surface-alt)`.
- **Inner wrapper:** `mx-auto w-full max-w-[var(--container-max-shell)]`.

**Heading (`<h2 id="about-team-title" class="about-team__title">`):** "Meet the team".

| Property | Token |
|---|---|
| `font-family` | `var(--font-tailor-heading-stack)` |
| `font-size` | `var(--text-prose-size-h2)` |
| `font-weight` | `var(--heading-weight-h2)` |
| `line-height` | `var(--lh-heading)` |
| `color` | `var(--text-heading)` |
| `margin` | `0 0 var(--space-global-lg)` |

**Intro line (optional, `<p class="about-team__intro">`):** One sentence placing the team — *[COPY TBD — e.g. "The people behind Tailor's content, training, and delivery."]*. Omitted if Gareth prefers the heading to stand alone. Same typography as §2 paragraphs.

### §3.1 — Team grid

**Grid (`.about-team__grid`):** `<ul role="list">` — semantic list.

| Property | Value |
|---|---|
| `display` | `grid` |
| `grid-template-columns` | `1fr` (mobile) → `repeat(2, 1fr)` at `≥ 640px` → `repeat(3, 1fr)` at `≥ 1024px` |
| `gap` | `var(--space-global-lg)` |
| `list-style` | `none` |
| `padding` | `0` |
| `margin` | `0` |

Each team member is a single `<li class="about-team__item">` containing a `<div class="about-team-card">` (not a link — team cards are content, not navigation targets, unless a `linkedIn` field is present in which case the name is a link — see §3.2).

### §3.2 — Team card (`.about-team-card`)

A new card component, distinct from `.blog-index-card` (different content type — people, not posts) and from `.topic-hub-card` (different axis). Vertical card, full width of its grid cell, with a prominent square portrait (1:1), then info stacked below. Cards are **non-interactive** by default (not wrapped in an `<a>`) — the team member's name is plain text unless a `linkedIn` URL is present, in which case the name becomes the sole interactive element.

**Structure:**

```html
<li class="about-team__item">
  <div class="about-team-card">
    <div class="about-team-card__portrait">
      {portrait
        ? <img src={portrait} alt={portraitAlt} loading="lazy" />
        : <div class="about-team-card__portrait-fallback" aria-hidden="true">{initials(name)}</div>}
    </div>
    <div class="about-team-card__body">
      {linkedIn
        ? <h3 class="about-team-card__name"><a href={linkedIn} rel="noopener noreferrer" target="_blank">{name}</a></h3>
        : <h3 class="about-team-card__name">{name}</h3>}
      <p class="about-team-card__role">{role}</p>
      {credentials && <p class="about-team-card__credentials">{credentials}</p>}
      <p class="about-team-card__bio">{bio}</p>
    </div>
  </div>
</li>
```

**Card container (`.about-team-card`):**

| Property | Token / value |
|---|---|
| `display` | `flex` |
| `flex-direction` | `column` |
| `height` | `100%` (fill grid cell — all cards equal height per row) |
| `background` | `var(--bg-surface)` |
| `border` | `var(--border-width-xs) solid var(--border-subtle)` |
| `border-radius` | `var(--radius-lg)` |
| `overflow` | `hidden` |
| `box-shadow` | `var(--shadow-xs)` |

No hover-lift. These are not actionable cards — lifting them on hover would misread as "click me". They're content panels. The only interactive affordance inside a card is the optional `<a>` on the name, which receives the standard link hover/focus styles from the design system.

**Portrait slot (`.about-team-card__portrait`):**

| Property | Value |
|---|---|
| `position` | `relative` |
| `aspect-ratio` | `1 / 1` |
| `width` | `100%` |
| `overflow` | `hidden` |
| `background` | `var(--bg-surface-alt)` (loading fallback) |

The `<img>` inside: `width: 100%`, `height: 100%`, `object-fit: cover`, `object-position: center top` (faces tend to sit in the upper portion — slightly biased up means beheading on narrow crops is less likely than a feet-first crop), `display: block`, `loading: lazy`. First portrait (Gareth) uses `loading="eager"` — he's above the fold on most viewports once the reader has scrolled past §2.

Why 1:1 and not the card 16:9 used on B9. Blog cards show a wide editorial image (landscape photography, illustrations); team cards show a portrait. A 16:9 headshot is a postcard — wastes vertical space and pushes names down the card. A 1:1 portrait reads as a headshot and lines up pleasantly in a row of three.

**Portrait fallback (`.about-team-card__portrait-fallback`):** When `portrait` is null, render the initials pattern (first letter of `name` + first letter of last word in `name`, e.g. "Gareth Esson" → "GE"). This is the *only* place the initials-circle pattern appears on B2; it's a temporary placeholder for team members whose headshot hasn't been produced yet.

| Property | Value |
|---|---|
| `width` | `100%` |
| `height` | `100%` |
| `background` | `var(--bg-tinted)` |
| `display` | `flex` |
| `align-items` | `center` |
| `justify-content` | `center` |
| `font-family` | `var(--font-tailor-heading-stack)` |
| `font-size` | `clamp(2.5rem, 5vw + 1rem, 4rem)` |
| `font-weight` | `var(--font-weight-bold)` |
| `color` | `var(--brand-accent-text)` |
| `letter-spacing` | `-0.02em` |

The fallback carries `aria-hidden="true"` — the initials are visual decoration; the name alongside carries the information.

**Body (`.about-team-card__body`):**

| Property | Value |
|---|---|
| `display` | `flex` |
| `flex-direction` | `column` |
| `gap` | `var(--space-global-xs)` |
| `padding` | `var(--space-global-md)` |
| `flex` | `1` (fills remaining card height so cards in same row equalise) |

**Name (`.about-team-card__name`):** `<h3>`. If `linkedIn` present, the heading contains a link; otherwise plain text.

| Property | Token |
|---|---|
| `font-family` | `var(--font-tailor-heading-stack)` |
| `font-size` | `var(--text-card-size-h3)` |
| `font-weight` | `var(--heading-weight-h3)` |
| `line-height` | `var(--lh-heading-sub)` |
| `color` | `var(--text-heading)` |
| `margin` | `0` |

When the name is a link, the `<a>` inherits the global `:focus-visible` outline and gets the standard link colour (`var(--brand-accent-text)`) on hover.

**Role (`.about-team-card__role`):**

| Property | Token |
|---|---|
| `font-family` | `var(--font-tailor-body-stack)` |
| `font-size` | `var(--text-card-size-body)` |
| `font-weight` | `var(--font-weight-medium)` |
| `line-height` | `var(--lh-card)` |
| `color` | `var(--brand-accent-text)` |
| `margin` | `0` |

**Credentials (`.about-team-card__credentials`):** Optional. Rendered only when `credentials` is present on the data.

| Property | Token |
|---|---|
| `font-family` | `var(--font-tailor-body-stack)` |
| `font-size` | `var(--text-card-size-h6)` |
| `font-weight` | `var(--font-weight-semibold)` |
| `text-transform` | `uppercase` |
| `letter-spacing` | `var(--card-eyebrow-ls)` |
| `color` | `var(--text-body-muted)` |
| `line-height` | `var(--lh-card)` |
| `margin` | `0` |

Uses `--card-eyebrow-ls` (0.1em) — matches the B9 category eyebrow convention. The credential line reads as a small eyebrow-style tag above the bio.

**Bio (`.about-team-card__bio`):**

| Property | Token |
|---|---|
| `font-family` | `var(--font-tailor-body-stack)` |
| `font-size` | `var(--text-card-size-body)` |
| `font-weight` | `var(--font-weight-regular)` |
| `line-height` | `var(--lh-card)` |
| `color` | `var(--text-body-muted)` |
| `margin` | `var(--space-global-xs) 0 0` |

No truncation, no line-clamp. Bios are short by contract (1–2 sentences) — if someone writes a long one, that's a content discipline problem, not a CSS problem. Keeping the bio full-height lets cards with longer bios grow the whole row to match, which looks intentional rather than clipped.

### §4 — Our approach (signal section)

A short prose moment that signals *how* Tailor thinks about RSE, then hands off to `/our-approach` for the full story. One heading, one paragraph, one inline link. Deliberately brief — the reader who wants the full approach story follows the link; the reader who doesn't picked up the signal and moves on.

```
┌──────────────────────────────────────────────────────┐
│  --bg-page                                             │
│                                                        │
│  h2  "Our approach"                                    │
│                                                        │
│  p   [COPY TBD — 2–3 sentences. "Our content is       │
│       written by practising educators, aligned to      │
│       DfE, PSHE Association, and UNESCO frameworks,   │
│       and designed around disclosure-aware activity   │
│       design. Read the full picture of how we think   │
│       about RSE."]                                     │
│                                                        │
│  [Read about our approach →]                           │
│                                                        │
└──────────────────────────────────────────────────────┘
```

- **Outer wrapper:** `<section class="about-approach">`, `w-full px-[var(--space-global-gutter)] py-[var(--space-struct-y-base)]`.
- **Inner wrapper:** `mx-auto w-full max-w-[var(--container-max-prose)]`.

**Heading, paragraph:** Same typography as §2 (`about-intro__title` / `about-intro__para`) — this is a parallel prose section. Reuse the class names rather than creating `.about-approach__title` duplicates; the two prose blocks are typographically identical by design.

**Inline CTA:** Rendered as a link-button, not a full `btn--primary` (this is a secondary action; the primary CTA is §6):

```html
<a href="/our-approach" class="btn btn--std btn--outline has-icon-hover">
  Read about our approach
</a>
```

`margin-top: var(--space-global-md)`. The button is left-aligned (matches the prose column above it); not centred.

**No photography, no diagram.** The section is a prose moment and a handoff — any imagery would compete with the team portraits above and the blog imagery below.

### §5 — From our blog

Three featured blog cards demonstrating the depth and credibility of Tailor's writing. Reuses the `.blog-index-card` component from B9 verbatim — same structure, same styling, same markup. This is the first reuse of the card; B9 owns the component, B2 consumes it.

```
┌──────────────────────────────────────────────────────┐
│  --bg-surface-alt                                      │
│                                                        │
│  h2  "From our blog"                                   │
│  p   [COPY TBD — one-line lede, e.g.                   │
│       "A taste of how we think in long form."]         │
│                                                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  IMAGE   │  │  IMAGE   │  │  IMAGE   │             │
│  ├──────────┤  ├──────────┤  ├──────────┤             │
│  │ CATEGORY │  │ CATEGORY │  │ CATEGORY │             │
│  │ Title    │  │ Title    │  │ Title    │             │
│  │ Excerpt  │  │ Excerpt  │  │ Excerpt  │             │
│  │ Author · │  │ Author · │  │ Author · │             │
│  │ Date     │  │ Date     │  │ Date     │             │
│  │ Topics   │  │ Topics   │  │ Topics   │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│                                                        │
│  [View all posts →]                                    │
│                                                        │
└──────────────────────────────────────────────────────┘
```

- **Outer wrapper:** `<section class="about-blog" aria-labelledby="about-blog-title">`, `w-full px-[var(--space-global-gutter)] py-[var(--space-struct-y-base)]`. Background: `var(--bg-surface-alt)`.
- **Inner wrapper:** `mx-auto w-full max-w-[var(--container-max-shell)]`.

**Heading (`<h2 id="about-blog-title" class="about-blog__title">`):** "From our blog".

Typography matches §3 heading (`about-team__title`). Class structure mirrors §3 — `about-blog__title`, `about-blog__intro`, `about-blog__grid`.

**Intro (`<p class="about-blog__intro">`):** One-line context — *[COPY TBD — e.g. "A taste of how we think, in long form." or "Recent writing on practice, curriculum, and the stuff that sits between."]*. Omittable if Gareth prefers the heading alone.

### §5.1 — Blog grid

**Grid (`.about-blog__grid`):** Identical to §3's team grid in structure, different content.

| Property | Value |
|---|---|
| `display` | `grid` |
| `grid-template-columns` | `1fr` (mobile) → `repeat(2, 1fr)` at `≥ 640px` → `repeat(3, 1fr)` at `≥ 1024px` |
| `gap` | `var(--space-global-lg)` |
| `list-style` | `none` |
| `padding` | `0` |
| `margin` | `0` |

Rendered as `<ul class="about-blog__grid" role="list">`. Each `<li class="about-blog__item">` contains a reused B9 `.blog-index-card` component.

### §5.2 — Card reuse from B9

The three cards inside §5.1 are instances of `.blog-index-card` from B9. **No `.about-blog-card` class is created.** The B9 card already renders:

- 16:9 featured image with `--bg-tinted` fallback
- Category eyebrow
- h3 title (linked)
- 140-char excerpt
- Author · Date meta row
- First 3 topics + "+N more"

All of which is exactly what B2 needs. Factoring the card into a shared component is out of scope for this ship — for v1, B2 duplicates the card HTML inside its own template. When a third consumer appears, the card is extracted into `src/components/BlogIndexCard.astro`.

**Differences from B9 usage:**

- **No `data-category` / `data-topics` attributes on `<li>`** — those are filter-JS hooks; B2 has no filtering.
- **No `data-page` attribute** — no pagination on B2.
- **All images `loading="lazy"`** — by the time a user reaches §5 they've scrolled through hero, intro, team grid, and approach; eager-loading the first blog image here is wasted bytes.

### §5.3 — Below-grid "View all posts" link

A small right-aligned link below the grid: `<a href="/blog/" class="btn btn--std btn--outline has-icon-hover">View all posts</a>`. Invites the reader who liked what they saw into the blog index.

| Property | Value |
|---|---|
| `display` | `flex` |
| `justify-content` | `flex-end` (desktop) / `center` (`< 640px`) |
| `margin-top` | `var(--space-global-lg)` |

On mobile, right-aligning a single button looks awkward — re-centre below 640px. Implement via a single media query on the link-wrapper class `.about-blog__footer`.

### §6 — Get in touch (soft CTA)

A single card centred in the prose container. One headline, one supporting sentence, one primary CTA button. Matches the restraint of the whole page — no urgency, no persuasion tactics, just a door for the reader who wants to make contact.

```
┌──────────────────────────────────────────────────────┐
│  --bg-page                                             │
│                                                        │
│        ┌──────────────────────────────────────────┐  │
│        │  --bg-tinted, rounded, padded             │  │
│        │                                           │  │
│        │   h2  "Work with us"                      │  │
│        │                                           │  │
│        │   p   [COPY TBD — "Training, delivery,    │  │
│        │       bespoke planning: drop us a note    │  │
│        │       and we'll come back within a        │  │
│        │       working day."]                      │  │
│        │                                           │  │
│        │   [Get in touch →]                        │  │
│        │                                           │  │
│        └──────────────────────────────────────────┘  │
│                                                        │
└──────────────────────────────────────────────────────┘
```

- **Outer wrapper:** `<section class="about-cta">`, `w-full px-[var(--space-global-gutter)] py-[var(--space-struct-y-base)]`.
- **Inner wrapper:** `mx-auto w-full max-w-[var(--container-max-prose)]`.

**Card (`.about-cta__card`):**

| Property | Value |
|---|---|
| `background` | `var(--bg-tinted)` |
| `border` | `var(--border-width-xs) solid var(--border-subtle)` |
| `border-radius` | `var(--radius-lg)` |
| `padding` | `var(--space-struct-y-base) var(--space-global-lg)` |
| `display` | `flex` |
| `flex-direction` | `column` |
| `align-items` | `flex-start` |
| `gap` | `var(--space-global-md)` |
| `text-align` | `left` |

**Headline (`<h2 class="about-cta__title">`):** "Work with us" *[COPY TBD — alternatives: "Get in touch", "Start a conversation"]*.

| Property | Token |
|---|---|
| `font-family` | `var(--font-tailor-heading-stack)` |
| `font-size` | `var(--text-prose-size-h2)` |
| `font-weight` | `var(--heading-weight-h2)` |
| `line-height` | `var(--lh-heading)` |
| `color` | `var(--text-heading)` |
| `margin` | `0` |

**Body (`<p class="about-cta__body">`):** One sentence. Same typography as §2 paragraphs.

**Button (`<a class="btn btn--std btn--primary has-icon-hover" href="/contact">Get in touch</a>`):** Primary button. `has-icon-hover` for the arrow glyph on hover. Single CTA — no secondary "See our approach" button here (that link lives at the end of §4 and doesn't need to be repeated).

**Rationale for the card frame.** Wrapping the CTA in a tinted rounded card inside a page-ground section gives the closing moment a clear visual boundary without needing its own surface band. The reader's eye lands on a single object. This matches the B5 planning-call CTA pattern.

---

## 5 · Template structure

```
<BaseLayout>
  <header class="about-hero">                   ← §1 --bg-tinted band
    <div class="about-hero__inner">
      §1: Eyebrow + h1 + mission lede
    </div>
  </header>

  <main class="about-page">                     ← --bg-page
    <section class="about-intro">               ← §2 --bg-page, prose container
      §2: h2 + paragraphs
    </section>

    <section class="about-team" aria-labelledby="about-team-title">   ← §3 --bg-surface-alt
      §3: h2 + optional intro + .about-team__grid of .about-team-card
    </section>

    <section class="about-approach">            ← §4 --bg-page, prose container
      §4: h2 + paragraph + "Read about our approach" outline link
    </section>

    {featuredPosts.length > 0 && (
      <section class="about-blog" aria-labelledby="about-blog-title">   ← §5 --bg-surface-alt
        §5: h2 + optional intro + grid of 3 .blog-index-card + "View all posts" link
      </section>
    )}

    <section class="about-cta">                 ← §6 --bg-page, prose container
      §6: .about-cta__card with h2 + p + primary button
    </section>
  </main>
</BaseLayout>
```

Everything inside `<BaseLayout>` is Tailor layer by default. No `.layer-ota` class on this page.

**Top-level `<main>` not `<article>`.** The existing draft uses `<article class="about-page">` — replaced here with `<main>`. An About page is a page, not a standalone article (there's no single "work" being presented); `<main>` is the correct landmark and lines up with the page-landmark conventions used across the rest of the site.

---

## 6 · Client-side behaviour

No JavaScript. B2 is a static read-only page — no filters, no Load More, no interactive state. The only interactive affordances are the standard link/button interactions handled by the browser.

This is a deliberate constraint. The page is a trust page; its job is "read, form a view, act". Every bit of interactive UI is a chance to undercut that. If a future iteration adds, say, a "search the team" filter or a "show more team members" button, both should be argued for against the cost of visual chatter on a page whose whole purpose is to be quiet.

---

## 7 · Responsive behaviour

| Breakpoint | Team grid | Blog grid | Hero | CTA card |
|---|---|---|---|---|
| `< 640px` | 1 column | 1 column | Stacked, full-bleed tint | Full width of prose container |
| `≥ 640px` | 2 columns | 2 columns | Unchanged | Unchanged |
| `≥ 1024px` | 3 columns | 3 columns | Unchanged | Unchanged |

**Single structural breakpoint set.** Both grids step on the same breakpoints (640 / 1024). Mobile-first; max 3 columns; no 4-column variant (a 4-across team row with 1:1 portraits shrinks faces too small at common desktop widths). The shared breakpoint set means team grid and blog grid wrap synchronously as the viewport narrows — the page reads as rhythmically consistent.

**Why the same 3-col ceiling for both grids.** Team members and blog posts have different cardinality expectations (team = small, stable; blog = growing), but at the About-page viewport the same 3-across layout works for both. A blog grid that went to 4 columns while the team grid stayed at 3 would read as "the blog is more important than the team" which is the wrong signal on a trust page.

**Team grid with fewer than 3 members.** At launch, team = 1 (Gareth) or 2. With 1 member: the single card sits in a 1-column grid on every breakpoint (`grid-template-columns: 1fr` override via a `data-count="1"` attribute on `.about-team__grid`, or via `:has(:nth-child(1):last-child)` selector). With 2 members: step to 2 columns at `≥ 640px` and stay there (don't step to 3 — an empty third column would look abandoned). Use `data-count="{team.length}"` on the grid and branch the `grid-template-columns` rule by attribute selector:

```css
.about-team__grid[data-count="1"] { grid-template-columns: 1fr; max-width: 24rem; margin-inline: auto; }
.about-team__grid[data-count="2"] { grid-template-columns: 1fr; }
@media (min-width: 640px) {
  .about-team__grid[data-count="2"] { grid-template-columns: repeat(2, 1fr); max-width: 48rem; margin-inline: auto; }
}
/* .about-team__grid (no data-count, implicit ≥ 3) uses the default 1 → 2 → 3 pattern */
```

The `max-width` cap on the 1- and 2-member cases keeps cards from stretching absurdly wide in the `--container-max-shell` container.

**Image loading.** Gareth's portrait (first team card) uses `loading="eager"` because on a typical desktop first-paint, §3 is visible by the time §1 and §2 have read through. All other portraits and all blog images use `loading="lazy"`.

---

## 8 · Accessibility

- `<header>` wraps the hero. `<main>` wraps the rest. Each subsequent section is a `<section>` with an `aria-labelledby` pointing at its h2 where present.
- **Heading hierarchy.** h1 on the hero. h2 on each of §2, §3, §4, §5, §6. h3 on each team card name and each blog card title. The heading outline reads cleanly in a screen-reader's heading-nav view: "About Tailor Education → Tailor Education → Meet the team → [team members] → Our approach → From our blog → [posts] → Work with us".
- **Team cards** are non-interactive by default (no card-wide `<a>`). The name link (when `linkedIn` is present) is the single interactive element and receives the global `:focus-visible` outline.
- **Portrait alt text.** Every `<img>` carries a descriptive alt string provided by the `portraitAlt` field. Not an empty alt — the portrait of a named person is informational, not decorative (unlike editorial imagery). If `portraitAlt` is absent, `alt="Portrait of {name}"` as a fallback; the template fails loudly in development if the data supplies `portrait` without `portraitAlt`.
- **Initials fallback** `<div>` carries `aria-hidden="true"` — the name alongside carries the information.
- **External link** on team name (when `linkedIn` present) uses `rel="noopener noreferrer"` and `target="_blank"`; include a visually-hidden `<span class="visually-hidden">(opens in new tab)</span>` inside the `<a>` for screen-reader users.
- **Blog cards** are reused from B9 and carry B9's accessibility treatment: whole card is `<a>`, topic labels are plain text, images have empty `alt=""`.
- **CTA button** is an `<a>` with a descriptive label ("Get in touch"), not a `<button>` — semantically correct for navigation to `/contact`.
- **Reduced motion.** No animation or transition on this page beyond global link/button hover states (which already respect `prefers-reduced-motion` via the design system).

---

## 9 · SEO & metadata

- `<title>`: `"About — Tailor Education"` *[COPY TBD — the existing draft uses this; fine as working copy]*.
- `<meta name="description">`: *[COPY TBD — 1–2 sentences. Draft: "Meet the team behind Tailor Education — a community-interest company delivering expert RSE content, training, and support to UK schools."]*. The existing draft's description is usable but should be reviewed for voice.
- **Canonical URL.** `canonicalPath: "/about"`. Existing draft already emits this correctly.
- `og:type`: `"website"`.
- `og:image`: The page hero has no image. For social previews, use a team portrait (Gareth's) as the `og:image` if a high-quality square portrait is available; otherwise fall back to the site-level default OG image. *[ASSET TBD]*.
- **JSON-LD — `Organization` schema.** The About page is the canonical home of the organisation; emit an `Organization` block with founder, logo, URL, and (where available) social/CompaniesHouse links.

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Tailor Education",
  "url": "https://tailoreducation.org.uk/",
  "logo": "https://tailoreducation.org.uk/logo.png",
  "description": "[COPY TBD — matches meta description]",
  "founder": {
    "@type": "Person",
    "name": "Gareth Esson"
  },
  "sameAs": [
    "[COPY TBD — optional LinkedIn / Companies House URLs]"
  ]
}
```

The `Organization` block lives on `/about` and not elsewhere (Google picks up one canonical org-schema block per site; `/about` is the conventional home).

**No `Person` JSON-LD per team member** in v1. If a journalist or search result specifically needs Gareth's schema.org profile, that can be added later; emitting `Person` records for each team member is noise for an audience that's mostly school procurement.

---

## 10 · Contradictions & clarifications

| Topic | Resolution |
|---|---|
| Relationship to content spec v1 B2 section | The content spec lists five sections: Tailor Education, Meet the team, The Okay to Ask project, Framework alignment, CTA. This spec reduces to six sections (treating the hero as §1) and **drops** Okay to Ask and Framework alignment. Okay to Ask has its own home at `/questions/` and the homepage already gives it weight; framework alignment is B3's (`/our-approach`) job and duplicating it here pulls the page toward an overview it doesn't want to be. Replaced with: "Our approach" (signal + link to B3), "From our blog" (credibility through recent writing). |
| Relationship to existing `about.astro` draft | This spec supersedes the draft. Sections to delete / rewrite are enumerated in §0.2. Key deletions: Okay to Ask section, Framework alignment section, initials-avatar placeholder in team cards (keep as fallback only), hardcoded font and width values in the `<style>` block. |
| Team data source | Hand-maintained TypeScript array in the page frontmatter for v1. Notion-backed team database is a good future move but disproportionate for the v1 ship. The `TeamMember` interface is the contract — when Notion migration happens, the component reads from `getTeamMembers()` and nothing visible changes. |
| Team portrait aspect | 1:1. Portraits belong in a square; 16:9 would waste vertical space and push the name too far down the card. |
| Team card interactivity | Non-interactive by default. The name becomes a link *only* if the `linkedIn` field is present on the data. Whole-card links are wrong for people — the card is content, not a navigation target. |
| Featured blog selection | Hand-picked by slug (`FEATURED_SLUGS` array). Auto-latest as fallback when hand-picks resolve to fewer than 3. Rationale: the About page is the credibility signal; an arbitrary newest post isn't always the right fit for the trust pitch. |
| Blog card reuse | `.blog-index-card` from B9, used verbatim (same markup, same CSS). No extraction into a shared component for v1 — two consumers doesn't justify the refactor. Extract when a third consumer appears. |
| Container width — §1 hero | `--container-max-shell` (72rem). Matches B9 / B5 hero width. Hero inner prose (`about-hero__lede`) uses `max-width: var(--container-max-prose)` inside the shell container — the heading gets the full shell width, the paragraph is measure-constrained. |
| Container width — §2 / §4 / §6 | `--container-max-prose` (44rem). These are prose / CTA sections; reading measure applies. |
| Container width — §3 / §5 | `--container-max-shell` (72rem). Grid sections need the width. |
| Surface rhythm | Tinted hero → page prose → alt-tinted team → page prose → alt-tinted blog → page CTA. Two tint-lift cycles; no dark band. |
| Dark band anywhere on page | No. The About page is the trust page; the dark band is for testimonials and single-moment authority. Using it here would shout where the page wants to speak quietly. |
| Heading alignment | Left. Tailor layer convention. No centred headings anywhere. |
| CTA at end of §4 vs §6 | §4's "Read about our approach" is a secondary link (outline button); §6's "Get in touch" is the page's one primary CTA (solid button). Two buttons at the end of a page dilute the primary action; splitting them by section works. |
| Lede paragraph typography | The mission lede in §1 uses `var(--text-prose-size-lede)` (1.1em) — the existing token in the design system, journalism-spelled as "lede". Matches the pattern used on `/services` philosophy-lead (`.services-philosophy__lead`). The full util-lede family (`--text-util-lede-size`, `--text-util-lede-weight`, `--text-util-lede-lh`, `--text-util-lede-ls`) exists for consumers that want the whole package; `about-hero__lede` uses the prose-size-lede token for size and the standard `--lh-prose` for line-height to match the surrounding prose tempo. |
| Fallback initials pattern | Retained only as the per-card portrait fallback when a team member hasn't supplied a headshot. The existing draft uses initials as the *default* avatar (no real photos); the new spec treats that as a temporary state, not the intended look. |

---

## 11 · Build checklist

### Data layer

1. [ ] Declare `TeamMember` interface and `team: TeamMember[]` array in `src/pages/about.astro` frontmatter. Gareth first; other members in confirmed-join order.
2. [ ] Place team portrait assets in `public/team/` (`gareth.jpg`, etc.). 1:1 aspect, at least 800×800, optimised JPEG or WebP. [ASSET TBD — supply before launch].
3. [ ] Declare `FEATURED_SLUGS: string[]` array with 3 chosen slugs for §5.
4. [ ] In frontmatter: import `getBlogPosts()`, resolve `featuredPosts` from `FEATURED_SLUGS`, back-fill up to 3 from newest-first on fallback.
5. [ ] Import `formatDate`, `deriveExcerpt` from `src/lib/blog-helpers.ts` (already built for B9/C4).

### Removal of existing draft code

6. [ ] Delete the Okay to Ask section (existing draft lines 53–65).
7. [ ] Delete the Framework alignment section (existing draft lines 67–76).
8. [ ] Remove the initials-only team-card placeholder markup (existing draft lines 31–48) and replace with `.about-team-card` renderer (see §12 below).
9. [ ] Remove the existing `.team-card`, `.team-grid`, `.team-card__avatar` etc. CSS rules; replace with `.about-team-card` / `.about-team__grid` equivalents using token-only values.
10. [ ] Replace every raw-value style in the current `<style>` block: `line-height: 1.7` → `var(--lh-prose)`; `line-height: 1.5` → `var(--lh-card)`; `max-width: 36rem` → `var(--container-max-prose)`; `width: 3.5rem; height: 3.5rem` on avatar → use `aspect-ratio: 1 / 1; width: 100%` on `.about-team-card__portrait` (whole-portrait slot, not a small circle).
11. [ ] Replace `<article class="about-page">` root with `<main class="about-page">`.
12. [ ] Replace the current dual-button CTA section (existing draft lines 79–86) with the §6 single-CTA card.

### Template

13. [ ] `<header class="about-hero">` with eyebrow + h1 + mission lede, `--bg-tinted` band.
14. [ ] `<section class="about-intro">` — h2 + 2–3 paragraphs on `--bg-page`, prose container.
15. [ ] `<section class="about-team" aria-labelledby="about-team-title">` — h2 + optional intro + `<ul class="about-team__grid" data-count={team.length}>` on `--bg-surface-alt`.
16. [ ] Render each team member as `<li class="about-team__item">` containing `.about-team-card` with portrait (1:1) → name → role → credentials → bio.
17. [ ] Portrait fallback: `.about-team-card__portrait-fallback` with initials + `aria-hidden="true"` when `portrait` is null.
18. [ ] `<section class="about-approach">` — h2 + paragraph + outline button link to `/our-approach`, on `--bg-page`, prose container.
19. [ ] `{featuredPosts.length > 0 &&` render `<section class="about-blog">` — h2 + optional intro + `<ul class="about-blog__grid">` of B9 `.blog-index-card` instances + right-aligned "View all posts" link, on `--bg-surface-alt`.
20. [ ] `<section class="about-cta">` — `.about-cta__card` containing h2 + sentence + primary button to `/contact`, on `--bg-page` with card on `--bg-tinted`.
21. [ ] Page-scoped `<style>` block: `.about-hero`, `.about-intro`, `.about-team`, `.about-team-card`, `.about-approach`, `.about-blog`, `.about-cta` (and sub-parts). Do **not** add any of these classes to `tailor-site-v2.css`.

### SEO

22. [ ] `<title>` and meta description passed to `BaseLayout`.
23. [ ] JSON-LD `@type: "Organization"` with founder, URL, logo, and optional `sameAs` links. Emitted unconditionally — this is the canonical org-schema block for the site.
24. [ ] `canonicalPath: "/about"` (already in the existing draft).
25. [ ] `og:image`: Gareth portrait (1:1) if square crop available; otherwise site default. [ASSET TBD].

### Verification

26. [ ] Visual review at `< 640px`, `640–1023px`, `≥ 1024px`. Team grid 1 / 2 / 3 columns; blog grid same.
27. [ ] 1-member team: grid collapses to 1-column capped at 24rem, horizontally centred.
28. [ ] 2-member team: grid steps to 2 columns at 640px capped at 48rem, horizontally centred.
29. [ ] 3+ member team: default 1 → 2 → 3 grid with `--container-max-shell` width.
30. [ ] Team card with missing `portrait`: initials fallback renders on `--bg-tinted`, aria-hidden, correct initials derivation.
31. [ ] Team card with missing `credentials`: line omits cleanly; no empty gap.
32. [ ] Team card with `linkedIn`: name is a link, opens in new tab with rel=noopener, visually-hidden "opens in new tab" span present.
33. [ ] Team card without `linkedIn`: name is plain h3 text, no hover state.
34. [ ] Featured blog section with 3 valid slugs: renders 3 cards.
35. [ ] Featured blog section with 2 valid slugs: fills third with newest-first non-featured post, still renders 3 cards.
36. [ ] Featured blog section with 0 posts in archive: section omits entirely, surface rhythm adjusts without a gap.
37. [ ] Keyboard nav: Tab through §4 outline link → team card name links (if any) → blog card links → §5 "View all posts" → §6 "Get in touch". No focus traps.
38. [ ] Screen-reader pass: heading outline reads as §8 describes. Portrait alt text announced for each team member.
39. [ ] Build with zero `FEATURED_SLUGS` entries — relies purely on fallback; confirm 3 cards render.
40. [ ] View page source: JSON-LD `Organization` present; canonical `/about` present; `og:image` either team portrait or site default.
41. [ ] Final grep: existing `.team-card` class returns zero matches in `src/pages/about.astro`. Existing Okay to Ask section markup returns zero matches. Existing Framework alignment section markup returns zero matches.

---

## 12 · Open items for Gareth

- **Page headline copy** — "About Tailor Education" (literal) vs a voice line like "RSE built by teachers, trusted by schools." Working placeholder: "About Tailor Education".
- **Mission lede copy** — 1–2 sentences for the hero `about-hero__lede`.
- **§2 body copy** — "Tailor Education" prose: what Tailor is, why a CIC, optional belief paragraph. 2–3 paragraphs.
- **Team data** — for each team member: name, role, bio (1–2 sentences), portrait asset, portrait alt text, optional credentials line, optional LinkedIn URL. Gareth's entry first; at launch, minimum one entry (Gareth).
- **§4 "Our approach" body copy** — 2–3 sentences signalling how Tailor thinks about RSE.
- **§5 `FEATURED_SLUGS`** — 3 blog post slugs chosen for the About page.
- **§5 intro line copy** (optional) — one-line lede above the blog grid.
- **§6 CTA headline copy** — "Work with us" vs "Get in touch" vs "Start a conversation". Working placeholder: "Work with us".
- **§6 CTA body copy** — one sentence.
- **SEO meta description** — existing draft copy is usable; review for voice.
- **`og:image` asset** — square portrait of Gareth, or site default.
- **JSON-LD `sameAs` links** — optional LinkedIn / Companies House / other public profile URLs.
*Tokens used in this spec are all present in `tailor-site-v2.css` v2.0.0 and require no additions.*
