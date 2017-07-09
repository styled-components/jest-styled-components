const css = require('css')
const { printReceived, printExpected } = require('jest-matcher-utils')
const styleSheet = require('styled-components/lib/models/StyleSheet')
const { getCSS } = require('../utils')

const getClassName = (received) => {
  let className = ''

  if (received.$$typeof === Symbol.for('react.test.json')) {
    className = received.props.className
  } else if (typeof received.find === 'function') {
    className = received.find('[className]').first().prop('className')
  }

  return `.${className.split(/\s/).pop()}`
}

const getRules = (ast, className) => ast.stylesheet.rules.filter(
  rule => rule.type === 'rule' && rule.selectors.includes(className)
)

const getDeclarations = (rule, property) => rule.declarations.filter(
  declaration => declaration.type === 'declaration' &&
    declaration.property === property
)

const die = property => ({
  pass: false,
  message: `Property not found: ${printReceived(property)}`,
})

function toHaveStyleRule(received, property, value) {
  const className = getClassName(received)
  const styles = getCSS(styleSheet)
  const ast = css.parse(styles)
  const rules = getRules(ast, className)

  if (!rules.length) {
    return die(property)
  }

  const declarations = getDeclarations(rules[0], property)

  if (!declarations.length) {
    return die(property)
  }

  const declaration = declarations[0]

  const message =
    'Expected:\n' +
    `  ${printExpected(`${property}: ${value}`)}\n` +
    'Received:\n' +
    `  ${printReceived(`${property}: ${declaration.value}`)}`

  return {
    pass: value === declaration.value,
    message,
  }
}

module.exports = toHaveStyleRule
