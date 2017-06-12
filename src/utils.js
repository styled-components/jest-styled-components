const { ServerStyleSheet } = require('styled-components')

const STYLE_TAGS_REGEXP = /<(\/)?style[^>]*>/g

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
    return new ServerStyleSheet().getStyleTags().replace(STYLE_TAGS_REGEXP, '')
  }
  if (overV2) {
    return styleSheet.default.instance.toHTML().replace(STYLE_TAGS_REGEXP, '')
  }
  return styleSheet.rules().map(rule => rule.cssText).join('\n')
}

module.exports.getCSS = getCSS
