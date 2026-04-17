# Tailor Layout Spec — B3 Our Approach

| Field | Value |
|---|---|
| **Page** | Our Approach |
| **Route** | `/our-approach` |
| **Template** | `src/pages/our-approach.astro` (rewrite of existing draft — see §0.1) |
| **Layer** | Tailor (default — no `.layer-ota` class) |
| **Instances** | 1 |
| **Version** | 1.0 |
| **Date** | 2026-04-13 |

---

## 0 · Purpose

`/our-approach` is the trust page *in depth*. If B2 is "who we are and why you should trust us" at a glance, B3 is "here, in detail, is the thinking, the evidence, and the discipline behind the content." It is not a marketing page and it should not read like one. It is the page a headteacher reads to satisfy their governors, the page a PSHE lead forwards to a sceptical parent, the page that ends up quoted in a policy document or referenced in an Ofsted file.

Three readers use this page deliberately:

1. **School leaders and governors** — vetting Tailor as a provider, needing evidence of pedagogical seriousness and framework alignment. They will read the page carefully and possibly print it. Primary audience.
2. **PSHE leads and classroom teachers** — already convinced enough to land here, now wanting to understand *how* the content thinks about the hard things (safeguarding, disclosure, sensitivity). They will scan headings and read sections selectively.
3. **Inquisitive parents** — the smaller slice, but the most emotionally loaded. They want to know that the people writing about sex education for their child are thoughtful, careful, and accountable. They will read the top, skim the middle, and read the safeguarding section closely.

All three benefit from the same page. None benefit from a services pitch (B4 / C5 do that). None benefit from marketing voice. What they all benefit from is: a clear statement of pedagogical stance, a detailed-but-scannable framework map, a visible safeguarding commitment with specifics, and an honest account of how content is authored and kept current.

**Mood.** Calm institutional authority with editorial density. This is the most text-heavy page on the Tailor layer — roughly a 4–6 minute read — and the layout's job is to keep long-form prose legible and navigable without becoming a wall. The art direction brief calls the Tailor layer "structured, spacious, editorial, but not austere." B3 is the clearest expression of that on the whole site. Surface rhythm alternates `--bg-page` reading mode with `--bg-surface-alt` structural breaks; a single muted `--bg-emphasis` authority band is used once — on the safeguarding section, where tonal gravity is earned — and nowhere else.

**Editorial reference.** The layout pattern is cousin to C3 (topic landing pages), which the art direction brief identifies as "the most editorial-feeling pages on the site." Both pages alternate reading prose (44rem, `--bg-page`) with structural groupings (72rem, tinted) across a consistent `--space-struct-y-base` vertical rhythm. The critical difference: C3 is a hybrid editorial-conversion page (it ends at a mid-page CTA); B3 is a trust-first page and sustains long prose further before resolving to a single quiet CTA at the foot.

---

## 0.1 · Relationship to the existing `src/pages/our-approach.astro`

A draft of this page exists at `src/pages/our-approach.astro` (127 lines, last touched as a placeholder) with six content sections plus hero and CTA: How we write content, Framework alignment (four framework cards in a 2-col grid), Safeguarding commitment, Inclusivity, The Okay to Ask editorial approach, CTA. The draft uses ad-hoc class names (`.approach-hero`, `.approach-section`, `.approach-framework`) and hardcoded style values (`max-w-4xl`, raw `line-height: 1.6`, raw `line-height: 1.7`, raw `max-width: 36rem`).

**This spec supersedes the draft.** The rewrite:

- **Keeps** How we write content → becomes "Pedagogical approach" (§4.2), expanded to cover evidence base, age-appropriateness, inclusivity, and honesty as four threads of a single stance. The draft's "Inclusivity" section is folded in here rather than standing as a separate block — inclusivity is not a module, it is part of how we write.
- **Keeps** Framework alignment (§4.3) and expands it: each framework gets a heading, a short "what it is" paragraph, a "how Tailor maps to it" paragraph, and (where helpful) a short list of specific Tailor practices linked to that framework. The 2-col card grid is replaced with a full-measure editorial layout inside the prose column — frameworks are reference material, not feature tiles.
- **Keeps and elevates** Safeguarding commitment (§4.4). Becomes the one section on this page that uses `--bg-emphasis` surface treatment. The draft's compact two-paragraph block becomes a structured section with named subsections (Disclosure-aware design, FGM mandatory reporting, KCSIE awareness, Content sensitivity system).
- **Adds** Content review process (§4.5) — an editorial-discipline section the existing draft doesn't have. Who writes, who checks, how content stays current, how corrections are handled, what the publication log says. This is the page's quiet proof of seriousness.
- **Drops** the standalone Inclusivity section (folded into §4.2 Pedagogical approach).
- **Drops** "The Okay to Ask editorial approach" section — Okay to Ask has its own editorial voice documentation on the OTA layer (see C1 and B11). Surfacing it on the Tailor trust page muddies the layer boundary the art direction brief explicitly establishes.
- **Replaces** hardcoded font sizes / line-heights / widths with token references (`--lh-prose`, `--container-max-prose`, etc.).
- **Rewrites** the CTA section as a single soft card, same pattern as B2 §4.5 — one primary action ("Get in touch"), no outline button. The draft's dual-button row ("Explore our training" + "Browse topics") is not appropriate for a trust page close; a reader who has finished B3 is evaluating Tailor as an organisation, not shopping for a product.

Section §0.2 below enumerates the specific code in the existing draft that must be removed or replaced during the rewrite.

---

## 0.2 · Code to remove / replace from the existing draft

Before building the new B3, the following items in `src/pages/our-approach.astro` are removed:

