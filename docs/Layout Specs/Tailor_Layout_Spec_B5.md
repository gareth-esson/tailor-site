# Tailor Layout Spec — B5 Services Hub

*Layout specification for the Services hub at `/services`. This is a Tailor Education page. Its primary audience is teachers, PSHE leads, and school leaders arriving from the main navigation, from organic search on "RSE services for schools" queries, or from the bottom-of-page CTA on landing pages (A12). The page's job is routing — confirm that Tailor's way of delivering RSE is the right fit, then move the reader to the specific C5 service page that matches their context.*

*Mood: calm, confident, grounded. This is not a conversion page — the conversion happens on C5. This page's job is to set up the reader's state of mind so the C5 page they land on feels like a logical next step, not a cold pitch. The reader should leave this page thinking "these people have a point of view I recognise" before they've clicked any card.*

**Version:** 1.0
**Date:** 2026-04-11

---

## 0 · Purpose and job-to-be-done

The Services hub at `/services` carries two jobs, in this order:

**Job one — establish the delivery philosophy.** Teachers arriving on this page are in one of three states: (a) they already know which service they want and are just using this page as a waypoint to get there, (b) they know they want *something* from Tailor but haven't decided which service fits, or (c) they're evaluating Tailor against other providers and need to form a view of what Tailor actually believes about RSE delivery before committing to a deeper read. All three readers benefit from the page opening with a short statement of what RSE delivery means at Tailor. Reader (a) skims it and scrolls to the cards; reader (b) uses it as context for their selection; reader (c) forms their view right here. One piece of content, three jobs.

**Job two — route to the correct service page.** All six C5 service pages are siblings and the hub is the one place in the site where a teacher can see them side-by-side and pick. The grid must honour the hierarchy (four flagship services, two secondary), show each service with enough photography and prose to make the pick obvious, and get out of the way.

What this page explicitly does not do: sell hard. There is no hero CTA button. There is no mid-page "Enquire now" interruption. There is no urgency language. The closing CTA is a soft planning-call offer for the reader who scrolled all the way down without clicking a card, which is itself a signal that they need conversation, not pressure.

---

## 0.1 · The six services and their hierarchy

All six services use the C5 v3 template. The hub's job is to introduce them and route to them. The hub renders them in two tiers:

**Flagship tier** — four services, equal visual weight, each with photography. These are the four highest-intent Tailor offerings and the grid should make them feel like first-class products.

| Service | Route | Audience signal |
|---|---|---|
| RSE for Primary Schools | `/services/rse-for-primary-schools` | KS1–KS2 teachers, PSHE leads in primaries |
| RSE for Secondary Schools | `/services/rse-for-secondary-schools` | KS3–KS5 teachers, PSHE leads in secondaries |
| RSE for SEND & AP (Circuits) | `/services/rse-for-send-and-ap` | SEND coordinators, AP leads — distinct workbook product |
| RSE Training | `/services/rse-training` | Teachers, PSHE leads, SLT wanting to deliver themselves |

**Secondary tier** — two services, smaller card footprint, clearly subordinate but not buried.

| Service | Route | Notes |
|---|---|---|
| Drop Days | `/services/drop-days` | Lower enquiry volume, still a real product |
| RSE Policy & Curriculum Planning | `/services/rse-policy-curriculum-planning` | Lower enquiry volume, consultancy-shaped |

**Why the split.** The content spec and site structure documents list the services as a flat set of six, but in practice four of them are the spine of the business and two are ancillary. A flat 6-card grid buries the flagships among their siblings and makes Training (which is currently the highest-traffic C5 page and the primary funnel target from the app) look like just one of six equivalent options. The two-tier split gives the flagships their deserved prominence without demoting the secondary services to a footnote.

**What is not in this grid.** The old `/services/rse-delivery` hub variant is gone — teachers route directly to their delivery variant from this page. The old `/services/delivery` and `/services/consultancy` routes are redirects or removed (see §9 build checklist).

---

## 1 · Reference documents

- `Tailor_Layout_Spec_C5.md` (v3) — individual service page template, for CTA patterns, dark band treatment, and service param conventions
- `Tailor_Layout_Spec_B1.md` — homepage, for surface rhythm conventions and the layer-scoping model this page inherits
- `Tailor_Layout_Spec_Shell.md` — header, footer, navigation, container tokens
- `Tailor_Page_Content_Spec_v1.md` — B5 section (content structure — stale on the service list, see §8 contradictions)
- `Tailor_Site_Structure_v1.md` — B5 entry, C5 routing table
- `Tailor_Art_Direction_Brief_v1 (1).md` — anti-SaaS guidance, photography direction
- `Tailor_Image_Requirements.md` — photography per service

---

## 2 · Section map

| § | Section | Surface | Container | Required |
|---|---|---|---|---|
| 1 | Hero (tinted, with photography) | `--bg-tinted` | `--container-max-shell` | Yes |
| 2 | Philosophy bridge (prose) | `--bg-page` | `--container-max-prose` | Yes |
| 3 | Flagship service grid (4 cards) | `--bg-surface-alt` | `--container-max-shell` | Yes |
| 4 | Secondary service row (2 cards) | `--bg-surface-alt` | `--container-max-shell` | Yes |
| 5 | Framework alignment strip | `--bg-page` | `--container-max-shell` | Optional |
| 6 | Testimonial (dark authority band) | `--bg-emphasis` | `--container-max-prose` | Optional |
| 7 | Soft planning-call CTA | `--bg-surface-alt` | `--container-max-prose` | Yes |

