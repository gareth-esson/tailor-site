# Tailor Layout Spec — C5 Service Page

| Field | Value |
|---|---|
| **Page** | Service page |
| **Route** | `/services/{slug}` |
| **Template** | 6 static `.astro` files in `src/pages/services/` (one per service) sharing the same component shell |
| **Layer** | Tailor (default — no `.layer-ota` class) |
| **Instances** | 6 |
| **Version** | 3.0 |
| **Date** | 2026-04-10 |

---

## 0 · Purpose

These are conversion pages. A teacher who is interested in booking Tailor lands here already knowing their context: "I run KS3 PSHE, I need secondary delivery", "I coordinate SEND provision, I need Circuits", "I'm the PSHE lead rewriting our policy, I need policy and curriculum planning." The page's job is to confirm the fit and move them toward the enquiry — not to explain what RSE delivery is as a concept.

The tone is professional and trustworthy without being corporate. A teacher reading this should think "these people know what they're doing and I want them in my school", not "this is a sales pitch."

These pages need to feel like proper landing pages — anchored by photography, with visual rhythm and momentum toward the enquiry. But they must resist generic EdTech consultancy patterns. No slick SaaS hero sections. No decorative icon rows. No floating callout boxes chopping up the page. The credibility comes from specific, grounded content presented with confidence, plus real photography of real delivery.

All 6 service pages share one template. The template must handle variation in content depth — RSE Training is the highest-traffic page with rich content, Circuits has a unique product story (workbook-based, self-paced, simplified keynotes, doodle/game space), while Drop Days may be more straightforward. No separate layout for any of these — the same structural shell flexes to accommodate.

**No hub page.** Earlier drafts included an RSE Delivery hub at `/services/rse-delivery` that routed to the four delivery variants. This has been removed. Teachers arriving at /services already know their context and pick their variant directly. The /services page carries the routing job; C5 carries conversion only. The C5 template has no "hub mode" — every section in this spec renders on every C5 instance (with only the usual null-content conditionals).

---

## 0.1 · The 6 service pages

| Page | Route | `serviceParam` | Notes |
|---|---|---|---|
| RSE for Primary Schools | `/services/rse-for-primary-schools` | `RSE for primary schools` | |
| RSE for Secondary Schools | `/services/rse-for-secondary-schools` | `RSE for secondary schools` | |
| RSE for SEND & AP (Circuits) | `/services/rse-for-send-and-ap` | `RSE for SEND and AP` | Distinct workbook-based product line. Self-paced, simplified keynotes, doodle/game space in workbooks. |
| Drop Days | `/services/drop-days` | `Drop day delivery` | |
| RSE Training | `/services/rse-training` | `RSE training` | Highest-traffic service page. Replaces the standalone `/rse-training` page. |
| RSE Policy & Curriculum Planning | `/services/rse-policy-curriculum-planning` | `RSE policy and curriculum planning` | |

**Redirects.** `/services/rse-delivery` → `/services` (catches any inbound links from the previous draft structure or external references). `/services/delivery` → `/services`. `/rse-training` → `/services/rse-training`.

---

## 1 · Data requirements

### 1.1 ServicePage type

Content type used by each service page. Can be hardcoded per `.astro` file at launch; migration to Notion-driven data is out of scope for v3.

| Field | Type | Required | Notes |
|---|---|---|---|
| `slug` | `string` | Yes | URL routing |
| `title` | `string` | Yes | Service name — h1 |
| `subtitle` | `string` | Yes | 2–3 sentence value proposition below h1 |
| `heroImage` | `string` | **Yes** | URL to hero photography. Required — no text-only fallback. See §1.5. |
| `heroImageAlt` | `string` | Yes | Alt text for hero image |
| `description` | `string` | Yes | Opening prose — 2–3 paragraphs explaining what the service actually is |
| `glanceFacts` | `GlanceFact[]` | Yes | 4–6 key facts for the §2 At-a-glance strip |
| `featureCards` | `FeatureCard[]` | Yes | "What's included" — structured card data |
| `processSteps` | `ProcessStep[] \| null` | No | "How it works" — optional stepped sequence |
| `whatSchoolsGet` | `string \| null` | No | Additional detail prose block |
| `serviceParam` | `string` | Yes | Enquiry form pre-fill value |
| `serviceName` | `string` | Yes | Display name for CTA button text |
| `testimonialQuote` | `string \| null` | No | Pull quote text |
| `testimonialSource` | `string \| null` | No | Attribution (role, school name) |
| `metaTitle` | `string` | Yes | SEO |
| `metaDescription` | `string` | Yes | SEO + OG |

**Supporting types:**

