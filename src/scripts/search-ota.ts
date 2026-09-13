/**
 * Okay to Ask search — client behaviour for /questions/search.
 *
 * The OtA sibling of search-page.ts. Same helpers, same hydration budget,
 * different scope (`isOtaSearchableType` / `otaTypeOrder`) and different
 * copy register — this surface speaks to a young person, not a buyer.
 *
 * Deliberately kept as its own file rather than parameterising B10: the two
 * surfaces share `search-client.ts`, which is where the logic worth sharing
 * already lives. What differs here is scope, copy and the safeguarding
 * reveal, and folding three conditionals into B10 to save a file would make
 * both harder to read.
 *
 * Debounce/min-length match B10 (300ms, 1 char): this is a committed
 * surface, the reader is here on purpose.
 */

import {
  getContentType,
  isOtaSearchableType,
  otaTypeOrder,
  typeLabels,
  type ContentType,
} from '../lib/searchTypes';
import {
  createRequestGate,
  hydrateRefs,
  loadCatalogue,
  loadPagefindModule,
  pickRowTitle,
  pickRowUrl,
  planFullSearch,
  splitExcerpt,
  type PagefindModule,
  type PagefindResponse,
  type PagefindResultData,
  type PagefindResultRef,
  type PlannedGroup,
  type SearchCatalogue,
} from '../lib/search-client';

declare global {
  interface Window {
    trackEvent?: (name: string, payload: Record<string, unknown>) => void;
  }
}

const ROWS_BEFORE_TOGGLE = 5;