Page background: `--bg-page`.

**Surface rhythm.** Opens on a tinted hero for warmth, drops to page ground for the philosophy bridge (reading mode), lifts to a cool alt tint that carries both the flagship grid and the secondary row as one unified "services block" (the tint stays constant across §3 and §4 so the two tiers read as one section with internal hierarchy rather than two separate sections), returns to page ground for the framework strip, hits the dark band if a testimonial exists, and closes on a soft tinted alt surface for the planning-call CTA. Rhythm: warm → neutral → **tinted block** → neutral → (optional dark) → soft tint.

The key move is collapsing §3 and §4 onto a single continuous `--bg-surface-alt` band. Visually it reads as one "here are the services" section with a quiet internal break between tiers, rather than two sections stacked on alternating surfaces. This avoids the "why are Drop Days and Policy on a different tint?" confusion that would come from putting them on a separate surface.

### Vertical rhythm

- **§1** (hero): `py-[var(--space-struct-y-base)]`
- **§2** (philosophy bridge): `py-[var(--space-struct-y-base)]`
- **§3–§4** (services block): one continuous section with `py-[var(--space-struct-y-base)]` top padding, `py-[var(--space-struct-y-base)]` bottom padding, and an internal `margin-top: var(--space-global-2xl)` separating the secondary row from the flagship grid
- **§5** (framework strip): `py-[var(--space-global-lg)]` — compact, not a full section
- **§6** (dark band): `py-[var(--space-struct-y-base)]`
- **§7** (planning-call CTA): `py-[var(--space-struct-y-base)]`
- Horizontal insets: `px-[var(--space-global-gutter)]` on every outer wrapper

### Container widths

- **§1** (hero): `--container-max-shell` (72rem) — 2-col text + image layout
- **§2** (philosophy bridge): `--container-max-prose` (44rem) — reading measure, elevated lead paragraph
- **§3** (flagship grid): `--container-max-shell` (72rem) — 4-card grid needs width
- **§4** (secondary row): `--container-max-shell` (72rem) — 2-card row aligned to same container
- **§5** (framework strip): `--container-max-shell` (72rem) — logo row spreads across
- **§6** (dark band): `--container-max-prose` (44rem) — centred focused moment
- **§7** (planning-call CTA): `--container-max-prose` (44rem) — centred, intimate

---

## 3 · Section details

### §1 — Hero (tinted, with photography)

A two-column tinted band. Text left, photography right. The hero's job on a hub page is lighter than on a C5 page — it does not need to drive conversion, it needs to establish tone and set up the philosophy bridge that follows. No CTA button in the hero. The reader is not here to click a button; they are here to form a view.

- **Outer wrapper:** Full-bleed `<header class="services-hero">`.
  ```css
  .services-hero {
    background: var(--bg-tinted);
    border-bottom: var(--border-width-xs) solid var(--border-subtle);
  }
  ```
  - `w-full py-[var(--space-struct-y-base)] px-[var(--space-global-gutter)]`
- **Inner wrapper:** `mx-auto w-full max-w-[var(--container-max-shell)]`.
- **Layout:** 2-column on desktop (text left ~55%, image right ~45%), stacked on mobile (text above image).

```css
.services-hero__inner {
  display: grid;
  gap: var(--space-global-lg);
  align-items: center;
}

@media (min-width: 768px) {
  .services-hero__inner {
    grid-template-columns: 1fr 0.8fr;
    gap: var(--space-global-xl);
  }
}
```

**Text column contents:**

1. **Eyebrow** — `<span class="services-hero__eyebrow">` text: "Services".
   - Tokens: `--font-tailor-body-stack`, `--text-card-size-body`, `--font-weight-semibold`, `--brand-accent-text`, uppercase, `letter-spacing: var(--text-eyebrow-ls)`, `margin-bottom: var(--space-global-xs)`.

2. **Page title** — `<h1 class="services-hero__title">` — text slot, content TBD. Something that names the page as a services overview without being a headline-y boast. A working placeholder is "RSE services for schools" but the final wording is voice-dependent and belongs to Tailor, not to this spec.
   - Tokens: `--font-tailor-heading-stack`, `--text-display-size-h1`, `--heading-weight-h1`, `--text-heading`, `line-height: var(--lh-display)`, `margin: 0 0 var(--space-global-sm)`.

3. **Hero subtitle** — `<p class="services-hero__subtitle">` — 1–2 sentences naming what Tailor offers at the shape level (delivery, training, planning) without itemising the six services. Content slot: `[hero subtitle — 1–2 sentences, voice TBD by Tailor]`. The existing draft copy in `services/index.astro` ("Whether you need someone to deliver RSE directly, training for your staff, or support with policy and curriculum — we can help") is usable but would benefit from the voice tightening discussed for the philosophy bridge.
   - Tokens: `--font-tailor-body-stack`, `--text-prose-size-body`, `--text-body`, `line-height: var(--lh-body)`, `margin: 0`.

4. **No CTA button.** The hub hero does not have a button. The reader's next action is to scroll into the philosophy bridge, not to click. Adding a button here would create a false conversion path (conversion belongs on C5) and would fight with the soft planning-call CTA at the bottom of the page.

**Image column:**

