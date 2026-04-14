# Tailor Layout Spec — B7 Contact

| Field | Value |
|---|---|
| **Page** | Contact |
| **Route** | `/contact` |
| **Template** | `src/pages/contact.astro` (rewrite of existing draft — see §0.1) |
| **Layer** | Tailor (default — no `.layer-ota` class) |
| **Instances** | 1 |
| **Version** | 1.0 |
| **Date** | 2026-04-13 |

---

## 0 · Purpose

`/contact` is the enquiry destination. Every "Get in touch", "Work with us", "Enquire about [service]" and footer contact link on the site resolves here. It is the transactional page — the place where a reader who has decided Tailor is worth talking to completes an enquiry — and it is also the page that a reader who needs urgent safeguarding advice might land on by accident. Both cases need handling calmly on the same page.

Three readers arrive here:

1. **School staff enquiring about a service** — the primary audience. They have usually arrived from a C5 service page ("Enquire about RSE training") or a soft CTA on B2 / B3 / B6. They expect a form, expect it to work, and expect the service they clicked on to already be selected when they get here. The page's job is to get out of their way: one form, one action, minimal decoration.
2. **A general enquirer** — someone landing from the footer "Contact" link or direct typed URL. They have not specified a service route in. The form works fine for them; they pick "Please select" → choose manually → send.
3. **Someone looking for safeguarding help** — a parent, a young person, or a professional in a moment of crisis. This page is not the right place for them, and it is important that the page says so gently and routes them somewhere useful.

**Mood.** Quiet, transactional, humane. Not playful. Not aggressively minimal either — the safeguarding note needs room. The art direction brief's "trustworthy enough for headteachers" and "serious enough for safeguarding content" directions both apply, and B7 is one of the few pages where those two demands hit the same viewport. Surface rhythm is simple: a single quiet hero on `--bg-tinted` (so the page has an identifiable top) and the rest of the content on `--bg-page`. No authority band. No card grid. No filter chips. One prose column, form inside it.

**What this spec does and doesn't cover.** This spec defines the *page* — the sections, their order, their surfaces, their responsive behaviour, the pre-fill state, and the safeguarding note. It does *not* redesign the `EnquiryForm.astro` component; the form already exists and works, and its visual states (empty, focus, validation errors, loading, success, failure) are the subject of the separate `D6 Enquiry form states` spec. B7 treats the form as a drop-in, specifies where it slots into the page, and specifies the two page-level states (arrived-with-service-param versus arrived-blank).

---

## 0.1 · Relationship to the existing `src/pages/contact.astro`

A draft of this page exists at `src/pages/contact.astro` (114 lines). It already does most of what B7 needs: reads `?service=` from the URL, passes it into `<EnquiryForm preSelectedService={…} />`, renders the form, renders a small "Other ways to reach us" block, renders a safeguarding note, sits on `--bg-page`. The draft's bones are sound. The rewrite is cosmetic and structural, not functional.

**This spec supersedes the draft.** The rewrite:

- **Adds** a dedicated `<section class="contact-hero">` on `--bg-tinted` (matching the B2 / B3 / B6 hero pattern). Currently the title sits inside the same section as the form on `--bg-page`; splitting it into a proper hero gives the page an identifiable top and a consistent trust-page opening.
- **Adds** a contextual lede that changes copy based on whether `?service=` is present (see §4.1). If a reader arrived from "Enquire about RSE training", the hero acknowledges that: "Enquiring about RSE training?" If they arrived blank, a neutral opener applies.
- **Keeps** the `<EnquiryForm />` component exactly as-is. Pass-through props (`preSelectedService`) unchanged.
- **Restructures** the "Other ways to reach us" and safeguarding blocks into two distinct, named sections (§4.3 and §4.4) rather than sibling divs inside the same container. Gives each a clear role and a clear surface.
- **Replaces** hardcoded values (`max-w-3xl`, raw `line-height: 1.6`, raw `line-height: 1.5`) with token references.
- **Replaces** the root `<section>` with `<main>`.
- **Upgrades** the safeguarding note to a proper visual treatment — bordered panel, small icon (optional, deferred), and a clearer information hierarchy — so the note doesn't read as an afterthought tacked onto the foot of the page.
- **Reconciles** the service-select options with the canonical service taxonomy (§2.2). The current `EnquiryForm` lists five options that don't match the seven canonical `ServiceTag` values introduced in B6 §2.1. This is a form-component concern, not a B7 page concern; noted in §12 Open items.

Section §0.2 below enumerates the line-level changes.

---

## 0.2 · Code to remove / replace from the existing draft

