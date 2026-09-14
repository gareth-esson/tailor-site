/**
 * Guards the post editor's file handling against the one failure that
 * would actually hurt: a save that rewrites parts of a post nobody
 * edited.
 *
 * Three people commit to these files — Gareth through /studio, Claude
 * and Codex from a terminal. If the editor reformats frontmatter or
 * reflows prose on every save, every diff becomes unreviewable and the
 * other two lose the ability to see what changed. So these tests run
 * against the real corpus, not fixtures: every post in src/content/blog
 * must survive a round trip.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { FIELD_ORDER, parseFile, serialiseFile, toObject } from '../src/lib/studio/frontmatter.js';
import { docToMarkdown, markdownToDoc } from '../src/lib/studio/markdown.js';
import { EDITABLE_FIELDS, validatePatch } from '../src/lib/studio/schema.js';

const BLOG_DIR = 'src/content/blog';
const slugs = readdirSync(BLOG_DIR, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

const read = (slug) => readFileSync(join(BLOG_DIR, slug, 'index.mdx'), 'utf8');

test('there are posts to test against', () => {
  assert.ok(slugs.length > 0, 'no posts found — the corpus tests would pass vacuously');
});

test('an untouched post is rewritten byte-for-byte', async (t) => {
  for (const slug of slugs) {
    await t.test(slug, () => {
      const raw = read(slug);
      const { fields, body } = parseFile(raw);
      assert.equal(serialiseFile(fields, {}, body), raw);
    });
  }
});

test('changing one field leaves every other line untouched', async (t) => {
  for (const slug of slugs) {
    await t.test(slug, () => {
      const raw = read(slug);
      const { fields, body } = parseFile(raw);
      const next = serialiseFile(fields, { metaTitle: 'A brand new meta title' }, body);

      const before = raw.split('\n');
      const after = next.split('\n');
      const changed = before.filter((line, i) => after[i] !== line);
      // Only the metaTitle line may differ. Any more means the
      // serialiser is reformatting things it was not asked to touch.
      assert.ok(
        changed.every((line) => line.startsWith('metaTitle:')),
        `unexpected lines changed: ${JSON.stringify(changed.slice(0, 3))}`,
      );
    });
  }
});

test('a field the post lacks is inserted in schema order', () => {
  // Stripped of the review fields so dateModified's schema neighbours are
  // publishedDate and author, which is what this test is asserting about.
  const raw = withoutReviewFields();
  const { fields, body } = parseFile(raw);
  const stripped = fields.filter((f) => f.key !== 'dateModified');
  const next = serialiseFile(stripped, { dateModified: '2026-09-14' }, body);
  const keys = next
    .split('\n---\n')[0]
    .split('\n')
    .map((line) => /^([A-Za-z_][A-Za-z0-9_]*):/.exec(line)?.[1])
    .filter(Boolean);
  assert.equal(keys[keys.indexOf('dateModified') - 1], 'publishedDate');
  assert.equal(keys[keys.indexOf('dateModified') + 1], 'author');
});

test('body conversion is idempotent and preserves every word', async (t) => {
  for (const slug of slugs) {
    await t.test(slug, () => {
      const { body } = parseFile(read(slug));
      const once = docToMarkdown(markdownToDoc(body));
      const twice = docToMarkdown(markdownToDoc(once));

      // Idempotence is what stops a post churning: edit it twice and the
      // second save must not rewrite what the first one produced.
      assert.equal(once, twice, 'second pass changed the output');

      // Differences from the original are allowed (the corpus has
      // inconsistent blank-line spacing from the Notion migration) but
      // only whitespace ones. No word may move, change or vanish.
      const words = (s) => s.replace(/\s+/g, ' ').trim();
      assert.equal(words(once), words(body), 'conversion changed the text, not just the spacing');
    });
  }
});

test('links, headings and emphasis survive a round trip', () => {
  const source = [
    '## A heading',
    '',
    'Body with a [relative link](/topics/consent), an [external one](https://example.org),',
    '**bold**, _italic_ and `code`.',
    '',
    '- first item',
    '- second item',
    '',
    '> A quote',
    '> - with a nested bullet',
  ].join('\n');

  const out = docToMarkdown(markdownToDoc(source));
  assert.match(out, /^## A heading$/m);
  assert.match(out, /\[relative link\]\(\/topics\/consent\)/);
  assert.match(out, /\[external one\]\(https:\/\/example\.org\)/);
  assert.match(out, /\*\*bold\*\*/);
  assert.match(out, /_italic_/);
  assert.match(out, /`code`/);
  assert.match(out, /^- first item$/m);
  assert.match(out, /^> - with a nested bullet$/m);
  assert.equal(out, docToMarkdown(markdownToDoc(out)));
});

