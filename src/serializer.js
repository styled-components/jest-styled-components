const css = require('css')
const prettyFormat = require('pretty-format')
const reactTestPlugin = require('pretty-format/build/plugins/ReactTestComponent')
const styleSheet = require('styled-components/lib/models/StyleSheet')

const getStyles = (components) => {
  const styles = styleSheet.rules().map(rule => rule.cssText).join('\n')
  const ast = css.parse(styles)
  ast.stylesheet.rules = ast.stylesheet.rules.filter(rule => (
    components.indexOf(rule.selectors[0].substring(1)) > -1
  ))

  return css.stringify(ast)
}

const serializer = {

  test(val) {
    return val
  },

  print(val) {
    const components = prettyFormat(val, { plugins: [reactTestPlugin] })
    const styles = getStyles(components)

    return `${styles}\n\n${components}`
  },

}

module.exports = serializer
