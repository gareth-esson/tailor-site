/**
 * Stages in Relationships — card decks.
 *
 * Source: "Stages in Relationships.doc" (the physical card set used in
 * workshops). Three decks:
 *
 *   1. `stages`     — the relationship stages the group orders into a
 *                     timeline (Stage 1 of the activity).
 *   2. `activities` — things people do together; placed onto the
 *                     timeline (Stage 2).
 *   3. `fluids`     — sharing-fluids cards; placed onto the same
 *                     timeline plus a "Never" column (Stage 3).
 *
 * Every card has a stable `id` (used in session state and URLs — never
 * renumber or reuse), a `label` as shown on the card, and optional
 * flags:
 *
 *   - `explicit`  — hidden when the facilitator switches on
 *                   "hide explicit cards" (younger / SEND groups).
 *   - `added`     — not in the original doc; added when the resource
 *                   was digitised. Flagged so the deck owner can review.
 *   - `original`  — the doc's wording where the label was changed
 *                   (typo fixed, or modernised). Kept for the audit.
 *
 * Doc clean-up decisions (September 2026):
 *   - "Meet family" and "Meet the family" were both in the doc — kept
 *     one ("Meet their family"). "Meet family abroad" stays as its own.
 *   - "Kiss open mouthed" was in both the activities tail and the fluids
 *     deck — kept in fluids only; "Kiss" and "Kiss on cheek" remain in
 *     activities.
 *   - Typos fixed: "Infactuation", "Ex-boyfrined", "Suck the skin on of
 *     nose".
 *   - "Watch a DVD together" → "Watch a film together"; "Play computer
 *     games" → "Play video games together"; "Have their photo as
 *     wallpaper" → "Have their photo as your lock screen".
 */

export type DeckId = 'stages' | 'activities' | 'fluids';

export interface Card {
  id: string;
  label: string;
  explicit?: boolean;
  added?: boolean;
  original?: string;
}

/** Stage 1: relationship stages. Order here is arbitrary — decks are
 *  shuffled when dealt. */
export const STAGE_CARDS: Card[] = [
  { id: 's-fancy',       label: 'Someone you fancy' },
  { id: 's-like',        label: 'Someone you like' },
  { id: 's-link',        label: 'Link' },
  { id: 's-friend',      label: 'Friend' },
  { id: 's-life-partner', label: 'Life partner' },
  { id: 's-fiance',      label: 'Fiancé / fiancée' },
  { id: 's-gf-bf',       label: 'Girlfriend or boyfriend' },
  { id: 's-partner',     label: 'Partner' },
  { id: 's-husband-wife', label: 'Husband or wife' },
  { id: 's-more-than-friends', label: 'More than friends' },
  { id: 's-wifey-hubby', label: 'Wifey or hubby' },
  { id: 's-admire',      label: 'Someone you admire' },
  { id: 's-ex-spouse',   label: 'Ex-husband or ex-wife' },
  { id: 's-ex-gf-bf',    label: 'Ex-girlfriend or ex-boyfriend', original: 'Ex-girlfriend or ex-boyfrined' },
  { id: 's-infatuation', label: 'Infatuation', original: 'Infactuation' },
  { id: 's-stranger',    label: 'Stranger', added: true },
  { id: 's-talking',     label: 'Talking to each other', added: true },
  { id: 's-situationship', label: 'Situationship', added: true },
];

