const css = require('css')
const { getCSS, getClassNames } = require('../utils')

const includesClassNames = (classNames, selectors) => classNames.some(
  className => selectors.some(selector => selector.indexOf(className) > -1)
)

const filterRules = classNames => rule => rule.type === 'rule' &&
  includesClassNames(classNames, rule.selectors) && rule.declarations.length

const getAtRules = (ast, filter) => (
  ast.stylesheet.rules
    .filter(rule => rule.type === 'media' || rule.type === 'supports')
    .reduce((acc, atRule) => {
      atRule.rules = atRule.rules.filter(filter)

      if (atRule.rules.length) {
        return acc.concat(atRule)
      }

      return acc
    }, [])
)

const getStyles = (classNames) => {
  const ast = getCSS()
  const filter = filterRules(classNames)
  const rules = ast.stylesheet.rules.filter(filter)
  const atRules = getAtRules(ast, filter)

  ast.stylesheet.rules = rules.concat(atRules)

  return css.stringify(ast)
}

const replaceClassNames = (classNames, styles, code) => {
  let index = 0
  return classNames.reduce(
    (acc, className) => {
      if (styles.indexOf(className) > -1) {
        return acc.replace(new RegExp(className, 'g'), `c${index++}`)
      }

      return acc.replace(new RegExp(`${className}\\s`, 'g'), '')
    },
    `${styles}${code}`
  )
}

const styleSheetSerializer = {

  test(val) {
    return val && !val.withStyles &&
      val.$$typeof === Symbol.for('react.test.json')
  },

  print(val, print) {
    val.withStyles = true

    const classNames = getClassNames(val)
    const styles = classNames.length ? `${getStyles(classNames)}\n\n` : null
    const code = print(val)

    return styles ? replaceClassNames(classNames, styles, code) : code
  },

}

module.exports = styleSheetSerializer
