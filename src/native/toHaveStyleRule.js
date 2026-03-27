const { matcherTest, buildReturnMessage } = require('../utils');

/**
 * Jest matcher for React Native styled-components. Asserts that a component's
 * style prop contains the expected CSS property value. Handles style arrays
 * and converts kebab-case properties to camelCase.
 *
 * @param {object} component - A react-test-renderer JSON node with a `props.style` object or array.
 * @param {string} property - The CSS property name (kebab-case or camelCase).
 * @param {string|RegExp|undefined|object} expected - Expected value, RegExp, asymmetric matcher, or `undefined`.
 */
function toHaveStyleRule(component, property, expected) {
  const style = component?.props ? component.props.style : undefined;

  if (!style) {
    const pass = matcherTest(undefined, expected, this.isNot);
    return {
      pass,
      message: buildReturnMessage(
        this.utils,
        pass,
        property,
        undefined,
        expected
      ),
    };
  }

  const styles = Array.isArray(style)
    ? style.flat(Infinity).filter((x) => x)
    : style;
  const camelCasedProperty = property.replace(/-(\w)/g, (_, match) =>
    match.toUpperCase()
  );
  const mergedStyles = Array.isArray(styles)
    ? Object.assign({}, ...styles)
    : styles;
  const received = mergedStyles[camelCasedProperty];
  const pass = matcherTest(received, expected, this.isNot);

  return {
    pass,
    message: buildReturnMessage(this.utils, pass, property, received, expected),
  };
}

module.exports = toHaveStyleRule;