- `<img>` with `border-radius: var(--radius-lg)`, `width: 100%`, `height: auto`, `object-fit: cover`, `display: block`, `aspect-ratio: 4 / 3`.
- Photography: one shared hub hero image. Should show Tailor at work in a way that doesn't lock to a single age group — ideally a consultant in a school context (corridor, staff room, classroom) that reads as generic "Tailor at a school" rather than "Tailor delivering primary" or "Tailor delivering secondary". The current image at `/images/services/tailor-education-rse-consultant-school-corridor.webp` fits this brief and should be retained.
- `alt` required, meaningful.
- `loading: eager` — above the fold, LCP candidate.

### §2 — Philosophy bridge

This is the content addition that makes the hub earn its place. Without this section, `/services` is a nav page with cards — the kind of page a teacher bookmarks and never reads. With it, the page has a point of view that primes every downstream C5 page the reader clicks through to.

**The bridge's job** is to take the conviction that belongs on the About / Our Approach page (the full philosophy essay) and on the homepage (the one-paragraph compression) and render it at services-appropriate depth: 2–3 paragraphs that connect belief to product. Not the full essay. Not a tagline. A short, plainly written block that answers "what does RSE delivery mean at Tailor?" in a way that makes the service cards below feel like the natural consequence of that belief.

**Content slot:** `[philosophy bridge — 2–3 paragraphs, voice TBD by Tailor]`. The spec does not attempt to draft this prose. When the real copy lands, it drops into this slot without any layout changes.

**Tone guidance for whoever writes it** (not copy to use):

- First-person plural, and mean it. This is the Tailor team talking about something they care about, not a brand voice performing.
- Specific failure modes grounded in real experience — the things teachers remember about bad RSE, the things students remember about bad RSE. Not rhetorical straw men.
- End on purpose, not on contrast. The bridge should tell the reader what Tailor believes RSE delivery is *for*, not what it is *against*.
- 150–300 words total across 2–3 paragraphs.

**Layout.**

- **Outer wrapper:** `<section class="services-philosophy">`, on `--bg-page` ground.
  - `w-full py-[var(--space-struct-y-base)] px-[var(--space-global-gutter)]`
- **Inner wrapper:** `mx-auto w-full max-w-[var(--container-max-prose)]`.

**No h2.** The bridge opens directly with prose. Adding an h2 like "Our approach" or "Why we do this" would both restate what the About page heading says and create the same boxy rhythm that §3 on C5 was redesigned to avoid. The bridge is introduced by the hero, not by a heading.

**Opening paragraph (`.services-philosophy__lead`):**

The first paragraph gets elevated typography to carry the entry weight the missing h2 would otherwise provide.

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

**Optional "Read more" link.** If the bridge ends with a natural hand-off to the fuller Our Approach essay, append a simple inline text link: "Read more about how we approach RSE delivery →" linking to `/our-approach`. Link tokens: `--link-action-color`, `--font-weight-semibold`. Margin-top: `var(--space-global-sm)`. Not required — the bridge can stand alone if the writer prefers.

### §3 — Flagship service grid

Four service cards, equal weight, each with photography. This is the main routing block of the page.

- **Outer wrapper:** Full-bleed `<section class="services-flagship-grid">` with `--bg-surface-alt`. **Important:** this section shares a continuous surface with §4 (secondary row). In the template structure they are two sibling `<div>`s inside a single outer `<section class="services-block">` wrapper. See §5 template structure below.
  - `w-full pt-[var(--space-struct-y-base)] px-[var(--space-global-gutter)]`
  - `style="background: var(--bg-surface-alt);"` (applied to the parent `services-block` wrapper, not the flagship grid itself)
- **Inner wrapper:** `mx-auto w-full max-w-[var(--container-max-shell)]`.

**Section heading:**

- `<h2>` — text slot, content TBD. Working placeholder: "Our services" or "How we work with schools". Not a clever headline; a plain label that introduces the grid.
- Tokens: `--font-tailor-heading-stack`, `--text-prose-size-h2`, `--heading-weight-h2`, `--text-heading`, `margin: 0 0 var(--space-global-md)`.

**Card grid:**
- `display: grid`, `gap: var(--space-global-md)`.
- `1fr` on mobile, `repeat(2, 1fr)` at `≥ 640px`, `repeat(2, 1fr)` at `≥ 768px` (2×2), `repeat(4, 1fr)` at `≥ 1024px` (single row).

**Each flagship card (`.service-card--flagship`):**

A richer card than the current implementation. Photography at the top, title, short description, action link. Whole card is an `<a href="/services/{slug}">`.

```html
<a href="/services/rse-for-primary-schools" class="service-card service-card--flagship">
  <div class="service-card__img">
    <img src="/images/services/primary-delivery.webp"
         alt="Tailor delivering RSE in a primary classroom"
         loading="lazy" />
  </div>
  <div class="service-card__body">
    <h3 class="service-card__title">RSE for Primary Schools</h3>
    <p class="service-card__text">
      [one-sentence service summary — TBD]
    </p>
    <span class="service-card__link">Learn more →</span>
  </div>
</a>
```

**Card container:**

