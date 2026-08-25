import type { Properties } from 'csstype';

/**
 * A minimal, build-time CSS-in-TS system for this site ("css-ts").
 *
 * Design goals (in reaction to the StyleX spike on this branch):
 *  1. Theming compiles to STABLE, human-named CSS custom properties
 *     (`--color-page-bg`), scoped under selectors you choose (`:root`,
 *     `.dark`) — so the pre-hydration theme script and hand-written CSS
 *     keep working, and there is a single source of truth for tokens.
 *  2. `style()` returns a plain string class name that is a build-time
 *     constant — Angular string templates bind it directly, and zero
 *     runtime JS ships to the client.
 *  3. `globalStyle()` is first-class, so markdown/content styling lives
 *     in the same typed token system as component styles.
 *
 * These functions only ever execute at build time: `vite-plugins/css-ts.ts`
 * evaluates each `*.styles.ts` module in Node, collects the CSS emitted
 * here, and replaces the module with literal string exports for the app
 * bundle. Importing a `*.styles.ts` module without that plugin throws.
 */

export type StyleRule = Properties<string | number> & {
  [nested: `:${string}` | `@media ${string}` | `& ${string}`]: StyleRule | undefined;
};

type ThemeTokens = { [key: string]: string | ThemeTokens };
type VarsOf<T> = { [K in keyof T]: T[K] extends string ? string : VarsOf<T[K]> };

interface Registry {
  /** Class-name prefix for the module being evaluated (its file stem). */
  scope: string;
  rules: string[];
}

const REGISTRY_KEY = '__CSS_TS_REGISTRY__';

function registry(): Registry {
  const reg = (globalThis as Record<string, unknown>)[REGISTRY_KEY] as Registry | undefined;
  if (!reg) {
    throw new Error(
      'css-ts: *.styles.ts modules are compile-time only and must be built by vite-plugins/css-ts.ts'
    );
  }
  return reg;
}

/** Properties whose numeric values are used without a px suffix. */
const UNITLESS = new Set([
  'font-weight',
  'line-height',
  'opacity',
  'z-index',
  'flex-grow',
  'flex-shrink',
  'flex',
  'order',
]);

const camelToKebab = (name: string) =>
  name.replace(/[A-Z]/g, (ch) => '-' + ch.toLowerCase());

function declarations(rule: StyleRule): string {
  const decls: string[] = [];
  for (const [key, value] of Object.entries(rule)) {
    if (value === null || value === undefined || typeof value === 'object') continue;
    const prop = camelToKebab(key);
    const css =
      typeof value === 'number' && value !== 0 && !UNITLESS.has(prop)
        ? `${value}px`
        : String(value);
    decls.push(`${prop}:${css}`);
  }
  return decls.join(';');
}

function emit(selector: string, rule: StyleRule, media?: string): void {
  const reg = registry();
  const wrap = (css: string) => (media ? `${media}{${css}}` : css);

  const decls = declarations(rule);
  if (decls) {
    reg.rules.push(wrap(`${selector}{${decls}}`));
  }

  for (const [key, value] of Object.entries(rule)) {
    if (typeof value !== 'object' || value === null) continue;
    if (key.startsWith('@media')) {
      emit(selector, value as StyleRule, key);
    } else if (key.startsWith('&')) {
      emit(key.replace(/^&/, selector), value as StyleRule, media);
    } else {
      // pseudo-class / pseudo-element, e.g. ':hover', '::before'
      emit(selector + key, value as StyleRule, media);
    }
  }
}

/**
 * Define a class. Returns the class name — a readable, deterministic
 * string of the form `<fileStem>_<name>`.
 */
export function style(name: string, rule: StyleRule): string {
  const className = `${registry().scope}_${name}`;
  emit('.' + className, rule);
  return className;
}

/** Style an arbitrary selector (element defaults, markdown content, …). */
export function globalStyle(selector: string, rule: StyleRule): void {
  emit(selector, rule);
}

/**
 * Declare theme tokens under a selector. Variable names derive from the
 * token path (`color.pageBg` → `--color-page-bg`), so declaring the same
 * shape under a second selector (e.g. `.dark`) overrides the same
 * variables. Returns the tokens mapped to `var(...)` references.
 */
export function createGlobalTheme<T extends ThemeTokens>(
  selector: string,
  tokens: T
): VarsOf<T> {
  const decls: string[] = [];

  const walk = (node: ThemeTokens, path: string[]): ThemeTokens => {
    const mapped: ThemeTokens = {};
    for (const [key, value] of Object.entries(node)) {
      const nextPath = [...path, camelToKebab(key)];
      if (typeof value === 'string') {
        const varName = `--${nextPath.join('-')}`;
        decls.push(`${varName}:${value}`);
        mapped[key] = `var(${varName})`;
      } else {
        mapped[key] = walk(value, nextPath);
      }
    }
    return mapped;
  };

  const vars = walk(tokens, []) as VarsOf<T>;
  registry().rules.push(`${selector}{${decls.join(';')}}`);
  return vars;
}
