/**
 * Focused tests for the search reliability work. Node built-ins only — no new
 * dependency, no browser, no network:
 *
 *   node --test tests/
 *
 * The helpers under test are the ones both search surfaces depend on for
 * exact-title destinations, bounded hydration, hostile-input rendering and
 * stale-response protection. They are deliberately DOM-free so they can be
 * tested here; the DOM wiring itself is verified in the browser.
 *
 * `.ts` imports rely on Node's built-in type stripping (Node 22.18+/23.6+);
 * `allowImportingTsExtensions` is already set by astro/tsconfigs/base.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  createRequestGate,
  exactTitleIds,
  hydrateRefs,
  isSafeLocalUrl,
  loadCatalogue,
  normalizeTitleKey,
  parseCatalogue,
  pickRowTitle,
  pickRowUrl,
  planFullSearch,
  planHeaderRefs,
  resetCatalogueCache,
  splitExcerpt,
} from '../src/lib/search-client.ts';
import {
  getContentType,
  isOtaSearchableType,
  isSearchableType,
  otaTypeOrder,
  typeOrder,
} from '../src/lib/searchTypes.ts';
import {
  buildCatalogueDocument,
  createIndexOnlyFetch,
  isCanonicalLocalPath,
} from '../scripts/build-search-titles.mjs';

const HEADER_LIMIT = 8;
const ROWS_BEFORE_TOGGLE = 5;
const groupOptions = { getType: getContentType, typeOrder };
/** What both surfaces actually pass: OtA content out of scope. */
const scopedGroupOptions = { ...groupOptions, isAllowedType: isSearchableType };
const searchScope = { getType: getContentType, isAllowedType: isSearchableType };

/** Result references shaped like Pagefind's, counting their own data loads. */
function makeRefs(specs) {
  const loads = [];
  const refs = specs.map((spec) => ({
    id: spec.id,
    data: async () => {
      loads.push(spec.id);
      if (spec.fail) throw new Error('fragment unavailable');
      return {
        url: spec.dataUrl ?? spec.url,
        excerpt: spec.excerpt ?? '',
        meta: { title: spec.title },
      };
    },
  }));
  return { refs, loads };
}

function catalogueFrom(specs) {
  return parseCatalogue({
    entries: specs.map((spec) => [spec.id, spec.url, spec.title]),
  });
}

/**
 * The reported failure: the visible title "For schools" exists, Pagefind ranks
 * that hub 50th of 93 for the query, and the header only ever shows 8 rows.
 */
function forSchoolsScenario() {
  const specs = [];
  for (let i = 0; i < 93; i += 1) {
    specs.push({ id: 'p' + i, url: '/page-' + i + '/', title: 'Page ' + i });
  }
  specs[49] = { id: 'hub', url: '/for-schools/', title: 'For schools' };
  return specs;
}

/* -------------------------------------------------------------------------- */

test('normalizeTitleKey folds case, whitespace and typographic punctuation', () => {
  assert.equal(normalizeTitleKey('For schools'), 'for schools');
  assert.equal(normalizeTitleKey('  FOR   Schools \n'), 'for schools');
  assert.equal(normalizeTitleKey('For schools'), 'for schools');
  assert.equal(normalizeTitleKey('Parents’ guide'), "parents' guide");
  assert.equal(normalizeTitleKey('Parents‘ guide'), "parents' guide");
  assert.equal(normalizeTitleKey('RSE – training'), 'rse - training');
  assert.equal(normalizeTitleKey('RSE — training'), 'rse - training');
  assert.equal(normalizeTitleKey('And… more'), 'and... more');
  assert.equal(normalizeTitleKey('zero​width'), 'zerowidth');
  // NFKC folds compatibility forms; accents are preserved, not stripped.
  assert.equal(normalizeTitleKey('ＦＯＲ Schools'), 'for schools');
  assert.equal(normalizeTitleKey('Café'), normalizeTitleKey('Café'));
  assert.notEqual(normalizeTitleKey('Café'), 'cafe');
  // Not a fuzzy matcher: a substring is not an exact title.
  assert.notEqual(normalizeTitleKey('schools'), normalizeTitleKey('For schools'));
});

