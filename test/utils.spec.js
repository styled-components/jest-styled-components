const { getStyle } = require('../src/utils')

describe('getStyle', () => {
  test('returns empty string when there is no style tag', () => {
    expect(getStyle(null)).toBe('')
  })

  test('returns the css from the style tag', () => {
    const css = '.a { color: red; }'
    const html = `<style>${css}</style>`

    expect(getStyle(html)).toBe(css)
  })

  test('returns the css when there are multiple style tags', () => {
    const css = '.a { color: red; }'
    const moreCss = '.b { color: green; }'
    const html = `<style>${css}</style><style>${moreCss}</style>`

    expect(getStyle(html)).toBe(`${css}${moreCss}`)
  })
})