| Line(s) in draft | What | Action |
|---|---|---|
| 15 | `<article class="approach-page">` root | Replace with `<main class="approach-page">` — page-level wrapper, not an article |
| 17–23 | Hero block (`.approach-hero` wrapping `max-w-4xl`) | Rewrite with `--container-max-shell` inner and `--bg-tinted` surface (see §4.1) |
| 18 | `max-w-4xl` on inner wrapper | Replace throughout with the correct container token per section (see §3) |
| 26–36 | "How we write content" section (§1 in draft) | Rewrite as the first half of §4.2 Pedagogical approach |
| 38–61 | "Framework alignment" section with `.approach-frameworks` 2-col card grid | Rewrite as single-column prose with framework-block pattern (§4.3); drop `.approach-framework` card class |
| 42–59 | 4 framework cards (`DfE`, `PSHE`, `UNESCO`, `WHO`) | Data-drive from a typed `FRAMEWORKS` array in frontmatter (see §2.1); expand each block with the "what / how we map / examples" shape (§4.3) |
| 64–74 | "Safeguarding commitment" section on `--bg-page` | Rewrite on `--bg-emphasis` surface with inverted text, structured subsections (§4.4) |
| 77–84 | Standalone "Inclusivity" section | Delete — fold the copy into §4.2 Pedagogical approach as one of the four stance threads |
| 87–97 | "The Okay to Ask editorial approach" section | Delete — wrong layer for this page; OTA voice lives on C1 / B11 |
| 100–107 | Dual-button CTA block | Rewrite as single-button tinted card (§4.6) |
| 111–126 | Entire `<style>` block | Rewrite — token references only, new class names under §4 |
| 115 | `line-height: 1.6` (raw) | Replace with `var(--lh-body)` |
| 119 | `line-height: 1.7` (raw) | Replace with `var(--lh-prose)` |
| 119 | `max-width: 36rem` (raw) | Replace with `var(--container-max-prose)` at the container level, not on `<p>` |
| 121 | `.approach-frameworks` grid | Delete — frameworks no longer rendered as a card grid |
| 122 | `.approach-framework` card | Delete — replaced by inline `.approach-framework-block` prose pattern (§4.3) |
| 125 | `@media (min-width: 768px)` framework 2-col rule | Delete — single-column prose throughout |

**No changes needed to:** `BaseLayout` import, the `title` attribute (though `description` copy should be refined — see §9), the top-level `.approach-page { background: var(--bg-page); }` rule.

**Routes and links to preserve:** `/contact` (CTA target from §4.6), `/topics` (inline reference from §4.3 framework mapping), `/services/rse-training` (inline reference where relevant). The draft's direct buttons to those last two are removed; the links survive as inline prose anchors.

---

## 1 · Reference documents

- `Tailor_Layout_Spec_Shell.md` — header, footer, container-width tokens
- `Tailor_Layout_Spec_B1.md` — homepage; layer-scoping model, tone precedent
- `Tailor_Layout_Spec_B2.md` — About; sibling trust page, surface-rhythm and CTA-card conventions reused here
- `Tailor_Layout_Spec_C3.md` — topic landing; editorial pattern (alternating reading prose + structural grouping + spot illustrations for section markers) that B3 adopts
- `Tailor_Page_Content_Spec_v1.md` — B3 section (note: content spec's 6-section list is superseded by this spec's 5-section structure; see §10 contradictions)
- `Tailor_Art_Direction_Brief_v1 (1).md` — "structured, spacious, editorial, but not austere"; surface hierarchy; trust-page mood
- `Tailor_Design_System_Implementation_Notes.md` — token vocabulary, layer scoping, component patterns
- `Tailor_Site_Copy_Writing_Rules.md` — governs prose voice on this page specifically
- `Tailor_Image_Requirements.md` — reference for the section-marker spot illustration pattern (deferred on B3, see §4)

---

## 2 · Data requirements

### 2.1 Frameworks

Framework data is a typed array declared in the page frontmatter. Unlike Notion-backed content, the four reference frameworks are stable and low-volume; a typed constant is the right shape.

```typescript
// src/pages/our-approach.astro — frontmatter

interface Framework {
  /** Short canonical name, used as the subsection heading. */
  name: string;
  /** Full title including year / edition when relevant. */
  fullTitle: string;
  /** One-paragraph description of what the framework is and who issues it. */
  whatItIs: string;
  /** One-paragraph description of how Tailor content maps to it. */
  howWeMap: string;
  /** Optional 2–3 bullet examples of specific Tailor practices tied to this framework. */
  examples?: string[];
  /** Optional external source link. Rendered inline after `fullTitle` when present. */
  sourceUrl?: string;
}

const FRAMEWORKS: Framework[] = [
  {
    name: 'DfE statutory guidance',
    fullTitle: 'Department for Education statutory guidance for Relationships Education, RSE and Health Education (2020, revised 2026)',
    whatItIs: '[COPY TBD]',
    howWeMap: '[COPY TBD]',
    examples: ['[COPY TBD]'],
    sourceUrl: 'https://www.gov.uk/government/publications/relationships-education-relationships-and-sex-education-rse-and-health-education',
  },
  {
    name: 'PSHE Association Programme of Study',
    fullTitle: 'PSHE Association Programme of Study for PSHE Education (KS1–KS5)',
    whatItIs: '[COPY TBD]',
    howWeMap: '[COPY TBD]',
    examples: ['[COPY TBD]'],
    sourceUrl: 'https://pshe-association.org.uk/',
  },
  {
    name: 'UNESCO International Technical Guidance',
    fullTitle: 'UNESCO International Technical Guidance on Sexuality Education (2018)',
    whatItIs: '[COPY TBD]',
    howWeMap: '[COPY TBD]',
    sourceUrl: 'https://www.unesco.org/en/articles/international-technical-guidance-sexuality-education',
  },
  {
    name: 'WHO European Standards',
    fullTitle: 'WHO Regional Office for Europe — Standards for Sexuality Education in Europe',
    whatItIs: '[COPY TBD]',
    howWeMap: '[COPY TBD]',
    sourceUrl: 'https://www.bzga-whocc.de/en/publications/standards-in-sexuality-education/',
  },
];
```

Copy blocks marked `[COPY TBD]` are drafted with the content team and inserted before ship. The data shape is settled; copy can flow in without layout changes.

### 2.2 Content sensitivity system reference

§4.4 references the three-tier content sensitivity / age flagging system used across Okay to Ask. For B3 the system is *described*, not *demonstrated* — no live flag chips render on this page. The canonical visual definition lives on C1 and B11. B3's description of the system stays in prose and does not import the chip component.

### 2.3 Editorial / review signals

§4.5 Content review process references three signals that should appear as prose-rendered facts, not as structured data on this ship:

- Who authors content (single named author: Gareth Esson, RSE specialist)
- Review cadence (annual review + triggered review on legislation change)
- Correction / update protocol (versioned publication log; date-stamped changes at the foot of published pages)