| Line(s) in draft | What | Action |
|---|---|---|
| 19 | `<section class="contact-page">` root | Replace with `<main class="contact-page">` — page-level wrapper |
| 20 | `max-w-3xl` on inner wrapper | Replace with `var(--container-max-prose)` on the form column; hero uses `var(--container-max-shell)`; safeguarding note uses `var(--container-max-prose)` |
| 21–24 | `<h1>` + intro paragraph inside the form container | Move both into a new `<section class="contact-hero">` on `--bg-tinted` (§4.1). Intro copy becomes conditional on `serviceParam`. |
| 23 | Hardcoded intro copy (`"Interested in RSE delivery, training, or consultancy…"`) | Replace with the two-variant lede pattern (§4.1) — one variant for `?service=` present, one for blank. |
| 26–28 | `<div class="contact-page__form">` wrapping `<EnquiryForm>` | Wrap in a `<section class="contact-form">` with its own container and surface (§4.2). |
| 30–38 | `<div class="contact-page__direct">` with inline `<h2>` and two `<p>` lines | Rewrite as `<section class="contact-direct">` (§4.3) with proper landmark semantics and expanded social links list (currently one Instagram link; social links are a content-spec line item that deserves structure). |
| 37 | `https://instagram.com/oktoask.co.uk` Instagram link is on the OTA handle, not Tailor | Keep the link (OTA is part of the Tailor family), but label it "Instagram (Okay to Ask)" to remove ambiguity for a reader expecting a Tailor Education handle. If a separate Tailor Education Instagram handle exists, add it as a second row; resolve pre-ship. |
| 40–44 | `<div class="contact-page__safeguarding">` with small note | Rewrite as `<section class="contact-safeguarding">` (§4.4) with a bordered panel and clearer hierarchy — heading + intro sentence + resource list. |
| 42 | NSPCC helpline number as the only safeguarding resource | Expand to a short list: Local authority designated officer (LADO), NSPCC helpline, Childline, plus the "if in immediate danger call 999" line. |
| 49–114 | Inline `<style>` block | Rewrite — token references only, class names reflect the new section split. Drop `.contact-page__` monolith in favour of `.contact-hero`, `.contact-form`, `.contact-direct`, `.contact-safeguarding`. |
| 67 | `line-height: 1.6` raw | Replace with `var(--lh-body)` |
| 108 | `line-height: 1.5` raw | Replace with `var(--lh-body)` (safeguarding note also uses body line-height for compact, readable copy) |

**No changes needed to:** `BaseLayout` import, `EnquiryForm` import, the `serviceParam` read from `Astro.url.searchParams`, the overall `.contact-page { background: var(--bg-page); }` rule, the `title` / `description` / `canonicalPath` attributes.

**Routes and links to preserve:** `mailto:hello@tailoreducation.org.uk`, `tel:08088005000` (NSPCC), `https://instagram.com/oktoask.co.uk`, the `/api/enquiry` endpoint (no change — the form submits to it exactly as today).

---

## 1 · Reference documents

- `Tailor_Layout_Spec_Shell.md` — header, footer, container-width tokens
- `Tailor_Layout_Spec_B2.md` — About; tinted-hero opener and single-column prose pattern reused here
- `Tailor_Layout_Spec_B3.md` — Our Approach; dark authority-band principle (B7 uses none, but precedent for tonal discipline)
- `Tailor_Layout_Spec_B6.md` — Testimonials; canonical `ServiceTag` taxonomy (§2.1) that the form's service select should eventually align to
- `Tailor_Layout_Spec_C5.md` — service pages; source of the `?service=...` query parameter that B7 consumes
- `Tailor_Page_Content_Spec_v1.md` — B7 section (four content lines: form, direct contact, social links, safeguarding note — this spec follows that structure exactly)
- `Tailor_Art_Direction_Brief_v1 (1).md` — "trustworthy enough for headteachers, serious enough for safeguarding content"; surface hierarchy; shape language
- `Tailor_Design_System_Implementation_Notes.md` — token vocabulary, layer scoping, component patterns
- `Tailor_Layout_Spec_D6.md` — **(separate spec)** enquiry form visual states (empty / focused / validating / submitting / success / error). B7 does not redefine these.
- `src/components/EnquiryForm.astro` — the existing form component, used as-is
- `src/pages/api/enquiry.ts` — the existing Resend-backed serverless endpoint, used as-is

---

## 2 · Data requirements

### 2.1 URL parameters

The page reads one query parameter server-side in the Astro frontmatter:

```typescript
const serviceParam = Astro.url.searchParams.get('service') || undefined;
```

`serviceParam` drives two things:

1. The hero lede variant (§4.1 — "Enquiring about X?" vs generic opener).
2. Pre-fill of the service `<select>` inside `<EnquiryForm>` (handled by the form component — B7 just passes the prop through).

If `serviceParam` does not match a known service value, the page still renders with the blank hero variant, and the form's service select defaults to "Please select". No error; no 404; gracefully ignored.

**Accepted service param values** are whatever the form component's `serviceOptions` lists; see §2.2 for the canonical reconciliation note.

### 2.2 Service taxonomy reconciliation (informational)

The `EnquiryForm.astro` service `<select>` currently offers five options:

```
Direct RSE delivery
RSE training
Drop day delivery
RSE policy & curriculum planning
Other
```

The canonical Tailor service taxonomy (established in B6 §2.1 for testimonial tags) has seven values:

```
RSE delivery
RSE training
Drop days
Circuits (SEND/AP)
RSE policy & curriculum planning
Universities & FE
About / general
```

These lists are not aligned. Aligning them is a `D6` / form-component concern, not a B7 concern, but B7 is the page that exposes the mismatch — when a reader arrives with `?service=Circuits%20(SEND%2FAP)` from a future C5 SEND/AP service page, the form select will not have a matching option and the pre-fill will silently fail. Noted in §12 Open items.

For the B7 ship, the expected working pre-fill paths are exactly the ones the current form supports:

- `/contact?service=RSE%20training` → selects "RSE training"
- `/contact?service=Direct%20RSE%20delivery` → selects "Direct RSE delivery"
- `/contact?service=Drop%20day%20delivery` → selects "Drop day delivery"
- `/contact?service=RSE%20policy%20%26%20curriculum%20planning` → selects "RSE policy & curriculum planning"
- `/contact?service=Other` → selects "Other"

