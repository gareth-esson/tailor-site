# Tailor Layout Spec — C5 Service Page

| Field | Value |
|---|---|
| **Page** | Service page |
| **Route** | `/services/{slug}` |
| **Template** | `src/pages/services/[...slug].astro` (new dynamic template replacing individual static pages) |
| **Layer** | Tailor (default — no `.layer-ota` class) |
| **Instances** | 7 (1 hub + 6 individual) |
| **Version** | 2.0 |
| **Date** | 2026-04-09 |

---

## 0 · Purpose

These are conversion pages. A teacher who is interested in booking Tailor lands here. The tone is professional and trustworthy without being corporate — a teacher reading this should think "these people know what they're doing and I want them in my school", not "this is a sales pitch."

These pages need to feel like proper landing pages — with visual rhythm, momentum toward the enquiry, and enough structural variation to hold attention. But they must resist generic EdTech consultancy patterns. No slick SaaS hero sections. No decorative icon rows. The credibility comes from specific, grounded content presented with confidence — not from landing page theatrics.

The 7 service pages share one template with two behavioural modes: **hub** (RSE Delivery overview) and **individual** (the other 6). The hub introduces the delivery service and navigates down to the four audience-specific delivery pages. The individual pages go deeper on a specific service and drive toward the enquiry form.

The template must handle variation in content depth — RSE Training is the highest-traffic service page with rich content, Circuits has a unique product story (workbook-based, self-paced, simplified keynotes, doodle/game space), while Drop Days may be more straightforward. No separate layout for any of these — the same structural shell flexes to accommodate.

---

## 0.1 · The 7 service pages

| Page | Route | Mode | `serviceParam` | Notes |
|---|---|---|---|---|
| RSE Delivery overview | `/services/rse-delivery` | hub | — | Hub page for all in-school delivery. Links to the four audience-specific delivery pages below. |
| RSE for Primary Schools | `/services/rse-for-primary-schools` | individual | `RSE for primary schools` | |
| RSE for Secondary Schools | `/services/rse-for-secondary-schools` | individual | `RSE for secondary schools` | |
| RSE for SEND & AP (Circuits) | `/services/rse-for-send-and-ap` | individual | `RSE for SEND and AP` | Distinct workbook-based product line. Self-paced, simplified keynotes, doodle/game space in workbooks. |
| Drop Days | `/services/drop-days` | individual | `Drop day delivery` | |
| RSE Training | `/services/rse-training` | individual | `RSE training` | Highest-traffic service page. |
| RSE Policy & Curriculum Planning | `/services/rse-policy-curriculum-planning` | individual | `RSE policy and curriculum planning` | |

