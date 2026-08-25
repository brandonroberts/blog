import { globalStyle } from './core';
import { vars } from './theme.styles';

/**
 * Element defaults and markdown-content styling — global CSS drawn from
 * the same typed tokens as component styles. Markdown files (about.md,
 * talks.md, blog posts) render raw HTML at runtime, so their styling has
 * to be global; keeping it here (rather than a hand-written stylesheet)
 * means one source of truth for colors and type checking on every rule.
 */

globalStyle('html, body', {
  height: '100%',
  margin: 0,
  fontFamily: "Roboto, 'Helvetica Neue', sans-serif",
  fontSize: '18px',
});

globalStyle('body', {
  backgroundColor: vars.color.pageBg,
  color: vars.color.textPrimary,
  transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
});

globalStyle('li', {
  listStyleType: 'disc',
  listStylePosition: 'inside',
});

globalStyle('h2', {
  fontWeight: 500,
});

globalStyle('article a', {
  backgroundColor: vars.color.linkBg,
  textDecoration: 'underline',
  color: vars.color.textPrimary,
});

globalStyle('article > h2', {
  margin: '4px 0px 4px 0px',
});

globalStyle('.analog-markdown-route:has(.about)', {
  display: 'flex',
  justifyContent: 'center',
});

/* Utility classes referenced from markdown content (about.md, talks.md). */
globalStyle('.flex', { display: 'flex' });
globalStyle('.flex-col', { flexDirection: 'column' });
globalStyle('.justify-center', { justifyContent: 'center' });
globalStyle('.w-1\\/2', { width: '50%' });
globalStyle('.text-2xl', { fontSize: '1.5rem', lineHeight: '2rem' });
globalStyle('.py-4', { paddingBlock: '1rem' });
