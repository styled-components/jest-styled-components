const css = require('css')
const styleSheet = require('styled-components/lib/models/StyleSheet')

const getClassNames = (node, classNames) => {
  if (node.children && node.children.reduce) {
    classNames = node.children.reduce((acc, child) => (
      acc.concat(getClassNames(child, acc))
    ), classNames)
  }

  if (node.props && node.props.className) {
    return classNames.concat(node.props.className.split(' '))
  }

  return []
}

const filterNodes = classNames => (rule) => {
  if (rule.type === 'rule') {
    const className = rule.selectors[0].split(/:| /)[0]
    return classNames.includes(className.substring(1))
  }

  return false
}

const getMediaQueries = (ast, filter) => (
  ast.stylesheet.rules
    .filter(rule => rule.type === 'media')
    .reduce((acc, mediaQuery) => {
      mediaQuery.rules = mediaQuery.rules.filter(filter)

      if (mediaQuery.rules.length) {
        return acc.concat(mediaQuery)
      }

      return acc
    }, [])
)

const resolveDeclarations = declarations => {
  const declarationsMap = {}
  return declarations
    .reverse()
    .filter(declaration => {
      if (declarationsMap[declaration.property]) {
        return false
      }

      declarationsMap[declaration.property] = true
      return true
    })
    .reverse()
}

const getStyles = classNames => {
  const styles = styleSheet
    .rules()
    .map(rule => {
      if (!rule.cssText) {
        return rule.cssText
      }

      const ast = css.parse(rule.cssText)
      const astRule = ast.stylesheet.rules[0]
      const resolvedDeclarations = resolveDeclarations(astRule.declarations)

      ast.stylesheet.rules[0].declarations = resolvedDeclarations

      return css.stringify(ast)
    })
    .join('\n')

  const ast = css.parse(styles)
  const filter = filterNodes(classNames)
  const rules = ast.stylesheet.rules.filter(filter)
  const mediaQueries = getMediaQueries(ast, filter)

  ast.stylesheet.rules = rules.concat(mediaQueries)

  return css.stringify(ast)
}

const styleSheetSerializer = {

  test(val) {
    return !val.withStyles && val.$$typeof === Symbol.for('react.test.json')
  },

  print(val, print) {
    const classNames = getClassNames(val, [])
    const styles = getStyles(classNames)

    val.withStyles = true

    return `${styles}\n\n${print(val)}`
  },

}

module.exports = styleSheetSerializer