| Property | Value |
|---|---|
| `display` | `flex`, `flex-direction: column` |
| `background` | `var(--bg-surface)` |
| `border` | `var(--border-width-xs) solid var(--border-subtle)` |
| `border-radius` | `var(--radius-lg)` |
| `overflow` | `hidden` |
| `text-decoration` | `none` |
| `color` | `inherit` |
| `transition` | `transform var(--transition-duration) var(--transition-easing), border-color var(--transition-duration) var(--transition-easing)` |
| `:hover` | `border-color: var(--brand-accent); transform: translateY(-2px);` |
| `:focus-visible` | standard focus ring |

**Image slot (`.service-card__img`):**

| Property | Value |
|---|---|
| `aspect-ratio` | `4 / 3` |
| `overflow` | `hidden` |
| `background` | `var(--bg-tinted)` (fallback while image loads) |

`<img>` inside: `width: 100%`, `height: 100%`, `object-fit: cover`, `display: block`, `loading: lazy`.

**Body (`.service-card__body`):**

| Property | Value |
|---|---|
| `display` | `flex`, `flex-direction: column`, `flex-grow: 1` |
| `padding` | `var(--space-global-lg)` |

**Title (`.service-card__title`):**

| Property | Value |
|---|---|
| `font-family` | `var(--font-tailor-heading-stack)` |
| `font-size` | `var(--text-card-size-h2)` |
| `font-weight` | `var(--heading-weight-h2)` |
| `color` | `var(--text-heading)` |
| `line-height` | `var(--lh-heading-sub)` |
| `margin` | `0 0 var(--space-global-xs)` |

**Description (`.service-card__text`):**

| Property | Value |
|---|---|
| `font-family` | `var(--font-tailor-body-stack)` |
| `font-size` | `var(--text-card-size-body)` |
| `color` | `var(--text-body-muted)` |
| `line-height` | `var(--lh-body)` |
| `margin` | `0 0 var(--space-global-sm)` |
| `flex-grow` | `1` (pushes action link to bottom) |

**Action link (`.service-card__link`):**

| Property | Value |
|---|---|
| `font-family` | `var(--font-tailor-body-stack)` |
| `font-size` | `var(--text-card-size-body)` |
| `font-weight` | `var(--font-weight-semibold)` |
| `color` | `var(--link-action-color)` |

Text: "Learn more →". The arrow is in the text, not a separate icon.

**Content slots per card:**

| Card | Title | Description slot |
|---|---|---|
| Primary | "RSE for Primary Schools" | `[one-sentence summary, voice TBD]` — current draft: "Age-appropriate RSE for KS1 and KS2, delivered by a specialist educator who understands primary school settings." |
| Secondary | "RSE for Secondary Schools" | `[one-sentence summary, voice TBD]` — current draft: "Expert-led RSE for KS3 and KS4 — covering the topics students are actually thinking about, delivered with confidence." |
| SEND & AP (Circuits) | "RSE for SEND & AP (Circuits)" | `[one-sentence summary, voice TBD]` — current draft: "Workbook-based RSE designed for SEND and alternative provision. Self-paced, simplified keynotes, doodle and game space." |
| Training | "RSE Training" | `[one-sentence summary, voice TBD]` — current draft: "CPD-accredited training that gives your staff the confidence and skills to deliver RSE effectively." |

**Photography requirements.** Every flagship card needs its own photograph. Generic stock is unacceptable here — each card is the first impression of a specific service and the photograph does most of the differentiation work. Primary needs primary-age imagery; Secondary needs secondary-age imagery; SEND & AP needs Circuits workbook imagery (not whole-class delivery, because Circuits is not a whole-class product); Training needs teacher-CPD imagery (adults, not students). If the photograph of a given card is not yet available, that card ships without its image and displays the `--bg-tinted` fallback colour — but shipping without photography should be treated as a launch blocker for the hub as a whole.

### §4 — Secondary service row

Two smaller cards in a single row. Same card component as §3, just in a tighter grid. Shares the `--bg-surface-alt` surface with §3 as part of the continuous "services block".

- **Outer wrapper:** `<div class="services-secondary-row">` nested inside the `services-block` wrapper (same background).
  - `padding-top: var(--space-global-2xl)` — this is the visual break between the flagship grid above and the secondary row. Not a new section, just a larger gap.
- **Inner wrapper:** same `max-w-[var(--container-max-shell)]` as §3.

**Section subheading:**

- `<h3>` (not h2, because this is a subsection of the services block, not a new top-level section). Text: "Also from Tailor" or "Other ways we work with schools". Working placeholder only.
- Tokens: `--font-tailor-heading-stack`, `--text-prose-size-h3`, `--heading-weight-h3`, `--text-heading`, `margin: 0 0 var(--space-global-sm)`.
- Subtle separator optional: a `border-top: var(--border-width-xs) solid var(--border-subtle); padding-top: var(--space-global-md);` on the subheading container if the gap alone isn't enough visual break.

**Card grid:**
- `display: grid`, `gap: var(--space-global-md)`.
- `1fr` on mobile, `repeat(2, 1fr)` at `≥ 640px` and above.

**Card variant (`.service-card--secondary`):**

Same structure as `.service-card--flagship` (same HTML, same hover, same title + description + action link), but with a slightly reduced image aspect ratio so the row reads as physically shorter than the flagship row above it:

| Property | Override |
|---|---|
| `.service-card__img` `aspect-ratio` | `16 / 9` (was `4 / 3`) |

