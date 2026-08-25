import { style } from '@vanilla-extract/css';
import { LG, MD, transitionColors, vars } from '../../styling/theme.css';

export const root = style({
  backgroundColor: vars.color.headerBg,
  paddingBlock: '0.5rem',
  ...transitionColors,
});

export const nav = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  columnGap: '0.5rem',
  color: vars.color.white,
  '@media': {
    [MD]: { columnGap: '1rem' },
    [LG]: { fontSize: '1.5rem', lineHeight: '2rem' },
  },
});

export const navActive = style({
  color: vars.color.navActive,
});

export const flexCenter = style({
  display: 'flex',
  alignItems: 'center',
});

export const themeToggle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2rem',
  height: '2rem',
  borderRadius: '9999px',
  ...transitionColors,
  ':hover': { backgroundColor: vars.color.headerHoverBg },
});

export const toggleIcon = style({
  width: '1.25rem',
  height: '1.25rem',
});

export const profile = style({
  display: 'block',
  justifyContent: 'center',
  paddingBlock: '2rem',
  '@media': {
    [MD]: { display: 'flex' },
  },
});

export const avatarWrap = style({
  padding: '0.5rem',
  marginBlock: 'auto',
});

export const avatar = style({
  borderRadius: '9999px',
  height: '12rem',
  width: '12rem',
  marginInline: 'auto',
  border: `8px solid ${vars.color.avatarBorder}`,
});

export const info = style({
  padding: '2rem',
  marginBlock: 'auto',
});

export const name = style({
  color: vars.color.white,
  fontSize: '1.875rem',
  lineHeight: '2.25rem',
  textAlign: 'center',
});

export const tagline = style({
  color: vars.color.white,
  fontSize: '1.25rem',
  lineHeight: '1.75rem',
  textAlign: 'center',
});

export const socialRow = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  paddingBlock: '0.5rem',
  columnGap: '1rem',
});

export const socialLink = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2rem',
  height: '2rem',
});

export const socialIcon = style({
  width: '1.5rem',
  height: '1.5rem',
  objectFit: 'contain',
});
