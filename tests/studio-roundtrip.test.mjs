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

import { parseFile, serialiseFile, toObject } from '../src/lib/studio/frontmatter.js';
import { docToMarkdown, markdownToDoc } from '../src/lib/studio/markdown.js';
import { validatePatch } from '../src/lib/studio/schema.js';

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
  const raw = read(slugs[0]);
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