test('isSafeLocalUrl accepts canonical paths and rejects everything else', () => {
  assert.equal(isSafeLocalUrl('/for-schools/'), true);
  assert.equal(isSafeLocalUrl('/blog/post/?a=b#c'), true);
  assert.equal(isSafeLocalUrl('//evil.example/'), false);
  assert.equal(isSafeLocalUrl('https://evil.example/'), false);
  assert.equal(isSafeLocalUrl('javascript:alert(1)'), false);
  assert.equal(isSafeLocalUrl('JaVaScRiPt:alert(1)'), false);
  assert.equal(isSafeLocalUrl('data:text/html,<script>x</script>'), false);
  assert.equal(isSafeLocalUrl('/ok\\..\\bad'), false);
  assert.equal(isSafeLocalUrl('/java\nscript:alert(1)'), false);
  assert.equal(isSafeLocalUrl('for-schools/'), false);
  assert.equal(isSafeLocalUrl(''), false);
  assert.equal(isSafeLocalUrl(null), false);
  assert.equal(isSafeLocalUrl(undefined), false);
  assert.equal(isSafeLocalUrl(42), false);
});

test('parseCatalogue validates rows, dedupes ids and indexes titles', () => {
  const catalogue = parseCatalogue({
    entries: [
      ['a', '/for-schools/', 'For schools'],
      ['b', '/services/rse-training/', 'RSE training'],
      ['a', '/duplicate-id/', 'Duplicate id'],
      ['c', 'https://evil.example/', 'Offsite'],
      ['d', 'javascript:alert(1)', 'Scriptable'],
      ['', '/empty-id/', 'Empty id'],
      ['e', '/short-row/'],
      'not-a-row',
      ['f', '/also-for-schools/', 'FOR SCHOOLS'],
    ],
  });

  assert.ok(catalogue);
  assert.equal(catalogue.entries.length, 3);
  assert.equal(catalogue.byId.get('a').url, '/for-schools/');
  assert.equal(catalogue.byId.has('c'), false);
  assert.equal(catalogue.byId.has('d'), false);
  assert.equal(catalogue.byId.has('e'), false);
  // Duplicate id keeps the first row.
  assert.equal(catalogue.byId.get('a').title, 'For schools');
  // Two pages can share a normalised title; both are reachable.
  assert.deepEqual(
    catalogue.byTitle.get('for schools').map((entry) => entry.id),
    ['a', 'f'],
  );

  assert.equal(parseCatalogue(null), null);
  assert.equal(parseCatalogue({}), null);
  assert.equal(parseCatalogue({ entries: 'nope' }), null);
  assert.equal(parseCatalogue({ entries: [] }), null);
  assert.equal(parseCatalogue({ entries: [['x', '//evil/', 'X']] }), null);
});

test('loadCatalogue fetches once and never rejects', async (t) => {
  t.afterEach(() => resetCatalogueCache());

  resetCatalogueCache();
  let calls = 0;
  const ok = async () => {
    calls += 1;
    return {
      ok: true,
      json: async () => ({ entries: [['a', '/for-schools/', 'For schools']] }),
    };
  };
  const first = loadCatalogue(ok);
  const second = loadCatalogue(ok);
  assert.equal(first, second, 'the same promise is reused');
  const catalogue = await first;
  assert.equal(calls, 1);
  assert.equal(catalogue.entries.length, 1);

  resetCatalogueCache();
  assert.equal(await loadCatalogue(async () => ({ ok: false })), null);

  resetCatalogueCache();
  assert.equal(
    await loadCatalogue(async () => {
      throw new Error('offline');
    }),
    null,
  );

  resetCatalogueCache();
  assert.equal(
    await loadCatalogue(async () => ({
      ok: true,
      json: async () => {
        throw new Error('bad json');
      },
    })),
    null,
  );
});

