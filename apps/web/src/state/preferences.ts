import { useEffect } from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type Theme = 'system' | 'light' | 'dark';

interface PreferencesState {
  theme: Theme;
  displayName: string;
  setTheme: (theme: Theme) => void;
  setDisplayName: (name: string) => void;
}

const storage = createJSONStorage<PreferencesState>(() => {
  if (typeof window === 'undefined') {
    const memory: Record<string, string> = {};
    return {
      getItem: (name: string) => memory[name] ?? null,
      setItem: (name: string, value: string) => {
        memory[name] = value;
      },
      removeItem: (name: string) => {
        delete memory[name];
      },
    } as Storage;
  }
  return window.localStorage;
});

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: 'system',
      displayName: '',
      setTheme: (theme) => set({ theme }),
      setDisplayName: (displayName) => set({ displayName }),
    }),
    {
      name: 'ttt-preferences',
      storage,
    },
  ),
);

const resolveTheme = (theme: Theme): 'light' | 'dark' => {
  if (theme === 'system') {
    if (typeof window === 'undefined') {
      return 'light';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = usePreferencesStore((state) => state.theme);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const resolved = resolveTheme(theme);
    root.classList.toggle('dark', resolved === 'dark');
  }, [theme]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (usePreferencesStore.getState().theme === 'system') {
        const resolved = resolveTheme('system');
        document.documentElement.classList.toggle('dark', resolved === 'dark');
      }
    };
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  return <>{children}</>;
};

export const useTheme = () => {
  const theme = usePreferencesStore((state) => state.theme);
  const setTheme = usePreferencesStore((state) => state.setTheme);
  return { theme, setTheme };
};
