# Legacy site copy audit — tailoreducation.org.uk

*Full copy extracted from the live WordPress site as of 10 April 2026, scoped to published pages only. Blog posts, topic pages (WordPress `project` CPT under `/topic/`), and anonymous questions are intentionally excluded per the current remap brief — those come from Notion on the new site.*

*Source of truth: `docs/legacy-site-export/tailoreducation.WordPress.2026-04-10.xml` (WordPress 6.9.4 WXR). Regenerate via `python3 scripts/parse-legacy-wxr.py && python3 scripts/build-legacy-audit-md.py`.*

## Headline findings

- **Only 19 pages total** (17 published, 2 draft). The legacy site's heavy lifting is done by the `project` CPT (topic pages, 37 of them) and an anonymous-question system that is not exported by the WordPress WXR at all — likely a plugin-stored custom data store. For this audit those are out of scope.
- **Site is authored in Divi** (Elegant Themes page builder). Every page's content is a soup of `[et_pb_*]` shortcodes, so the extraction here walks Divi content blocks and attributes in document order to rebuild the reading-order copy. Quality varies — pages that lean heavily on Divi modules with dynamic content (Glossary, Blog, The Question Collection) come out thin because the module output isn't stored as authored copy.
- **The site is visibly out of date.** The Contact page footer reads `© 2019 Tailor Education`. The Privacy Policy is still in **draft**. The standalone `sex-relationships-education` page (acting as homepage) was authored before the current Tailor Teach / Okay to Ask split.
- **`RSE for Vulnerable Young People` is an empty placeholder** on the live site — the only content in `[et_pb_text]` is blank. It's referenced in the nav menu but has nothing to read. Flagged as *Merge* into `/services/rse-for-send-and-ap` on the new site.
- **Five service pages** on the legacy site collapse to **three** on the new site: Primary and Secondary keep their own pages; Special, Alternative Provision and Vulnerable YP merge into the new SEND & AP service page (Circuits).
- **Two near-duplicate training pages**: the standalone `/training` ('Training & Consultancy', 490 words) and `/rse-training` ('RSE Training', 491 words) have almost identical length and overlapping content. Both remap to the new `/services/rse-training`. Pick the stronger source copy during rewrite.
- **`/universities-and-fe` and `/events` have no equivalent** in the new site's IA — flagged *Investigate* for a keep/retire decision.
- **The Question Collection page** (`/anonymous-questions-about-sex-relationships`) is the legacy equivalent of the new `/questions/` Okay to Ask landing. Only 83 words of authored copy — the rest of the page was a dynamic question grid.

## Overview — all 19 pages

| # | Title | Slug | Status | Words | Role | Remap | Proposed new URL |
|---|---|---|---|---|---|---|---|
| 1 | Relationships & Sex Education | `sex-relationships-education` | publish | 570 | Homepage (candidate) | Rewrite | `/` |
| 2 | About | `about` | publish | 651 | About | Rewrite | `/about` |
| 3 | Schools | `schools` | publish | 639 | Schools hub (legacy) | Merge | `/services` |
| 4 | RSE for Primary Schools | `rse-for-primary-schools` | publish | 999 | Service — Primary | Rewrite | `/services/rse-for-primary-schools` |
| 5 | RSE for Secondary Schools | `rse-for-secondary-schools` | publish | 1209 | Service — Secondary | Rewrite | `/services/rse-for-secondary-schools` |
| 6 | RSE for Special Schools | `rse-for-special-schools` | publish | 1156 | Service — Special | Merge | `/services/rse-for-send-and-ap` |
| 7 | RSE for Alternative Provision | `tailored-rse-for-alternative-provision` | publish | 1173 | Service — AP | Merge | `/services/rse-for-send-and-ap` |
| 8 | RSE for Vulnerable Young People | `rse-for-vulnerable-young-people` | publish | 9 | Service — Vulnerable YP | Merge | `/services/rse-for-send-and-ap` |
| 9 | RSE Training | `rse-training` | publish | 491 | RSE Training | Rewrite | `/services/rse-training` |
| 10 | Training & Consultancy | `training` | publish | 490 | Training (legacy) | Merge | `/services/rse-training` |
| 11 | Universities and FE | `universities-and-fe` | publish | 675 | Universities & FE | Investigate | `(no equivalent — retire?)` |
| 12 | EVENTS | `events` | publish | 199 | Events | Investigate | `(no equivalent — retire?)` |
| 13 | Topics | `topics` | publish | 193 | Topics hub | Rewrite | `/topics/` |
| 14 | The Question Collection | `anonymous-questions-about-sex-relationships` | publish | 83 | Okay to Ask landing | Rewrite | `/questions/` |
| 15 | Glossary | `glossary` | publish | 1 | Glossary hub | Rewrite | `/glossary/` |
| 16 | Blog | `blog` | publish | 8 | Blog index | Rewrite | `/blog/` |
| 17 | CONTACT | `contact` | publish | 51 | Contact | Rewrite | `/contact` |
| 18 | Privacy Policy | `privacy-policy` | draft | 649 | Privacy policy | Rewrite | `/privacy` |
| 19 | Style | `` | draft | 126 | Other | Investigate | `(needs mapping)` |

### Remap status legend

- **Keep** — copy is still fit for purpose, lift-and-shift with light edits.
- **Rewrite** — page has a clear equivalent on the new site, but the copy needs rewriting against the current brand and audience split (Tailor Teach for teachers, Okay to Ask for YP).
- **Merge** — two or more legacy pages collapse into a single new page. Source the best bits from each.
- **Retire** — no equivalent on the new site and no reason to keep the copy.
- **Investigate** — unclear whether the page has an equivalent, needs a product decision.

## Page detail

Each section below has the page metadata, the proposed remap, and the extracted copy in document order. Copy blocks are labelled by kind so reviewers can skim structure: **bold** = heading, ``[button]`` = button text, ``[cta]`` = CTA block title, `> quote` = testimonial, plain text = body paragraph.

### Relationships & Sex Education

- **Legacy URL:** https://tailoreducation.org.uk/
- **Slug:** `sex-relationships-education`
- **Status:** publish
- **Last modified (GMT):** 2025-04-01 16:00:58
- **Word count:** 570
- **Role (guessed):** Homepage (candidate)
- **Proposed new URL:** `/`
- **Remap status:** **Rewrite**
- **Meta description:** Tailor provides Relationships & Sex Education services, resources and training for schools and other organisations working with young people. The Tailor team can work with any young person or group of young people.

#### Extracted copy

**Healthier Relationships for All Young People**

**We empower young people and educators through comprehensive, inclusive and insightful Relationships & Sex Education and training.**

`[button]` Get Support with RSE Delivery

**RSE Training**

Comprehensive RSE training for professionals working with young people. Enhancing their ability to deliver effective and inclusive RSE.

**Secondary Schools**

Dynamic and interactive learning experiences, designed to educate, enlighten and empower all young people on a rage of RSE topics.

**Primary Schools**

Delivering engaging RSE in primary schools to build a strong foundation of awareness and understanding in young learners.

**Special Schools**

RSE for special schools that nurtures autonomy and self-awareness, equipping students with skills for lifelong physical & emotional well-being.

**Alternative Provision**

Empowering learners in alternative settings with dynamic, inclusive RSE, fostering resilience, awareness, positive values and behavioural change.

**Vulnerable Groups**

For young people at higher risk of poor sexual health or unhealthy relationships. We focus on prevention, empowerment, and healthier choices.

**Latest Articles From Our Blog**

**Explore our recent insights and expert advice on key RSE topics, tailored for educators, parents, and young people.**

`[button]` Discover More

**Effective & Inclusive RSE**

Sex & Relationships Education encourages young people to examine their own knowledge, attitudes and values on a variety of issues relating to relationships and sexuality.

We aim to help young people interpret the many myths and messages they receive about sex and relationships. We provide them with reliable, factual information, giving them the knowledge and the skills required to negotiate positive relationships, enjoy good emotional health and when they’re ready, enjoy safer sex as a result.

