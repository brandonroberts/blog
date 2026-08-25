import { style } from '../../../styling/core';
import { vars } from '../../../styling/theme.styles';

export const wrapper = style('wrapper', {
  display: 'flex',
  flexGrow: 1,
  justifyContent: 'center',
  minHeight: '100vh',
});

export const article = style('article', {
  width: '100vw',
  maxWidth: '56rem',
  padding: '2rem',
});

export const coverImage = style('coverImage', {
  width: '100%',
  borderRadius: '0.5rem',
  marginBottom: '1.5rem',
});

export const title = style('title', {
  color: vars.color.textSecondary,
  fontSize: '1.5rem',
  lineHeight: '2rem',
});

export const byline = style('byline', {
  fontWeight: 300,
  fontSize: '0.875rem',
  lineHeight: '1.25rem',
  color: vars.color.textMuted,
});