/** Stage 2: things people do together. */
export const ACTIVITY_CARDS: Card[] = [
  { id: 'a-read',            label: 'Read to each other' },
  { id: 'a-meals',           label: 'Go out for meals' },
  { id: 'a-child',           label: 'Have a child together' },
  { id: 'a-arm-shoulder',    label: 'Walk with an arm around their shoulder' },
  { id: 'a-buy-place',       label: 'Buy a place together' },
  { id: 'a-team-sports',     label: 'Play team sports' },
  { id: 'a-money',           label: 'Give money when needed' },
  { id: 'a-clubbing',        label: 'Go clubbing' },
  { id: 'a-swap-rings',      label: 'Swap rings' },
  { id: 'a-holiday',         label: 'Go on holiday together' },
  { id: 'a-cinema',          label: 'Go to the cinema' },
  { id: 'a-hug',             label: 'Hug' },
  { id: 'a-play-penis',      label: 'Play with penis', explicit: true },
  { id: 'a-play-vagina',     label: 'Play with vagina', explicit: true },
  { id: 'a-nibble-ears',     label: 'Nibble ears' },
  { id: 'a-feel-bum',        label: 'Feel bum', explicit: true },
  { id: 'a-play-breasts',    label: 'Play with breasts', explicit: true },
  { id: 'a-massage',         label: 'Give a massage' },
  { id: 'a-family-events',   label: 'Go to family events together' },
  { id: 'a-truth',           label: 'Tell the truth' },
  { id: 'a-meet-family',     label: 'Meet their family', original: 'Meet family / Meet the family' },
  { id: 'a-video-games',     label: 'Play video games together', original: 'Play computer games' },
  { id: 'a-say-care',        label: 'Say you care' },
  { id: 'a-sick',            label: 'Look after them when sick' },
  { id: 'a-sleep-theirs',    label: 'Sleep over at their house' },
  { id: 'a-talk',            label: 'Talk' },
  { id: 'a-phone-night',     label: 'Talk on the phone through the night' },
  { id: 'a-kiss',            label: 'Kiss' },
  { id: 'a-family-abroad',   label: 'Meet family abroad' },
  { id: 'a-shopping',        label: 'Go shopping together' },
  { id: 'a-drinks',          label: 'Go for drinks' },
  { id: 'a-dinner',          label: 'Make dinner' },
  { id: 'a-live-together',   label: 'Live together' },
  { id: 'a-picnic',          label: 'Go for a picnic' },
  { id: 'a-cuddle',          label: 'Cuddle' },
  { id: 'a-fair',            label: 'Go to the fair' },
  { id: 'a-say-love',        label: 'Say "I love you"' },
  { id: 'a-say-like',        label: 'Say "I like you"' },
  { id: 'a-cheer-up',        label: 'Be there to cheer them up when sad' },
  { id: 'a-slow-dance',      label: 'Slow, close dance' },
  { id: 'a-walks',           label: 'Go for walks' },
  { id: 'a-gifts',           label: 'Buy gifts' },
  { id: 'a-hang-out',        label: 'Hang out' },
  { id: 'a-sex',             label: 'Have sex', explicit: true },
  { id: 'a-homework',        label: 'Do coursework or homework together' },
  { id: 'a-sleep-yours',     label: 'Sleep over at your house' },
  { id: 'a-board-games',     label: 'Play board games together' },
  { id: 'a-film',            label: 'Watch a film together', original: 'Watch a DVD together' },
  { id: 'a-meet-friends',    label: "Meet each other's friends" },
  { id: 'a-bus-rides',       label: 'Go for long bus rides together' },
  { id: 'a-arms-linked',     label: 'Walk with arms linked' },
  { id: 'a-holding-hands',   label: 'Walk together holding hands' },
  { id: 'a-secrets',         label: 'Tell your secrets' },
  { id: 'a-their-children',  label: 'Meet their children' },
  { id: 'a-lock-screen',     label: 'Have their photo as your lock screen', original: 'Have their photo as wallpaper' },
  { id: 'a-text',            label: 'Text each other' },
  { id: 'a-clinic',          label: 'Go to the clinic together' },
  { id: 'a-kiss-cheek',      label: 'Kiss on the cheek' },
  { id: 'a-talk-online',     label: 'Talk online' },
  // ── Added when digitised (September 2026) — review before use ──
  { id: 'a-follow-social',   label: 'Follow each other on social media', added: true },
  { id: 'a-share-location',  label: 'Share your location with them', added: true },
  { id: 'a-post-photo',      label: 'Post a photo of you together', added: true },
  { id: 'a-relationship-status', label: 'Make it "official" online', added: true },
  { id: 'a-passcode',        label: "Know each other's phone passcode", added: true },
  { id: 'a-video-call',      label: 'Video call each other', added: true },
  { id: 'a-good-morning',    label: 'Send a good morning text', added: true },
  { id: 'a-future',          label: 'Talk about the future', added: true },
  { id: 'a-argue-make-up',   label: 'Argue and make up', added: true },
  { id: 'a-share-bed',       label: 'Share a bed (no sex)', added: true },
  { id: 'a-borrow-clothes',  label: 'Borrow their clothes', added: true },
  { id: 'a-sit-lunch',       label: 'Sit together at lunch', added: true },
  { id: 'a-nicknames',       label: 'Give each other nicknames', added: true },
  { id: 'a-introduce-partner', label: 'Introduce them as your partner', added: true },
  { id: 'a-split-bill',      label: 'Split the bill', added: true },
  { id: 'a-pet',             label: 'Get a pet together', added: true },
  { id: 'a-party',           label: 'Go to a party together', added: true },
  { id: 'a-family-group-chat', label: "Be in each other's family group chat", added: true },
  { id: 'a-send-nude',       label: 'Send a nude', added: true, explicit: true },
  { id: 'a-joint-account',   label: 'Have a joint bank account', added: true },
];