`[button]` Learn More About Us

**Our previous valued clients include:**

**Our Recent News**

**Testimonials.**

**Ashley Summercorn**

Camden Centre for Learning

"We have some of the most challenging young people in Camden, however, your SRE lessons always engage and motivate our students to learn. You have always worked with us to adapt the learning to the needs of our young people. Thank you for your support."

**Victoria Oladele**

Careers First Academy

"I just wanted to take time out to say a HUGE thank you for all your hard work yesterday. You've broken a wall of silence here at the academy and students are certainly more interested in opening up and seeking help and support in this area. The students even gave feedback that they wanted you to return and talk about other issues relating to SRE."

**Natalie Rutstein**

Body & Soul Charity

"Thank you so much for the fantastic workshop you facilitated on Saturday. The feedback from both teens and volunteers was outstanding; in fact, probably one of the best I've ever received, simply because it was kept real, open and relatable for them. It sounds like you created a safe space where they could discuss their opinions and have them heard - I really hope we'll be able to work together again in the future."

**Valeria Ragni**

British Red Cross

"Thank you very much for the amazing sessions you ran with our group. They were extremely valuable and gave the young people the chance to speak about topics they would otherwise never have had the chance to discuss. They all gave an extremely positive feedback. A very big thank you also for your sensitivity and great understanding of our group. We really look forward to working with you again in the future"

---

### About

- **Legacy URL:** https://tailoreducation.org.uk/about/
- **Slug:** `about`
- **Status:** publish
- **Last modified (GMT):** 2023-12-04 08:17:01
- **Word count:** 651
- **Role (guessed):** About
- **Proposed new URL:** `/about`
- **Remap status:** **Rewrite**

#### Extracted copy

**About Tailor**

Tailor Education is a Community Interest Company (CIC)

At Tailor Education, we are deeply committed to providing comprehensive Relationships & Sex Education (RSE) that is age-appropriate and accessible to a diverse range of young people, including those with special educational needs, learning disabilities, or autism. We firmly believe that every young person has the right to quality education about relationships and sex, which is integrated within a broader framework of personal and social health and well-being.

Our approach includes tackling a variety of issues, such as puberty, contraception, sexually transmitted infections, consent, domestic violence, sexual bullying, porn literacy, online safety, and more. This wide range of topics is indicative of the comprehensive nature of our programs, designed to address the real-world challenges young people face.

Specifically, for young people with special educational needs or learning disabilities (SEND), we recognize the critical importance of RSE in their transition through adolescence and beyond. We offer tailored programs that build resilience, autonomy, and self-awareness, addressing sensitive topics like puberty, sex, privacy, and hygiene. Our experience with a spectrum of learning disabilities allows us to create and implement holistic and sustainable SRE programs, catering to the specific needs of these students.

Additionally, we've developed the Circuits program for young people with behavioural, emotional, and social difficulties (BESD). This adaptable sex and relationships education program incorporates tasks, challenges, and games to engage participants in discussions about their views and values, promote literacy, and reinforce learning. The flexibility of delivery in small groups or one-on-one settings, using various tools like whiteboards and iPads, allows for personalized and effective learning experiences.

At the university and further education levels, Tailor Education has developed specialised workshops. For example, in response to the Hollywood sexual harassment scandals, we collaborated with The Royal Academy of Dramatic Art and professional actors to develop practical workshops on this issue. These workshops explore a broad range of scenarios to help participants understand the experiences of harassment victims and discuss practical ways to deal with and report sexual harassment.

Our Masculinity & Male Privilege Workshops, developed in collaboration with King’s College London and other partners, address masculinity, male privilege, and sexual violence. These workshops are part of a broader initiative to challenge rigid views of masculinity and combat gender-based violence.

Another unique offering is the "Taboo or not Taboo!?" event format, designed to facilitate discussions on topics often avoided in society. This format emphasizes open discussion, with facilitators challenging negative attitudes and correcting myths, reinforcing our belief in the importance of open dialogue around sex and relationships.

The testimonials on our website reflect the positive impact of our workshops and sessions. These testimonials underscore our ability to engage challenging young people, break barriers of silence, create safe and relatable spaces for discussion, and address sensitive topics sensitively and effectively.

Furthermore, our website lists a comprehensive array of topics that our programs can cover, demonstrating our broad and inclusive approach to RSE. These topics range from accessing sexual health services to understanding the nuances of consent, cyber safety, emotional health, feminism, hygiene, LGBT awareness, masculinity & male privilege, mental health, periods, personal space, pleasure, pornography, pregnancy, puberty, recognizing abuse & exploitation, self-esteem, sexual anatomy, sexually transmitted infections, and many more.

Learn more about the topics we can cover HERE.

**About Us**

At Tailor Education, we are dedicated to delivering comprehensive, inspiring and empowering Relationships & Sex Education (RSE). With a focus on inclusivity and comprehensiveness, our team delivers age-appropriate, insightful RSE programs tailored to a diverse range of young people, including those with special educational needs, learning disabilities, or autism. Founded on the principle that quality RSE is a cornerstone of personal and social well-being, we strive to empower educators, young people, and communities through engaging workshops, consultancy, and tailored training. Our innovative approach is not just about imparting knowledge; it's about fostering understanding, respect, and healthy relationships in our rapidly evolving world.

---

### Schools

- **Legacy URL:** https://tailoreducation.org.uk/schools/
- **Slug:** `schools`
- **Status:** publish
- **Last modified (GMT):** 2020-02-15 14:20:06
- **Word count:** 639
- **Role (guessed):** Schools hub (legacy)
- **Proposed new URL:** `/services`
- **Remap status:** **Merge**

#### Extracted copy

**SCHOOLS & ALTERNATIVE SETTINGS**

**EFFECTIVE RSE**

We believe that all young people have the right to access good quality, age-appropriate education about relationships and sex (RSE) as part of broader education about personal and social health and wellbeing.

Sex and relationships education encourages young people to examine their own knowledge, attitudes and values on a variety of issues relating to relationships and sexuality.

We aim to help young people interpret the many myths and messages they receive about sex and relationships. We provide them with reliable, factual information, giving them the knowledge and the skills required to negotiate positive relationships, enjoy good emotional health and when they're ready, enjoy safer sex as a result.

As well as information workshops on things like puberty, contraception and sexually transmitted infections, we also provide educational workshops on a range of other issues facing young people including consent, domestic violence, sexual bullying, porn literacy, online safety, CSE and more.

**SPECIAL SCHOOLS**

For young people who have special educational needs or a learning disability (SEND), education about sex and relationships is crucial to ensuring they have the knowledge, skills and confidence to transition safely through adolescence and beyond.

Comprehensive personal, social & health education goes a long way to building resilience, autonomy and self-awareness in young people with SEND. We have the experience, skills and passion to help schools provide suitable education and support for the young people in their care.

Lessons on sensitive topics like puberty, sex, privacy and hygiene can be difficult to get right. Many teachers harbour real anxiety about how to provide suitable support for their students. It can be hard to find suitable lesson plans and even harder to adapt them to meet young people's varied needs.

At Tailor, we have years of experience working with young people who have mild, moderate, severe and profound learning disabilities. We will work with you to devise an SRE programme tailored to the specific needs of your students and can support your school to implement a holistic and sustainable plan for SRE delivery.

We also have a dedicated programme for learners with behavioural, emotional & social difficulties called Circuits.

**CIRCUITS**

For young people with behavioural, emotional and social difficulties (BESD) and/or special educational needs, we created Circuits; an adaptable sex and relationships education programme built around tasks, challenges and games.

Some tasks are designed to encourage participants to explore their own views and values through discussion. Others are designed to promote literacy, improve vocabulary or measure understanding. We have also designed games, puzzles, word searches and crosswords to reinforce learning, keep young people engaged and re-focus learners after distraction.

