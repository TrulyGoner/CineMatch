import type { ReactNode } from 'react';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => (
  <div className="theme-dark" data-theme="dark">
    {children}
  </div>
);
