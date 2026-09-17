/**
 * Masculinity and misogyny: what do boys actually think?
 *
 * The figures behind /what-do-boys-actually-think/.
 *
 * Provenance: the classroom activity
 * `tailor-app/content/activities/what-the-research-says-about-boys/activity.md`
 * supplied the question set. Every figure, base and population here has
 * since been checked against the published source document itself (17
 * September 2026). The activity's own wording was not taken on trust,
 * and four things in it did not survive the check. They are listed at
 * the bottom of this comment because the same corrections are owed to
 * the activity file.
 *
 * ── The three constraints this data model exists to enforce ────────────
 *
 * 1. **Exposure is not endorsement, and the pair cannot be split.**
 *    84% of boys had heard of Andrew Tate; 23% had a good view of him.
 *    The first figure without the second is worse than neither. So pairs
 *    live inside one `Round`, the round is the atomic unit of the
 *    rendered document, and `close`, the sentence that states what the
 *    pair means together, belongs to the round rather than to a question.
 *
 *    The activity also requires the two halves to be *asked* in order and
 *    not together ("Let that sit before asking the second one"), because
 *    shown as a table nobody has to commit to a wrong answer first. So
 *    questions are asked sequentially and answers accumulate: once the
 *    second figure is revealed, both stay on screen together for good.
 *
 * 2. **A minority figure must never read as a norm.** 18% believing the
 *    "80/20 rule" is serious and it is not what boys believe. A page that
 *    can be screenshotted into "nearly 1 in 5 teenage boys believe…" has
 *    done harm. Three mechanisms, all structural rather than editorial:
 *    `counter` is bound to the figure in one flex row so the majority
 *    finding cannot be cropped away from the minority one; `breakdown`
 *    draws the **whole** distribution, summing to 100 (±1 for rounding),
 *    so the majority is visibly larger; and `guard` states in words that
 *    the figure is a minority view. A partial breakdown is worse than
 *    none, because it invites the reader to infer the remainder, so every
 *    `breakdown` here carries every response option, "don't know"
 *    included.
 *
 * 3. **Populations and bases differ between questions.** Not only
 *    between surveys: *within* one survey, three of these figures rest on
 *    three different bases (all KS3 pupils, KS3 boys, KS3 boys who had
 *    heard the comments). `source` is required on every question and
 *    renders beside the figure, in the same block, never in a page
 *    footer, so a crop that takes the number takes the base with it.
 *
 * ── What the source check changed ──────────────────────────────────────
 *
 * These four are corrections to the activity, not just to this file:
 *
 * a. **"Note that two thirds did not."** Not in the DfE report, and
 *    misleading: of KS3 boys, 33% agreed, but only 25% *disagreed*: 30%
 *    said neither and 11% didn't know. "Two thirds did not agree" is
 *    arithmetic; "two thirds did not" implies they said no, and two
 *    thirds of them did not say no.
 *
 * b. **The 57% "bothered" figure is boys only** (n=215), not all pupils
 *    who heard the comments. Girls were never asked the question. The
 *    activity's "of those who heard them, 57%" overstates the base.
 *
 * c. **The Tate figures are a 13–15 subgroup of a 6–15 survey**, not a
 *    survey of 13–15 year olds. The activity's "63% had a negative
 *    opinion, and 56% disagreed with his views on women" mixes bases.
 *    On the published all-boys-13–15 base the negative figure is 53%;
 *    63% is that same figure rebased onto only the boys who had heard of
 *    him. The views-on-women question was asked only of boys aware of
 *    him, so its result is stated on that base, in round 2's `close`.
 *    Three figures, three bases, in one sentence, is the exact error
 *    this page exists to correct.
 *
 * d. **The YouGov trait questions and the YouGov attitude questions are
 *    one survey** (n=460, boys 13–17 GB, fieldwork 22 April – 8 May
 *    2025). The activity gave n=460 only against the trait table, which
 *    read as though the other six figures had an unstated base.
 *
 * Also: the trait battery's options are adjectives ("Aggressive",
 * "Dominant"), not nouns, and the prompts now match.
 */

/**
 * A figure's provenance. Renders beside the figure, never in a footer.
 *
 * `survey` and `sample` are separate from `publisher` because "a DfE
 * survey" is not checkable and "DfE, Parent, Pupil and Learner Voice:
 * December 2025, n=418" is. This page will be checked.
 */