If a `contentReviewLog.json` or a Notion-backed changelog is later introduced, B3 would grow an optional "Recent updates" tile in §4.5. Out of scope for v1.

### 2.4 No other data

No blog posts, no topic lists, no testimonials, no images (beyond an optional section-marker spot illustration slot — deferred; see §4). B3 is a prose page.

---

## 3 · Section map

Numbering matches the template order. Surface, container width, and vertical padding are specified at the section level so the overall rhythm can be read at a glance.

| # | Section | Surface | Container | Vertical padding | Role |
|---|---|---|---|---|---|
| 4.1 | Hero | `--bg-tinted` | `--container-max-shell` | `--space-global-xl` | Title + lede + stance statement |
| 4.2 | Pedagogical approach | `--bg-page` | `--container-max-prose` | `--space-struct-y-base` | Editorial prose; four stance threads |
| 4.3 | Framework alignment | `--bg-surface-alt` | `--container-max-prose` | `--space-struct-y-base` | Structured editorial; one block per framework |
| 4.4 | Safeguarding commitment | `--bg-emphasis` (inverted) | `--container-max-prose` | `--space-struct-y-base` | The single authority band on the page |
| 4.5 | Content review process | `--bg-page` | `--container-max-prose` | `--space-struct-y-base` | Editorial discipline; review cadence |
| 4.6 | Get in touch (CTA) | `--bg-surface-alt` | `--container-max-prose` | `--space-global-xl` | Single primary action, soft card |

**Surface rhythm read-out.** `tinted → page → alt-tinted → emphasis → page → alt-tinted`. Two tint-lift cycles with one authority band at the weight-point of the page. The safeguarding band's gravity is earned by being the only dark surface; if any other section were also on `--bg-emphasis` the device would dilute.

**Container rhythm read-out.** `shell → prose → prose → prose → prose → prose`. Only the hero uses the wider 72rem shell (for the title); everything else sits inside the 44rem reading measure. This is deliberate — B3 is a reading page, not a layout page. Keeping the prose column constant across all five content sections produces the "long, quiet, authoritative" feel a trust page needs.

---

## 4 · Section details

### 4.1 Hero

**Role.** Establish the page's identity, set the reading mode, and give the reader a one-sentence stance statement before the editorial body begins.

**Surface.** Full-bleed `<section class="approach-hero">` on `--bg-tinted` with a `--border-subtle` bottom border (1px, `--border-width-xs`).

**Inner wrapper.** `mx-auto w-full max-w-[var(--container-max-shell)] px-[var(--space-global-gutter)] py-[var(--space-global-xl)]`.

**Contents (in order):**

1. **Eyebrow.** `<span class="approach-hero__eyebrow">` — the string "How we work". Uppercase, letter-spaced via `--text-eyebrow-ls`, `--text-card-size-body`, `--font-weight-semibold`, colour `--text-body-muted`. Margin-bottom `--space-global-xs`.
2. **Page title.** `<h1 class="approach-hero__title">` — "Our approach". Lexend (`--font-tailor-heading-stack`), `--text-display-size-h1`, `--heading-weight-h1`, colour `--text-heading`, `line-height: var(--lh-display)`. Margin `0 0 var(--space-global-md)`.
3. **Lede.** `<p class="approach-hero__lede">` — one to two sentences summarising the page's stance. Lexend body stack, `--text-prose-size-lede` (1.1em), `--font-weight-regular`, colour `--text-body`, `line-height: var(--lh-prose)`. Max-width constrained by the inner wrapper only (no separate cap) — the hero wants the lede to breathe wider than body prose. Margin `0 0 var(--space-global-sm)`.
4. **Stance statement.** `<p class="approach-hero__stance">` — optional one-sentence declarative (e.g. "[COPY TBD: a single sentence summarising the approach — something like: 'Every lesson and answer we publish is written, reviewed, and defended by name.']"). Body stack, `--text-prose-size-body`, `--text-body-muted`, italic. Margin `0`. If copy is not ready at ship, this paragraph can be deferred and the lede stands alone.

**Note on the draft's `.approach-hero__subtitle`.** The new class is `.approach-hero__lede` (journalism spelling, matching B2 precedent and the existing `--text-prose-size-lede` token). The draft's `__subtitle` rule is not reused.

**Mobile.** Title clamps down via `--text-display-size-h1`. Eyebrow and lede stay left-aligned. Vertical padding stays `--space-global-xl` on all viewports.

---

### 4.2 Pedagogical approach

**Role.** The opening long-form section. Sets the editorial voice for the whole page. Describes the four threads of the Tailor pedagogical stance — evidence-based, age-appropriate, inclusive, honest — as a woven argument rather than a feature list.

**Surface.** `<section class="approach-section approach-section--pedagogy">` on `--bg-page` (no surface class declaration needed; page default).

**Inner wrapper.** `mx-auto w-full max-w-[var(--container-max-prose)] px-[var(--space-global-gutter)] py-[var(--space-struct-y-base)]`.

**Contents (in order):**

1. **Section eyebrow.** `<span class="approach-section__eyebrow">` — "Pedagogy". Same eyebrow treatment as the hero (but card-eyebrow letter-spacing, `--card-eyebrow-ls`, to sit a touch tighter inside prose). Margin-bottom `--space-global-xs`.
2. **Section heading.** `<h2 class="approach-section__title">` — "How we teach RSE". Lexend, `--text-prose-size-h2`, `--heading-weight-h2`, colour `--text-heading`, `line-height: var(--lh-heading)`. Margin `0 0 var(--space-global-sm)`.
3. **Section lede.** `<p class="approach-section__lede">` — one-paragraph framing of the four threads about to be discussed. Body stack, `--text-prose-size-lede`, `--font-weight-regular`, colour `--text-body`, `line-height: var(--lh-prose)`. Margin `0 0 var(--space-global-md)`.
4. **Four stance threads.** Each thread is a `<h3>` sub-heading followed by 1–2 `<p>` paragraphs. The four threads, in order:
   - **Evidence-based.** How content is grounded in pedagogical research and UK-specific practice; explicit refusal of ideology-led content in either direction.
   - **Age-appropriate.** The developmental calibration system (mapping to year groups, the three-tier content sensitivity flagging used on Okay to Ask, the principle that honesty and age-appropriateness are not in tension).
   - **Inclusive.** Equality Act 2010 protected characteristics informing every activity; refusal of heteronormative or cisnormative defaults; correct terminology by discipline, not decoration. *(This is the thread the old standalone "Inclusivity" section is folded into — the argument is cleaner here than as a separate block.)*
   - **Honest.** Direct answers to direct questions; no euphemism where clarity is needed; respect for young people's intelligence; safeguarding of innocence without talking down.

