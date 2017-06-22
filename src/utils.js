const { ServerStyleSheet } = require('styled-components')

const STYLE_TAGS_REGEXP = /<style[^>]*>([\s\S]*)<\/style>/

// styled-components >=2.0.0
function isOverV2() {
  return Boolean(ServerStyleSheet)
}

module.exports.isOverV2 = isOverV2

function isServer() {
  return typeof document === 'undefined'
}

module.exports.isServer = isServer

function getCSS(styleSheet) {
  const overV2 = isOverV2()
  if (overV2 && isServer()) {
    return new ServerStyleSheet().getStyleTags().match(STYLE_TAGS_REGEXP)[1]
  }
  if (overV2) {
    return styleSheet.default.instance.toHTML().match(STYLE_TAGS_REGEXP)[1]
  }
  return styleSheet.rules().map(rule => rule.cssText).join('\n')
}

module.exports.getCSS = getCSS

function getClassNames (node, classNames) {
  if (node.children && node.children.reduce) {
    classNames = node.children.reduce((acc, child) => (
      acc.concat(getClassNames(child, []))
    ), classNames)
  }

  if (node.props && node.props.className) {
    return classNames.concat(node.props.className.split(' '))
  }

  return classNames
}

module.exports.getClassNames = getClassNames