export interface Source {
  /** Who published it. */
  publisher: string;
  /** The survey's actual title, as the document gives it. */
  survey: string;
  /** The exact base for THIS figure, not the survey's total sample. */
  population: string;
  /** Base size for this figure, as published. */
  sample: string;
  /** Fieldwork dates, as published. */
  fieldwork?: string;
  /** Link to the source document. The survey title becomes the link. */
  href?: string;
}

/** One segment of a full distribution, drawn so the majority is visible. */
export interface BreakdownSegment {
  label: string;
  value: number;
  /** The segment the question asked about: emphasised, never isolated. */
  highlight?: boolean;
}

export interface Question {
  /** Stable id. Used in the DOM, the step URL hash and the answers list. */
  id: string;
  /** The question, in the reader's words. Ends in a question mark. */
  prompt: string;
  /** The answer as a number 0–100, for the slider comparison. */
  answer: number;
  /** How the figure is written out, e.g. "42 in 100", "23%". */
  answerLabel: string;
  /**
   * The sentence that carries the figure in context. Always leads with
   * the majority where there is one, so the minority is never the first
   * thing read.
   */
  lead: string;
  /**
   * The counterweight, rendered on the same line as the figure.
   *
   * `lead` sits below the figure, which leaves a tight crop of just the
   * big number possible, and a big "18%" on its own is the exact claim
   * this page must not be able to make. `counter` is bound to the
   * figure in one flex row, so the majority finding cannot be cropped
   * away from the minority one. Set it on every question where the
   * figure is a minority share.
   */
  counter?: string;
  /** The whole distribution, where one figure alone would mislead. */
  breakdown?: BreakdownSegment[];
  /**
   * What we take from this answer, and the reason the figure is in the quiz
   * at all.
   *
   * This is the reveal, not the number. A reader who sees "23%" has read
   * a statistic; a reader who sees why the gap between 84% and 23%
   * matters has learned something. Written from the teacher's side and
   * drawn from the original thinking behind the classroom activity.
   *
   * Required on every question. A figure with no takeaway is a figure
   * with no reason to be here.
   */
  takeaway: string;
  /**
   * The first half of a pair, by question id.
   *
   * The quiz player shows one question per screen, which would otherwise
   * split the pairs, and the exposure figure must never be readable
   * without the endorsement figure. Where this is set, the reveal screen
   * restates the paired figure alongside this one, so the two are on
   * screen together at the moment the point lands.
   */
  pairWith?: string;
  source: Source;
}

export interface Round {
  n: number;
  /** The round's own title, from the activity. */
  title: string;
  /** One line on why this round is in the quiz. */
  kicker: string;
  questions: Question[];
  /** What the round's figures mean together. Belongs to the round. */
  close: string;
  /**
   * Explicit statement that a figure is a minority view, not a peer norm.
   * Rendered visibly with the answer. Required wherever a `breakdown`
   * exists and the highlighted segment is the smaller part.
   */
  guard?: string;
  /**
   * Marks a change of population mid-round, where the reader would
   * otherwise carry the previous one forward. Round 5 turns from what
   * boys think to what girls receive, and the switch has to be said.
   */
  populationSwitch?: string;
}

/**
 * The trait table from round 6, shown only after both "aggressive"
 * figures are revealed. The activity is explicit that showing the table
 * first makes the pattern obvious and lets the reader off committing to
 * a wrong answer, so this renders last, as the rest of the picture.
 *
 * Row labels are the survey's own options (adjectives), not paraphrases.
 * Verified against the YouGov tables, 17 September 2026.
 */
export const TRAIT_TABLE = {
  caption: 'Seen as masculine, and seen as good',
  source: {
    publisher: 'YouGov',
    survey: 'Masculinity and boys, April 2025',
    population: 'boys aged 13–17 in Great Britain',
    sample: 'n=460',
    fieldwork: '22 April – 8 May 2025',
    href: 'https://ygo-assets-websites-editorial-emea.yougov.net/documents/Masculinity_Boys_April2025.pdf',
  } satisfies Source,
  rows: [
    { trait: 'Aggressive', masculine: 55, positive: 2 },
    { trait: 'Dominant', masculine: 49, positive: 11 },
    { trait: 'Emotionally reserved', masculine: 41, positive: 13 },
    { trait: 'Caring', masculine: 1, positive: 94 },
  ],
} as const;

