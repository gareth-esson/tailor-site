# Tailor — A5 flyer copy

Audience: PSHE leads / SLT and classroom teachers.
Primary CTA: book a conversation about RSE.
Format: double-sided A5 (148 × 210 mm portrait).

A double-sided sheet is the right call here. Tailor sells two related but
distinct things — delivery and training/planning — and there's solid proof
to lean on (partners, statutory alignment, CIC status). Trying to cram it
onto one face buries the proof; spreading it gives the back room to do the
work the front can't.

The copy below is written for that PSHE-lead-at-a-conference reader:
specific, practitioner-voiced, no aspirational marketing-speak. It echoes
the site's existing voice deliberately so the flyer and the site reinforce
each other.

---

## Headline options (pick one)

The hero line has the hardest job — it has to tell a reader who you are
*and* why they should care, in roughly seven words. Three honest options,
ranked:

1. **"RSE, planned and taught by a practising specialist."**
   Recommended. Specific, credible, contains the differentiator (it's
   taught by someone who actually teaches it). Reads in one beat.

2. **"Specialist RSE — in your classroom, or training yours."**
   Service-direct. Tells a PSHE lead exactly what they can buy. Slightly
   busier than option 1.

3. **"RSE that helps young people enjoy healthier relationships."**
   This is the site's homepage H1. Warmer, mission-led. Trades the
   service clarity of options 1 and 2 for a stronger emotional frame.
   Best if the rest of the flyer is doing heavy lifting on the services.

Avoid abstract framings ("rethinking RSE", "RSE done right") — they sound
like every other education vendor and the rest of Tailor's voice earns
the right to be more concrete than that.

---

## FRONT (A5, portrait)

### Top band — identity

> **TAILOR EDUCATION**
> *(logo, top left or centred — keep small, ~24mm wide)*

### Hero block

**RSE, planned and taught by a practising specialist.**

In-school delivery, CPD for your team, and curriculum planning across
primary, secondary, SEND and alternative provision.

### Three-up "what we do"

Three short blocks, each with a one-word label and one sentence. Icons
optional — if used, simple line icons in brand teal.

**Teach**
We come into your school and teach the lessons.

**Train**
We train your team to teach them with confidence.

**Plan**
We build the year of RSE your school actually needs.

### Partner strip (bottom of front)

A monochrome logo row — same treatment as `/`'s `home-trustlogos` block.
Small "Working with" eyebrow above it.

> **Working with**
>
> British Red Cross · Somerset House · King's College London ·
> British Museum · RADA · Tate Modern

*(Note: the British Red Cross emblem must render in its authorised red
under the Geneva Conventions Act 1957. Don't monochrome it. The rest can
sit at ~65% opacity in greyscale to match the site treatment.)*

### Footer CTA (front)

A short prompt, web address, and QR code. The QR is the most useful thing
on the flyer — most people scan rather than retype.

> **Talk to us about RSE at your school.**
> tailoreducation.org.uk/contact
>
> *(QR code → https://tailoreducation.org.uk/contact)*

---

## BACK (A5, portrait)

### Top — the "why us" pitch

This is the bit a PSHE lead actually reads. It earns the back of the
flyer; if it doesn't land, nothing else on the back matters.

> **RSE is hard to teach well if you haven't been trained in it.
> Most teaching teams haven't.**
>
> That gap shows up the moment a Year 9 puts their hand up with
> something you didn't prep for, or when the parent email arrives the
> day after a contentious topic.
>
> We teach RSE weekly — across primary, secondary, SEND and alternative
> provision. Every lesson is planned for the class in front of us, then
> debriefed in writing for your staff to use the next week.

### Services (four short rows)

Four rows, each with a bold label and a single sentence. No bullets —
clean horizontal rules between them, or stacked cards. Keep the
descriptors specific.

**In-school delivery**
Single lessons, schemes of work and drop-down days, KS1 to KS5.

**Teacher CPD**
Subject knowledge, the harder conversations, and the read of the
statutory guidance that lets you plan a year without panic-checking it.

**Curriculum & policy planning**
Year-long RSE programmes mapped to DfE Statutory Guidance and the
PSHE Association Programme of Study; policy review and parent
consultation support.

**SEND & alternative provision**
Accessible, disclosure-aware RSE built for special schools and AP —
designed with the staff who teach it.

### Testimonial

Drop in a real quote from `/testimonials` — the Sara Stafford one
featured on the homepage is a good fit if it's permissioned for print.
Don't ship the flyer with a placeholder.

> "[Real quote, 1–2 sentences.]"
> — Name, Role, Organisation

### Trust strip (small print, near the bottom)

Single block, smaller body type. Three honest credibility claims, packed
tight.

> Aligned with DfE Statutory RSE Guidance, the PSHE Association
> Programme of Study, UNESCO International Technical Guidance, and WHO
> Standards for Sexuality Education.
>
> Tailor is a community-interest company. Any surplus we generate is
> committed, by statute, to the work.
>
> Founded by Gareth Esson, a practising RSE specialist with an
> Enhanced DBS.

### Book mention (one-line footnote)

Don't compete with the primary CTA. Keep this small.

> Also from Tailor: **Okay to Ask** — the questions pupils want
> answered, in book form. Available to schools at quantity:
> tailoreducation.org.uk/book

### Main CTA (bottom of back, bigger than the front CTA)

The final action. Give a phone number if you want one on it; if not,
email + URL + QR is enough.

> **Tell us where you're starting from.
> We'll work out what Tailor can do.**
>
> hello@tailoreducation.org.uk · tailoreducation.org.uk/contact
>
> *(QR code → https://tailoreducation.org.uk/contact)*

---

## Production notes for whoever sets this in InDesign / Affinity

- **Trim size**: 148 × 210 mm (A5 portrait).
- **Bleed**: 3 mm on all four sides (so artboard is 154 × 216 mm).
- **Safe area**: keep all type 5 mm inside the trim — partner logos and
  small print get clipped at trim otherwise.
- **Colour**: convert the site teal to CMYK before printing. The web
  token `--brand-accent` will shift on press; ask the printer for a
  Pantone match if you want the brand teal to read true across a run.
- **Fonts**: Lexend (headings + body) for the Tailor layer. Embed the
  full subset including the weights the site uses (regular, medium,
  semibold, bold). Don't substitute.
- **QR codes**: generate at ≥ 20 mm square, with quiet zones intact;
  point at the canonical `/contact` URL (not a tracking redirect that
  could break).
- **Photo**: if you want a photo on the front, the secondary RSE group
  activity image used in the homepage hero
  (`/images/services/tailor-education-secondary-rse-group-activity.webp`)
  is the strongest single image available and is permissioned for use.

---

## What I'd skip

A few things that are tempting on a flyer but I'd cut for this audience:

- **A pricing line.** PSHE leads expect to enquire for cost — putting
  a number on the flyer either dates fast or sets the wrong anchor.
- **A long mission paragraph.** The CIC line in the trust strip does
  the work; an extra "our mission is to…" paragraph is filler.
- **More than one QR code per face.** Two QR codes confuses scans and
  dilutes the primary CTA. The book gets a URL, not a QR.
- **A "scan to see our blog" callout.** Blog traffic isn't worth
  shelf-space on a one-shot print piece — the contact form is.
