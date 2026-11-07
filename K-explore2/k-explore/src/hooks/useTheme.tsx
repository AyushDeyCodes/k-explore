import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getStoredTheme, storeTheme, type ThemeName } from '@/lib/storage';

interface ThemeContextValue {
  theme: ThemeName;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>(() => getStoredTheme() ?? 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
    storeTheme(theme);
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside ThemeProvider');
  return context;
}