```typescript
interface GlanceFact {
  label: string;   // e.g. "Year groups", "Format", "For", "Aligned with"
  value: string;   // e.g. "KS1–KS2", "In-school delivery", "Primary teachers & SLT", "DfE 2026"
}

interface FeatureCard {
  title: string;       // Bold, specific — e.g. "Pre-visit curriculum consultation"
  description: string; // 1–2 sentences
}

interface ProcessStep {
  number: number;      // 1, 2, 3...
  title: string;       // e.g. "We plan together"
  description: string; // 1–2 sentences
}
```

**Removed from v2:** `mode`, `whoItsFor`, `trustStats`, `hubLinks`. Hub mode is gone; the At-a-glance strip absorbs audience fit (as a `For` fact) and trust credentials (as `Aligned with` and format/duration facts) into a single horizontal row instead of two separate strips and a floating callout.

### 1.2 Related blog posts

Source: filter `getBlogPosts()` where `serviceLink` matches the service-specific key.

| Service page | `serviceLink` filter value |
|---|---|
| RSE for Primary Schools | `'delivery'` |
| RSE for Secondary Schools | `'delivery'` |
| RSE for SEND & AP | `'delivery'` |
| Drop Days | `'drop-days'` |
| RSE Training | `'training'` |
| RSE Policy & Curriculum Planning | `'rse-policy-curriculum-planning'` |

Returns `BlogPost[]`. Used in §7.

### 1.3 Landing pages for topics strip

Source: `getLandingPages()` from `src/lib/content.ts`. Used by a trimmed topics strip in §8 (not the full `TopicsOverviewGrid` — see §8 for the reduction).

### 1.4 Launch strategy

Each of the 6 pages is its own `.astro` file in `src/pages/services/`, hardcoding the `ServicePage` data at the top of the file and then composing the shared section components. This keeps launch simple and avoids premature CMS abstraction. All 6 files share the same section structure, the same component imports, and the same CSS — the only thing that varies per file is the data object.

### 1.5 Photography requirement

Hero photography is **required** on every C5 instance. The page does not render without it. This is a deliberate tightening in v3: earlier drafts allowed a text-only hero fallback, but a text-only hero on a conversion page reads as an unfinished placeholder and undermines the entire "proper landing page" brief. If photography is not yet available for a specific service, the page is not ready to ship.

Photography should be real delivery photography where possible — a Tailor educator with students, age-appropriate to the service. Stock imagery is a last resort and should be chosen for authenticity (real classrooms, not glossy teacher-with-apple stock). Circuits specifically should show workbook / self-paced activity imagery rather than whole-class delivery, because its product story is different.

---

## 2 · Section map

| § | Section | Surface | Container |
|---|---|---|---|
| 1 | Hero (tinted, with required image) | `--bg-tinted` | `--container-max-shell` |
| 2 | At a glance strip | `--bg-surface` | `--container-max-shell` |
| 3 | Service description | `--bg-page` | `--container-max-prose` |
| 4 | What's included (feature cards) | `--bg-surface-alt` | `--container-max-shell` |
| 5 | How it works (process steps) | `--bg-page` | `--container-max-shell` |
| 6 | Testimonial + CTA (dark authority band) | `--bg-emphasis` | `--container-max-prose` |
| 7 | Related blog posts `[A15]` | `--bg-page` | `--container-max-shell` |
| 8 | Explore by topic (trimmed strip) | `--bg-page` | `--container-max-shell` |
| 9 | CTA: enquiry `[A13]` (closing) | `--bg-surface-alt` | (component owns) |

Page background: `--bg-page`.

**Surface rhythm.** The page has genuine tonal range without feeling noisy. It opens with a tinted hero, drops to a clean At-a-glance strip, moves through page-ground prose, lifts to a cool tint for the feature cards, returns to page ground for the process steps, then hits a dark authority band for the testimonial + CTA moment — the emotional peak of the page. After that, it eases back to page ground for blog posts and the trimmed topics strip, and closes with a soft CTA card. The rhythm is: warm → clean → neutral → tinted → neutral → **dark** → neutral → neutral → soft.

**What changed from v2.** The §3 hub navigation cards section is gone (no hub mode). The old §4 "What this service is + who it's for" with its floating accent-bordered audience callout is gone — §3 is now a clean prose block with no framing h2, and audience fit lives in §2 as a glance fact. The old §9 full topics overview grid is reduced to a compact strip in §8. All `mode === 'hub'` conditionals are removed throughout.

### Vertical rhythm