**Sub-heading styling (`<h3>`):** Lexend, `--text-prose-size-h3`, `--heading-weight-h3`, `--text-heading`, `line-height: var(--lh-heading-sub)`. Margin `var(--space-global-md) 0 var(--space-global-xs)` — larger top margin than B2's `<h3>` rules to create breathing room between threads. The first `<h3>` suppresses its top margin via `&:first-of-type { margin-top: 0; }`.

**Paragraph styling:** Body stack, `--text-prose-size-body`, `--text-body`, `line-height: var(--lh-prose)`. Margin `0 0 var(--space-global-sm)` between paragraphs.

**Editorial handling of length.** This section will run to approximately 400–600 words once copy is final. To avoid the "wall of prose" failure mode the user flagged, the section relies on three devices:

- **Named `<h3>` threads** (above) that give the reader discrete entry points without fragmenting the argument.
- **Sub-paragraph breaks** within threads — no thread's prose block should exceed ~120 words without a paragraph break. The copy spec will enforce this in drafting.
- **Optional pull-quote.** The layout reserves space for one pull-quote between threads 2 and 3 (age-appropriate → inclusive). The pull-quote is optional; when present, it uses `<blockquote class="approach-pullquote">` with the following treatment: Fraunces (`--font-ota-heading-stack`) at `--text-prose-size-h3`, `--font-weight-regular`, italic, `--text-heading`, `line-height: var(--lh-heading-sub)`, left border `--border-width-sm` solid `--brand-accent-border`, padding-left `--space-global-md`, margin `--space-global-md 0`. This is the one place Fraunces appears on the Tailor layer, and it is used surgically — Fraunces is an editorial device here, not a layer signal (the section remains Tailor; no `.layer-ota` class is applied).

**Mobile.** Prose column fills the viewport minus the gutter. `<h3>` sub-headings step down via clamp. Pull-quote retains its left-border treatment at all widths.

---

### 4.3 Framework alignment

**Role.** The detailed, evidence-heavy version of framework alignment B2 only mentions. A reader can find, for any of the four frameworks, what it is, how Tailor content maps to it, and (optionally) concrete practices tied to the mapping. Editorial prose, not card tiles.

**Surface.** `<section class="approach-section approach-section--frameworks">` on `--bg-surface-alt`.

**Inner wrapper.** `mx-auto w-full max-w-[var(--container-max-prose)] px-[var(--space-global-gutter)] py-[var(--space-struct-y-base)]`.

**Contents (in order):**

1. **Section eyebrow.** `<span class="approach-section__eyebrow">` — "Framework alignment". Same treatment as §4.2 eyebrow.
2. **Section heading.** `<h2 class="approach-section__title">` — "The frameworks we align to". Same treatment as §4.2 heading.
3. **Section intro.** `<p class="approach-section__lede">` — one paragraph explaining the map (what frameworks we align to and why the full list matters). Treatment as §4.2 lede.
4. **Framework blocks.** One `<article class="approach-framework-block">` per `Framework` in `FRAMEWORKS` (see §2.1), in the order declared. Each block contains:
   - **Name.** `<h3 class="approach-framework-block__name">` — the short canonical name from `framework.name`. Lexend, `--text-prose-size-h3`, `--heading-weight-h3`, `--text-heading`. Margin `0 0 var(--space-global-xs)`.
   - **Full title.** `<p class="approach-framework-block__title">` — the full publication title from `framework.fullTitle`. Body stack, `--text-card-size-body`, `--text-body-muted`, `line-height: var(--lh-body)`. Margin `0 0 var(--space-global-sm)`. If `framework.sourceUrl` is present, the full title is wrapped in an `<a>` with `target="_blank"` and `rel="noopener noreferrer"`, underlined, `--brand-accent-text`.
   - **What it is.** `<p>` — content from `framework.whatItIs`. Body prose styling (same as §4.2 paragraphs).
   - **How we map.** Prefixed with a `<span class="approach-framework-block__label">` reading "How Tailor maps." followed inline by the `framework.howWeMap` text inside the same `<p>`. The label span is `--font-weight-semibold` and `--text-heading`; the rest of the paragraph is regular weight. This is a lightweight editorial device — it avoids a second `<h4>` layer while still giving the eye a hook.
   - **Examples (optional).** If `framework.examples?.length > 0`, render `<ul class="approach-framework-block__examples">` with one `<li>` per example. `--text-card-size-body`, `--text-body-muted`, `line-height: var(--lh-body)`, padding-left `1.5rem`, margin `var(--space-global-xs) 0 0`. List-style-type `disc`. The examples are *practices*, not summaries — they read as short declaratives ("Every lesson plan cross-references DfE section numbers.").
   - **Divider.** After each block except the last, a `<hr class="approach-framework-block__divider">` — 1px `--border-subtle`, no margin-collapse, margin `var(--space-global-md) 0`. The divider is visible but quiet; it gives the reader pause between frameworks without forcing a new section.

**No card grid.** The draft's 2-column card grid is explicitly dropped. Framework content is reference material — it rewards being read, not scanned as tiles. Keeping frameworks inside the 44rem prose column puts them in the same reading rhythm as §4.2 and §4.5, which is what the trust posture requires.

**Editorial handling of length.** This section will run to approximately 500–700 words once copy is final. Four framework blocks × ~120 words each + intro. The named `<h3>` per framework is the primary scanning aid; the "How Tailor maps." inline label inside the paragraph is the secondary one. No pull-quote in this section — pull-quotes are reserved for argument prose (§4.2), not reference prose.

**Mobile.** Single column throughout (it was already single-column in the prose measure at all widths; no change). Dividers render full-width inside the prose column.

---

### 4.4 Safeguarding commitment

**Role.** The authority band. The one section on the page where the surface goes dark. The content is serious, the copy is specific, and the visual weight of the section backs that up. The art direction brief is explicit: safeguarding content must not feel decorative, and the visual system must have "genuine tonal range, not one endlessly pleasant mood." §4.4 is where B3 spends that tonal range.

