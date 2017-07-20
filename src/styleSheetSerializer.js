const css = require('css')
const { getCSS, getClassHashes } = require('./utils')

const getClassNames = node => {
  const rules = getCSS().stylesheet.rules
    .filter(item => item.type === 'rule')
    .map(item => item.selectors)
    .reduce((a, item) => a.concat(item), [])
    .concat(getClassHashes())
  let classNames = new Set()

  if (node.children) {
    node.children
      .slice()
      .reverse()
      .forEach(
        child =>
          (classNames = new Set([...getClassNames(child), ...classNames]))
      )
  }

  if (node.props && node.props.className) {
    const itemClassNames = node.props.className
      .split(/\s/)
      .filter(item => rules.some(a => a.indexOf(item) > -1))
    classNames = new Set(itemClassNames.concat([...classNames]))
  }

  return classNames
}

const includesClassNames = (classNames, selectors) =>
  classNames.some(className =>
    selectors.some(selector => selector.indexOf(className) > -1)
  )

const filterRules = classNames => rule =>
  rule.type === 'rule' &&
  includesClassNames(classNames, rule.selectors) &&
  rule.declarations.length

const getAtRules = (ast, filter) =>
  ast.stylesheet.rules
    .filter(rule => rule.type === 'media' || rule.type === 'supports')
    .reduce((acc, atRule) => {
      atRule.rules = atRule.rules.filter(filter)

      if (atRule.rules.length) {
        return acc.concat(atRule)
      }

      return acc
    }, [])

const getStyle = classNames => {
  const ast = getCSS()
  const filter = filterRules(classNames)
  const rules = ast.stylesheet.rules.filter(filter)
  const atRules = getAtRules(ast, filter)

  ast.stylesheet.rules = rules.concat(atRules)

  return css.stringify(ast)
}

const replaceClassNames = (classNames, style, code) => {
  let index = 0
  return classNames.reduce((acc, className) => {
    if (style.indexOf(className) > -1) {
      return acc.replace(new RegExp(className, 'g'), `c${index++}`)
    }

    return acc.replace(
      new RegExp(`(className="[^"]*?)${className}\\s?([^"]*")`, 'g'),
      '$1$2'
    )
  }, `${style}${style ? '\n\n' : ''}${code}`)
}

const styleSheetSerializer = {
  test(val) {
    return (
      val && !val.withStyle && val.$$typeof === Symbol.for('react.test.json')
    )
  },

  print(val, print) {
    val.withStyle = true

    const classNames = [...getClassNames(val)]
    const style = getStyle(classNames)
    const code = print(val)

    return classNames.length ? replaceClassNames(classNames, style, code) : code
  },
}

module.exports = styleSheetSerializer
