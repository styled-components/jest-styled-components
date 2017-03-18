const prettyFormat = require('pretty-format')
const reactTestPlugin = require('pretty-format/build/plugins/ReactTestComponent')
const styleSheet = require('styled-components/lib/models/StyleSheet')

const serializer = {

  test(val) {
    return val
  },

  print(val) {
    const styles = styleSheet.rules().map(rule => rule.cssText).join('\n')
    const components = prettyFormat(val, { plugins: [reactTestPlugin] })

    return `${styles}\n\n${components}`
  },

}

module.exports = serializer
