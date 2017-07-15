const css = require('css')
const { ServerStyleSheet } = require('styled-components')
const styleSheet = require('styled-components/lib/models/StyleSheet')

const STYLE_TAGS_REGEXP = /<style[^>]*>([^<]*)</g

function isOverV2() {
  return Boolean(ServerStyleSheet)
}

function isServer() {
  return typeof document === 'undefined'
}

function parseCSSfromHTML(html) {
  let styles = ''
  let matches

  while ((matches = STYLE_TAGS_REGEXP.exec(html)) !== null) {
    styles += matches[1].trim()
  }

  return styles
}

function getCSS() {
  let styles

  if (isOverV2()) {
    if (isServer()) {
      styles = parseCSSfromHTML(new ServerStyleSheet().getStyleTags())
    } else {
      styles = parseCSSfromHTML(styleSheet.default.instance.toHTML())
    }
  } else {
    styles = styleSheet.rules().map(rule => rule.cssText).join('\n')
  }

  return css.parse(styles)
}

function getClassNames(node) {
  const classNames = []

  if (node.children) {
    node.children.slice().reverse().forEach(child => (
      Array.prototype.unshift.apply(classNames, getClassNames(child))
    ))
  }

  if (node.props && node.props.className) {
    Array.prototype.unshift.apply(
      classNames,
      node.props.className.split(/\s/)
    )
  }

  return classNames
}

module.exports = {
  isOverV2,
  isServer,
  parseCSSfromHTML,
  getCSS,
  getClassNames,
}