Circuits can be delivered to small groups or on a 1:1 basis, using whiteboards, iPads or flashcards and often with multiple facilitators. This gives us the flexibility to explore multiple topics at the same time and allows learners to move through the programme at their own pace, with support tailored to their individual needs. Working in this way minimises the impact of inconsistent attendance or any other disruption.

**DROP DOWN DAYS**

‘Drop down days’ or ‘focus weeks’ can be great ways of enriching a comprehensive  RSE programme in both primary and secondary schools. Many schools use them to recap information taught in timetabled lessons during the previous year.

At Tailor, we can devise a bespoke programme of work for your school based on your timetable, cohort and the way you wish to structure the day.

Please contact us to discuss an RSE drop-down day for your students.

**Get In Touch.**

We'd love to hear from you! Just fill out the form below and we'll get back to you :)

Email: info@tailoreducation.org.uk

Tel: 020 3289 8812

FOLLOW US

QUICK LINKS

About Tailor
 Relationships & Sex Education
 RSE Training
 Contact Us

ALSO VISIT

WEBSITE BY

© 2019 Tailor Education.

---

### RSE for Primary Schools

- **Legacy URL:** https://tailoreducation.org.uk/rse-for-primary-schools/
- **Slug:** `rse-for-primary-schools`
- **Status:** publish
- **Last modified (GMT):** 2023-12-04 08:10:49
- **Word count:** 999
- **Role (guessed):** Service — Primary
- **Proposed new URL:** `/services/rse-for-primary-schools`
- **Remap status:** **Rewrite**

#### Extracted copy

**Interactive & Inspiring RSE**

**Our specialised RSE is designed to empower students with a safer, more informed future. Discover how we work with special schools.**

`[button]` Contact Us to Book

**Foundational RSE for Primary Schools**

Every child deserves a strong foundation in understanding relationships and personal well-being. In a world where children are increasingly exposed to varied, complex and potentially harmful content, providing them with clear, age-appropriate, and factual RSE is not just necessary, it's vital.

Our RSE programs are more than just lessons; they are pathways to empower young minds with knowledge, confidence, and values. We pride ourselves on creating a safe, inclusive, and engaging learning environment where every primary school student feels valued and heard.

`[button]` Learn More about Creating Sustainable RSE at Your School

**Key Aspects of Our Delivery**

**Age-Appropriate Content**

All our lessons are carefully crafted to ensure that we provide just the right amount of information to satisfy their curiosity and help them understand their experiences.

**Engaging Activities**

We use varied interactive methods such as storytelling, role-playing, and group discussions to make learning about relationships fun and memorable.

**Experienced Educators**

Our lessons are inclusive and accessible to all students, including those with special educational needs (SEND). We ensure every child feels included and safe.

**Body Awareness**

**Respectful Relationships**

**Personal Safety**

**Emotional Health**

**Explore Our Wide Range of RSE Topics**

**We deliver RSE workshops on a comprehensive range of topics, tailored for primary schools. Our curriculum is designed to empower students with the knowledge and skills for positive relationships and emotional health.**

`[button]` Explore All Topics

**Creating Sustainable RSE Delivery**

Tailor Education's mission extends beyond just presenting a program; we aim to embed high-quality Relationships & Sex Education (RSE) in a manner that is enduring and evolves with the needs of students, particularly those with special educational needs and disabilities (SEND). Our comprehensive support structure ensures that RSE is not just a one-off program but a lasting element of a school's curriculum.

How we do it:

**Holistic Curriculum Design**

Our team collaborates with schools to craft RSE lesson plans that are not only inclusive but also resonate with the lived experiences of students with SEND. We emphasise a flexible curriculum, allowing it to be tailored to each classroom's unique needs and learning styles. This approach ensures that every student receives RSE that is accessible, understandable, and relevant to their lives.

**RSE Policy Support**

Navigating the intricacies of educational policies can be challenging. We provide expert guidance in interpreting and applying RSE policies, helping schools to align their curriculum with current regulations and best practices. This includes assistance in drafting or revising school RSE policies to reflect an inclusive and comprehensive approach.

**All-staff Training**

To ensure the effective delivery of RSE, it's essential that all staff members, not just teachers, are equipped with the necessary knowledge and skills. We offer specialised training sessions that empower every member of the school community — from teachers to support staff — with the confidence and capability to contribute to the RSE learning environment.

**Parental Engagement**

Engaging parents and caregivers is a critical aspect of successful RSE. We facilitate workshops and provide resources to help schools in establishing constructive dialogues with parents. This involves addressing their concerns, providing clarity on the RSE curriculum, and exploring ways parents can support their children’s learning at home.

**Continued Access to RSE Resources**

We understand that RSE is an evolving field. Our commitment includes providing schools with ongoing access to up-to-date resources, including teaching materials, research updates, and best-practice guides. This ensures that schools can continuously refresh and enhance their RSE provision.

**Ongoing Support**

Our relationship with schools is not transactional but a partnership. We offer ongoing support, including follow-up visits, consultation sessions, and refresher training. This ensures that schools feel supported at every step and can confidently address new challenges or changes in their student population.

**Let's Collaborate**

We invite you to partner with us in bringing high-quality RSE to your secondary school. Together, we can make a significant impact on the lives of young people, helping them navigate the complexities of relationships and emotional health with confidence and clarity.

`[button]` Contact Us Now

**FAQs**

**Got questions? Find answers to common queries about our workshops here.**

**What age groups do your RSE sessions cater to?**

Our RSE sessions are designed for a wide age range, from early years to young adults, ensuring age-appropriate content for each group.

**Can you provide RSE training for educators and professionals?**

Yes, we offer in-depth training for educators and professionals to enhance their confidence and competence in delivering RSE.

**Do your programs include topics on digital safety and online relationships?**

Absolutely. We cover digital safety and online relationships, teaching young people about the risks and responsible behavior in the digital world.

**How do you ensure your RSE programs are inclusive?**

Our programs are developed with inclusivity at their core, addressing diverse needs, including those of the LGBTQ+ community and students with disabilities.

**What methods do you use to engage young people in RSE?**

We use interactive and engaging methods like discussions, role-plays, and multimedia resources to make RSE relatable and effective for young people.

**Can Tailor Education provide specialized RSE sessions for vulnerable youth?**

Yes, we offer targeted RSE programs for young people at higher risk of harmful relationships, early pregnancy, and poor sexual health.

**Are your RSE sessions aligned with current educational guidelines and policies?**

Yes, our sessions are designed in accordance with the latest educational guidelines and policies to ensure they meet national standards.

**How do you measure the impact of your RSE programs?**

We assess the impact through feedback surveys, participant engagement, and pre- and post-session evaluations.

**Do you offer online RSE sessions and resources?**

Yes, we offer both online sessions and digital resources, making our RSE programs accessible to a wider audience.

---

### RSE for Secondary Schools

- **Legacy URL:** https://tailoreducation.org.uk/rse-for-secondary-schools/
- **Slug:** `rse-for-secondary-schools`
- **Status:** publish
- **Last modified (GMT):** 2023-12-04 07:53:31
- **Word count:** 1209
- **Role (guessed):** Service — Secondary
- **Proposed new URL:** `/services/rse-for-secondary-schools`
- **Remap status:** **Rewrite**

#### Extracted copy

**Relevant & Comprehensive RSE**

**Our dynamic & expert-led RSE sessions are designed to Empower, educate, and inspire.**

`[button]` Get Support with RSE

**Mainstream Schools**

At Tailor Education, we offer a dynamic range of RSE services specifically designed for mainstream schools. Our programs are crafted to resonate with a diverse student body, focusing on fostering a comprehensive understanding of relationships and sexual health.

Our goal is to equip students in mainstream schools with the knowledge and skills needed to navigate relationships and sexual health responsibly and respectfully.

`[button]` How We Help Schools Embed Sustainable RSE

**Key Aspects of Our Programs**

**Curriculum Integration**

Our RSE content seamlessly integrates with existing curricula, enhancing the overall educational experience.