### 2.3 No other data

No Notion fetch, no typed constants (beyond the form's own `serviceOptions`), no images. B7 is a form page with three small supporting content blocks.

---

## 3 · Section map

| # | Section | Surface | Container | Vertical padding | Role |
|---|---|---|---|---|---|
| 4.1 | Hero | `--bg-tinted` | `--container-max-shell` | `--space-global-xl` | Title + contextual lede (two variants) |
| 4.2 | Form | `--bg-page` | `--container-max-prose` | `--space-struct-y-base` | The `<EnquiryForm>` component |
| 4.3 | Other ways to reach us | `--bg-surface-alt` | `--container-max-prose` | `--space-struct-y-base` | Email + social links |
| 4.4 | Safeguarding note | `--bg-page` | `--container-max-prose` | `--space-global-xl` (top) · `--space-struct-y-base` (bottom) | Bordered panel; crisis resources |

**Surface rhythm read-out.** `tinted → page → alt-tinted → page`. One tint lift at the top, one alt-tint lift in the middle, page ground for the form and the safeguarding note. No authority band — B7 is not a trust-demonstration page, it is a transactional page.

**Container rhythm read-out.** `shell → prose → prose → prose`. The hero uses the 72rem shell for the title; every subsequent section contracts to the 44rem prose column. The form does not need more than 44rem; wider form fields read as bureaucracy, not friendliness.

**Why no CTA at the foot.** The whole page *is* a CTA. Adding a second "Get in touch" button below a form that is itself the "Get in touch" mechanism would be a circular nonsense. The safeguarding note closes the page; its last line can carry a soft "We look forward to hearing from you" if copy wants one (deferred — see §12).

---

## 4 · Section details

### 4.1 Hero

**Role.** Anchor the page. Acknowledge, where possible, what brought the reader here so the form's pre-fill doesn't feel like a coincidence.

**Surface.** Full-bleed `<section class="contact-hero">` on `--bg-tinted` with a `--border-subtle` bottom border (`--border-width-xs`).

**Inner wrapper.** `mx-auto w-full max-w-[var(--container-max-shell)] px-[var(--space-global-gutter)] py-[var(--space-global-xl)]`.

**Contents (in order):**

1. **Eyebrow.** `<span class="contact-hero__eyebrow">` — "Contact". Uppercase, `--text-eyebrow-ls`, `--text-card-size-body`, `--font-weight-semibold`, `--text-body-muted`. Margin-bottom `--space-global-xs`.
2. **Page title.** `<h1 class="contact-hero__title">` — "Get in touch". Lexend, `--text-display-size-h1`, `--heading-weight-h1`, `--text-heading`, `line-height: var(--lh-display)`. Margin `0 0 var(--space-global-md)`.
3. **Lede.** `<p class="contact-hero__lede">` — **two copy variants**, chosen by the presence of `serviceParam`:

   - **Variant A — arrived with `?service=X`:** "[COPY TBD: e.g. 'Enquiring about *{serviceName}*? Fill in a few details and we'll come back to you within a couple of working days.']" — where `{serviceName}` is the human-readable form of the param value (interpolated at render time). The service name renders in italic `<em>` to mark it as the subject of the reader's interest; rest of the paragraph stays in plain weight.
   - **Variant B — arrived without `?service=`:** "[COPY TBD: e.g. 'Whether you want to talk about training, delivery, policy, or anything else, fill in a few details and we'll come back to you within a couple of working days.']" — a neutral opener that lists the main service types so the reader can see the breadth without having to pre-read the select dropdown.

   Body stack, `--text-prose-size-lede` (1.1em), `--font-weight-regular`, `--text-body`, `line-height: var(--lh-prose)`. Margin `0`.

**Implementation of the two-variant lede.** Astro frontmatter maps the incoming `serviceParam` to a human-readable name (handling the form's option labels — e.g. `Direct RSE delivery` maps to itself, `RSE training` maps to itself), and sets a `leadVariant` local:

```typescript
const SERVICE_NAMES: Record<string, string> = {
  'RSE training': 'RSE training',
  'Direct RSE delivery': 'RSE delivery',
  'Drop day delivery': 'a drop day',
  'RSE policy & curriculum planning': 'policy and curriculum planning',
  'Other': 'something specific',
};
const friendlyServiceName = serviceParam ? SERVICE_NAMES[serviceParam] : undefined;
```

Then the template:

```astro
{friendlyServiceName ? (
  <p class="contact-hero__lede">
    Enquiring about <em>{friendlyServiceName}</em>? [COPY TBD — rest of sentence]
  </p>
) : (
  <p class="contact-hero__lede">[COPY TBD — generic opener]</p>
)}
```

If `serviceParam` is set but doesn't match `SERVICE_NAMES`, `friendlyServiceName` is `undefined` and Variant B renders — safer than interpolating an unknown string into the hero. The form still receives `preSelectedService={serviceParam}` unchanged; the form's own lookup handles pre-fill (or falls back to "Please select" if no match).

**Mobile.** Title clamps down via `--text-display-size-h1`. Lede stays left-aligned. Vertical padding stays `--space-global-xl`.

---

### 4.2 Form

**Role.** Host the `<EnquiryForm>` component. The form is self-contained — it renders the form element, the success state, the error state, and its own validation and submit logic. The section's responsibility is container, surface, and surrounding breathing room.

**Surface.** `<section class="contact-form" aria-labelledby="contact-form-label">` on `--bg-page`.

**Inner wrapper.** `mx-auto w-full max-w-[var(--container-max-prose)] px-[var(--space-global-gutter)] py-[var(--space-struct-y-base)]`.

**Contents (in order):**

1. **Hidden form heading** for the landmark: `<h2 id="contact-form-label" class="sr-only">Enquiry form</h2>`. No visible heading — the hero `<h1>` already names the page, and a visible "Enquiry form" heading above the first label would be redundant labelling.
2. **`<EnquiryForm preSelectedService={serviceParam} />`** — unchanged. The component renders its own `<form>`, success panel, and error alert.

**No card wrapper.** The form sits directly on `--bg-page`, with field backgrounds on `--bg-surface` (already styled by the form component). A card wrapper around the form would double the surface depth and make the form feel institutional; keeping it on page ground feels lighter and more inviting.

**Form vertical rhythm.** The form component already provides `gap: var(--space-global-md)` between fields internally; the section's `py-[var(--space-struct-y-base)]` gives sufficient breathing above the first field and below the submit button. No additional spacing rules needed at page level.

**Form width.** The form inherits the 44rem prose container width. Individual fields stretch to `100%` of that column (already the form component's behaviour). This yields comfortable input widths (~35rem absolute) that are wide enough for email addresses and school names without being intimidating.

**Success / error states.** Handled entirely by the form component. When the form submits successfully, the form element hides and the `.enquiry-success` card appears in-place. The hero and the sections below (Other ways to reach us, Safeguarding note) remain visible throughout — a reader who has just sent an enquiry can still see the direct contact options in case they want to follow up another way, and the safeguarding note still applies to anyone in crisis regardless of form state.

---

### 4.3 Other ways to reach us

**Role.** The non-form contact routes. An enquirer who wants to email directly (e.g. to attach a document), or who wants to follow Tailor on social, reaches this section.

**Surface.** `<section class="contact-direct" aria-labelledby="contact-direct-title">` on `--bg-surface-alt`.

**Inner wrapper.** `mx-auto w-full max-w-[var(--container-max-prose)] px-[var(--space-global-gutter)] py-[var(--space-struct-y-base)]`.

**Contents (in order):**

1. **Section heading.** `<h2 id="contact-direct-title" class="contact-direct__title">` — "Other ways to reach us". Lexend, `--text-prose-size-h2`, `--heading-weight-h2`, `--text-heading`, `line-height: var(--lh-heading)`. Margin `0 0 var(--space-global-sm)`.
2. **Section intro.** `<p class="contact-direct__intro">` — one sentence. "[COPY TBD: e.g. 'If the form isn't the right fit, you can reach us directly.']" Body stack, `--text-prose-size-body`, `--text-body-muted`, `line-height: var(--lh-body)`. Margin `0 0 var(--space-global-md)`.
3. **Contact list.** `<dl class="contact-direct__list">` — a definition list with one `<dt>` / `<dd>` pair per contact method. Using `<dl>` rather than `<ul>` marks the method name (e.g. "Email", "Instagram") as a term and the handle / link as its value, which is the right semantic shape for a labelled contact-method list.

   **List items in order:**

   - **Email.** `<dt>Email</dt><dd><a href="mailto:hello@tailoreducation.org.uk">hello@tailoreducation.org.uk</a></dd>`
   - **Instagram (Okay to Ask).** `<dt>Instagram</dt><dd><a href="https://instagram.com/oktoask.co.uk" target="_blank" rel="noopener noreferrer">@oktoask.co.uk</a> <span class="contact-direct__note">(Okay to Ask account)</span></dd>`
   - **Instagram (Tailor Education).** If a Tailor-handle exists, a second `<dt>Instagram</dt><dd>` row. If not, omit. Resolve pre-ship.
   - **Other socials.** LinkedIn, Twitter/X, Bluesky, Threads — none currently active per the draft; add rows only when a handle exists. Do not render placeholder "Coming soon" rows.

**List styling.**

- `.contact-direct__list` — `display: grid`, `grid-template-columns: max-content 1fr`, `column-gap: var(--space-global-md)`, `row-gap: var(--space-global-xs)`, margin `0`, padding `0`.
- `<dt>` — `.contact-direct__term`. Lexend, `--text-card-size-body`, `--font-weight-semibold`, `--text-heading`. Margin `0`.
- `<dd>` — `.contact-direct__value`. Lexend, `--text-prose-size-body`, `--text-body`. Margin `0`. Contains the link + optional inline note.
- `<dd>` links — `color: var(--brand-accent-text)`, `text-decoration: underline`.
- `.contact-direct__note` — inline span. `--text-card-size-body`, `--text-body-muted`, margin-left `var(--space-global-xs)`. Provides the "(Okay to Ask account)" disambiguation without breaking the row layout.

**Mobile.** `.contact-direct__list` collapses to `grid-template-columns: 1fr` at `<640px` with each `<dt>` sitting above its `<dd>` and a smaller row gap.

**Why a section, not a sidebar or footer strip.** It is tempting to collapse "Other ways to reach us" into the site footer. The footer already has an email link. But the Contact page is where a reader expecting contact information looks; duplicating the email link (and adding the social link that the footer may or may not carry) is correct redundancy, not clutter. Keep it as a proper section with its own heading.

---

### 4.4 Safeguarding note

**Role.** The responsible acknowledgement. A reader who has landed on `/contact` in a moment of safeguarding distress needs to be redirected, gently but unambiguously, to the right help. This page is not a crisis helpline; saying so openly is part of being a trustworthy education brand.

**Surface.** `<section class="contact-safeguarding" aria-labelledby="contact-safeguarding-title">` on `--bg-page`.

**Inner wrapper.** `mx-auto w-full max-w-[var(--container-max-prose)] px-[var(--space-global-gutter)] py-[var(--space-global-xl)]` — note the padding is `--space-global-xl`, not `--space-struct-y-base`. The safeguarding note is tighter than the other sections; it doesn't need full structural breathing room because it sits at the foot of the page.

**Contents.**

The section content sits inside a **bordered panel** — `<div class="contact-safeguarding__panel" role="note">`. The panel is a visual device: `background: var(--bg-surface)`, `border: var(--border-width-xs) solid var(--border-subtle)`, `border-left: var(--border-width-md) solid var(--state-warning-border, var(--brand-accent-border))`, `border-radius: var(--radius-lg)`, `padding: var(--space-global-lg)`. The left-accent-border device signals "pay attention to this" without using the strong `--state-error` red treatment (which would be too alarming for a responsible aside).

If `--state-warning-border` doesn't exist as a token, flag in §12 and fall back to `--brand-accent-border`.

**Panel contents (in order):**

1. **Panel heading.** `<h2 id="contact-safeguarding-title" class="contact-safeguarding__title">` — "In a crisis? Please don't use this form." Lexend, `--text-prose-size-h3`, `--heading-weight-h3`, `--text-heading`, `line-height: var(--lh-heading-sub)`. Margin `0 0 var(--space-global-sm)`. Declarative and direct — softer framings ("If you are experiencing…") push past the reader whose attention is already fractured.
2. **Panel intro.** `<p>` — one sentence. "[COPY TBD: e.g. 'We can't respond to safeguarding concerns through this form. If you or a young person needs help right now, please use one of these routes.']" Body stack, `--text-prose-size-body`, `--text-body`, `line-height: var(--lh-body)`. Margin `0 0 var(--space-global-md)`.
3. **Resource list.** `<ul class="contact-safeguarding__list">` — a short list of specific routes. Each `<li>` is a one-line route with a link or phone number:

   - **Immediate danger.** "If someone is in immediate danger, call <a href='tel:999'>999</a>." *(This line is first for a reason — reader in crisis needs the most important instruction at the top.)*
   - **NSPCC helpline.** "Concerned about a child: NSPCC helpline <a href='tel:08088005000'>0808 800 5000</a>." Available for adults worried about a child.
   - **Childline.** "If you're a young person needing to talk: Childline <a href='tel:0800 1111'>0800 1111</a> (free, confidential)." Direct route for a young reader.
   - **Local authority designated officer (LADO).** "Schools: your local authority designated officer (LADO) is the first point of contact for concerns involving a professional." No phone number (varies by LA); the line just names the route.

**List styling.**

- `<ul>` — `list-style: none`, padding `0`, margin `0`, `display: flex`, `flex-direction: column`, `gap: var(--space-global-sm)`.
- `<li>` — `--text-card-size-body`, `--text-body`, `line-height: var(--lh-body)`.
- Links — `color: var(--brand-accent-text)`, `text-decoration: underline`. Phone numbers are `tel:` links so a mobile reader can dial in one tap.

**Why not a site-wide alert banner.** An always-on banner across every page would train readers to ignore it. The safeguarding note is section content on the Contact page (where a crisis reader is most likely to land) and should also appear on C1 Okay to Ask question pages (where young readers land directly). A site-wide banner would be overkill.

**Mobile.** Panel padding steps to `--space-global-md` at `<640px`. The resource list stays single-column at all widths.

**Closing.** No button, no CTA, no "back to top" link below the panel. The page ends with the safeguarding panel, quietly.

---

## 5 · Template structure

```astro
---
/**
 * Contact page [B7] — /contact
 * Hosts the enquiry form [E1]. Service type pre-selected via ?service= param.
 * Tailor layer.
 */
import BaseLayout from '../layouts/BaseLayout.astro';
import EnquiryForm from '../components/EnquiryForm.astro';

const serviceParam = Astro.url.searchParams.get('service') || undefined;

// Map raw param values to friendly names for the hero lede (§4.1).
const SERVICE_NAMES: Record<string, string> = {
  'RSE training': 'RSE training',
  'Direct RSE delivery': 'RSE delivery',
  'Drop day delivery': 'a drop day',
  'RSE policy & curriculum planning': 'policy and curriculum planning',
  'Other': 'something specific',
};
const friendlyServiceName = serviceParam ? SERVICE_NAMES[serviceParam] : undefined;
---

<BaseLayout
  title="Contact — Tailor Education"
  description="Get in touch with Tailor Education to discuss RSE training, delivery, and support for your school."
  canonicalPath="/contact"
>
  <main class="contact-page">

    <!-- §4.1 Hero -->
    <section class="contact-hero">
      <div class="mx-auto w-full max-w-[var(--container-max-shell)] px-[var(--space-global-gutter)] py-[var(--space-global-xl)]">
        <span class="contact-hero__eyebrow">Contact</span>
        <h1 class="contact-hero__title">Get in touch</h1>
        {friendlyServiceName ? (
          <p class="contact-hero__lede">
            Enquiring about <em>{friendlyServiceName}</em>? [COPY TBD]
          </p>
        ) : (
          <p class="contact-hero__lede">[COPY TBD — generic opener]</p>
        )}
      </div>
    </section>

    <!-- §4.2 Form -->
    <section class="contact-form" aria-labelledby="contact-form-label">
      <div class="mx-auto w-full max-w-[var(--container-max-prose)] px-[var(--space-global-gutter)] py-[var(--space-struct-y-base)]">
        <h2 id="contact-form-label" class="sr-only">Enquiry form</h2>
        <EnquiryForm preSelectedService={serviceParam} />
      </div>
    </section>

    <!-- §4.3 Other ways to reach us -->
    <section class="contact-direct" aria-labelledby="contact-direct-title">
      <div class="mx-auto w-full max-w-[var(--container-max-prose)] px-[var(--space-global-gutter)] py-[var(--space-struct-y-base)]">
        <h2 id="contact-direct-title" class="contact-direct__title">Other ways to reach us</h2>
        <p class="contact-direct__intro">[COPY TBD]</p>
        <dl class="contact-direct__list">
          <dt class="contact-direct__term">Email</dt>
          <dd class="contact-direct__value">
            <a href="mailto:hello@tailoreducation.org.uk">hello@tailoreducation.org.uk</a>
          </dd>

          <dt class="contact-direct__term">Instagram</dt>
          <dd class="contact-direct__value">
            <a href="https://instagram.com/oktoask.co.uk" target="_blank" rel="noopener noreferrer">@oktoask.co.uk</a>
            <span class="contact-direct__note">(Okay to Ask account)</span>
          </dd>
          {/* Add additional <dt><dd> pairs here as handles become available. */}
        </dl>
      </div>
    </section>

    <!-- §4.4 Safeguarding note -->
    <section class="contact-safeguarding" aria-labelledby="contact-safeguarding-title">
      <div class="mx-auto w-full max-w-[var(--container-max-prose)] px-[var(--space-global-gutter)] py-[var(--space-global-xl)]">
        <div class="contact-safeguarding__panel" role="note">
          <h2 id="contact-safeguarding-title" class="contact-safeguarding__title">In a crisis? Please don't use this form.</h2>
          <p>[COPY TBD — panel intro]</p>
          <ul class="contact-safeguarding__list">
            <li>If someone is in immediate danger, call <a href="tel:999">999</a>.</li>
            <li>Concerned about a child: NSPCC helpline <a href="tel:08088005000">0808 800 5000</a>.</li>
            <li>If you're a young person needing to talk: Childline <a href="tel:08001111">0800 1111</a> (free, confidential).</li>
            <li>Schools: your local authority designated officer (LADO) is the first point of contact for concerns involving a professional.</li>
          </ul>
        </div>
      </div>
    </section>

  </main>
</BaseLayout>

<style>
  /* See §4 for all class rules. */
</style>
```

---

## 6 · Client-side behaviour

Zero new JS at the page level. All interactivity lives inside:

- `<EnquiryForm>` — the form handles its own validation, submit, success / error rendering, and analytics tracking (`service_enquiry_started`, `service_enquiry_submitted`).
- `<BaseLayout>` — the shell handles nav, footer, skip-link.

The page template is static Astro; `serviceParam` is read at render time from `Astro.url.searchParams`, not at runtime. Note that this works for server-rendered and static-generated routes alike because `/contact` is not prerendered as a static HTML file — the `api/enquiry.ts` endpoint requires the Vercel serverless runtime, and by extension the contact page is fetched dynamically so the query parameter is available to the Astro frontmatter. If the contact page is ever converted to fully prerendered HTML, the `?service=` pre-fill moves entirely to the client-side JS in `EnquiryForm` (which already has an equivalent pre-fill step — see `EnquiryForm.astro` lines 153–164 — meaning the hero lede variant falls back to the generic Variant B in that case but the form's select still pre-fills).

**Pre-fill behaviour summary:**

- Server-side (current): `?service=X` populates the hero lede variant AND the form select.
- Client-side (fallback): `?service=X` populates only the form select; hero always shows generic lede.

If the server-side pre-fill is important to the page's feel, preserve the dynamic rendering. If performance suggests prerendering, the hero-lede fallback is acceptable — the form pre-fill is the more important of the two.

---

## 7 · Responsive behaviour

| Viewport | Hero | Form | Other ways | Safeguarding |
|---|---|---|---|---|
| ≥1280px | Shell, title at clamp max | Prose column, form fields stretch | Prose column, `<dl>` in 2-col grid | Prose column, panel |
| 1024–1279px | As above | As above | As above | As above |
| 768–1023px | Title clamps step | As above | As above | As above |
| 640–767px | Title clamps lower | As above | `<dl>` still 2-col (term/value fit) | Panel padding step `--space-global-md` |
| <640px | Title at clamp min; eyebrow stays | Form fields still full-width of column | `<dl>` collapses to single column; term above value | As above |

No breakpoint-driven layout changes beyond the `<dl>` column collapse and minor padding steps. The form itself is responsive via the form component's own rules (full-width inputs at every viewport).

---

## 8 · Accessibility

- **Landmarks.** `<main class="contact-page">` at root. Four `<section>` children each with their own heading (either visible or `sr-only`): hero `<h1>` (visible), form `<h2>` (hidden), direct-contact `<h2>` (visible), safeguarding `<h2>` (visible). Heading outline is h1 → h2 × 4 with no skipped levels.
- **Skip link.** The Shell's skip-to-main link lands on `<main class="contact-page">`. From there, a screen-reader user Tabs into the hero content first (non-interactive), then the form's first input (`#enquiry-name`), which is the expected focus destination for a page whose primary action is the form.
- **Form accessibility.** Entirely the form component's responsibility. The form already:
  - Associates each `<label>` with its input via `for` / `id`.
  - Marks required fields with a visual asterisk (`<span aria-hidden="true">*</span>`) and the `required` attribute.
  - Provides `aria-describedby` pointing at the field's error message `<p>`.
  - Uses `role="alert"` on error messages so they announce when they flip from `hidden` to visible.
  - Uses `autocomplete` attributes (`name`, `email`, `organization`) so browser autofill works correctly.
- **Definition list.** `<dl>` / `<dt>` / `<dd>` in §4.3 is the correct semantic shape. Screen readers announce "Email, hello@tailoreducation.org.uk", "Instagram, @oktoask.co.uk Okay to Ask account", etc.
- **External links in §4.3.** `target="_blank"` carries `rel="noopener noreferrer"`. An invisible "(opens in new tab)" hint is not required on external social links where the icon context makes new-tab behaviour obvious, but consider adding for screen-reader-only: `<span class="sr-only"> (opens in new tab)</span>` on each external anchor. Low priority.
- **Safeguarding panel.** `role="note"` marks it as a contextual aside. The panel's heading ("In a crisis? Please don't use this form.") and intro are announced as part of the panel's reading context.
- **Phone links.** `tel:` links are keyboard-activatable and announce as "phone number" on mobile screen readers, offering a "Call" prompt. On desktop screen readers, the link text is read literally.
- **Colour contrast.** The safeguarding panel's left-border uses `--state-warning-border` (or fallback `--brand-accent-border`); text is `--text-body` on `--bg-surface`. All combinations must meet AA 4.5:1 for body text.
- **Focus order.** Source order: hero (no focusable elements) → form (every input and button in order) → direct-contact links (email, then social) → safeguarding resource links (999, NSPCC, Childline). This is the right order; no JS-driven focus management needed.
- **Reduced motion.** N/A — no motion on this page.

---

## 9 · SEO

- **`<title>`** — `Contact — Tailor Education`. UTF-8 em-dash. (Draft is correct.)
- **`<meta name="description">`** — draft wording serviceable: "Get in touch with Tailor Education to discuss RSE training, delivery, and support for your school."
- **`<link rel="canonical">`** — `/contact` unconditionally, regardless of `?service=` query string. Filter-style parameters are not duplicate pages.
- **Robots.** No `noindex`. Contact page should index normally — it is a legitimate destination for organic search ("tailor education contact", "rse training enquiry").
- **JSON-LD.** Emit one `ContactPage` schema in `<head>`:

```json
{
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "name": "Contact — Tailor Education",
  "url": "https://tailor-education.co.uk/contact",
  "mainEntity": {
    "@type": "EducationalOrganization",
    "name": "Tailor Education",
    "url": "https://tailor-education.co.uk",
    "email": "hello@tailoreducation.org.uk",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "hello@tailoreducation.org.uk",
      "availableLanguage": "English"
    }
  }
}
```

This reinforces the Organization entity also referenced from B2 (`AboutPage` → `Organization`) and B3 (`AboutPage` → `EducationalOrganization`). All three page types point at the same organisation.

- **Pagefind.** The page is indexed; no `data-pagefind-ignore` regions. The form's field labels are indexable (a visitor searching "key stage" from Pagefind could legitimately land on `/contact` because it asks about key stage). The safeguarding panel content is indexed as part of the page body.
- **Open Graph / Twitter Card.** Handled by BaseLayout from `title` + `description`. No custom OG image.

---

## 10 · Contradictions with other specs

| Source | What it says | What B7 does | Why |
|---|---|---|---|
| `Tailor_Page_Content_Spec_v1.md` §B7 | 4 sections: enquiry form, direct contact, social links, safeguarding note | 4 sections: hero, form (includes form), direct contact (includes social links), safeguarding note | Hero is a layout-level opener not captured in the content-spec section count; social links fold into the "direct contact" section rather than standing alone because a one-row-per-channel list reads more coherently than two tiny adjacent sections. |
| Existing `src/pages/contact.astro` | `<section class="contact-page">` root containing `<h1>` and all content in one container | `<main class="contact-page">` root with four `<section>` children; `<h1>` inside dedicated hero section | Layout-level landmark semantics; matches B2 / B3 / B6 sibling-spec patterns. |
| Existing `src/pages/contact.astro` | Static intro paragraph regardless of referrer | Two-variant lede, chosen by `serviceParam` presence | Makes the pre-fill feel acknowledged, not accidental — a small trust-building device for readers arriving from a C5 service page. |
| Existing `src/pages/contact.astro` | One-line safeguarding note pointing at NSPCC only | Bordered panel with four routes: 999, NSPCC, Childline, LADO | The single-line note reads as obligatory boilerplate; a structured panel treats safeguarding with the seriousness the art direction brief explicitly asks for. |
| `src/components/EnquiryForm.astro` | Service select has 5 options | B6 canonical taxonomy has 7 service tags | Misalignment between form and B6; deferred to D6 / form-component work. B7 flags the gap (§2.2) but doesn't fix it. |
| Art direction brief — "no dark authority bands unless earned" | B3 uses one on safeguarding | B7 uses none on safeguarding | B3 is a trust-demonstration page where tonal gravity is the content; B7 is a transactional page where a dark band would read as alarming. The bordered-panel device on `--bg-surface` carries enough weight without going dark. |

---

## 11 · Build checklist

- [ ] Rewrite `src/pages/contact.astro` from the existing draft using §0.2 removal table + §5 template.
- [ ] Replace `<section class="contact-page">` root with `<main class="contact-page">`.
- [ ] Replace `max-w-3xl` with the correct container token per section (§3 map).
- [ ] §4.1 Hero: `--bg-tinted`, `--container-max-shell`, `--space-global-xl` padding, eyebrow + h1 + lede.
- [ ] §4.1 Hero: implement `SERVICE_NAMES` lookup and two-variant lede (friendly-name variant / generic variant). Fall back to generic if `serviceParam` is unknown.
- [ ] §4.2 Form: `<section class="contact-form">`, `--bg-page`, `--container-max-prose`, `--space-struct-y-base` padding. `sr-only` `<h2>`. `<EnquiryForm preSelectedService={serviceParam} />`.
- [ ] §4.3 Other ways to reach us: `<section class="contact-direct">`, `--bg-surface-alt`, visible `<h2>`, intro `<p>`, `<dl>` with term / value rows.
- [ ] §4.3 Label the OTA Instagram link with the "(Okay to Ask account)" inline note.
- [ ] §4.3 Add Tailor-specific Instagram handle row if one exists; otherwise omit (no placeholder rows).
- [ ] §4.3 `<dl>` is a 2-column grid at `≥640px`, single column below.
- [ ] §4.4 Safeguarding note: `<section class="contact-safeguarding">`, bordered panel (`.contact-safeguarding__panel` with left accent border), `role="note"`, `<h2>` + intro `<p>` + `<ul>` of four routes.
- [ ] §4.4 Resource list order: 999 first, NSPCC, Childline, LADO last.
- [ ] §4.4 All phone numbers as `tel:` links.
- [ ] Replace hardcoded values: `max-w-3xl`, `line-height: 1.6`, `line-height: 1.5` with token references.
- [ ] Heading outline: one h1 (hero), four h2 (form sr-only, direct, safeguarding; form sr-only counts as part of landmark hierarchy even if hidden).
- [ ] SEO: `title`, `description`, canonical `/contact`, `ContactPage` JSON-LD (§9).
- [ ] Pagefind: no `data-pagefind-ignore` regions.
- [ ] Desktop + mobile visual pass at 360 / 640 / 1024 / 1440 px widths.
- [ ] Verify form pre-fill for every working service param value (§2.2): manually visit `/contact?service=RSE%20training` etc and confirm both the hero lede and the form select update.
- [ ] Verify form pre-fill gracefully handles unknown param (`/contact?service=Circuits%20(SEND%2FAP)` → generic hero + "Please select" dropdown, no error).
- [ ] Keyboard pass: Tab from skip-link → hero (skipped) → form inputs in order → direct-contact links → safeguarding resource links.
- [ ] Screen-reader pass: `<dl>` announces term / value pairs; `role="note"` panel announces; form errors announce via `role="alert"` + `aria-describedby`.
- [ ] All `[COPY TBD]` blocks resolved before ship.

---

## 12 · Open items

- **Service taxonomy alignment.** `EnquiryForm.astro` service options (5 values) don't match the canonical service taxonomy in B6 §2.1 (7 values). Specifically missing: `Circuits (SEND/AP)`, `Universities & FE`, `About / general`. Also: `Direct RSE delivery` in the form vs `RSE delivery` in the canonical list. Reconciliation is a D6 / form-component task. Pre-B7 ship, confirm which list is authoritative and update the other.
- **Tailor Education Instagram handle.** §4.3 Other ways to reach us currently shows only the `@oktoask.co.uk` handle with the disambiguating "(Okay to Ask account)" note. If a separate `@tailoreducation` (or similar) handle exists or is planned, add it as a second row; otherwise keep the single row with the label.
- **Other social channels.** LinkedIn, Twitter/X, Bluesky, Threads — add rows as handles become available. Do not render placeholder rows.
- **`--state-warning-border` token.** §4.4 safeguarding panel uses a left accent border. Confirm `--state-warning-border` exists in `tailor-site-v2.css`; if not, decide between adding it (design-system task) or falling back to `--brand-accent-border` (page-level fallback).
- **Hero lede copy.** Both variants (friendly-name / generic) need final copy. Variant A benefits from keeping the emphasised service name short — interpolating "policy and curriculum planning" into a sentence is already long enough.
- **Safeguarding panel copy.** The four-route list wording needs editorial review; priority is "immediate danger → call 999" sitting visually first.
- **Prerendered vs dynamic rendering.** B7 currently depends on dynamic rendering to read `?service=` server-side. If the page is later prerendered for performance, the hero lede variant falls back to the generic always — the form pre-fill still works via client-side JS. Decide at ship time which matters more.
- **Post-submit page state.** After a successful submit, the form's `.enquiry-success` card replaces the form. Consider whether the other sections (direct contact, safeguarding note) should collapse or update. Current answer: they stay visible, which is correct — a reader who has just sent an enquiry can still benefit from seeing the direct contact and the safeguarding note.
- **Form analytics taxonomy.** The form emits `service_enquiry_started` and `service_enquiry_submitted` events (see `EnquiryForm.astro` lines 168–177 and 241–246). Confirm these event names and properties align with whatever analytics schema is configured in the Shell / BaseLayout.
- **Optional closer line.** The page ends with the safeguarding panel. A quiet one-line "We look forward to hearing from you" below the panel could soften the close. Deferred — may be unnecessary if the panel heading's tone is right.
