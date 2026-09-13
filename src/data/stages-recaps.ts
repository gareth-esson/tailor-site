/**
 * Stages in Relationships — the section-break screens.
 *
 * After each stage the facilitator shows a screen naming what the room
 * just discovered. These are the teaching points of the activity, so
 * they live in one place and every surface (host screen, participants'
 * phones, single-screen board) renders the same words.
 *
 * Written to be read aloud, or read from the back of a room: a short
 * heading per point, one or two sentences under it, and a single line
 * to leave on screen while the group talks.
 *
 * `deck` picks the colour the slide is tinted with, matching the cards
 * the stage used — teal for the stage cards, coral for activities,
 * purple for sharing fluids.
 */

import type { DeckId } from './stages-in-relationships';

export type RecapId = 'recap1' | 'recap2' | 'recap3';

export interface RecapPoint {
  heading: string;
  body: string;
}

export interface Recap {
  id: RecapId;
  /** The stage this follows, for the stepper and the "back" button. */
  stage: 'stage1' | 'stage2' | 'stage3';
  deck: DeckId;
  eyebrow: string;
  title: string;
  points: RecapPoint[];
  /** One line, left on screen while the group discusses. */
  closer: string;
}

const RECAP_1: Recap = {
  id: 'recap1',
  stage: 'stage1',
  deck: 'stages',
  eyebrow: 'Stage 1 · what that showed',
  title: 'Everyone’s timeline is different',
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
    {
      heading: 'And worth saying out loud',
      body: 'A boundary the other person never hears isn’t doing anything yet. They’re working from their timeline, not yours, and they can’t guess.',
    },
  ],
  closer: 'You can’t hold a boundary you haven’t worked out, and you can’t hold one you’ve never said.',
};

const RECAP_2: Recap = {
  id: 'recap2',
  stage: 'stage2',
  deck: 'activities',
  eyebrow: 'Stage 2 · what that showed',
  title: 'What you’ve done doesn’t tell you what you are',
  points: [
    {
      heading: 'The activity doesn’t set the stage',
      body: '“We’ve met each other’s friends, so we must be serious.” “We talk every night, so this is a relationship.” You’ve just seen the same activity land in completely different places on the board.',
    },
    {
      heading: 'The only way to know is to ask',
      body: 'You can’t work out what someone else thinks you are from the things the two of you have done. It’s a short awkward conversation that saves a long painful one.',
    },
    {
      heading: 'You don’t have to do everything at once',
      body: 'Keeping some things back gives a relationship somewhere to go, and gives you something to look forward to.',
    },
    {
      heading: 'Notice whose pace you’re moving at',
      body: 'Decide what you want to happen and when, say it, and hold it. Going along with someone else’s timeline is easy to do without ever deciding to.',
    },
  ],
  closer: 'Ask. Don’t assume.',
};

function recap3(hideExplicit: boolean): Recap {
  return {
    id: 'recap3',
    stage: 'stage3',
    deck: 'fluids',
    eyebrow: 'Stage 3 · what that showed',
    title: 'Sharing fluids is a decision too',
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

export function getRecap(id: RecapId, hideExplicit = false): Recap {
  if (id === 'recap1') return RECAP_1;
  if (id === 'recap2') return RECAP_2;
  return recap3(hideExplicit);
}

export const RECAP_IDS: RecapId[] = ['recap1', 'recap2', 'recap3'];

export function isRecapId(value: unknown): value is RecapId {
  return value === 'recap1' || value === 'recap2' || value === 'recap3';
}

/** The one-line takeaway from each stage, for the closing screen. */
export const CLOSING_MESSAGES: { deck: DeckId; text: string }[] = [
  { deck: 'stages', text: 'Everyone’s timeline is different. Know the shape you want yours to take, and say it.' },
  { deck: 'activities', text: 'What you’ve done together doesn’t tell you what stage you’re at. The only way to know is to ask.' },
  { deck: 'fluids', text: 'Decide what stage you want to be at before you share fluids. Before, not during.' },
];
