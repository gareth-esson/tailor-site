# Okay to Ask — Reel Script Brief

The working prompt for drafting Reel Scripts for Okay to Ask, a
young-person-facing RSE brand. Each script is the spoken voiceover for a short
vertical video. A post-it note on screen shows the question; the script is what
the voice reads aloud.

This brief supersedes the original. It folds in what we learned drafting and
revising the first scripts: answer fully, write for the ear, talk to a young
person, and give a fair answer rather than a one-sided one.

---

## Data access (read only)

Source database: **Okay to Ask — Questions**
Data source ID: `cd6d5a28-64a7-4809-84e1-483e4a4ac259`

Read via the Notion MCP. For each question you need:

- **Question** — title property
- **Full Answer** — the PAGE BODY content (not a property). Fetch the page and
  read its `<content>` block.
- **Simple Answer** — text property
- **Category** — select
- **Signposting** — multi-select (may be empty)
- **Age Tier** — select
- **Status** — only use pages where Status = **Published**

**Pagination:** the Notion MCP search caps at ~25 results with no pagination, so
don't rely on search to enumerate the database. To list/query the whole set
reliably, use the REST query endpoint with `start_cursor` pagination until
`has_more = false`:

```
POST https://api.notion.com/v1/databases/cd6d5a28-64a7-4809-84e1-483e4a4ac259/query
```

Do not write anything back to Notion. Output to a local markdown file.

> **Note on categories:** no Published question currently uses the
> `Identity & Diversity` *Category*. In this workspace, identity content lives
> in the **Topic** taxonomy while a question's Category is its clinical or
> relational bucket. If you need an identity question, pick one by theme (e.g.
> a trans/gay/lesbian question filed under Sexual Health or Sex), not by the
> Category field.

---

## Source material

For each question, read both the **Full Answer** (page body) and the **Simple
Answer** property. Use them as raw material. Don't compress the Full Answer by
deleting paragraphs. Write a fresh spoken argument from the same material.

---

## The rule that matters most — one argument with a spine

The script must build as a single argument with a spine, where each beat hands
to the next. Not a row of true statements sitting side by side. Find the one
idea the answer is really about, and make everything follow from it. If it
reads like highlights rather than one continuous thought, rewrite it.

---

## Answer it fully and well — length is led by the argument

There is no word target. Let the argument decide the length.

- A decisive answer can be short. A genuine dilemma earns room to breathe.
- Never trim a beat to hit a number. Never pad to reach one.
- If a point needs developing to land honestly (what genuine change looks
  like; what both people have to do), develop it. Don't cut it for brevity.

Brevity is not a virtue here. Answering the question really well is.

---

## Write a fair answer, not a one-sided one

Don't quietly pre-load the verdict. If the question is a real two-sided
dilemma, give each side genuine weight before you land.

- Name the legitimate case for each path. ("Wanting him back doesn't make you
  weak, and giving someone a real second chance isn't a failing." Then: what
  taking him back can also signal.)
- Show what each path actually requires, concretely, so the asker can weigh it.
- Hand the decision back. End on the asker's own judgment, in both directions,
  rather than nudging them toward a conclusion you've decided for them.

**Exception — safety overrides balance.** Where the question involves abuse,
coercion, control, or danger, be clear and protective. Don't "both-sides"
someone's safety. (See Calibration Example A.)

This extends the old rule "don't convict a third party until the answer has
earned the judgement." Hold judgement until it's earned — and once a fair,
two-sided picture is on the table, give the choice back to the asker.

---

## Voice and structure

