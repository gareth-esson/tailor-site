/**
 * Builds the share card for /what-do-boys-actually-think/.
 *
 *   node scripts/build-og-what-do-boys-actually-think.mjs
 *   → public/assets/og-what-do-boys-actually-think.png (1200×630)
 *
 * ── Why this card carries no figure ───────────────────────────────────
 *
 * The page's hardest design constraint is that no minority finding may
 * read as a norm. A share card is the one part of a page that travels
 * without its context: it is rendered at thumbnail size, in someone
 * else's feed, with no source line and no distribution beside it. Put
 * "18%" on it and the card becomes a claim about what teenage boys
 * believe, which is exactly the harm the page is built to avoid.
 *
 * So the card carries the QUESTION and the MECHANIC, a slider with no
 * scale markings and no value, and nothing else. There is no number on
 * it to crop, quote or screenshot. Anyone who wants a figure has to open
 * the page, where the figure arrives with its population attached.
 *
 * Colours are the literal token values from tailor-site-v2.css rather
 * than var() references, because this file is rasterised outside the
 * page and cannot resolve custom properties. They are listed against
 * their token names below; if a token changes, change it here too.
 */
import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const W = 1200;
const H = 630;

// Token values, copied from src/styles/tailor-site-v2.css.
const C = {
  bg: '#fbfbfc', //          --bg-page
  bgAlt: '#eef0f2', //       --bg-surface-alt
  heading: '#1f2329', //     --text-heading
  muted: 'hsl(218, 8%, 42%)', // --text-body-muted
  accent: '#1A9E8A', //      --brand-accent
  accentText: '#127967', //  --brand-accent-text (L=29% of hue 168, sat 71%)
  track: '#d3d6da', //       --neutral-300
};

const card = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="ground" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${C.bg}"/>
      <stop offset="1" stop-color="${C.bgAlt}"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#ground)"/>

  <!-- Eyebrow -->
  <text x="80" y="188" font-family="Lexend" font-size="26" font-weight="600"
        letter-spacing="2.4" fill="${C.accentText}">MASCULINITY AND MISOGYNY</text>

  <!-- The question. Two lines, hand-broken: the break is a design
       decision, not something a renderer should guess at. -->
  <text x="80" y="272" font-family="Lexend" font-size="68" font-weight="700"
        fill="${C.heading}">What do boys</text>
  <text x="80" y="352" font-family="Lexend" font-size="68" font-weight="700"
        fill="${C.heading}">actually think?</text>

  <!-- The mechanic: a slider with no scale and no value. The whole
       point of the card is that there is no number on it. -->
  <g>
    <rect x="80" y="438" width="800" height="10" rx="5" fill="${C.track}"/>
    <rect x="80" y="438" width="470" height="10" rx="5" fill="${C.accent}"/>
    <circle cx="550" cy="443" r="26" fill="#ffffff"/>
    <circle cx="550" cy="443" r="26" fill="none" stroke="${C.accent}" stroke-width="5"/>
  </g>

  <text x="80" y="524" font-family="Lexend" font-size="30" font-weight="400"
        fill="${C.muted}">Guess the number. Then see the real one.</text>

  <text x="80" y="576" font-family="Lexend" font-size="24" font-weight="500"
        fill="${C.muted}">tailor-rse.org.uk</text>
</svg>`;

const base = await sharp(Buffer.from(card)).png().toBuffer();

// The wordmark is composited rather than nested, because librsvg does not
// reliably render an <image> whose href is another SVG.
const logo = await sharp(await readFile(resolve(root, 'public/assets/tailor-logo-lockup-dark.svg')))
  .resize({ width: 190 })
  .png()
  .toBuffer();
const logoMeta = await sharp(logo).metadata();

const out = resolve(root, 'public/assets/og-what-do-boys-actually-think.png');

await writeFile(
  out,
  await sharp(base)
    .composite([{ input: logo, top: 72, left: 80 }])
    .png({ compressionLevel: 9 })
    .toBuffer(),
);

console.log(`Wrote ${out} (${W}×${H}); logo ${logoMeta.width}×${logoMeta.height}`);
