import { style } from '../../styling/core';
import { LG, MD, transitionColors, vars } from '../../styling/theme.styles';

export const root = style('root', {
  backgroundColor: vars.color.headerBg,
  paddingBlock: '0.5rem',
  ...transitionColors,
});

export const nav = style('nav', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  columnGap: '0.5rem',
  color: vars.color.white,
  [MD]: { columnGap: '1rem' },
  [LG]: { fontSize: '1.5rem', lineHeight: '2rem' },
});

export const navActive = style('navActive', {
  color: vars.color.navActive,
});

export const flexCenter = style('flexCenter', {
  display: 'flex',
  alignItems: 'center',
});

export const themeToggle = style('themeToggle', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2rem',
  height: '2rem',
  borderRadius: '9999px',
  ...transitionColors,
  ':hover': { backgroundColor: vars.color.headerHoverBg },
});

export const toggleIcon = style('toggleIcon', {
  width: '1.25rem',
  height: '1.25rem',
});

export const profile = style('profile', {
  display: 'block',
  justifyContent: 'center',
  paddingBlock: '2rem',
  [MD]: { display: 'flex' },
});

export const avatarWrap = style('avatarWrap', {
  padding: '0.5rem',
  marginBlock: 'auto',
});

export const avatar = style('avatar', {
  borderRadius: '9999px',
  height: '12rem',
  width: '12rem',
  marginInline: 'auto',
  border: `8px solid ${vars.color.avatarBorder}`,
});

export const info = style('info', {
  padding: '2rem',
  marginBlock: 'auto',
});

export const name = style('name', {
  color: vars.color.white,
  fontSize: '1.875rem',
  lineHeight: '2.25rem',
  textAlign: 'center',
});

export const tagline = style('tagline', {
  color: vars.color.white,
  fontSize: '1.25rem',
  lineHeight: '1.75rem',
  textAlign: 'center',
});

export const socialRow = style('socialRow', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  paddingBlock: '0.5rem',
  columnGap: '1rem',
});

export const socialLink = style('socialLink', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2rem',
  height: '2rem',
});

export const socialIcon = style('socialIcon', {
  width: '1.5rem',
  height: '1.5rem',
  objectFit: 'contain',
});