**Engaging Activities**

We employ interactive teaching methods, including discussions, role-play, and multimedia tools, to engage students actively.

**Inclusivity and Sensitivity**

Recognising the diverse backgrounds of students, our programs are inclusive and sensitive to various cultural, religious, and personal values.

**Empathy & Inclusivity**

We believe in promoting inclusivity and empathy and strive to show understanding and respect for diverse identities, cultures, and experiences. All our materials, resources, and lesson plans are designed not only to educate but to resonate with a wide array of learners. By weaving empathy and inclusivity into every aspect of our delivery, we aim to foster an environment where every student feels seen, heard, and valued.

**Addressing Critical Issues**

Tailor Education is committed to tackling critical societal issues head-on. Our workshops and discussion events delve into sensitive topics like sexual harassment and the nuances of masculinity. These discussions are framed in a manner that is respectful, age-appropriate, and thought-provoking, encouraging students to engage in meaningful conversations.

**Comprehensive Curriculum Overview**

Our curriculum is extensive and carefully crafted to address a wide range of topics relevant to young people today. From navigating sexual health services to fostering emotional health, from raising LGBTQ+ awareness to recognising and preventing abuse, our RSE programs offer comprehensive coverage, equipping students with the knowledge and skills they need for healthy, positive relationships.

"I just wanted to take time out to say a HUGE thank you for all your hard work yesterday. You've broken a wall of silence here at the academy and students are certainly more interested in opening up and seeking help and support in this area. The students even gave feedback that they wanted you to return and talk about other issues relating to SRE."

**Victoria Oladele - Careers First Academy**

**Explore Our Wide Range of RSE Topics**

**As well as information workshops on things like puberty, contraception and sexually transmitted infections, we also provide educational workshops on a range of other issues facing young people including consent, domestic violence, sexual bullying, porn literacy, online safety, CSE and more.**

`[button]` Explore All Topics

**Consent**

**LGBTQ+**

**Masculinity & Male Privilege**

**Porn Literacy**

**Creating Sustainable RSE Delivery**

Tailor Education's mission extends beyond just presenting a program; we aim to embed high-quality Relationships & Sex Education (RSE) in a manner that is enduring and evolves with the needs of students, particularly those with special educational needs and disabilities (SEND). Our comprehensive support structure ensures that RSE is not just a one-off program but a lasting element of a school's curriculum.

How we do it:

**Holistic Curriculum Design**

Our team collaborates with schools to craft RSE lesson plans that are not only inclusive but also resonate with the lived experiences of SEND students. We emphasize a curriculum that is flexible, allowing it to be tailored to the unique needs and learning styles of each classroom. This approach ensures that every student receives RSE that is accessible, understandable, and relevant to their lives.

**RSE Policy Support**

Navigating the intricacies of educational policies can be challenging. We provide expert guidance in interpreting and applying RSE policies, helping schools to align their curriculum with current regulations and best practices. This includes assistance in drafting or revising school RSE policies to reflect an inclusive and comprehensive approach.

**All-staff Training**

To ensure the effective delivery of RSE, it's essential that all staff members, not just teachers, are equipped with the necessary knowledge and skills. We offer specialized training sessions that empower every member of the school community — from teachers to support staff — with the confidence and capability to contribute to the RSE learning environment.

**Parental Engagement**

Engaging parents and caregivers is a critical aspect of successful RSE. We facilitate workshops and provide resources to help schools in establishing constructive dialogues with parents. This involves addressing their concerns, providing clarity on the RSE curriculum, and exploring ways parents can support their children’s learning at home.

**Continued Access to RSE Resources**

We understand that RSE is an evolving field. Our commitment includes providing schools with ongoing access to up-to-date resources, including teaching materials, research updates, and best-practice guides. This ensures that schools can continuously refresh and enhance their RSE provision.

**Ongoing Support**

Our relationship with schools is not transactional but a partnership. We offer ongoing support, including follow-up visits, consultation sessions, and refresher training. This ensures that schools feel supported at every step and can confidently address new challenges or changes in their student population.

**Let's Collaborate**

We invite you to partner with us in bringing high-quality RSE to your secondary school. Together, we can make a significant impact on the lives of young people, helping them navigate the complexities of relationships and emotional health with confidence and clarity.

`[button]` Contact Us Now

**FAQs**

**Got questions? Find answers to common queries about our workshops here.**

**What age groups do your RSE sessions cater to?**

Our RSE sessions are designed for a wide age range, from early years to young adults, ensuring age-appropriate content for each group.

**Can you provide RSE training for educators and professionals?**

Yes, we offer in-depth training for educators and professionals to enhance their confidence and competence in delivering RSE.

**Do your programs include topics on digital safety and online relationships?**

Absolutely. We cover digital safety and online relationships, teaching young people about the risks and responsible behavior in the digital world.

**How do you ensure your RSE programs are inclusive?**

Our programs are developed with inclusivity at their core, addressing diverse needs, including those of the LGBTQ+ community and students with disabilities.

**What methods do you use to engage young people in RSE?**

We use interactive and engaging methods like discussions, role-plays, and multimedia resources to make RSE relatable and effective for young people.

**Can Tailor Education provide specialized RSE sessions for vulnerable youth?**

Yes, we offer targeted RSE programs for young people at higher risk of harmful relationships, early pregnancy, and poor sexual health.

**Are your RSE sessions aligned with current educational guidelines and policies?**

Yes, our sessions are designed in accordance with the latest educational guidelines and policies to ensure they meet national standards.

**How do you measure the impact of your RSE programs?**

We assess the impact through feedback surveys, participant engagement, and pre- and post-session evaluations.

**Do you offer online RSE sessions and resources?**

Yes, we offer both online sessions and digital resources, making our RSE programs accessible to a wider audience.

---

### RSE for Special Schools

- **Legacy URL:** https://tailoreducation.org.uk/rse-for-special-schools/
- **Slug:** `rse-for-special-schools`
- **Status:** publish
- **Last modified (GMT):** 2023-12-04 08:14:51
- **Word count:** 1156
- **Role (guessed):** Service — Special
- **Proposed new URL:** `/services/rse-for-send-and-ap`
- **Remap status:** **Merge**

#### Extracted copy

**Supportive & Holistic RSE**

**Our specialised RSE is designed to empower students with a safer, more informed future. Discover how we work with special schools.**

`[button]` Get Help with RSE at Your School

**Specialised RSE for Special Schools**

At Tailor Education, we have years of experience working with students who have Special Educational Needs and Disabilities (SEND). Our RSE programs are designed to help these young people build the resilience, autonomy, and self-awareness, crucial for their safe and confident progression through adolescence and adulthood.

Our primary goal is to equip students in special schools with a well-rounded understanding of relationships and sexual health. By acknowledging and respecting each student's unique perspective and experience, we aim to empower them with the knowledge and confidence needed to make informed decisions and develop healthy relationships.

`[button]` Learn More About Creating Sustainable RSE at Your School

**Our Approach**

**Tailored Lesson Plans**

Our curriculum is carefully modified to align with the cognitive, emotional, and physical abilities of students in special schools, ensuring that each lesson is relevant and accessible.

**Multi-Sensory Teaching Techniques**

We employ a range of sensory-rich educational methods, including visual aids, tactile learning tools, and interactive activities, to cater to different learning styles and needs.

**Safe & Empathetic Learning Spaces**

Our educators are specially trained to foster a nurturing and patient learning environment. This approach encourages open communication and ensures that students feel comfortable and supported to learn.

**Collaboration with Teachers**

We work closely with teachers and support staff to create a cohesive and integrated learning experience that complements the students' overall educational plan.

**Addressing Sensitive Topics**

We tackle sensitive topics like puberty, sex, privacy, and hygiene with care and expertise, easing the anxieties of educators while providing suitable support for students.

**Explore Our Wide Range of RSE Topics**