test('markdown typed into prose is escaped, not re-parsed', () => {
  const doc = {
    type: 'doc',
    content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Use the * key and [brackets] here.' }] }],
  };
  const md = docToMarkdown(doc);
  const back = markdownToDoc(md);
  const text = back.content[0].content.map((n) => n.text).join('');
  assert.equal(text, 'Use the * key and [brackets] here.');
  // And it must arrive as one text node, not a fragment per escape.
  assert.equal(back.content[0].content.length, 1);
});

test('every real post validates against the editor schema', async (t) => {
  for (const slug of slugs) {
    await t.test(slug, () => {
      const data = toObject(parseFile(read(slug)).fields);
      // Only the fields the editor can send.
      const patch = {};
      for (const key of [
        'title',
        'status',
        'publishedDate',
        'dateModified',
        'author',
        'category',
        'targetAudience',
        'contentTags',
        'serviceLink',
        'metaTitle',
        'metaDescription',
        'featuredImageAlt',
        'imageCredit',
        'imageCreditUrl',
      ]) {
        if (key in data) patch[key] = data[key];
      }
      const result = validatePatch(patch);
      assert.ok(result.ok, `existing post rejected by the validator: ${result.errors?.join(' ')}`);
    });
  }
});

test('the validator refuses values that would break the build', () => {
  assert.equal(validatePatch({ status: 'Live' }).ok, false, 'accepted an invalid status enum');
  assert.equal(validatePatch({ category: 'Made up' }).ok, false, 'accepted an invalid category');
  assert.equal(validatePatch({ publishedDate: '14/09/2026' }).ok, false, 'accepted a non-ISO date');
  assert.equal(validatePatch({ slug: 'elsewhere' }).ok, false, 'accepted a field it should not write');
  assert.equal(validatePatch({ imageCreditUrl: 'javascript:alert(1)' }).ok, false, 'accepted a non-http URL');
  assert.equal(validatePatch({ title: '' }).ok, false, 'accepted an empty title');
});

test('a newline cannot be smuggled into a single-line frontmatter value', () => {
  const result = validatePatch({ metaTitle: 'Real title"\nstatus: "Published' });
  assert.ok(result.ok);
  assert.ok(!result.value.metaTitle.includes('\n'), 'newline survived into a quoted scalar');

  // And if it somehow did, the emitter escapes the quote that would end
  // the scalar early.
  const { fields, body } = parseFile(read(slugs[0]));
  const out = serialiseFile(fields, { metaTitle: 'He said "hello" \\ goodbye' }, body);
  const reparsed = toObject(parseFile(out).fields);
  assert.equal(reparsed.metaTitle, 'He said "hello" \\ goodbye');
});

test('the signature notices formatting that Markdown would drop', async () => {
  const { docSignature, docToMarkdown, markdownToDoc } = await import('../src/lib/studio/markdown.js');

  // Bold butted against a following word: CommonMark's flanking rules
  // mean the closing ** is not a closer, so this cannot round-trip.
  const awkward = {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          { type: 'text', text: 'the ' },
          { type: 'text', text: 'test.', marks: [{ type: 'bold' }] },
          { type: 'text', text: 'minute' },
        ],
      },
    ],
  };
  assert.notEqual(
    docSignature(awkward),
    docSignature(markdownToDoc(docToMarkdown(awkward))),
    'a mark that cannot survive Markdown went unnoticed',
  );

  // The ordinary case — bold with spaces around it — must not trip it.
  const normal = {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          { type: 'text', text: 'the ' },
          { type: 'text', text: 'test', marks: [{ type: 'bold' }] },
          { type: 'text', text: ' minute' },
        ],
      },
    ],
  };
  assert.equal(docSignature(normal), docSignature(markdownToDoc(docToMarkdown(normal))));
});

