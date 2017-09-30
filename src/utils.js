const css = require('css')
const { ServerStyleSheet } = require('styled-components')
const StyleSheet = require('styled-components/lib/models/StyleSheet')

const isOverV2 = () => Boolean(ServerStyleSheet)

const isServer = () => typeof document === 'undefined'

const resetStyleSheet = () => {
  if (isOverV2()) {
    StyleSheet.default.reset(isServer())
  }
}

const getHTML = () =>
  isServer()
    ? new ServerStyleSheet().getStyleTags()
    : StyleSheet.default.instance.toHTML()

const extract = regex => {
  let style = ''
  let matches

  while ((matches = regex.exec(getHTML())) !== null) {
    style += `${matches[1]} `
  }

  return style.trim()
}

const getStyle = () => extract(/<style[^>]*>([^<]*)</g)

const getRules = () =>
  StyleSheet.globalStyleSheet.sheet && StyleSheet.componentStyleSheet.sheet
    ? StyleSheet.rules()
        .map(rule => rule.cssText)
        .join('\n')
    : ''

const getCSS = () => {
  const style = isOverV2() ? getStyle() : getRules()

  return css.parse(style)
}

const getClassNames = () =>
  extract(/data-styled-components="([^"]*)"/g).split(/\s/)

const getComponentIDs = () =>
  extract(/sc-component-id: ([^\\*\\/]*) \*\//g).split(/\s/)

const getHashes = () =>
  isOverV2()
    ? getClassNames()
        .concat(getComponentIDs())
        .filter(Boolean)
    : []

module.exports = {
  resetStyleSheet,
  getCSS,
  getHashes,
}
