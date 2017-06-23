const { parseCSSfromHTML, getClassNames } = require('../src/utils')

describe('parseCSSfromHTML', () => {
  test('returns empty string when there is no style tag', () => {
    expect(parseCSSfromHTML('<html></html>')).toBe('')
  })

  test('returns the css from the style tag', () => {
    const css = `.something { color: red; }`
    const html = `<style type="text/css"
      data-styled-components="iATjrR bIftVI"
      data-styled-components-is-local="true"
    >
      ${css}
    </style>`

    expect(parseCSSfromHTML(html)).toBe(css)
  })

  test('returns the css when there are multiple style tags', () => {
    const css = `.something { color: red; }`
    const otherCss = `.other-thing { color: pink; }`
    expect(parseCSSfromHTML(`<style>${css}</style><style>${otherCss}</style>`))
      .toBe(css + otherCss)
  })
})

describe('getClassNames', () => {
  test('produces a list of unique class names from a tree', () => {
    const tree = {
      props: { className: 'A' },
      children: [
        { props: { className: 'B' } },
        { props: { className: 'C' } }
      ]
    }

    expect(getClassNames(tree).sort()).toEqual(['A', 'B', 'C'])
  })
})