/** Stage 3: sharing fluids. */
export const FLUID_CARDS: Card[] = [
  { id: 'f-tissue-sneezed',  label: "Use a tissue they've sneezed in" },
  { id: 'f-suck-snot',       label: 'Suck snot out of their nose' },
  { id: 'f-lick-face',       label: 'Lick their face' },
  { id: 'f-suck-fingers',    label: 'Suck their fingers' },
  { id: 'f-spots-fingers',   label: 'Burst their spots with bare fingers' },
  { id: 'f-suck-toes',       label: 'Suck their toes' },
  { id: 'f-tissue-blown',    label: "Use a tissue they've blown their nose in" },
  { id: 'f-spots-teeth',     label: 'Burst their spots with your teeth' },
  { id: 'f-bath-water',      label: 'Share bath water' },
  { id: 'f-sucked-sweet',    label: 'Eat a sucked sweet from their mouth' },
  { id: 'f-lick-sweat',      label: 'Lick their body sweat' },
  { id: 'f-lick-ear',        label: 'Lick inside their ear' },
  { id: 'f-touch-tongues',   label: 'Touch tongues' },
  { id: 'f-food-fingers',    label: 'Suck food off their fingers' },
  { id: 'f-kiss-open',       label: 'Kiss open-mouthed' },
  { id: 'f-share-pants',     label: 'Share pants and knickers' },
  { id: 'f-scrub-mitt',      label: 'Share a skin scrub mitt' },
  { id: 'f-finger-mouths',   label: 'Put a finger in their mouth, then in yours' },
  { id: 'f-drink-mouth',     label: 'Take a drink from their mouth' },
  { id: 'f-bath-towel',      label: 'Share a bath towel' },
  { id: 'f-flannel',         label: 'Use the same flannel' },
  { id: 'f-kiss-tongues',    label: 'Kiss with tongues' },
  { id: 'f-unprotected-sex', label: 'Have unprotected sex', explicit: true },
  { id: 'f-spit-eye',        label: 'Let them put their spit in your eye' },
  { id: 'f-ice-cream',       label: 'Eat from the same ice cream cone' },
  { id: 'f-tongue-nose',     label: 'Stick your tongue up their nose' },
  { id: 'f-suck-nose-skin',  label: 'Suck the skin of their nose', original: 'Suck the skin on of nose' },
  { id: 'f-suck-blood',      label: 'Suck blood from their cut' },
  { id: 'f-same-cup',        label: 'Drink from the same cup' },
  { id: 'f-lollipop',        label: 'Share the same lollipop' },
  { id: 'f-nose-pick',       label: 'Pick their nose and eat it' },
  { id: 'f-toothbrush',      label: 'Use the same toothbrush' },
  { id: 'f-chewed-gum',      label: 'Eat their chewed chewing gum' },
  { id: 'f-same-fork',       label: 'Use the same fork as them' },
  { id: 'f-spit-mouth',      label: 'Let them spit in your mouth' },
  { id: 'f-same-can',        label: 'Drink from the same can or bottle' },
  // ── Added when digitised (September 2026) — review before use ──
  { id: 'f-vape',            label: 'Share a vape', added: true },
  { id: 'f-lip-balm',        label: 'Share lip balm', added: true },
  { id: 'f-straw',           label: 'Drink through the same straw', added: true },
  { id: 'f-razor',           label: 'Share a razor', added: true },
  { id: 'f-make-up',         label: 'Share make-up or lipstick', added: true },
  { id: 'f-pizza-bite',      label: "Eat the slice of pizza they've bitten", added: true },
];

export const DECKS: Record<DeckId, Card[]> = {
  stages: STAGE_CARDS,
  activities: ACTIVITY_CARDS,
  fluids: FLUID_CARDS,
};

/** Column id for the "would never do this" column added in Stage 3. */
export const NEVER_COLUMN_ID = 'never';

/** Column id for cards a participant thinks don't belong on the
 *  timeline at all (Stage 1). */
export const OUT_PILE_ID = 'out';

const ALL_CARDS = new Map<string, Card>(
  [...STAGE_CARDS, ...ACTIVITY_CARDS, ...FLUID_CARDS].map((c) => [c.id, c]),
);

export function getCard(id: string): Card | undefined {
  return ALL_CARDS.get(id);
}

export function isKnownCard(id: unknown): id is string {
  return typeof id === 'string' && ALL_CARDS.has(id);
}

/** Cards in a deck, optionally with explicit cards removed. */
export function deckCards(deck: DeckId, hideExplicit: boolean): Card[] {
  return DECKS[deck].filter((c) => !(hideExplicit && c.explicit));
}
