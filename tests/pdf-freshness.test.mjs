/**
 * Guards the one real weakness of generating PDFs locally.
 *
 * The printable resources in `public/downloads/` are built by
 * `scripts/render-pdf.mjs` from routes under `src/pages/render/`, and the
 * generated file is committed. That is a deliberate trade — it keeps
 * Chromium out of the Vercel build, where a failed browser download would
 * break the whole site rather than one file — but it means the PDF and its
 * source can drift apart.
 *
 * That drift is silent. Edit the sheet, forget `npm run pdf:audit-sheet`,
 * and the committed PDF still opens perfectly and still looks completely
 * right. It is simply last month's version of a statutory compliance
 * checklist. Nothing else in the repo would notice.
 *
 * So the generator records a hash of every source that can change a
 * document's appearance, and this test checks those hashes still match.
 * Change a source without regenerating and `npm test` goes red.
 *
 * What this does and does not catch:
 *
 *   ✓ A source file changed and the PDF was not regenerated
 *   ✓ A document was added to the manifest but its PDF is missing
 *   ✓ The committed PDF was replaced by something else
 *   ✗ A rendering change from outside the recorded sources — a Lexend
 *     version bump, say. Detection, not proof.
 *
 * It is a freshness check, not a visual one: it cannot tell you the PDF
 * looks right, only that it was made from what is on disk now.
 */

import { strict as assert } from 'node:assert';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, before } from 'node:test';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = resolve(repoRoot, 'scripts/pdf-manifest.json');

const REGENERATE = 'npm run dev  (one terminal), then  npm run pdf:audit-sheet';

async function sha256(absPath) {
  return createHash('sha256').update(await readFile(absPath)).digest('hex');
}

describe('generated PDFs are current with their sources', () => {
  let manifest;

  before(async () => {
    assert.ok(
      existsSync(manifestPath),
      `No PDF manifest at scripts/pdf-manifest.json.\n` +
        `Every committed PDF must record what it was generated from.\n` +
        `Regenerate with: ${REGENERATE}`,
    );
    manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  });

  it('records at least one document', () => {
    assert.ok(
      Object.keys(manifest).length > 0,
      'The PDF manifest is empty. If a document was removed, remove its ' +
        'PDF and its manifest entry together.',
    );
  });

  it('every documented PDF still exists', () => {
    for (const outFile of Object.keys(manifest)) {
      assert.ok(
        existsSync(resolve(repoRoot, outFile)),
        `${outFile} is in the manifest but missing from disk.\n` +
          `Regenerate it, or drop its manifest entry if the document is gone.`,
      );
    }
  });

  it('no source has changed since its PDF was generated', async () => {
    const stale = [];

    for (const [outFile, entry] of Object.entries(manifest)) {
      for (const [src, recordedHash] of Object.entries(entry.sources)) {
        const abs = resolve(repoRoot, src);

        if (!existsSync(abs)) {
          stale.push(`${outFile}\n    source no longer exists: ${src}`);
          continue;
        }

        const actual = await sha256(abs);
        if (actual !== recordedHash) {
          stale.push(
            `${outFile}\n    changed since generation: ${src}\n` +
              `    recorded ${recordedHash.slice(0, 12)} · now ${actual.slice(0, 12)}`,
          );
        }
      }
    }

    assert.deepEqual(
      stale,
      [],
      `\n\n${stale.length} stale PDF source(s) — the committed file no longer ` +
        `matches what it was built from:\n\n  ${stale.join('\n\n  ')}\n\n` +
        `Regenerate: ${REGENERATE}\n`,
    );
  });

  it('the committed PDF is the one that was generated', async () => {
    const replaced = [];

    for (const [outFile, entry] of Object.entries(manifest)) {
      // Older entries may predate output hashing — skip rather than fail,
      // so adding this field doesn't retroactively break every document.
      if (!entry.output?.sha256) continue;

      const abs = resolve(repoRoot, outFile);
      if (!existsSync(abs)) continue; // covered by the existence test above

      const actual = await sha256(abs);
      if (actual !== entry.output.sha256) {
        replaced.push(
          `${outFile}\n    recorded ${entry.output.sha256.slice(0, 12)} · ` +
            `now ${actual.slice(0, 12)}`,
        );
      }
    }

    assert.deepEqual(
      replaced,
      [],
      `\n\nA committed PDF is not the file the generator produced:\n\n  ` +
        `${replaced.join('\n\n  ')}\n\nRegenerate: ${REGENERATE}\n`,
    );
  });
});
