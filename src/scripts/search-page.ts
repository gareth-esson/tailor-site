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
 */

import { getContentType, typeLabels, typeOrder, type ContentType } from '../lib/searchTypes';

interface PagefindResultData {
  url: string;
  excerpt?: string;
  meta?: { title?: string };
}

interface PagefindLike {
  search(q: string): Promise<{ results: Array<{ data(): Promise<PagefindResultData> }> }>;
  init?(): Promise<void>;
}

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

  let pagefind: PagefindLike | null = null;
  let pagefindLoadFailed = false;
  let lastFiredQuery: string | null = null;
  let debounceTimer: ReturnType<typeof setTimeout> | undefined;

  async function loadPagefind(): Promise<PagefindLike | null> {
    if (pagefind) return pagefind;
    if (pagefindLoadFailed) return null;
    try {
      // Pagefind is generated post-build, so the bundler must not resolve
      // this import statically. Use the Function constructor to hide it.
      const loader = new Function(
        'return import("/pagefind/pagefind.js")',
      ) as () => Promise<PagefindLike>;
      const mod = await loader();
      if (typeof mod.init === 'function') await mod.init();
      pagefind = mod;
      return mod;
    } catch {
      pagefindLoadFailed = true;
      return null;
    }
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

  function renderResults(query: string, results: PagefindResultData[]): void {
    emptyState!.setAttribute('hidden', '');
    emptyState!.innerHTML = '';

    const grouped: Partial<Record<ContentType, PagefindResultData[]>> = {};
    for (const r of results) {
      const t = getContentType(r.url);
      if (!grouped[t]) grouped[t] = [];
      grouped[t]!.push(r);
    }

    const activeTypes = typeOrder.filter((t) => grouped[t] && grouped[t]!.length > 0);

    let html = '';
    for (const type of activeTypes) {
      const items = grouped[type]!;
      const label = typeLabels[type];
      const hasMore = items.length > ROWS_BEFORE_TOGGLE;
      const groupId = 'group-' + type;

      html += '<section class="search-result-group" data-group-type="' + type + '">';
      html +=
        '<h2 class="search-result-group__heading">' +
          escapeHtml(label) +
          '&nbsp;<span class="search-result-group__count">(' + items.length + ')</span>' +
        '</h2>';
      html += '<ul class="search-result-group__list">';

      items.forEach((item, j) => {
        const hidden = j >= ROWS_BEFORE_TOGGLE;
        const title = (item.meta && item.meta.title) || item.url;
        // Pagefind excerpts contain <mark> — trust them. URL and title use textContent-safe paths via escapeHtml.
        const excerpt = item.excerpt || '';
        html +=
          '<li class="search-result-group__item"' + (hidden ? ' data-group="' + groupId + '" hidden' : '') + '>' +
            '<a class="search-result-row" href="' + escapeHtml(item.url) + '"' +
              ' data-query="' + escapeHtml(query) + '"' +
              ' data-type="' + type + '"' +
              ' data-position="' + (j + 1) + '">' +
              '<span class="search-result-row__title">' + escapeHtml(title) + '</span>' +
              (excerpt ? '<span class="search-result-row__excerpt">' + excerpt + '</span>' : '') +
            '</a>' +
          '</li>';
      });

      html += '</ul>';
      if (hasMore) {
        html +=
          '<button type="button" class="search-result-group__toggle"' +
          ' data-toggle-for="' + groupId + '" aria-expanded="false">' +
          'Show all ' + items.length + ' ' + escapeHtml(label) + ' results' +
          '</button>';
      }
      html += '</section>';
    }

    resultsContainer!.innerHTML = html;

    // Bind group toggles.
    resultsContainer!.querySelectorAll<HTMLButtonElement>('.search-result-group__toggle').forEach((btn) => {
      btn.addEventListener('click', () => {
        const gid = btn.getAttribute('data-toggle-for');
        if (!gid) return;
        resultsContainer!
          .querySelectorAll<HTMLElement>('[data-group="' + gid + '"]')
          .forEach((el) => el.removeAttribute('hidden'));
        btn.setAttribute('aria-expanded', 'true');
        btn.setAttribute('hidden', '');
      });
    });

    // Bind result-click analytics.
    resultsContainer!.querySelectorAll<HTMLAnchorElement>('.search-result-row').forEach((el) => {
      el.addEventListener(
        'click',
        () => {
          if (typeof window.trackEvent !== 'function') return;
          window.trackEvent('site_search_result_click', {
            query: el.getAttribute('data-query'),
            result_slug: el.getAttribute('href'),
            result_type: el.getAttribute('data-type'),
            position: Number(el.getAttribute('data-position')),
          });
        },
        { once: true },
      );
    });

    // Meta line.
    const count = results.length;
    meta!.textContent = (count === 1 ? '1 result' : count + ' results') + ' for \u201c' + query + '\u201d';
    meta!.removeAttribute('hidden');
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
    if (titleQuery) titleQuery.textContent = `\u201c${query.trim()}\u201d`;
    // Also update the tab title so the browser history entry is meaningful.
    document.title = active
      ? `Search: "${query.trim()}" \u2014 Tailor Education`
      : 'Search \u2014 Tailor Education';
  }

  async function runSearch(query: string): Promise<void> {
    const trimmed = query.trim();
    setHeroState(trimmed);
    if (!trimmed) {
      resultsContainer!.innerHTML = '';
      meta!.setAttribute('hidden', '');
      emptyState!.setAttribute('hidden', '');
      setFooterCtaVisible(false);
      syncUrl('');
      lastFiredQuery = null;
      return;
    }

    const pf = await loadPagefind();
    if (!pf) {
      renderPagefindError();
      setFooterCtaVisible(true);
      syncUrl(trimmed);
      return;
    }

    const search = await pf.search(trimmed);
    const results = await Promise.all(search.results.map((r) => r.data()));

    // Fire analytics once per settled query (don't re-fire on identical re-runs).
    if (lastFiredQuery !== trimmed && typeof window.trackEvent === 'function') {
      window.trackEvent('site_search_query', {
        query: trimmed,
        result_count: results.length,
        source_page: '/search',
      });
      lastFiredQuery = trimmed;
    }

    if (results.length === 0) {
      renderNoResults(trimmed);
    } else {
      renderResults(trimmed, results);
    }

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
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => void runSearch(input.value), 300);
  });

  // Clear button.
  clearBtn?.addEventListener('click', () => {
    input.value = '';
    setClearBtnVisible(false);
    void runSearch('');
    input.focus();
  });

  // Keyboard: Escape clears; Enter blurs on touch devices (search is already live).
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (input.value) {
        input.value = '';
        setClearBtnVisible(false);
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