test('every real post survives the signature check', async (t) => {
  const { docSignature, docToMarkdown, markdownToDoc } = await import('../src/lib/studio/markdown.js');
  for (const slug of slugs) {
    await t.test(slug, () => {
      const { body } = parseFile(read(slug));
      const doc = markdownToDoc(body);
      assert.equal(docSignature(doc), docSignature(markdownToDoc(docToMarkdown(doc))));
    });
  }
});

/* ── Periodic-review fields (docs/editorial-policy.md §3) ─────────────
 *
 * guidanceSensitive / reviewBy / lastReviewedDate live in
 * content.config.ts and must be settable from the editor, not merely
 * passed through. Real posts now carry these fields, so both fixtures
 * below are derived rather than assumed: strip the three lines to get a
 * post that lacks them, and splice onto that stripped copy to get one
 * that carries exactly the expected values. Deriving both keeps these
 * tests true however many posts are flagged, instead of silently
 * decaying the next time the corpus changes.
 */

const REVIEW_FIELD_LINE = /^(?:guidanceSensitive|reviewBy|lastReviewedDate):.*\n/gm;

/** A real post with the three review fields removed. */
const withoutReviewFields = (slug = slugs[0]) => read(slug).replace(REVIEW_FIELD_LINE, '');

/** A real post carrying exactly the three review fields, after dateModified. */
const withReviewFields = (slug = slugs[0]) =>
  withoutReviewFields(slug).replace(/^dateModified:.*$/m, (line) =>
    [line, 'guidanceSensitive: true', 'reviewBy: "2027-03-21"', 'lastReviewedDate: "2026-09-21"'].join('\n'),
  );

test('the review fields parse back as the types the collection schema wants', () => {
  const data = toObject(parseFile(withReviewFields()).fields);
  assert.equal(data.guidanceSensitive, true, 'guidanceSensitive did not parse as a boolean');
  assert.equal(data.reviewBy, '2027-03-21');
  assert.equal(data.lastReviewedDate, '2026-09-21');
});

test('the validator accepts the review fields and rejects what would break the build', () => {
  const ok = validatePatch({
    guidanceSensitive: true,
    reviewBy: '2027-03-21',
    lastReviewedDate: '2026-09-21',
  });
  assert.ok(ok.ok, `valid review fields rejected: ${ok.errors?.join(' ')}`);
  assert.equal(ok.value.guidanceSensitive, true);
  assert.equal(typeof ok.value.guidanceSensitive, 'boolean', 'the boolean arrived as something else');

  // z.boolean() rejects a string, and a string would be emitted quoted —
  // so "true" must not be waved through as merely truthy.
  assert.equal(validatePatch({ guidanceSensitive: 'true' }).ok, false, 'accepted a string for a boolean');
  assert.equal(validatePatch({ guidanceSensitive: 1 }).ok, false, 'accepted a number for a boolean');
  assert.equal(validatePatch({ reviewBy: '21/03/2027' }).ok, false, 'accepted a non-ISO review date');
  assert.equal(validatePatch({ lastReviewedDate: 'yesterday' }).ok, false, 'accepted a non-ISO review date');

  // An unticked box and an absent field both mean the schema default.
  assert.equal(validatePatch({ guidanceSensitive: false }).value.guidanceSensitive, false);
  assert.equal(validatePatch({ guidanceSensitive: '' }).value.guidanceSensitive, false);

  // Clearing either date means null, not an empty string.
  const cleared = validatePatch({ reviewBy: '', lastReviewedDate: null });
  assert.ok(cleared.ok);
  assert.equal(cleared.value.reviewBy, null);
  assert.equal(cleared.value.lastReviewedDate, null);
});

