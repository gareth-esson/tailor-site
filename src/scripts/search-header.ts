/**
 * Header search [A4] — client behaviour.
 *
 * Extracted from the `<script is:inline>` block that used to live in
 * SearchBar.astro. The markup, classes and styles are unchanged; the script
 * is now a bundled module so it can share `src/lib/search-client.ts` and the
 * `src/lib/searchTypes.ts` taxonomy with the B10 search page instead of
 * duplicating both.
 *
 * Deliberately different from B10: 200ms debounce, 2-character minimum. This
 * is a peek surface in a cramped popover — it must feel snappy and must not
 * react to 1-character noise. Do not "unify" the two by accident.
 *
 * Budget: at most TOP_RESULTS `.data()` loads per settled query. The
 * catalogue lets us decide *which* 8 results to load — promoting an exact
 * page-title match Pagefind ranked far down — before loading any of them.
 */

import {
  getContentType,
  isSearchableType,
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
  planHeaderRefs,
  splitExcerpt,
  type ScopeOptions,
  type CatalogueEntry,
  type PagefindModule,
  type PagefindResponse,
  type PagefindResultData,
  type PagefindResultRef,
  type SearchCatalogue,
} from '../lib/search-client';

declare global {
  interface Window {
    trackEvent?: (name: string, payload: Record<string, unknown>) => void;
  }
}

/**
 * Search scope, shared with the planner. OtA content (anonymous questions,
 * glossary) is out of scope for this box on every page, including OtA pages
 * — see SEARCHABLE_TYPES in searchTypes.ts for why.
 */
const SEARCH_SCOPE: ScopeOptions = {
  getType: getContentType,
  isAllowedType: (type) => isSearchableType(type as ContentType),
};

/** Hard ceiling on rows shown — and therefore on data loads — per query. */
const TOP_RESULTS = 8;
const DEBOUNCE_MS = 200;
const MIN_QUERY_LENGTH = 2;

/**
 * Outside-click dismissal is bound to `document` once per page and always
 * talks to the live controller, so repeated `astro:after-swap` inits can't
 * stack listeners that hold stale elements.
 */
let dismissActiveBar: (() => void) | null = null;
let documentDismissBound = false;

interface HeaderRow {
  url: string | null;
  title: string;
  excerpt: unknown;
}

/**
 * Resolve a hydrated row's URL and content type the one way. Both the scope
 * backstop and the renderer call this, so a row can never be admitted as one
 * type and then displayed under another.
 */
function resolveRow(
  ref: PagefindResultRef,
  data: PagefindResultData,
  catalogue: SearchCatalogue | null,
): { url: string | null; entry: CatalogueEntry | undefined; type: ContentType } {
  const id = typeof ref.id === 'string' ? ref.id : null;
  const entry = id && catalogue ? catalogue.byId.get(id) : undefined;
  const url = pickRowUrl(data.url, entry?.url);
  return { url, entry, type: getContentType(url ?? entry?.url ?? '') };
}