Typography stays the same. The hierarchy signal comes from the image-ratio difference and the position below the flagship grid, not from visible font shrinkage. The cards are still real products and still deserve proper typographic treatment — we just don't want Drop Days looking like the fifth-wheel version of Primary delivery.

**Content slots per card:**

| Card | Title | Description slot |
|---|---|---|
| Drop Days | "Drop Days" | `[one-sentence summary, voice TBD]` — current draft: "A full day of RSE delivery across multiple year groups — maximum impact, minimum disruption." |
| Policy & Curriculum Planning | "RSE Policy & Curriculum Planning" | `[one-sentence summary, voice TBD]` — current draft: "Expert guidance to develop your RSE policy, plan your curriculum, and communicate your approach to parents." |

**Photography requirements.** Same rule as flagship cards: each card needs its own photograph. Drop Days should show a multi-year-group delivery context (assembly hall, cohort setting); Policy & Curriculum Planning is the hardest to photograph authentically and may benefit from a document-based or consultation-setting shot. If stock is unavoidable on this card, keep it abstract rather than performative.

### §5 — Framework alignment strip (optional)

A quiet single-row strip listing the frameworks Tailor's work aligns to. Not logo-dominant — a restrained typographic statement with optional small inline logos. The C5 v3 spec pushed logo badges off to the Our Approach page, but B5 is the other legitimate home for credibility at a glance, because this is where school leaders arrive from organic search and need immediate reassurance before they've committed to reading anything.

- **Conditional:** Optional. Ships if Tailor wants the credibility row; omits cleanly if not. Default: include.
- **Outer wrapper:** `<section class="services-framework-strip">`, on `--bg-page` ground.
  - `w-full py-[var(--space-global-lg)] px-[var(--space-global-gutter)]`
- **Inner wrapper:** `mx-auto w-full max-w-[var(--container-max-shell)]`, `text-align: center`.

**Label:**

- `<p class="services-framework-strip__label">` — text: "Aligned with DfE statutory guidance, the PSHE Association framework, and international best practice." (Or equivalent — this is factual content, not brand voice, so the existing copy from `services/index.astro` is fine.)
- Tokens: `--font-tailor-body-stack`, `--text-card-size-body`, `--font-weight-medium`, `--text-body-muted`, `line-height: var(--lh-body)`, `margin: 0`.

**Optional logo row** (below the label, or replacing the inline framework names):

- A single centred row of framework logos: DfE, PSHE Association, UNESCO, WHO (whichever Tailor formally aligns to).
- Each logo as a `<img>` with `height: 2rem`, `width: auto`, `opacity: 0.7`, `filter: grayscale(1)` — a restrained presentation that adds credibility without shouting.
- Gap between logos: `var(--space-global-lg)`.
- Wraps on mobile.
- **Implementation note:** if a logo strip is added, we need licensed permission for each logo. Some frameworks (DfE) require specific branding usage rules; check each before shipping. The label-only variant is safer and should be the default.

**Rule:** keep this section short and quiet. It exists to plant a credibility flag in passing, not to dominate. Not more than 3 lines of vertical space.

### §6 — Testimonial (dark authority band, optional)

A single pull quote on a dark band. Same treatment as C5 §6 — the only dark section on the page, emotional peak, borrowed for tonal consistency across the services section of the site. No hard CTA button here (that's C5's job) — just the quote and attribution.

- **Conditional:** Optional. Renders if a general Tailor-wide testimonial exists that speaks to the whole services offering rather than a specific C5 page. If no such quote exists, omit the section entirely — do not render an empty dark band.
- **Outer wrapper:** Full-bleed `<section class="services-proof-band">`.
  ```css
  .services-proof-band {
    background: var(--bg-emphasis);
    color: var(--text-on-dark);
  }
  ```
  - `w-full py-[var(--space-struct-y-base)] px-[var(--space-global-gutter)]`
- **Inner wrapper:** `mx-auto w-full max-w-[var(--container-max-prose)]`, `text-align: center`.

**Quote text (`.services-proof-band__quote`):**

Same tokens as C5 §6 dark band quote:

| Property | Value |
|---|---|
| `font-family` | `var(--font-tailor-body-stack)` |
| `font-size` | `var(--text-display-size-h3)` |
| `font-style` | `italic` |
| `font-weight` | `var(--font-weight-regular)` |
| `color` | `var(--text-on-dark)` |
| `line-height` | `var(--lh-heading)` |
| `margin` | `0 0 var(--space-global-md)` |

**Attribution (`.services-proof-band__source`):**

| Property | Value |
|---|---|
| `font-family` | `var(--font-tailor-body-stack)` |
| `font-size` | `var(--text-card-size-body)` |
| `font-weight` | `var(--font-weight-medium)` |
| `color` | `var(--text-on-dark)` |
| `opacity` | `0.8` |
| `margin` | `0` |

Prefixed with "— ".

**Below the attribution** — a small text link: "Read more from schools we've worked with →". Links to `/testimonials`. `color: var(--text-on-dark)`, `opacity: 0.7`, hover `opacity: 1`. `margin-top: var(--space-global-md)`. This is the only actionable element on the dark band and it's a soft browsing link, not a conversion button.

**No CTA button on this band.** C5 uses the dark band as a conversion moment and the white button is the primary CTA for that specific service. B5's dark band is about authority and proof across the whole services offering — putting a CTA button here would either force a commitment to a non-existent generic enquiry ("Enquire about our services") or create a second CTA competing with the soft planning-call CTA in §7. Neither is good. The dark band on B5 is quieter than on C5 by design.

