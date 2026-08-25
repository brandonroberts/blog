import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { darkTheme } from '../styles/tokens.stylex';
import { sx } from '../styles/sx';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  
  private readonly STORAGE_KEY = 'theme';
  
  /** Current theme signal */
  theme = signal<Theme>(this.getInitialTheme());
  
  /** Whether dark mode is active */
  isDark = signal<boolean>(this.theme() === 'dark');

  constructor() {
    // Set up effect to sync theme changes to DOM and localStorage
    effect(() => {
      const currentTheme = this.theme();
      this.isDark.set(currentTheme === 'dark');
      
      if (this.isBrowser) {
        this.applyTheme(currentTheme);
        localStorage.setItem(this.STORAGE_KEY, currentTheme);
      }
    });

    // Listen for system preference changes
    if (this.isBrowser) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', (e) => {
        // Only auto-switch if user hasn't set a manual preference
        const savedTheme = localStorage.getItem(this.STORAGE_KEY);
        if (!savedTheme) {
          this.theme.set(e.matches ? 'dark' : 'light');
        }
      });
    }
  }

  /** Toggle between light and dark themes */
  toggleTheme(): void {
    this.theme.set(this.theme() === 'dark' ? 'light' : 'dark');
  }

  /** Set a specific theme */
  setTheme(theme: Theme): void {
    this.theme.set(theme);
  }

  /** Get the initial theme based on localStorage or system preference */
  private getInitialTheme(): Theme {
    if (!this.isBrowser) {
      return 'light'; // Default for SSR
    }

    // Check localStorage first
    const savedTheme = localStorage.getItem(this.STORAGE_KEY) as Theme | null;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }

    // Fall back to system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  }

  /** Apply theme class to document */
  private applyTheme(theme: Theme): void {
    const root = document.documentElement;
    // `.dark` drives the plain-CSS variables in styles.css; the StyleX
    // theme class overrides the StyleX design tokens for component styles.
    const stylexDarkClasses = sx(darkTheme).split(' ').filter(Boolean);
    if (theme === 'dark') {
      root.classList.add('dark', ...stylexDarkClasses);
    } else {
      root.classList.remove('dark', ...stylexDarkClasses);
    }
  }
}
