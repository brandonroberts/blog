import { style } from '@vanilla-extract/css';
import { vars } from '../../../styling/theme.css';

export const wrapper = style({
  display: 'flex',
  flexGrow: 1,
  justifyContent: 'center',
  minHeight: '100vh',
});

export const article = style({
  width: '100vw',
  maxWidth: '56rem',
  padding: '2rem',
});

export const coverImage = style({
  width: '100%',
  borderRadius: '0.5rem',
  marginBottom: '1.5rem',
});

export const title = style({
  color: vars.color.textSecondary,
  fontSize: '1.5rem',
  lineHeight: '2rem',
});

export const byline = style({
  fontWeight: 300,
  fontSize: '0.875rem',
  lineHeight: '1.25rem',
  color: vars.color.textMuted,
});
