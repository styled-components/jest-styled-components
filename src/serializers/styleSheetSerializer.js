const css = require('css')
const styleSheet = require('styled-components/lib/models/StyleSheet')
const { ServerStyleSheet } = require('styled-components')

// styled-components >=2.0.0
const isOverV2 = Boolean(ServerStyleSheet)

const isServer = typeof document === 'undefined'

if (isOverV2) {
  styleSheet.default.reset(isServer)
}

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
    return classNames.includes(className.substring(1)) && rule.declarations.length
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

const getStyles = (classNames) => {
  let styles
  const styleTags = /<style[^>]*>([\s\S]*)<\/style>/

  if (isOverV2 && isServer) {
    styles = new ServerStyleSheet().getStyleTags().match(styleTags)[1]
  } else if (isOverV2) {
    styles = styleSheet.default.instance.toHTML().match(styleTags)[1]
  } else {
    styles = styleSheet.rules().map(rule => rule.cssText).join('\n')
  }

  const ast = css.parse(styles)
  const filter = filterNodes(classNames)
  const rules = ast.stylesheet.rules.filter(filter)
  const mediaQueries = getMediaQueries(ast, filter)

  ast.stylesheet.rules = rules.concat(mediaQueries)

  return css.stringify(ast).trim()
}

const styleSheetSerializer = {

  test(val) {
    return val && !val.withStyles && val.$$typeof === Symbol.for('react.test.json')
  },

  print(val, print) {
    const classNames = getClassNames(val, [])
    const styles = classNames.length ? `${getStyles(classNames)}\n\n` : ''

    val.withStyles = true

    return `${styles}${print(val)}`
  },

}

module.exports = styleSheetSerializer
