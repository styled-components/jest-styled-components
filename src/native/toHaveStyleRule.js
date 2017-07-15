const {
  matcherHint,
  printReceived,
  printExpected,
} = require('jest-matcher-utils')
const parse = require('styled-components/lib/vendor/postcss-safe-parser/parse')

function toHaveStyleRule(component, name, expected) {
  const { rules } = component.type()
  const props = component.props()
  const ast = parse(rules.join())

  /**
   * Fail by default
   */
  let pass = false

  /**
   * There can be two cases:
   * - rule (dynamic property, value is a function of props)
   * - decl (static property, value is a string)
   *
   * We also take the last matched node because
   * developer may override initial assignment
   */
  const node = ast.nodes.filter((n) => {
    switch (n.type) {
      case 'rule':
        return n.selector.indexOf(name) === 0
      case 'decl':
        return n.prop === name
      default:
        return false
    }
  }).pop()

  let received

  /**
   * If node is not found (typo in the rule name /
   * rule isn't specified for component), we return
   * a special message
   */
  if (!node) {
    const error = `${name} isn't in the style rules`
    return {
      message: () =>
        `${matcherHint('.toHaveStyleRule')}\n\n` +
        `Expected ${component.name()} to have a style rule:\n` +
        `  ${printExpected(`${name}: ${expected}`)}\n` +
        'Received:\n' +
        `  ${printReceived(error)}`,
      pass: false,
    }
  }

  /**
   * In a case of declaration, it's fairly easy to check if expected === given
   */
  if (node.type === 'decl') {
    pass = node.value === expected
    received = node.value
  /**
   * But in case of rule we have quite some complexity here:
   * We can't get a ref to the function using `postcss-safe-parser`, so
   * we have to construct it by ourselves. We also don't know how user called `props`
   * in his value function, so we parse the entire CSS block to match its params and body
   *
   * Once params are matched, we construct a new function and
   * invoke it with props, taken from the enzyme
   */
  } else {
    const match = node.source.input.css.match(new RegExp(`${name}:.*,function (.*){(.*)},`))
    const param = match[1].slice(1, -1)
    /* eslint-disable */
    const fn = Function(param, match[2])
    /* eslint-enable */
    received = fn(props)
    pass = received === expected
  }

  const diff = '' +
    `  ${printExpected(`${name}: ${expected}`)}\n` +
    'Received:\n' +
    `  ${printReceived(`${name}: ${received}`)}`

  const message = pass
    ? () => `${matcherHint('.not.toHaveStyleRule')}\n\n` +
      `Expected ${component.name()} not to contain:\n${diff}`
    : () => `${matcherHint('.toHaveStyleRule')}\n\n` +
      `Expected ${component.name()} to have a style rule:\n${diff}`

  return { message, pass }
}

module.exports = toHaveStyleRule