/**
 * DfE, Parent, Pupil and Learner Voice: December 2025. England, years 7
 * to 11, panel sampled from the National Pupil Database.
 *
 * Three figures from this survey sit on three different bases, so the
 * base travels per question rather than per source. DfE rounds to whole
 * numbers and reports combined figures that can differ by a point from
 * the sum of their own table cells (42 vs 13+30). The published
 * combined figure is what is quoted.
 */
const DFE = {
  publisher: 'DfE',
  survey: 'Parent, Pupil and Learner Voice: December 2025',
  fieldwork: '2–9 December 2025',
  href: 'https://www.gov.uk/government/publications/parent-pupil-and-learner-voice-omnibus-surveys-for-2025-to-2026/parent-pupil-and-learner-voice-december-2025',
} as const;

const DFE_BOYS: Source = {
  ...DFE,
  population: 'male pupils in key stage 3, England',
  sample: 'n=418',
};

const DFE_ALL: Source = {
  ...DFE,
  population: 'all pupils in key stage 3, England',
  sample: 'n=867',
};

/**
 * YouGov, Masculinity and boys, April 2025. One survey, one base,
 * covering the 80/20 question, feminism, both date questions, both
 * aggression questions and the trait table.
 */
const YOUGOV: Source = {
  publisher: 'YouGov',
  survey: 'Masculinity and boys, April 2025',
  population: 'boys aged 13–17 in Great Britain',
  sample: 'n=460',
  fieldwork: '22 April – 8 May 2025',
  href: 'https://ygo-assets-websites-editorial-emea.yougov.net/documents/Masculinity_Boys_April2025.pdf',
};

/**
 * YouGov Children's Omnibus: Andrew Tate, published 27 September 2023.
 *
 * A survey of children aged 6–15; these are the boys-13–15 figures
 * within it, which is why the published headline ("one in six boys aged
 * 6–15") is a lower number than the 23% here. Getting that wrong in
 * either direction is the whole subject of this page.
 */
const YOUGOV_TATE: Source = {
  publisher: 'YouGov',
  survey: "Children's Omnibus: Andrew Tate, September 2023",
  population: 'boys aged 13–15, within a survey of children aged 6–15',
  sample: 'n=158 of 1,106 surveyed',
  fieldwork: '1–7 September 2023',
  href: 'https://yougov.com/en-gb/articles/47419-one-in-six-boys-aged-6-15-have-a-positive-view-of-andrew-tate',
};

/**
 * Ofcom, Understanding Online Communications Among Children, 2026.
 * Fieldwork by Savanta. The question was asked only of children who use
 * an app or platform (n=2,789 of the 4,097 surveyed), and the option
 * itself was shown only to girls.
 */
const OFCOM: Source = {
  publisher: 'Ofcom',
  survey: 'Understanding Online Communications Among Children, 2026',
  population: 'girls aged 11–13 in the UK who use an app or platform',
  sample: 'n=628 of 2,789 asked',
  fieldwork: '13 February – 19 March 2026',
  href: 'https://www.ofcom.org.uk/siteassets/resources/documents/research-and-data/online-research/understanding-online-comms-among-children/2026/ofcom---understanding-online-communications-among-children.pdf?v=425063',
};

/**
 * DCMS, Loneliness, isolation and social connection among boys and young
 * men in England, published 15 June 2026. Secondary analysis by NatCen
 * of Understanding Society and MHCYP; it runs no survey of its own.
 *
 * Two cautions carried into the copy. The loneliness scale differs by
 * age band: boys aged 10 to 15 were offered three options, young men
 * aged 16 to 25 a different three, so the 2% here is not comparable
 * with the 13% the report gives for 16 to 25, and the report says so
 * itself. And no base is published for this figure, so `sample` says
 * that rather than quoting the wave total as though it were the base.
 */