### §7 — Soft planning-call CTA

The closing section. Anyone who has scrolled here without clicking a service card is the reader who doesn't know which service fits — probably a new PSHE lead, a school leader at the evaluation stage, or a teacher whose school is considering Tailor but hasn't decided what shape the engagement should take. The right answer to that reader is not a hard enquiry form — it's a conversation offer.

- **Outer wrapper:** `<section class="services-closing-cta">`, on `--bg-surface-alt`.
  - `w-full py-[var(--space-struct-y-base)] px-[var(--space-global-gutter)]`
  - `style="background: var(--bg-surface-alt);"`
- **Inner wrapper:** `mx-auto w-full max-w-[var(--container-max-prose)]`, `text-align: center`.

**Content structure:**

1. **Eyebrow** — `<span class="services-closing-cta__eyebrow">` text: "Not sure which service fits?" (or equivalent — this is the only part of §7 where the working copy from the existing `index.astro` page can be kept near-verbatim, because it already hits the right soft-ask tone).
   - Tokens: `--font-tailor-body-stack`, `--text-card-size-body`, `--font-weight-semibold`, `--brand-accent-text`, uppercase, `letter-spacing: var(--text-eyebrow-ls)`, `margin-bottom: var(--space-global-xs)`.

2. **Headline** — `<h2 class="services-closing-cta__title">` — text slot. Working placeholder: "Let's talk about what your school needs". Voice TBD.
   - Tokens: `--font-tailor-heading-stack`, `--text-prose-size-h2`, `--heading-weight-h2`, `--text-heading`, `line-height: var(--lh-heading)`, `margin: 0 0 var(--space-global-sm)`.

3. **Supporting line** — `<p class="services-closing-cta__text">` — 1 sentence of reassurance explaining what a planning call is. Working placeholder: "A 20-minute call with one of our educators — no commitment, just a conversation about what RSE looks like in your school." Voice TBD.
   - Tokens: `--font-tailor-body-stack`, `--text-prose-size-body`, `--text-body`, `line-height: var(--lh-body)`, `margin: 0 0 var(--space-global-md)`.

4. **Primary button** — `<a href="/contact?service=planning-call" class="btn btn--std btn--primary has-icon-hover">` — text: "Book a planning call".
   - Analytics attributes: `data-analytics-event="cta_click"`, `data-analytics-cta-type="hub_planning_call"`, `data-analytics-service-type="planning-call"`.

5. **Secondary text link** — below the button, on its own line: `<a href="/contact" class="link-default">Or send us a message →</a>`.
   - Provides a lower-friction alternative for readers who don't want to commit to a scheduled call.
   - Tokens: `--font-tailor-body-stack`, `--text-card-size-body`, `--link-default`, `margin-top: var(--space-global-md)`.

**Why a new `?service=planning-call` param.** This adds a new value to the existing `serviceParam` pattern used by `CtaServiceEnquiry` on C5 pages. The contact form needs to handle this value explicitly (pre-fill a "this is a planning-call enquiry, not a specific service enquiry" state, and route the enquiry to the correct inbox if routing differs). The contact form (E1) spec may need updating to enumerate the planning-call value alongside the existing C5 service params. See §9 contradictions and the build checklist.

**Do not use `CtaServiceEnquiry.astro` here.** That component is purpose-built for C5 service pages and assumes a specific service name. The hub's closing CTA is semantically different (no service, routing call) and should be implemented as a small local component or inline section rather than forced through the C5 CTA component. Proposed filename if componentised: `CtaPlanningCall.astro`.

---

## 4 · Template structure

```
<BaseLayout>

  <header class="services-hero">                  ← --bg-tinted
    §1: Eyebrow + h1 + subtitle + hero image (no CTA button)
  </header>

  <section class="services-philosophy">           ← --bg-page
    §2: Philosophy bridge — lead paragraph + body paragraphs + optional "Read more" link
  </section>

  <section class="services-block">                ← --bg-surface-alt (shared surface)

    <div class="services-flagship-grid">          ← §3
      h2 + 4-card grid (Primary / Secondary / SEND & AP / Training)
    </div>

    <div class="services-secondary-row">          ← §4 (same surface, internal break)
      h3 + 2-card row (Drop Days / Policy & Curriculum Planning)
    </div>

  </section>

  {showFrameworkStrip && (
    <section class="services-framework-strip">    ← --bg-page
      §5: Alignment label (+ optional logo row)
    </section>
  )}

  {testimonialQuote && (
    <section class="services-proof-band">         ← --bg-emphasis (dark)
      §6: Quote + attribution + "Read more testimonials" link (no CTA button)
    </section>
  )}

  <section class="services-closing-cta">          ← --bg-surface-alt
    §7: Soft planning-call CTA — eyebrow + h2 + supporting line + primary button + secondary link
  </section>

</BaseLayout>
```

**Key structural point:** §3 and §4 are sibling `<div>`s inside one `<section class="services-block">` wrapper. The `--bg-surface-alt` background is applied to the `services-block` wrapper so it stretches continuously from the top of the flagship grid to the bottom of the secondary row. Do not apply the surface tint to the two child divs separately — that would create a gap at the internal break and defeat the "one services block, two tiers" visual.

---

## 5 · Layer scoping