test('exactTitleIds only names pages that are actually in the catalogue', () => {
  const catalogue = catalogueFrom([
    { id: 'hub', url: '/for-schools/', title: 'For schools' },
    { id: 'svc', url: '/services/rse-training/', title: 'RSE training' },
  ]);
  assert.deepEqual([...exactTitleIds('for schools', catalogue)], ['hub']);
  assert.deepEqual([...exactTitleIds('  FOR SCHOOLS  ', catalogue)], ['hub']);
  assert.deepEqual([...exactTitleIds('schools', catalogue)], []);
  assert.deepEqual([...exactTitleIds('', catalogue)], []);
  assert.deepEqual([...exactTitleIds('for schools', null)], []);
});

test('header promotes the exact-title page into the top 8 within its load budget', async () => {
  const specs = forSchoolsScenario();
  const catalogue = catalogueFrom(specs);
  const { refs, loads } = makeRefs(specs);

  const planned = planHeaderRefs(refs, 'for schools', catalogue, HEADER_LIMIT);
  assert.equal(planned.length, HEADER_LIMIT);
  assert.equal(planned[0].id, 'hub', 'the exact title leads the dropdown');
  // Everything after it keeps Pagefind's own order.
  assert.deepEqual(
    planned.slice(1).map((ref) => ref.id),
    ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6'],
  );

  const hydrated = await hydrateRefs(planned);
  assert.equal(hydrated.length, HEADER_LIMIT);
  assert.equal(loads.length, HEADER_LIMIT, 'at most 8 data loads per settled query');
});

test('header ranking adds nothing and degrades to Pagefind order', () => {
  const specs = forSchoolsScenario();
  const catalogue = catalogueFrom(specs);

  // The exact-title page is not in this result set: nothing is synthesised.
  const withoutHub = makeRefs(specs.filter((spec) => spec.id !== 'hub')).refs;
  const planned = planHeaderRefs(withoutHub, 'for schools', catalogue, HEADER_LIMIT);
  assert.equal(planned.length, HEADER_LIMIT);
  assert.equal(
    planned.some((ref) => ref.id === 'hub'),
    false,
  );
  assert.deepEqual(
    planned.map((ref) => ref.id),
    ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'],
  );

  // No catalogue: plain Pagefind order, still capped.
  const { refs } = makeRefs(specs);
  const fallback = planHeaderRefs(refs, 'for schools', null, HEADER_LIMIT);
  assert.deepEqual(
    fallback.map((ref) => ref.id),
    ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'],
  );

  // A non-title query is untouched.
  const ordinary = planHeaderRefs(refs, 'puberty', catalogue, HEADER_LIMIT);
  assert.deepEqual(
    ordinary.map((ref) => ref.id),
    ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'],
  );
});

test('header ranking dedupes repeated ids and repeated URLs', () => {
  const catalogue = catalogueFrom([
    { id: 'a', url: '/a/', title: 'A' },
    { id: 'a-dup', url: '/a/', title: 'A again' },
    { id: 'b', url: '/b/', title: 'B' },
  ]);
  const { refs } = makeRefs([
    { id: 'a', url: '/a/', title: 'A' },
    { id: 'a', url: '/a/', title: 'A' },
    { id: 'a-dup', url: '/a/', title: 'A again' },
    { id: 'b', url: '/b/', title: 'B' },
  ]);
  assert.deepEqual(
    planHeaderRefs(refs, 'a', catalogue, HEADER_LIMIT).map((ref) => ref.id),
    ['a', 'b'],
  );
});