1. The post-it shows the question, so the question is the hook. Open with
   warmth, not a punchline. **Match the register of the question.** Where it's
   loaded or worried, normalise before you assess — but where it's neutral or
   informational, stay neutral. Don't project worry, pressure, fear, or danger
   onto an asker who hasn't signalled any. "How are you tested for STIs?" and
   "how long before sex?" are plain questions and get plain, balanced answers,
   not reassurance against a fear nobody expressed. And don't assume the asker
   is in the situation they're asking about: "what are the signs of an abusive
   relationship?" is a request for information, not a disclosure that they're in
   one — give the information, and offer the help route conditionally ("if any
   of this rings a bell, for you or a mate…").
2. Don't presume the asker already knows the answer.
3. Stay concrete. State a principle only if no example is already carrying it.
4. Don't tell the asker what they're "really" asking ("the real question here
   is…", "what you're really asking is…"). Natural spoken signposting through a
   genuine weighing is fine and helps it sound spoken ("here's the hard part…
   but here's the other side").
5. Don't imply a relationship is early-stage when the question describes an
   established pattern.
6. Keep signposting verbatim where the answer includes it, with phone numbers
   exact (e.g. "call Childline on 0800 1111").
7. No spoken call to action. No "visit our site", no "buy the book". The end
   card handles that.
8. No motivational sign-off. End on the strongest substantive line of the
   answer.

---

## Make it read like speech, not prose

The test: **read it aloud.** Does it sound like a person talking, or thinking
out loud? If it sounds like an essay, rewrite it.

- Short bursts. One idea per sentence. Fragments are fine.
- **No semicolons** — they read written. Use full stops, fragments, and
  em-dashes instead.
- **Em-dashes are good for spoken rhythm.** Use them where a real beat lands,
  not as decoration.
- Turn balanced "the difference between X and Y" clauses into a question asked
  out loud. ("Is he sorry he did it, or just sorry he got caught?")
- Cut the prose tells:
  - abstract noun-phrases — "a neutral act", "the measure you hold this against"
  - writerly asides — "it's worth saying"
  - flat written buttons — "that matters"
- **Don't pile up British idioms** ("rings a bell" + "mate's" in the same
  breath, "down the pub", "having a chinwag"). One folksy phrase in a
  sentence reads as voice; two reads as AI doing an impression of a Brit.
  When unsure, pick the plainer phrasing: "sounds familiar" over "rings a
  bell", "someone you know" over "a mate's".
- Use contractions throughout (do not → don't, that is → that's).
- CAPS sparingly, to mark a single word that needs spoken stress.
- British spelling throughout.

---

## Talk to a young person

The register is how you'd actually say it to a teenager. Plain and direct. Not
adult or writerly idiom — and not forced slang, which reads worse than the
problem it's solving.

- "isn't nothing" over "isn't a neutral act"
- "everything comes back to them" over "the measure you hold this against"
- Don't hedge when you don't need to: "someone who loves you", not "someone
  who says they love you".
- **Imagery must fit a young person's life.** Avoid images that assume adults
  who live together or a grown-up world. "Lying awake wondering where he is"
  presumes a partner out at night and a shared home. Use a teen's actual world
  (group chats, last-seen, who he's texting) or stay on the felt experience
  ("you never feel sure of him again").

---

## Do not

- No "it's not X, it's Y" as a rhythm crutch. The spoken alternatives are a
  short "Not Y." fragment, or a real either/or asked as a question.
- No filler intensifiers (really, very, truly, simply).
- No bold-label lists.
- No semicolons.
- No spoken call to action. No motivational sign-off.

---

## Calibration examples

### Example A — decisive / safety (use when the situation is clear, or someone's safety is involved)

**Question:** "Should you give your boyfriend more than 9 chances?"

> In any relationship, you're both going to get things wrong sometimes. What
> matters is how a person acts AFTER they make a mistake. When they say sorry,
> does anything actually change? If they keep saying sorry and then doing the
> same thing, that's not a mistake; that's just who they are.
> And if it's gone past letting you down, if he's scaring you or controlling
> you, that isn't a "chances" question at all. That's something you deserve
> help with. Talk to someone you trust, or call Childline on 0800 1111.
> You deserve someone who doesn't need nine chances to treat you well.

Why it works: normalises before it assesses; protects the boyfriend until the
pattern earns the judgement; turns clear danger into a protective steer rather
than a "both sides" weighing; keeps signposting verbatim; ends on the strongest
line with no sign-off. (Written today, the one semicolon would be a full stop
or em-dash.)

### Example B — genuine dilemma / fuller, balanced (use when the question is a real two-sided choice)

**Question:** "Is it alright for your boyfriend to cheat on you and then want
you back?"

> Cheating isn't alright. He made a choice, and it was the wrong one. But
> wanting him back doesn't make you weak, and giving someone a real second
> chance isn't a failing. So let's take it seriously — both sides of it.
>
> Start with you, not him. What do you actually want a relationship to feel
> like? What are the things you've decided you won't put up with, even from
> someone who loves you? Get those clear first, because everything else comes
> back to them.
>
> Here's the hard part. Taking him back isn't nothing. It can quietly tell him
> he can do this and still keep you — that crossing your line cost him nothing.
> So if you do take him back, let it be because you believe things can be
> different. Not because you're scared of losing him.
>
> But here's the other half of it. People do come back from cheating. Some
> couples are stronger afterwards, because they finally got honest about what
> wasn't working. That only happens when the repair is real, though. It means
> him owning it without getting defensive. Being patient while you struggle to
> trust him again. Proving himself in what he does, week after week — not one
> good apology and straight back to normal. And it means you being able to
> actually forgive him one day, instead of holding it over him forever. If
> staying just becomes you policing his phone and bracing for the next time,
> that's not a relationship either of you will be happy in.
>
> So don't get stuck on whether you should give him a chance. Look at whether
> you honestly believe he'll do the work — and whether you'd be able to trust
> him again if he did. If you can say yes to both, staying is a fair choice. If
> taking him back means you never feel sure of him again, you already know it
> isn't.
>
> Either way, this is your call to make. Not his.

Why it works: states the judgement the question has earned (cheating is wrong),
then gives both paths real weight; runs as long as the argument needs; reads
like speech (short bursts, the "got caught vs did it" turned into a spoken
question, em-dashes for rhythm, no semicolons); imagery fits a young person;
hands the decision back in both directions.

---

## Test run modes

When sampling, span these modes:

- two reflective/advice questions
- one factual/clinical (Anatomy, Sexual Health, or Contraception & Pregnancy)
- one identity question (pick by theme — see the category note above)
- one safeguarding-heavy question (Signposting populated; subject is abuse,
  coercion, or safety)
- one wildcard that looks genuinely hard to compress

For each, output the question, the drafted Reel Script, and an approximate word
count. Write the output to a local markdown file. Don't write to Notion.

---

## Before you ship — quick self-check

- Read it aloud. Does it sound spoken or thought, or does it sound written?
- Any semicolons? Remove them.
- Any abstract noun-phrases, writerly asides, or flat buttons? Replace them.
- Both sides given fair weight — unless it's a safety matter, where you're
  clear and protective?
- Does the imagery fit a young person's actual life?
- Strongest substantive line last. No CTA, no motivational sign-off.
- Signposting verbatim, phone numbers exact.
