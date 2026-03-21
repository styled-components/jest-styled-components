declare global {
  namespace jest {
    interface AsymmetricMatcher {
      $$typeof: Symbol;
      sample?: string | RegExp | object | Array<any> | Function;
    }

    type Value = string | number | RegExp | AsymmetricMatcher | undefined;

    interface Matchers<R, T> {
      /**
       * Assert that a CSS property has the expected value on a React Native styled component.
       * Uses the component's `style` prop directly (no CSS parsing).
       *
       * @param property - The CSS property name in kebab-case, e.g. `'background-color'`. Automatically converted to camelCase for comparison.
       * @param value - The expected value. Accepts a string, RegExp, Jest asymmetric matcher, or `undefined` to assert the property is not set.
       */
      toHaveStyleRule(property: string, value?: Value): R;
    }
  }
}

export {};