```html
<body>
  <header>…shell (Lexend)…</header>
  <main id="main">
    <!-- B5 content — Tailor layer throughout, no .layer-ota -->
  </main>
  <footer>…shell (Lexend)…</footer>
</body>
```

No `.layer-ota` anywhere on this page. Tailor layer throughout. Lexend typography, neutral/tinted surfaces, teal accent for actions. B5 is a Tailor-only page — there is no Okay to Ask appearance on the services hub.

---

## 6 · Responsive behaviour

| Breakpoint | Hero | Philosophy | Flagship grid | Secondary row | Framework strip | Dark band | Closing CTA |
|---|---|---|---|---|---|---|---|
| `< 640px` | Stacked (text → image) | Single column | 1 column | 1 column | Wraps | Centred, full width | Centred, full width |
| `≥ 640px` | Stacked (text → image) | Single column | 2 columns (2×2) | 2 columns | Single row | Same | Same |
| `≥ 768px` | 2-column (text + image) | Single column | 2 columns (2×2) | 2 columns | Same | Same | Same |
| `≥ 1024px` | Same | Same | 4 columns (single row) | 2 columns | Same | Same | Same |

The flagship grid goes from 2×2 to a single row of 4 at the `≥ 1024px` breakpoint. Below that, keeping it as a 2×2 block is actually better than forcing a 4-across — the 4-across layout on mid-width viewports squashes each card's photography and description into an unreadable strip. The 2×2 grid is the natural layout for 4 equal items and should be the default for anything below desktop.

The secondary row stays at 2 columns across all breakpoints above mobile — Drop Days and Policy are always side-by-side on any reasonably wide viewport, because stacking them vertically would imply a further hierarchy we don't want (Drop Days above Policy and Curriculum Planning suggesting Drop Days is more important, which isn't the point).

---

## 7 · SEO & metadata

