const css = require('css')
const { ServerStyleSheet } = require('styled-components')
const StyleSheet = require('styled-components/lib/models/StyleSheet')

const STYLE_TAGS_REGEXP = /<style[^>]*>([^<]*)</g

const isOverV2 = () => Boolean(ServerStyleSheet)

const isServer = () => typeof document === 'undefined'

const resetStyleSheet = () => {
  if (isOverV2()) {
    StyleSheet.default.reset(isServer())
  }
}

const getStyle = html => {
  let style = ''
  let matches

  while ((matches = STYLE_TAGS_REGEXP.exec(html)) !== null) {
    style += matches[1].trim()
  }

  return style
}

const getCSS = () => {
  let style

  if (isOverV2()) {
    if (isServer()) {
      style = getStyle(new ServerStyleSheet().getStyleTags())
    } else {
      style = getStyle(StyleSheet.default.instance.toHTML())
    }
  } else {
    style = StyleSheet.rules().map(rule => rule.cssText).join('\n')
  }

  return css.parse(style)
}

module.exports = {
  resetStyleSheet,
  getStyle,
  getCSS,
}
