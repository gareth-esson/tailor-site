/**
 * Guards the training catalogue's two halves against drifting apart.
 *
 * A session's page lives in src/content/training/<slug>/, but its title,
 * and the value the enquiry form sends, live in TRAINING_SESSIONS
 * (src/lib/training.js). If a folder is added or renamed without the
 * list, the page builds fine and its "Book this training" link arrives
 * at the form with a session the form doesn't offer: the dropdown sits on
 * "Please select" and the enquiry email says the session wasn't given.
 * Nothing errors, so only a test catches it.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  TRAINING_SESSIONS,
  TRAINING_FORMATS,
  formatPrice,
  rateCardLine,
  trainingSessionTitle,
} from '../src/lib/training.js';

const CONTENT = fileURLToPath(new URL('../src/content/training/', import.meta.url));

const folders = existsSync(CONTENT)
  ? readdirSync(CONTENT).filter((name) => statSync(join(CONTENT, name)).isDirectory())
  : [];

test('every training content folder is a session in TRAINING_SESSIONS', () => {
  const known = new Set(TRAINING_SESSIONS.map((s) => s.slug));
  const unknown = folders.filter((slug) => !known.has(slug));
  assert.deepEqual(unknown, [], `content folders missing from TRAINING_SESSIONS: ${unknown.join(', ')}`);
});

test('session slugs are unique and URL-safe', () => {
  const slugs = TRAINING_SESSIONS.map((s) => s.slug);
  assert.equal(new Set(slugs).size, slugs.length, 'duplicate slug');
  for (const slug of slugs) assert.match(slug, /^[a-z0-9]+(-[a-z0-9]+)*$/, slug);
});

test('trainingSessionTitle resolves known slugs and rejects others', () => {
  for (const s of TRAINING_SESSIONS) assert.equal(trainingSessionTitle(s.slug), s.title);
  assert.equal(trainingSessionTitle('not-a-session'), null);
  assert.equal(trainingSessionTitle(''), null);
});

test('the rate card has the three formats the session pages describe', () => {
  // The collection schema's `formats` object is keyed by these.
  assert.deepEqual(TRAINING_FORMATS.map((f) => f.key), ['twilight', 'half_day', 'full_day']);
  const line = rateCardLine({ from: true });
  for (const f of TRAINING_FORMATS) assert.ok(line.includes(`from ${formatPrice(f.price)}`), line);
  assert.ok(line.endsWith('plus travel at cost'), line);
});
