import { style } from '@vanilla-extract/css';
import { transitionColors, vars } from '../../styling/theme.css';

export const list = style({
  fontSize: '1.5rem',
  lineHeight: '2rem',
});

export const item = style({
  paddingBlock: '1rem',
});

export const link = style({
  color: vars.color.textSecondary,
  ...transitionColors,
  ':hover': { color: vars.color.textStrong },
});

export const date = style({
  fontSize: '0.875rem',
  lineHeight: '1.25rem',
  color: vars.color.textMuted,
});
