import * as stylex from '@stylexjs/stylex';

/**
 * Design tokens for the blog. Light values are the defaults;
 * `darkTheme` overrides them and is applied to <html> by the
 * ThemeService (replacing Tailwind's `dark:` variant classes).
 *
 * Color values match the Tailwind v4 palette previously in use
 * (blue/gray hex fallbacks) so the visual output is unchanged.
 */
export const colors = stylex.defineVars({
  pageBg: '#fff', // white / gray-900
  textPrimary: '#101828', // gray-900 / gray-100
  textSecondary: '#4a5565', // gray-600 / gray-300
  textMuted: '#6a7282', // gray-500 / gray-400
  textStrong: '#101828', // gray-900 / white (hover emphasis)
  headerBg: '#155dfc', // blue-600 / blue-800
  headerHoverBg: '#3080ff', // blue-500 / blue-700
  navActive: '#bedbff', // blue-200 / blue-300
  avatarBorder: '#54a2ff', // blue-400 / blue-500
  linkBg: '#54a2ff', // blue-400 / blue-600 (article inline links)
  white: '#fff',
});

export const darkTheme = stylex.createTheme(colors, {
  pageBg: '#101828',
  textPrimary: '#f3f4f6',
  textSecondary: '#d1d5dc',
  textMuted: '#99a1af',
  textStrong: '#fff',
  headerBg: '#193cb8',
  headerHoverBg: '#1447e6',
  navActive: '#90c5ff',
  avatarBorder: '#3080ff',
  linkBg: '#155dfc',
  white: '#fff',
});
