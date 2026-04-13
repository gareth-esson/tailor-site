# Legacy testimonials — extracted from the WordPress export

Source: `docs/legacy-site-export/tailoreducation.WordPress.2026-04-10.xml` (April 2026 WordPress export of the legacy WordPress site at tailoreducation.org.uk).

Method: pulled from the parsed legacy audit at `docs/Legacy_Site_Copy_Audit.md`. The legacy site had no dedicated `testimonial` post type — testimonial quotes were embedded in the body of pages.

**Four unique real testimonials.** All four sat on the legacy homepage in a "Testimonials" section near the foot of the page. The Victoria Oladele quote was also reused on two individual service pages (Secondary, Special). One additional quote attributed to "John Doe" appears on the legacy `/style/` page — that's a Divi/Lorem placeholder, not real, and is excluded.

---

## 1 · Ashley Summercorn — Camden Centre for Learning

> "We have some of the most challenging young people in Camden, however, your SRE lessons always engage and motivate our students to learn. You have always worked with us to adapt the learning to the needs of our young people. Thank you for your support."

**Source page:** Homepage (`/` — legacy "Relationships & Sex Education" page).

---

## 2 · Victoria Oladele — Careers First Academy

> "I just wanted to take time out to say a HUGE thank you for all your hard work yesterday. You've broken a wall of silence here at the academy and students are certainly more interested in opening up and seeking help and support in this area. The students even gave feedback that they wanted you to return and talk about other issues relating to SRE."

**Source pages:** Homepage; also reused on `/rse-for-secondary-schools/` and `/rse-for-special-schools/`.

---

## 3 · Natalie Rutstein — Body & Soul Charity

> "Thank you so much for the fantastic workshop you facilitated on Saturday. The feedback from both teens and volunteers was outstanding; in fact, probably one of the best I've ever received, simply because it was kept real, open and relatable for them. It sounds like you created a safe space where they could discuss their opinions and have them heard - I really hope we'll be able to work together again in the future."

**Source page:** Homepage.

---

## 4 · Valeria Ragni — British Red Cross

> "Thank you very much for the amazing sessions you ran with our group. They were extremely valuable and gave the young people the chance to speak about topics they would otherwise never have had the chance to discuss. They all gave an extremely positive feedback. A very big thank you also for your sensitivity and great understanding of our group. We really look forward to working with you again in the future."

**Source page:** Homepage.

---

## Notes for the new site

- **Currency:** these are the only attributable testimonials in the WordPress export. Pre-launch, it's worth checking whether you have anything more recent — particularly for Primary, Drop Days, RSE Training, and RSE Policy & Curriculum Planning, which have no real attributable quotes in the legacy site at all.
- **Service mapping:** to the new `/services` taxonomy, the four legacy quotes most naturally tag as:
  - Ashley Summercorn → SEND / AP / behaviour-led settings ("most challenging young people in Camden")
  - Victoria Oladele → Direct delivery (academy, "your hard work yesterday" reads as a single delivered session)
  - Natalie Rutstein → Drop days or single workshop delivery ("the fantastic workshop you facilitated on Saturday" — third-sector group)
  - Valeria Ragni → SEND / vulnerable young people / single workshop ("our group", "your sensitivity and great understanding of our group")
- **None of these are from a school PSHE lead or SLT** — three are from third-sector charities, one is from a learning centre. That's a real gap in the evidence base for the new site, where the buyer is usually a PSHE lead or SLT in a mainstream school. Worth flagging for whatever testimonial collection happens before launch.
- **The current built `/testimonials` page** uses placeholder content (six fictional quotes by role only — "Head of PSHE, secondary school" etc). When real quotes are confirmed, the four above can replace four of the placeholders directly.

## Excluded

- **"John Doe — an expert in RSE"** on the legacy `/style/` page. Divi/Lorem placeholder content, not a real testimonial.
- **Divi "Testimonial Sections Kit" template** (`et_pb_layout` post in the export). Stock Divi demo content — "I use Testimonial Generator often," etc. Not published, not real.
