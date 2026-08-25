import { createGlobalTheme } from '@vanilla-extract/css';

/**
 * Design tokens (vanilla-extract). Light values attach to `:root`, dark
 * values re-assign the same variables under `.dark`, so the pre-hydration
 * theme script in index.html keeps working. Values match the Tailwind v4
 * palette previously in use (blue/gray hex) so visual output is unchanged.
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
createGlobalTheme('.dark', vars, dark);

/** Media queries (Tailwind md/lg), for use under style()'s '@media' key. */
export const MD = '(min-width: 768px)';
export const LG = '(min-width: 1024px)';

/** Tailwind's transition-colors + duration-200 shorthand. */
export const transitionColors = {
  transitionProperty: 'background-color, border-color, color',
  transitionDuration: '0.2s',
  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;
