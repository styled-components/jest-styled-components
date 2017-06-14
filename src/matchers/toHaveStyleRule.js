/* eslint-disable one-var, no-useless-escape, no-underscore-dangle, no-nested-ternary */
const {
  printReceived,
  printExpected,
} = require('jest-matcher-utils')
const styleSheet = require('styled-components/lib/models/StyleSheet')
const { getCSS } = require('../utils')

/**
 * Finds the generated class name from a rendered StyledComponent.
 * @param  {Object} received A rendered StyledComponent.
 * @return {String}          The generated class name.
 */
const findClassName = (received) => {
  let className = ''

  const component = received.component || received

  // constructor.name doesnt work in older versions of node
  if (component.$$typeof === Symbol.for('react.test.json')) {
    // react test renderer
    className = component.props.className
  } else if (received.node) {
    // enzyme
    const renderedComponent = received.node._reactInternalInstance._renderedComponent

    className = (renderedComponent._instance && renderedComponent._instance.state)
          ? renderedComponent._instance.state.generatedClassName
          : renderedComponent._currentElement.props.className
  }
  // styled components adds the className on the end.
  className = className.split(' ').pop()

  if (received.modifier) {
    className += received.modifier
  }
  return className
}

/**
 * Tests component to see if it has the correct value for a specific CSS rule.
 * @param  {Object} received      Rendered component in unit test.
 * @param  {String} selector      The CSS rule.
 * @param  {String|RegExp} value  The CSS value.
 * @return {Object}               Object for expect to pass or not pass.
 */
const toHaveStyleRule = (received, selector, value) => {
  try {
    const className = findClassName(received)
    const css = getCSS(styleSheet)
    const styles = new RegExp(`${className}[\\s]?{([^}]*)`, 'g').exec(css)
    const capture = new RegExp(`${selector}:[\\s]*([^;]+)`, 'g')

    if (styles && styles[1].match(capture)) {
      const values = styles[1].match(capture).map(r => r.replace(capture, '$1').trim())

      if (
          values &&
          values.some((v) => {
            if (value instanceof RegExp) {
              return v.match(value)
            }

            return v === value
          })
        ) {
        return { // Passed
          message: () => (`
            ${printExpected(`Expected component to have ${selector} matching ${value}`)}
          `),
          pass: true,
        }
      }
    }

    return { // Failed -- wrong value
      message: () => (`
        ${printExpected(`Expected ${className} to have ${selector} matching ${value}`)}\n
        ${printReceived(`But received, ${styles[1] || css}`)}
      `),
      pass: false,
    }
  } catch (e) {
    return { // Failed -- not rendered correctly
      message: () => (`
        ${printExpected(`Expected ${received} to be a component from react-test-renderer, or a mounted enzyme component.`)}\n
        ${printReceived(`But had an error, ${e}`)}
      `),
      pass: false,
    }
  }
}

module.exports = toHaveStyleRule