**We deliver RSE workshops on a comprehensive range of topics, tailored for primary schools. Our curriculum is designed to empower students with the knowledge and skills for positive relationships and emotional health.**

`[button]` Explore All Topics

**Body Awareness**

**Respectful Relationships**

**Personal Safety**

**Emotional Health**

**Creating Sustainable RSE Delivery**

Tailor Education's mission extends beyond just presenting a program; we aim to embed high-quality Relationships & Sex Education (RSE) in a manner that is enduring and evolves with the needs of students, particularly those with special educational needs and disabilities (SEND). Our comprehensive support structure ensures that RSE is not just a one-off program but a lasting element of a school's curriculum.

How we do it:

**Holistic Curriculum Design**

Our team collaborates with schools to craft RSE lesson plans that are not only inclusive but also resonate with the lived experiences of SEND students. We emphasize a curriculum that is flexible, allowing it to be tailored to the unique needs and learning styles of each classroom. This approach ensures that every student receives RSE that is accessible, understandable, and relevant to their lives.

**RSE Policy Support**

Navigating the intricacies of educational policies can be challenging. We provide expert guidance in interpreting and applying RSE policies, helping schools to align their curriculum with current regulations and best practices. This includes assistance in drafting or revising school RSE policies to reflect an inclusive and comprehensive approach.

**All-staff Training**

To ensure the effective delivery of RSE, it's essential that all staff members, not just teachers, are equipped with the necessary knowledge and skills. We offer specialized training sessions that empower every member of the school community — from teachers to support staff — with the confidence and capability to contribute to the RSE learning environment.

**Parental Engagement**

Engaging parents and caregivers is a critical aspect of successful RSE. We facilitate workshops and provide resources to help schools in establishing constructive dialogues with parents. This involves addressing their concerns, providing clarity on the RSE curriculum, and exploring ways parents can support their children’s learning at home.

**Continued Access to RSE Resources**

We understand that RSE is an evolving field. Our commitment includes providing schools with ongoing access to up-to-date resources, including teaching materials, research updates, and best-practice guides. This ensures that schools can continuously refresh and enhance their RSE provision.

**Ongoing Support**

Our relationship with schools is not transactional but a partnership. We offer ongoing support, including follow-up visits, consultation sessions, and refresher training. This ensures that schools feel supported at every step and can confidently address new challenges or changes in their student population.

"I just wanted to take time out to say a HUGE thank you for all your hard work yesterday. You've broken a wall of silence here at the academy and students are certainly more interested in opening up and seeking help and support in this area. The students even gave feedback that they wanted you to return and talk about other issues relating to SRE."

**Victoria Oladele - Careers First Academy**

**Let's Collaborate**

We invite you to partner with us in bringing high-quality RSE to your secondary school. Together, we can make a significant impact on the lives of young people, helping them navigate the complexities of relationships and emotional health with confidence and clarity.

`[button]` Contact Us Now

**FAQs**

**Got questions? Find answers to common queries about our workshops here.**

**What age groups do your RSE sessions cater to?**

Our RSE sessions are designed for a wide age range, from early years to young adults, ensuring age-appropriate content for each group.

**Can you provide RSE training for educators and professionals?**

Yes, we offer in-depth training for educators and professionals to enhance their confidence and competence in delivering RSE.

**Do your programs include topics on digital safety and online relationships?**

Absolutely. We cover digital safety and online relationships, teaching young people about the risks and responsible behavior in the digital world.

**How do you ensure your RSE programs are inclusive?**

Our programs are developed with inclusivity at their core, addressing diverse needs, including those of the LGBTQ+ community and students with disabilities.

**What methods do you use to engage young people in RSE?**

We use interactive and engaging methods like discussions, role-plays, and multimedia resources to make RSE relatable and effective for young people.

**Can Tailor Education provide specialized RSE sessions for vulnerable youth?**

Yes, we offer targeted RSE programs for young people at higher risk of harmful relationships, early pregnancy, and poor sexual health.

**Are your RSE sessions aligned with current educational guidelines and policies?**

Yes, our sessions are designed in accordance with the latest educational guidelines and policies to ensure they meet national standards.

**How do you measure the impact of your RSE programs?**

We assess the impact through feedback surveys, participant engagement, and pre- and post-session evaluations.

**Do you offer online RSE sessions and resources?**

Yes, we offer both online sessions and digital resources, making our RSE programs accessible to a wider audience.

---

### RSE for Alternative Provision

- **Legacy URL:** https://tailoreducation.org.uk/tailored-rse-for-alternative-provision/
- **Slug:** `tailored-rse-for-alternative-provision`
- **Status:** publish
- **Last modified (GMT):** 2023-12-04 07:59:25
- **Word count:** 1173
- **Role (guessed):** Service — AP
- **Proposed new URL:** `/services/rse-for-send-and-ap`
- **Remap status:** **Merge**

#### Extracted copy

**Inclusive & Engaging RSE**

**Navigating unique educational paths with tailored RSE for Alternative Provision. Explore our adaptable, inclusive approach.**

`[button]` Get Help with RSE at Your School

**Flexible RSE for Alternative Provision**

At Tailor Education, we specialise in delivering Relationships & Sex Education (RSE) across diverse learning environments. Our teaching methods are highly adaptable; to cater to students in Alternative Provision (AP) such as Pupil Referral Units, Home Education Groups, and Medical Tuition Services.

Our aim is to ensure every young person, regardless of their learning environment, has access to high-quality, empathetic, and relevant RSE.

`[button]` Learn More About Creating Sustainable RSE at Your School

**How We Adapt to the Needs of Your Learners**

**Customised Content**

Tailored to address the specific situations and learning styles of AP students and informal learners.

**Engaging Activities**

We employ interactive teaching methods, including discussions, role-play, and multimedia tools, to engage students actively.

**Experienced Educators**

Our team brings empathy and expertise, essential for diverse audiences in AP and informal settings.

**Inclusivity and Sensitivity**

Our RSE programs are conscientiously designed to be inclusive and sensitive to the unique needs of all learners, including those with learning disabilities, autism, or facing emotional and social challenges. We integrate strategies that foster resilience, autonomy, and self-awareness, ensuring every student feels seen, heard, and valued.

**Addressing Critical Issues**

Tailor Education is committed to tackling critical societal issues head-on. Our workshops and discussion events delve into sensitive topics like sexual harassment and the nuances of masculinity. These discussions are framed in a manner that is respectful, age-appropriate, and thought-provoking, encouraging students to engage in meaningful conversations.

**Comprehensive Curriculum Overview**

Our curriculum is extensive and carefully crafted to address a wide range of topics relevant to young people today. From navigating sexual health services to fostering emotional health, from raising LGBTQ+ awareness to recognising and preventing abuse, our RSE programs offer comprehensive coverage, equipping students with the knowledge and skills they need for healthy, positive relationships.

We have some of the most challenging young people in Camden, however, your SRE lessons always engage and motivate our students to learn. You have always worked with us to adapt the learning to the needs of our young people. Thank you for your support.

**Ashley Summercorn - Camden Centre for Learning**

**Explore Our Wide Range of RSE Topics**

**We deliver RSE workshops on a comprehensive range of topics, tailored for primary schools. Our curriculum is designed to empower students with the knowledge and skills for positive relationships and emotional health.**

`[button]` Explore All Topics

**Body Awareness**

**Respectful Relationships**

**Personal Safety**

**Emotional Health**

**Creating Sustainable RSE Delivery**

Tailor Education's mission extends beyond just presenting a program; we aim to embed high-quality Relationships & Sex Education (RSE) in a manner that is enduring and evolves with the needs of students, particularly those with special educational needs and disabilities (SEND). Our comprehensive support structure ensures that RSE is not just a one-off program but a lasting element of a school's curriculum.

How we do it:

**Holistic Curriculum Design**

Our team collaborates with schools to craft RSE lesson plans that are not only inclusive but also resonate with the lived experiences of SEND students. We emphasize a curriculum that is flexible, allowing it to be tailored to the unique needs and learning styles of each classroom. This approach ensures that every student receives RSE that is accessible, understandable, and relevant to their lives.