test('full search groups and counts from the catalogue with the exact group first', () => {
  const specs = [
    { id: 'q1', url: '/anonymous_question/periods/', title: 'Periods' },
    { id: 'q2', url: '/anonymous_question/puberty/', title: 'Puberty' },
    { id: 'g1', url: '/glossary/consent/', title: 'Consent' },
    { id: 'hub', url: '/for-schools/', title: 'For schools' },
    { id: 'q3', url: '/anonymous_question/consent/', title: 'Consent question' },
    { id: 'g2', url: '/glossary/puberty/', title: 'Puberty (glossary)' },
  ];
  for (let i = 0; i < 7; i += 1) {
    specs.push({ id: 'b' + i, url: '/blog/post-' + i + '/', title: 'Post ' + i });
  }
  const catalogue = catalogueFrom(specs);
  const { refs, loads } = makeRefs(specs);

  const plan = planFullSearch(refs, 'for schools', catalogue, groupOptions);
  assert.equal(plan.ok, true);
  assert.equal(plan.total, specs.length);

  // The exact match's own group leads; the taxonomy order holds for the rest.
  assert.deepEqual(
    plan.groups.map((group) => group.type),
    ['other', 'blog', 'anonymous_question', 'glossary'],
  );
  assert.equal(plan.groups[0].refs[0].id, 'hub', 'an exact match is never buried');
  assert.deepEqual(
    plan.groups.map((group) => group.total),
    [1, 7, 3, 2],
  );
  // Counts are the real group sizes, reached without hydrating anything.
  assert.equal(loads.length, 0);
  assert.equal(
    plan.groups.reduce((sum, group) => sum + group.total, 0),
    plan.total,
  );

  // Without an exact title hit, groups keep the existing type order and
  // Pagefind's own order inside each group.
  const ordinary = planFullSearch(refs, 'growing up', catalogue, groupOptions);
  assert.equal(ordinary.ok, true);
  assert.deepEqual(
    ordinary.groups.map((group) => group.type),
    ['blog', 'anonymous_question', 'glossary', 'other'],
  );
  // Find the group by type rather than by position: this asserts Pagefind's
  // order *within* a group, which has nothing to do with typeOrder.
  assert.deepEqual(
    ordinary.groups.find((group) => group.type === 'anonymous_question').refs.map((ref) => ref.id),
    ['q1', 'q2', 'q3'],
  );

  // When the exact match is already in the first group, it only rises inside
  // it — the group order is unchanged.
  const inFirstGroup = planFullSearch(refs, 'Puberty', catalogue, groupOptions);
  assert.equal(inFirstGroup.ok, true);
  assert.deepEqual(
    inFirstGroup.groups.map((group) => group.type),
    ['anonymous_question', 'blog', 'glossary', 'other'],
  );
  assert.deepEqual(
    inFirstGroup.groups[0].refs.map((ref) => ref.id),
    ['q2', 'q1', 'q3'],
  );
  assert.equal(inFirstGroup.groups[0].exactCount, 1);
});

test('full search hydrates only the rows it shows, then the rest on demand', async () => {
  const specs = [];
  for (let i = 0; i < 12; i += 1) {
    specs.push({ id: 'b' + i, url: '/blog/post-' + i + '/', title: 'Post ' + i });
  }
  for (let i = 0; i < 4; i += 1) {
    specs.push({ id: 'g' + i, url: '/glossary/term-' + i + '/', title: 'Term ' + i });
  }
  const catalogue = catalogueFrom(specs);
  const { refs, loads } = makeRefs(specs);

  const plan = planFullSearch(refs, 'post', catalogue, groupOptions);
  assert.equal(plan.ok, true);

  const initial = plan.groups.flatMap((group) => group.refs.slice(0, ROWS_BEFORE_TOGGLE));
  await hydrateRefs(initial);
  assert.equal(loads.length, 9, '5 blog rows + 4 glossary rows, not all 16');
  for (const group of plan.groups) {
    const shown = Math.min(group.total, ROWS_BEFORE_TOGGLE);
    assert.ok(shown <= ROWS_BEFORE_TOGGLE);
  }

  // "Show all" fetches that group's remainder only.
  const blog = plan.groups.find((group) => group.type === 'blog');
  const remainder = blog.refs.slice(ROWS_BEFORE_TOGGLE);
  assert.equal(remainder.length, 7);
  await hydrateRefs(remainder);
  assert.equal(loads.length, 16);
});

test('full search refuses to plan instead of silently hydrating everything', () => {
  const specs = [{ id: 'a', url: '/a/', title: 'A' }];
  const catalogue = catalogueFrom(specs);
  const { refs } = makeRefs(specs);

  assert.deepEqual(planFullSearch(refs, 'a', null, groupOptions), {
    ok: false,
    reason: 'no-catalogue',
  });

  const unknown = makeRefs([{ id: 'missing-from-catalogue', url: '/x/', title: 'X' }]).refs;
  assert.deepEqual(planFullSearch(unknown, 'a', catalogue, groupOptions), {
    ok: false,
    reason: 'incomplete-catalogue',
  });

  assert.deepEqual(planFullSearch([{ data: async () => ({}) }], 'a', catalogue, groupOptions), {
    ok: false,
    reason: 'no-result-ids',
  });
});

