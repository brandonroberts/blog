import * as stylex from '@stylexjs/stylex';

/**
 * Angular templates are strings, so `stylex.attrs()` can't be compiled
 * inside them the way it is in JSX. Components call this helper in class
 * code instead and bind the resulting string with `[class]`/`class`.
 */
type SxArg =
  | stylex.StyleXStyles
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | stylex.Theme<stylex.VarGroup<any, any>, any>
  | null
  | undefined
  | false;

export function sx(...styles: ReadonlyArray<SxArg>): string {
  return stylex.attrs(...(styles as stylex.StyleXStyles[])).class ?? '';
}
