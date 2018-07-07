const { getCSS, matcherTest, buildReturnMessage } = require('./utils')

const shouldDive = node =>
  typeof node.dive === 'function' && typeof node.type() !== 'string'

const isTagWithClassName = node =>
  node.prop('className') && typeof node.type() === 'string'

const getClassNames = received => {
  let className

  if (received) {
    if (received.$$typeof === Symbol.for('react.test.json')) {
      className = received.props.className || received.props.class
    } else if (typeof received.findWhere === 'function') {
      const tree = shouldDive(received) ? received.dive() : received
      const components = tree.findWhere(isTagWithClassName)
      if (components.length) {
        className = components.first().prop('className')
      }
    }
  }

  return className ? className.split(/\s/) : []
}

const hasAtRule = options =>
  Object.keys(options).some(option => ['media', 'supports'].includes(option))

const getAtRules = (ast, options) => {
  const mediaRegex = /(\([a-z-]+:)\s?([a-z0-9]+\))/g

  return Object.keys(options)
    .map(option =>
      ast.stylesheet.rules
        .filter(
          rule =>
            rule.type === option &&
            rule[option] === options[option].replace(mediaRegex, '$1$2')
        )
        .map(rule => rule.rules)
        .reduce((acc, rules) => acc.concat(rules), [])
    )
    .reduce((acc, rules) => acc.concat(rules), [])
}

const getModifiedClassName = (className, modifier = '') => {
  const classNameSelector = `.${className}`
  let prefix = ''
  modifier = modifier.trim()
  if (modifier.includes('&')) {
    modifier = modifier.replace(/&/g, classNameSelector)
  } else {
    prefix += classNameSelector
  }
  const first = modifier[0]
  if (first !== ':' && first !== '[') {
    prefix += ' '
  }
  return `${prefix}${modifier}`.trim()
}

const hasClassNames = (classNames, selectors, options) =>
  classNames.some(className =>
    selectors.includes(getModifiedClassName(className, options.modifier))
  )

const getRules = (ast, classNames, options) => {
  const rules = hasAtRule(options)
    ? getAtRules(ast, options)
    : ast.stylesheet.rules

  return rules.filter(
    rule =>
      rule.type === 'rule' && hasClassNames(classNames, rule.selectors, options)
  )
}

const handleMissingRules = options => ({
  pass: false,
  message: () =>
    `No style rules found on passed Component${
      Object.keys(options).length
        ? ` using options:\n${JSON.stringify(options)}`
        : ''
    }`,
})

const getDeclaration = (rule, property) =>
  rule.declarations
    .filter(
      declaration =>
        declaration.type === 'declaration' && declaration.property === property
    )
    .pop()

const getDeclarations = (rules, property) =>
  rules.map(rule => getDeclaration(rule, property)).filter(Boolean)

/* eslint-disable prettier/prettier */
const normalizeOptions = ({ modifier, ...options }) =>
  modifier
    ? {
      ...options,
      modifier: Array.isArray(modifier) ? modifier.join('') : modifier,
    }
    : options
/* eslint-enable prettier/prettier */

function toHaveStyleRule(component, property, expected, options = {}) {
  const ast = getCSS()
  const classNames = getClassNames(component)
  const normalizedOptions = normalizeOptions(options)
  const rules = getRules(ast, classNames, normalizedOptions)

  if (!rules.length) return handleMissingRules(normalizedOptions)

  const declarations = getDeclarations(rules, property)
  const declaration = declarations.pop() || {}
  const received = declaration.value
  const pass = matcherTest(received, expected)

  return {
    pass,
    message: buildReturnMessage(this.utils, pass, property, received, expected),
  }
}

module.exports = toHaveStyleRule