- **§1** (hero): `py-[var(--space-struct-y-base)]` — generous, confident.
- **§2** (at a glance): `py-[var(--space-global-lg)]` — compact strip, not a full section.
- **§3–§5**: `py-[var(--space-struct-y-base)]` — consistent section padding.
- **§6** (testimonial + CTA): `py-[var(--space-struct-y-base)]` — the dark band needs breathing room.
- **§7**: `py-[var(--space-struct-y-base)]`.
- **§8** (topics strip): `py-[var(--space-global-lg)]` — compact, matches §2 rhythm.
- **§9** (closing CTA): component manages its own padding.
- Horizontal insets: every section uses `px-[var(--space-global-gutter)]` on the outer wrapper.

### Container widths

- **§1** (hero): `--container-max-shell` (72rem). Text + image layout needs width.
- **§2** (at a glance): `--container-max-shell` (72rem). Fact row spreads across.
- **§3** (description): `--container-max-prose` (44rem). Reading measure.
- **§4** (feature cards): `--container-max-shell` (72rem). Card grid needs room.
- **§5** (process steps): `--container-max-shell` (72rem).
- **§6** (testimonial + CTA): `--container-max-prose` (44rem). Centred, focused moment.
- **§7** (blog posts): `--container-max-shell` (72rem).
- **§8** (topics strip): `--container-max-shell` (72rem).
- **§9** (closing CTA): Component uses `--container-max-shell`.

---

## 3 · Section details

### §1 — Hero (tinted, with required image)

