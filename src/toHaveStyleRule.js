const { printReceived, printExpected } = require('jest-matcher-utils')
const { getCSS } = require('./utils')

const getClassNames = received => {
  let className

  if (received) {
    if (received.$$typeof === Symbol.for('react.test.json')) {
      className = received.props.className
    } else if (typeof received.find === 'function') {
      className = received.find('[className]').first().prop('className')
    }
  }

  return className ? className.split(/\s/) : []
}

const hasClassNames = (classNames, selectors) =>
  classNames.some(className => selectors.includes(`.${className}`))

const getRules = (ast, classNames) =>
  ast.stylesheet.rules.filter(
    rule => rule.type === 'rule' && hasClassNames(classNames, rule.selectors)
  )

const getDeclaration = (rule, property) =>
  rule.declarations
    .filter(
      declaration =>
        declaration.type === 'declaration' && declaration.property === property
    )
    .pop()

const getDeclarations = (rules, property) =>
  rules.map(rule => getDeclaration(rule, property)).filter(Boolean)

const die = property => ({
  pass: false,
  message: `Property not found: ${printReceived(property)}`,
})

const toHaveStyleRule = (received, property, value) => {
  const classNames = getClassNames(received)
  const ast = getCSS()
  const rules = getRules(ast, classNames)

  if (!rules.length) {
    return die(property)
  }

  const declarations = getDeclarations(rules, property)

  if (!declarations.length) {
    return die(property)
  }

  const declaration = declarations.pop()

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
