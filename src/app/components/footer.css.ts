import { style } from '@vanilla-extract/css';
import { transitionColors, vars } from '../../styling/theme.css';

export const bar = style({
  backgroundColor: vars.color.headerBg,
  paddingBlock: '1rem',
  display: 'flex',
  justifyContent: 'center',
  ...transitionColors,
});

export const text = style({
  color: vars.color.white,
});

export const link = style({
  textDecoration: 'none',
  ':hover': { textDecoration: 'underline' },
});