```
┌──────────────────────────────────────────────────────────────┐
│  --bg-tinted (4% teal wash)                                    │
│                                                                │
│  ┌─────────────────────────────┐  ┌──────────────────────┐    │
│  │  SERVICES (eyebrow)         │  │                      │    │
│  │                             │  │   [Required          │    │
│  │  h1  "RSE for Primary       │  │    photography:       │    │
│  │       Schools"              │  │    classroom /        │    │
│  │                             │  │    delivery moment]   │    │
│  │  p   Expert-led RSE         │  │                      │    │
│  │      tailored for KS1 and   │  │                      │    │
│  │      KS2, delivered by a    │  └──────────────────────┘    │
│  │      specialist educator    │                               │
│  │      who understands        │                               │
│  │      primary settings.      │                               │
│  │                             │                               │
│  │  [Enquire now]  (btn)       │                               │
│  └─────────────────────────────┘                               │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

A tinted wash that sits between the header shell and the page content. Warmer and more confident than a plain white hero, but still light enough to feel approachable. Two-column layout on desktop, anchored by real delivery photography.

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

1. **Eyebrow.** `<span class="service-hero__eyebrow">` — text: "Services".
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

4. **Hero CTA button.**
   - `<a href="/contact?service={serviceParam}" class="btn btn--std btn--primary has-icon-hover">` — text: "Enquire now".
   - Analytics attributes: `data-analytics-event="cta_click"`, `data-analytics-cta-type="hero_enquire"`, `data-analytics-service-type={serviceParam}`.

**Image column (`.service-hero__image`):**

- `<img>` with `border-radius: var(--radius-lg)`, `width: 100%`, `height: auto`, `object-fit: cover`, `display: block`.
- `aspect-ratio: 4 / 3` — landscape but not extreme. Works well for classroom/delivery photography.
- `alt` attribute: uses `heroImageAlt` (required — not a decorative image).
- `loading: eager` — above the fold, LCP candidate.
- **No fallback path.** `heroImage` is required (see §1.5). If it is missing at build time, fail the build rather than rendering a broken hero.

**Mobile:** Image appears below the text column. Full width within gutters. Same aspect ratio.

### §2 — At a glance strip

```
┌────────────────────────────────────────────────────────────────────────┐
│  --bg-surface, border-bottom                                             │
│                                                                          │
│  FORMAT          YEAR GROUPS    SESSION LENGTH   FOR                AL… │
│  In-school       KS1 – KS2      60 minutes       Primary teachers   DfE │
│  delivery                                        & SLT              2026│
│                                                                          │
└────────────────────────────────────────────────────────────────────────┘
```

This is the single most important change in v3. It replaces two separate things from v2: the old §2 trust-stat strip (generic credibility) and the old §4 "Who it's for" floating accent-bordered callout (buyer persona). Both were trying to answer the same underlying question — "is this service the right fit for me, and what am I actually getting?" — and splitting that answer across two treatments created the "weird floating boxes" problem.

The At-a-glance strip answers that question in one horizontal row of labelled facts. 4–6 facts per page, mixing service-specific details (format, year groups, duration, audience) with credibility markers (alignment, accreditation). The reader scans it in two seconds and knows whether to keep reading.

- **Outer wrapper:** `<section class="service-glance">`.
  ```css
  .service-glance {
    background: var(--bg-surface);
    border-bottom: var(--border-width-xs) solid var(--border-subtle);
  }
  ```
  - `w-full py-[var(--space-global-lg)] px-[var(--space-global-gutter)]`

- **Inner wrapper:** `mx-auto w-full max-w-[var(--container-max-shell)]`.

- **Layout:** `display: flex`, `justify-content: space-between`, `align-items: flex-start`, `gap: var(--space-global-lg)`, `flex-wrap: wrap`. On mobile the facts wrap to 2 columns naturally.

**Each fact (`.glance-fact`):**

| Property | Value |
|---|---|
| `flex` | `1 1 auto` |
| `min-width` | `9rem` |
| `text-align` | `left` |

**Fact label (`.glance-fact__label`):**

| Property | Value |
|---|---|
| `font-family` | `var(--font-tailor-body-stack)` |
| `font-size` | `var(--text-card-size-small)` |
| `font-weight` | `var(--font-weight-semibold)` |
| `color` | `var(--brand-accent-text)` |
| `text-transform` | `uppercase` |
| `letter-spacing` | `var(--text-eyebrow-ls)` |
| `margin` | `0 0 var(--space-global-xs)` |

**Fact value (`.glance-fact__value`):**

| Property | Value |
|---|---|
| `font-family` | `var(--font-tailor-heading-stack)` |
| `font-size` | `var(--text-prose-size-h4)` |
| `font-weight` | `var(--heading-weight-h3)` |
| `color` | `var(--text-heading)` |
| `line-height` | `var(--lh-heading-sub)` |
| `margin` | `0` |

**No dividers, no borders between facts.** The label/value typographic hierarchy and the gap are enough. Adding vertical rules makes the strip feel like a database table and tips the whole page toward the "generic brochure" failure mode.

**Content guidance.** Labels should be consistent across pages where possible (`Format`, `For`, `Aligned with` are common to most) but service-specific labels are fine (`Pace` for Circuits, `Duration` for RSE Training). Values should be concrete, short, and scannable — "KS1–KS2" not "Key Stage One and Key Stage Two". 4 facts minimum, 6 maximum. More than 6 dilutes the strip.

**Example content per page:**

*RSE for Primary Schools:* Format (In-school delivery) · Year groups (KS1–KS2) · Session length (45–60 min) · For (Primary teachers & SLT) · Aligned with (DfE 2026, PSHE Association).

*Circuits (SEND & AP):* Format (Workbook + activity) · Year groups (KS2–KS4) · Pace (Self-paced) · For (SEND coordinators & AP leads) · Aligned with (DfE 2026).

*RSE Training:* Format (In-person or remote) · Duration (Half-day / full-day) · For (Teachers, PSHE leads, SLT) · CPD (Accredited) · Aligned with (KCSIE, DfE 2026).

*Drop Days:* Format (On-site day programme) · Year groups (Flexible) · Duration (Full school day) · For (Whole year group cohorts).

*Policy & Curriculum Planning:* Format (Consultation + written plan) · Duration (2–4 weeks) · For (PSHE leads, curriculum deputies) · Deliverables (Policy document + curriculum map) · Aligned with (DfE 2026).

### §3 — Service description

```
┌──────────────────────────────────────────────────────┐
│  --bg-page                                             │
│                                                        │
│  [description prose, opens directly — no h2]          │
│  [2–3 paragraphs]                                      │
│                                                        │
│  h2  "What schools get"  (conditional)                 │
│  p   [additional detail prose]                         │
│                                                        │
└──────────────────────────────────────────────────────┘
```

The section formerly titled "What this service is." The title has been removed — it was a redundant restatement of the hero h1 and it's what made the v2 treatment feel boxy. The section now opens directly with the description prose, no framing h2. The reader arrived from the hero knowing the service name; they don't need a second announcement before the explanation.

- **Outer wrapper:** `<section class="service-description">`, on `--bg-page` ground.
  - `w-full py-[var(--space-struct-y-base)] px-[var(--space-global-gutter)]`
- **Inner wrapper:** `mx-auto w-full max-w-[var(--container-max-prose)]`.

**Opening prose (`.service-description__lead`):**

The first paragraph of the `description` field gets slightly elevated typography to carry the weight the removed h2 used to carry.

| Property | Value |
|---|---|
| `font-family` | `var(--font-tailor-body-stack)` |
| `font-size` | `var(--text-prose-size-lead)` |
| `font-weight` | `var(--font-weight-regular)` |
| `color` | `var(--text-body)` |
| `line-height` | `var(--lh-prose)` |
| `margin` | `0 0 var(--space-global-md)` |

**Subsequent paragraphs:**

| Property | Value |
|---|---|
| `font-family` | `var(--font-tailor-body-stack)` |
| `font-size` | `var(--text-prose-size-body)` |
| `color` | `var(--text-body)` |
| `line-height` | `var(--lh-prose)` |
| `margin-bottom` | `var(--space-global-sm)` |

**"What schools get" (conditional):** Only renders if `whatSchoolsGet` is not null. Standard `<h2>` + prose using normal section heading tokens (`--font-tailor-heading-stack`, `--text-prose-size-h2`, `--heading-weight-h2`, `--text-heading`). `margin-top: var(--space-global-lg)`.

**Circuits variation:** Same structure. The description prose tells the Circuits workbook story (self-paced, simplified keynotes, doodle/game space) naturally within the lead and body paragraphs. No special treatment required.

**No floating callouts.** There is no `.service-audience-callout`, no accent-bordered box, no eyebrow-and-border container inside §3. The whole point of this version is that the section is just prose. The audience persona is in §2 (as the `For` glance fact) and in the hero subtitle. It does not need a third appearance as a bordered block in the middle of the description.

### §4 — What's included (feature cards)

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

The "What's included" list is a card grid. **No icons** — the specificity of the card titles and descriptions does the credibility work. The art direction brief warns against "generic brochure pages with icon rows" and it's right. A decorative shield icon next to "Safeguarding-informed design" adds nothing. The words "safeguarding-informed design" are already doing the job.

- **Outer wrapper:** Full-bleed `<section class="service-features">` with `--bg-surface-alt`.
  - `w-full py-[var(--space-struct-y-base)] px-[var(--space-global-gutter)]`
  - `style="background: var(--bg-surface-alt);"`
- **Inner wrapper:** `mx-auto w-full max-w-[var(--container-max-shell)]`.

**Section heading:** Standard h2 tokens. `margin: 0 0 var(--space-global-md)`.

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

### §5 — How it works (process steps)

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

- **Conditional:** Only renders when `processSteps` is not null. Some pages (Drop Days, Policy & Curriculum Planning) may skip it if the service doesn't have a clear sequential process.
- **Outer wrapper:** `<section class="service-process">`, on `--bg-page` ground.
  - `w-full py-[var(--space-struct-y-base)] px-[var(--space-global-gutter)]`
- **Inner wrapper:** `mx-auto w-full max-w-[var(--container-max-shell)]`.

**Section heading:** Standard h2 tokens. `margin: 0 0 var(--space-global-md)`.

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

### §6 — Testimonial + CTA (dark authority band)

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

Slightly larger than body text — the quote is the visual centrepiece, not a sidebar element.

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

**CTA button:**
- `<a class="btn btn--std btn--white-primary has-icon-hover">` — white button on dark background.
- Text: "Enquire about {serviceName}".
- Links to `/contact?service={serviceParam}`.
- Analytics attributes: `data-analytics-event="cta_click"`, `data-analytics-cta-type="proof_band_enquire"`, `data-analytics-service-type={serviceParam}`.

**Link to testimonials:** Below the button, a text link: "Read more testimonials →". `color: var(--text-on-dark)`, `opacity: 0.7`, hover `opacity: 1`.

**Conditional:** If `testimonialQuote` is null, render a simplified dark band with just the CTA button (no quote, no attribution). The dark band is non-negotiable — every C5 page gets the dark conversion moment, even if no testimonial has been sourced yet.

### §7 — Related blog posts `[A15]`

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

**Section heading:** Standard h2 tokens. `margin: 0 0 var(--space-global-md)`.

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

### §8 — Explore by topic (trimmed strip)

```
┌──────────────────────────────────────────────────────┐
│  --bg-page                                             │
│                                                        │
│  Explore by topic                  See all 23 guides → │
│                                                        │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐│
│  │Topic │ │Topic │ │Topic │ │Topic │ │Topic │ │Topic ││
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘│
│                                                        │
└──────────────────────────────────────────────────────┘
```

v2 used the full `TopicsOverviewGrid` component here, showing all 23 landing pages grouped by 7 app categories. Reviewer feedback was that the full grid dominated the lower third of the page and pulled attention away from the closing CTA. v3 trims this to a single-row compact strip showing 6 selected topics, plus a "See all" link to the topics index.

**Purpose.** The teacher on a service page is in conversion mindset — they don't need an exhaustive topic browser mid-funnel. But some browsing affordance is worth preserving for the reader who isn't quite ready to enquire and wants to explore Tailor's breadth. A single compact row satisfies that without taking over.

- **Outer wrapper:** `<section class="service-topics-strip">`, on `--bg-page` ground.
  - `w-full py-[var(--space-global-lg)] px-[var(--space-global-gutter)]`
- **Inner wrapper:** `mx-auto w-full max-w-[var(--container-max-shell)]`.

**Header row:**

Label left, "See all" link right. Flex row, space-between.

- **Label:** "Explore by topic" — small heading style (`--font-tailor-heading-stack`, `--text-card-size-h3`, `--heading-weight-h3`, `--text-heading`).
- **See-all link:** "See all 23 topic guides →" — `--link-action-color`, `--text-card-size-body`, `--font-weight-semibold`. Links to `/landing-pages` or the topics index route.
- `margin-bottom: var(--space-global-sm)`.

**Topic chip grid:**
- `display: grid`, `gap: var(--space-global-xs)`.
- `repeat(2, 1fr)` on mobile, `repeat(3, 1fr)` at `≥ 640px`, `repeat(6, 1fr)` at `≥ 1024px`.

**Each topic chip (`.topic-chip`):**

| Property | Value |
|---|---|
| `display` | `flex`, `align-items: center` |
| `padding` | `var(--space-global-sm) var(--space-global-md)` |
| `background` | `var(--bg-surface)` |
| `border` | `var(--border-width-xs) solid var(--border-subtle)` |
| `border-radius` | `var(--radius-md)` |
| `font-family` | `var(--font-tailor-body-stack)` |
| `font-size` | `var(--text-card-size-body)` |
| `font-weight` | `var(--font-weight-medium)` |
| `color` | `var(--text-heading)` |
| `text-decoration` | `none` |
| `transition` | `border-color var(--transition-duration) var(--transition-easing)` |
| `:hover` | `border-color: var(--brand-accent)` |

**Content selection.** The 6 topics shown are a curated subset — pick topics most relevant to the reader on this specific service page (e.g. the primary delivery page might surface "Puberty", "Healthy friendships", "Keeping safe online"; the training page might surface "Managing disclosures", "Curriculum planning", "Teacher confidence"). The curation can be hardcoded per service page in v3 (each `.astro` file declares its own `featuredTopicSlugs: string[]`) or can be a simple reuse of the first 6 alphabetically as a launch default. Full dynamic selection is a later enhancement.

**Implementation note.** This is a new pattern, not a `TopicsOverviewGrid` variant. Implement as a small local component (`ServiceTopicsStrip.astro`) in `src/components/`. `TopicsOverviewGrid.astro` stays untouched and can continue to be used on other pages where the full grid is desired.

### §9 — CTA: service enquiry `[A13]` (closing)

Uses `CtaServiceEnquiry.astro` with `variant="alt"`.

```astro
<CtaServiceEnquiry
  serviceName={serviceName}
  serviceParam={serviceParam}
  variant="alt"
