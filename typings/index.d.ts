import { NewPlugin } from 'pretty-format'
import { css } from 'styled-components'

declare global {
  namespace jest {
    interface AsymmetricMatcher {
      $$typeof: Symbol;
      sample?: string | RegExp | object | Array<any> | Function;
    }

    type Value = string | number | RegExp | AsymmetricMatcher | undefined;

    interface Options {
      /** Target rules within a specific `@media` at-rule, e.g. `'(max-width: 640px)'`. Whitespace around colons is normalized automatically. */
      media?: string;
      /** Refine the selector used to match rules. Supports pseudo-selectors (`:hover`), combinators (`> div`), the `&` self-reference (`&&`, `&.active`), parent selectors (`.parent &`), and the styled-components `css` helper for component selectors. */
      modifier?: string | ReturnType<typeof css>;
      /** Match rules by CSS selector string instead of by component class name. Useful for testing `createGlobalStyle` styles, e.g. `{ selector: 'body' }`. When set, the component argument to `toHaveStyleRule` is ignored. */
      selector?: string;
      /** Target rules within a specific `@supports` at-rule, e.g. `'(display: grid)'`. */
      supports?: string;
    }

    interface Matchers<R, T> {
      /**
       * Assert that a CSS property has the expected value on a styled component.
       *
       * @param property - The CSS property name, e.g. `'color'`, `'background'`.
       * @param value - The expected value. Accepts a string, RegExp, Jest asymmetric matcher, or `undefined` to assert the property is not set. Optional when used with `.not`.
       * @param options - Narrow the match to rules inside at-rules (`media`, `supports`), with specific selectors (`modifier`), or by raw CSS selector (`selector`).
       */
      toHaveStyleRule(property: string, value?: Value, options?: Options): R;
    }
  }
}

export interface StyledComponentsSerializerOptions {
  /** Whether to prepend CSS rules to the snapshot output. @default true */
  addStyles?: boolean,
  /** Custom formatter for replacement class names. Receives a zero-based index and returns the placeholder string. @default (index) => `c${index}` */
  classNameFormatter?: (index: number) => string
} 

export declare const styleSheetSerializer: NewPlugin & {
  setStyleSheetSerializerOptions: (options?: StyledComponentsSerializerOptions) => void
};

/** Reset the styled-components stylesheet between tests. Called automatically via `beforeEach` when available. Call manually in Vitest non-globals mode or custom test setups. */
export declare const resetStyleSheet: () => void;
