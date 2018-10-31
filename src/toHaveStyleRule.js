const {
  __DO_NOT_USE_OR_YOU_WILL_BE_HAUNTED_BY_SPOOKY_GHOSTS,
} = require('styled-components')

const { getCSS, matcherTest, buildReturnMessage } = require('./utils')

const { StyleSheet } = __DO_NOT_USE_OR_YOU_WILL_BE_HAUNTED_BY_SPOOKY_GHOSTS

const getClassNames = received => {
  let className

  if (received) {
    if (received.$$typeof === Symbol.for('react.test.json')) {
      className = received.props.className || received.props.class
    } else if (typeof received.exists === 'function' && received.exists()) {
      const base = received.find('StyledComponent')
      if (base.length) {
        if (received.dive) {
          className = base
            .dive()
            .props()
            .children(StyleSheet.master)
            .props.children().props.className
        } else {
          className = base
            .children()
            .first()
            .prop('className')
        }
      }
    } else if (global.Element && received instanceof global.Element) {
      className = Array.from(received.classList).join(' ')
    }
  }

  return className ? className.split(/\s/) : []
}

const hasAtRule = options =>
  Object.keys(options).some(option => ['media', 'supports'].includes(option))

const getAtRules = (ast, options) => {
  const mediaRegex = /(\([a-z-]+:)\s?([a-z0-9.]+\))/g

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

const getModifiedClassName = ({ className, modifier = '', componentId }) => {
  const modifierPartials = modifier.split(/\s/)
  return modifierPartials
    .map((rawSel, index) => {
      const selector = rawSel.trim()
      // when there is no self-ref in whole modifier
      if (!modifier.includes('&')) {
        // when not dealing with first partial things are easy
        if (index > 0) {
          return selector
        }
        // on first partial watch out for implicit self-refs
        const first = rawSel[0]
        if (first !== ':' && first !== '[') {
          return `.${className} ${selector}`.trim()
        }
        return `.${className}${selector}`.trim()
      }
      if (
        // the first self-ref is always untouched
        index > 0 &&
        // there should be at least two self-refs to do a replacement (.b > .b)
        // no consecutive self refs (.b.b); that is a precedence boost and treated differently
        modifierPartials.filter(partial => partial.trim().startsWith('&'))
          .length > 1
      ) {
        return `.${componentId}`
      }
      // fallback for other cases with self ref
      return selector.replace(/&/g, `.${className}`)
    })
    .join(' ')
}

const hasClassNames = (classNames, selectors, options) =>
  classNames.some(className => {
    const alignedModifiers = getModifiedClassName({
      className,
      modifier: options.modifier,
      componentId: classNames.find(cn => cn.startsWith('sc-')),
    })
    return selectors.includes(alignedModifiers)
  })

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

const normalizeOptions = options =>
  options.modifier
    ? Object.assign({}, options, {
        modifier: Array.isArray(options.modifier)
          ? options.modifier.join('')
          : options.modifier,
      })
    : options

function toHaveStyleRule(component, property, expected, options = {}) {
  const classNames = getClassNames(component)
  const ast = getCSS()
  const normalizedOptions = normalizeOptions(options)
  const rules = getRules(ast, classNames, normalizedOptions)

  if (!rules.length) {
    return handleMissingRules(normalizedOptions)
  }

  const declarations = getDeclarations(rules, property)
  const declaration = declarations.pop() || {}
  const received = declaration.value
  const matches = matcherTest(received, expected)
  // if expected value is not passed and we have a negated ".not" modifier we need to flip our assertion
  const pass = !expected && this.isNot ? !matches : matches

  return {
    pass,
    message: buildReturnMessage(this.utils, pass, property, received, expected),
  }
}

module.exports = toHaveStyleRule
