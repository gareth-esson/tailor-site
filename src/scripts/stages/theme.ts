/**
 * Stages in Relationships — light and dark mode.
 *
 * Follows the device's own setting unless the person has picked one with
 * the toggle; their pick is remembered in this browser. The theme is set
 * as data-theme on every .stages-page, and the dark tokens in
 * stages-tool.css hang off that attribute.
 *
 * StagesThemeInit.astro sets the attribute inline before first paint, so
 * the page never flashes light; this module keeps it up to date. A
 * presenter screen opened from the control desk shares the same storage,
 * so it follows the facilitator's toggle through the `storage` event.
 */

const STORE_KEY = 'stages-theme';

type Theme = 'dark' | 'light';

function storedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(STORE_KEY);
    return value === 'dark' || value === 'light' ? value : null;
  } catch {
    return null;
  }
}

const deviceDark = window.matchMedia('(prefers-color-scheme: dark)');

function currentTheme(): Theme {
  return storedTheme() ?? (deviceDark.matches ? 'dark' : 'light');
}

function apply(): void {
  const theme = currentTheme();
  for (const page of document.querySelectorAll<HTMLElement>('.stages-page')) page.dataset.theme = theme;
  for (const toggle of document.querySelectorAll<HTMLButtonElement>('[data-stages-theme-toggle]')) {
    toggle.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
  }
}

export function initStagesTheme(): void {
  if (document.documentElement.dataset.stagesTheme) return;
  document.documentElement.dataset.stagesTheme = 'ready';

  document.addEventListener('click', (e) => {
    const toggle = (e.target as Element | null)?.closest('[data-stages-theme-toggle]');
    if (!toggle) return;
    const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem(STORE_KEY, next);
    } catch {
      /* private mode: the switch still works for this page */
      for (const page of document.querySelectorAll<HTMLElement>('.stages-page')) page.dataset.theme = next;
      return;
    }
    apply();
  });
  window.addEventListener('storage', (e) => {
    if (e.key === STORE_KEY) apply();
  });
  deviceDark.addEventListener('change', apply);
  apply();
}