const DCMS: Source = {
  publisher: 'DCMS',
  survey:
    'Loneliness, isolation and social connection among boys and young men in England, June 2026',
  population: 'boys aged 10 to 15 in England',
  sample: 'no base published for this figure; 1,915 aged 10 to 25 in the wave',
  fieldwork: 'Understanding Society wave 15, collected 2023 to 2025',
  href: 'https://www.gov.uk/government/publications/loneliness-isolation-and-social-connection-among-boys-and-young-men-in-england/loneliness-isolation-and-social-connection-among-boys-and-young-men-in-england',
};

export const ROUNDS: Round[] = [
  {
    n: 1,
    title: 'Is this real?',
    kicker:
      'Are boys encountering this material, or is it a story about a handful of them?',
    questions: [
      {
        id: 'pressure',
        prompt:
          'Out of 100 KS3 boys, how many agree that boys often feel pressure to not cry, to man up, or misbehave?',
        answer: 42,
        answerLabel: '42 in 100',
        lead:
          '42 in every 100 agreed or strongly agreed. Among KS4 boys the figure is 51%.',
        takeaway:
          'Boys recognise the pressure to man up themselves, so it is not only something adults observe about them. 42% is a large minority rather than a majority: most KS3 boys did not agree with the statement. Among KS4 boys the figure is 51%, so it is higher in the older group.',
        source: DFE_BOYS,
      },
      {
        id: 'change-behaviour',
        prompt:
          'And how many say they sometimes act differently to match what friends and other pupils expect from boys, like acting tough or not expressing their feelings?',
        answer: 33,
        answerLabel: '33 in 100',
        lead:
          '33 in every 100 agreed. A quarter disagreed, and the largest single group, 30%, said neither.',
        breakdown: [
          { label: 'Agreed', value: 33, highlight: true },
          { label: 'Neither agreed nor disagreed', value: 30 },
          { label: 'Disagreed', value: 25 },
          { label: "Didn't know", value: 11 },
        ],
        takeaway:
          'Reporting a change in your own behaviour is stronger evidence than agreeing with a statement about boys in general. A third of boys said they change how they act. Only a quarter disagreed, and the largest single group, 30%, said neither, so for many boys the pressure is something they are aware of without it clearly governing what they do.',
        source: DFE_BOYS,
      },
      {
        id: 'heard-at-school',
        prompt:
          'In the last month, how many KS3 pupils in 100 had heard comments about how boys should behave or feel, things like "boys don’t cry", "man up" or "boys will be boys"?',
        answer: 43,
        answerLabel: '43%',
        lead:
          '43% heard them every day, most days or some days. 54% said never. Among the KS3 boys who had heard them, a separate question put only to boys, 57% said the comments bothered them at least some of the time.',
        counter: 'and 54% had not heard them at all',
        breakdown: [
          { label: 'Never heard them', value: 54 },
          { label: 'Heard them at least some days', value: 43, highlight: true },
          { label: 'Preferred not to say', value: 3 },
        ],
        takeaway:
          'Hearing that kind of language and agreeing with it are different things. Most of the boys who heard the comments were bothered by them at least some of the time, so exposure at school is not a measure of approval. 54% of KS3 pupils had not heard the comments at all in the previous month.',
        source: DFE_ALL,
      },
      {
        id: 'lonely',
        prompt:
          'And what percentage of boys aged 10 to 15 say they feel lonely all the time?',
        answer: 2,
        answerLabel: '2%',
        lead:
          '2%. Boys this age were offered three options: hardly ever or never, some of the time, or all the time. Chronic loneliness is rare, though feeling lonely some of the time is common. Boys aged 10 to 15 also reported a median of 5 close friends.',
        // No breakdown. The report publishes "some of the time" for
        // "boys and young men" without attaching an age band, so the
        // remaining categories for the 10 to 15 group cannot be stated
        // without inventing the split. Do not add one from the 16 to 25
        // figures: the scales differ and the report says the two age
        // bands are not directly comparable.
        takeaway:
          'The isolated boy with no friends is a real case but not the typical one. Most boys aged 10 to 15 report several close friends, with a median of 5, and chronic loneliness is rare in the group. The same report gives 13% for young men aged 16 to 25, but the two age bands were offered different answer options, so those figures are not comparable with each other.',
        source: DCMS,
      },
    ],
    populationSwitch:
      'This question comes from a different survey, with a different age band and a different answer scale from the DfE figures.',
    close:
      'A large minority of boys report feeling the pressure, most of those who hear sexist language at school are bothered by it, and very few are chronically lonely.',
  },

  {
    n: 2,
    title: 'Exposure and endorsement',
    kicker: 'Two findings that often get reported as one.',
    questions: [
      {
        id: 'tate-heard',
        prompt:
          'In 2023, what percentage of British boys aged 13 to 15 had heard of Andrew Tate?',
        answer: 84,
        answerLabel: '84%',
        lead: '84%. Only 16% had never heard of him.',
        takeaway:
          'Andrew Tate’s reach among boys this age was close to universal by 2023. The figure measures recognition only and says nothing about what boys thought of him. The survey asked recognition and opinion separately, and the answers differ.',
        source: YOUGOV_TATE,
      },
      {
        id: 'tate-positive',
        prompt: 'So what percentage of them had a good view of him?',
        answer: 23,
        answerLabel: '23%',
        lead:
          '53% had a bad view of him, 40% of them "very bad". 23% had a good view, 9% didn’t know, and 16% had still never heard of him.',
        counter: 'and 53% had a bad view of him',
        breakdown: [
          { label: 'Bad view of him', value: 53 },
          { label: 'Good view of him', value: 23, highlight: true },
          { label: 'Never heard of him', value: 16 },
          { label: "Didn't know", value: 9 },
        ],
        takeaway:
          'Almost every boy had heard of him and most of them did not like him: 53% held a bad view against 23% who held a good one. Recognition and approval are separate measures. 84% describes what boys were exposed to, and 23% describes what they made of it. Either number on its own gives a misleading impression of the other.',
        pairWith: 'tate-heard',
        source: YOUGOV_TATE,
      },
    ],
    close:
      'Of the boys aged 13 to 15 who had heard of him, 67% disagreed with his views on how women should be treated and 13% agreed. That question was put only to boys who knew who he was, so it rests on a smaller base than the recognition and opinion figures, and is not directly comparable with them.',
  },

  {
    n: 3,
    title: 'The uncomfortable one',
    kicker: 'A claim about women’s dating preferences that circulates widely online.',
    questions: [
      {
        id: 'eighty-twenty',
        prompt:
          'What percentage of boys aged 13 to 17 think the large majority of heterosexual women only want to date the most physically attractive 20% of men?',
        answer: 18,
        answerLabel: '18%',
        lead:
          '45% chose the opposite statement, that women do not put such strong emphasis on physical attractiveness and have much broader criteria. 24% didn’t know, 13% said neither, and 18% chose the 20% claim.',
        counter: 'and 45% rejected the claim outright',
        breakdown: [
          { label: 'Women have much broader criteria', value: 45 },
          { label: "Didn't know", value: 24 },
          { label: 'Only the most attractive 20% of men', value: 18, highlight: true },
          { label: 'Neither', value: 13 },
        ],
        takeaway:
          '18% is a substantial minority, and the highest uptake of any of the manosphere propositions this survey tested. It is still a minority. 45% of boys chose the statement that women have much broader criteria, and that was the largest group. The claim has real purchase among boys without being what boys in general think.',
        source: YOUGOV,
      },
    ],
    close:
      'Nearly 1 in 5 is not a fringe. A further 24% said they did not know, which is a larger group than the one that accepted the claim.',
    guard:
      '18% is a minority view. The largest group by some distance, 45%, rejected the claim outright. A figure quoted on its own invites the assumption that the rest agreed, and on this question the rest did not.',
  },

  {
    n: 4,
    title: 'What boys make of the arguments',
    kicker: 'Two specific manosphere claims, and how many boys accept them.',
    questions: [
      {
        id: 'hardwired',
        prompt:
          'What percentage of boys aged 13 to 17 think heterosexual women are biologically hardwired to be attracted to more aggressive, dominant men?',
        answer: 2,
        answerLabel: '2%',
        lead:
          '82% chose the opposite statement, that different women have different tastes in men. 2% chose the hardwired claim.',
        counter: 'and 82% said different women have different tastes',
        breakdown: [
          { label: 'Different women have different tastes in men', value: 82 },
          { label: "Didn't know", value: 11 },
          { label: 'Neither', value: 6 },
          { label: 'Women are hardwired to prefer aggressive men', value: 2, highlight: true },
        ],
        takeaway:
          'Boys reject the hardwired claim almost unanimously: 82% chose the statement that different women have different tastes in men, against 2% who chose the hardwired version. The same survey put the 80/20 claim to the same boys and 18% accepted it, so boys do not take manosphere claims as a package. Uptake varies widely depending on the specific claim.',
        source: YOUGOV,
      },
      {
        id: 'feminism',
        prompt:
          'And what percentage think the purpose of feminism is to put men down?',
        answer: 10,
        answerLabel: '10%',
        lead:
          '66% said its purpose is to bring women up to be equal to men. 10% said it is to put men down.',
        counter: 'and 66% said it exists to bring women up to equality',
        breakdown: [
          { label: 'To bring women up to be equal to men', value: 66 },
          { label: 'Neither', value: 12 },
          { label: "Didn't know", value: 12 },
          { label: 'To put men down', value: 10, highlight: true },
        ],
        takeaway:
          '66% described the purpose of feminism as bringing women up to be equal to men, against 10% who said it is to put men down. The hostile view exists and is held by a small minority, so “boys think feminism is anti-men” does not describe this age group.',
        source: YOUGOV,
      },
    ],
    close:
      'Boys rejected both claims by large margins.',
  },

  {
    n: 5,
    title: 'How boys think girls should be treated',
    kicker: 'Boys’ views on entitlement, beside what girls report experiencing.',
    questions: [
      {
        id: 'paid-for-date',
        prompt:
          'If a man goes on a date with a woman and pays for dinner and drinks, what percentage of boys aged 13 to 17 think it is fair for him to expect sex?',
        answer: 3,
        answerLabel: '3%',
        lead: '77% chose the statement saying it is NOT fair. 3% chose that it is.',
        counter: 'and 77% said explicitly that it is not fair',
        breakdown: [
          { label: 'Not fair for him to expect sex', value: 77 },
          { label: "Didn't know", value: 11 },
          { label: 'Neither', value: 10 },
          { label: 'Fair for him to expect sex', value: 3, highlight: true },
        ],
        takeaway:
          'Explicit endorsement of this is uncommon: 77% said it is not fair and 3% said it is. That is a narrower finding than it sounds, because the question measures agreement with one specific statement rather than sexual entitlement as a whole attitude. The 3% still matters, because the behaviour it describes affects other people.',
        source: YOUGOV,
      },
      {
        id: 'how-she-dresses',
        prompt:
          'And what percentage think women should dress in a way their partner finds attractive, rather than however they choose?',
        answer: 6,
        answerLabel: '6%',
        lead:
          '80% chose that women should dress however they choose, regardless of whether their partner finds it attractive. 6% chose the other statement.',
        counter: 'and 80% said however she chooses',
        breakdown: [
          { label: 'However they choose', value: 80 },
          { label: 'Neither', value: 7 },
          { label: "Didn't know", value: 7 },
          { label: 'How their partner finds attractive', value: 6, highlight: true },
        ],
        takeaway:
          '80% said women should dress however they choose, against 6% who said they should dress in a way their partner finds attractive. Both of the survey’s entitlement questions produced the same pattern: on the propositions that sound most like the manosphere, large majorities of boys take the opposite view.',
        source: YOUGOV,
      },
      {
        id: 'girls-receiving',
        prompt:
          'In the last year, what percentage of girls aged 11 to 13 personally experienced mean or rude messages online because they were girls?',
        answer: 27,
        answerLabel: '27%',
        lead:
          '27%. The figure for girls aged 16 to 17 is also 27%.',
        takeaway:
          'Put beside the low endorsement figures this looks like a contradiction, and it is not one. The two surveys measure different things: one asked boys whether they agree with statements, the other asked girls what happened to them. Low prevalence of explicit misogynistic belief among boys is entirely compatible with a lot of girls experiencing misogyny, and neither figure can be used to check the other.',
        // Deliberately no `counter` and no `breakdown`. Everywhere else
        // on this page the counterweight stops a minority belief reading
        // as a norm. Here the figure is not a belief attributed to boys
        // but harm reported by girls, and "and 73% did not" would be
        // minimising it rather than contextualising it. Do not add one.
        source: OFCOM,
      },
    ],
    populationSwitch:
      'This question asks about girls, not boys, and comes from a different survey with a different base.',
    close:
      'Almost no boys endorse entitlement, and more than a quarter of girls that age were still receiving gendered abuse. The two surveys were run a year apart, on different samples, and both results hold. "Hardly any boys think this" and "there is no problem" are not the same claim.',
  },

  {
    n: 6,
    title: 'Masculine is not the same as good',
    kicker:
      'What boys say a good man is, and what they still recognise as masculine.',
    questions: [
      {
        id: 'caring-important',
        prompt:
          'How important do boys aged 13 to 17 think it is for a man to be caring?',
        answer: 94,
        answerLabel: '94%',
        lead:
          '94% said caring is important for a man. Kindness, honesty and reliability each reached 95%.',
        breakdown: [
          { label: 'Important', value: 94, highlight: true },
          { label: 'Not important', value: 4 },
          { label: "Didn't know", value: 3 },
        ],
        takeaway:
          'These are boys’ own answers about what matters in a man. Caring reached 94%, and kindness, honesty and reliability each reached 95%. The answers come from boys rather than from adults describing boys.',
        source: YOUGOV,
      },
      {
        id: 'aggressive-important',
        prompt: 'And how important do they think it is for a man to be aggressive?',
        answer: 6,
        answerLabel: '6%',
        lead:
          '6% said aggression is important for a man. 89% said it is not important, and 63% said not important at all.',
        counter: 'and 89% said it is not important',
        breakdown: [
          { label: 'Not important', value: 89 },
          { label: 'Important', value: 6, highlight: true },
          { label: "Didn't know", value: 5 },
        ],
        takeaway:
          '89% said aggression is not important for a man, and 63% said not important at all. With the 94% for caring, the two answers describe a model of manhood built on care and reliability rather than on dominance.',
        source: YOUGOV,
      },
      {
        id: 'aggression-masculine',
        prompt:
          'Separately, what percentage of boys aged 13 to 17 see being aggressive as a masculine trait?',
        answer: 55,
        answerLabel: '55%',
        lead:
          '55%. 41% said it was neither masculine nor feminine, and almost nobody called it feminine.',
        breakdown: [
          { label: 'A masculine trait', value: 55, highlight: true },
          { label: 'Neither masculine nor feminine', value: 41 },
          { label: "Didn't know", value: 4 },
          { label: 'A feminine trait', value: 0 },
        ],
        takeaway:
          'More than half of boys read aggression as a masculine trait. On its own the figure looks like evidence that boys admire aggression. The survey asked separately whether boys think aggression is good, and the two answers are not the same.',
        source: YOUGOV,
      },
      {
        id: 'aggression-positive',
        prompt: 'And what percentage see being aggressive as a positive trait?',
        answer: 2,
        answerLabel: '2%',
        lead:
          '2%. 85% called aggression a negative trait outright.',
        counter: 'and 85% called it a negative trait',
        breakdown: [
          { label: 'A negative trait', value: 85 },
          { label: 'Neither positive nor negative', value: 11 },
          { label: 'A positive trait', value: 2, highlight: true },
          { label: "Didn't know", value: 2 },
        ],
        takeaway:
          '55% call aggression masculine and 2% call it good. Boys strongly associate the trait with masculinity while judging it negatively, and on aggression those two answers are 53 points apart. Why they answered the first question that way is not something the survey establishes: it could be a stereotype they have noticed, their own idea of manhood, or what they see men doing.\n\nThe same split runs through the other traits. Dominance: 49% masculine against 11% positive. Emotionally reserved: 41% against 13%. Caring reverses it, with 1% calling it masculine and 94% calling it good.',
        pairWith: 'aggression-masculine',
        source: YOUGOV,
      },
    ],
    close:
      'Boys hold two views at once: what people associate with being a man, and what they think a man should be. A survey that asks only one of those questions gives a misleading picture, in whichever direction it asked.',
  },
];

/** Every question, flattened, in the order they are asked. */
export const QUESTIONS: Question[] = ROUNDS.flatMap((r) => r.questions);

/** Which round a question belongs to, and where it sits inside it. */
export function roundOf(questionId: string): Round | undefined {
  return ROUNDS.find((r) => r.questions.some((q) => q.id === questionId));
}