**RSE Policy Support**

Navigating the intricacies of educational policies can be challenging. We provide expert guidance in interpreting and applying RSE policies, helping schools to align their curriculum with current regulations and best practices. This includes assistance in drafting or revising school RSE policies to reflect an inclusive and comprehensive approach.

**All-staff Training**

To ensure the effective delivery of RSE, it's essential that all staff members, not just teachers, are equipped with the necessary knowledge and skills. We offer specialized training sessions that empower every member of the school community — from teachers to support staff — with the confidence and capability to contribute to the RSE learning environment.

**Parental Engagement**

Engaging parents and caregivers is a critical aspect of successful RSE. We facilitate workshops and provide resources to help schools in establishing constructive dialogues with parents. This involves addressing their concerns, providing clarity on the RSE curriculum, and exploring ways parents can support their children’s learning at home.

**Continued Access to RSE Resources**

We understand that RSE is an evolving field. Our commitment includes providing schools with ongoing access to up-to-date resources, including teaching materials, research updates, and best-practice guides. This ensures that schools can continuously refresh and enhance their RSE provision.

**Ongoing Support**

Our relationship with schools is not transactional but a partnership. We offer ongoing support, including follow-up visits, consultation sessions, and refresher training. This ensures that schools feel supported at every step and can confidently address new challenges or changes in their student population.

**Let's Collaborate**

We invite you to partner with us in bringing high-quality RSE to your secondary school. Together, we can make a significant impact on the lives of young people, helping them navigate the complexities of relationships and emotional health with confidence and clarity.

`[button]` Contact Us Now

**FAQs**

**Got questions? Find answers to common queries about our workshops here.**

**What age groups do your RSE sessions cater to?**

Our RSE sessions are designed for a wide age range, from early years to young adults, ensuring age-appropriate content for each group.

**Can you provide RSE training for educators and professionals?**

Yes, we offer in-depth training for educators and professionals to enhance their confidence and competence in delivering RSE.

**Do your programs include topics on digital safety and online relationships?**

Absolutely. We cover digital safety and online relationships, teaching young people about the risks and responsible behavior in the digital world.

**How do you ensure your RSE programs are inclusive?**

Our programs are developed with inclusivity at their core, addressing diverse needs, including those of the LGBTQ+ community and students with disabilities.

**What methods do you use to engage young people in RSE?**

We use interactive and engaging methods like discussions, role-plays, and multimedia resources to make RSE relatable and effective for young people.

**Can Tailor Education provide specialised RSE sessions for vulnerable youth?**

Yes, we offer targeted RSE programs for young people at higher risk of harmful relationships, early pregnancy, and poor sexual health.

**Are your RSE sessions aligned with current educational guidelines and policies?**

Yes, our sessions are designed in accordance with the latest educational guidelines and policies to ensure they meet national standards.

**How do you measure the impact of your RSE programs?**

We assess the impact through feedback surveys, participant engagement, and pre- and post-session evaluations.

**Do you offer online RSE sessions and resources?**

Yes, we offer both online sessions and digital resources, making our RSE programs accessible to a wider audience.

---

### RSE for Vulnerable Young People

- **Legacy URL:** https://tailoreducation.org.uk/rse-for-vulnerable-young-people/
- **Slug:** `rse-for-vulnerable-young-people`
- **Status:** publish
- **Last modified (GMT):** 2023-11-29 15:30:25
- **Word count:** 9
- **Role (guessed):** Service — Vulnerable YP
- **Proposed new URL:** `/services/rse-for-send-and-ap`
- **Remap status:** **Merge**

#### Extracted copy

[et_pb_section admin_label="section"]
 [et_pb_row admin_label="row"]
 [et_pb_column type="4_4"][et_pb_text admin_label="Text"][/et_pb_text][/et_pb_column]
 [/et_pb_row]
 [/et_pb_section]

---

### RSE Training

- **Legacy URL:** https://tailoreducation.org.uk/rse-training/
- **Slug:** `rse-training`
- **Status:** publish
- **Last modified (GMT):** 2023-11-30 09:41:10
- **Word count:** 491
- **Role (guessed):** RSE Training
- **Proposed new URL:** `/services/rse-training`
- **Remap status:** **Rewrite**
- **Meta description:** Is your school ready for statutory relationships and sex education? Our 1-day RSE training will teach participants how to deliver an effective RSE programme in their school. It will explore each topic that should be covered as part of an good RSE curriculum and will support schools in monitoring and assessing RSE

#### Extracted copy

**RSE Training for Professionals**

**Our comprehensive course equips educators, healthcare providers, and youth workers with the skills and knowledge to effectively deliver Relationships & Sex Education.**

`[button]` Enquire About In-House Training

**Gain New Skills and Confidence with Expert RSE Training**

**Tailor provides a sexual health training course for professionals working with young people. The training aims to equip professionals with the knowledge and skills to support and signpost young people in relation to sexual health and relationships.**

**We also provide training to help teachers and support staff in special schools build competency and confidence in discussing a range of sex and relationship issues. Our practical training will help you structure an effective SRE programme; identify useful techniques and overcome anxieties. We can also facilitate forums and private consultations for parents, carers or staff to voice their thoughts and concerns about Sex & Relationships issues affecting their child or students. In our experience, these forums can be very useful as they provide an opportunity to receive advice and reassurance from an expert.**

`[button]` Talk to us About Training

**What We Offer**

**In-Depth Modules**

Our training covers a range of crucial topics, from developing engaging RSE curricula to addressing the unique needs of diverse learners.

**Fun & Practical**

Our RSE training is engaging and hands-on, offering lively exercises and realistic scenarios that enhance the educational experience.

**Expert Trainers**

Our team of trainers brings years of expertise in RSE, combining deep knowledge with real-world experience to enrich learning.

**Phoebe Davis**

Artist, Researcher & Activist

I have regularly worked with Tailor SRE since 2016. In my opinion, they are leading the way in providing inclusive sex education within universities and schools across the UK. I have learnt a great deal from working with Tailor SRE (specifically when investigating consent and gender identity) and highly recommend them for staff training, workshops, consultancy & mentoring in this field.

**FAQs**

**Got questions? Find answers to common queries about our workshops here.**

**Is the training suitable for educators without prior RSE experience?**

Absolutely, our training is designed to be accessible for educators at all levels of experience, providing foundational knowledge as well as advanced concepts.

**How long is each RSE training session?**

Training sessions vary, typically ranging from a few hours to full-day workshops, depending on the depth and breadth of the topics covered.

**Can the training be customised to suit our specific school or organisation?**

Yes, we offer tailored training sessions to meet the unique needs and challenges of your school or organisation.

**Do you provide any resources or materials post-training?**

Participants receive a comprehensive set of resources and materials for reference and further application in their professional settings.

**Get In Touch.**

**We'd love to hear from you! Just fill out the form below and we'll get back to you :)**

**Or just send us an email to info@tailoreducation.org.uk**

---

### Training & Consultancy

- **Legacy URL:** https://tailoreducation.org.uk/training/
- **Slug:** `training`
- **Status:** publish
- **Last modified (GMT):** 2023-11-27 12:35:24
- **Word count:** 490
- **Role (guessed):** Training (legacy)
- **Proposed new URL:** `/services/rse-training`
- **Remap status:** **Merge**

#### Extracted copy

**RSE Training for Professionals**

**Our comprehensive course equips educators, healthcare providers, and youth workers with the skills and knowledge to effectively deliver Relationships & Sex Education.**

`[button]` Enquire About In-House Training

**Gain New Skills and Confidence with Expert RSE Training**

**Tailor provides a sexual health training course for professionals working with young people. The training aims to equip professionals with the knowledge and skills to support and signpost young people in relation to sexual health and relationships.**

