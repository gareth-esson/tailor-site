# Legacy testimonials — extracted from the WordPress export

Source: `docs/legacy-site-export/tailoreducation.WordPress.2026-04-10.xml` (April 2026 WordPress export of tailoreducation.org.uk).

Method: pulled from the parsed legacy audit at `docs/Legacy_Site_Copy_Audit.md`, plus a deeper sweep of the raw XML for testimonials embedded in Divi blurb modules and blog post `wp:quote` blocks. The legacy site had no dedicated `testimonial` post type — quotes lived inside page and blog-post body content.

**Six unique attributable testimonials.** Five are from professional partners (school staff, third-sector leads, an academic collaborator). One is from a young person — anonymous, from the Work Out consent project blog post.

A "Pupil" avatar exists in the legacy media library (`Tailor-SRE-Sex-Education-Avatar-Pupil.png`) but isn't bound to any quote in the current export. There may have been a pupil testimonial on an earlier version of the homepage that was removed before this export — worth checking with Gareth.

One additional quote ("John Doe — an expert in RSE") on the legacy `/style/` page is Divi/Lorem placeholder content and is excluded.

---

## 1 · Ashley Summercorn — Camden Centre for Learning

> "We have some of the most challenging young people in Camden, however, your SRE lessons always engage and motivate our students to learn. You have always worked with us to adapt the learning to the needs of our young people. Thank you for your support."

**Source pages:** Homepage; also reused on `/rse-for-alternative-provision/`.
**Best fit for new site:** SEND / AP (Circuits) — the cohort framing maps directly.

---

## 2 · Victoria Oladele — Careers First Academy

> "I just wanted to take time out to say a HUGE thank you for all your hard work yesterday. You've broken a wall of silence here at the academy and students are certainly more interested in opening up and seeking help and support in this area. The students even gave feedback that they wanted you to return and talk about other issues relating to SRE."

**Source pages:** Homepage; also reused on `/rse-for-secondary-schools/`, `/rse-for-special-schools/`, and `/rse-for-primary-schools/`.
**Best fit for new site:** Direct delivery (single-session secondary). The "yesterday" / "return" framing reads as a one-off in-school session.

---

## 3 · Natalie Rutstein — Body & Soul Charity

> "Thank you so much for the fantastic workshop you facilitated on Saturday. The feedback from both teens and volunteers was outstanding; in fact, probably one of the best I've ever received, simply because it was kept real, open and relatable for them. It sounds like you created a safe space where they could discuss their opinions and have them heard - I really hope we'll be able to work together again in the future."

**Source page:** Homepage.
**Best fit for new site:** Drop days or single workshop delivery. Third-sector group, weekend session — closest analogue is a one-off or drop-day delivery.

---

## 4 · Valeria Ragni — British Red Cross

> "Thank you very much for the amazing sessions you ran with our group. They were extremely valuable and gave the young people the chance to speak about topics they would otherwise never have had the chance to discuss. They all gave an extremely positive feedback. A very big thank you also for your sensitivity and great understanding of our group. We really look forward to working with you again in the future."

**Source page:** Homepage.
**Best fit for new site:** SEND / vulnerable young people / Circuits. "Our group" and "your sensitivity and great understanding of our group" suggest a vulnerable cohort.

---

## 5 · Phoebe Davis — Artist, Researcher & Activist

> "I have regularly worked with Tailor SRE since 2016. In my opinion, they are leading the way in providing inclusive sex education within universities and schools across the UK. I have learnt a great deal from working with Tailor SRE (specifically when investigating consent and gender identity) and highly recommend them for staff training, workshops, consultancy & mentoring in this field."

**Source pages:** Legacy `/training/` and `/rse-training/` pages (Phoebe Davis was the named testimonial on both training pages).
**Best fit for new site:** RSE Training service page, About page, and any "credibility" or "our approach" surface. This is a peer-recognition testimonial from a long-standing collaborator, useful for trust signalling.

---

## 6 · Anonymous workshop participant — Work Out project (male university athlete)

> "It was really nice actually, to be given the opportunity to talk about mental health, harassment, and other issues with a group of guys you play with every week."

**Source page:** Blog post `/consent-education-for-men/` (Work Out project, collaboration with King's College London and Somerset House Studios — workshops for male-identifying athletes on consent, masculinity and mental health).
**Best fit for new site:** Universities and FE positioning, masculinity / consent landing pages, blog reuse. The only "young person voice" in the legacy export, although anonymous and from a HE rather than school context.

---

## Notes for the new `/testimonials` page (B6)

- **Gap to flag:** none of the six are from a mainstream school PSHE lead or SLT, which is the buyer profile the new `/testimonials` page is built around. Three are third-sector charities, one is an FE/learning centre, one is an academic collaborator, one is an anonymous young person. Worth collecting fresh PSHE-lead and SLT quotes between now and launch.
- **The current built `/testimonials` page** uses six fictional placeholder quotes by role only ("Head of PSHE, secondary school," "Headteacher, primary school", etc). When real quotes are confirmed, the six above can replace the placeholders one-for-one — and the service tagging in this file maps directly to the placeholder service field on the testimonial cards.
- **The Pupil avatar** (`/wp-content/uploads/2019/10/Tailor-SRE-Sex-Education-Avatar-Pupil.png`) is present in the media library but unused in the current export. If a pupil testimonial existed in an earlier homepage layout, it isn't recoverable from this export — Gareth may remember the wording.

## Excluded

- **"John Doe — an expert in RSE"** on the legacy `/style/` page. Divi/Lorem placeholder.
- **Divi "Testimonial Sections Kit" template** (`et_pb_layout` post). Divi-shipped demo content ("I use Testimonial Generator often…"). Not a published page, not real.