test('hydrateRefs survives individual data failures without rejecting', async () => {
  const { refs, loads } = makeRefs([
    { id: 'a', url: '/a/', title: 'A' },
    { id: 'b', url: '/b/', title: 'B', fail: true },
    { id: 'c', url: '/c/', title: 'C' },
  ]);
  const hydrated = await hydrateRefs(refs);
  assert.equal(loads.length, 3);
  assert.deepEqual(
    hydrated.map((pair) => pair.ref.id),
    ['a', 'c'],
  );

  const allFailed = await hydrateRefs(makeRefs([{ id: 'x', url: '/x/', fail: true }]).refs);
  assert.deepEqual(allFailed, [], 'a total data failure is distinguishable from no results');
});

test('row fields refuse unsafe URLs and fall back to the catalogue', () => {
  assert.equal(pickRowUrl('/for-schools/', '/catalogue/'), '/for-schools/');
  assert.equal(pickRowUrl('javascript:alert(1)', '/catalogue/'), '/catalogue/');
  assert.equal(pickRowUrl('//evil.example/', '/catalogue/'), '/catalogue/');
  assert.equal(pickRowUrl('javascript:alert(1)', 'https://evil.example/'), null);
  assert.equal(pickRowUrl(undefined, undefined), null);

  assert.equal(pickRowTitle('Title', 'Catalogue', '/u/'), 'Title');
  assert.equal(pickRowTitle('   ', 'Catalogue', '/u/'), 'Catalogue');
  assert.equal(pickRowTitle(undefined, undefined, '/u/'), '/u/');
  assert.equal(pickRowTitle({ toString: () => 'x' }, null, null), '');
});

test('splitExcerpt keeps Pagefind highlighting and never yields markup', () => {
  assert.deepEqual(splitExcerpt('plain text'), [{ text: 'plain text', mark: false }]);
  assert.deepEqual(splitExcerpt('a <mark>b</mark> c'), [
    { text: 'a ', mark: false },
    { text: 'b', mark: true },
    { text: ' c', mark: false },
  ]);
  // Pagefind escapes page text before adding <mark>; entities decode back to
  // characters that callers set with textContent, so nothing is parsed as HTML.
  assert.deepEqual(splitExcerpt('&lt;script&gt;alert(1)&lt;/script&gt;'), [
    { text: '<script>alert(1)</script>', mark: false },
  ]);
  assert.deepEqual(splitExcerpt('Tom &amp; Jerry &#39;quoted&#39; &#x2014; end'), [
    { text: "Tom & Jerry 'quoted' — end", mark: false },
  ]);
  // An injected attribute or handler can only ever be text.
  assert.deepEqual(splitExcerpt('<img src=x onerror=alert(1)>'), [
    { text: '<img src=x onerror=alert(1)>', mark: false },
  ]);
  // Unbalanced or nested marks don't throw or leak tags.
  assert.deepEqual(splitExcerpt('</mark>stray'), [{ text: 'stray', mark: false }]);
  assert.deepEqual(splitExcerpt('<mark>open'), [{ text: 'open', mark: true }]);
  assert.deepEqual(splitExcerpt('<mark><mark>x</mark></mark>'), [{ text: 'x', mark: true }]);
  assert.deepEqual(splitExcerpt(''), []);
  assert.deepEqual(splitExcerpt(null), []);
  assert.deepEqual(splitExcerpt(undefined), []);
  // Unknown and out-of-range entities are left alone rather than guessed at.
  assert.deepEqual(splitExcerpt('&unknownentity; &#1114112;'), [
    { text: '&unknownentity; &#1114112;', mark: false },
  ]);
});

