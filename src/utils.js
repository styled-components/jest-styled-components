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
    const matches = new ServerStyleSheet().getStyleTags().match(STYLE_TAGS_REGEXP)
    return matches ? matches[1] : ''
  } else if (overV2) {
    const matches = styleSheet.default.instance.toHTML().match(STYLE_TAGS_REGEXP)
    return matches ? matches[1] : ''
  }

  return styleSheet.rules().map(rule => rule.cssText).join('\n')
}

module.exports.getCSS = getCSS

function getClassNames(node) {
  const classNames = []
  if (node.children) {
    node.children.forEach(child => (
      Array.prototype.push.apply(classNames, getClassNames(child))
    ))
  }
  if (node.props && node.props.className) {
    Array.prototype.push.apply(classNames, node.props.className.split(' '))
  }
  return classNames
}

module.exports.getClassNames = getClassNames
