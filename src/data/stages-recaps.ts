/**
 * Stages in Relationships: the slides between the stages.
 *
 * Before each stage an intro slide tells the group what they are about
 * to do. After it, a recap slide names what the room just discovered.
 * These are the teaching points of the activity, so they live in one
 * place and every surface (host screen, presenter screen, participants'
 * phones, single-screen board) renders the same words.
 *
 * A slide builds up one click at a time, like a presentation: the title
 * shows first, then each point in turn, then the closing line. On a
 * recap the key messages come first and are set larger; the points
 * under "Also from this round" are the supporting detail.
 *
 * `deck` picks the colour the slide is tinted with, matching the cards
 * the stage used: teal for the stage cards, coral for activities,
 * purple for sharing fluids.
 */

import type { DeckId } from './stages-in-relationships';

export type IntroId = 'intro1' | 'intro2' | 'intro3';
export type RecapId = 'recap1' | 'recap2' | 'recap3';
export type SlideId = IntroId | RecapId;

export interface SlidePoint {
  heading: string;
  body: string;
}

export interface Slide {
  id: SlideId;
  kind: 'intro' | 'recap';
  /** The stage this belongs to, for the stepper and the "back" button. */
  stage: 'stage1' | 'stage2' | 'stage3';
  deck: DeckId;
  eyebrow: string;
  title: string;
  /** The main messages, shown first and set larger. Recaps only. */
  key: SlidePoint[];
  /** Everything else, revealed after the key messages. */
  points: SlidePoint[];
  /** One line, left on screen while the group discusses. */
  closer?: string;
}

/** Kept for the code that only deals with recaps. */
export type Recap = Slide;

// ─── Before each stage ──────────────────────────────────────────────

const INTRO_1: Slide = {
  id: 'intro1',
  kind: 'intro',
  stage: 'stage1',
  deck: 'stages',
  eyebrow: 'Stage 1 · what we’re about to do',
  title: 'Put the stages of a relationship in order',
  key: [],
  points: [
    {
      heading: 'You’ll each get the same set of cards',
      body: 'Each card names a stage a relationship can go through, such as dating, being exclusive or getting married. They arrive on your phone or laptop.',
    },
    {
      heading: 'Put them in the order you think they happen',
      body: 'Start from how a relationship begins. You don’t have to use every card, so leave out any you don’t think belong on a timeline.',
    },
    {
      heading: 'Then we’ll compare',
      body: 'When everyone has sent theirs, we’ll look at all the timelines together and agree one as a group. There’s no right answer.',
    },
  ],
};

const INTRO_2: Slide = {
  id: 'intro2',
  kind: 'intro',
  stage: 'stage2',
  deck: 'activities',
  eyebrow: 'Stage 2 · what we’re about to do',
  title: 'When does each of these happen?',
  key: [],
  points: [
    {
      heading: 'The timeline we agreed becomes the columns',
      body: 'Each stage on the group’s timeline is now a column, and there’s a “Never” column at the end.',
    },
    {
      heading: 'Activity cards come a few at a time',
      body: 'They’re things people do together, like going to the cinema or meeting each other’s friends. For each one, choose the stage where you think it happens, or “Never”.',
    },
    {
      heading: 'Then we see where everyone put them',
      body: 'Once everyone has answered, the facilitator shows where the cards landed and we talk about them.',
    },
  ],
};

// No point saying what the cards are about: the group finds out as they
// arrive, and the recap afterwards makes the point about sex.
const INTRO_3: Slide = {
  id: 'intro3',
  kind: 'intro',
  stage: 'stage3',
  deck: 'fluids',
  eyebrow: 'Stage 3 · what we’re about to do',
  title: 'When would you be happy to do this?',
  key: [],
  points: [
    {
      heading: 'Put each one where you’d be happy to do it',
      body: 'Choose the stage of a relationship you’d want to be at before you’d do this with someone, or “Never”.',
    },
    {
      heading: 'Then we see where everyone put them',
      body: 'As before, the facilitator shows where the cards landed and we talk about them.',
    },
  ],
};

// ─── After each stage ───────────────────────────────────────────────

const RECAP_1: Slide = {
  id: 'recap1',
  kind: 'recap',
  stage: 'stage1',
  deck: 'stages',
  eyebrow: 'Stage 1 · what that showed',
  title: 'Everyone’s timeline is different',
  key: [
    {
      heading: 'People don’t all want the same things from a relationship',
      body: 'The group couldn’t agree on a timeline because people want different things from a relationship. Some people want to get married or have children, and some don’t. Some don’t want to be boyfriend and girlfriend at all, and some are only thinking a few steps ahead. If you assume the other person wants the same things you do, you might be wrong. That’s why it’s something the two of you need to talk about.',
    },
  ],
  points: [
    {
      heading: 'There’s no correct order',
      body: 'You’ve just watched the room disagree about the same cards. Nobody in that disagreement was wrong. People genuinely see the shape of a relationship differently.',
    },
    {
      heading: 'Some cards didn’t belong at all',
      body: 'And you didn’t agree on which ones. Even what counts as a stage is something people see differently.',
    },
    {
      heading: 'So it’s worth knowing the shape you want',
      body: 'Your own timeline is far easier to think about now than in the middle of something. What would you like to happen, and roughly when?',
    },
  ],
  closer: 'You can’t hold a boundary you haven’t worked out, and you can’t hold one you’ve never said.',
};