**Surface.** Full-bleed `<section class="approach-section approach-section--safeguarding">` on `--bg-emphasis`. Inverted text colours via a scoped override on the section selector:

```css
.approach-section--safeguarding {
  background: var(--bg-emphasis);
  color: var(--text-on-emphasis);
}
.approach-section--safeguarding .approach-section__title,
.approach-section--safeguarding .approach-section__eyebrow { color: var(--text-on-emphasis); }
.approach-section--safeguarding p { color: var(--text-on-emphasis-muted); }
.approach-section--safeguarding a { color: var(--text-on-emphasis); text-decoration: underline; }
.approach-section--safeguarding h3 { color: var(--text-on-emphasis); }
```

If `--text-on-emphasis` and `--text-on-emphasis-muted` do not already exist, flag in §12 Open items.

**Inner wrapper.** `mx-auto w-full max-w-[var(--container-max-prose)] px-[var(--space-global-gutter)] py-[var(--space-struct-y-base)]`.

**Contents (in order):**

1. **Section eyebrow.** `<span class="approach-section__eyebrow">` — "Safeguarding". Same treatment as §4.2 but inherits inverted colour.
2. **Section heading.** `<h2 class="approach-section__title">` — "Safeguarding is built in, not bolted on". Same treatment as §4.2 heading.
3. **Section lede.** `<p class="approach-section__lede">` — one paragraph stating the overall commitment (that safeguarding informs content design from the ground up).
4. **Four named subsections.** Each is an `<h3>` + `<p>` pair, in this order:
   - **Disclosure-aware activity design.** How lesson activities are shaped to be safe if a disclosure happens mid-activity (e.g. questions that don't force personal disclosure; group formats that allow private follow-up; the trained-adult loop).
   - **FGM mandatory reporting duties.** The statutory duty under s74 Serious Crime Act 2015; how content acknowledges the duty and trains teachers to act on it.
   - **KCSIE awareness.** How Keeping Children Safe in Education 2025 informs activity design, content guardrails, and the content sensitivity flagging system.
   - **Content sensitivity system.** A description (not demonstration) of the three-tier age flagging / content sensitivity system used across Okay to Ask. Explains what the flags mean, why they exist, how the tiers are decided, and where to see them in action (inline link to `/questions/` — which routes to the OTA index C2).

**Sub-heading styling.** Same as §4.2 `<h3>` but with inverted colour via the cascade shown above.

**Editorial handling.** The four subsection pattern is what prevents safeguarding from reading as a vague commitment. Each subsection names a specific discipline; each is a short paragraph (~80–120 words); each can be read in isolation. A school leader scanning for FGM practice can jump straight to that block.

**No card treatment.** Subsections are *not* in cards. A dark authority band with inset cards would read as marketing. Plain inverted prose is the right register.

**Mobile.** Prose column fills the viewport. Vertical padding stays `--space-struct-y-base`. The dark surface extends edge-to-edge on all widths.

---

### 4.5 Content review process

**Role.** The editorial discipline section. Answers the "who writes this and how do you keep it current?" question that B2's short Approach signal section gestures at and B3 settles. Short, specific, verifiable.

**Surface.** `<section class="approach-section approach-section--review">` on `--bg-page`.

**Inner wrapper.** `mx-auto w-full max-w-[var(--container-max-prose)] px-[var(--space-global-gutter)] py-[var(--space-struct-y-base)]`.

**Contents (in order):**

1. **Section eyebrow.** `<span class="approach-section__eyebrow">` — "Editorial process".
2. **Section heading.** `<h2 class="approach-section__title">` — "How content is written, reviewed and kept current".
3. **Section lede.** `<p class="approach-section__lede">` — one paragraph summarising the editorial stance (single named author, scheduled review, triggered review on legislative change, transparent correction log).
4. **Three named subsections.** `<h3>` + `<p>` pairs:
   - **Who writes.** Single named author (Gareth Esson), professional background stated in one sentence with a link to B2 team block (`/about#meet-the-team`) for the full bio. Content is not crowdsourced, not AI-generated, not bought from template libraries.
   - **How it is reviewed.** Scheduled annual review of every live page; triggered review on any change to DfE statutory guidance, PSHE Association Programme of Study, or KCSIE. Where relevant, review sign-off includes an external reader (currently [COPY TBD: external reader arrangement]).
   - **How it stays current.** Every published page carries a `Last reviewed` date in its footer metadata; substantive updates are logged; corrections are versioned and dated inline on the affected page.
5. **Quiet closer.** `<p class="approach-section__closer">` — a single short paragraph in `--text-prose-size-body`, `--text-body-muted`, italic. Something like: "[COPY TBD: e.g. 'If you spot something out of date, misleading, or just plain wrong, please tell us — there's a feedback link on every page.']" The italic closer signals the end of the editorial body before the CTA.

**No schema for live correction data.** §4.5 is descriptive prose only on v1. If a published correction log is later introduced (see §2.3), this section grows an optional "Recent updates" tile below the closer. Out of scope for this ship; noted in §12.

**Mobile.** Same behaviour as §4.2 / §4.3 / §4.4.

---

### 4.6 Get in touch (CTA)

**Role.** The single quiet close. One primary action: `Get in touch`. The page has earned the right to an ask; the ask is small, soft, and appropriate.

**Pattern.** Mirrors B2 §4.5 exactly — a soft tinted card inside the prose column, single button, no secondary action, no dark authority surface at the close (the page's authority work was done by §4.4).

**Surface.** `<section class="approach-cta">` on `--bg-surface-alt`.

**Inner wrapper.** `mx-auto w-full max-w-[var(--container-max-prose)] px-[var(--space-global-gutter)] py-[var(--space-global-xl)]`.

**Card.** `<div class="approach-cta__card">` — `--bg-tinted`, `--radius-lg`, border `--border-width-xs` solid `--border-subtle`, padding `--space-global-lg`, text-align centre, `display: flex; flex-direction: column; gap: var(--space-global-sm); align-items: center;`.

**Card contents:**

1. **Heading.** `<h2 class="approach-cta__title">` — "[COPY TBD: e.g. 'Want to talk to us?']". Lexend, `--text-prose-size-h2`, `--heading-weight-h2`, `--text-heading`, margin `0`.
2. **Supporting line.** `<p class="approach-cta__text">` — one sentence. "[COPY TBD: e.g. 'If you have questions about how we work, what we teach, or how we might help your school, we're happy to hear from you.']" Body stack, `--text-prose-size-body`, `--text-body-muted`, margin `0`, `max-width: 32rem`.
3. **Primary button.** `<a class="btn btn--std btn--primary has-icon-hover" href="/contact">Get in touch</a>`.

**No outline button.** The draft's two-button close (outline + primary) is not reused. One button, one primary action.

**Mobile.** Card padding steps down slightly via `--space-global-md` at narrow widths. Button spans its natural width (not 100%-full) — the card is a quiet invite, not a page-wide banner.

---

## 5 · Template structure

Top-level page structure, with component hierarchy:

```astro
---
/**
 * Our Approach page [B3] — /our-approach
 * Trust page: pedagogical stance, framework alignment, safeguarding, editorial discipline.
 * Tailor layer. Long-form editorial prose pattern shared with C3.
 */
import BaseLayout from '../layouts/BaseLayout.astro';

interface Framework {
  name: string;
  fullTitle: string;
  whatItIs: string;
  howWeMap: string;
  examples?: string[];
  sourceUrl?: string;
}

const FRAMEWORKS: Framework[] = [ /* see §2.1 */ ];
---

<BaseLayout
  title="Our approach — Tailor Education"
  description="How Tailor Education writes RSE content, the frameworks it aligns to, and how safeguarding is built into the work."
  canonicalPath="/our-approach"
>
  <main class="approach-page">

    <!-- §4.1 Hero -->
    <section class="approach-hero">
      <div class="mx-auto w-full max-w-[var(--container-max-shell)] px-[var(--space-global-gutter)] py-[var(--space-global-xl)]">
        <span class="approach-hero__eyebrow">How we work</span>
        <h1 class="approach-hero__title">Our approach</h1>
        <p class="approach-hero__lede">[COPY TBD]</p>
        <p class="approach-hero__stance">[COPY TBD]</p>
      </div>
    </section>

    <!-- §4.2 Pedagogical approach -->
    <section class="approach-section approach-section--pedagogy">
      <div class="mx-auto w-full max-w-[var(--container-max-prose)] px-[var(--space-global-gutter)] py-[var(--space-struct-y-base)]">
        <span class="approach-section__eyebrow">Pedagogy</span>
        <h2 class="approach-section__title">How we teach RSE</h2>
        <p class="approach-section__lede">[COPY TBD]</p>
        <h3>Evidence-based</h3>
        <p>[COPY TBD]</p>
        <h3>Age-appropriate</h3>
        <p>[COPY TBD]</p>
        <!-- optional pull-quote slot -->
        <h3>Inclusive</h3>
        <p>[COPY TBD]</p>
        <h3>Honest</h3>
        <p>[COPY TBD]</p>
      </div>
    </section>

    <!-- §4.3 Framework alignment -->
    <section class="approach-section approach-section--frameworks">
      <div class="mx-auto w-full max-w-[var(--container-max-prose)] px-[var(--space-global-gutter)] py-[var(--space-struct-y-base)]">
        <span class="approach-section__eyebrow">Framework alignment</span>
        <h2 class="approach-section__title">The frameworks we align to</h2>
        <p class="approach-section__lede">[COPY TBD]</p>
        {FRAMEWORKS.map((f, i) => (
          <article class="approach-framework-block">
            <h3 class="approach-framework-block__name">{f.name}</h3>
            <p class="approach-framework-block__title">
              {f.sourceUrl
                ? <a href={f.sourceUrl} target="_blank" rel="noopener noreferrer">{f.fullTitle}</a>
                : f.fullTitle}
            </p>
            <p>{f.whatItIs}</p>
            <p><span class="approach-framework-block__label">How Tailor maps.</span> {f.howWeMap}</p>
            {f.examples && f.examples.length > 0 && (
              <ul class="approach-framework-block__examples">
                {f.examples.map(ex => <li>{ex}</li>)}
              </ul>
            )}
            {i < FRAMEWORKS.length - 1 && <hr class="approach-framework-block__divider" />}
          </article>
        ))}
      </div>
    </section>

    <!-- §4.4 Safeguarding commitment -->
    <section class="approach-section approach-section--safeguarding">
      <div class="mx-auto w-full max-w-[var(--container-max-prose)] px-[var(--space-global-gutter)] py-[var(--space-struct-y-base)]">
        <span class="approach-section__eyebrow">Safeguarding</span>
        <h2 class="approach-section__title">Safeguarding is built in, not bolted on</h2>
        <p class="approach-section__lede">[COPY TBD]</p>
        <h3>Disclosure-aware activity design</h3>
        <p>[COPY TBD]</p>
        <h3>FGM mandatory reporting duties</h3>
        <p>[COPY TBD]</p>
        <h3>KCSIE awareness</h3>
        <p>[COPY TBD]</p>
        <h3>Content sensitivity system</h3>
        <p>[COPY TBD]</p>
      </div>
    </section>

    <!-- §4.5 Content review process -->
    <section class="approach-section approach-section--review">
      <div class="mx-auto w-full max-w-[var(--container-max-prose)] px-[var(--space-global-gutter)] py-[var(--space-struct-y-base)]">
        <span class="approach-section__eyebrow">Editorial process</span>
        <h2 class="approach-section__title">How content is written, reviewed and kept current</h2>
        <p class="approach-section__lede">[COPY TBD]</p>
        <h3>Who writes</h3>
        <p>[COPY TBD — link to <a href="/about#meet-the-team">Gareth's bio</a>]</p>
        <h3>How it is reviewed</h3>
        <p>[COPY TBD]</p>
        <h3>How it stays current</h3>
        <p>[COPY TBD]</p>
        <p class="approach-section__closer">[COPY TBD]</p>
      </div>
    </section>

    <!-- §4.6 Get in touch -->
    <section class="approach-cta">
      <div class="mx-auto w-full max-w-[var(--container-max-prose)] px-[var(--space-global-gutter)] py-[var(--space-global-xl)]">
        <div class="approach-cta__card">
          <h2 class="approach-cta__title">[COPY TBD]</h2>
          <p class="approach-cta__text">[COPY TBD]</p>
          <a class="btn btn--std btn--primary has-icon-hover" href="/contact">Get in touch</a>
        </div>
      </div>
    </section>

  </main>
</BaseLayout>
```

---

## 6 · Client-side behaviour

None. B3 is a fully static page. No JS beyond what BaseLayout already ships (Shell nav, footer, any site-wide scripts). Specifically:

- No filtering.
- No search (Pagefind will index this page but no in-page search surfaces on it).
- No accordions on §4.3 or §4.4 — the frameworks and safeguarding subsections are always expanded. An earlier instinct to make the framework blocks collapsible `<details>` elements is explicitly rejected: collapsed-by-default reduces legibility and makes the evidence look less committed.
- No smooth-scroll anchor nav. If anchor links to `<h3>` subsections are later wanted (e.g. to deep-link from the nav), that is a nav-level concern, not a B3-level concern.

---

## 7 · Responsive behaviour

B3 is single-column prose at every viewport. Responsive work is small:

| Viewport | Behaviour |
|---|---|
| ≥1280px | Prose column caps at 44rem and centres inside `--container-max-shell` on the hero. No other changes. |
| 1024–1279px | Same as above. |
| 768–1023px | Same. Sub-heading sizes step down via the type clamp. |
| 640–767px | Same. Card padding on §4.6 steps to `--space-global-md`. |
| <640px | Gutter tightens via `--space-global-gutter` clamp. Hero title clamps down fully. Pull-quote (if present in §4.2) retains its left-border treatment at all widths. |

**No grid breakpoints.** Unlike B2, B3 has no multi-column grids to reflow.

---

## 8 · Accessibility

- **Landmarks.** `<main class="approach-page">` at the root; every content block is a `<section>` with no explicit role. The hero's `<h1>` provides the page heading. All other content headings are `<h2>`; sub-sections within them are `<h3>`. No heading levels are skipped.
- **Heading outline** (expected from a screen-reader's document outline):
  - h1: Our approach
  - h2: How we teach RSE → h3s: Evidence-based, Age-appropriate, Inclusive, Honest
  - h2: The frameworks we align to → h3s × 4 (from `FRAMEWORKS`)
  - h2: Safeguarding is built in, not bolted on → h3s: Disclosure-aware activity design, FGM mandatory reporting duties, KCSIE awareness, Content sensitivity system
  - h2: How content is written, reviewed and kept current → h3s: Who writes, How it is reviewed, How it stays current
  - h2: (CTA card heading)
- **Colour contrast.** The §4.4 inverted panel uses `--bg-emphasis` / `--text-on-emphasis` pairings which must meet WCAG AA for body text (4.5:1). If the current token values don't, flag as §12 Open item and hold ship on this section.
- **Eyebrow text.** Rendered as `<span>` not `<p>`, and semantically precedes the `<h2>` it introduces. It is not a substitute for the heading; screen readers announce the heading normally.
- **Pull-quote.** Rendered as `<blockquote>` with a `<cite>` only if the source is external. Tailor's own editorial voice does not cite itself.
- **External framework links.** `target="_blank"` links carry `rel="noopener noreferrer"` and an invisible "(opens in new tab)" hint via `aria-describedby` referencing a visually-hidden `<span>` once at page scope. Alternatively, inline `aria-label` on each link naming the destination and "(opens in new tab)" — either is acceptable; be consistent.
- **Focus order.** Source order only — no JS-driven focus management. The hero heading, framework links, in-prose links, and the CTA button form a natural reading-order focus chain.
- **Reduced motion.** N/A — no motion on this page.

---

## 9 · SEO

- **`<title>`** — "Our approach — Tailor Education". (Pinned; matches B2 pattern.)
- **`<meta name="description">`** — "How Tailor Education writes RSE content, the frameworks it aligns to, and how safeguarding is built into the work." (~130 characters; final copy confirmed with marketing.)
- **`<link rel="canonical">`** — `/our-approach`.
- **Pagefind indexing.** Whole page is indexed; no `data-pagefind-ignore`. Eyebrow `<span>` elements are indexed alongside headings (they carry real content). The framework external links are not followed by Pagefind.
- **JSON-LD.** One `AboutPage` schema emitted in the page `<head>`:

```json
{
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "Our approach — Tailor Education",
  "url": "https://tailor-education.co.uk/our-approach",
  "mainEntity": {
    "@type": "EducationalOrganization",
    "name": "Tailor Education",
    "url": "https://tailor-education.co.uk",
    "sameAs": ["https://tailor-education.co.uk/about"]
  }
}
```

The `mainEntity` cross-references the `Organization` schema B2 emits. Both pages describing Tailor point at the same organisation entity; Google resolves them as facets of one organisation.

- **Open Graph / Twitter Card.** Handled by BaseLayout using `title` + `description`. No custom OG image on B3 v1; default Tailor social card applies.

---

## 10 · Contradictions with other specs

| Source | What it says | What B3 does | Why |
|---|---|---|---|
| `Tailor_Page_Content_Spec_v1.md` §B3 | 6 sections: How we write content; Framework alignment; Safeguarding; Inclusivity (standalone); Okay to Ask editorial approach; CTA | 5 sections: Pedagogical approach (absorbs Inclusivity as a thread); Framework alignment; Safeguarding (expanded with 4 named subsections); Content review process (new); CTA | Inclusivity reads stronger as a pedagogical thread than as a standalone section (avoids "inclusion as a checkbox"). Okay to Ask editorial voice belongs on the OTA layer (C1 / B11), not on the Tailor trust page. Content review process is the editorial-discipline proof the content spec omits but the trust posture requires. |
| `Tailor_Page_Content_Spec_v1.md` §B3 CTA | "Explore our training →" and/or "Browse topics →" | Single "Get in touch" CTA | B3 is a trust page; its reader is evaluating the organisation, not shopping for a product. A service-oriented CTA breaks the page's register at the last moment. |
| Existing `src/pages/our-approach.astro` | Framework alignment renders as 2-col card grid | Single-column prose with framework blocks | Frameworks are reference material for careful reading; card tiles encourage scanning over reading and read as feature marketing. |
| Existing `src/pages/our-approach.astro` | Safeguarding on `--bg-page` alongside other sections | Safeguarding on `--bg-emphasis` — the only authority band on the page | The art direction brief explicitly calls for "genuine tonal range" and specifically that safeguarding must not feel decorative. Placing safeguarding on the same surface as other sections flattens the page's voice. |
| `Tailor_Art_Direction_Brief_v1 (1).md` | "Fraunces — headings, display text, pull quotes, section titles" on the Okay to Ask layer | B3 uses Fraunces on a single optional pull-quote in §4.2, without applying `.layer-ota` | Treated as a surgical editorial device, not a layer signal. The pull-quote opts into Fraunces via a scoped class; no other Tailor headings change. If this is uncomfortable it can be removed without any structural change. |
| `Tailor_Layout_Spec_B2.md` §0.1 | B2 also has a short "Our approach" signal section linking to `/our-approach` | B3 is the full version | Intentional; B2 is a doorway, B3 is the room. |

---

## 11 · Build checklist

- [ ] Rewrite `src/pages/our-approach.astro` from the existing draft using §0.2 removal table + §5 template.
- [ ] Replace root `<article class="approach-page">` with `<main class="approach-page">`.
- [ ] Replace every `max-w-4xl` with the correct container token per section (§3 map).
- [ ] Declare `FRAMEWORKS` typed constant in the frontmatter per §2.1; fill `[COPY TBD]` blocks before ship.
- [ ] §4.1 Hero: surface `--bg-tinted`, border-bottom, `--container-max-shell`, `--space-global-xl` padding.
- [ ] §4.1 Hero: eyebrow + h1 + lede (`--text-prose-size-lede`, journalism spelling class `.approach-hero__lede`) + optional stance paragraph.
- [ ] §4.2 Pedagogical approach: `--bg-page`, `--container-max-prose`, `--space-struct-y-base`, 4 × h3 threads.
- [ ] §4.2 Fold Inclusivity copy into the third h3 thread (not a standalone section).
- [ ] §4.2 Reserve pull-quote slot between threads 2 and 3 (optional at ship).
- [ ] §4.3 Framework alignment: `--bg-surface-alt`, `--container-max-prose`, `--space-struct-y-base`.
- [ ] §4.3 Drop `.approach-framework` 2-col card grid from the draft.
- [ ] §4.3 Render one `.approach-framework-block` per framework, with name / full-title / what-it-is / how-we-map / optional examples / divider.
- [ ] §4.4 Safeguarding: `--bg-emphasis`, inverted text via scoped class, `--container-max-prose`.
- [ ] §4.4 Four named h3 subsections (Disclosure-aware, FGM, KCSIE, Content sensitivity).
- [ ] §4.4 Verify `--text-on-emphasis` / `--text-on-emphasis-muted` tokens exist; AA contrast ratio.
- [ ] §4.5 Content review process: `--bg-page`, three h3 subsections (Who writes / How reviewed / How current) + italic closer.
- [ ] §4.5 Who-writes subsection links to `/about#meet-the-team`.
- [ ] §4.6 CTA: soft `--bg-tinted` card inside `--bg-surface-alt` section, single primary button to `/contact`.
- [ ] §4.6 Remove dual-button pattern from the draft (no outline button).
- [ ] Drop the standalone Inclusivity section from the draft.
- [ ] Drop "The Okay to Ask editorial approach" section from the draft.
- [ ] Rewrite the `<style>` block — token references only, new class names (§4).
- [ ] Replace all raw `line-height: 1.7` → `var(--lh-prose)`; `line-height: 1.6` → `var(--lh-body)`.
- [ ] Replace all raw `max-width: 36rem` → `var(--container-max-prose)` on container wrappers (not on `<p>`).
- [ ] Heading outline: h1 (one), h2 per section, h3 per subsection; no skipped levels (§8).
- [ ] External framework links: `target="_blank" rel="noopener noreferrer"` + "(opens in new tab)" aria hint.
- [ ] SEO: `title`, `description`, canonical `/our-approach`, `AboutPage` JSON-LD emitted (§9).
- [ ] Pagefind: no `data-pagefind-ignore` regions on the page.
- [ ] Desktop + mobile visual pass at 360 / 640 / 1024 / 1440 px widths.
- [ ] AA contrast verified on §4.4 inverted panel.
- [ ] Keyboard tab order matches source order; focus styles visible on every link / button.
- [ ] Skip-to-main-content link in Shell lands on `<main class="approach-page">`.
- [ ] Pull-quote (if shipped in §4.2) uses `<blockquote class="approach-pullquote">` with Fraunces via scoped class; no `.layer-ota` applied.
- [ ] All `[COPY TBD]` blocks resolved with content team before ship.

---

## 12 · Open items

- **`--text-on-emphasis` / `--text-on-emphasis-muted` tokens.** §4.4 requires inverted text tokens for the dark authority band. If these don't exist in `tailor-site-v2.css`, add them before building. Flag as a design-system task if not a page-level task.
- **External reader arrangement** (§4.5 "How it is reviewed"). The copy says "where relevant, review sign-off includes an external reader." Confirm whether this is currently true; if an external reader isn't routinely used, the sentence is dropped rather than softened.
- **Content sensitivity system canonical description** (§4.4). The three-tier age flagging system's wording should be consistent between B3 and its canonical home on C1 / B11. Before shipping B3 copy, reconcile the wording so the same sentence appears in both places (or B3 quotes B11 explicitly).
- **Fraunces pull-quote** (§4.2). The precedent "Fraunces lives on the OTA layer" is intentionally bent here for a single editorial device. If the art director prefers to preserve the layer separation strictly, the pull-quote falls back to Lexend at `--text-prose-size-h3` italic — the section works either way.
- **Publication log / correction changelog** (§2.3 / §4.5 closing note). Deferred to a future ship. When introduced, B3 grows a "Recent updates" tile under §4.5.
- **Section-marker spot illustrations.** The art direction brief names four spot illustrations for C3 section markers. B3 does not reuse them at ship (the four C3 illustrations are topic-oriented, not trust-oriented). If a trust-specific spot illustration set is later commissioned, it would attach to §4.2 / §4.3 / §4.4 / §4.5 section openings. Out of scope v1.
- **Hero stance paragraph** (§4.1 item 4). Copy is optional — if not ready at ship, the lede stands alone and `.approach-hero__stance` is removed from the template.
