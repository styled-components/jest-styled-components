import type { css } from 'styled-components'
import type { NewPlugin } from 'pretty-format'

interface StyledComponentsSerializerOptions {
  /** Whether to prepend CSS rules to the snapshot output. @default true */
  addStyles?: boolean,
  /** Custom formatter for replacement class names. Receives a zero-based index and returns the placeholder string. @default (index) => `c${index}` */
  classNameFormatter?: (index: number) => string
}

export declare const styleSheetSerializer: NewPlugin & {
  setStyleSheetSerializerOptions: (options?: StyledComponentsSerializerOptions) => void
};

/** Reset the styled-components stylesheet between tests. Called automatically via `beforeEach` when using this entry point. */
export declare const resetStyleSheet: () => void;

/** Enable caching of parsed CSS. Improves performance when styles don't change between assertions. */
export declare const enableCSSCache: () => void;

/** Disable and clear the CSS parse cache. */
export declare const disableCSSCache: () => void;

interface StyleRuleOptions {
  /** A `StyleSheetManager` namespace string (e.g. `'#app'`). When set, the matcher automatically prepends this prefix to every expected selector. */
  namespace?: string;
}

/** Configure global defaults for `toHaveStyleRule`. Settings apply to all subsequent assertions unless overridden per-call. */
export declare const setStyleRuleOptions: (options?: StyleRuleOptions) => void;

interface AsymmetricMatcher {
  $$typeof: Symbol;
  sample?: string | RegExp | object | Array<any> | Function;
}

type Value = string | number | RegExp | AsymmetricMatcher | undefined;

interface Options {
  /** Target rules within a specific `@container` at-rule, e.g. `'(min-width: 400px)'`. */
  container?: string;
  /** Target rules within a specific `@layer` at-rule, e.g. `'utilities'`. */
  layer?: string;
  /** Target rules within a specific `@media` at-rule, e.g. `'(max-width: 640px)'`. */
  media?: string;
  /** Refine the selector used to match rules. Supports pseudo-selectors, combinators, the `&` self-reference, and the styled-components `css` helper. */
  modifier?: string | ReturnType<typeof css>;
  /** Match rules prefixed by a `StyleSheetManager` namespace, e.g. `'#app'`. */
  namespace?: string;
  /** Match rules by CSS selector string instead of by component class name. Useful for testing `createGlobalStyle` styles. */
  selector?: string;
  /** Target rules within a specific `@supports` at-rule, e.g. `'(display: grid)'`. */
  supports?: string;
}

declare module 'vitest' {
  interface Assertion<T = any> {
    /**
     * Assert that a CSS property has the expected value on a styled component.
     */
    toHaveStyleRule(property: string, value?: Value, options?: Options): T;
  }
  interface AsymmetricMatchersContaining {
    toHaveStyleRule(property: string, value?: Value, options?: Options): any;
  }
}