test('createRequestGate discards everything but the newest request', () => {
  const gate = createRequestGate();
  const first = gate.next();
  assert.equal(gate.isStale(first), false);
  const second = gate.next();
  assert.equal(gate.isStale(first), true, 'an older response must not render');
  assert.equal(gate.isStale(second), false);
  // A bare invalidation (clear, Escape, dismissal) strands the in-flight token.
  gate.next();
  assert.equal(gate.isStale(second), true);
  assert.equal(gate.current(), 3);
});

test('an out-of-order response for an abandoned query is never used', async () => {
  const gate = createRequestGate();
  const specs = forSchoolsScenario();
  const catalogue = catalogueFrom(specs);

  const slow = gate.next();
  const slowWork = new Promise((resolve) => setTimeout(resolve, 10)).then(() => {
    if (gate.isStale(slow)) return 'discarded';
    return 'rendered';
  });
  // The user types again before the slow search settles.
  const fresh = gate.next();
  assert.equal(await slowWork, 'discarded');
  assert.equal(gate.isStale(fresh), false);
  assert.equal(planHeaderRefs([], 'for schools', catalogue, HEADER_LIMIT).length, 0);
});

/* -------------------------------------------------------------------------- */
/* Catalogue generator                                                        */
/* -------------------------------------------------------------------------- */

test('buildCatalogueDocument is compact, deterministic and complete', () => {
  const records = [
    { id: 'b', url: '/blog/post/', title: '  Post   title\n' },
    { id: 'a', url: '/for-schools/', title: 'For schools' },
    { id: 'a', url: '/for-schools/', title: 'Duplicate' },
    { id: 'c', url: '/blog/post/', title: 'Same URL, different id' },
  ];
  const document = buildCatalogueDocument(records);
  assert.equal(document.version, 1);
  assert.deepEqual(document.fields, ['id', 'url', 'title']);
  assert.equal(document.count, 3);
  assert.deepEqual(document.entries, [
    ['b', '/blog/post/', 'Post title'],
    ['c', '/blog/post/', 'Same URL, different id'],
    ['a', '/for-schools/', 'For schools'],
  ]);
  // Same membership, same bytes, whatever order the index enumerated it in.
  const distinct = records.filter((record, index) => index !== 2);
  assert.equal(
    JSON.stringify(buildCatalogueDocument([...distinct].reverse())),
    JSON.stringify(buildCatalogueDocument(distinct)),
  );
  // And the browser helper accepts what the generator produces.
  const catalogue = parseCatalogue(JSON.parse(JSON.stringify(document)));
  assert.equal(catalogue.entries.length, 3);
  assert.deepEqual([...exactTitleIds('for schools', catalogue)], ['a']);
});

test('buildCatalogueDocument fails the build rather than shipping a hole', () => {
  assert.throws(
    () => buildCatalogueDocument([{ id: 'a', url: 'https://elsewhere.example/', title: 'X' }]),
    /not a canonical local URL/,
  );
  assert.throws(() => buildCatalogueDocument([{ url: '/no-id/', title: 'X' }]), /missing result id/);
  assert.deepEqual(buildCatalogueDocument([]).entries, []);
});

test('isCanonicalLocalPath matches the browser-side URL rule', () => {
  for (const value of ['/for-schools/', '/a/b/c/', '/x/?q=1#f']) {
    assert.equal(isCanonicalLocalPath(value), true, value);
    assert.equal(isSafeLocalUrl(value), true, value);
  }
  for (const value of ['//evil/', 'https://evil/', 'javascript:alert(1)', 'rel/path', '']) {
    assert.equal(isCanonicalLocalPath(value), false, value);
    assert.equal(isSafeLocalUrl(value), false, value);
  }
});

test('the generator fetch adapter only reads inside the index directory', async () => {
  const scriptsDir = path.dirname(fileURLToPath(new URL('../scripts/x', import.meta.url)));
  const repoRoot = path.dirname(scriptsDir);
  const indexOnlyFetch = createIndexOnlyFetch(scriptsDir);

  const inside = await indexOnlyFetch(
    new URL('build-search-titles.mjs', new URL('../scripts/', import.meta.url)).href,
  );
  assert.ok((await inside.text()).includes('buildCatalogueDocument'));

  await assert.rejects(
    () => indexOnlyFetch('https://pagefind.app/pagefind.js'),
    /Refused non-file request/,
    'no network, even from the index own client code',
  );
  await assert.rejects(
    () => indexOnlyFetch(new URL('package.json', new URL('file://' + repoRoot + '/')).href),
    /Refused read outside the index/,
  );
});