test('setting the review fields from empty inserts them in schema order', () => {
  const raw = withoutReviewFields();
  const { fields, body } = parseFile(raw);
  const next = serialiseFile(
    fields,
    { guidanceSensitive: true, reviewBy: '2027-03-21', lastReviewedDate: '2026-09-21' },
    body,
  );

  const keys = next
    .split('\n---\n')[0]
    .split('\n')
    .map((line) => /^([A-Za-z_][A-Za-z0-9_]*):/.exec(line)?.[1])
    .filter(Boolean);
  assert.equal(keys[keys.indexOf('guidanceSensitive') - 1], 'dateModified');
  assert.equal(keys[keys.indexOf('guidanceSensitive') + 1], 'reviewBy');
  assert.equal(keys[keys.indexOf('reviewBy') + 1], 'lastReviewedDate');
  assert.equal(keys[keys.indexOf('lastReviewedDate') + 1], 'author');

  // A boolean must be bare. `guidanceSensitive: "true"` is a string to
  // Zod, and z.boolean() fails the build on it.
  assert.match(next, /^guidanceSensitive: true$/m);
  assert.ok(!/^guidanceSensitive: "/m.test(next), 'the boolean was emitted quoted');
  assert.match(next, /^reviewBy: "2027-03-21"$/m);
  assert.match(next, /^lastReviewedDate: "2026-09-21"$/m);

  // Nothing else moved: the only new lines are the three.
  const before = new Set(raw.split('\n'));
  const added = next.split('\n').filter((line) => !before.has(line));
  assert.deepEqual(added.sort(), [
    'guidanceSensitive: true',
    'lastReviewedDate: "2026-09-21"',
    'reviewBy: "2027-03-21"',
  ]);
});

test('an unticked guidanceSensitive adds no line to a post that lacks it', () => {
  // The form posts every field on every save, so a false here must read
  // as "still the schema default", not as a new line on every post.
  const raw = withoutReviewFields();
  const { fields, body } = parseFile(raw);
  assert.equal(serialiseFile(fields, { guidanceSensitive: false }, body), raw);
});

test('a post already carrying the review fields round-trips byte-for-byte', () => {
  const raw = withReviewFields();
  const { fields, body } = parseFile(raw);

  // Untouched.
  assert.equal(serialiseFile(fields, {}, body), raw);

  // And with the form posting the same values straight back.
  const unchanged = serialiseFile(
    fields,
    { guidanceSensitive: true, reviewBy: '2027-03-21', lastReviewedDate: '2026-09-21' },
    body,
  );
  assert.equal(unchanged, raw, 'resaving the same review values rewrote the file');
});

test('changing a review field rewrites only that line', () => {
  const raw = withReviewFields();
  const { fields, body } = parseFile(raw);

  const cases = [
    [{ guidanceSensitive: false }, 'guidanceSensitive: false'],
    [{ reviewBy: '2028-01-01' }, 'reviewBy: "2028-01-01"'],
    [{ lastReviewedDate: '2027-03-21' }, 'lastReviewedDate: "2027-03-21"'],
  ];

  for (const [patch, expected] of cases) {
    const key = Object.keys(patch)[0];
    const next = serialiseFile(fields, patch, body);
    assert.ok(next.split('\n').includes(expected), `${key}: expected line "${expected}" not written`);

    const before = raw.split('\n');
    const after = next.split('\n');
    const changed = before.filter((line, i) => after[i] !== line);
    assert.ok(changed.length > 0, `${key}: nothing changed`);
    assert.ok(
      changed.every((line) => line.startsWith(`${key}:`)),
      `${key}: unexpected lines changed: ${JSON.stringify(changed.slice(0, 3))}`,
    );
  }
});

test('clearing the review dates writes null, not an empty string', () => {
  const raw = withReviewFields();
  const { fields, body } = parseFile(raw);
  const next = serialiseFile(fields, { reviewBy: null, lastReviewedDate: null }, body);

  assert.match(next, /^reviewBy: null$/m);
  assert.match(next, /^lastReviewedDate: null$/m);

  // And they read back as null, which is what z.string().nullable() wants.
  const data = toObject(parseFile(next).fields);
  assert.equal(data.reviewBy, null);
  assert.equal(data.lastReviewedDate, null);
});

test('the review fields are in both schemas, in the same place', () => {
  const config = readFileSync('src/content.config.ts', 'utf8');
  for (const key of ['guidanceSensitive', 'reviewBy', 'lastReviewedDate']) {
    assert.ok(config.includes(`${key}:`), `${key} is missing from content.config.ts`);
    assert.ok(EDITABLE_FIELDS[key], `${key} is missing from the editor's EDITABLE_FIELDS`);
    assert.ok(FIELD_ORDER.includes(key), `${key} is missing from FIELD_ORDER`);
  }
  assert.equal(FIELD_ORDER[FIELD_ORDER.indexOf('dateModified') + 1], 'guidanceSensitive');
  assert.equal(FIELD_ORDER[FIELD_ORDER.indexOf('lastReviewedDate') + 1], 'author');
});