/>
```

The `alt` variant uses `--bg-surface-alt` with centred text. Softer closing note for readers who've scrolled through everything. Sits below the topics strip — the final element on the page.

**Container update needed:** Current `max-w-4xl` → `max-w-[var(--container-max-shell)]`.

---

## 4 · Template structure

```
<article class="service-page" data-pagefind-body>

  <header class="service-hero">                    ← --bg-tinted
    §1: Eyebrow + h1 + value prop + hero CTA + required image
  </header>

  <section class="service-glance">                 ← --bg-surface
    §2: At-a-glance fact row (4–6 label/value pairs)
  </section>

  <section class="service-description">            ← --bg-page
    §3: Lead prose + body prose + optional "What schools get"
  </section>

  <section class="service-features">               ← --bg-surface-alt
    §4: Feature card grid (no icons)
  </section>

  {processSteps && (
    <section class="service-process">              ← --bg-page
      §5: How it works steps
    </section>
  )}

  <section class="service-proof-band">             ← --bg-emphasis (dark)
    §6: Testimonial quote (optional) + CTA button (always)
  </section>

  {relatedPosts.length > 0 && (
    <section class="service-blog">                 ← --bg-page
      §7: Blog card grid
    </section>
  )}

  <section class="service-topics-strip">           ← --bg-page
    §8: Compact topic chip row + see-all link
  </section>

  §9: <CtaServiceEnquiry variant="alt" />          ← component card: --bg-surface-alt

