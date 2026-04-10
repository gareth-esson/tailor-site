/**
 * One-shot: convert the 11 renamed PNG hero photos in /images to WebP
 * at a web-sized max width, output to public/images/services/.
 */
import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';

const SRC = path.resolve('images');
const OUT = path.resolve('public/images/services');
const MAX_WIDTH = 1600;
const QUALITY = 82;

await mkdir(OUT, { recursive: true });
const files = (await readdir(SRC)).filter((f) => f.startsWith('tailor-education-') && f.endsWith('.png'));

for (const file of files) {
  const srcPath = path.join(SRC, file);
  const outPath = path.join(OUT, file.replace(/\.png$/, '.webp'));
  const info = await sharp(srcPath)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(outPath);
  console.log(`${file} → ${path.relative(process.cwd(), outPath)}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}KB`);
}
