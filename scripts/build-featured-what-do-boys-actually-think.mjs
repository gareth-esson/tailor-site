/**
 * Prepares the featured image for /blog/what-do-boys-actually-think/.
 *
 *   node scripts/build-featured-what-do-boys-actually-think.mjs <source>
 *   → src/content/blog/what-do-boys-actually-think/featured.webp (1600x893)
 *
 * Two things happen here, and the second is an editorial act rather than
 * a technical one.
 *
 * ── Why the signage is blurred ────────────────────────────────────────
 *
 * The source frame has "THE PRIORY SCHOOL" legible on the building. That
 * is the name of several real schools in the UK, and this post is about
 * misogyny in schools. A reader who can read the sign is being invited
 * to think a specific real school is the subject of the article, which
 * it is not, and no school has agreed to illustrate this piece.
 *
 * Blurring rather than cropping, because the sign sits top-right with
 * the third boy directly below it: any crop that loses the sign also
 * loses him, and the frame is already close to 16:9 so there is almost
 * no room to cut.
 *
 * Blurring rather than patching, because the whole building plane is
 * already soft from shallow depth of field. The sign was anomalously
 * sharp for its distance, so bringing it down to the softness of the
 * brick either side of it is a move towards what a real lens would have
 * done, not a visible redaction. The blazer crests were checked and are
 * invented heraldry with illegible motto text, so they are left alone.
 *
 * If the image is ever regenerated, re-check the facade before
 * publishing: a different seed will put different text on the wall.
 */
import sharp from 'sharp';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const src = process.argv[2];
if (!src) {
  console.error('Usage: node scripts/build-featured-what-do-boys-actually-think.mjs <source image>');
  process.exit(1);
}

const out = resolve(
  root,
  'src/content/blog/what-do-boys-actually-think/featured.webp',
);

/* The sign panel, in source pixels, padded so the feather has room.
   Measured against a 2752x1536 source; the assertion below stops this
   being applied blind to a differently sized frame. */
const SOURCE = { width: 2752, height: 1536 };
const SIGN = { left: 1755, top: 50, width: 465, height: 180 };
const SIGMA = 12;

/* 1600 wide matches the widest of the existing featured images and keeps
   the source's own aspect ratio rather than cropping to a nominal 16:9. */
const TARGET_WIDTH = 1600;

const meta = await sharp(src).metadata();
if (meta.width !== SOURCE.width || meta.height !== SOURCE.height) {
  console.error(
    `Source is ${meta.width}x${meta.height}, expected ${SOURCE.width}x${SOURCE.height}. ` +
      'The blur region is measured in source pixels, so re-measure the sign before running this.',
  );
  process.exit(1);
}

// A white rectangle with blurred edges, used as the alpha channel on the
// blurred patch so it feathers into the untouched brick instead of
// leaving a rectangle you can see.
const feather = await sharp({
  create: {
    width: SIGN.width,
    height: SIGN.height,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite([
    {
      input: Buffer.from(
        `<svg width="${SIGN.width}" height="${SIGN.height}">
           <rect x="18" y="18" width="${SIGN.width - 36}" height="${SIGN.height - 36}"
                 rx="14" fill="#fff"/>
         </svg>`,
      ),
      blend: 'over',
    },
  ])
  .blur(14)
  .png()
  .toBuffer();

const patch = await sharp(src)
  .extract(SIGN)
  .blur(SIGMA)
  .composite([{ input: feather, blend: 'dest-in' }])
  .png()
  .toBuffer();

/* Two pipelines, deliberately. sharp applies resize BEFORE composite
   whatever order you chain them in, so doing both in one pass placed
   this patch at x=1755 on an already-1600px canvas, where it was
   silently clipped off-frame: the run reported success and wrote a file
   with the sign still legible. Composite at source scale, then resize
   the result. */
const composited = await sharp(src)
  .composite([{ input: patch, left: SIGN.left, top: SIGN.top }])
  .png()
  .toBuffer();

const info = await sharp(composited)
  .resize({ width: TARGET_WIDTH })
  .webp({ quality: 82 })
  .toFile(out);

console.log(
  `Wrote ${out}\n  ${info.width}x${info.height} webp, ${(info.size / 1024).toFixed(0)}KB\n  signage blurred at sigma ${SIGMA} over ${SIGN.width}x${SIGN.height} at ${SIGN.left},${SIGN.top}`,
);