</article>
```

No hub-mode conditionals. Every section renders on every C5 instance except the two content-driven null checks (§5 needs `processSteps`, §7 needs `relatedPosts`).

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

| Breakpoint | Hero layout | Glance strip | Feature cards | Process steps | Blog grid | Topics strip |
|---|---|---|---|---|---|---|
| `< 640px` | Stacked (text → image) | 2 cols wrap | 1 column | 1 column | 1 column | 2 columns |
| `≥ 640px` | Stacked (text → image) | Row, wraps | 2 columns | 2 columns | 2 columns | 3 columns |
| `≥ 768px` | 2-column (text + image) | Row, single line | 3 columns | Auto-fit row | 3 columns | 3 columns |
| `≥ 1024px` | Same | Same | Same | Same | Same | 6 columns (single row) |

The hero switches to its two-column layout at 768px. Below that, the image appears below the text at full width (within gutters). Glance strip wraps naturally on narrow viewports and should sit on a single line at desktop widths (that's why 4–6 is the cap on facts — more and it wraps awkwardly).

---

## 7 · SEO & metadata

- **`<title>`:** `{metaTitle}` or `"{title} — RSE for Schools | Tailor Education"` as fallback.
- **`<meta name="description">`:** `{metaDescription}`.
- **`og:image`:** `{heroImage}`. Always set (hero image is required).
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

---

## 8 · Accessibility

- `<article>` as top-level semantic element with `data-pagefind-body`.
- `<header>` for §1.
- Each content section uses semantic `<section>` elements with heading landmarks where a heading exists. §2 (glance strip) and §3 lead prose have no h2 — that's intentional, not a landmark gap, because the h1 in §1 covers the article's landmark requirement.
- Hero image: `alt` from `heroImageAlt` (required — content image, not decorative).
- Glance strip facts: label uses a `<dt>`-style visual treatment but semantically each fact can render as a `<div>` with label and value nested — screen readers read them as paired content. Or use an actual `<dl>` with `<dt>`/`<dd>` if preferred for semantic correctness; styling is the same.
- Feature cards: static content, not links. No interactive behaviour needed.
- Process step numbers: visible text inside the circle, not an image — screen readers announce it naturally.
- Dark band (§6): all text uses `--text-on-dark` which passes AAA contrast (13.07:1 against `--bg-emphasis`). White button passes AA (5.6:1).
- Blog cards: whole-card `<a>` links. Featured images use `alt=""` (decorative in card context — the title is the accessible label).
- Topics strip chips: each chip is an `<a>` with text label. Keyboard focusable via the default `.topic-chip:focus-visible` ring.
- All heading hierarchy is sequential: h1 (§1), h2 (§4, §5, §7, §8 label). §3 lead paragraph is not a heading (prose). §6 dark band has no h2 (the quote is the focal element).

---

## 9 · Contradictions & clarifications

| Topic | Resolution |
|---|---|
| Instance count | Content spec v1 says 3 instances. v2 said 7 (1 hub + 6 individual). v3 says 6 — the hub page has been removed. |
| No hub mode | The hub page is gone. Teachers arriving at `/services` pick their delivery variant directly. C5 is conversion-only. Any reference to `mode === 'hub'` in older components or data is dead code. |
| Hero photography | Required, not optional. A text-only hero fallback undermines the "proper landing page" brief and creates the impression that the page is unfinished. Pages without photography are not ready to ship. |
| No floating callouts in §3 | The v2 accent-bordered "Who it's for" callout has been removed. Audience fit moves to the §2 at-a-glance strip as a `For` fact. §3 is pure prose. |
| No "What this service is" h2 | Removed in v3. The hero title already tells the reader what the service is — a second h2 restating the service name as a question ("What this service is") is redundant and creates a boxy rhythm. §3 opens directly with a lead paragraph. |
| Icon cards | Art direction brief warns against "generic brochure pages with icon rows." Feature cards (§4) use bold title + description only, no icons. Specificity of content provides credibility, not decorative icons. |
| Dark band | The `--bg-emphasis` band (§6) is the only dark section in the C5 template. Deliberate design device — the emotional peak — not a generic pattern. Renders on every page, with or without a testimonial. |
| CTA coverage | Each C5 page has three CTA opportunities: hero button (§1), dark band button (§6), closing card (§9). All three link to the enquiry form with `serviceParam` pre-fill. |
| Circuits as separate layout | No separate layout. Circuits uses the same template. Unique product story expressed through content (§2 facts, §3 prose, §4 feature cards, §5 process steps). |
| Topics grid reduction | v2 used the full `TopicsOverviewGrid` component (all 23 landing pages × 7 categories) at §9. v3 replaces it with a compact 6-chip strip plus a see-all link (§8). The full grid is available at a topics index page; the service page only needs a light browsing nudge. |
| Container widths | `--container-max-shell` (72rem) for wide sections, `--container-max-prose` (44rem) for reading. `CtaServiceEnquiry` closing CTA updated from `max-w-4xl` → `--container-max-shell`. The old note about updating `TopicsOverviewGrid`'s container is withdrawn — the component is no longer used on C5. |
| RSE Training duplication | RSE Training previously lived at `/rse-training` as B4. Moves to `/services/rse-training` as C5. Old route redirects. |
| Trust strip vs logo badges | Framework alignment credentials live in the §2 glance strip as short text values (`Aligned with: DfE 2026, PSHE Association`). Logo badges belong on the Our Approach page (B3) where they can be contextualised with accreditation detail. |
| Testimonial format | Single pull quote on dark band. Not a carousel, not a grid, not a slider. One `<blockquote>` with attribution, centred. |
| Blog card images | Optional `featuredImage` in `.card__img` slot. Cards without images still work. Matches C4 pattern. |
| Blog grid columns | 3 columns at `≥ 768px`, matching C3 and C4. Current implementation is 2 columns max. |
| Vertical padding | Current `py-[var(--space-global-lg)]` (2rem) → `py-[var(--space-struct-y-base)]` (clamp 4–6rem) for full sections. Glance strip and topics strip stay compact at `py-[var(--space-global-lg)]`. |
| Heading alignment | Left-aligned throughout. Only the dark band (§6) centres text. The closing CTA (§9, `alt` variant) also centres by design. |
| No-quote page | If a service has no testimonial, §6 still renders as a dark CTA band without the quote. The visual break and conversion moment are preserved. |

---

## 10 · Build checklist

### Template work

1. [ ] Create `/services/rse-for-primary-schools.astro`
2. [ ] Create `/services/rse-for-secondary-schools.astro`
3. [ ] Create `/services/rse-for-send-and-ap.astro` (Circuits)
4. [ ] Create `/services/rse-training.astro` (replaces B4 `/rse-training`)
5. [ ] Update `/services/rse-policy-curriculum-planning.astro` to new structure
6. [ ] Update `/services/drop-days.astro` to new structure
7. [ ] Delete or redirect `/services/delivery.astro` (no longer exists as hub)
8. [ ] Set up redirects: `/services/rse-delivery` → `/services`, `/services/delivery` → `/services`, `/rse-training` → `/services/rse-training`

### New sections to build

9. [ ] §1 hero: tinted band with 2-column text + required image layout, hero CTA button, responsive grid
10. [ ] §2 glance strip: horizontal flex row of 4–6 label/value facts, no dividers
11. [ ] §3 service description: lead paragraph + body paragraphs + optional "What schools get" block, no floating callouts
12. [ ] §4 feature cards: 3-column card grid on `--bg-surface-alt` band, no icons
13. [ ] §5 process steps: numbered step grid with tinted circles (conditional)
14. [ ] §6 dark proof band: `--bg-emphasis` section with centred quote (optional), attribution, and white CTA button (always)
15. [ ] §8 topics strip: new `ServiceTopicsStrip.astro` component — header row with "See all" link + 6-chip grid
16. [ ] Remove any v2 hub-mode conditionals (`mode === 'hub'`, `HubLink[]`, `.service-hub-nav`, `.service-audience-callout`) from any draft components

### Component updates

17. [ ] Update `CtaServiceEnquiry.astro` container from `max-w-4xl` to `max-w-[var(--container-max-shell)]`
18. [ ] Add `--container-max-shell` to blog card grid container
19. [ ] Expand blog card grid to 3 columns at `≥ 768px`
20. [ ] Add optional `featuredImage` to blog cards (`.card__img` slot)

### Content

21. [ ] Write content for all 6 service pages (subtitle, description prose, glance facts, feature cards, process steps)
22. [ ] **Source hero photography per service page — blocking launch requirement**
23. [ ] Define glance facts per service (4–6 items each)
24. [ ] Source testimonial quotes per service line (nice-to-have, not blocking — §6 renders without)
25. [ ] Write process steps for applicable service pages
26. [ ] Pick 6 featured topic slugs per service page for §8 strip

### Routing

27. [ ] Set up redirect from `/rse-training` → `/services/rse-training`
28. [ ] Set up redirect from `/services/delivery` → `/services`
29. [ ] Set up redirect from `/services/rse-delivery` → `/services`
30. [ ] Update A3 navigation dropdown to reflect the 6 service routes (no RSE Delivery hub entry)
31. [ ] Update `CtaBringToSchool.astro` service target map for new routes

### Verification

32. [ ] Visual review: all 6 pages at mobile, tablet, desktop breakpoints
33. [ ] Confirm hero renders correctly at all breakpoints with real photography in place
34. [ ] Confirm glance strip fits on single line at desktop, wraps cleanly on mobile
35. [ ] Confirm §3 opens with lead paragraph (no residual h2) and has no floating callout boxes
36. [ ] Confirm dark band contrast — all text/button combinations pass WCAG AA
37. [ ] Confirm dark band renders with or without testimonial quote
38. [ ] Confirm feature card grid handles 3–6 cards gracefully
39. [ ] Confirm process steps handle 3–4 steps without visual breaking
40. [ ] Confirm blog section omits gracefully when no related posts
41. [ ] Confirm topics strip renders on all 6 pages and shows the curated subset for that page
42. [ ] Confirm enquiry form pre-fills correctly from each service page
43. [ ] Confirm Circuits page content reads naturally within standard template
44. [ ] Test all internal links (blog cards, topic chips, see-all link, CTAs → contact)
45. [ ] Pagefind: confirm all 6 pages are indexed

---

*Document version: 3.0 | Date: 10 April 2026*
