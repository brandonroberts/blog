import { createGlobalTheme } from './core';

/**
 * Design tokens. Compiled to stable CSS custom properties:
 * `color.pageBg` → `--color-page-bg` on `:root` (light) and `.dark`.
 *
 * Because the variables are plain CSS scoped under `.dark`, the
 * pre-hydration script in index.html theming works before any JS loads,
 * and hand-written CSS can reference the same variables.
 *
 * Values match the Tailwind v4 palette previously in use (blue/gray hex)
 * so the visual output is unchanged.
 */
const light = {
  color: {
    pageBg: '#fff', // white
    textPrimary: '#101828', // gray-900
    textSecondary: '#4a5565', // gray-600
    textMuted: '#6a7282', // gray-500
    textStrong: '#101828', // gray-900 (hover emphasis)
    headerBg: '#155dfc', // blue-600
    headerHoverBg: '#3080ff', // blue-500
    navActive: '#bedbff', // blue-200
    avatarBorder: '#54a2ff', // blue-400
    linkBg: '#54a2ff', // blue-400 (article inline links)
    white: '#fff',
  },
};

const dark: typeof light = {
  color: {
    pageBg: '#101828', // gray-900
    textPrimary: '#f3f4f6', // gray-100
    textSecondary: '#d1d5dc', // gray-300
    textMuted: '#99a1af', // gray-400
    textStrong: '#fff',
    headerBg: '#193cb8', // blue-800
    headerHoverBg: '#1447e6', // blue-700
    navActive: '#90c5ff', // blue-300
    avatarBorder: '#3080ff', // blue-500
    linkBg: '#155dfc', // blue-600
    white: '#fff',
  },
};

export const vars = createGlobalTheme(':root', light);
createGlobalTheme('.dark', dark);

/** Shared breakpoints (Tailwind md/lg). */
export const MD = '@media (min-width: 768px)' as const;
export const LG = '@media (min-width: 1024px)' as const;

/** Tailwind's transition-colors + duration-200 shorthand. */
export const transitionColors = {
  transitionProperty: 'background-color, border-color, color',
  transitionDuration: '0.2s',
  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;
