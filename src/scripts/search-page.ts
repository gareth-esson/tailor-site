/**
 * Search results page [B10] — client behaviour.
 *
 * Owns: debounced query, lazy Pagefind load, grouped rendering, per-group
 * "Show all" toggle, analytics, URL sync, clear-button state, no-results
 * rendering, error fallback.
 *
 * Debounce is 300ms and min-query-length is 1 char — deliberately different
 * from A4 (200ms / 2 chars). A4 is a peek surface that must feel snappy and
 * avoid 1-char noise in a cramped popover; B10 is a committed surface where
 * the user is here on purpose and a 1-char query is legitimate. Do not
 * "unify" the two by accident.
 *
 * Hydration: Pagefind hands back cheap result references; the generated
 * catalogue (`src/lib/search-client.ts`) supplies each reference's URL and
 * title, so grouping, ordering and counting all happen before any `.data()`
 * call. Only the rows actually on screen are fetched — at most
 * ROWS_BEFORE_TOGGLE per group — and "Show all" fetches that group's
 * remainder on demand. A query that matches 300 pages no longer drags 300
 * fragment requests behind every keystroke.
 */

import {
  getContentType,
  isSearchableType,
  typeLabels,
  typeOrder,
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

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function initSearchPage(): void {
  const input = document.getElementById('search-page-input') as HTMLInputElement | null;
  const clearBtn = document.getElementById('search-page-clear') as HTMLButtonElement | null;
  const resultsContainer = document.getElementById('search-page-results');
  const meta = document.getElementById('search-page-meta');
  const emptyState = document.getElementById('search-page-empty');
  const footerCta = document.getElementById('search-page-footer-cta');
  if (!input || !resultsContainer || !meta || !emptyState) return;

  // Idempotency guard — re-running on astro:after-swap must not double-bind.
  if ((input as HTMLInputElement & { __searchInit?: boolean }).__searchInit) return;
  (input as HTMLInputElement & { __searchInit?: boolean }).__searchInit = true;

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

  /**
   * Abandon anything in flight. Called the moment the query changes — on the
   * keystroke, not after the debounce — and on clear/Escape, so a slow or
   * out-of-order response can never render over a newer state.
   */
  function invalidate(): void {
    clearTimeout(debounceTimer);
    gate.next();
  }

  function setFooterCtaVisible(visible: boolean): void {
    if (!footerCta) return;
    if (visible) footerCta.removeAttribute('hidden');
    else footerCta.setAttribute('hidden', '');
  }

  function setClearBtnVisible(visible: boolean): void {
    if (!clearBtn) return;
    if (visible) clearBtn.removeAttribute('hidden');
    else clearBtn.setAttribute('hidden', '');
  }

  function renderPagefindError(): void {
    resultsContainer!.innerHTML =
      '<div class="search-page__error" role="status">' +
      '<p>Search is temporarily unavailable. Try ' +
      '<a href="/topics/">browsing topics</a> or ' +
      '<a href="/questions/">all questions</a> instead.</p>' +
      '</div>';
    meta!.setAttribute('hidden', '');
    emptyState!.setAttribute('hidden', '');
    emptyState!.innerHTML = '';
  }

  function renderNoResults(query: string): void {
    resultsContainer!.innerHTML = '';
    meta!.setAttribute('hidden', '');
    const safeQuery = escapeHtml(query);
    emptyState!.innerHTML =
      '<div class="search-no-results">' +
        '<h2 class="search-no-results__title">No results for &ldquo;' + safeQuery + '&rdquo;</h2>' +
        '<p class="search-no-results__intro">A few things to try:</p>' +
        '<ul class="search-no-results__suggestions">' +
          '<li>Check spelling, or try a shorter or more general word.</li>' +
          '<li>Browse questions organised by topic.</li>' +
          '<li>Read the glossary for clear definitions.</li>' +
        '</ul>' +
        '<div class="search-no-results__actions">' +
          '<a href="/topics/" class="btn btn--std btn--outline has-icon-hover">Browse topics</a>' +
          '<a href="/questions/" class="btn btn--std btn--outline has-icon-hover">View all questions</a>' +
        '</div>' +
        '<hr class="search-no-results__divider" />' +
        '<p class="search-no-results__escape">Looking for a service? Get in touch and we&rsquo;ll help.</p>' +
        '<div class="search-no-results__actions">' +
          '<a href="/contact" class="btn btn--std btn--primary has-icon-hover">Get in touch</a>' +
        '</div>' +
      '</div>';
    emptyState!.removeAttribute('hidden');
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
    rowEl.className = 'search-result-row';
    if (url && rowEl instanceof HTMLAnchorElement) {
      rowEl.href = url;
      rowEl.setAttribute('data-query', query);
      rowEl.setAttribute('data-type', type);
      rowEl.setAttribute('data-position', String(position));
      rowEl.addEventListener(
        'click',
        () => {
          if (typeof window.trackEvent !== 'function') return;
          window.trackEvent('site_search_result_click', {
            query: rowEl.getAttribute('data-query'),
            result_slug: rowEl.getAttribute('href'),
            result_type: rowEl.getAttribute('data-type'),
            position: Number(rowEl.getAttribute('data-position')),
          });
        },
        { once: true },
      );
    }

    const titleEl = document.createElement('span');
    titleEl.className = 'search-result-row__title';
    titleEl.textContent = title;
    rowEl.appendChild(titleEl);

    const excerptEl = document.createElement('span');
    excerptEl.className = 'search-result-row__excerpt';
    if (appendExcerpt(excerptEl, data.excerpt)) rowEl.appendChild(excerptEl);

    return rowEl;
  }

  function renderResults(
    query: string,
    token: number,
    plan: { total: number; groups: Array<PlannedGroup<PagefindResultRef>> },
    catalogue: SearchCatalogue,
    initialData: Map<PagefindResultRef, PagefindResultData>,
  ): void {
    emptyState!.setAttribute('hidden', '');
    emptyState!.innerHTML = '';

    const fragment = document.createDocumentFragment();

    for (const group of plan.groups) {
      const type = group.type as ContentType;
      const label = typeLabels[type] ?? typeLabels.other;
      const groupId = 'group-' + type;

      const section = document.createElement('section');
      section.className = 'search-result-group';
      section.setAttribute('data-group-type', type);

      const heading = document.createElement('h2');
      heading.className = 'search-result-group__heading';
      // The heading has always been label + NBSP + the (count) span.
      heading.appendChild(document.createTextNode(label + '\u00a0'));
      const count = document.createElement('span');
      count.className = 'search-result-group__count';
      count.textContent = '(' + group.total + ')';
      heading.appendChild(count);
      section.appendChild(heading);

      const list = document.createElement('ul');
      list.className = 'search-result-group__list';

      const deferred: HTMLLIElement[] = [];
      group.refs.forEach((ref, index) => {
        const item = document.createElement('li');
        item.className = 'search-result-group__item';
        if (index < ROWS_BEFORE_TOGGLE) {
          // The catalogue still supplies the real title and destination
          // when this fragment fails; only its excerpt is unavailable.
          const data = initialData.get(ref) ?? {};
          const id = typeof ref.id === 'string' ? ref.id : null;
          item.appendChild(
            buildRow(data, id ? catalogue.byId.get(id) : undefined, type, query, index + 1),
          );
        } else {
          // Placeholder for a row "Show all" will fetch. Rendering the full
          // set of <li> up front keeps the list's last-child border identical
          // to the previous render-everything-then-hide behaviour.
          item.setAttribute('data-group', groupId);
          item.setAttribute('hidden', '');
          deferred.push(item);
        }
        list.appendChild(item);
      });

      section.appendChild(list);

      if (deferred.length > 0) {
        section.appendChild(
          buildShowAllButton(query, token, group, type, label, groupId, catalogue, deferred),
        );
      }

      fragment.appendChild(section);
    }

    resultsContainer!.replaceChildren(fragment);

    const count = plan.total;
    meta!.textContent =
      (count === 1 ? '1 result' : count + ' results') + ' for “' + query + '”';
    meta!.removeAttribute('hidden');
  }

  /**
   * "Show all" now fetches the group's remaining rows instead of unhiding
   * rows that were already fetched. The click is tied to the query
   * generation that rendered it, so a completion that lands after the user
   * has typed again is discarded.
   */
  function buildShowAllButton(
    query: string,
    token: number,
    group: PlannedGroup<PagefindResultRef>,
    type: ContentType,
    label: string,
    groupId: string,
    catalogue: SearchCatalogue,
    deferred: HTMLLIElement[],
  ): HTMLButtonElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'search-result-group__toggle';
    button.setAttribute('data-toggle-for', groupId);
    button.setAttribute('aria-expanded', 'false');
    button.textContent = 'Show all ' + group.total + ' ' + label + ' results';

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

  // Swap hero title/lede to reflect whether the user has typed a query.
  // The Astro page renders both variants; we toggle their `hidden` attrs
  // and fill in the quoted query on the "active" title.
  function setHeroState(query: string): void {
    const titleEmpty = document.querySelector<HTMLElement>('[data-search-title="empty"]');
    const titleActive = document.querySelector<HTMLElement>('[data-search-title="active"]');
    const ledeEmpty = document.querySelector<HTMLElement>('[data-search-lede="empty"]');
    const ledeActive = document.querySelector<HTMLElement>('[data-search-lede="active"]');
    const titleQuery = document.querySelector<HTMLElement>('[data-search-title-query]');
    const active = query.trim().length > 0;
    if (titleEmpty) titleEmpty.hidden = active;
    if (titleActive) titleActive.hidden = !active;
    if (ledeEmpty) ledeEmpty.hidden = active;
    if (ledeActive) ledeActive.hidden = !active;
    if (titleQuery) titleQuery.textContent = `“${query.trim()}”`;
    // Also update the tab title so the browser history entry is meaningful.
    document.title = active
      ? `Search: "${query.trim()}" — Tailor RSE`
      : 'Search — Tailor RSE';
  }

  async function runSearch(query: string): Promise<void> {
    const token = gate.next();
    const trimmed = query.trim();
    setHeroState(trimmed);
    if (!trimmed) {
      resultsContainer!.replaceChildren();
      meta!.setAttribute('hidden', '');
      emptyState!.setAttribute('hidden', '');
      emptyState!.innerHTML = '';
      setFooterCtaVisible(false);
      syncUrl('');
      lastFiredQuery = null;
      return;
    }

    // The catalogue resolves to null on any failure, so this never rejects.
    const [pf, catalogue] = await Promise.all([loadPagefind(), loadCatalogue()]);
    if (gate.isStale(token)) return;

    if (!pf) {
      renderPagefindError();
      setFooterCtaVisible(true);
      syncUrl(trimmed);
      return;
    }

    let response: PagefindResponse | null = null;
    try {
      response = await pf.search(trimmed);
    } catch {
      if (gate.isStale(token)) return;
      renderPagefindError();
      setFooterCtaVisible(true);
      syncUrl(trimmed);
      return;
    }
    if (gate.isStale(token)) return;

    if (!response || !Array.isArray(response.results)) {
      renderPagefindError();
      setFooterCtaVisible(true);
      syncUrl(trimmed);
      return;
    }

    const total = response.results.length;

    const plan = planFullSearch(response.results, trimmed, catalogue, {
      getType: getContentType,
      typeOrder,
      // OtA content is out of scope for site search — see SEARCHABLE_TYPES.
      isAllowedType: (type) => isSearchableType(type as ContentType),
    });

    // The count both surfaces report is matches *in scope*, so an excluded
    // page never inflates it. Falls back to the raw count only when the plan
    // could not be built, where the scoped figure is unknowable.
    const scopedTotal = plan.ok ? plan.total : total;

    // Fire analytics once per settled query (don't re-fire on identical re-runs).
    if (lastFiredQuery !== trimmed && typeof window.trackEvent === 'function') {
      window.trackEvent('site_search_query', {
        query: trimmed,
        result_count: scopedTotal,
        source_page: '/search',
      });
      lastFiredQuery = trimmed;
    }

    // Nothing matched, or everything that matched was out of scope. Both are
    // an empty result for this search, not a failure — don't show the error.
    if (total === 0 || (plan.ok && plan.total === 0)) {
      renderNoResults(trimmed);
      setFooterCtaVisible(true);
      syncUrl(trimmed);
      return;
    }

    // No usable catalogue for this result set. Show the existing
    // temporarily-unavailable surface rather than quietly hydrating every
    // result on every keystroke.
    if (!plan.ok || !catalogue) {
      renderPagefindError();
      setFooterCtaVisible(true);
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
    // result set. Never claim "no results" for that.
    if (hydrated.length === 0) {
      renderPagefindError();
      setFooterCtaVisible(true);
      syncUrl(trimmed);
      return;
    }

    const initialData = new Map<PagefindResultRef, PagefindResultData>();
    for (const pair of hydrated) initialData.set(pair.ref, pair.data);

    renderResults(trimmed, token, plan, catalogue, initialData);
    setFooterCtaVisible(true);
    syncUrl(trimmed);
  }

  function syncUrl(query: string): void {
    const url = new URL(window.location.href);
    if (query) url.searchParams.set('q', query);
    else url.searchParams.delete('q');
    history.replaceState(null, '', url.toString());
  }

  // Input handler.
  input.addEventListener('input', () => {
    setClearBtnVisible(input.value.length > 0);
    invalidate();
    const value = input.value;
    debounceTimer = setTimeout(() => void runSearch(value), 300);
  });

  // Clear button.
  clearBtn?.addEventListener('click', () => {
    input.value = '';
    setClearBtnVisible(false);
    invalidate();
    void runSearch('');
    input.focus();
  });

  // Keyboard: Escape clears; Enter blurs on touch devices (search is already live).
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (input.value) {
        input.value = '';
        setClearBtnVisible(false);
        invalidate();
        void runSearch('');
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if ('ontouchstart' in window) input.blur();
    }
  });

  // Initial render. In output: 'static' mode the Astro shell is
  // prerendered once with an empty input; we read ?q= from the URL
  // client-side here to restore the query on page load or back-nav.
  const urlQuery = new URLSearchParams(window.location.search).get('q') ?? '';
  const initial = urlQuery.trim();
  if (initial) input.value = initial;
  setClearBtnVisible(initial.length > 0);
  setHeroState(initial);
  if (initial) {
    void runSearch(initial);
  } else {
    input.focus();
  }
}
