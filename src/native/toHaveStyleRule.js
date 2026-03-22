const { matcherTest, buildReturnMessage } = require('../utils');

function toHaveStyleRule({ props: { style } }, property, expected) {
  const styles = Array.isArray(style) ? style.filter((x) => x) : style;
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
