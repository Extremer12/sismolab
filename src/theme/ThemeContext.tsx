import React, { createContext, useContext, useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { sound } from '../lib/sound';

export type ThemeMode = 'dark' | 'light';

interface ThemeContextType {
  theme: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const THEME_STORAGE_KEY = 'sismolab_theme_v1';

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  isDark: true,
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
      if (saved === 'dark' || saved === 'light') {
        return saved;
      }
    }
    return 'dark'; // SISMO LAB signature default
  });

  const isDark = theme === 'dark';

  const applyThemeToDOM = (mode: ThemeMode) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const body = document.body;

    if (mode === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.colorScheme = 'dark';
      body.style.backgroundColor = '#061321';
      body.style.color = '#E8F1FA';
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
      body.style.backgroundColor = '#F8FAFC';
      body.style.color = '#0F172A';
    }

    // Dynamic Meta theme-color for PWA & mobile browser chrome
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', mode === 'dark' ? '#061321' : '#F8FAFC');
    }
  };

  useEffect(() => {
    applyThemeToDOM(theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {}
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => {
    sound.playClick();
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    sound.playClick();
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

/**
 * Compact, tactile theme toggle button for TopBar or menus
 */
export const ThemeToggle: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative p-2 rounded-xl border transition-all active:scale-95 flex items-center justify-center ${
        isDark
          ? 'bg-navy-900/90 hover:bg-navy-850 text-amber-300 border-white/10 hover:border-amber-300/40 shadow-sm'
          : 'bg-white hover:bg-slate-100 text-sky-700 border-slate-200 hover:border-sky-400 shadow-sm'
      } ${compact ? 'w-9 h-9' : 'w-10 h-10'}`}
      title={isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
      aria-label="Toggle visual theme"
    >
      {isDark ? (
        <Sun className="w-4 h-4 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
};