const RECAP_2: Slide = {
  id: 'recap2',
  kind: 'recap',
  stage: 'stage2',
  deck: 'activities',
  eyebrow: 'Stage 2 · what that showed',
  title: 'What you’ve done doesn’t tell you what you are',
  key: [
    {
      heading: 'You can’t work out where you stand from what you do together',
      body: 'A lot of people decide what stage their relationship is at, or how their partner feels about them, from the things they do together. The group put the same activity at very different stages, so the activity on its own doesn’t tell you much. The only way to know what stage your partner thinks you’re at is to talk to them about it.',
    },
    {
      heading: 'Choosing activities as markers',
      body: 'You can decide that some activities belong to a particular stage and hold them back on purpose until you reach it. That way, moving to a new stage means something, and there are still things to look forward to. It’s worth talking about with your partner, so you both know what the other person is happy to wait for.',
    },
  ],
  points: [
    {
      heading: 'Notice whose pace you’re moving at',
      body: 'Decide what you want to happen and when, say it, and hold it. Going along with someone else’s timeline is easy to do without ever deciding to.',
    },
  ],
  closer: 'Ask. Don’t assume.',
};

function recap3(hideExplicit: boolean): Slide {
  return {
    id: 'recap3',
    kind: 'recap',
    stage: 'stage3',
    deck: 'fluids',
    eyebrow: 'Stage 3 · what that showed',
    title: 'Sharing fluids is a decision too',
    key: [
      hideExplicit
        ? {
            heading: 'Some kinds of sharing carry bigger risks',
            body: 'Sharing a drink or kissing someone means sharing saliva, and the risks are usually small. Closer contact, and anything involving blood, can pass on infections, so the consequences can be much more serious. It’s worth knowing that before you decide what you’re happy to share.',
          }
        : {
            heading: 'Sharing fluids during sex has much bigger consequences',
            body: 'Sharing a drink or kissing someone means sharing saliva, and the risks are usually small. Sex can pass on infections and can lead to pregnancy, so the consequences can be much more serious. That’s why it’s important to use protection, such as a condom, when you have sex.',
          },
    ],
    points: [
      {
        heading: 'Look at what went in “Never”',
        body: 'Chewing gum. A toothbrush. The last of someone’s drink. Things plenty of you wouldn’t do with a partner of ten years.',
      },
      {
        heading: 'Now look at where kissing landed',
        body: 'Open-mouthed kissing shares far more than a stick of gum does, and it went much earlier on the timeline. Most of us never put it through the same test.',
      },
      hideExplicit
        ? {
            heading: 'So make it a decision',
            body: 'What stage would you want to be at before you’d share fluids with someone? That’s a much easier question to answer now than in the moment.',
          }
        : {
            heading: 'So make it a decision',
            body: 'What stage do you want to be at before you have unprotected sex with someone? A condom is the difference between sharing fluids and not, and that’s a much easier question to answer now than in the moment.',
          },
    ],
    closer: 'Decide before, not during.',
  };
}

export function getSlide(id: SlideId, hideExplicit = false): Slide {
  switch (id) {
    case 'intro1': return INTRO_1;
    case 'intro2': return INTRO_2;
    case 'intro3': return INTRO_3;
    case 'recap1': return RECAP_1;
    case 'recap2': return RECAP_2;
    case 'recap3': return recap3(hideExplicit);
  }
}

export function getRecap(id: RecapId, hideExplicit = false): Slide {
  return getSlide(id, hideExplicit);
}

/** How many clicks build the slide: one per point, then the closer. */
export function slideBeats(slide: Slide): number {
  return slide.key.length + slide.points.length + (slide.closer ? 1 : 0);
}

export const INTRO_IDS: IntroId[] = ['intro1', 'intro2', 'intro3'];
export const RECAP_IDS: RecapId[] = ['recap1', 'recap2', 'recap3'];

export function isIntroId(value: unknown): value is IntroId {
  return value === 'intro1' || value === 'intro2' || value === 'intro3';
}

export function isRecapId(value: unknown): value is RecapId {
  return value === 'recap1' || value === 'recap2' || value === 'recap3';
}

export function isSlideId(value: unknown): value is SlideId {
  return isIntroId(value) || isRecapId(value);
}

/** The one-line takeaway from each stage, for the closing screen. */
export const CLOSING_MESSAGES: { deck: DeckId; text: string }[] = [
  { deck: 'stages', text: 'Everyone’s timeline is different. Know the shape you want yours to take, and say it.' },
  { deck: 'activities', text: 'What you’ve done together doesn’t tell you what stage you’re at. The only way to know is to ask.' },
  { deck: 'fluids', text: 'Decide what stage you want to be at before you share fluids. Before, not during.' },
];
