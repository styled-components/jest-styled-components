const { getClassNames } = require('../src/utils')

describe('getClassNames', () => {
  test('gets list of unique classes from a tree', () => {
    const tree = {
      props: {
        className: 'one'
      },
      children: [
        {
          props: { className: 'two' },
        },
        {
          props: { className: 'three' },
        }
      ]
    }

    const got = getClassNames(tree, []).sort()
    const expected = ['one', 'two', 'three'].sort()
    expect(got).toEqual(expected)
  })
})
