const { getCSS } = require('./utils')

const getClassNames = received => {
  let className

  if (received) {
    if (received.$$typeof === Symbol.for('react.test.json')) {
      className = received.props.className
    } else if (typeof received.find === 'function') {
      const components = received.find('[className]')
      if (components.length) {
        className = components.first().prop('className')
      }
    }
  }

  return className ? className.split(/\s/) : []
}

const hasClassNames = (classNames, selectors) =>
  classNames.some(className => selectors.includes(`.${className}`))

const getAtRules = (ast, options) =>
  Object.keys(options)
    .map(option =>
      ast.stylesheet.rules
        .filter(
          rule => rule.type === option && rule[option] === options[option]
        )
        .map(rule => rule.rules)
        .reduce((acc, rules) => acc.concat(rules), [])
    )
    .reduce((acc, rules) => acc.concat(rules), [])

const getRules = (ast, classNames, options) => {
  const rules = options ? getAtRules(ast, options) : ast.stylesheet.rules
  return rules.filter(
    rule => rule.type === 'rule' && hasClassNames(classNames, rule.selectors)
  )
}

const getDeclaration = (rule, property) =>
  rule.declarations
    .filter(
      declaration =>
        declaration.type === 'declaration' && declaration.property === property
    )
    .pop()

const getDeclarations = (rules, property) =>
  rules.map(rule => getDeclaration(rule, property)).filter(Boolean)

const die = (utils, property) => ({
  pass: false,
  message: `Property not found: ${utils.printReceived(property)}`,
})

function toHaveStyleRule(received, property, value, options) {
  const classNames = getClassNames(received)
  const ast = getCSS()
  const rules = getRules(ast, classNames, options)

  if (!rules.length) {
    return die(this.utils, property)
  }

  const declarations = getDeclarations(rules, property)

  if (!declarations.length) {
    return die(this.utils, property)
  }

  const declaration = declarations.pop()

  const pass =
    value instanceof RegExp
      ? value.test(declaration.value)
      : value === declaration.value

  const message =
    `Expected ${property}${pass ? ' not ' : ' '}to match:\n` +
    `  ${this.utils.printExpected(value)}\n` +
    'Received:\n' +
    `  ${this.utils.printReceived(declaration.value)}`

  return {
    pass,
    message,
  }
}

module.exports = toHaveStyleRule
