/**
 * Light / dark / system theme preference.
 *
 * The preference is stored in localStorage and applied as a `dark` class on
 * `<html>`. `index.html` runs a tiny inline copy of `resolveTheme` before the
 * app loads so the page never flashes the wrong theme.
 */

export type ThemePreference = 'light' | 'dark' | 'system';

export const THEME_STORAGE_KEY = 'drive-pdf-theme';

const PREFERENCES: readonly ThemePreference[] = ['light', 'dark', 'system'];

const isPreference = (value: unknown): value is ThemePreference =>
  typeof value === 'string' && (PREFERENCES as readonly string[]).includes(value);

/** Reads the saved preference, falling back to `system` if storage is empty or blocked. */
export const readThemePreference = (): ThemePreference => {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isPreference(stored) ? stored : 'system';
  } catch {
    return 'system';
  }
};

/** Saves the preference. Failures (private mode, blocked storage) are ignored. */
export const saveThemePreference = (preference: ThemePreference): void => {
  try {
    if (preference === 'system') window.localStorage.removeItem(THEME_STORAGE_KEY);
    else window.localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Storage unavailable: the choice still applies for this visit.
  }
};

const DARK_QUERY = '(prefers-color-scheme: dark)';

/** True when the OS asks for a dark colour scheme. Safe where `matchMedia` is missing. */
export const systemPrefersDark = (): boolean =>
  typeof window.matchMedia === 'function' && window.matchMedia(DARK_QUERY).matches;

export const resolveTheme = (preference: ThemePreference): 'light' | 'dark' =>
  preference === 'system' ? (systemPrefersDark() ? 'dark' : 'light') : preference;

/** Applies the resolved theme to the document root. */
export const applyTheme = (preference: ThemePreference): void => {
  const root = document.documentElement;
  const theme = resolveTheme(preference);
  root.classList.toggle('dark', theme === 'dark');
  root.style.colorScheme = theme;
};

/** Calls `onChange` whenever the OS colour scheme changes. Returns an unsubscribe function. */
export const watchSystemTheme = (onChange: () => void): (() => void) => {
  if (typeof window.matchMedia !== 'function') return () => {};
  const media = window.matchMedia(DARK_QUERY);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
};
