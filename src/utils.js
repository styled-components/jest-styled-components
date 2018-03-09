const css = require('css')
const { ServerStyleSheet, isStyledComponent } = require('styled-components')

let StyleSheet

/* eslint-disable */
if (!!isStyledComponent) {
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

const resetStyleSheet = () => StyleSheet.reset(isServer())

const getHTML = () =>
  isServer()
    ? new ServerStyleSheet().getStyleTags()
    : StyleSheet.instance.toHTML()

const extract = regex => {
  // Catches any rules that are wrapped in `()` and contains `:`
  // Most often found in @media queries
  const mediaRegex = /(\([a-z-]+:)([a-z0-9]+\))/g
  let style = ''
  let match
  let matches

  while ((matches = regex.exec(getHTML())) !== null) {
    match = `${matches[1]} `
    match = match.replace(mediaRegex, '$1 $2')
    style += match
  }

  return style.trim()
}

const getStyle = () => extract(/<style[^>]*>([^<]*)</g)

const getCSS = () => css.parse(getStyle())

const getClassNames = () =>
  extract(/data-styled-components="([^"]*)"/g).split(/\s/)

const getComponentIDs = () =>
  extract(/sc-component-id: ([^\\*\\/]*) \*\//g).split(/\s/)

const getHashes = () =>
  getClassNames()
    .concat(getComponentIDs())
    .filter(Boolean)

module.exports = {
  resetStyleSheet,
  getCSS,
  getHashes,
}