/* -------------------------------------------------------------------------- */
/* Search scope: OtA content is excluded from both surfaces                   */
/* -------------------------------------------------------------------------- */

test('header planning drops out-of-scope pages without spending a data load', async () => {
  // Eight OtA pages rank above the two searchable ones. Unscoped, they would
  // fill the header's budget and the blog posts would never be seen.
  const specs = [];
  for (let i = 0; i < 8; i += 1) {
    specs.push({ id: 'q' + i, url: '/anonymous_question/q-' + i + '/', title: 'Question ' + i });
  }
  specs.push({ id: 'b1', url: '/blog/one/', title: 'Post one' });
  specs.push({ id: 'g1', url: '/glossary/consent/', title: 'Consent' });

  const catalogue = catalogueFrom(specs);
  const { refs, loads } = makeRefs(specs);

  const planned = planHeaderRefs(refs, 'consent', catalogue, HEADER_LIMIT, searchScope);
  assert.deepEqual(
    planned.map((ref) => ref.id),
    ['b1'],
    'only searchable types survive planning',
  );
  assert.equal(loads.length, 0, 'scoping happens before any .data() call');

  const hydrated = await hydrateRefs(planned);
  assert.deepEqual(loads, ['b1'], 'an excluded page never costs a data load');
  assert.equal(hydrated.length, 1);
});

test('header planning without a scope still returns everything', () => {
  const specs = [
    { id: 'q1', url: '/anonymous_question/periods/', title: 'Periods' },
    { id: 'b1', url: '/blog/one/', title: 'Post one' },
  ];
  const catalogue = catalogueFrom(specs);
  const { refs } = makeRefs(specs);

  assert.deepEqual(
    planHeaderRefs(refs, 'periods', catalogue, HEADER_LIMIT).map((ref) => ref.id),
    ['q1', 'b1'],
    'scoping is opt-in — the planner stays generic',
  );
});

test('an out-of-scope exact title match is excluded, not promoted', () => {
  // Exact-title promotion must not be a back door into the results.
  const specs = [
    { id: 'b1', url: '/blog/one/', title: 'Post one' },
    { id: 'g1', url: '/glossary/consent/', title: 'Consent' },
  ];
  const catalogue = catalogueFrom(specs);
  const { refs } = makeRefs(specs);

  assert.deepEqual(
    planHeaderRefs(refs, 'Consent', catalogue, HEADER_LIMIT, searchScope).map((ref) => ref.id),
    ['b1'],
    'the glossary page is dropped despite being an exact title hit',
  );
});

test('header planning cannot scope what the catalogue does not cover', () => {
  // Documents why the header re-checks scope after hydration: with no
  // catalogue there is no URL to judge a ref by, so nothing is dropped here.
  const specs = [{ id: 'q1', url: '/anonymous_question/periods/', title: 'Periods' }];
  const { refs } = makeRefs(specs);

  assert.deepEqual(
    planHeaderRefs(refs, 'periods', null, HEADER_LIMIT, searchScope).map((ref) => ref.id),
    ['q1'],
    'unknown-type refs survive planning and must be filtered after hydration',
  );
});

test('full search excludes out-of-scope groups and does not count them', () => {
  const specs = [
    { id: 'q1', url: '/anonymous_question/periods/', title: 'Periods' },
    { id: 'g1', url: '/glossary/consent/', title: 'Consent' },
    { id: 'b1', url: '/blog/one/', title: 'Post one' },
    { id: 's1', url: '/services/rse-training/', title: 'RSE training' },
  ];
  const catalogue = catalogueFrom(specs);
  const { refs } = makeRefs(specs);

  const unscoped = planFullSearch(refs, 'consent', catalogue, groupOptions);
  assert.equal(unscoped.total, 4);

  const plan = planFullSearch(refs, 'consent', catalogue, scopedGroupOptions);
  assert.equal(plan.ok, true);
  assert.deepEqual(
    plan.groups.map((group) => group.type),
    ['services', 'blog'],
    'no OtA group is built',
  );
  assert.equal(plan.total, 2, 'excluded pages do not inflate the reported count');
});

