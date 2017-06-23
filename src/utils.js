const { ServerStyleSheet } = require('styled-components')

const STYLE_TAGS_REGEXP = /<style[^>]*>([^<]*)</g

// styled-components >=2.0.0
function isOverV2() {
  return Boolean(ServerStyleSheet)
}

module.exports.isOverV2 = isOverV2

function isServer() {
  return typeof document === 'undefined'
}

module.exports.isServer = isServer

function parseCSSfromHTML (html) {
  let css = ''
  let matches
  while ((matches = STYLE_TAGS_REGEXP.exec(html)) !== null) {
    css += matches[1].trim()
  }
  return css
}

module.exports.parseCSSfromHTML = parseCSSfromHTML

function getCSS(styleSheet) {
  const overV2 = isOverV2()
  if (overV2 && isServer()) {
    return parseCSSfromHTML(new ServerStyleSheet().getStyleTags())
  } else if (overV2) {
    return parseCSSfromHTML(styleSheet.default.instance.toHTML())
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