export function initSearchHeader(): void {
  const bar = document.getElementById('search-bar');
  if (!bar) return;

  // Idempotency guard — re-running on astro:after-swap must not double-bind.
  const guarded = bar as HTMLElement & { __searchInit?: boolean };
  if (guarded.__searchInit) return;
  guarded.__searchInit = true;

  const input = document.getElementById('search-bar-input') as HTMLInputElement | null;
  const inputWrap = document.getElementById('search-bar-input-wrap');
  const dropdown = document.getElementById('search-dropdown');
  const resultsContainer = document.getElementById('search-results');
  const seeAllLink = document.getElementById('search-see-all') as HTMLAnchorElement | null;
  const toggle = bar.querySelector<HTMLButtonElement>('.search-bar__toggle');
  const closeBtn = bar.querySelector<HTMLButtonElement>('.search-bar__close');

  const gate = createRequestGate();
  let pagefind: PagefindModule | null = null;
  let pagefindFailed = false;
  let debounceTimer: ReturnType<typeof setTimeout> | undefined;

  async function loadPagefind(): Promise<PagefindModule | null> {
    if (pagefind) return pagefind;
    if (pagefindFailed) return null;
    try {
      const mod = await loadPagefindModule();
      if (typeof mod.init === 'function') await mod.init();
      pagefind = mod;
      return mod;
    } catch {
      pagefindFailed = true;
      return null;
    }
  }

  /**
   * Abandon anything in flight. Called the moment the user changes the query
   * or dismisses the dropdown — not after the debounce — so a slow response
   * for an old query can never paint over a newer state.
   */
  function invalidate(): void {
    clearTimeout(debounceTimer);
    gate.next();
  }

  function hideDropdown(): void {
    dropdown?.setAttribute('hidden', '');
  }

  function collapseMobileInput(): void {
    inputWrap?.classList.remove('is-expanded');
    toggle?.setAttribute('aria-expanded', 'false');
  }

  function setSeeAllVisible(visible: boolean, query: string): void {
    if (!seeAllLink) return;
    if (visible) {
      seeAllLink.href = '/search?q=' + encodeURIComponent(query);
      seeAllLink.style.display = '';
    } else {
      seeAllLink.style.display = 'none';
    }
  }

  /** One-line notice in the existing empty-state surface. */
  function renderNotice(message: string): void {
    if (!resultsContainer) return;
    const notice = document.createElement('div');
    notice.className = 'search-bar__empty';
    notice.textContent = message;
    resultsContainer.replaceChildren(notice);
  }

  function clearResults(): void {
    resultsContainer?.replaceChildren();
  }

  /** Genuine empty result: the query matched nothing this box can show. */
  function showNoResults(query: string): void {
    renderNotice('No results for “' + query + '”');
    dropdown?.removeAttribute('hidden');
    setSeeAllVisible(false, query);
  }

  function showUnavailable(): void {
    renderNotice('Search is temporarily unavailable.');
    dropdown?.removeAttribute('hidden');
    setSeeAllVisible(false, '');
  }

  /** Pagefind's `<mark>` highlighting, rebuilt as nodes instead of HTML. */
  function appendExcerpt(target: HTMLElement, excerpt: unknown): void {
    for (const segment of splitExcerpt(excerpt)) {
      if (segment.mark) {
        const mark = document.createElement('mark');
        mark.textContent = segment.text;
        target.appendChild(mark);
      } else {
        target.appendChild(document.createTextNode(segment.text));
      }
    }
  }

  function bindResultClick(el: HTMLAnchorElement, position: number): void {
    el.addEventListener(
      'click',
      () => {
        if (typeof window.trackEvent !== 'function') return;
        window.trackEvent('site_search_result_click', {
          query: el.getAttribute('data-query'),
          result_slug: el.getAttribute('data-slug'),
          result_type: el.getAttribute('data-type'),
          position,
        });
      },
      { once: true },
    );
  }

  function renderResults(
    query: string,
    hydrated: Array<{ ref: PagefindResultRef; data: PagefindResultData }>,
    catalogue: SearchCatalogue | null,
  ): void {
    if (!resultsContainer) return;

    // Group by type, first-appearance order, exactly as the inline script did
    // — a Map keeps insertion order. The plan has already put any exact
    // page-title match first, so its group leads the dropdown.
    const grouped = new Map<ContentType, HeaderRow[]>();
    for (const { ref, data } of hydrated) {
      const { url, entry, type } = resolveRow(ref, data, catalogue);
      const title = pickRowTitle(data.meta?.title, entry?.title, url);
      const row: HeaderRow = { url, title, excerpt: data.excerpt };
      const bucket = grouped.get(type);
      if (bucket) bucket.push(row);
      else grouped.set(type, [row]);
    }

    const fragment = document.createDocumentFragment();
    let position = 0;

    for (const [type, rows] of grouped) {
      const groupEl = document.createElement('div');
      groupEl.className = 'search-bar__group';

      const labelEl = document.createElement('div');
      labelEl.className = 'search-bar__group-label';
      labelEl.textContent = typeLabels[type];
      groupEl.appendChild(labelEl);

      for (const row of rows) {
        position += 1;
        // With no safe local URL — never true for a Pagefind `--site` index,
        // but we don't emit an href we haven't validated — show it unlinked.
        const rowEl = document.createElement(row.url ? 'a' : 'div');
        rowEl.className = 'search-bar__result';
        if (row.url && rowEl instanceof HTMLAnchorElement) {
          rowEl.href = row.url;
          rowEl.setAttribute('data-query', query);
          rowEl.setAttribute('data-type', type);
          rowEl.setAttribute('data-slug', row.url);
          bindResultClick(rowEl, position);
        }

        const titleEl = document.createElement('span');
        titleEl.className = 'search-bar__result-title';
        titleEl.textContent = row.title;
        rowEl.appendChild(titleEl);

        const excerptEl = document.createElement('span');
        excerptEl.className = 'search-bar__result-excerpt';
        appendExcerpt(excerptEl, row.excerpt);
        rowEl.appendChild(excerptEl);

        groupEl.appendChild(rowEl);
      }

      fragment.appendChild(groupEl);
    }

    resultsContainer.replaceChildren(fragment);
  }

  async function doSearch(query: string, token: number): Promise<void> {
    if (!query || query.length < MIN_QUERY_LENGTH) {
      hideDropdown();
      return;
    }

    // The catalogue resolves to null on any failure, so this never rejects
    // and search is never blocked on the catalogue's availability.
    const [pf, catalogue] = await Promise.all([loadPagefind(), loadCatalogue()]);
    if (gate.isStale(token)) return;

    if (!pf) {
      showUnavailable();
      return;
    }

    let response: PagefindResponse | null = null;
    try {
      response = await pf.search(query);
    } catch {
      if (gate.isStale(token)) return;
      showUnavailable();
      return;
    }
    if (gate.isStale(token)) return;

    if (!response || !Array.isArray(response.results)) {
      showUnavailable();
      return;
    }

    if (response.results.length === 0) {
      showNoResults(query);
      return;
    }

    // Plan the whole in-scope set (limit -1), then cut to the budget. The
    // uncut length is the honest "matches in this search's scope" count for
    // analytics, and costs no `.data()` loads to obtain.
    const inScope = planHeaderRefs(response.results, query, catalogue, -1, SEARCH_SCOPE);

    // Pagefind matched pages, but every one of them is out of scope. That is
    // an empty result for this box, not a failure.
    if (inScope.length === 0) {
      showNoResults(query);
      return;
    }

    const hydrated = await hydrateRefs(inScope.slice(0, TOP_RESULTS));
    if (gate.isStale(token)) return;

    // Results exist but none of them would load: a data failure, not an empty
    // result set. Never claim "no results" for that.
    if (hydrated.length === 0) {
      showUnavailable();
      return;
    }

    // Scope backstop against the authoritative hydrated URL. The planner can
    // only scope refs the catalogue knows; with no catalogue it scopes none,
    // so without this an OtA page would still reach the dropdown whenever
    // /search-titles.json failed to load.
    const visible = hydrated.filter(({ ref, data }) =>
      isSearchableType(resolveRow(ref, data, catalogue).type),
    );

    if (visible.length === 0) {
      showNoResults(query);
      return;
    }

    renderResults(query, visible, catalogue);
    setSeeAllVisible(true, query);
    dropdown?.removeAttribute('hidden');

    if (typeof window.trackEvent === 'function') {
      window.trackEvent('site_search_query', {
        query,
        result_count: inScope.length,
        source_page: window.location.pathname,
      });
    }
  }

  if (input) {
    input.addEventListener('input', () => {
      invalidate();
      const value = input.value;
      if (value.trim().length < MIN_QUERY_LENGTH) {
        hideDropdown();
        clearResults();
        return;
      }
      debounceTimer = setTimeout(() => {
        void doSearch(value.trim(), gate.next());
      }, DEBOUNCE_MS);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        invalidate();
        hideDropdown();
        clearResults();
        input.blur();
        collapseMobileInput();
      }
      if (e.key === 'Enter' && input.value.trim()) {
        invalidate();
        window.location.href = '/search?q=' + encodeURIComponent(input.value.trim());
      }
    });
  }

  toggle?.addEventListener('click', () => {
    inputWrap?.classList.add('is-expanded');
    toggle.setAttribute('aria-expanded', 'true');
    input?.focus();
  });

  closeBtn?.addEventListener('click', () => {
    invalidate();
    collapseMobileInput();
    if (input) input.value = '';
    hideDropdown();
    clearResults();
  });

  dismissActiveBar = () => {
    invalidate();
    hideDropdown();
    collapseMobileInput();
  };

  if (!documentDismissBound) {
    documentDismissBound = true;
    document.addEventListener('click', (e) => {
      const liveBar = document.getElementById('search-bar');
      const target = e.target;
      if (liveBar && target instanceof Node && liveBar.contains(target)) return;
      dismissActiveBar?.();
    });
  }
}
