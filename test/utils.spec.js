const { parseCSSfromHTML, getClassNames } = require('../src/utils')

describe('parseCSSfromHTML', () => {
  test('returns empty string when there is no style tag', () => {
    expect(parseCSSfromHTML(null)).toBe('')
  })

  test('returns the css from the style tag', () => {
    const css = '.a { color: red; }'
    const html = `<style>${css}</style>`

    expect(parseCSSfromHTML(html)).toBe(css)
  })

  test('returns the css when there are multiple style tags', () => {
    const css = '.a { color: red; }'
    const moreCss = '.b { color: green; }'
    const html = `<style>${css}</style><style>${moreCss}</style>`

    expect(parseCSSfromHTML(html)).toBe(`${css}${moreCss}`)
  })
})

describe('getClassNames', () => {
  test('produces a list of unique class names from a tree', () => {
    const tree = {
      props: { className: 'A' },
      children: [
        { props: { className: 'B' } },
        { props: { className: 'C D' } },
      ],
    }

    expect(getClassNames(tree)).toEqual(['A', 'B', 'C', 'D'])
  })
})
