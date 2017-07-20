const css = require('css')
const { ServerStyleSheet } = require('styled-components')
const StyleSheet = require('styled-components/lib/models/StyleSheet')

const STYLE_TAGS_REGEXP = /<style[^>]*>([^<]*)</g
const CLASS_HASH_REGEXP = /data-styled-components=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/

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

const getHTML = () => {
  if (isServer()) {
    return new ServerStyleSheet().getStyleTags()
  }
  return StyleSheet.default.instance.toHTML()
}

const getClassHashes = () => {
  const hashes = getHTML().match(CLASS_HASH_REGEXP)
  if (hashes && hashes.length > 1) {
    return hashes[1].split(/\s/)
  }
  return []
}

const getCSS = () => {
  let style

  if (isOverV2()) {
    style = getStyle(getHTML())
  } else {
    style = StyleSheet.rules().map(rule => rule.cssText).join('\n')
  }

  return css.parse(style)
}

module.exports = {
  resetStyleSheet,
  getStyle,
  getCSS,
  getClassHashes,
}