export function initOtaSearch(): void {
  const input = document.getElementById('ota-search-input') as HTMLInputElement | null;
  const resultsContainer = document.getElementById('ota-search-results');
  const meta = document.getElementById('ota-search-meta');
  const emptyState = document.getElementById('ota-search-empty');
  const signposting = document.getElementById('ota-search-signposting');
  if (!input || !resultsContainer || !meta || !emptyState) return;

  // Idempotency guard — re-running on astro:after-swap must not double-bind.
  if ((input as HTMLInputElement & { __otaSearchInit?: boolean }).__otaSearchInit) return;
  (input as HTMLInputElement & { __otaSearchInit?: boolean }).__otaSearchInit = true;

  const gate = createRequestGate();
  let pagefind: PagefindModule | null = null;
  let pagefindLoadFailed = false;
  let lastFiredQuery: string | null = null;
  let debounceTimer: ReturnType<typeof setTimeout> | undefined;

  async function loadPagefind(): Promise<PagefindModule | null> {
    if (pagefind) return pagefind;
    if (pagefindLoadFailed) return null;
    try {
      const mod = await loadPagefindModule();
      if (typeof mod.init === 'function') await mod.init();
      pagefind = mod;
      return mod;
    } catch {
      pagefindLoadFailed = true;
      return null;
    }
  }

  /** Abandon anything in flight — called on the keystroke, not after the debounce. */
  function invalidate(): void {
    clearTimeout(debounceTimer);
    gate.next();
  }

  function setSignpostingVisible(visible: boolean): void {
    if (!signposting) return;
    if (visible) signposting.removeAttribute('hidden');
    else signposting.setAttribute('hidden', '');
  }

  function clearResults(): void {
    resultsContainer!.replaceChildren();
    meta!.setAttribute('hidden', '');
    emptyState!.setAttribute('hidden', '');
    emptyState!.replaceChildren();
  }

  /**
   * Build an element tree rather than an HTML string. Nothing here is user
   * content, but the row builder below sets Pagefind metadata as text for
   * good reason, and mixing the two styles on one surface invites a mistake.
   */
  function el(tag: string, className: string, text?: string): HTMLElement {
    const node = document.createElement(tag);
    node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function renderUnavailable(): void {
    clearResults();
    setSignpostingVisible(false);
    const box = el('div', 'ota-search-unavailable');
    box.setAttribute('role', 'status');
    box.appendChild(
      el('p', 'ota-search-unavailable__text', "Search isn't working right now. Sorry."),
    );
    const actions = el('div', 'ota-search-unavailable__actions');
    const browse = document.createElement('a');
    browse.className = 'btn btn--std btn--tint has-icon-hover';
    browse.href = '/questions/';
    browse.textContent = 'Browse all the questions';
    actions.appendChild(browse);
    box.appendChild(actions);
    resultsContainer!.replaceChildren(box);
  }

  /**
   * Nothing matched. This is the one state where the reader is at a dead end
   * — they asked something in their own words and the site gave them nothing
   * back — so it's the one state that offers the support services.
   */
  function renderNoResults(query: string): void {
    resultsContainer!.replaceChildren();
    meta!.setAttribute('hidden', '');

    const box = el('div', 'ota-search-no-results');
    const title = el('h2', 'ota-search-no-results__title');
    title.append(
      document.createTextNode('Nothing came up for '),
      (() => {
        const q = el('em', 'ota-search-no-results__query');
        q.textContent = `“${query}”`;
        return q;
      })(),
    );
    box.appendChild(title);
    box.appendChild(
      el(
        'p',
        'ota-search-no-results__intro',
        'That might be the words rather than the question. Things that help:',
      ),
    );
    const list = el('ul', 'ota-search-no-results__suggestions');
    for (const tip of [
      'Try fewer words, or a different word for the same thing.',
      'Check the spelling.',
      'Browse the questions by category instead.',
    ]) {
      list.appendChild(el('li', '', tip));
    }
    box.appendChild(list);

    const actions = el('div', 'ota-search-no-results__actions');
    const browse = document.createElement('a');
    browse.className = 'btn btn--std btn--tint has-icon-hover';
    browse.href = '/questions/';
    browse.textContent = 'Browse all the questions';
    actions.appendChild(browse);
    box.appendChild(actions);

    emptyState!.replaceChildren(box);
    emptyState!.removeAttribute('hidden');
    setSignpostingVisible(true);
  }

  /** Pagefind's `<mark>` highlighting, rebuilt as nodes instead of HTML. */
  function appendExcerpt(target: HTMLElement, excerpt: unknown): boolean {
    const segments = splitExcerpt(excerpt);
    for (const segment of segments) {
      if (segment.mark) {
        const mark = document.createElement('mark');
        mark.textContent = segment.text;
        target.appendChild(mark);
      } else {
        target.appendChild(document.createTextNode(segment.text));
      }
    }
    return segments.length > 0;
  }

  /**
   * One result row. Titles and URLs are raw Pagefind metadata, so the title
   * is set as text and the href is only emitted for a validated canonical
   * local path; anything else renders unlinked rather than as a live link.
   */
  function buildRow(
    data: PagefindResultData,
    entry: { url: string; title: string } | undefined,
    type: ContentType,
    query: string,
    position: number,
  ): HTMLElement {
    const url = pickRowUrl(data.url, entry?.url);
    const title = pickRowTitle(data.meta?.title, entry?.title, url);

    const rowEl = document.createElement(url ? 'a' : 'div');
    rowEl.className = 'ota-search-row';
    if (url && rowEl instanceof HTMLAnchorElement) {
      rowEl.href = url;
      rowEl.addEventListener(
        'click',
        () => {
          if (typeof window.trackEvent !== 'function') return;
          window.trackEvent('ota_search_result_click', {
            query,
            result_slug: url,
            result_type: type,
            position,
          });
        },
        { once: true },
      );
    }

    const titleEl = el('span', 'ota-search-row__title');
    titleEl.textContent = title;
    rowEl.appendChild(titleEl);

    const excerptEl = el('span', 'ota-search-row__excerpt');
    if (appendExcerpt(excerptEl, data.excerpt)) rowEl.appendChild(excerptEl);

    return rowEl;
  }

  function buildShowAllButton(
    query: string,
    token: number,
    group: PlannedGroup<PagefindResultRef>,
    type: ContentType,
    groupId: string,
    catalogue: SearchCatalogue,
    deferred: HTMLLIElement[],
  ): HTMLButtonElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'ota-search-group__toggle';
    button.setAttribute('data-toggle-for', groupId);
    button.setAttribute('aria-expanded', 'false');
    button.textContent = `Show all ${group.total}`;

    const remaining = group.refs.slice(ROWS_BEFORE_TOGGLE);
    let loading = false;

    button.addEventListener('click', () => {
      if (loading) return;
      loading = true;
      button.disabled = true;
      void hydrateRefs(remaining)
        .then((hydrated) => {
          loading = false;
          button.disabled = false;
          if (gate.isStale(token)) return;
          if (hydrated.length === 0) return; // leave the button for a retry
          const dataByRef = new Map<PagefindResultRef, PagefindResultData>();
          for (const pair of hydrated) dataByRef.set(pair.ref, pair.data);

          deferred.forEach((item, index) => {
            const ref = remaining[index];
            if (!ref) return;
            const data = dataByRef.get(ref) ?? {};
            const id = typeof ref.id === 'string' ? ref.id : null;
            item.replaceChildren(
              buildRow(
                data,
                id ? catalogue.byId.get(id) : undefined,
                type,
                query,
                ROWS_BEFORE_TOGGLE + index + 1,
              ),
            );
            item.removeAttribute('hidden');
          });

          button.setAttribute('aria-expanded', 'true');
          button.setAttribute('hidden', '');
        })
        .catch(() => {
          loading = false;
          button.disabled = false;
        });
    });

    return button;
  }

  function renderResults(
    query: string,
    token: number,
    plan: { total: number; groups: Array<PlannedGroup<PagefindResultRef>> },
    catalogue: SearchCatalogue,
    initialData: Map<PagefindResultRef, PagefindResultData>,
  ): void {
    emptyState!.setAttribute('hidden', '');
    emptyState!.replaceChildren();
    setSignpostingVisible(false);

    const fragment = document.createDocumentFragment();

    for (const group of plan.groups) {
      const type = group.type as ContentType;
      const label = typeLabels[type] ?? typeLabels.other;
      const groupId = `ota-group-${type}`;

      const section = document.createElement('section');
      section.className = 'ota-search-group';
      section.setAttribute('data-group-type', type);

      const heading = el('h2', 'ota-search-group__heading');
      heading.appendChild(document.createTextNode(`${label} `));
      const count = el('span', 'ota-search-group__count', `(${group.total})`);
      heading.appendChild(count);
      section.appendChild(heading);

      const list = el('ul', 'ota-search-group__list');
      const deferred: HTMLLIElement[] = [];

      group.refs.forEach((ref, index) => {
        const item = document.createElement('li');
        item.className = 'ota-search-group__item';
        if (index < ROWS_BEFORE_TOGGLE) {
          // The catalogue still supplies the real title and destination when
          // a fragment fails; only the excerpt is unavailable.
          const data = initialData.get(ref) ?? {};
          const id = typeof ref.id === 'string' ? ref.id : null;
          item.appendChild(
            buildRow(data, id ? catalogue.byId.get(id) : undefined, type, query, index + 1),
          );
        } else {
          item.setAttribute('data-group', groupId);
          item.setAttribute('hidden', '');
          deferred.push(item);
        }
        list.appendChild(item);
      });

      section.appendChild(list);
      if (deferred.length > 0) {
        section.appendChild(
          buildShowAllButton(query, token, group, type, groupId, catalogue, deferred),
        );
      }
      fragment.appendChild(section);
    }

    resultsContainer!.replaceChildren(fragment);

    meta!.textContent =
      (plan.total === 1 ? '1 answer' : `${plan.total} answers`) + ` for “${query}”`;
    meta!.removeAttribute('hidden');
  }

  function syncUrl(query: string): void {
    const url = new URL(window.location.href);
    if (query) url.searchParams.set('q', query);
    else url.searchParams.delete('q');
    history.replaceState(null, '', url.toString());
  }

  async function runSearch(query: string): Promise<void> {
    const token = gate.next();
    const trimmed = query.trim();

    if (!trimmed) {
      clearResults();
      setSignpostingVisible(false);
      syncUrl('');
      lastFiredQuery = null;
      return;
    }

    // The catalogue resolves to null on any failure, so this never rejects.
    const [pf, catalogue] = await Promise.all([loadPagefind(), loadCatalogue()]);
    if (gate.isStale(token)) return;

    if (!pf) {
      renderUnavailable();
      syncUrl(trimmed);
      return;
    }

    let response: PagefindResponse | null = null;
    try {
      response = await pf.search(trimmed);
    } catch {
      if (gate.isStale(token)) return;
      renderUnavailable();
      syncUrl(trimmed);
      return;
    }
    if (gate.isStale(token)) return;

    if (!response || !Array.isArray(response.results)) {
      renderUnavailable();
      syncUrl(trimmed);
      return;
    }

    const total = response.results.length;

    const plan = planFullSearch(response.results, trimmed, catalogue, {
      getType: getContentType,
      typeOrder: otaTypeOrder,
      // The complement of the chrome/B10 scope — see searchTypes.ts.
      isAllowedType: (type) => isOtaSearchableType(type as ContentType),
    });

    // Matches *in scope*, so an out-of-scope page never inflates the count.
    const scopedTotal = plan.ok ? plan.total : total;

    if (lastFiredQuery !== trimmed && typeof window.trackEvent === 'function') {
      window.trackEvent('ota_search_query', {
        query: trimmed,
        result_count: scopedTotal,
        source_page: '/questions/search',
      });
      lastFiredQuery = trimmed;
    }

    // Nothing matched, or everything that matched was out of scope. Both are
    // an empty result for this search, not a failure.
    if (total === 0 || (plan.ok && plan.total === 0)) {
      renderNoResults(trimmed);
      syncUrl(trimmed);
      return;
    }

    // No usable catalogue for this result set. Show the unavailable surface
    // rather than quietly hydrating every result on every keystroke.
    if (!plan.ok || !catalogue) {
      renderUnavailable();
      syncUrl(trimmed);
      return;
    }

    const initialRefs: PagefindResultRef[] = [];
    for (const group of plan.groups) {
      for (const ref of group.refs.slice(0, ROWS_BEFORE_TOGGLE)) initialRefs.push(ref);
    }

    const hydrated = await hydrateRefs(initialRefs);
    if (gate.isStale(token)) return;

    // Results exist but nothing would load: a data failure, not an empty
    // result set. Never claim "nothing came up" for that.
    if (hydrated.length === 0) {
      renderUnavailable();
      syncUrl(trimmed);
      return;
    }

    const initialData = new Map<PagefindResultRef, PagefindResultData>();
    for (const pair of hydrated) initialData.set(pair.ref, pair.data);

    renderResults(trimmed, token, plan, catalogue, initialData);
    syncUrl(trimmed);
  }

  input.addEventListener('input', () => {
    invalidate();
    const value = input.value;
    debounceTimer = setTimeout(() => void runSearch(value), 300);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && input.value) {
      input.value = '';
      invalidate();
      void runSearch('');
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if ('ontouchstart' in window) input.blur();
    }
  });

  // Initial render. The shell is prerendered with an empty input, so ?q= is
  // read client-side here to restore the query on load or back-nav.
  const initial = (new URLSearchParams(window.location.search).get('q') ?? '').trim();
  if (initial) {
    input.value = initial;
    void runSearch(initial);
  } else {
    input.focus();
  }
}
