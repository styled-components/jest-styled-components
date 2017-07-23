const css = require('css')
const { getCSS, getHashes } = require('./utils')

const getClassNames = node => {
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
    classNames = new Set([...node.props.className.split(/\s+/), ...classNames])
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

const replaceClassNames = (classNames, style, result) =>
  classNames
    .filter(className => style.includes(className))
    .reduce(
      (acc, className, index) =>
        acc.replace(new RegExp(className, 'g'), `c${index++}`),
      result
    )

const replaceHashes = (hashes, result) =>
  hashes.reduce(
    (acc, className) =>
      acc.replace(
        new RegExp(`(className="[^"]*?)${className}\\s?([^"]*")`, 'g'),
        '$1$2'
      ),
    result
  )

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
    const hashes = getHashes()

    let result = `${style}${style ? '\n\n' : ''}${code}`
    result = replaceClassNames(classNames, style, result)
    result = replaceHashes(hashes, result)

    return result
  },
}

module.exports = styleSheetSerializer