test('full search reports an empty plan when every match is out of scope', () => {
  // The surfaces branch on this to say "no results" instead of showing the
  // temporarily-unavailable error, which would be a lie.
  const specs = [
    { id: 'q1', url: '/anonymous_question/periods/', title: 'Periods' },
    { id: 'g1', url: '/glossary/consent/', title: 'Consent' },
  ];
  const catalogue = catalogueFrom(specs);
  const { refs } = makeRefs(specs);

  const plan = planFullSearch(refs, 'periods', catalogue, scopedGroupOptions);
  assert.equal(plan.ok, true, 'an all-excluded result set is a plan, not a failure');
  assert.equal(plan.total, 0);
  assert.deepEqual(plan.groups, []);
});

/* -------------------------------------------------------------------------- */
/* OtA search scope                                                           */
/* -------------------------------------------------------------------------- */

test('pillar hubs are their own type, not "other"', () => {
  // /explained/ pages used to fall through to 'other', which both scopes
  // exclude — so the pillar hubs were findable from neither search surface.
  assert.equal(getContentType('/explained/what-counts-as-losing-your-virginity/'), 'pillar');
  assert.equal(isOtaSearchableType('pillar'), true, 'OtA search can reach a pillar');
  assert.equal(isSearchableType('pillar'), false, 'site search still cannot');
});

test('free resources are their own type, not "other"', () => {
  // Same fault the pillar hubs had. Marking the two /resources/ pages with
  // data-pagefind-body put them in the Pagefind index, but the planner drops
  // any reference whose type is out of scope, and /resources/ fell through to
  // 'other', which neither scope admits: indexed and still unreachable.
  assert.equal(getContentType('/resources/what-do-boys-actually-think/'), 'resources');
  assert.equal(getContentType('/resources/rse-policy-audit-sheet/'), 'resources');
  assert.equal(isSearchableType('resources'), true, 'site search can reach a resource');
  assert.equal(isOtaSearchableType('resources'), false, 'OtA search cannot');
  assert.ok(typeOrder.includes('resources'), 'resources must have a defined position');
});

test('the two search scopes are disjoint', () => {
  // The guarantee both surfaces rely on: a reader is looking either for a
  // service (chrome / B10) or for an answer (OtA). If a type ever appeared in
  // both sets, OtA content would leak into the buyer-facing search — the
  // exact thing the exclusion exists to prevent.
  const everyType = [
    'anonymous_question',
    'pillar',
    'glossary',
    'topics',
    'blog',
    'services',
    'resources',
    'other',
  ];
  for (const type of everyType) {
    assert.ok(
      !(isSearchableType(type) && isOtaSearchableType(type)),
      `${type} must not be in both scopes`,
    );
  }
});

test('OtA scope admits every OtA URL shape and nothing else', () => {
  const inScope = [
    '/anonymous_question/periods/',
    '/explained/what-counts-as-losing-your-virginity/',
    '/glossary/consent/',
  ];
  for (const url of inScope) {
    assert.ok(isOtaSearchableType(getContentType(url)), `${url} should be in OtA scope`);
  }

  const outOfScope = ['/blog/one/', '/services/rse-training/', '/topics/consent/', '/about/'];
  for (const url of outOfScope) {
    assert.ok(!isOtaSearchableType(getContentType(url)), `${url} should not be in OtA scope`);
  }
});

test('otaTypeOrder covers exactly the OtA scope', () => {
  // A type in the scope but missing from the order would still render — via
  // planFullSearch's appearance fallback — but in an unspecified position.
  for (const type of otaTypeOrder) {
    assert.ok(isOtaSearchableType(type), `${type} is ordered but not in scope`);
  }
  assert.equal(otaTypeOrder.length, 3);
  assert.ok(!otaTypeOrder.some((t) => typeOrder.indexOf(t) === -1), 'types stay known to typeOrder');
});
