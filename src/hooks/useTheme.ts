import { useCallback, useEffect, useState } from 'react';
import {
  applyTheme,
  readThemePreference,
  saveThemePreference,
  watchSystemTheme,
  type ThemePreference,
} from '../lib/theme';

/** Returns the current theme preference and a setter that applies and persists it. */
export const useTheme = () => {
  const [preference, setPreferenceState] = useState<ThemePreference>(readThemePreference);

  useEffect(() => {
    applyTheme(preference);
    if (preference !== 'system') return;
    return watchSystemTheme(() => applyTheme('system'));
  }, [preference]);

  const setPreference = useCallback((next: ThemePreference) => {
    saveThemePreference(next);
    setPreferenceState(next);
  }, []);

  return { preference, setPreference };
};