**We also provide training to help teachers and support staff in special schools build competency and confidence in discussing a range of sex and relationship issues. Our practical training will help you structure an effective SRE programme; identify useful techniques and overcome anxieties. We can also facilitate forums and private consultations for parents, carers or staff to voice their thoughts and concerns about sex and relationships issues affecting their child or students. In our experience, these forums can be very useful as they provide an opportunity to receive advice and reassurance from an expert.**

Talk to us about training

**What We Offer**

**In-Depth Modules**

Our training covers a range of crucial topics, from developing engaging RSE curricula to addressing the unique needs of diverse learners.

**Fun & Practical**

Our RSE training is engaging and hands-on, offering lively exercises and realistic scenarios that enhance the educational experience.

**Expert Trainers**

Our team of trainers brings years of expertise in RSE, combining deep knowledge with real-world experience to enrich learning.

**Phoebe Davis**

Artist, Researcher & Activist

I have regularly worked with Tailor SRE since 2016. In my opinion, they are leading the way in providing inclusive sex education within universities and schools across the UK. I have learnt a great deal from working with Tailor SRE (specifically when investigating consent and gender identity) and highly recommend them for staff training, workshops, consultancy & mentoring in this field.

**FAQs**

**Got questions? Find answers to common queries about our workshops here.**

**Is the training suitable for educators without prior RSE experience?**

Absolutely, our training is designed to be accessible for educators at all levels of experience, providing foundational knowledge as well as advanced concepts.

**How long is each RSE training session?**

Training sessions vary, typically ranging from a few hours to full-day workshops, depending on the depth and breadth of the topics covered.

**Can the training be customised to suit our specific school or organisation?**

Yes, we offer tailored training sessions to meet the unique needs and challenges of your school or organisation.

**Do you provide any resources or materials post-training?**

Participants receive a comprehensive set of resources and materials for reference and further application in their professional settings.

**Get In Touch.**

**We'd love to hear from you! Just fill out the form below and we'll get back to you :)**

**Or just send us an email to info@tailoreducation.org.uk**

---

### Universities and FE

- **Legacy URL:** https://tailoreducation.org.uk/universities-and-fe/
- **Slug:** `universities-and-fe`
- **Status:** publish
- **Last modified (GMT):** 2020-02-15 14:54:52
- **Word count:** 675
- **Role (guessed):** Universities & FE
- **Proposed new URL:** `(no equivalent — retire?)`
- **Remap status:** **Investigate**

#### Extracted copy

**UNIVERSITIES AND FE COLLEGES**

**METOO**

**Sexual Harassment Workshops for Drama Schools**

In the wake of the recent sexual harassment scandals in Hollywood, we worked with The Royal Academy of Dramatic Art and professional actors to develop a workshop that deals practically with this issue.

We begin by exploring a broad range of scenarios in which anyone could feel disempowered or unable to exercise their own choice. This enables all participants to understand how a victim of harassment may feel, even if they have not experienced anything similar. Next, we discuss the definition of harassment and the many forms it takes and by examining different real-world scenarios through the eyes of each person who has played a role, participants will come to understand how power, gender and societal norms influence how we each see and respond to harassment.

Finally, we discuss practical ways in which the participants can avoid, deal with and report instances of sexual harassment or inappropriate sexual conduct both on and off-campus, including in the workplace.

For students heading to a career in film, TV or theatre, we draw on a range of real-life examples of harassment as told to us by professional actors. This enables us to give even more nuanced and practical advice on how to deal with these types of situations and avoid placing other people into situations they might find uncomfortable.

**WORK OUT**

**Masculinity & Male Privilege Workshops**

Work Out began life as a research project conducted by artist Phoebe Davies, Dorothee Boulanger & Dr. Alana Harris from the Department of History at King’s College London, sports medicine specialist Alex Bowmer and founder of Tailor SRE Gareth Esson. The project was focused on exploring masculinity, male privilege and male action with male-identifying athletes within King’s College London’s sports teams, with a view to ending sexual violence. The project merged academic, activist, artistic and sport-specific methodologies and perspectives to explore gender politics in institutional spaces.

As part of our role within this project, we developed a series of workshops on masculinity to be delivered with young men. These highly effective workshops helped participants understand how notions of masculinity may have informed their attitudes, actions, and aspirations throughout their life and how male privilege and their expression of it, may impact negatively on those around them.

As part of the workshops, the participants create a charter which details the steps they will take on campus to challenge rigid views of masculinity, minimize the negative effects of their male privilege and combat gender-based violence.

**Taboo or not Taboo!?**

**Unique Discussion Events**

Taboo or not Taboo!? is a discussion event format that has been designed to help us facilitate conversations around a range of topics that we as a society tend to avoid.

Discussions are based around carefully crafted questions and statements that will draw out thoughts and opinions from those taking part. Space is always given for participants to express their views and although respect is always shown for people’s views, beliefs and questions, our facilitators will challenge negative attitudes and correct myths. Each presentation is full of facts and information to help participants fully explore and understand the topic.

Taboo or not Taboo!? events have predominantly taken place in colleges and universities but we have also used the format with professionals, academics, and parents. We have sessions on Consent, Pleasure, Masculinity, Love and Sex.

We believe that being able to discuss issues around sex and relationships more openly as a society, will go a long way to ensuring that people feel empowered to speak up when they need support or information. As long as these issues remain taboo, many people, especially young people, will find themselves in situations that could have been avoided.

**Get In Touch.**

We'd love to hear from you! Just fill out the form below and we'll get back to you :)

Email: info@tailoreducation.org.uk

Tel: 020 3289 8812

FOLLOW US

QUICK LINKS

About Tailor
 Relationships & Sex Education
 RSE Training
 Contact Us

ALSO VISIT

WEBSITE BY

© 2019 Tailor Education.

---

### EVENTS

- **Legacy URL:** https://tailoreducation.org.uk/events/
- **Slug:** `events`
- **Status:** publish
- **Last modified (GMT):** 2020-02-13 14:26:51
- **Word count:** 199
- **Role (guessed):** Events
- **Proposed new URL:** `(no equivalent — retire?)`
- **Remap status:** **Investigate**

#### Extracted copy

**Taboo or not Taboo!?**

Taboo or not Taboo!? is a discussion event format that has been designed to help us facilitate conversations around a range of topics that we as a society tend to avoid.

Discussions are based around a carefully crafted questions and statements that will draw out thoughts and opinions from those taking part. Space is always given for participants to express their views and although respect is always shown for people’s views, beliefs and questions, our facilitators will challenge negative attitudes and correct myths. Each presentation is full of facts and information to help participants fully explore and understand the topic.

Taboo or not Taboo!? events have predominantly taken place in colleges and universities but we have also used the format with professionals, academics and parents. We have sessions on Consent, Pleasure, Masculinity, Love and Sex.

We believe that being able to discuss issues around sex and relationships more openly as a society, will go a long way to ensuring that people feel empowered to speak up when they need support or information. As long as these issues remain taboo, many people, especially young people, will find themselves in situations that could have been avoided.

---

### Topics

- **Legacy URL:** https://tailoreducation.org.uk/topics/
- **Slug:** `topics`
- **Status:** publish
- **Last modified (GMT):** 2023-12-04 15:24:39
- **Word count:** 193
- **Role (guessed):** Topics hub
- **Proposed new URL:** `/topics/`
- **Remap status:** **Rewrite**

#### Extracted copy

**Explore Our Wide Range of RSE Topics**

**As well as information workshops on things like puberty, contraception and sexually transmitted infections, we also provide educational workshops on a range of other issues facing young people including consent, domestic violence, sexual bullying, porn literacy, online safety, CSE and more.**

**Get In Touch.**

**We'd love to hear from you! Just fill out the form below and we'll get back to you :)**

**Or just send us an email to info@tailoreducation.org.uk**

**Hot Topics**

`[button]` Consent

`[button]` Online Safety

`[button]` LGBTQ+

`[button]` Masculinity & Male Privilege

`[button]` Mental Health

