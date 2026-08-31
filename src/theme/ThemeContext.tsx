import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { themeColors, type ThemeColors, type ThemeName } from './colors';

export type ThemePreference = 'dark' | 'light' | 'system';

type ThemeContextValue = {
  colors: ThemeColors;
  preference: ThemePreference;
  resolvedTheme: ThemeName;
  setThemePreference: (preference: ThemePreference) => void;
  statusBarStyle: 'dark' | 'light';
};

const themePreferenceStorageKey = 'dailyten.themePreference';
const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [preference, setPreference] = useState<ThemePreference>('dark');

  useEffect(() => {
    let mounted = true;

    AsyncStorage.getItem(themePreferenceStorageKey)
      .then((storedPreference) => {
        if (mounted && isThemePreference(storedPreference)) {
          setPreference(storedPreference);
        }
      })
      .catch(() => undefined);

    return () => {
      mounted = false;
    };
  }, []);

  const setThemePreference = useCallback((nextPreference: ThemePreference) => {
    setPreference(nextPreference);
    AsyncStorage.setItem(themePreferenceStorageKey, nextPreference).catch(() => undefined);
  }, []);

  const resolvedTheme = useMemo<ThemeName>(() => {
    if (preference === 'system') {
      return systemColorScheme === 'dark' ? 'dark' : 'light';
    }

    return preference;
  }, [preference, systemColorScheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      colors: themeColors[resolvedTheme],
      preference,
      resolvedTheme,
      setThemePreference,
      statusBarStyle: resolvedTheme === 'dark' ? 'light' : 'dark',
    }),
    [preference, resolvedTheme, setThemePreference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);

  if (!value) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }

  return value;
}

function isThemePreference(value: string | null): value is ThemePreference {
  return value === 'dark' || value === 'light' || value === 'system';
}