**Hub vs individual:** The difference is behavioural, not structural. The hub page renders the same sections but uses its content fields differently — lighter description, a "delivery pathways" navigation block (§3) instead of deep detail, and no primary CTA (because the hub doesn't map to a single enquiry type). The template checks a `mode` field ("hub" | "individual") to toggle these behaviours.

---

## 1 · Data requirements

### 1.1 ServicePage type

New content type. Service page content lives in a Notion database (or hardcoded at launch — see 1.4).

| Field | Type | Required | Notes |
|---|---|---|---|
| `slug` | `string` | Yes | URL routing |
| `mode` | `'hub' \| 'individual'` | Yes | Controls template behaviour |
| `title` | `string` | Yes | Service name — h1 |
| `subtitle` | `string` | Yes | 2–3 sentence value proposition below h1 |
| `heroImage` | `string \| null` | No | URL to hero photography. Null renders hero without image. |
| `heroImageAlt` | `string \| null` | No | Alt text for hero image |
| `description` | `string` | Yes | "What this service is" — 2–3 paragraphs |
| `whoItsFor` | `string` | Yes | "Who it's for" — plain language buyer persona |
| `featureCards` | `FeatureCard[]` | Yes | "What's included" — structured card data |
| `processSteps` | `ProcessStep[] \| null` | No | "How it works" — optional stepped sequence |
| `whatSchoolsGet` | `string \| null` | No | Additional detail prose. Null on hub. |
| `serviceParam` | `string \| null` | No | Enquiry form pre-fill value. Null on hub. |
| `serviceName` | `string \| null` | No | Display name for CTA text. Null on hub. |
| `trustStats` | `TrustStat[] \| null` | No | 2–3 proof points for trust strip |
| `testimonialQuote` | `string \| null` | No | Pull quote text |
| `testimonialSource` | `string \| null` | No | Attribution (role, school name) |
| `metaTitle` | `string` | Yes | SEO |
| `metaDescription` | `string` | Yes | SEO + OG |
| `hubLinks` | `HubLink[] \| null` | No | Only on hub page — links to child delivery pages |

**Supporting types:**

```typescript
interface FeatureCard {
  title: string;       // Bold, specific — e.g. "Pre-visit curriculum consultation"
  description: string; // 1–2 sentences
}

interface ProcessStep {
  number: number;      // 1, 2, 3...
  title: string;       // e.g. "We plan together"
  description: string; // 1–2 sentences
}

interface TrustStat {
  figure: string;      // e.g. "DfE 2026", "KS1–KS5", "500+"
  label: string;       // e.g. "Statutory guidance aligned", "Key stages covered", "Sessions delivered"
}

interface HubLink {
  title: string;       // e.g. "RSE for Primary Schools"
  slug: string;        // e.g. "rse-for-primary-schools"
  summary: string;     // One sentence
}
```

### 1.2 Related blog posts

Source: filter `getBlogPosts()` where `serviceLink` matches a service-specific key.

| Service page | `serviceLink` filter value |
|---|---|
| RSE Delivery overview | `'delivery'` (aggregates all delivery-related posts) |
| RSE for Primary Schools | `'delivery'` |
| RSE for Secondary Schools | `'delivery'` |
| RSE for SEND & AP | `'delivery'` |
| Drop Days | `'drop-days'` |
| RSE Training | `'training'` |
| RSE Policy & Curriculum Planning | `'rse-policy-curriculum-planning'` |

Returns `BlogPost[]`. Used in §8.

### 1.3 Landing pages for topics grid

Source: `getLandingPages()` from `src/lib/content.ts`. Used by the `TopicsOverviewGrid` component in §9. No per-page filtering needed — same grid on all service pages.

### 1.4 Launch strategy

At launch, these 7 pages can be hardcoded as individual `.astro` files in `src/pages/services/` (matching the current pattern for `delivery.astro`), each importing shared components. The dynamic `[...slug].astro` template with Notion-driven content is a v2 migration. This spec describes the target layout regardless of whether the data is hardcoded or CMS-driven — the section structure, styling, and component usage are identical either way.

---

## 2 · Section map

| § | Section | Surface | Container | Hub | Individual |
|---|---|---|---|---|---|
| 1 | Hero (tinted, with image) | `--bg-tinted` | `--container-max-shell` | ✓ | ✓ |
| 2 | Trust strip | `--bg-surface` | `--container-max-shell` | ✓ | ✓ |
| 3 | Hub navigation cards | `--bg-page` | `--container-max-shell` | ✓ | — |
| 4 | What this service is + who it's for | `--bg-page` | `--container-max-prose` | ✓ (lighter) | ✓ |
| 5 | What's included (feature cards) | `--bg-surface-alt` | `--container-max-shell` | ✓ | ✓ |
| 6 | How it works (process steps) | `--bg-page` | `--container-max-shell` | — | ✓ (conditional) |
| 7 | Testimonial + CTA | `--bg-emphasis` | `--container-max-prose` | ✓ (no CTA) | ✓ |
| 8 | Related blog posts `[A15]` | `--bg-page` | `--container-max-shell` | ✓ (conditional) | ✓ (conditional) |
| 9 | Topics overview grid | (component owns) | (component owns) | ✓ | ✓ |
| 10 | CTA: enquiry `[A13]` (closing) | `--bg-page` | (component owns) | — | ✓ |

Page background: `--bg-page`.

**Surface rhythm.** The page has genuine tonal range. It opens with a tinted hero, drops to a clean trust strip, moves through page-ground prose, lifts to a cool tint for the feature cards, returns to page ground for the process steps, then hits a dark authority band for the testimonial + CTA moment — the emotional peak of the page. After that, it eases back to page ground for blog posts and topics, and closes with a soft CTA. The rhythm is: warm → clean → neutral → tinted → neutral → **dark** → neutral → soft.

### Vertical rhythm

- **§1** (hero): `py-[var(--space-struct-y-base)]` — generous, confident. Not homepage-tall, but more presence than a basic page header.
- **§2** (trust strip): `py-[var(--space-global-lg)]` — compact, not a full section.
- **§3–§6**: `py-[var(--space-struct-y-base)]` — consistent section padding.
- **§7** (testimonial + CTA): `py-[var(--space-struct-y-base)]` — the dark band needs breathing room.
- **§8–§9**: `py-[var(--space-struct-y-base)]`.
- **§10** (closing CTA): component manages its own padding.
- Horizontal insets: every section uses `px-[var(--space-global-gutter)]` on the outer wrapper.

### Container widths

- **§1** (hero): `--container-max-shell` (72rem). Full width for the text + image layout.
- **§2** (trust strip): `--container-max-shell` (72rem). Stats spread across the width.
- **§3** (hub nav cards): `--container-max-shell` (72rem). Cards need width.
- **§4** (description + audience): `--container-max-prose` (44rem). Prose reading measure.
- **§5** (feature cards): `--container-max-shell` (72rem). Card grid needs room.
- **§6** (process steps): `--container-max-shell` (72rem). Steps sit in a wide row on desktop.
- **§7** (testimonial + CTA): `--container-max-prose` (44rem). Centred, focused moment.
- **§8** (blog posts): `--container-max-shell` (72rem). Card grid.
- **§9** (topics grid): Component owns its container (update to `--container-max-shell`).
- **§10** (closing CTA): Component uses `--container-max-shell`.

---

## 3 · Section details

### §1 — Hero (tinted, with image)

```
┌──────────────────────────────────────────────────────────────┐
│  --bg-tinted (4% teal wash)                                    │
│                                                                │
│  ┌─────────────────────────────┐  ┌──────────────────────┐    │
│  │  SERVICES (eyebrow)         │  │                      │    │
│  │                             │  │   [Photography:      │    │
│  │  h1  "RSE for Primary      │  │    classroom /        │    │
│  │       Schools"              │  │    delivery moment]   │    │
│  │                             │  │                      │    │
│  │  p   Expert-led RSE         │  │                      │    │
│  │      tailored for KS1 and   │  └──────────────────────┘    │
│  │      KS2, delivered by a    │                               │
│  │      specialist educator    │                               │
│  │      who understands        │                               │
│  │      primary settings.      │                               │
│  │                             │                               │
│  │  [Enquire now]  (btn)       │                               │
│  └─────────────────────────────┘                               │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

Not a dark band — a tinted wash that sits between the header shell and the page content. Warmer and more confident than a plain white hero, but still light enough to feel approachable.

- **Outer wrapper:** Full-bleed `<header class="service-hero">`.
  ```css
  .service-hero {
    background: var(--bg-tinted);
    border-bottom: var(--border-width-xs) solid var(--border-subtle);
  }
  ```
  - `w-full py-[var(--space-struct-y-base)] px-[var(--space-global-gutter)]`

- **Inner wrapper:** `mx-auto w-full max-w-[var(--container-max-shell)]`.
- **Layout:** Two-column on desktop (`≥ 768px`): text left (roughly 55%), image right (roughly 45%). Single column on mobile (text above, image below).

```css
.service-hero__inner {
  display: grid;
  gap: var(--space-global-lg);
  align-items: center;
}

@media (min-width: 768px) {
  .service-hero__inner {
    grid-template-columns: 1fr 0.8fr;
    gap: var(--space-global-xl);
  }
}
```

**Text column (`.service-hero__text`):**

1. **Eyebrow.** `<span class="service-hero__eyebrow">` — text: "Services" (all pages) or "Services · RSE Delivery" (on delivery sub-pages).
   - `font-family: var(--font-tailor-body-stack)`, `font-size: var(--text-card-size-body)`, `font-weight: var(--font-weight-semibold)`.
   - `color: var(--brand-accent-text)`.
   - `text-transform: uppercase`, `letter-spacing: var(--text-eyebrow-ls)`.
   - `margin-bottom: var(--space-global-xs)`.

2. **Page title.** `<h1 class="service-hero__title">`.
   - `font-family: var(--font-tailor-heading-stack)`, `font-size: var(--text-display-size-h1)`, `font-weight: var(--heading-weight-h1)`, `color: var(--text-heading)`.
   - `line-height: var(--lh-display)`.
   - `margin: 0 0 var(--space-global-sm)`.

3. **Value proposition.** `<p class="service-hero__subtitle">` — 2–3 sentences. Not a tagline — a proper statement of what this service does and why it matters.
   - `font-family: var(--font-tailor-body-stack)`, `font-size: var(--text-prose-size-body)`, `color: var(--text-body)`.
   - `line-height: var(--lh-body)`.
   - `margin: 0 0 var(--space-global-md)`.

4. **Hero CTA button** (individual pages only).
   - `<a href="/contact?service={serviceParam}" class="btn btn--std btn--primary has-icon-hover">` — text: "Enquire now".
   - Analytics attributes: `data-analytics-event="cta_click"`, `data-analytics-cta-type="hero_enquire"`, `data-analytics-service-type={serviceParam}`.
   - **Hub page:** No button. The hub directs readers to sub-pages via §3, not to an enquiry form.

**Image column (`.service-hero__image`):**

- `<img>` with `border-radius: var(--radius-lg)`, `width: 100%`, `height: auto`, `object-fit: cover`, `display: block`.
- `aspect-ratio: 4 / 3` — landscape but not extreme. Works well for classroom/delivery photography.
- **Conditional:** If `heroImage` is null, the hero renders as single-column text-only. The grid collapses to `grid-template-columns: 1fr` and the text column gets `max-width: var(--container-max-prose)`.
- `alt` attribute: uses `heroImageAlt` or falls back to `"Tailor Education delivering {title}"`.
- `loading: eager` — above the fold, LCP candidate.

**Mobile:** Image appears below the text column. Full width within gutters.

### §2 — Trust strip

```
┌──────────────────────────────────────────────────────┐
│  --bg-surface, border-bottom                           │
│                                                        │
│  DfE 2026              KS1–KS5           500+          │
│  Statutory guidance    Key stages        Sessions      │
│  aligned               covered           delivered     │
│                                                        │
└──────────────────────────────────────────────────────┘
```

A compact strip of 2–3 proof points immediately below the hero. Not a full section — more like a visual separator that earns trust before the reader commits to scrolling further. These are the numbers and credentials that matter to a school leader.

- **Outer wrapper:** `<section class="service-trust-strip">`.
  ```css
  .service-trust-strip {
    background: var(--bg-surface);
    border-bottom: var(--border-width-xs) solid var(--border-subtle);
  }
  ```
  - `w-full py-[var(--space-global-lg)] px-[var(--space-global-gutter)]`

- **Inner wrapper:** `mx-auto w-full max-w-[var(--container-max-shell)]`.

- **Layout:** `display: flex`, `justify-content: center`, `gap: var(--space-global-xl)`, `flex-wrap: wrap`.

**Each stat (`.trust-stat`):**

| Property | Value |
|---|---|
| `text-align` | `center` |
| `min-width` | `8rem` |

**Figure (`.trust-stat__figure`):**

| Property | Value |
|---|---|
| `font-family` | `var(--font-tailor-heading-stack)` |
| `font-size` | `var(--text-display-size-h3)` |
| `font-weight` | `var(--heading-weight-h2)` |
| `color` | `var(--text-heading)` |
| `line-height` | `var(--lh-heading)` |
| `margin` | `0` |

**Label (`.trust-stat__label`):**

| Property | Value |
|---|---|
| `font-family` | `var(--font-tailor-body-stack)` |
| `font-size` | `var(--text-card-size-body)` |
| `color` | `var(--text-body-muted)` |
| `margin-top` | `var(--space-global-xs)` |

**Conditional:** If `trustStats` is null or empty, the entire §2 strip is omitted. The page flows from hero directly to §3/§4 — still works.

**Content guidance.** These should be real, specific, and verifiable. "DfE 2026 aligned", "KS1–KS5", "PSHE Association mapped" — not vague marketing numbers. The stats can vary per service page (e.g. Circuits might show "Self-paced workbook format" instead of a session count). Keep to 2–3 items maximum — more than that dilutes the effect.

### §3 — Hub navigation cards (hub mode only)

```
┌──────────────────────────────────────────────────────┐
│  --bg-page                                             │
│                                                        │
│  h2  "How we deliver RSE"                              │
│                                                        │
│  ┌────────────────────────┐  ┌────────────────────────┐│
│  │  RSE for Primary       │  │  RSE for Secondary     ││
│  │  Schools               │  │  Schools               ││
│  │  [one-line summary]    │  │  [one-line summary]    ││
│  │  Learn more →          │  │  Learn more →          ││
│  └────────────────────────┘  └────────────────────────┘│
│  ┌────────────────────────┐  ┌────────────────────────┐│
│  │  RSE for SEND & AP     │  │  Drop Days             ││
│  │  (Circuits)            │  │                        ││
│  │  [one-line summary]    │  │  [one-line summary]    ││
│  │  Learn more →          │  │  Learn more →          ││
│  └────────────────────────┘  └────────────────────────┘│
│                                                        │
└──────────────────────────────────────────────────────┘
```

- **Conditional:** Only renders when `mode === 'hub'`.
- **Outer wrapper:** `<section class="service-hub-nav">`, no surface class — sits on `--bg-page`.
  - `w-full py-[var(--space-struct-y-base)] px-[var(--space-global-gutter)]`
- **Inner wrapper:** `mx-auto w-full max-w-[var(--container-max-shell)]`.

**Section heading:**
- `<h2>` — "How we deliver RSE" (or similar — copy TBD).
- `font-family: var(--font-tailor-heading-stack)`, `font-size: var(--text-prose-size-h2)`, `font-weight: var(--heading-weight-h2)`, `color: var(--text-heading)`.
- `margin: 0 0 var(--space-global-md)`.

**Card grid:** `display: grid`, `gap: var(--space-global-sm)`. `1fr` on mobile, `repeat(2, 1fr)` at `≥ 640px`.

**Each hub nav card (`.hub-nav-card`):**

| Property | Value |
|---|---|
| `display` | `flex`, `flex-direction: column` |
| `padding` | `var(--space-global-lg)` |
| `background` | `var(--bg-surface)` |
| `border` | `var(--border-width-xs) solid var(--border-subtle)` |
| `border-radius` | `var(--radius-lg)` |
| `text-decoration` | `none` |
| `color` | `inherit` |
| `transition` | `border-color var(--transition-duration) var(--transition-easing)` |
| `:hover` | `border-color: var(--brand-accent)` |

**Card contents:**

1. **Title** (`.hub-nav-card__title`): `--font-tailor-heading-stack`, `--text-card-size-h2`, `--heading-weight-h2`, `--text-heading`. `line-height: var(--lh-heading-sub)`. `margin: 0 0 var(--space-global-xs)`.
2. **Summary** (`.hub-nav-card__summary`): `--font-tailor-body-stack`, `--text-card-size-body`, `--text-body-muted`. `line-height: var(--lh-body)`. `margin: 0 0 var(--space-global-sm)`. `flex-grow: 1` — pushes action link to bottom.
3. **Action link** (`.hub-nav-card__link`): `--text-card-size-body`, `--font-weight-bold`, `--link-action-color`. `::after { content: ' →' }`. Text: "Learn more".

Whole card is an `<a href="/services/{slug}">`.

### §4 — What this service is + who it's for

```
┌──────────────────────────────────────────────────────┐
│  --bg-page                                             │
│                                                        │
│  h2  "What this service is"                            │
│  p   [description prose — 2-3 paragraphs]              │
│                                                        │
│  ┌────────────────────────────────────────────┐        │
│  │  --bg-surface, border-left: brand-accent    │        │
│  │                                             │        │
│  │  WHO IT'S FOR (eyebrow)                     │        │
│  │  "For schools who want expert-led RSE       │        │
│  │   delivery covering sensitive topics..."    │        │
│  └────────────────────────────────────────────┘        │
│                                                        │
│  h2  "What schools get"  (conditional)                 │
│  p   [additional detail prose]                         │
│                                                        │
└──────────────────────────────────────────────────────┘
```

- **Outer wrapper:** `<section class="service-detail">`, on `--bg-page` ground.
  - `w-full py-[var(--space-struct-y-base)] px-[var(--space-global-gutter)]`
- **Inner wrapper:** `mx-auto w-full max-w-[var(--container-max-prose)]`.

**"What this service is" block:**
- **Heading:** `<h2>` with standard section title tokens (`--font-tailor-heading-stack`, `--text-prose-size-h2`, `--heading-weight-h2`, `--text-heading`). `margin: 0 0 var(--space-global-sm)`.
- **Prose:** `--font-tailor-body-stack`, `--text-prose-size-body`, `--text-body`, `line-height: var(--lh-prose)`. Paragraphs with `margin-bottom: var(--space-global-sm)`.

**"Who it's for" callout (`.service-audience-callout`):**

The buyer persona gets visual distinction — a contained callout rather than just another h2 + paragraph. This breaks the prose rhythm and signals "this is about you."

| Property | Value |
|---|---|
| `background` | `var(--bg-surface)` |
| `border-left` | `4px solid var(--brand-accent)` |
| `border-radius` | `0 var(--radius-md) var(--radius-md) 0` |
| `padding` | `var(--space-global-lg)` |
| `margin` | `var(--space-global-lg) 0` |

**Callout eyebrow:** "Who it's for" — `--text-card-size-body`, `--font-weight-semibold`, `--brand-accent-text`, uppercase, `letter-spacing: var(--text-eyebrow-ls)`. `margin-bottom: var(--space-global-xs)`.

**Callout body:** `--text-prose-size-body`, `--text-body`, `line-height: var(--lh-body)`. `margin: 0`.

**"What schools get":** Conditional — only renders if `whatSchoolsGet` is not null. Standard h2 + prose. Omitted on the hub page.

**Circuits variation:** Same structure. The description prose tells the Circuits workbook story naturally. The "Who it's for" callout targets SEND coordinators and AP settings.

### §5 — What's included (feature cards)

```
┌──────────────────────────────────────────────────────────────┐
│  --bg-surface-alt                                              │
│                                                                │
│  h2  "What's included"                                         │
│                                                                │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐ │
│  │  Pre-visit        │  │  Curriculum-      │  │  Age-         │ │
│  │  consultation     │  │  aligned lessons  │  │  appropriate  │ │
│  │                   │  │                   │  │  content      │ │
│  │  We plan the      │  │  Every session    │  │  Matched to   │ │
│  │  topics, year     │  │  maps to DfE      │  │  your year    │ │
│  │  groups, and      │  │  guidance and     │  │  groups and   │ │
│  │  approach with    │  │  PSHE framework.  │  │  student      │ │
│  │  you first.       │  │                   │  │  needs.       │ │
│  └──────────────────┘  └──────────────────┘  └──────────────┘ │
│                                                                │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐ │
│  │  Post-session     │  │  Safeguarding-    │  │  Disclosure-  │ │
│  │  summary          │  │  informed         │  │  aware        │ │
│  │                   │  │  design           │  │  delivery     │ │
│  │  Written debrief  │  │  Activities       │  │  ...          │ │
│  │  and follow-up    │  │  designed with    │  │               │ │
│  │  resources.       │  │  KCSIE in mind.   │  │               │ │
│  └──────────────────┘  └──────────────────┘  └──────────────┘ │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

The "What's included" list becomes a card grid. **No icons** — the specificity of the card titles and descriptions does the credibility work. The art direction brief warns against "generic brochure pages with icon rows" and it's right. A decorative shield icon next to "Safeguarding-informed design" adds nothing. The words "safeguarding-informed design" are already doing the job.

- **Outer wrapper:** Full-bleed `<section class="service-features">` with `--bg-surface-alt`.
  - `w-full py-[var(--space-struct-y-base)] px-[var(--space-global-gutter)]`
  - `style="background: var(--bg-surface-alt);"`
- **Inner wrapper:** `mx-auto w-full max-w-[var(--container-max-shell)]`.

**Section heading:** Same tokens as other h2s. `margin: 0 0 var(--space-global-md)`.

**Card grid:**
- `display: grid`, `gap: var(--space-global-sm)`.
- `1fr` on mobile, `repeat(2, 1fr)` at `≥ 640px`, `repeat(3, 1fr)` at `≥ 768px`.

**Each feature card (`.feature-card`):**

| Property | Value |
|---|---|
| `background` | `var(--bg-surface)` |
| `border` | `var(--border-width-xs) solid var(--border-subtle)` |
| `border-radius` | `var(--radius-lg)` |
| `padding` | `var(--space-global-lg)` |

**Card title (`.feature-card__title`):**

| Property | Value |
|---|---|
| `font-family` | `var(--font-tailor-heading-stack)` |
| `font-size` | `var(--text-card-size-h3)` |
| `font-weight` | `var(--heading-weight-h3)` |
| `color` | `var(--text-heading)` |
| `line-height` | `var(--lh-heading-sub)` |
| `margin` | `0 0 var(--space-global-xs)` |

**Card description (`.feature-card__text`):**

| Property | Value |
|---|---|
| `font-family` | `var(--font-tailor-body-stack)` |
| `font-size` | `var(--text-card-size-body)` |
| `color` | `var(--text-body-muted)` |
| `line-height` | `var(--lh-body)` |
| `margin` | `0` |

**Content guidance.** Each card title should be specific and outcome-oriented, not generic. "Pre-visit curriculum consultation" not "Planning". "Post-session summary and resources" not "Follow-up". The specificity is what separates this from a generic icon row. Pages with fewer inclusions (e.g. Drop Days) can have 3–4 cards; richer pages (RSE Training, Circuits) can have 6. The grid handles both.

### §6 — How it works (process steps)

```
┌──────────────────────────────────────────────────────┐
│  --bg-page                                             │
│                                                        │
│  h2  "How it works"                                    │
│                                                        │
│  ①                      ②                    ③         │
│  We plan together       We deliver           You get   │
│                                              results   │
│  Pre-visit call to      Expert-led sessions             │
│  agree topics, year     tailored to your     Written    │
│  groups, and approach.  curriculum.          debrief +  │
│                                              resources. │
│                                                        │
└──────────────────────────────────────────────────────┘
```

A 3–4 step sequence that gives the teacher a mental model of the engagement, not just a feature list. This answers the question "what actually happens if I book this?"

- **Conditional:** Only renders when `processSteps` is not null and `mode === 'individual'`. Hub pages don't need this — they direct to sub-pages. Some individual pages may also skip it if the service doesn't have a clear sequential process.
- **Outer wrapper:** `<section class="service-process">`, on `--bg-page` ground.
  - `w-full py-[var(--space-struct-y-base)] px-[var(--space-global-gutter)]`
- **Inner wrapper:** `mx-auto w-full max-w-[var(--container-max-shell)]`.

**Section heading:** Same h2 tokens. `margin: 0 0 var(--space-global-md)`.

**Steps layout:**
- `display: grid`, `gap: var(--space-global-md)`.
- `1fr` on mobile, `repeat(auto-fit, minmax(14rem, 1fr))` on desktop — adapts to 3 or 4 steps.

**Each step (`.process-step`):**

| Property | Value |
|---|---|
| `text-align` | `left` |
| `padding` | `0` |

**Step number (`.process-step__number`):**

| Property | Value |
|---|---|
| `display` | `inline-flex`, `align-items: center`, `justify-content: center` |
| `width` | `2.5rem` |
| `height` | `2.5rem` |
| `border-radius` | `var(--radius-pill)` |
| `background` | `var(--bg-tinted)` |
| `color` | `var(--brand-accent-text)` |
| `font-family` | `var(--font-tailor-heading-stack)` |
| `font-size` | `var(--text-prose-size-body)` |
| `font-weight` | `var(--font-weight-bold)` |
| `margin-bottom` | `var(--space-global-sm)` |

**Step title (`.process-step__title`):**

| Property | Value |
|---|---|
| `font-family` | `var(--font-tailor-heading-stack)` |
| `font-size` | `var(--text-card-size-h3)` |
| `font-weight` | `var(--heading-weight-h3)` |
| `color` | `var(--text-heading)` |
| `line-height` | `var(--lh-heading-sub)` |
| `margin` | `0 0 var(--space-global-xs)` |

**Step description (`.process-step__text`):**

| Property | Value |
|---|---|
| `font-family` | `var(--font-tailor-body-stack)` |
| `font-size` | `var(--text-card-size-body)` |
| `color` | `var(--text-body-muted)` |
| `line-height` | `var(--lh-body)` |
| `margin` | `0` |

No connecting lines or arrows between steps. The numbered circles and the left-to-right reading order provide sufficient sequence. Connecting lines look gimmicky and add implementation complexity for no gain.

### §7 — Testimonial + CTA (dark authority band)

```
┌──────────────────────────────────────────────────────┐
│  --bg-emphasis (#1E2A3A), all text --text-on-dark       │
│                                                        │
│  "The sessions were exactly what our students          │
│   needed. Delivered with sensitivity, honesty,         │
│   and real expertise."                                 │
│                                                        │
│  — Head of PSHE, [School Name]                         │
│                                                        │
│  [Enquire about RSE for primary schools]   (btn)       │
│                                                        │
└──────────────────────────────────────────────────────┘
```

The emotional peak of the page. The testimonial and the primary CTA sit together on a dark band — the only dark section on the page. This creates a natural pause point and visual climax: social proof and conversion in one focused moment.

A single pull quote. Not a carousel, not a grid. One quote, relevant to this specific service.

- **Outer wrapper:** Full-bleed `<section class="service-proof-band">`.
  ```css
  .service-proof-band {
    background: var(--bg-emphasis);
    color: var(--text-on-dark);
  }
  ```
  - `w-full py-[var(--space-struct-y-base)] px-[var(--space-global-gutter)]`
- **Inner wrapper:** `mx-auto w-full max-w-[var(--container-max-prose)]`, `text-align: center`.

**Quote text (`.service-proof-band__quote`):**

| Property | Value |
|---|---|
| `font-family` | `var(--font-tailor-body-stack)` |
| `font-size` | `var(--text-display-size-h3)` |
| `font-style` | `italic` |
| `font-weight` | `var(--font-weight-regular)` |
| `color` | `var(--text-on-dark)` |
| `line-height` | `var(--lh-heading)` |
| `margin` | `0 0 var(--space-global-md)` |

Slightly larger than body text — the quote is the visual centrepiece here, not a sidebar element.

**Attribution (`.service-proof-band__source`):**

| Property | Value |
|---|---|
| `font-family` | `var(--font-tailor-body-stack)` |
| `font-size` | `var(--text-card-size-body)` |
| `font-weight` | `var(--font-weight-medium)` |
| `color` | `var(--text-on-dark)` |
| `opacity` | `0.8` |
| `margin-bottom` | `var(--space-global-lg)` |

Prefixed with "— ".

**CTA button** (individual pages only):
- `<a class="btn btn--std btn--white-primary has-icon-hover">` — white button on dark background.
- Text: "Enquire about {serviceName}".
- Links to `/contact?service={serviceParam}`.
- Analytics attributes: `data-analytics-event="cta_click"`, `data-analytics-cta-type="proof_band_enquire"`, `data-analytics-service-type={serviceParam}`.
- **Hub page:** Omit the button. The testimonial still renders on the dark band but without the CTA. If no testimonial exists either, the entire §7 is omitted.

**Link to testimonials:** Below the button (or below attribution on hub), a text link: "Read more testimonials →". `color: var(--text-on-dark)`, `opacity: 0.7`, hover `opacity: 1`.

**Conditional:** If `testimonialQuote` is null and `mode === 'hub'`, omit §7 entirely. If `testimonialQuote` is null and `mode === 'individual'`, render a simplified dark band with just the CTA and no quote — still provides the visual break and conversion moment.

### §8 — Related blog posts `[A15]`

```
┌──────────────────────────────────────────────────────┐
│  --bg-page                                             │
│                                                        │
│  h2  "Related articles"                                │
│                                                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ [Image]   │  │ [Image]   │  │ [Image]   │             │
│  │ Audience  │  │ Audience  │  │ Audience  │             │
│  │ Title     │  │ Title     │  │ Title     │             │
│  │ Author    │  │ Author    │  │ Author    │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│                                                        │
└──────────────────────────────────────────────────────┘
```

- **Conditional:** Only renders if `relatedPosts.length > 0`.
- **Outer wrapper:** `<section class="service-blog">`, on `--bg-page` ground.
  - `w-full py-[var(--space-struct-y-base)] px-[var(--space-global-gutter)]`
- **Inner wrapper:** `mx-auto w-full max-w-[var(--container-max-shell)]`.

**Section heading:** Same h2 tokens. `margin: 0 0 var(--space-global-md)`.

**Blog card grid:** `display: grid`, `gap: var(--space-global-sm)`. `1fr` on mobile, `repeat(2, 1fr)` at `≥ 640px`, `repeat(3, 1fr)` at `≥ 768px`.

**Each card:** Same pattern as C4 §5 and C3 §6. Uses `.card` base class.

```html
<a href="/blog/{slug}" class="card blog-card">
  {featuredImage && (
    <div class="card__img">
      <img src={featuredImage} alt="" loading="lazy"
           style="aspect-ratio: 16/9; object-fit: cover; width: 100%;" />
    </div>
  )}
  <div class="card__body">
    {targetAudience && <div class="card__eyebrow">{targetAudience}</div>}
    <div class="card__title">{title}</div>
    <div class="blog-card__author">By {author}</div>
  </div>
</a>
```

Featured image on card is conditional — card renders without image slot if none. Whole card is a link. Standard card hover.

### §9 — Topics overview grid

Existing `TopicsOverviewGrid.astro` component, used as-is. Shows all 23 landing pages grouped by 7 app categories. Demonstrates breadth. Same grid across all 7 service pages.

```astro
<TopicsOverviewGrid />
```

**Container update needed:** Current `max-w-5xl` → `max-w-[var(--container-max-shell)]`.

### §10 — CTA: service enquiry `[A13]` (closing)

- **Conditional:** Only renders when `mode === 'individual'`.
- Uses `CtaServiceEnquiry.astro` with `variant="alt"`.

```astro
<CtaServiceEnquiry
  serviceName={serviceName}
  serviceParam={serviceParam}
  variant="alt"
/>
```

The `alt` variant uses `--bg-surface-alt` with centred text. Softer closing note for readers who've scrolled through everything. Sits below the topics overview grid — the final element on the page.

**Container update needed:** Current `max-w-4xl` → `max-w-[var(--container-max-shell)]`.

---

## 4 · Template structure

```
<article class="service-page" data-pagefind-body>

  <header class="service-hero">                    ← --bg-tinted
    §1: Eyebrow + h1 + value prop + hero CTA + image
  </header>

  {trustStats && (
    <section class="service-trust-strip">          ← --bg-surface
      §2: 2–3 proof points
    </section>
  )}

  {mode === 'hub' && (
    <section class="service-hub-nav">              ← --bg-page
      §3: Hub navigation cards
    </section>
  )}

  <section class="service-detail">                 ← --bg-page
    §4: What it is + who it's for callout + what schools get
  </section>

  <section class="service-features">               ← --bg-surface-alt
    §5: Feature card grid
  </section>

  {processSteps && mode === 'individual' && (
    <section class="service-process">              ← --bg-page
      §6: How it works steps
    </section>
  )}

  <section class="service-proof-band">             ← --bg-emphasis (dark)
    §7: Testimonial quote + CTA button
  </section>

  {relatedPosts.length > 0 && (
    <section class="service-blog">                 ← --bg-page
      §8: Blog card grid
    </section>
  )}

  §9: <TopicsOverviewGrid />                       ← component owns surface

  {mode === 'individual' && (
    §10: <CtaServiceEnquiry variant="alt" />       ← component card: --bg-surface-alt
  )}

</article>
```

---

## 5 · Layer scoping

```html
<body>
  <header>…shell (Lexend)…</header>
  <main id="main">
    <!-- C5 content — Tailor layer (default, no class needed) -->
  </main>
  <footer>…shell (Lexend)…</footer>
</body>
```

No `.layer-ota` on `<main>`. Tailor layer throughout. Lexend for all typography, neutral/tinted surfaces, teal accent for actions.

---

## 6 · Responsive behaviour

| Breakpoint | Hero layout | Feature cards | Process steps | Blog grid | Topics grid |
|---|---|---|---|---|---|
| `< 640px` | Stacked (text → image) | 1 column | 1 column | 1 column | 1 column |
| `≥ 640px` | Stacked (text → image) | 2 columns | 2 columns | 2 columns | 1 column |
| `≥ 768px` | 2-column (text + image) | 3 columns | Auto-fit row | 3 columns | 2 columns |
| `≥ 1024px` | Same | Same | Same | Same | 3 columns |

The hero switches to its two-column layout at 768px. Below that, the image appears below the text at full width (within gutters). Trust strip items wrap naturally on narrow viewports.

---

## 7 · SEO & metadata

- **`<title>`:** `{metaTitle}` or `"{title} — RSE for Schools | Tailor Education"` as fallback.
- **`<meta name="description">`:** `{metaDescription}`.
- **`og:image`:** `{heroImage}` when available. Provides social sharing image.
- **`canonicalPath`:** `/services/{slug}/`
- **JSON-LD — Service:**

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "{title}",
  "description": "{metaDescription}",
  "provider": {
    "@type": "Organization",
    "name": "Tailor Education",
    "url": "https://tailoreducation.org.uk"
  }
}
```

Hub page uses `"@type": "WebPage"` with `"about": { "@type": "Service", "name": "RSE Delivery" }` instead.

---

## 8 · Accessibility

- `<article>` as top-level semantic element with `data-pagefind-body`.
- `<header>` for §1.
- Each content section uses semantic `<section>` elements with heading landmarks (`<h2>`).
- Hero image: `alt` from `heroImageAlt` or meaningful fallback (not empty — this is a content image, not decorative).
- Hub navigation cards: each is an `<a>` — fully clickable block link with focus ring.
- Feature cards: static content, not links. No interactive behaviour needed.
- Process step numbers: the number is visible text inside the circle, not an image — screen readers announce it naturally.
- Dark band (§7): all text uses `--text-on-dark` which passes AAA contrast (13.07:1 against `--bg-emphasis`). White button passes AA (5.6:1).
- Blog cards: whole-card `<a>` links. Featured images use `alt=""` (decorative in card context — the title is the accessible label).
- Trust strip: all content is text — no images or icons that need alt text.
- All heading hierarchy is sequential: h1 (§1), h2 (§3, §4 blocks, §5, §6, §7 implicit, §8, §9).

---

## 9 · Contradictions & clarifications

| Topic | Resolution |
|---|---|
| Instance count | Content spec says 3 instances. Updated to 7 per Gareth's prompt: 1 hub + 4 delivery audience pages + training + policy/curriculum. |
| Icon cards | Art direction brief warns against "generic brochure pages with icon rows." Feature cards (§5) use bold title + description only, no icons. Specificity of content provides credibility, not decorative icons. |
| Dark band | The `--bg-emphasis` band (§7) is the only dark section in the C5 template. It creates the page's emotional peak — social proof and conversion in one focused moment. This is a deliberate design device, not a generic pattern. |
| Hero CTA button | Individual pages get an "Enquire now" button in the hero (§1) AND the dark band CTA (§7) AND the closing CTA (§10). Three conversion opportunities at different scroll positions. Hub page gets none — it navigates to sub-pages instead. |
| Hub page CTA | Hub page does not render hero CTA button, §7 CTA button, or §10 closing CTA. Teachers navigate to a specific delivery page first. |
| RSE Training duplication | RSE Training previously lived at `/rse-training` as B4. Moves to `/services/rse-training` as C5. Old route redirects. |
| Circuits as separate layout | No separate layout. Circuits page uses same template. Unique product story expressed through content (§4 description, §5 feature cards, §6 process steps). |
| Container widths | Current `max-w-4xl` → `--container-max-shell` (72rem) for wide sections, `--container-max-prose` (44rem) for reading. `TopicsOverviewGrid` from `max-w-5xl` → `--container-max-shell`. `CtaServiceEnquiry` from `max-w-4xl` → `--container-max-shell`. |
| Trust strip vs trust badges | The trust strip (§2) uses text stat blocks, not logo badges. Framework alignment logos (DfE, PSHE Association) are better suited to the Our Approach page (B3) where they can be contextualised. The service page trust strip is about quick credibility, not detailed accreditation. |
| Testimonial format | Single pull quote on dark band. Not a carousel, not a grid, not a slider. One `<blockquote>` with attribution, centred. |
| Blog card images | Optional `featuredImage` in `.card__img` slot. Cards without images still work. Matches C4 pattern. |
| Blog grid columns | 3 columns at `≥ 768px`, matching C3 and C4. Current implementation is 2 columns max. |
| Vertical padding | Current `py-[var(--space-global-lg)]` (2rem) → `py-[var(--space-struct-y-base)]` (clamp 4–6rem). Trust strip stays compact at `py-[var(--space-global-lg)]`. |
| Heading alignment | Left-aligned throughout. Only the dark band (§7) centres text. The closing CTA (§10, `alt` variant) also centres by design. |
| No-quote individual page | If an individual page has no testimonial, §7 still renders as a dark CTA band without the quote. The visual break and conversion moment are preserved. |
| Service Link filter for hub | Hub filters by `serviceLink === 'delivery'`, catching all delivery-related posts. Individual delivery sub-pages use the same filter. Overlap is intentional. |

---

## 10 · Build checklist

### Template restructure

1. [ ] Decide launch approach: 7 individual `.astro` files (simpler) or 1 dynamic `[...slug].astro` (cleaner)
2. [ ] Create `/services/rse-delivery.astro` — hub page
3. [ ] Create `/services/rse-for-primary-schools.astro`
4. [ ] Create `/services/rse-for-secondary-schools.astro`
5. [ ] Create `/services/rse-for-send-and-ap.astro` (Circuits)
6. [ ] Create `/services/rse-training.astro` (replaces B4)
7. [ ] Update `/services/rse-policy-curriculum-planning.astro`
8. [ ] Update `/services/drop-days.astro`
9. [ ] Redirect `/services/delivery` → `/services/rse-delivery`

### New sections to build

10. [ ] §1 hero: tinted band with 2-column text + image layout, hero CTA button, responsive grid
11. [ ] §2 trust strip: centred flex row of stat blocks
12. [ ] §3 hub nav cards: 2-column grid of delivery sub-page links (hub only)
13. [ ] §4 service detail: prose + "who it's for" accent-bordered callout
14. [ ] §5 feature cards: 3-column card grid on `--bg-surface-alt` band
15. [ ] §6 process steps: numbered step grid with tinted circles (conditional)
16. [ ] §7 dark proof band: `--bg-emphasis` section with centred quote, attribution, and white CTA button
17. [ ] Implement conditional rendering for hub vs individual mode across §1 CTA, §3, §6, §7 CTA, §10

### Component updates

18. [ ] Update `CtaServiceEnquiry.astro` container from `max-w-4xl` to `max-w-[var(--container-max-shell)]`
19. [ ] Update `TopicsOverviewGrid.astro` container from `max-w-5xl` to `max-w-[var(--container-max-shell)]`
20. [ ] Add `--container-max-shell` to blog card grid container
21. [ ] Expand blog card grid to 3 columns at `≥ 768px`
22. [ ] Add optional `featuredImage` to blog cards (`.card__img` slot)

### Content

23. [ ] Write content for all 7 service pages (descriptions, audience callouts, feature cards, process steps)
24. [ ] Source hero photography per service page (or identify shared images)
25. [ ] Define trust strip stats per service page (2–3 items each)
26. [ ] Source testimonial quotes per service line
27. [ ] Write process steps for applicable service pages

### Routing

28. [ ] Set up redirect from `/rse-training` → `/services/rse-training`
29. [ ] Set up redirect from `/services/delivery` → `/services/rse-delivery`
30. [ ] Update A3 navigation dropdown to reflect new service page routes
31. [ ] Update `CtaBringToSchool.astro` service target map for new routes

### Verification

32. [ ] Visual review: all 7 pages at mobile, tablet, desktop breakpoints
33. [ ] Confirm hero renders correctly with and without image (single-column fallback)
34. [ ] Confirm trust strip renders correctly with and without stats
35. [ ] Confirm hub page omits CTA buttons and shows navigation cards
36. [ ] Confirm individual pages omit §3 and show all three CTAs (hero, dark band, closing)
37. [ ] Confirm dark band contrast — all text/button combinations pass WCAG AA
38. [ ] Confirm feature card grid handles 3–6 cards gracefully
39. [ ] Confirm process steps handle 3–4 steps without visual breaking
40. [ ] Confirm blog section omits gracefully when no related posts
41. [ ] Confirm enquiry form pre-fills correctly from each service page
42. [ ] Confirm Circuits page content reads naturally within standard template
43. [ ] Verify topics overview grid renders consistently across all 7 pages
44. [ ] Test all internal links (hub → sub-pages, blog cards, topic links, CTAs → contact)
45. [ ] Pagefind: confirm all 7 pages are indexed

---

*Document version: 2.0 | Date: 9 April 2026*
