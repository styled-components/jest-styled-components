const { getClassNames } = require('../src/utils')

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
