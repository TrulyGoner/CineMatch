import { useEffect, type ReactNode } from 'react';
import { STORAGE_KEYS } from '@/shared/config/constants';
import { localStorageManager } from '@/shared/storage/localStorageManager';

interface ThemeProviderProps {
  children: ReactNode;
}

type Theme = 'dark' | 'light';

const loadTheme = (): Theme =>
  localStorageManager.get<Theme>(STORAGE_KEYS.theme) ?? 'dark';

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  useEffect(() => {
    const theme = loadTheme();
    document.documentElement.className = theme === 'light' ? 'theme-light' : 'theme-dark';
  }, []);

  return <>{children}</>;
};
