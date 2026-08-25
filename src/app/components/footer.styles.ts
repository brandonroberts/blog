import { style } from '../../styling/core';
import { transitionColors, vars } from '../../styling/theme.styles';

export const bar = style('bar', {
  backgroundColor: vars.color.headerBg,
  paddingBlock: '1rem',
  display: 'flex',
  justifyContent: 'center',
  ...transitionColors,
});

export const text = style('text', {
  color: vars.color.white,
});

export const link = style('link', {
  textDecoration: 'none',
  ':hover': { textDecoration: 'underline' },
});