`[button]` Porn Literacy

**QUICK LINKS**

`[button]` About Tailor

`[button]` Relationships & Sex Education

`[button]` RSE Training

`[button]` All Topics

`[button]` Our Blog

`[button]` Contact Us

**FOLLOW US**

WEBSITE BY

@ET-DC@eyJkeW5hbWljIjp0cnVlLCJjb250ZW50IjoiY3VycmVudF9kYXRlIiwic2V0dGluZ3MiOnsiYmVmb3JlIjoiXHUwMGE5ICIsImFmdGVyIjoiIFRhaWxvciBFZHVjYXRpb24uIiwiZGF0ZV9mb3JtYXQiOiJjdXN0b20iLCJjdXN0b21fZGF0ZV9mb3JtYXQiOiJZIn19@

**Topics**

Leran more about the topics we can cover below. You can filter by theme or education setting.

We'd love to hear from you! Just fill out the form below and we'll get back to you :)

Email: info@tailoreducation.org.uk

Tel: 020 3289 8812

FOLLOW US

QUICK LINKS

About Tailor
 Education
 Training
 Contact Us

LINKED SITES

© 2019 Tailor Education.

---

### The Question Collection

- **Legacy URL:** https://tailoreducation.org.uk/anonymous-questions-about-sex-relationships/
- **Slug:** `anonymous-questions-about-sex-relationships`
- **Status:** publish
- **Last modified (GMT):** 2023-08-23 17:33:37
- **Word count:** 83
- **Role (guessed):** Okay to Ask landing
- **Proposed new URL:** `/questions/`
- **Remap status:** **Rewrite**

#### Extracted copy

**The Question Collection.**

**Anonymous Questions about Sex & Relationships**

This is a curated collection of anonymous questions from real young people. This series is a dedicated space where we candidly explore these questions, offering informative and judgment-free answers. Our mission is to empower young people with knowledge, encourage open dialogue, and foster a healthy understanding of their bodies, relationships and sex. If you think any of these answers can be improved, please send me an email with your comments or suggestions.

---

### Glossary

- **Legacy URL:** https://tailoreducation.org.uk/glossary/
- **Slug:** `glossary`
- **Status:** publish
- **Last modified (GMT):** 2023-11-23 14:54:55
- **Word count:** 1
- **Role (guessed):** Glossary hub
- **Proposed new URL:** `/glossary/`
- **Remap status:** **Rewrite**

#### Extracted copy

[glossary]

---

### Blog

- **Legacy URL:** https://tailoreducation.org.uk/blog/
- **Slug:** `blog`
- **Status:** publish
- **Last modified (GMT):** 2024-12-02 18:03:52
- **Word count:** 8
- **Role (guessed):** Blog index
- **Proposed new URL:** `/blog/`
- **Remap status:** **Rewrite**

#### Extracted copy

**News, Articles and Insights from RSE Experts**

---

### CONTACT

- **Legacy URL:** https://tailoreducation.org.uk/contact/
- **Slug:** `contact`
- **Status:** publish
- **Last modified (GMT):** 2021-03-07 11:10:34
- **Word count:** 51
- **Role (guessed):** Contact
- **Proposed new URL:** `/contact`
- **Remap status:** **Rewrite**

#### Extracted copy

**Get In Touch.**

We'd love to hear from you! Just fill out the form below and we'll get back to you :)

Email: info@tailoreducation.org.uk

Tel: 020 3289 8812

FOLLOW US

QUICK LINKS

About Tailor
 Relationships & Sex Education
 RSE Training
 Contact Us

ALSO VISIT

WEBSITE BY

© 2019 Tailor Education.

---

### Privacy Policy

- **Legacy URL:** https://tailoreducation.org.uk/?page_id=3
- **Slug:** `privacy-policy`
- **Status:** draft
- **Last modified (GMT):** 2019-09-25 10:23:41
- **Word count:** 649
- **Role (guessed):** Privacy policy
- **Proposed new URL:** `/privacy`
- **Remap status:** **Rewrite**

#### Extracted copy

**Who we are**

Our website address is: http://tailoreducation.org.uk.

**What personal data we collect and why we collect it**

**Comments**

When visitors leave comments on the site we collect the data shown in the comments form, and also the visitor’s IP address and browser user agent string to help spam detection.

An anonymised string created from your email address (also called a hash) may be provided to the Gravatar service to see if you are using it. The Gravatar service Privacy Policy is available here: https://automattic.com/privacy/. After approval of your comment, your profile picture is visible to the public in the context of your comment.

**Media**

If you upload images to the website, you should avoid uploading images with embedded location data (EXIF GPS) included. Visitors to the website can download and extract any location data from images on the website.

**Contact forms**

**Cookies**

If you leave a comment on our site you may opt in to saving your name, email address and website in cookies. These are for your convenience so that you do not have to fill in your details again when you leave another comment. These cookies will last for one year.

If you visit our login page, we will set a temporary cookie to determine if your browser accepts cookies. This cookie contains no personal data and is discarded when you close your browser.

When you log in, we will also set up several cookies to save your login information and your screen display choices. Login cookies last for two days, and screen options cookies last for a year. If you select "Remember Me", your login will persist for two weeks. If you log out of your account, the login cookies will be removed.

If you edit or publish an article, an additional cookie will be saved in your browser. This cookie includes no personal data and simply indicates the post ID of the article you just edited. It expires after 1 day.

**Embedded content from other websites**

Articles on this site may include embedded content (e.g. videos, images, articles, etc.). Embedded content from other websites behaves in the exact same way as if the visitor has visited the other website.

These websites may collect data about you, use cookies, embed additional third-party tracking, and monitor your interaction with that embedded content, including tracking your interaction with the embedded content if you have an account and are logged in to that website.

**Analytics**

**Who we share your data with**

**How long we retain your data**

If you leave a comment, the comment and its metadata are retained indefinitely. This is so we can recognise and approve any follow-up comments automatically instead of holding them in a moderation queue.

For users that register on our website (if any), we also store the personal information they provide in their user profile. All users can see, edit, or delete their personal information at any time (except they cannot change their username). Website administrators can also see and edit that information.

**What rights you have over your data**

If you have an account on this site, or have left comments, you can request to receive an exported file of the personal data we hold about you, including any data you have provided to us. You can also request that we erase any personal data we hold about you. This does not include any data we are obliged to keep for administrative, legal, or security purposes.

**Where we send your data**

Visitor comments may be checked through an automated spam detection service.

**Your contact information**

**Additional information**

**How we protect your data**

**What data breach procedures we have in place**

**What third parties we receive data from**

**What automated decision making and/or profiling we do with user data**

**Industry regulatory disclosure requirements**

---

### Style

- **Legacy URL:** https://tailoreducation.org.uk/?page_id=11652
- **Slug:** `(no slug)`
- **Status:** draft
- **Last modified (GMT):** 2023-11-26 06:36:16
- **Word count:** 126
- **Role (guessed):** Other
- **Proposed new URL:** `(needs mapping)`
- **Remap status:** **Investigate**

#### Extracted copy

**Understanding Relationships and Sex Education**

**The Importance of RSE**

**Why RSE Matters**

In today's rapidly changing world, Relationships and Sex Education (RSE) plays a crucial role. As John Doe, an expert in RSE, states:

"Effective RSE equips young people with the knowledge they need to make informed, healthy choices."

**Key Components of RSE:**

- Understanding consent

- Navigating personal relationships

- Online safety

##### How RSE Benefits Youth

- Promotes healthier relationships

- Increases awareness about personal safety

- Encourages respectful behavior

###### Tailor Education's Approach

Our RSE programs are designed to be:

- Inclusive: Catering to diverse backgrounds

- Engaging: Using interactive teaching methods

- Comprehensive: Covering a wide range of topics

For more details, visit Tailor Education's RSE Workshop Page.

---

*Audit generated 2026-04-10 19:37 UTC from `docs/legacy-site-copy.pages.json`.*