- **`<title>`:** `"RSE Services for Schools — Tailor Education"` (current). Stable, no change.
- **`<meta name="description">`:** `"Expert RSE delivery, training, drop days and curriculum planning for schools. Explore Tailor Education's full range of services."` (current). Stable.
- **`og:image`:** the hero photography (`/images/services/tailor-education-rse-consultant-school-corridor.webp` or whichever image ends up in the hero).
- **`canonicalPath`:** `/services/`
- **JSON-LD — Service aggregate:**

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "RSE Services for Schools",
  "description": "Expert RSE delivery, training, drop days and curriculum planning for schools.",
  "provider": {
    "@type": "Organization",
    "name": "Tailor Education",
    "url": "https://tailoreducation.org.uk"
  }
}
```

The current implementation already has this JSON-LD in place — retain unchanged. No per-service JSON-LD here; each C5 page carries its own Service schema.

---

## 8 · Accessibility

- `<header>` for §1 (the hero is the page's primary landmark).
- `<main>` wraps all content sections (via `BaseLayout`).
- `<h1>` only in §1. `<h2>` in §3 (flagship grid heading), §7 (closing CTA headline), and optionally §6 (if the dark band gets a heading — current spec doesn't include one). `<h3>` in §4 (secondary row subheading) — **heading hierarchy gap:** the §4 h3 follows the §3 h2, which is sequential and valid, but readers using heading navigation should be aware the secondary row is a subsection of the services block rather than a new top-level section.
- Hero image: meaningful `alt` required.
- Flagship and secondary service cards: each is an `<a>` wrapping the whole card. Focus ring appears on the whole card. Cards are keyboard-operable as a single interactive element.
- Card images: `alt` attributes should be meaningful (describing what the image shows), not empty — these images are content, not decoration, and convey real information about what the service looks like.
- Framework alignment strip: if a logo row is included, each logo `<img>` needs a meaningful `alt` (e.g. `alt="Department for Education"`). The paragraph label is plain text.
- Dark band (§6): all text uses `--text-on-dark` for AAA contrast against `--bg-emphasis`. The "Read more testimonials" link at 0.7 opacity needs verification — if it falls below AA contrast against the dark background at that opacity, raise to 0.85 or drop the opacity reduction entirely.
- Soft CTA button: standard `.btn` focus ring.
- Secondary text link in §7: standard link focus ring.
- Reading order is linear top-to-bottom, no tab-order traps.

---

## 9 · Contradictions & clarifications

| Topic | Resolution |
|---|---|
| Stale content spec | `Tailor_Page_Content_Spec_v1.md` lists four services under B5 (direct delivery / training / drop days / policy) and uses routes that no longer exist (`/services/delivery`, `/rse-training`). The current truth is six services as listed in §0.1 of this spec. The content spec should be updated in a separate pass; this layout spec is the source of truth for B5 content structure going forward. |
| No hub page (RSE Delivery) | The v2 C5 spec included a `/services/rse-delivery` hub variant. That is gone in C5 v3. The six C5 pages are flat siblings. B5 is the only page in the services section that carries routing responsibility. |
| `/services/delivery` route | Current file exists (`src/pages/services/delivery.astro`). Action: delete or 301 redirect to `/services`. |
| `/services/rse-delivery.astro` | Current file exists but has no layout role post-v3. Action: delete or 301 redirect to `/services`. |
| `/services/consultancy.astro` | Stub — no longer in scope per site structure doc. Action: remove. |
| `CtaServiceEnquiry` reuse | Not reused on B5 §7. B5's closing CTA is semantically a planning-call offer, not a service enquiry. Implement as `CtaPlanningCall.astro` or inline section. |
| `?service=planning-call` param | New value for the contact form's `serviceParam` enumeration. Contact form (E1) needs to handle this value — pre-fill, subject line, and routing logic. Add to the E1 spec as part of the B5 rollout. |
| Framework logos | Optional. Label-only variant is the default for shipping. Logo variant requires licensed usage rights for each framework logo; check before implementing. |
| C5 dark band CTA vs B5 dark band no-CTA | C5 §6 dark band has a white primary button (service-specific enquiry). B5 §6 dark band has no button (just quote + attribution + soft text link). This is intentional — B5 is routing, not converting, and the closing soft CTA in §7 carries the page's only action. |
| Testimonial content | C5 pages use service-specific testimonials per page. B5 should use a Tailor-wide testimonial that speaks to the whole services offering. If no such quote exists, omit §6 rather than reuse a C5 quote out of context. |
| Surface tint on §3/§4 | Applied to the parent `services-block` wrapper, not the child divs. One continuous `--bg-surface-alt` band stretching from flagship grid to secondary row. |
| Flagship card photography | Required on every flagship card. Not optional. If a photograph isn't available for a service, the hub card ships without image (tinted fallback), but hub launch should wait for photography to be ready. |
| Secondary card photography | Same rule — required. Drop Days and Policy get their own photography. Stock is acceptable on Policy if no authentic shot is available. |
| Hero CTA button | None. The hub hero has no button. Conversion is C5's job. |
| Soft CTA vs hard enquiry | Chosen: soft planning-call offer. Reasoning: readers who scroll to the bottom of a hub page without clicking a service card are signalling indecision, and the right response to indecision is a lower-commitment conversation offer, not a hard ask. |

---

## 10 · Build checklist

### File work

1. [ ] Update `src/pages/services/index.astro` to the structure in §4
2. [ ] Update hero container from `max-w-4xl` to `--container-max-shell`
3. [ ] Add philosophy bridge section (with content slot placeholder until real copy lands)
4. [ ] Restructure card grid into flagship (4) + secondary (2) tiered layout inside a single `.services-block` wrapper
5. [ ] Add photography slots to each of the 6 service cards
6. [ ] Upgrade trust signal to framework alignment strip (§5) — label variant as default
7. [ ] Add testimonial dark band (§6) — conditional on testimonial content existing
8. [ ] Rewrite closing CTA (§7) as planning-call variant with `?service=planning-call` param

### Routes and redirects

9. [ ] Delete `src/pages/services/delivery.astro` or set 301 redirect → `/services`
10. [ ] Delete `src/pages/services/rse-delivery.astro` or set 301 redirect → `/services`
11. [ ] Delete `src/pages/services/consultancy.astro` (out of scope stub)
12. [ ] Confirm `/training` legacy route 301 → `/services/rse-training` (handled in C5 v3 build checklist — verify only)

### Component work

13. [ ] Create `CtaPlanningCall.astro` (or inline the §7 section directly in `services/index.astro` — componentise only if reused elsewhere)
14. [ ] Update contact form (E1) `serviceParam` handler to accept `planning-call` value
15. [ ] Wire planning-call analytics event (`data-analytics-cta-type="hub_planning_call"`)

### Content

16. [ ] **Write the philosophy bridge prose** — 2–3 paragraphs, voice per Tailor brand. This is the content blocker for B5 launch.
17. [ ] **Source photography for all 6 service cards** — Primary, Secondary, SEND & AP (Circuits — workbook), Training (CPD adults), Drop Days, Policy. This is the visual blocker for B5 launch.
18. [ ] Tighten the 6 card description copy per the voice rule (no punchdowns, first-person plural, specific failure modes)
19. [ ] Source a Tailor-wide testimonial for §6 (or decide to omit §6)
20. [ ] Confirm framework alignment strip copy — label-only or label + logos decision
21. [ ] Write §7 closing CTA copy (headline, supporting line)

### Navigation and wayfinding

22. [ ] Confirm A3 nav exposes `/services` directly (no dropdown containing the six C5 routes) — per site structure v3 flat nav decision
23. [ ] Confirm A12 "Bring into your school" CTA on landing pages points to `/services` (not to a specific C5 page)
24. [ ] Confirm homepage (B1) services section links into `/services` rather than directly into C5 pages

### Verification

25. [ ] Visual review: mobile, tablet, desktop — confirm hero 2-col layout at ≥768px, flagship grid 2×2 at mid, 4-across at ≥1024px, secondary row always 2-across above mobile
26. [ ] Confirm §3 and §4 share one continuous `--bg-surface-alt` band with no visible seam at the internal break
27. [ ] Confirm whole-card hover and focus states work on all 6 service cards
28. [ ] Confirm dark band contrast (if §6 renders) — all text/link combinations pass WCAG AA
29. [ ] Confirm `?service=planning-call` pre-fills the contact form correctly
30. [ ] Confirm page has no hero CTA button and no mid-page enquiry button — the only CTA is the §7 planning-call button plus the §7 secondary text link
31. [ ] Pagefind: confirm `/services` is indexed
32. [ ] Lighthouse: LCP candidate is the hero image, not a downstream card; CLS stays below 0.1 with all 6 card images loading lazily

---

*Document version: 1.0 | Date: 11 April 2026*
