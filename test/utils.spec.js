const { getHashes } = require('../src/utils')

jest.mock('styled-components/lib/models/StyleSheet', () => ({
  default: {
    instance: {
      toHTML() {
        return `
          <style data-styled-components="a">
            /* sc-component-id: sc-1 */
            .sc-1 {}
            .a { color: red; }
          </style>
          <style data-styled-components="b c">
            /* sc-component-id: sc-2 */
            .sc-2 {}
            .b { color: green; }
            .c { color: blue; }
          </style>
        `
      },
    },
  },
}))

test('extracts hashes', () => {
  expect(getHashes()).toEqual(['a', 'b', 'c', 'sc-1', 'sc-2'])
})
