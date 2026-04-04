# Stage 5 — Remaining pages

*Briefing document for Claude Code. Read this first, then read the referenced files.*

---

## What you're building

All remaining page templates and one-off pages: blog posts (C4), service pages (C5), and the showcase pages (B1–B13). Plus the enquiry form (E1).

## What already exists

- Stage 1: Notion pipeline, typed content collections
- Stage 2: Design system, font loading, layout with layer scoping
- Stage 3: Question pages (C1), glossary pages (C2), Simple Mode, tooltips, signposting, crisis support
- Stage 4: Landing pages (C3), header/footer, mega menu, navigation, Okay to Ask landing (B8)

Read the existing codebase before making changes.

## Files to read for this stage

```
docs/Tailor_Content_Site_Build_Spec_v1.md           — sections 3.4, 3.5, 3.6, 3.7, and 4
docs/Tailor_Page_Content_Spec_v1.md                  — sections C4, C5, B1–B13, E1
docs/Tailor_Content_Site_Strategy_v4_2.md            — services architecture and blog sections (for commercial context)
docs/Tailor_Design_System_Implementation_Notes.md    — token reference
```

The Strategy doc gives you the commercial logic behind CTA targeting — why certain blog posts link to certain services, why the homepage has dual pathways. Read the services architecture and blog sections.

## Blog post template [C4] (`/blog/{slug}`)

Tailor layer (Lexend throughout, neutral surfaces).

1. **Title**
2. **Meta line** — author, date, target audience label (teachers / school leaders / parents)
3. **Topic tags [A16]** — links to landing pages
4. **Body content** — from Notion page body, with inline glossary tooltips [A7]
5. **Related blog posts [A15]** — 2–3 related posts. Selection: same primary topic → same content tags → same target audience.
6. **CTA [A13]** — bottom. If Service Link ≠ "none": "Want help with [service]? Talk to us" → enquiry form pre-tagged. If Service Link = "none": "Explore lessons on [topic] →" → app library.

## Service page template [C5] (`/services/{type}`)

Three instances: delivery, drop-days, consultancy. Tailor layer.

1. **Service name + headline**
2. **Description** — what, who, what's included
3. **CTA [A13]** — "Enquire about [service]" → enquiry form pre-tagged
4. **Testimonial** — pull quote (placeholder content for now)
5. **Related blog posts** — posts where Service Link matches this service type
6. **Topics overview grid** — 22 landing pages as browsable cards. Same grid on all service pages.
7. **CTA [A13] repeated** — same enquiry CTA at bottom

## Homepage [B1] (`/`)

The most important page. Tailor layer for the shell, but the Okay to Ask section within it should feel warmer. This is a design challenge — discuss with Gareth if needed.

1. **Teacher pathway hero** — headline, value prop, primary CTA ("Explore RSE lessons"), secondary CTA ("Training and services for schools")
2. **Young person pathway** — "Got a question? Okay to Ask." with visual shift to warmer tone. CTA to `/questions/`
3. **Book promotion** — within the OtA section. "The Okay to Ask book is here" → `/book`
4. **What Tailor Education does** — 2–3 brief points linking to relevant sections
5. **Featured questions** — 3–5 question titles with post-it images, linking to question pages
6. **Trust signals** — framework alignment, testimonial pull quote, link to `/our-approach`
7. **Topics overview** — 22 landing pages grouped by category, or a browse element

## Other showcase pages

These are simpler text-heavy pages. Tailor layer. Build with placeholder content where real copy isn't available yet:

| Page | URL | Key content |
|------|-----|-------------|
| **About [B2]** | `/about` | Mission, team section (placeholder bios), Okay to Ask project, framework alignment |
| **Our Approach [B3]** | `/our-approach` | Content methodology, framework alignment (DfE, PSHE Association, UNESCO, WHO), safeguarding commitment, inclusivity |
| **Training [B4]** | `/training` | CPD training overview, outcomes, format, app connection, enquiry CTA |
| **Services hub [B5]** | `/services` | Card per service line, each linking to its page |
| **Testimonials [B6]** | `/testimonials` | Placeholder testimonial cards |
| **Contact [B7]** | `/contact` | Enquiry form (E1), direct contact info |
| **Book [B11]** | `/book` | OtA visual identity, book description, purchase CTA (placeholder until sales URL confirmed) |
| **Privacy [B12]** | `/privacy` | Standard text page — GA4, localStorage, enquiry form data |
| **Accessibility [B13]** | `/accessibility` | Simple Mode feature, inclusive language, WCAG commitment, feedback contact |

## Enquiry form [E1]

Build as a functional form on `/contact` and potentially inline on service pages.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Name | text | Yes | |
| Email | email | Yes | |
| School name | text | Yes | |
| Service interested in | select | Yes | Options: Direct RSE delivery / CPD training / Drop day delivery / RSE consultancy / Other. Pre-selected if arrived from a service page (via URL parameter). |
| Key stage or year group | text | No | |
| Preferred timing | text | No | |
| Message | textarea | No | |

**Form submission:** Form provider is TBD. For now, build the form with proper HTML, validation states, and the pre-fill logic. Use the design system's form components (`.form-group`, `.form-label`, `.form-input`, `.form-select`, `.form-group--error`).

**States to handle:** empty, partially filled, validation errors, submitting (loading), success confirmation.

## CTA placement summary

All CTA rules from the build spec section 4 should now be implemented:

- **Landing pages [C3]:** mid-page "Explore lessons" [A11] + bottom "Bring to school" [A12] — done in Stage 4
- **Blog posts [C4]:** bottom CTA [A13] — service enquiry or app library fallback
- **Question pages [C1]:** end-of-answer panel [A17] — done in Stage 3
- **Glossary pages [C2]:** bottom "Explore [topic] →" — done in Stage 3
- **Service pages [C5]:** enquiry CTA top and bottom [A13]
- **Homepage [B1]:** dual pathway hero CTAs

## What "done" looks like

1. All blog posts render from Notion data with working CTAs and glossary tooltips
2. All three service pages render with enquiry CTAs and topics grid
3. Homepage renders with dual pathway, featured questions, and topics overview
4. All showcase pages render (with placeholder content where needed)
5. Enquiry form works with validation and pre-fill logic
6. Every CTA across the entire site links to the correct target
7. Every page uses the correct design system components — no hardcoded styles

## What NOT to build

- No search (Stage 6)
- No analytics events (Stage 6)
- No SEO metadata generation (Stage 6)
- No 301 redirects (Stage 6)
- No sitemap (Stage 6)

---

*Stage 5 of 6. Previous: Landing Pages and Navigation. Next: Search, SEO, Analytics, and Redirects.*
