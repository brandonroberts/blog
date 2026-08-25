import { style } from '../../styling/core';
import { transitionColors, vars } from '../../styling/theme.styles';

export const list = style('list', {
  fontSize: '1.5rem',
  lineHeight: '2rem',
});

export const item = style('item', {
  paddingBlock: '1rem',
});

export const link = style('link', {
  color: vars.color.textSecondary,
  ...transitionColors,
  ':hover': { color: vars.color.textStrong },
});

export const date = style('date', {
  fontSize: '0.875rem',
  lineHeight: '1.25rem',
  color: vars.color.textMuted,
});
