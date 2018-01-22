const css = require('css')
const { ServerStyleSheet, isStyledComponent } = require('styled-components')

const isOverV3 = !!isStyledComponent
const isOverV2 = () => !!ServerStyleSheet

let StyleSheet

/* eslint-disable */
if (isOverV3) {
  const secretInternals = require('styled-components')
    .__DO_NOT_USE_OR_YOU_WILL_BE_HAUNTED_BY_SPOOKY_GHOSTS

  if (
    secretInternals === undefined ||
    secretInternals.StyleSheet === undefined
  ) {
    throw new Error(
      'Could neither find styled-components secret internals nor styled-components/lib/models/StyleSheet.js'
    )
  } else {
    StyleSheet = secretInternals.StyleSheet
  }
} else {
  StyleSheet = require('styled-components/lib/models/StyleSheet').default
}
/* eslint-enable */

const isServer = () => typeof document === 'undefined'

const resetStyleSheet = () => {
  if (isOverV2()) {
    StyleSheet.reset(isServer())
  }
}

const getHTML = () =>
  isServer()
    ? new ServerStyleSheet().getStyleTags()
    : StyleSheet.instance.toHTML()

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
  isOverV2,
  resetStyleSheet,
  getCSS,
  getHashes,
}
